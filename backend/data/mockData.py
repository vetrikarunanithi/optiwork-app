from random import random, randint

mock_skill_evolution = {
    'EMP001': {
        'skill-1': [
            { 'date': '2024-06-01', 'level': 2, 'milestone': 'Started CNC training' },
            { 'date': '2024-08-15', 'level': 3, 'milestone': 'Completed intermediate course' },
            { 'date': '2024-12-01', 'level': 4, 'milestone': 'Achieved expert certification' },
            { 'date': '2025-10-14', 'level': 4 }
        ],
        'skill-2': [
            { 'date': '2024-01-01', 'level': 2 },
            { 'date': '2024-06-01', 'level': 3, 'milestone': 'Advanced welding cert' },
            { 'date': '2025-10-14', 'level': 3 }
        ]
    }
}

mock_skill_endorsements = {
    'EMP001': {
        'skill-1': [
            { 'type': 'certification', 'endorserName': 'AWS D1.1', 'date': '2024-12-01', 'count': 1 },
            { 'type': 'supervisor', 'endorserName': 'Emily Davis', 'date': '2025-01-15', 'count': 1 },
            { 'type': 'peer', 'endorserName': 'Team Members', 'date': '2025-03-20', 'count': 5 },
            { 'type': 'expert', 'endorserName': 'John Senior', 'date': '2024-11-10', 'count': 1 }
        ]
    }
}

mock_task_forecasts = [
    {
        'shiftName': 'Morning',
        'totalTasks': 24,
        'onTrack': 16,
        'atRisk': 5,
        'delayed': 3,
        'predictedCompletion': 75,
        'bottlenecks': [
            'Hydraulic press repair (urgent) - Machine #5 down',
            'High-precision aerospace parts require extra time',
            'Safety training scheduled conflicts with production tasks',
            'Blueprint review delays affecting downstream work'
        ]
    },
    {
        'shiftName': 'Afternoon',
        'totalTasks': 22,
        'onTrack': 17,
        'atRisk': 4,
        'delayed': 1,
        'predictedCompletion': 86,
        'bottlenecks': [
            'CNC programming taking longer than estimated',
            'Quality audit may impact production schedule',
            'Line changeover scheduled mid-shift'
        ]
    },
    {
        'shiftName': 'Night',
        'totalTasks': 8,
        'onTrack': 6,
        'atRisk': 2,
        'delayed': 0,
        'predictedCompletion': 85,
        'bottlenecks': []
    }
]

mock_shift_health = [
    {
        'shiftName': 'Morning',
        'utilization': 82,
        'activeEmployees': 15,
        'totalEmployees': 18,
        'taskCompletion': 85,
        'incidents': 0,
        'status': 'excellent'
    },
    {
        'shiftName': 'Afternoon',
        'utilization': 76,
        'activeEmployees': 14,
        'totalEmployees': 16,
        'taskCompletion': 88,
        'incidents': 0,
        'status': 'excellent'
    },
    {
        'shiftName': 'Night',
        'utilization': 45,
        'activeEmployees': 5,
        'totalEmployees': 8,
        'taskCompletion': 45,
        'incidents': 1,
        'status': 'fair'
    }
]

mock_employee_milestones = {
    'EMP001': [
        {
            'id': 'milestone-1',
            'type': 'certification',
            'title': 'Expert Machinist',
            'description': 'Achieve expert level in CNC Machining',
            'progress': 1,
            'target': 1,
            'achieved': True,
            'achievedDate': '2024-12-01',
            'icon': '🏅',
            'rarity': 'epic'
        },
        {
            'id': 'milestone-2',
            'type': 'streak',
            'title': '100-Day Streak',
            'description': 'Complete tasks for 100 consecutive days',
            'progress': 87,
            'target': 100,
            'achieved': False,
            'icon': '🔥',
            'rarity': 'rare'
        },
        {
            'id': 'milestone-3',
            'type': 'tasks',
            'title': 'Century Mark',
            'description': 'Complete 100 tasks',
            'progress': 145,
            'target': 100,
            'achieved': True,
            'achievedDate': '2025-08-15',
            'icon': '💯',
            'rarity': 'common'
        },
        {
            'id': 'milestone-4',
            'type': 'quality',
            'title': 'Perfectionist',
            'description': 'Maintain 100% quality rating for 50 tasks',
            'progress': 32,
            'target': 50,
            'achieved': False,
            'icon': '⭐',
            'rarity': 'legendary'
        }
    ]
}

