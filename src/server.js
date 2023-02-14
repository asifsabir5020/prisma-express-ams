import express from "express";
import dotEnv from 'dotenv';
import morgan from "morgan";
import 'express-async-errors';
import cors from 'cors';
import { NotFoundError } from './utils/errors';
import { errorHandler } from './middlewares/errors';
import { bookRouter } from "./routers/book";
import { authRouter } from "./routers/auth";

dotEnv.config();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());

app.use('/api/v1/users', authRouter);
app.use('/api/v1/books', bookRouter);



app.all('*', (req, res, next) => {
    throw new NotFoundError(`${req.originalUrl} route not found`);
});

app.use(errorHandler);

const start = async () => {
    try{
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }catch(error){
        console.log(error);
    }
}

start();