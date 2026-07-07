import type {Request ,Response} from 'express'
import User from '../models/User.model.js'

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface RegisterBody {
    username:string,
    email:string,
    password:string
}

