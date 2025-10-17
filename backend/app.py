from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


# Import from data.mockData
from data.mockData import (
    mockUsers,
    mockTasks,
    mockSkills,
    mockDailyReports,
    mockEmployeePerformance,
    mockSkillGaps,
    mockWorkforceAnalytics,
    mockTrainingSuggestions
)

from flask import Flask, jsonify, request
from data.mockData import mockTasks

app = Flask(__name__)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(mockTasks)

@app.route('/api/tasks', methods=['POST'])
def update_tasks():
    # Here we receive updated tasks (like status change)
    updated_tasks = request.json
    with open('data/mockData.py', 'w') as f:
        f.write(f"mockTasks = {updated_tasks}")
    return jsonify({"message": "Tasks updated successfully"})


app = FastAPI(title="Optiwork API", version="1.0.0")


# ---------------- CORS Configuration ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- In-Memory Data Storage ----------------
# Create deep copies to prevent modification of original mock data
def deep_copy_list(data):
    """Helper to create deep copies of list data"""
    return [item.copy() if isinstance(item, dict) else item for item in data]


USERS = deep_copy_list(mockUsers)
TASKS = deep_copy_list(mockTasks)
SKILLS = deep_copy_list(mockSkills)
REPORTS = deep_copy_list(mockDailyReports)
PERFORMANCE = deep_copy_list(mockEmployeePerformance)
SKILL_GAPS = deep_copy_list(mockSkillGaps)
ANALYTICS = mockWorkforceAnalytics.copy() if isinstance(mockWorkforceAnalytics, dict) else mockWorkforceAnalytics
TRAINING = deep_copy_list(mockTrainingSuggestions)


# ---------------- Pydantic Models ----------------
class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    ok: bool
    user: Dict[str, Any]


class TaskIn(BaseModel):
    title: str
    description: Optional[str] = None
    assignedTo: Optional[str] = None
    assignedBy: Optional[str] = None
    priority: Optional[str] = "medium"
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    dueDate: Optional[str] = None
    requiredSkills: Optional[List[str]] = []


# ---------------- Root Endpoint ----------------
@app.get("/")
def root():
    """API root endpoint"""
    return {
        "message": "Optiwork API",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "users": "/users",
            "login": "/login",
            "tasks": "/tasks",
            "skills": "/skills",
            "reports": "/reports",
            "analytics": "/analytics"
        }
    }


# ---------------- User Endpoints ----------------
@app.get("/users")
def list_users():
    """Get all users"""
    return USERS


@app.get("/users/{user_id}")
def get_user(user_id: str):
    """Get specific user by ID"""
    user = next((u for u in USERS if u.get("id") == user_id), None)
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")


@app.post("/login")
def login(credentials: Dict[str, str]):
    """
    Login endpoint - validates credentials and returns user data
    Accepts: {username: str, password: str}
    Returns: {ok: bool, user: dict}
    """
    username = credentials.get("username")
    password = credentials.get("password")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    # Search for user by id, employeeId, or email
    for user in USERS:
        if username in [user.get("id"), user.get("employeeId"), user.get("email")]:
            # Check password
            if user.get("password") == password:
                return {"ok": True, "user": user}
            else:
                raise HTTPException(status_code=401, detail="Invalid password")
    
    raise HTTPException(status_code=401, detail="User not found")


# ---------------- Task Endpoints ----------------
@app.get("/tasks")
def list_tasks():
    """Get all tasks"""
    return TASKS


@app.get("/tasks/{task_id}")
def get_task(task_id: str):
    """Get specific task by ID"""
    task = next((t for t in TASKS if t.get("id") == task_id), None)
    if task:
        return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.post("/tasks")
def create_task(task_data: Dict[str, Any]):
    """Create a new task"""
    new_task = task_data.copy()
    new_task["id"] = str(int(datetime.utcnow().timestamp() * 1000))
    new_task["status"] = "pending"
    new_task["completedAt"] = None
    TASKS.append(new_task)
    return new_task


