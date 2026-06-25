# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vib Gaming is a team learning project where 5-8 members each build their own Vampire Survivors-style (割草无双) web game, displayed through a shared portal website. The project teaches vibe coding and Git collaboration.

**Two-layer architecture**: A Flask backend serves REST APIs and hosts the built frontend in production. A React portal (Vite) displays all member games in a card grid — clicking one embeds the game via iframe + postMessage for score reporting. Each game is an independent Vite project using a shared ECS game engine (`@vib/engine`).

## Monorepo Structure

```
vib_gaming/
├── backend/                  # Flask REST API + SQLite database
│   ├── app/
│   │   ├── routes/games.py   # /api/games CRUD
│   │   ├── routes/scores.py  # /api/scores + /api/leaderboard
│   │   └── models/           # Game, Score (SQLAlchemy)
│   └── run.py
├── apps/
│   ├── portal/               # React 19 portal (Vite, port 5173)
│   │   └── src/
│   │       ├── api/client.ts       # Fetch wrappers for Flask API
│   │       ├── components/         # GameCard, GameEmbed, NavHeader, Layout
│   │       ├── pages/             # Home, GameDetail, GamePlay, Leaderboard, About
│   │       └── hooks/             # useGames, useLeaderboard
│   └── games/_template/      # Starter: copy this for each new member game
│       └── src/
│           ├── config.ts          # All tunable params (player, waves, XP)
│           └── scenes/GameScene.ts # Assemble entities + systems here
├── packages/
│   ├── engine/               # @vib/engine — shared ECS game engine
│   │   └── src/
│   │       ├── core/         # GameLoop (fixed-timestep), InputManager, EventBus, Scene
│   │       ├── ecs/          # World, Entity, Component, System
│   │       ├── math/         # Vector2, Rect
│   │       ├── physics/      # Collision (AABB, circle)
│   │       ├── render/       # CanvasRenderer, Camera
│   │       ├── components/   # Transform, Velocity, Health, Weapon, Enemy, etc.
│   │       ├── systems/      # Movement, AutoAttack, Collision, XP, Render, etc.
│   │       └── bridge/       # PortalBridge (postMessage to portal)
│   ├── types/                # @vib/types — shared TypeScript interfaces
│   └── shared-ui/            # @vib/shared-ui — Button, Card, Badge (not used by portal)
├── pnpm-workspace.yaml
├── turbo.json                # Build pipeline: ^build before own build
└── package.json              # Root scripts (dev, build, lint, typecheck)
```

## Essential Commands

```bash
# Install all dependencies
pnpm install
cd backend && pip install -r requirements.txt

# Development (3 terminals)
pnpm dev:backend              # Flask on port 5001
pnpm dev:portal               # Vite on 5173, proxies /api -> 5001
pnpm dev --filter=@vib/game-template  # or: cd apps/games/_template && pnpm dev

# Type checking
pnpm typecheck                # All packages via Turbo
npx tsc --project apps/portal/tsconfig.json --noEmit
npx tsc --project apps/games/_template/tsconfig.json --noEmit

# Build
pnpm build                    # All packages in dependency order via Turbo
pnpm build:portal             # Portal only
cd apps/games/_template && pnpm build  # Single game

# Formatting
pnpm format                   # Prettier write
pnpm format:check             # CI check
```

## Architecture Patterns

### Game Engine ECS (`packages/engine`)

The engine uses Entity-Component-System architecture. **Components** are pure data classes. **Systems** iterate entities with specific component signatures via `world.query()`. The query returns **tuple arrays**: `[entity, comp1, comp2, ...]`.

```typescript
// Creating entities
const entity = world.createEntity();
world.addComponent(entity, new Transform(x, y));
world.addComponent(entity, new Health(100, 100));
world.addComponent(entity, new Enemy(xpValue, damage, speed));

// Querying — returns Array<[Entity, ...Components]>
const enemies = world.query(Transform, Velocity, Enemy);
for (const [entity, transform, velocity, enemy] of enemies) {
  // Use directly: transform.x, enemy.speed, etc.
}

// Systems — override update(dt, world)
class MySystem extends System {
  update(dt: number, world: World): void { ... }
}
world.addSystem(new MySystem());
```

**GameLoop**: fixed-timestep at 60Hz (`FIXED_DT = 16.67ms`), with variable rendering and interpolation alpha for smooth visuals. Prevents "spiral of death" when the tab is backgrounded.

**Preset systems** members can use or replace: `MovementSystem`, `PlayerMovementSystem`, `AutoAttackSystem`, `ProjectileSystem`, `LifetimeSystem`, `EnemyAISystem`, `EnemySpawnSystem`, `CollisionSystem`, `XPSystem`, `RenderSystem`.

**Damage flow**: `CollisionSystem` emits `'collision'` events → `setupDamageHandler()` listens and applies damage via `world.getComponent(entity, Health)`. The handler is wired in `GameScene.enter()`.

### Portal-Game Communication

Games run in an **iframe** inside the portal. Communication uses `postMessage`:

- **Game → Portal**: `{ type: 'SCORE_UPDATE', payload: { score, kills, survivalTime, level } }` or `{ type: 'GAME_OVER', payload: {...} }`
- **Portal → Game**: `{ type: 'PAUSE' | 'RESUME' | 'RESTART' }`
- `PortalBridge` class in `@vib/engine` encapsulates this — games call `bridge.reportScore()` and `bridge.reportGameOver()`
- `GameEmbed` component in portal listens for messages and calls `/api/scores`

### Flask Backend (`backend/`)

App factory pattern with blueprints. SQLite database auto-created on first run (`db.create_all()` in `create_app()`). In production, Flask serves the built portal static files from `apps/portal/dist/`. In development, Vite dev server proxies `/api` to Flask.

Two models: `Game` (member_id, game_title, game_url, tags, status) and `Score` (game_id FK, player_name, score, kills, survival_time, level_reached). Leaderboard query joins Score + Game for cross-game rankings.

## Adding a New Team Member's Game

1. `cp -r apps/games/_template apps/games/<member-id>`
2. Edit `src/config.ts` — adjust `PLAYER_CONFIG`, `DEFAULT_WEAPON`, `WAVES`
3. Edit `src/scenes/GameScene.ts` — add custom weapons, enemy types, upgrade choices
4. Run: `cd apps/games/<member-id> && pnpm dev`
5. Register via API: `POST /api/games` with member_id, game_title, game_url (the Vite dev URL)

Member games are isolated — each member only works in `apps/games/<name>/` and can self-approve PRs in that directory. Engine/portal/backend changes require review.

## Git Workflow

```
main (protected)
├── game/<member>/<feature>   → PR, self-approve OK
├── engine/<feature>           → PR, requires review
├── portal/<feature>           → PR, requires review
├── backend/<feature>          → PR, requires review
└── fix/<description>          → PR
```

Commit convention: `feat(game-<name>):`, `feat(engine):`, `feat(portal):`, `feat(backend):`, `fix(scope):`, `chore:`.

## Key Constraints

- Member games MUST NOT import from other member game directories — only from `@vib/engine` or their own `src/`
- `query()` returns tuple arrays, not objects — use array destructuring: `for (const [entity, comp1, comp2] of results)`
- Portal uses plain CSS utility classes (no Tailwind build step) defined in `apps/portal/src/styles/global.css`
- `@vib/shared-ui` exists as a package but the portal uses inline components (`apps/portal/src/components/shared.tsx`) to avoid cross-package JSX type issues
- Flask DB is SQLite stored at `backend/instance/vib.db` — auto-created, gitignored
