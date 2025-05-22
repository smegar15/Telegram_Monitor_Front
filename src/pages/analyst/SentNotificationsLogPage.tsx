import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Client, SentNotification, NotificationSentType, NotificationMedium, NotificationStatus } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Simulate the ID of the currently logged-in analyst
const CURRENT_ANALYST_ID = '2'; // Ana García

// Mock data for clients (simplified, assuming these are assigned to CURRENT_ANALYST_ID)
const mockAnalystClients: Pick<Client, 'id' | 'companyName'>[] = [
  { id: 'c2', companyName: 'Innovate Hub' },
  { id: 'c3', companyName: 'Global Connect' },
  { id: 'c6', companyName: 'SecureNet' },
];

const ALL_CLIENTS_VALUE = "__ALL_CLIENTS__";
const ALL_TYPES_VALUE = "__ALL_TYPES__";

const notificationTypes: NotificationSentType[] = ['Mención Crítica', 'Resumen Diario', 'Nuevo Canal Detectado', 'Alerta General'];

// Mock data for sent notifications
const initialSentNotifications: SentNotification[] = [
  {
    id: 'sn1',
    clientId: 'c2',
    clientName: 'Innovate Hub',
    notificationType: 'Mención Crítica',
    medium: 'email',
    contentPreview: 'Detectada mención crítica para "Startup Hub" en canal Tech News...',
    sentAt: new Date(2023, 10, 15, 10, 35, 0),
    status: 'enviada',
  },
  {
    id: 'sn2',
    clientId: 'c3',
    clientName: 'Global Connect',
    notificationType: 'Resumen Diario',
    medium: 'telegram',
    contentPreview: 'Resumen diario: 5 nuevas menciones, 1 crítica.',
    sentAt: new Date(2023, 10, 15, 17, 0, 0),
    status: 'enviada',
  },
  {
    id: 'sn3',
    clientId: 'c2',
    clientName: 'Innovate Hub',
    notificationType: 'Mención Crítica',
    medium: 'inApp',
    contentPreview: 'Alerta: Mención negativa sobre "Aceleradora" en Emprendedores VIP.',
    sentAt: new Date(2023, 10, 16, 9, 5, 0),
    status: 'fallida',
  },
  {
    id: 'sn4',
    clientId: 'c6',
    clientName: 'SecureNet',
    notificationType: 'Nuevo Canal Detectado',
    medium: 'email',
    contentPreview: 'Nuevo canal "Cybersecurity Leaks" podría ser relevante.',
    sentAt: new Date(2023, 10, 16, 11, 0, 0),
    status: 'enviada',
  },
];

const statusBadgeVariant = (status: NotificationStatus) => {
  switch (status) {
    case 'enviada': return 'success';
    case 'fallida': return 'destructive';
    case 'pendiente': return 'outline';
    default: return 'secondary';
  }
};

const SentNotificationsLogPage: React.FC = () => {
  const [sentNotifications] = useState<SentNotification[]>(initialSentNotifications);
  const [filterClientId, setFilterClientId] = useState<string>(ALL_CLIENTS_VALUE);
  const [filterNotificationType, setFilterNotificationType] = useState<string>(ALL_TYPES_VALUE);

  const filteredNotifications = useMemo(() => {
    return sentNotifications
      .filter(notification =>
        mockAnalystClients.some(client => client.id === notification.clientId)
      )
      .filter(notification =>
        filterClientId === ALL_CLIENTS_VALUE ? true : notification.clientId === filterClientId
      )
      .filter(notification =>
        filterNotificationType === ALL_TYPES_VALUE ? true : notification.notificationType === filterNotificationType
      )
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }, [sentNotifications, filterClientId, filterNotificationType]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Registro de Notificaciones Enviadas</h2>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select value={filterClientId} onValueChange={setFilterClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CLIENTS_VALUE}>Todos mis Clientes</SelectItem>
                {mockAnalystClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.companyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Select value={filterNotificationType} onValueChange={setFilterNotificationType}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Tipo de Notificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_VALUE}>Todos los Tipos</SelectItem>
                {notificationTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Date filter can be added here */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Notificaciones</CardTitle>
          <CardDescription>
            Lista de notificaciones enviadas a tus clientes asignados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo Notificación</TableHead>
                <TableHead>Medio</TableHead>
                <TableHead>Extracto</TableHead>
                <TableHead>Fecha Envío</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>{notification.clientName}</TableCell>
                    <TableCell>{notification.notificationType}</TableCell>
                    <TableCell>{notification.medium}</TableCell>
                    <TableCell className="max-w-xs truncate">{notification.contentPreview}</TableCell>
                    <TableCell>{format(notification.sentAt, 'Pp', { locale: es })}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(notification.status)}>
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No se encontraron notificaciones con los filtros actuales.
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

export default SentNotificationsLogPage;