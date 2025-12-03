"use client";

import {useState} from "react";
import Navbar from "./components/Navbar";
import ImageUpload from "./components/ImageUpload";
import PredictionResult from "./components/PredictionResult";

interface PredictionResultType {
  prediction: string;
  confidence_percentage: string;
  is_real: boolean;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Deepfake Image Detection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload any image to instantly verify its authenticity using
            state-of-the-art machine learning technology
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <ImageUpload
            onFileSelect={handleFileSelect}
            preview={preview}
            onReset={reset}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 animate-slideDown">
            <div className="bg-red-50 rounded-lg p-4 border shadow-sm">
              <div className="flex items-center">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mb-8">
            <PredictionResult
              prediction={result.prediction}
              confidence_percentage={result.confidence_percentage}
              is_real={result.is_real}
            />
          </div>
        )}
      </div>
    </div>
  );
}
