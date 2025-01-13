from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv , dotenv_values
load_dotenv()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app)
    config = dotenv_values()
    app.config.from_mapping(config)

    # Register routes
    from .routes import main
    app.register_blueprint(main)

    return app
