import {pool} from "./database.js"  //For making query
import './dotenv.js'    //For access .env
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'    //to work with directories and files
import fs from 'fs'


const currentPath = fileURLToPath(import.meta.url)
console.log("currentPath: ", currentPath)
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
const tripsData = JSON.parse(tripsFile)