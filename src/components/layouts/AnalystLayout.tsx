import React from 'react';
import AnalystSidebar from '@/components/analyst/AnalystSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { mockLogout } from '@/App'; 

const AnalystLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    mockLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <AnalystSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Panel de Analista</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          <Outlet /> {/* Child routes will render here */}
        </div>
      </main>
    </div>
  );
};

export default AnalystLayout;