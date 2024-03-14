import io
import ocr
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/scan', methods=['POST'])
def scan_image():
    # Check if the request contains binary data
    if not request.data:
        return jsonify({'error': 'No image data found'}), 400

    image_data = request.data

    try:
        # Create a PIL Image object from the binary data
        image = Image.open(io.BytesIO(image_data))

        # response = ocr.call_model(image)

        return jsonify({
            "items": [
                {"id": 1, "name": "Chai Latte Tee", "amount": 1, "price": 4.50, "totalPrice": 4.50},
                {"id": 2, "name": "Schokolade mit Sahne", "amount": 1, "price": 3.90, "totalPrice": 3.90},
                {"id": 3, "name": "Fruhstuck", "amount": 2, "price": 15.40, "totalPrice": 30.80},
            ],
        }), 200
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()