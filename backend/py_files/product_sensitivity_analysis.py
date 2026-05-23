import os

import numpy as np
import pandas as pd
from joblib import dump
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeRegressor


def load_data() -> pd.DataFrame:
    base_dir = os.path.dirname(os.path.dirname(__file__))
    features_path = os.path.join(
        base_dir,
        "processed_datasets",
        "processed_dynamic_pricing.csv",
    )
    target_path = os.path.join(
        base_dir,
        "raw_datasets",
        "dynamic_pricing.csv",
    )

    features_df = pd.read_csv(features_path)
    target_df = pd.read_csv(target_path)

    if "Historical_Cost_of_Ride" not in target_df.columns:
        raise ValueError("Historical_Cost_of_Ride column not found in target data")
    if len(features_df) != len(target_df):
        raise ValueError("Features and target data row counts do not match")

    features_df["Historical_Cost_of_Ride"] = target_df["Historical_Cost_of_Ride"]
    return features_df


def label_encode_categoricals(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    label_encoders: dict[str, LabelEncoder] = {}
    categorical_columns = df.select_dtypes(include=["object", "category"]).columns

    for col in categorical_columns:
        encoder = LabelEncoder()
        df[col] = encoder.fit_transform(df[col].astype(str))
        label_encoders[col] = encoder

    return df, label_encoders


def train_decision_tree(df: pd.DataFrame) -> tuple[DecisionTreeRegressor, dict]:
    target_column = "Historical_Cost_of_Ride"
    if target_column not in df.columns:
        raise ValueError(f"Missing target column: {target_column}")

    df, label_encoders = label_encode_categoricals(df)
    X = df.drop(columns=[target_column])
    y = df[target_column]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )

    model = DecisionTreeRegressor(random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print("Model Evaluation")
    print(f"MAE: {mae:.4f}")
    print(f"MSE: {mse:.4f}")
    print(f"R2: {r2:.4f}")

    return model, label_encoders


def save_artifacts(model: DecisionTreeRegressor, label_encoders: dict) -> None:
    base_dir = os.path.dirname(os.path.dirname(__file__))
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    model_path = os.path.join(models_dir, "product_sensitivity_dt_model.joblib")
    encoder_path = os.path.join(models_dir, "product_sensitivity_label_encoders.joblib")
    dump(model, model_path)
    dump(label_encoders, encoder_path)
    print("Saved model to:", model_path)
    print("Saved label encoders to:", encoder_path)


def main() -> None:
    df = load_data()
    model, label_encoders = train_decision_tree(df)
    save_artifacts(model, label_encoders)


if __name__ == "__main__":
    main()