import torch
import torchvision.transforms as transforms
from PIL import Image
from typing import Dict
from io import BytesIO


class DeepfakePredictor:
    def __init__(self, model_path: str, device: str = None):
        """
        Initialize the predictor with model path and device.

        Args:
            model_path: Path to the trained model file
            device: Device to run inference on ('cuda' or 'cpu')
        """
        self.device = device if device else torch.device(
            "cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.model_path = model_path

        # Image preprocessing pipeline
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])

        self.load_model()

    def load_model(self):
        """Load the trained model from disk."""
        try:
            self.model = torch.load(
                self.model_path,
                map_location=self.device,
                weights_only=False
            )
            self.model.to(self.device)
            self.model.eval()
            print(f"Model loaded successfully on {self.device}")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise

    def preprocess_image(self, image_bytes: bytes) -> torch.Tensor:
        """
        Preprocess image bytes for model inference.

        Args:
            image_bytes: Raw image bytes

        Returns:
            Preprocessed image tensor
        """
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        return image_tensor

    def predict(self, image_bytes: bytes) -> Dict[str, any]:
        """
        Make prediction on image.

        Args:
            image_bytes: Raw image bytes

        Returns:
            Dictionary containing prediction results
        """
        if self.model is None:
            raise RuntimeError("Model not loaded")

        # Preprocess image
        image_tensor = self.preprocess_image(image_bytes)

        # Make prediction
        with torch.no_grad():
            output = self.model(image_tensor)
            confidence = output.item()
            prediction = int(confidence > 0.5)

        # Prepare result
        result = {
            "prediction": "fake" if prediction == 1 else "real",
            "is_real": bool(prediction == 0),
            "confidence_percentage": f"{confidence * 100:.2f}%" if prediction == 1 else f"{(1 - confidence) * 100:.2f}%"
        }

        return result

    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.model is not None
