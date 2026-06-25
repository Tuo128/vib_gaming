"""Score and leaderboard API routes."""
from flask import Blueprint, request, jsonify
from app import db
from app.models.score import Score
from app.models.game import Game
from sqlalchemy import desc

scores_bp = Blueprint('scores', __name__)


@scores_bp.route('/scores', methods=['GET'])
def list_scores():
    """Get scores, optionally filtered by game_id."""
    game_id = request.args.get('game_id', type=int)
    limit = request.args.get('limit', 20, type=int)

    query = Score.query

    if game_id:
        query = query.filter_by(game_id=game_id)

    scores = query.order_by(desc(Score.score)).limit(limit).all()
    return jsonify([s.to_dict() for s in scores])


@scores_bp.route('/scores', methods=['POST'])
def submit_score():
    """Submit a new score."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    game_id = data.get('game_id')
    player_name = data.get('player_name')
    score_val = data.get('score')

    if not game_id or not player_name or score_val is None:
        return jsonify({'error': 'game_id, player_name, and score are required'}), 400

    # Verify game exists
    game = db.session.get(Game, game_id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404

    score = Score(
        game_id=game_id,
        player_name=player_name,
        score=score_val,
        kills=data.get('kills', 0),
        survival_time=data.get('survival_time', 0),
        level_reached=data.get('level_reached', 1),
    )
    db.session.add(score)
    db.session.commit()

    return jsonify(score.to_dict()), 201


@scores_bp.route('/leaderboard', methods=['GET'])
def leaderboard():
    """Get cross-game leaderboard (top scores across all games)."""
    limit = request.args.get('limit', 50, type=int)

    scores = (
        db.session.query(
            Score,
            Game.game_title,
            Game.member_name,
        )
        .join(Game, Score.game_id == Game.id)
        .order_by(desc(Score.score))
        .limit(limit)
        .all()
    )

    result = []
    for score, game_title, member_name in scores:
        entry = score.to_dict()
        entry['game_title'] = game_title
        entry['member_name'] = member_name
        result.append(entry)

    return jsonify(result)
