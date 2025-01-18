from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import requests
import os

from dotenv import load_dotenv
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow requests from the frontend

# Connect to MongoDB
client = MongoClient("mongodb+srv://zivavraham76:DM7m4lcN2h4zr5h5@cluster0.mp7ie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["fallen"]  # Database name
collection = db["fallen_details"]  # Collection name

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
    # Convert _id to string for all documents
    fallens = [convert_objectid_to_string(fallen) for fallen in fallens]
    return jsonify(fallens)

# Get a specific fallen by ID
@app.route('/fallens/<string:id>', methods=['GET'])
def get_fallen_by_id(id):
    try:
        # Find the document by _id
        from bson import ObjectId
        fallen = collection.find_one({"_id": ObjectId(id)})
        if fallen:
            fallen = convert_objectid_to_string(fallen)  # Convert _id to string
            return jsonify(fallen)
        return jsonify({"error": "Fallen not found"}), 404
    except Exception as e:
        return jsonify({"error": "Invalid ID format", "details": str(e)}), 400

# Add a new fallen
@app.route('/fallens', methods=['POST'])
def add_fallen():
    data = request.get_json()
    # Insert the new document and get the inserted_id
    result = collection.insert_one(data)
    data["_id"] = str(result.inserted_id)  # Include the inserted _id as a string
    return jsonify(data)

# Edit a fallen by ID
@app.route('/fallens/<string:id>', methods=['PUT'])
def edit_fallen_by_id(id):
    try:
        from bson import ObjectId
        data = request.get_json()  # Get the JSON payload from the request
        updated_fallen = collection.find_one_and_update(
            {"_id": ObjectId(id)},  # Find the document by _id
            {"$set": data},  # Update the document with the provided data
            return_document=True  # Return the updated document
        )
        if updated_fallen:
            updated_fallen = convert_objectid_to_string(updated_fallen)  # Convert _id to string
            return jsonify(updated_fallen)
        else:
            return jsonify({"error": "Fallen not found"}), 404
    except Exception as e:
        return jsonify({"error": "Invalid ID format", "details": str(e)}), 400

# Get quote
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
