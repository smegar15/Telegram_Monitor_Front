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
import { PlusCircle, Edit, Trash2, Bell } from 'lucide-react'; // Added Bell icon
import { Client, NotificationSettings } from '@/types'; // Added NotificationSettings
import ClientForm, { ClientFormData } from '@/components/admin/ClientForm';
import NotificationSettingsForm, { NotificationSettingsFormData } from '@/components/admin/NotificationSettingsForm'; // Import NotificationSettingsForm
import { showSuccess, showError } from '@/utils/toast';

// Mock data - en una aplicación real, esto vendría de una API
const initialClients: Client[] = [
  { 
    id: 'c1', 
    companyName: 'Tech Solutions Inc.', 
    contactFirstName: 'Maria', 
    contactLastName: 'Lopez', 
    contactEmail: 'maria.lopez@techsolutions.com', 
    assignedAnalystId: '1',
    notificationSettings: { mediums: ['email'], frequency: 'daily', types: ['allMentions', 'criticalMentions'] }
  },
  { 
    id: 'c2', 
    companyName: 'Innovate Hub', 
    contactFirstName: 'Carlos', 
    contactLastName: 'Ruiz', 
    contactEmail: 'carlos.ruiz@innovatehub.io' 
  },
  { 
    id: 'c3', 
    companyName: 'Global Connect', 
    contactFirstName: 'Sofia', 
    contactLastName: 'Chen', 
    contactEmail: 'sofia.chen@globalconnect.net', 
    assignedAnalystId: '2',
    notificationSettings: { mediums: ['telegram', 'inApp'], frequency: 'immediate', types: ['criticalMentions'] }
  },
];

// Mock analyst data for display purposes
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
  const [isNotificationSettingsDialogOpen, setIsNotificationSettingsDialogOpen] = useState(false); // New state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleCreateClient = (data: ClientFormData) => {
    const newClient: Client = {
      id: `c${Date.now()}`,
      ...data,
      notificationSettings: { mediums: ['email'], frequency: 'daily', types: ['allMentions'] } // Default settings
    };
    setClients((prevClients) => [...prevClients, newClient]);
    setIsCreateDialogOpen(false);
    showSuccess('Cliente creado exitosamente.');
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
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;
    setClients((prevClients) => prevClients.filter((client) => client.id !== selectedClient.id));
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
    showSuccess('Cliente eliminado exitosamente.');
  };

  const handleSaveNotificationSettings = (data: NotificationSettingsFormData) => {
    if (!selectedClient) return;
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === selectedClient.id ? { ...client, notificationSettings: data } : client
      )
    );
    setIsNotificationSettingsDialogOpen(false);
    setSelectedClient(null);
    showSuccess('Configuración de notificaciones guardada exitosamente.');
    console.log('Saved notification settings for client:', selectedClient.id, data);
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const openNotificationSettingsDialog = (client: Client) => {
    setSelectedClient(client);
    setIsNotificationSettingsDialogOpen(true);
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
                  <TableCell>{client.contactFirstName} {client.contactLastName}</TableCell>
                  <TableCell>{client.contactEmail}</TableCell>
                  <TableCell>
                    {client.assignedAnalystId ? mockAnalysts[client.assignedAnalystId] || 'N/A' : 'No asignado'}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openNotificationSettingsDialog(client)} title="Configurar Notificaciones">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)} title="Editar Cliente">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(client)} title="Eliminar Cliente">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24"> {/* Updated colSpan */}
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

      {/* Notification Settings Dialog */}
      <Dialog open={isNotificationSettingsDialogOpen} onOpenChange={(isOpen) => {
          setIsNotificationSettingsDialogOpen(isOpen);
          if (!isOpen) setSelectedClient(null);
      }}>
        <DialogContent className="sm:max-w-lg"> {/* Adjusted width for more content */}
          <DialogHeader>
            <DialogTitle>Configurar Notificaciones para {selectedClient?.companyName}</DialogTitle>
            <DialogDescription>
              Ajuste las preferencias de notificación para este cliente.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <NotificationSettingsForm
              onSubmit={handleSaveNotificationSettings}
              onCancel={() => {
                setIsNotificationSettingsDialogOpen(false);
                setSelectedClient(null);
              }}
              defaultValues={selectedClient.notificationSettings || { mediums: [], frequency: 'daily', types: [] }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageClientsPage;