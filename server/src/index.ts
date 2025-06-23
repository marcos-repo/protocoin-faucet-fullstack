import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';


import { mintAndTransfer, setMintAmount } from './Web3Provider';

const PORT : number = parseInt(`${process.env.PORT || 3001}`);

const app = express();

app.use(morgan("tiny"));

app.post('/mint/:wallet', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tx = await mintAndTransfer(req.params.wallet);
        res.json(tx);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.listen(
    PORT, 
    () => console.log('Server is listening at ' + PORT)
);