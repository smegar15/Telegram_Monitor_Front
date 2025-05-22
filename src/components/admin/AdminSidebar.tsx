import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, Briefcase, Link2, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin/dashboard/overview', icon: LayoutDashboard, label: 'Resumen' },
  { to: '/admin/dashboard/users', icon: Users, label: 'Gestionar Analistas' },
  { to: '/admin/dashboard/clients', icon: Briefcase, label: 'Gestionar Clientes' },
  { to: '/admin/dashboard/assignments', icon: Link2, label: 'Asignaciones' },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">AdminSys</h2>
        <p className="text-sm text-muted-foreground">Monitorización Telegram</p>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                isActive || (item.to !== '/admin/dashboard/overview' && location.pathname.startsWith(item.to))
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                  : 'text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <p className="text-xs text-muted-foreground text-center">© {new Date().getFullYear()} Mi Empresa</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;