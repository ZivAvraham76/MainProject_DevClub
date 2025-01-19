from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from bson import ObjectId
from werkzeug.utils import secure_filename
import requests
from flask import send_from_directory

from dotenv import load_dotenv
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Upload folder configuration
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/uploads/<filename>', methods=['GET'])
def serve_file(filename):
    """
    UPLOAD_FOLDER
    """
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Connect to MongoDB
client = MongoClient("mongodb+srv://zivavraham76:DM7m4lcN2h4zr5h5@cluster0.mp7ie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["fallen"]
collection = db["fallen_details"]

# Helper function to convert _id to string
def convert_objectid_to_string(doc):
    """Convert _id in MongoDB document to string."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# Get all fallens
@app.route('/fallens', methods=['GET'])
def get_fallens():
    fallens = list(collection.find({}))
    fallens = [convert_objectid_to_string(fallen) for fallen in fallens]
    return jsonify(fallens)

# Get a specific fallen by ID
@app.route('/fallens/<string:id>', methods=['GET'])
def get_fallen_by_id(id):
    try:
        fallen = collection.find_one({"_id": ObjectId(id)})
        if fallen:
            fallen = convert_objectid_to_string(fallen)
            return jsonify(fallen)
        return jsonify({"error": "Fallen not found"}), 404
    except Exception as e:
        return jsonify({"error": "Invalid ID format", "details": str(e)}), 400

# Ensure the upload folder exists
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Add a new fallen
@app.route('/fallens', methods=['POST'])
def add_fallen():
    try:
        # Get form data
        name = request.form.get('name')
        location = request.form.get('location')
        date = request.form.get('date')
        story = request.form.get('story')

        # Validate the form data
        if not all([name, location, date, story]):
            return jsonify({"error": "All fields are required"}), 400

        # Handle the uploaded file
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "Image file is required"}), 400

        # Save the uploaded file securely
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Prepare the document to insert into MongoDB
        fallen = {
            "name": name,
            "location": location,
            "date": date,
            "story": story,
            "img": f"/uploads/{filename}"  # Store the relative path to the file
        }

        # Insert the document into MongoDB
        result = collection.insert_one(fallen)
        fallen["_id"] = str(result.inserted_id)  # Convert ObjectId to string

        return jsonify(fallen), 201

    except Exception as e:
        return jsonify({"error": "Failed to add fallen", "details": str(e)}), 500

# Edit a fallen by ID
@app.route('/fallens/<string:id>', methods=['PUT'])
def edit_fallen_by_id(id):
    try:
        from bson import ObjectId
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid ID format"}), 400

        data = request.get_json()

        # Remove the `_id` field from the data if it exists
        if "_id" in data:
            data.pop("_id")

        updated_fallen = collection.find_one_and_update(
            {"_id": ObjectId(id)},  # Find the document by _id
            {"$set": data},  # Update with the provided data
            return_document=True  # Return the updated document
        )

        if updated_fallen:
            updated_fallen = convert_objectid_to_string(updated_fallen)
            return jsonify(updated_fallen), 200
        else:
            return jsonify({"error": "Fallen not found"}), 404
    except Exception as e:
        return jsonify({"error": "An error occurred", "details": str(e)}), 500


# Get a quote
@app.route('/api/quote', methods=['GET'])
def get_quote():
    try:
        # Fetch the API key from environment variables
        api_key = os.getenv('NINJA_API_KEY')
        headers = {"X-Api-Key": api_key}
        
        # Make the API request
        response = requests.get("https://api.api-ninjas.com/v1/quotes", headers=headers)
        response.raise_for_status()  # Raise an error for HTTP status codes >= 400

        data = response.json()

        if len(data) > 0:
            return jsonify(data[0])  # Return the first quote
        else:
            return jsonify({"error": "No quotes found"}), 404

    except requests.exceptions.RequestException as e:
        print(f"Error fetching quote: {e}")
        return jsonify({"error": "Failed to fetch quote"}), 500

if __name__ == '__main__':
    app.run(debug=True)
