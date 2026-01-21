
export enum UserRole {
  ADMIN = 'ADMIN',
  LAWYER = 'LAWYER',
  PARTNER = 'PARTNER',
  INTERN = 'INTERN'
}

export interface Client {
  id: string;
  name: string;
  type: 'PF' | 'PJ';
  document: string;
  email: string;
  phone: string;
  address: {
    zip: string;
    street: string;
    city: string;
    state: string;
  };
}

export interface LegalProcess {
  id: string;
  cnj: string;
  clientId: string;
  tribunal: string;
  court: string; // Vara
  status: string;
  lastUpdate: string;
}

export interface Intimation {
  id: string;
  processId: string;
  description: string;
  dateReceived: string;
  deadline: string;
  isRead: boolean;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: string;
  date: string;
}
