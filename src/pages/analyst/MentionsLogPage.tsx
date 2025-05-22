import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const MentionsLogPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Registro de Menciones</h2>
      <Card>
        <CardHeader>
          <CardTitle>Menciones Detectadas</CardTitle>
          <CardDescription>Aquí se mostrarán las menciones relevantes para tus clientes asignados.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidad de registro de menciones en desarrollo.
          </p>
          {/* TODO: Implement advanced data grid for mentions with filtering and sorting */}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentionsLogPage;