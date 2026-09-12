import type { NewPatientInput, NewVitalsInput, Patient, PatientListItem, VitalsRecord } from '../types';
import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('edge-health-mesh.db');
  }
  return dbPromise;
}

export async function initDatabase() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      sex TEXT NOT NULL,
      village TEXT NOT NULL DEFAULT '',
      contact TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId INTEGER NOT NULL,
      heartRate INTEGER NOT NULL,
      hrvMs REAL,
      status TEXT NOT NULL,
      signalQuality REAL NOT NULL DEFAULT 0,
      note TEXT NOT NULL DEFAULT '',
      capturedAt TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
    );
  `);
}

export async function createPatient(input: NewPatientInput): Promise<number> {
  const db = await getDb();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO patients (name, age, sex, village, contact, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [input.name.trim(), input.age, input.sex, input.village.trim(), input.contact.trim(), createdAt]
  );
  return Number(result.lastInsertRowId);
}

export async function getPatients(): Promise<PatientListItem[]> {
  const db = await getDb();
  return db.getAllAsync<PatientListItem>(`
    SELECT
      p.*,
      (
        SELECT capturedAt FROM vitals v
        WHERE v.patientId = p.id
        ORDER BY datetime(v.capturedAt) DESC
        LIMIT 1
      ) AS lastVisitAt,
      (
        SELECT heartRate FROM vitals v
        WHERE v.patientId = p.id
        ORDER BY datetime(v.capturedAt) DESC
        LIMIT 1
      ) AS lastHeartRate,
      (
        SELECT status FROM vitals v
        WHERE v.patientId = p.id
        ORDER BY datetime(v.capturedAt) DESC
        LIMIT 1
      ) AS lastStatus
    FROM patients p
    ORDER BY datetime(p.createdAt) DESC
  `);
}

export async function getPatient(id: number): Promise<Patient | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Patient>(`SELECT * FROM patients WHERE id = ?`, [id]);
  return row ?? null;
}

export async function getVitalsForPatient(patientId: number): Promise<VitalsRecord[]> {
  const db = await getDb();
  return db.getAllAsync<VitalsRecord>(
    `SELECT * FROM vitals WHERE patientId = ? ORDER BY datetime(capturedAt) DESC`,
    [patientId]
  );
}

export async function saveVitals(input: NewVitalsInput): Promise<number> {
  const db = await getDb();
  const capturedAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO vitals
      (patientId, heartRate, hrvMs, status, signalQuality, note, capturedAt, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      input.patientId,
      input.heartRate,
      input.hrvMs,
      input.status,
      input.signalQuality,
      input.note,
      capturedAt,
    ]
  );
  return Number(result.lastInsertRowId);
}

export async function markAllVitalsSynced(): Promise<void> {
  const db = await getDb();
  await db.runAsync(`UPDATE vitals SET synced = 1 WHERE synced = 0`);
}

export async function getUnsyncedCount(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM vitals WHERE synced = 0`
  );
  return row?.count ?? 0;
}
