export type ContactStatus = 'Pending' | 'Drafted' | 'Sent' | 'Replied' | 'Unresponsive';

export interface Contact {
  id: string;
  category: string;
  title: string;
  name: string;
  contactRoute: string;
  status: ContactStatus;
  notes?: string;
}
