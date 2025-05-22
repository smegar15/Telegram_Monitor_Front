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

export interface Client {
  id:string;
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  assignedAnalystId?: string | null;
  notificationSettings?: NotificationSettings;
}

// Add more types as needed, e.g., for Keywords, Channels, Assignments, etc.