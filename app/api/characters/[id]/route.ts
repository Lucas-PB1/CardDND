import { characterController } from "@/controllers/CharacterController";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return characterController.updateCharacter(request, { id });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return characterController.deleteCharacter(request, { id });
}
