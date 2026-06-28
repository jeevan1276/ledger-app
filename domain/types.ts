export type ContactType = 'customer' | 'supplier' | 'other';
export type TransactionType = 'credit' | 'payment';

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  contact_type: ContactType;
  is_archived: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  contact_id: string;
  amount: number;        // always positive integer (whole rupees)
  type: TransactionType;
  date: string;          // ISO 8601
  note?: string;
  media_uri?: string;
  created_at: string;
  updated_at: string;
}