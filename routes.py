from flask import Blueprint, json, jsonify, request
from flask_cors import cross_origin
import os
import tree_gen_final

main = Blueprint('main', __name__)


@main.route('/api/chat', methods=['POST'])
@cross_origin()
def chat():
    data = request.json
    user_message = data.get('message', '')
    response_message = f"You said: {user_message}. This is a placeholder response from the backend."
    return jsonify({"message": response_message})

@main.route('/api/page', methods=['GET'])
@cross_origin()
def get_page():
    try:
        # Get the chapter and section numbers as integers from the query parameters
        chapter_num = request.args.get('chapter')
        section_num = request.args.get('section')

        if chapter_num is None or section_num is None:
            return jsonify({"error": "Missing chapter or section number"}), 400

        # Convert the chapter and section numbers to integers for indexing
        try:
            chapter_index = int(chapter_num)  # Convert to 0-based index
            section_index = int(section_num)  # Convert to 0-based index
        except ValueError:
            return jsonify({"error": "Invalid chapter or section number"}), 400

        # Load the content tree (actual content)
        try:
            with open("tree_structure.json", "r") as f:
                content_tree = json.load(f)
        except FileNotFoundError:
            return jsonify({"error": "tree_structure.json file not found"}), 500
        except json.JSONDecodeError:
            return jsonify({"error": "Error decoding JSON file"}), 500

        # Debug: Print the tree structure
        # print("Loaded tree structure:", content_tree)

        # Ensure we have valid chapter and section indices

        for chapter_content in content_tree["children"][1]["children"]:
            print(chapter_content)
            if f"Chapter {chapter_index}" in chapter_content["name"]:
                for section_content in chapter_content["children"]:
                    if f"{chapter_index}.{section_index}" in section_content["name"]:
                        content = section_content.get("content", "No content available")

        # Debug: Print the retrieved content
        print(f"Returning content: {content}")

        return jsonify({"content": content})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@main.route('/api/quiz', methods=['GET'])
def get_quiz():
    chapter = request.args.get('chapter')
    if not chapter:
        return jsonify({"error": "Missing chapter parameter"}), 400

    # Example questions
    questions = [
    {
        "id": 1,
        "type": "multiple_choice",
        "prompt": "What is the derivative of $x^2$?",
        "options": [
            { "id": "a", "text": "$2x$", "isCorrect": True },
            { "id": "b", "text": "$x$", "isCorrect": False },
            { "id": "c", "text": "$x^2$", "isCorrect": False },
            { "id": "d", "text": "$2$", "isCorrect": False },
        ],
    },
    {
        "id": 2,
        "type": "multiple_select",
        "prompt": "Select all prime numbers less than 6.",
        "options": [
            { "id": "a", "text": "2", "isCorrect": True },
            { "id": "b", "text": "3", "isCorrect": True },
            { "id": "c", "text": "4", "isCorrect": False },
            { "id": "d", "text": "5", "isCorrect": True },
        ],
    },
    {
        "id": 3,
        "type": "free_response",
        "prompt": "Solve for $x$: $2x + 3 = 7$",
        "answer": "2",
    },
]



    return jsonify({"questions": questions})


@main.route('/api/submit_quiz', methods=['POST'])
def submit_quiz():

    data = request.json
    user_responses = data.get('responses')
    feedback = []

    # Logic to generate feedback based on the user's responses
    # This is just an example, replace with your actual logic
    for question_id, response in user_responses.items():
        if question_id == '1':
            feedback.append({
                'question_id': 1,
                'correct': response == 'a',
                'message': 'The correct answer is 2x because the derivative of x^2 is 2x.'
            })
        elif question_id == '2':
            correct_answers = ['a', 'b', 'd']
            is_correct = set(response) == set(correct_answers)
            feedback.append({
                'question_id': 2,
                'correct': is_correct,
                'message': 'The correct answers are 2, 3, and 5.'
            })
        elif question_id == '3':
            correct_answer = '2'
            is_correct = response == correct_answer
            feedback.append({
                'question_id': 3,
                'correct': is_correct,
                'message': f'The correct answer is {correct_answer}.'
            })

    return jsonify({'feedback': feedback})

@main.route('/api/upload_pdf', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['pdf']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.pdf'):
        filepath = os.path.join('uploads/textbook.pdf')
        file.save(filepath)
        return jsonify({'message': 'File uploaded successfully!'}), 200
    else:
        return jsonify({'error': 'File is not a PDF'}), 400

JSON_FILE_PATH = 'hierarchy_structure.json'

@main.route('/api/get_json', methods=['GET'])
def get_json():
    # Ensure the file exists
    if not os.path.exists(JSON_FILE_PATH):
        return jsonify({'error': 'File not found'}), 404

    # Read the JSON file and return its contents
    try:
        with open(JSON_FILE_PATH, 'r') as f:
            json_data = json.load(f)
        return jsonify(json_data), 200
    except Exception as e:
        return jsonify({'error': f'Error reading file: {str(e)}'}), 500
    
@main.route('/api/process_pdf', methods=['POST'])
def process_pdf():
    # Simulate PDF processing or call your actual logic here
    # For example: process the uploaded PDF
    # You can perform some actual PDF processing logic here and return a response when done.
    print("Processing PDF...")

    # Simulating a long-running task
    tree_gen_final.main(filepath="uploads/textbook.pdf")

    return jsonify({"message": "Processing completed", "next_page": "/chapter/1/section/1"})
