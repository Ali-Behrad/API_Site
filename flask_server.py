from flask import Flask, request, jsonify, session, send_file
from main_processor import *
import numpy as np
import base64
from flask_cors import CORS
import redis

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:4000"],  # Specific frontend origin
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Cookie"]
    }
}, supports_credentials=True) 

CORS(app)

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def process_color(color_str: str):
    color_list = color_str.split("-")

    return (color_list[2], color_list[1], color_list[0])

# TODO: Implement the Authentication and two-server system
@app.route('/predict', methods=['POST'])
def predict():
    try:
        cookie = request.form.get("cookie")
        color = request.form.get("color")
        imageName: str = request.form.get("imageName")

        if not redis_client.exists(f"user:{cookie}"):
            return jsonify({"error" : "Invalid Cookie"}), 403
        
        input_path = redis_client.hget(f"user:{cookie}", "input_path")
        output_path = redis_client.hget(f"user:{cookie}", "output_path")

        input_image_path = input_path + f"/{imageName}"
        output_name = imageName.rsplit(".", 1)[0] + "_output." + imageName.rsplit(".", 1)[1]
        output_image_path = output_path + f"/{output_name}"

        print(output_image_path)

        try:
            main(input_image_path, output_image_path, process_color(color))
        except Exception as e:
            print(str(e))
            return jsonify({"error": "Failed to process the image"}), 403

        try:
            redis_client.hset(f"user:{cookie}", "output_name", output_name)
        except Exception as e:
            print(str(e))
            return jsonify({'error': "Redis column update failed!"}), 500
        
        return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)