import { Vector2 } from '../math/Vector2';
import { Rect } from '../math/Rect';

export interface CollisionResult {
  normalX: number;
  normalY: number;
  overlap: number;
}

/**
 * Check AABB vs AABB collision.
 * Returns collision info (normal + overlap) or null if no collision.
 */
export function checkAABB(a: Rect, b: Rect): CollisionResult | null {
  const dx = b.centerX - a.centerX;
  const dy = b.centerY - a.centerY;
  const overlapX = a.width / 2 + b.width / 2 - Math.abs(dx);
  const overlapY = a.height / 2 + b.height / 2 - Math.abs(dy);

  if (overlapX <= 0 || overlapY <= 0) return null;

  if (overlapX < overlapY) {
    return { normalX: dx > 0 ? 1 : -1, normalY: 0, overlap: overlapX };
  } else {
    return { normalX: 0, normalY: dy > 0 ? 1 : -1, overlap: overlapY };
  }
}

/** Check if two circles overlap */
export function checkCircle(
  centerA: Vector2,
  radiusA: number,
  centerB: Vector2,
  radiusB: number
): boolean {
  const distSq = centerA.distanceSqTo(centerB);
  const radii = radiusA + radiusB;
  return distSq <= radii * radii;
}

/** Check circle vs AABB collision */
export function checkCircleAABB(
  circleCenter: Vector2,
  radius: number,
  box: Rect
): CollisionResult | null {
  // Clamp circle center to the nearest point on the box
  const closestX = Math.max(box.left, Math.min(circleCenter.x, box.right));
  const closestY = Math.max(box.top, Math.min(circleCenter.y, box.bottom));

  const dx = circleCenter.x - closestX;
  const dy = circleCenter.y - closestY;
  const distSq = dx * dx + dy * dy;

  if (distSq > radius * radius) return null;

  const dist = Math.sqrt(distSq);
  if (dist === 0) {
    return { normalX: 0, normalY: -1, overlap: radius };
  }
  return {
    normalX: dx / dist,
    normalY: dy / dist,
    overlap: radius - dist,
  };
}
