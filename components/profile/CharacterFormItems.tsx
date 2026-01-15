import React from "react";
import { CustomComponentProps } from "@/components/ui/GenericForm";
import { CharacterFormData, Character } from "@/schemas/characterSchema";
import { AbilityScore, ABILITY_LABELS, ABILITY_FULL_LABELS, SKILL_METADATA } from "@/lib/characterConstants";
import { AvatarField } from "@/components/profile/AvatarField";

export const StatBox = ({ label, value, onChange, error }: { label: string; value: number; onChange: (val: number) => void; error?: string }) => {
    const modifier = Math.floor((Number(value || 10) - 10) / 2);
    const modStr = modifier >= 0 ? `+${modifier}` : modifier;

    return (
        <div className="flex flex-col items-center bg-gray-800/40 border border-white/10 rounded-xl p-3 hover:bg-gray-800/60 transition-all group">
            <span className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest mb-1">{label}</span>
            <div className="text-3xl font-black text-white leading-none mb-2">{modStr}</div>
            <div className="mt-auto pt-2 border-t border-white/5 w-full flex justify-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-12 bg-transparent text-center text-xs font-bold text-gray-400 hover:text-white transition-colors outline-none"
                />
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export const SkillItem = ({ label, value, onChange }: { label: string; value: number; onChange: (val: number) => void }) => {
    const bonus = Number(value || 0);
    const bonusStr = bonus >= 0 ? `+${bonus}` : bonus;

    return (
        <div className="flex items-center justify-between group p-1.5 hover:bg-white/5 rounded-lg transition-colors border-b border-white/[0.03]">
            <p className="text-[11px] font-semibold text-gray-400 group-hover:text-gray-200 transition-colors uppercase tracking-tight">{label}</p>
            <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-blue-400 w-6 text-right">{bonusStr}</span>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-8 bg-transparent text-center text-[10px] font-bold text-gray-600 hover:text-gray-400 transition-colors outline-none"
                />
            </div>
        </div>
    );
};

export const SectionHeader = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 py-4 mt-4 first:mt-0">
        <h3 className="text-xs font-black text-blue-400/80 uppercase tracking-[0.2em] whitespace-nowrap">
            {label}
        </h3>
        <div className="h-px w-full bg-gradient-to-r from-blue-400/20 to-transparent" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1 bg-gray-900/50 p-4 rounded-xl border border-white/5">
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
