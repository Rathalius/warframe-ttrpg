import { combineElements } from "./data-weapon-mods.js";
import { abilityTaxonomy } from "./data-ability-taxonomy.js";
import { AbilityMechanicsRegistry } from "./mechanics/index.js";
import { newWarframeClasses } from "./data-warframes.js";
import { applyWarframeDamageOrHealing, formatDamageResolutionHtml, getCombatTargets, renderCombatActionButtons } from "./combat-automation.js";

export class WarframeActor extends Actor {
  /** @override */
  prepareBaseData() {
    super.prepareBaseData();
    
    if (this.type === "warframe") {
      this.system.damageBonus = { value: 0 };
      this.system.heatDamageBonus = { value: 0 };
      this.system.castSpeedBonus = { value: 0 };
      this.system.ammoEfficiencyBonus = { value: 0 };
      this.system.vulnerabilityBonus = { value: 0 };
      this.system.voidSlingBonus = { value: 0 };
      this.system.slingShieldBonus = { value: 0 };
      this.system.voidRadianceBonus = { value: 0 };
      this.system.healingBonus = { value: 0 };
      this.system.meleeDamageBonus = { value: 0 };
      this.system.meleeAttackBonus = { value: 0 };

      if (!this.system.speed) this.system.speed = {};
      if (!this.system.speed.land) this.system.speed.land = {};
      this.system.speed.land.value = Number(this.system.speed.land.value) || 30;
      this.system.speed.land.bonus = 0;
      if (!this.system.speed.climb) this.system.speed.climb = {};
      this.system.speed.climb.value = Number(this.system.speed.climb.value) || 15;
      this.system.speed.climb.bonus = 0;

      // Ensure power stats exist and are explicitly cast to numbers (so active effects can add to them)
      if (!this.system.powerStrength) this.system.powerStrength = { value: 100 };
      this.system.powerStrength.value = Number(this.system.powerStrength.value) || 100;
      if (!this.system.powerDuration) this.system.powerDuration = { value: 100 };
      this.system.powerDuration.value = Number(this.system.powerDuration.value) || 100;
      if (!this.system.powerEfficiency) this.system.powerEfficiency = { value: 100 };
      this.system.powerEfficiency.value = Number(this.system.powerEfficiency.value) || 100;
      if (!this.system.powerRange) this.system.powerRange = { value: 100 };
      this.system.powerRange.value = Number(this.system.powerRange.value) || 100;
    }
  }

  /** @override */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    
    // Lock artwork rotation by default for all actors
    this.updateSource({
      "prototypeToken.lockRotation": true
    });

