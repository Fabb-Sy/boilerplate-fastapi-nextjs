import asyncio
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from app.schemas.task import TaskCreateRequest, TaskResponse, TaskStatus


class TaskService:
    """Service handling background tasks and pipeline workflows."""

    def __init__(self):
        # In-memory storage for skeleton (replace with Redis/Database for distributed setup)
        self._tasks: Dict[str, TaskResponse] = {}

    def list_tasks(self) -> List[TaskResponse]:
        return list(self._tasks.values())

    def get_task(self, task_id: str) -> Optional[TaskResponse]:
        return self._tasks.get(task_id)

    async def create_task(self, req: TaskCreateRequest) -> TaskResponse:
        task_id = str(uuid.uuid4())
        now = datetime.utcnow()
        task = TaskResponse(
            id=task_id,
            title=req.title,
            status=TaskStatus.PENDING,
            progress=0,
            result=None,
            created_at=now,
            updated_at=now,
        )
        self._tasks[task_id] = task
        # Trigger background processing
        asyncio.create_task(self._process_task_job(task_id, req.payload))
        return task

    async def _process_task_job(self, task_id: str, payload: Optional[dict]):
        """Simulate a multi-stage background worker pipeline."""
        if task_id not in self._tasks:
            return

        # Stage 1: Processing started
        self._tasks[task_id].status = TaskStatus.PROCESSING
        self._tasks[task_id].progress = 25
        self._tasks[task_id].updated_at = datetime.utcnow()
        await asyncio.sleep(1)

        # Stage 2: In-progress
        self._tasks[task_id].progress = 75
        self._tasks[task_id].updated_at = datetime.utcnow()
        await asyncio.sleep(1)

        # Stage 3: Completed
        self._tasks[task_id].status = TaskStatus.COMPLETED
        self._tasks[task_id].progress = 100
        self._tasks[task_id].result = {
            "output_file": f"output_{task_id[:8]}.mp4",
            "metadata": payload or {},
            "processed_at": datetime.utcnow().isoformat(),
        }
        self._tasks[task_id].updated_at = datetime.utcnow()


task_service = TaskService()
