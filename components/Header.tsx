
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 p-4">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          识文生图 AI
        </h1>
        <p className="text-slate-500 mt-1">
          即时将您的想法转化为清晰、简约的草图。
        </p>
      </div>
    </header>
  );
};

export default Header;