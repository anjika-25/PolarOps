import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, HardDrive, AlertTriangle } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    {
      name: 'Command Center',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Personnel',
      path: '/personnel',
      icon: Users,
    },
    {
      name: 'Cargo & Inventory',
      path: '/logistics',
      icon: Package,
    },
    {
      name: 'Assets',
      path: '/assets',
      icon: HardDrive,
    },
    {
      name: 'Emergency Response',
      path: '/emergency',
      icon: AlertTriangle,
    },
  ];

  return (
    <aside className="w-64 bg-[#0B1F33] border-r border-slate-800 flex flex-col shrink-0 text-slate-300 select-none">
      <div className="px-4 py-3 border-b border-slate-800/80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          OPERATIONAL MODULES
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#2F6F95] text-white shadow-sm font-bold border-l-4 border-l-cyan-400'
                    : 'text-slate-300 hover:bg-[#163A59] hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 font-medium">
        System Status: <span className="text-emerald-400 font-semibold">ONLINE</span>
      </div>
    </aside>
  );
};

export default Sidebar;
