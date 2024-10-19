from openai import OpenAI

client = OpenAI()
import fitz
import json

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_path):
    # Open the PDF file
    doc = fitz.open(pdf_path)
    text = ""

    # Extract text from each page
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text("text")

    return text

# Function to get hierarchical structure using GPT-4
def get_hierarchy_structure(pdf_path):
    extracted_text = extract_text_from_pdf(pdf_path)

    prompt = f"Given the following textbook content, extract the structure of sections and subsections, providing a hierarchical representation as a JSON format (do not include '\n' anywhere). Textbook content: {extracted_text[:len(extracted_text)//10]}"

    # Call the OpenAI API (new version)
    response = client.chat.completions.create(model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ],
    response_format={
"type": "json_object",
    })

    # Extract the hierarchical JSON response
    structured_data = response.choices[0].message.content

    with open("hierarchy_structure.json", "w") as json_file:
        json.dump(structured_data, json_file, indent=4)
