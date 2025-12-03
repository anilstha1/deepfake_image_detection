# Deepfake Detection API

## Running the API

1. Install dependencies:

```bash
cd AI/api
pip install -r requirements.txt
```

2. Start the server:

```bash
python main.py
```

3. Test the API:

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@image.jpg"
```

## Running the Frontend

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /` - Root endpoint
- `POST /predict` - Upload image and get prediction