import { socialController } from "@/controllers/SocialController";

export async function POST(request: Request) {
    return socialController.sendRequest(request);
}