@app.patch("/tasks/{task_id}")
def update_task(task_id: str, changes: Dict[str, Any]):
    """Update an existing task"""
    task = next((t for t in TASKS if t.get("id") == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update task fields
    task.update(changes)
    
    # Auto-set completedAt if status is completed
    if changes.get("status") == "completed" and not task.get("completedAt"):
        task["completedAt"] = datetime.utcnow().isoformat()
    
    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    """Delete a task"""
    global TASKS
    task = next((t for t in TASKS if t.get("id") == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    TASKS = [t for t in TASKS if t.get("id") != task_id]
    return {"ok": True, "message": "Task deleted"}


# ---------------- Skills Endpoints ----------------
@app.get("/skills")
def list_skills():
    """Get all skills"""
    return SKILLS


@app.get("/skills/{skill_id}")
def get_skill(skill_id: str):
    """Get specific skill by ID"""
    skill = next((s for s in SKILLS if s.get("id") == skill_id), None)
    if skill:
        return skill
    raise HTTPException(status_code=404, detail="Skill not found")


# ---------------- Reports Endpoints ----------------
@app.get("/reports")
def list_reports():
    """Get all daily reports"""
    return REPORTS


@app.get("/reports/{date}")
def get_report_by_date(date: str):
    """Get report for specific date"""
    report = next((r for r in REPORTS if r.get("date") == date), None)
    if report:
        return report
    raise HTTPException(status_code=404, detail="Report not found")


# ---------------- Performance Endpoints ----------------
@app.get("/performance")
def list_performance():
    """Get all performance data"""
    return PERFORMANCE

@app.get("/performance/{employee_id}")
def get_performance(employee_id: str):
    """Get performance data for specific employee"""
    perf = next(
        (p for p in PERFORMANCE if p.get("employeeId") == employee_id or p.get("employee_id") == employee_id),
        None
    )
    if not perf:
        raise HTTPException(status_code=404, detail="Performance data not found")
    return perf


# ---------------- Analytics Endpoints ----------------
@app.get("/analytics")
def get_analytics():
    """Get workforce analytics data"""
    return ANALYTICS


# ---------------- Training Suggestions ----------------
@app.get("/training-suggestions")
def get_training_suggestions():
    """Get training suggestions for all employees"""
    return TRAINING


@app.get("/training-suggestions/{employee_id}")
def get_employee_training(employee_id: str):
    """Get training suggestions for specific employee"""
    suggestions = [t for t in TRAINING if t.get("employeeId") == employee_id]
    return suggestions


# ---------------- Skill Gaps ----------------
@app.get("/skill-gaps")
def get_skill_gaps():
    """Get skill gap analysis"""
    return SKILL_GAPS


# ---------------- Utility Endpoints ----------------
@app.post("/reset")
def reset_data():
    """Reset all data to initial mock values"""
    global USERS, TASKS, SKILLS, REPORTS, PERFORMANCE, SKILL_GAPS, ANALYTICS, TRAINING
    
    USERS = deep_copy_list(mockUsers)
    TASKS = deep_copy_list(mockTasks)
    SKILLS = deep_copy_list(mockSkills)
    REPORTS = deep_copy_list(mockDailyReports)
    PERFORMANCE = deep_copy_list(mockEmployeePerformance)
    SKILL_GAPS = deep_copy_list(mockSkillGaps)
    ANALYTICS = mockWorkforceAnalytics.copy() if isinstance(mockWorkforceAnalytics, dict) else mockWorkforceAnalytics
    TRAINING = deep_copy_list(mockTrainingSuggestions)
    
    return {"ok": True, "message": "All data reset to initial values"}


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "data_counts": {
            "users": len(USERS),
            "tasks": len(TASKS),
            "skills": len(SKILLS),
            "reports": len(REPORTS)
        }
    }
