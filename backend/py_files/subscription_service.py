from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
import pickle
from fastapi import HTTPException
from pydantic import BaseModel
from sklearn.preprocessing import LabelEncoder


class PredictRequest(BaseModel):
    data: Dict[str, Any]


base_dir = Path(__file__).resolve().parent


def load_bundle() -> Dict[str, Any]:
    model_path = base_dir / ".." / "models" / "subscription_renewal_model.pkl"
    data_path = base_dir / ".." / "processed_datasets" / "subscription_renewal_data.csv"

    try:
        with model_path.open("rb") as file_obj:
            model = pickle.load(file_obj)
    except FileNotFoundError as exc:
        raise RuntimeError(f"Model file not found at {model_path}") from exc

    try:
        training_data = pd.read_csv(data_path)
    except FileNotFoundError as exc:
        raise RuntimeError(f"Training data not found at {data_path}") from exc

    categorical_cols = training_data.select_dtypes(include=["object", "category"]).columns.tolist()
    if "Churn" in categorical_cols:
        categorical_cols.remove("Churn")

    label_encoders: Dict[str, LabelEncoder] = {}
    for column in categorical_cols:
        encoder = LabelEncoder()
        training_data[column] = encoder.fit_transform(training_data[column])
        label_encoders[column] = encoder
    expected_columns = training_data.drop("Churn", axis=1).columns.tolist()

    return {
        "model": model,
        "categorical_cols": categorical_cols,
        "expected_columns": expected_columns,
        "label_encoders": label_encoders,
    }


def prepare_input(
    data: Dict[str, Any],
    categorical_cols: List[str],
    expected_columns: List[str],
    label_encoders: Optional[Dict[str, LabelEncoder]] = None,
) -> pd.DataFrame:
    input_df = pd.DataFrame([data])
    label_encoders = label_encoders or {}
    for column in categorical_cols:
        if column not in input_df.columns:
            continue
        encoder = label_encoders.get(column)
        if encoder is None:
            continue
        try:
            input_df[column] = encoder.transform(input_df[column])
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid value for {column}: {exc}",
            ) from exc
    return input_df.reindex(columns=expected_columns, fill_value=0)


bundle = load_bundle()


def predict_subscription(request: PredictRequest) -> Dict[str, Any]:
    if not request.data:
        raise HTTPException(status_code=400, detail="Input data is required")

    input_df = prepare_input(
        request.data,
        bundle["categorical_cols"],
        bundle["expected_columns"],
        bundle.get("label_encoders"),
    )

    prediction = bundle["model"].predict(input_df)[0]
    response: Dict[str, Any]
    if isinstance(prediction, (int, float, np.integer, np.floating)):
        prediction_int = int(prediction)
        response = {
            "prediction": "Renew" if prediction_int == 1 else "Not Renew",
            "prediction_numeric": prediction_int,
        }
    else:
        prediction_str = str(prediction)
        response = {"prediction": prediction_str}
        if prediction_str.lower() in {"yes", "no"}:
            response["prediction_numeric"] = 1 if prediction_str.lower() == "yes" else 0

    if hasattr(bundle["model"], "predict_proba"):
        proba = bundle["model"].predict_proba(input_df)[0]
        response["probability"] = float(proba[1])

    return response
