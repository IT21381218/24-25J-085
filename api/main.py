# main.py
from fastapi import FastAPI, HTTPException, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import bcrypt
from typing import List, Optional
import os
import shutil
from firestore_db import get_firestore_client
import joblib
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import pandas as pd
import traceback
from geopy.distance import geodesic
import requests
from textblob import TextBlob
# from chat import init_chat
from connction_manager import ConnectionManager
from datetime import datetime
import json


app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://cattle-y-frontend.onrender.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chat module
# socket_manager = init_chat(app)
manager = ConnectionManager()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Db connection
db = get_firestore_client()

# Google Maps Configs
GOOGLE_API_KEY = 'AIzaSyDTJjnuqF0J18Uu_Ft2TA5R13WsyyDbo4U'
GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
GOOGLE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"


# Load MOdels Health
MODEL_HEALTH = joblib.load('model_health_random_f_classifier.joblib')
MODEL_HEALTH_FOCUSED = joblib.load('model_health_random_f_classifier_foused.joblib')
LABEL_ENCODER =  joblib.load('label_encoder_health_status.joblib')

# Load Milk Quality Checker
try:
    MODEL_ML_QUALITY = joblib.load("milk_model_dt.joblib")  
    MODEL_ML_FORECAST = joblib.load("arima_milk_production_model.joblib")
except FileNotFoundError:
    raise Exception("Model file not found. Ensure the decision_tree_model.joblib file is in the same directory.")


# Load Pest detection Models
# Load Pest detection Models
MODEL_PESTS = load_model("model_pests_detect.h5")
CLASS_PESTS = ['Mastitis', ' Tick Infestation', 'Dermatophytosis (RINGWORM)', 'Fly Strike (MYIASIS)', 'Foot and Mouth disease', 'Lumpy Skin', 'Black Quarter (BQ)', 'Parasitic Mange']



class User(BaseModel):
    username: str
    full_name: str
    email: str
    contact: str
    password: str
    nic: str
    role: str = Field(default="Farmer")

class LoginUser(BaseModel):
    username: str
    password: str

class FaceID(BaseModel):
    username: str

users_db = {}

@app.post("/register")
async def register_user(user: User):
    user_ref = db.collection("users").document(user.username)
    if user_ref.get().exists:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Hash the password before storing it
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    user_data = user.dict()
    user_data["password"] = hashed_password.decode('utf-8')

    user_ref.set(user_data)
    return {"message": "User registered successfully", "user": user_data}

@app.post("/login")
async def login_user(user: LoginUser):
    user_ref = db.collection("users").document(user.username)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    user_data = user_doc.to_dict()
    
    # Check the hashed password
    if not bcrypt.checkpw(user.password.encode('utf-8'), user_data["password"].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    user_data.pop("password")  # Remove the password field from the response

    return {"message": "Login successful", "user": user_data}


# Cattle Details
class Cattle(BaseModel):
    name: str
    breed: str
    birth: str
    health: str
    status: str
    image: str
    owner: str

@app.post("/cattle")
async def create_cattle(cattle: Cattle):
    cattle_ref = db.collection("cattle").document()
    cattle_data = cattle.dict()
    cattle_ref.set(cattle_data)
    return {"message": "Cattle added successfully", "id": cattle_ref.id}

@app.get("/cattle", response_model=List[dict])
async def get_all_cattle():
    cattle_docs = db.collection("cattle").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in cattle_docs]

@app.get("/cattle/owner/{owner}", response_model=List[dict])
async def get_cattle_by_owner(owner: str):
    cattle_docs = db.collection("cattle").where("owner", "==", owner).stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in cattle_docs]

@app.delete("/cattle/{cattle_id}")
async def delete_cattle(cattle_id: str):
    cattle_ref = db.collection("cattle").document(cattle_id)
    if not cattle_ref.get().exists:
        raise HTTPException(status_code=404, detail="Cattle not found")
    cattle_ref.delete()
    return {"message": "Cattle deleted successfully"}

class CattleUpdate(BaseModel):
    health: str | None = None
    status: str | None = None

@app.put("/cattle/{cattle_id}")
async def update_cattle(cattle_id: str, cattle_data: CattleUpdate):
    try:
        cattle_ref = db.collection("cattle").document(cattle_id)
        
        # Check if the cattle document exists
        if not cattle_ref.get().exists:
            raise HTTPException(status_code=404, detail="Cattle not found")

        # Prepare the update data
        update_data = cattle_data.dict(exclude_unset=True)

        # Ensure there is at least one field to update
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields provided for update")

        # Perform the update
        cattle_ref.update(update_data)
        return {"message": "Cattle updated successfully"}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))


# Appoinement s 
class Appointment(BaseModel):
    id: Optional[str] = None
    title: str
    date: str  
    time: str 
    message: str | None = None
    username: str  
    accepted: bool = False  

# Function to sort by latest date
def sort_appointments_by_date(appointments):
    return sorted(appointments, key=lambda x: x["date"], reverse=True)

# ✅ Endpoint to Create an Appointment
@app.post("/appointments")
async def create_appointment(appointment: Appointment):
    try:
        appointment_data = appointment.dict()
        doc_ref = db.collection("appointments").document()
        doc_ref.set(appointment_data)

        return {"message": "Appointment created successfully", "appointment_id": doc_ref.id}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ✅ Endpoint to Get All Appointments (Sorted by Date)
