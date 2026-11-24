from typing import Any, Optional
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.schemas.common import ApiResponse


class AppException(Exception):
    """Base application exception with status code and detail message."""
    def __init__(
        self,
        message: str = "An error occurred",
        status_code: int = status.HTTP_400_BAD_REQUEST,
        errors: Optional[Any] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.errors = errors
        super().__init__(message)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    content = ApiResponse(
        success=False,
        message=exc.message,
        data=None,
        errors=exc.errors
    )
    return JSONResponse(status_code=exc.status_code, content=content.model_dump())


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    content = ApiResponse(
        success=False,
        message=str(exc.detail),
        data=None,
        errors=None
    )
    return JSONResponse(status_code=exc.status_code, content=content.model_dump())


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    content = ApiResponse(
        success=False,
        message="Request validation error",
        data=None,
        errors=exc.errors()
    )
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=content.model_dump())
