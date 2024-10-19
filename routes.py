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
    chapter = request.args.get('chapter')
    page_type = request.args.get('type')

    if not chapter or not page_type:
        return jsonify({"error": "Missing chapter or page type"}), 400
    
    content = "Here is an equation: $E=mc^2$ in inline mode.\nAnd here it is displayed:\n$$E=mc^2$$"

    if page_type == "summary":
        pass
    elif page_type == "activity":
        pass
    elif page_type == "quiz":
        pass
    else:
        print("Oh no!")
    return jsonify({"content": content})

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
    print("Hello")
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
        print(dict(json_data))
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

@main.route('/api/summary', methods=['GET'])
def get_summary():
    chapter = request.args.get('chapter')
    section = request.args.get('section')

    if not chapter or not section:
        return jsonify({"error": "Invalid chapter or section ID"}), 400

    tree_data = json.load("tree_structure.json")

    # Fetch the summary from the mock tree data
    chapter_data = tree_data.get(f'Chapter {chapter}')
    if not chapter_data:
        return jsonify({"error": "Chapter not found"}), 404

    section_summary = chapter_data.get(f'Section {section}')
    if not section_summary:
        return jsonify({"error": "Section not found"}), 404

    return jsonify({"summary": section_summary})

def get_indexes(chapter, section):
    if not os.path.exists(JSON_FILE_PATH):
        return jsonify({'error': 'File not found'}), 404

    try:
        with open(JSON_FILE_PATH, 'r') as f:
            json_data = json.load(f)
        return jsonify(json_data), 200
    except Exception as e:
        return jsonify({'error': f'Error reading file: {str(e)}'}), 500