import openai
from const import *
# from extract_struct import *
import PyPDF2 as pdf
from TBNode import TBNode
import json

openai.api_key = my_sk

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

def prompt_for_sectiontext(section, text):
    return """Print only the text for {} from the following text:
    {}
    Leave all LaTeX representations in their raw format
    """.format(section, text)

def build_tree_from_json(json_data, text):
    # Root node initialization
    root = TBNode('root', None)
    
    def create_node(data, parent_node):
        """ Recursively create a tree structure. """
        # Create intermediate node
        if 'title' in data and 'sections' not in data:
            # Leaf node with content
            node = TBNode(data['title'], request(prompt_for_sectiontext(data['title'], text)))
        else:
            # Intermediate node
            node = TBNode(data['title'], None)
        
        # If it has sections (children), recursively create their nodes
        if 'sections' in data:
            for section in data['sections']:
                child_node = create_node(section, node)
                node.children.append(child_node)
        
        # Add chapters if present (acts as another hierarchy level)
        if 'chapters' in data:
            for chapter in data['chapters']:
                child_node = create_node(chapter, node)
                node.children.append(child_node)
        
        return node
    
    # Assuming the JSON data contains 'Contents' as the starting point
    for content in json_data['Contents']:
        child_node = create_node(content, root)
        root.children.append(child_node)
    
    return root

def print_tree(node, level=0):
    print("  " * level + f"Node: {node.name}, Content: {node.content}")
    for child in node.children:
        print_tree(child, level + 1)

def main(filepath):
    # Extract text from PDF
    text = extract_text_from_pdf(filepath)
    with open('parse.txt', 'w') as f:
        f.write(text)

    # Extract JSON hierarchy
    # get_hierarchy_structure('uploaded_files/vmls.pdf')

    # Generate tree
    with open('hierarchy_structure.json', 'r') as f:
        data = json.load(f)
        print(type(data))
    
    tb = build_tree_from_json(data, text)
    
    tree_as_dict = tb.to_dict()

    # Serialize the dictionary to JSON
    with open('tree_structure.json', 'w') as json_file:
        json.dump(tree_as_dict, json_file, indent=4)