    // Set default prototype token options to linked for playable characters
    if (data.type === "warframe") {
      this.updateSource({
        "prototypeToken.actorLink": true,
        "prototypeToken.disposition": CONST.TOKEN_DISPOSITIONS.FRIENDLY,
        "system.health.value": null,
        "system.health.max": null,
        "system.shields.value": null,
        "system.shields.max": null,
        "system.energy.value": null,
        "system.energy.max": null,
        "system.armor.value": null
      });
    }
  }

  /** @override */
  _onCreateDescendantDocuments(parent, collection, documents, data, options, userId) {
    super._onCreateDescendantDocuments(parent, collection, documents, data, options, userId);
    
    // Auto-sync vitals to equipped frame when a warframe item is added
    if (parent === this && collection === "items" && userId === game.userId && this.type === "warframe") {
      const frameDoc = documents.find(d => d.type === "warframe");
      if (frameDoc) {
        const baseH = Number(frameDoc.system?.baseHealth) || 100;
        const baseS = Number(frameDoc.system?.baseShields) || 100;
        const baseE = Number(frameDoc.system?.baseEnergy) || 100;
        const baseA = Number(frameDoc.system?.baseArmor) || 100;

        this.prepareData();
        const maxH = this.system.health?.max || baseH;
        const maxS = this.system.shields?.max || baseS;
        const maxE = this.system.energy?.max || baseE;

        this.update({
          "system.health.value": maxH,
          "system.health.max": maxH,
          "system.shields.value": maxS,
          "system.shields.max": maxS,
          "system.energy.value": maxE,
          "system.energy.max": maxE,
          "system.armor.value": baseA
        });
      }
    }
  }

  /** @override */
  _onDeleteDescendantDocuments(parent, collection, documents, ids, options, userId) {
    super._onDeleteDescendantDocuments(parent, collection, documents, ids, options, userId);
    if (parent === this && collection === "items" && userId === game.userId && this.type === "warframe") {
      const frameDoc = documents.find(d => d.type === "warframe");
      if (frameDoc) {
        this.update({
          "system.health.value": null,
          "system.health.max": null,
          "system.shields.value": null,
          "system.shields.max": null,
          "system.energy.value": null,
          "system.energy.max": null,
          "system.armor.value": null
        });
      }
    }
  }

  isIncapacitated() {
    const statusList = ["electricity", "heat", "restrained", "asleep", "sleep", "stunned", "frozen"];
    const hasIncapacitatingStatus = this.effects.some(e => 
      !e.disabled && 
      (
        statusList.some(s => e.statuses?.has(s) || e.flags?.core?.statusId === s || e.name?.toLowerCase().includes(s)) ||
        e.name?.toLowerCase().includes("tesla") || 
        e.name?.toLowerCase().includes("bastille") || 
        e.name?.toLowerCase().includes("vortex") || 
        e.name?.toLowerCase().includes("tether")
      )
    );
    const coldEffects = this.effects.filter(e => !e.disabled && (e.statuses?.has("cold") || e.flags?.core?.statusId === "cold" || e.name === "Cold"));
    const isFrozenCold = coldEffects.length >= 10;
    
    return hasIncapacitatingStatus || isFrozenCold;
  }

  /** @override */
  applyActiveEffects() {
    if (this.type === "warframe") {
      const level = Number(this.system.details?.level?.value) || 1;
      let speedBonus = 5;
      if (level >= 18) speedBonus = 15;
      else if (level >= 13) speedBonus = 10;

      const effectsList = this.allApplicableEffects ? Array.from(this.allApplicableEffects()) : this.effects;
      for (let effect of effectsList) {
        if (effect.name === "Speed Increase" || effect.label === "Speed Increase") {
          for (let change of effect.changes) {
            change.value = String(speedBonus);
          }
        }
      }
    }
    super.applyActiveEffects();
  }

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    
    // Ensure skills are populated in memory (especially for pre-existing actors)
    if (this.type === "warframe") {
      if (!this.system.attributes) {
        this.system.attributes = {
          physique: { value: 10, label: "Physique" },
          prowess: { value: 10, label: "Prouesse" },
          systems: { value: 10, label: "Systèmes" },
          focus: { value: 10, label: "Focalisation" }
        };
      }

      if (!this.system.skills) {
        this.system.skills = {};
      }
      
      const defaultSkills = {
        athletics: { value: false, label: "Athlétisme", attr: "physique" },
        survival: { value: false, label: "Survie", attr: "physique" },
        acrobatics: { value: false, label: "Acrobaties", attr: "prowess" },
        stealth: { value: false, label: "Furtivité", attr: "prowess" },
        reflexes: { value: false, label: "Réflexes", attr: "prowess" },
        hacking: { value: false, label: "Piratage", attr: "systems" },
        engineering: { value: false, label: "Ingénierie", attr: "systems" },
        perception: { value: false, label: "Perception", attr: "focus" },
        void: { value: false, label: "Canalisation du Néant", attr: "focus" }
      };

      // Clear out deprecated skills from memory
      for (let key of Object.keys(this.system.skills)) {
        if (!defaultSkills[key]) {
          delete this.system.skills[key];
        }
      }

      for (let [key, defSkill] of Object.entries(defaultSkills)) {
        if (!this.system.skills[key]) {
          this.system.skills[key] = { ...defSkill };
        } else {
          // Sync labels and attributes from template definitions
          this.system.skills[key].label = defSkill.label;
          this.system.skills[key].attr = defSkill.attr;
          if (this.system.skills[key].value === undefined) {
            this.system.skills[key].value = false;
          }
        }
      }

      // Initialize saving throws in memory
      if (!this.system.saves) {
        this.system.saves = {};
      }
      
      const defaultSaves = {
        physique: { proficient: false, label: "Physique", attr: "physique" },
        prowess: { proficient: false, label: "Prouesse", attr: "prowess" },
        systems: { proficient: false, label: "Systèmes", attr: "systems" },
        focus: { proficient: false, label: "Focalisation", attr: "focus" }
      };

      for (let [key, defSave] of Object.entries(defaultSaves)) {
        if (!this.system.saves[key]) {
          this.system.saves[key] = { ...defSave };
        } else {
          this.system.saves[key].label = defSave.label;
          this.system.saves[key].attr = defSave.attr;
        }
      }
      if (this.system.attributes) {
        if (this.system.attributes.physique) this.system.attributes.physique.label = "Physique";
        if (this.system.attributes.prowess) this.system.attributes.prowess.label = "Prouesse";
        if (this.system.attributes.systems) this.system.attributes.systems.label = "Systèmes";
        if (this.system.attributes.focus) this.system.attributes.focus.label = "Focalisation";
      }
      const equippedFrame = this.items.find(i => i.type === "warframe");
      if (!this.system.details) this.system.details = {};
      this.system.details.frameClass = equippedFrame ? equippedFrame.name : "";

      // Initialize frame unique resources in memory if not present
      if (!this.system.deathWell) this.system.deathWell = { value: 0, max: 100 };
      if (!this.system.battery) this.system.battery = { value: 0, max: 100 };
      if (!this.system.immolation) this.system.immolation = { value: 0, max: 100 };
      if (!this.system.mutation) this.system.mutation = { value: 0, max: 100 };
      if (!this.system.restraint) this.system.restraint = { value: 100, max: 100 };

      const level = Number(this.system.details?.level?.value) || 1;

      // Extract all advancements configured for levels <= current level
      const traitsSaves = new Set();
      const traitsExpertiseSaves = new Set();
      const traitsSkills = new Set();
      let baseHP = 100;
      let baseShields = 100;
      let baseArmor = 100;
      let baseEnergy = 100;
      let totalASIEarned = 0;
      let hasAsiAdv = false;
      let hasHpAdv = false;

      let bestHpAdv = null;

      if (equippedFrame && equippedFrame.system) {
        // Fallback baseline stats
        baseHP = Number(equippedFrame.system.baseHealth) || 100;
        baseShields = Number(equippedFrame.system.baseShields) || 100;
        baseArmor = Number(equippedFrame.system.baseArmor) || 100;
        baseEnergy = Number(equippedFrame.system.baseEnergy) || 100;

        const advancements = equippedFrame.system.advancements || {};

        for (let adv of Object.values(advancements)) {
          const advLvl = Number(adv.level) || 1;
          if (advLvl <= level) {
            if (adv.type === "Traits") {
              if (adv.saves) adv.saves.forEach(s => traitsSaves.add(s));
              if (adv.skills) adv.skills.forEach(sk => traitsSkills.add(sk));
            } else if (adv.type === "HitPoints") {
              if (!bestHpAdv || advLvl > Number(bestHpAdv.level)) {
                bestHpAdv = adv;
              }
              hasHpAdv = true;
            } else if (adv.type === "AbilityScoreImprovement") {
              totalASIEarned += Number(adv.points) || 0;
              hasAsiAdv = true;
            }
          }
        }

        if (bestHpAdv) {
          baseHP = Number(bestHpAdv.health) || baseHP;
          baseShields = Number(bestHpAdv.shields) || baseShields;
          baseEnergy = Number(bestHpAdv.energy) || baseEnergy;
          baseArmor = Number(bestHpAdv.armor) || baseArmor;
        }

        // Initialize speed stats preserving active effect bonuses
        const existingLandBonus = Number(this.system.speed?.land?.bonus) || 0;
        const existingClimbBonus = Number(this.system.speed?.climb?.bonus) || 0;

        const baseLand = this.system.speed?.land?.value !== undefined ? Number(this.system.speed.land.value) : 30;
        const baseClimb = this.system.speed?.climb?.value !== undefined ? Number(this.system.speed.climb.value) : 15;

        this.system.speed = {
          land: { value: baseLand, total: baseLand + existingLandBonus, bonus: existingLandBonus },
          climb: { value: baseClimb, total: baseClimb + existingClimbBonus, bonus: existingClimbBonus }
        };

        // Scan actor's active abilities/perks for speed/skill/save upgrades
        let extraLandSpeed = 0;
        for (let item of this.items) {
          if (item.type === "ability") {
            const name = item.name;
            if (name === "Save Specialization: Physique") {
              traitsExpertiseSaves.add("physique");
            } else if (name === "Save Specialization: Prowess") {
              traitsExpertiseSaves.add("prowess");
            } else if (name === "Save Specialization: Systems") {
              traitsExpertiseSaves.add("systems");
            } else if (name === "Save Specialization: Focus") {
              traitsExpertiseSaves.add("focus");
            } else if (name === "Lightning Reflexes") {
              extraLandSpeed += 10;
            } else if (name === "Parkour Proficiency I") {
              traitsSkills.add("acrobatics");
            } else if (name === "Parkour Proficiency II") {
              traitsSkills.add("athletics");
            }
          }
        }

        this.system.speed.land.total += extraLandSpeed;

        this.system.traitsSkills = Array.from(traitsSkills);
      } else {
        this.system.traitsSkills = [];
        this.system.speed = {
          land: { value: 30, total: 30 },
          climb: { value: 15, total: 15 }
        };
      }

      if (!hasAsiAdv) {
        totalASIEarned = Math.floor(level / 4) * 2;
      }

      for (let [key, defSave] of Object.entries(defaultSaves)) {
        if (!this.system.saves[key]) {
          this.system.saves[key] = { ...defSave };
        } else {
          this.system.saves[key].label = defSave.label;
          this.system.saves[key].attr = defSave.attr;
          if (this.system.saves[key].proficient === undefined) {
            this.system.saves[key].proficient = false;
          }
        }

        // Apply traits saves proficiency override
        let profLevel = 0;
        const currentProf = this.system.saves[key].proficient;
        if (currentProf === true || currentProf === 1) {
          profLevel = 1;
        } else if (currentProf === 2 || currentProf === "expertise") {
          profLevel = 2;
        }

        if (traitsSaves.has(key)) {
          profLevel = Math.max(profLevel, 1);
        }
        if (traitsExpertiseSaves.has(key)) {
          profLevel = Math.max(profLevel, 2);
        }

        this.system.saves[key].profLevel = profLevel;
        this.system.saves[key].proficient = profLevel > 0;

        // Calculate mod
        const attrVal = this.system.attributes[defSave.attr]?.value || 10;
        const attrMod = Math.floor((attrVal - 10) / 2);
        const profBonus = Math.floor((level - 1) / 4) + 2;
        const profMultiplier = profLevel === 2 ? 2 : (profLevel === 1 ? 1 : 0);
        
        this.system.saves[key].mod = attrMod + (profMultiplier * profBonus);
      }

      // Scale resources based on level, rates, and Physique modifier
      const physValue = this.system.attributes.physique?.value || 10;
      const physMod = Math.floor((physValue - 10) / 2);

      const hpPerLevel = bestHpAdv?.healthIncrease !== undefined ? Number(bestHpAdv.healthIncrease) : 3.45;
      const shdPerLevel = bestHpAdv?.shieldIncrease !== undefined ? Number(bestHpAdv.shieldIncrease) : 3.45;
      const enPerLevel = bestHpAdv?.energyIncrease !== undefined ? Number(bestHpAdv.energyIncrease) : 1.72;

      // Scan equipped Warframe mods for stat modifiers
      let modHpAdd = 0;
      let modShdAdd = 0;
      let modArmAdd = 0;
      let modEnAdd = 0;
      let modStrAdd = 0;
      let modDurAdd = 0;
      let modEffAdd = 0;
      let modRngAdd = 0;
      let modSpdAdd = 0;

      const equippedMods = this.items.filter(i => i.type === "mod" && i.system?.slot);
      for (let m of equippedMods) {
        const stats = m.system?.stats || {};
        if (stats.health) modHpAdd += Number(stats.health) || 0;
        if (stats.shields) modShdAdd += Number(stats.shields) || 0;
        if (stats.armor) modArmAdd += Number(stats.armor) || 0;
        if (stats.energy) modEnAdd += Number(stats.energy) || 0;
        if (stats.powerStrength) modStrAdd += Number(stats.powerStrength) || 0;
        if (stats.powerDuration) modDurAdd += Number(stats.powerDuration) || 0;
        if (stats.powerEfficiency) modEffAdd += Number(stats.powerEfficiency) || 0;
        if (stats.powerRange) modRngAdd += Number(stats.powerRange) || 0;
        if (stats.sprintSpeed) modSpdAdd += Number(stats.sprintSpeed) || 0;
      }

      if (!this.system.health) this.system.health = {};
      if (!this.system.shields) this.system.shields = {};
      if (!this.system.energy) this.system.energy = {};
      if (!this.system.armor) this.system.armor = {};

      this.system.health.max = Math.round(baseHP + (level - 1) * (hpPerLevel + physMod)) + modHpAdd;
      this.system.shields.max = Math.round(baseShields + (level - 1) * shdPerLevel) + modShdAdd;
      this.system.energy.max = Math.round(baseEnergy + (level - 1) * enPerLevel) + modEnAdd;

      // Auto-initialize current resources to max if uninitialized (null, undefined, or NaN)
      if (this.system.health.value === undefined || this.system.health.value === null || isNaN(this.system.health.value)) {
        this.system.health.value = this.system.health.max;
      }
      if (this.system.shields.value === undefined || this.system.shields.value === null || isNaN(this.system.shields.value)) {
        this.system.shields.value = this.system.shields.max;
      }
      if (this.system.energy.value === undefined || this.system.energy.value === null || isNaN(this.system.energy.value)) {
        this.system.energy.value = this.system.energy.max;
      }

      // Manually resolve active effects changes to armor for 100% reliability
      let armorAdd = modArmAdd;
      let armorMult = 1;
      for (let effect of this.effects) {
        if (effect.disabled) continue;
        for (let change of effect.changes) {
          if (change.key === "system.armor.value") {
            const val = Number(change.value) || 0;
            if (change.mode === 2) { // ADD
              armorAdd += val;
            } else if (change.mode === 1) { // MULTIPLY
              armorMult *= val;
            } else if (change.mode === 5) { // OVERRIDE
              baseArmor = val;
            }
          }
        }
      }
      const isAtlas = this.system.details?.frameClass === "Atlas";
      if (isAtlas) {
        if (!this.system.rubble) {
          this.system.rubble = { value: 0, max: 1500 };
        }
        const rubbleVal = Number(this.system.rubble.value) || 0;
        armorAdd += rubbleVal;
      }
      this.system.armor.value = Math.round(baseArmor * armorMult + armorAdd);

      // Calculate ASI spend and remaining
      const asiSpent = Number(this.system.asiSpent) || 0;
      const asiRemaining = Math.max(0, totalASIEarned - asiSpent);

      this.system.asiEarned = totalASIEarned;
      this.system.asiSpent = asiSpent;
      this.system.asiRemaining = asiRemaining;

      // Manually resolve and apply active effects and mod changes to power stats for 100% reliability
      const baseStrength = Number(this._source.system.powerStrength?.value) || 100;
      const baseDuration = Number(this._source.system.powerDuration?.value) || 100;
      const baseEfficiency = Number(this._source.system.powerEfficiency?.value) || 100;
      const baseRange = Number(this._source.system.powerRange?.value) || 100;

      let strengthAdd = modStrAdd;
      let durationAdd = modDurAdd;
      let efficiencyAdd = modEffAdd;
      let rangeAdd = modRngAdd;

      for (let effect of this.effects) {
        if (effect.disabled) continue;
        for (let change of effect.changes) {
          const val = Number(change.value) || 0;
          if (change.key === "system.powerStrength.value") {
            if (change.mode === 2) strengthAdd += val;
            else if (change.mode === 5) this.system.powerStrength.value = val;
          } else if (change.key === "system.powerDuration.value") {
            if (change.mode === 2) durationAdd += val;
            else if (change.mode === 5) this.system.powerDuration.value = val;
          } else if (change.key === "system.powerEfficiency.value") {
            if (change.mode === 2) efficiencyAdd += val;
            else if (change.mode === 5) this.system.powerEfficiency.value = val;
          } else if (change.key === "system.powerRange.value") {
            if (change.mode === 2) rangeAdd += val;
            else if (change.mode === 5) this.system.powerRange.value = val;
          }
        }
      }

      this.system.powerStrength.value = baseStrength + strengthAdd;
      this.system.powerDuration.value = baseDuration + durationAdd;
      // Power Efficiency capped at 190% max
      this.system.powerEfficiency.value = Math.min(190, Math.max(0, baseEfficiency + efficiencyAdd));
      this.system.powerRange.value = baseRange + rangeAdd;

      // Sprint speed mod bonus
      if (modSpdAdd > 0 && this.system.speed?.land) {
        const curSpd = Number(this.system.speed.land.value) || 30;
        this.system.speed.land.value = curSpd + modSpdAdd;
      }

      // Chroma Draconic Flight: Fly speed equal to land speed with hover & fall damage immunity
      const isChroma = (this.system.details?.frameClass || "").toLowerCase().includes("chroma") || 
                       this.items.some(i => i.type === "warframe" && i.name.toLowerCase().includes("chroma"));
      if (isChroma && this.system.speed?.land) {
        const flySpeed = Number(this.system.speed.land.total || this.system.speed.land.value) || 30;
        this.system.speed.fly = { value: flySpeed, total: flySpeed, hover: true };
      }
    }

    // --- Automated Status Effects Stat Modifications ---
    const hasStatus = (statusId) => {
      return this.effects.some(e => !e.disabled && (e.statuses?.has(statusId) || e.flags?.core?.statusId === statusId));
    };

    // Hysteria Status Immunity & Armor Multiplier (Valkyr)
    const isHysteria = hasStatus("hysteria");
    if (isHysteria) {
      // 3x Armor multiplier while in Hysteria
      if (this.system.armor) {
        this.system.armor.value = Math.max(0, Math.round(Number(this.system.armor.value) * 3));
      }
      // Disable all other active status effects in-memory except unconscious
      for (let effect of this.effects) {
        const isUnconscious = effect.statuses?.has("unconscious") || effect.flags?.core?.statusId === "unconscious";
        const isSelfHysteria = effect.statuses?.has("hysteria") || effect.flags?.core?.statusId === "hysteria";
        if (!isSelfHysteria && !isUnconscious) {
          effect.disabled = true;
        }
      }
    }

    // 1. Heat (Burn) -> Halves active armor
    if (hasStatus("heat")) {
      if (this.system.armor) {
        this.system.armor.value = Math.max(0, Math.round(Number(this.system.armor.value) / 2));
      }
    }

    // 2. Magnetic (Shield Disrupt) -> Halves max shields
    if (hasStatus("magnetic")) {
      if (this.system.shields) {
        this.system.shields.max = Math.max(0, Math.round(Number(this.system.shields.max) / 2));
        if (this.system.shields.value > this.system.shields.max) {
          this.system.shields.value = this.system.shields.max;
        }
      }
    }

    // 3. Corrosive (Armor Melt) -> Subtracts 100 flat armor per Corrosive stack
    const corrosiveCount = this.effects.filter(e => !e.disabled && (e.statuses?.has("corrosive") || e.flags?.core?.statusId === "corrosive")).length;
    if (corrosiveCount > 0 && this.system.armor) {
      this.system.armor.value = Math.max(0, Number(this.system.armor.value) - (corrosiveCount * 100));
    }

    // 4. Cold (Freeze) -> Halves active movement speeds
    if (hasStatus("cold") && this.system.speed) {
      if (this.system.speed.land) {
        this.system.speed.land.total = Math.max(0, Math.round(Number(this.system.speed.land.total || this.system.speed.land.value || 30) / 2));
      }
      if (this.system.speed.climb) {
        this.system.speed.climb.total = Math.max(0, Math.round(Number(this.system.speed.climb.total || this.system.speed.climb.value || 15) / 2));
      }
      if (this.system.speed.fly) {
        this.system.speed.fly.total = Math.max(0, Math.round(Number(this.system.speed.fly.total || this.system.speed.fly.value || 30) / 2));
      }
    }

    // 5. Restrained & Stunned -> Speed becomes 0
    if ((hasStatus("restrained") || hasStatus("stunned")) && this.system.speed) {
      if (this.system.speed.land) {
        this.system.speed.land.total = 0;
      }
      if (this.system.speed.climb) {
        this.system.speed.climb.total = 0;
      }
      if (this.system.speed.fly) {
        this.system.speed.fly.total = 0;
      }
    }

    // Ensure resistances are populated in memory (especially for pre-existing actors)
    if (this.type === "warframe" || this.type === "adversary") {
      if (!this.system.resistances) {
        this.system.resistances = {};
      }

      const damageTypes = [
        "impact", "puncture", "slash",
        "heat", "cold", "electricity", "toxin",
        "blast", "corrosive", "gas", "magnetic", "radiation", "viral",
        "void"
      ];

      for (let dt of damageTypes) {
        if (this.system.resistances[dt] === undefined) {
          this.system.resistances[dt] = "normal";
        }
      }
    }

    // Ensure modSlots exist in memory (for warframe actors)
    if (this.type === "warframe") {
      if (!this.system.modSlots) {
        this.system.modSlots = {};
      }
      const defaultSlots = ["aura", "exilus", "slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8"];
      for (let s of defaultSlots) {
        if (!this.system.modSlots[s]) {
          this.system.modSlots[s] = { polarity: s === "aura" ? "universal" : "none" };
        }
      }
    }
  }

  /**
   * Start interactive placement of a measured template
   * @param {object} templateData
   * @param {object} ability
   */
  async placeTemplate(templateData, ability) {
    const layer = canvas.templates;
    if (!layer) return;

    // Create a local measured template document (not saved to DB yet)
    const docCls = CONFIG.MeasuredTemplate?.documentClass || globalThis.MeasuredTemplateDocument;
    const objCls = CONFIG.MeasuredTemplate?.objectClass || globalThis.MeasuredTemplate;
    const doc = new docCls(templateData, { parent: canvas.scene });
    const preview = new objCls(doc);
    await preview.draw();

    // Add to layer preview child list
    layer.addChild(preview);
    layer.activate();

    let isPlaced = false;

    const getSnappedPos = (pos) => {
      if (!canvas.grid) return pos;
      try {
        // V12 grid center snapping: mode 4 is center, 5 is center + vertex
        const snapped = canvas.grid.getSnappedPosition({ x: pos.x, y: pos.y }, { mode: 4 });
        if (snapped && typeof snapped.x === "number") return snapped;
      } catch (e) {}
      try {
        // V10/V11 grid center snapping: interval 2 is centers
        const snapped = canvas.grid.getSnappedPosition(pos.x, pos.y, 2);
        if (snapped && typeof snapped.x === "number") return snapped;
      } catch (e) {}
      return pos;
    };

    // Mouse move handler
    const onMouseMove = (event) => {
      if (isPlaced) return;
      const pos = event.data.getLocalPosition(layer);
      const snapped = getSnappedPos(pos);
      preview.document.updateSource({ x: snapped.x, y: snapped.y });
      preview.refresh();
    };

    // Scroll wheel rotation
    const onWheel = (event) => {
      if (isPlaced) return;
      event.preventDefault();
      event.stopPropagation();
      const delta = Math.sign(event.deltaY || event.detail || 0);
      const dir = (preview.document.direction + (delta * 15)) % 360;
      preview.document.updateSource({ direction: dir });
      preview.refresh();
    };

    // Click handler for left (place) and right (cancel)
    const onClick = async (event) => {
      if (isPlaced) return;
      const originalEvent = event.data.originalEvent;
      
      if (originalEvent.button === 2) {
        // Right Click - Cancel
        isPlaced = true;
        event.stopPropagation();
        event.preventDefault();
        cleanup();
        return;
      }
      
      if (originalEvent.button === 0) {
        // Left Click - Place
        isPlaced = true;
        event.stopPropagation();
        event.preventDefault();

        const pos = event.data.getLocalPosition(layer);
        const snapped = getSnappedPos(pos);
        
        const finalData = foundry.utils.mergeObject(templateData, {
          x: snapped.x,
          y: snapped.y,
          direction: preview.document.direction
        });

        cleanup();
        const createdTemplates = await canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [finalData]);
        const createdTemplate = createdTemplates[0];
        if (createdTemplate && ability) {
          await this._onTemplatePlaced(createdTemplate, ability);
        }
      }
    };

    const cleanup = () => {
      layer.removeChild(preview);
      preview.destroy();
      canvas.stage.off("pointermove", onMouseMove);
      canvas.stage.off("pointerdown", onClick);
      document.removeEventListener("wheel", onWheel);
    };

    canvas.stage.on("pointermove", onMouseMove);
    canvas.stage.on("pointerdown", onClick);
    document.addEventListener("wheel", onWheel, { passive: false });
  }

  /**
   * Callback when a measured template is placed
   * @param {MeasuredTemplateDocument} templateDoc
   * @param {object} ability
   */
  async _onTemplatePlaced(templateDoc, ability) {
    if (ability.name.startsWith("Tectonics")) {
      const existingTemplates = canvas.scene.templates.filter(t => t.id !== templateDoc.id && t.flags?.["warframe-ttrpg"]?.isTectonicsBulwark && t.flags?.["warframe-ttrpg"]?.actorId === this.id);
      if (existingTemplates.length > 0) {
        await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", existingTemplates.map(t => t.id));
      }
      return;
    }

    if (ability.name.startsWith("Petrify")) {
      const vulnPercent = templateDoc.flags?.["warframe-ttrpg"]?.vulnPercent || 50;
      const radiusPixels = (templateDoc.distance || 0) * (canvas.grid.size / canvas.scene.grid.distance);
      const coneDir = templateDoc.direction || 0;
      const spreadHalf = (templateDoc.angle || 60) / 2;

      let targetMsg = "";
      const petrifiedTokens = [];

      for (let token of canvas.tokens.placeables) {
        if (!token.actor) continue;
        const isHostile = token.document.disposition === CONST.TOKEN_DISPOSITIONS?.HOSTILE || token.document.disposition === -1;
        if (!isHostile) continue;

        const tokenX = token.x + (token.document.width || 1) * canvas.grid.size / 2;
        const tokenY = token.y + (token.document.height || 1) * canvas.grid.size / 2;
        const dx = tokenX - templateDoc.x;
        const dy = tokenY - templateDoc.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist <= radiusPixels) {
          const tokenAngleRad = Math.atan2(dy, dx);
          let tokenAngleDeg = tokenAngleRad * 180 / Math.PI;
          if (tokenAngleDeg < 0) tokenAngleDeg += 360;

          let diff = (tokenAngleDeg - coneDir) % 360;
          if (diff < -180) diff += 360;
          if (diff > 180) diff -= 360;

          if (Math.abs(diff) <= spreadHalf) {
            petrifiedTokens.push(token);
          }
        }
      }

      if (petrifiedTokens.length > 0) {
        for (let token of petrifiedTokens) {
          const effectData = {
            name: "Petrified",
            icon: ability.img || "icons/magic/perception/eye-tendrils-web-orange.webp",
            origin: this.uuid,
            statuses: ["incapacitated", "petrified"],
            flags: {
              core: { statusId: "petrified" },
              "warframe-ttrpg": {
                damageVuln: vulnPercent
              }
            },
            duration: { rounds: 3 }
          };
          await token.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
          targetMsg += `<br/>➔ Petrified <strong>${token.name}</strong> (+${vulnPercent}% damage vulnerability, Incapacitated, drops Rubble on death).`;
        }
      } else {
        targetMsg = "<br/><span style='color: rgba(255,255,255,0.4);'>No hostile targets were caught in the petrifying cone.</span>";
      }

      const cardContent = await renderTemplate("systems/warframe-ttrpg/templates/chat-card.html", {
        actorName: this.name,
        abilityName: ability.name,
        cost: 75,
        description: `
          <div style="background: rgba(229, 152, 102, 0.05); border: 1px solid rgba(229, 152, 102, 0.25); border-radius: 4px; padding: 8px;">
            <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #e59866; border-bottom: 1px solid rgba(229, 152, 102, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
              🪨 Petrifying Gaze (Cone)
            </div>
            <div style="font-size: 11px; color: #cbd5e1;">
              Atlas emits a fossilizing cone, turning targets to stone. Petrified targets are <strong>Incapacitated</strong> and take +${vulnPercent}% damage from all sources.
              ${targetMsg}
            </div>
          </div>
        `,
        img: ability.img
      });
      await ChatMessage.create({ content: cardContent, speaker: ChatMessage.getSpeaker({ actor: this }) });
      return;
    }

    if (!ability.name.includes("Stinkbrain") && !ability.name.includes("Brightbonnet") && !ability.name.includes("Paralysis") && !ability.name.includes("Photon Strike") && !ability.name.includes("Bastille")) return;

    if (ability.name.includes("Bastille")) {
      const name = ability.name;
      let stripPercent = 10;
      let durationRounds = 2;
      let baseHitFormula = "1d4";
      
      if (name.includes("II")) {
        stripPercent = 15;
        durationRounds = 2;
        baseHitFormula = "1d6";
      } else if (name.includes("III")) {
        stripPercent = 25;
        durationRounds = 3;
        baseHitFormula = "1d10";
      }

      // Find all hostile tokens in template radius
      const radiusPixels = (templateDoc.distance || 0) * (canvas.grid.size / canvas.scene.grid.distance);
      const enemiesInRadius = [];

      for (let token of canvas.tokens.placeables) {
        if (!token.actor) continue;
        const isHostile = token.document.disposition === CONST.TOKEN_DISPOSITIONS?.HOSTILE || token.document.disposition === -1;
        if (!isHostile) continue;

        const tokenX = token.x + (token.document.width || 1) * canvas.grid.size / 2;
        const tokenY = token.y + (token.document.height || 1) * canvas.grid.size / 2;
        const dx = tokenX - templateDoc.x;
        const dy = tokenY - templateDoc.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist <= radiusPixels) {
          enemiesInRadius.push(token);
        }
      }

      if (enemiesInRadius.length === 0) {
        ui.notifications.warn(`No hostile targets in range for ${name} to stasis.`);
        return;
      }

      const powerStrength = Number(this.system.powerStrength?.value) || 100;
      const powerDuration = Number(this.system.powerDuration?.value) || 100;
      const durationRoundsScaled = Math.round(durationRounds * (powerDuration / 100));

      let erectHTML = `<div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.4;">`;
      for (let t of enemiesInRadius) {
        const targetActor = t.actor;
        const rollVal = new Roll(baseHitFormula);
        await rollVal.evaluate();
        await rollVal.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this }),
          flavor: `${this.name} rolls Bastille stasis damage`
        });
        let hitDmg = Math.round(rollVal.total * (powerStrength / 100));

        let passiveApplied = false;
        if (targetActor.isIncapacitated && targetActor.isIncapacitated()) {
          hitDmg = Math.round(hitDmg * 1.25);
          passiveApplied = true;
        }

        let currentShields = Number(targetActor.system.shields?.value) || 0;
        let currentHealth = Number(targetActor.system.health?.value) || 0;
        let dmgToShields = Math.min(currentShields, hitDmg);
        let dmgToHealth = hitDmg - dmgToShields;
        await targetActor.update({
          "system.shields.value": currentShields - dmgToShields,
          "system.health.value": Math.max(0, currentHealth - dmgToHealth)
        });

        await targetActor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Bastille Lifting Prison",
          icon: "icons/magic/control/debuff-energy-hold-blue.webp",
          origin: this.uuid,
          duration: { rounds: durationRoundsScaled },
          description: "Suspended in stasis, stripping armor per round.",
          flags: {
            "warframe-ttrpg": {
              stripPercent: stripPercent,
              casterId: this.id
            }
          }
        }]);

        erectHTML += `
          <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #00e5ff;">
            ⛓️ <strong>${t.name}</strong> hit for ${hitDmg} Blast damage${passiveApplied ? " (Passive +25%)" : ""} and suspended in Bastille's stasis!
          </div>
        `;
      }
      erectHTML += `</div>`;

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 4px; padding: 10px; font-family: 'Orbitron', sans-serif;">
            <h3 style="margin:0 0 6px 0; color:#00e5ff; font-size:12px; font-weight:bold; text-transform:uppercase; border-bottom:1px solid rgba(0, 229, 255, 0.15); padding-bottom:4px;">
              ⛓️ Bastille Containment Erected ⛓️
            </h3>
            <p style="margin:0; font-size:11px; color:#cbd5e1;">Erected a stasis field of radius ${templateDoc.distance} ft, capturing foes and stealing armor.</p>
            ${erectHTML}
          </div>
        `
      });
      return;
    }

    if (ability.name.includes("Photon Strike")) {
      const name = ability.name;
      let formula = "6d12";
      if (name.includes("II")) {
        formula = "9d12";
      } else if (name.includes("III")) {
        formula = "15d12";
      }

      // Find all hostile tokens in template radius
      const radiusPixels = (templateDoc.distance || 0) * (canvas.grid.size / canvas.scene.grid.distance);
      const enemiesInRadius = [];

      for (let token of canvas.tokens.placeables) {
        if (!token.actor) continue;
        const isHostile = token.document.disposition === CONST.TOKEN_DISPOSITIONS?.HOSTILE || token.document.disposition === -1;
        if (!isHostile) continue;

        const tokenX = token.x + (token.document.width || 1) * canvas.grid.size / 2;
        const tokenY = token.y + (token.document.height || 1) * canvas.grid.size / 2;
        const dx = tokenX - templateDoc.x;
        const dy = tokenY - templateDoc.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist <= radiusPixels) {
          enemiesInRadius.push(token);
        }
      }

      if (enemiesInRadius.length === 0) {
        ui.notifications.warn(`No hostile targets in range for ${name} to hit.`);
        return;
      }

      let strikeHTML = `<div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.4;">`;
      const powerStrength = Number(this.system.powerStrength?.value) || 100;

      for (let t of enemiesInRadius) {
        const targetActor = t.actor;
        const rollVal = new Roll(formula);
        await rollVal.evaluate();

        let baseDmg = rollVal.total;
        let rolledDmg = Math.round(baseDmg * (powerStrength / 100));

        let passiveApplied = false;
        if (targetActor.isIncapacitated && targetActor.isIncapacitated()) {
          rolledDmg = Math.round(rolledDmg * 1.25);
          passiveApplied = true;
        }

        let overguardApplied = false;
        const hasOverguard = targetActor.effects.some(e => 
          !e.disabled && 
          (e.statuses?.has("overguard") || e.flags?.core?.statusId === "overguard" || e.name === "Overguard")
        );
        if (hasOverguard) {
          rolledDmg *= 2;
          overguardApplied = true;
        }

        let currentShields = Number(targetActor.system.shields?.value) || 0;
        let currentHealth = Number(targetActor.system.health?.value) || 0;
        let dmgToShields = Math.min(currentShields, rolledDmg);
        let dmgToHealth = rolledDmg - dmgToShields;
        await targetActor.update({
          "system.shields.value": currentShields - dmgToShields,
          "system.health.value": Math.max(0, currentHealth - dmgToHealth)
        });

        const blastIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png";
        await targetActor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Blast (Photon Strike)",
          icon: blastIcon,
          origin: this.uuid,
          duration: { rounds: 1 },
          statuses: ["blast"],
          description: "Blast: Explodes on tick dealing radial damage to adjacent tokens.",
          flags: {
            core: { statusId: "blast" },
            customDescription: "Blast: Explodes on tick dealing radial damage to adjacent tokens.",
            "warframe-ttrpg": {
              isVaubanIncapacitatedStatus: passiveApplied
            }
          }
        }]);

        strikeHTML += `
          <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e74c3c;">
            🎯 Artillery strike hits <strong>${t.name}</strong> dealing <strong>${rolledDmg} Blast damage</strong> (Rolled ${baseDmg} on ${formula})${passiveApplied ? " (Passive +25% applied)" : ""}${overguardApplied ? " 🛡️ <strong>(Overguard 2x damage!)</strong>" : ""}.
          </div>
        `;
      }

      strikeHTML += `</div>`;

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="background: rgba(231,76,60,0.05); border: 1px solid rgba(231,76,60,0.25); border-radius: 4px; padding: 10px; font-family: 'Orbitron', sans-serif;">
            <h3 style="margin:0 0 6px 0; color:#e74c3c; font-size:12px; font-weight:bold; text-transform:uppercase; border-bottom:1px solid rgba(231,76,60,0.15); padding-bottom:4px;">
              🛰️ Photon Strike Laser Call 🛰️
            </h3>
            <p style="margin:0; font-size:11px; color:#cbd5e1;">Target beacon dropped. Massive laser strike incoming on all hostiles in 21 ft area.</p>
            ${strikeHTML}
          </div>
        `
      });
      return;
    }

    if (ability.name.includes("Paralysis")) {
      const name = ability.name;
      let slowAmount = 0.15; // default 15%
      let vulnPercent = 20; // default 20%
      let durationRounds = 3; // 3 rounds (15s)
      let damageFormula = "1d10";

      if (name.includes("II")) {
        slowAmount = 0.20;
        vulnPercent = 30;
        damageFormula = "2d10";
      } else if (name.includes("III")) {
        slowAmount = 0.25;
        vulnPercent = 40;
        damageFormula = "3d10";
      } else if (name.includes("IV")) {
        slowAmount = 0.30;
        vulnPercent = 50;
        damageFormula = "4d10";
      }

      // Find all hostile tokens in template radius
      const radiusPixels = (templateDoc.distance || 0) * (canvas.grid.size / canvas.scene.grid.distance);
      const enemiesInRadius = [];

      for (let token of canvas.tokens.placeables) {
        if (!token.actor) continue;
        const isHostile = token.document.disposition === CONST.TOKEN_DISPOSITIONS?.HOSTILE || token.document.disposition === -1;
        if (!isHostile) continue;

        const tokenX = token.x + (token.document.width || 1) * canvas.grid.size / 2;
        const tokenY = token.y + (token.document.height || 1) * canvas.grid.size / 2;
        const dx = tokenX - templateDoc.x;
        const dy = tokenY - templateDoc.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist <= radiusPixels) {
          enemiesInRadius.push(token);
        }
      }

      if (enemiesInRadius.length === 0) {
        ui.notifications.warn(`No hostile targets in range for ${name} to hit.`);
        return;
      }

      // Roll radial blast damage
      const powerStrength = Number(this.system.powerStrength?.value) || 100;
      const strengthBonus = Math.floor((powerStrength - 100) / 10);
      let finalFormula = damageFormula;
      if (strengthBonus > 0) {
        finalFormula += ` + ${strengthBonus}`;
      } else if (strengthBonus < 0) {
        finalFormula += ` - ${Math.abs(strengthBonus)}`;
      }

      const damageRoll = new Roll(finalFormula);
      await damageRoll.evaluate();
      await damageRoll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        flavor: `${this.name} rolls ${name} Blast Damage`
      });

      // Target them automatically
      game.user.targets.clear();
      for (let token of enemiesInRadius) {
        token.setTarget(true, { releaseOthers: false });
      }

      // Apply slow & vulnerability active effects to each hostile token
      const effectIcon = "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-ParalysisIcon(xWhite).webp";
      const description = `Paralyzed: Speed reduced by ${Math.round(slowAmount * 100)}% and takes +${vulnPercent}% Melee Damage.`;

      for (let token of enemiesInRadius) {
        const targetActor = token.actor;
        await targetActor.createEmbeddedDocuments("ActiveEffect", [{
          name: name,
          icon: effectIcon,
          origin: this.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.speed.land.value", value: 1 - slowAmount, mode: 1, priority: 20 } // Mode 1: MULTIPLY
          ],
          description: description,
          flags: {
            core: { statusId: "paralysis" },
            customDescription: description
          }
        }]);
      }

      ui.notifications.info(`Applied ${name} status effects to ${enemiesInRadius.length} targeted enemies.`);
      return;
    }

    if (ability.name.includes("Brightbonnet")) {
      const isTierII = ability.name.includes("II");
      const isTierIII = ability.name.includes("III");
      const energyRestore = isTierIII ? 15 : (isTierII ? 12 : 10);
      const strengthBonus = isTierIII ? 30 : (isTierII ? 20 : 15);
      const impactIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialImpactGlyph.png";
      const buffIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png";

      // 1. Find all creatures in template radius
      const radiusPixels = (templateDoc.distance || 0) * (canvas.grid.size / canvas.scene.grid.distance);
      const creaturesInRadius = [];

      for (let token of canvas.tokens.placeables) {
        if (!token.actor) continue;

        const tokenX = token.x + (token.document.width || 1) * canvas.grid.size / 2;
        const tokenY = token.y + (token.document.height || 1) * canvas.grid.size / 2;
        const dx = tokenX - templateDoc.x;
        const dy = tokenY - templateDoc.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist <= radiusPixels) {
          creaturesInRadius.push(token);
        }
      }

      if (creaturesInRadius.length === 0) {
        ui.notifications.warn("No creatures found inside the Brightbonnet template radius.");
        return;
      }

      // Target them automatically
      game.user.targets.clear();
      for (let token of creaturesInRadius) {
        token.setTarget(true, { releaseOthers: false });
      }

      const statusDescriptions = {
        "impact": "<strong>Impact (Stagger)</strong>: Staggers the target. The target has disadvantage on their next attack roll, and standing up from prone costs 100% of their movement speed."
      };

      let chatRows = "";

      // 2. Process each creature
      for (let token of creaturesInRadius) {
        const targetActor = token.actor;
        
        const isHostile = token.document.disposition === CONST.TOKEN_DISPOSITIONS?.HOSTILE || token.document.disposition === -1;
        const isAlly = !isHostile && (token.document.disposition === CONST.TOKEN_DISPOSITIONS?.FRIENDLY || token.document.disposition === 1 || token.document.disposition === 0 || targetActor.type === "warframe" || targetActor.type === "character");

        let statusMsg = "";

        if (isHostile) {
          // Apply Stagger (Impact status)
          await targetActor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Impact",
            icon: impactIcon,
            origin: this.uuid,
            duration: { rounds: 1 },
            statuses: ["impact"],
            description: statusDescriptions["impact"],
            flags: {
              core: { statusId: "impact" },
              customDescription: statusDescriptions["impact"]
            }
          }]);
          statusMsg = `<span style="color: #ffaa00; font-weight: bold;">Stagger (Impact) applied</span>`;
        } else if (isAlly) {
          // Apply Rejuvenation Buff
          await targetActor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Brightbonnet Rejuvenation",
            icon: buffIcon,
            origin: this.uuid,
            duration: { rounds: 1 },
            statuses: ["brightbonnet_buff"],
            description: `<strong>Brightbonnet Rejuvenation</strong>: Restores ${energyRestore} Energy per round and grants +${strengthBonus}% Ability Strength.`,
            changes: [{
              key: "system.powerStrength.value",
              value: String(strengthBonus),
              mode: 2
            }],
            flags: {
              core: { statusId: "brightbonnet_buff" },
              customDescription: `<strong>Brightbonnet Rejuvenation</strong>: Restores ${energyRestore} Energy per round and grants +${strengthBonus}% Ability Strength.`,
              energyRegen: energyRestore
            }
          }]);
          statusMsg = `<span style="color: #2ecc71; font-weight: bold;">Rejuvenation Buff applied</span>`;
        }

        chatRows += `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 4px;"><strong>${token.name}</strong></td>
            <td style="padding: 4px; text-align: center;">${isHostile ? 'Enemy' : 'Ally'}</td>
            <td style="padding: 4px; text-align: right;">${statusMsg}</td>
          </tr>
        `;
      }

      // Always apply the buff to the caster too if they weren't in the template
      const casterExists = creaturesInRadius.some(t => t.actor?.id === this.id);
      if (!casterExists) {
        await this.createEmbeddedDocuments("ActiveEffect", [{
          name: "Brightbonnet Rejuvenation",
          icon: buffIcon,
          origin: this.uuid,
          duration: { rounds: 1 },
          statuses: ["brightbonnet_buff"],
          description: `<strong>Brightbonnet Rejuvenation</strong>: Restores ${energyRestore} Energy per round and grants +${strengthBonus}% Ability Strength.`,
          changes: [{
            key: "system.powerStrength.value",
            value: String(strengthBonus),
            mode: 2
          }],
          flags: {
            core: { statusId: "brightbonnet_buff" },
            customDescription: `<strong>Brightbonnet Rejuvenation</strong>: Restores ${energyRestore} Energy per round and grants +${strengthBonus}% Ability Strength.`,
            energyRegen: energyRestore
          }
        }]);
      }

      const summaryContent = `
        <div style="background: linear-gradient(135deg, #12161a 0%, #0d1013 100%); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 6px; padding: 10px; font-family: 'Inter', sans-serif; color: #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
          <h3 style="margin: 0 0 8px 0; font-size: 13px; font-family: 'Orbitron', sans-serif; color: #00e5ff; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">
            🌸 Brightbonnet Sprout Pulse 🌸
          </h3>
          <div style="font-size: 11px; margin-bottom: 6px;">
            Buff: <strong style="color: #2ecc71;">+${energyRestore} Energy & +${strengthBonus}% Power Strength</strong>
          </div>
          <table style="width: 100%; font-size: 11px; border-collapse: collapse; margin-top: 6px;">
            <thead>
              <tr style="color: #8892b0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
                <th style="padding: 4px;">Creature</th>
                <th style="padding: 4px; text-align: center;">Relation</th>
                <th style="padding: 4px; text-align: right;">Result</th>
              </tr>
            </thead>
            <tbody>
              ${chatRows}
            </tbody>
          </table>
        </div>
      `;

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: summaryContent
      });
      return;
    }

    const isTierII = ability.name.includes("II");
    const isTierIII = ability.name.includes("III");
    const durationRounds = isTierIII ? 2 : 1;
    const baseDamageFormula = isTierIII ? "4d6" : (isTierII ? "3d6" : "2d6");

    // 1. Calculate caster Power DC
    const focusVal = this.system.attributes?.focus?.value || 10;
    const focusMod = Math.floor((focusVal - 10) / 2);
    const level = Number(this.system.details?.level?.value) || 1;
    const profBonus = Math.floor((level - 1) / 4) + 2;
    const powerDC = 8 + profBonus + focusMod;

    // 2. Select enemies in template radius
    const radiusPixels = (templateDoc.distance || 0) * (canvas.grid.size / canvas.scene.grid.distance);
    const enemiesInRadius = [];

    for (let token of canvas.tokens.placeables) {
      if (!token.actor) continue;
      const isHostile = token.document.disposition === CONST.TOKEN_DISPOSITIONS?.HOSTILE || token.document.disposition === -1;
      if (!isHostile) continue;

      const tokenX = token.x + (token.document.width || 1) * canvas.grid.size / 2;
      const tokenY = token.y + (token.document.height || 1) * canvas.grid.size / 2;
      const dx = tokenX - templateDoc.x;
      const dy = tokenY - templateDoc.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist <= radiusPixels) {
        enemiesInRadius.push(token);
      }
    }

    if (enemiesInRadius.length === 0) {
      ui.notifications.warn("No enemies found inside the Stinkbrain template radius.");
      return;
    }

    // Target them automatically
    game.user.targets.clear();
    for (let token of enemiesInRadius) {
      token.setTarget(true, { releaseOthers: false });
    }

    // 3. Roll damage
    const powerStrength = Number(this.system.powerStrength?.value) || 100;
    const strengthBonus = Math.floor((powerStrength - 100) / 10);
    let finalFormula = baseDamageFormula;
    if (strengthBonus > 0) {
      finalFormula += ` + ${strengthBonus}`;
    } else if (strengthBonus < 0) {
      finalFormula += ` - ${Math.abs(strengthBonus)}`;
    }

    const damageRoll = new Roll(finalFormula);
    await damageRoll.evaluate();
    await damageRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${this.name} rolls Stinkbrain spore damage`
    });

    const viralIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png";
    const statusDescriptions = {
      "viral": "<strong>Viral (Disease)</strong>: Amplifies damage to health. Increases all damage dealt directly to the target's health by 50%."
    };

    let chatRows = "";

    // 4. Resolve save and apply effects for each enemy
    for (let token of enemiesInRadius) {
      const targetActor = token.actor;
      
      // Physique/Prowess save mod
      const physSaveMod = targetActor.system.saves?.physique?.mod || 0;
      const prowSaveMod = targetActor.system.saves?.prowess?.mod || 0;
      const saveMod = Math.max(physSaveMod, prowSaveMod);
      const saveLabel = physSaveMod >= prowSaveMod ? "Physique" : "Prowess";

      const saveRoll = new Roll(`1d20 + @mod`, { mod: saveMod });
      await saveRoll.evaluate();
      await saveRoll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: targetActor }),
        flavor: `${targetActor.name} rolls ${saveLabel} Save vs Stinkbrain DC ${powerDC}`
      });

      const failed = saveRoll.total < powerDC;
      let effectsToCreate = [];

      // Viral is applied 100% on pulse
      effectsToCreate.push({
        name: "Viral",
        icon: viralIcon,
        origin: this.uuid,
        duration: { rounds: 1 },
        statuses: ["viral"],
        description: statusDescriptions["viral"],
        flags: {
          core: { statusId: "viral" },
          customDescription: statusDescriptions["viral"]
        }
      });

      let statusMsg = `<span style="color: #2ecc71;">Viral applied</span>`;

      if (failed) {
        // Sleep is applied on failed save
        effectsToCreate.push({
          name: "Asleep (Stinkbrain)",
          icon: "icons/svg/daze.svg",
          origin: this.uuid,
          duration: { rounds: durationRounds },
          statuses: ["unconscious"],
          description: "<strong>Asleep</strong>: Target is incapacitated, has 0 movement speed, attacks against them have advantage, and they have 100% vulnerability to Finisher damage.",
          flags: {
            core: { statusId: "unconscious" },
            customDescription: "<strong>Asleep</strong>: Target is incapacitated, has 0 movement speed, attacks against them have advantage, and they have 100% vulnerability to Finisher damage."
          }
        });
        statusMsg = `<span style="color: #ff2a5f; font-weight: bold;">Asleep & Viral applied</span>`;
      }

      await targetActor.createEmbeddedDocuments("ActiveEffect", effectsToCreate);

      chatRows += `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 4px;"><strong>${token.name}</strong></td>
          <td style="padding: 4px; text-align: center;">${saveLabel}</td>
          <td style="padding: 4px; text-align: center; font-weight: bold; color: ${failed ? '#ff2a5f' : '#2ecc71'};">${saveRoll.total}</td>
          <td style="padding: 4px; text-align: right;">${statusMsg}</td>
        </tr>
      `;
    }

    const summaryContent = `
      <div style="background: linear-gradient(135deg, #12161a 0%, #0d1013 100%); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 6px; padding: 10px; font-family: 'Inter', sans-serif; color: #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
        <h3 style="margin: 0 0 8px 0; font-size: 13px; font-family: 'Orbitron', sans-serif; color: #00e5ff; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;">
          🍄 Stinkbrain Spores Pulse 🍄
        </h3>
        <div style="font-size: 11px; margin-bottom: 6px; display: flex; justify-content: space-between;">
          <span>Caster Power DC: <strong>${powerDC}</strong></span>
          <span>Damage Rolled: <strong style="color: #00e5ff;">${damageRoll.total} Viral</strong></span>
        </div>
        <table style="width: 100%; font-size: 11px; border-collapse: collapse; margin-top: 6px;">
          <thead>
            <tr style="color: #8892b0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left;">
              <th style="padding: 4px;">Enemy</th>
              <th style="padding: 4px; text-align: center;">Save</th>
              <th style="padding: 4px; text-align: center;">Roll</th>
              <th style="padding: 4px; text-align: right;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${chatRows}
          </tbody>
        </table>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: summaryContent
    });
  }

  /**
   * Cast an ability
   * @param {string} abilityId 
   */
  async castAbility(abilityId) {
    try {
      let ability;
    if (abilityId === "voidStrikeActive") {
      ability = {
        name: "Madurai: Void Strike",
        system: {
          cost: 20,
          description: "Active: Consume 20 Energy to deal +50% Damage on next attack."
        }
      };
    } else if (abilityId === "voidRadianceActive") {
      ability = {
        name: "Madurai: Void Radiance",
        system: {
          cost: 25,
          description: "Active: Consume 25 Energy to emit a blinding wave of light, blinding close foes for 1 round."
        }
      };
    } else if (abilityId === "voidStrikePassive" || abilityId === "voidRadiancePassive") {
      return;
    } else {
      ability = this.items.get(abilityId);
    }
    if (!ability) return;

    const cost = Number(ability.system.cost) || 0;
    const currentEnergy = Number(this.system.energy.value) || 0;

    if (ability.name.startsWith("Brimstone")) {
      const currentBrimstone = Number(this.system.brimstone?.value) || 0;
      if (currentBrimstone < 100) {
        ui.notifications.warn(`Brimstone requires 100% Brimstone Fury gauge to unleash the Hellfire! (Current: ${currentBrimstone}%)`);
        return;
      }
    }

    if (currentEnergy < cost) {
      ui.notifications.warn(`Not enough energy to cast ${ability.name}! (Cost: ${cost}, Current: ${currentEnergy})`);
      return;
    }

    let refund = 0;
    const isVaubanAbility = ["Tesla Nervos", "Minelayer", "Photon Strike", "Bastille"].some(n => ability.name.startsWith(n));
    if (this.items.some(i => i.name.includes("Trap Specialist")) && isVaubanAbility) {
      refund = 10;
    }

    const maxEnergy = Number(this.system.energy.max) || 100;
    const newEnergy = Math.min(maxEnergy, currentEnergy - cost + refund);
    const updatePayload = { "system.energy.value": newEnergy };
    if (ability.name.startsWith("Brimstone")) {
      updatePayload["system.brimstone.value"] = 0;
    }
    await this.update(updatePayload);
    if (refund > 0) {
      ui.notifications.info(`Trap Specialist refunded 10 Energy!`);
    }

    // Consommation automatique d'Action Majeure, Parkour ou Réaction
    const actionCostType = (ability.system?.actionType === "reaction" || ability.system?.isReaction || ability.name?.toLowerCase().includes("réaction") || ability.name?.toLowerCase().includes("reaction")) ? "reaction"
      : (ability.system?.actionType === "parkour" || ability.system?.isParkour || ability.name?.toLowerCase().includes("parkour") || ability.name?.toLowerCase().includes("glissade") || ability.name?.toLowerCase().includes("jump") || ability.name?.toLowerCase().includes("élan")) ? "parkour"
      : "action";
    await this.consumeCombatAction(actionCostType);

    // Excalibur Exalted Blade activation
    if (ability.name.startsWith("Exalted Blade")) {
      const name = ability.name;
      let numDice = 2; // default 2d10
      let durationRounds = 99; // active until deactivated or run out of energy

      if (name.includes("II")) {
        numDice = 4;
      } else if (name.includes("III")) {
        numDice = 6;
      }

      // 1. Calculate Power Strength scaling flat damage bonus
      const powerStrength = Number(this.system.powerStrength?.value) || 100;
      const flatBonus = Math.max(0, Math.floor((powerStrength - 100) / 10));
      const bladeFormula = flatBonus > 0 ? `${numDice}d10 + ${flatBonus}` : `${numDice}d10`;

      // 2. Clear existing Exalted Blade weapon or active effect to prevent duplicates
      const oldBlade = this.items.filter(i => i.type === "weapon" && (i.name === "Exalted Blade" || i.flags?.["warframe-ttrpg"]?.isExaltedBlade));
      if (oldBlade.length > 0) {
        await this.deleteEmbeddedDocuments("Item", oldBlade.map(i => i.id));
      }
      const oldEffect = this.effects.filter(e => !e.disabled && (e.statuses?.has("exalted_blade") || e.flags?.core?.statusId === "exalted_blade" || e.name.startsWith("Exalted Blade")));
      if (oldEffect.length > 0) {
        await this.deleteEmbeddedDocuments("ActiveEffect", oldEffect.map(e => e.id));
      }

      // 3. Create the "Exalted Blade" weapon in the actor's inventory
      const weaponData = {
        name: "Exalted Blade",
        type: "weapon",
        img: ability.img,
        system: {
          type: "melee",
          damage: bladeFormula,
          damageType: "Radiant",
          range: "Melee/Waves",
          equipped: true
        },
        flags: {
          "warframe-ttrpg": { isExaltedBlade: true }
        }
      };
      await this.createEmbeddedDocuments("Item", [weaponData]);

      // 4. Create the "Exalted Blade Active" Active Effect
      const description = `Exalted Blade Active: Pure energy blade summoned. Damage: ${bladeFormula}. Waves travel 40 ft (II). Blinds on crit (II). Crit multiplier increases to 3x (III/Passive).`;
      const effectData = {
        name: "Exalted Blade Active",
        icon: ability.img,
        origin: this.uuid,
        duration: { rounds: durationRounds },
        statuses: ["exalted_blade"],
        description: description,
        flags: {
          core: { statusId: "exalted_blade" },
          customDescription: description
        }
      };
      await this.createEmbeddedDocuments("ActiveEffect", [effectData]);

      ui.notifications.info(`Exalted Blade activated! Exalted Blade weapon created and equipped.`);
    }

    // Valkyr Hysteria activation
    if (ability.name.startsWith("Hysteria")) {
      const name = ability.name;
      let numDice = 2; // default 2d10
      let healAmount = 70; // default 70 lifesteal
      let warcryMult = 1.5; // default 1.5x
      let durationRounds = 99; // active until deactivated or run out of energy

      if (name.includes("II")) {
        numDice = 3;
        healAmount = 80;
        warcryMult = 2.0;
      } else if (name.includes("III")) {
        numDice = 4;
        healAmount = 90;
        warcryMult = 2.5;
      } else if (name.includes("IV")) {
        numDice = 5;
        healAmount = 100;
        warcryMult = 3.0;
      }

      // 1. Calculate Power Strength scaling flat damage bonus
      const powerStrength = Number(this.system.powerStrength?.value) || 100;
      const flatBonus = Math.max(0, Math.floor((powerStrength - 100) / 10));
      const talonFormula = flatBonus > 0 ? `${numDice}d10 + ${flatBonus}` : `${numDice}d10`;

      // 2. Clear existing Talons or Hysteria effect if already there to prevent duplicates
      const oldTalons = this.items.filter(i => i.type === "weapon" && (i.name === "Valkyr Talons" || i.flags?.["warframe-ttrpg"]?.isTalon));
      if (oldTalons.length > 0) {
        await this.deleteEmbeddedDocuments("Item", oldTalons.map(i => i.id));
      }
      const oldHysteria = this.effects.filter(e => !e.disabled && (e.statuses?.has("hysteria") || e.flags?.core?.statusId === "hysteria" || e.name.startsWith("Hysteria")));
      if (oldHysteria.length > 0) {
        await this.deleteEmbeddedDocuments("ActiveEffect", oldHysteria.map(e => e.id));
      }

      // 3. Create the "Valkyr Talons" weapon in the actor's inventory
      const weaponData = {
        name: "Valkyr Talons",
        type: "weapon",
        img: ability.img,
        system: {
          type: "melee",
          damage: talonFormula,
          damageType: "Slash/Impact",
          range: "Melee",
          equipped: true
        },
        flags: {
          "warframe-ttrpg": { isTalon: true }
        }
      };
      await this.createEmbeddedDocuments("Item", [weaponData]);

      // 4. Create the "Hysteria" Active Effect on Valkyr
      const description = `Hysteria Active: Talons damage ${talonFormula}, status immunity, restores ${healAmount} HP on hit, and Warcry armor boost multiplied by ${warcryMult}x.`;
      const effectData = {
        name: "Hysteria Active",
        icon: ability.img,
        origin: this.uuid,
        duration: { rounds: durationRounds },
        statuses: ["hysteria"],
        description: description,
        flags: {
          core: { statusId: "hysteria" },
          customDescription: description
        }
      };
      await this.createEmbeddedDocuments("ActiveEffect", [effectData]);

      ui.notifications.info(`Hysteria activated! Valkyr Talons created and equipped. Status Immunity and Lifesteal active.`);
    }

    // Valkyr Warcry Buff application
    if (ability.name.startsWith("Warcry")) {
      const name = ability.name;
      let armorBonus = 0.25; // default +25%
      let durationRounds = 2; // default 2 rounds (10s)
      let description = "Armor boosted by +25% and melee hit rolls boosted by +2.";

      if (name.includes("II")) {
        armorBonus = 0.35;
        durationRounds = 3;
        description = "Armor boosted by +35% and melee speed boosted by +20%.";
      } else if (name.includes("III")) {
        armorBonus = 0.45;
        durationRounds = 3;
        description = "Armor boosted by +45% and melee speed boosted by +25%.";
      } else if (name.includes("IV")) {
        armorBonus = 0.50;
        durationRounds = 4;
        description = "Armor boosted by +50% and melee speed boosted by +50%.";
      }

      // Check if Valkyr has Hysteria active; if so, Warcry's armor bonus is multiplied
      const hasStatus = (statusId) => {
        return this.effects.some(e => !e.disabled && (e.statuses?.has(statusId) || e.flags?.core?.statusId === statusId));
      };
      if (hasStatus("hysteria")) {
        const hysteriaItem = this.items.find(i => i.type === "ability" && i.name.startsWith("Hysteria"));
        const hName = hysteriaItem?.name || "";
        const multiplier = hName.includes("IV") ? 3.0 : hName.includes("III") ? 2.5 : hName.includes("II") ? 2.0 : 1.5;
        armorBonus *= multiplier;
        description += ` (Hysteria Active: Armor boost multiplied by ${multiplier}x to +${Math.round(armorBonus * 100)}%)`;
      }

      let speedBonus = 10; // default +10%
      if (name.includes("II")) speedBonus = 20;
      else if (name.includes("III")) speedBonus = 25;
      else if (name.includes("IV")) speedBonus = 50;

      // Create Active Effect on self
      await this.createEmbeddedDocuments("ActiveEffect", [{
        name: name,
        icon: ability.img,
        origin: this.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.armor.value", value: 1 + armorBonus, mode: 1, priority: 20 }, // Mode 1: MULTIPLY
          { key: "system.meleeSpeed.value", value: speedBonus, mode: 2, priority: 20 }  // Mode 2: ADD
        ],
        description: description,
        flags: {
          core: { statusId: "warcry_buff" },
          customDescription: description
        }
      }]);

      // Apply to targeted allies
      for (let targetToken of game.user.targets) {
        const targetActor = targetToken.actor;
        if (targetActor && targetActor.uuid !== this.uuid) {
          let targetArmorBonus = 0.25;
          if (name.includes("II")) targetArmorBonus = 0.35;
          else if (name.includes("III")) targetArmorBonus = 0.45;
          else if (name.includes("IV")) targetArmorBonus = 0.50;

          const targetHasHysteria = targetActor.effects.some(e => !e.disabled && (e.statuses?.has("hysteria") || e.flags?.core?.statusId === "hysteria"));
          let targetDescription = `Armor boosted by +${Math.round(targetArmorBonus * 100)}% and melee speed boosted by +${speedBonus}%.`;
          if (targetHasHysteria) {
            const targetHysteriaItem = targetActor.items.find(i => i.type === "ability" && i.name.startsWith("Hysteria"));
            const thName = targetHysteriaItem?.name || "";
            const multiplier = thName.includes("IV") ? 3.0 : thName.includes("III") ? 2.5 : thName.includes("II") ? 2.0 : 1.5;
            targetArmorBonus *= multiplier;
            targetDescription += ` (Hysteria Active: Armor boost multiplied by ${multiplier}x to +${Math.round(targetArmorBonus * 100)}%)`;
          }

          await targetActor.createEmbeddedDocuments("ActiveEffect", [{
            name: name,
            icon: ability.img,
            origin: this.uuid,
            duration: { rounds: durationRounds },
            changes: [
              { key: "system.armor.value", value: 1 + targetArmorBonus, mode: 1, priority: 20 },
              { key: "system.meleeSpeed.value", value: speedBonus, mode: 2, priority: 20 }
            ],
            description: targetDescription,
            flags: {
              core: { statusId: "warcry_buff" },
              customDescription: targetDescription
            }
          }]);
          ui.notifications.info(`Applied ${name} buff to ally ${targetActor.name}!`);
        }
      }
      ui.notifications.info(`Applied ${name} buff to ${this.name}!`);
    }

    let isFatesCast = false;
    let fatesRolls = [];
    let fatesTotal = 0;
    let isShadowTrinity = false;

    const isKoumeiClass = this.items.some(i => i.type === "warframe" && i.name === "Koumei");
    const hasFiveFates = isKoumeiClass || this.items.some(i => i.name === "The Five Fates (Active Mechanic)" || i.id === "koumeimechanic01");
    const isPower = ["Power 1", "Power 2", "Power 3", "Power 4", "Active"].includes(ability.system.abilitySlot);

    if (hasFiveFates && isPower) {
      isFatesCast = true;
      const rank = Number(this.system.details?.level?.value) || 1;
      let numDice = 1;
      if (rank >= 15) numDice = 5;
      else if (rank >= 12) numDice = 4;
      else if (rank >= 6) numDice = 3;
      else if (rank >= 2) numDice = 2;

      const hasFatesFavor = this.items.some(i => i.name === "Fate's Favor" || i.id === "koumeifatefavor1");
      const hasShadowBlessing = this.items.some(i => i.name === "Shadow's Blessing" || i.id === "koumeishadowbles");

      // Check if Fates Weaver capstone is active/used.
      // For simplicity/utility, if they cast a level 30 capstone, they can choose to force all 6s,
      // or we can prompt or detect it. Let's roll randomly but if they have the capstone,
      // we print a message that they can force 6s, or just roll the dice:
      for (let i = 0; i < numDice; i++) {
        let r = Math.floor(Math.random() * 6) + 1;
        if (r === 1 && hasFatesFavor) {
          r = Math.floor(Math.random() * 6) + 1;
        }
        fatesRolls.push(r);
      }
      fatesTotal = fatesRolls.reduce((a, b) => a + b, 0);

      const numSixes = fatesRolls.filter(d => d === 6).length;
      const reqSixes = hasShadowBlessing ? 2 : 3;
      isShadowTrinity = numSixes >= reqSixes;
    }

    const abilityConfigs = {
      "Kumihimo": { templateType: "ray", templateDistance: 30 },
      "Kumihimo II": { templateType: "ray", templateDistance: 30 },
      "Kumihimo III": { templateType: "ray", templateDistance: 30 },
      "Bunraku": { templateType: "cone", templateDistance: 30 },
      "Bunraku II": { templateType: "cone", templateDistance: 45 },
      "Bunraku III": { templateType: "cone", templateDistance: 60 },
      "Slash Dash": { damage: "1d10", templateType: "ray", templateDistance: 30 },
      "Slash Dash II": { damage: "2d10", templateType: "ray", templateDistance: 30 },
      "Slash Dash III": { damage: "3d10", templateType: "ray", templateDistance: 30 },
      "Radial Blind": { templateType: "circle", templateDistance: 15 },
      "Radial Blind II": { templateType: "circle", templateDistance: 15 },
      "Radial Blind III": { templateType: "circle", templateDistance: 15 },
      "Radial Javelin": { damage: "3d8", templateType: "circle", templateDistance: 15 },
      "Radial Javelin II": { damage: "5d8", templateType: "circle", templateDistance: 15 },
      "Radial Javelin III": { damage: "8d8", templateType: "circle", templateDistance: 15 },
      "Shock": { damage: "1d8", templateType: "ray", templateDistance: 15 },
      "Shock II": { damage: "2d8", templateType: "ray", templateDistance: 15 },
      "Shock III": { damage: "3d8", templateType: "ray", templateDistance: 15 },
      "Speed": { templateType: "circle", templateDistance: 30 },
      "Speed II": { templateType: "circle", templateDistance: 30 },
      "Speed III": { templateType: "circle", templateDistance: 30 },
      "Discharge": { damage: "1d10", templateType: "circle", templateDistance: 30 },
      "Discharge II": { damage: "2d10", templateType: "circle", templateDistance: 45 },
      "Pull": { damage: "1d6", templateType: "cone", templateDistance: 30 },
      "Pull II": { damage: "2d6", templateType: "cone", templateDistance: 30 },
      "Pull III": { damage: "3d6", templateType: "cone", templateDistance: 30 },
      "Magnetize": { damage: "1d8", templateType: "circle", templateDistance: 15 },
      "Magnetize II": { damage: "2d8", templateType: "circle", templateDistance: 15 },
      "Magnetize III": { damage: "3d8", templateType: "circle", templateDistance: 15 },
      "Polarize": { templateType: "circle", templateDistance: 30 },
      "Polarize II": { templateType: "circle", templateDistance: 30 },
      "Polarize III": { templateType: "circle", templateDistance: 30 },
      "Crush": { damage: "3d12", templateType: "circle", templateDistance: 30 },
      "Crush II": { damage: "5d12", templateType: "circle", templateDistance: 45 },
      "Crush III": { damage: "8d12", templateType: "circle", templateDistance: 60 },
      "Stinkbrain": { damage: "2d6", templateType: "circle", templateDistance: 15 },
      "Stinkbrain II": { damage: "3d6", templateType: "circle", templateDistance: 15 },
      "Stinkbrain III": { damage: "4d6", templateType: "circle", templateDistance: 15 },
      "Brightbonnet": { templateType: "circle", templateDistance: 30 },
      "Brightbonnet II": { templateType: "circle", templateDistance: 30 },
      "Brightbonnet III": { templateType: "circle", templateDistance: 30 },
      "Sporespring": { damage: "10d6" },
      "Sporespring II": { damage: "12d6" },
      "Sporespring III": { damage: "15d6" },
      "Rip Line": { damage: "3d8" },
      "Rip Line II": { damage: "4d8" },
      "Rip Line III": { damage: "5d8" },
      "Rip Line IV": { damage: "6d8" },
      "Paralysis": { damage: "1d10", templateType: "circle", templateDistance: 15 },
      "Paralysis II": { damage: "2d10", templateType: "circle", templateDistance: 21 },
      "Paralysis III": { damage: "3d10", templateType: "circle", templateDistance: 24 },
      "Paralysis IV": { damage: "4d10", templateType: "circle", templateDistance: 30 },
      "Photon Strike": { damage: "6d12", templateType: "circle", templateDistance: 21 },
      "Photon Strike II": { damage: "9d12", templateType: "circle", templateDistance: 21 },
      "Photon Strike III": { damage: "15d12", templateType: "circle", templateDistance: 21 }
    };

    const config = abilityConfigs[ability.name] || {};
    const abilityName = ability.name || "";
    const baseName = abilityName.replace(/\s+(II|III|IV|V)$/i, "").trim().toLowerCase();
    const taxonomyEntry = abilityTaxonomy[baseName] || {};

    const abilitySlot = (ability.system.abilitySlot || "").toLowerCase();
    const isPassiveSlot = abilitySlot.includes("passive") || abilitySlot.includes("mechanic") || abilitySlot.includes("specialization") || abilitySlot.includes("capstone") || (cost === 0 && !abilitySlot.includes("power"));

    // 1. Determine Action Type
    let actionType = ability.system.actionType || taxonomyEntry.type;
    if (!actionType) {
      if (isPassiveSlot) actionType = "passive";
      else actionType = "buff";
    }

    // 2. Determine Action Roll Formula
    let rollFormula = "";
    let healFormula = "";

    if (isFatesCast) {
      if (ability.name.includes("Kumihimo")) {
        const dieSize = ability.name.includes("III") ? "d8" : (ability.name.includes("II") ? "d6" : "d4");
        rollFormula = `${fatesTotal}${dieSize}`;
        actionType = "damage";
      } else if (ability.name.includes("Omikuji")) {
        rollFormula = "";
        actionType = "buff";
      } else if (ability.name.includes("Omamori")) {
        rollFormula = ability.name.includes("III") ? "1d2" : (ability.name.includes("II") ? "1d4" : "1d10");
        actionType = "buff";
      } else if (ability.name.includes("Bunraku")) {
        rollFormula = "";
        actionType = "cc";
      }
    } else if (actionType === "damage") {
      rollFormula = config.damage || ability.system.damage || taxonomyEntry.damage || "";
      if (!rollFormula) {
        const descDiceMatch = ability.system.description?.match(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\b/i);
        if (descDiceMatch) {
          rollFormula = descDiceMatch[1];
        } else {
          const isRank3 = abilityName.includes("III") || abilityName.includes("IV");
          const isRank2 = abilityName.includes("II");
          if (abilitySlot.includes("power 1") || abilitySlot === "1") {
            rollFormula = isRank3 ? "3d10" : (isRank2 ? "2d10" : "1d10");
          } else if (abilitySlot.includes("power 2") || abilitySlot === "2") {
            rollFormula = isRank3 ? "4d8" : (isRank2 ? "3d8" : "2d8");
          } else if (abilitySlot.includes("power 3") || abilitySlot === "3") {
            rollFormula = isRank3 ? "8d8" : (isRank2 ? "5d8" : "3d8");
          } else if (abilitySlot.includes("power 4") || abilitySlot === "4") {
            rollFormula = isRank3 ? "10d12" : (isRank2 ? "6d12" : "4d12");
          }
        }
      }
    } else if (actionType === "heal") {
      // Check for explicit healing dice formula
      const descDiceMatch = ability.system.description?.match(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\b/i);
      if (descDiceMatch) {
        healFormula = descDiceMatch[1];
      }
      rollFormula = ""; // Do not roll kinetic attack damage
    } else {
      // Buffs, Debuffs, Crowd Control, Summons, Utility never roll damage dice
      rollFormula = "";
    }

    // 3. Badges, Icons, Colors & Save DC
    let damageType = "";
    let damageColor = "#00e5ff";
    let damageIcon = "fas fa-bolt";
    let actionBadge = taxonomyEntry.badge || "";
    let actionColor = taxonomyEntry.color || "#00e5ff";
    let actionIcon = taxonomyEntry.icon || "fas fa-bolt";
    let hasSaveDC = taxonomyEntry.hasSaveDC !== undefined ? taxonomyEntry.hasSaveDC : false;

    if (actionType === "damage") {
      damageType = ability.system.damageType || taxonomyEntry.element || "Kinetic";
      damageColor = taxonomyEntry.color || "#00e5ff";
      damageIcon = taxonomyEntry.icon || "fas fa-bolt";
      actionBadge = damageType;
      actionColor = damageColor;
      actionIcon = damageIcon;
      hasSaveDC = true;
    } else if (actionType === "buff") {
      actionBadge = "Bonus / Aura";
      actionColor = "#00e5ff";
      actionIcon = "fas fa-shield-alt";
      hasSaveDC = false;
    } else if (actionType === "debuff") {
      actionBadge = "Affaiblissement";
      actionColor = "#f59e0b";
      actionIcon = "fas fa-crosshairs";
      hasSaveDC = true;
    } else if (actionType === "cc") {
      actionBadge = "Contrôle";
      actionColor = "#a855f7";
      actionIcon = "fas fa-biohazard";
      hasSaveDC = true;
    } else if (actionType === "heal") {
      actionBadge = (taxonomyEntry.element === "Energy") ? "Restauration d'Énergie" : "Restauration";
      actionColor = "#10b981";
      actionIcon = (taxonomyEntry.element === "Energy") ? "fas fa-bolt" : "fas fa-heart";
      hasSaveDC = false;
    } else if (actionType === "summon") {
      actionBadge = "Invocation";
      actionColor = "#38bdf8";
      actionIcon = "fas fa-robot";
      hasSaveDC = false;
    } else if (actionType === "utility") {
      actionBadge = "Manœuvre";
      actionColor = "#cbd5e1";
      actionIcon = "fas fa-bolt";
      hasSaveDC = false;
    }

    let actionSummary = "";
    if (actionType === "heal") {
      actionSummary = (taxonomyEntry.element === "Energy") ? "Restaure l'Énergie des membres d'escouade à portée." : "Restaure la Vitalité / Santé des membres d'escouade à portée.";
    } else if (actionType === "buff") {
      actionSummary = "Bonus tactique d'escouade / personnel actif.";
    } else if (actionType === "debuff") {
      actionSummary = "Inflige des pénalités tactiques et affaiblissements aux cibles.";
    } else if (actionType === "cc") {
      actionSummary = "Neutralise et contrôle les cibles affectées.";
    } else if (actionType === "summon") {
      actionSummary = "Unité de combat autonome déployée sur le terrain.";
    } else if (actionType === "utility") {
      actionSummary = "Exécute un déplacement tactique ou une manœuvre de combat.";
    }

    // Power DC Calculation (8 + Proficiency + Focus Mod)
    const focusVal = this.system.attributes?.focus?.value || 10;
    const focusMod = Math.floor((focusVal - 10) / 2);
    const actorLevel = Number(this.system.details?.level?.value) || 1;
    const profBonus = Math.floor((actorLevel - 1) / 4) + 2;
    const powerDC = 8 + profBonus + focusMod;

    // Power Duration scaling calculation for badges/tooltips
    const powerDuration = Number(this.system.powerDuration?.value) || 100;
    let durationFormatted = "";
    if (actionType === "buff" || actionType === "cc" || actionType === "debuff") {
      if (powerDuration !== 100) {
        durationFormatted = `${powerDuration}% Durée`;
      }
    }

    // Apply Power Strength stats scaling:
    // If power strength is at 110%, it adds +1 damage to the final damage (flat bonus)
    // for every 10% above 100%, it adds +1 flat damage. Below 100%, it subtracts 1 flat damage.
    const powerStrength = Number(this.system.powerStrength?.value) || 100;
    const strengthBonus = Math.floor((powerStrength - 100) / 10);
    if (rollFormula && rollFormula.includes("d")) {
      if (strengthBonus > 0) {
        rollFormula += ` + ${strengthBonus}`;
      } else if (strengthBonus < 0) {
        rollFormula += ` - ${Math.abs(strengthBonus)}`;
      }
    }

    // Automatic Measured Template placement
    const templateType = config.templateType || ability.system.templateType;
    let templateDistance = Number(config.templateDistance) || Number(ability.system.templateDistance) || 0;
    
    // Apply Power Range stats scaling:
    // If power range is at 110%, it adds +1m (or +3 ft) to the range.
    // So for every 10% above/below 100%, it adds/subtracts 3 ft (1m).
    const powerRange = Number(this.system.powerRange?.value) || 100;
    const rangeBonusMeters = (powerRange - 100) / 10;
    let rangeBonusFeet = rangeBonusMeters * 3;
    if (this.items.some(i => i.name.includes("Trap Specialist"))) {
      rangeBonusFeet += 15;
    }
    if (templateDistance > 0) {
      templateDistance += rangeBonusFeet;
    }

    // Convert template distance if scene uses meters instead of feet (approx 3 ft = 1 m)
    const sceneUnits = canvas.scene?.grid?.units || canvas.scene?.units || "";
    if (sceneUnits === "m") {
      templateDistance = Math.round(templateDistance / 3);
    }

    // Koumei Bunraku Trinity makes it a circle instead of cone
    let finalTemplateType = templateType;
    if (isFatesCast && isShadowTrinity && ability.name.includes("Bunraku")) {
      finalTemplateType = "circle";
    }

    if (finalTemplateType && templateDistance > 0 && canvas.scene) {
      const tokens = this.getActiveTokens();
      const token = tokens[0] || canvas.tokens.controlled[0];
      const x = token ? token.x + canvas.grid.size / 2 : 0;
      const y = token ? token.y + canvas.grid.size / 2 : 0;
      const templateData = {
        t: finalTemplateType,
        user: game.user.id,
        distance: templateDistance,
        direction: 0,
        x: x,
        y: y,
        fillColor: game.user.color || "#00e5ff",
        flags: {
          "warframe-ttrpg": {
            abilityName: ability.name,
            casterId: this.id
          }
        }
      };
      if (finalTemplateType === "cone") {
        templateData.angle = 60; // 60 degree cone
      } else if (finalTemplateType === "ray") {
        templateData.width = 5; // 5 ft wide line
      }
      this.placeTemplate(templateData, ability);
      ui.notifications.info(`Aiming ${finalTemplateType} template. Move mouse to position, scroll wheel to rotate, click to place.`);
    }

    let abilityDescription = ability.system.description || "";

    // Specialized Canonical Ability Mechanics Execution
    const mechanicsResult = await AbilityMechanicsRegistry.execute(baseName, this, ability, {
      cost,
      powerDC,
      powerStrength,
      powerDuration,
      strengthBonus,
      actionType,
      damageType,
      rollFormula,
      taxonomyEntry
    });

    if (mechanicsResult?.cardExtraHTML) {
      abilityDescription += mechanicsResult.cardExtraHTML;
    }
    if (mechanicsResult?.handled && actionType !== "damage") {
      rollFormula = "";
    }

    const isOmikuji = ability.name.includes("Omikuji");
    if (isFatesCast && (isOmikuji || isShadowTrinity)) {
      const decreesMap = {
        1: "(1) +2 Attack",
        2: "(2) +15 ft Speed",
        3: "(3) +100 Shields",
        4: "(4) +20% Damage",
        5: "(5) Regen 30 HP/round",
        6: "(6) Power DC +1"
      };

      let rollCount = 0;
      if (isOmikuji) {
        rollCount = (isShadowTrinity || ability.name.includes("III")) ? 2 : 1;
      } else if (isShadowTrinity) {
        rollCount = 1; // 1 Decree granted by Shadow's Trinity on non-Omikuji casts
      }

      if (rollCount > 0) {
        let rollsList = [];
        for (let i = 0; i < rollCount; i++) {
          rollsList.push(Math.floor(Math.random() * 6) + 1);
        }

        const decreesApplied = rollsList.map(r => decreesMap[r]);
        const durationText = isOmikuji 
          ? (ability.name.includes("III") ? "1 hour" : (ability.name.includes("II") ? "10 minutes" : "1 minute"))
          : "1 minute"; // Standard Trinity decree duration

        let decreesHTML = `
          <div style="margin-top: 8px; padding: 6px; background: rgba(155, 89, 182, 0.08); border: 1px solid rgba(155, 89, 182, 0.25); border-radius: 4px; font-family: 'Orbitron', sans-serif;">
            <div style="font-size: 10px; color: #d7bde2; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">${isOmikuji ? "Fate's Decree" : "Trinity Decree Reward"} (Duration: ${durationText})</div>
        `;

        if (isOmikuji && ability.name.includes("III")) {
          decreesHTML += `<div style="font-size: 11px; color: #ccd6f6; line-height: 1.3;">Rolls: ${rollsList.map(r => `<strong>${r}</strong>`).join(", ")}<br>Choose one: ${decreesApplied.join(" OR ")}</div>`;
        } else if (isOmikuji && isShadowTrinity) {
          decreesHTML += `<div style="font-size: 11px; color: #ffaa00; font-weight: bold; line-height: 1.3;">Shadow's Trinity! You gain BOTH Decrees:</div>
            <div style="font-size: 11px; color: #cbd5e1; line-height: 1.3;">➔ ${decreesApplied.join("<br>➔ ")}</div>`;
        } else if (isShadowTrinity) {
          decreesHTML += `<div style="font-size: 11px; color: #ffaa00; font-weight: bold; line-height: 1.3;">Shadow's Trinity Reward Decree:</div>
            <div style="font-size: 11px; color: #ccd6f6; line-height: 1.3;">Rolled a <strong>${rollsList[0]}</strong>: ➔ ${decreesApplied[0]}</div>`;
        } else {
          decreesHTML += `<div style="font-size: 11px; color: #ccd6f6; line-height: 1.3;">Rolled a <strong>${rollsList[0]}</strong>: ➔ ${decreesApplied[0]}</div>`;
        }
        decreesHTML += `</div>`;
        abilityDescription += decreesHTML;
      }
    }

    // Bunraku Status Effects Roll
    let rolledEffects = {};
    if (isFatesCast && ability.name.includes("Bunraku")) {
      const statusEffects = ["Slash", "Impact", "Puncture", "Heat", "Cold", "Electricity", "Toxin", "Magnetic", "Blast", "Corrosive", "Gas", "Radiation", "Viral", "Void"];
      
      const numEffects = isShadowTrinity 
        ? 30 
        : (ability.name.includes("III") ? fatesTotal + 5 : (ability.name.includes("II") ? fatesTotal : Math.ceil(fatesTotal / 2)));
      
      for (let i = 0; i < numEffects; i++) {
        const effect = statusEffects[Math.floor(Math.random() * statusEffects.length)];
        rolledEffects[effect] = (rolledEffects[effect] || 0) + 1;
      }
      
      let effectsHTML = `
        <div style="margin-top: 8px; padding: 6px; background: rgba(231, 76, 60, 0.08); border: 1px solid rgba(231, 76, 60, 0.25); border-radius: 4px; font-family: 'Orbitron', sans-serif;">
          <div style="font-size: 10px; color: #e74c3c; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">Status Effects Applied (${numEffects} Total Stacks)</div>
          <div style="font-size: 11px; color: #ccd6f6; line-height: 1.4; display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px;">
      `;
      
      for (const [effect, count] of Object.entries(rolledEffects)) {
        effectsHTML += `<div>➔ <strong>${effect}</strong>: x${count}</div>`;
      }
      
      effectsHTML += `
          </div>
        </div>
      `;
      abilityDescription += effectsHTML;
    }

    const statusDescriptions = {
      "slash": "<strong>Slash (Bleed)</strong>: Deals Bleed damage over time. The target takes physical damage equal to 10% of their maximum Health at the start of their turn, bypassing armor (but not shields).",
      "impact": "<strong>Impact (Stagger)</strong>: Staggers the target. The target has disadvantage on their next attack roll, and standing up from prone costs 100% of their movement speed.",
      "puncture": "<strong>Puncture (Weaken)</strong>: Weakens the target. The target's damage output is reduced by 20%.",
      "heat": "<strong>Heat (Burn)</strong>: Deals fire damage and reduces armor. Target takes fire damage equal to 5% of their maximum Health at the start of their turn, and their armor value is reduced by 50%.",
      "cold": "<strong>Cold (Freeze)</strong>: Slows action speed. Target's movement speed is halved, and all attacks against the target have their critical threat range expanded by 1 step (e.g. 19-20 instead of 20).",
      "electricity": "<strong>Electricity (Tesla)</strong>: Stuns and chains damage. Target is stunned for 1 round, and all adjacent characters take electric damage equal to 10% of the target's maximum Health.",
      "toxin": "<strong>Toxin (Poison)</strong>: Deals poison damage directly to health. Target takes toxin damage equal to 10% of their maximum Health at the start of their turn, bypassing shields completely.",
      "magnetic": "<strong>Magnetic (Shield Disrupt)</strong>: Disrupts shields. Target's maximum shields are reduced by 50%, and they cannot regenerate shields.",
      "blast": "<strong>Blast (Explosion)</strong>: Radial explosion. Deals explosive damage equal to 10% of the target's maximum Health to the primary target. Adjacent creatures take half of this damage.",
      "corrosive": "<strong>Corrosive (Armor Melt)</strong>: Melts armor. Reduces the target's armor value by 100 flat. Each time Corrosive is reapplied, this armor reduction increases by an additional 100 flat.",
      "gas": "<strong>Gas (Cloud)</strong>: Spreads toxic cloud. Spawns a 5 ft radius gas cloud dealing poison damage equal to 10% of the target's maximum Health per round to anyone inside.",
      "radiation": "<strong>Radiation (Confusion)</strong>: Confuses target. Target will attack their nearest ally on their turn.",
      "viral": "<strong>Viral (Disease)</strong>: Amplifies damage to health. Increases all damage dealt directly to the target's health by 50%.",
      "void": "<strong>Void (Eldritch Rift)</strong>: Plagues the target with chaotic reality-warping energy. At the start of their turn, they roll a d6:<br/>• <strong>1-2</strong>: Takes Void damage equal to 10% of their max Health.<br/>• <strong>3-4</strong>: Restrained by void tendrils.<br/>• <strong>5-6</strong>: Confused and must attack the nearest creature.",
      "restrained": "<strong>Restrained</strong>: The target's movement speed is 0, they have disadvantage on attack rolls, and attacks against them have advantage.",
      "stunned": "<strong>Stunned</strong>: The target is incapacitated, cannot move or take actions, and fails all agility-based saves."
    };

    // Automatic Status Effects & Control Effects Application to Targeted Tokens
    if (isFatesCast && game.user.targets.size > 0) {
      const targets = game.user.targets;
      
      // Bunraku application
      if (ability.name.includes("Bunraku")) {
        const durationRounds = ability.name.includes("III") ? 3 : (ability.name.includes("II") ? 3 : 1);
        const controlStatus = ability.name.includes("III") ? "stunned" : "restrained";
        const controlLabel = ability.name.includes("III") ? "Stunned" : "Restrained";
        const controlIcon = ability.name.includes("III") ? "icons/svg/daze.svg" : "icons/svg/net.svg";

        const statusIcons = {
          "Slash": "systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png",
          "Impact": "systems/warframe-ttrpg/asset/Element icon/EssentialImpactGlyph.png",
          "Puncture": "systems/warframe-ttrpg/asset/Element icon/EssentialPunctureGlyph.png",
          "Heat": "systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png",
          "Cold": "systems/warframe-ttrpg/asset/Element icon/ColdModBundleIcon.png",
          "Electricity": "systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png",
          "Toxin": "systems/warframe-ttrpg/asset/Element icon/300px-ToxinModBundleIcon.webp",
          "Magnetic": "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png",
          "Blast": "systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png",
          "Corrosive": "systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png",
          "Gas": "systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png",
          "Radiation": "systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png",
          "Viral": "systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png",
          "Void": "systems/warframe-ttrpg/asset/Element icon/EssentialVoidGlyph.png"
        };

        for (let targetToken of targets) {
          const targetActor = targetToken.actor;
          if (!targetActor) continue;

          let effectsToCreate = [];

          // 1. Add Control Effect
          effectsToCreate.push({
            name: `${controlLabel} (Bunraku)`,
            icon: controlIcon,
            origin: this.uuid,
            duration: { rounds: durationRounds },
            statuses: [controlStatus],
            description: statusDescriptions[controlStatus] || "",
            flags: { 
              core: { statusId: controlStatus },
              customDescription: statusDescriptions[controlStatus] || ""
            }
          });

          // 2. Add Rolled Status Element Stacks
          for (const [effect, count] of Object.entries(rolledEffects)) {
            const effectId = effect.toLowerCase();
            effectsToCreate.push({
              name: effect,
              icon: statusIcons[effect] || "icons/svg/hazard.svg",
              origin: this.uuid,
              duration: { rounds: 1 },
              statuses: [effectId],
              description: statusDescriptions[effectId] || "",
              flags: { 
                core: { statusId: effectId },
                customDescription: statusDescriptions[effectId] || ""
              }
            });
          }

          await targetActor.createEmbeddedDocuments("ActiveEffect", effectsToCreate);
        }
        ui.notifications.info("Applied Bunraku status/control effects to targeted tokens.");
      }

      // Kumihimo application
      if (ability.name.includes("Kumihimo")) {
        const isTierIII = ability.name.includes("III");
        const statusIcons = {
          "Heat": "systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png",
          "Cold": "systems/warframe-ttrpg/asset/Element icon/ColdModBundleIcon.png",
          "Electricity": "systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png",
          "Toxin": "systems/warframe-ttrpg/asset/Element icon/300px-ToxinModBundleIcon.webp"
        };

        for (let targetToken of targets) {
          const targetActor = targetToken.actor;
          if (!targetActor) continue;

          let effectsToCreate = [];

          if (isTierIII) {
            effectsToCreate.push({
              name: "Restrained (Kumihimo)",
              icon: "icons/svg/net.svg",
              origin: this.uuid,
              duration: { rounds: 1 },
              statuses: ["restrained"],
              description: statusDescriptions["restrained"] || "",
              flags: { 
                core: { statusId: "restrained" },
                customDescription: statusDescriptions["restrained"] || ""
              }
            });
          }

          if (isShadowTrinity) {
            const elements = ["Heat", "Cold", "Electricity", "Toxin"];
            for (let el of elements) {
              const elId = el.toLowerCase();
              effectsToCreate.push({
                name: el,
                icon: statusIcons[el],
                origin: this.uuid,
                duration: { rounds: 1 },
                statuses: [elId],
                description: statusDescriptions[elId] || "",
                flags: { 
                  core: { statusId: elId },
                  customDescription: statusDescriptions[elId] || ""
                }
              });
            }
          }

          if (effectsToCreate.length > 0) {
            await targetActor.createEmbeddedDocuments("ActiveEffect", effectsToCreate);
          }
        }
      }
    }

    // --- NOKKO ABILITIES ACTIVE EFFECTS ---
    const isNokkoClass = this.items.some(i => i.type === "warframe" && i.name === "Nokko");
    if (isNokkoClass && isPower) {
      const targets = game.user.targets;

      // 3. Reroot
      if (ability.name.includes("Reroot")) {
        const isTierII = ability.name.includes("II");
        const isTierIII = ability.name.includes("III");
        const durationRounds = isTierIII ? 4 : (isTierII ? 3 : 2);
        const regenValue = isTierIII ? 10 : (isTierII ? 6 : 4);
        const rerootHealPerRound = regenValue * 6; // 4 hp/s is 24 hp/round

        await this.createEmbeddedDocuments("ActiveEffect", [{
          name: "Sprodling Form (Reroot)",
          icon: "icons/svg/root.svg",
          origin: this.uuid,
          duration: { rounds: durationRounds },
          description: `<strong>Sprodling Form (Reroot)</strong>: Nokko is invulnerable, invisible, and intangible. Heals ${rerootHealPerRound} Health/Shields per round. Dodge speed is boosted.`,
          flags: {
            core: { statusId: "reroot_buff" },
            customDescription: `<strong>Sprodling Form (Reroot)</strong>: Nokko is invulnerable, invisible, and intangible. Heals ${rerootHealPerRound} Health/Shields per round. Dodge speed is boosted.`,
            rerootHeal: rerootHealPerRound
          }
        }]);

        // Spawn 3 spore templates around the caster's token
        const tokens = this.getActiveTokens();
        const token = tokens[0] || canvas.tokens.controlled[0];
        if (token) {
          const x = token.document.x;
          const y = token.document.y;
          const size = canvas.grid.size;
          const gridDistance = canvas.scene.grid.distance || 5;
          const sporeRadius = gridDistance * 0.7;
          
          const offsets = [
            { x: -size, y: 0 },
            { x: size, y: 0 },
            { x: 0, y: size }
          ];
          
          const templatesData = offsets.map(off => ({
            t: "circle",
            user: game.user.id,
            distance: sporeRadius,
            x: x + off.x + size/2,
            y: y + off.y + size/2,
            fillColor: "#39ff14",
            flags: {
              "warframe-ttrpg": {
                isSpore: true,
                heal: 50,
                speedPercent: 50,
                casterId: this.id
              }
            }
          }));
          
          await canvas.scene.createEmbeddedDocuments("MeasuredTemplate", templatesData);
          ui.notifications.info("Spawned 3 Spore templates on the ground adjacent to you.");
        }
      }

      // 4. Sporespring
      if (ability.name.includes("Sporespring")) {
        const toxinIcon = "systems/warframe-ttrpg/asset/Element icon/300px-ToxinModBundleIcon.webp";
        
        // Find initial target (either user targeted or closest hostile within 30 ft)
        let initialTarget = Array.from(targets)[0];
        if (!initialTarget) {
          const tokens = this.getActiveTokens();
          const token = tokens[0] || canvas.tokens.controlled[0];
          if (token) {
            const hostiles = canvas.tokens.placeables.filter(t => t.actor && t.id !== token.id && (t.document.disposition === -1 || t.document.disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE));
            let closest = null;
            let minD = Infinity;
            for (let h of hostiles) {
              const dx = token.x - h.x;
              const dy = token.y - h.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < minD) {
                minD = dist;
                closest = h;
              }
            }
            const maxRangePixels = 30 * (canvas.grid.size / canvas.scene.grid.distance);
            if (closest && minD <= maxRangePixels) {
              initialTarget = closest;
            }
          }
        }

        if (initialTarget) {
          const hitSequence = [];
          const alreadyHit = new Set();
          let currentToken = initialTarget;
          alreadyHit.add(currentToken.id);
          
          const maxHits = 6; // 1 initial + 5 bounces
          for (let hitIndex = 0; hitIndex < maxHits; hitIndex++) {
            const bounceIndex = hitIndex;
            const critChance = 75 + (bounceIndex * 25);
            
            // Evaluate damage roll
            const damageRoll = new Roll(rollFormula);
            await damageRoll.evaluate({ async: true });
            
            // Calculate crit tier
            const rollValue = Math.floor(Math.random() * 100) + 1;
            const guaranteedTiers = Math.floor(critChance / 100);
            const remainingChance = critChance % 100;
            let critTier = guaranteedTiers;
            if (rollValue <= remainingChance) {
              critTier += 1;
            }
            
            const isCrit = critTier > 0;
            const dmgMult = 1 + critTier;
            const baseDamage = damageRoll.total;
            const finalDamage = baseDamage * dmgMult;
            
            // Apply shield-bypassing toxin damage and toxin active effect
            const targetActor = currentToken.actor;
            if (targetActor) {
              const currentHealth = Number(targetActor.system.health?.value) || 0;
              const newHealth = Math.max(0, currentHealth - finalDamage);
              await targetActor.update({ "system.health.value": newHealth });
              
              await targetActor.createEmbeddedDocuments("ActiveEffect", [{
                name: "Toxin",
                icon: toxinIcon,
                origin: this.uuid,
                duration: { rounds: 1 },
                statuses: ["toxin"],
                description: statusDescriptions["toxin"] || "",
                flags: {
                  core: { statusId: "toxin" },
                  customDescription: statusDescriptions["toxin"] || ""
                }
              }]);
            }
            
            hitSequence.push({
              name: currentToken.name,
              bounceNum: bounceIndex,
              critChance,
              isCrit,
              critTier,
              dmgMult,
              baseDamage,
              finalDamage
            });
            
            if (hitIndex === maxHits - 1) break;
            
            // Search for the closest valid target within 30 ft of currentToken
            const sceneTokens = canvas.tokens.placeables.filter(t => 
              t.actor && 
              t.id !== currentToken.id && 
              !alreadyHit.has(t.id) && 
              (t.document.disposition === -1 || t.document.disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE)
            );
            
            let nextToken = null;
            let minDistance = Infinity;
            const maxBouncePixels = 30 * (canvas.grid.size / canvas.scene.grid.distance);
            
            for (let t of sceneTokens) {
              const dx = currentToken.x - t.x;
              const dy = currentToken.y - t.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < minDistance && dist <= maxBouncePixels) {
                minDistance = dist;
                nextToken = t;
              }
            }
            
            if (!nextToken) break;
            currentToken = nextToken;
            alreadyHit.add(currentToken.id);
          }
          
          // Build bounce log HTML
          let bounceHTML = `
            <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; font-family: 'Inter', sans-serif;">
              <div style="font-family: 'Orbitron', sans-serif; font-size: 10px; color: #00e5ff; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">Ballistic Bounces:</div>
          `;
          
          for (let hit of hitSequence) {
            let critLabel = "";
            let critColor = "#e2e8f0";
            if (hit.isCrit) {
              if (hit.critTier === 1) {
                critLabel = ` (CRIT! x2)`;
                critColor = "#f1c40f";
              } else if (hit.critTier === 2) {
                critLabel = ` (ORANGE CRIT! x3)`;
                critColor = "#e67e22";
              } else {
                critLabel = ` (RED CRIT! x${hit.dmgMult})`;
                critColor = "#e74c3c";
              }
            }
            
            bounceHTML += `
              <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 6px; margin-bottom: 6px; font-size: 11px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-weight: bold; color: #fff;">
                    ${hit.bounceNum === 0 ? "🎯 Initial Target" : `➔ Bounce #${hit.bounceNum}`}: ${hit.name}
                  </span>
                  <span style="font-size: 10px; color: #94a3b8;">Crit: ${hit.critChance}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Roll: <strong style="color: #94a3b8;">${hit.baseDamage}</strong> Toxin</span>
                  <span>Damage: <strong style="color: ${critColor};">${hit.finalDamage}${critLabel}</strong></span>
                </div>
              </div>
            `;
          }
          bounceHTML += `</div>`;
          abilityDescription += bounceHTML;
        } else {
          ui.notifications.warn("No hostile targets in range for Sporespring to hit.");
        }
      }
    }

    // Vauban Tesla Nervos activation
    if (ability.name.startsWith("Tesla Nervos")) {
      const name = ability.name;
      let formula = "1d8";
      let radiusFt = 12;
      let durationRounds = 1;
      let tickFormula = "1d4";
      if (name.includes("II")) {
        formula = "2d8";
        radiusFt = 12;
        durationRounds = 2;
        tickFormula = "1d6";
      } else if (name.includes("III")) {
        formula = "4d8";
        radiusFt = 18;
        durationRounds = 3;
        tickFormula = "1d10";
      }

      let primaryTarget = game.user.targets.first()?.document;
      if (!primaryTarget) {
        const sourceToken = canvas.tokens.placeables.find(t => t.actor?.id === this.id);
        if (sourceToken) {
          const hostiles = canvas.tokens.placeables
            .filter(t => t.actor && t.actor.id !== this.id && t.actor.system.details?.side !== "friendly")
            .map(t => {
              const dx = sourceToken.x - t.x;
              const dy = sourceToken.y - t.y;
              return { token: t, dist: Math.sqrt(dx*dx + dy*dy) };
            })
            .sort((a, b) => a.dist - b.dist);
          
          if (hostiles.length > 0) {
            primaryTarget = hostiles[0].token.document;
          }
        }
      }

      if (primaryTarget && primaryTarget.actor) {
        const targetActor = primaryTarget.actor;
        const rollVal = new Roll(formula);
        await rollVal.evaluate();
        await rollVal.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this }),
          flavor: `${this.name} rolls Tesla Nervos primary damage`
        });
        const powerStrength = Number(this.system.powerStrength?.value) || 100;
        let rolledDmg = Math.round(rollVal.total * (powerStrength / 100));

        let passiveApplied = false;
        if (targetActor.isIncapacitated && targetActor.isIncapacitated()) {
          rolledDmg = Math.round(rolledDmg * 1.25);
          passiveApplied = true;
        }

        let currentShields = Number(targetActor.system.shields?.value) || 0;
        let currentHealth = Number(targetActor.system.health?.value) || 0;
        let dmgToShields = Math.min(currentShields, rolledDmg);
        let dmgToHealth = rolledDmg - dmgToShields;
        let newShields = currentShields - dmgToShields;
        let newHealth = Math.max(0, currentHealth - dmgToHealth);
        await targetActor.update({
          "system.shields.value": newShields,
          "system.health.value": newHealth
        });

        const isStatusProc = Math.random() < 0.50;
        if (isStatusProc) {
          const elecIcon = "systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png";
          await targetActor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Electricity (Tesla Nervos)",
            icon: elecIcon,
            origin: this.uuid,
            duration: { rounds: 1 },
            statuses: ["electricity"],
            description: "Shocked: Bypasses armor, shocks/stuns target, and chains to adjacent targets.",
            flags: {
              core: { statusId: "electricity" },
              customDescription: "Shocked: Bypasses armor, shocks/stuns target, and chains to adjacent targets.",
              "warframe-ttrpg": {
                isVaubanIncapacitatedStatus: passiveApplied
              }
            }
          }]);
        }

        await targetActor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Tesla Nervos Drone",
          icon: "icons/magic/lightning/bolt-strike-blue.webp",
          origin: this.uuid,
          duration: { rounds: durationRounds },
          description: `Tesla drone attached, dealing ${tickFormula} Electricity damage at start of turn.`,
          flags: {
            "warframe-ttrpg": {
              tickFormula: tickFormula,
              powerStrength: powerStrength
            }
          }
        }]);

        let secondaryMsg = "";
        const scaledRadius = radiusFt + rangeBonusFeet;
        const maxPixels = scaledRadius * (canvas.grid.size / (canvas.scene?.grid?.distance || 5)) + 5;
        const secondaries = canvas.tokens.placeables.filter(t => {
          if (t.id === primaryTarget.id || !t.actor) return false;
          const dx = primaryTarget.x - t.x;
          const dy = primaryTarget.y - t.y;
          return Math.sqrt(dx*dx + dy*dy) <= maxPixels;
        });

        for (let secToken of secondaries) {
          const secActor = secToken.actor;
          const secRoll = new Roll(formula);
          await secRoll.evaluate();
          await secRoll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this }),
            flavor: `Tesla Nervos Arc damage to ${secToken.name}`
          });
          let secDmg = Math.round(secRoll.total * (powerStrength / 100));

          if (secActor.isIncapacitated && secActor.isIncapacitated()) {
            secDmg = Math.round(secDmg * 1.25);
          }

          let secShields = Number(secActor.system.shields?.value) || 0;
          let secHealth = Number(secActor.system.health?.value) || 0;
          let sDmgShields = Math.min(secShields, secDmg);
          let sDmgHealth = secDmg - sDmgShields;
          await secActor.update({
            "system.shields.value": secShields - sDmgShields,
            "system.health.value": Math.max(0, secHealth - sDmgHealth)
          });

          if (isStatusProc) {
            const elecIcon = "systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png";
            await secActor.createEmbeddedDocuments("ActiveEffect", [{
              name: "Electricity (Tesla Nervos)",
              icon: elecIcon,
              origin: this.uuid,
              duration: { rounds: 1 },
              statuses: ["electricity"],
              flags: {
                core: { statusId: "electricity" }
              }
            }]);
          }

          secondaryMsg += `<br/>⚡ Arced to <strong>${secToken.name}</strong> dealing <strong>${secDmg} Electricity damage</strong>.`;
        }

        abilityDescription += `
          <div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.4; background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.15); padding: 8px; border-radius: 4px;">
            🤖 Tesla Nervos drone attached to <strong>${primaryTarget.name}</strong>!
            <br/>Primary hit: <strong>${rolledDmg} Electricity damage</strong> (Rolled ${rollVal.total} on ${formula})${passiveApplied ? " (Passive +25% applied)" : ""}.
            <br/>Shields: ${currentShields} ➔ ${newShields} | Health: ${currentHealth} ➔ ${newHealth}.
            ${isStatusProc ? "<br/>⚡ Applied Electricity status effect (stun)!" : ""}
            ${secondaryMsg}
          </div>
        `;
      } else {
        ui.notifications.warn("No targets in range to deploy Tesla Nervos drone.");
      }
    }

    // Vauban Minelayer activation
    if (ability.name.startsWith("Minelayer")) {
      const name = ability.name;
      let punctureFormula = "2d8";
      let maxTethers = 1;
      let durationRounds = 3;
      if (name.includes("II")) {
        punctureFormula = "3d8";
        maxTethers = 1;
        durationRounds = 3;
      } else if (name.includes("III")) {
        punctureFormula = "4d8";
        maxTethers = 2;
        durationRounds = 3;
      }

      new Dialog({
        title: "Minelayer Selection",
        content: `
          <div style="text-align: center; margin-bottom: 10px; font-family: 'Orbitron', sans-serif; font-size: 12px; color: #ccd6f6;">
            Choose a mine type to deploy:
          </div>
        `,
        buttons: {
          tether: {
            icon: '<i class="fas fa-link"></i>',
            label: "Tether-Flechette Orb",
            callback: async () => {
              const sourceToken = canvas.tokens.placeables.find(t => t.actor?.id === this.id);
              if (!sourceToken) return;

              let targetTokens = Array.from(game.user.targets);
              if (targetTokens.length === 0) {
                const maxPixels = (30 + rangeBonusFeet) * (canvas.grid.size / (canvas.scene?.grid?.distance || 5)) + 5;
                targetTokens = canvas.tokens.placeables.filter(t => {
                  if (t.id === sourceToken.id || !t.actor || t.actor.system.details?.side === "friendly") return false;
                  const dx = sourceToken.x - t.x;
                  const dy = sourceToken.y - t.y;
                  return Math.sqrt(dx*dx + dy*dy) <= maxPixels;
                });
              }

              if (targetTokens.length > 0) {
                let hitHTML = `<div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.4;">`;
                let tetherCount = 0;
                const powerStrength = Number(this.system.powerStrength?.value) || 100;

                for (let t of targetTokens) {
                  const targetActor = t.actor;
                  const rollVal = new Roll(punctureFormula);
                  await rollVal.evaluate();
                  await rollVal.toMessage({
                    speaker: ChatMessage.getSpeaker({ actor: this }),
                    flavor: `${this.name} rolls Tether-Flechette Orb damage`
                  });
                  
                  const isCrit = Math.random() < 0.50;
                  const critMult = isCrit ? 2 : 1;
                  let rolledDmg = rollVal.total * critMult;
                  
                  rolledDmg = Math.round(rolledDmg * (powerStrength / 100));

                  let passiveApplied = false;
                  if (targetActor.isIncapacitated && targetActor.isIncapacitated()) {
                    rolledDmg = Math.round(rolledDmg * 1.25);
                    passiveApplied = true;
                  }

                  let currentShields = Number(targetActor.system.shields?.value) || 0;
                  let currentHealth = Number(targetActor.system.health?.value) || 0;
                  let dmgToShields = Math.min(currentShields, rolledDmg);
                  let dmgToHealth = rolledDmg - dmgToShields;
                  await targetActor.update({
                    "system.shields.value": currentShields - dmgToShields,
                    "system.health.value": Math.max(0, currentHealth - dmgToHealth)
                  });

                  // 50% chance to status proc Puncture
                  const isStatus = Math.random() < 0.50;
                  if (isStatus) {
                    const puncIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialPunctureGlyph.png";
                    await targetActor.createEmbeddedDocuments("ActiveEffect", [{
                      name: "Puncture (Minelayer)",
                      icon: puncIcon,
                      origin: this.uuid,
                      duration: { rounds: 1 },
                      statuses: ["puncture"],
                      description: "Weakened: Target deals 10% less damage (stacks up to 5 times for 50%).",
                      changes: [{ key: "system.damageBonus.value", mode: 2, value: "-10" }],
                      flags: {
                        core: { statusId: "puncture" },
                        customDescription: "Weakened: Target deals 10% less damage (stacks up to 5 times for 50%)."
                      }
                    }]);
                  }

                  // Tether stasis capture (Max targets)
                  if (tetherCount < maxTethers) {
                    await targetActor.createEmbeddedDocuments("ActiveEffect", [{
                      name: "Restrained (Tether Orb)",
                      icon: "icons/svg/net.svg",
                      origin: this.uuid,
                      duration: { rounds: durationRounds },
                      statuses: ["restrained"],
                      description: "Restrained by Vauban's tether orb: suspended and unable to move.",
                      flags: {
                        core: { statusId: "restrained" },
                        customDescription: "Restrained by Vauban's tether orb: suspended and unable to move."
                      }
                    }]);
                    tetherCount++;
                  }

                  hitHTML += `
                    <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e67e22;">
                      🎯 Orb hits <strong>${t.name}</strong> dealing <strong>${rolledDmg} Puncture damage</strong> (Rolled ${rollVal.total} on ${punctureFormula})${isCrit ? " 💥 <strong>(Crit!)</strong>" : ""}${passiveApplied ? " (Passive +25%)" : ""}.<br/>
                      <span style="color: #ccd6f6;">Shields: ${currentShields} ➔ ${currentShields - dmgToShields} | Health: ${currentHealth} ➔ ${Math.max(0, currentHealth - dmgToHealth)}.</span>
                    </div>
                  `;
                }

                hitHTML += `</div>`;
                
                await ChatMessage.create({
                  speaker: ChatMessage.getSpeaker({ actor: this }),
                  content: `
                    <div style="background: rgba(230,126,34,0.05); border: 1px solid rgba(230,126,34,0.25); border-radius: 4px; padding: 10px; font-family: 'Orbitron', sans-serif;">
                      <h3 style="margin:0 0 6px 0; color:#e67e22; font-size:12px; font-weight:bold; text-transform:uppercase; border-bottom:1px solid rgba(230,126,34,0.15); padding-bottom:4px;">
                        ⛓️ Tether-Flechette Orb Deployed ⛓️
                      </h3>
                      <p style="margin:0; font-size:11px; color:#cbd5e1;">Deployed mine within ${30 + rangeBonusFeet} ft, launching flechettes at local hostiles.</p>
                      ${hitHTML}
                    </div>
                  `
                });
              } else {
                ui.notifications.info(`No targets within ${30 + rangeBonusFeet} ft of Tether-Flechette mine.`);
              }
            }
          },
          vector: {
            icon: '<i class="fas fa-wind"></i>',
            label: "Vector-Overdrive Pad",
            callback: async () => {
              const sourceToken = canvas.tokens.placeables.find(t => t.actor?.id === this.id);
              if (!sourceToken) return;

              let friendlyTokens = Array.from(game.user.targets).filter(t => t.actor && t.actor.id !== this.id && t.actor.system.details?.side === "friendly");
              if (friendlyTokens.length === 0) {
                const maxPixels = (30 + rangeBonusFeet) * (canvas.grid.size / (canvas.scene?.grid?.distance || 5)) + 5;
                friendlyTokens = canvas.tokens.placeables.filter(t => {
                  if (!t.actor) return false;
                  if (t.id === sourceToken.id) return true;
                  return t.actor.system.details?.side === "friendly" && Math.sqrt(Math.pow(sourceToken.x - t.x, 2) + Math.pow(sourceToken.y - t.y, 2)) <= maxPixels;
                });
              }

              const powerDuration = Number(this.system.powerDuration?.value) || 100;
              const durationRoundsScaled = Math.round(durationRounds * (powerDuration / 100));

              let boostHTML = `<div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.4;">`;
              for (let t of friendlyTokens) {
                const targetActor = t.actor;
                
                const existing = targetActor.effects.filter(e => e.name === "Vector-Overdrive" || e.label === "Vector-Overdrive");
                if (existing.length > 0) {
                  await targetActor.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
                }

                await targetActor.createEmbeddedDocuments("ActiveEffect", [{
                  name: "Vector-Overdrive",
                  icon: "icons/skills/melee/strike-bomb-red.webp",
                  origin: this.uuid,
                  duration: { rounds: durationRoundsScaled },
                  description: "Vector-Overdrive: +25% land speed and +25% weapon damage.",
                  changes: [
                    { key: "system.speed.land.value", mode: 2, value: "1.25" },
                    { key: "system.damageBonus.value", mode: 2, value: "25" }
                  ]
                }]);

                boostHTML += `
                  <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">
                    ⚡ <strong>${t.name}</strong> gained speed & weapon damage boosts for ${durationRoundsScaled} rounds!
                  </div>
                `;
              }
              boostHTML += `</div>`;

              await ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: this }),
                content: `
                  <div style="background: rgba(46,204,113,0.05); border: 1px solid rgba(46,204,113,0.25); border-radius: 4px; padding: 10px; font-family: 'Orbitron', sans-serif;">
                    <h3 style="margin:0 0 6px 0; color:#2ecc71; font-size:12px; font-weight:bold; text-transform:uppercase; border-bottom:1px solid rgba(46,204,113,0.15); padding-bottom:4px;">
                      🚀 Vector-Overdrive Pad Deployed 🚀
                    </h3>
                    <p style="margin:0; font-size:11px; color:#cbd5e1;">Boosted land movement speeds and weapon damages for friendly forces.</p>
                    ${boostHTML}
                  </div>
                `
              });
            }
          }
        },
        default: "tether"
      }, {
        classes: ["dialog", "warframe-dialog"]
      }).render(true);
    }



    // Vauban Bastille activation
    if (ability.name.startsWith("Bastille")) {
      const name = ability.name;
      let captureRadius = 15;
      let durationRounds = 2;
      let stripPercent = 10;
      let vortexFormula = "3d10";
      
      if (name.includes("II")) {
        captureRadius = 21;
        durationRounds = 2;
        stripPercent = 15;
        vortexFormula = "4d10";
      } else if (name.includes("III")) {
        captureRadius = 30;
        durationRounds = 3;
        stripPercent = 25;
        vortexFormula = "6d10";
      }

      new Dialog({
        title: "Bastille Mode Select",
        content: `
          <div style="text-align: center; margin-bottom: 10px; font-family: 'Orbitron', sans-serif; font-size: 12px; color: #ccd6f6;">
            Select Bastille deploy mode:
          </div>
        `,
        buttons: {
          erect: {
            icon: '<i class="fas fa-circle-notch"></i>',
            label: "Erect Bastille",
            callback: async () => {
              const sourceToken = canvas.tokens.placeables.find(t => t.actor?.id === this.id);
              if (!sourceToken) return;

              // Trigger manual template placement
              const templateData = {
                t: "circle",
                user: game.user.id,
                distance: captureRadius + rangeBonusFeet,
                direction: 0,
                x: sourceToken.x + canvas.grid.size / 2,
                y: sourceToken.y + canvas.grid.size / 2,
                fillColor: game.user.color || "#00e5ff",
                flags: {
                  "warframe-ttrpg": {
                    abilityName: ability.name,
                    casterId: this.id
                  }
                }
              };
              this.placeTemplate(templateData, ability);
              ui.notifications.info(`Aiming Bastille stasis field. Move mouse to position and click to place.`);
            }
          },
          collapse: {
            icon: '<i class="fas fa-compress-arrows-alt"></i>',
            label: "Collapse Vortex",
            callback: async () => {
              const sourceToken = canvas.tokens.placeables.find(t => t.actor?.id === this.id);
              if (!sourceToken) return;

              // Find active Bastille templates cast by this actor
              const activeTemplates = canvas.scene.templates.filter(t => 
                t.flags?.["warframe-ttrpg"]?.abilityName === ability.name && 
                t.flags?.["warframe-ttrpg"]?.casterId === this.id
              );

              if (activeTemplates.length === 0) {
                ui.notifications.warn("No active Bastille stasis fields found to collapse into a Vortex.");
                return;
              }

              // Use the first active Bastille template
              const targetTemplate = activeTemplates[0];
              const vortexX = targetTemplate.x;
              const vortexY = targetTemplate.y;
              const radiusPixels = (targetTemplate.distance || 0) * (canvas.grid.size / canvas.scene.grid.distance);

              // Find all hostile tokens within the stasis radius of the template center
              const targetsToPull = [];
              for (let token of canvas.tokens.placeables) {
                if (!token.actor) continue;
                const isHostile = token.document.disposition === CONST.TOKEN_DISPOSITIONS?.HOSTILE || token.document.disposition === -1;
                if (!isHostile) continue;

                const tokenX = token.x + (token.document.width || 1) * canvas.grid.size / 2;
                const tokenY = token.y + (token.document.height || 1) * canvas.grid.size / 2;
                const dx = tokenX - vortexX;
                const dy = tokenY - vortexY;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist <= radiusPixels) {
                  targetsToPull.push(token);
                }
              }

              if (targetsToPull.length === 0) {
                ui.notifications.warn("No hostile targets inside the stasis field to pull into the Vortex.");
                // Still delete the template though, since it collapsed
                await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [targetTemplate.id]);
                return;
              }

              const powerStrength = Number(this.system.powerStrength?.value) || 100;
              const powerDuration = Number(this.system.powerDuration?.value) || 100;
              const durationRoundsScaled = Math.round(durationRounds * (powerDuration / 100));

              let collapseHTML = `<div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.4;">`;
              for (let t of targetsToPull) {
                const targetActor = t.actor;

                // Pull target center to vortex center
                const tokenWidth = t.document.width || 1;
                const tokenHeight = t.document.height || 1;
                const targetX = vortexX - (tokenWidth * canvas.grid.size / 2);
                const targetY = vortexY - (tokenHeight * canvas.grid.size / 2);

                await t.document.update({
                  x: targetX,
                  y: targetY
                });

                await targetActor.createEmbeddedDocuments("ActiveEffect", [{
                  name: "Vortex Pull",
                  icon: "icons/magic/control/debuff-energy-hold-blue.webp",
                  origin: this.uuid,
                  duration: { rounds: durationRoundsScaled },
                  description: "Pulled into a damaging gravity vortex.",
                  flags: {
                    "warframe-ttrpg": {
                      vortexFormula: vortexFormula,
                      powerStrength: powerStrength
                    }
                  }
                }]);

                collapseHTML += `
                  <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">
                    🌀 <strong>${t.name}</strong> pulled into the vortex center and caught in gravity stasis!
                  </div>
                `;
              }
              collapseHTML += `</div>`;

              // Delete the stasis template
              await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [targetTemplate.id]);

              await ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor: this }),
                content: `
                  <div style="background: rgba(255, 42, 95, 0.05); border: 1px solid rgba(255, 42, 95, 0.25); border-radius: 4px; padding: 10px; font-family: 'Orbitron', sans-serif;">
                    <h3 style="margin:0 0 6px 0; color:#ff2a5f; font-size:12px; font-weight:bold; text-transform:uppercase; border-bottom:1px solid rgba(255, 42, 95, 0.15); padding-bottom:4px;">
                      🌀 Bastille Vortex Collapsed 🌀
                    </h3>
                    <p style="margin:0; font-size:11px; color:#cbd5e1;">Collapsed Bastilles into a single vortex pulling foes and dealing Magnetic damage.</p>
                    ${collapseHTML}
                  </div>
                `
              });
            }
          }
        },
        default: "erect"
      }, {
        classes: ["dialog", "warframe-dialog"]
      }).render(true);
    }

    // Ash Shuriken activation
    if (ability.name.startsWith("Shuriken")) {
      const name = ability.name;
      let numShurikens = 2;
      let formula = "1d8";
      if (name.includes("II")) {
        numShurikens = 3;
        formula = "2d8";
      } else if (name.includes("III")) {
        numShurikens = 4;
        formula = "3d8";
      } else if (name.includes("IV")) {
        numShurikens = 5;
        formula = "4d8";
      }

      const powerStrength = Number(this.system.powerStrength?.value) || 100;

      let targets = Array.from(game.user.targets);
      if (targets.length === 0 && canvas.tokens) {
        const casterToken = canvas.tokens.placeables.find(t => t.actor?.id === this.id);
        if (casterToken) {
          const maxPixels = 180 * (canvas.grid.size / (canvas.scene?.grid?.distance || 5)) + 5;
          const hostiles = canvas.tokens.placeables.filter(t => 
            t.actor && 
            t.id !== casterToken.id &&
            (t.document.disposition === -1 || t.document.disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE)
          ).map(t => {
            const dx = casterToken.x - t.x;
            const dy = casterToken.y - t.y;
            return { token: t, dist: Math.sqrt(dx*dx + dy*dy) };
          }).filter(item => item.dist <= maxPixels)
            .sort((a, b) => a.dist - b.dist);

          targets = hostiles.slice(0, numShurikens).map(item => item.token);
        }
      }

      if (targets.length > 0) {
        let shurikenHTML = `<div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px;">`;
        let targetIndex = 0;

        for (let i = 0; i < numShurikens; i++) {
          const targetToken = targets[targetIndex];
          targetIndex = (targetIndex + 1) % targets.length;
          const targetActor = targetToken.actor;
          if (!targetActor) continue;

          // Roll the dice and scale with Power Strength
          const rollObj = await new Roll(formula).evaluate({ async: true });
          const rolledDmg = rollObj.total;
          const finalDamage = Math.round(rolledDmg * (powerStrength / 100));

          const currentShields = Number(targetActor.system.shields?.value) || 0;
          const currentHealth = Number(targetActor.system.health?.value) || 0;
          let armorValue = Number(targetActor.system.armor?.value) || 0;

          let dmgToShields = Math.min(currentShields, finalDamage);
          let rawDmgToHealth = finalDamage - dmgToShields;
          let dmgToHealth = rawDmgToHealth;
          if (rawDmgToHealth > 0 && armorValue > 0) {
            dmgToHealth = Math.round(rawDmgToHealth * (100 / (100 + armorValue)));
          }

          const newShields = Math.max(0, currentShields - dmgToShields);
          const newHealth = Math.max(0, currentHealth - dmgToHealth);
          await targetActor.update({
            "system.shields.value": newShields,
            "system.health.value": newHealth
          });

          const slashIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png";
          let effectsToCreate = [{
            name: "Slash (Bleed)",
            icon: slashIcon,
            origin: this.uuid,
            duration: { rounds: 1 },
            statuses: ["slash"],
            description: "Deals Bleed damage over time.",
            flags: {
              core: { statusId: "slash" },
              customDescription: "Deals Bleed damage over time."
            }
          }];

          await targetActor.createEmbeddedDocuments("ActiveEffect", effectsToCreate);

          shurikenHTML += `
            <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              🎯 Shuriken hits <strong>${targetToken.name}</strong> dealing <strong>${finalDamage} Slash damage</strong> (Rolled: ${rolledDmg} on ${formula}).<br/>
              <span style="color: #ccd6f6;">Shields: ${currentShields} ➔ ${newShields} | Health: ${currentHealth} ➔ ${newHealth}</span>
            </div>
          `;
        }

        shurikenHTML += `</div>`;
        abilityDescription += shurikenHTML;
      } else {
        ui.notifications.warn("No targets in range for Shuriken auto-aim.");
      }
    }

    // Ash Smoke Screen activation
    if (ability.name.startsWith("Smoke Screen")) {
      const name = ability.name;
      let baseSeconds = 3;
      if (name.includes("II")) baseSeconds = 6;
      else if (name.includes("III")) baseSeconds = 9;
      else if (name.includes("IV")) baseSeconds = 12;

      const baseRounds = baseSeconds <= 6 ? 1 : 2;
      const powerDuration = Number(this.system.powerDuration?.value) || 100;
      const durationRounds = Math.ceil(baseRounds * (powerDuration / 100));

      const tokens = this.getActiveTokens();
      const casterToken = tokens[0] || canvas.tokens.controlled[0];
      let stunCount = 0;

      if (casterToken && canvas.tokens) {
        const maxPixels = 30 * (canvas.grid.size / (canvas.scene?.grid?.distance || 5)) + 5;
        const nearbyHostiles = canvas.tokens.placeables.filter(t => 
          t.actor && 
          t.id !== casterToken.id &&
          (t.document.disposition === -1 || t.document.disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE)
        ).map(t => {
          const dx = casterToken.x - t.x;
          const dy = casterToken.y - t.y;
          return { token: t, dist: Math.sqrt(dx*dx + dy*dy) };
        }).filter(item => item.dist <= maxPixels);

        for (let item of nearbyHostiles) {
          const targetActor = item.token.actor;
          if (targetActor) {
            await targetActor.createEmbeddedDocuments("ActiveEffect", [{
              name: "Stunned (Smoke Screen)",
              icon: "icons/svg/daze.svg",
              origin: this.uuid,
              duration: { rounds: 1 },
              statuses: ["stunned"],
              description: "Target is incapacitated and cannot move or take actions.",
              flags: {
                core: { statusId: "stunned" },
                customDescription: "Target is incapacitated and cannot move or take actions."
              }
            }]);
            stunCount++;
          }
        }
      }

      const oldInvis = this.effects.filter(e => !e.disabled && (e.statuses?.has("invisible") || e.flags?.core?.statusId === "invisible"));
      if (oldInvis.length > 0) {
        await this.deleteEmbeddedDocuments("ActiveEffect", oldInvis.map(e => e.id));
      }

      const invisDesc = `Invisible: Attacks against Ash have disadvantage, and Ash's attacks have advantage.`;
      await this.createEmbeddedDocuments("ActiveEffect", [{
        name: "Invisible (Smoke Screen)",
        icon: ability.img,
        origin: this.uuid,
        duration: { rounds: durationRounds },
        statuses: ["invisible"],
        description: invisDesc,
        flags: {
          core: { statusId: "invisible" },
          customDescription: invisDesc
        }
      }]);

      abilityDescription += `
        <div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px; color: #a5b4fc;">
          🌫️ Drops a smoke bomb stunning <strong>${stunCount} enemies</strong> in a 10m radius.<br/>
          👤 Ash gains <strong>Invisibility</strong> for <strong>${durationRounds} rounds</strong>.
        </div>
      `;
    }

    // Ash Teleport activation
    if (ability.name.startsWith("Teleport")) {
      const name = ability.name;
      let maxDistMeters = 20;
      let finisherBonus = 1.25;
      let hasDiscount = false;

      if (name.includes("II")) {
        maxDistMeters = 45;
        finisherBonus = 1.50;
      } else if (name.includes("III")) {
        maxDistMeters = 45;
        finisherBonus = 1.75;
        hasDiscount = true;
      } else if (name.includes("IV")) {
        maxDistMeters = 60;
        finisherBonus = 2.00;
        hasDiscount = true;
      }

      const targetToken = game.user.targets.first();
      const casterTokens = this.getActiveTokens();
      const casterToken = casterTokens[0] || canvas.tokens.controlled[0];

      if (targetToken && casterToken) {
        const dx = casterToken.x - targetToken.x;
        const dy = casterToken.y - targetToken.y;
        const distPixels = Math.sqrt(dx*dx + dy*dy);
        const maxPixels = maxDistMeters * 3 * (canvas.grid.size / (canvas.scene?.grid?.distance || 5)) + 5;

        if (distPixels <= maxPixels) {
          await casterToken.document.update({
            x: targetToken.document.x + canvas.grid.size,
            y: targetToken.document.y
          });

          const targetActor = targetToken.actor;
          let isMarked = false;
          if (targetActor) {
            isMarked = targetActor.effects.some(e => e.statuses?.has("bladestorm_mark") || e.flags?.core?.statusId === "bladestorm_mark");
          }

          const hasFatalTeleport = this.items.some(i => i.name.startsWith("Fatal Teleport") || i.id === "ashcaps000000001");
          let energyRefunded = 0;
          let finisherRoll = "";
          let finalDmg = 0;
          let currentHealth = 0;
          let newHealth = 0;

          const meleeWeapon = this.items.find(i => i.type === "weapon" && i.system.equipped && i.system.type === "melee");
          if (meleeWeapon && targetActor) {
            const baseFormula = meleeWeapon.system.damage || "1d6";
            const rollObj = await new Roll(baseFormula).evaluate({ async: true });
            
            let critMult = 1;
            let critLabel = "";
            if (hasFatalTeleport) {
              critMult = 2;
              critLabel = " (CRIT! Fatal Teleport x2)";
            }

            finalDmg = Math.round(rollObj.total * finisherBonus * critMult);

            currentHealth = Number(targetActor.system.health?.value) || 0;
            newHealth = Math.max(0, currentHealth - finalDmg);
            await targetActor.update({ "system.health.value": newHealth });

            if (newHealth === 0) {
              const currentEnergy = Number(this.system.energy?.value) || 0;
              const maxEnergy = Number(this.system.energy?.max) || 100;
              energyRefunded = 12;
              await this.update({ "system.energy.value": Math.min(maxEnergy, currentEnergy + energyRefunded) });
            }

            if (hasFatalTeleport) {
              const slashIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png";
              await targetActor.createEmbeddedDocuments("ActiveEffect", [{
                name: "Slash (Bleed)",
                icon: slashIcon,
                origin: this.uuid,
                duration: { rounds: 1 },
                statuses: ["slash"],
                description: "Deals +50% bonus Bleed damage over time.",
                flags: {
                  core: { statusId: "slash" },
                  "warframe-ttrpg": { 
                    statusId: "slash",
                    isFatalTeleportBleed: true
                  },
                  customDescription: "Deals +50% bonus Bleed damage over time."
                }
              }]);
            }

            finisherRoll = `Roll: <strong>${rollObj.total}</strong> Melee damage ➔ Multiplied to <strong>${finalDmg} Finisher damage</strong>${critLabel} (ignores Shields & Armor).${hasFatalTeleport ? " Applied +50% Bleed status." : ""}`;
          } else {
            finisherRoll = `No equipped melee weapon found to execute finisher.`;
          }

          let discountDescription = "";
          if (hasDiscount && isMarked) {
            const currentEnergy = Number(this.system.energy?.value) || 0;
            const maxEnergy = Number(this.system.energy?.max) || 100;
            await this.update({ "system.energy.value": Math.min(maxEnergy, currentEnergy + 25) });
            discountDescription = `<br/>⚡ <strong>Mark Discount</strong>: Caster was refunded <strong>25 Energy</strong> for teleporting to a Blade Storm target.`;
          }

          abilityDescription += `
            <div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px; color: #a5b4fc;">
              🌌 Teleports adjacent to <strong>${targetToken.name}</strong>.<br/>
              ⚔️ Executes Finisher: ${finisherRoll}<br/>
              <span style="color: #ccd6f6;">Health: ${currentHealth} ➔ ${newHealth}</span>
              ${energyRefunded > 0 ? `<br/>💚 <strong>Finisher Kill</strong>: Refunded <strong>${energyRefunded} Energy</strong>.` : ""}
              ${discountDescription}
            </div>
          `;
        } else {
          ui.notifications.warn("Target is out of teleport range.");
        }
      } else {
        ui.notifications.warn("Requires a target token to Teleport.");
      }
    }

    // Ash Blade Storm activation
    if (ability.name.startsWith("Blade Storm")) {
      const name = ability.name;
      let formula = "3d12";
      if (name.includes("II")) formula = "6d12";
      else if (name.includes("III")) formula = "9d12";
      else if (name.includes("IV")) formula = "12d12";

      const powerStrength = Number(this.system.powerStrength?.value) || 100;

      const isInvisible = this.effects.some(e => !e.disabled && (e.statuses?.has("invisible") || e.flags?.core?.statusId === "invisible"));
      const energyPerMark = isInvisible ? 6 : 12;

      let targets = Array.from(game.user.targets);
      if (targets.length > 0) {
        let totalCost = targets.length * energyPerMark;
        const currentEnergy = Number(this.system.energy?.value) || 0;

        if (currentEnergy < totalCost) {
          ui.notifications.warn(`Not enough energy to mark all targets! (Required: ${totalCost}, Current: ${currentEnergy})`);
          return;
        }

        await this.update({ "system.energy.value": currentEnergy - totalCost });

        let bladeStormHTML = `
          <div style="margin-top: 10px; font-family: 'Inter', sans-serif; font-size: 11px;">
            Spent <strong>${totalCost} Energy</strong> to mark <strong>${targets.length} targets</strong> (${energyPerMark} energy per mark).<br/>
            👥 <strong>Shadow Clones</strong> strike:
        `;

        for (let targetToken of targets) {
          const targetActor = targetToken.actor;
          if (!targetActor) continue;

          // Roll the dice and scale with Power Strength
          const rollObj = await new Roll(formula).evaluate({ async: true });
          const rolledDmg = rollObj.total;
          const finalDamage = Math.round(rolledDmg * (powerStrength / 100));

          const currentHealth = Number(targetActor.system.health?.value) || 0;
          const newHealth = Math.max(0, currentHealth - finalDamage);

          await targetActor.update({
            "system.health.value": newHealth
          });

          const slashIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png";
          await targetActor.createEmbeddedDocuments("ActiveEffect", [
            {
              name: "Blade Storm Mark",
              icon: "icons/skills/melee/strike-slash-pain-red.webp",
              origin: this.uuid,
              duration: { rounds: 1 },
              statuses: ["bladestorm_mark"],
              description: "Target is marked by Blade Storm. Ash Teleport is free.",
              flags: {
                core: { statusId: "bladestorm_mark" },
                customDescription: "Target is marked by Blade Storm. Ash Teleport is free."
              }
            },
            {
              name: "Slash (Bleed)",
              icon: slashIcon,
              origin: this.uuid,
              duration: { rounds: 1 },
              statuses: ["slash"],
              description: "Deals Bleed damage over time.",
              flags: {
                core: { statusId: "slash" },
                customDescription: "Deals Bleed damage over time."
              }
            }
          ]);

          bladeStormHTML += `
            <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              ➔ 💥 Clones strike <strong>${targetToken.name}</strong> for <strong>${finalDamage} True damage</strong> (Rolled: ${rolledDmg} on ${formula}).<br/>
              <span style="color: #ccd6f6;">Health: ${currentHealth} ➔ ${newHealth} | Bleed & Mark Applied</span>
            </div>
          `;
        }

        bladeStormHTML += `</div>`;
        abilityDescription += bladeStormHTML;
      } else {
        ui.notifications.warn("Requires at least one target to launch Blade Storm.");
      }
    }

    // Atlas Landslide activation
    if (ability.name.startsWith("Landslide")) {
      const isRank1 = !ability.name.includes("II") && !ability.name.includes("III");
      const isRank2 = ability.name.includes("II");
      const rank = isRank2 ? 2 : (isRank1 ? 1 : 3);

      const comboState = this.flags?.["warframe-ttrpg"]?.landslideCombo || { hit: 0, ts: 0 };
      const now = Date.now();
      let currentHit = 1;
      if (now - comboState.ts <= 5000) {
        currentHit = (comboState.hit % 3) + 1;
      }
      await this.setFlag("warframe-ttrpg", "landslideCombo", { hit: currentHit, ts: now });

      const baseDice = rank === 1 ? 2 : rank === 2 ? 4 : 6;
      const hitMult = currentHit === 1 ? 1 : currentHit === 2 ? 2 : 4;
      const numDice = baseDice * hitMult;
      const formula = `${numDice}d10`;

      const roll = new Roll(formula);
      await roll.evaluate({async: true});
      const rolledVal = roll.total;

      const powerStrength = Number(this.system.powerStrength?.value) || 100;
      let finalDmg = Math.round(rolledVal * (powerStrength / 100));

      // Capstone check
      const hasCap = this.items.some(i => i.id === "atlascaps0000001" || i.name === "Rubbled Landslide");
      const capActive = hasCap && (Number(this.system.rubble?.value) || 0) >= 1000;
      if (capActive) {
        finalDmg *= 2;
      }

      // Crit Roll
      const rolledCrit = (Math.floor(Math.random() * 100) + 1) <= 35;
      const totalDmg = rolledCrit ? Math.round(finalDmg * 2.0) : finalDmg;

      // Rubble Addition
      let rubbleAdded = 0;
      let targetMsg = "";
      if (game.user.targets.size > 0) {
        const targetToken = game.user.targets.first();
        const isPetrified = targetToken.actor?.effects.some(e => !e.disabled && (e.statuses?.has("petrified") || e.flags?.core?.statusId === "petrified" || e.name === "Petrified"));
        rubbleAdded = isPetrified ? 150 : 75;
        const curRubble = Number(this.system.rubble?.value) || 0;
        await this.update({ "system.rubble.value": Math.min(1500, curRubble + rubbleAdded) });

        if (targetToken.actor) {
          const curHealth = Number(targetToken.actor.system.health?.value) || 0;
          const curShields = Number(targetToken.actor.system.shields?.value) || 0;
          let newHealth = curHealth;
          let newShields = curShields;

          let tempDmg = totalDmg;
          if (newShields >= tempDmg) {
            newShields -= tempDmg;
          } else {
            tempDmg -= newShields;
            newShields = 0;
            newHealth = Math.max(0, newHealth - tempDmg);
          }

          await targetToken.actor.update({
            "system.health.value": newHealth,
            "system.shields.value": newShields
          });

          targetMsg = `
            ➔ Hit <strong>${targetToken.name}</strong>${isPetrified ? " (Petrified Target!)" : ""}, generating <strong>+${rubbleAdded} Rubble</strong>.<br/>
            ➔ Deals <strong>${totalDmg} Impact damage</strong>.<br/>
            <span style="color: #cbd5e1; font-size: 11px;">Shields: ${curShields} ➔ ${newShields} | Health: ${curHealth} ➔ ${newHealth}</span>
          `;
        } else {
          targetMsg = `Hit <strong>${targetToken.name}</strong>${isPetrified ? " (Petrified Target!)" : ""}, generating <strong>+${rubbleAdded} Rubble</strong>.`;
        }
      } else {
        targetMsg = "No target selected. Use a targeted token to gather Rubble and deal damage.";
      }

      // Energy combo refund
      let comboMsg = "";
      if (currentHit > 1) {
        const refundEnergy = currentHit === 2 ? 10 : 15;
        const curEnergy = Number(this.system.energy?.value) || 0;
        const maxEnergy = Number(this.system.energy?.max) || 100;
        await this.update({ "system.energy.value": Math.min(maxEnergy, curEnergy + refundEnergy) });
        comboMsg = `<br/><span style="color: #2ecc71;">Combo Refund: Restored <strong>${refundEnergy} Energy</strong>!</span>`;
      }

      abilityDescription = `
        <div style="background: rgba(229, 152, 102, 0.05); border: 1px solid rgba(229, 152, 102, 0.25); border-radius: 4px; padding: 8px; font-family: 'Inter', sans-serif;">
          <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #e59866; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(229, 152, 102, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
            <span>👊 Landslide Combo: Hit #${currentHit}</span>
            <span>Radius: ${rank === 1 ? (currentHit === 1 ? 4 : currentHit === 2 ? 6 : 8) : rank === 2 ? (currentHit === 1 ? 5 : currentHit === 2 ? 7 : 9) : (currentHit === 1 ? 6 : currentHit === 2 ? 8 : 10)}m</span>
          </div>
          <div style="font-size: 13px; color: #fff; margin-bottom: 6px;">
            Deals <strong style="color: ${rolledCrit ? '#f1c40f' : '#ccd6f6'}; font-size: 14px;">${totalDmg} Impact damage</strong> (Rolled ${rolledVal} on ${formula} with +${powerStrength}% Strength)
            ${rolledCrit ? " <span style='color: #f1c40f; font-weight: bold; font-family: \"Orbitron\", sans-serif;'>💥 CRITICAL HIT (2.0x)!</span>" : ""}
            ${capActive ? " <span style='color: #d35400; font-weight: bold; font-family: \"Orbitron\", sans-serif;'><i class='fas fa-gem'></i> Capstone Double Damage!</span>" : ""}
          </div>
          <div style="font-size: 11px; color: #cbd5e1; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px;">
            ${targetMsg}
            ${comboMsg}
          </div>
        </div>
      `;
    }

    // Atlas Tectonics activation
    if (ability.name.startsWith("Tectonics")) {
      const isRank1 = !ability.name.includes("II") && !ability.name.includes("III");
      const isRank2 = ability.name.includes("II");
      const rank = isRank2 ? 2 : (isRank1 ? 1 : 3);

      const bulwarkHP = rank === 1 ? 1500 : rank === 2 ? 2500 : 4000;
      const rollBase = rank === 1 ? 600 : rank === 2 ? 900 : 1500;
      const explodeBase = rank === 1 ? 250 : rank === 2 ? 300 : 500;
      const explodeRadius = rank === 1 ? 3 : rank === 2 ? 4 : 5;

      new Dialog({
        title: "Tectonics: Bulwark vs Boulder",
        content: `
          <div style="text-align: center; margin-bottom: 10px; font-family: 'Orbitron', sans-serif; font-size: 12px; color: #ccd6f6;">
            Choose Tectonics activation mode:
          </div>
        `,
        buttons: {
          summon: {
            icon: '<i class="fas fa-hammer"></i>',
            label: "Summon Bulwark",
            callback: async () => {
              const cardContent = await renderTemplate("systems/warframe-ttrpg/templates/chat-card.html", {
                actorName: this.name,
                abilityName: ability.name,
                cost: cost,
                description: `
                  <div style="background: rgba(229, 152, 102, 0.05); border: 1px solid rgba(229, 152, 102, 0.25); border-radius: 4px; padding: 8px;">
                    <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #e59866; border-bottom: 1px solid rgba(229, 152, 102, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
                      🧱 Summon bulwark rock-wall
                    </div>
                    <div style="font-size: 11px; color: #cbd5e1;">
                      Summoned a solid stone bulwark with <strong>${bulwarkHP} HP</strong> to block pathways, choke points, or protect teammates.
                    </div>
                  </div>
                `,
                img: ability.img
              });
              await ChatMessage.create({ content: cardContent, speaker: ChatMessage.getSpeaker({ actor: this }) });

              const templateData = {
                t: "ray",
                user: game.user.id,
                distance: 6,
                width: 2,
                direction: 0,
                fillColor: "#e59866",
                flags: {
                  "warframe-ttrpg": {
                    isTectonicsBulwark: true,
                    bulwarkHP: bulwarkHP,
                    actorId: this.id
                  }
                }
              };
              await this.placeTemplate(templateData, ability);
            }
          },
          roll: {
            icon: '<i class="fas fa-bowling-ball"></i>',
            label: "Roll Boulder & Explode",
            callback: async () => {
              const targetTemplate = canvas.scene.templates.find(t => t.flags?.["warframe-ttrpg"]?.isTectonicsBulwark && t.flags?.["warframe-ttrpg"]?.actorId === this.id);
              if (!targetTemplate) {
                ui.notifications.warn("No active Tectonics Bulwark found to roll!");
                return;
              }

              const rollFormula = rank === 1 ? "6d10" : rank === 2 ? "10d10" : "15d10";
              const explodeFormula = rank === 1 ? "3d10" : rank === 2 ? "5d10" : "8d10";

              const rollObj = new Roll(rollFormula);
              await rollObj.evaluate({async: true});

              const explodeObj = new Roll(explodeFormula);
              await explodeObj.evaluate({async: true});

              const powerStrength = Number(this.system.powerStrength?.value) || 100;
              const strengthMult = powerStrength / 100;

              const powerRange = Number(this.system.powerRange?.value) || 100;
              const rangeMult = powerRange / 100;

              // Base roll distance is 15 meters, scaled by range
              const rollDist = 15 * rangeMult;

              // Calculate start position
              const x_start = targetTemplate.x;
              const y_start = targetTemplate.y;

              const executeRoll = async (directionDeg) => {
                const angleRad = directionDeg * Math.PI / 180;
                const pixelsPerMeter = canvas.grid.size / canvas.scene.grid.distance;
                const pixelsDist = rollDist * pixelsPerMeter;

                const x_end = x_start + Math.cos(angleRad) * pixelsDist;
                const y_end = y_start + Math.sin(angleRad) * pixelsDist;

                // Change template to circle at end position
                await targetTemplate.update({
                  t: "circle",
                  distance: explodeRadius,
                  x: x_end,
                  y: y_end,
                  direction: directionDeg,
                  flags: {
                    "warframe-ttrpg": {
                      isTectonicsBulwark: false
                    }
                  }
                });

                // Helper for distance to segment
                const distToSegment = (p, a, b) => {
                  const l2 = (a.x - b.x)**2 + (a.y - b.y)**2;
                  if (l2 === 0) return Math.sqrt((p.x - a.x)**2 + (p.y - a.y)**2);
                  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
                  t = Math.max(0, Math.min(1, t));
                  return Math.sqrt((p.x - (a.x + t * (b.x - a.x)))**2 + (p.y - (a.y + t * (b.y - a.y)))**2);
                };

                let rollingHitsHtml = "";
                let explosionHitsHtml = "";

                const rollPathWidthPixels = 2 * pixelsPerMeter;
                const explodeRadiusPixels = explodeRadius * pixelsPerMeter;

                // Find targets along path and in explosion
                for (let token of canvas.tokens.placeables) {
                  if (token.actor && token.document.disposition <= 0 && token.actor.id !== this.id) {
                    const p = {
                      x: token.x + (token.w || canvas.grid.size) / 2,
                      y: token.y + (token.h || canvas.grid.size) / 2
                    };
                    const tokenRadius = (token.w || canvas.grid.size) / 2;

                    // 1. Check path hit
                    const pathDist = distToSegment(p, { x: x_start, y: y_start }, { x: x_end, y: y_end });
                    const isPathHit = pathDist <= (rollPathWidthPixels + tokenRadius);

                    // 2. Check explosion hit
                    const explodeDist = Math.sqrt((p.x - x_end)**2 + (p.y - y_end)**2);
                    const isExplodeHit = explodeDist <= (explodeRadiusPixels + tokenRadius);

                    if (isPathHit || isExplodeHit) {
                      const isPetrified = token.actor.effects.some(e => !e.disabled && (e.statuses?.has("petrified") || e.flags?.core?.statusId === "petrified" || e.name === "Petrified"));

                      let pathAppliedDmg = 0;
                      let explodeAppliedDmg = 0;

                      const curHealth = Number(token.actor.system.health?.value) || 0;
                      const curShields = Number(token.actor.system.shields?.value) || 0;
                      let newHealth = curHealth;
                      let newShields = curShields;

                      if (isPathHit) {
                        const baseRollVal = isPetrified ? (rollObj.total * 2) : rollObj.total;
                        pathAppliedDmg = Math.round(baseRollVal * strengthMult);
                      }

                      if (isExplodeHit) {
                        explodeAppliedDmg = Math.round(explodeObj.total * strengthMult);
                      }

                      const totalAppliedDmg = pathAppliedDmg + explodeAppliedDmg;
                      let tempDmg = totalAppliedDmg;

                      if (newShields >= tempDmg) {
                        newShields -= tempDmg;
                      } else {
                        tempDmg -= newShields;
                        newShields = 0;
                        newHealth = Math.max(0, newHealth - tempDmg);
                      }

                      await token.actor.update({
                        "system.health.value": newHealth,
                        "system.shields.value": newShields
                      });

                      if (isPathHit) {
                        rollingHitsHtml += `
                          <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            ➔ Boulder crushed <strong>${token.name}</strong>${isPetrified ? " (Petrified!)" : ""} for <strong>${Math.round((isPetrified ? rollObj.total * 2 : rollObj.total) * strengthMult)} Impact damage</strong>.<br/>
                            <span style="color: #cbd5e1; font-size: 11px;">Shields: ${curShields} ➔ ${newShields} | Health: ${curHealth} ➔ ${newHealth}</span>
                          </div>
                        `;
                      }
                      if (isExplodeHit) {
                        explosionHitsHtml += `
                          <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            ➔ Explosion hit <strong>${token.name}</strong> for <strong>${Math.round(explodeObj.total * strengthMult)} Puncture damage</strong>.<br/>
                            <span style="color: #cbd5e1; font-size: 11px;">Shields: ${curShields} ➔ ${newShields} | Health: ${curHealth} ➔ ${newHealth}</span>
                          </div>
                        `;
                      }
                    }
                  }
                }

                const targetMsg = `
                  <div style="font-size: 11px; color: #cbd5e1; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px; margin-top: 6px;">
                    Launched boulder forward **${rollDist.toFixed(1)}m** facing **${directionDeg.toFixed(0)}°**:<br/>
                    ➔ Rolling: <strong>${rollFormula}</strong> Impact damage (Power Strength scaled).<br/>
                    ➔ Explosion: <strong>${explodeFormula}</strong> Puncture damage (Power Strength scaled, **${explodeRadius}m** radius).

                    ${rollingHitsHtml ? `<div style="margin-top: 6px; border-top: 1px solid rgba(229, 152, 102, 0.2); padding-top: 4px; font-weight: bold; color: #e59866;">Rolling boulder hits:</div>${rollingHitsHtml}` : ""}
                    ${explosionHitsHtml ? `<div style="margin-top: 6px; border-top: 1px solid rgba(229, 152, 102, 0.2); padding-top: 4px; font-weight: bold; color: #e59866;">Explosion hits:</div>${explosionHitsHtml}` : ""}
                    ${!rollingHitsHtml && !explosionHitsHtml ? `<br/><span style="color: rgba(255,255,255,0.4);">No hostile targets were caught in the boulder's path.</span>` : ""}
                  </div>
                `;

                const cardContent = await renderTemplate("systems/warframe-ttrpg/templates/chat-card.html", {
                  actorName: this.name,
                  abilityName: ability.name,
                  cost: cost,
                  description: `
                    <div style="background: rgba(229, 152, 102, 0.05); border: 1px solid rgba(229, 152, 102, 0.25); border-radius: 4px; padding: 8px;">
                      <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #e59866; border-bottom: 1px solid rgba(229, 152, 102, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
                        🪨 Tectonics Boulder Roll
                      </div>
                      ${targetMsg}
                    </div>
                  `,
                  img: ability.img
                });
                await ChatMessage.create({ content: cardContent, speaker: ChatMessage.getSpeaker({ actor: this }) });
              };

              const dialog = new Dialog({
                title: "Tectonics Roll Aim",
                content: `
                  <div class="boulder-direction-dialog" style="font-family: 'Orbitron', sans-serif; text-align: center; color: #ccd6f6; padding: 10px;">
                    <div style="margin-bottom: 12px; font-size: 12px; color: #e59866; font-weight: bold;">Select Boulder Roll Direction</div>
                    
                    <div class="dir-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 180px; margin: 0 auto 12px auto;">
                      <button class="dir-btn" data-angle="225" style="background: rgba(229,152,102,0.15); border: 1px solid rgba(229,152,102,0.3); color: #e59866; font-size: 16px; padding: 10px 0; cursor: pointer;">↖️</button>
                      <button class="dir-btn" data-angle="270" style="background: rgba(229,152,102,0.15); border: 1px solid rgba(229,152,102,0.3); color: #e59866; font-size: 16px; padding: 10px 0; cursor: pointer;">⬆️</button>
                      <button class="dir-btn" data-angle="315" style="background: rgba(229,152,102,0.15); border: 1px solid rgba(229,152,102,0.3); color: #e59866; font-size: 16px; padding: 10px 0; cursor: pointer;">↗️</button>
                      
                      <button class="dir-btn" data-angle="180" style="background: rgba(229,152,102,0.15); border: 1px solid rgba(229,152,102,0.3); color: #e59866; font-size: 16px; padding: 10px 0; cursor: pointer;">⬅️</button>
                      <button class="dir-btn" data-angle="target" style="background: rgba(229,152,102,0.35); border: 1px solid rgba(229,152,102,0.6); color: #fff; font-size: 16px; padding: 10px 0; cursor: pointer;" title="Aim Towards Target Token">🎯</button>
                      <button class="dir-btn" data-angle="0" style="background: rgba(229,152,102,0.15); border: 1px solid rgba(229,152,102,0.3); color: #e59866; font-size: 16px; padding: 10px 0; cursor: pointer;">➡️</button>
                      
                      <button class="dir-btn" data-angle="135" style="background: rgba(229,152,102,0.15); border: 1px solid rgba(229,152,102,0.3); color: #e59866; font-size: 16px; padding: 10px 0; cursor: pointer;">↙️</button>
                      <button class="dir-btn" data-angle="90" style="background: rgba(229,152,102,0.15); border: 1px solid rgba(229,152,102,0.3); color: #e59866; font-size: 16px; padding: 10px 0; cursor: pointer;">⬇️</button>
                      <button class="dir-btn" data-angle="45" style="background: rgba(229,152,102,0.15); border: 1px solid rgba(229,152,102,0.3); color: #e59866; font-size: 16px; padding: 10px 0; cursor: pointer;">↘️</button>
                    </div>
                    <div style="font-size: 10px; color: #cbd5e1; line-height: 1.3;">
                      Click 🎯 to roll directly towards your targeted enemy token.
                    </div>
                  </div>
                `,
                buttons: {},
                render: (html) => {
                  html.find(".dir-btn").click(async (event) => {
                    const angleType = event.currentTarget.dataset.angle;
                    dialog.close();
                    if (angleType === "target") {
                      const target = game.user.targets.first();
                      if (!target) {
                        ui.notifications.warn("No target selected! Rolling East by default.");
                        await executeRoll(0);
                      } else {
                        const targetX = target.x + (target.w || canvas.grid.size) / 2;
                        const targetY = target.y + (target.h || canvas.grid.size) / 2;
                        const dy = targetY - y_start;
                        const dx = targetX - x_start;
                        const angleRad = Math.atan2(dy, dx);
                        await executeRoll(angleRad * 180 / Math.PI);
                      }
                    } else {
                      const angle = Number(angleType);
                      await executeRoll(angle);
                    }
                  });
                }
              }, {
                classes: ["warframe-sheet", "direction-selector-popup"],
                width: 240
              });
              dialog.render(true);
            }
          }
        },
        default: "summon"
      }).render(true);
      return;
    }

    // Atlas Petrify activation
    if (ability.name.startsWith("Petrify")) {
      const isRank1 = !ability.name.includes("II") && !ability.name.includes("III");
      const isRank2 = ability.name.includes("II");
      const rank = isRank2 ? 2 : (isRank1 ? 1 : 3);

      const coneLen = rank === 1 ? 14 : rank === 2 ? 18 : 24;
      const vulnPercent = rank === 1 ? 50 : rank === 2 ? 75 : 100;

      const templateData = {
        t: "cone",
        user: game.user.id,
        distance: coneLen,
        angle: 60,
        direction: 0,
        fillColor: "#e59866",
        flags: {
          "warframe-ttrpg": {
            isPetrifyCone: true,
            vulnPercent: vulnPercent,
            actorId: this.id
          }
        }
      };
      await this.placeTemplate(templateData, ability);
      return;
    }

    // Atlas Rumblers activation
    if (ability.name.startsWith("Rumblers")) {
      const isRank1 = !ability.name.includes("II") && !ability.name.includes("III");
      const isRank2 = ability.name.includes("II");
      const rank = isRank2 ? 2 : (isRank1 ? 1 : 3);

      const rumbHP = rank === 1 ? 1200 : rank === 2 ? 2000 : 3000;
      const rumbDmgDice = rank === 1 ? "10d10" : rank === 2 ? "15d10" : "20d10";
      const rockDmgDice = rank === 1 ? "5d10" : rank === 2 ? "8d10" : "12d10";

      let targetMsg = "";
      if (game.user.targets.size > 0) {
        const targetTokens = Array.from(game.user.targets);
        for (let targetToken of targetTokens) {
          const targetActor = targetToken.actor;
          if (targetActor) {
            // Apply Petrified Active Effect
            const effectData = {
              name: "Petrified",
              icon: ability.img || "icons/magic/earth/golem-stone-yellow.webp",
              origin: this.uuid,
              statuses: ["incapacitated", "petrified"],
              flags: {
                core: { statusId: "petrified" },
                "warframe-ttrpg": {
                  damageVuln: 50
                }
              },
              duration: { rounds: 2 }
            };
            await targetActor.createEmbeddedDocuments("ActiveEffect", [effectData]);
            targetMsg += `<br/>➔ Spawn petrified <strong>${targetToken.name}</strong> (Incapacitated, 2 rounds).`;
          }
        }
      }

      // Create Rumbler actor with owner-only access for GM and invoker
      const rumblerActor = await Actor.create({
        name: `${this.name}'s Rumbler`,
        type: "adversary",
        img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/Rumblers.webp",
        system: {
          health: {
            value: rumbHP,
            max: rumbHP
          },
          shields: {
            value: 0,
            max: 0
          },
          armor: {
            value: 500
          },
          details: {
            description: `An elemental stone brawler summoned by ${this.name}. Collapses into +150 Rubble when destroyed or when the duration (45s) expires.`,
            attacks: `👊 Melee Strike: ${rumbDmgDice} Impact damage\n🪨 Rock Throw: ${rockDmgDice} Impact damage`
          }
        },
        ownership: {
          default: 0,
          [game.user.id]: 3
        },
        prototypeToken: {
          name: `${this.name}'s Rumbler`,
          texture: {
            src: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/Rumbler token.png"
          },
          disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
          actorLink: true
        }
      });

      // Find Atlas token and spawn Left and Right Rumblers
      const casterToken = canvas.tokens.placeables.find(t => t.actor?.id === this.id && t.document.actorLink) || canvas.tokens.controlled[0] || canvas.tokens.placeables.find(t => t.actor?.id === this.id);
      const gridSize = canvas.grid?.size || canvas.scene?.grid?.size || 100;
      if (casterToken) {
        const x_start = casterToken.document?.x ?? casterToken.x;
        const y_start = casterToken.document?.y ?? casterToken.y;

        const tokenDataLeft = await rumblerActor.getTokenDocument({
          x: x_start - gridSize,
          y: y_start,
          name: "Rumbler (Left)"
        });
        const tokenDataRight = await rumblerActor.getTokenDocument({
          x: x_start + gridSize,
          y: y_start,
          name: "Rumbler (Right)"
        });
        await canvas.scene.createEmbeddedDocuments("Token", [tokenDataLeft.toObject(), tokenDataRight.toObject()]);
      }

      // Render the actor's sheet for the invoker / GM
      rumblerActor.sheet.render(true);

      abilityDescription = `
        <div style="background: rgba(229, 152, 102, 0.05); border: 1px solid rgba(229, 152, 102, 0.25); border-radius: 4px; padding: 8px;">
          <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #e59866; border-bottom: 1px solid rgba(229, 152, 102, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
            🪨 Summon Rumblers
          </div>
          <div style="font-size: 11px; color: #cbd5e1;">
            Summoned two massive elemental stone brawlers to fight beside Atlas for 45s (character sheets created & opened!):<br/>
            ➔ HP: <strong>${rumbHP}</strong>.<br/>
            ➔ Melee Strike: <strong>${rumbDmgDice} Impact damage</strong>.<br/>
            ➔ Rock Throw: <strong>${rockDmgDice} Impact damage</strong>.<br/>
            ➔ Collapse: Rumblers collapse into a pile of Rubble (+150 Rubble on death/finish).
            ${targetMsg ? `<div style="margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px;">${targetMsg}</div>` : ""}
          </div>
        </div>
      `;
    }

    // ==========================================
    // URIEL ABILITIES AUTOMATION
    // ==========================================

    // Helper: Spawn / Manage Legion Demon
    const spawnOrUpdateDemon = async (demonKey, demonName, demonAtk, demonIcon) => {
      await this.update({
        [`system.legion.${demonKey}.active`]: true,
        [`system.legion.${demonKey}.health`]: Math.max(Number(this.system.legion?.[demonKey]?.health) || 0, 150)
      });

      const fullName = `${this.name}'s ${demonName}`;
      let demonActor = game.actors.find(a => a.name === fullName && a.type === "adversary");
      if (!demonActor) {
        demonActor = await Actor.create({
          name: fullName,
          type: "adversary",
          img: demonIcon,
          system: {
            health: { value: 150, max: 150 },
            shields: { value: 0, max: 0 },
            armor: { value: 100 },
            details: {
              description: `A fiendish flying summon of the Legion commanded by ${this.name}.`,
              attacks: demonAtk
            }
          },
          ownership: {
            default: 0,
            [game.user.id]: 3
          },
          prototypeToken: {
            name: fullName,
            texture: { src: demonIcon },
            disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
            actorLink: true
          }
        });
      }

      const existingToken = canvas.tokens.placeables.find(t => t.actor?.id === demonActor.id);
      if (!existingToken && canvas.scene) {
        const casterToken = canvas.tokens.placeables.find(t => t.actor?.id === this.id && t.document.actorLink) || canvas.tokens.controlled[0] || canvas.tokens.placeables.find(t => t.actor?.id === this.id);
        const gridSize = canvas.grid?.size || canvas.scene?.grid?.size || 100;
        if (casterToken) {
          const x_start = casterToken.document?.x ?? casterToken.x;
          const y_start = casterToken.document?.y ?? casterToken.y;
          let xOffset = 0;
          let yOffset = -gridSize;
          if (demonKey === "gulphagor") { xOffset = -gridSize; yOffset = gridSize; }
          else if (demonKey === "vythelas") { xOffset = gridSize; yOffset = gridSize; }

          const tokenData = await demonActor.getTokenDocument({
            x: x_start + xOffset,
            y: y_start + yOffset,
            name: fullName
          });
          await canvas.scene.createEmbeddedDocuments("Token", [tokenData.toObject()]);
        }
      }

      return demonActor;
    };

    // 1. INFERNALIS
    if (ability.name.startsWith("Infernalis")) {
      const isRank1 = !ability.name.includes("II") && !ability.name.includes("III");
      const isRank2 = ability.name.includes("II");
      const rank = isRank2 ? 2 : (isRank1 ? 1 : 3);

      const baseRadius = rank === 1 ? 15 : (rank === 2 ? 20 : 25);
      const scaledRadius = Math.round(baseRadius * (powerRange / 100));
      const dmgFormula = rank === 1 ? "2d6" : (rank === 2 ? "3d6" : "4d6");

      await spawnOrUpdateDemon(
        "catenach",
        "Catenach",
        "🔗 Spectral Chain: 2d8 damage\n☠️ Bone Spikes: 2d6 Puncture",
        "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-InfernalisIcon(xWhite).webp"
      );

      const dmgRoll = new Roll(dmgFormula);
      await dmgRoll.evaluate({ async: true });
      await dmgRoll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        flavor: `${this.name} rolls Infernalis hellfire damage (${dmgFormula})`
      });

      const totalDmg = Math.round(dmgRoll.total * (powerStrength / 100));
      let targetMsg = "";

      if (game.user.targets.size > 0) {
        for (let targetToken of game.user.targets) {
          const targetActor = targetToken.actor;
          if (!targetActor) continue;

          let finalDmg = totalDmg;
          const vulnEffect = targetActor.effects?.find(e => !e.disabled && (
            e.statuses?.has("petrified") ||
            e.statuses?.has("vulnerable") ||
            e.flags?.core?.statusId === "petrified" ||
            e.flags?.["warframe-ttrpg"]?.damageVuln != null ||
            e.name === "Petrified" ||
            e.name === "Damage Vulnerability"
          ));
          let vulnExtra = "";
          if (vulnEffect) {
            const vulnPct = Number(vulnEffect.flags?.["warframe-ttrpg"]?.damageVuln) || 50;
            const vulnBonus = Math.round(finalDmg * (vulnPct / 100));
            finalDmg += vulnBonus;
            vulnExtra = ` (+${vulnPct}% Vulnerability)`;
          }

          let curHealth = Number(targetActor.system.health?.value) || 0;
          let curShields = Number(targetActor.system.shields?.value) || 0;
          let newShields = curShields;
          let newHealth = curHealth;

          if (newShields >= finalDmg) {
            newShields -= finalDmg;
          } else {
            let remain = finalDmg - newShields;
            newShields = 0;
            newHealth = Math.max(0, newHealth - remain);
          }

          await targetActor.update({
            "system.health.value": newHealth,
            "system.shields.value": newShields
          });

          const hasHeat = targetActor.effects?.some(e => e.statuses?.has("heat") || e.name === "Heat");
          if (!hasHeat) {
            await targetActor.createEmbeddedDocuments("ActiveEffect", [{
              name: "Heat",
              icon: "systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png",
              origin: this.uuid,
              statuses: ["heat"],
              duration: { rounds: 3 }
            }]);
          }

          targetMsg += `<br/>➔ Blazed <strong>${targetToken.name}</strong> for <strong>${finalDmg} Heat damage</strong>${vulnExtra} & inflicted Burning (Heat status).`;
        }
      }

      abilityDescription = `
        <div style="background: rgba(231, 76, 60, 0.05); border: 1px solid rgba(231, 76, 60, 0.25); border-radius: 4px; padding: 8px;">
          <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #ff5e3a; border-bottom: 1px solid rgba(231, 76, 60, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
            🔥 Infernalis (Rank ${rank})
          </div>
          <div style="font-size: 11px; color: #cbd5e1;">
            Uriel unleashes a <strong>${scaledRadius} ft</strong> aura of searing hellfire dealing <strong>${totalDmg} Heat damage</strong>.<br/>
            ➔ <strong>Catenach</strong> manifested and active with full HP (150).<br/>
            ➔ Active demons ignited in fire spheres (+25% attack damage).
            ${targetMsg ? `<div style="margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px;">${targetMsg}</div>` : ""}
          </div>
        </div>
      `;
    }

    // 2. REMEDIUM
    if (ability.name.startsWith("Remedium")) {
      const isRank1 = !ability.name.includes("II") && !ability.name.includes("III");
      const isRank2 = ability.name.includes("II");
      const rank = isRank2 ? 2 : (isRank1 ? 1 : 3);

      const baseHeal = rank === 1 ? 50 : (rank === 2 ? 100 : 150);
      const scaledHeal = Math.round(baseHeal * (powerStrength / 100));

      const curHP = Number(this.system.health?.value) || 0;
      const maxHP = Number(this.system.health?.max) || 350;
      const newHP = Math.min(maxHP, curHP + scaledHeal);

      await this.update({
        "system.health.value": newHP,
        "system.legion.catenach.active": true,
        "system.legion.catenach.health": 150,
        "system.legion.gulphagor.active": true,
        "system.legion.gulphagor.health": 150,
        "system.legion.vythelas.active": true,
        "system.legion.vythelas.health": 150
      });

      await spawnOrUpdateDemon(
        "gulphagor",
        "Gulphagor",
        "🦅 Fiendish Latch: 3d8 Slash\n🔥 Circle of Pain: 3d6 Heat",
        "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-RemediumIcon(xWhite).webp"
      );

      abilityDescription = `
        <div style="background: rgba(46, 204, 113, 0.05); border: 1px solid rgba(46, 204, 113, 0.25); border-radius: 4px; padding: 8px;">
          <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #2ecc71; border-bottom: 1px solid rgba(46, 204, 113, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
            💚 Remedium (Rank ${rank})
          </div>
          <div style="font-size: 11px; color: #cbd5e1;">
            Occult light restores <strong>+${scaledHeal} HP</strong> to ${this.name} (Current: ${newHP}/${maxHP} HP).<br/>
            ➔ <strong>The Legion Resurrected</strong>: Catenach, Gulphagor, and Vythelas are fully restored to <strong>150 HP</strong> and active!<br/>
            ➔ <strong>Gulphagor</strong> takes flight to hound Uriel's enemies.
          </div>
        </div>
      `;
    }

    // 3. DEMONIUM
    if (ability.name.startsWith("Demonium")) {
      const isRank1 = !ability.name.includes("II") && !ability.name.includes("III");
      const isRank2 = ability.name.includes("II");
      const rank = isRank2 ? 2 : (isRank1 ? 1 : 3);

      const dmgFormula = rank === 1 ? "3d8" : (rank === 2 ? "5d8" : "7d8");
      const furyPerDemon = rank === 1 ? 15 : (rank === 2 ? 20 : 25);

      await spawnOrUpdateDemon(
        "vythelas",
        "Vythelas",
        "✨ Demonium Ritual: 0 damage\n⚡ Impish Sting: 1d8 Void",
        "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-DemoniumIcon(xWhite).webp"
      );

      let drainedCount = 0;
      const demons = ["catenach", "gulphagor", "vythelas"];
      const updateObj = {};

      for (let d of demons) {
        const demonData = this.system.legion?.[d];
        if (demonData && demonData.active && Number(demonData.health) > 0) {
          drainedCount++;
          const curDemonHP = Number(demonData.health) || 150;
          updateObj[`system.legion.${d}.health`] = Math.max(1, curDemonHP - 15);
        }
      }

      if (drainedCount === 0) {
        drainedCount = 1;
        updateObj["system.legion.vythelas.health"] = 135;
      }

      const furyGained = drainedCount * furyPerDemon;
      const curBrimstone = Number(this.system.brimstone?.value) || 0;
      const newBrimstone = Math.min(100, curBrimstone + furyGained);
      updateObj["system.brimstone.value"] = newBrimstone;

      await this.update(updateObj);

      const soulRoll = new Roll(dmgFormula);
      await soulRoll.evaluate({ async: true });
      await soulRoll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        flavor: `${this.name} rolls Demonium soul damage (${dmgFormula})`
      });

      const totalDmg = Math.round(soulRoll.total * (powerStrength / 100));
      let targetMsg = "";

      if (game.user.targets.size > 0) {
        for (let targetToken of game.user.targets) {
          const targetActor = targetToken.actor;
          if (!targetActor) continue;

          let curHealth = Number(targetActor.system.health?.value) || 0;
          let curShields = Number(targetActor.system.shields?.value) || 0;
          let newShields = curShields;
          let newHealth = curHealth;

          if (newShields >= totalDmg) {
            newShields -= totalDmg;
          } else {
            let remain = totalDmg - newShields;
            newShields = 0;
            newHealth = Math.max(0, newHealth - remain);
          }

          await targetActor.update({
            "system.health.value": newHealth,
            "system.shields.value": newShields
          });

          await targetActor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Damage Vulnerability",
            icon: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-DemoniumIcon(xWhite).webp",
            origin: this.uuid,
            statuses: ["vulnerable"],
            duration: { rounds: 2 },
            description: "+50% incoming damage from all sources.",
            flags: {
              "warframe-ttrpg": {
                damageVuln: 50,
                casterId: this.id
              }
            }
          }]);

          targetMsg += `<br/>➔ Exploded on <strong>${targetToken.name}</strong> for <strong>${totalDmg} Void/Heat damage</strong> & cursed with <strong>+50% Damage Vulnerability</strong> (2 rounds).`;
        }
      }

      abilityDescription = `
        <div style="background: rgba(155, 89, 182, 0.05); border: 1px solid rgba(155, 89, 182, 0.25); border-radius: 4px; padding: 8px;">
          <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #9b59b6; border-bottom: 1px solid rgba(155, 89, 182, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
            🔮 Demonium (Rank ${rank})
          </div>
          <div style="font-size: 11px; color: #cbd5e1;">
            Drained 15 HP from <strong>${drainedCount} living demon(s)</strong> to fire homing souls dealing <strong>${totalDmg} Void/Heat damage</strong>.<br/>
            ➔ <strong>Brimstone Fury</strong>: Gained <strong>+${furyGained}% Fury</strong> (Current: ${newBrimstone}%).<br/>
            ➔ <strong>Vythelas</strong> active and harvesting Demonium Runes.
            ${targetMsg ? `<div style="margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px;">${targetMsg}</div>` : ""}
          </div>
        </div>
      `;
    }

    // 4. BRIMSTONE
    if (ability.name.startsWith("Brimstone")) {
      const isRank1 = !ability.name.includes("II") && !ability.name.includes("III");
      const isRank2 = ability.name.includes("II");
      const rank = isRank2 ? 2 : (isRank1 ? 1 : 3);

      const baseRadius = rank === 1 ? 30 : (rank === 2 ? 45 : 60);
      const scaledRadius = Math.round(baseRadius * (powerRange / 100));
      const dmgFormula = rank === 1 ? "4d12" : (rank === 2 ? "8d12" : "12d12");

      const hasCapstone = this.items.some(i => i.name === "Hellgate of Xata" || i.id === "urielcaps0000001");
      const capstoneMult = hasCapstone ? 1.5 : 1.0;

      const dmgRoll = new Roll(dmgFormula);
      await dmgRoll.evaluate({ async: true });
      await dmgRoll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        flavor: `${this.name} rolls Brimstone apocalyptic hellfire damage (${dmgFormula})`
      });

      let totalDmg = Math.round(dmgRoll.total * (powerStrength / 100) * capstoneMult);
      let targetMsg = "";

      if (game.user.targets.size > 0) {
        for (let targetToken of game.user.targets) {
          const targetActor = targetToken.actor;
          if (!targetActor) continue;

          let finalDmg = totalDmg;
          const vulnEffect = targetActor.effects?.find(e => !e.disabled && (
            e.statuses?.has("petrified") ||
            e.statuses?.has("vulnerable") ||
            e.flags?.core?.statusId === "petrified" ||
            e.flags?.["warframe-ttrpg"]?.damageVuln != null ||
            e.name === "Petrified" ||
            e.name === "Damage Vulnerability"
          ));
          let vulnExtra = "";
          if (vulnEffect) {
            const vulnPct = Number(vulnEffect.flags?.["warframe-ttrpg"]?.damageVuln) || 50;
            const vulnBonus = Math.round(finalDmg * (vulnPct / 100));
            finalDmg += vulnBonus;
            vulnExtra = ` (+${vulnPct}% Vulnerability)`;
          }

          let curHealth = Number(targetActor.system.health?.value) || 0;
          let curShields = Number(targetActor.system.shields?.value) || 0;
          let newShields = curShields;
          let newHealth = curHealth;

          if (newShields >= finalDmg) {
            newShields -= finalDmg;
          } else {
            let remain = finalDmg - newShields;
            newShields = 0;
            newHealth = Math.max(0, newHealth - remain);
          }

          await targetActor.update({
            "system.health.value": newHealth,
            "system.shields.value": newShields
          });

          await targetActor.createEmbeddedDocuments("ActiveEffect", [
            {
              name: "Heat",
              icon: "systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png",
              origin: this.uuid,
              statuses: ["heat"],
              duration: { rounds: 3 }
            },
            {
              name: "Knocked Down",
              icon: "icons/svg/falling.svg",
              origin: this.uuid,
              statuses: ["prone"],
              duration: { rounds: 1 }
            }
          ]);

          targetMsg += `<br/>💥 Annihilated <strong>${targetToken.name}</strong> for <strong>${finalDmg} Heat damage</strong>${vulnExtra}, set ablaze and knocked prone!`;
        }
      }

      abilityDescription = `
        <div style="background: rgba(183, 21, 64, 0.08); border: 1px solid rgba(235, 47, 6, 0.4); border-radius: 4px; padding: 10px; box-shadow: 0 0 10px rgba(235, 47, 6, 0.2);">
          <div style="font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: bold; color: #ff3838; border-bottom: 1px solid rgba(235, 47, 6, 0.3); padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            🌋 Brimstone Cataclysm (Rank ${rank})
          </div>
          <div style="font-size: 11px; color: #cbd5e1;">
            Uriel releases the full fury of the underworld in an expanding ring of <strong>${scaledRadius} ft</strong> radius, dealing <strong>${totalDmg} Heat damage</strong>!
            ${hasCapstone ? `<div style="color: #ffd700; font-weight: bold; margin: 4px 0;"><i class="fas fa-crown"></i> Hellgate of Xata: +50% Heat damage empowered by the full demonic triad!</div>` : ""}
            <br/>➔ Brimstone Fury completely consumed (reset to 0%).
            <br/>➔ 100% Heat status proc (Ignited) & Knockdown inflicted on all victims!
            ${targetMsg ? `<div style="margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px;">${targetMsg}</div>` : ""}
          </div>
        </div>
      `;
    }

    const cardContent = await renderTemplate("systems/warframe-ttrpg/templates/chat-card.html", {
      actorName: this.name,
      abilityName: ability.name,
      cost: cost,
      description: abilityDescription,
      img: ability.img,
      isFatesCast: isFatesCast,
      fatesRolls: fatesRolls,
      fatesTotal: fatesTotal,
      isShadowTrinity: isShadowTrinity,
      rollFormula: rollFormula,
      damageType: damageType,
      damageColor: damageColor,
      damageIcon: damageIcon,
      actionType: actionType,
      actionBadge: actionBadge,
      actionColor: actionColor,
      actionIcon: actionIcon,
      hasSaveDC: hasSaveDC,
      healFormula: healFormula,
      durationFormatted: durationFormatted,
      actionSummary: actionSummary,
      powerDC: powerDC,
      powerStrength: powerStrength,
      strengthBonus: strengthBonus,
      strengthBonusFormatted: strengthBonus > 0 ? `+${strengthBonus}` : (strengthBonus < 0 ? `${strengthBonus}` : "+0"),
      abilitySlot: ability.system.abilitySlot || "Power",
      isPassive: isPassiveSlot
    });

    const enrichedContent = await TextEditor.enrichHTML(cardContent, { async: true });

    await ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: enrichedContent
    });
    } catch (err) {
      console.error("Error in castAbility:", err);
      ui.notifications.error(`Error casting ability: ${err.message}`);
    }
  }

  /**
   * Roll a skill or saving throw
   * @param {string} type 'skill' or 'save'
   * @param {string} key e.g., 'athletics', 'physique'
   */
  async rollCheck(type, key) {
    let label = "";
    let mod = 0;
    const level = Number(this.system.details?.level?.value) || 1;
    const profBonus = Math.floor((level - 1) / 4) + 2;

    if (type === "save") {
      const save = this.system.saves[key];
      if (!save) return;
      label = `Jet de Sauvegarde : ${save.label}`;
      
      const attrVal = this.system.attributes[save.attr]?.value || 10;
      const attrMod = Math.floor((attrVal - 10) / 2);
      
      const profLevel = save.profLevel || (save.proficient ? (save.profLevel === 2 ? 2 : 1) : 0);
      const profMultiplier = profLevel === 2 ? 2 : (profLevel === 1 ? 1 : 0);
      mod = attrMod + (profMultiplier * profBonus);
    } else if (type === "skill") {
      const skill = this.system.skills[key];
      if (!skill) return;
      label = `Test de Compétence : ${skill.label}`;
      
      const attrVal = this.system.attributes[skill.attr]?.value || 10;
      const attrMod = Math.floor((attrVal - 10) / 2);
      
      let profLevel = 0;
      if (skill.value === true || skill.value === 1) {
        profLevel = 1;
      } else if (skill.value === 2 || skill.value === "expertise") {
        profLevel = 2;
      }
      
      if (this.system.traitsSkills && this.system.traitsSkills.includes(key)) {
        profLevel = Math.max(profLevel, 1);
      }
      
      const profMultiplier = profLevel === 2 ? 2 : (profLevel === 1 ? 1 : 0);
      mod = attrMod + (profMultiplier * profBonus);
      
      if (key === "stealth" && this.system.stealthBonus) {
        mod += Number(this.system.stealthBonus.value) || 0;
      }
      if (key === "acrobatics" && this.items.some(i => i.name === "Parkour Proficiency I")) {
        mod += 5; // Acrobatics expertise/bonus
      }
      if (key === "athletics" && this.items.some(i => i.name === "Parkour Proficiency II")) {
        mod += 5; // Athletics expertise/bonus
      }
    }

    const roll = new Roll(`1d20 + @mod`, { mod: mod });
    await roll.evaluate();

    let flavor = `${this.name} lance un ${label}`;
    if (type === "save" && key === "physique" && this.system.details?.frameClass === "Atlas") {
      flavor += `<div style="font-size: 11px; color: #ffaa00; margin-top: 4px; border-top: 1px solid rgba(255, 170, 0, 0.2); padding-top: 4px; font-weight: bold;"><i class="fas fa-shield-alt"></i> Immovable Rock: Immune to Knockdown effects while on the ground.</div>`;
    }

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: flavor
    });
  }

  async rollAttribute(attribute) {
    const attr = this.system.attributes[attribute];
    if (!attr) return;
    const score = Number(attr.value) || 10;
    const attrMod = Math.floor((score - 10) / 2);
    
    const roll = new Roll(`1d20 + @mod`, { mod: attrMod });
    await roll.evaluate();
    
    const flavor = `${this.name} lance un Test de ${attr.label || attribute.capitalize()}`;
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: flavor
    });
  }

  async rollSave(saveKey) {
    return this.rollCheck("save", saveKey);
  }

  async rollSkill(skillKey) {
    return this.rollCheck("skill", skillKey);
  }

  /**
   * Consomme une ressource d'action de combat (Action 1, Action 2, Parkour, Réaction)
   * et actualise instantanément les indicateurs du HUD et la fiche de personnage.
   */
  async consumeCombatAction(actionType = "action") {
    let combatActions = this.getFlag("warframe-ttrpg", "combatActions");
    if (!combatActions || typeof combatActions !== "object" || combatActions.action1 === undefined) {
      combatActions = { parkour: true, action1: true, action2: true, reaction: true };
    }

    let modified = false;

    if (actionType === "action" || actionType === "major") {
      // Consomme Action 1 si disponible, sinon Action 2
      if (combatActions.action1 !== false) {
        combatActions = { ...combatActions, action1: false };
        modified = true;
      } else if (combatActions.action2 !== false) {
        combatActions = { ...combatActions, action2: false };
        modified = true;
      } else {
        ui.notifications?.warn(`${this.name} n'a plus d'Action Majeure disponible pour ce tour !`);
      }
    } else if (actionType === "action1") {
      if (combatActions.action1 !== false) {
        combatActions = { ...combatActions, action1: false };
        modified = true;
      }
    } else if (actionType === "action2") {
      if (combatActions.action2 !== false) {
        combatActions = { ...combatActions, action2: false };
        modified = true;
      }
    } else if (actionType === "parkour" || actionType === "movement") {
      if (combatActions.parkour !== false) {
        combatActions = { ...combatActions, parkour: false };
        modified = true;
      }
    } else if (actionType === "reaction") {
      if (combatActions.reaction !== false) {
        combatActions = { ...combatActions, reaction: false };
        modified = true;
      }
    } else if (actionType === "bonus") {
      // Rétrocompatibilité : tente de consommer parkour d'abord, sinon une action majeure
      if (combatActions.parkour !== false) {
        combatActions = { ...combatActions, parkour: false };
        modified = true;
      } else if (combatActions.action1 !== false) {
        combatActions = { ...combatActions, action1: false };
        modified = true;
      } else if (combatActions.action2 !== false) {
        combatActions = { ...combatActions, action2: false };
        modified = true;
      }
    }

    if (modified) {
      await this.setFlag("warframe-ttrpg", "combatActions", combatActions);
      if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.id) {
        globalThis.warframeTTRPG.WarframeHUD.render(this, globalThis.warframeTTRPG.WarframeHUD.currentToken);
      }
      if (this.sheet?.rendered) {
        this.sheet.render(false);
      }
    }
  }

  /**
   * Réinitialise toutes les actions de combat (2 Actions Majeures, 1 Parkour, 1 Réaction)
   */
  async resetCombatActions() {
    const freshActions = { parkour: true, action1: true, action2: true, reaction: true };
    await this.setFlag("warframe-ttrpg", "combatActions", freshActions);
    if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.id) {
      globalThis.warframeTTRPG.WarframeHUD.render(this, globalThis.warframeTTRPG.WarframeHUD.currentToken);
    }
    if (this.sheet?.rendered) {
      this.sheet.render(false);
    }
    return freshActions;
  }

  /**
   * Recharge une arme à distance équipée ou possédant un chargeur.
   * Consomme 1 Action Majeure sauf si options.isFree = true (ex: Glissade Tactique).
   */
  async reloadWeapon(weaponId, options = {}) {
    const weapon = this.items.get(weaponId);
    if (!weapon) {
      ui.notifications?.warn("Arme introuvable.");
      return;
    }
    const isVinquibus = (weapon.name || "").toLowerCase().includes("vinquibus") || (weapon.name || "").toLowerCase().includes("vinquidibus");
    const maxMag = Number(weapon.system.magazine?.max) || (isVinquibus ? 16 : 0);
    if (maxMag <= 0) {
      ui.notifications?.info(`${weapon.name} n'utilise pas de chargeur.`);
      return;
    }
    const curMag = Number(weapon.system.magazine?.value) ?? 0;
    if (curMag >= maxMag && !options.force) {
      ui.notifications?.info(`Le chargeur de ${weapon.name} est déjà plein (${curMag}/${maxMag}).`);
      return;
    }

    // Consomme 1 Action Majeure si non gratuit
    if (!options.isFree) {
      await this.consumeCombatAction("action");
    }

    await weapon.update({ 
      "system.magazine.max": maxMag,
      "system.magazine.value": maxMag 
    });

    // Rafraîchir HUD et Fiche
    if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.id) {
      globalThis.warframeTTRPG.WarframeHUD.render(this, globalThis.warframeTTRPG.WarframeHUD.currentToken);
    }
    if (this.sheet?.rendered) {
      this.sheet.render(false);
    }

    const reasonTag = options.isFree
      ? `<span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.4); padding: 2px 6px; border-radius: 4px; font-weight: bold;"><i class="fas fa-skating"></i> Glissade Tactique : Rechargement Gratuit</span>`
      : `<span style="background: rgba(0, 229, 255, 0.15); color: #00e5ff; border: 1px solid rgba(0, 229, 255, 0.4); padding: 2px 6px; border-radius: 4px; font-weight: bold;"><i class="fas fa-bolt"></i> 1 Action Majeure Dépensée</span>`;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `
        <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(0, 229, 255, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(0,229,255,0.2);">
          <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
            <img src="${weapon.img}" width="28" height="28" style="border: 1px solid rgba(0,229,255,0.4); border-radius: 4px; object-fit: contain;" />
            <div>
              <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #00e5ff; font-size: 13px;">Rechargement : ${weapon.name}</h4>
              <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Chargeur Restauré : ${maxMag} / ${maxMag}</span>
            </div>
          </div>
          <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
            <strong>${this.name}</strong> réarme et réapprovisionne le chargeur de son <strong>${weapon.name}</strong> (${curMag} ➔ <strong>${maxMag}</strong> munitions).
          </p>
          <div style="margin-top: 8px; font-size: 11px;">
            ${reasonTag}
          </div>
        </div>
      `
    });
  }

  /**
   * Bascule le mode d'une arme convertible (ex: Vinquibus Mêlée <-> Distance/Fusil).
   * @param {string} weaponId - ID de l'arme
   * @returns {Promise<void>}
   */
  async swapWeaponMode(weaponId) {
    const weapon = this.items.get(weaponId);
    if (!weapon) {
      ui.notifications?.warn("Arme introuvable.");
      return;
    }

    const isVinquibus = (weapon.name || "").toLowerCase().includes("vinquibus") || (weapon.name || "").toLowerCase().includes("vinquidibus");
    const currentMode = weapon.system.currentMode || (weapon.system.type === "melee" ? "melee" : "rifle");
    const newMode = currentMode === "melee" ? "rifle" : "melee";
    const modes = weapon.system.modes || {};
    const modeData = modes[newMode];

    const updates = {
      "system.currentMode": newMode
    };

    if (isVinquibus && (!weapon.system.magazine?.max || weapon.system.magazine?.max <= 0)) {
      updates["system.magazine.max"] = 16;
      updates["system.magazine.value"] = weapon.system.magazine?.value ?? 16;
    }

    if (modeData) {
      if (modeData.type) updates["system.type"] = modeData.type;
      if (modeData.subtype) updates["system.subtype"] = modeData.subtype;
      if (modeData.damage) updates["system.damage"] = modeData.damage;
      if (modeData.damageType) updates["system.damageType"] = modeData.damageType;
      if (modeData.range) updates["system.range"] = modeData.range;
      if (modeData.hasAltFire !== undefined) updates["system.hasAltFire"] = modeData.hasAltFire;
      if (modeData.altFireLabel !== undefined) updates["system.altFireLabel"] = modeData.altFireLabel;
      if (modeData.altFireIcon !== undefined) updates["system.altFireIcon"] = modeData.altFireIcon;
      if (modeData.altDamage !== undefined) updates["system.altDamage"] = modeData.altDamage;
      if (modeData.altDamageType !== undefined) updates["system.altDamageType"] = modeData.altDamageType;
    } else {
      if (newMode === "melee") {
        updates["system.type"] = "melee";
        updates["system.subtype"] = "Bayonet";
        updates["system.damage"] = "2d10";
        updates["system.damageType"] = "Puncture";
        updates["system.range"] = "Melee (8 ft)";
        updates["system.hasAltFire"] = true;
        updates["system.altFireLabel"] = "Tir Rapide";
        updates["system.altFireIcon"] = "fas fa-crosshairs";
        updates["system.altDamage"] = "2d12";
        updates["system.altDamageType"] = "Puncture";
      } else {
        updates["system.type"] = "primary";
        updates["system.subtype"] = "Bayonet Rifle";
        updates["system.damage"] = "2d12";
        updates["system.damageType"] = "Puncture";
        updates["system.range"] = "50m (60 ft)";
        updates["system.hasAltFire"] = true;
        updates["system.altFireLabel"] = "Empalement Baïonnette";
        updates["system.altFireIcon"] = "fas fa-dagger";
        updates["system.altDamage"] = "2d10";
        updates["system.altDamageType"] = "Puncture";
      }
    }

    await weapon.update(updates);

    if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.id) {
      globalThis.warframeTTRPG.WarframeHUD.render(this, globalThis.warframeTTRPG.WarframeHUD.currentToken);
    }
    if (this.sheet?.rendered) {
      this.sheet.render(false);
    }

    const modeLabel = newMode === "melee" ? "Baïonnette (Mêlée 2d10)" : "Fusil (Distance 2d12)";
    const modeIcon = newMode === "melee" ? "fas fa-khanda" : "fas fa-crosshairs";
    const modeColor = newMode === "melee" ? "#e74c3c" : "#00e5ff";

    ui.notifications?.info(`${weapon.name} est maintenant en mode ${modeLabel} !`);

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `
        <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(243, 156, 18, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(243,156,18,0.2);">
          <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(243, 156, 18, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
            <div style="width: 28px; height: 28px; background: rgba(243, 156, 18, 0.2); border: 1px solid #f39c12; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #f39c12; font-size: 14px;">
              <i class="fas fa-sync-alt"></i>
            </div>
            <div>
              <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #f39c12; font-size: 13px;">Transformation : ${weapon.name}</h4>
              <span style="font-size: 10px; color: ${modeColor}; text-transform: uppercase;"><i class="${modeIcon}"></i> ${modeLabel}</span>
            </div>
          </div>
          <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
            <strong>${this.name}</strong> reconfigure son arme : <strong>${weapon.name}</strong> passe en mode <strong>${modeLabel}</strong>.
          </p>
        </div>
      `
    });
  }

  /**
   * Ouvre une boîte de dialogue interactive pour choisir une manœuvre de Parkour cinétique.
   */
  async showParkourDialog() {
    let actions = this.getFlag("warframe-ttrpg", "combatActions") || { parkour: true, action1: true, action2: true, reaction: true };
    const isAvailable = actions.parkour !== false;

    // Check equipped ranged weapon that could benefit from tactical slide
    const rangedWeapons = this.items.filter(i => i.type === "weapon" && i.system?.equipped && (i.system?.type?.toLowerCase() !== "melee" && i.system?.range?.toLowerCase() !== "melee") && Number(i.system?.magazine?.max) > 0);
    const weaponNeedingReload = rangedWeapons.find(w => (Number(w.system?.magazine?.value) || 0) < Number(w.system?.magazine?.max)) || rangedWeapons[0];

    const content = `
      <div class="wf-kinetic-dialog-container">
        <div class="wf-dialog-header-desc">
          Sélectionnez la manœuvre de parkour cinétique à exécuter pour <strong>${this.name}</strong>.
          ${!isAvailable ? '<div class="wf-dialog-alert-warning"><i class="fas fa-exclamation-triangle"></i> L\'action de Parkour est déjà notée comme dépensée pour ce tour !</div>' : ''}
        </div>

        <div class="wf-dialog-cards-list">
          <div class="wf-dialog-action-card" data-maneuver="bullet-jump">
            <div class="wf-card-icon" style="color: #00e5ff; background: rgba(0, 229, 255, 0.15); border: 1px solid rgba(0, 229, 255, 0.3);">
              <i class="fas fa-rocket"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Bullet Jump (Saut Propulsé)</div>
              <div class="wf-card-text">Bond acrobatique 3D omnidirectionnel de <strong>+30 feet</strong>. Déclenche une onde de choc radiale déstabilisant les cibles adjacentes.</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag cyan"><i class="fas fa-arrows-alt"></i> +30 ft Mouvement 3D</span>
                <span class="wf-badge-tag blue"><i class="fas fa-wind"></i> Onde de Choc Radiale</span>
              </div>
            </div>
          </div>

          <div class="wf-dialog-action-card" data-maneuver="slide">
            <div class="wf-card-icon" style="color: #2ecc71; background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.3);">
              <i class="fas fa-skating"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Glissade Tactique (Rechargement Gratuit)</div>
              <div class="wf-card-text">Glissade fluide sous les tirs. <strong>Recharge immédiatement et gratuitement</strong> le chargeur d'une arme à feu équipée sans dépenser d'action majeure !</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag green"><i class="fas fa-redo"></i> Rechargement Gratuit</span>
                ${weaponNeedingReload ? `<span class="wf-badge-tag grey"><i class="fas fa-crosshairs"></i> ${weaponNeedingReload.name}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="wf-dialog-action-card" data-maneuver="aim-glide">
            <div class="wf-card-icon" style="color: #f1c40f; background: rgba(241, 196, 15, 0.15); border: 1px solid rgba(241, 196, 15, 0.3);">
              <i class="fas fa-feather-alt"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Visée Planée (Aim Glide)</div>
              <div class="wf-card-text">Suspension balistique aérienne et ralentissement de chute. Confère un bonus de <strong>+2 au Toucher (ou Avantage)</strong> sur vos attaques à distance ce tour.</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag gold"><i class="fas fa-bullseye"></i> +2 Toucher / Avantage</span>
                <span class="wf-badge-tag blue"><i class="fas fa-cloud"></i> Lévitation Antigravité</span>
              </div>
            </div>
          </div>

          <div class="wf-dialog-action-card" data-maneuver="wall-latch">
            <div class="wf-card-icon" style="color: #e67e22; background: rgba(230, 126, 34, 0.15); border: 1px solid rgba(230, 126, 34, 0.3);">
              <i class="fas fa-magnet"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Prise Murale (Wall Latch) & Tremplin</div>
              <div class="wf-card-text">Accroche magnétique sur une paroi verticale. Confère l'effet <strong>+15% Critique</strong> sur toutes les attaques et sert de <strong>Tremplin</strong> (Bullet Jump ou Visée Planée gratuit consécutif).</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag orange"><i class="fas fa-fire"></i> +15% Chance Critique</span>
                <span class="wf-badge-tag cyan"><i class="fas fa-level-up-alt"></i> Tremplin Gratuit</span>
              </div>
            </div>
          </div>

          <div class="wf-dialog-action-card" data-maneuver="wall-run">
            <div class="wf-card-icon" style="color: #a55eea; background: rgba(165, 94, 234, 0.15); border: 1px solid rgba(165, 94, 234, 0.3);">
              <i class="fas fa-running"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Course Murale (Wall Run)</div>
              <div class="wf-card-text">Course dynamique le long des surfaces verticales pour franchir les obstacles, fosses et contourner les angles de couverture ennemis.</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag purple"><i class="fas fa-shoe-prints"></i> Déplacement Vertical</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const d = new Dialog({
      title: `Manœuvres de Parkour Cinétique — ${this.name}`,
      content: content,
      buttons: {
        toggleOnly: {
          icon: '<i class="fas fa-exchange-alt"></i>',
          label: isAvailable ? "Dépenser sans manœuvre" : "Réactiver l'action",
          callback: async () => {
            const cur = this.getFlag("warframe-ttrpg", "combatActions") || { parkour: true, action1: true, action2: true, reaction: true };
            cur.parkour = !cur.parkour;
            await this.setFlag("warframe-ttrpg", "combatActions", cur);
            if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.id) {
              globalThis.warframeTTRPG.WarframeHUD.render(this, globalThis.warframeTTRPG.WarframeHUD.currentToken);
            }
            if (this.sheet?.rendered) this.sheet.render(false);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Annuler"
        }
      },
      default: "cancel",
      render: (html) => {
        html.find(".wf-dialog-action-card").click(async (ev) => {
          const maneuver = ev.currentTarget.dataset.maneuver;
          d.close();
          await this._executeParkourManeuver(maneuver, weaponNeedingReload);
        });
      }
    }, {
      classes: ["dialog", "warframe-dialog", "kinetic-action-dialog"],
      width: 520
    });

    d.render(true);
  }

  async _executeParkourManeuver(maneuver, weaponToReload) {
    // Consomme l'action de parkour
    await this.consumeCombatAction("parkour");

    if (maneuver === "bullet-jump") {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(0, 229, 255, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(0,229,255,0.2);">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
              <div style="width: 28px; height: 28px; background: rgba(0, 229, 255, 0.2); border: 1px solid #00e5ff; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #00e5ff; font-size: 15px;">
                <i class="fas fa-rocket"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #00e5ff; font-size: 13px;">PARKOUR : BULLET JUMP</h4>
                <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Saut Propulsé Cinétique 3D</span>
              </div>
            </div>
            <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
              <strong>${this.name}</strong> canalise l'inertie cinétique de sa Warframe et s'élance dans un saut propulsé spectaculaire de <strong>+30 feet</strong> en ignorant le relief terrestre.
            </p>
            <div style="margin-top: 8px; background: rgba(0, 229, 255, 0.1); border-left: 3px solid #00e5ff; padding: 6px 8px; font-size: 11px; color: #93c5fd;">
              <strong>Onde de choc cinétique :</strong> Projette un blast d'air comprimé au décollage ou à l'atterrissage, déstabilisant les cibles adjacentes.
            </div>
          </div>
        `
      });
    } else if (maneuver === "slide") {
      if (weaponToReload) {
        await this.reloadWeapon(weaponToReload.id, { isFree: true, force: true });
      } else {
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this }),
          content: `
            <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(46, 204, 113, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(46,204,113,0.2);">
              <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(46, 204, 113, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
                <div style="width: 28px; height: 28px; background: rgba(46, 204, 113, 0.2); border: 1px solid #2ecc71; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #2ecc71; font-size: 15px;">
                  <i class="fas fa-skating"></i>
                </div>
                <div>
                  <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #2ecc71; font-size: 13px;">PARKOUR : GLISSADE TACTIQUE</h4>
                  <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Glissade Fluide Tenno</span>
                </div>
              </div>
              <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
                <strong>${this.name}</strong> s'élance dans une glissade fluide à grande vitesse sous les lignes de mire ennemies.
              </p>
              <div style="margin-top: 8px; background: rgba(46, 204, 113, 0.1); border-left: 3px solid #2ecc71; padding: 6px 8px; font-size: 11px; color: #86efac;">
                <strong>Rechargement gratuit :</strong> Arme prête au combat sans dépenser d'action majeure !
              </div>
            </div>
          `
        });
      }
    } else if (maneuver === "aim-glide") {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(241, 196, 15, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(241,196,15,0.2);">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(241, 196, 15, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
              <div style="width: 28px; height: 28px; background: rgba(241, 196, 15, 0.2); border: 1px solid #f1c40f; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #f1c40f; font-size: 15px;">
                <i class="fas fa-feather-alt"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #f1c40f; font-size: 13px;">PARKOUR : VISÉE PLANÉE (AIM GLIDE)</h4>
                <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Suspension Balistique Aérienne</span>
              </div>
            </div>
            <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
              <strong>${this.name}</strong> déploie ses propulseurs cinétiques et lévite en apesanteur au-dessus du champ de bataille.
            </p>
            <div style="margin-top: 8px; background: rgba(241, 196, 15, 0.1); border-left: 3px solid #f1c40f; padding: 6px 8px; font-size: 11px; color: #fde047;">
              <strong>Avantage Cinétique :</strong> Confère <strong>+2 au Toucher</strong> (ou Avantage) sur la prochaine attaque à distance ce tour.
            </div>
          </div>
        `
      });
    } else if (maneuver === "wall-latch") {
      await this.toggleWallLatch(true);
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(230, 126, 34, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(230,126,34,0.2);">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(230, 126, 34, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
              <div style="width: 28px; height: 28px; background: rgba(230, 126, 34, 0.2); border: 1px solid #e67e22; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #e67e22; font-size: 15px;">
                <i class="fas fa-magnet"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #e67e22; font-size: 13px;">PARKOUR : PRISE MURALE (WALL LATCH)</h4>
                <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Accroche Magnétique & Tremplin</span>
              </div>
            </div>
            <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
              <strong>${this.name}</strong> s'ancre magnétiquement à une paroi verticale, dominant le champ de tir.
            </p>
            <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
              <div style="background: rgba(230, 126, 34, 0.1); border-left: 3px solid #e67e22; padding: 4px 8px; font-size: 11px; color: #fdba74;">
                <strong>Bonus de Précision :</strong> <strong>+15% Chance Critique</strong> actif sur toutes les attaques !
              </div>
              <div style="background: rgba(0, 229, 255, 0.1); border-left: 3px solid #00e5ff; padding: 4px 8px; font-size: 11px; color: #93c5fd;">
                <strong>Tremplin :</strong> Vous pouvez quitter le mur avec un <em>Bullet Jump</em> ou une <em>Visée Planée</em> gratuit(e).
              </div>
            </div>
          </div>
        `
      });
    } else if (maneuver === "wall-run") {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(165, 94, 234, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(165,94,234,0.2);">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(165, 94, 234, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
              <div style="width: 28px; height: 28px; background: rgba(165, 94, 234, 0.2); border: 1px solid #a55eea; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #a55eea; font-size: 15px;">
                <i class="fas fa-running"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #a55eea; font-size: 13px;">PARKOUR : COURSE MURALE (WALL RUN)</h4>
                <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Franchissement Vertical</span>
              </div>
            </div>
            <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
              <strong>${this.name}</strong> court avec agilité sur la paroi verticale, franchissant obstacles et gouffres sans toucher le sol.
            </p>
          </div>
        `
      });
    }
  }

  /**
   * Ouvre une boîte de dialogue interactive pour choisir une réaction réflexe Tenno.
   */
  async showReactionDialog() {
    let actions = this.getFlag("warframe-ttrpg", "combatActions") || { parkour: true, action1: true, action2: true, reaction: true };
    const isAvailable = actions.reaction !== false;

    // Equipped melee weapon for Riposte
    const meleeWeapon = this.items.find(i => i.type === "weapon" && i.system?.equipped && (i.system?.type?.toLowerCase() === "melee" || i.system?.range?.toLowerCase() === "melee")) 
      || this.items.find(i => i.type === "weapon" && (i.system?.type?.toLowerCase() === "melee" || i.system?.range?.toLowerCase() === "melee"));

    const content = `
      <div class="wf-kinetic-dialog-container">
        <div class="wf-dialog-header-desc">
          Sélectionnez la réaction réflexe à déclencher pour <strong>${this.name}</strong> face à une action ennemie.
          ${!isAvailable ? '<div class="wf-dialog-alert-warning"><i class="fas fa-exclamation-triangle"></i> La Réaction est déjà notée comme dépensée pour ce tour !</div>' : ''}
        </div>

        <div class="wf-dialog-cards-list">
          <div class="wf-dialog-action-card" data-reaction="parry">
            <div class="wf-card-icon" style="color: #3498db; background: rgba(52, 152, 219, 0.15); border: 1px solid rgba(52, 152, 219, 0.3);">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Parade & Déviation (Mêlée)</div>
              <div class="wf-card-text">Interposition réflexe de l'arme de corps-à-corps pour bloquer une attaque entrante. Réduit considérablement les dégâts reçus et dévie les tirs.</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag blue"><i class="fas fa-shield-virus"></i> Blocage & Absorption</span>
                <span class="wf-badge-tag cyan"><i class="fas fa-reply"></i> Déviation Balistique</span>
              </div>
            </div>
          </div>

          <div class="wf-dialog-action-card" data-reaction="dodge">
            <div class="wf-card-icon" style="color: #2ecc71; background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.3);">
              <i class="fas fa-undo"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Esquive Acrobatique (Roulade Réflexe)</div>
              <div class="wf-card-text">Roulade instinctive face à une attaque ou une déflagration de zone. <strong>Dégâts subis divisés par 2 (réduction 50%)</strong> + <strong>10 ft de repositionnement</strong>.</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag green"><i class="fas fa-heart-broken"></i> Dégâts ÷ 2 (50% Réduction)</span>
                <span class="wf-badge-tag yellow"><i class="fas fa-arrows-alt"></i> Repositionnement 10 ft</span>
              </div>
            </div>
          </div>

          <div class="wf-dialog-action-card" data-reaction="void-sling">
            <div class="wf-card-icon" style="color: #9b59b6; background: rgba(155, 89, 182, 0.15); border: 1px solid rgba(155, 89, 182, 0.3);">
              <i class="fas fa-meteor"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Projection du Néant (Void Sling)</div>
              <div class="wf-card-text">Phase instantanée de <strong>5 à 10 feet</strong> dans le Néant. Permet d'éviter une attaque mortelle ou de diviser les dégâts par 2, et <strong>purge toute entrave ou étourdissement</strong> !</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag purple"><i class="fas fa-ghost"></i> Phase 5-10 ft Néant</span>
                <span class="wf-badge-tag red"><i class="fas fa-heart"></i> Sauvegarde Mortelle / ÷2 Dégâts</span>
                <span class="wf-badge-tag cyan"><i class="fas fa-magic"></i> Purge Entrave & Étourdi</span>
              </div>
            </div>
          </div>

          <div class="wf-dialog-action-card" data-reaction="riposte">
            <div class="wf-card-icon" style="color: #e74c3c; background: rgba(231, 76, 60, 0.15); border: 1px solid rgba(231, 76, 60, 0.3);">
              <i class="fas fa-bolt"></i>
            </div>
            <div class="wf-card-info">
              <div class="wf-card-title">Riposte d'Opportunité (Mêlée)</div>
              <div class="wf-card-text">Attaque de corps-à-corps réflexe immédiate contre un ennemi qui s'approche, tourne le dos ou rate son attaque à portée de mêlée.</div>
              <div class="wf-card-tags">
                <span class="wf-badge-tag red"><i class="fas fa-fist-raised"></i> Attaque Mêlée Immédiate</span>
                ${meleeWeapon ? `<span class="wf-badge-tag gold"><i class="fas fa-khanda"></i> ${meleeWeapon.name}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const d = new Dialog({
      title: `Réactions Réflexes Tenno — ${this.name}`,
      content: content,
      buttons: {
        toggleOnly: {
          icon: '<i class="fas fa-exchange-alt"></i>',
          label: isAvailable ? "Dépenser sans effet" : "Réactiver l'action",
          callback: async () => {
            const cur = this.getFlag("warframe-ttrpg", "combatActions") || { parkour: true, action1: true, action2: true, reaction: true };
            cur.reaction = !cur.reaction;
            await this.setFlag("warframe-ttrpg", "combatActions", cur);
            if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.id) {
              globalThis.warframeTTRPG.WarframeHUD.render(this, globalThis.warframeTTRPG.WarframeHUD.currentToken);
            }
            if (this.sheet?.rendered) this.sheet.render(false);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Annuler"
        }
      },
      default: "cancel",
      render: (html) => {
        html.find(".wf-dialog-action-card").click(async (ev) => {
          const reaction = ev.currentTarget.dataset.reaction;
          d.close();
          await this._executeReaction(reaction, meleeWeapon);
        });
      }
    }, {
      classes: ["dialog", "warframe-dialog", "kinetic-action-dialog"],
      width: 520
    });

    d.render(true);
  }

  async _executeReaction(reaction, meleeWeapon) {
    // Consomme l'action de réaction
    await this.consumeCombatAction("reaction");

    if (reaction === "parry") {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(52, 152, 219, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(52,152,219,0.2);">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(52, 152, 219, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
              <div style="width: 28px; height: 28px; background: rgba(52, 152, 219, 0.2); border: 1px solid #3498db; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #3498db; font-size: 15px;">
                <i class="fas fa-shield-alt"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #3498db; font-size: 13px;">RÉACTION : PARADE & DÉVIATION</h4>
                <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Blocage Réflexe Tenno</span>
              </div>
            </div>
            <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
              <strong>${this.name}</strong> interpose son arme et canalise son blindage d'énergie pour absorber l'impact de l'attaque ennemie.
            </p>
            <div style="margin-top: 8px; background: rgba(52, 152, 219, 0.1); border-left: 3px solid #3498db; padding: 6px 8px; font-size: 11px; color: #93c5fd;">
              <strong>Réduction & Déviation :</strong> Dégâts absorbés par la garde et projectiles balistiques déviés hors de la trajectoire mortelle.
            </div>
          </div>
        `
      });
    } else if (reaction === "dodge") {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(46, 204, 113, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(46,204,113,0.2);">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(46, 204, 113, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
              <div style="width: 28px; height: 28px; background: rgba(46, 204, 113, 0.2); border: 1px solid #2ecc71; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #2ecc71; font-size: 15px;">
                <i class="fas fa-undo"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #2ecc71; font-size: 13px;">RÉACTION : ESQUIVE ACROBATIQUE (ROULADE)</h4>
                <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Évasion Cinétique Réflexe</span>
              </div>
            </div>
            <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
              <strong>${this.name}</strong> exécute une roulade d'esquive millimétrée hors de l'épicentre de l'attaque.
            </p>
            <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
              <div style="background: rgba(46, 204, 113, 0.1); border-left: 3px solid #2ecc71; padding: 4px 8px; font-size: 11px; color: #86efac;">
                <strong>Réduction 50% :</strong> Tous les dégâts subis de cette attaque ou explosion sont <strong>divisés par 2</strong> !
              </div>
              <div style="background: rgba(0, 229, 255, 0.1); border-left: 3px solid #00e5ff; padding: 4px 8px; font-size: 11px; color: #93c5fd;">
                <strong>Repositionnement :</strong> Déplacement libre immédiat de <strong>10 feet</strong> sans déclencher d'attaque d'opportunité.
              </div>
            </div>
          </div>
        `
      });
    } else if (reaction === "void-sling") {
      // Purge status effects like restrained or stunned
      const purgeList = ["restrained", "stunned", "entravé", "etourdi", "immobilized"];
      const effectsToPurge = this.effects.filter(e => !e.disabled && purgeList.some(s => e.statuses?.has(s) || e.flags?.core?.statusId === s || e.name?.toLowerCase().includes(s)));
      let purgedNames = [];
      for (const eff of effectsToPurge) {
        purgedNames.push(eff.name);
        await eff.delete();
      }

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `
          <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(155, 89, 182, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(155,89,182,0.2);">
            <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(155, 89, 182, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
              <div style="width: 28px; height: 28px; background: rgba(155, 89, 182, 0.2); border: 1px solid #9b59b6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9b59b6; font-size: 15px;">
                <i class="fas fa-meteor"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #c084fc; font-size: 13px;">RÉACTION : PROJECTION DU NÉANT (VOID SLING)</h4>
                <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Translation Instantanée Tenno</span>
              </div>
            </div>
            <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
              <strong>${this.name}</strong> se dématérialise instantanément et réapparaît à <strong>5 à 10 feet</strong> à travers une faille du Néant, échappant à une attaque mortelle ou divisant ses dégâts par 2.
            </p>
            <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
              <div style="background: rgba(155, 89, 182, 0.1); border-left: 3px solid #9b59b6; padding: 4px 8px; font-size: 11px; color: #e9d5ff;">
                <strong>Phase du Néant (5 - 10 ft) :</strong> Échappe à l'attaque mortelle ou divise les dégâts par 2.
              </div>
              ${purgedNames.length > 0 ? `
                <div style="background: rgba(0, 229, 255, 0.1); border-left: 3px solid #00e5ff; padding: 4px 8px; font-size: 11px; color: #93c5fd;">
                  <strong>Purge d'Altération :</strong> Effets dissipés avec succès : <em>${purgedNames.join(", ")}</em> !
                </div>
              ` : `
                <div style="background: rgba(0, 229, 255, 0.1); border-left: 3px solid #00e5ff; padding: 4px 8px; font-size: 11px; color: #93c5fd;">
                  <strong>Purge d'Entrave :</strong> Dissipe immédiatement toute entrave physique ou étourdissement.
                </div>
              `}
            </div>
          </div>
        `
      });
    } else if (reaction === "riposte") {
      if (meleeWeapon) {
        ui.notifications?.info(`Riposte réflexe déclenchée avec ${meleeWeapon.name} !`);
        await this.rollWeapon(meleeWeapon.id, { isReaction: true, skipActionCost: true });
      } else {
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this }),
          content: `
            <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(231, 76, 60, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(231,76,60,0.2);">
              <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(231, 76, 60, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
                <div style="width: 28px; height: 28px; background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #e74c3c; font-size: 15px;">
                  <i class="fas fa-bolt"></i>
                </div>
                <div>
                  <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #e74c3c; font-size: 13px;">RÉACTION : RIPOSTE D'OPPORTUNITÉ</h4>
                  <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Frappe Réflexe Immédiate</span>
                </div>
              </div>
              <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">
                <strong>${this.name}</strong> punit immédiatement l'erreur adverse par une frappe réflexe au corps-à-corps !
              </p>
            </div>
          `
        });
      }
    }
  }

  async rollWeapon(weaponId, options = {}) {
    const weapon = this.items.get(weaponId);
    if (!weapon) return;

    // Consomme automatiquement 1 Action de combat (sauf si réaction réflexe ou coût ignoré)
    if (!options.skipActionCost && !options.isReaction) {
      await this.consumeCombatAction("action");
    }

    const isMelee = weapon.system.type?.toLowerCase() === "melee" || weapon.system.range?.toLowerCase() === "melee";
    const isValkyr = this.system.details?.frameClass === "Valkyr";
    const isKoumei = this.system.details?.frameClass === "Koumei" || this.items.some(i => i.type === "warframe" && i.name === "Koumei");
    const isUriel = this.system.details?.frameClass === "Uriel" || this.items.some(i => i.type === "warframe" && i.name === "Uriel");
    const isArthur = this.system.details?.frameClass === "Excalibur" || this.items.some(i => i.type === "warframe" && (i.name === "Excalibur" || i.name === "Arthur"));
    const isAmanata = weapon.name?.toLowerCase().includes("amanata") || weapon.id === "amanata000000001";
    const isHigasa = weapon.name?.toLowerCase().includes("higasa") || weapon.id === "higasa0000000001";
    const isVinquibus = weapon.name?.toLowerCase().includes("vinquibus") || weapon.name?.toLowerCase().includes("vinquidibus") || weapon.id === "vinquibusprim001" || weapon.id === "vinquibusmel0001";
    const isDualKamas = weapon.name?.toLowerCase().includes("kama") || weapon.id === "dualkamas0000001";
    const isAX52 = weapon.name?.toLowerCase().includes("ax-52") || weapon.name?.toLowerCase().includes("ax52") || weapon.id === "ax52primary00001";
    const isAltFire = !!options.isAltFire;

    let formula = weapon.system.damage || "1d6";
    let damageType = weapon.system.damageType || "physical";
    if (isHigasa && isAltFire) {
      formula = weapon.system.altDamage || "4d10";
      damageType = weapon.system.altDamageType || "Void";
    } else if (isVinquibus && isAltFire) {
      formula = weapon.system.altDamage || "2d10";
      damageType = weapon.system.altDamageType || "Puncture";
    }

    const roll = new Roll(formula);
    await roll.evaluate();

    // Scan slotted weapon mods and accumulate stats
    const modSlots = weapon.system.modSlots || {};
    const slotKeys = ["stance", "exilus", "slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8"];

    let modDmgBonusPct = 0;
    let modCritChancePct = 0;
    let modCritMultPct = 0;
    let modStatusChancePct = 0;
    let modMultishotPct = 0;
    let modFireRatePct = 0;
    let modInitialCombo = 0;

    let hasConditionOverload = false;
    let hasHunterMunitions = false;
    let hasBloodRush = false;
    let hasWeepingWounds = false;
    let hasVigilanteEnhance = false;

    const orderedBaseElements = [];
    const standaloneCombined = { Blast: 0, Radiation: 0, Gas: 0, Magnetic: 0, Viral: 0, Corrosive: 0 };
    const physicalElements = { Slash: 0, Puncture: 0, Impact: 0 };

    const slottedModList = [];
    for (const s of slotKeys) {
      const m = modSlots[s]?.mod;
      if (!m) continue;
      slottedModList.push(m.name);
      const st = m.system?.stats || m.stats || {};

      if (st.damage) modDmgBonusPct += Number(st.damage) || 0;
      if (st.critChance) modCritChancePct += Number(st.critChance) || 0;
      if (st.critMultiplier) modCritMultPct += Number(st.critMultiplier) || 0;
      if (st.statusChance) modStatusChancePct += Number(st.statusChance) || 0;
      if (st.multishot) modMultishotPct += Number(st.multishot) || 0;
      if (st.fireRate) modFireRatePct += Number(st.fireRate) || 0;
      if (st.initialCombo) modInitialCombo += Number(st.initialCombo) || 0;

      if (st.heat) orderedBaseElements.push({ name: "Heat", val: Number(st.heat) || 0 });
      if (st.cold) orderedBaseElements.push({ name: "Cold", val: Number(st.cold) || 0 });
      if (st.electricity) orderedBaseElements.push({ name: "Electricity", val: Number(st.electricity) || 0 });
      if (st.toxin) orderedBaseElements.push({ name: "Toxin", val: Number(st.toxin) || 0 });

      if (st.blast) standaloneCombined.Blast = (standaloneCombined.Blast || 0) + (Number(st.blast) || 0);
      if (st.radiation) standaloneCombined.Radiation = (standaloneCombined.Radiation || 0) + (Number(st.radiation) || 0);
      if (st.gas) standaloneCombined.Gas = (standaloneCombined.Gas || 0) + (Number(st.gas) || 0);
      if (st.magnetic) standaloneCombined.Magnetic = (standaloneCombined.Magnetic || 0) + (Number(st.magnetic) || 0);
      if (st.viral) standaloneCombined.Viral = (standaloneCombined.Viral || 0) + (Number(st.viral) || 0);
      if (st.corrosive) standaloneCombined.Corrosive = (standaloneCombined.Corrosive || 0) + (Number(st.corrosive) || 0);

      if (st.slash) physicalElements.Slash += Number(st.slash) || 0;
      if (st.puncture) physicalElements.Puncture += Number(st.puncture) || 0;
      if (st.impact) physicalElements.Impact += Number(st.impact) || 0;

      const modNameLower = (m.name || "").toLowerCase();
      if (modNameLower.includes("condition overload")) hasConditionOverload = true;
      if (modNameLower.includes("hunter munitions")) hasHunterMunitions = true;
      if (modNameLower.includes("blood rush")) hasBloodRush = true;
      if (modNameLower.includes("weeping wounds")) hasWeepingWounds = true;
      if (modNameLower.includes("vigilante")) hasVigilanteEnhance = true;
    }

    // Innate weapon elemental damage type (combines after mods)
    if (["Heat", "Cold", "Electricity", "Toxin"].includes(damageType)) {
      orderedBaseElements.push({ name: damageType, val: 100 });
    } else if (["Blast", "Radiation", "Gas", "Magnetic", "Viral", "Corrosive"].includes(damageType)) {
      standaloneCombined[damageType] = (standaloneCombined[damageType] || 0) + 100;
    }

    // Resolve elemental combinations
    const activeElements = combineElements(orderedBaseElements, standaloneCombined);

    // Melee combo tracking
    let comboTier = 1;
    let comboHtml = "";
    if (isMelee) {
      let curCombo = (this.flags?.["warframe-ttrpg"]?.meleeComboCount || 0) + 1;
      if (modInitialCombo > 0 && curCombo < modInitialCombo) curCombo = modInitialCombo;
      await this.setFlag("warframe-ttrpg", "meleeComboCount", curCombo);
      comboTier = Math.floor(curCombo / 10) + 1;
      if (hasBloodRush) {
        modCritChancePct += (40 * comboTier);
      }
      if (hasWeepingWounds) {
        modStatusChancePct += (40 * comboTier);
      }
      if (curCombo > 1 || modInitialCombo > 0) {
        comboHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #f39c12; font-size: 11px;">
            <span>⚔️ Melee Combo:</span>
            <strong>${curCombo} Hits (${comboTier}x Tier)</strong>
          </div>
        `;
      }
    }

    // Multishot calculation (ranged weapons)
    let multishotPellets = 1;
    let multishotHtml = "";
    if (modMultishotPct > 0 && !isMelee) {
      const totalMs = 100 + modMultishotPct;
      multishotPellets = Math.floor(totalMs / 100);
      const extraChance = totalMs % 100;
      if (extraChance > 0 && (Math.floor(Math.random() * 100) + 1 <= extraChance)) {
        multishotPellets += 1;
      }
      if (multishotPellets > 1) {
        multishotHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #00e5ff; font-size: 11px;">
            <span>🎯 Multishot (+${modMultishotPct}%):</span>
            <strong style="color: #00e5ff;">x${multishotPellets} Projectiles Fired</strong>
          </div>
        `;
      }
    }

    let rageDetailsHtml = "";
    let lifestealHtml = "";
    let vulnerabilityHtml = "";
    let amanataHtml = "";
    let higasaHtml = "";
    let vinquibusHtml = "";
    let vinquibusSynergyHtml = "";
    let dualKamasHtml = "";
    let ax52Html = "";
    let tormentHtml = "";
    let bayonetRushBonus = 0;
    let vinquibusHeatBonus = 0;
    let ax52ShredBonus = 0;
    let ax52SavedAmmo = false;

    let fortuneVal = 0;
    let fortuneCritBonus = 0;
    let fortuneStatusBonus = 0;
    let fortuneDamageBonusPct = 0;
    let fortuneReachText = "";
    let fortuneSwiftnessText = "";

    let higasaCritBonus = 0;
    let higasaStatusBonus = 0;
    let ax52CritBonus = 0;
    let ax52StatusBonus = 0;

    // Wall Latch (Prise Murale): +15% Critical Chance when active on actor
    const hasWallLatch = this.effects.some(e => !e.disabled && (
      e.statuses?.has("wall_latch") ||
      e.flags?.core?.statusId === "wall_latch" ||
      e.name?.toLowerCase().includes("prise murale") ||
      e.name?.toLowerCase().includes("wall latch")
    ));
    const wallLatchCritBonus = hasWallLatch ? 15 : 0;
    let wallLatchHtml = "";
    if (hasWallLatch) {
      wallLatchHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #f1c40f; font-size: 11px;">
          <span>🧗‍♂️ Prise Murale (+15% Crit):</span>
          <strong style="color: #f1c40f;">+15% CC Actif</strong>
        </div>
      `;
    }

    if (isAmanata) {
      const fortuneRoll = new Roll("1d6");
      await fortuneRoll.evaluate();
      fortuneVal = fortuneRoll.total;

      const diceIcons = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
      const dieIcon = diceIcons[fortuneVal - 1] || "🎲";

      const statusElements = ["Slash", "Puncture", "Impact", "Heat", "Cold", "Electricity", "Toxin", "Viral", "Corrosive", "Radiation"];
      const rolledStatus = statusElements[Math.floor(Math.random() * statusElements.length)];

      let blessingName = "";
      let blessingColor = "#9b59b6";
      let blessingDesc = "";

      if (fortuneVal === 1) {
        blessingName = "Lethality";
        blessingColor = "#f1c40f";
        blessingDesc = "+40% Critical Chance on this strike!";
        fortuneCritBonus = 40;
      } else if (fortuneVal === 2) {
        blessingName = "Affliction";
        blessingColor = "#2ecc71";
        blessingDesc = `+30% Status Chance & guaranteed status proc (${rolledStatus})!`;
        fortuneStatusBonus = 30;
      } else if (fortuneVal === 3) {
        blessingName = "Torment";
        blessingColor = "#e67e22";
        blessingDesc = "+30% Strike Damage!";
        fortuneDamageBonusPct = 30;
      } else if (fortuneVal === 4) {
        blessingName = "Reach";
        blessingColor = "#3498db";
        blessingDesc = "+5 ft Reach (15 ft sweep strikes adjacent foes)!";
        fortuneReachText = "Melee (15 ft Sweeping)";
      } else if (fortuneVal === 5) {
        blessingName = "Swiftness";
        blessingColor = "#e056fd";
        blessingDesc = "Gain a free immediate follow-up attack!";
        fortuneSwiftnessText = "Free follow-up strike granted!";
      } else if (fortuneVal === 6) {
        blessingName = "Grand Alignment";
        blessingColor = "#ffd700";
        blessingDesc = `All 5 Blessings active! (+40% Crit, +30% Status [${rolledStatus}], +30% Damage, 15 ft Reach, Swiftness)`;
        fortuneCritBonus = 40;
        fortuneStatusBonus = 30;
        fortuneDamageBonusPct = 30;
        fortuneReachText = "Melee (15 ft Sweeping)";
        fortuneSwiftnessText = "Free follow-up strike granted!";
      }

      let koumeiSynergyHtml = "";
      if (isKoumei && fortuneVal === 6) {
        const curEnergy = Number(this.system.energy?.value) || 0;
        const maxEnergy = Number(this.system.energy?.max) || 100;
        const newEnergy = Math.min(maxEnergy, curEnergy + 15);
        await this.update({ "system.energy.value": newEnergy });

        koumeiSynergyHtml = `
          <div style="background: linear-gradient(90deg, rgba(255, 215, 0, 0.2), rgba(155, 89, 182, 0.2)); border: 1px solid #ffd700; border-radius: 4px; padding: 4px 6px; margin-top: 6px; font-size: 11px; color: #ffd700; text-align: center;">
            <i class="fas fa-sparkles"></i> <strong>Koumei Signature Synergy:</strong> Restored <strong>+15 Energy</strong> (${curEnergy} ➔ ${newEnergy})!
          </div>
        `;
      }

      amanataHtml = `
        <div style="margin-top: 6px; border: 1px solid rgba(155, 89, 182, 0.4); background: rgba(155, 89, 182, 0.08); border-radius: 4px; padding: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(155, 89, 182, 0.2); padding-bottom: 4px;">
            <span style="font-weight: bold; color: #d6a2e8; font-size: 11px; font-family: 'Orbitron', sans-serif;">
              ${dieIcon} Fortune of the Die (Rolled ${fortuneVal})
            </span>
            <span style="font-weight: bold; color: ${blessingColor}; font-size: 11px; text-transform: uppercase;">
              ${blessingName}
            </span>
          </div>
          <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">
            ${blessingDesc}
          </div>
          ${fortuneSwiftnessText ? `
            <div style="color: #e056fd; font-weight: bold; font-size: 10px; margin-top: 2px;">
              ⚡ ${fortuneSwiftnessText}
            </div>
          ` : ""}
          ${koumeiSynergyHtml}
        </div>
      `;
    }

    if (isHigasa) {
      const statusElements = ["Slash", "Puncture", "Impact", "Heat", "Cold", "Electricity", "Toxin", "Viral", "Corrosive", "Radiation"];
      const rolledStatus = statusElements[Math.floor(Math.random() * statusElements.length)];

      if (isAltFire) {
        higasaStatusBonus = 40;
        let koumeiAltBanner = "";
        if (isKoumei) {
          higasaCritBonus = 100; // Guaranteed Orange or Red crit!
          koumeiAltBanner = `
            <div style="background: linear-gradient(90deg, rgba(255, 215, 0, 0.2), rgba(155, 89, 182, 0.2)); border: 1px solid #ffd700; border-radius: 4px; padding: 4px 6px; margin-top: 6px; font-size: 11px; color: #ffd700; text-align: center;">
              <i class="fas fa-sparkles"></i> <strong>Koumei Signature Synergy:</strong> Alt-Fire infused with Fate's Alignment (+100% Critical Chance & Guaranteed <strong>${rolledStatus}</strong> Proc)!
            </div>
          `;
        }

        higasaHtml = `
          <div style="margin-top: 6px; border: 1px solid rgba(155, 89, 182, 0.5); background: linear-gradient(135deg, rgba(155, 89, 182, 0.15), rgba(0, 229, 255, 0.08)); border-radius: 4px; padding: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(155, 89, 182, 0.3); padding-bottom: 4px;">
              <span style="font-weight: bold; color: #d6a2e8; font-size: 11px; font-family: 'Orbitron', sans-serif;">
                ☂️ Canopy Laser Discharge (Alt-Fire)
              </span>
              <span style="font-weight: bold; color: #00e5ff; font-size: 11px; text-transform: uppercase;">
                ${damageType} Beam
              </span>
            </div>
            <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">
              Releases accumulated kinetic energy in a high-density piercing beam! Inflicts guaranteed <strong>${rolledStatus}</strong> status proc.
            </div>
            ${koumeiAltBanner}
          </div>
        `;
      } else {
        higasaHtml = `
          <div style="margin-top: 6px; border: 1px solid rgba(0, 229, 255, 0.3); background: rgba(0, 229, 255, 0.05); border-radius: 4px; padding: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 4px;">
              <span style="font-weight: bold; color: #00e5ff; font-size: 11px; font-family: 'Orbitron', sans-serif;">
                ☂️ Parasol Canopy Deployed
              </span>
              <span style="color: #8892b0; font-size: 10px;">3-Round Burst</span>
            </div>
            <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">
              Frontal laser umbrella deploys while aiming, absorbing incoming enemy projectiles to charge the Alt-Fire beam.
            </div>
            <div id="higasa-koumei-crit-slot"></div>
          </div>
        `;
      }
    }

    let hadBayonetRush = false;
    if (isVinquibus) {
      const isBayonetMode = isMelee || isAltFire;
      if (!isBayonetMode) {
        // Rifle Fire: activates Bayonet Rush for next melee strike
        await this.setFlag("warframe-ttrpg", "bayonetRush", true);
        vinquibusHtml = `
          <div style="margin-top: 6px; border: 1px solid rgba(230, 126, 34, 0.4); background: rgba(230, 126, 34, 0.08); border-radius: 4px; padding: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(230, 126, 34, 0.2); padding-bottom: 4px;">
              <span style="font-weight: bold; color: #f39c12; font-size: 11px; font-family: 'Orbitron', sans-serif;">
                🗡️ Vinquibus Precision
              </span>
              <span style="font-weight: bold; color: #e67e22; font-size: 11px; text-transform: uppercase;">
                Bayonet Rush Primed
              </span>
            </div>
            <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">
              Rifle fire channels kinetic momentum into the bayonet: grants <strong>+50% bonus damage</strong> on the next Melee attack!
            </div>
          </div>
        `;
      } else {
        // Bayonet Strike (Melee / Alt-Fire): unleashes Bayonet Rush and executes Ammo Syphon
        hadBayonetRush = !!this.flags?.["warframe-ttrpg"]?.bayonetRush;
        if (hadBayonetRush) {
          await this.unsetFlag("warframe-ttrpg", "bayonetRush");
        }

        const curMag = Number(weapon.system.magazine?.value) || 0;
        const maxMag = Number(weapon.system.magazine?.max) || 16;
        const newMag = Math.min(maxMag, curMag + 4);
        if (newMag !== curMag && weapon.system.magazine?.max > 0) {
          await weapon.update({ "system.magazine.value": newMag });
        }

        vinquibusHtml = `
          <div style="margin-top: 6px; border: 1px solid rgba(230, 126, 34, 0.4); background: rgba(230, 126, 34, 0.08); border-radius: 4px; padding: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(230, 126, 34, 0.2); padding-bottom: 4px;">
              <span style="font-weight: bold; color: #f39c12; font-size: 11px; font-family: 'Orbitron', sans-serif;">
                🗡️ Vinquibus Ferocity
              </span>
              <span style="font-weight: bold; color: #2ecc71; font-size: 11px; text-transform: uppercase;">
                Ammo Syphon (+4)
              </span>
            </div>
            <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">
              Close-quarters impalement restored <strong>+4 rounds</strong> directly to the rifle magazine (${curMag} ➔ ${newMag})!
            </div>
            ${hadBayonetRush ? `
              <div style="color: #f39c12; font-weight: bold; font-size: 11px; margin-top: 4px;">
                💥 <strong>Bayonet Rush Unleashed:</strong> +50% Bonus Damage applied to this strike!
              </div>
            ` : ""}
          </div>
        `;
      }

      // Uriel Signature Synergy: Brimstone Harvester + Legion Triad Consecration
      if (isUriel) {
        const curBrimstone = Number(this.system.brimstone?.value) || 0;
        const maxBrimstone = Number(this.system.brimstone?.max) || 100;
        const newBrimstone = Math.min(maxBrimstone, curBrimstone + 5);
        const urielUpdates = { "system.brimstone.value": newBrimstone };

        const catenach = this.system.legion?.catenach;
        const gulphagor = this.system.legion?.gulphagor;
        const vythelas = this.system.legion?.vythelas;
        const hasActiveFiends = (catenach && catenach.active) || (gulphagor && gulphagor.active) || (vythelas && vythelas.active);
        const healedFiends = [];

        if (catenach && catenach.active) {
          const curHP = Number(catenach.health) || 0;
          const maxHP = Number(catenach.maxHealth) || 80;
          const newHP = Math.min(maxHP, curHP + 10);
          urielUpdates["system.legion.catenach.health"] = newHP;
          healedFiends.push(`Catenach (+10 HP)`);
        }
        if (gulphagor && gulphagor.active) {
          const curHP = Number(gulphagor.health) || 0;
          const maxHP = Number(gulphagor.maxHealth) || 120;
          const newHP = Math.min(maxHP, curHP + 10);
          urielUpdates["system.legion.gulphagor.health"] = newHP;
          healedFiends.push(`Gulphagor (+10 HP)`);
        }
        if (vythelas && vythelas.active) {
          const curHP = Number(vythelas.health) || 0;
          const maxHP = Number(vythelas.maxHealth) || 60;
          const newHP = Math.min(maxHP, curHP + 10);
          urielUpdates["system.legion.vythelas.health"] = newHP;
          healedFiends.push(`Vythelas (+10 HP)`);
        }

        await this.update(urielUpdates);

        vinquibusSynergyHtml = `
          <div style="background: linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(243, 156, 18, 0.2)); border: 1px solid #e74c3c; border-radius: 4px; padding: 5px 8px; margin-top: 6px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; align-items: center; color: #ff7675; font-weight: bold;">
              <span><i class="fas fa-fire"></i> Uriel Signature Synergy</span>
              <span>+5 Brimstone (${curBrimstone}% ➔ ${newBrimstone}%)</span>
            </div>
            ${hasActiveFiends ? `
              <div style="color: #fdcb6e; margin-top: 3px; display: flex; justify-content: space-between;">
                <span>😈 Legion Triad Consecration (+25% Heat):</span>
                <strong id="vinquibus-heat-val">+0 Damage</strong>
              </div>
              <div style="color: #55efc4; font-size: 10px; margin-top: 2px;">
                💚 Fiends Healed: ${healedFiends.join(', ')}
              </div>
            ` : `
              <div style="color: #cbd5e1; font-size: 10px; margin-top: 2px; font-style: italic;">
                Summon Legion fiends (Catenach, Gulphagor, Vythelas) to unlock +25% Heat damage & fiend healing!
              </div>
            `}
          </div>
        `;
      }
    }

    if (isDualKamas) {
      dualKamasHtml = `
        <div style="margin-top: 6px; border: 1px solid rgba(230, 126, 34, 0.4); background: rgba(230, 126, 34, 0.08); border-radius: 4px; padding: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(230, 126, 34, 0.2); padding-bottom: 4px;">
            <span style="font-weight: bold; color: #f39c12; font-size: 11px; font-family: 'Orbitron', sans-serif;">
              ⚔️ Twin Flurry (Rafale Jumelée)
            </span>
            <span style="font-weight: bold; color: #e67e22; font-size: 10px; text-transform: uppercase;">
              Quick Action Attack
            </span>
          </div>
          <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">
            High-tempo dual sickle swings allow <strong>1 additional Melee Attack on your turn as a Quick Action</strong>!
          </div>
        </div>
      `;
    }

    if (isAX52) {
      if (isAltFire) {
        // Aimed Precision (ADS): +104% Crit Chance (+400% of base 26%), +100% Status Damage
        ax52CritBonus = 104;
        ax52StatusBonus = 18;

        let arthurSynergyBanner = "";
        if (isArthur) {
          ax52ShredBonus = 5; // +5 Armor Piercing Puncture damage
          const curEnergy = Number(this.system.energy?.value) || 0;
          const maxEnergy = Number(this.system.energy?.max) || 100;
          const newEnergy = Math.min(maxEnergy, curEnergy + 5);
          await this.update({ "system.energy.value": newEnergy });

          arthurSynergyBanner = `
            <div style="background: linear-gradient(90deg, rgba(46, 204, 113, 0.2), rgba(52, 152, 219, 0.2)); border: 1px solid #2ecc71; border-radius: 4px; padding: 4px 6px; margin-top: 6px; font-size: 11px; color: #2ecc71; text-align: center;">
              <i class="fas fa-shield-alt"></i> <strong>Arthur / Excalibur Synergy:</strong> Precision headshot shreds enemy armor (+5 Puncture Damage) & restores <strong>+5 Energy</strong> (${curEnergy} ➔ ${newEnergy})!
            </div>
          `;
        }

        ax52Html = `
          <div style="margin-top: 6px; border: 1px solid rgba(46, 204, 113, 0.4); background: rgba(46, 204, 113, 0.08); border-radius: 4px; padding: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(46, 204, 113, 0.2); padding-bottom: 4px;">
              <span style="font-weight: bold; color: #2ecc71; font-size: 11px; font-family: 'Orbitron', sans-serif;">
                🎯 Aimed Precision (ADS)
              </span>
              <span style="font-weight: bold; color: #f1c40f; font-size: 10px; text-transform: uppercase;">
                +104% Crit Chance
              </span>
            </div>
            <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">
              Pinpoint sight alignment guarantees critical penetration (+104% Crit Chance, +100% Status Damage).
            </div>
            ${arthurSynergyBanner}
          </div>
        `;
      } else {
        // Hip-Fire Spray: 60% ammo efficiency
        const isFreeShot = Math.random() < 0.60;
        ax52SavedAmmo = isFreeShot;

        ax52Html = `
          <div style="margin-top: 6px; border: 1px solid ${isFreeShot ? 'rgba(52, 152, 219, 0.4)' : 'rgba(149, 165, 166, 0.3)'}; background: ${isFreeShot ? 'rgba(52, 152, 219, 0.08)' : 'rgba(149, 165, 166, 0.05)'}; border-radius: 4px; padding: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 4px;">
              <span style="font-weight: bold; color: #3498db; font-size: 11px; font-family: 'Orbitron', sans-serif;">
                🔫 Full-Auto Hip-Fire
              </span>
              <span style="font-weight: bold; color: ${isFreeShot ? '#2ecc71' : '#95a5a6'}; font-size: 10px; text-transform: uppercase;">
                ${isFreeShot ? 'Free Shot (0 Ammo)' : 'Standard Ammo'}
              </span>
            </div>
            <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">
              ${isFreeShot ? '⚡ <strong>Ammo Efficiency Proc (60%):</strong> Round refunded! Consumed <strong>0 Ammo</strong> from magazine.' : 'Rapid automatic spray consumes standard ammunition.'}
            </div>
          </div>
        `;
      }
    }
    
    const modDmgMult = 1 + (modDmgBonusPct / 100);
    const moddedBaseRoll = Math.round(roll.total * modDmgMult);

    let baseDamage = moddedBaseRoll;
    let critMult = 1;
    let critLabel = "";
    let critColor = "#e2e8f0";
    let isCrit = false;
    
    const isFinisher = !!options.isFinisher;

    if (isFinisher) {
      // Finisher base damage multiplier of x2.0
      baseDamage = Math.round(moddedBaseRoll * 2.0);
    } else {
      // Calculate standard critical hit with mod bonuses
      const baseCritChance = Number(weapon.system.critChance) !== undefined && !isNaN(Number(weapon.system.critChance)) ? Number(weapon.system.critChance) : 5;
      const critChance = Math.round(baseCritChance * (1 + modCritChancePct / 100)) + fortuneCritBonus + higasaCritBonus + ax52CritBonus + wallLatchCritBonus;
      const baseCritMultiplier = Number(weapon.system.critMultiplier) !== undefined && !isNaN(Number(weapon.system.critMultiplier)) ? Number(weapon.system.critMultiplier) : 2.0;
      const effCritMultiplier = 1 + (baseCritMultiplier - 1) * (1 + modCritMultPct / 100);

      const guaranteedTiers = Math.floor(critChance / 100);
      const remainingChance = critChance % 100;
      let critTier = guaranteedTiers;
      const rollVal = Math.floor(Math.random() * 100) + 1;
      if (rollVal <= remainingChance) {
        critTier += 1;
      }
      let vigilanteProc = false;
      if (hasVigilanteEnhance && critTier > 0 && Math.random() < 0.20) {
        critTier += 1;
        vigilanteProc = true;
      }
      isCrit = critTier > 0;
      if (isCrit) {
        critMult = 1 + critTier * (effCritMultiplier - 1);
        const roundedMult = Math.round(critMult * 10) / 10;
        if (critTier === 1) {
          critLabel = ` (CRIT! x${roundedMult}${vigilanteProc ? ' [Vigilante]' : ''})`;
          critColor = "#f1c40f";
        } else if (critTier === 2) {
          critLabel = ` (ORANGE CRIT! x${roundedMult}${vigilanteProc ? ' [Vigilante]' : ''})`;
          critColor = "#e67e22";
        } else {
          critLabel = ` (RED CRIT! x${roundedMult}${vigilanteProc ? ' [Vigilante]' : ''})`;
          critColor = "#e74c3c";
        }
      }
      baseDamage = Math.round(moddedBaseRoll * critMult * multishotPellets);

      if (isHigasa && !isAltFire && isCrit && isKoumei) {
        const curMag = Number(weapon.system.magazine?.value) || 0;
        const maxMag = Number(weapon.system.magazine?.max) || 36;
        const refundedMag = Math.min(maxMag, curMag + 6);
        await weapon.update({ "system.magazine.value": refundedMag });

        higasaHtml = higasaHtml.replace('<div id="higasa-koumei-crit-slot"></div>', `
          <div style="background: linear-gradient(90deg, rgba(255, 215, 0, 0.2), rgba(0, 229, 255, 0.2)); border: 1px solid #ffd700; border-radius: 4px; padding: 4px 6px; margin-top: 6px; font-size: 11px; color: #ffd700; text-align: center;">
            <i class="fas fa-sparkles"></i> <strong>Koumei Signature Synergy:</strong> Critical hit restored <strong>+6 Rounds</strong> to magazine (${curMag} ➔ ${refundedMag}) & supercharged Canopy Shield!
          </div>
        `);
      } else if (higasaHtml.includes('id="higasa-koumei-crit-slot"')) {
        higasaHtml = higasaHtml.replace('<div id="higasa-koumei-crit-slot"></div>', '');
      }
    }

    let finalDamage = baseDamage;

    // Paralysis vulnerability check (targeted enemy takes +X% melee damage)
    if (isMelee && game.user.targets.size > 0) {
      const targetToken = game.user.targets.first();
      const targetActor = targetToken?.actor;
      if (targetActor) {
        const paralysisEffect = targetActor.effects.find(e => !e.disabled && (e.statuses?.has("paralysis") || e.flags?.core?.statusId === "paralysis" || e.name.startsWith("Paralysis")));
        if (paralysisEffect) {
          let vulnPercent = 20; // default 20%
          if (paralysisEffect.name.includes("IV")) vulnPercent = 50;
          else if (paralysisEffect.name.includes("III")) vulnPercent = 40;
          else if (paralysisEffect.name.includes("II")) vulnPercent = 30;

          const vulnBonus = Math.round(roll.total * (vulnPercent / 100));
          finalDamage += vulnBonus;

          vulnerabilityHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #ffaa00; font-size: 11px;">
              <span>💥 Paralysis Vulnerability (+${vulnPercent}%):</span>
              <strong style="color: #ffaa00;">+${vulnBonus} Damage</strong>
            </div>
          `;
        }
      }
    }

    // Damage vulnerability check (targeted enemy takes +X% damage from all sources, e.g. Petrified, Demonium)
    if (game.user.targets.size > 0) {
      const targetToken = game.user.targets.first();
      const targetActor = targetToken?.actor;
      if (targetActor) {
        const vulnEffect = targetActor.effects.find(e => !e.disabled && (
          e.statuses?.has("petrified") ||
          e.statuses?.has("vulnerable") ||
          e.flags?.core?.statusId === "petrified" ||
          e.flags?.["warframe-ttrpg"]?.damageVuln != null ||
          e.name === "Petrified" ||
          e.name === "Damage Vulnerability"
        ));
        if (vulnEffect) {
          const vulnPct = Number(vulnEffect.flags?.["warframe-ttrpg"]?.damageVuln) || 50;
          const vulnBonus = Math.round(finalDamage * (vulnPct / 100));
          finalDamage += vulnBonus;
          const vulnName = vulnEffect.name || "Damage Vulnerability";
          const vulnColor = vulnName === "Petrified" ? "#e59866" : "#e056fd";
          const vulnIcon = vulnName === "Petrified" ? "🪨" : "🔮";
          vulnerabilityHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: ${vulnColor}; font-size: 11px;">
              <span>${vulnIcon} ${vulnName} (+${vulnPct}%):</span>
              <strong style="color: ${vulnColor};">+${vulnBonus} Damage</strong>
            </div>
          `;
        }
      }
    }

    // Vauban passive check: +25% damage against incapacitated targets
    const isVauban = this.system.details?.frameClass === "Vauban";
    let vaubanPassiveHtml = "";
    if (isVauban && game.user.targets.size > 0) {
      const targetToken = game.user.targets.first();
      const targetActor = targetToken?.actor;
      if (targetActor && targetActor.isIncapacitated()) {
        const passiveBonus = Math.round(finalDamage * 0.25);
        finalDamage += passiveBonus;
        vaubanPassiveHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #e67e22; font-size: 11px;">
            <span>💥 Technologist's Demolition (+25%):</span>
            <strong style="color: #e67e22;">+${passiveBonus} Damage</strong>
          </div>
        `;
      }
    }

    // Torment blessing check (+30% strike damage)
    if (fortuneDamageBonusPct > 0) {
      const tormentBonus = Math.round(finalDamage * (fortuneDamageBonusPct / 100));
      finalDamage += tormentBonus;
      tormentHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #e67e22; font-size: 11px;">
          <span>🎲 Torment Blessing (+30%):</span>
          <strong style="color: #e67e22;">+${tormentBonus} Damage</strong>
        </div>
      `;
    }

    // Bayonet Rush bonus damage (+50% to melee strike)
    if (isVinquibus && (isMelee || isAltFire) && hadBayonetRush) {
      bayonetRushBonus = Math.round(finalDamage * 0.50);
      finalDamage += bayonetRushBonus;
    }

    // Uriel Legion Heat bonus (+25% Heat damage when fiends are active)
    if (isVinquibus && isUriel) {
      const catenach = this.system.legion?.catenach;
      const gulphagor = this.system.legion?.gulphagor;
      const vythelas = this.system.legion?.vythelas;
      const hasActiveFiends = (catenach && catenach.active) || (gulphagor && gulphagor.active) || (vythelas && vythelas.active);
      if (hasActiveFiends) {
        vinquibusHeatBonus = Math.round(finalDamage * 0.25);
        finalDamage += vinquibusHeatBonus;
        vinquibusSynergyHtml = vinquibusSynergyHtml.replace('+0 Damage', `+${vinquibusHeatBonus} Damage`);
      }
    }

    if (ax52ShredBonus > 0) {
      finalDamage += ax52ShredBonus;
    }

    // Elemental damage calculation from active elements & physical mods
    let totalElementalDmg = 0;
    const elementalBreakdownHtml = [];
    const elemColors = {
      Heat: "#ff7043", Cold: "#29b6f6", Electricity: "#ab47bc", Toxin: "#66bb6a",
      Blast: "#ffa726", Radiation: "#ffee58", Gas: "#9ccc65", Magnetic: "#26c6da", Viral: "#ec407a", Corrosive: "#d4e157",
      Slash: "#ef5350", Puncture: "#26a69a", Impact: "#b0bec5"
    };

    for (const [el, val] of Object.entries(activeElements)) {
      if (val > 0) {
        const col = elemColors[el] || "#00e5ff";
        const elDmg = Math.round(moddedBaseRoll * (val / 100) * critMult * multishotPellets);
        totalElementalDmg += elDmg;
        elementalBreakdownHtml.push(`
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px; color: ${col}; font-size: 11px;">
            <span>🔹 ${el} (+${val}%):</span>
            <strong style="color: ${col};">+${elDmg} Damage</strong>
          </div>
        `);
      }
    }

    for (const [phys, val] of Object.entries(physicalElements)) {
      if (val > 0) {
        const col = elemColors[phys] || "#ccd6f6";
        const physDmg = Math.round(moddedBaseRoll * (val / 100) * critMult * multishotPellets);
        totalElementalDmg += physDmg;
        elementalBreakdownHtml.push(`
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px; color: ${col}; font-size: 11px;">
            <span>🔸 ${phys} (+${val}%):</span>
            <strong style="color: ${col};">+${physDmg} Damage</strong>
          </div>
        `);
      }
    }

    finalDamage += totalElementalDmg;

    // Condition Overload check (+80% Melee damage per active status effect on target)
    let conditionOverloadHtml = "";
    if (hasConditionOverload && isMelee && game.user.targets.size > 0) {
      const targetToken = game.user.targets.first();
      const targetActor = targetToken?.actor;
      if (targetActor) {
        const activeStatusCount = targetActor.effects.filter(e => !e.disabled && (e.statuses?.size > 0 || e.flags?.core?.statusId)).length;
        if (activeStatusCount > 0) {
          const coBonusPct = activeStatusCount * 80;
          const coBonus = Math.round(finalDamage * (coBonusPct / 100));
          finalDamage += coBonus;
          conditionOverloadHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #e67e22; font-size: 11px;">
              <span>⚔️ Condition Overload (+${coBonusPct}% for ${activeStatusCount} Statuses):</span>
              <strong style="color: #e67e22;">+${coBonus} Damage</strong>
            </div>
          `;
        }
      }
    }

    // Status Chance & Proc resolution
    const baseStatusChance = Number(weapon.system.statusChance) !== undefined && !isNaN(Number(weapon.system.statusChance)) ? Number(weapon.system.statusChance) : 10;
    const effStatusChance = Math.round(baseStatusChance * (1 + modStatusChancePct / 100)) + fortuneStatusBonus + higasaStatusBonus + ax52StatusBonus;

    const statusRoll = Math.floor(Math.random() * 100) + 1;
    const didProcStatus = statusRoll <= effStatusChance;
    let statusProcHtml = "";

    const candidateTypes = [];
    for (const [el, val] of Object.entries(activeElements)) {
      if (val > 0) candidateTypes.push(el);
    }
    for (const [phys, val] of Object.entries(physicalElements)) {
      if (val > 0) candidateTypes.push(phys);
    }
    if (candidateTypes.length === 0 && damageType) {
      candidateTypes.push(damageType);
    }

    if (didProcStatus && candidateTypes.length > 0) {
      const procType = candidateTypes[Math.floor(Math.random() * candidateTypes.length)];
      const procCol = elemColors[procType] || "#00e5ff";
      statusProcHtml += `
        <div style="margin-top: 4px; border: 1px solid ${procCol}; background: rgba(0, 229, 255, 0.08); border-radius: 4px; padding: 4px 6px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
          <span style="color: ${procCol}; font-weight: bold;"><i class="fas fa-bolt"></i> Status Inflicted: ${procType} Proc</span>
          <span style="color: #8892b0; font-size: 9px;">(${statusRoll}% ≤ ${effStatusChance}%)</span>
        </div>
      `;

      const statusKey = procType.toLowerCase();
      if (game.user.targets.size > 0) {
        for (let targetToken of game.user.targets) {
          const targetActor = targetToken?.actor;
          if (targetActor && typeof targetActor.toggleStatusEffect === "function") {
            const hasAlready = targetActor.effects.some(e => !e.disabled && (e.statuses?.has(statusKey) || e.flags?.core?.statusId === statusKey));
            if (!hasAlready) {
              await targetActor.toggleStatusEffect(statusKey, { active: true });
            }
          }
        }
      }
    }

    // Hunter Munitions proc check (30% chance on Primary critical hit to apply Slash proc)
    let hunterMunitionsHtml = "";
    if (hasHunterMunitions && isCrit && !isMelee) {
      const hmRoll = Math.random() < 0.30;
      if (hmRoll) {
        hunterMunitionsHtml = `
          <div style="margin-top: 4px; border: 1px solid #ff4757; background: rgba(255, 71, 87, 0.12); border-radius: 4px; padding: 4px 6px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #ff4757; font-weight: bold;"><i class="fas fa-tint"></i> Hunter Munitions: Bleed Inflicted!</span>
            <span style="color: #ff4757; font-size: 9px; font-weight: bold;">(Slash Proc)</span>
          </div>
        `;
        if (game.user.targets.size > 0) {
          for (let targetToken of game.user.targets) {
            const targetActor = targetToken?.actor;
            if (targetActor && typeof targetActor.toggleStatusEffect === "function") {
              const hasSlash = targetActor.effects.some(e => !e.disabled && (e.statuses?.has("slash") || e.flags?.core?.statusId === "slash"));
              if (!hasSlash) {
                await targetActor.toggleStatusEffect("slash", { active: true });
              }
            }
          }
        }
      }
    }

    // Automatic damage or healing application to targeted tokens
    const isHealingWeapon = weapon.system.action === "heal" || !!options.isHealing;
    let targetDmgHtml = "";
    const combatTargets = getCombatTargets();
    if (combatTargets.length > 0) {
      for (let targetToken of combatTargets) {
        const targetActor = targetToken?.actor;
        if (!targetActor) continue;

        const res = await applyWarframeDamageOrHealing(targetActor, {
          amount: finalDamage,
          damageType,
          isHealing: isHealingWeapon,
          isFinisher,
          sourceName: weapon.name
        });

        if (res) {
          targetDmgHtml += formatDamageResolutionHtml(res);
        }
      }
    }

    // Magazine ammo consumption (for ranged weapons)
    if (!isMelee && (!isAltFire || isHigasa || isAX52) && weapon.system.magazine?.max > 0) {
      const curMag = Number(weapon.system.magazine.value) || 0;
      let ammoToConsume = isHigasa && isAltFire ? 12 : (isHigasa ? 3 : 1);
      if (isAX52 && !isAltFire && ax52SavedAmmo) {
        ammoToConsume = 0;
      }
      if (curMag > 0 && ammoToConsume > 0) {
        const newMag = Math.max(0, curMag - ammoToConsume);
        await weapon.update({ "system.magazine.value": newMag });
      }
    }

    if (isValkyr && isMelee) {
      const currentRage = Number(this.system.rage?.value) || 0;
      const newRage = Math.min(300, currentRage + 3);
      
      // Update actor rage and flag
      await this.update({ 
        "system.rage.value": newRage,
        "flags.warframe-ttrpg.rageBuiltThisRound": true 
      });

      // Calculate rage damage scaling
      const rageBonus = Math.round(roll.total * (currentRage / 100));
      finalDamage = finalDamage + rageBonus;

      rageDetailsHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; border-top: 1px solid rgba(231, 76, 60, 0.2); padding-top: 4px; font-size: 11px;">
          <span style="color: #e74c3c;"><i class="fas fa-fire"></i> Rage (+${currentRage}%):</span>
          <span style="color: #e74c3c; font-weight: bold;">+${rageBonus}</span>
        </div>
        <div style="font-size: 9px; color: rgba(255,255,255,0.4); text-align: right; margin-top: 2px;">
          Gained +3% Rage (Current: ${newRage}%)
        </div>
      `;

      // If Hysteria is active, perform lifesteal
      const hasStatus = (statusId) => {
        return this.effects.some(e => !e.disabled && (e.statuses?.has(statusId) || e.flags?.core?.statusId === statusId));
      };
      if (hasStatus("hysteria")) {
        const hysteriaItem = this.items.find(i => i.type === "ability" && i.name.startsWith("Hysteria"));
        const name = hysteriaItem?.name || "";
        const healAmount = name.includes("IV") ? 100 : name.includes("III") ? 90 : name.includes("II") ? 80 : 70;
        
        const currentHP = Number(this.system.health?.value) || 0;
        const maxHP = Number(this.system.health?.max) || 100;
        const newHP = Math.min(maxHP, currentHP + healAmount);
        
        await this.update({ "system.health.value": newHP });

        lifestealHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #2ecc71; font-size: 11px;">
            <span>💚 Hysteria Lifesteal:</span>
            <strong>+${healAmount} HP</strong>
          </div>
        `;
      }
    }

    let speedHtml = "";
    if (isMelee) {
      let meleeSpeedBonus = 0;
      for (let effect of this.effects) {
        if (effect.disabled) continue;
        for (let change of effect.changes) {
          if (change.key === "system.meleeSpeed.value") {
            meleeSpeedBonus += Number(change.value) || 0;
          }
        }
      }

      if (meleeSpeedBonus > 0) {
        let actionEconomyText = "";
        const fullAttacks = Math.floor(meleeSpeedBonus / 50);
        const remainder = meleeSpeedBonus % 50;

        if (fullAttacks > 0) {
          actionEconomyText = `Can make ${fullAttacks} additional Melee Attack${fullAttacks > 1 ? 's' : ''} on your turn!`;
          if (remainder >= 10) {
            actionEconomyText += ` (Plus 1 more attack as a Quick Action!)`;
          }
        } else {
          actionEconomyText = "Can make 1 additional Melee Attack on your turn as a Quick Action!";
        }

        speedHtml = `
          <div style="display: flex; flex-direction: column; margin-top: 6px; border-top: 1px dashed rgba(0, 229, 255, 0.15); padding-top: 6px; font-size: 11px; color: #00e5ff;">
            <span style="font-weight: bold; text-transform: uppercase; font-family: 'Orbitron', sans-serif;">⚡ Melee Speed (+${meleeSpeedBonus}%):</span>
            <span style="color: #ccd6f6; margin-top: 2px;">${actionEconomyText}</span>
          </div>
        `;
      }
    }

    let cardBorderLeft = isFinisher ? 'border-left: 3px solid #ff2a5f;' : (isAltFire ? (isVinquibus ? 'border-left: 3px solid #e67e22;' : (isAX52 ? 'border-left: 3px solid #2ecc71;' : 'border-left: 3px solid #9b59b6;')) : (isVinquibus ? 'border-left: 3px solid #f39c12;' : (isDualKamas ? 'border-left: 3px solid #e67e22;' : (isAX52 ? 'border-left: 3px solid #3498db;' : ''))));
    let cardHeaderBorder = isFinisher ? 'rgba(255, 42, 95, 0.3)' : (isAltFire ? (isVinquibus ? 'rgba(230, 126, 34, 0.4)' : (isAX52 ? 'rgba(46, 204, 113, 0.4)' : 'rgba(155, 89, 182, 0.4)')) : (isVinquibus ? 'rgba(243, 156, 18, 0.3)' : (isDualKamas ? 'rgba(230, 126, 34, 0.3)' : (isAX52 ? 'rgba(52, 152, 219, 0.3)' : 'rgba(0, 229, 255, 0.2)'))));
    let cardTitleSuffix = isFinisher ? 'Finisher' : (isAltFire ? (isVinquibus ? 'Bayonet Strike' : (isAX52 ? 'Aimed Precision' : 'Canopy Beam')) : (isVinquibus && isMelee ? 'Bayonet Strike' : (isVinquibus && !isMelee ? 'Rifle Shot' : (isDualKamas ? 'Twin Sickle Strike' : (isAX52 ? 'Full-Auto Spray' : 'Attack')))));
    let cardSubtitle = isFinisher ? 'Melee Finisher' : (isAltFire ? (isVinquibus ? 'Alt-Fire Bayonet' : (isAX52 ? 'ADS Precision' : 'Alt-Fire Beam')) : (isVinquibus && isMelee ? 'Melee Stance' : (isVinquibus && !isMelee ? 'Semi-Auto Rifle' : (isDualKamas ? 'Dual Swords' : (isAX52 ? 'Assault Rifle' : (weapon.system.type || "Weapon"))))));
    let cardSubtitleColor = isFinisher ? '#ff2a5f' : (isAltFire ? (isVinquibus ? '#f39c12' : (isAX52 ? '#2ecc71' : '#d6a2e8')) : (isVinquibus ? '#f39c12' : (isDualKamas ? '#e67e22' : (isAX52 ? '#3498db' : '#00e5ff'))));

    const cardContent = `
      <div class="warframe-chat-card weapon-card" style="font-family: 'Inter', sans-serif; ${cardBorderLeft}">
        <div class="card-header" style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid ${cardHeaderBorder}; padding-bottom: 8px; margin-bottom: 10px;">
          <img src="${weapon.img}" width="30" height="30" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;" />
          <div>
            <h3 style="font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: bold; color: #fff; margin: 0;">${weapon.name} ${cardTitleSuffix}</h3>
            <span style="font-size: 9px; color: ${cardSubtitleColor}; text-transform: uppercase;">${cardSubtitle}</span>
          </div>
        </div>
        <div class="card-body" style="font-size: 12px; color: #ccd6f6;">
          ${options.isReaction ? `
            <div style="margin-bottom: 6px; padding: 4px 8px; background: rgba(231, 76, 60, 0.15); border: 1px solid rgba(231, 76, 60, 0.4); border-radius: 4px; font-size: 11px; color: #ff7675; font-weight: bold; display: flex; align-items: center; gap: 6px;">
              <i class="fas fa-bolt"></i> Riposte d'Opportunité (Action Réaction Tenno)
            </div>
          ` : ""}
          ${slottedModList.length > 0 ? `
            <div style="margin-bottom: 6px; padding: 4px 6px; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 4px; font-size: 10px; color: #8892b0;">
              <span style="color: #00e5ff; font-weight: bold;"><i class="fas fa-microchip"></i> Slotted Mods (${slottedModList.length}):</span>
              <span style="color: #ccd6f6;">${slottedModList.join(", ")}</span>
            </div>
          ` : ""}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span>Base Roll (${damageType}):</span>
            <span style="color: #ccd6f6; font-weight: bold;">${roll.total}${modDmgBonusPct > 0 ? ` ➔ Modded (+${modDmgBonusPct}%): ${moddedBaseRoll}` : ''}</span>
          </div>
          ${multishotHtml}
          ${isFinisher ? `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #ff2a5f; font-size: 11px;">
              <span>💀 Finisher Execution (x2.0):</span>
              <strong style="color: #ff2a5f;">${moddedBaseRoll} x 2.0</strong>
            </div>
          ` : `
            ${isCrit ? `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: ${critColor}; font-size: 11px;">
                <span>✨ Critical Hit ${critLabel}:</span>
                <strong style="color: ${critColor};">${moddedBaseRoll} x ${Math.round(critMult * 10) / 10}</strong>
              </div>
            ` : ""}
          `}
          ${comboHtml}
          ${rageDetailsHtml}
          ${vulnerabilityHtml}
          ${vaubanPassiveHtml}
          ${tormentHtml}
          ${wallLatchHtml}
          ${bayonetRushBonus > 0 ? `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #f39c12; font-size: 11px;">
              <span>💥 Bayonet Rush (+50%):</span>
              <strong style="color: #f39c12;">+${bayonetRushBonus} Damage</strong>
            </div>
          ` : ""}
          ${vinquibusHeatBonus > 0 ? `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #e74c3c; font-size: 11px;">
              <span>🔥 Legion Consecration (+25% Heat):</span>
              <strong style="color: #e74c3c;">+${vinquibusHeatBonus} Damage</strong>
            </div>
          ` : ""}
          ${ax52ShredBonus > 0 ? `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #2ecc71; font-size: 11px;">
              <span>🛡️ Armor Shred (+5 Puncture):</span>
              <strong style="color: #2ecc71;">+${ax52ShredBonus} Damage</strong>
            </div>
          ` : ""}
          ${elementalBreakdownHtml.join('')}
          ${conditionOverloadHtml}
          ${statusProcHtml}
          ${hunterMunitionsHtml}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 6px; font-size: 13px;">
            <span style="font-weight: bold; color: #fff;">${isFinisher ? 'Finisher Damage (True):' : (isAltFire ? (isVinquibus ? 'Bayonet Strike Damage:' : (isAX52 ? 'Aimed Shot Damage:' : 'Alt-Fire Beam Damage:')) : 'Total Damage:')}</span>
            <span style="color: ${isFinisher ? '#ff2a5f' : (isAltFire ? (isVinquibus ? '#f39c12' : (isAX52 ? '#2ecc71' : '#d6a2e8')) : (isVinquibus ? '#f39c12' : (isAX52 ? '#3498db' : '#ffaa00')))} ; font-weight: bold; font-size: 15px;">${finalDamage}</span>
          </div>
          ${isFinisher ? `
            <div style="font-size: 10px; color: #ff2a5f; font-style: italic; margin-top: 4px; text-align: center;">
              ⚠️ Bypasses Shields and Armor! Applied directly to target Health.
            </div>
          ` : ""}
          ${lifestealHtml}
          ${amanataHtml}
          ${higasaHtml}
          ${vinquibusHtml}
          ${vinquibusSynergyHtml}
          ${dualKamasHtml}
          ${ax52Html}
          <div style="margin-top: 6px; font-size: 11px; display: flex; justify-content: space-between;">
            <span>Range: <strong>${fortuneReachText || (isVinquibus && isAltFire ? "Melee (8 ft)" : weapon.system.range) || (isMelee ? "Melee" : "50m")}</strong></span>
            <span>Status Chance: <strong>${effStatusChance}%</strong></span>
          </div>
          ${targetDmgHtml}
          ${speedHtml}
          ${renderCombatActionButtons({ damage: finalDamage, damageType, isFinisher })}
        </div>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: cardContent
    });
  }

  /**
   * Safe auto-grant helper
   */
  async checkAndGrantAdvancements(forceFrame = null) {
    if (this.type !== "warframe") return;

    const equippedFrame = forceFrame || this.items.find(i => i.type === "warframe");
    if (!equippedFrame || !equippedFrame.system) {
      const toDelete = [];
      const pack = game.packs.get("warframe-ttrpg.warframes");
      const classFeatNames = new Set();
      if (pack) {
        try {
          const index = await pack.getIndex();
          for (let ent of index) {
            if (ent.name !== "Acrobatic Dodge") {
              classFeatNames.add(ent.name);
              classFeatNames.add(ent.name.replace(/\s+(III|II|I|IV|V)$/i, "").trim());
            }
          }
        } catch (e) {}
      }

      for (let item of this.items) {
        if (item.type === "ability") {
          const sourceId = item.flags?.core?.sourceId || "";
          const isFromCompendium = sourceId.startsWith("Compendium.warframe-ttrpg.warframes.");
          const baseName = item.name.replace(/\s+(III|II|I|IV|V)$/i, "").trim();
          const matchesClassName = classFeatNames.has(item.name) || classFeatNames.has(baseName);

          if (isFromCompendium || matchesClassName) {
            toDelete.push(item.id);
          }
        }
      }
      if (toDelete.length > 0) {
        console.log(`Warframe TTRPG | Unequipped Warframe - cleaning up ${toDelete.length} passive/active advancement items...`);
        await this.deleteEmbeddedDocuments("Item", toDelete);
      }
      return;
    }

    const level = Number(this.system.details?.level?.value) || 1;
    let advancements = equippedFrame.system.advancements || {};

    const UUID_ALIASES = {
      "Compendium.warframe-ttrpg.warframes.urielpassive000001": "Compendium.warframe-ttrpg.warframes.urielpassive0001",
      "Compendium.warframe-ttrpg.warframes.urielpower0000001": "Compendium.warframe-ttrpg.warframes.urielpower000011",
      "Compendium.warframe-ttrpg.warframes.vaubanpower00011": "Compendium.warframe-ttrpg.warframes.vaubanpower00111",
      "Compendium.warframe-ttrpg.warframes.speedinc0000001": "Compendium.warframe-ttrpg.warframes.speedincrease001"
    };

    // Fallback: If equippedFrame has missing or truncated advancements, resolve full advancements from compendium
    if (Object.keys(advancements).length < 5) {
      const pack = game.packs?.get("warframe-ttrpg.warframes");
      if (pack) {
        try {
          const index = await pack.getIndex({ fields: ["name", "type"] });
          const matchEnt = index.find(e => e.type === "warframe" && e.name.toLowerCase() === equippedFrame.name.toLowerCase());
          if (matchEnt) {
            const canonicalDoc = await pack.getDocument(matchEnt._id || matchEnt.id);
            if (canonicalDoc?.system?.advancements) {
              advancements = canonicalDoc.system.advancements;
              await equippedFrame.update({ "system.advancements": advancements }).catch(() => {});
            }
          }
        } catch (err) {
          console.warn("Warframe TTRPG | Failed to resolve canonical advancements from pack:", err);
        }
      }
    }

    const uuidsToGrant = [];
    for (let adv of Object.values(advancements)) {
      if (adv.type === "GrantItems" && Number(adv.level) <= level) {
        if (adv.uuids) {
          for (let uuid of adv.uuids) {
            const resolvedUuid = UUID_ALIASES[uuid] || uuid;
            if (resolvedUuid) uuidsToGrant.push(resolvedUuid);
          }
        }
      }
    }

    const itemsToCreate = [];
    const itemIdsToDelete = [];

    // Group the granted items by base name if they are abilities
    const grantedItems = [];
    for (let uuid of uuidsToGrant) {
      try {
        const resolvedUuid = UUID_ALIASES[uuid] || uuid;
        let itemDoc = await fromUuid(resolvedUuid);
        if (!itemDoc) {
          const pack = game.packs?.get("warframe-ttrpg.warframes");
          if (pack) {
            const idMatch = resolvedUuid.match(/Compendium\.warframe-ttrpg\.warframes\.([a-zA-Z0-9_-]+)/);
            if (idMatch) {
              itemDoc = await pack.getDocument(idMatch[1]);
            }
          }
        }
        if (itemDoc) {
          grantedItems.push(itemDoc);
        }
      } catch (e) {
        console.error("Warframe TTRPG | Failed to load uuid: " + uuid, e);
      }
    }

    const getBaseAbilityName = (name) => {
      return name.replace(/\s+(III|II|I|IV|V)$/i, "").trim();
    };

    const getAbilityTier = (name) => {
      if (name.endsWith(" III")) return 3;
      if (name.endsWith(" II")) return 2;
      return 1;
    };

    // Filter abilities and non-abilities
    const bestGrants = {};
    const nonAbilitiesToGrant = [];

    for (let itemDoc of grantedItems) {
      if (itemDoc.type === "ability") {
        const baseName = getBaseAbilityName(itemDoc.name);
        const tier = getAbilityTier(itemDoc.name);
        if (!bestGrants[baseName] || tier > getAbilityTier(bestGrants[baseName].name)) {
          bestGrants[baseName] = itemDoc;
        }
      } else {
        nonAbilitiesToGrant.push(itemDoc);
      }
    }

    // Handle Level Down / Advancement Revocation: identify feats/abilities from levels > current level
    const uuidsToRevoke = [];
    for (let adv of Object.values(advancements)) {
      if (adv.type === "GrantItems" && Number(adv.level) > level && adv.uuids) {
        for (let uuid of adv.uuids) {
          const resolvedUuid = UUID_ALIASES[uuid] || uuid;
          if (resolvedUuid) uuidsToRevoke.push(resolvedUuid);
        }
      }
    }

    const revokedNames = new Set();
    for (let uuid of uuidsToRevoke) {
      try {
        const resolvedUuid = UUID_ALIASES[uuid] || uuid;
        let sourceDoc = await fromUuid(resolvedUuid);
        if (!sourceDoc) {
          const pack = game.packs?.get("warframe-ttrpg.warframes");
          if (pack) {
            const idMatch = resolvedUuid.match(/Compendium\.warframe-ttrpg\.warframes\.([a-zA-Z0-9_-]+)/);
            if (idMatch) sourceDoc = await pack.getDocument(idMatch[1]);
          }
        }
        if (sourceDoc) {
          revokedNames.add(sourceDoc.name);
        }
      } catch (e) {
        console.error("Warframe TTRPG | Failed to load revoked uuid: " + uuid, e);
      }
    }

    // Determine what is allowed at the current level
    const allowedSourceIds = new Set(uuidsToGrant);
    const allowedNames = new Set(grantedItems.map(i => i.name));
    const allowedBaseNames = new Set(grantedItems.filter(i => i.type === "ability").map(i => getBaseAbilityName(i.name)));

    for (let item of this.items) {
      const sourceId = item.flags?.core?.sourceId;
      const isRevokedUuid = sourceId && uuidsToRevoke.includes(sourceId);
      const isRevokedName = revokedNames.has(item.name);
      
      let isRevokedAbility = false;
      if (item.type === "ability") {
        const baseName = getBaseAbilityName(item.name);
        isRevokedAbility = Array.from(revokedNames).some(n => getBaseAbilityName(n) === baseName);
      }

      if (isRevokedUuid || isRevokedName || isRevokedAbility) {
        // Only delete it if it is NOT allowed at the current level
        const isStillAllowedUuid = sourceId && allowedSourceIds.has(sourceId);
        const isStillAllowedName = allowedNames.has(item.name);
        
        let isStillAllowedAbility = false;
        if (item.type === "ability") {
          const baseName = getBaseAbilityName(item.name);
          isStillAllowedAbility = allowedBaseNames.has(baseName);
        }

        if (!isStillAllowedUuid && !isStillAllowedName && !isStillAllowedAbility) {
          if (!itemIdsToDelete.includes(item.id)) {
            itemIdsToDelete.push(item.id);
          }
        }
      }
    }

    // Process abilities
    const actorAbilities = this.items.filter(i => i.type === "ability");
    for (let [baseName, bestDoc] of Object.entries(bestGrants)) {
      const existingVersions = actorAbilities.filter(i => getBaseAbilityName(i.name) === baseName);
      const hasExactBest = existingVersions.some(i => i.name === bestDoc.name);
      if (!hasExactBest) {
        const itemData = bestDoc.toObject();
        delete itemData._id;
        itemData.flags = itemData.flags || {};
        itemData.flags.core = itemData.flags.core || {};
        itemData.flags.core.sourceId = bestDoc.uuid;
        itemsToCreate.push(itemData);
        existingVersions.forEach(i => itemIdsToDelete.push(i.id));
      } else {
        existingVersions.forEach(i => {
          if (i.name !== bestDoc.name) {
            itemIdsToDelete.push(i.id);
          }
        });
      }
    }

    // Process non-abilities (simple existence check by name)
    const actorItemNames = new Set(this.items.map(i => i.name));
    for (let doc of nonAbilitiesToGrant) {
      if (!actorItemNames.has(doc.name)) {
        const itemData = doc.toObject();
        delete itemData._id;
        itemData.flags = itemData.flags || {};
        itemData.flags.core = itemData.flags.core || {};
        itemData.flags.core.sourceId = doc.uuid;
        itemsToCreate.push(itemData);
      }
    }

    try {
      const debugInfo = {
        time: new Date().toISOString(),
        actorName: this.name,
        level: level,
        equippedFrame: equippedFrame.name,
        advancementsCount: Object.keys(advancements).length,
        uuidsToGrant: uuidsToGrant,
        itemsToCreate: itemsToCreate.map(i => i.name),
        itemIdsToDelete: itemIdsToDelete,
        existingItems: Array.from(actorItemNames)
      };
      const file = new File([JSON.stringify(debugInfo, null, 2)], "dom_debug.txt", { type: "text/plain" });
      await FilePicker.upload("data", "", file);
    } catch (e) {}

    // Execute deletions first, then creations
    if (itemIdsToDelete.length > 0) {
      console.log(`Warframe TTRPG | Cleaning up ${itemIdsToDelete.length} obsolete advancement items from ${this.name}...`);
      await this.deleteEmbeddedDocuments("Item", itemIdsToDelete);
    }

    if (itemsToCreate.length > 0) {
      console.log(`Warframe TTRPG | Automatically granting ${itemsToCreate.length} advancement items to ${this.name}...`);
      await this.createEmbeddedDocuments("Item", itemsToCreate);
    }
  }

  /**
   * Switch between Sirius & Orion twin forms
   */
  async switchTwinFrame() {
    const equippedFrame = this.items.find(i => i.type === "warframe");
    if (!equippedFrame) {
      ui.notifications.warn("Aucune Warframe équipée pour basculer !");
      return;
    }

    const currentName = equippedFrame.name.trim();
    const isSirius = currentName.toLowerCase().includes("sirius");
    const isOrion = currentName.toLowerCase().includes("orion");
    if (!isSirius && !isOrion) {
      ui.notifications.warn("Seuls Sirius & Orion peuvent basculer entre les formes jumelles !");
      return;
    }

    const targetName = isSirius ? "Orion" : "Sirius";
    const targetCompId = isSirius ? "wforion0class001" : "wfsiriusclass001";
    const targetImg = isSirius 
      ? "systems/warframe-ttrpg/asset/classe/Sirius & Orion (orion)_.webp"
      : "systems/warframe-ttrpg/asset/classe/Sirius & Orion (sirius)_.webp";

    ui.notifications.info(`Basculement de la forme de ${currentName} vers ${targetName}...`);

    // 1. Locate counterpart Warframe definition
    let targetDoc = null;
    const pack = game.packs.get("warframe-ttrpg.warframes");
    if (pack) {
      try {
        targetDoc = await pack.getDocument(targetCompId);
      } catch (e) {}
      if (!targetDoc) {
        try {
          const index = await pack.getIndex();
          const entry = index.find(e => e.type === "warframe" && e.name === targetName);
          if (entry) targetDoc = await pack.getDocument(entry._id || entry.id);
        } catch (e) {}
      }
    }

    if (!targetDoc) {
      targetDoc = game.items.find(i => i.type === "warframe" && i.name === targetName);
    }

    let newFrameObj;
    if (targetDoc) {
      newFrameObj = targetDoc.toObject();
      delete newFrameObj._id;
    } else {
      const classDef = newWarframeClasses.find(c => c._id === targetCompId || c.name === targetName);
      if (classDef) {
        newFrameObj = foundry.utils.deepClone(classDef);
        delete newFrameObj._id;
      }
    }

    if (!newFrameObj) {
      ui.notifications.error(`Impossible de localiser la classe ${targetName} !`);
      return;
    }

    // 2. Identify all Sirius / Orion specific abilities, passives, mechanics on actor to remove
    const twinPrefixes = ["sirius", "orion0", "orion"];
    const itemsToDelete = this.items.filter(i => {
      if (i.id === equippedFrame.id) return true;
      if (i.type === "ability" || i.type === "feat") {
        const idLower = i.id.toLowerCase();
        const sourceId = (i.flags?.core?.sourceId || "").toLowerCase();
        const nameLower = i.name.toLowerCase();
        return twinPrefixes.some(p => idLower.startsWith(p) || sourceId.includes(p) || nameLower.startsWith(p));
      }
      return false;
    }).map(i => i.id);

    if (itemsToDelete.length > 0) {
      await this.deleteEmbeddedDocuments("Item", itemsToDelete);
    }

    // 3. Create the new Warframe item
    const created = await this.createEmbeddedDocuments("Item", [newFrameObj]);
    const newFrame = created[0];

    // 4. Update actor avatar / portrait if currently showing the previous twin
    const currentImg = this.img || "";
    if (currentImg.includes("Sirius & Orion") || currentImg === "icons/svg/mystery-man.svg" || !currentImg) {
      await this.update({ img: targetImg, "prototypeToken.texture.src": targetImg });
    }

    // 5. Trigger advancement auto-grant for the new frame at current level
    if (newFrame) {
      await this.checkAndGrantAdvancements(newFrame);
    }

    // 6. Apply swap passive buff Active Effect
    const effectName = isSirius 
      ? "Binaire des Jumeaux : Focalisation du Néant (+25% Puissance)"
      : "Binaire des Jumeaux : Focalisation Solaire (+25% Efficacité)";
    const effectDesc = isSirius
      ? "Renforcé par Orion : +25% Puissance des Pouvoirs pour les prochains lancements, et +15% Vol de Vie en mêlée sous 50 d'Énergie."
      : "Renforcé par Sirius : +25% Efficacité des Pouvoirs pour les prochains lancements, et +5 régénération d'Énergie par round sous 50 d'Énergie.";
    const effectIcon = targetImg;

    const oldTwinEffects = this.effects.filter(e => !e.disabled && e.name.startsWith("Twin Binary")).map(e => e.id);
    if (oldTwinEffects.length > 0) {
      await this.deleteEmbeddedDocuments("ActiveEffect", oldTwinEffects);
    }

    await this.createEmbeddedDocuments("ActiveEffect", [{
      name: effectName,
      icon: effectIcon,
      origin: this.uuid,
      duration: { rounds: 3 },
      description: effectDesc,
      changes: isSirius ? [
        { key: "system.powerStrength.value", value: 25, mode: 2, priority: 20 }
      ] : [
        { key: "system.powerEfficiency.value", value: 25, mode: 2, priority: 20 }
      ],
      flags: {
        core: { statusId: "twin_binary" },
        "warframe-ttrpg": { isTwinBinary: true }
      }
    }]);

    // 7. Post Chat Message
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `
        <div style="background: linear-gradient(135deg, rgba(243, 156, 18, 0.1) 0%, rgba(155, 89, 182, 0.15) 100%); border: 1px solid #f39c12; border-radius: 6px; padding: 10px; font-family: 'Orbitron', sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <img src="${targetImg}" style="width: 32px; height: 32px; border-radius: 4px; border: 1px solid #f39c12; object-fit: contain;" />
            <div>
              <h3 style="margin: 0; color: #f1c40f; font-size: 13px; text-transform: uppercase;">✨ Transfert Céleste : ${targetName} ✨</h3>
              <span style="font-size: 9.5px; color: #cbd5e1; font-family: 'Inter', sans-serif;">Conscience basculée vers ${targetName}</span>
            </div>
          </div>
          <div style="font-size: 11px; color: #e2e8f0; font-family: 'Inter', sans-serif; line-height: 1.4;">
            ${targetName === "Orion" 
              ? "<strong>Orion</strong> prend le contrôle ! Octroie <strong>+25% Puissance des Pouvoirs</strong> et une férocité cosmique." 
              : "<strong>Sirius</strong> prend le commandement ! Octroie <strong>+25% Efficacité des Pouvoirs</strong> et une résonance solaire apaisante."}
          </div>
        </div>
      `
    });

    ui.notifications.info(`Successfully switched to ${targetName}!`);
  }

  /**
   * Sync active effects based on the selected focus nodes
   */
  async syncFocusActiveEffects(currentNodes = null) {
    if (!currentNodes) {
      currentNodes = this.getFlag("warframe-ttrpg", "focusNodes") || {};
    }
    const school = this.system.details?.operator;
    if (!school) return;

    let nodeDefs = {};
    if (school === "Madurai") {
      nodeDefs = {
        phoenixTalons: { name: "Phoenix Talons", icon: "icons/svg/fire.svg", changes: [{ key: "system.damageBonus.value", value: "10", mode: 2 }] },
        powerTransfer: { name: "Power Transfer", icon: "icons/svg/direction.svg", changes: [{ key: "system.castSpeedBonus.value", value: "20", mode: 2 }] },
        contaminationWave: { name: "Contamination Wave", icon: "icons/svg/shield.svg", changes: [{ key: "system.vulnerabilityBonus.value", value: "25", mode: 2 }] },
        phoenixFlame: { name: "Phoenix Flame", icon: "icons/svg/sun.svg", changes: [{ key: "system.heatDamageBonus.value", value: "15", mode: 2 }] },
        chainedSling: { name: "Chained Sling", icon: "icons/svg/chain.svg", changes: [{ key: "system.voidSlingBonus.value", value: "100", mode: 2 }] },
        voidFuel: { name: "Void Fuel", icon: "icons/svg/explosion.svg", changes: [{ key: "system.ammoEfficiencyBonus.value", value: "25", mode: 2 }] },
        savageSling: { name: "Savage Sling", icon: "icons/svg/hazard.svg", changes: [] },
        phoenixSpark: { name: "Phoenix Spark", icon: "icons/svg/daze.svg", changes: [] },
        innerFlare: { name: "Inner Flare", icon: "icons/svg/acid.svg", changes: [{ key: "system.powerStrength.value", value: "15", mode: 2 }] }
      };
    } else if (school === "Vazarin") {
      nodeDefs = {
        mendingTalons: { name: "Mending Talons", icon: "icons/svg/heal.svg", changes: [{ key: "system.healingBonus.value", value: "10", mode: 2 }] },
        protectiveDash: { name: "Protective Dash", icon: "icons/svg/shield.svg", changes: [] },
        pollutedWaters: { name: "Polluted Waters", icon: "icons/svg/water.svg", changes: [] },
        rejuvenatingTide: { name: "Rejuvenating Tide", icon: "icons/svg/drop.svg", changes: [] },
        slingShield: { name: "Sling Shield", icon: "icons/svg/circle.svg", changes: [] },
        aegisFlare: { name: "Aegis Flare", icon: "icons/svg/explosion.svg", changes: [] },
        reflectShield: { name: "Reflect Shield", icon: "icons/svg/refractor.svg", changes: [] },
        tidalSurge: { name: "Tidal Surge", icon: "icons/svg/wave.svg", changes: [] },
        squadRenew: { name: "Squad Renew", icon: "icons/svg/refresh.svg", changes: [] }
      };
    } else if (school === "Naramon") {
      nodeDefs = {
        affinitySpike: { name: "Affinity Spike", icon: "icons/svg/fire.svg", changes: [{ key: "system.meleeDamageBonus.value", value: "10", mode: 2 }] },
        sunderingStrike: { name: "Sundering Strike", icon: "icons/svg/daze.svg", changes: [] },
        woodRoots: { name: "Wood Roots", icon: "icons/svg/hazard.svg", changes: [] },
        surgingDash: { name: "Surging Dash", icon: "icons/svg/lightning.svg", changes: [{ key: "system.voidSlingBonus.value", value: "50", mode: 2 }] },
        powerSpike: { name: "Power Spike", icon: "icons/svg/chain.svg", changes: [{ key: "system.meleeAttackBonus.value", value: "2", mode: 2 }] },
        savageFinisher: { name: "Savage Finisher", icon: "icons/svg/skull.svg", changes: [] },
        thornedBind: { name: "Thorned Bind", icon: "icons/svg/blood.svg", changes: [] },
        killerRush: { name: "Killer Rush", icon: "icons/svg/running.svg", changes: [] },
        heartOfOak: { name: "Heart of Oak", icon: "icons/svg/heart.svg", changes: [] }
      };
    } else if (school === "Zenurik") {
      nodeDefs = {
        energyPulse: { name: "Energy Pulse", icon: "icons/svg/lightning.svg", changes: [{ key: "system.energy.max", value: "50", mode: 2 }] },
        innerGaze: { name: "Inner Gaze", icon: "icons/svg/bolt.svg", changes: [{ key: "system.energy.max", value: "20", mode: 2 }] },
        channeledShield: { name: "Channeled Shield", icon: "icons/svg/shield.svg", changes: [] },
        temporalShot: { name: "Temporal Shot", icon: "icons/svg/daze.svg", changes: [] },
        crystalShell: { name: "Crystal Shell", icon: "icons/svg/refractor.svg", changes: [{ key: "system.shields.max", value: "20", mode: 2 }] },
        voidFlow: { name: "Void Flow", icon: "icons/svg/explosion.svg", changes: [] },
        crystallineRecharge: { name: "Crystalline Recharge", icon: "icons/svg/time.svg", changes: [] },
        temporalStorm: { name: "Temporal Storm", icon: "icons/svg/hazard.svg", changes: [] },
        energyShield: { name: "Energy Shield", icon: "icons/svg/sun.svg", changes: [] }
      };
    } else if (school === "Unairu") {
      nodeDefs = {
        stoneSkin: { name: "Stone Skin", icon: "icons/svg/shield.svg", changes: [{ key: "system.armor.value", value: "50", mode: 2 }] },
        reinforcedReturn: { name: "Reinforced Return", icon: "icons/svg/direction.svg", changes: [{ key: "system.armor.value", value: "20", mode: 2 }] },
        staticShield: { name: "Static Shield", icon: "icons/svg/lightning.svg", changes: [] },
        voidShield: { name: "Void Shield", icon: "icons/svg/eye.svg", changes: [] },
        guardianShell: { name: "Guardian Shell", icon: "icons/svg/unconscious.svg", changes: [{ key: "system.shields.max", value: "30", mode: 2 }] },
        unairuWisp: { name: "Unairu Wisp", icon: "icons/svg/sun.svg", changes: [] },
        magneticCrush: { name: "Magnetic Crush", icon: "icons/svg/hazard.svg", changes: [] },
        voidSpine: { name: "Void Spine", icon: "icons/svg/blood.svg", changes: [] },
        stoneFortitude: { name: "Stone Fortitude", icon: "icons/svg/net.svg", changes: [] }
      };
    }

    const existingEffects = this.effects.filter(e => e.flags?.["warframe-ttrpg"]?.focusNode);
    const effectsToDelete = [];
    const effectsToCreate = [];

    // Check what to delete
    for (let effect of existingEffects) {
      const key = effect.flags?.["warframe-ttrpg"]?.focusNode;
      if (currentNodes[key] !== true || !nodeDefs[key]) {
        effectsToDelete.push(effect.id);
      }
    }

    // Check what to create
    for (let [key, def] of Object.entries(nodeDefs)) {
      if (currentNodes[key] === true) {
        const alreadyHas = existingEffects.some(e => e.flags?.["warframe-ttrpg"]?.focusNode === key);
        if (!alreadyHas) {
          effectsToCreate.push({
            name: `${school}: ${def.name}`,
            icon: def.icon,
            origin: this.uuid,
            disabled: false,
            flags: {
              "warframe-ttrpg": {
                focusNode: key
              }
            },
            changes: def.changes || []
          });
        }
      }
    }

    // Apply database updates
    if (effectsToDelete.length > 0) {
      await this.deleteEmbeddedDocuments("ActiveEffect", effectsToDelete);
    }
    if (effectsToCreate.length > 0) {
      await this.createEmbeddedDocuments("ActiveEffect", effectsToCreate);
    }
  }

  /** @override */
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
    if (changed.system?.details?.level) {
      this.checkAndGrantAdvancements();
    }
  }

  /** @override */
  _onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId) {
    super._onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId);
    if (embeddedName === "Item") {
      const frame = documents.find(d => d.type === "warframe");
      if (frame) {
        setTimeout(() => {
          this.checkAndGrantAdvancements(frame);
        }, 100);
      }
    }
  }

  /** @override */
  _onDeleteEmbeddedDocuments(embeddedName, documents, result, options, userId) {
    super._onDeleteEmbeddedDocuments(embeddedName, documents, result, options, userId);
    if (embeddedName === "Item") {
      const wasFrame = documents.some(d => d.type === "warframe");
      if (wasFrame) {
        setTimeout(() => {
          this.checkAndGrantAdvancements();
        }, 100);
      }
    }
  }

  /**
   * Toggle the Wall Latch (Prise Murale) status effect on this actor.
   * @param {boolean} [active] - Force active state if provided, otherwise toggle.
   * @returns {Promise<ActiveEffect|boolean>}
   */
  async toggleWallLatch(active) {
    const existing = this.effects.find(e => !e.disabled && (
      e.statuses?.has("wall_latch") ||
      e.flags?.core?.statusId === "wall_latch" ||
      e.name?.toLowerCase().includes("prise murale") ||
      e.name?.toLowerCase().includes("wall latch")
    ));

    const shouldEnable = active !== undefined ? !!active : !existing;
    if (shouldEnable) {
      if (existing) return existing;
      const statusDef = CONFIG.statusEffects.find(s => s.id === "wall_latch") || {
        id: "wall_latch",
        name: "Prise Murale (+15% Crit)",
        img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp"
      };
      return await this.createEmbeddedDocuments("ActiveEffect", [{
        name: statusDef.name,
        img: statusDef.img,
        icon: statusDef.img,
        statuses: ["wall_latch"],
        flags: {
          core: { statusId: "wall_latch" }
        }
      }]);
    } else {
      if (existing) {
        return await existing.delete();
      }
      return false;
    }
  }

  /**
   * Complete rest for the actor, restoring Health, Shields, Energy, unique frame resources, and Actions.
   * @returns {Promise<void>}
   */
  async rest() {
    const currentHealth = Number(this.system.health?.value) || 0;
    const currentShield = Number(this.system.shields?.value) || 0;
    const currentEnergy = Number(this.system.energy?.value) || 0;

    const maxHealth = Number(this.system.health?.max) || 100;
    const maxShield = Number(this.system.shields?.max) || 150;
    const maxEnergy = Number(this.system.energy?.max) || 100;

    const recoveredHealth = Math.max(0, maxHealth - currentHealth);
    const recoveredShield = Math.max(0, maxShield - currentShield);
    const recoveredEnergy = Math.max(0, maxEnergy - currentEnergy);

    const updates = {
      "system.health.value": maxHealth,
      "system.shields.value": maxShield,
      "system.energy.value": maxEnergy
    };

    // Frame-specific rest logic
    const frameClass = (this.system.details?.frameClass || "").toLowerCase();
    let frameRestSnippet = "";

    if (frameClass.includes("uriel") && this.system.legion) {
      updates["system.legion.catenach.health"] = 150;
      updates["system.legion.catenach.active"] = true;
      updates["system.legion.gulphagor.health"] = 150;
      updates["system.legion.gulphagor.active"] = true;
      updates["system.legion.vythelas.health"] = 150;
      updates["system.legion.vythelas.active"] = true;
      frameRestSnippet = `<div style="color: #bf55ec; font-size: 11px; margin-top: 4px;"><i class="fas fa-skull-crossbones"></i> <strong>Légion de Xata :</strong> Démons Catenach, Gulphagor et Vythelas ranimés à 150 PV !</div>`;
    }

    await this.update(updates);
    if (typeof this.resetCombatActions === "function") {
      await this.resetCombatActions();
    }

    // Sync base actor and tokens
    if (this.type === "warframe") {
      if (this.isToken) {
        const baseActor = game.actors.get(this.id);
        if (baseActor) await baseActor.update(updates);
      } else {
        const activeTokens = canvas.tokens?.placeables?.filter(t => t.actor?.id === this.id) || [];
        for (let token of activeTokens) {
          if (token.actor && token.actor !== this) {
            await token.actor.update(updates);
          }
        }
      }
    }

    // Refresh HUD if active
    if (globalThis.warframeTTRPG?.WarframeHUD) {
      globalThis.warframeTTRPG.WarframeHUD.render(this, null);
    }
    if (this.sheet?.rendered) {
      this.sheet.render(false);
    }

    ui.notifications.info(`${this.name} a pris un Repos. Toutes les ressources et actions sont restaurées au maximum !`);

    const cardContent = `
      <div class="warframe-chat-card rest-card" style="border: 1px solid rgba(0, 229, 255, 0.4); background: #0c111c; border-radius: 8px; padding: 12px; font-family: 'Outfit', sans-serif; color: #8892b0; box-shadow: 0 0 10px rgba(0,229,255,0.25);">
        <div class="card-header" style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0, 229, 255, 0.25); padding-bottom: 8px; margin-bottom: 10px;">
          <i class="fas fa-bed" style="color: #00e5ff; font-size: 16px; filter: drop-shadow(0 0 3px rgba(0, 229, 255, 0.5));"></i>
          <h3 style="margin: 0; color: #fff; font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">Repos Tenno Terminé</h3>
        </div>
        <div class="card-body" style="font-size: 11.5px; line-height: 1.5;">
          <p style="margin: 0 0 10px 0; color: #a0aec0;"><strong>${this.name}</strong> a complété une séquence de repos. Systèmes et actions réinitialisés.</p>
          <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.04); padding: 8px; border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="display: flex; align-items: center; gap: 6px;"><i class="fas fa-heart" style="color: #ff2a5f; width: 12px;"></i> Santé</span>
              <span style="color: #fff; font-weight: bold;">${maxHealth} <span style="color: #22c55e; font-size: 10px; font-weight: normal; margin-left: 4px;">(+${recoveredHealth})</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="display: flex; align-items: center; gap: 6px;"><i class="fas fa-shield-alt" style="color: #00e5ff; width: 12px;"></i> Boucliers</span>
              <span style="color: #fff; font-weight: bold;">${maxShield} <span style="color: #22c55e; font-size: 10px; font-weight: normal; margin-left: 4px;">(+${recoveredShield})</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="display: flex; align-items: center; gap: 6px;"><i class="fas fa-bolt" style="color: #ffd700; width: 12px;"></i> Énergie</span>
              <span style="color: #fff; font-weight: bold;">${maxEnergy} <span style="color: #22c55e; font-size: 10px; font-weight: normal; margin-left: 4px;">(+${recoveredEnergy})</span></span>
            </div>
          </div>
          ${frameRestSnippet}
        </div>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: cardContent
    });
  }
}

