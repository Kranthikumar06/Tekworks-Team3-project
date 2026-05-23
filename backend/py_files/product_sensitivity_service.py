from pathlib import Path
from typing import Any, Dict

import joblib
import pandas as pd
from fastapi import HTTPException
from pydantic import BaseModel


class PredictRequest(BaseModel):
    data: Dict[str, Any]


base_dir = Path(__file__).resolve().parent
model_path = base_dir / ".." / "models" / "product_sensitivity_dt_model.joblib"
encoder_path = (
    base_dir / ".." / "models" / "product_sensitivity_label_encoders.joblib"
)
data_path = (
    base_dir
    / ".."
    / "processed_datasets"
    / "processed_dynamic_pricing.csv"
)

try:
    product_sensitivity_model = joblib.load(model_path)
    product_sensitivity_encoders = joblib.load(encoder_path)
except FileNotFoundError as exc:
    raise RuntimeError(
        "Product sensitivity model artifacts not found. "
        "Run backend/py_files/product_sensitivity_analysis.py first."
    ) from exc

try:
    training_data = pd.read_csv(data_path)
except FileNotFoundError as exc:
    raise RuntimeError(f"Training data not found at {data_path}") from exc

expected_columns = training_data.columns.tolist()


def prepare_input(data: Dict[str, Any]) -> pd.DataFrame:
    input_df = pd.DataFrame([data])

    for column, encoder in product_sensitivity_encoders.items():
        if column not in input_df.columns:
            continue
        try:
            input_df[column] = encoder.transform(input_df[column].astype(str))
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid value for {column}: {exc}",
            ) from exc

    return input_df.reindex(columns=expected_columns, fill_value=0)


def predict_product_sensitivity(request: PredictRequest) -> Dict[str, Any]:
    if not request.data:
        raise HTTPException(status_code=400, detail="Input data is required")

    input_df = prepare_input(request.data)
    prediction = product_sensitivity_model.predict(input_df)[0]

    return {"prediction": float(prediction)}
