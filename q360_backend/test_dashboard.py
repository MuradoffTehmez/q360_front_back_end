import requests
import json

# First, let's get an authentication token
login_data = {
    "username": "admin",
    "password": "admin123"
}

response = requests.post("http://127.0.0.1:8000/api/auth/login/", data=login_data)
print("Login response:", response.status_code)
print("Login response data:", response.json())

if response.status_code == 200:
    token = response.json()["access"]
    print("Token:", token)
    
    # Now let's test the dashboard endpoint
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    dashboard_response = requests.get("http://127.0.0.1:8000/api/reports/dashboard/", headers=headers)
    print("Dashboard response:", dashboard_response.status_code)
    print("Dashboard response data:", dashboard_response.json())
else:
    print("Login failed")