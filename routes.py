from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import os

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
        print("Yello")
    elif page_type == "activity":
        print("Bello")
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
        filepath = os.path.join(main.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        return jsonify({'message': 'File uploaded successfully!'}), 200
    else:
        return jsonify({'error': 'File is not a PDF'}), 400
    
