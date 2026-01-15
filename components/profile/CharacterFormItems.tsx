import React from "react";
import { CustomComponentProps } from "@/components/ui/GenericForm";
import { CharacterFormData, Character } from "@/schemas/characterSchema";
import { AbilityScore, ABILITY_LABELS, ABILITY_FULL_LABELS, SKILL_METADATA } from "@/lib/characterConstants";
import { AvatarField } from "@/components/profile/AvatarField";

export const StatBox = ({ label, value, onChange, error }: { label: string; value: number; onChange: (val: number) => void; error?: string }) => {
    const modifier = Math.floor((Number(value || 10) - 10) / 2);
    const modStr = modifier >= 0 ? `+${modifier}` : modifier;

    return (
        <div className="flex flex-col items-center bg-muted/10 border border-border rounded-xl p-3 hover:bg-muted/20 transition-all group">
            <span className="text-[10px] font-bold text-dnd-red/70 uppercase tracking-widest mb-1">{label}</span>
            <div className="text-3xl font-black text-dnd-fg leading-none mb-2">{modStr}</div>
            <div className="mt-auto pt-2 border-t border-border w-full flex justify-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-12 bg-transparent text-center text-xs font-bold text-muted-foreground hover:text-dnd-fg transition-colors outline-none"
                />
            </div>
            {error && <p className="text-[10px] text-destructive mt-1">{error}</p>}
        </div>
    );
};

export const SkillItem = ({ label, value, onChange }: { label: string; value: number; onChange: (val: number) => void }) => {
    return (
        <div className="flex items-center justify-between group py-2 px-2 transition-colors border-b border-border/50 hover:bg-muted/5">
            <p className="text-xs font-bold text-dnd-fg uppercase tracking-tight flex-1 pr-2">{label}</p>
            <div className="flex items-center gap-3">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-12 bg-transparent text-right text-base font-black text-dnd-crimson transition-colors outline-none border-b border-transparent hover:border-dnd-crimson/50 focus:border-dnd-crimson pb-0.5 placeholder:text-muted-foreground/30"
                />
            </div>
        </div>
    );
};

export const SectionHeader = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 py-4 mt-4 first:mt-0">
        <h3 className="text-xs font-black text-dnd-red/80 uppercase tracking-[0.2em] whitespace-nowrap">
            {label}
        </h3>
        <div className="h-px w-full bg-gradient-to-r from-dnd-red/20 to-transparent" />
    </div>
);

interface CharacterAvatarFieldProps extends CustomComponentProps<CharacterFormData> {
    initialData?: Character;
}

export const CharacterAvatarField = ({ onChange, value, error, initialData }: CharacterAvatarFieldProps) => (
    <AvatarField
        onChange={onChange as (file: File | null) => void}
        value={value as File | undefined}
        error={error}
        currentPhotoURL={initialData?.imageUrl || undefined}
        displayName={initialData?.name}
    />
);

export const StatsField = ({ value, onChange }: CustomComponentProps<CharacterFormData>) => {
    const stats = (value as CharacterFormData['stats']) || {
        strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {Object.values(AbilityScore).map((ability) => (
                <StatBox
                    key={ability}
                    label={ABILITY_LABELS[ability]}
                    value={stats[ability]}
                    onChange={(v) => onChange({ ...stats, [ability]: v })}
                />
            ))}
        </div>
    );
};

export const SavingThrowsField = ({ value, onChange }: CustomComponentProps<CharacterFormData>) => {
    const saves = (value as CharacterFormData['savingThrows']) || {
        strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
            {Object.values(AbilityScore).map((ability) => (
                <SkillItem
                    key={ability}
                    label={ABILITY_FULL_LABELS[ability]}
                    value={saves[ability]}
                    onChange={(v) => onChange({ ...saves, [ability]: v })}
                />
            ))}
        </div>
    );
};

export const SkillsField = ({ value, onChange }: CustomComponentProps<CharacterFormData>) => {
    const skills = (value as CharacterFormData['skills']) || {
        acrobatics: 0, animalHandling: 0, arcana: 0, athletics: 0, deception: 0,
        history: 0, insight: 0, intimidation: 0, investigation: 0, medicine: 0,
        nature: 0, perception: 0, performance: 0, persuasion: 0, religion: 0,
        sleightOfHand: 0, stealth: 0, survival: 0
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-1 p-2">
            {Object.entries(SKILL_METADATA).map(([skillKey, metadata]) => (
                <SkillItem
                    key={skillKey}
                    label={`${metadata.label} (${ABILITY_LABELS[metadata.ability]})`}
                    value={skills[skillKey as keyof typeof skills]}
                    onChange={(v) => onChange({ ...skills, [skillKey]: v })}
                />
            ))}
        </div>
    );
};
