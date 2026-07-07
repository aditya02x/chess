import type {Request ,Response} from 'express'
import User from '../models/User.model.js'

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { promises } from 'node:dns'
import type { Error } from 'mongoose'

interface RegisterBody {
    username:string,
    email:string,
    password:string
}

export const register = async (req:Request<unknown,unknown,RegisterBody>,res:Response):promise<void>=>{
    try {
        const {username , email , password} = req.body;
        if(!username || !email || !password){
            res.status(400).json({message:"All field are required"});
            return;

        }
        const existUser = await User.findOne({ $or: [{ email }, { username }] })
        if(existUser){
            res.status(400).json({message :"User already exist "})
        }

        
    } catch (error) {
        res.status(500).json.({message:"Something went wrong ",error:(err as Error).message})
        
    }
}