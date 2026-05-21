from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sys
from typing import Any, Dict

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

base_dir = Path(__file__).resolve().parent
sys.path.append(str(base_dir / "py_files"))

from churn_service import PredictRequest as ChurnRequest, predict_churn  # noqa: E402
from market_response_service import (  # noqa: E402
	MarketResponseRequest,
	predict_market_response,
)
from subscription_service import (  # noqa: E402
	PredictRequest as SubscriptionRequest,
	predict_subscription,
)


@app.get("/")
def health_check() -> Dict[str, str]:
	return {"status": "ok"}


@app.post("/predict/churn")
def churn_endpoint(request: ChurnRequest) -> Dict[str, Any]:
	return predict_churn(request)


@app.post("/predict/subscription")
def subscription_endpoint(request: SubscriptionRequest) -> Dict[str, Any]:
	return predict_subscription(request)


@app.post("/predict/market")
def market_endpoint(request: MarketResponseRequest) -> Dict[str, Any]:
	return predict_market_response(request)
