import { Page, BrowserContext } from 'playwright';

export interface AuthConfig {
    email?: string;
    password?: string;
    authFile: string;
}

export class AuthHandler {
    constructor(private config: AuthConfig) { }

    async handleCookies(page: Page) {
        const acceptAllButton = page.locator('button:has-text("Accept All"), button:has-text("Aceitar Tudo"), button:has-text("Accept")');
        if (await acceptAllButton.isVisible()) {
            console.log('[Auth] Clicking cookie banner...');
            await acceptAllButton.click();
            await page.waitForTimeout(1000);
        }
    }

    async ensureLoggedIn(page: Page) {
        console.log('[Auth] Verifying login state...');
        await page.goto('https://www.dndbeyond.com/en');
        await this.handleCookies(page);

        const isLoggedIn = await page.locator('button[aria-label="Toggle user menu"]').isVisible();
        if (isLoggedIn) {
            console.log('[Auth] Already logged in.');
            return true;
        }

        console.log('[Auth] Not logged in. Starting login flow...');
        await this.login(page);
        return true;
    }

    private async login(page: Page) {
        if (!this.config.email || !this.config.password) {
            throw new Error('DND_BEYOND_EMAIL or DND_BEYOND_PASSWORD environment variables are missing.');
        }

        console.log('[Auth] Navigating to sign in options...');
        await page.click('a.SitebarLoggedOut_signIn__AHLTZ');
        await this.handleCookies(page);

        console.log('[Auth] Selecting Wizards login...');
        await page.waitForSelector('text="Sign in with Wizards"');
        await page.click('text="Sign in with Wizards"');

        console.log('[Auth] Waiting for login form or authorize screen...');

        const loginFormSelector = 'input[type="text"], input[type="email"]';
        const authorizeButtonSelector = 'button:has-text("Autorizar"), button:has-text("Authorize")';

        try {
            const found = await Promise.race([
                page.waitForSelector(loginFormSelector, { timeout: 10000 }).then(() => 'login'),
                page.waitForSelector(authorizeButtonSelector, { timeout: 10000 }).then(() => 'authorize'),
                page.waitForURL(/dndbeyond\.com/).then(() => 'redirected')
            ]);

            if (found === 'login') {
                console.log('[Auth] Filling login form...');
                await page.fill(loginFormSelector, this.config.email);
                await page.fill('input[type="password"]', this.config.password);
                console.log('[Auth] Submitting credentials...');
                await page.click('button:has-text("ENTRAR"), button:has-text("Sign In"), button.bg-wizards-purple');

                await this.handleAuthorization(page);
            } else if (found === 'authorize') {
                console.log('[Auth] Already on authorize screen.');
                await this.handleAuthorization(page);
            } else {
                console.log('[Auth] Already redirected or logged in.');
            }
        } catch (error) {
            console.log('[Auth] Timeout waiting for login/authorize screen. Checking current URL:', page.url());
        }

        console.log('[Auth] Waiting for final redirect to dndbeyond...');
        try {
            await page.waitForURL(/^https?:\/\/(www\.)?dndbeyond\.com/, { timeout: 30000 });
            console.log('[Auth] Redirected. Current URL:', page.url());

            await page.waitForSelector('button[aria-label="Toggle user menu"]', { timeout: 20000 });
            console.log('[Auth] Login successful!');
        } catch (e) {
            console.error('[Auth] Failed to verify login state. Capturing screenshot...');
            await page.screenshot({ path: 'login-error.png' });
            console.log('[Auth] Error screenshot saved as login-error.png. Current URL:', page.url());
            throw new Error('Login verification failed');
        }
    }

    private async handleAuthorization(page: Page) {
        console.log('[Auth] Checking for consent screen...');
        const authorizeButton = page.locator('button:has-text("Autorizar"), button:has-text("Authorize")');
        try {
            await authorizeButton.waitFor({ state: 'visible', timeout: 5000 });
            console.log('[Auth] Clicking "Autorizar"...');
            await authorizeButton.click();
        } catch (e) {
            console.log('[Auth] Consent screen not found.');
        }
    }

    async saveState(context: BrowserContext) {
        await context.storageState({ path: this.config.authFile });
        console.log(`[Auth] Session saved to ${this.config.authFile}`);
    }
}
