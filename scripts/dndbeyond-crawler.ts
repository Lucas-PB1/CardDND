import { CrawlerOrchestrator } from './lib/crawler/CrawlerOrchestrator';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const config = {
    email: process.env.DND_BEYOND_EMAIL,
    password: process.env.DND_BEYOND_PASSWORD,
    authFile: path.join(process.cwd(), 'auth.json'),
    targetUrl: 'https://www.dndbeyond.com/sources/dnd/mm-2024/monster-lists#MonstersbyChallengeRating',
    outputFile: path.join(process.cwd(), 'monsters.json')
};

async function main() {
    const orchestrator = new CrawlerOrchestrator(config);
    try {
        await orchestrator.run();
    } catch (error) {
        process.exit(1);
    }
}

main();
