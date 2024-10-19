from flask import Flask
from flask_cors import CORS  # Import CORS
from app.routes import main  # Import your blueprint (if using one)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.register_blueprint(main)

if __name__ == "__main__":
    app.run(debug=True)