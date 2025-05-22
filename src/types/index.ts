export interface AnalystUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  assignedAnalystId?: string | null;
}

// Add more types as needed, e.g., for Keywords, Channels, Assignments, etc.