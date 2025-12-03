from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from predictor import DeepfakePredictor
from model import EfficientNetBinary
import os
from pathlib import Path

app = FastAPI(title="Deepfake Detection API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor with relative path
CURRENT_DIR = Path(__file__).parent
MODEL_PATH = CURRENT_DIR.parent / "models" / "model.pth"

try:
    predictor = DeepfakePredictor(model_path=str(MODEL_PATH))
except Exception as e:
    print(f"Failed to initialize predictor: {e}")
    predictor = None


@app.get("/")
async def root():
    return {"message": "Deepfake Detection API", "status": "running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if predictor is None or not predictor.is_loaded():
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Read image bytes
        image_bytes = await file.read()

        # Make prediction using predictor
        result = predictor.predict(image_bytes)

        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
