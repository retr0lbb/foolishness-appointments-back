import mysql from "mysql2/promise.js";
import { env } from "../utils/env";

export async function getConnection() {
  return mysql.createConnection({
    host:  "localhost",
    user: "docker",
    database:"foolish",
    password: "docker",
    rowsAsArray: false
  });
}
