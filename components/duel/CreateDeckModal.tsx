import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Deck } from "@/schemas/duelSchema";
import { useCreateDeckModal } from "@/hooks/useCreateDeckModal";

interface CreateDeckModalProps {
    isOpen: boolean;
    onClose: () => void;
    characterId: string;
    existingDeck?: Deck | null;
    onDeckCreated: () => void;
}

export function CreateDeckModal(props: CreateDeckModalProps) {
    const {
        formState: {
            name, setName,
            description, setDescription,
            loading,
            error
        },
        handleSubmit,
        handleClose
    } = useCreateDeckModal(props);

    const { existingDeck } = props;

    return (
        <Modal isOpen={props.isOpen} onClose={handleClose} title={existingDeck ? "Edit Deck" : "Create New Deck"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-dnd-crimson mb-1">Deck Name</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Fire Spells, Boss Raid Support"
                        className="bg-white text-dnd-fg border-dnd-border focus:border-dnd-gold placeholder:text-muted-foreground"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-dnd-crimson mb-1">Description (Optional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-dnd-fg shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-dnd-border focus:border-dnd-gold"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-dnd-gold text-dnd-crimson hover:bg-dnd-crimson hover:text-dnd-gold font-bold">
                        {loading ? "Saving..." : (existingDeck ? "Save Changes" : "Create Deck")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