@app.get("/appointments", response_model=List[Appointment])
async def get_all_appointments():
    try:
        appointments_ref = db.collection("appointments").stream()
        appointments = [doc.to_dict() for doc in appointments_ref]

        if not appointments:
            raise HTTPException(status_code=404, detail="No appointments found")

        return sort_appointments_by_date(appointments)
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ✅ Endpoint to Get Appointments for a Specific User (Sorted by Date)
@app.get("/appointments/user/{username}", response_model=List[Appointment])
async def get_appointments_by_user(username: str):
    try:
        appointments_ref = db.collection("appointments").where("username", "==", username).stream()
        user_appointments = [doc.to_dict() for doc in appointments_ref]

        if not user_appointments:
            raise HTTPException(status_code=404, detail="No appointments found for this user")

        return sort_appointments_by_date(user_appointments)
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/appointments/title/{title}", response_model=List[Appointment])
async def get_appointments_by_title(title: str):
    """Fetch appointments by title and include document ID"""
    try:
        appointments_ref = db.collection("appointments").where("title", "==", title).stream()
        
        title_appointments = [
            {**doc.to_dict(), "id": doc.id} for doc in appointments_ref
        ]

        if not title_appointments:
            raise HTTPException(status_code=404, detail="No appointments found with this title")

        return sort_appointments_by_date(title_appointments)
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    """Delete an appointment by its document ID"""
    try:
        doc_ref = db.collection("appointments").document(appointment_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Appointment not found")

        doc_ref.delete()
        return {"message": "Appointment deleted successfully", "appointment_id": appointment_id}

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Predict Pests and Diseases
@app.post("/predict-pest")
async def predict_pest(file: UploadFile = File(...)):
    """
    Endpoint to classify an uploaded image for pest attack detection.
    """
    # Save the uploaded file temporarily
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Preprocess the image
        image = Image.open(file_path).convert("RGB")  # Ensure RGB format
        image = image.resize((48, 48))  # Resize to model's input size
        image_array = np.array(image) / 255.0  # Normalize to [0, 1]
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        # Predict the pest attack label
        predictions = MODEL_PESTS.predict(image_array)
        predicted_index = np.argmax(predictions, axis=1)[0]
        confidence = float(np.max(predictions))  # Highest probability

        # Map the predicted index to the pest attack label
        predicted_label = CLASS_PESTS[predicted_index]

        # Clean up the uploaded file
        os.remove(file_path)

        return {
            "predicted_label": predicted_label,
            "confidence": confidence
        }
    except Exception as e:
        os.remove(file_path)  # Clean up the uploaded file in case of error
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

# Predict Cow Health
class HealthStatusInput(BaseModel):
    body_temperature: float
    milk_production: float
    respiratory_rate: int
    walking_capacity: int
    sleeping_duration: float
    body_condition_score: int
    heart_rate: int
    eating_duration: float
    lying_down_duration: float
    ruminating: float
    rumen_fill: int

@app.post("/predict-health-status")
async def predict_health_status(input_data: HealthStatusInput):
    
    try:
        # Convert input to DataFrame
        input_df = pd.DataFrame([input_data.dict()])

        # Predict using the loaded model
        predicted_class = MODEL_HEALTH.predict(input_df)[0]

        # Decode the predicted class
        health_status = LABEL_ENCODER.inverse_transform([predicted_class])[0]

        return {"health_status": health_status}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")
    

@app.get("/health-status")
def check_health_status(body_temp: float, heart_rate: int, spo2: int):
    """
    Predicts if a person is healthy (1) or unhealthy (0) using a trained Random Forest model.
    Returns confidence of prediction based on actual model probabilities.
    """
    features = np.array([[body_temp, heart_rate, spo2]])
    
    # Get prediction probabilities
    probabilities = MODEL_HEALTH_FOCUSED.predict_proba(features)[0]  # Returns [prob_unhealthy, prob_healthy]
    
    # Determine predicted class (0 or 1)
    prediction = np.argmax(probabilities)
    
    # Confidence is the probability of the predicted class
    confidence = round(probabilities[prediction] * 100, 2)

    return {"status": int(prediction), "confidence": confidence}

# Milk Quality Monitor
class MilkQualityInput(BaseModel):
    pH: float
    Temperature: float
    Taste: int
    Odor: int
    Fat: float
    Turbidity: int
    Colour: int

# Define grade mapping
grade_mapping = {0: "high", 1: "low", 2: "medium"}

@app.post("/predict-milk-grade")
async def predict_milk_grade(input_data: MilkQualityInput):

    try:
        # Prepare the input for prediction
        input_array = np.array([
            [
                input_data.pH,
                input_data.Temperature,
                input_data.Taste,
                input_data.Odor,
                input_data.Fat,
                input_data.Turbidity,
                input_data.Colour,
            ]
        ])

        # Perform the prediction
        predicted_grade = MODEL_ML_QUALITY.predict(input_array)

        # Map the predicted grade to a category
        predicted_grade_category = grade_mapping.get(predicted_grade[0])

        if predicted_grade_category is None:
            raise ValueError("Invalid prediction received from the model.")

        return {"predicted_grade": predicted_grade_category}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# Milk Production Forecast
class MilkProductionRequest(BaseModel):
    year: int
    month: int

@app.post("/predict-milk-production")
async def predict_milk_production(request: MilkProductionRequest):
    """
    Predicts milk production for a given year and month.

    Input:
    - year: int, the year for which to predict milk production.
    - month: int, the month for which to predict milk production.

    Returns:
    - predicted_value: float, predicted milk production value for the given month.
    """
    try:
        # Extract year and month from the request
        year = request.year
        month = request.month

        # Validate month input
        if month < 1 or month > 12:
            raise HTTPException(status_code=400, detail="Invalid month. Must be between 1 and 12.")

        # Convert input year and month into a datetime object
        prediction_date = pd.Timestamp(year=year, month=month, day=1)

        # Get the last available date in the model data (assumed to be the last training date)
        last_date = MODEL_ML_FORECAST.data.dates[-1]

        # Calculate the number of months between the last training date and the requested prediction date
        months_ahead = (prediction_date.year - last_date.year) * 12 + (prediction_date.month - last_date.month)

        if months_ahead < 0:
            raise HTTPException(
                status_code=400,
                detail="The requested date is within the training data range. Please provide a future date for prediction."
            )

        # Forecast the milk production for the given number of months ahead
        forecast = MODEL_ML_FORECAST.forecast(steps=months_ahead)
        print(year)
        print(month)

        # Return the predicted value for the requested month
        predicted_value = forecast[-1]
        print(forecast)
        return {"predicted_milk_production": predicted_value}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# Milk Production x 2
MODEL_MILK_DAILY = joblib.load("fine_tuned_random_forest.joblib")

# Dictionary of encoded rainfall labels
rainfall_encoding = {
    'Clear': 0,
    'Overcast': 1,
    'Partially cloudy': 2,
    'Rain': 3,
    'Rain, Overcast': 4,
    'Rain, Partially cloudy': 5
}

class MilkPredictionRequest(BaseModel):
    year: float
    month: float
    date: float
    temperature: float
    humidity: float
    rainfall: str

@app.post("/milk-weather-predict")
def predict_milk_liters(request: MilkPredictionRequest):
    print(request)
    """
    Endpoint to predict milk liters based on input features.
    """
    encoded_rainfall = rainfall_encoding.get(request.rainfall, 6)  # Default to 6 if unknown
    input_features = np.array([[request.year, request.month, request.date, request.temperature, request.humidity, encoded_rainfall]])

    predicted_value = MODEL_MILK_DAILY.predict(input_features)[0]
    
    return {"predicted_milk_liters": predicted_value}

class MilkRecord(BaseModel):
    cattle_id: str
    amount: float = 0.0
    status: str = "ok"
    feedback: Optional[str] = "No feedback"

class DailyMilkSummary(BaseModel):
    predicted_total: Optional[float] = 0.0
    actual_total: Optional[float] = 0.0

@app.post("/milk-summary/{username}/{date_str}")
async def create_or_update_milk_summary(username: str, date_str: str, summary: DailyMilkSummary):
    date_doc_ref = db.collection("users").document(username).collection("daily-milk-summary").document(date_str)
    date_doc_ref.set(summary.dict(), merge=True)
    return {"message": "Daily milk summary updated", "summary": summary.dict()}


@app.get("/milk-summary/{username}/{date_str}")
async def get_milk_summary(username: str, date_str: str):
    date_doc_ref = db.collection("users").document(username).collection("daily-milk-summary").document(date_str)
    doc = date_doc_ref.get()

    if doc.exists:
        summary = doc.to_dict()
        return {"message": "Daily milk summary retrieved", "summary": summary}
    else:
        return {"message": "No milk summary found for the given date"}

@app.post("/milk-record/{username}/{date_str}")
async def add_milk_record(username: str, date_str: str, record: MilkRecord):
    milk_records_ref = db.collection("users").document(username).collection("daily-milk-summary").document(date_str).collection("milk-records")
    record_ref = milk_records_ref.document()
    record_ref.set(record.dict())
    return {"message": "Milk record added", "record": record.dict()}

@app.delete("/milk-record/{username}/{date_str}/{record_id}")
async def delete_milk_record(username: str, date_str: str, record_id: str):
    record_ref = db.collection("users").document(username).collection("daily-milk-summary").document(date_str).collection("milk-records").document(record_id)
    if not record_ref.get().exists:
        raise HTTPException(status_code=404, detail="Milk record not found")
    record_ref.delete()
    return {"message": "Milk record deleted successfully"}

@app.get("/milk-records/{username}")
async def get_all_milk_records(username: str):
    user_milk_summary_ref = db.collection("users").document(username).collection("daily-milk-summary")
    
    # Retrieve all daily summaries and sort them in descending order based on the date_str in document ID (YYYY-MM-DD)
    date_docs = sorted(
        user_milk_summary_ref.stream(), 
        key=lambda doc: doc.id, 
        reverse=True  # Sort in descending order
    )

    all_records = []
    
    for date_doc in date_docs:
        date_str = date_doc.id  
        milk_records_ref = user_milk_summary_ref.document(date_str).collection("milk-records")
        milk_records = milk_records_ref.stream()

        for record in milk_records:
            record_data = record.to_dict()
            record_data["record_id"] = record.id
            record_data["date"] = date_str  # Attach date to the record
            all_records.append(record_data)

    return {"message": "Milk records retrieved", "records": all_records}


# Locate Vets   
class Location(BaseModel):
    latitude: float
    longitude: float

class Review(BaseModel):
    author_name: str
    rating: int
    text: str
    location_name: str
    polarity: Optional[float] = None


outlets_db = {}
outlet_ref = db.collection("outlets")

def analyze_sentiment(text: str) -> float:
    """Calculate polarity score using TextBlob"""
    return TextBlob(text).sentiment.polarity if text else 0.0

@app.post("/submit_review")
async def submit_review(review: Review):
    try:
        # Calculate polarity score
        review.polarity = analyze_sentiment(review.text)

        # Save review to Firestore
        review_data = review.dict()  
        db.collection("reviews").add(review_data)

        return {"message": "Review submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

class PlaceDetails(BaseModel):
    name: str
    address: str
    location: Location
    rating: Optional[float] = None
    reviews: List[Review] = []
    phone_number: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None





def get_nearby_locations(latitude: float, longitude: float, radius: int = 5000):
    location = f"{latitude},{longitude}"
    params = {
        "location": location,
        "radius": radius,
        "type": "veterinary_care",
        "key": GOOGLE_API_KEY
    }
    response = requests.get(GOOGLE_PLACES_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        locations = []

        for result in data.get('results', []):
            place_id = result.get("place_id")
            details = get_place_details(place_id) if place_id else {}
            firestore_reviews = []

            reviews_ref = db.collection("reviews").where("location_name", "==", result.get("name")).stream()

            firestore_reviews = [review.to_dict() for review in reviews_ref]
            pol = 0
            if len(firestore_reviews) > 0:
                total_polarity = sum(review.get("polarity", 0) for review in firestore_reviews)
                pol = total_polarity

            # Merge Google reviews and Firestore reviews
            all_reviews = details.get("reviews", []) + firestore_reviews

            locations.append({
                "name": result.get("name"),
                "address": result.get("vicinity"),
                "location": result.get("geometry", {}).get("location"),
                "rating": result.get("rating"),
                "reviews": all_reviews,
                "phone_number": details.get("formatted_phone_number"),
                "email": details.get("email"),
                "website": details.get("website"),
                "polarity_score": pol
            })

        # Sort locations by polarity_score, highest to lowest (undefined comes last)
        # locations.sort(key=lambda x: (x['polarity_score'] is None, -x['polarity_score'] if x['polarity_score'] is not None else float('inf')))
        
        return locations
    else:
        return {"error": "Failed to retrieve data from Google Places API"}

def get_place_details(place_id):
    """Fetch detailed information about a place using Google Place Details API."""
    params = {
        "place_id": place_id,
        "fields": "formatted_phone_number,reviews,email,website",
        "key": GOOGLE_API_KEY
    }
    response = requests.get(GOOGLE_DETAILS_URL, params=params)
    
    if response.status_code == 200:
        data = response.json().get("result", {})
        
        # Add polarity score to Google reviews
        if "reviews" in data:
            for review in data["reviews"]:
                review["polarity"] = analyze_sentiment(review["text"])

        return data
    return {}

@app.post("/nearby_locations")
async def nearby_locations(location: Location):
    locations = get_nearby_locations(location.latitude, location.longitude)
    return {"locations": locations}


@app.post("/outlets")
async def create_outlet(outlet: PlaceDetails):
    """Create a new outlet and store it in Firestore."""
    outlet_dict = outlet.dict()
    doc_ref = outlet_ref.add(outlet_dict)  # Add the document to Firestore
    return {"message": "Outlet created successfully", "id": doc_ref[1].id}

@app.get("/outlets/{outlet_id}")
async def get_outlet(outlet_id: str):
    """Retrieve an outlet by its Firestore document ID."""
    doc = outlet_ref.document(outlet_id).get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Outlet not found")
    
    return doc.to_dict()

# Chatting Endpoints 
@app.websocket('/ws/{client_id}')
async def websocket_endpoint(webSocket:WebSocket, client_id:str):
    await manager.connect(webSocket)
    now = datetime.now()
    currenc_time = now.strftime("%H:%M")

    try:
        while True:
            data = await webSocket.receive_text()
            message = {"time": currenc_time, "client_id": client_id, "message": data}
            await manager.broadcast(json.dumps(message))

    except WebSocketDisconnect:
        manager.disconnect(webSocket)
        message = {"time": currenc_time, "client_id": client_id, "message": "Offline"}
        await manager.broadcast(json.dumps(message))


class ChatMessage(BaseModel):
    sender: str
    receiver: str
    message: str
    timestamp: str = None  # Will be set on the server

@app.post("/chat-save")
async def save_chat_message(chat: ChatMessage):
    # Generate current date and time formatted as "YYYY-MM-DD HH:MM"
    now = datetime.now()
    current_timestamp = now.strftime("%Y-%m-%d %H:%M")
    chat.timestamp = current_timestamp

    # Save the chat message to a Firestore collection called "chats"
    chat_ref = db.collection("chats").document()  # Auto-generated document id
    chat_ref.set(chat.dict())

    return {"status": "success", "message": "Chat message saved successfully"}

@app.get("/chat/{username}/{receiver}")
async def get_chat_messages(username: str, receiver: str):
    # Query Firestore for messages where:
    # Case 1: username is the sender and receiver is the given receiver.
    sender_query = db.collection("chats") \
        .where("sender", "==", username) \
        .where("receiver", "==", receiver) \
        .stream()

    # Case 2: username is the receiver and sender is the given receiver.
    receiver_query = db.collection("chats") \
        .where("sender", "==", receiver) \
        .where("receiver", "==", username) \
        .stream()

    # Merge the two query results.
    messages = []
    for doc in sender_query:
        messages.append(doc.to_dict())
    for doc in receiver_query:
        messages.append(doc.to_dict())

    # Sort messages by timestamp (assuming "YYYY-MM-DD HH:MM" format allows lexicographical sorting)
    messages.sort(key=lambda msg: msg.get("timestamp", ""))
    
    return {"status": "success", "data": messages}


#--------------------------------------------------------------------

# Add this to your main.py file in the backend
# Import the necessary libraries at the top of your file
import joblib
import numpy as np
from pydantic import BaseModel
import pickle
import traceback
import os
import json
import sys
from typing import Dict, Any, List, Union

# Add this class for the milk quality prediction request
class MilkQualityFeedInput(BaseModel):
    temperature: float
    milkIntake: float
    bodyScore: float
    rumenFill: float

# Function to inspect model structure
def inspect_model(model):
    """Inspect the model structure and return information about it."""
    model_info = {
        "type": str(type(model)),
        "methods": [method for method in dir(model) if not method.startswith("_") and callable(getattr(model, method))],
    }
    
    # Try to get more specific information based on model type
    if hasattr(model, "feature_importances_"):
        model_info["feature_importances"] = model.feature_importances_.tolist()
    
    if hasattr(model, "classes_"):
        model_info["classes"] = model.classes_.tolist()
    
    if hasattr(model, "n_features_in_"):
        model_info["n_features_in"] = model.n_features_in_
        
    return model_info

# Create a more sophisticated fallback model
class EnhancedMilkQualityModel:
    def __init__(self):
        print("Using enhanced fallback milk quality model")
        # Define feature importance weights based on domain knowledge
        self.feature_weights = {
            "temperature": 0.3,  # Temperature has high importance
            "milkIntake": 0.2,   # Milk intake has medium importance
            "bodyScore": 0.3,    # Body score has high importance
            "rumenFill": 0.2     # Rumen fill has medium importance
        }
        
        # Define thresholds for each feature
        self.thresholds = {
            "temperature": {
                "optimal": (38.0, 39.0),  # Optimal temperature range
                "acceptable": (37.5, 39.5)  # Acceptable temperature range
            },
            "milkIntake": {
                "high": 2000,    # High milk intake (ml)
                "medium": 1000   # Medium milk intake (ml)
            },
            "bodyScore": {
                "high": 4.0,     # High body score
                "medium": 3.0    # Medium body score
            },
            "rumenFill": {
                "high": 4.0,     # High rumen fill
                "medium": 3.0    # Medium rumen fill
            }
        }
    
    def predict(self, features):
        """
        Predict milk quality based on input features.
        Returns 0 for low, 1 for medium, 2 for high quality.
        """
        # Extract features
        temperature = features[0][0]
        milkIntake = features[0][1]
        bodyScore = features[0][2]
        rumenFill = features[0][3]
        
        # Calculate score for each feature (0 to 1)
        temperature_score = self._score_temperature(temperature)
        milkIntake_score = self._score_milkIntake(milkIntake)
        bodyScore_score = self._score_bodyScore(bodyScore)
        rumenFill_score = self._score_rumenFill(rumenFill)
        
        # Calculate weighted score
        total_score = (
            temperature_score * self.feature_weights["temperature"] +
            milkIntake_score * self.feature_weights["milkIntake"] +
            bodyScore_score * self.feature_weights["bodyScore"] +
            rumenFill_score * self.feature_weights["rumenFill"]
        )
        
        # Map total score to quality class
        if total_score >= 0.7:
            return [2]  # High quality
        elif total_score >= 0.4:
            return [1]  # Medium quality
        else:
            return [0]  # Low quality
    
    def _score_temperature(self, value):
        """Score temperature on a scale of 0 to 1"""
        optimal_min, optimal_max = self.thresholds["temperature"]["optimal"]
        acceptable_min, acceptable_max = self.thresholds["temperature"]["acceptable"]
        
        if optimal_min <= value <= optimal_max:
            return 1.0  # Optimal range
        elif acceptable_min <= value <= acceptable_max:
            # Linear interpolation for acceptable range
            if value < optimal_min:
                return 0.5 + 0.5 * (value - acceptable_min) / (optimal_min - acceptable_min)
            else:  # value > optimal_max
                return 0.5 + 0.5 * (acceptable_max - value) / (acceptable_max - optimal_max)
        else:
            return 0.0  # Outside acceptable range
    
    def _score_milkIntake(self, value):
        """Score milk intake on a scale of 0 to 1"""
        high = self.thresholds["milkIntake"]["high"]
        medium = self.thresholds["milkIntake"]["medium"]
        
        if value >= high:
            return 1.0
        elif value >= medium:
            return 0.5 + 0.5 * (value - medium) / (high - medium)
        else:
            return max(0, 0.5 * value / medium)
    
    def _score_bodyScore(self, value):
        """Score body condition on a scale of 0 to 1"""
        high = self.thresholds["bodyScore"]["high"]
        medium = self.thresholds["bodyScore"]["medium"]
        
        if value >= high:
            return 1.0
        elif value >= medium:
            return 0.5 + 0.5 * (value - medium) / (high - medium)
        else:
            return max(0, 0.5 * value / medium)
    
    def _score_rumenFill(self, value):
        """Score rumen fill on a scale of 0 to 1"""
        high = self.thresholds["rumenFill"]["high"]
        medium = self.thresholds["rumenFill"]["medium"]
        
        if value >= high:
            return 1.0
        elif value >= medium:
            return 0.5 + 0.5 * (value - medium) / (high - medium)
        else:
            return max(0, 0.5 * value / medium)
    
    def get_feature_importance(self):
        """Return feature importance for explanation"""
        return self.feature_weights

# Check if the model file exists
model_path = "milk_quality_model.pkl"
if not os.path.exists(model_path):
    print(f"ERROR: Model file {model_path} does not exist!")

# Load the milk quality model
try:
    # Try loading with joblib first
    try:
        print(f"Attempting to load model from {model_path} with joblib...")
        MILK_QUALITY_MODEL = joblib.load(model_path)
        print(f"Successfully loaded milk quality model with joblib: {type(MILK_QUALITY_MODEL)}")
        
        # Inspect the model
        model_info = inspect_model(MILK_QUALITY_MODEL)
        print(f"Model information: {json.dumps(model_info, indent=2)}")
        
    except Exception as joblib_error:
        # If joblib fails, try with pickle
        print(f"Joblib loading failed: {joblib_error}")
        print("Attempting to load with pickle...")
        with open(model_path, 'rb') as file:
            MILK_QUALITY_MODEL = pickle.load(file)
            print(f"Successfully loaded milk quality model with pickle: {type(MILK_QUALITY_MODEL)}")
            
            # Inspect the model
            model_info = inspect_model(MILK_QUALITY_MODEL)
            print(f"Model information: {json.dumps(model_info, indent=2)}")
except Exception as e:
    print(f"Error loading milk quality model: {e}")
    traceback.print_exc()
    print("Using enhanced fallback model instead")
    MILK_QUALITY_MODEL = EnhancedMilkQualityModel()

# Add this endpoint to your FastAPI app
@app.post("/predict-milk-quality-feed")
async def predict_milk_quality_feed(input_data: MilkQualityFeedInput):
    """
    Predicts milk quality based on feed details.
    
    Input:
    - temperature: float, body temperature of the cow
    - milkIntake: float, milk intake in ml
    - bodyScore: float, body condition score
    - rumenFill: float, rumen fill score
    
    Returns:
    - predicted_quality: string, predicted milk quality (high, medium, or low)
    - explanation: explanation of the prediction
    - feature_importance: importance of each feature in the prediction
    """
    try:
        # Log the input data for debugging
        print(f"Input data: {input_data.dict()}")
        
        # Prepare input features for prediction
        features = np.array([[
            float(input_data.temperature),
            float(input_data.milkIntake),
            float(input_data.bodyScore),
            float(input_data.rumenFill)
        ]])
        
        print(f"Features shape: {features.shape}")
        print(f"Features: {features}")
        
        # Flag to track if we're using the fallback model
        using_fallback = False
        feature_importance = {}
        
        # Make prediction
        try:
            prediction = MILK_QUALITY_MODEL.predict(features)[0]
            print(f"Raw prediction: {prediction}")
            
            # Try to get feature importance if available
            if hasattr(MILK_QUALITY_MODEL, "feature_importances_"):
                feature_names = ["temperature", "milkIntake", "bodyScore", "rumenFill"]
                feature_importance = {
                    name: float(importance) 
                    for name, importance in zip(feature_names, MILK_QUALITY_MODEL.feature_importances_)
                }
            elif isinstance(MILK_QUALITY_MODEL, EnhancedMilkQualityModel):
                feature_importance = MILK_QUALITY_MODEL.get_feature_importance()
                using_fallback = True
                
        except Exception as pred_error:
            print(f"Prediction error: {pred_error}")
            traceback.print_exc()
            
            # Use the enhanced fallback model
            fallback_model = EnhancedMilkQualityModel()
            prediction = fallback_model.predict(features)[0]
            feature_importance = fallback_model.get_feature_importance()
            using_fallback = True
            
            print(f"Using fallback prediction: {prediction}")
        
        # Map prediction to quality label
        quality_mapping = {0: "low", 1: "medium", 2: "high"}
        
        # Handle different prediction types (could be int, numpy.int64, etc.)
        if hasattr(prediction, 'item'):
            prediction_key = prediction.item()
        else:
            prediction_key = int(prediction)
            
        predicted_quality = quality_mapping.get(prediction_key, "medium")  # Default to medium if unknown
        
        # Generate explanation based on the input values and prediction
        explanation = generate_explanation(
            input_data.temperature, 
            input_data.milkIntake,
            input_data.bodyScore,
            input_data.rumenFill,
            predicted_quality,
            feature_importance
        )
        
        print(f"Predicted quality: {predicted_quality}")
        print(f"Explanation: {explanation}")
        
        return {
            "predicted_quality": predicted_quality,
            "explanation": explanation,
            "feature_importance": feature_importance,
            "using_fallback_model": using_fallback
        }
    
    except Exception as e:
        print(f"Error in predict_milk_quality_feed: {e}")
        traceback.print_exc()
        
        # Return a default prediction in case of error
        return {
            "predicted_quality": "medium", 
            "explanation": "An error occurred during prediction. Using default prediction.",
            "error": str(e),
            "using_fallback_model": True
        }

def generate_explanation(temperature, milk_intake, body_score, rumen_fill, quality, feature_importance):
    """Generate a human-readable explanation for the prediction."""
    
    # Base explanation
    explanation = f"The milk quality is predicted to be {quality.upper()} based on the provided parameters. "
    
    # Add temperature analysis
    if 38.0 <= temperature <= 39.0:
        explanation += f"The temperature ({temperature}°C) is within the optimal range. "
    elif 37.5 <= temperature <= 39.5:
        explanation += f"The temperature ({temperature}°C) is acceptable but not optimal. "
    else:
        explanation += f"The temperature ({temperature}°C) is outside the normal range, which negatively affects milk quality. "
    
    # Add body score analysis
    if body_score >= 4.0:
        explanation += f"The body score ({body_score}) is excellent, indicating good health. "
    elif body_score >= 3.0:
        explanation += f"The body score ({body_score}) is good. "
    else:
        explanation += f"The body score ({body_score}) is below recommended levels, which may affect milk quality. "
    
    # Add milk intake analysis
    if milk_intake >= 2000:
        explanation += f"The milk intake ({milk_intake} ml) is high, which is positive. "
    elif milk_intake >= 1000:
        explanation += f"The milk intake ({milk_intake} ml) is moderate. "
    else:
        explanation += f"The milk intake ({milk_intake} ml) is low, which may indicate issues. "
    
    # Add rumen fill analysis
    if rumen_fill >= 4.0:
        explanation += f"The rumen fill ({rumen_fill}) is excellent, indicating good digestion. "
    elif rumen_fill >= 3.0:
        explanation += f"The rumen fill ({rumen_fill}) is good. "
    else:
        explanation += f"The rumen fill ({rumen_fill}) is below optimal levels, which may affect nutrition absorption. "
    
    # Add recommendation based on quality
    if quality == "high":
        explanation += "Continue with the current feeding and management practices."
    elif quality == "medium":
        explanation += "Consider adjusting the diet to improve body condition and monitoring temperature regularly."
    else:  # low
        explanation += "Immediate attention is needed. Review feeding practices, check for health issues, and consult a veterinarian."
    
    return explanation


#### eehanee ---------------------------------------------------------------


# Add these new endpoints to your main.py file

# Vet Qualifications Endpoints
class Qualification(BaseModel):
    degree: str
    institution: str
    year: str
    description: Optional[str] = None

class QualificationsList(BaseModel):
    qualifications: List[Qualification]

@app.get("/vet-qualifications/{username}")
async def get_vet_qualifications(username: str):
    """Get qualifications for a specific veterinarian"""
    try:
        # Check if the user exists and is a veterinarian
        user_ref = db.collection("users").document(username)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        if user_data.get("role") != "Veterinarian":
            raise HTTPException(status_code=400, detail="User is not a veterinarian")
        
        # Get qualifications directly from the user document
        qualifications = user_data.get("qualifications", [])
        
        return {"qualifications": qualifications}
    
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/vet-qualifications/{username}")
async def update_vet_qualifications(username: str, qualifications_list: QualificationsList):
    """Update all qualifications for a veterinarian"""
    try:
        # Check if the user exists and is a veterinarian
        user_ref = db.collection("users").document(username)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        if user_data.get("role") != "Veterinarian":
            raise HTTPException(status_code=400, detail="User is not a veterinarian")
        
        # Update the user document with the new qualifications
        user_ref.update({"qualifications": [q.dict() for q in qualifications_list.qualifications]})
        
        return {"message": "Qualifications updated successfully"}
    
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/role/{role}")
async def get_users_by_role(role: str):
    """Get all users with a specific role"""
    try:
        users_ref = db.collection("users").where("role", "==", role).stream()
        users = [doc.to_dict() for doc in users_ref]
        
        # Remove sensitive information
        for user in users:
            if "password" in user:
                user.pop("password")
        
        return users
    
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))


#---------------------------------------------- alerts

# Add these new endpoints to your main.py file

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import threading
import time
import traceback
from fastapi import HTTPException

# Vaccination models
class VaccinationRecord(BaseModel):
    username: str
    vaccinationType: str
    vaccinationDate: str
    vaccinationDetails: str
    email: Optional[str] = None
    cattleId: Optional[str] = "general"
    reminderTime: Optional[str] = "08:00"  # Default reminder time is 8:00 AM

# Email configuration - you should set these as environment variables in production
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USERNAME = os.environ.get("EMAIL_USERNAME", "rajmalperera@gmail.com")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD", "rajmal2000")
EMAIL_FROM = os.environ.get("EMAIL_FROM", "Cattle Health Management rajmalperera@gmail.com")

# Function to send email with improved logging
def send_email(to_email, subject, html_content):
    try:
        print(f"Attempting to send email to {to_email} with subject: {subject}")
        
        # Check if email credentials are set
        if EMAIL_USERNAME == "your-email@gmail.com" or EMAIL_PASSWORD == "your-app-password":
            print("WARNING: Using default email credentials. Please set proper EMAIL_USERNAME and EMAIL_PASSWORD environment variables.")
        
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(html_content, 'html'))
        
        print(f"Connecting to SMTP server {EMAIL_HOST}:{EMAIL_PORT}...")
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        
        print(f"Logging in with username: {EMAIL_USERNAME}")
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        
        print("Sending email message...")
        server.send_message(msg)
        server.quit()
        
        print(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        traceback.print_exc()
        return False

# Vaccination endpoints
@app.post("/vaccinations", response_model=dict)
async def create_vaccination(vaccination: VaccinationRecord):
    try:
        # Add the vaccination record to Firestore
        vaccination_ref = db.collection("vaccinations").document()
        vaccination_data = vaccination.dict()
        vaccination_ref.set(vaccination_data)
        
        # Return the created record with its ID
        return {"message": "Vaccination record created successfully", "id": vaccination_ref.id}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/vaccinations/{username}", response_model=dict)
async def get_vaccinations_by_username(username: str):
    try:
        # Query Firestore for vaccinations for this user
        vaccinations_ref = db.collection("vaccinations").where("username", "==", username).stream()
        
        # Convert to list of dictionaries with ID
        vaccinations = []
        for doc in vaccinations_ref:
            vaccination_data = doc.to_dict()
            vaccination_data["id"] = doc.id
            vaccinations.append(vaccination_data)
        
        return {"vaccinations": vaccinations}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/vaccinations/{vaccination_id}")
async def delete_vaccination(vaccination_id: str):
    try:
        # Get the vaccination record
        vaccination_ref = db.collection("vaccinations").document(vaccination_id)
        vaccination_doc = vaccination_ref.get()
        
        if not vaccination_doc.exists:
            raise HTTPException(status_code=404, detail="Vaccination record not found")
        
        # Delete the record
        vaccination_ref.delete()
        
        return {"message": "Vaccination record deleted successfully"}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/vaccinations/alerts/count/{username}")
async def get_vaccination_alerts_count(username: str):
    try:
        # Get today's date
        today = datetime.now().date()
        
        # Query Firestore for upcoming vaccinations in the next 7 days
        vaccinations_ref = db.collection("vaccinations").where("username", "==", username).stream()
        
        # Filter for upcoming vaccinations
        upcoming_count = 0
        for doc in vaccinations_ref:
            vaccination_data = doc.to_dict()
            vaccination_date = datetime.strptime(vaccination_data["vaccinationDate"], "%Y-%m-%d").date()
            
            # Check if the vaccination date is within the next 7 days
            if today <= vaccination_date <= today + timedelta(days=7):
                upcoming_count += 1
        
        return {"count": upcoming_count}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

# Function to check for upcoming vaccinations and send email alerts
def check_vaccinations_and_send_alerts():
    try:
        print("Checking for upcoming vaccinations...")
        # Get current date and time
        now = datetime.now()
        today = now.date()
        current_time = now.strftime("%H:%M")
        
        print(f"Current date: {today}, Current time: {current_time}")
        
        # Query Firestore for all vaccinations
        vaccinations_ref = db.collection("vaccinations").stream()
        
        for doc in vaccinations_ref:
            vaccination_data = doc.to_dict()
            vaccination_id = doc.id
            
            # Parse the vaccination date
            try:
                vaccination_date = datetime.strptime(vaccination_data["vaccinationDate"], "%Y-%m-%d").date()
                reminder_time = vaccination_data.get("reminderTime", "08:00")
                
                print(f"Checking vaccination ID {vaccination_id}: Date={vaccination_date}, Time={reminder_time}")
                
                # Check if the vaccination is due today or tomorrow
                days_until = (vaccination_date - today).days
                
                # Only send if it's the right time (within 5 minutes of the specified reminder time)
                hour_min = current_time.split(":");
                reminder_hour_min = reminder_time.split(":")
                
                current_minutes = int(hour_min[0]) * 60 + int(hour_min[1])
                reminder_minutes = int(reminder_hour_min[0]) * 60 + int(reminder_hour_min[1])
                
                time_diff = abs(current_minutes - reminder_minutes)
                
                if 0 <= days_until <= 1 and time_diff <= 5:  # Today or tomorrow and within 5 minutes of reminder time
                    print(f"Vaccination due soon and time matches! Days until: {days_until}, Time diff: {time_diff} minutes")
                    
                    # Get the user's email
                    email = vaccination_data.get("email")
                    
                    if not email:
                        # Try to get the user's email from their profile
                        username = vaccination_data.get("username")
                        if username:
                            user_ref = db.collection("users").document(username)
                            user_doc = user_ref.get()
                            if user_doc.exists:
                                user_data = user_doc.to_dict()
                                email = user_data.get("email")
                    
                    if email:
                        print(f"Sending reminder email to {email}")
                        # Prepare and send the email
                        subject = f"Vaccination Reminder: {vaccination_data['vaccinationType']}"
                        
                        if days_until == 0:
                            time_text = "TODAY"
                        else:
                            time_text = "TOMORROW"
                        
                        html_content = f"""
                        <html>
                            <body>
                                <h2>Vaccination Reminder</h2>
                                <p>This is a reminder that the following vaccination is scheduled for {time_text}:</p>
                                <ul>
                                    <li><strong>Type:</strong> {vaccination_data['vaccinationType']}</li>
                                    <li><strong>Date:</strong> {vaccination_data['vaccinationDate']}</li>
                                    <li><strong>Time:</strong> {reminder_time}</li>
                                    <li><strong>Details:</strong> {vaccination_data['vaccinationDetails']}</li>
                                </ul>
                                <p>Please ensure that you have made the necessary arrangements.</p>
                                <p>Thank you,<br>Cattle Health Management System</p>
                            </body>
                        </html>
                        """
                        
                        send_email(email, subject, html_content)
                    else:
                        print(f"No email found for vaccination ID {vaccination_id}")
            except ValueError as ve:
                print(f"Invalid date format for vaccination ID {vaccination_id}: {ve}")
                continue
            except Exception as e:
                print(f"Error processing vaccination ID {vaccination_id}: {e}")
                continue
    except Exception as e:
        print(f"Error in vaccination alert scheduler: {e}")
        traceback.print_exc()

# Function to run the check every minute
def run_checker():
    while True:
        check_vaccinations_and_send_alerts()
        time.sleep(60)  # Check every minute

# Start the checker in a separate thread
checker_thread = threading.Thread(target=run_checker, daemon=True)
checker_thread.start()

# Add a test endpoint to manually trigger email sending
@app.get("/test-email/{email}")
async def test_email(email: str):
    try:
        html_content = """
        <html>
            <body>
                <h2>Test Email</h2>
                <p>This is a test email from your Cattle Health Management System.</p>
                <p>If you received this email, your email configuration is working correctly.</p>
            </body>
        </html>
        """
        
        result = send_email(email, "Test Email from Cattle Health System", html_content)
        
        if result:
            return {"message": f"Test email sent successfully to {email}"}
        else:
            return {"message": f"Failed to send test email to {email}. Check server logs for details."}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

# Add an endpoint to manually check and send notifications
@app.get("/vaccinations/check-and-notify/{username}")
async def check_and_notify_vaccinations(username: str):
    try:
        # Get today's date and current time
        now = datetime.now()
        today = now.date()
        current_time = now.strftime("%H:%M")
        
        # Query Firestore for upcoming vaccinations
        vaccinations_ref = db.collection("vaccinations").where("username", "==", username).stream()
        
        notifications_sent = 0
        for doc in vaccinations_ref:
            vaccination_data = doc.to_dict()
            
            try:
                vaccination_date = datetime.strptime(vaccination_data["vaccinationDate"], "%Y-%m-%d").date()
                reminder_time = vaccination_data.get("reminderTime", "08:00")
                
                # Check if the vaccination is due today or tomorrow
                days_until = (vaccination_date - today).days
                
                if 0 <= days_until <= 1:  # Today or tomorrow
                    email = vaccination_data.get("email")
                    
                    if not email:
                        # Try to get the user's email from their profile
                        user_ref = db.collection("users").document(username)
                        user_doc = user_ref.get()
                        if user_doc.exists:
                            user_data = user_doc.to_dict()
                            email = user_data.get("email")
                    
                    if email:
                        # Send email notification
                        subject = f"Vaccination Reminder: {vaccination_data['vaccinationType']}"
                        time_text = "TODAY" if days_until == 0 else "TOMORROW"
                        
                        html_content = f"""
                        <html>
                            <body>
                                <h2>Vaccination Reminder</h2>
                                <p>This is a reminder that the following vaccination is scheduled for {time_text}:</p>
                                <ul>
                                    <li><strong>Type:</strong> {vaccination_data['vaccinationType']}</li>
                                    <li><strong>Date:</strong> {vaccination_data['vaccinationDate']}</li>
                                    <li><strong>Time:</strong> {reminder_time}</li>
                                    <li><strong>Details:</strong> {vaccination_data['vaccinationDetails']}</li>
                                </ul>
                                <p>Please ensure that you have made the necessary arrangements.</p>
                                <p>Thank you,<br>Cattle Health Management System</p>
                            </body>
                        </html>
                        """
                        
                        if send_email(email, subject, html_content):
                            notifications_sent += 1
            except ValueError:
                continue
        
        return {"message": f"Checked vaccinations for {username}", "notifications_sent": notifications_sent}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error: {e}\nTraceback:\n{error_trace}")
        raise HTTPException(status_code=500, detail=str(e))
