from flask import Flask
from flask_cors import CORS
from routes import main  # Adjust this import based on your project structure

app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app)

# Register blueprints
app.register_blueprint(main)

# @app.after_request
# def add_cors_headers(response):
#     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
#     return response

if __name__ == "__main__":
    app.run(debug=True)
