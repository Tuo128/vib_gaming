# ⚔️ Vib Gaming

团队协作游戏开发项目 — 一起做 Vampire Survivors 风格割草网页游戏！

## 项目结构

```
vib_gaming/
├── backend/              # Flask 后端 (API + 数据库)
├── apps/
│   ├── portal/           # React 门户网站
│   └── games/
│       ├── _template/    # 游戏脚手架模板
│       ├── member-a/     # 成员A的游戏
│       └── member-b/     # 成员B的游戏
├── packages/
│   ├── engine/           # 共享游戏引擎 (@vib/engine)
│   ├── shared-ui/        # 共享UI组件
│   └── types/            # 共享类型定义
└── configs/              # 共享配置
```

## 快速开始

### 1. 安装依赖

```bash
# 前端依赖
pnpm install

# 后端依赖
cd backend && pip install -r requirements.txt
```

### 2. 启动开发服务器

```bash
# 终端 1: Flask 后端 (port 5001)
pnpm dev:backend

# 终端 2: Portal 前端 (port 5173, 自动代理 /api 到 Flask)
pnpm dev:portal

# 终端 3: 游戏模板 (port 5174)
cd apps/games/_template && pnpm dev
```

### 3. 注册你的游戏

```bash
curl -X POST http://localhost:5001/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "member_id": "alice",
    "member_name": "Alice",
    "game_title": "Alice 的暗夜猎杀",
    "description": "黑暗奇幻风格的割草生存游戏",
    "game_url": "http://localhost:5174",
    "tags": ["fantasy", "dark"]
  }'
```

然后打开 http://localhost:5173 查看门户网站！

## 新增成员

1. 复制模板：`cp -r apps/games/_template apps/games/<你的名字>`
2. 修改 `apps/games/<你的名字>/src/config.ts` 调整游戏参数
3. 在 `apps/games/<你的名字>/src/scenes/GameScene.ts` 中自定义武器、敌人
4. 启动你的游戏：`cd apps/games/<你的名字> && pnpm dev`
5. 通过 API 注册游戏到门户

## Git 协作流程

```bash
# 1. 创建你的分支
git checkout -b game/<your-name>/first-scene

# 2. 开发你的游戏
# 只在 apps/games/<your-name>/ 中修改文件

# 3. 提交代码 (使用 Conventional Commits)
git add .
git commit -m "feat(game): add lightning weapon"

# 4. 推送到 GitHub
git push origin game/<your-name>/first-scene

# 5. 创建 PR 合并到 main
```

### Commit 规范

- `feat(game-<name>): description` — 游戏新功能
- `feat(engine): description` — 引擎新功能
- `feat(portal): description` — Portal 新功能
- `feat(backend): description` — 后端新功能
- `fix(scope): description` — Bug 修复
- `chore: description` — 工具/配置

## API 文档

| Method | Path | 说明 |
|---|---|---|
| GET | `/api/games` | 获取所有游戏 |
| GET | `/api/games/:member_id` | 获取单个游戏 |
| POST | `/api/games` | 注册新游戏 |
| PUT | `/api/games/:member_id` | 更新游戏 |
| GET | `/api/scores?game_id=&limit=20` | 获取分数 |
| POST | `/api/scores` | 提交分数 |
| GET | `/api/leaderboard?limit=50` | 全球排行榜 |

## 技术栈

- 🎨 React 19 + TypeScript + Vite
- 🎮 Canvas 2D + ECS 游戏引擎
- 🐍 Flask + SQLAlchemy + SQLite
- 📦 pnpm Workspaces + Turborepo
