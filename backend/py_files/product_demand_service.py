from pathlib import Path
from typing import Any, Dict, List

import pandas as pd
import pickle
from fastapi import HTTPException
from pydantic import BaseModel


class PredictRequest(BaseModel):
    data: Dict[str, Any]


base_dir = Path(__file__).resolve().parent


def load_bundle() -> Dict[str, Any]:
    model_path = base_dir / ".." / "models" / "product_demand_model.pkl"
    scaler_path = base_dir / ".." / "models" / "product_demand_scaler.pkl"
    data_path = (
        base_dir
        / ".."
        / "processed_datasets"
        / "processed_product_demand_forcasting.csv"
    )

    try:
        with model_path.open("rb") as file_obj:
            model = pickle.load(file_obj)
    except FileNotFoundError as exc:
        raise RuntimeError(f"Model file not found at {model_path}") from exc

    try:
        with scaler_path.open("rb") as file_obj:
            scaler = pickle.load(file_obj)
    except FileNotFoundError as exc:
        raise RuntimeError(f"Scaler file not found at {scaler_path}") from exc

    try:
        training_data = pd.read_csv(data_path)
    except FileNotFoundError as exc:
        raise RuntimeError(f"Training data not found at {data_path}") from exc

    if "Forecast_Demand" not in training_data.columns:
        raise RuntimeError("Forecast_Demand column not found in dataset")

    drop_cols: List[str] = ["Forecast_Demand"]
    if "Date" in training_data.columns:
        drop_cols.append("Date")

    expected_columns = training_data.drop(columns=drop_cols).columns.tolist()

    return {"model": model, "scaler": scaler, "expected_columns": expected_columns}


bundle = load_bundle()


def prepare_input(data: Dict[str, Any], expected_columns: List[str]) -> pd.DataFrame:
    input_df = pd.DataFrame([data])
    return input_df.reindex(columns=expected_columns, fill_value=0)


def predict_product_demand(request: PredictRequest) -> Dict[str, Any]:
    if not request.data:
        raise HTTPException(status_code=400, detail="Input data is required")

    input_df = prepare_input(request.data, bundle["expected_columns"])
    scaled_input = bundle["scaler"].transform(input_df)
    prediction = bundle["model"].predict(scaled_input)[0]

    return {"prediction": float(prediction)}
