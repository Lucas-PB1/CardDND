import * as fs from 'fs';
import * as path from 'path';

export class StorageManager {
    static exists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    static saveJson(filePath: string, data: any) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`[Storage] Saved to ${filePath}`);
    }

    static loadJson(filePath: string): any {
        if (!this.exists(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
}
