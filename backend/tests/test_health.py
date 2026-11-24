def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "ok"


def test_task_lifecycle(client):
    # 1. Create Task
    create_res = client.post(
        "/api/v1/tasks",
        json={"title": "Test Audio Render", "payload": {"bitrate": 192}},
    )
    assert create_res.status_code == 201
    created_task = create_res.json()["data"]
    task_id = created_task["id"]
    assert created_task["title"] == "Test Audio Render"

    # 2. Get Task by ID
    get_res = client.get(f"/api/v1/tasks/{task_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["id"] == task_id

    # 3. 404 for unknown task
    missing_res = client.get("/api/v1/tasks/non-existent-id")
    assert missing_res.status_code == 404
    assert missing_res.json()["success"] is False
