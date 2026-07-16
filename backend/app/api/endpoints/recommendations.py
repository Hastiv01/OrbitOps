from fastapi import APIRouter
from typing import List, Dict
from app.ml.recommendations import generate_recommendations

router = APIRouter()

@router.get("")
async def get_recommendations() -> List[Dict]:
    return generate_recommendations()
