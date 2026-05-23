from pathlib import Path
from typing import Any, Dict, Tuple

import joblib
import pandas as pd
from fastapi import HTTPException
from pydantic import BaseModel
from sklearn.manifold import TSNE


class PredictRequest(BaseModel):
    data: Dict[str, Any]


base_dir = Path(__file__).resolve().parent
model_path = base_dir / ".." / "models" / "customer_segmentation_kmeans.pkl"
scaler_path = base_dir / ".." / "models" / "customer_segmentation_scaler.pkl"
encoder_path = base_dir / ".." / "models" / "customer_segmentation_gender_encoder.pkl"
data_path = base_dir / ".." / "processed_datasets" / "Mall_Customers.csv"

try:
    kmeans_model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    gender_encoder = joblib.load(encoder_path)
except FileNotFoundError as exc:
    raise RuntimeError(
        "Customer segmentation artifacts not found. "
        "Run backend/py_files/customer_segmentation.py first."
    ) from exc

try:
    training_data = pd.read_csv(data_path)
except FileNotFoundError as exc:
    raise RuntimeError(f"Training data not found at {data_path}") from exc

expected_columns = training_data.columns.tolist()


def prepare_input(data: Dict[str, Any]) -> pd.DataFrame:
    input_df = pd.DataFrame([data])

    if "Gender" in input_df.columns:
        try:
            input_df["Gender"] = gender_encoder.transform(
                input_df["Gender"].astype(str)
            )
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid value for Gender: {exc}",
            ) from exc

    return input_df.reindex(columns=expected_columns, fill_value=0)


def compute_tsne_point(
    scaled_training: pd.DataFrame, scaled_input_row: pd.DataFrame
) -> Tuple[float, float]:
    combined = pd.concat([scaled_training, scaled_input_row], ignore_index=True)
    if combined.shape[0] < 2:
        return 0.0, 0.0

    perplexity = min(30, combined.shape[0] - 1)
    tsne = TSNE(n_components=2, random_state=42, perplexity=perplexity)
    coords = tsne.fit_transform(combined)
    return float(coords[-1, 0]), float(coords[-1, 1])


def predict_customer_segmentation(request: PredictRequest) -> Dict[str, Any]:
    if not request.data:
        raise HTTPException(status_code=400, detail="Input data is required")

    input_df = prepare_input(request.data)
    scaled_input = scaler.transform(input_df)
    prediction = kmeans_model.predict(scaled_input)[0]

    training_copy = training_data.copy()
    if "Gender" in training_copy.columns:
        training_copy["Gender"] = gender_encoder.transform(
            training_copy["Gender"].astype(str)
        )

    scaled_training = pd.DataFrame(
        scaler.transform(training_copy),
        columns=expected_columns,
    )
    scaled_input_df = pd.DataFrame(scaled_input, columns=expected_columns)

    tsne_x, tsne_y = compute_tsne_point(scaled_training, scaled_input_df)

    prediction_int = int(prediction)
    segment_labels = {
        0: "At-Risk Customers",
        1: "Occasional Customers",
        2: "Regular Customers",
        3: "High-Value Customers",
    }

    return {
        "prediction": segment_labels.get(prediction_int, "Unknown"),
        "prediction_numeric": prediction_int,
        "tsne": {"x": tsne_x, "y": tsne_y},
    }
