from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from io import BytesIO

# Initialize FastAPI app
app = FastAPI()

# Load the trained model
model = load_model('/Users/hrikisschitrakar/Desktop/Vrikshya-Rakshya/model/plant_disease_model.h5')

# Define class labels
class_labels = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Chili___healthy",
    "Chili___leaf_curl",
    "Chili___leaf_spot",
    "Chili___whitefly",
    "Chili___yellowish",
    "Coffee___Rust",
    "Coffee___healthy",
    "Coffee___red_spider_mite",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

# API Root
@app.get("/")
def home():
    return {"message": "Plant Disease Prediction API is running!"}

# API endpoint to handle image uploads and return predictions
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Read image file
        contents = await file.read()
        img = load_img(BytesIO(contents), target_size=(139, 139))  # Resize to match model input
        img_array = img_to_array(img) / 255.0  # Normalize pixel values
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        # Make prediction
        prediction = model.predict(img_array)

        # Get the highest probability class
        predicted_class_index = np.argmax(prediction)
        predicted_label = class_labels[predicted_class_index]
        confidence_score = float(prediction[0][predicted_class_index] * 100)  # Convert to percentage

        return {
            "Predicted Label": predicted_label,
            "Confidence Score": f"{confidence_score:.2f}%"
        }

    except Exception as e:
        return {"error": str(e)}

