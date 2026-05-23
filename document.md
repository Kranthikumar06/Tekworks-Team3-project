# Project Documentation

## Overview
Tekworks-Team3-project is a full-stack ML system that serves multiple predictive models through a FastAPI backend and a Vite + React frontend. The backend exposes REST endpoints for inference. The frontend provides a unified UI to submit feature inputs and view predictions.

## Repository Layout
- backend/: FastAPI app, training scripts, models, and datasets
- frontend/: React app (Vite)

## Backend
### Install
```bash
pip install -r backend/requirements.txt
```

### Run API
```bash
cd backend
uvicorn app:app --reload
```

### Training Scripts (backend/py_files)
Run these to generate model artifacts in backend/models:
- churn.py
- market_responce.py
- product_demand.py
- product_sensitivity_analysis.py
- subscription.py
- purchase_propensity.py
- customer_segmentation.py

### Datasets
- Raw datasets in backend/raw_datasets
- Processed datasets in backend/processed_datasets

### API Endpoints
Base URL: http://127.0.0.1:8000

- GET /
  - Health check

- POST /predict/churn
  - Body: {"data": { ... }}

- POST /predict/subscription
  - Body: {"data": { ... }}
  - Response includes text label and numeric value.

- POST /predict/market
  - Body: {"age": 35, "annual_income": 65000, "credit_score": 720, "no_of_children": 2, "gender": "Male", "employed": "Yes", "marital_status": "Married"}

- POST /predict/product-demand
  - Body: {"data": { ... }}

- POST /predict/product-sensitivity
  - Body: {"data": { ... }}

- POST /predict/purchase-propensity
  - Body: {"data": { ... }}

- POST /predict/customer-segmentation
  - Body: {"data": {"Gender": "Male", "Age": 27, "Annual Income (k$)": 48, "Spending Score (1-100)": 62}}
  - Response includes segment label, numeric cluster, and t-SNE coordinates.

## Frontend
### Install
```bash
cd frontend
npm install
```

### Run
```bash
npm run dev
```

### API Base URL
Set VITE_API_BASE_URL if needed:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Notes
- The backend expects models to exist in backend/models. Run the training scripts if artifacts are missing.
- Some endpoints return both text labels and numeric predictions for clarity.
