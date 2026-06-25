"""Flask application factory."""
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_name=None):
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'vib-gaming-dev-secret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URL', 'sqlite:///' + os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'vib.db')
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Ensure instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)

    # Extensions
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.routes.games import games_bp
    from app.routes.scores import scores_bp
    app.register_blueprint(games_bp, url_prefix='/api')
    app.register_blueprint(scores_bp, url_prefix='/api')

    # Serve frontend static files in production
    frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'apps', 'portal', 'dist')
    if os.path.exists(frontend_dist):
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve_frontend(path):
            if path and os.path.exists(os.path.join(frontend_dist, path)):
                return send_from_directory(frontend_dist, path)
            return send_from_directory(frontend_dist, 'index.html')

    # Create tables
    with app.app_context():
        from app.models import game, score  # noqa: F401 — ensure models are imported
        db.create_all()

    return app
