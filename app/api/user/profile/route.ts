import { userController } from "@/controllers/UserController";

export async function GET(request: Request) {
    return userController.getProfile(request);
}

export async function PATCH(request: Request) {
    return userController.updateProfile(request);
}
