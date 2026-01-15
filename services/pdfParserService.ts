import { CharacterFormData } from "@/schemas/characterSchema";
import { AbilityScore, Skill, ABILITY_LABELS, ABILITY_FULL_LABELS } from "@/lib/characterConstants";

/**
 * Constants for PDF field names used by D&D Beyond exports.
 */
const PDF_FIELDS = {
    NAME: ["CharacterName", "Character Name", "Name"],
    RACE: ["RACE", "Race ", "Race"],
    CLASS_LEVEL: ["CLASS  LEVEL", "ClassLevel"],
    XP: ["XP", "EXPERIENCE POINTS"],
    GOLD: ["GP", "Gold"],
    MAX_HP: ["MaxHP"],
    CURRENT_HP: ["CurrentHP", "MaxHP"],
    TEMP_HP: ["TempHP"],
    AC: ["AC"],
    INITIATIVE: ["Init"],
    SPEED: ["Speed"],
    PROF_BONUS: ["ProfBonus"],
    SAVING_THROW_PREFIX: "ST ",
    SKILL_MAPPINGS: {
        [Skill.AnimalHandling]: ["Animal", "AnimalHandling"],
        [Skill.SleightOfHand]: ["SleightofHand", "Sleight of Hand"],
        [Skill.Stealth]: ["Stealth ", "Stealth"],
    }
} as const;

/**
 * Service to parse D&D Beyond PDF exports.
 */
export const pdfParserService = {
    /**
     * Parses the text content of a PDF and returns character data.
     */
    parseCharacterData(text: string, fields: Record<string, any>): Partial<CharacterFormData> {
        console.log("PDF Fields found:", Object.keys(fields).length);

        const data: Partial<CharacterFormData> = {
            ...this._parseIdentity(fields),
            stats: this._parseAbilities(fields),
            savingThrows: this._parseSavingThrows(fields),
            skills: this._parseSkills(fields),
            hp: this._parseHP(fields),
            ...this._parseCombatMetrics(fields)
        };

        // Fallback for name if not found in fields
        if (!data.name) {
            const nameMatch = text.match(/(.+?)\s{2,}CHARACTER NAME/);
            if (nameMatch) data.name = nameMatch[1].trim().split("  ").pop();
        }

        return data;
    },

    /**
     * Internal: Parse basic identity information
     */
    _parseIdentity(fields: Record<string, any>): Partial<CharacterFormData> {
        const name = this._getField(fields, PDF_FIELDS.NAME);
        const race = this._getField(fields, PDF_FIELDS.RACE);
        const classLevel = this._getField(fields, PDF_FIELDS.CLASS_LEVEL);
        const xpRaw = this._getField(fields, PDF_FIELDS.XP);
        const goldRaw = this._getField(fields, PDF_FIELDS.GOLD);

        const data: Partial<CharacterFormData> = { name, race };

        // Parse XP
        if (typeof xpRaw === "string") {
            const xpVal = xpRaw.replace(/[^\d]/g, "");
            data.experience = xpVal ? parseInt(xpVal, 10) : 0;
        } else {
            data.experience = parseInt(xpRaw || "0", 10);
        }

        // Parse Gold
        data.gold = parseInt(goldRaw?.toString().replace(/[^\d]/g, "") || "0", 10);

        // Parse Class and Level
        if (classLevel) {
            const val = classLevel.toString().trim();
            const match = val.match(/(.+?)\s+(\d+)$/);
            if (match) {
                data.class = match[1].trim();
                data.level = parseInt(match[2], 10);
            } else {
                data.class = val;
                data.level = 1;
            }
        }

        return data;
    },

    /**
     * Internal: Parse Primary Ability Scores
     */
    _parseAbilities(fields: Record<string, any>): CharacterFormData['stats'] {
        const stats: Record<string, number> = {};
        Object.values(AbilityScore).forEach((ability) => {
            const label = ABILITY_LABELS[ability];
            const fullLabel = ABILITY_FULL_LABELS[ability].toUpperCase();
            stats[ability] = parseInt(fields[label] || fields[fullLabel] || "10", 10);
        });
        return stats as CharacterFormData['stats'];
    },

    /**
     * Internal: Parse Saving Throws
     */
    _parseSavingThrows(fields: Record<string, any>): CharacterFormData['savingThrows'] {
        const savingThrows: Record<string, number> = {};
        Object.values(AbilityScore).forEach((ability) => {
            const fullLabel = ABILITY_FULL_LABELS[ability];
            savingThrows[ability] = parseInt(fields[`${PDF_FIELDS.SAVING_THROW_PREFIX}${fullLabel}`] || "0", 10);
        });
        return savingThrows as CharacterFormData['savingThrows'];
    },

    /**
     * Internal: Parse HP info
     */
    _parseHP(fields: Record<string, any>): CharacterFormData['hp'] {
        const max = parseInt(this._getField(fields, PDF_FIELDS.MAX_HP) || "0", 10);
        const current = parseInt(this._getField(fields, PDF_FIELDS.CURRENT_HP) || "0", 10);
        const temp = parseInt(this._getField(fields, PDF_FIELDS.TEMP_HP)?.toString().replace(/[^\d]/g, "") || "0", 10);

        return { max, current, temp };
    },

    /**
     * Internal: Parse Combat Metrics (AC, Speed, etc)
     */
    _parseCombatMetrics(fields: Record<string, any>): Partial<CharacterFormData> {
        return {
            armorClass: parseInt(this._getField(fields, PDF_FIELDS.AC) || "10", 10),
            initiative: parseInt(this._getField(fields, PDF_FIELDS.INITIATIVE) || "0", 10),
            speed: parseInt(this._getField(fields, PDF_FIELDS.SPEED)?.toString().match(/\d+/)?.[0] || "30", 10),
            proficiencyBonus: parseInt(this._getField(fields, PDF_FIELDS.PROF_BONUS) || "2", 10),
        };
    },

    /**
     * Internal: Parse all 18 Skills
     */
    _parseSkills(fields: Record<string, any>): CharacterFormData['skills'] {
        const skills: Record<string, number> = {};
        Object.values(Skill).forEach((skill) => {
            const customKeys = PDF_FIELDS.SKILL_MAPPINGS[skill as keyof typeof PDF_FIELDS.SKILL_MAPPINGS];
            if (customKeys) {
                skills[skill] = parseInt(this._getField(fields, customKeys) || "0", 10);
            } else {
                const defaultKey = skill.charAt(0).toUpperCase() + skill.slice(1);
                skills[skill] = parseInt(fields[defaultKey] || "0", 10);
            }
        });
        return skills as CharacterFormData['skills'];
    },

    /**
     * Helper: Try multiple keys in a field record
     */
    _getField(fields: Record<string, any>, keys: readonly string[]): any {
        for (const key of keys) {
            if (fields[key] !== undefined) return fields[key];
        }
        return undefined;
    },

    extractStat(text: string, statName: string): number {
        const patterns = [
            new RegExp(`(\\d+)\\s{2,}${statName}`, "i"),
            new RegExp(`${statName}\\s{2,}(\\d+)`, "i")
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) return parseInt(match[1].match(/\d+/)?.[0] || "10", 10);
        }
        return 10;
    },

    extractSavingThrow(text: string, statName: string): number {
        const regex = new RegExp(`([+-]?\\d+)\\s*${statName}`, "m");
        const match = text.match(regex);
        return match ? parseInt(match[1], 10) : 0;
    }
};
