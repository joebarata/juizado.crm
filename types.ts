
export enum UserRole {
  ADMIN = 'ADMIN',
  LAWYER = 'LAWYER',
  PARTNER = 'PARTNER',
  INTERN = 'INTERN'
}

export enum CaseType {
  TRABALHISTA = 'TRABALHISTA',
  CIVIL = 'CIVIL',
  FAMILIA = 'FAMILIA',
  EMPRESARIAL = 'EMPRESARIAL',
  PENAL = 'PENAL',
  TRIBUTARIO = 'TRIBUTARIO',
  OUTROS = 'OUTROS'
}

export enum UrgencyLevel {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}

export interface LegalLead {
  id: string;
  org_id: number;
  name: string;
  phone: string;
  email: string;
  case_type: CaseType;
  potential_value: number;
  probability: number; // 0-100
  urgency: UrgencyLevel;
  column_id: string;
  description: string;
  deadline?: string;
  fee_type: 'FIXO' | 'PERCENTUAL' | 'SUCESSIVO' | 'MISTO';
  fee_value: number;
  created_at: string;
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
  court: string;
  status: string;
  lastUpdate: string;
}
