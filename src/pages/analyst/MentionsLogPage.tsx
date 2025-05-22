import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Client, Mention, SentimentType } from '@/types';
import { Eye, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // For Spanish date formatting

// Simulate the ID of the currently logged-in analyst
const CURRENT_ANALYST_ID = '2'; // Ana García

// Mock data for clients (simplified, assuming these are assigned to CURRENT_ANALYST_ID)
const mockAnalystClients: Pick<Client, 'id' | 'companyName'>[] = [
  { id: 'c2', companyName: 'Innovate Hub' },
  { id: 'c3', companyName: 'Global Connect' },
  { id: 'c6', companyName: 'SecureNet' },
];

// Mock data for mentions
const initialMentionsData: Mention[] = [
  {
    id: 'm1',
    clientId: 'c2',
    clientName: 'Innovate Hub',
    keywordDetected: 'Startup Hub',
    channelName: 'Tech News Daily',
    channelId: '@technewsdaily',
    messageSnippet: 'Gran evento en Startup Hub la próxima semana, no se lo pierdan...',
    messageLink: 'https://t.me/technewsdaily/12345',
    detectedAt: new Date(2023, 10, 15, 10, 30, 0),
    sentiment: 'positive',
    isReviewed: false,
  },
  {
    id: 'm2',
    clientId: 'c3',
    clientName: 'Global Connect',
    keywordDetected: 'Conectividad Global',
    channelName: 'Noticias Mundiales',
    channelId: '@noticiasmundial',
    messageSnippet: 'Global Connect anuncia nueva infraestructura para mejorar la conectividad...',
    messageLink: 'https://t.me/noticiasmundial/67890',
    detectedAt: new Date(2023, 10, 15, 12, 15, 0),
    sentiment: 'neutral',
    isReviewed: true,
  },
  {
    id: 'm3',
    clientId: 'c2',
    clientName: 'Innovate Hub',
    keywordDetected: 'Aceleradora',
    channelName: 'Emprendedores VIP',
    channelId: 'emprendedoresvipgroup',
    messageSnippet: 'Problemas con la última ronda de la aceleradora de Innovate Hub.',
    messageLink: 'https://t.me/emprendedoresvipgroup/101',
    detectedAt: new Date(2023, 10, 16, 9, 0, 0),
    sentiment: 'negative',
    isReviewed: false,
  },
    {
    id: 'm4',
    clientId: 'c6',
    clientName: 'SecureNet',
    keywordDetected: 'Ciberseguridad',
    channelName: 'CyberSecurity Today',
    channelId: '@cybersecurity_today',
    messageSnippet: 'SecureNet presenta nuevas soluciones de ciberseguridad avanzadas.',
    messageLink: 'https://t.me/cybersecurity_today/202',
    detectedAt: new Date(2023, 10, 16, 14,45, 0),
    sentiment: 'positive',
    isReviewed: true,
  },
];

const sentimentBadgeVariant = (sentiment: SentimentType) => {
  switch (sentiment) {
    case 'positive': return 'success';
    case 'negative': return 'destructive';
    case 'neutral': return 'secondary';
    default: return 'outline';
  }
};

const MentionsLogPage: React.FC = () => {
  const [mentions, setMentions] = useState<Mention[]>(initialMentionsData);
  const [filterClientId, setFilterClientId] = useState<string>('');
  const [filterKeyword, setFilterKeyword] = useState<string>('');

  const filteredMentions = useMemo(() => {
    return mentions
      .filter(mention => 
        // Filter by analyst's clients (simulated)
        mockAnalystClients.some(client => client.id === mention.clientId)
      )
      .filter(mention => 
        filterClientId ? mention.clientId === filterClientId : true
      )
      .filter(mention => 
        filterKeyword ? mention.keywordDetected.toLowerCase().includes(filterKeyword.toLowerCase()) : true
      )
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime()); // Sort by newest first
  }, [mentions, filterClientId, filterKeyword]);

  const toggleReviewedStatus = (mentionId: string) => {
    setMentions(prevMentions =>
      prevMentions.map(mention =>
        mention.id === mentionId ? { ...mention, isReviewed: !mention.isReviewed } : mention
      )
    );
  };
  
  const handleSentimentChange = (mentionId: string, newSentiment: SentimentType) => {
    setMentions(prevMentions =>
      prevMentions.map(mention =>
        mention.id === mentionId ? { ...mention, sentiment: newSentiment } : mention
      )
    );
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Registro de Menciones</h2>

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
                <SelectItem value="">Todos mis Clientes</SelectItem>
                {mockAnalystClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.companyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input 
              placeholder="Filtrar por Palabra Clave" 
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
          </div>
          {/* Date filter can be added here */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menciones Detectadas</CardTitle>
          <CardDescription>
            Lista de menciones relevantes para tus clientes asignados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Palabra Clave</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Sentimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMentions.length > 0 ? (
                filteredMentions.map((mention) => (
                  <TableRow key={mention.id}>
                    <TableCell>{mention.clientName}</TableCell>
                    <TableCell>{mention.keywordDetected}</TableCell>
                    <TableCell>{mention.channelName}</TableCell>
                    <TableCell className="max-w-xs truncate">{mention.messageSnippet}</TableCell>
                    <TableCell>{format(mention.detectedAt, 'Pp', { locale: es })}</TableCell>
                    <TableCell>
                       <Select 
                          value={mention.sentiment} 
                          onValueChange={(value) => handleSentimentChange(mention.id, value as SentimentType)}
                        >
                        <SelectTrigger className="h-8 w-[120px] text-xs">
                          <SelectValue placeholder="Clasificar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positivo</SelectItem>
                          <SelectItem value="negative">Negativo</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="unclassified">Sin Clasificar</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={mention.isReviewed ? 'secondary' : 'default'}>
                        {mention.isReviewed ? 'Revisada' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" title={mention.isReviewed ? "Marcar como Pendiente" : "Marcar como Revisada"} onClick={() => toggleReviewedStatus(mention.id)}>
                        {mention.isReviewed ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" title="Ver Mensaje Original" asChild>
                        <a href={mention.messageLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    No se encontraron menciones con los filtros actuales.
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

export default MentionsLogPage;