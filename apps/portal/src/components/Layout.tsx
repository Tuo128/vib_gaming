import React from 'react';
import NavHeader from './NavHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <NavHeader />
      <main className="flex-1">{children}</main>
      <footer className="text-center text-sm text-gray-600 py-4 border-t border-gray-800">
        Vib Gaming © 2026 — Built with ❤️ by the team
      </footer>
    </div>
  );
}
