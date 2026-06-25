"""Score model for leaderboard."""
from datetime import datetime, timezone
from app import db


class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False, index=True)
    player_name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False, default=0)
    kills = db.Column(db.Integer, default=0)
    survival_time = db.Column(db.Integer, default=0)  # seconds
    level_reached = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'player_name': self.player_name,
            'score': self.score,
            'kills': self.kills,
            'survival_time': self.survival_time,
            'level_reached': self.level_reached,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            # Joined fields populated when querying with join
            'game_title': getattr(self, 'game_title', None),
            'member_name': getattr(self, 'member_name', None),
        }
