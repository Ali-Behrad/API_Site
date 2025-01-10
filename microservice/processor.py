from flask import Flask, request, send_file
from flask_cors import CORS
from io import BytesIO
from PIL import Image
import numpy as np
from main_processor import *

app = Flask(__name__)

CORS(app, resources={
    r"/process": {
        "origins": "http://localhost:4000"
    }
})

@app.route("/process", methods=["POST"])
def process():
    if 'file' not in request.files:
        print("No file")
        return {"error": "No file part in the request"}, 400
    
    if not request.form["color"]:
        print("No color")
        return {"error" : "Could'nt get the color"}, 400

    file = request.files["file"]
    color = request.form["color"]
    color_tuple = (color.split("-")[2], color.split("-")[1], color.split("-")[0])

    try:
        # image = Image.open(file.stream)

        # Processing Logic
        processed_image_buffer = main(buffer=BytesIO(file.read()), color=color_tuple)

        return send_file(processed_image_buffer, mimetype='image/png')
    except Exception as e:
        print(e)
        return {"error": f"Image processing failed: {str(e)}"}, 500

if __name__ == '__main__':
    app.run(host='localhost', port=5000)