import fs from "fs";
import path from "path";

export type QARecord = {
  id: string;
  departmentId: string;
  departmentName: string;
  fiscalYear: string;
  month: string;
  data: Record<string, string>;
  updatedAt: string;
};

type StoreData = {
  records: QARecord[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "qa-data.json");

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial: StoreData = { records: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

function readStore(): StoreData {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(content) as StoreData;
  } catch (error) {
    console.error("Failed to read store", error);
    return { records: [] };
  }
}

function writeStore(data: StoreData): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function getRecord(departmentId: string, fiscalYear: string, month: string): QARecord | undefined {
  const store = readStore();
  return store.records.find(
    rec => rec.departmentId === departmentId && rec.fiscalYear === fiscalYear && rec.month === month
  );
}

export function getYearRecords(departmentId: string, fiscalYear: string): QARecord[] {
  const store = readStore();
  return store.records.filter(rec => rec.departmentId === departmentId && rec.fiscalYear === fiscalYear);
}

export function saveRecord(input: Omit<QARecord, "id" | "updatedAt"> & { id?: string }): QARecord {
  const store = readStore();
  const existingIndex = store.records.findIndex(
    rec => rec.departmentId === input.departmentId && rec.fiscalYear === input.fiscalYear && rec.month === input.month
  );

  const record: QARecord = {
    ...input,
    id: input.id || `${input.departmentId}-${input.fiscalYear}-${input.month}`,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    store.records[existingIndex] = record;
  } else {
    store.records.push(record);
  }

  writeStore(store);
  return record;
}

export function deleteRecord(departmentId: string, fiscalYear: string, month: string): boolean {
  const store = readStore();
  const nextRecords = store.records.filter(
    rec => !(rec.departmentId === departmentId && rec.fiscalYear === fiscalYear && rec.month === month)
  );

  const changed = nextRecords.length !== store.records.length;
  if (changed) {
    writeStore({ records: nextRecords });
  }

  return changed;
}
