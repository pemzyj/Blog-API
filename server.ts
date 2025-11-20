import express from "express";
import type { Request, Response } from "express";
import pool from "./database/db.js";
import "dotenv/config"

const app = express();

const port = process.env.PORT

app.get("/db-test", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json(result.rows);
    console.log('database connection successful')
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});


app.listen(port, ()=> {
    console.log(`server is running on port ${port}`)
});