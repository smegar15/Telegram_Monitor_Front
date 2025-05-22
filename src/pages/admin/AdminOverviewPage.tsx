import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AdminOverviewPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Resumen del Sistema</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Analistas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">15</p>
            <p className="text-sm text-muted-foreground">Analistas activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clientes Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">42</p>
            <p className="text-sm text-muted-foreground">Clientes totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Menciones Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">Nuevas menciones detectadas</p>
          </CardContent>
        </Card>
      </div>
      {/* TODO: Add more relevant stats or widgets */}
    </div>
  );
};

export default AdminOverviewPage;