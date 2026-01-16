import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CardType, MagicLevel, Card } from "@/schemas/duelSchema";
import { useAddCardModal } from "@/hooks/useAddCardModal";
import { CardImageUpload } from "@/components/duel/CardImageUpload";

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    characterId: string;
    deckId: string;
    existingCard?: Card | null;
    onCardAdded: () => void;
}

export function AddCardModal(props: AddCardModalProps) {
    const {
        formState: {
            name, setName,
            description, setDescription,
            type, setType,
            magicLevel, setMagicLevel,
            damage, setDamage,
            test, setTest,
            previewUrl,
            loading,
            error
        },
        fileHandling: {
            fileInputRef,
            handleFileChange,
            handleRemoveImage
        },
        handleSubmit,
        handleClose
    } = useAddCardModal(props);

    const { existingCard } = props;

    return (
        <Modal isOpen={props.isOpen} onClose={handleClose} title={existingCard ? "Edit Card" : "Add New Card"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-dnd-crimson mb-1">Card Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Fireball"
                                className="bg-white text-dnd-fg border-dnd-border focus:border-dnd-gold placeholder:text-muted-foreground"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-dnd-crimson mb-1">Type</label>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value as CardType)}
                                className="bg-white text-dnd-fg border-dnd-border focus:border-dnd-gold w-full"
                                options={Object.values(CardType).map((t) => ({ label: t, value: t }))}
                            />
                        </div>

                        {type === CardType.Magic && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="block text-sm font-bold text-dnd-crimson mb-1">Magic Level</label>
                                <Select
                                    value={magicLevel}
                                    onChange={(e) => setMagicLevel(e.target.value as MagicLevel)}
                                    className="bg-white text-dnd-fg border-dnd-border focus:border-dnd-gold w-full"
                                    options={[
                                        { label: "Select Level...", value: "" },
                                        ...Object.values(MagicLevel).map((l) => ({ label: l, value: l }))
                                    ]}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-dnd-crimson mb-1">Damage / Effect</label>
                            <Input
                                value={damage}
                                onChange={(e) => setDamage(e.target.value)}
                                placeholder="e.g., 2d6 + 4 Fire"
                                className="bg-white text-dnd-fg border-dnd-border focus:border-dnd-gold placeholder:text-muted-foreground"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-dnd-crimson mb-1">Test / DC</label>
                            <Input
                                value={test}
                                onChange={(e) => setTest(e.target.value)}
                                placeholder="e.g., DEX 15"
                                className="bg-white text-dnd-fg border-dnd-border focus:border-dnd-gold placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <CardImageUpload
                            previewUrl={previewUrl}
                            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
                            onFileChange={handleFileChange}
                            onRemoveImage={handleRemoveImage}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-dnd-crimson mb-1">Description / Details</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the effect, damage, range, etc."
                        className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-dnd-fg shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-dnd-border focus:border-dnd-gold"
                        rows={4}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-dnd-gold text-dnd-crimson hover:bg-dnd-crimson hover:text-dnd-gold font-bold">
                        {loading ? "Saving..." : (existingCard ? "Save Changes" : "Add Card")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
