import sql from "mssql";
import { getPool } from "../config/db.js";

export const getUserByUsername = async (username) => {
  const pool = await getPool();
  const result = await pool.request()
    .input("Username", sql.VarChar, username)
    .execute("sp_LoginUser");

  return result.recordset[0];
};
