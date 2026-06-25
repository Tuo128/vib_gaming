"""Game CRUD API routes."""
from flask import Blueprint, request, jsonify
from app import db
from app.models.game import Game

games_bp = Blueprint('games', __name__)


@games_bp.route('/games', methods=['GET'])
def list_games():
    """Get all games."""
    games = Game.query.order_by(Game.created_at.desc()).all()
    return jsonify([g.to_dict() for g in games])


@games_bp.route('/games/<member_id>', methods=['GET'])
def get_game(member_id):
    """Get a single game by member_id."""
    game = Game.query.filter_by(member_id=member_id).first()
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    return jsonify(game.to_dict())


@games_bp.route('/games', methods=['POST'])
def create_game():
    """Register a new game."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    member_id = data.get('member_id')
    if not member_id:
        return jsonify({'error': 'member_id is required'}), 400

    # Check duplicate
    if Game.query.filter_by(member_id=member_id).first():
        return jsonify({'error': f'Game with member_id "{member_id}" already exists'}), 409

    game = Game(
        member_id=member_id,
        member_name=data.get('member_name', member_id),
        game_title=data.get('game_title', f"{member_id}'s Game"),
        description=data.get('description', ''),
        thumbnail=data.get('thumbnail', ''),
        game_url=data.get('game_url', ''),
        tags=data.get('tags', []),
        status=data.get('status', 'active'),
    )
    db.session.add(game)
    db.session.commit()

    return jsonify(game.to_dict()), 201


@games_bp.route('/games/<member_id>', methods=['PUT'])
def update_game(member_id):
    """Update a game's info."""
    game = Game.query.filter_by(member_id=member_id).first()
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    updatable = ['member_name', 'game_title', 'description', 'thumbnail', 'game_url', 'tags', 'status']
    for field in updatable:
        if field in data:
            setattr(game, field, data[field])

    db.session.commit()
    return jsonify(game.to_dict())


@games_bp.route('/games/<member_id>', methods=['DELETE'])
def delete_game(member_id):
    """Delete a game."""
    game = Game.query.filter_by(member_id=member_id).first()
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    db.session.delete(game)
    db.session.commit()
    return jsonify({'ok': True}), 200
