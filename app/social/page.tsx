import { Suspense } from "react";

import SocialDashboard from "@/components/social/SocialDashboard";

export default function SocialPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen px-6 pt-24 text-center text-white">Loading...</div>
            }
        >
            <SocialDashboard />
        </Suspense>
    );
}
