from flask import Blueprint, jsonify, request, Flask, redirect, current_app, session
from datetime import datetime
import requests
import base64
import jwt

main = Blueprint('main', __name__)

data = {}

@main.before_request
def before_request():
    if 'activity_data' not in session:
        session['activity_data'] = {}

@main.route('/login')
def login():
    
    client_id = current_app.config['CLIENT_ID']
    redirect_uri = current_app.config['REDIRECT_URI']
    authorize_url = current_app.config['AUTHORIZE_URL']
    
    auth_url = (
        f"{authorize_url}"
        f"?response_type=code"
        f"&client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=activity heartrate sleep"
    )
    return redirect(auth_url)

class FitnessDataFormatter:
    """
    Base class for fitness data formatting.
    Each platform (e.g., Fitbit, Garmin) can implement its own formatter by inheriting this class.
    """
    def __init__(self, raw_data):
        self.raw_data = raw_data

    def format_data(self):
        """
        Override this method in subclasses to implement platform-specific formatting logic.
        """
        raise NotImplementedError("Subclasses must implement the format_data method")


class FitbitDataFormatter(FitnessDataFormatter):
    """
    Formatter for Fitbit data.
    """
    def format_data(self):
        return {
            "goals": {
                "activeMinutes": self.raw_data.get("goals", {}).get("activeMinutes", 0),
                "caloriesOut": self.raw_data.get("goals", {}).get("caloriesOut", 0),
                "distance": self.raw_data.get("goals", {}).get("distance", 0.0),
                "floors": self.raw_data.get("goals", {}).get("floors", 0),
                "steps": self.raw_data.get("goals", {}).get("steps", 0),
            },
            "summary": {
                "activityCalories": self.raw_data.get("summary", {}).get("activityCalories", 0),
                "caloriesBMR": self.raw_data.get("summary", {}).get("caloriesBMR", 0),
                "caloriesOut": self.raw_data.get("summary", {}).get("caloriesOut", 0),
                "distances": {
                    distance.get("activity"): distance.get("distance", 0.0)
                    for distance in self.raw_data.get("summary", {}).get("distances", [])
                },
                "fairlyActiveMinutes": self.raw_data.get("summary", {}).get("fairlyActiveMinutes", 0),
                "lightlyActiveMinutes": self.raw_data.get("summary", {}).get("lightlyActiveMinutes", 0),
                "sedentaryMinutes": self.raw_data.get("summary", {}).get("sedentaryMinutes", 0),
                "steps": self.raw_data.get("summary", {}).get("steps", 0),
                "veryActiveMinutes": self.raw_data.get("summary", {}).get("veryActiveMinutes", 0),
            },
        }


def fetch_activity_data(access_token, formatter_class):
    """
    Fetch activity data from the API and format it using the specified formatter class.
    """
    try:
        user_id = current_app.config.get('USER_ID', '-')  # Default to "-" for the logged-in user
        today_date = datetime.today().strftime('%Y-%m-%d')  # Format today's date as yyyy-MM-dd
        activity_url = f"https://api.fitbit.com/1/user/{user_id}/activities/date/{today_date}.json"

        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(activity_url, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors

        raw_data = response.json()

        # Format data using the specified formatter class
        formatter = formatter_class(raw_data)
        return formatter.format_data()

    except requests.RequestException as e:
        raise Exception(f"Failed to fetch activity data: {e}")
    except Exception as e:
        raise Exception(f"Data formatting error: {e}")


@main.route('/callback')
def callback():
    try:
        # Step 1: Retrieve the authorization code
        code = request.args.get('code')
        if not code:
            return "Authorization failed or denied", 400

        # Step 2: Prepare client configuration
        client_id = current_app.config.get('CLIENT_ID')
        client_secret = current_app.config.get('CLIENT_SECRET')
        redirect_uri = current_app.config.get('REDIRECT_URI')
        token_url = current_app.config.get('TOKEN_URL')

        if not all([client_id, client_secret, redirect_uri, token_url]):
            return jsonify({"error": "Missing client configuration"}), 500

        # Step 3: Exchange the authorization code for an access token
        try:
            auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
            headers = {
                "Authorization": f"Basic {auth_header}",
                "Content-Type": "application/x-www-form-urlencoded",
            }
            data = {
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
            }

            token_response = requests.post(token_url, headers=headers, data=data)
            token_response.raise_for_status()
        except Exception as e:
            return jsonify({"error": "Failed to exchange authorization code for access token", "details": str(e)}), 400

        token_data = token_response.json()
        if "access_token" not in token_data:
            return jsonify({"error": "Access token not found", "details": token_data}), 400

        access_token = token_data["access_token"]
        try:
            activity_data = fetch_activity_data(access_token, FitbitDataFormatter)
        except Exception as e:
            return jsonify({"error": "Failed to fetch activity data", "details": str(e)}), 400

        # Step 4: Generate a JWT with activity data
        secret_key = current_app.config.get('SECRET_KEY', 'your_secret_key')
        token_payload = {"activity_data": activity_data}
        jwt_token = jwt.encode(token_payload, secret_key, algorithm="HS256")

        # Redirect to the frontend dashboard with the JWT token
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:3000/dashboard')
        return redirect(f"{frontend_url}?token={jwt_token}")

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500


@main.route('/getdata')
def getdata():
    return jsonify(data)

# @main.route('/getdata')
# def getdata():
#     return data