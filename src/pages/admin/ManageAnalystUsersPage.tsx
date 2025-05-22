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
import { Card } from '@/components/ui/card'; // Added Card import
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AnalystUser } from '@/types';
import AnalystUserForm, { AnalystUserFormData } from '@/components/admin/AnalystUserForm';
import { showSuccess, showError } from '@/utils/toast';

// Mock data - en una aplicación real, esto vendría de una API
const initialAnalystUsers: AnalystUser[] = [
  { id: '1', firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com' },
  { id: '2', firstName: 'Ana', lastName: 'García', email: 'ana.garcia@example.com' },
  { id: '3', firstName: 'Luis', lastName: 'Martínez', email: 'luis.martinez@example.com' },
];

const ManageAnalystUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AnalystUser[]>(initialAnalystUsers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AnalystUser | null>(null);

  const handleCreateUser = (data: AnalystUserFormData) => {
    const newUser: AnalystUser = {
      id: String(Date.now()), // Simple ID generation for mock
      ...data,
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setIsCreateDialogOpen(false);
    showSuccess('Analista creado exitosamente.');
    console.log('Created user:', newUser);
  };

  const handleEditUser = (data: AnalystUserFormData) => {
    if (!selectedUser) return;
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, ...data } : user
      )
    );
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    showSuccess('Analista actualizado exitosamente.');
    console.log('Updated user:', { ...selectedUser, ...data });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    showSuccess('Analista eliminado exitosamente.');
    console.log('Deleted user ID:', selectedUser.id);
  };

  const openEditDialog = (user: AnalystUser) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: AnalystUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestionar Usuarios Analistas</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Analista
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Analista</DialogTitle>
              <DialogDescription>
                Complete los detalles del nuevo usuario analista.
              </DialogDescription>
            </DialogHeader>
            <AnalystUserForm
              onSubmit={handleCreateUser}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(user)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No hay analistas registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        setIsEditDialogOpen(isOpen);
        if (!isOpen) setSelectedUser(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Analista</DialogTitle>
            <DialogDescription>
              Actualice los detalles del usuario analista.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <AnalystUserForm
              onSubmit={handleEditUser}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
              }}
              defaultValues={selectedUser}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(isOpen) => {
        setIsDeleteDialogOpen(isOpen);
        if (!isOpen) setSelectedUser(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al analista
              "{selectedUser?.firstName} {selectedUser?.lastName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Confirmar Eliminación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageAnalystUsersPage;