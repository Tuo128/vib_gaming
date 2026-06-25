export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-indigo-400 text-center mb-8">关于 Vib Gaming</h1>

      <div className="space-y-6 text-gray-300">
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-3">🎯 项目目标</h2>
          <p>
            Vib Gaming 是一个团队学习项目，通过一起开发网页游戏来学习 Vibe Coding 开发方式和
            Git 协作流程。每位成员独立开发自己的 Vampire Survivors 风格割草游戏，
            然后通过这个门户网站统一展示和管理。
          </p>
        </section>

        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-3">🛠️ 技术栈</h2>
          <ul className="space-y-2 text-sm">
            <li>🎨 前端: React 19 + TypeScript + Vite</li>
            <li>🎮 游戏渲染: Canvas 2D API</li>
            <li>⚙️ 共享游戏引擎: ECS 架构</li>
            <li>🐍 后端: Flask + SQLAlchemy + SQLite</li>
            <li>📦 Monorepo: pnpm Workspaces + Turborepo</li>
            <li>🔧 代码管理: GitHub + Conventional Commits</li>
          </ul>
        </section>

        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-100 mb-3">👥 团队</h2>
          <p className="text-gray-400">5-8 人开发团队，欢迎加入！</p>
        </section>
      </div>
    </div>
  );
}
