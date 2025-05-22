import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Client } from '@/types';
import ClientForm, { ClientFormData } from '@/components/admin/ClientForm';
import { showSuccess, showError } from '@/utils/toast';

// Mock data - en una aplicación real, esto vendría de una API
const initialClients: Client[] = [
  { id: 'c1', companyName: 'Tech Solutions Inc.', contactFirstName: 'Maria', contactLastName: 'Lopez', contactEmail: 'maria.lopez@techsolutions.com', assignedAnalystId: '1' },
  { id: 'c2', companyName: 'Innovate Hub', contactFirstName: 'Carlos', contactLastName: 'Ruiz', contactEmail: 'carlos.ruiz@innovatehub.io' },
  { id: 'c3', companyName: 'Global Connect', contactFirstName: 'Sofia', contactLastName: 'Chen', contactEmail: 'sofia.chen@globalconnect.net', assignedAnalystId: '2' },
];

// Mock analyst data for display purposes (in a real app, you'd fetch this or join data)
const mockAnalysts: { [key: string]: string } = {
  '1': 'Juan Pérez',
  '2': 'Ana García',
  '3': 'Luis Martínez',
};

const ManageClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleCreateClient = (data: ClientFormData) => {
    const newClient: Client = {
      id: `c${Date.now()}`, // Simple ID generation
      ...data,
      // assignedAnalystId will be handled in assignments section
    };
    setClients((prevClients) => [...prevClients, newClient]);
    setIsCreateDialogOpen(false);
    showSuccess('Cliente creado exitosamente.');
    console.log('Created client:', newClient);
  };

  const handleEditClient = (data: ClientFormData) => {
    if (!selectedClient) return;
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === selectedClient.id ? { ...client, ...data } : client
      )
    );
    setIsEditDialogOpen(false);
    setSelectedClient(null);
    showSuccess('Cliente actualizado exitosamente.');
    console.log('Updated client:', { ...selectedClient, ...data });
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;
    setClients((prevClients) => prevClients.filter((client) => client.id !== selectedClient.id));
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
    showSuccess('Cliente eliminado exitosamente.');
    console.log('Deleted client ID:', selectedClient.id);
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestionar Clientes</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Complete los detalles del nuevo cliente.
              </DialogDescription>
            </DialogHeader>
            <ClientForm
              onSubmit={handleCreateClient}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Nombre Contacto</TableHead>
              <TableHead>Apellidos Contacto</TableHead>
              <TableHead>Email Contacto</TableHead>
              <TableHead>Analista Asignado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.companyName}</TableCell>
                  <TableCell>{client.contactFirstName}</TableCell>
                  <TableCell>{client.contactLastName}</TableCell>
                  <TableCell>{client.contactEmail}</TableCell>
                  <TableCell>
                    {client.assignedAnalystId ? mockAnalysts[client.assignedAnalystId] || 'N/A' : 'No asignado'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(client)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No hay clientes registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        setIsEditDialogOpen(isOpen);
        if (!isOpen) setSelectedClient(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Actualice los detalles del cliente.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <ClientForm
              onSubmit={handleEditClient}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedClient(null);
              }}
              defaultValues={selectedClient}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Client Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(isOpen) => {
        setIsDeleteDialogOpen(isOpen);
        if (!isOpen) setSelectedClient(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente
              "{selectedClient?.companyName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedClient(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-destructive hover:bg-destructive/90">
              Confirmar Eliminación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageClientsPage;