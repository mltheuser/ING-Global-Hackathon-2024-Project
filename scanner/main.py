from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

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

        # Display the image
        image.show()

        response = {
            'message': 'Image received and displayed successfully',
            'format': image.format,
            'size': image.size,
            'receipt': [
                {'name': "HTMX", "amount": 9001, "price": 0.0}
            ]
        }

        return jsonify(response), 200
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()