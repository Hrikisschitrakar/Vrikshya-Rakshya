import tensorflow as tf
from PIL import Image
import numpy as np
import io

# Load the model (adjust path to your .h5 file)
model = tf.keras.models.load_model("/Users/hrikisschitrakar/Desktop/vrik/backend/model/plant_disease_model.h5")

def predict_disease(image_bytes: bytes) -> str:
    # Preprocess the image
    img = Image.open(io.BytesIO(image_bytes)).resize((224, 224))  # Adjust size based on your model
    img_array = np.array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    # Make prediction
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions[0])  # Get the highest probability class

    # Map to disease names (example mapping; adjust based on your model)
    disease_mapping = {0: "Healthy", 1: "Disease A", 2: "Disease B"}  # Replace with your classes
    return disease_mapping.get(predicted_class, "Unknown")