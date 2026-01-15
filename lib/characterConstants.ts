export enum AbilityScore {
    Strength = "strength",
    Dexterity = "dexterity",
    Constitution = "constitution",
    Intelligence = "intelligence",
    Wisdom = "wisdom",
    Charisma = "charisma",
}

export const ABILITY_LABELS: Record<AbilityScore, string> = {
    [AbilityScore.Strength]: "STR",
    [AbilityScore.Dexterity]: "DEX",
    [AbilityScore.Constitution]: "CON",
    [AbilityScore.Intelligence]: "INT",
    [AbilityScore.Wisdom]: "WIS",
    [AbilityScore.Charisma]: "CHA",
};

export const ABILITY_FULL_LABELS: Record<AbilityScore, string> = {
    [AbilityScore.Strength]: "Strength",
    [AbilityScore.Dexterity]: "Dexterity",
    [AbilityScore.Constitution]: "Constitution",
    [AbilityScore.Intelligence]: "Intelligence",
    [AbilityScore.Wisdom]: "Wisdom",
    [AbilityScore.Charisma]: "Charisma",
};

export enum Skill {
    Acrobatics = "acrobatics",
    AnimalHandling = "animalHandling",
    Arcana = "arcana",
    Athletics = "athletics",
    Deception = "deception",
    History = "history",
    Insight = "insight",
    Intimidation = "intimidation",
    Investigation = "investigation",
    Medicine = "medicine",
    Nature = "nature",
    Perception = "perception",
    Performance = "performance",
    Persuasion = "persuasion",
    Religion = "religion",
    SleightOfHand = "sleightOfHand",
    Stealth = "stealth",
    Survival = "survival",
}

export interface SkillMetadata {
    label: string;
    ability: AbilityScore;
}

export const SKILL_METADATA: Record<Skill, SkillMetadata> = {
    [Skill.Acrobatics]: { label: "Acrobatics", ability: AbilityScore.Dexterity },
    [Skill.AnimalHandling]: { label: "Animal Handling", ability: AbilityScore.Wisdom },
    [Skill.Arcana]: { label: "Arcana", ability: AbilityScore.Intelligence },
    [Skill.Athletics]: { label: "Athletics", ability: AbilityScore.Strength },
    [Skill.Deception]: { label: "Deception", ability: AbilityScore.Charisma },
    [Skill.History]: { label: "History", ability: AbilityScore.Intelligence },
    [Skill.Insight]: { label: "Insight", ability: AbilityScore.Wisdom },
    [Skill.Intimidation]: { label: "Intimidation", ability: AbilityScore.Charisma },
    [Skill.Investigation]: { label: "Investigation", ability: AbilityScore.Intelligence },
    [Skill.Medicine]: { label: "Medicine", ability: AbilityScore.Wisdom },
    [Skill.Nature]: { label: "Nature", ability: AbilityScore.Intelligence },
    [Skill.Perception]: { label: "Perception", ability: AbilityScore.Wisdom },
    [Skill.Performance]: { label: "Performance", ability: AbilityScore.Charisma },
    [Skill.Persuasion]: { label: "Persuasion", ability: AbilityScore.Charisma },
    [Skill.Religion]: { label: "Religion", ability: AbilityScore.Intelligence },
    [Skill.SleightOfHand]: { label: "Sleight of Hand", ability: AbilityScore.Dexterity },
    [Skill.Stealth]: { label: "Stealth", ability: AbilityScore.Dexterity },
    [Skill.Survival]: { label: "Survival", ability: AbilityScore.Wisdom },
};

/**
 * Returns a full CharacterFormData object with default values.
 */
export const getEmptyCharacterValues = () => ({
    level: 1,
    gold: 0,
    experience: 0,
    stats: Object.values(AbilityScore).reduce((acc, ability) => {
        acc[ability] = 10;
        return acc;
    }, {} as Record<AbilityScore, number>),
    savingThrows: Object.values(AbilityScore).reduce((acc, ability) => {
        acc[ability] = 0;
        return acc;
    }, {} as Record<AbilityScore, number>),
    skills: Object.values(Skill).reduce((acc, skill) => {
        acc[skill] = 0;
        return acc;
    }, {} as Record<Skill, number>),
    hp: {
        current: 0,
        max: 0,
        temp: 0,
    },
});
