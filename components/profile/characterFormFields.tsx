import { Character, CharacterFormData } from "@/schemas/characterSchema";
import { FieldConfig } from "@/components/ui/GenericForm";
import {
    SectionHeader,
    StatsField,
    SavingThrowsField,
    SkillsField,
    CharacterAvatarField
} from "./CharacterFormItems";

export const getCharacterFormFields = (initialData?: Character): FieldConfig<CharacterFormData>[] => [
    {
        name: "image" as any,
        type: "file",
        label: "Character Avatar",
        colSpan: 2,
        component: (props) => <CharacterAvatarField {...props} initialData={initialData} />,
    },

    // Basic Info
    { name: "header_basic" as any, type: "text", colSpan: 2, component: () => <SectionHeader label="Basic Info" /> },
    { name: "name", type: "text", label: "Character Name", placeholder: "e.g. Vax'ildan" },
    { name: "race", type: "text", label: "Race", placeholder: "e.g. Half-Elf" },
    { name: "class", type: "text", label: "Class", placeholder: "e.g. Rogue" },
    { name: "subclass", type: "text", label: "Subclass", placeholder: "e.g. Assassin" },
    { name: "level", type: "number", label: "Level", placeholder: "1-20" },
    { name: "experience", type: "number", label: "Experience (XP)" },

    // Ability Scores
    { name: "header_stats" as any, type: "text", colSpan: 2, component: () => <SectionHeader label="Ability Scores" /> },
    { name: "stats" as any, type: "text", colSpan: 2, component: StatsField },

    // Saving Throws
    { name: "header_saves" as any, type: "text", colSpan: 2, component: () => <SectionHeader label="Saving Throws" /> },
    { name: "savingThrows" as any, type: "text", colSpan: 2, component: SavingThrowsField },

    // Combat & Resources
    { name: "header_combat" as any, type: "text", colSpan: 2, component: () => <SectionHeader label="Combat & Resources" /> },
    { name: "hp.max" as any, type: "number", label: "Max HP" },
    { name: "hp.current" as any, type: "number", label: "Current HP" },
    { name: "armorClass", type: "number", label: "Armor Class (AC)" },
    { name: "initiative", type: "number", label: "Initiative" },
    { name: "speed", type: "number", label: "Speed (ft)" },
    { name: "proficiencyBonus", type: "number", label: "Prof. Bonus" },
    { name: "gold", type: "number", label: "Gold (GP)" },

    // Skills
    { name: "header_skills" as any, type: "text", colSpan: 2, component: () => <SectionHeader label="Skills" /> },
    { name: "skills" as any, type: "text", colSpan: 2, component: SkillsField },

    // External Links
    { name: "header_links" as any, type: "text", colSpan: 2, component: () => <SectionHeader label="External Links" /> },
    {
        name: "dndBeyondUrl",
        type: "text",
        label: "D&D Beyond URL",
        placeholder: "https://www.dndbeyond.com/characters/...",
        colSpan: 2
    },
];
