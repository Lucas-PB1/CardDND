import { BrowserManager } from './BrowserManager';
import { AuthHandler } from './AuthHandler';
import { MonsterScraper } from './MonsterScraper';
import { StorageManager } from './StorageManager';
import * as path from 'path';

export interface OrchestratorConfig {
    email?: string;
    password?: string;
    authFile: string;
    targetUrl: string;
    outputFile: string;
}

export class CrawlerOrchestrator {
    private browserManager: BrowserManager;
    private authHandler: AuthHandler;
    private monsterScraper: MonsterScraper;

    constructor(private config: OrchestratorConfig) {
        this.browserManager = new BrowserManager();
        this.authHandler = new AuthHandler({
            email: config.email,
            password: config.password,
            authFile: config.authFile
        });
        this.monsterScraper = new MonsterScraper();
    }

    async run() {
        console.log('[Orchestrator] Starting process...');

        const storageState = StorageManager.exists(this.config.authFile) ? this.config.authFile : undefined;
        const { context } = await this.browserManager.init(storageState);
        const page = await this.browserManager.createPage();

        try {
            await this.authHandler.ensureLoggedIn(page);
            await this.authHandler.saveState(context);

            const monsters = await this.monsterScraper.scrapeByCR(page, this.config.targetUrl);

            StorageManager.saveJson(this.config.outputFile, monsters);

            console.log('[Orchestrator] Process finished successfully.');
            await page.waitForTimeout(3000);
        } catch (error) {
            console.error('[Orchestrator] Error during execution:', error);
            throw error;
        } finally {
            await this.browserManager.close();
        }
    }
}
