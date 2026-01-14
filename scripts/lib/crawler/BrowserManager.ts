import { chromium, Browser, BrowserContext, Page } from 'playwright';

export interface BrowserConfig {
    headless?: boolean;
    slowMo?: number;
}

export class BrowserManager {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;

    constructor(private config: BrowserConfig = { headless: false, slowMo: 1000 }) { }

    async init(storageState?: string) {
        console.log('[Browser] Launching...');
        this.browser = await chromium.launch({
            headless: this.config.headless,
            slowMo: this.config.slowMo
        });

        this.context = await this.browser.newContext({ storageState });
        return { browser: this.browser, context: this.context };
    }

    async createPage(): Promise<Page> {
        if (!this.context) throw new Error('Browser context not initialized');
        return await this.context.newPage();
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('[Browser] Closed.');
        }
    }
}
