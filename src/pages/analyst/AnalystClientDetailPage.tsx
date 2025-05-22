import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Client, Keyword, Channel, NotificationSettings } from '@/types';
import KeywordForm, { KeywordFormData } from '@/components/analyst/KeywordForm';
import ChannelForm, { ChannelFormData } from '@/components/analyst/ChannelForm';
import NotificationSettingsForm, { NotificationSettingsFormData } from '@/components/admin/NotificationSettingsForm'; // Reusing admin form
import { showSuccess, showError } from '@/utils/toast';
import { PlusCircle, Edit, Trash2, ArrowLeft, Bell, Settings } from 'lucide-react';

// Mock data for all clients
const initialClientsData: Client[] = [
    { 
      id: 'c1', companyName: 'Tech Solutions Inc.', contactFirstName: 'Maria', contactLastName: 'Lopez', contactEmail: 'maria.lopez@techsolutions.com', assignedAnalystId: '1', 
      keywords: [{id: 'k1', term: 'TechSolutions'}, {id: 'k2', term: 'Innovación'}],
      channels: [{id: 'ch1', name: 'Tech News Global', channelId: '@technewsglobal', link: 'https://t.me/technewsglobal', type: 'public'}],
      notificationSettings: { mediums: ['email'], frequency: 'daily', types: ['allMentions'] }
    },
    { 
      id: 'c2', companyName: 'Innovate Hub', contactFirstName: 'Carlos', contactLastName: 'Ruiz', contactEmail: 'carlos.ruiz@innovatehub.io', assignedAnalystId: '2', 
      keywords: [{id: 'k3', term: 'Startup Hub'}, {id: 'k4', term: 'Aceleradora'}],
      channels: [
        {id: 'ch2', name: 'Startup World', channelId: '@startupworld', link: 'https://t.me/startupworld', type: 'public'},
        {id: 'ch3', name: 'Private Tech Group', channelId: '-1001234567890', link: 'https://t.me/joinchat/AAAAAE...', type: 'private'}
      ],
      notificationSettings: { mediums: ['telegram', 'inApp'], frequency: 'immediate', types: ['criticalMentions'] }
    },
    { id: 'c3', companyName: 'Global Connect', contactFirstName: 'Sofia', contactLastName: 'Chen', contactEmail: 'sofia.chen@globalconnect.net', assignedAnalystId: '2', keywords: [], channels: [] },
    { id: 'c4', companyName: 'Data Corp', contactFirstName: 'Pedro', contactLastName: 'Jimenez', contactEmail: 'pedro.j@datacorp.co', assignedAnalystId: null },
    { id: 'c5', companyName: 'Market Leaders', contactFirstName: 'Laura', contactLastName: 'Gomez', contactEmail: 'laura@marketleaders.com', assignedAnalystId: '1', keywords: [{id: 'k5', term: 'Liderazgo Mercado'}] },
    { id: 'c6', companyName: 'SecureNet', contactFirstName: 'David', contactLastName: 'Kim', contactEmail: 'david.kim@secure.net', assignedAnalystId: '2' },
  ];


const AnalystClientDetailPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  const [clients, setClients] = useState<Client[]>(initialClientsData);
  const client = useMemo(() => clients.find(c => c.id === clientId), [clients, clientId]);

  // Keyword States
  const [isAddKeywordDialogOpen, setIsAddKeywordDialogOpen] = useState(false);
  const [isEditKeywordDialogOpen, setIsEditKeywordDialogOpen] = useState(false);
  const [isDeleteKeywordDialogOpen, setIsDeleteKeywordDialogOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  // Channel States
  const [isAddChannelDialogOpen, setIsAddChannelDialogOpen] = useState(false);
  const [isEditChannelDialogOpen, setIsEditChannelDialogOpen] = useState(false);
  const [isDeleteChannelDialogOpen, setIsDeleteChannelDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // Notification Settings State
  const [isNotificationSettingsDialogOpen, setIsNotificationSettingsDialogOpen] = useState(false);


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

  // Keyword Handlers
  const handleAddKeyword = (data: KeywordFormData) => {
    const newKeyword: Keyword = { id: `k${Date.now()}`, term: data.term };
    const updatedClient = { ...client, keywords: [...(client.keywords || []), newKeyword] };
    setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    setIsAddKeywordDialogOpen(false);
    showSuccess('Palabra clave añadida exitosamente.');
  };

  const handleEditKeyword = (data: KeywordFormData) => {
    if (!selectedKeyword) return;
    const updatedKeywords = client.keywords?.map(kw => kw.id === selectedKeyword.id ? { ...kw, term: data.term } : kw) || [];
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

  const openEditKeywordDialog = (keyword: Keyword) => { setSelectedKeyword(keyword); setIsEditKeywordDialogOpen(true); };
  const openDeleteKeywordDialog = (keyword: Keyword) => { setSelectedKeyword(keyword); setIsDeleteKeywordDialogOpen(true); };

  // Channel Handlers
  const handleAddChannel = (data: ChannelFormData) => {
    const newChannel: Channel = { id: `ch${Date.now()}`, ...data };
    const updatedClient = { ...client, channels: [...(client.channels || []), newChannel] };
    setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    setIsAddChannelDialogOpen(false);
    showSuccess('Canal añadido exitosamente.');
  };

  const handleEditChannel = (data: ChannelFormData) => {
    if (!selectedChannel) return;
    const updatedChannels = client.channels?.map(ch => ch.id === selectedChannel.id ? { ...selectedChannel, ...data } : ch) || [];
    const updatedClient = { ...client, channels: updatedChannels };
    setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    setIsEditChannelDialogOpen(false);
    setSelectedChannel(null);
    showSuccess('Canal actualizado exitosamente.');
  };

  const handleDeleteChannel = () => {
    if (!selectedChannel) return;
    const updatedChannels = client.channels?.filter(ch => ch.id !== selectedChannel.id) || [];
    const updatedClient = { ...client, channels: updatedChannels };
    setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    setIsDeleteChannelDialogOpen(false);
    setSelectedChannel(null);
    showSuccess('Canal eliminado exitosamente.');
  };

  const openEditChannelDialog = (channel: Channel) => { setSelectedChannel(channel); setIsEditChannelDialogOpen(true); };
  const openDeleteChannelDialog = (channel: Channel) => { setSelectedChannel(channel); setIsDeleteChannelDialogOpen(true); };

  // Notification Settings Handler
  const handleSaveNotificationSettings = (data: NotificationSettingsFormData) => {
    const updatedClient = { ...client, notificationSettings: data };
    setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    setIsNotificationSettingsDialogOpen(false);
    showSuccess('Configuración de notificaciones guardada exitosamente.');
    console.log('Saved notification settings for client:', client.id, data);
  };


  return (
    <div className="space-y-6">
      <Button onClick={() => navigate('/analyst/dashboard/assigned-clients')} variant="outline" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mis Clientes
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Cliente: {client.companyName}</CardTitle>
          <CardDescription>{client.contactFirstName} {client.contactLastName} - {client.contactEmail}</CardDescription>
        </CardHeader>
      </Card>

      {/* Keywords Management Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Palabras Clave</CardTitle>
            <CardDescription>Añada, edite o elimine palabras clave para este cliente.</CardDescription>
          </div>
          <Dialog open={isAddKeywordDialogOpen} onOpenChange={setIsAddKeywordDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Añadir Palabra Clave</Button></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader><DialogTitle>Añadir Nueva Palabra Clave</DialogTitle></DialogHeader>
              <KeywordForm onSubmit={handleAddKeyword} onCancel={() => setIsAddKeywordDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Palabra Clave</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
            <TableBody>
              {client.keywords && client.keywords.length > 0 ? (
                client.keywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell>{keyword.term}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditKeywordDialog(keyword)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteKeywordDialog(keyword)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (<TableRow><TableCell colSpan={2} className="text-center h-24">No hay palabras clave definidas.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Channels Management Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Canales</CardTitle>
            <CardDescription>Añada, edite o elimine canales de Telegram para este cliente.</CardDescription>
          </div>
          <Dialog open={isAddChannelDialogOpen} onOpenChange={setIsAddChannelDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Añadir Canal</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Añadir Nuevo Canal</DialogTitle></DialogHeader>
              <ChannelForm onSubmit={handleAddChannel} onCancel={() => setIsAddChannelDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>ID Canal</TableHead>
                <TableHead>Enlace</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.channels && client.channels.length > 0 ? (
                client.channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell>{channel.name}</TableCell>
                    <TableCell>{channel.channelId}</TableCell>
                    <TableCell><a href={channel.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{channel.link}</a></TableCell>
                    <TableCell>{channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditChannelDialog(channel)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteChannelDialog(channel)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (<TableRow><TableCell colSpan={5} className="text-center h-24">No hay canales definidos.</TableCell></TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notification Settings Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>Ajuste las preferencias de notificación para este cliente.</CardDescription>
            </div>
            <Dialog open={isNotificationSettingsDialogOpen} onOpenChange={setIsNotificationSettingsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" /> Configurar
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Configurar Notificaciones para {client.companyName}</DialogTitle>
                    </DialogHeader>
                    <NotificationSettingsForm
                        onSubmit={handleSaveNotificationSettings}
                        onCancel={() => setIsNotificationSettingsDialogOpen(false)}
                        defaultValues={client.notificationSettings || { mediums: [], frequency: 'daily', types: [] }}
                    />
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            {client.notificationSettings ? (
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Medios:</strong> {client.notificationSettings.mediums.join(', ') || 'No especificado'}</p>
                    <p><strong>Frecuencia:</strong> {client.notificationSettings.frequency || 'No especificado'}</p>
                    <p><strong>Tipos:</strong> {client.notificationSettings.types.join(', ') || 'No especificado'}</p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No se ha configurado la notificación para este cliente.</p>
            )}
        </CardContent>
      </Card>


      {/* Edit Keyword Dialog */}
      <Dialog open={isEditKeywordDialogOpen} onOpenChange={(isOpen) => { setIsEditKeywordDialogOpen(isOpen); if (!isOpen) setSelectedKeyword(null); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Editar Palabra Clave</DialogTitle></DialogHeader>
          {selectedKeyword && <KeywordForm onSubmit={handleEditKeyword} onCancel={() => { setIsEditKeywordDialogOpen(false); setSelectedKeyword(null); }} defaultValues={{ term: selectedKeyword.term }} isEditing />}
        </DialogContent>
      </Dialog>

      {/* Delete Keyword Confirmation Dialog */}
      <AlertDialog open={isDeleteKeywordDialogOpen} onOpenChange={(isOpen) => { setIsDeleteKeywordDialogOpen(isOpen); if (!isOpen) setSelectedKeyword(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Está seguro?</AlertDialogTitle><AlertDialogDescription>Eliminará permanentemente la palabra clave "{selectedKeyword?.term}".</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={() => setSelectedKeyword(null)}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteKeyword} className="bg-destructive hover:bg-destructive/90">Confirmar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Channel Dialog */}
      <Dialog open={isEditChannelDialogOpen} onOpenChange={(isOpen) => { setIsEditChannelDialogOpen(isOpen); if (!isOpen) setSelectedChannel(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar Canal</DialogTitle></DialogHeader>
          {selectedChannel && <ChannelForm onSubmit={handleEditChannel} onCancel={() => { setIsEditChannelDialogOpen(false); setSelectedChannel(null); }} defaultValues={selectedChannel} isEditing />}
        </DialogContent>
      </Dialog>

      {/* Delete Channel Confirmation Dialog */}
      <AlertDialog open={isDeleteChannelDialogOpen} onOpenChange={(isOpen) => { setIsDeleteChannelDialogOpen(isOpen); if (!isOpen) setSelectedChannel(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Está seguro?</AlertDialogTitle><AlertDialogDescription>Eliminará permanentemente el canal "{selectedChannel?.name}".</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel onClick={() => setSelectedChannel(null)}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteChannel} className="bg-destructive hover:bg-destructive/90">Confirmar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnalystClientDetailPage;