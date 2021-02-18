import path from 'path';
import { config } from './config';
import TeleBot from 'telebot';
import { Worker } from 'worker_threads';
import { IAsset } from 'types';

let telegram = null;
let telegramChatId = 0;
let workers = new Map<string, Worker>();

/**
 *  BOT WORKERS
 */

const onAction = (type: 'error' | 'exit' | 'message', message: any) => {
    switch (type) {
        case 'exit':
            sendTelegramMessage(`Se detuvo el worker de ${message?.asset}`);
            break;
        case 'message':
            sendTelegramMessage(message);
            break;
        case 'error':
            sendTelegramMessage(`Ocurrió un error en el worker de ${message?.asset}`);
            break;
    }
};

const addCoin = (assetData: IAsset) => {
    let asset = assetData.asset.toUpperCase();
    const worker = new Worker(path.join(__dirname, 'bots', 'v3.js'), { workerData: assetData });
    worker.on('message', msg => onAction('message', msg));
    worker.on('error', _err => onAction('error', { asset }));
    worker.on('exit', exitCode => onAction('exit', { code: exitCode, asset }));
    workers.set(asset, worker);
};

config.assets.forEach(asset => {
    addCoin(asset);
});

/**
 *  TELEGRAM
 */

const sendTelegramMessage = (msg: string) => {
    if (telegram && telegramChatId) {
        telegram.sendMessage(telegramChatId, msg);
    }
};

if (config.telegramToken) {
    telegram = new TeleBot({ token: config.telegramToken });

    telegram.on('text', (msg: any) => {
        let { chat }: { chat: any } = msg;
        let { id }: { id: number } = chat;

        if (!telegramChatId) {
            telegramChatId = id;
            sendTelegramMessage(`Los mensajes se enviarán al chat #${telegramChatId}`);
        }
    });

    telegram.start();
}

setInterval(() => console.log(`[${new Date().toLocaleString()}][MAIN] ----------------------`), 60000);
