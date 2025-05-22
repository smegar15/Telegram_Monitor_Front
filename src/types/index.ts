export interface AnalystUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface NotificationSettings {
  mediums: Array<'email' | 'telegram' | 'inApp'>;
  frequency: 'immediate' | 'daily' | 'weekly';
  types: Array<'allMentions' | 'criticalMentions' | 'newChannels'>;
}

export interface Keyword {
  id: string;
  term: string;
}

export const channelTypes = ['public', 'private', 'group'] as const;
export type ChannelType = typeof channelTypes[number];

export interface Channel {
  id: string;
  name: string;
  channelId: string; // Telegram Channel ID (can be numeric or @username)
  link: string; // Full t.me link
  type: ChannelType;
}

export interface Client {
  id:string;
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  assignedAnalystId?: string | null;
  notificationSettings?: NotificationSettings;
  keywords?: Keyword[];
  channels?: Channel[];
}

export type SentimentType = 'positive' | 'negative' | 'neutral' | 'unclassified';

export interface Mention {
  id: string;
  clientId: string;
  clientName: string; // Denormalized for easier display
  keywordDetected: string;
  channelName: string;
  channelId: string;
  messageSnippet: string; // A short snippet of the message
  messageLink: string; // Direct link to the Telegram message
  detectedAt: Date;
  sentiment: SentimentType;
  isReviewed: boolean;
}

export type NotificationMedium = 'email' | 'telegram' | 'inApp';
export type NotificationSentType = 'Mención Crítica' | 'Resumen Diario' | 'Nuevo Canal Detectado' | 'Alerta General';
export type NotificationStatus = 'enviada' | 'fallida' | 'pendiente';

export interface SentNotification {
  id: string;
  clientId: string;
  clientName: string;
  notificationType: NotificationSentType;
  medium: NotificationMedium;
  contentPreview: string;
  sentAt: Date;
  status: NotificationStatus;
}

// Add more types as needed