import { adminController } from "@/controllers/AdminController";

export async function GET(request: Request) {
    return adminController.getUsers(request);
}
