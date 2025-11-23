import { getPool, sql } from "../config/db.js";

export const list = async () => {
  const pool = await getPool();
  const result = await pool.request().execute("sp_GetExpedientes");
  return result.recordset;
};

export const getById = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Id", sql.Int, id)
    .execute("sp_GetExpedienteById");
  return result.recordset[0];
};

export const create = async (data) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Titulo", sql.VarChar, data.titulo)
    .input("Descripcion", sql.VarChar, data.descripcion)
    .input("TecnicoId", sql.Int, data.tecnico_id)
    .execute("sp_CreateExpediente");

  return result.recordset[0];
};

export const update = async (id, data) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Id", sql.Int, id)
    .input("Titulo", sql.VarChar, data.titulo)
    .input("Descripcion", sql.VarChar, data.descripcion)
    .input("Estado", sql.VarChar, data.estado)
    .execute("sp_UpdateExpediente");

  return result.recordset[0];
};

export const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input("Id", sql.Int, id)
    .execute("sp_DeleteExpediente");
};
