from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import os
from bson import ObjectId
from werkzeug.utils import secure_filename
import requests
from flask import send_from_directory
import cloudinary
import cloudinary.uploader
import cloudinary.api


from dotenv import load_dotenv
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)
print("zivvv")
print("Cloudinary Cloud Name:", os.getenv('CLOUDINARY_CLOUD_NAME'))
print("Cloudinary API Key:", os.getenv('CLOUDINARY_API_KEY'))
print("Cloudinary API Secret:", os.getenv('CLOUDINARY_API_SECRET'))
# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)


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

        # Upload the image to Cloudinary
        result = cloudinary.uploader.upload(file, folder="Home")
        img_url = result.get('secure_url')

        # Prepare the document to insert into MongoDB
        fallen = {
            "name": name,
            "location": location,
            "date": date,
            "story": story,
            "img": img_url  # Store the Cloudinary image URL
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
        if not ObjectId.is_valid(id):
            return jsonify({"error": "Invalid ID format"}), 400

        # Initialize an empty dictionary for update data
        update_data = {}

        # Check for JSON data in the request
        if request.is_json:
            data = request.get_json()
            for key in ['name', 'location', 'date', 'story']:
                if key in data:
                    update_data[key] = data[key]
        
        # Handle the uploaded file
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "Image file is required"}), 400

        # Upload the image to Cloudinary
        result = cloudinary.uploader.upload(file, folder="Home")
        img_url = result.get('secure_url')

        update_data['img'] = img_url
        
        # Perform the update in MongoDB
        updated_fallen = collection.find_one_and_update(
            {"_id": ObjectId(id)},  # Find by ID
            {"$set": update_data},  # Set the updated fields
            return_document=True  # Return the updated document
        )

        if updated_fallen:
            updated_fallen = convert_objectid_to_string(updated_fallen)
            return jsonify(updated_fallen), 200
        else:
            return jsonify({"error": "Fallen not found"}), 404

    except Exception as e:
        print(f"[ERROR] An error occurred: {e}")
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

# Define allowed extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if the uploaded file has a valid extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploadimage', methods=['POST'])
def upload_image():
    try:
        # Check if the file is in the request
        if 'file' not in request.files:
            return jsonify({"ok": False, "error": "No image file provided"}), 400

        file = request.files['file']
        if not file or file.filename == '':
            return jsonify({"ok": False, "error": "No file found in the request"}), 400

        print(f"[DEBUG] Received file: {file.filename}")
        print(f"[DEBUG] File content type: {file.mimetype}")

        # Validate file extension
        if not allowed_file(file.filename):
            return jsonify({"ok": False, "error": "Invalid file type or missing extension. Allowed types: png, jpg, jpeg, gif"}), 400

        # Verify the file format
        try:
            img = Image.open(file)
            img.verify()  # Verify the image format
            img = Image.open(file)  # Reopen for further processing
            img_format = img.format.lower()  # Get the actual format
            print(f"[DEBUG] Verified file format: {img_format}")
        except Exception as e:
            print(f"[ERROR] Image verification failed: {e}")
            return jsonify({"ok": False, "error": f"Invalid or corrupted image file: {e}"}), 400

        # Dynamically handle missing or incorrect extensions
        if '.' not in file.filename:
            file.filename = f"uploaded_image.{img_format}"
            print(f"[DEBUG] Added extension to file: {file.filename}")

        # Save the resized image to a buffer
        buffer = BytesIO()
        try:
            img.save(buffer, format=img.format)  # Preserve the image format
            buffer.seek(0)
            print("[DEBUG] Image saved to buffer successfully.")
        except Exception as e:
            print(f"[ERROR] Failed to save image to buffer: {e}")
            return jsonify({"ok": False, "error": f"Failed to process image: {e}"}), 500

        # Upload the image to Cloudinary
        try:
            result = cloudinary.uploader.upload(
                buffer,
                resource_type="image",  # Specify it's an image
                folder="Home"  # Upload to the "Home" folder in Cloudinary
            )
            print(f"[DEBUG] Image uploaded to Cloudinary. URL: {result['secure_url']}")
        except Exception as upload_error:
            print(f"[ERROR] Cloudinary upload error: {upload_error}")
            return jsonify({"ok": False, "error": f"Cloudinary upload failed: {upload_error}"}), 500

        # Return the URL of the uploaded image
        return jsonify({"ok": True, "imageUrl": result['secure_url'], "message": "Image uploaded successfully"}), 200

    except Exception as e:
        print(f"[ERROR] General error during image upload: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500

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
    app.run(debug=True, port=5001)
