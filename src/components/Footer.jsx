import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
      <p>© {new Date().getFullYear()} Studio Si Mamang. All rights reserved.</p>
    </footer>
  );
}