from typing import List
from fastapi import APIRouter, status
from app.core.exceptions import AppException
from app.schemas.common import ApiResponse
from app.schemas.task import TaskCreateRequest, TaskResponse
from app.services.task_service import task_service

router = APIRouter()


@router.get("", response_model=ApiResponse[List[TaskResponse]], summary="List all tasks")
async def list_tasks() -> ApiResponse[List[TaskResponse]]:
    tasks = task_service.list_tasks()
    return ApiResponse(
        success=True,
        message="Tasks retrieved successfully",
        data=tasks,
    )


@router.post("", response_model=ApiResponse[TaskResponse], status_code=status.HTTP_201_CREATED, summary="Create a new task")
async def create_task(request: TaskCreateRequest) -> ApiResponse[TaskResponse]:
    task = await task_service.create_task(request)
    return ApiResponse(
        success=True,
        message="Task queued successfully",
        data=task,
    )


@router.get("/{task_id}", response_model=ApiResponse[TaskResponse], summary="Get task status by ID")
async def get_task(task_id: str) -> ApiResponse[TaskResponse]:
    task = task_service.get_task(task_id)
    if not task:
        raise AppException(
            message=f"Task with ID '{task_id}' not found",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return ApiResponse(
        success=True,
        message="Task details retrieved",
        data=task,
    )