mock_leaderboard = [
    {
        'rank': 1,
        'employeeId': 'EMP002',
        'employeeName': 'Sarah Johnson',
        'score': 95,
        'metric': '%',
        'trend': 'up',
        'badge': 'Quality Champion'
    },
    {
        'rank': 2,
        'employeeId': 'EMP009',
        'employeeName': 'Rachel Kim',
        'score': 93,
        'metric': '%',
        'trend': 'up',
        'badge': 'Welding Expert'
    },
    {
        'rank': 3,
        'employeeId': 'EMP001',
        'employeeName': 'John Smith',
        'score': 92,
        'metric': '%',
        'trend': 'same',
        'badge': 'CNC Expert'
    },
    # ... Complete the rest of leaderboard as needed
]
# AI Insights
mock_ai_insights = [
    {
        "type": "prediction",
        "title": "Capacity Alert - Team B",
        "description": "Team B will reach 90% utilization by 2 PM today. Consider redistributing 3 tasks to Team A to prevent overtime and maintain quality standards.",
        "confidence": 87
    },
    {
        "type": "recommendation",
        "title": "Top Performer Recognition",
        "description": "Rachel Kim (EMP009) has achieved 93% performance with expert-level TIG welding. Consider her for mentoring new welding trainees.",
        "confidence": 94
    },
    {
        "type": "recommendation",
        "title": "Skill Training Opportunity",
        "description": "Thomas Anderson (EMP010) shows consistent progress. Recommend advanced assembly certification - predicted to reduce task completion time by 15%.",
        "confidence": 92
    },
    {
        "type": "alert",
        "title": "Equipment Maintenance Due",
        "description": "Machine A-101 requires preventive maintenance within 48 hours. Scheduling now will prevent potential 4-hour downtime next week.",
        "confidence": 95
    },
    {
        "type": "insight",
        "title": "Cross-Shift Collaboration Opportunity",
        "description": "Maria Garcia (EMP007) and Rachel Kim (EMP009) have complementary skills. Pairing them on complex machining projects could improve quality by 18%.",
        "confidence": 89
    },
    {
        "type": "insight",
        "title": "Performance Trend Detected",
        "description": "Morning shift task completion has improved 12% over the past two weeks. Key contributors: EMP001, EMP009, and EMP008.",
        "confidence": 91
    }
]

# Productivity Heatmap Mock Data Example (truncated for brevity)
mock_productivity_heatmap = [
    {
        "hour": "06:00",
        "day": "Mon",
        "productivity": 98,
        "tasksCompleted": 14,
        "utilization": 88,
        "status": "peak"
    },
    {
        "hour": "08:00",
        "day": "Mon",
        "productivity": 76,
        "tasksCompleted": 11,
        "utilization": 76,
        "status": "normal"
    },
    # ... Continue for all days and hours as per your generator logic
]

