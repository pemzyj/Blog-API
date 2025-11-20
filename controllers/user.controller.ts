import express from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../database/db.js";

const app = express();

//create a new user
export async function CreateUser (req: Request, res: Response) {
    const {username, email, password} = req.body;

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?) [username, email, hashedPassword]')
        res.status(201).json({msg: 'user created successfully'})
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: 'Error creating new user'})
    }
};

//delete an existing user
export async function DeleteUser(req: Request, res: Response) {
    const {id} = req.params;
        
    try{

        const result = await pool.query(
            `DELETE FROM users
            WHERE id = $1
            RETURNING id, email
            `, [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({msg:'User doesn\'t exist'})
        }

        res.status(200).json({msg: 'User deleted', user: result.rows[0]});

        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Server error'});
        }
    }

//update existing user
export async function UpdateUser (req: Request<{ id: string }>, res:Response) {
    const {id} = req.params;
    const {username, password} = req.body;

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        
        if (!username || !password) {
            res.status(400).json({msg: 'Email and password is required'});
        }

        const result = await pool.query(
            `UPDATE users
            SET username = $1, 
            password = $2
            WHERE 
            id = $3
            RETURNING id, email
            ` ,
            [username, hashedPassword, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({msg: "User doesn't exist"});
        }

        res.status(201).json({msg: 'user updated successfully', user: result.rows[0]})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'})
    };

};



