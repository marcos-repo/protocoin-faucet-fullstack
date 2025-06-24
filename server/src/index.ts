import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';


import { mintAndTransfer } from './Web3Provider';

const PORT : number = parseInt(`${process.env.PORT || 3001}`);

const app = express();

app.use(morgan("tiny"));

import cors from 'cors';
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

app.post('/mint/:wallet', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tx = await mintAndTransfer(req.params.wallet);
        res.json(tx);
    } 
    catch (error: any) {
        console.error(error);
        res.status(500).json(error.cause?.errorArgs?.message || error.message);
    }
});

app.listen(
    PORT, 
    () => console.log('Server is listening at ' + PORT)
);