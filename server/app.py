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
client = MongoClient("mongodb://localhost:27017/")  # For local MongoDB
db = client["fallenHeroes"]  # Database name
collection = db["fallens"]  # Collection name

# Get all fallens
@app.route('/fallens', methods=['GET'])
def get_fallens():
    fallens = list(collection.find({}, {'_id': 0}))  # Exclude MongoDB's _id
    return jsonify(fallens)


# Get a specific fallen by ID
@app.route('/fallens/<int:id>', methods=['GET'])
def get_fallen_by_id(id):
    fallen = collection.find_one({"id": id}, {"_id": 0})  # Find by ID and exclude _id
    if fallen:
        return jsonify(fallen)
    return jsonify({"error": "Fallen not found"}), 404


# Add a new fallen
@app.route('/fallens', methods=['POST'])
def add_fallen():
    data = request.get_json()
    collection.insert_one(data)
    return jsonify({key: data[key] for key in data if key != '_id'})  # Exclude _id

# Edit a fallen by ID
@app.route('/fallens/<int:id>', methods=['PUT'])
def edit_fallen_by_id(id):
    data = request.get_json()  # Get the JSON payload from the request
    updated_fallen = collection.find_one_and_update(
        {"id": id},  # Find the document by ID
        {"$set": data},  # Update the document with the provided data
        return_document=True  # Return the updated document
    )

    if updated_fallen:
        updated_fallen.pop("_id", None)  # Remove MongoDB's _id before returning
        return jsonify(updated_fallen)
    else:
        return jsonify({"error": "Fallen not found"}), 404

#get quote
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

    
