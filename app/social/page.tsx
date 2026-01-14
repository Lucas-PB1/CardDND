import { Suspense } from "react";
import SocialDashboard from "@/components/social/SocialDashboard";

export default function SocialPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 px-6 text-white text-center">Loading...</div>}>
            <SocialDashboard />
        </Suspense>
    );
}
