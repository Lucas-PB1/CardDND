import { Character, CharacterFormData } from "@/schemas/characterSchema";
import { BaseApiService } from "./baseApiService";
import { storageService } from "./storageService";

const API_URL = "/api/characters";

export class CharacterClientService extends BaseApiService {
    async getCharacters() {
        return this.get<Character[]>(API_URL);
    }

    async getCharacter(characterId: string) {
        return this.get<Character>(`${API_URL}/${characterId}`);
    }

    async createCharacter(data: Partial<Character>) {
        return this.post<Character, typeof data>(API_URL, data);
    }

    async updateCharacter(characterId: string, data: Partial<Character>) {
        return this.put<Character, typeof data>(`${API_URL}/${characterId}`, data);
    }

    async deleteCharacter(characterId: string) {
        return this.delete<{ success: true }>(`${API_URL}/${characterId}`);
    }

    async createCharacterWithImage(userId: string, data: CharacterFormData) {
        let imageUrl: string | undefined;

        const { image, ...charData } = data;

        const newChar = await this.createCharacter(charData);

        if (image) {
            imageUrl = await storageService.uploadCharacterImage(userId, newChar.id, image);
            return await this.updateCharacter(newChar.id, { imageUrl });
        }

        return newChar;
    }

    async updateCharacterWithImage(userId: string, characterId: string, data: Partial<CharacterFormData>) {
        const { image, ...charData } = data;
        let imageUrl: string | undefined;

        if (image) {
            imageUrl = await storageService.uploadCharacterImage(userId, characterId, image);
        }

        const updateData: Partial<Character> = {
            ...charData,
            ...(imageUrl ? { imageUrl } : {}),
        };

        return await this.updateCharacter(characterId, updateData);
    }
}

export const characterClient = new CharacterClientService();
