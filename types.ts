
export enum HealthLayer {
  PATIENT_GUARDIAN = 'PATIENT_GUARDIAN',
  FEM_SYNC = 'FEM_SYNC',
  SMART_HOSPITAL = 'SMART_HOSPITAL',
  NATIONAL_GRID = 'NATIONAL_GRID'
}

export interface Medication {
  name: string;
  type: string;
  dose: string;
  freq: string;
  duration: string;
  icon: string;
  time?: string;
  timing?: string;
  use?: string;
  side_effect?: string;
  price?: number;
  generic_match?: string;
}

export interface PrescriptionData {
  doctor: string;
  date: string;
  meds: Medication[];
}

export interface MigraineRiskResponse {
  risk_level: 'HIGH' | 'LOW';
  cause: string;
  advice: string;
}

export interface MoodAnalysisResponse {
  mood: string;
  suggestion: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  bloodType: string;
  symptoms: string;
  severity: 'RED' | 'YELLOW' | 'GREEN';
  arrivalTime: string;
  history: string;
  allergies: string;
}
