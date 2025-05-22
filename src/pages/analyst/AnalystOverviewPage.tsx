import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AnalystOverviewPage: React.FC = () => {
  // In a real app, these numbers would come from actual data
  const assignedClientsCount = 5; // Example
  const newMentionsToday = 120; // Example
  const criticalAlerts = 3; // Example

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Resumen del Analista</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Clientes Asignados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assignedClientsCount}</p>
            <p className="text-sm text-muted-foreground">Clientes bajo tu gestión</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nuevas Menciones (Hoy)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{newMentionsToday}</p>
            <p className="text-sm text-muted-foreground">Detectadas en las últimas 24h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alertas Críticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{criticalAlerts}</p>
            <p className="text-sm text-muted-foreground">Requieren atención inmediata</p>
          </CardContent>
        </Card>
      </div>
      {/* TODO: Add more relevant stats or quick access widgets for the analyst */}
    </div>
  );
};

export default AnalystOverviewPage;