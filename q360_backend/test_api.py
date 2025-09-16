import requests
import json

# Test the dashboard API endpoint
def test_dashboard_api():
    # First, let's get an authentication token
    login_data = {
        "username": "admin",
        "password": "admin123"
    }

    try:
        response = requests.post("http://127.0.0.1:8000/api/auth/login/", data=login_data)
        print("Login response:", response.status_code)
        
        if response.status_code == 200:
            token = response.json()["access"]
            print("Token:", token)
            
            # Now let's test the dashboard endpoint
            headers = {
                "Authorization": f"Bearer {token}"
            }
            
            dashboard_response = requests.get("http://127.0.0.1:8000/api/reports/dashboard/", headers=headers)
            print("Dashboard response:", dashboard_response.status_code)
            print("Dashboard response data:", json.dumps(dashboard_response.json(), indent=2))
        else:
            print("Login failed:", response.json())
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    test_dashboard_api()