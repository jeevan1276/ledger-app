
export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS contact (
    id           TEXT PRIMARY KEY NOT NULL,
    name         TEXT NOT NULL,
    phone        TEXT,
    contact_type TEXT NOT NULL DEFAULT 'customer'
                   CHECK (contact_type IN ('customer', 'supplier', 'other')),
    is_archived  INTEGER NOT NULL DEFAULT 0
                   CHECK (is_archived IN (0, 1)),
    created_at   TEXT NOT NULL,
    updated_at   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS txn (
    id           TEXT PRIMARY KEY NOT NULL,
    contact_id   TEXT NOT NULL REFERENCES contact(id),
    amount       INTEGER NOT NULL CHECK (amount > 0),
    type         TEXT NOT NULL CHECK (type IN ('credit', 'payment')),
    date         TEXT NOT NULL,
    note         TEXT,
    media_uri    TEXT,
    created_at   TEXT NOT NULL,
    updated_at   TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_txn_contact_id ON txn(contact_id);
  CREATE INDEX IF NOT EXISTS idx_txn_date ON txn(date);
`;