# Skills Library
mockSkills = [
    {
        "id": "skill-1",
        "name": "CNC Machining",
        "category": "Machining",
        "description": "Operation and programming of CNC machines",
        "requiresCertification": True,
        "department": "Production"
    },
    {
        "id": "skill-2",
        "name": "MIG Welding",
        "category": "Welding",
        "description": "Metal Inert Gas welding techniques",
        "requiresCertification": True,
        "department": "Production"
    },
    {
        "id": "skill-3",
        "name": "Quality Inspection",
        "category": "Quality Control",
        "description": "Visual and measurement-based quality inspection",
        "requiresCertification": True,
        "department": "Quality Control"
    },
    {
        "id": "skill-4",
        "name": "Assembly Line Operations",
        "category": "Assembly",
        "description": "General assembly line work and component installation",
        "requiresCertification": False,
        "department": "Assembly"
    },
    {
        "id": "skill-5",
        "name": "Inventory Management",
        "category": "Logistics",
        "description": "Parts tracking and inventory control",
        "requiresCertification": False,
        "department": "Assembly"
    },
    {
        "id": "skill-6",
        "name": "Safety Compliance",
        "category": "Safety",
        "description": "OSHA safety standards and equipment inspection",
        "requiresCertification": True,
        "department": "All"
    },
    {
        "id": "skill-7",
        "name": "TIG Welding",
        "category": "Welding",
        "description": "Tungsten Inert Gas welding for precision work",
        "requiresCertification": True,
        "department": "Production"
    },
    {
        "id": "skill-8",
        "name": "Blueprint Reading",
        "category": "Technical",
        "description": "Technical drawing interpretation",
        "requiresCertification": False,
        "department": "Production"
    }
]

