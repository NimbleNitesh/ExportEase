import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();
const myDataSource: DataSource = new DataSource({
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: process.env.POSTGRESDB_USER as string,
    password: process.env.POSTGRESDB_ROOT_PASSWORD as string,
    database: process.env.POSTGRESDB_DATABASE as string,
    entities: ['dist/**/*.entity.js'],  // it is /dist foler in the container
    migrations: [`${__dirname}/src/migrations/*{.ts, js}`],
    logging: process.env.NODE_ENV === "dev" ? false : false,
    synchronize: process.env.NODE_ENV === "dev" ? false : false,
    
});

export default myDataSource;