from flask import Blueprint, jsonify, request

main = Blueprint('main', __name__)

@main.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    response_message = f"You said: {user_message}. This is a placeholder response from the backend."
    
    return jsonify({"message": response_message})