# Users with Skills
mockUsers = [
    # 🏭 Production Department
    {
        "id": "1",
        "name": "Kumar R",
        "role": "employee",
        "employeeId": "EMP001",
        "department": "Production",
        "shift": "Morning",
        "currentWorkload": 35,
        "performanceScore": 92,
        "skills": [
            {
                "skillId": "skill-1",
                "skillName": "CNC Machining",
                "level": "expert",
                "yearsExperience": 5,
                "certifications": [{
                    "id": "cert-1",
                    "name": "CNC Level 3 Certification",
                    "issueDate": "2023-01-15",
                    "expiryDate": "2026-01-15",
                    "status": "active"
                }],
                "lastUsed": "2025-10-14"
            },
            {
                "skillId": "skill-2",
                "skillName": "MIG Welding",
                "level": "intermediate",
                "yearsExperience": 3,
                "certifications": [{
                    "id": "cert-2",
                    "name": "MIG Welding Certification",
                    "issueDate": "2022-05-20",
                    "expiryDate": "2025-05-20",
                    "status": "active"
                }],
                "lastUsed": "2025-10-10"
            }
        ],
        "password": "emp1122"
    },
    {
        "id": "2",
        "name": "Manikandan",
        "role": "employee",
        "employeeId": "EMP002",
        "department": "Production",
        "shift": "Evening",
        "currentWorkload": 42,
        "performanceScore": 88,
        "skills": [
            {
                "skillId": "skill-3",
                "skillName": "TIG Welding",
                "level": "advanced",
                "yearsExperience": 4,
                "certifications": [{
                    "id": "cert-3",
                    "name": "TIG Welding Certification",
                    "issueDate": "2023-03-10",
                    "expiryDate": "2026-03-10",
                    "status": "active"
                }],
                "lastUsed": "2025-10-13"
            },
            {
                "skillId": "skill-4",
                "skillName": "Blueprint Reading",
                "level": "expert",
                "yearsExperience": 6,
                "certifications": [{
                    "id": "cert-4",
                    "name": "Blueprint Reading Certification",
                    "issueDate": "2022-09-05",
                    "expiryDate": "2025-09-05",
                    "status": "active"
                }],
                "lastUsed": "2025-10-12"
            }
        ],
        "password": "emp2233"
    },

    # 🔍 Quality Control Department
    {
        "id": "3",
        "name": "Dharan",
        "role": "employee",
        "employeeId": "EMP003",
        "department": "Quality Control",
        "shift": "Morning",
        "currentWorkload": 28,
        "performanceScore": 95,
        "skills": [
            {
                "skillId": "skill-5",
                "skillName": "Quality Inspection",
                "level": "expert",
                "yearsExperience": 7,
                "certifications": [{
                    "id": "cert-5",
                    "name": "Quality Inspection Certification",
                    "issueDate": "2022-02-18",
                    "expiryDate": "2025-02-18",
                    "status": "active"
                }],
                "lastUsed": "2025-10-15"
            },
            {
                "skillId": "skill-6",
                "skillName": "Safety Compliance",
                "level": "advanced",
                "yearsExperience": 5,
                "certifications": [{
                    "id": "cert-6",
                    "name": "Safety Compliance Certification",
                    "issueDate": "2023-04-22",
                    "expiryDate": "2026-04-22",
                    "status": "active"
                }],
                "lastUsed": "2025-10-14"
            }
        ],
        "password": "emp3344"
    },
    {
        "id": "4",
        "name": "Samuel Raj",
        "role": "employee",
        "employeeId": "EMP004",
        "department": "Quality Control",
        "shift": "Night",
        "currentWorkload": 31,
        "performanceScore": 90,
        "skills": [
            {
                "skillId": "skill-7",
                "skillName": "Quality Inspection",
                "level": "advanced",
                "yearsExperience": 4,
                "certifications": [{
                    "id": "cert-7",
                    "name": "Quality Inspection Level 2 Certification",
                    "issueDate": "2023-07-11",
                    "expiryDate": "2026-07-11",
                    "status": "active"
                }],
                "lastUsed": "2025-10-15"
            },
            {
                "skillId": "skill-8",
                "skillName": "Inventory Management",
                "level": "intermediate",
                "yearsExperience": 2,
                "certifications": [{
                    "id": "cert-8",
                    "name": "Inventory Management Certification",
                    "issueDate": "2024-01-05",
                    "expiryDate": "2027-01-05",
                    "status": "active"
                }],
                "lastUsed": "2025-10-14"
            }
        ],
        "password": "emp4455"
    },

    # 🔧 Assembly Department
    {
        "id": "5",
        "name": "Nagarajan",
        "role": "employee",
        "employeeId": "EMP005",
        "department": "Assembly",
        "shift": "Morning",
        "currentWorkload": 50,
        "performanceScore": 85,
        "skills": [
            {
                "skillId": "skill-9",
                "skillName": "Assembly Line Operations",
                "level": "advanced",
                "yearsExperience": 6,
                "certifications": [{
                    "id": "cert-9",
                    "name": "Assembly Line Operations Certification",
                    "issueDate": "2023-06-12",
                    "expiryDate": "2026-06-12",
                    "status": "active"
                }],
                "lastUsed": "2025-10-15"
            },
            {
                "skillId": "skill-10",
                "skillName": "Safety Compliance",
                "level": "expert",
                "yearsExperience": 5,
                "certifications": [{
                    "id": "cert-10",
                    "name": "Safety Compliance Certification",
                    "issueDate": "2023-08-09",
                    "expiryDate": "2026-08-09",
                    "status": "active"
                }],
                "lastUsed": "2025-10-13"
            }
        ],
        "password": "emp5566"
    },
    {
        "id": "6",
        "name": "Govindhan",
        "role": "employee",
        "employeeId": "EMP006",
        "department": "Assembly",
        "shift": "Evening",
        "currentWorkload": 38,
        "performanceScore": 89,
        "skills": [
            {
                "skillId": "skill-11",
                "skillName": "Assembly Line Operations",
                "level": "intermediate",
                "yearsExperience": 3,
                "certifications": [{
                    "id": "cert-11",
                    "name": "Assembly Line Certification",
                    "issueDate": "2023-11-03",
                    "expiryDate": "2026-11-03",
                    "status": "active"
                }],
                "lastUsed": "2025-10-15"
            },
            {
                "skillId": "skill-12",
                "skillName": "Blueprint Reading",
                "level": "advanced",
                "yearsExperience": 4,
                "certifications": [{
                    "id": "cert-12",
                    "name": "Blueprint Reading Certification",
                    "issueDate": "2022-12-10",
                    "expiryDate": "2025-12-10",
                    "status": "active"
                }],
                "lastUsed": "2025-10-12"
            }
        ],
        "password": "emp6677"
    },
    {
        "id": "admin",
        "name": "Admin User",
        "role": "manager",
        "employeeId": "ADMIN",
        "department": "Management",
        "email": "admin@company.com",
        "password": "admin123"
    }
]

