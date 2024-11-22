import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();
const myDataSource: DataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.POSTGRESDB_USER as string,
    password: process.env.POSTGRESDB_ROOT_PASSWORD as string,
    database: process.env.POSTGRESDB_DATABASE as string,
    entities: ["src/**/*.entity{.ts,.js}"], // where our entities reside
    migrations: ["src/db/migrations/*{.ts,.js}"], // where our migrations reside
    logging: process.env.NODE_ENV === "dev" ? false : false,
    synchronize: process.env.NODE_ENV === "dev" ? false : false
});

export default myDataSource;