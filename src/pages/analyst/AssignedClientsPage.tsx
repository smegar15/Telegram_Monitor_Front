import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Client } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react'; // Using Eye icon for "Manage"

// Mock data for all clients (in a real app, this would come from an API or global state)
// This data should ideally be consistent with what's used in Admin pages for simulation
const allClientsData: Client[] = [
  { id: 'c1', companyName: 'Tech Solutions Inc.', contactFirstName: 'Maria', contactLastName: 'Lopez', contactEmail: 'maria.lopez@techsolutions.com', assignedAnalystId: '1' },
  { id: 'c2', companyName: 'Innovate Hub', contactFirstName: 'Carlos', contactLastName: 'Ruiz', contactEmail: 'carlos.ruiz@innovatehub.io', assignedAnalystId: '2' }, // Assigned to Analyst '2'
  { id: 'c3', companyName: 'Global Connect', contactFirstName: 'Sofia', contactLastName: 'Chen', contactEmail: 'sofia.chen@globalconnect.net', assignedAnalystId: '2' }, // Assigned to Analyst '2'
  { id: 'c4', companyName: 'Data Corp', contactFirstName: 'Pedro', contactLastName: 'Jimenez', contactEmail: 'pedro.j@datacorp.co', assignedAnalystId: null },
  { id: 'c5', companyName: 'Market Leaders', contactFirstName: 'Laura', contactLastName: 'Gomez', contactEmail: 'laura@marketleaders.com', assignedAnalystId: '1' },
  { id: 'c6', companyName: 'SecureNet', contactFirstName: 'David', contactLastName: 'Kim', contactEmail: 'david.kim@secure.net', assignedAnalystId: '2' }, // Assigned to Analyst '2'
];

// Simulate the ID of the currently logged-in analyst
// For "analyst" user, let's assume their ID is '2' (Ana García from previous mock data)
const CURRENT_ANALYST_ID = '2'; 

const AssignedClientsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const assignedClients = useMemo(() => {
    return allClientsData.filter(client => client.assignedAnalystId === CURRENT_ANALYST_ID);
  }, []);

  const handleManageClient = (clientId: string) => {
    console.log(`Navigate to manage client: ${clientId}`);
    // Placeholder navigation: In a real app, this would go to a client detail/management page
    navigate(`/analyst/dashboard/client/${clientId}/details`); 
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Mis Clientes Asignados</h2>
        {/* Potential future actions like "Request new client" could go here */}
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Estos son los clientes actualmente bajo tu gestión.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Nombre Contacto</TableHead>
                <TableHead>Email Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedClients.length > 0 ? (
                assignedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.companyName}</TableCell>
                    <TableCell>{client.contactFirstName} {client.contactLastName}</TableCell>
                    <TableCell>{client.contactEmail}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleManageClient(client.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Gestionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No tienes clientes asignados actualmente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignedClientsPage;