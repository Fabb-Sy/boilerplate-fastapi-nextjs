from datetime import datetime
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class TaskCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Task or job title")
    payload: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Job parameters")


class TaskResponse(BaseModel):
    id: str
    title: str
    status: TaskStatus
    progress: int = Field(default=0, ge=0, le=100)
    result: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
