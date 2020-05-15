import { Router } from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
import { User } from '../models/User'
import { config } from '../../../../config/config'

const router = Router()

async function comparePasswords(plainTextPassword, hash){
    return await bcrypt.compare(plainTextPassword, hash)
}

async function generatePasswords(plainTextPassword){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(plainTextPassword, salt)
}