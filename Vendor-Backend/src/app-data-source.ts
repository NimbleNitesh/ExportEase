import { DataSource } from "typeorm";


export const myDataSource: DataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.POSTGRESDB_USER,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    database: process.env.POSTGRESDB_DATABASE,
    entities: ["src/entities/*.ts"],
    logging: process.env.NODE_ENV === "dev" ? false : false,
    synchronize: process.env.NODE_ENV === "dev" ? false : false
});