# Tasks with skills and feedback
mockTasks = [
    {
        "id": "1",
        "title": "Machine Setup - Line A",
        "description": "Prepare and calibrate machine A-101 for morning production run",
        "assignedTo": "1",
        "assignedBy": "4",
        "priority": "high",
        "status": "completed",
        "startTime": "07:00",
        "endTime": "08:00",
        "dueDate": "2025-10-14",
        "completedAt": "2025-10-14T07:45:00",
        "requiredSkills": ["skill-1", "skill-6"],
        "checklist": [
            {"id": "1", "text": "Check oil levels", "completed": True},
            {"id": "2", "text": "Calibrate sensors", "completed": True},
            {"id": "3", "text": "Test run", "completed": True},
        ],
        "notes": "All equipment checked and ready",
        "difficultyRating": 3,
        "qualityRating": 5,
        "feedback": {
            "employeeFeedback": {
                "difficultyRating": 3,
                "clarity": 5,
                "hadIssues": False,
                "submittedAt": "2025-10-14T08:00:00"
            },
            "supervisorFeedback": {
                "qualityRating": 5,
                "onTime": True,
                "needsRetraining": False,
                "notes": "Excellent work as always",
                "submittedAt": "2025-10-14T08:30:00"
            }
        }
    },
    # ...continue for all other entries as per your mock data...
]

# Daily reports
mockDailyReports = [
    {"date": "2025-10-16", "totalTasks": 30, "completed": 8, "inProgress": 7, "pending": 14, "overdue": 1, "completionRate": 26.7},
    {"date": "2025-10-15", "totalTasks": 28, "completed": 24, "inProgress": 2, "pending": 2, "overdue": 0, "completionRate": 85.7},
    {"date": "2025-10-14", "totalTasks": 26, "completed": 19, "inProgress": 4, "pending": 2, "overdue": 1, "completionRate": 73.1},
    {"date": "2025-10-13", "totalTasks": 25, "completed": 23, "inProgress": 0, "pending": 1, "overdue": 1, "completionRate": 92.0},
    {"date": "2025-10-12", "totalTasks": 24, "completed": 22, "inProgress": 0, "pending": 2, "overdue": 0, "completionRate": 91.7},
    {"date": "2025-10-11", "totalTasks": 23, "completed": 21, "inProgress": 0, "pending": 2, "overdue": 0, "completionRate": 91.3},
    {"date": "2025-10-10", "totalTasks": 24, "completed": 22, "inProgress": 0, "pending": 2, "overdue": 0, "completionRate": 91.7},
    {"date": "2025-10-09", "totalTasks": 22, "completed": 20, "inProgress": 0, "pending": 2, "overdue": 0, "completionRate": 90.9},
    {"date": "2025-10-08", "totalTasks": 23, "completed": 21, "inProgress": 0, "pending": 2, "overdue": 0, "completionRate": 91.3}
]

