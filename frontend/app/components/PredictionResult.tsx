"use client";

interface PredictionResultProps {
  prediction: string;
  confidence_percentage: string;
  is_real: boolean;
}

export default function PredictionResult({
  prediction,
  confidence_percentage,
  is_real,
}: PredictionResultProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border animate-fade-in">
      <div className="text-center mb-6">
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            is_real ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {is_real ? (
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Analysis Complete
        </h3>
        <p className="text-gray-600">
          Here are the results of the deepfake detection
        </p>
      </div>

      <div className="space-y-4">
        {/* Prediction */}
        <div className="bg-linear-to-r from-green-50 to-emerald-50 p-3 rounded-xl border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Prediction
              </p>
              <p
                className={`text-2xl font-bold ${
                  is_real ? "text-green-600" : "text-red-600"
                }`}
              >
                {prediction.toUpperCase()}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full font-semibold ${
                is_real ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {is_real ? "✓ Verified" : "⚠ Warning"}
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">
              Confidence Level
            </p>
            <p className="text-2xl font-bold text-green-600">
              {confidence_percentage}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                is_real ? "bg-green-600" : "bg-red-600"
              }`}
              style={{
                width: confidence_percentage,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
