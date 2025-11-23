import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { getPool } from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health/ping", (req, res) => {
  res.json({ ok: true });
});

app.get("/health/db", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT GETDATE() AS now");
    res.json({ ok: true, db_time: result.recordset[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api", routes);

export default app;
