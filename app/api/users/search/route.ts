import { socialController } from "@/controllers/SocialController";

export async function GET(request: Request) {
    return socialController.searchUsers(request);
}
