import pytest
from httpx import AsyncClient
from app import app

@pytest.mark.asyncio
async def test_users_and_tasks():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        r = await ac.get('/users')
        assert r.status_code == 200
        users = r.json()
        assert isinstance(users, list)

        r2 = await ac.get('/tasks')
        assert r2.status_code == 200
        tasks = r2.json()
        assert isinstance(tasks, list)

@pytest.mark.asyncio
async def test_create_task_and_get():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        payload = {"title": "Inspect unit", "description": "Visual inspection", "assignedTo": "1", "assignedBy": "4"}
        r = await ac.post('/tasks', json=payload)
        assert r.status_code == 200
        t = r.json()
        assert t['title'] == 'Inspect unit'

        r2 = await ac.get(f"/tasks/{t['id']}")
        assert r2.status_code == 200
        assert r2.json()['id'] == t['id']
