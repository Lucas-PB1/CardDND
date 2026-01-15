import { Page } from 'playwright';

export interface Monster {
    name: string;
    cr: string;
    url: string;
}

export class MonsterScraper {
    async scrapeByCR(page: Page, url: string): Promise<Monster[]> {
        console.log(`[Scrape] Navigating to ${url}...`);
        await page.goto(url);

        const acceptAllButton = page.locator('button:has-text("Accept All"), button:has-text("Aceitar Tudo")');
        if (await acceptAllButton.isVisible()) {
            await acceptAllButton.click();
        }

        console.log('[Scrape] Extracting data from DOM...');
        const monsters = await page.evaluate(() => {
            const results: { name: string; cr: string; url: string }[] = [];

            const startHeader = document.getElementById('MonstersbyChallengeRating');
            if (!startHeader) {
                console.error('Start header "MonstersbyChallengeRating" not found');
                return results;
            }

            let currentCR = 'Unknown';
            let currentElement = startHeader.nextElementSibling;
            const baseUrl = 'https://www.dndbeyond.com';

            while (currentElement && currentElement.tagName !== 'H2') {
                const text = currentElement.textContent?.trim() || '';

                if (currentElement.tagName === 'H3' && text.startsWith('CR ')) {
                    currentCR = text;
                } else if (currentCR !== 'Unknown' && (currentElement.classList.contains('flexible-quad-column') || currentElement.tagName === 'P')) {
                    const links = currentElement.querySelectorAll('a');
                    links.forEach(a => {
                        const monsterName = a.textContent?.trim();
                        if (monsterName &&
                            !monsterName.includes('CR ') &&
                            !monsterName.toLowerCase().includes('back to top') &&
                            monsterName.length > 1) {

                            let href = a.getAttribute('href') || '';
                            if (href.startsWith('/')) {
                                href = baseUrl + href;
                            }

                            results.push({
                                name: monsterName,
                                cr: currentCR,
                                url: href
                            });
                        }
                    });
                }
                currentElement = currentElement.nextElementSibling;
            }

            return results;
        });

        console.log(`[Scrape] Extraction complete. Found ${monsters.length} monsters.`);
        return monsters;
    }
}
