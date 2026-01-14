import { socialController } from "@/controllers/SocialController";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return socialController.respondToRequest(request, { id });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return socialController.deleteFriend(request, { id });
}
