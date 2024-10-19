from openai import OpenAI

client = OpenAI(api_key=my_sk)
from const import *
# from extract_struct import *
import PyPDF2 as pdf
from TBNode import TBNode
import json


def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = pdf.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
    return text

def request(prompt):
    response = client.chat.completions.create(model="gpt-4o",  # You can also use "gpt-4" if available
    messages=[
        {"role": "system", "content": "You are a helpful assistant."}, # this will change with time according to chat history
        {"role": "user", "content": prompt}
    ],
    max_tokens=1500,
    temperature=0.5)

    return response.choices[0].message.content.strip()

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
def build_tree_from_json(json_data, text):
    root = TBNode('root', None)
    contents = json_data['Contents'] if 'Contents' in json_data else []

    for item in contents:
        # Parsing the top-level items like parts or chapters
        part_node = parse_json_to_tree(item, text)
        root.add_child(part_node)

    return root

def print_tree(node, level=0):
    print("  " * level + f"Node: {node.name}, Content: {node.content}")
    for child in node.children:
        print_tree(child, level + 1)

if __name__ == "__main__":
    # Extract text from PDF
    text = extract_text_from_pdf("uploaded_files/vmls.pdf")
    with open('parse.txt', 'w') as f:
        f.write(text)

    # Extract JSON hierarchy
    # get_hierarchy_structure('uploaded_files/vmls.pdf')

    # Generate tree
    with open('hierarchy_structure.json', 'r') as f:
        data = json.loads(json.load(f))
        print(type(data))

    tb = build_tree_from_json(data, text[:len(text)//3])

    print_tree(tb)