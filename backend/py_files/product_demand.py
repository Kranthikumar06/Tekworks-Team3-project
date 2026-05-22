from pathlib import Path
import traceback

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pickle


def train_and_save() -> None:
	base_dir = Path(__file__).resolve().parent
	data_path = (
		base_dir
		/ ".."
		/ "processed_datasets"
		/ "processed_product_demand_forcasting.csv"
	)
	model_path = base_dir / ".." / "models" / "product_demand_model.pkl"
	scaler_path = base_dir / ".." / "models" / "product_demand_scaler.pkl"
	model_path.parent.mkdir(parents=True, exist_ok=True)

	data = pd.read_csv(data_path)

	if "Forecast_Demand" not in data.columns:
		raise ValueError("Forecast_Demand column not found in dataset")

	# Drop the date column to avoid leaking sequential ordering into the model.
	drop_cols = ["Forecast_Demand"]
	if "Date" in data.columns:
		drop_cols.append("Date")

	features = data.drop(columns=drop_cols)
	target = data["Forecast_Demand"]

	X_train, X_test, y_train, y_test = train_test_split(
		features, target, test_size=0.2, random_state=42
	)

	scaler = StandardScaler()
	X_train_scaled = scaler.fit_transform(X_train)
	X_test_scaled = scaler.transform(X_test)

	model = RandomForestRegressor(n_estimators=200, random_state=42)
	model.fit(X_train_scaled, y_train)

	with model_path.open("wb") as file_obj:
		pickle.dump(model, file_obj)

	with scaler_path.open("wb") as file_obj:
		pickle.dump(scaler, file_obj)

	score = model.score(X_test_scaled, y_test)
	print(f"Product demand model saved. R2 score: {score:.4f}")


if __name__ == "__main__":
	try:
		train_and_save()
	except Exception as exc:
		print(f"Training failed: {exc}")
		traceback.print_exc()
