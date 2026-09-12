export type Sex = 'female' | 'male' | 'other';

export type VitalsStatus = 'Normal' | 'Attention' | 'Critical';

export type Patient = {
  id: number;
  name: string;
  age: number;
  sex: Sex;
  village: string;
  contact: string;
  createdAt: string;
};

export type PatientListItem = Patient & {
  lastVisitAt: string | null;
  lastHeartRate: number | null;
  lastStatus: VitalsStatus | null;
};

export type VitalsRecord = {
  id: number;
  patientId: number;
  heartRate: number;
  hrvMs: number | null;
  status: VitalsStatus;
  signalQuality: number;
  note: string;
  capturedAt: string;
  synced: number;
};

export type NewPatientInput = {
  name: string;
  age: number;
  sex: Sex;
  village: string;
  contact: string;
};

export type NewVitalsInput = {
  patientId: number;
  heartRate: number;
  hrvMs: number | null;
  status: VitalsStatus;
  signalQuality: number;
  note: string;
};

export type PpgSample = {
  t: number;
  v: number;
};

export type PpgResult = {
  bpm: number;
  hrvMs: number;
  quality: number;
  peakCount: number;
  filtered: number[];
  times: number[];
};
