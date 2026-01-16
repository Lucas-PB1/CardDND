import { characterService } from "@/services/characterService";
import { BaseController } from "./BaseController";

export class CharacterController extends BaseController {
    async getCharacters(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid } = decodedToken;

            const characters = await characterService.getCharacters(uid);
            return this.jsonResponse(characters);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async getCharacter(request: Request, params: { id: string }) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid } = decodedToken;
            const { id } = params;

            const character = await characterService.getCharacter(uid, id);

            if (!character) {
                return this.jsonResponse({ error: "Character not found" }, 404);
            }

            return this.jsonResponse(character);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async createCharacter(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid } = decodedToken;

            const body = await request.json();

            const newCharacter = await characterService.createCharacter(uid, body);
            return this.jsonResponse(newCharacter, 201);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async updateCharacter(request: Request, params: { id: string }) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid } = decodedToken;
            const { id } = params;

            const body = await request.json();

            // Verify ownership
            const existing = await characterService.getCharacter(uid, id);
            if (!existing) {
                return this.jsonResponse({ error: "Character not found" }, 404);
            }

            const updatedCharacter = await characterService.updateCharacter(uid, id, body);
            return this.jsonResponse(updatedCharacter);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async deleteCharacter(request: Request, params: { id: string }) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid } = decodedToken;
            const { id } = params;

            const existing = await characterService.getCharacter(uid, id);
            if (!existing) {
                return this.jsonResponse({ error: "Character not found" }, 404);
            }

            await characterService.deleteCharacter(uid, id);
            return this.jsonResponse({ success: true });
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }
}

export const characterController = new CharacterController();
