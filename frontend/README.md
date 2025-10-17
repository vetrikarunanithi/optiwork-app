# Optiwork - AI-Powered Workforce Optimization Platform

> Intelligent workforce management system designed for manufacturing excellence with real-time task tracking, skill-based assignment, and predictive analytics.

## Features

### Employee Portal
- **Real-time Task Dashboard** - View and manage daily tasks with priority indicators
- **Interactive Checklists** - Step-by-step task completion tracking
- **Skill Profile Management** - Track certifications and skill levels
- **Performance Insights** - Personal productivity metrics
- **Task Feedback System** - Rate task difficulty and provide insights
- **AI Coaching Assistant** - Get instant help and guidance

### Admin Dashboard
- **Workforce Analytics** - Comprehensive performance metrics and trends
- **Smart Task Assignment** - AI-powered skill-based task matching
- **Employee Management** - View team performance and workload
- **Real-time Reports** - Daily completion rates and productivity tracking
- **Skill Gap Analysis** - Identify training needs automatically
- **Productivity Heatmaps** - Visual representation of team efficiency
- **Predictive Alerts** - Proactive notifications for workload imbalances
- **Export Reports** - Download analytics as CSV

## Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **UI Library:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts
- **State Management:** React Hooks + Context
- **Persistence:** localStorage for session management

### Backend
- **Framework:** FastAPI (Python 3.8+)
- **API Style:** RESTful
- **CORS:** Enabled for development
- **Data:** Mock data (easily replaceable with database)

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone Repository
- git clone 
- cd optiwork


### 2. Backend Setup
- cd backend

## Create virtual environment
- python -m venv .venv

## Activate virtual environment
- Windows:
- .venv\Scripts\activate

## Mac/Linux:
- source .venv/bin/activate

## Install dependencies
- pip install -r requirements.txt

## Run backend server
- python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000

**Backend URL:** http://127.0.0.1:8000  
**API Docs:** http://127.0.0.1:8000/docs

### 3. Frontend Setup
cd frontend

## Install dependencies
npm install

## Start development server
npm run dev

**Frontend URL:** http://localhost:5173

## Demo Credentials

### Employee Access
| Employee ID|      Name    | Department | Password |
|------------|--------------|------------|----------|
| EMP001     | Kumar R      | Welding    | emp1122  |
| EMP002     | Manikandan   | Assembly   | emp2233  |
| EMP003     | Dharan       | Quality    | emp3344  |

### Admin Access
| Username | Role    | Password |
|----------|---------|----------|
| admin    | Manager | admin123 |
