import requests


def test_api(image_path):
    url = "http://localhost:8000/predict"

    with open(image_path, "rb") as f:
        files = {"file": (image_path, f, "image/jpeg")}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        result = response.json()
        print(f"Prediction: {result['prediction']}")
        print(f"Confidence: {result['confidence_percentage']}")
        print(f"Is Real: {result['is_real']}")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())


if __name__ == "__main__":
    # Test with an image path
    test_api("path/to/test/image.jpg")
