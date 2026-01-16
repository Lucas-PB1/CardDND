import { DuelArena } from "@/components/duel/DuelArena";

interface PageProps {
    params: {
        matchId: string;
    }
}

export default function DuelPage({ params }: PageProps) {
    return <DuelArena matchId={params.matchId} />;
}
