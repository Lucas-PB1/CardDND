import { adminController } from "@/controllers/AdminController";

export async function PATCH(request: Request, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    return adminController.updateUserRole(request, { uid });
}
