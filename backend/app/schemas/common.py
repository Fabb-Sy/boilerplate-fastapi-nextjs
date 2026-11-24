from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Standard unified API response envelope for all endpoints."""
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None
    errors: Optional[Any] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    environment: str
