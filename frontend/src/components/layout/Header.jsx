import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User as UserIcon } from 'lucide-react';
import polaropsEmblem from '../../assets/polarops-emblem.png';

const Header = () => {
  const { user, logout } = useAuth();

  const formatRoleName = (role) => {
    if (!role) return '';
    return role.replace(/_/g, ' ');
  };

  return (
    <header className="h-16 bg-[#0B1F33] border-b border-slate-800 px-6 flex items-center justify-between text-white shrink-0 shadow-sm select-none">
      {/* Brand & System Identifier */}
      <div className="flex items-center gap-3">
        <img
          src={polaropsEmblem}
          alt="PolarOps Emblem"
          className="w-9 h-9 object-contain rounded-full shadow-sm"
        />
        <div>
          <h1 className="text-sm font-bold tracking-tight uppercase text-white leading-none">
            PolarOps Command Center
          </h1>
        </div>
      </div>

      {/* User Session Info & Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 border-r border-slate-800 pr-4">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-100 flex items-center justify-end gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                {user.name}
              </div>
              <div className="flex items-center justify-end gap-2 mt-0.5">
                <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                  {user.email}
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#163A59] text-slate-200 border border-slate-700/60">
                  {formatRoleName(user.role)}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          title="Sign out of PolarOps session"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