# Employee Performance
mockEmployeePerformance = [
    # Production Department
    {
        "employeeId": "1",
        "department": "Production",
        "completionRate": 92,
        "averageTaskTime": 55,
        "onTimeDeliveryRate": 95,
        "qualityScore": 4.6,
        "tasksCompleted": 145,
        "tasksOverdue": 7,
        "skillsUsed": [
            {"skillId": "skill-1", "count": 89},  # CNC Machining
            {"skillId": "skill-2", "count": 34}
        ],
        "performanceTrend": [
            {"date": "2025-10-08", "completionRate": 90, "tasksCompleted": 8},
            {"date": "2025-10-09", "completionRate": 91, "tasksCompleted": 9},
            {"date": "2025-10-10", "completionRate": 93, "tasksCompleted": 10},
            {"date": "2025-10-11", "completionRate": 92, "tasksCompleted": 9},
            {"date": "2025-10-12", "completionRate": 94, "tasksCompleted": 11},
            {"date": "2025-10-13", "completionRate": 91, "tasksCompleted": 8},
            {"date": "2025-10-14", "completionRate": 92, "tasksCompleted": 9}
        ]
    },
    {
        "employeeId": "2",
        "department": "Production",
        "completionRate": 88,
        "averageTaskTime": 60,
        "onTimeDeliveryRate": 90,
        "qualityScore": 4.3,
        "tasksCompleted": 130,
        "tasksOverdue": 10,
        "skillsUsed": [
            {"skillId": "skill-1", "count": 70},
            {"skillId": "skill-2", "count": 25}
        ],
        "performanceTrend": [
            {"date": "2025-10-08", "completionRate": 87, "tasksCompleted": 7},
            {"date": "2025-10-09", "completionRate": 88, "tasksCompleted": 8},
            {"date": "2025-10-10", "completionRate": 89, "tasksCompleted": 9},
            {"date": "2025-10-11", "completionRate": 88, "tasksCompleted": 8},
            {"date": "2025-10-12", "completionRate": 90, "tasksCompleted": 10},
            {"date": "2025-10-13", "completionRate": 87, "tasksCompleted": 7},
            {"date": "2025-10-14", "completionRate": 88, "tasksCompleted": 8}
        ]
    },

    # Quality Control Department
    {
        "employeeId": "3",
        "department": "Quality Control",
        "completionRate": 95,
        "averageTaskTime": 50,
        "onTimeDeliveryRate": 97,
        "qualityScore": 4.8,
        "tasksCompleted": 150,
        "tasksOverdue": 5,
        "skillsUsed": [
            {"skillId": "skill-4", "count": 80}  # Quality Inspection
        ],
        "performanceTrend": [
            {"date": "2025-10-08", "completionRate": 94, "tasksCompleted": 9},
            {"date": "2025-10-09", "completionRate": 95, "tasksCompleted": 10},
            {"date": "2025-10-10", "completionRate": 95, "tasksCompleted": 10},
            {"date": "2025-10-11", "completionRate": 96, "tasksCompleted": 11},
            {"date": "2025-10-12", "completionRate": 95, "tasksCompleted": 10},
            {"date": "2025-10-13", "completionRate": 94, "tasksCompleted": 9},
            {"date": "2025-10-14", "completionRate": 95, "tasksCompleted": 10}
        ]
    },
    {
        "employeeId": "4",
        "department": "Quality Control",
        "completionRate": 90,
        "averageTaskTime": 55,
        "onTimeDeliveryRate": 92,
        "qualityScore": 4.5,
        "tasksCompleted": 140,
        "tasksOverdue": 8,
        "skillsUsed": [
            {"skillId": "skill-4", "count": 70}
        ],
        "performanceTrend": [
            {"date": "2025-10-08", "completionRate": 89, "tasksCompleted": 8},
            {"date": "2025-10-09", "completionRate": 90, "tasksCompleted": 9},
            {"date": "2025-10-10", "completionRate": 91, "tasksCompleted": 10},
            {"date": "2025-10-11", "completionRate": 90, "tasksCompleted": 9},
            {"date": "2025-10-12", "completionRate": 92, "tasksCompleted": 10},
            {"date": "2025-10-13", "completionRate": 89, "tasksCompleted": 8},
            {"date": "2025-10-14", "completionRate": 90, "tasksCompleted": 9}
        ]
    },

    # Assembly Department
    {
        "employeeId": "5",
        "department": "Assembly",
        "completionRate": 87,
        "averageTaskTime": 65,
        "onTimeDeliveryRate": 88,
        "qualityScore": 4.2,
        "tasksCompleted": 120,
        "tasksOverdue": 12,
        "skillsUsed": [
            {"skillId": "skill-5", "count": 60}  # Assembly Line Operations
        ],
        "performanceTrend": [
            {"date": "2025-10-08", "completionRate": 85, "tasksCompleted": 7},
            {"date": "2025-10-09", "completionRate": 86, "tasksCompleted": 8},
            {"date": "2025-10-10", "completionRate": 87, "tasksCompleted": 9},
            {"date": "2025-10-11", "completionRate": 87, "tasksCompleted": 8},
            {"date": "2025-10-12", "completionRate": 88, "tasksCompleted": 10},
            {"date": "2025-10-13", "completionRate": 86, "tasksCompleted": 8},
            {"date": "2025-10-14", "completionRate": 87, "tasksCompleted": 9}
        ]
    },
    {
        "employeeId": "6",
        "department": "Assembly",
        "completionRate": 89,
        "averageTaskTime": 62,
        "onTimeDeliveryRate": 90,
        "qualityScore": 4.3,
        "tasksCompleted": 125,
        "tasksOverdue": 10,
        "skillsUsed": [
            {"skillId": "skill-5", "count": 65}
        ],
        "performanceTrend": [
            {"date": "2025-10-08", "completionRate": 88, "tasksCompleted": 8},
            {"date": "2025-10-09", "completionRate": 89, "tasksCompleted": 9},
            {"date": "2025-10-10", "completionRate": 90, "tasksCompleted": 10},
            {"date": "2025-10-11", "completionRate": 89, "tasksCompleted": 9},
            {"date": "2025-10-12", "completionRate": 90, "tasksCompleted": 10},
            {"date": "2025-10-13", "completionRate": 88, "tasksCompleted": 8},
            {"date": "2025-10-14", "completionRate": 89, "tasksCompleted": 9}
        ]
    }
]

