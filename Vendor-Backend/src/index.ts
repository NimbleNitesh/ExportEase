import express from 'express';
import myDataSource from "./app-data-source";
import cors from 'cors';
import  userRouter  from './routes/user.routes';
import { redisClient } from './redis-client';
import { createClient } from 'redis';
import "reflect-metadata";
import * as dotenv from "dotenv";


declare global {
  namespace Express {
    interface Request {
      redis: ReturnType<typeof createClient>;
    }
  }
}


const main = async () => {  
  dotenv.config();
  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Inject Redis client into the request object
  app.use((req, _res, next) => {
    req.redis = redisClient;
    next();
  });

  app.use('/api/v1/auth', userRouter);
  myDataSource.initialize()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    console.log('Database connected');
    })
    .catch((err) => {
      console.error(err);
    });
};
console.log('Nitesh Srivastava')
main().catch((err) => {
  console.error(err);
});