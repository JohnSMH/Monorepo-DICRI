import { getPool, sql } from "../config/db.js";

export const listByExpediente = async (expedienteId) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("ExpedienteId", sql.Int, expedienteId)
    .execute("sp_GetEvidenciasByExpediente");

  return result.recordset;
};

export const getById = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Id", sql.Int, id)
    .execute("sp_GetEvidenciaById");

  return result.recordset[0];
};

export const create = async (data) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("ExpedienteId", sql.Int, data.expediente_id)
    .input("NombreObjeto", sql.VarChar, data.nombre_objeto)
    .input("Descripcion", sql.VarChar, data.descripcion)
    .input("Color", sql.VarChar, data.color)
    .input("Tamano", sql.VarChar, data.tamano)
    .input("Peso", sql.VarChar, data.peso)
    .input("Ubicacion", sql.VarChar, data.ubicacion)
    .input("TecnicoId", sql.Int, data.tecnico_id)
    .execute("sp_CreateEvidencia");

  return result.recordset[0];
};

export const update = async (id, data) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Id", sql.Int, id)
    .input("NombreObjeto", sql.VarChar, data.nombre_objeto)
    .input("Descripcion", sql.VarChar, data.descripcion)
    .input("Color", sql.VarChar, data.color)
    .input("Tamano", sql.VarChar, data.tamano)
    .input("Peso", sql.VarChar, data.peso)
    .input("Ubicacion", sql.VarChar, data.ubicacion)
    .execute("sp_UpdateEvidencia");

  return result.recordset[0];
};

export const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input("Id", sql.Int, id)
    .execute("sp_DeleteEvidencia");
};
