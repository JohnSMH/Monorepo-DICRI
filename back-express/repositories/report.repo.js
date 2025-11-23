import sql from "mssql";
import { getPool } from "../config/db.js";

export const createReport = async (filters) => {
  const { fechaInicio, fechaFin, estadoExpediente, estadoReview } = filters;
  const pool = await getPool();
  const result = await pool.request()
    .input("fechaInicio", sql.DateTime, fechaInicio || null)
    .input("fechaFin", sql.DateTime, fechaFin || null)
    .input("estadoExpediente", sql.VarChar(20), estadoExpediente || null)
    .input("estadoReview", sql.VarChar(20), estadoReview || null)
    .execute("spCreateReport");

  // returns all 3 recordsets: registros, aprobados, rechazados
  return {
    registros: result.recordsets[0],
    aprobados: result.recordsets[1],
    rechazados: result.recordsets[2],
  };
};
