from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from transformers import pipeline
import io
import ocr

app = Flask(__name__)
CORS(app)

pipe = pipeline("image-to-text", model="selvakumarcts/sk_invoice_receipts", device="mps")

@app.route('/scan', methods=['POST'])
def scan_image():
    # Check if the request contains binary data
    if not request.data:
        return jsonify({'error': 'No image data found'}), 400

    image_data = request.data

    try:

        # Create a PIL Image object from the binary data
        image = Image.open(io.BytesIO(image_data))

        response = ocr.call_model(image, pipe)

        return jsonify(response), 200
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()