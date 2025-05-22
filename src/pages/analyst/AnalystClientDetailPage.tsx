import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Client, Keyword } from '@/types';
import KeywordForm, { KeywordFormData } from '@/components/analyst/KeywordForm';
import { showSuccess, showError } from '@/utils/toast';
import { PlusCircle, Edit, Trash2, ArrowLeft } from 'lucide-react';

// Mock data for all clients - this should ideally come from a shared source or API
// For now, we'll redefine it here to ensure this page can function independently for demonstration
// In a real app, you'd fetch this data or use a state management solution.
const allClientsData: Client[] = [
    { id: 'c1', companyName: 'Tech Solutions Inc.', contactFirstName: 'Maria', contactLastName: 'Lopez', contactEmail: 'maria.lopez@techsolutions.com', assignedAnalystId: '1', keywords: [{id: 'k1', term: 'TechSolutions'}, {id: 'k2', term: 'Innovación'}] },
    { id: 'c2', companyName: 'Innovate Hub', contactFirstName: 'Carlos', contactLastName: 'Ruiz', contactEmail: 'carlos.ruiz@innovatehub.io', assignedAnalystId: '2', keywords: [{id: 'k3', term: 'Startup Hub'}, {id: 'k4', term: 'Aceleradora'}] },
    { id: 'c3', companyName: 'Global Connect', contactFirstName: 'Sofia', contactLastName: 'Chen', contactEmail: 'sofia.chen@globalconnect.net', assignedAnalystId: '2', keywords: [] },
    { id: 'c4', companyName: 'Data Corp', contactFirstName: 'Pedro', contactLastName: 'Jimenez', contactEmail: 'pedro.j@datacorp.co', assignedAnalystId: null },
    { id: 'c5', companyName: 'Market Leaders', contactFirstName: 'Laura', contactLastName: 'Gomez', contactEmail: 'laura@marketleaders.com', assignedAnalystId: '1', keywords: [{id: 'k5', term: 'Liderazgo Mercado'}] },
    { id: 'c6', companyName: 'SecureNet', contactFirstName: 'David', contactLastName: 'Kim', contactEmail: 'david.kim@secure.net', assignedAnalystId: '2' },
  ];


const AnalystClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  // Local state for all clients, to simulate updates
  const [clients, setClients] = useState<Client[]>(allClientsData);

  const client = useMemo(() => clients.find(c => c.id === clientId), [clients, clientId]);

  const [isAddKeywordDialogOpen, setIsAddKeywordDialogOpen] = useState(false);
  const [isEditKeywordDialogOpen, setIsEditKeywordDialogOpen] = useState(false);
  const [isDeleteKeywordDialogOpen, setIsDeleteKeywordDialogOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  if (!client) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-destructive">Cliente no encontrado</h2>
        <Button onClick={() => navigate('/analyst/dashboard/assigned-clients')} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mis Clientes
        </Button>
      </div>
    );
  }

  const handleAddKeyword = (data: KeywordFormData) => {
    const newKeyword: Keyword = { id: `k${Date.now()}`, term: data.term };
    const updatedClient = {
      ...client,
      keywords: [...(client.keywords || []), newKeyword],
    };
    setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    setIsAddKeywordDialogOpen(false);
    showSuccess('Palabra clave añadida exitosamente.');
  };

  const handleEditKeyword = (data: KeywordFormData) => {
    if (!selectedKeyword) return;
    const updatedKeywords = client.keywords?.map(kw =>
      kw.id === selectedKeyword.id ? { ...kw, term: data.term } : kw
    ) || [];
    const updatedClient = { ...client, keywords: updatedKeywords };
    setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    setIsEditKeywordDialogOpen(false);
    setSelectedKeyword(null);
    showSuccess('Palabra clave actualizada exitosamente.');
  };

  const handleDeleteKeyword = () => {
    if (!selectedKeyword) return;
    const updatedKeywords = client.keywords?.filter(kw => kw.id !== selectedKeyword.id) || [];
    const updatedClient = { ...client, keywords: updatedKeywords };
    setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    setIsDeleteKeywordDialogOpen(false);
    setSelectedKeyword(null);
    showSuccess('Palabra clave eliminada exitosamente.');
  };

  const openEditKeywordDialog = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setIsEditKeywordDialogOpen(true);
  };

  const openDeleteKeywordDialog = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setIsDeleteKeywordDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => navigate('/analyst/dashboard/assigned-clients')} variant="outline" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mis Clientes
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Cliente: {client.companyName}</CardTitle>
          <CardDescription>
            {client.contactFirstName} {client.contactLastName} - {client.contactEmail}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Palabras Clave</CardTitle>
            <CardDescription>Añada, edite o elimine palabras clave para este cliente.</CardDescription>
          </div>
          <Dialog open={isAddKeywordDialogOpen} onOpenChange={setIsAddKeywordDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Palabra Clave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Palabra Clave</DialogTitle>
              </DialogHeader>
              <KeywordForm
                onSubmit={handleAddKeyword}
                onCancel={() => setIsAddKeywordDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Palabra Clave</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.keywords && client.keywords.length > 0 ? (
                client.keywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell>{keyword.term}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditKeywordDialog(keyword)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteKeywordDialog(keyword)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center h-24">
                    No hay palabras clave definidas para este cliente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Keyword Dialog */}
      <Dialog open={isEditKeywordDialogOpen} onOpenChange={setIsEditKeywordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Palabra Clave</DialogTitle>
          </DialogHeader>
          {selectedKeyword && (
            <KeywordForm
              onSubmit={handleEditKeyword}
              onCancel={() => {
                setIsEditKeywordDialogOpen(false);
                setSelectedKeyword(null);
              }}
              defaultValues={{ term: selectedKeyword.term }}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Keyword Confirmation Dialog */}
      <AlertDialog open={isDeleteKeywordDialogOpen} onOpenChange={setIsDeleteKeywordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la palabra clave
              "{selectedKeyword?.term}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedKeyword(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteKeyword} className="bg-destructive hover:bg-destructive/90">
              Confirmar Eliminación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Placeholder for Channel Management */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Canales (Próximamente)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aquí podrá gestionar los canales de Telegram para este cliente.</p>
        </CardContent>
      </Card>

      {/* Placeholder for Client-Specific Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones (Próximamente)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aquí podrá ajustar las notificaciones específicas para este cliente.</p>
        </CardContent>
      </Card>

    </div>
  );
};

export default AnalystClientDetailPage;