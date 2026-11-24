from fastapi import APIRouter
from app.core.config import settings
from app.schemas.common import ApiResponse, HealthResponse

router = APIRouter()


@router.get("", response_model=ApiResponse[HealthResponse], summary="System Health Status")
async def get_health() -> ApiResponse[HealthResponse]:
    """Check health, application name, version, and current environment."""
    return ApiResponse(
        success=True,
        message="System is operational",
        data=HealthResponse(
            status="ok",
            version="1.0.0",
            environment=settings.ENVIRONMENT,
        ),
    )
