import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { AnalystUser, Client } from '@/types';
import { showSuccess, showError } from '@/utils/toast';
import { Link2, XCircle } from 'lucide-react';

// Mock data - en una aplicación real, esto vendría de una API
// Es importante que estos datos sean consistentes o se gestionen globalmente
// Para este ejemplo, los definimos aquí pero podrían venir de props o un store.
const initialAnalystUsers: AnalystUser[] = [
  { id: '1', firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com' },
  { id: '2', firstName: 'Ana', lastName: 'García', email: 'ana.garcia@example.com' },
  { id: '3', firstName: 'Luis', lastName: 'Martínez', email: 'luis.martinez@example.com' },
];

const initialClientsData: Client[] = [
  { id: 'c1', companyName: 'Tech Solutions Inc.', contactFirstName: 'Maria', contactLastName: 'Lopez', contactEmail: 'maria.lopez@techsolutions.com', assignedAnalystId: '1' },
  { id: 'c2', companyName: 'Innovate Hub', contactFirstName: 'Carlos', contactLastName: 'Ruiz', contactEmail: 'carlos.ruiz@innovatehub.io', assignedAnalystId: null },
  { id: 'c3', companyName: 'Global Connect', contactFirstName: 'Sofia', contactLastName: 'Chen', contactEmail: 'sofia.chen@globalconnect.net', assignedAnalystId: '2' },
  { id: 'c4', companyName: 'Data Corp', contactFirstName: 'Pedro', contactLastName: 'Jimenez', contactEmail: 'pedro.j@datacorp.co', assignedAnalystId: null },
];

const ClientAssignmentsPage: React.FC = () => {
  const [analysts] = useState<AnalystUser[]>(initialAnalystUsers);
  const [clients, setClients] = useState<Client[]>(initialClientsData);

  const [selectedAnalystId, setSelectedAnalystId] = useState<string | undefined>();
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();

  const [clientToDeassign, setClientToDeassign] = useState<Client | null>(null);
  const [isDeassignDialogOpen, setIsDeassignDialogOpen] = useState(false);

  const unassignedClients = useMemo(() => {
    return clients.filter(client => !client.assignedAnalystId);
  }, [clients]);

  const assignedClientsWithDetails = useMemo(() => {
    return clients
      .filter(client => client.assignedAnalystId)
      .map(client => {
        const analyst = analysts.find(a => a.id === client.assignedAnalystId);
        return {
          ...client,
          analystName: analyst ? `${analyst.firstName} ${analyst.lastName}` : 'Desconocido',
        };
      });
  }, [clients, analysts]);

  const handleAssignClient = () => {
    if (!selectedAnalystId || !selectedClientId) {
      showError('Por favor, seleccione un analista y un cliente.');
      return;
    }

    setClients(prevClients =>
      prevClients.map(client =>
        client.id === selectedClientId
          ? { ...client, assignedAnalystId: selectedAnalystId }
          : client
      )
    );

    showSuccess('Cliente asignado exitosamente.');
    setSelectedAnalystId(undefined);
    setSelectedClientId(undefined);
    console.log(`Assigned client ${selectedClientId} to analyst ${selectedAnalystId}`);
  };

  const openDeassignDialog = (client: Client) => {
    setClientToDeassign(client);
    setIsDeassignDialogOpen(true);
  };

  const handleConfirmDeassign = () => {
    if (!clientToDeassign) return;

    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientToDeassign.id
          ? { ...client, assignedAnalystId: null }
          : client
      )
    );

    showSuccess('Cliente desasignado exitosamente.');
    setIsDeassignDialogOpen(false);
    setClientToDeassign(null);
    console.log(`Deassigned client ${clientToDeassign.id}`);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Asignaciones de Clientes a Analistas</h2>

      <Card>
        <CardHeader>
          <CardTitle>Asignar Nuevo Cliente</CardTitle>
          <CardDescription>Seleccione un analista y un cliente no asignado para crear una nueva asignación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="analyst-select">Seleccionar Analista</Label>
            <Select value={selectedAnalystId} onValueChange={setSelectedAnalystId}>
              <SelectTrigger id="analyst-select">
                <SelectValue placeholder="Elija un analista" />
              </SelectTrigger>
              <SelectContent>
                {analysts.map(analyst => (
                  <SelectItem key={analyst.id} value={analyst.id}>
                    {analyst.firstName} {analyst.lastName} ({analyst.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="client-select">Seleccionar Cliente No Asignado</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId} disabled={unassignedClients.length === 0}>
              <SelectTrigger id="client-select">
                <SelectValue placeholder={unassignedClients.length === 0 ? "No hay clientes sin asignar" : "Elija un cliente"} />
              </SelectTrigger>
              <SelectContent>
                {unassignedClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.companyName} ({client.contactFirstName} {client.contactLastName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAssignClient} disabled={!selectedAnalystId || !selectedClientId}>
            <Link2 className="mr-2 h-4 w-4" />
            Asignar Cliente
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asignaciones Actuales</CardTitle>
          <CardDescription>Lista de clientes y los analistas a los que están asignados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa Cliente</TableHead>
                <TableHead>Contacto Cliente</TableHead>
                <TableHead>Analista Asignado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedClientsWithDetails.length > 0 ? (
                assignedClientsWithDetails.map(client => (
                  <TableRow key={client.id}>
                    <TableCell>{client.companyName}</TableCell>
                    <TableCell>{client.contactFirstName} {client.contactLastName}</TableCell>
                    <TableCell>{client.analystName}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openDeassignDialog(client)}>
                        <XCircle className="mr-2 h-4 w-4 text-destructive" />
                        Desasignar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No hay clientes asignados actualmente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* De-assign Confirmation Dialog */}
      <AlertDialog open={isDeassignDialogOpen} onOpenChange={setIsDeassignDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de desasignar este cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción removerá la asignación del cliente "{clientToDeassign?.companyName}" del analista.
              El cliente quedará como no asignado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClientToDeassign(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeassign} className="bg-destructive hover:bg-destructive/90">
              Confirmar Desasignación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientAssignmentsPage;