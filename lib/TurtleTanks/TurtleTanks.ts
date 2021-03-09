import {
    Message,
    MessageAttachment,
    MessageEmbed,
} from 'discord.js';

import { fabric } from 'fabric';

import { Database } from 'sqlite3';

import { loadImage } from './Utilities';
import { pickRandomItem } from '../Utilities';
import { Game } from './Game';

interface CanvasFile {
    filepath: string;
    coords: {
        left?: number;
        top?: number;
    }
}

const BODY_TEMPLATE_WIDTH = 1174;
const BODY_TEMPLATE_HEIGHT = 827;

const bodies: CanvasFile[] = [
    {
        filepath: 'bodies/body1.png',
        coords: {
            left: 0,
            top: 0,
        },
    }
];

const faces: CanvasFile[] = [
    {
        filepath: 'faces/happy1.png',
        coords: {
            left: 75,
            top: 300,
        },
    }
];

async function loadCanvasFile(canvasFile: CanvasFile): Promise<fabric.Image> {
    const image = await loadImage(canvasFile.filepath);

    image.set(canvasFile.coords);

    return image;
}

async function randomTurtle(canvas: fabric.StaticCanvas) {
    const body = await loadCanvasFile(pickRandomItem(bodies));
    const face = await loadCanvasFile(pickRandomItem(faces));

    canvas.add(body);
    canvas.add(face);
}

export async function handleTurtle(msg: Message) {
    const canvas = new fabric.StaticCanvas(null, {
        width: BODY_TEMPLATE_WIDTH,
        height: BODY_TEMPLATE_HEIGHT,
    });

    await randomTurtle(canvas);

    canvas.renderAll();

    const attachment = new MessageAttachment((canvas as any).createPNGStream(), 'turtle.png');

    msg.reply(attachment);
}

export async function handleTurtleTanks(msg: Message, args: string[], db: Database) {
    const game = new Game();

    const gameImage = await game.render();

    const attachment = game.getGameImageAttachment();

    msg.reply(attachment);
}