# Skill gap analysis
mockSkillGaps = [
    {"skillId": "skill-1", "skillName": "CNC Machining", "demand": 45, "supply": 1, "gap": 44, "utilization": 95},
    {"skillId": "skill-2", "skillName": "MIG Welding", "demand": 38, "supply": 2, "gap": 36, "utilization": 88},
    {"skillId": "skill-3", "skillName": "Quality Inspection", "demand": 32, "supply": 2, "gap": 30, "utilization": 78},
    {"skillId": "skill-4", "skillName": "Assembly Line Operations", "demand": 28, "supply": 2, "gap": 26, "utilization": 65},
    {"skillId": "skill-5", "skillName": "Inventory Management", "demand": 15, "supply": 2, "gap": 13, "utilization": 55},
    {"skillId": "skill-6", "skillName": "Safety Compliance", "demand": 22, "supply": 5, "gap": 17, "utilization": 42},
    {"skillId": "skill-7", "skillName": "TIG Welding", "demand": 18, "supply": 1, "gap": 17, "utilization": 92},
    {"skillId": "skill-8", "skillName": "Blueprint Reading", "demand": 25, "supply": 3, "gap": 22, "utilization": 58}
]

# Workforce Analytics
mockWorkforceAnalytics = {
    "overallUtilization": 72,
    "skillUtilization": mockSkillGaps,
    "topPerformers": ["2", "1", "7"],
    "skillsInDemand": ["skill-1", "skill-2", "skill-7"],
    "reworkIncidents": 8,
    "trainingNeeded": [
        {"skillId": "skill-1", "employeeIds": ["3", "7"]},
        {"skillId": "skill-2", "employeeIds": ["3"]},
        {"skillId": "skill-3", "employeeIds": ["6"]}
    ]
}

# Training suggestions
mockTrainingSuggestions = [
    {"employeeId": "6", "skillId": "skill-2", "reason": "MIG Welding certification expired - recertification required", "priority": "high", "basedOn": "certification-expiry"},
    {"employeeId": "3", "skillId": "skill-1", "reason": "High demand for CNC Machining skills - upskilling recommended", "priority": "high", "basedOn": "skill-gap"},
    {"employeeId": "3", "skillId": "skill-6", "reason": "Multiple safety tasks assigned - advanced training needed", "priority": "medium", "basedOn": "performance"},
    {"employeeId": "7", "skillId": "skill-1", "reason": "Cross-training opportunity for production backup", "priority": "medium", "basedOn": "skill-gap"},
    {"employeeId": "6", "skillId": "skill-3", "reason": "Task feedback indicates quality control knowledge gaps", "priority": "medium", "basedOn": "task-feedback"}
]
