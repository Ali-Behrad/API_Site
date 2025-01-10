import cv2
import numpy as np
import os
import tensorflow as tf
from keras.layers import Input, Conv2D, MaxPooling2D, UpSampling2D, Concatenate
from keras.models import Model, load_model
from keras.optimizers import Adam
import mediapipe as mp
from io import BytesIO

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, min_detection_confidence=0.1)

def crop_lips(image):
    results = face_mesh.process(image)

    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0]
        lip_corners = [face_landmarks.landmark[i] for i in [61, 291, 0, 17]]  
        height, width, _ = image.shape
        lip_points = [(int(p.x * width), int(p.y * height)) for p in lip_corners]

        x, y, w, h = cv2.boundingRect(np.array([p for p in lip_points]))
    else:
        return None, None, None, None, None, None, None

    x_min = max(x - int(0.3*w), 0)
    y_min = max(y - int(0.3*h), 0)
    x_max = min(x + w + int(0.2*w), image.shape[1])
    y_max = min(y + h + int(0.2*h), image.shape[0])

    cropped_lips = image[y_min:y_max, x_min:x_max]
    height, width = cropped_lips.shape[:2]

    return cropped_lips, height, width, x_min, y_min, x_max, y_max

def preprocess_image(image):
    image = cv2.resize(image,(128,128))
    image = image / 255.0
    image = np.expand_dims(image, axis=0)

    return image

def postprocess_output(output):
    output = (output[0, :, :, 0] > 0.5).astype(np.uint8) * 255  
    return output

def apply_lipstick(original_image, mask, lips, color, yMin, yMax, xMin, xMax):
    canvas = np.copy(lips)
    canvas[mask == 255] = color
    canvas = cv2.GaussianBlur(canvas, (5,5), 0)
    blended_lips = cv2.addWeighted( lips, 0.4, canvas, 0.6, 0)
    gray_mask = cv2.cvtColor(lips, cv2.COLOR_BGR2GRAY)
    backup_image = cv2.addWeighted(lips , 0.5, canvas, 0.5, 0)
    backup_image_1 = cv2.addWeighted(lips , 0.6, canvas, 0.4, 0)
    backup_image_2 = cv2.addWeighted(lips , 0.7, canvas, 0.3, 0)
    backup_image_3 = cv2.addWeighted(lips , 0.8, canvas, 0.2, 0)
    backup_image_4 = cv2.addWeighted(lips , 0.9, canvas, 0.1, 0)
    blended_lips = np.where(gray_mask[:, :,np.newaxis]<100, backup_image, blended_lips)
    blended_lips = np.where(gray_mask[:, :,np.newaxis]<80, backup_image_1, blended_lips)
    blended_lips = np.where(gray_mask[:, :,np.newaxis]<60, backup_image_2, blended_lips)
    blended_lips = np.where(gray_mask[:, :,np.newaxis]<40, backup_image_3, blended_lips)
    blended_lips = np.where(gray_mask[:, :,np.newaxis]<20, backup_image_4, blended_lips)
    processed_image = np.copy(original_image)
    processed_image[yMin: yMax, xMin: xMax] = blended_lips

    return processed_image

model = load_model('./Stellens_Lip_Detector_final.keras')

def main(buffer: BytesIO, color: tuple) -> BytesIO:
    np_img = np.frombuffer(buffer.read(), np.uint8)

    sample_image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    lips, height, width, x_min, y_min, x_max, y_max  = crop_lips(sample_image)

    if(lips is None):
        print("No face found")
        exit(0)

    if(height is None or width is None):
        print("No lips found")
        exit(0)

    lips2 = np.copy(lips)

    lips2 = preprocess_image(lips2)

    output = model.predict(lips2)

    mask = postprocess_output(output)

    mask = cv2.resize(mask, (width, height))
    lips = cv2.resize(lips, (width, height))
    lipstick_color = color

    processed_image = apply_lipstick(sample_image, mask, lips, lipstick_color, y_min, y_max, x_min, x_max)

    is_success, buffer = cv2.imencode('.png', processed_image)

    if not is_success:
        raise ValueError("Failed to encode image")

    return BytesIO(buffer)