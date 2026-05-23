from pathlib import Path
import traceback

import joblib
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler


def train_and_save() -> None:
    base_dir = Path(__file__).resolve().parent
    data_path = base_dir / ".." / "processed_datasets" / "Mall_Customers.csv"
    model_path = base_dir / ".." / "models" / "customer_segmentation_kmeans.pkl"
    scaler_path = base_dir / ".." / "models" / "customer_segmentation_scaler.pkl"
    encoder_path = base_dir / ".." / "models" / "customer_segmentation_gender_encoder.pkl"

    model_path.parent.mkdir(parents=True, exist_ok=True)

    data = pd.read_csv(data_path)
    if "Gender" not in data.columns:
        raise ValueError("Gender column not found in dataset")

    encoder = LabelEncoder()
    data["Gender"] = encoder.fit_transform(data["Gender"].astype(str))

    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)

    model = KMeans(n_clusters=4, random_state=42)
    model.fit(scaled_data)

    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(encoder, encoder_path)

    print("Customer segmentation model saved successfully")


if __name__ == "__main__":
    try:
        train_and_save()
    except Exception as exc:
        print(f"Training failed: {exc}")
        traceback.print_exc()
