import sql from "mssql";
import { getPool } from "../config/db.js";

export async function createReview(data) {
  const pool = await getPool();
  const result = await pool.request()
    .input("expediente_id", sql.Int, data.expediente_id)
    .input("coordinador_id", sql.Int, data.coordinador_id)
    .input("estado", sql.VarChar, data.estado)
    .input("justificacion", sql.VarChar, data.justificacion)
    .execute("spCreateReview");

  const result2 = await pool.request()
    .input("id", sql.Int, result.recordset[0].id)
    .input("estado", sql.VarChar, data.estado)
    .execute("spUpdateExpedienteEstado");

  return result.recordset[0];
}

export async function getReviews() {
  const pool = await getPool();
  const result = await pool.request().execute("spGetReviews");
  return result.recordset;
}

export async function getReviewById(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input("id", sql.Int, id)
    .execute("spGetReviewById");

  return result.recordset[0];
}

export async function updateReview(id, data) {
  const pool = await getPool();
  await pool.request()
    .input("id", sql.Int, id)
    .input("estado", sql.VarChar, data.estado)
    .input("justificacion", sql.VarChar, data.justificacion)
    .execute("spUpdateReview");
}

export async function deleteReview(id) {
  const pool = await getPool();
  await pool.request()
    .input("id", sql.Int, id)
    .execute("spDeleteReview");
}
