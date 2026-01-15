import { characterController } from "@/controllers/CharacterController";

export async function GET(request: Request) {
    return characterController.getCharacters(request);
}

export async function POST(request: Request) {
    return characterController.createCharacter(request);
}
