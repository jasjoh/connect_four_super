import { Client } from "pg";

const DB_URI = process.env.NODE_ENV === "test"
    ? "postgresql:///connect_four_test"
    : "postgresql:///connect_four";

let db = new Client({
  connectionString: DB_URI
});

db.connect();

export default db;