import sql from "mssql";
import { getPool } from "../config/db.js";

export const list = async () => {
  const pool = await getPool();
  const result = await pool.request().execute("sp_GetUsers");
  return result.recordset;
};

export const getById = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Id", sql.Int, id)
    .execute("sp_GetUserById");
  return result.recordset[0];
};

export const create = async (data) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Username", sql.VarChar, data.username)
    .input("PasswordHash", sql.VarChar, data.passwordHash)
    .input("Role", sql.VarChar, data.role)
    .execute("sp_CreateUser");

  return result.recordset[0];
};

export const update = async (id, data) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Id", sql.Int, id)
    .input("Username", sql.VarChar, data.username)
    .input("Role", sql.VarChar, data.role)
    .execute("sp_UpdateUser");

  return result.recordset[0];
};

export const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input("Id", sql.Int, id)
    .execute("sp_DeleteUser");
};
