"""Game model."""
from datetime import datetime, timezone
from app import db


class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    member_name = db.Column(db.String(100), nullable=False)
    game_title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default='')
    thumbnail = db.Column(db.String(500), default='')
    game_url = db.Column(db.String(500), default='')
    tags = db.Column(db.JSON, default=list)
    status = db.Column(db.String(20), default='active')  # active / archived
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationship
    scores = db.relationship('Score', backref='game', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'member_id': self.member_id,
            'member_name': self.member_name,
            'game_title': self.game_title,
            'description': self.description,
            'thumbnail': self.thumbnail,
            'game_url': self.game_url,
            'tags': self.tags or [],
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
