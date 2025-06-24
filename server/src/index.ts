import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import { mintAndTransfer } from './Web3Provider';

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

const nextMint = new Map<string, number>();

app.post('/mint/:wallet', async (req: Request, res: Response, next: NextFunction) => {
    
    const wallet = req.params.wallet;

    if(nextMint.has(wallet) && nextMint.get(wallet)! > Date.now()) {
         res.status(400).json('Voce nao pode realizar o mint 2x em um dia.');
         return;
    }

    try {
        const tx = await mintAndTransfer(wallet);
        res.json(tx);
    } 
    catch (error: any) {
        console.error(error);
        res.status(500).json(error.cause?.errorArgs?.message || error.message);
    }

    nextMint.set(wallet, Date.now() + (24 * 60 * 60 * 1000));
});

const PORT : number = parseInt(`${process.env.PORT || 3001}`);
app.listen(
    PORT, 
    () => console.log('Server is listening at ' + PORT)
);