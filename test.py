import openai
from const import *
import PyPDF2 as pdf
from TBNode import TBNode
import json

openai.api_key = my_sk
pstart, pend = 13, 15
section = "topic 1"

def extract_pages(input_pdf, output_pdf, start_page, end_page):
    # Open the input PDF file
    with open(input_pdf, 'rb') as infile:
        reader = pdf.PdfReader(infile)
        writer = pdf.PdfWriter()

        # Ensure page indices are within valid range
        total_pages = len(reader.pages)
        if start_page < 0 or end_page >= total_pages or start_page > end_page:
            raise ValueError(f"Invalid page range: {start_page} to {end_page}")

        # Extract pages from start_page to end_page
        for page_num in range(start_page, end_page + 1):
            page = reader.pages[page_num]
            writer.add_page(page)

        # Write the extracted pages to a new output PDF
        with open(output_pdf, 'wb') as outfile:
            writer.write(outfile)

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = pdf.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
    return text

def request(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4o",  # You can also use "gpt-4" if available
        messages=[
            {"role": "system", "content": "You are a helpful assistant."}, # this will change with time according to chat history
            {"role": "user", "content": prompt}
        ],
        max_tokens=1500,
        temperature=0.5
    )

    return response['choices'][0]['message']['content'].strip()

def to_string(root):
    if len(root.children) == 0: return root.content
    for c in root.children:
        print(to_string(c))

def prompt_for_sectiontext(section, text):
    return """Print only the text for {} from the following text:
    {}
    Leave all LaTeX representations in their raw format
    """.format(section, text)

def parse_json_to_tree(data, parent_text):
    # Create a TBNode for the current item
    name = data['title'] if 'title' in data else 'root'  # Use title if available, else 'root'
    content = None

    # If it has sections, it's a label node (chapter/section), not a content node
    node = TBNode(name, content)

    # Recursively process subsections if available
    if 'sections' in data:
        for section in data['sections']:
            child_node = parse_json_to_tree(section, parent_text)  # Pass parent's text
            node.add_child(child_node)
    elif 'subsections' in data:  # Handling subsections (if present)
        for subsection in data['subsections']:
            child_node = parse_json_to_tree(subsection, parent_text)
            node.add_child(child_node)
    else:
        # This is a leaf node (bottom-most node)
        section_text = request(prompt_for_sectiontext(data['title'], parent_text))
        node.content = section_text

    return node

# Example usage with your JSON data
def build_tree_from_json(json_data):
    root = TBNode('root', None)
    contents = json_data['Contents'] if 'Contents' in json_data else []
    
    for item in contents:
        # Parsing the top-level items like parts or chapters
        part_node = parse_json_to_tree(item, "parent text placeholder")
        root.add_child(part_node)
    
    return root

def print_tree(node, level=0):
        print("  " * level + f"Node: {node.name}, Content: {node.content}")
        for child in node.children:
            print_tree(child, level + 1)

if __name__ == "__main__":
    # Extract text from stated pages
    extract_pages("uploaded_files/vmls.pdf", "reduced_files/cut.pdf", start_page=pstart, end_page=pend)
    t = extract_text_from_pdf("reduced_files/cut.pdf")

    # # Extract only text from topic
    
    with open('hierarchy_structure.json', 'r') as f:
        data = json.loads(json.load(f))
        print(type(data))
    
    tb = build_tree_from_json(data)
    
    