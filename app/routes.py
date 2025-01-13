from flask import Blueprint, jsonify, request, Flask, redirect, current_app
from datetime import datetime
import requests
import base64

main = Blueprint('main', __name__)

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

@main.route('/callback')
def callback():
    code = request.args.get('code') 
    if not code:
        return "Authorization failed or denied", 400

    client_id = current_app.config['CLIENT_ID']
    client_secret = current_app.config['CLIENT_SECRET']
    redirect_uri = current_app.config['REDIRECT_URI']
    token_url = current_app.config['TOKEN_URL']

    # Exchange the authorization code for an access token
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
    token_data = token_response.json()

    if "access_token" not in token_data:
        return jsonify({"error": "Failed to retrieve access token", "details": token_data}), 400

    access_token = token_data["access_token"]
    return fetch_activity_data(access_token)

def fetch_activity_data(access_token):
    user_id = current_app.config.get('USER_ID', '-')
    
    # Format today's date in the correct format (yyyy-MM-dd)
    today_date = datetime.today().strftime('%Y-%m-%d')
    activity_url = f"https://api.fitbit.com/1/user/{user_id}/activities/date/{today_date}.json"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(activity_url, headers=headers)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch activity data", "details": response.json()}), 400

    return jsonify(response.json())