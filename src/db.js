import { createPool } from 'mysql2/promise'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'nodelogin'
})

export const pool1 = createPool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
})


async function conectarABD(){

    const database = process.env.DB_DATABASE

    try{
        const connection = await pool1.getConnection();
        console.log('Conectado a la base de datos ' + database)
    }catch(error){
        console.log('la conexion esta dando error: ',error)
    }
}

conectarABD()


