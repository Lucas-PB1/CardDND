import { Page } from 'playwright';

export interface Monster {
    name: string;
    cr: string;
}

export class MonsterScraper {
    async scrapeByCR(page: Page, url: string): Promise<Monster[]> {
        console.log(`[Scrape] Navigating to ${url}...`);
        await page.goto(url);

        // Ensure cookies don't block the view
        const acceptAllButton = page.locator('button:has-text("Accept All"), button:has-text("Aceitar Tudo")');
        if (await acceptAllButton.isVisible()) {
            await acceptAllButton.click();
        }

        console.log('[Scrape] Extracting data from DOM...');
        const monsters = await page.evaluate(() => {
            const results: { name: string; cr: string }[] = [];
            const content = document.querySelector('.p-article-content');
            if (!content) return results;

            const children = Array.from(content.children);
            let currentCR = 'Unknown';

            children.forEach(el => {
                const text = el.textContent?.trim() || '';

                if (el.tagName === 'H3' && text.startsWith('CR ')) {
                    currentCR = text;
                } else if (currentCR && (el.classList.contains('flexible-quad-column') || el.tagName === 'P')) {
                    const links = el.querySelectorAll('a');
                    links.forEach(a => {
                        const monsterName = a.textContent?.trim();
                        if (monsterName &&
                            !monsterName.includes('CR ') &&
                            !monsterName.toLowerCase().includes('back to top') &&
                            monsterName.length > 1) {
                            results.push({
                                name: monsterName,
                                cr: currentCR
                            });
                        }
                    });
                }
            });

            return results;
        });

        console.log(`[Scrape] Extraction complete. Found ${monsters.length} monsters.`);
        return monsters;
    }
}
