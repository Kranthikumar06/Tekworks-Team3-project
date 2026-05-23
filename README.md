# Tekworks-Team3-project

Full-stack ML system that serves multiple prediction models through a FastAPI backend and a Vite + React frontend.

## Features
- Churn prediction
- Subscription renewal prediction
- Market response prediction
- Product demand forecasting
- Product sensitivity prediction
- Purchase propensity prediction
- Customer segmentation (KMeans + t-SNE coordinates)

## Quick Start

### Backend
```bash
pip install -r backend/requirements.txt
cd backend
uvicorn app:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Base URL
Set VITE_API_BASE_URL if the backend runs on a different host or port:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Training Scripts
Run training scripts to generate model artifacts in backend/models:
- backend/py_files/churn.py
- backend/py_files/market_responce.py
- backend/py_files/product_demand.py
- backend/py_files/product_sensitivity_analysis.py
- backend/py_files/subscription.py
- backend/py_files/purchase_propensity.py
- backend/py_files/customer_segmentation.py

## Endpoints
Base URL: http://127.0.0.1:8000

- POST /predict/churn
- POST /predict/subscription
- POST /predict/market
- POST /predict/product-demand
- POST /predict/product-sensitivity
- POST /predict/purchase-propensity
- POST /predict/customer-segmentation

See document.md for full usage details and request examples.