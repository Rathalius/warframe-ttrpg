import { CharacterCreationWizard } from "./character-wizard.js";
import { applyWarframeDamageOrHealing, formatDamageResolutionHtml, getCombatTargets, renderCombatActionButtons } from "./combat-automation.js";

export class WarframeActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["warframe-sheet", "actor"],
      width: 720,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  /** @override */
  get template() {
    return `systems/warframe-ttrpg/templates/actor-${this.actor.type}-sheet.html`;
  }

  /** @override */
  async getData() {
    const context = await super.getData();
    const actorData = context.actor;

    // Ensure vitals exist and are synced on render if actor is uninitialized
    if (this.actor.isOwner && this.actor.type === "warframe") {
      const srcSys = this.actor._source?.system;
      if (srcSys && (srcSys.health?.value == null || srcSys.shields?.value == null || srcSys.energy?.value == null)) {
        this.actor.update({
          "system.health.value": this.actor.system.health?.max,
          "system.health.max": this.actor.system.health?.max,
          "system.shields.value": this.actor.system.shields?.max,
          "system.shields.max": this.actor.system.shields?.max,
          "system.energy.value": this.actor.system.energy?.max,
          "system.energy.max": this.actor.system.energy?.max
        }, { render: false });
      }
    }

    context.system = actorData.system;
    context.flags = actorData.flags;

    // Combat Actions State (Parkour, Action 1, Action 2, Réaction)
    let combatActions = this.actor.getFlag("warframe-ttrpg", "combatActions");
    if (!combatActions || typeof combatActions !== "object" || combatActions.action1 === undefined) {
      combatActions = { parkour: true, action1: true, action2: true, reaction: true };
    }
    context.combatActions = combatActions;

    // Calculate attribute modifiers (D&D style: floor((value - 10) / 2))
    if (context.system.attributes) {
      for (let [key, attr] of Object.entries(context.system.attributes)) {
        const score = Number(attr.value) || 0;
        const mod = Math.floor((score - 10) / 2);
        attr.mod = mod;
        attr.modLabel = mod >= 0 ? `+${mod}` : `${mod}`;
      }
    }

    // Calculate skill modifiers (D&D style: attr_modifier + proficiency_bonus)
    if (context.system.skills) {
      const rank = Number(context.system.details?.level?.value) || 1;
      const prof = 2 + Math.floor((rank - 1) / 5);
      context.proficiencyBonus = prof;

      for (let [key, skill] of Object.entries(context.system.skills)) {
        const attrKey = skill.attr;
        const attrMod = context.system.attributes[attrKey]?.mod || 0;
        
        let profLevel = 0;
        if (skill.value === true || skill.value === 1) {
          profLevel = 1;
        } else if (skill.value === 2 || skill.value === "expertise") {
          profLevel = 2;
        }

        if (context.system.traitsSkills && context.system.traitsSkills.includes(key)) {
          profLevel = Math.max(profLevel, 1);
        }

        const profMultiplier = profLevel === 2 ? 2 : (profLevel === 1 ? 1 : 0);
        let skillMod = attrMod + (profMultiplier * prof);
        if (key === "acrobatics" && context.actor.items.some(i => i.name === "Parkour Proficiency I")) {
          skillMod += 5;
        }
        if (key === "athletics" && context.actor.items.some(i => i.name === "Parkour Proficiency II")) {
          skillMod += 5;
        }

        skill.totalMod = skillMod;
        skill.totalModLabel = skillMod >= 0 ? `+${skillMod}` : `${skillMod}`;
        skill.isTrained = profLevel > 0;
        skill.profLevel = profLevel;
      }
    }

    // Filter items
    context.weapons = actorData.items.filter(i => i.type === "weapon");
    context.abilities = actorData.items.filter(i => i.type === "ability");



    // Inject active Focus abilities if unlocked
    const focusFlags = this.actor.getFlag("warframe-ttrpg", "focusNodes") || {};
    const schoolFocus = context.system.details?.operator;

    if (schoolFocus === "Madurai") {
      if (focusFlags.voidStrike === true) {
        context.abilities.push({
          id: "voidStrikeActive",
          name: "Madurai: Void Strike",
          img: "icons/svg/lightning.svg",
          system: {
            abilitySlot: "Focus",
            cost: 20,
            description: "Active: Consume 20 Energy to deal +50% Damage on next attack."
          },
          isFocusAbility: true
        });
      }
      if (focusFlags.voidRadiance === true) {
        context.abilities.push({
          id: "voidRadianceActive",
          name: "Madurai: Void Radiance",
          img: "icons/svg/light.svg",
          system: {
            abilitySlot: "Focus",
            cost: 25,
            description: "Active: Consume 25 Energy to emit a blinding wave of light, blinding close foes for 1 round."
          },
          isFocusAbility: true
        });
      }
    } else if (schoolFocus === "Vazarin") {
      if (focusFlags.guardianDash === true) {
        context.abilities.push({
          id: "guardianDashActive",
          name: "Vazarin: Guardian Dash",
          img: "icons/svg/shield.svg",
          system: {
            abilitySlot: "Focus",
            cost: 20,
            description: "Active: Consume 20 Energy to dash forward, granting yourself and all allies in your path a +50 Shield buffer."
          },
          isFocusAbility: true
        });
      }
      if (focusFlags.mendingWaves === true) {
        context.abilities.push({
          id: "mendingWavesActive",
          name: "Vazarin: Mending Waves",
          img: "icons/svg/tint.svg",
          system: {
            abilitySlot: "Focus",
            cost: 25,
            description: "Active: Consume 25 Energy to release a restorative pulse of water, healing close allies for 40 Health."
          },
          isFocusAbility: true
        });
      }
    } else if (schoolFocus === "Naramon") {
      if (focusFlags.openingSlam === true) {
        context.abilities.push({
          id: "openingSlamActive",
          name: "Naramon: Opening Slam",
          img: "icons/svg/falling.svg",
          system: {
            abilitySlot: "Focus",
            cost: 15,
            description: "Active: Consume 15 Energy to perform a wood-rooted slam, dealing damage and knocking down close foes."
          },
          isFocusAbility: true
        });
      }
      if (focusFlags.executingDash === true) {
        context.abilities.push({
          id: "executingDashActive",
          name: "Naramon: Executing Dash",
          img: "icons/svg/sword.svg",
          system: {
            abilitySlot: "Focus",
            cost: 20,
            description: "Active: Consume 20 Energy to dash forward with blinding speed, opening enemies in path to finishers."
          },
          isFocusAbility: true
        });
      }
    } else if (schoolFocus === "Zenurik") {
      if (focusFlags.wellspring === true) {
        context.abilities.push({
          id: "wellspringActive",
          name: "Zenurik: Wellspring",
          img: "icons/svg/gem.svg",
          system: {
            abilitySlot: "Focus",
            cost: 15,
            description: "Active: Consume 15 Energy to summon a crystalline wellspring, regenerating +5 Energy per round to allies inside for 3 rounds."
          },
          isFocusAbility: true
        });
      }
      if (focusFlags.temporalDrag === true) {
        context.abilities.push({
          id: "temporalDragActive",
          name: "Zenurik: Temporal Drag",
          img: "icons/svg/hourglass.svg",
          system: {
            abilitySlot: "Focus",
            cost: 20,
            description: "Active: Consume 20 Energy to emit a crystal wave slowing close foes, reducing their action speed/attacks by -2."
          },
          isFocusAbility: true
        });
      }
    } else if (schoolFocus === "Unairu") {
      if (focusFlags.magneticOutburst === true) {
        context.abilities.push({
          id: "magneticOutburstActive",
          name: "Unairu: Magnetic Outburst",
          img: "icons/svg/magnet.svg",
          system: {
            abilitySlot: "Focus",
            cost: 15,
            description: "Active: Consume 15 Energy to slam the ground, creating a magnetic pulse that strips 50% armor/shields from nearby foes."
          },
          isFocusAbility: true
        });
      }
      if (focusFlags.voidShadow === true) {
        context.abilities.push({
          id: "voidShadowActive",
          name: "Unairu: Void Shadow",
          img: "icons/svg/aura.svg",
          system: {
            abilitySlot: "Focus",
            cost: 20,
            description: "Active: Consume 20 Energy to cloak nearby allies, granting invisibility and +30% damage resistance for 1 round."
          },
          isFocusAbility: true
        });
      }
    }

    // Sort abilities by slot number (1, 2, 3, 4, then Focus)
    context.abilities.sort((a, b) => {
      const slotA = a.system.abilitySlot === "Focus" ? 99 : (Number(a.system.abilitySlot) || 1);
      const slotB = b.system.abilitySlot === "Focus" ? 99 : (Number(b.system.abilitySlot) || 1);
      return slotA - slotB;
    });

    // Separate active and passive abilities
    context.activeAbilities = [];
    context.passiveAbilities = [];
    for (let ab of context.abilities) {
      const isPassive = String(ab.system.abilitySlot || "").toLowerCase().includes("passive");
      if (isPassive) {
        context.passiveAbilities.push(ab);
      } else {
        context.activeAbilities.push(ab);
      }
    }

    context.mods = actorData.items.filter(i => i.type === "mod");

    // Check for Orokin Reactor flag
    const reactor = actorData.flags["warframe-ttrpg"]?.orokinReactor ?? false;
    let modCapacity = 30 + (reactor ? 30 : 0);

    // Detect equipped frame and special frame classifications
    const equippedFrame = actorData.items.find(i => i.type === "warframe");
    context.equippedFrame = equippedFrame;
    const frameClassName = (equippedFrame?.name || actorData.system.details?.frameClass || "").toLowerCase();
    const isJade = frameClassName.includes("jade");
    context.isJade = isJade;

    const isSirius = frameClassName.includes("sirius");
    const isOrion = frameClassName.includes("orion");
    const isTwinFrame = isSirius || isOrion;
    context.isTwinFrame = isTwinFrame;
    context.isSirius = isSirius;
    context.isOrion = isOrion;
    context.counterpartTwinName = isSirius ? "Orion" : (isOrion ? "Sirius" : "");

    // Mod grid capacity calculations
    let totalDrain = 0;
    const slots = ["aura", ...(isJade ? ["aura2"] : []), "exilus", "slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8"];
    context.modGrid = {};
    context.unequippedMods = context.mods.filter(m => !m.system.slot);

    for (let s of slots) {
      const polarity = context.system.modSlots?.[s]?.polarity || "none";
      const equippedMod = context.mods.find(m => m.system.slot === s);

      if (equippedMod) {
        const baseDrain = Number(equippedMod.system.drain) || 0;
        const modPolarity = equippedMod.system.polarity || "none";
        let actualCost = baseDrain;
        let polarityMatch = "neutral";

        if (s === "aura" || s === "aura2") {
          if (polarity !== "none" && modPolarity !== "none") {
            if (polarity === "universal" || modPolarity === "universal" || polarity === modPolarity) {
              actualCost = - (baseDrain * 2);
              polarityMatch = "match";
            } else {
              actualCost = - Math.max(0, baseDrain - 2);
              polarityMatch = "mismatch";
            }
          } else {
            actualCost = - baseDrain;
          }
        } else {
          if (polarity !== "none" && modPolarity !== "none") {
            if (polarity === "universal" || modPolarity === "universal" || polarity === modPolarity) {
              actualCost = Math.ceil(baseDrain / 2);
              polarityMatch = "match";
            } else {
              actualCost = Math.ceil(baseDrain * 1.25);
              polarityMatch = "mismatch";
            }
          } else {
            actualCost = baseDrain;
          }
        }

        equippedMod.actualDrain = actualCost;
        equippedMod.polarityMatch = polarityMatch;

        if (s === "aura" || s === "aura2") {
          modCapacity -= actualCost; // Negating negative cost increases capacity
        } else {
          totalDrain += actualCost;
        }

        context.modGrid[s] = equippedMod;
      } else {
        context.modGrid[s] = null;
      }
    }

    context.totalDrain = totalDrain;
    context.modCapacity = modCapacity;

    // Get equipped Warframe item
    context.equippedFrame = actorData.items.find(i => i.type === "warframe");

    // Get consumables
    context.consumables = actorData.items.filter(i => i.type === "consumable");

    // Calculate Armor Damage Reduction percentage
    const armorVal = Number(context.system.armor?.value) || 0;
    context.armorDR = Math.round((armorVal / (armorVal + 300)) * 100);

    // Map resistances with their icon paths
    context.resistances = {};
    if (context.system.resistances) {
      const iconMap = {
        impact: "EssentialImpactGlyph.png",
        puncture: "EssentialPunctureGlyph.png",
        slash: "EssentialSlashGlyph.png",
        heat: "HeatModBundleIcon.png",
        cold: "ColdModBundleIcon.png",
        electricity: "ElectricModBundleIcon.png",
        toxin: "300px-ToxinModBundleIcon.webp",
        blast: "EssentialBlastGlyph.png",
        corrosive: "EssentialCorrosiveGlyph.png",
        gas: "EssentialGasGlyph.png",
        magnetic: "EssentialMagneticGlyph.png",
        radiation: "EssentialRadiationGlyph.png",
        viral: "EssentialViralGlyph.png",
        void: "EssentialVoidGlyph.png"
      };

      for (let [type, status] of Object.entries(context.system.resistances)) {
        context.resistances[type] = {
          status: status,
          icon: `systems/warframe-ttrpg/asset/Element icon/${iconMap[type] || ""}`
        };
      }
    }

    // Map Active Effects
    context.effects = Array.from(this.actor.effects || []).map(e => {
      const effectData = typeof e.toObject === "function" ? e.toObject() : (foundry.utils?.duplicate ? foundry.utils.duplicate(e) : { ...e });
      effectData.id = e.id || e._id;
      effectData.description = e.description || e.flags?.customDescription || "";
      
      let sourceName = "Active Effect";
      if (e.origin && typeof fromUuidSync === "function") {
        try {
          const originObj = fromUuidSync(e.origin);
          if (originObj) sourceName = originObj.name;
        } catch (err) {}
      }
      effectData.sourceName = sourceName;
      return effectData;
    });

    // Calculate Rage percentage
    const rageVal = Number(context.system.rage?.value) || 0;
    context.ragePct = Math.round((Math.min(300, Math.max(0, rageVal)) / 300) * 100);

    // Calculate Rubble percentage
    if (!context.system.rubble) {
      context.system.rubble = { value: 0, max: 1500 };
    }
    const rubbleVal = Number(context.system.rubble?.value) || 0;
    const rubbleMax = Number(context.system.rubble?.max) || 1500;
    context.rubblePct = Math.round((Math.min(rubbleMax, Math.max(0, rubbleVal)) / rubbleMax) * 100);

    // Calculate Uriel Brimstone Fury percentage
    if (!context.system.brimstone) {
      context.system.brimstone = { value: 0, max: 100 };
    }
    const brimstoneVal = Number(context.system.brimstone?.value) || 0;
    context.brimstonePct = Math.round((Math.min(100, Math.max(0, brimstoneVal)) / 100) * 100);

    // Calculate Sevagoth Death Well percentage
    if (!context.system.deathWell) {
      context.system.deathWell = { value: 0, max: 100 };
    }
    const deathWellVal = Number(context.system.deathWell?.value) || 0;
    const deathWellMax = Number(context.system.deathWell?.max) || 100;
    context.deathWellPct = Math.round((Math.min(deathWellMax, Math.max(0, deathWellVal)) / deathWellMax) * 100);

    // Calculate Gauss Battery percentage
    if (!context.system.battery) {
      context.system.battery = { value: 0, max: 100 };
    }
    const batteryVal = Number(context.system.battery?.value) || 0;
    const batteryMax = Number(context.system.battery?.max) || 100;
    context.batteryPct = Math.round((Math.min(batteryMax, Math.max(0, batteryVal)) / batteryMax) * 100);

    // Calculate Ember Immolation percentage
    if (!context.system.immolation) {
      context.system.immolation = { value: 0, max: 100 };
    }
    const immolationVal = Number(context.system.immolation?.value) || 0;
    const immolationMax = Number(context.system.immolation?.max) || 100;
    context.immolationPct = Math.round((Math.min(immolationMax, Math.max(0, immolationVal)) / immolationMax) * 100);

    // Calculate Nidus Mutation Stacks percentage
    if (!context.system.mutation) {
      context.system.mutation = { value: 0, max: 100 };
    }
    const mutationVal = Number(context.system.mutation?.value) || 0;
    const mutationMax = Number(context.system.mutation?.max) || 100;
    context.mutationPct = Math.round((Math.min(mutationMax, Math.max(0, mutationVal)) / mutationMax) * 100);

    // Calculate Baruuk Restraint percentage (starts at 100%, erodes to 0%)
    if (!context.system.restraint) {
      context.system.restraint = { value: 100, max: 100 };
    }
    const restraintVal = Number(context.system.restraint?.value) ?? 100;
    const restraintMax = Number(context.system.restraint?.max) || 100;
    context.restraintPct = Math.round((Math.min(restraintMax, Math.max(0, restraintVal)) / restraintMax) * 100);


    // Calculate Legion Demons HP percentages
    if (!context.system.legion) {
      context.system.legion = {
        catenach: { active: false, health: 150, max: 150 },
        gulphagor: { active: false, health: 150, max: 150 },
        vythelas: { active: false, health: 150, max: 150 }
      };
    }
    const catenachHP = Number(context.system.legion.catenach?.health) || 0;
    const catenachMax = Number(context.system.legion.catenach?.max) || 150;
    context.catenachPct = Math.round((Math.min(catenachMax, Math.max(0, catenachHP)) / catenachMax) * 100);

    const gulphagorHP = Number(context.system.legion.gulphagor?.health) || 0;
    const gulphagorMax = Number(context.system.legion.gulphagor?.max) || 150;
    context.gulphagorPct = Math.round((Math.min(gulphagorMax, Math.max(0, gulphagorHP)) / gulphagorMax) * 100);

    const vythelasHP = Number(context.system.legion.vythelas?.health) || 0;
    const vythelasMax = Number(context.system.legion.vythelas?.max) || 150;
    context.vythelasPct = Math.round((Math.min(vythelasMax, Math.max(0, vythelasHP)) / vythelasMax) * 100);

    // Parse adversary attacks text and damage resistances
    if (this.actor.type === "adversary") {
      const elementIcons = {
        impact: "systems/warframe-ttrpg/asset/Element icon/EssentialImpactGlyph.png",
        puncture: "systems/warframe-ttrpg/asset/Element icon/EssentialPunctureGlyph.png",
        slash: "systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png",
        heat: "systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png",
        cold: "systems/warframe-ttrpg/asset/Element icon/ColdModBundleIcon.png",
        electricity: "systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png",
        toxin: "systems/warframe-ttrpg/asset/Element icon/300px-ToxinModBundleIcon.webp",
        blast: "systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png",
        corrosive: "systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png",
        gas: "systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png",
        magnetic: "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png",
        radiation: "systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png",
        viral: "systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png",
        void: "systems/warframe-ttrpg/asset/Element icon/EssentialVoidGlyph.png"
      };
      const resistances = {};
      for (const [type, icon] of Object.entries(elementIcons)) {
        resistances[type] = {
          icon: icon,
          status: context.system.resistances?.[type] || "normal"
        };
      }
      context.resistances = resistances;

      const attacksText = context.system.details?.attacks || "";
      const parsedAttacks = [];
      const lines = attacksText.split("\n");
      for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.includes(":")) continue;
        const parts = trimmed.split(":");
        const label = parts[0].trim();
        const remaining = parts.slice(1).join(":").trim();
        const words = remaining.split(/\s+/);
        const formula = words[0] || "1d6";
        const dmgType = (words[1] || "damage").replace(/[^a-zA-Z]/g, "");
        parsedAttacks.push({
          label: label,
          formula: formula,
          dmgType: dmgType
        });
      }
      context.parsedAttacks = parsedAttacks;
      context.enrichedDescription = await TextEditor.enrichHTML(context.system.details?.description || "", {
        secrets: this.actor.isOwner,
        async: true
      });
    }

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // --- Tactical Actions Bar Listeners (Parkour, Action 1, Action 2, Réaction) ---
    html.find(".sheet-action-toggle").click(async event => {
      event.preventDefault();
      const type = event.currentTarget.dataset.actionType;
      if (type === "parkour") {
        if (typeof this.actor.showParkourDialog === "function") {
          return await this.actor.showParkourDialog();
        }
      } else if (type === "reaction") {
        if (typeof this.actor.showReactionDialog === "function") {
          return await this.actor.showReactionDialog();
        }
      }

      let actions = this.actor.getFlag("warframe-ttrpg", "combatActions");
      if (!actions || typeof actions !== "object" || actions.action1 === undefined) {
        actions = { parkour: true, action1: true, action2: true, reaction: true };
      }
      actions = { ...actions, [type]: !actions[type] };
      await this.actor.setFlag("warframe-ttrpg", "combatActions", actions);
      if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.actor.id) {
        globalThis.warframeTTRPG.WarframeHUD.render(this.actor, globalThis.warframeTTRPG.WarframeHUD.currentToken);
      }
      this.render(false);
    });

    html.find(".sheet-action-toggle").contextmenu(async event => {
      event.preventDefault();
      const type = event.currentTarget.dataset.actionType;
      let actions = this.actor.getFlag("warframe-ttrpg", "combatActions");
      if (!actions || typeof actions !== "object" || actions.action1 === undefined) {
        actions = { parkour: true, action1: true, action2: true, reaction: true };
      }
      actions = { ...actions, [type]: !actions[type] };
      await this.actor.setFlag("warframe-ttrpg", "combatActions", actions);
      if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.actor.id) {
        globalThis.warframeTTRPG.WarframeHUD.render(this.actor, globalThis.warframeTTRPG.WarframeHUD.currentToken);
      }
      this.render(false);
    });

    html.find(".sheet-action-reset-btn").click(async event => {
      event.preventDefault();
      if (typeof this.actor.resetCombatActions === "function") {
        await this.actor.resetCombatActions();
      } else {
        await this.actor.setFlag("warframe-ttrpg", "combatActions", { parkour: true, action1: true, action2: true, reaction: true });
        if (globalThis.warframeTTRPG?.WarframeHUD?.currentActor?.id === this.actor.id) {
          globalThis.warframeTTRPG.WarframeHUD.render(this.actor, globalThis.warframeTTRPG.WarframeHUD.currentToken);
        }
        this.render(false);
      }
      ui.notifications?.info("Actions du tour réinitialisées (2 Actions, 1 Parkour, 1 Réaction).");
    });

    // --- Dual Artwork Listeners (Portrait & Token) ---
    // Click token: open FilePicker to change token texture
    html.find('[data-action="edit-token-texture"]').click(event => {
      event.preventDefault();
      if (!this.isEditable) return;
      const current = this.actor.prototypeToken?.texture?.src || this.actor.img;
      new FilePicker({
        type: "image",
        current: current,
        callback: path => {
          this.actor.update({ "prototypeToken.texture.src": path });
        }
      }).render(true);
    });

    // Right-click token: open Prototype Token Configuration dialog
    html.find('[data-action="edit-token-texture"]').contextmenu(event => {
      event.preventDefault();
      if (typeof this._onConfigureToken === "function") {
        this._onConfigureToken(event);
      } else {
        const cls = CONFIG.Token?.prototypeSheetClass || CONFIG.Token?.sheetClass;
        if (cls) new cls(this.actor.prototypeToken).render(true);
      }
    });

    // Right-click portrait: open full-resolution ImagePopout
    html.find(".profile-img").contextmenu(event => {
      event.preventDefault();
      new ImagePopout(this.actor.img, {
        title: this.actor.name,
        shareable: true,
        uuid: this.actor.uuid
      }).render(true);
    });

    // Use Forma button in Mods tab
    html.find(".use-forma-btn").click(() => {
      this._onUseFormaDialog();
    });

    // Use Consumable play icon in Arsenal tab
    html.find(".use-consumable-item").click(event => {
      const li = $(event.currentTarget).parents(".item-row");
      const itemId = li.data("itemId");
      const item = this.actor.items.get(itemId);
      if (item && item.system.isGear) {
        this._onUseGearItem(item);
      } else {
        this._onUseFormaDialog(itemId);
      }
    });

    // Open Equipped Warframe Item Sheet when clicking the badge
    html.find(".equipped-frame-badge").click(event => {
      if ($(event.target).closest(".unequip-btn").length > 0) return;
      const itemId = event.currentTarget.dataset.itemId || event.currentTarget.getAttribute("data-item-id");
      const item = this.actor.items.get(itemId);
      if (item) {
        item.sheet.render(true);
      } else {
        ui.notifications.warn("Could not find the equipped Warframe item sheet.");
      }
    });

    // Character Creation Wizard (Tenno Awakening)
    // 1. Auto-prompt check for Trusted Players / GM on a blank sheet
    setTimeout(() => {
      CharacterCreationWizard.checkAndPrompt(this.actor, this);
    }, 250);

    // 2. Manual Launch Creation Wizard button
    html.find(".launch-wizard-btn").click(event => {
      event.preventDefault();
      event.stopPropagation();
      new CharacterCreationWizard(this.actor).render(true);
    });

    // Open Warframe Selector Dialog for the empty dropzone or change button
    const openFrameSelector = () => this._openWarframeSelectorDialog();
    html.find(".frame-dropzone").click(openFrameSelector);
    html.find(".change-frame-btn").click(openFrameSelector);

    // Switch between Sirius & Orion twin forms
    html.find(".switch-twin-btn").click(async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      await this.actor.switchTwinFrame();
    });

    // Restore individual vitals pool to full when clicking its label
    html.find(".restore-vitals-btn").click(async ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const vital = ev.currentTarget.dataset.vital;
      if (!vital || !this.actor.isOwner) return;

      const maxVal = this.actor.system[vital]?.max;
      if (maxVal !== undefined && maxVal !== null) {
        const updateData = {};
        updateData[`system.${vital}.value`] = maxVal;
        await this.actor.update(updateData);
        ui.notifications.info(`Restored ${vital.capitalize()} to ${maxVal}!`);
      }
    });

    // Roll Attribute
    html.find(".roll-attribute").click(event => {
      const attribute = event.currentTarget.dataset.attribute;
      this.actor.rollAttribute(attribute);
    });

    // Roll Save
    html.find(".roll-save").click(event => {
      const saveName = event.currentTarget.dataset.save;
      this.actor.rollSave(saveName);
    });

    // Roll Skill
    html.find(".roll-skill").click(event => {
      const skillName = event.currentTarget.dataset.skill;
      this.actor.rollSkill(skillName);
    });

    // Skill Proficiency Checkbox Click (blank <-> prof)
    html.find(".skill-checkbox").click(async event => {
      event.preventDefault();
      event.stopPropagation();
      
      const skillName = event.currentTarget.dataset.skill;
      const skill = this.actor.system.skills[skillName];
      if (!skill) return;

      let currentValue = 0;
      if (skill.value === true || skill.value === 1) currentValue = 1;
      else if (skill.value === 2 || skill.value === "expertise") currentValue = 2;

      let nextValue = 0;
      if (currentValue === 0) {
        // Enforce max skill proficiencies limit
        let count = 0;
        for (let [k, s] of Object.entries(this.actor.system.skills)) {
          let val = 0;
          if (s.value === true || s.value === 1) val = 1;
          else if (s.value === 2 || s.value === "expertise") val = 2;
          if (val > 0) count++;
        }
        const maxProf = this.actor.system.skills.maxProficiencies || 2;
        if (count >= maxProf) {
          ui.notifications.warn(`You cannot select more than ${maxProf} skill proficiencies/expertises!`);
          event.currentTarget.checked = false;
          return;
        }
        nextValue = 1;
      } else {
        nextValue = 0;
      }

      await this.actor.update({ [`system.skills.${skillName}.value`]: nextValue });
    });

    // Skill Expertise Button Click (none/prof <-> expertise)
    html.find(".skill-expertise-btn").click(async event => {
      event.preventDefault();
      event.stopPropagation();

      const skillName = event.currentTarget.dataset.skill;
      const skill = this.actor.system.skills[skillName];
      if (!skill) return;

      let currentValue = 0;
      if (skill.value === true || skill.value === 1) currentValue = 1;
      else if (skill.value === 2 || skill.value === "expertise") currentValue = 2;

      let nextValue = 0;
      if (currentValue === 0 || currentValue === 1) {
        if (currentValue === 0) {
          let count = 0;
          for (let [k, s] of Object.entries(this.actor.system.skills)) {
            let val = 0;
            if (s.value === true || s.value === 1) val = 1;
            else if (s.value === 2 || s.value === "expertise") val = 2;
            if (val > 0) count++;
          }
          const maxProf = this.actor.system.skills.maxProficiencies || 2;
          if (count >= maxProf) {
            ui.notifications.warn(`You cannot select more than ${maxProf} skill proficiencies/expertises!`);
            return;
          }
        }
        nextValue = 2;
      } else {
        nextValue = 0;
      }

      await this.actor.update({ [`system.skills.${skillName}.value`]: nextValue });
    });

    // Save Proficiency Checkbox Click (blank <-> prof)
    html.find(".save-checkbox").click(async event => {
      event.preventDefault();
      event.stopPropagation();
      
      const saveName = event.currentTarget.dataset.save;
      const save = this.actor.system.saves[saveName];
      if (!save) return;

      let currentValue = 0;
      if (save.profLevel === 1) currentValue = 1;
      else if (save.profLevel === 2) currentValue = 2;

      let nextValue = currentValue === 0 ? 1 : 0;
      await this.actor.update({ [`system.saves.${saveName}.proficient`]: nextValue });
    });

    // Save Expertise Button Click (none/prof <-> expertise)
    html.find(".save-expertise-btn").click(async event => {
      event.preventDefault();
      event.stopPropagation();

      const saveName = event.currentTarget.dataset.save;
      const save = this.actor.system.saves[saveName];
      if (!save) return;

      let currentValue = 0;
      if (save.profLevel === 1) currentValue = 1;
      else if (save.profLevel === 2) currentValue = 2;

      let nextValue = (currentValue === 0 || currentValue === 1) ? 2 : 0;
      await this.actor.update({ [`system.saves.${saveName}.proficient`]: nextValue });
    });

    // Toggle Weapon Equipped
    html.find(".toggle-weapon-equipped").click(async event => {
      event.preventDefault();
      event.stopPropagation();
      const weaponId = $(event.currentTarget).parents(".item-row").data("itemId");
      const weapon = this.actor.items.get(weaponId);
      if (!weapon) return;
      const isEquipped = !weapon.system?.equipped;
      await weapon.update({ "system.equipped": isEquipped });
      ui.notifications?.info(`${weapon.name} est maintenant ${isEquipped ? "équipée dans l'Arsenal" : "déséquipée"}.`);
    });

    // Roll Weapon
    html.find(".roll-weapon").click(event => {
      const weaponId = $(event.currentTarget).parents(".item-row").data("itemId");
      this.actor.rollWeapon(weaponId);
    });

    // Roll Weapon Finisher
    html.find(".roll-weapon-finisher").click(event => {
      const weaponId = $(event.currentTarget).parents(".item-row").data("itemId");
      this.actor.rollWeapon(weaponId, { isFinisher: true });
    });

    // Roll Weapon Alt-Fire
    html.find(".roll-weapon-alt").click(event => {
      const weaponId = $(event.currentTarget).parents(".item-row").data("itemId");
      this.actor.rollWeapon(weaponId, { isAltFire: true });
    });

    // Reload Weapon
    html.find(".reload-weapon").click(async event => {
      const weaponId = $(event.currentTarget).parents(".item-row").data("itemId");
      if (weaponId && typeof this.actor.reloadWeapon === "function") {
        await this.actor.reloadWeapon(weaponId);
      }
    });

    // Swap Weapon Mode (e.g. Vinquibus Rifle <-> Bayonet)
    html.find(".swap-weapon-mode").click(async event => {
      const weaponId = $(event.currentTarget).parents(".item-row").data("itemId");
      if (weaponId && typeof this.actor.swapWeaponMode === "function") {
        await this.actor.swapWeaponMode(weaponId);
      }
    });

    // Cast Ability
    html.find(".cast-ability").click(event => {
      const abilityId = $(event.currentTarget).parents(".item-row").data("itemId");
      this.actor.castAbility(abilityId);
    });

    // Inline Quantity Edit
    html.find(".inline-qty-input").change(async event => {
      const input = event.currentTarget;
      const itemId = input.dataset.itemId;
      const val = Math.max(0, parseInt(input.value) || 0);
      const item = this.actor.items.get(itemId);
      if (item) {
        await item.update({ "system.quantity": val });
      }
    });

    // Spend / Refund ASI Attribute Points
    html.find(".asi-plus").click(async event => {
      event.preventDefault();
      const attrKey = event.currentTarget.dataset.attribute;
      const attribute = this.actor.system.attributes[attrKey];
      if (!attribute) return;

      const remaining = Number(this.actor.system.asiRemaining) || 0;
      if (remaining <= 0) {
        ui.notifications.warn("No available Attribute Points (ASI) left to spend!");
        return;
      }

      const updates = {
        [`system.attributes.${attrKey}.value`]: (Number(attribute.value) || 10) + 1,
        "system.asiSpent": (Number(this.actor.system.asiSpent) || 0) + 1
      };

      await this.actor.update(updates);
      
      // Sync base actor and token actors for warframes
      if (this.actor.type === "warframe") {
        if (this.actor.isToken) {
          const baseActor = game.actors.get(this.actor.id);
          if (baseActor) await baseActor.update(updates);
        } else {
          const activeTokens = canvas.tokens.placeables.filter(t => t.actor?.id === this.actor.id);
          for (let token of activeTokens) {
            if (token.actor && token.actor !== this.actor) {
              await token.actor.update(updates);
            }
          }
        }
      }
      ui.notifications.info(`Spent 1 Attribute Point on ${attribute.label || attrKey.capitalize()}.`);
    });

    html.find(".asi-minus").click(async event => {
      event.preventDefault();
      const attrKey = event.currentTarget.dataset.attribute;
      const attribute = this.actor.system.attributes[attrKey];
      if (!attribute) return;

      const spent = Number(this.actor.system.asiSpent) || 0;
      if (spent <= 0) {
        ui.notifications.warn("No spent Attribute Points (ASI) to refund!");
        return;
      }

      const currentValue = Number(attribute.value) || 10;
      if (currentValue <= 10) {
        ui.notifications.warn(`Cannot refund below base attribute score of 10!`);
        return;
      }

      const updates = {
        [`system.attributes.${attrKey}.value`]: currentValue - 1,
        "system.asiSpent": Math.max(0, spent - 1)
      };

      await this.actor.update(updates);

      // Sync base actor and token actors for warframes
      if (this.actor.type === "warframe") {
        if (this.actor.isToken) {
          const baseActor = game.actors.get(this.actor.id);
          if (baseActor) await baseActor.update(updates);
        } else {
          const activeTokens = canvas.tokens.placeables.filter(t => t.actor?.id === this.actor.id);
          for (let token of activeTokens) {
            if (token.actor && token.actor !== this.actor) {
              await token.actor.update(updates);
            }
          }
        }
      }
      ui.notifications.info(`Refunded 1 Attribute Point from ${attribute.label || attrKey.capitalize()}.`);
    });

    // Rest Character
    html.find(".rest-btn").click(async () => {
      if (typeof this.actor.rest === "function") {
        await this.actor.rest();
      }
    });

    // Valkyr Rage Buttons
    html.find(".valkyr-rage-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const currentRage = Number(this.actor.system.rage?.value) || 0;
      let newRage = currentRage;
      let label = "";

      if (action === "kill") {
        newRage = Math.min(300, currentRage + 12);
        label = "Kill (+12% Rage)";
      } else if (action === "finisher") {
        newRage = Math.min(300, currentRage + 27);
        label = "Finisher (+27% Rage)";
      }

      await this.actor.update({ 
        "system.rage.value": newRage,
        "flags.warframe-ttrpg.rageBuiltThisRound": true
      });
      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${newRage}%)`);
    });

    // Atlas Rubble Buttons
    html.find(".atlas-rubble-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const currentRubble = Number(this.actor.system.rubble?.value) || 0;
      const maxRubble = Number(this.actor.system.rubble?.max) || 1500;
      let newRubble = currentRubble;
      let label = "";

      if (action === "add-small") {
        newRubble = Math.min(maxRubble, currentRubble + 75);
        label = "Picked up Rubble (+75)";
      } else if (action === "add-large") {
        newRubble = Math.min(maxRubble, currentRubble + 150);
        label = "Picked up Rumbler Rubble (+150)";
      } else if (action === "decay") {
        newRubble = Math.max(0, currentRubble - 50);
        label = "Rubble Decayed (-50)";
      } else if (action === "clear") {
        newRubble = 0;
        label = "Reset Rubble to 0";
      }

      await this.actor.update({ "system.rubble.value": newRubble });
      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${newRubble}/${maxRubble})`);
    });

    // Uriel Brimstone Fury Buttons
    html.find(".uriel-brimstone-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const currentBrimstone = Number(this.actor.system.brimstone?.value) || 0;
      let newBrimstone = currentBrimstone;
      let label = "";

      if (action === "kill") {
        newBrimstone = Math.min(100, currentBrimstone + 25);
        label = "Demon Kill (+25% Brimstone Fury)";
      } else if (action === "rune") {
        newBrimstone = Math.min(100, currentBrimstone + 20);
        label = "Demonium Rune (+20% Brimstone Fury)";
      } else if (action === "soul") {
        newBrimstone = Math.min(100, currentBrimstone + 15);
        label = "Demonium Soul (+15% Brimstone Fury)";
      } else if (action === "clear") {
        newBrimstone = 0;
        label = "Reset Brimstone Fury to 0%";
      }

      await this.actor.update({ "system.brimstone.value": newBrimstone });
      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${newBrimstone}%)`);
    });

    // Uriel Demon Active/Resting Toggle
    html.find(".uriel-demon-toggle").click(async event => {
      event.preventDefault();
      const demon = event.currentTarget.dataset.demon;
      if (!demon) return;
      const currentStatus = this.actor.system.legion?.[demon]?.active;
      const newStatus = !currentStatus;
      await this.actor.update({ [`system.legion.${demon}.active`]: newStatus });
      ui.notifications.info(`${this.actor.name}: ${demon.charAt(0).toUpperCase() + demon.slice(1)} is now ${newStatus ? "Active" : "Resting/Dead"}.`);
    });

    // Sevagoth Death Well Buttons
    html.find(".sevagoth-deathwell-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const currentWell = Number(this.actor.system.deathWell?.value) || 0;
      let newWell = currentWell;
      let label = "";

      if (action === "harvest") {
        newWell = Math.min(100, currentWell + 15);
        label = "Harvested Souls (+15% Death Well)";
      } else if (action === "seed") {
        newWell = Math.min(100, currentWell + 5);
        label = "Sowed Death Seed (+5% Death Well)";
      } else if (action === "drain") {
        newWell = Math.max(0, currentWell - 10);
        label = "Shadow Drain (-10% Death Well)";
      } else if (action === "full") {
        newWell = 100;
        label = "Death Well Fully Charged (100%)";
      } else if (action === "clear") {
        newWell = 0;
        label = "Reset Death Well to 0%";
      }

      await this.actor.update({ "system.deathWell.value": newWell });
      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${newWell}%)`);
    });

    // Gauss Battery Buttons
    html.find(".gauss-battery-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const current = Number(this.actor.system.battery?.value) || 0;
      let updated = current;
      let label = "";

      if (action === "dash") {
        updated = Math.min(100, current + 10);
        label = "Mach Dash (+10% Battery)";
      } else if (action === "sprint") {
        updated = Math.min(100, current + 20);
        label = "Sprint Charge (+20% Battery)";
      } else if (action === "sunder") {
        updated = Math.max(0, current - 10);
        label = "Sunder Vent (-10% Battery)";
      } else if (action === "full") {
        updated = 100;
        label = "Battery Overclocked (100% Redline)";
      } else if (action === "clear") {
        updated = 0;
        label = "Battery Discharged (0%)";
      }

      await this.actor.update({ "system.battery.value": updated });
      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${updated}%)`);
    });

    // Ember Immolation Buttons
    html.find(".ember-immolation-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const current = Number(this.actor.system.immolation?.value) || 0;
      let updated = current;
      let label = "";

      if (action === "fireball") {
        updated = Math.min(100, current + 10);
        label = "Fireball Surge (+10% Immolation)";
      } else if (action === "build") {
        updated = Math.min(100, current + 20);
        label = "Heat Build (+20% Immolation)";
      } else if (action === "blast") {
        updated = Math.max(0, current - 50);
        label = "Fire Blast Vent (-50% Immolation)";
      } else if (action === "full") {
        updated = 100;
        label = "Maximum Heat (100% Immolation)";
      } else if (action === "clear") {
        updated = 0;
        label = "Immolation Extinguished (0%)";
      }

      await this.actor.update({ "system.immolation.value": updated });
      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${updated}%)`);
    });

    // Nidus Mutation Stacks Buttons
    html.find(".nidus-mutation-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const current = Number(this.actor.system.mutation?.value) || 0;
      let updated = current;
      let label = "";

      if (action === "add1") {
        updated = Math.min(100, current + 1);
        label = "+1 Mutation Stack";
      } else if (action === "add5") {
        updated = Math.min(100, current + 5);
        label = "+5 Mutation Stacks";
      } else if (action === "link") {
        updated = Math.max(0, current - 1);
        label = "-1 Stack (Parasitic Link)";
      } else if (action === "ravenous") {
        updated = Math.max(0, current - 3);
        label = "-3 Stacks (Ravenous)";
      } else if (action === "undying") {
        if (current >= 15) {
          updated = current - 15;
          label = "💀 UNDYING TRIGGERED: Consumed 15 stacks! Death prevented, 50% HP restored!";
          const curHP = Number(this.actor.system.health?.value) || 0;
          const maxHP = Number(this.actor.system.health?.max) || 100;
          const restoredHP = Math.max(curHP, Math.round(maxHP * 0.5));
          await this.actor.update({ "system.health.value": restoredHP });
        } else {
          ui.notifications.warn("Not enough Mutation Stacks to trigger Undying! Requires 15 stacks.");
          return;
        }
      } else if (action === "clear") {
        updated = 0;
        label = "Mutation Stacks Reset to 0";
      }

      await this.actor.update({ "system.mutation.value": updated });
      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${updated} Stacks)`);
    });

    // Baruuk Restraint Buttons
    html.find(".baruuk-restraint-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const current = Number(this.actor.system.restraint?.value ?? 100);
      let updated = current;
      let label = "";

      if (action === "lull") {
        updated = Math.max(0, current - 5);
        label = "Lull Pacification (-5% Restraint)";
      } else if (action === "elude") {
        updated = Math.max(0, current - 10);
        label = "Elude Evasion (-10% Restraint)";
      } else if (action === "hands") {
        updated = Math.max(0, current - 20);
        label = "Desolate Hands Disarm (-20% Restraint)";
      } else if (action === "storm") {
        updated = 0;
        label = "Restraint Broken (0% - Serene Storm Ready!)";
      } else if (action === "reset") {
        updated = 100;
        label = "Composure Restored (100% Restrained)";
      }

      await this.actor.update({ "system.restraint.value": updated });
      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${updated}%)`);
    });

    // Atlas Rubble Buttons
    html.find(".atlas-rubble-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      const current = Number(this.actor.system.rubble?.value) || 0;
      let updated = current;
      let label = "";

      if (action === "add50") {
        updated = Math.min(1500, current + 50);
        label = "Landslide Rubble Harvest (+50 Armor)";
      } else if (action === "add100") {
        updated = Math.min(1500, current + 100);
        label = "Petrify Shatter Harvest (+100 Armor)";
      } else if (action === "decay") {
        updated = Math.max(0, current - 50);
        label = "Rubble Armor Decay (-50 Armor)";
      } else if (action === "full") {
        updated = 1500;
        label = "Maximum Rubble Fortification (1500 Armor)";
      } else if (action === "clear") {
        updated = 0;
        label = "Rubble Armor Depleted (0 Armor)";
      }

      await this.actor.update({ "system.rubble.value": updated });

      // Update or clear the Rubble active effect
      const oldBuff = this.actor.effects.find(e => !e.disabled && e.flags?.["warframe-ttrpg"]?.isRubbleArmor);
      if (oldBuff) await this.actor.deleteEmbeddedDocuments("ActiveEffect", [oldBuff.id]);

      if (updated > 0) {
        await this.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Rubble Plating (+${updated} Armor)`,
          icon: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/Petrify.png",
          origin: this.actor.uuid,
          duration: { rounds: 99 },
          changes: [{ key: "system.armor.value", value: updated, mode: 2, priority: 20 }],
          description: `Rubble Plating: Hardened stone fragments coat Atlas's chassis, providing +${updated} Armor and total knockdown immunity.`,
          flags: { core: { statusId: "rubble_plating" }, "warframe-ttrpg": { isRubbleArmor: true } }
        }]);
      }

      ui.notifications.info(`${this.actor.name}: ${label} (Current: ${updated} Rubble Armor)`);
    });

    // Uriel Demon Action Buttons (e.g. Remedium Revive All)
    html.find(".uriel-demon-action-btn").click(async event => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      if (action === "remedium-all") {
        await this.actor.update({
          "system.legion.catenach.active": true,
          "system.legion.catenach.health": 150,
          "system.legion.gulphagor.active": true,
          "system.legion.gulphagor.health": 150,
          "system.legion.vythelas.active": true,
          "system.legion.vythelas.health": 150
        });
        ui.notifications.info(`${this.actor.name}: Remedium invoked! All Legion demons fully restored to 150 HP and active.`);
      }
    });

    // Roll Adversary Attack Button
    html.find(".roll-adversary-attack-btn").click(async event => {
      event.preventDefault();
      const btn = event.currentTarget;
      const formula = btn.dataset.formula;
      const label = btn.dataset.label;
      const dmgType = btn.dataset.dmgType;

      const roll = new Roll(formula);
      await roll.evaluate({async: true});

      let targetMsg = "";
      const combatTargets = getCombatTargets();
      if (combatTargets.length > 0) {
        for (let targetToken of combatTargets) {
          const targetActor = targetToken?.actor;
          if (!targetActor) continue;

          const res = await applyWarframeDamageOrHealing(targetActor, {
            amount: roll.total,
            damageType: dmgType,
            isHealing: false,
            isFinisher: false,
            sourceName: label
          });

          if (res) {
            targetMsg += formatDamageResolutionHtml(res);
          }
        }
      } else {
        targetMsg = `
          <div style="font-size: 11px; color: rgba(255,255,255,0.4); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 6px; margin-top: 6px;">
            Aucune cible sélectionnée. Ciblez un token (touche T) ou sélectionnez-le sur la scène pour appliquer les dégâts automatiquement, ou cliquez sur les boutons ci-dessous.
          </div>
        `;
      }

      const cardContent = await renderTemplate("systems/warframe-ttrpg/templates/chat-card.html", {
        actorName: this.actor.name,
        abilityName: label,
        description: `
          <div style="background: rgba(229, 152, 102, 0.05); border: 1px solid rgba(229, 152, 102, 0.25); border-radius: 4px; padding: 8px; font-family: 'Inter', sans-serif;">
            <div style="font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: bold; color: #e59866; border-bottom: 1px solid rgba(229, 152, 102, 0.2); padding-bottom: 4px; margin-bottom: 6px;">
              💥 Attaque Ennemie
            </div>
            <div style="font-size: 13px; color: #fff;">
              Inflige <strong style="color: #ccd6f6; font-size: 14px;">${roll.total} dégâts ${dmgType}</strong> (Jet ${roll.total} sur ${formula}).
            </div>
            ${targetMsg}
            ${renderCombatActionButtons({ damage: roll.total, damageType: dmgType })}
          </div>
        `,
        img: this.actor.img
      });

      const enrichedContent = await TextEditor.enrichHTML(cardContent, { async: true });
      await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: enrichedContent
      });
    });

    // Unequip slotted Mod (Left click)
    html.find(".mod-slot-card.occupied").click(async event => {
      if ($(event.target).closest(".slot-polarity, .mod-polarity-badge").length > 0) return;
      
      const itemId = event.currentTarget.dataset.itemId;
      const mod = this.actor.items.get(itemId);
      if (mod) {
        await mod.update({ "system.slot": "", "system.equipped": false });
        ui.notifications.info(`${mod.name} retiré.`);
      }
    });

    // Inspect slotted Mod (Right click)
    html.find(".mod-slot-card.occupied").contextmenu(event => {
      event.preventDefault();
      const itemId = event.currentTarget.dataset.itemId;
      const mod = this.actor.items.get(itemId);
      if (mod) mod.sheet.render(true);
    });

    // Equip Mod into empty slot
    html.find(".mod-slot-card.empty").click(async event => {
      if ($(event.target).closest(".slot-polarity").length > 0) return;
      
      const slotKey = event.currentTarget.dataset.slot;

      // 1. Gather all candidate mods (Actor unequipped, World items, and Compendium pack)
      const actorMods = this.actor.items.filter(i => i.type === "mod" && !i.system.slot);
      const worldMods = game.items.filter(i => i.type === "mod");
      let compMods = [];
      const modsPack = game.packs.get("warframe-ttrpg.mods");
      if (modsPack) {
        try {
          compMods = await modsPack.getDocuments();
        } catch (e) {
          console.error("Warframe TTRPG | Failed to load mods compendium:", e);
        }
      }

      // Combine and deduplicate by name
      const allCandidateMods = [];
      const seenNames = new Set();

      // Don't show mods already equipped elsewhere on this actor
      const equippedNames = new Set(this.actor.items.filter(i => i.type === "mod" && i.system.slot).map(i => i.name.toLowerCase()));

      for (let m of [...actorMods, ...worldMods, ...compMods]) {
        const normName = m.name.toLowerCase();
        if (equippedNames.has(normName)) continue;
        if (!seenNames.has(normName)) {
          seenNames.add(normName);
          allCandidateMods.push(m);
        }
      }

      // 2. Filter by slot compatibility
      const eligibleMods = allCandidateMods.filter(m => {
        const modType = (m.system.type || "standard").toLowerCase();
        if (slotKey === "aura" || slotKey === "aura2") {
          return modType === "aura";
        }
        if (slotKey === "exilus") {
          return modType === "exilus";
        }
        // Normal mod slots (slot1-slot8) can take standard and exilus, but NOT auras
        return modType !== "aura";
      });

      if (eligibleMods.length === 0) {
        ui.notifications.warn(`Aucun mod compatible trouvé pour l'emplacement ${slotKey.toUpperCase()} !`);
        return;
      }

      // Sort alphabetically
      eligibleMods.sort((a, b) => a.name.localeCompare(b.name));

      // 3. Render searchable mod selection dialog
      const targetSlotPolarity = this.actor.system.modSlots?.[slotKey]?.polarity || "none";
      const slotPolNorm = String(targetSlotPolarity).toLowerCase();

      const getPolIcon = (pol) => {
        if (!pol || pol === "none") return "";
        const norm = String(pol).toLowerCase();
        const icons = {
          universal: 'systems/warframe-ttrpg/asset/polarity icon/Any_Pol.jpg',
          any: 'systems/warframe-ttrpg/asset/polarity icon/Any_Pol.jpg',
          madurai: 'systems/warframe-ttrpg/asset/polarity icon/Madurai_Pol(xBlack).jpg',
          vazarin: 'systems/warframe-ttrpg/asset/polarity icon/Vazarin_Pol(xBlack).jpg',
          naramon: 'systems/warframe-ttrpg/asset/polarity icon/Naramon_Pol(xBlack).jpg',
          zenurik: 'systems/warframe-ttrpg/asset/polarity icon/Zenurik_Pol(xBlack).jpg',
          unairu: 'systems/warframe-ttrpg/asset/polarity icon/Unairu_Pol(xBlack).jpg',
          umbra: 'systems/warframe-ttrpg/asset/polarity icon/Umbra_Pol(xBlack).jpg'
        };
        return icons[norm] || "";
      };

      const slotPolIconUrl = getPolIcon(targetSlotPolarity);

      let listHtml = `
        <div class="mod-selector-dialog" style="display: flex; flex-direction: column; gap: 10px; max-height: 480px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 6px;">
            <span style="font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #00e5ff; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
              Installer un Mod &mdash; Emplacement : ${slotKey.toUpperCase()}
              ${targetSlotPolarity !== 'none' ? `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 1px 6px; border-radius: 3px; background: rgba(0,229,255,0.1); border: 1px solid #00e5ff; color: #00e5ff; font-size: 9px; font-family: 'Orbitron', sans-serif;">${slotPolIconUrl ? `<img src="${slotPolIconUrl}" style="width: 12px; height: 12px; mix-blend-mode: screen;" />` : ''}${targetSlotPolarity}</span>` : '<span style="font-size: 9px; color: #8892b0; font-family: \'Inter\', sans-serif;">(Unpolarized)</span>'}
            </span>
            <span style="font-size: 10px; color: #8892b0;">${eligibleMods.length} disponibles</span>
          </div>

          <div style="position: relative;">
            <input type="text" class="mod-search-input" placeholder="Rechercher par nom, stat ou polarité..." style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(0, 229, 255, 0.3); color: #fff; border-radius: 4px; padding: 6px 10px; font-size: 11px; font-family: 'Inter', sans-serif;" />
          </div>

          <ul class="mod-selection-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; max-height: 360px; padding-right: 4px;">
      `;

      for (let m of eligibleMods) {
        const polarity = m.system.polarity || "none";
        const mPolNorm = String(polarity).toLowerCase();
        const mPolIcon = getPolIcon(polarity);
        const drain = Number(m.system.drain) || 0;
        const rarity = m.system.rarity || "common";
        const mType = (m.system.type || "standard").toUpperCase();

        const rarityColors = {
          common: "#cd7f32",
          uncommon: "#c0c0c0",
          rare: "#ffd700",
          legendary: "#e0e6ed"
        };
        const rarityColor = rarityColors[rarity.toLowerCase()] || "#ffd700";

        let polarityMatch = "neutral";
        let matchLabel = "";
        let badgeColor = "#8892b0";
        let badgeBg = "rgba(255, 255, 255, 0.05)";
        let badgeBorder = "rgba(255, 255, 255, 0.15)";
        let effectiveDrain = drain;

        if (slotPolNorm !== "none" && mPolNorm !== "none") {
          if (slotPolNorm === "universal" || mPolNorm === "universal" || slotPolNorm === mPolNorm) {
            polarityMatch = "match";
            badgeColor = "#2ecc71";
            badgeBg = "rgba(46, 204, 113, 0.2)";
            badgeBorder = "#2ecc71";
            if (slotKey === "aura" || slotKey === "aura2") {
              effectiveDrain = drain * 2;
              matchLabel = `CORRESPONDANCE : +${effectiveDrain} Cap`;
            } else {
              effectiveDrain = Math.ceil(drain / 2);
              matchLabel = `CORRESPONDANCE : ${effectiveDrain} Coût`;
            }
          } else {
            polarityMatch = "mismatch";
            badgeColor = "#ff2a5f";
            badgeBg = "rgba(255, 42, 95, 0.2)";
            badgeBorder = "#ff2a5f";
            if (slotKey === "aura" || slotKey === "aura2") {
              effectiveDrain = Math.max(0, drain - 2);
              matchLabel = `DISCORDANCE : +${effectiveDrain} Cap`;
            } else {
              effectiveDrain = Math.ceil(drain * 1.25);
              matchLabel = `DISCORDANCE : ${effectiveDrain} Coût`;
            }
          }
        }

        const polIconHtml = mPolIcon
          ? `<img src="${mPolIcon}" style="width: 14px; height: 14px; object-fit: contain; mix-blend-mode: screen; filter: ${polarityMatch === 'match' ? 'drop-shadow(0 0 3px #2ecc71) brightness(1.3)' : polarityMatch === 'mismatch' ? 'drop-shadow(0 0 3px #ff2a5f) brightness(1.3)' : 'none'}; vertical-align: middle;" />`
          : "";

        // Generate concise stat line
        const statParts = [];
        const stats = m.system.stats || {};
        if (stats.health) statParts.push(`+${stats.health} HP`);
        if (stats.shields) statParts.push(`+${stats.shields} Shields`);
        if (stats.armor) statParts.push(`+${stats.armor} Armor`);
        if (stats.energy) statParts.push(`+${stats.energy} Energy`);
        if (stats.powerStrength) statParts.push(`${stats.powerStrength > 0 ? '+' : ''}${stats.powerStrength}% Strength`);
        if (stats.powerDuration) statParts.push(`${stats.powerDuration > 0 ? '+' : ''}${stats.powerDuration}% Duration`);
        if (stats.powerEfficiency) statParts.push(`${stats.powerEfficiency > 0 ? '+' : ''}${stats.powerEfficiency}% Efficiency`);
        if (stats.powerRange) statParts.push(`${stats.powerRange > 0 ? '+' : ''}${stats.powerRange}% Range`);
        if (stats.sprintSpeed) statParts.push(`+${stats.sprintSpeed} ft Speed`);
        const statSummary = statParts.join(", ");

        const searchText = `${m.name} ${polarity} ${rarity} ${mType} ${statSummary} ${m.system.description || ""}`.toLowerCase();

        listHtml += `
          <li class="mod-select-item" data-search="${searchText}" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: rgba(13, 17, 24, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-left: 3px solid ${rarityColor}; border-radius: 4px; gap: 8px;">
            <img src="${m.img || 'icons/svg/aura.svg'}" style="width: 28px; height: 28px; object-fit: contain; border-radius: 3px; border: 1px solid rgba(255,255,255,0.1);" />
            <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; overflow: hidden;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-weight: bold; font-family: 'Orbitron', sans-serif; color: #fff; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</span>
                <span style="font-size: 9px; padding: 1px 4px; border-radius: 2px; background: rgba(255,255,255,0.06); color: ${rarityColor}; text-transform: uppercase;">${mType}</span>
                <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; padding: 1px 5px; border-radius: 3px; background: ${badgeBg}; border: 1px solid ${badgeBorder}; color: ${badgeColor}; font-family: 'Orbitron', sans-serif;">
                  ${polIconHtml}
                  <span>${polarity}</span>
                  ${matchLabel ? `<span style="font-size: 8px; opacity: 0.9;">(${matchLabel})</span>` : ''}
                </span>
              </div>
              <div style="font-size: 9px; color: #8892b0; display: flex; gap: 8px; align-items: center;">
                <span style="color: ${polarityMatch === 'match' ? '#2ecc71' : polarityMatch === 'mismatch' ? '#ff2a5f' : '#ffd700'}; font-weight: bold;">
                  ${(slotKey === 'aura' || slotKey === 'aura2') ? `Capacité : +${effectiveDrain}` : `Coût : ${effectiveDrain}`}
                </span>
                ${statSummary ? `<span>&bull; <span style="color: #2ecc71;">${statSummary}</span></span>` : ""}
              </div>
            </div>
            <button type="button" class="select-mod-btn" data-uuid="${m.uuid || ''}" data-item-id="${m.id}" data-name="${m.name}" style="width: auto; padding: 4px 10px; background: rgba(0,229,255,0.12); border: 1px solid #00e5ff; color: #00e5ff; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; border-radius: 3px; cursor: pointer; white-space: nowrap;">
              Installer
            </button>
          </li>
        `;
      }

      listHtml += `
          </ul>
        </div>
      `;

      new Dialog({
        title: `Installer un Mod &mdash; ${slotKey.toUpperCase()}`,
        content: listHtml,
        buttons: {},
        render: dialogHtml => {
          // Instant search input filtering
          dialogHtml.find(".mod-search-input").on("input", ev => {
            const query = ev.currentTarget.value.toLowerCase().trim();
            dialogHtml.find(".mod-select-item").each(function() {
              const itemText = $(this).data("search") || "";
              if (!query || itemText.includes(query)) {
                $(this).show();
              } else {
                $(this).hide();
              }
            });
          });

          // Slot selection click
          dialogHtml.find(".select-mod-btn").click(async ev => {
            const uuid = ev.currentTarget.dataset.uuid;
            const itemId = ev.currentTarget.dataset.itemId;
            const modName = ev.currentTarget.dataset.name;

            // Check if actor already has this unequipped mod
            let targetMod = this.actor.items.find(i => i.type === "mod" && !i.system.slot && (i.id === itemId || i.name === modName));
            if (targetMod) {
              await targetMod.update({ "system.slot": slotKey, "system.equipped": true });
              ui.notifications.info(`${targetMod.name} installé dans ${slotKey} !`);
            } else {
              // Fetch from world or compendium
              let sourceItem = game.items.get(itemId);
              if (!sourceItem && uuid) {
                try {
                  sourceItem = await fromUuid(uuid);
                } catch (e) {}
              }
              if (!sourceItem && compMods.length > 0) {
                sourceItem = compMods.find(i => i.id === itemId || i.name === modName);
              }

              if (sourceItem) {
                const modData = sourceItem.toObject();
                modData.system.slot = slotKey;
                modData.system.equipped = true;
                await this.actor.createEmbeddedDocuments("Item", [modData]);
                ui.notifications.info(`${sourceItem.name} installé dans ${slotKey} !`);
              } else {
                ui.notifications.error(`Impossible de trouver le mod : ${modName}`);
              }
            }
            ev.currentTarget.closest(".app").querySelector(".close").click();
          });
        }
      }, {
        width: 380,
        classes: ["warframe-sheet", "warframe-selector-popup"]
      }).render(true);
    });

    // Cycle slot polarity
    html.find(".slot-polarity").click(async event => {
      event.stopPropagation();
      const slotKey = event.currentTarget.dataset.slot;
      const currentPolarity = this.actor.system.modSlots?.[slotKey]?.polarity || "none";
      
      const polarities = ["universal", "none", "Madurai", "Vazarin", "Naramon", "Zenurik", "Unairu", "Umbra"];
      let nextIndex = (polarities.indexOf(currentPolarity) + 1) % polarities.length;
      const newPolarity = polarities[nextIndex];

      await this.actor.update({ [`system.modSlots.${slotKey}.polarity`]: newPolarity });
    });

    // Focus School Selector
    html.find(".school-dropzone, .equipped-school-badge").click(async event => {
      if ($(event.target).closest(".remove-school-btn").length > 0) {
        await this.actor.update({ "system.details.operator": "" });
        await this.actor.unsetFlag("warframe-ttrpg", "focusNodes");
        await this._syncFocusActiveEffects({});
        ui.notifications.info("École de Focalisation et effets passifs associés retirés.");
        return;
      }

      const schools = [
        { name: "Madurai", icon: "systems/warframe-ttrpg/asset/polarity icon/Madurai_Pol(xBlack).jpg", desc: "Se focalise sur la vitesse et les dégâts. Favorise la puissance offensive." },
        { name: "Vazarin", icon: "systems/warframe-ttrpg/asset/polarity icon/Vazarin_Pol(xBlack).jpg", desc: "Se focalise sur la défense, la santé et les boucliers. Favorise la survie." },
        { name: "Naramon", icon: "systems/warframe-ttrpg/asset/polarity icon/Naramon_Pol(xBlack).jpg", desc: "Se focalise sur le flux de combat et la maîtrise de la mêlée. Favorise la vitesse." },
        { name: "Zenurik", icon: "systems/warframe-ttrpg/asset/polarity icon/Zenurik_Pol(xBlack).jpg", desc: "Se focalise sur la supériorité tactique et la régénération d'énergie." },
        { name: "Unairu", icon: "systems/warframe-ttrpg/asset/polarity icon/Unairu_Pol(xBlack).jpg", desc: "Se focalise sur la protection d'armure et la résistance aux dégâts." }
      ];

      let listHtml = `
        <div class="school-selector-dialog">
          <p style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #8892b0;">Sélectionnez votre École de Focalisation :</p>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
      `;

      for (let s of schools) {
        listHtml += `
          <li style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: rgba(13, 17, 24, 0.6); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${s.icon}" width="24" height="24" style="border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); mix-blend-mode: screen; background: transparent;" />
              <div style="display: flex; flex-direction: column; gap: 1px;">
                <span style="font-weight: bold; font-family: 'Orbitron', sans-serif; color: #fff; font-size: 12px;">${s.name}</span>
                <span style="font-size: 9px; color: #a0aec0;">${s.desc}</span>
              </div>
            </div>
            <button type="button" class="select-school-btn" data-school="${s.name}" style="width: auto; padding: 4px 10px; background: rgba(0,229,255,0.1); border: 1px solid #00e5ff; color: #00e5ff; font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: bold; border-radius: 3px; cursor: pointer;">
              Choisir
            </button>
          </li>
        `;
      }

      listHtml += `
          </ul>
        </div>
      `;

      new Dialog({
        title: "Choose Focus School",
        content: listHtml,
        buttons: {},
        render: dialogHtml => {
          dialogHtml.find(".select-school-btn").click(async ev => {
            const schoolName = ev.currentTarget.dataset.school;
            await this.actor.update({ "system.details.operator": schoolName });
            ui.notifications.info(`Selected ${schoolName} Focus School!`);
            ev.currentTarget.closest(".app").querySelector(".close").click();
          });
        }
      }, {
        width: 320,
        classes: ["warframe-sheet", "warframe-selector-popup"]
      }).render(true);
    });

    // Focus Tree Dialog (Madurai and Vazarin)
    html.find(".view-tree-btn").click(event => {
      const activeSchool = this.actor.system.details.operator;
      let listHtml = "";

      if (activeSchool === "Madurai") {
        listHtml = `
          <div class="focus-tree-window madurai-tree" style="padding: 4px;">
            <div class="tree-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="systems/warframe-ttrpg/asset/polarity icon/Madurai_Pol(xBlack).jpg" width="32" height="32" style="border-radius: 50%; border: 1px solid rgba(0, 229, 255, 0.3); mix-blend-mode: screen; filter: drop-shadow(0 0 3px #00e5ff); background: transparent;" />
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 16px; font-weight: bold; color: #fff; margin: 0; border: none;">Madurai Focus Tree</h2>
              </div>
              <button type="button" class="btn-reset-focus-tree" style="width: auto; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;" title="Réinitialiser tous les points de cet arbre">
                <i class="fas fa-undo-alt"></i> Réinitialiser l'Arbre
              </button>
            </div>
            <p style="font-size: 11px; color: #00e5ff; font-weight: bold; margin-top: 0; margin-bottom: 6px; font-family: 'Orbitron', sans-serif;">Focuses on speed and damage. Promotes offensive power.</p>
            <p style="font-size: 10px; color: #8892b0; margin-top: 0; margin-bottom: 20px;">Click nodes to customize your Madurai Focus. Prerequisites must be unlocked to progress further down the branches.</p>

            <div class="tree-layout-grid">
              
              <!-- Tier 1 -->
              <div class="tree-grid-row tier-1-row">
                <div class="tree-node-card center-card" data-node="phoenixTalons">
                  <div class="node-icon"><i class="fas fa-fire"></i></div>
                  <div class="node-info">
                    <span class="node-name">Phoenix Talons</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">+10% Damage bonus to all physical and elemental attacks.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 2 -->
              <div class="tree-grid-row tier-2-row">
                <div class="tree-node-card left-card" data-node="voidStrike">
                  <div class="node-icon"><i class="fas fa-bolt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Void Strike</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 20 Energy to deal +50% Damage on next attack.</p>
                  </div>
                </div>
                
                <div class="tree-node-card right-card" data-node="voidRadiance">
                  <div class="node-icon"><i class="fas fa-sun"></i></div>
                  <div class="node-info">
                    <span class="node-name">Void Radiance</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 25 Energy to emit a blinding wave of light, blinding close foes.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 3 -->
              <div class="tree-grid-row tier-3-row">
                <div class="tree-node-card" data-node="contaminationWave">
                  <div class="node-icon"><i class="fas fa-wave-square"></i></div>
                  <div class="node-info">
                    <span class="node-name">Contamination Wave</span>
                    <span class="node-type">Active</span>
                    <p class="node-desc">Emit a Void wave making enemies take +25% more damage.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="phoenixFlame">
                  <div class="node-icon"><i class="fas fa-hottub"></i></div>
                  <div class="node-info">
                    <span class="node-name">Phoenix Flame</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Gain +15% bonus weapon damage as elemental Heat damage.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="chainedSling">
                  <div class="node-icon"><i class="fas fa-link"></i></div>
                  <div class="node-info">
                    <span class="node-name">Chained Sling</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Consecutive Void Sling dashes travel faster, costing half energy.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="voidFuel">
                  <div class="node-icon"><i class="fas fa-gas-pump"></i></div>
                  <div class="node-info">
                    <span class="node-name">Void Fuel</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Weapon attacks gain +25% Ammo Efficiency after Void Sling.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 4 -->
              <div class="tree-grid-row tier-4-row">
                <div class="tree-node-card" data-node="savageSling">
                  <div class="node-icon"><i class="fas fa-running"></i></div>
                  <div class="node-info">
                    <span class="node-name">Savage Sling</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Dashing through enemies with Void Sling increases critical hit chance by +20% for 1 round.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="powerTransfer">
                  <div class="node-icon"><i class="fas fa-exchange-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Power Transfer</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Gain +20% Casting Speed to execute powers faster.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="phoenixSpark">
                  <div class="node-icon"><i class="fas fa-fire-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Phoenix Spark</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Your abilities have a 25% chance to Ignite targets, dealing Heat damage over time.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="innerFlare">
                  <div class="node-icon"><i class="fas fa-meteor"></i></div>
                  <div class="node-info">
                    <span class="node-name">Inner Flare</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Increases warframe Power Strength rating by +15%.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
      } else if (activeSchool === "Vazarin") {
        listHtml = `
          <div class="focus-tree-window vazarin-tree" style="padding: 4px;">
            <div class="tree-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="systems/warframe-ttrpg/asset/polarity icon/Vazarin_Pol(xBlack).jpg" width="32" height="32" style="border-radius: 50%; border: 1px solid rgba(0, 229, 255, 0.3); mix-blend-mode: screen; filter: drop-shadow(0 0 3px #00e5ff); background: transparent;" />
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 16px; font-weight: bold; color: #fff; margin: 0; border: none;">Vazarin Focus Tree</h2>
              </div>
              <button type="button" class="btn-reset-focus-tree" style="width: auto; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;" title="Réinitialiser tous les points de cet arbre">
                <i class="fas fa-undo-alt"></i> Réinitialiser l'Arbre
              </button>
            </div>
            <p style="font-size: 11px; color: #00e5ff; font-weight: bold; margin-top: 0; margin-bottom: 6px; font-family: 'Orbitron', sans-serif;">Focuses on defense, health, and shields. Promotes survivability.</p>
            <p style="font-size: 10px; color: #8892b0; margin-top: 0; margin-bottom: 20px;">Click nodes to customize your Vazarin Focus. Prerequisites must be unlocked to progress further down the branches.</p>

            <div class="tree-layout-grid">
              
              <!-- Tier 1 -->
              <div class="tree-grid-row tier-1-row">
                <div class="tree-node-card center-card" data-node="mendingTalons">
                  <div class="node-icon"><i class="fas fa-heartbeat"></i></div>
                  <div class="node-info">
                    <span class="node-name">Mending Talons</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">+10% healing efficiency on all spells and abilities.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 2 -->
              <div class="tree-grid-row tier-2-row">
                <div class="tree-node-card left-card" data-node="guardianDash">
                  <div class="node-icon"><i class="fas fa-shield-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Guardian Dash</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 20 Energy to dash, granting allies +50 Shields.</p>
                  </div>
                </div>
                
                <div class="tree-node-card right-card" data-node="mendingWaves">
                  <div class="node-icon"><i class="fas fa-tint"></i></div>
                  <div class="node-info">
                    <span class="node-name">Mending Waves</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 25 Energy to heal close allies for 40 Health.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 3 -->
              <div class="tree-grid-row tier-3-row">
                <div class="tree-node-card" data-node="protectiveDash">
                  <div class="node-icon"><i class="fas fa-user-shield"></i></div>
                  <div class="node-info">
                    <span class="node-name">Protective Dash</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Dashing through allies makes them immune to damage for 1 round.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="pollutedWaters">
                  <div class="node-icon"><i class="fas fa-hand-holding-water"></i></div>
                  <div class="node-info">
                    <span class="node-name">Polluted Waters</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Water shields cleanse active negative status ailments from allies.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="rejuvenatingTide">
                  <div class="node-icon"><i class="fas fa-water"></i></div>
                  <div class="node-info">
                    <span class="node-name">Rejuvenating Tide</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Close allies regenerate +5 Health per combat round.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="slingShield">
                  <div class="node-icon"><i class="fas fa-circle"></i></div>
                  <div class="node-info">
                    <span class="node-name">Sling Shield</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Void Slinging through allies grants them +30 Shields.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 4 -->
              <div class="tree-grid-row tier-4-row">
                <div class="tree-node-card" data-node="aegisFlare">
                  <div class="node-icon"><i class="fas fa-radiation"></i></div>
                  <div class="node-info">
                    <span class="node-name">Aegis Flare</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Guardian Dash shields explode for damage when broken by foes.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="reflectShield">
                  <div class="node-icon"><i class="fas fa-undo"></i></div>
                  <div class="node-info">
                    <span class="node-name">Reflect Shield</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Water shields reflect 20% of incoming physical damage to attackers.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="tidalSurge">
                  <div class="node-icon"><i class="fas fa-wave-square"></i></div>
                  <div class="node-info">
                    <span class="node-name">Tidal Surge</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Water wave sweeps enemies back and heals all allies for +20 Health.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="squadRenew">
                  <div class="node-icon"><i class="fas fa-sync-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Squad Renew</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Void Sling has 25% chance to reset ally Shield recharge delay.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
      } else if (activeSchool === "Naramon") {
        listHtml = `
          <div class="focus-tree-window naramon-tree" style="padding: 4px;">
            <div class="tree-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="systems/warframe-ttrpg/asset/polarity icon/Naramon_Pol(xBlack).jpg" width="32" height="32" style="border-radius: 50%; border: 1px solid rgba(0, 229, 255, 0.3); mix-blend-mode: screen; filter: drop-shadow(0 0 3px #00e5ff); background: transparent;" />
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 16px; font-weight: bold; color: #fff; margin: 0; border: none;">Naramon Focus Tree</h2>
              </div>
              <button type="button" class="btn-reset-focus-tree" style="width: auto; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;" title="Réinitialiser tous les points de cet arbre">
                <i class="fas fa-undo-alt"></i> Réinitialiser l'Arbre
              </button>
            </div>
            <p style="font-size: 11px; color: #00e5ff; font-weight: bold; margin-top: 0; margin-bottom: 6px; font-family: 'Orbitron', sans-serif;">Focuses on combat flow, speed, and melee weapon efficiency.</p>
            <p style="font-size: 10px; color: #8892b0; margin-top: 0; margin-bottom: 20px;">Click nodes to customize your Naramon Focus. Prerequisites must be unlocked to progress further down the branches.</p>

            <div class="tree-layout-grid">
              
              <!-- Tier 1 -->
              <div class="tree-grid-row tier-1-row">
                <div class="tree-node-card center-card" data-node="affinitySpike">
                  <div class="node-icon"><i class="fas fa-tree"></i></div>
                  <div class="node-info">
                    <span class="node-name">Affinity Spike</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">+10% Damage bonus to all melee attacks.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 2 -->
              <div class="tree-grid-row tier-2-row">
                <div class="tree-node-card left-card" data-node="openingSlam">
                  <div class="node-icon"><i class="fas fa-gavel"></i></div>
                  <div class="node-info">
                    <span class="node-name">Opening Slam</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 15 Energy to perform a wood-rooted melee slam, knocking down close foes.</p>
                  </div>
                </div>
                
                <div class="tree-node-card right-card" data-node="executingDash">
                  <div class="node-icon"><i class="fas fa-running"></i></div>
                  <div class="node-info">
                    <span class="node-name">Executing Dash</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 20 Energy to dash forward with blinding speed, opening targets to finishers.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 3 -->
              <div class="tree-grid-row tier-3-row">
                <div class="tree-node-card" data-node="sunderingStrike">
                  <div class="node-icon"><i class="fas fa-compress-arrows-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Sundering Strike</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Melee attacks have 20% chance to reduce enemy armor by 50% for 1 round.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="woodRoots">
                  <div class="node-icon"><i class="fas fa-leaf"></i></div>
                  <div class="node-info">
                    <span class="node-name">Wood Roots</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Dashing or slamming roots enemies in place, reducing speed to 0 for 1 round.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="surgingDash">
                  <div class="node-icon"><i class="fas fa-angle-double-right"></i></div>
                  <div class="node-info">
                    <span class="node-name">Surging Dash</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Void Sling travel speed is increased by +50%.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="powerSpike">
                  <div class="node-icon"><i class="fas fa-signal"></i></div>
                  <div class="node-info">
                    <span class="node-name">Power Spike</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Gain +2 bonus on all Melee attack rolls and draw weapons instantly.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 4 -->
              <div class="tree-grid-row tier-4-row">
                <div class="tree-node-card" data-node="savageFinisher">
                  <div class="node-icon"><i class="fas fa-skull"></i></div>
                  <div class="node-info">
                    <span class="node-name">Savage Finisher</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Increases Melee Finisher execution damage by +50%.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="thornedBind">
                  <div class="node-icon"><i class="fas fa-tint"></i></div>
                  <div class="node-info">
                    <span class="node-name">Thorned Bind</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Rooted enemies take Puncture damage over time from constricting thorns.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="killerRush">
                  <div class="node-icon"><i class="fas fa-fighter-jet"></i></div>
                  <div class="node-info">
                    <span class="node-name">Killer Rush</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Melee critical hit chance is increased by +15% while moving.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="heartOfOak">
                  <div class="node-icon"><i class="fas fa-shield-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Heart of Oak</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Deflecting or blocking melee attacks restores +5 health.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
      } else if (activeSchool === "Zenurik") {
        listHtml = `
          <div class="focus-tree-window zenurik-tree" style="padding: 4px;">
            <div class="tree-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="systems/warframe-ttrpg/asset/polarity icon/Zenurik_Pol(xBlack).jpg" width="32" height="32" style="border-radius: 50%; border: 1px solid rgba(0, 229, 255, 0.3); mix-blend-mode: screen; filter: drop-shadow(0 0 3px #00e5ff); background: transparent;" />
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 16px; font-weight: bold; color: #fff; margin: 0; border: none;">Zenurik Focus Tree</h2>
              </div>
              <button type="button" class="btn-reset-focus-tree" style="width: auto; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;" title="Réinitialiser tous les points de cet arbre">
                <i class="fas fa-undo-alt"></i> Réinitialiser l'Arbre
              </button>
            </div>
            <p style="font-size: 11px; color: #00e5ff; font-weight: bold; margin-top: 0; margin-bottom: 6px; font-family: 'Orbitron', sans-serif;">Focuses on energy economy, tactical crystal shields, and temporal slow.</p>
            <p style="font-size: 10px; color: #8892b0; margin-top: 0; margin-bottom: 20px;">Click nodes to customize your Zenurik Focus. Prerequisites must be unlocked to progress further down the branches.</p>

            <div class="tree-layout-grid">
              
              <!-- Tier 1 -->
              <div class="tree-grid-row tier-1-row">
                <div class="tree-node-card center-card" data-node="energyPulse">
                  <div class="node-icon"><i class="fas fa-bolt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Energy Pulse</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">+50 Maximum Energy pool reserve limit capacity.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 2 -->
              <div class="tree-grid-row tier-2-row">
                <div class="tree-node-card left-card" data-node="wellspring">
                  <div class="node-icon"><i class="fas fa-gem"></i></div>
                  <div class="node-info">
                    <span class="node-name">Wellspring</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 15 Energy to summon a crystal wellspring, restoring +5 Energy/round for 3 rounds.</p>
                  </div>
                </div>
                
                <div class="tree-node-card right-card" data-node="temporalDrag">
                  <div class="node-icon"><i class="fas fa-hourglass-half"></i></div>
                  <div class="node-info">
                    <span class="node-name">Temporal Drag</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 20 Energy to emit a slow-wave, reducing enemy actions by -2.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 3 -->
              <div class="tree-grid-row tier-3-row">
                <div class="tree-node-card" data-node="innerGaze">
                  <div class="node-icon"><i class="fas fa-eye"></i></div>
                  <div class="node-info">
                    <span class="node-name">Inner Gaze</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Increases your maximum Energy pool by an additional +20.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="channeledShield">
                  <div class="node-icon"><i class="fas fa-shield-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Channeled Shield</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Wellspring grants allies +25 temporary Shields from crystal shards.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="temporalShot">
                  <div class="node-icon"><i class="fas fa-crosshairs"></i></div>
                  <div class="node-info">
                    <span class="node-name">Temporal Shot</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Your weapon attacks deal +20% damage against slowed foes.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="crystalShell">
                  <div class="node-icon"><i class="fas fa-cube"></i></div>
                  <div class="node-info">
                    <span class="node-name">Crystal Shell</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Surrounds your warframe in a crystal shell, giving +20 Shield capacity.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 4 -->
              <div class="tree-grid-row tier-4-row">
                <div class="tree-node-card" data-node="voidFlow">
                  <div class="node-icon"><i class="fas fa-magic"></i></div>
                  <div class="node-info">
                    <span class="node-name">Void Flow</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Energy costs of all warframe abilities are reduced by 5.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="crystallineRecharge">
                  <div class="node-icon"><i class="fas fa-history"></i></div>
                  <div class="node-info">
                    <span class="node-name">Crystalline Recharge</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Wellspring duration is increased by +2 rounds.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="temporalStorm">
                  <div class="node-icon"><i class="fas fa-wind"></i></div>
                  <div class="node-info">
                    <span class="node-name">Temporal Storm</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Defeated slowed foes explode for 15 Puncture damage to nearby targets.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="energyShield">
                  <div class="node-icon"><i class="fas fa-compress-arrows-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Energy Shield</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Depleting Shields fully grants you +50 Energy instantly (once per encounter).</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
      } else if (activeSchool === "Unairu") {
        listHtml = `
          <div class="focus-tree-window unairu-tree" style="padding: 4px;">
            <div class="tree-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="systems/warframe-ttrpg/asset/polarity icon/Unairu_Pol(xBlack).jpg" width="32" height="32" style="border-radius: 50%; border: 1px solid rgba(0, 229, 255, 0.3); mix-blend-mode: screen; filter: drop-shadow(0 0 3px #00e5ff); background: transparent;" />
                <h2 style="font-family: 'Orbitron', sans-serif; font-size: 16px; font-weight: bold; color: #fff; margin: 0; border: none;">Unairu Focus Tree</h2>
              </div>
              <button type="button" class="btn-reset-focus-tree" style="width: auto; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px;" title="Réinitialiser tous les points de cet arbre">
                <i class="fas fa-undo-alt"></i> Réinitialiser l'Arbre
              </button>
            </div>
            <p style="font-size: 11px; color: #00e5ff; font-weight: bold; margin-top: 0; margin-bottom: 6px; font-family: 'Orbitron', sans-serif;">Focuses on heavy armor, damage resistance, and magnetic protection.</p>
            <p style="font-size: 10px; color: #8892b0; margin-top: 0; margin-bottom: 20px;">Click nodes to customize your Unairu Focus. Prerequisites must be unlocked to progress further down the branches.</p>

            <div class="tree-layout-grid">
              
              <!-- Tier 1 -->
              <div class="tree-grid-row tier-1-row">
                <div class="tree-node-card center-card" data-node="stoneSkin">
                  <div class="node-icon"><i class="fas fa-mountain"></i></div>
                  <div class="node-info">
                    <span class="node-name">Stone Skin</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">+50 base Armor value protection rating.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 2 -->
              <div class="tree-grid-row tier-2-row">
                <div class="tree-node-card left-card" data-node="magneticOutburst">
                  <div class="node-icon"><i class="fas fa-magnet"></i></div>
                  <div class="node-info">
                    <span class="node-name">Magnetic Outburst</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 15 Energy to slam, stripping 50% armor/shields from close foes.</p>
                  </div>
                </div>
                
                <div class="tree-node-card right-card" data-node="voidShadow">
                  <div class="node-icon"><i class="fas fa-ghost"></i></div>
                  <div class="node-info">
                    <span class="node-name">Void Shadow</span>
                    <span class="node-type">Active Power</span>
                    <p class="node-desc">Active: Consume 20 Energy to cloak nearby allies in invisibility (1 round) and grant +30% resistance.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 3 -->
              <div class="tree-grid-row tier-3-row">
                <div class="tree-node-card" data-node="reinforcedReturn">
                  <div class="node-icon"><i class="fas fa-angle-double-right"></i></div>
                  <div class="node-info">
                    <span class="node-name">Reinforced Return</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Casting active abilities grants +20 Armor for 1 round.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="staticShield">
                  <div class="node-icon"><i class="fas fa-shield-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Static Shield</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Shield recharge rate is increased by +20%.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="voidShield">
                  <div class="node-icon"><i class="fas fa-shield-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Void Shield</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Allies within 5m gain +10% DR against elemental attacks.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="guardianShell">
                  <div class="node-icon"><i class="fas fa-server"></i></div>
                  <div class="node-info">
                    <span class="node-name">Guardian Shell</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Maximum Shield capacity is increased by +30.</p>
                  </div>
                </div>
              </div>

              <!-- Tier 4 -->
              <div class="tree-grid-row tier-4-row">
                <div class="tree-node-card" data-node="unairuWisp">
                  <div class="node-icon"><i class="fas fa-star"></i></div>
                  <div class="node-info">
                    <span class="node-name">Unairu Wisp</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Casting a power spawns a protective wisp, absorbing 30 damage from the next incoming attack.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="magneticCrush">
                  <div class="node-icon"><i class="fas fa-exclamation-triangle"></i></div>
                  <div class="node-info">
                    <span class="node-name">Magnetic Crush</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Magnetic Outburst has a 30% chance to stun affected targets for 1 round.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="voidSpine">
                  <div class="node-icon"><i class="fas fa-reply"></i></div>
                  <div class="node-info">
                    <span class="node-name">Void Spine</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Reflect 15% of all blocked damage back to the attacker.</p>
                  </div>
                </div>

                <div class="tree-node-card" data-node="stoneFortitude">
                  <div class="node-icon"><i class="fas fa-shield-alt"></i></div>
                  <div class="node-info">
                    <span class="node-name">Stone Fortitude</span>
                    <span class="node-type">Passive</span>
                    <p class="node-desc">Gain permanent immunity to one damage type of your choice (Slash, Impact, or Puncture).</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        `;
      } else {
        ui.notifications.warn("No skill tree configured for this Focus School.");
        return;
      }

      new Dialog({
        title: `${activeSchool} Focus Tree`,
        content: listHtml,
        buttons: {},
        render: dialogHtml => {
          const refreshTree = () => {
            const currentNodes = this.actor.getFlag("warframe-ttrpg", "focusNodes") || {};
            dialogHtml.find(".tree-node-card").each((i, card) => {
              const nodeKey = card.dataset.node;
              const isUnlocked = currentNodes[nodeKey] === true;

              let isUnlockable = false;
              if (activeSchool === "Madurai") {
                if (nodeKey === "phoenixTalons") isUnlockable = true;
                if (nodeKey === "voidStrike" && currentNodes.phoenixTalons) isUnlockable = true;
                if (nodeKey === "voidRadiance" && currentNodes.phoenixTalons) isUnlockable = true;
                if (nodeKey === "contaminationWave" && currentNodes.voidStrike) isUnlockable = true;
                if (nodeKey === "phoenixFlame" && currentNodes.voidStrike) isUnlockable = true;
                if (nodeKey === "chainedSling" && currentNodes.voidRadiance) isUnlockable = true;
                if (nodeKey === "voidFuel" && currentNodes.voidRadiance) isUnlockable = true;
                if (nodeKey === "savageSling" && currentNodes.contaminationWave) isUnlockable = true;
                if (nodeKey === "powerTransfer" && currentNodes.phoenixFlame) isUnlockable = true;
                if (nodeKey === "phoenixSpark" && currentNodes.chainedSling) isUnlockable = true;
                if (nodeKey === "innerFlare" && currentNodes.voidFuel) isUnlockable = true;
              } else if (activeSchool === "Vazarin") {
                if (nodeKey === "mendingTalons") isUnlockable = true;
                if (nodeKey === "guardianDash" && currentNodes.mendingTalons) isUnlockable = true;
                if (nodeKey === "mendingWaves" && currentNodes.mendingTalons) isUnlockable = true;
                if (nodeKey === "protectiveDash" && currentNodes.guardianDash) isUnlockable = true;
                if (nodeKey === "pollutedWaters" && currentNodes.guardianDash) isUnlockable = true;
                if (nodeKey === "rejuvenatingTide" && currentNodes.mendingWaves) isUnlockable = true;
                if (nodeKey === "slingShield" && currentNodes.mendingWaves) isUnlockable = true;
                if (nodeKey === "aegisFlare" && currentNodes.protectiveDash) isUnlockable = true;
                if (nodeKey === "reflectShield" && currentNodes.pollutedWaters) isUnlockable = true;
              } else if (activeSchool === "Naramon") {
                if (nodeKey === "affinitySpike") isUnlockable = true;
                if (nodeKey === "openingSlam" && currentNodes.affinitySpike) isUnlockable = true;
                if (nodeKey === "executingDash" && currentNodes.affinitySpike) isUnlockable = true;
                if (nodeKey === "sunderingStrike" && currentNodes.openingSlam) isUnlockable = true;
                if (nodeKey === "woodRoots" && currentNodes.openingSlam) isUnlockable = true;
                if (nodeKey === "surgingDash" && currentNodes.executingDash) isUnlockable = true;
                if (nodeKey === "powerSpike" && currentNodes.executingDash) isUnlockable = true;
                if (nodeKey === "savageFinisher" && currentNodes.sunderingStrike) isUnlockable = true;
                if (nodeKey === "thornedBind" && currentNodes.woodRoots) isUnlockable = true;
                if (nodeKey === "killerRush" && currentNodes.surgingDash) isUnlockable = true;
                if (nodeKey === "heartOfOak" && currentNodes.powerSpike) isUnlockable = true;
              } else if (activeSchool === "Zenurik") {
                if (nodeKey === "energyPulse") isUnlockable = true;
                if (nodeKey === "wellspring" && currentNodes.energyPulse) isUnlockable = true;
                if (nodeKey === "temporalDrag" && currentNodes.energyPulse) isUnlockable = true;
                if (nodeKey === "innerGaze" && currentNodes.wellspring) isUnlockable = true;
                if (nodeKey === "channeledShield" && currentNodes.wellspring) isUnlockable = true;
                if (nodeKey === "temporalShot" && currentNodes.temporalDrag) isUnlockable = true;
                if (nodeKey === "crystalShell" && currentNodes.temporalDrag) isUnlockable = true;
                if (nodeKey === "voidFlow" && currentNodes.innerGaze) isUnlockable = true;
                if (nodeKey === "crystallineRecharge" && currentNodes.channeledShield) isUnlockable = true;
                if (nodeKey === "temporalStorm" && currentNodes.temporalShot) isUnlockable = true;
                if (nodeKey === "energyShield" && currentNodes.crystalShell) isUnlockable = true;
              } else if (activeSchool === "Unairu") {
                if (nodeKey === "stoneSkin") isUnlockable = true;
                if (nodeKey === "magneticOutburst" && currentNodes.stoneSkin) isUnlockable = true;
                if (nodeKey === "voidShadow" && currentNodes.stoneSkin) isUnlockable = true;
                if (nodeKey === "reinforcedReturn" && currentNodes.magneticOutburst) isUnlockable = true;
                if (nodeKey === "staticShield" && currentNodes.magneticOutburst) isUnlockable = true;
                if (nodeKey === "voidShield" && currentNodes.voidShadow) isUnlockable = true;
                if (nodeKey === "guardianShell" && currentNodes.voidShadow) isUnlockable = true;
                if (nodeKey === "unairuWisp" && currentNodes.reinforcedReturn) isUnlockable = true;
                if (nodeKey === "magneticCrush" && currentNodes.staticShield) isUnlockable = true;
                if (nodeKey === "voidSpine" && currentNodes.voidShield) isUnlockable = true;
                if (nodeKey === "stoneFortitude" && currentNodes.guardianShell) isUnlockable = true;
              }

              $(card).removeClass("unlocked locked unlockable");
              if (isUnlocked) {
                $(card).addClass("unlocked");
              } else {
                $(card).addClass("locked");
                if (isUnlockable) {
                  $(card).addClass("unlockable");
                }
              }
            });
          };

          refreshTree();

          dialogHtml.find(".btn-reset-focus-tree").click(async ev => {
            ev.preventDefault();
            await this.actor.unsetFlag("warframe-ttrpg", "focusNodes");
            await this._syncFocusActiveEffects({});
            ui.notifications.info(`Arbre de Focalisation (${activeSchool}) réinitialisé. Tous les points ont été retirés.`);
            refreshTree();
          });

          dialogHtml.find(".tree-node-card").click(async ev => {
            const card = ev.currentTarget;
            const nodeKey = card.dataset.node;
            const currentNodes = this.actor.getFlag("warframe-ttrpg", "focusNodes") || {};
            const isUnlocked = currentNodes[nodeKey] === true;

            if (!isUnlocked) {
              let prereqMet = false;
              if (activeSchool === "Madurai") {
                if (nodeKey === "phoenixTalons") prereqMet = true;
                if (nodeKey === "voidStrike" && currentNodes.phoenixTalons) prereqMet = true;
                if (nodeKey === "voidRadiance" && currentNodes.phoenixTalons) prereqMet = true;
                if (nodeKey === "contaminationWave" && currentNodes.voidStrike) prereqMet = true;
                if (nodeKey === "phoenixFlame" && currentNodes.voidStrike) prereqMet = true;
                if (nodeKey === "chainedSling" && currentNodes.voidRadiance) prereqMet = true;
                if (nodeKey === "voidFuel" && currentNodes.voidRadiance) prereqMet = true;
                if (nodeKey === "savageSling" && currentNodes.contaminationWave) prereqMet = true;
                if (nodeKey === "powerTransfer" && currentNodes.phoenixFlame) prereqMet = true;
                if (nodeKey === "phoenixSpark" && currentNodes.chainedSling) prereqMet = true;
                if (nodeKey === "innerFlare" && currentNodes.voidFuel) prereqMet = true;
              } else if (activeSchool === "Vazarin") {
                if (nodeKey === "mendingTalons") prereqMet = true;
                if (nodeKey === "guardianDash" && currentNodes.mendingTalons) prereqMet = true;
                if (nodeKey === "mendingWaves" && currentNodes.mendingTalons) prereqMet = true;
                if (nodeKey === "protectiveDash" && currentNodes.guardianDash) prereqMet = true;
                if (nodeKey === "pollutedWaters" && currentNodes.guardianDash) prereqMet = true;
                if (nodeKey === "rejuvenatingTide" && currentNodes.mendingWaves) prereqMet = true;
                if (nodeKey === "slingShield" && currentNodes.mendingWaves) prereqMet = true;
                if (nodeKey === "aegisFlare" && currentNodes.protectiveDash) prereqMet = true;
                if (nodeKey === "reflectShield" && currentNodes.pollutedWaters) prereqMet = true;
                if (nodeKey === "tidalSurge" && currentNodes.rejuvenatingTide) prereqMet = true;
                if (nodeKey === "squadRenew" && currentNodes.slingShield) prereqMet = true;
              } else if (activeSchool === "Naramon") {
                if (nodeKey === "affinitySpike") prereqMet = true;
                if (nodeKey === "openingSlam" && currentNodes.affinitySpike) prereqMet = true;
                if (nodeKey === "executingDash" && currentNodes.affinitySpike) prereqMet = true;
                if (nodeKey === "sunderingStrike" && currentNodes.openingSlam) prereqMet = true;
                if (nodeKey === "woodRoots" && currentNodes.openingSlam) prereqMet = true;
                if (nodeKey === "surgingDash" && currentNodes.executingDash) prereqMet = true;
                if (nodeKey === "powerSpike" && currentNodes.executingDash) prereqMet = true;
                if (nodeKey === "savageFinisher" && currentNodes.sunderingStrike) prereqMet = true;
                if (nodeKey === "thornedBind" && currentNodes.woodRoots) prereqMet = true;
                if (nodeKey === "killerRush" && currentNodes.surgingDash) prereqMet = true;
                if (nodeKey === "heartOfOak" && currentNodes.powerSpike) prereqMet = true;
              } else if (activeSchool === "Zenurik") {
                if (nodeKey === "energyPulse") prereqMet = true;
                if (nodeKey === "wellspring" && currentNodes.energyPulse) prereqMet = true;
                if (nodeKey === "temporalDrag" && currentNodes.energyPulse) prereqMet = true;
                if (nodeKey === "innerGaze" && currentNodes.wellspring) prereqMet = true;
                if (nodeKey === "channeledShield" && currentNodes.wellspring) prereqMet = true;
                if (nodeKey === "temporalShot" && currentNodes.temporalDrag) prereqMet = true;
                if (nodeKey === "crystalShell" && currentNodes.temporalDrag) prereqMet = true;
                if (nodeKey === "voidFlow" && currentNodes.innerGaze) prereqMet = true;
                if (nodeKey === "crystallineRecharge" && currentNodes.channeledShield) prereqMet = true;
                if (nodeKey === "temporalStorm" && currentNodes.temporalShot) prereqMet = true;
                if (nodeKey === "energyShield" && currentNodes.crystalShell) prereqMet = true;
              } else if (activeSchool === "Unairu") {
                if (nodeKey === "stoneSkin") prereqMet = true;
                if (nodeKey === "magneticOutburst" && currentNodes.stoneSkin) prereqMet = true;
                if (nodeKey === "voidShadow" && currentNodes.stoneSkin) prereqMet = true;
                if (nodeKey === "reinforcedReturn" && currentNodes.magneticOutburst) prereqMet = true;
                if (nodeKey === "staticShield" && currentNodes.magneticOutburst) prereqMet = true;
                if (nodeKey === "voidShield" && currentNodes.voidShadow) prereqMet = true;
                if (nodeKey === "guardianShell" && currentNodes.voidShadow) prereqMet = true;
                if (nodeKey === "unairuWisp" && currentNodes.reinforcedReturn) prereqMet = true;
                if (nodeKey === "magneticCrush" && currentNodes.staticShield) prereqMet = true;
                if (nodeKey === "voidSpine" && currentNodes.voidShield) prereqMet = true;
                if (nodeKey === "stoneFortitude" && currentNodes.guardianShell) prereqMet = true;
              }

              if (!prereqMet) {
                ui.notifications.warn("Prerequisite node must be unlocked first!");
                return;
              }

              currentNodes[nodeKey] = true;
              ui.notifications.info(`Unlocked ${activeSchool}: ${$(card).find(".node-name").text()}!`);
            } else {
              currentNodes[nodeKey] = false;

              // Refund cascade
              if (activeSchool === "Madurai") {
                if (nodeKey === "phoenixTalons") {
                  currentNodes.voidStrike = false;
                  currentNodes.voidRadiance = false;
                  currentNodes.contaminationWave = false;
                  currentNodes.phoenixFlame = false;
                  currentNodes.chainedSling = false;
                  currentNodes.voidFuel = false;
                  currentNodes.savageSling = false;
                  currentNodes.powerTransfer = false;
                  currentNodes.phoenixSpark = false;
                  currentNodes.innerFlare = false;
                }
                if (nodeKey === "voidStrike") {
                  currentNodes.contaminationWave = false;
                  currentNodes.phoenixFlame = false;
                  currentNodes.savageSling = false;
                  currentNodes.powerTransfer = false;
                }
                if (nodeKey === "voidRadiance") {
                  currentNodes.chainedSling = false;
                  currentNodes.voidFuel = false;
                  currentNodes.phoenixSpark = false;
                  currentNodes.innerFlare = false;
                }
                if (nodeKey === "contaminationWave") {
                  currentNodes.savageSling = false;
                }
                if (nodeKey === "phoenixFlame") {
                  currentNodes.powerTransfer = false;
                }
                if (nodeKey === "chainedSling") {
                  currentNodes.phoenixSpark = false;
                }
                if (nodeKey === "voidFuel") {
                  currentNodes.innerFlare = false;
                }
              } else if (activeSchool === "Vazarin") {
                if (nodeKey === "mendingTalons") {
                  currentNodes.guardianDash = false;
                  currentNodes.mendingWaves = false;
                  currentNodes.protectiveDash = false;
                  currentNodes.pollutedWaters = false;
                  currentNodes.rejuvenatingTide = false;
                  currentNodes.slingShield = false;
                  currentNodes.aegisFlare = false;
                  currentNodes.reflectShield = false;
                  currentNodes.tidalSurge = false;
                  currentNodes.squadRenew = false;
                }
                if (nodeKey === "guardianDash") {
                  currentNodes.protectiveDash = false;
                  currentNodes.pollutedWaters = false;
                  currentNodes.aegisFlare = false;
                  currentNodes.reflectShield = false;
                }
                if (nodeKey === "mendingWaves") {
                  currentNodes.rejuvenatingTide = false;
                  currentNodes.slingShield = false;
                  currentNodes.tidalSurge = false;
                  currentNodes.squadRenew = false;
                }
                if (nodeKey === "protectiveDash") {
                  currentNodes.aegisFlare = false;
                }
                if (nodeKey === "pollutedWaters") {
                  currentNodes.reflectShield = false;
                }
                if (nodeKey === "rejuvenatingTide") {
                  currentNodes.tidalSurge = false;
                }
                if (nodeKey === "slingShield") {
                  currentNodes.squadRenew = false;
                }
              } else if (activeSchool === "Naramon") {
                if (nodeKey === "affinitySpike") {
                  currentNodes.openingSlam = false;
                  currentNodes.executingDash = false;
                  currentNodes.sunderingStrike = false;
                  currentNodes.woodRoots = false;
                  currentNodes.surgingDash = false;
                  currentNodes.powerSpike = false;
                  currentNodes.savageFinisher = false;
                  currentNodes.thornedBind = false;
                  currentNodes.killerRush = false;
                  currentNodes.heartOfOak = false;
                }
                if (nodeKey === "openingSlam") {
                  currentNodes.sunderingStrike = false;
                  currentNodes.woodRoots = false;
                  currentNodes.savageFinisher = false;
                  currentNodes.thornedBind = false;
                }
                if (nodeKey === "executingDash") {
                  currentNodes.surgingDash = false;
                  currentNodes.powerSpike = false;
                  currentNodes.killerRush = false;
                  currentNodes.heartOfOak = false;
                }
                if (nodeKey === "sunderingStrike") {
                  currentNodes.savageFinisher = false;
                }
                if (nodeKey === "woodRoots") {
                  currentNodes.thornedBind = false;
                }
                if (nodeKey === "surgingDash") {
                  currentNodes.killerRush = false;
                }
                if (nodeKey === "powerSpike") {
                  currentNodes.heartOfOak = false;
                }
              } else if (activeSchool === "Zenurik") {
                if (nodeKey === "energyPulse") {
                  currentNodes.wellspring = false;
                  currentNodes.temporalDrag = false;
                  currentNodes.innerGaze = false;
                  currentNodes.channeledShield = false;
                  currentNodes.temporalShot = false;
                  currentNodes.crystalShell = false;
                  currentNodes.voidFlow = false;
                  currentNodes.crystallineRecharge = false;
                  currentNodes.temporalStorm = false;
                  currentNodes.energyShield = false;
                }
                if (nodeKey === "wellspring") {
                  currentNodes.innerGaze = false;
                  currentNodes.channeledShield = false;
                  currentNodes.voidFlow = false;
                  currentNodes.crystallineRecharge = false;
                }
                if (nodeKey === "temporalDrag") {
                  currentNodes.temporalShot = false;
                  currentNodes.crystalShell = false;
                  currentNodes.temporalStorm = false;
                  currentNodes.energyShield = false;
                }
                if (nodeKey === "innerGaze") {
                  currentNodes.voidFlow = false;
                }
                if (nodeKey === "channeledShield") {
                  currentNodes.crystallineRecharge = false;
                }
                if (nodeKey === "temporalShot") {
                  currentNodes.temporalStorm = false;
                }
                if (nodeKey === "crystalShell") {
                  currentNodes.energyShield = false;
                }
              } else if (activeSchool === "Unairu") {
                if (nodeKey === "stoneSkin") {
                  currentNodes.magneticOutburst = false;
                  currentNodes.voidShadow = false;
                  currentNodes.reinforcedReturn = false;
                  currentNodes.staticShield = false;
                  currentNodes.voidShield = false;
                  currentNodes.guardianShell = false;
                  currentNodes.unairuWisp = false;
                  currentNodes.magneticCrush = false;
                  currentNodes.voidSpine = false;
                  currentNodes.stoneFortitude = false;
                }
                if (nodeKey === "magneticOutburst") {
                  currentNodes.reinforcedReturn = false;
                  currentNodes.staticShield = false;
                  currentNodes.unairuWisp = false;
                  currentNodes.magneticCrush = false;
                }
                if (nodeKey === "voidShadow") {
                  currentNodes.voidShield = false;
                  currentNodes.guardianShell = false;
                  currentNodes.voidSpine = false;
                  currentNodes.stoneFortitude = false;
                }
                if (nodeKey === "reinforcedReturn") {
                  currentNodes.unairuWisp = false;
                }
                if (nodeKey === "staticShield") {
                  currentNodes.magneticCrush = false;
                }
                if (nodeKey === "voidShield") {
                  currentNodes.voidSpine = false;
                }
                if (nodeKey === "guardianShell") {
                  currentNodes.stoneFortitude = false;
                }
              }

              ui.notifications.info(`Locked/Refunded: ${$(card).find(".node-name").text()}.`);
            }

            const anyUnlocked = Object.values(currentNodes).some(v => v === true);
            if (!anyUnlocked) {
              await this.actor.unsetFlag("warframe-ttrpg", "focusNodes");
            } else {
              await this.actor.setFlag("warframe-ttrpg", "focusNodes", currentNodes);
            }
            await this._syncFocusActiveEffects(currentNodes);
            refreshTree();
          });
        }
      }, {
        width: 740,
        classes: ["warframe-sheet", "focus-tree-popup"]
      }).render(true);
    });

    // Active Effects control listeners
    html.find(".effect-control.create").click(async () => {
      await this.actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "New Effect",
        icon: "icons/svg/aura.svg",
        origin: this.actor.uuid,
        disabled: false
      }]);
    });

    html.find(".effect-control.edit").click(ev => {
      const effectId = ev.currentTarget.closest(".item-row").dataset.effectId;
      const effect = this.actor.effects.get(effectId);
      if (effect) effect.sheet.render(true);
    });

    html.find(".effect-control.delete").click(ev => {
      const effectId = ev.currentTarget.closest(".item-row").dataset.effectId;
      const effect = this.actor.effects.get(effectId);
      if (effect) {
        Dialog.confirm({
          title: "Delete Effect",
          content: `<p>Are you sure you want to delete ${effect.name}?</p>`,
          yes: () => effect.delete()
        });
      }
    });

    html.find(".effect-control.toggle").click(async ev => {
      const effectId = ev.currentTarget.closest(".item-row").dataset.effectId;
      const effect = this.actor.effects.get(effectId);
      if (effect) {
        await effect.update({ disabled: !effect.disabled });
      }
    });

    // Item controls
    html.find(".item-create").click(this._onItemCreate.bind(this));

    html.find(".item-edit").click(event => {
      const li = $(event.currentTarget).parents(".item-row");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    html.find(".item-delete").click(event => {
      const li = $(event.currentTarget).parents(".item-row");
      const item = this.actor.items.get(li.data("itemId"));
      
      Dialog.confirm({
        title: "Delete Item",
        content: `<p>Are you sure you want to delete ${item.name}?</p>`,
        yes: () => item.delete()
      });
    });
  }

  /**
   * Open searchable Warframe Selector Dialog
   */
  async _openWarframeSelectorDialog() {
    const warframes = [];

    // 1. Gather from Compendium database pack
    const pack = game.packs.get("warframe-ttrpg.warframes");
    if (pack) {
      const compendiumIndex = await pack.getIndex();
      for (let ent of compendiumIndex) {
        if (ent.type === "warframe") {
          const entryId = ent.id || ent._id || ent.uuid;
          if (!entryId) continue;
          warframes.push({
            id: entryId,
            name: ent.name,
            img: ent.img,
            source: "compendium"
          });
        }
      }
    }

    // 2. Gather from World Items sidebar directory
    for (let i of game.items) {
      if (i.type === "warframe") {
        if (!i.id) continue;
        if (!warframes.some(w => w.name === i.name)) {
          warframes.push({
            id: i.id,
            name: i.name,
            img: i.img,
            source: "world"
          });
        }
      }
    }

    if (warframes.length === 0) {
      ui.notifications.warn("No Warframe items found in the world items directory or compendium pack!");
      return;
    }

    // Sort alphabetically by name
    warframes.sort((a, b) => a.name.localeCompare(b.name));

    let listHtml = `
      <div class="warframe-selector-dialog" style="font-family: 'Inter', sans-serif;">
        <div style="margin-bottom: 10px;">
          <input type="text" class="warframe-search-input" placeholder="🔍 Search Warframe by name..." autofocus style="width: 100%; padding: 7px 10px; font-size: 11px; font-family: 'Inter', sans-serif; background: rgba(0,0,0,0.5); border: 1px solid rgba(0, 229, 255, 0.4); color: #fff; border-radius: 4px; outline: none; box-sizing: border-box;" />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 11px; color: #8892b0;">Select a Warframe to equip:</span>
          <span class="warframe-count-badge" style="color: #00e5ff; font-weight: bold; font-family: 'Orbitron', sans-serif; font-size: 10px;">${warframes.length} Warframes</span>
        </div>
        <ul class="warframe-select-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
    `;

    for (let wf of warframes) {
      listHtml += `
        <li class="warframe-select-row" data-name="${wf.name.toLowerCase()}" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: rgba(13, 17, 24, 0.7); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 4px; transition: all 0.2s ease;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="${wf.img}" width="30" height="30" style="border: 1px solid rgba(0,229,255,0.3); border-radius: 50%; object-fit: cover; background: rgba(0,0,0,0.4);" />
            <span style="font-weight: bold; font-family: 'Orbitron', sans-serif; color: #fff; font-size: 12px; letter-spacing: 0.5px;">${wf.name}</span>
          </div>
          <button type="button" class="select-frame-btn" data-item-id="${wf.id}" data-source="${wf.source}" style="width: auto; padding: 4px 12px; background: rgba(0,229,255,0.1); border: 1px solid #00e5ff; color: #00e5ff; font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: bold; border-radius: 3px; cursor: pointer; transition: all 0.2s ease;">
            Equip
          </button>
        </li>
      `;
    }

    listHtml += `
        </ul>
      </div>
    `;

    new Dialog({
      title: "Equip Warframe",
      content: listHtml,
      buttons: {},
      render: dialogHtml => {
        // Auto-focus search input
        setTimeout(() => dialogHtml.find(".warframe-search-input").focus(), 50);

        // Instant live search filter
        dialogHtml.find(".warframe-search-input").on("input", ev => {
          const query = ev.target.value.toLowerCase().trim();
          let visibleCount = 0;
          dialogHtml.find(".warframe-select-row").each((_, row) => {
            const name = (row.dataset.name || "").toLowerCase();
            if (!query || name.includes(query)) {
              $(row).show();
              visibleCount++;
            } else {
              $(row).hide();
            }
          });
          dialogHtml.find(".warframe-count-badge").text(`${visibleCount} Warframe${visibleCount === 1 ? "" : "s"}`);
        });

        dialogHtml.find(".select-frame-btn").click(async ev => {
          ev.preventDefault();
          const btn = ev.currentTarget;
          const itemId = btn.dataset.itemId || btn.getAttribute("data-item-id");
          const source = btn.dataset.source || btn.getAttribute("data-source");

          if (!itemId || itemId === "null" || itemId === "undefined") {
            ui.notifications.error("Could not equip: selected item ID is invalid.");
            ev.currentTarget.closest(".app").querySelector(".close").click();
            return;
          }

          try {
            let targetItem = null;
            if (source === "world") {
              targetItem = game.items.get(itemId);
            } else if (pack) {
              targetItem = await pack.getDocument(itemId);
            }

            if (targetItem) {
              const existingFrames = this.actor.items.filter(i => i.type === "warframe");
              if (existingFrames.length > 0) {
                const existingIds = existingFrames.map(i => i.id);
                await this.actor.deleteEmbeddedDocuments("Item", existingIds);
              }

              const itemData = targetItem.toObject();
              const createdFrames = await this.actor.createEmbeddedDocuments("Item", [itemData]);

              const baseH = Number(itemData.system?.baseHealth) || 100;
              const baseS = Number(itemData.system?.baseShields) || 100;
              const baseE = Number(itemData.system?.baseEnergy) || 100;
              const baseA = Number(itemData.system?.baseArmor) || 100;

              const maxH = this.actor.system.health?.max || baseH;
              const maxS = this.actor.system.shields?.max || baseS;
              const maxE = this.actor.system.energy?.max || baseE;

              await this.actor.update({
                "system.health.value": maxH,
                "system.health.max": maxH,
                "system.shields.value": maxS,
                "system.shields.max": maxS,
                "system.energy.value": maxE,
                "system.energy.max": maxE,
                "system.armor.value": baseA
              });

              if (createdFrames.length > 0 && typeof this.actor.checkAndGrantAdvancements === "function") {
                await this.actor.checkAndGrantAdvancements(createdFrames[0]);
              }

              ui.notifications.info(`Equipped ${targetItem.name}!`);
            } else {
              ui.notifications.error(`Could not locate the selected Warframe (${itemId}) in ${source}`);
            }
          } catch (err) {
            console.error("Warframe TTRPG | Equip Warframe Error:", err);
            ui.notifications.error(`Equip failed: ${err.message}`);
          }

          ev.currentTarget.closest(".app").querySelector(".close").click();
        });
      }
    }, {
      width: 360,
      classes: ["warframe-sheet", "warframe-selector-popup"]
    }).render(true);
  }

  /**
   * Handle creating a new Embedded Item on this Actor
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;
    const itemData = {
      name: `New ${type.capitalize()}`,
      type: type,
      system: {}
    };
    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  /**
   * Sync active effects based on the selected focus nodes
   */
  async _syncFocusActiveEffects(currentNodes) {
    if (typeof this.actor.syncFocusActiveEffects === "function") {
      return this.actor.syncFocusActiveEffects(currentNodes);
    }
  }

  /** @override */
  async _onDropItem(event, data) {
    if (!this.actor.isOwner) return false;
    const item = await Item.fromDropData(data);
    if (!item) return false;
    
    const nameLower = (item.name || "").toLowerCase();
    if (nameLower.includes("orokin reactor") || (item.type === "consumable" && item.system?.superchargerType === "Orokin Reactor")) {
      const current = this.actor.flags["warframe-ttrpg"]?.orokinReactor;
      if (current) {
        ui.notifications.info(`${this.actor.name} already has an Orokin Reactor installed!`);
        return false;
      }
      await this.actor.update({ "flags.warframe-ttrpg.orokinReactor": true });
      ui.notifications.info(`Installed Orokin Reactor on ${this.actor.name}! Warframe mod capacity doubled to 60.`);
      return false;
    }

    if (nameLower.includes("orokin catalyst") || (item.type === "consumable" && item.system?.superchargerType === "Orokin Catalyst")) {
      ui.notifications.info("Orokin Catalysts are installed on weapons! Open a Weapon sheet to install or drop the Catalyst there.");
    }

    if (item.type === "warframe") {
      // Find existing warframe items and delete them so we only have one equipped at a time
      const existingFrames = this.actor.items.filter(i => i.type === "warframe");
      if (existingFrames.length > 0) {
        const ids = existingFrames.map(i => i.id);
        await this.actor.deleteEmbeddedDocuments("Item", ids);
      }
    }
    
    return super._onDropItem(event, data);
  }

  /**
   * Action handler for general Gear & Utility consumables
   */
  async _onUseGearItem(item) {
    if (item.system.quantity <= 0) {
      ui.notifications.warn(`You do not have any ${item.name} remaining!`);
      return;
    }

    let rollResultHtml = "";
    let rollTotal = 0;
    if (item.system.formula) {
      try {
        const roll = new Roll(item.system.formula);
        await roll.evaluate();
        rollTotal = roll.total;
        
        const isHeal = item.system.actionType === "heal";
        const actionLabel = isHeal ? "Healed" : "Damage";
        const typeLabel = item.system.damageType ? ` (${item.system.damageType})` : "";
        
        rollResultHtml = `
          <div style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="color: #ccd6f6; font-size: 11px; font-weight: bold; text-transform: uppercase;">${actionLabel} Result</span>
              <span style="color: #00e5ff; font-weight: bold;">${roll.total}${typeLabel}</span>
            </div>
            ${await roll.render()}
          </div>
        `;
      } catch (err) {
        console.error(err);
      }
    }

    // Save DC info if configured
    let saveResultHtml = "";
    if (item.system.save && item.system.save.ability) {
      const abilityLabel = item.system.save.ability.capitalize();
      saveResultHtml = `
        <div style="margin-top: 6px; padding: 4px 8px; background: rgba(255, 42, 95, 0.08); border: 1px solid rgba(255, 42, 95, 0.2); border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
          <span style="color: #ff2a5f; font-weight: bold;">Saving Throw:</span>
          <span style="color: #fff; font-weight: bold;">DC ${item.system.save.dc} ${abilityLabel}</span>
        </div>
      `;
    }

    // Generate apply effect button if there is a roll total and action type is heal or damage
    let applyEffectHtml = "";
    if (rollTotal > 0 && (item.system.actionType === "heal" || item.system.actionType === "damage")) {
      const isHeal = item.system.actionType === "heal";
      const btnLabel = isHeal ? "Apply Healing" : "Apply Damage";
      const btnIcon = isHeal ? "fa-heart" : "fa-shield-alt";
      const btnClass = isHeal ? "heal" : "damage";
      
      applyEffectHtml = `
        <div class="chat-card-actions" style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px; display: flex; gap: 8px;">
          <button type="button" class="apply-chat-effect-btn ${btnClass}" data-action="${item.system.actionType}" data-value="${rollTotal}" style="flex: 1; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; background: rgba(0, 229, 255, 0.1) !important; border: 1px solid rgba(0, 229, 255, 0.3) !important; color: #00e5ff !important; padding: 6px 0; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fas ${btnIcon}"></i> ${btnLabel}
          </button>
        </div>
      `;
    }

    // Decrement quantity
    await item.update({ "system.quantity": item.system.quantity - 1 });

    // Consomme l'action appropriée (Action Majeure, Parkour ou Réaction)
    if (typeof this.actor.consumeCombatAction === "function") {
      const act = item.system.activation || "action";
      if (act !== "none" && act !== "passive") {
        await this.actor.consumeCombatAction(act === "bonus" ? "action" : act);
      }
    }

    // Post chat card
    const cardContent = `
      <div class="warframe-chat-card consumable-card" style="font-family: 'Inter', sans-serif;">
        <div class="card-header" style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 8px; margin-bottom: 10px;">
          <img src="${item.img}" width="30" height="30" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;" />
          <div>
            <h3 style="font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: bold; color: #fff; margin: 0;">${item.name} Used</h3>
            <span style="font-size: 9px; color: #00e5ff; text-transform: uppercase;">Gear / Consumable</span>
          </div>
        </div>
        <div class="card-body" style="font-size: 12px; color: #ccd6f6;">
          <p>${item.system.description || "No description provided."}</p>
          <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; margin-bottom: 8px;">
            <span>Activation: <strong>${item.system.activation || "None"}</strong></span>
            <span>Range: <strong>${item.system.range || "Self"}</strong></span>
          </div>
          ${saveResultHtml}
          ${rollResultHtml}
          ${applyEffectHtml}
        </div>
      </div>
    `;

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: cardContent
    });
  }

  /**
   * Dialog for applying a Forma to a mod slot or melee weapon
   */
  async _onUseFormaDialog(preselectedConsumableId = null) {
    const consumables = this.actor.items.filter(i => i.type === "consumable" && ["Forma", "Omni Forma", "Umbra Forma", "Stance Forma"].includes(i.system.type));
    
    if (consumables.length === 0) {
      ui.notifications.warn("You do not have any Formas in your Arsenal! Add a consumable of type 'Forma', 'Omni Forma', 'Umbra Forma', or 'Stance Forma' first.");
      return;
    }

    let preselectedConsumable = null;
    if (preselectedConsumableId) {
      preselectedConsumable = this.actor.items.get(preselectedConsumableId);
    }

    const meleeWeapons = this.actor.items.filter(i => i.type === "weapon" && i.system.type === "melee");

    let optionsHtml = "";
    for (let c of consumables) {
      const selected = preselectedConsumable && preselectedConsumable.id === c.id ? "selected" : "";
      optionsHtml += `<option value="${c.id}" data-type="${c.system.type}" ${selected}>${c.name} (${c.system.type}) - Qty: ${c.system.quantity}</option>`;
    }

    let weaponOptionsHtml = "";
    for (let w of meleeWeapons) {
      weaponOptionsHtml += `<option value="${w.id}">${w.name} (Current Stance: ${w.system.stancePolarity || "none"})</option>`;
    }

    const content = `
      <form class="forma-use-form" style="padding: 10px; font-family: 'Inter', sans-serif;">
        <div class="form-group" style="margin-bottom: 12px;">
          <label style="font-weight: bold; color: #00e5ff; display: block; margin-bottom: 5px;">Select Forma from Inventory:</label>
          <select id="forma-item-select" name="formaId" style="width: 100%; background: #1a2436; color: #fff; border: 1px solid rgba(0, 229, 255, 0.2); padding: 5px; border-radius: 4px;">
            ${optionsHtml}
          </select>
        </div>

        <div id="target-slot-group" class="form-group" style="margin-bottom: 12px;">
          <label style="font-weight: bold; color: #00e5ff; display: block; margin-bottom: 5px;">Select Target Slot:</label>
          <select id="forma-slot-select" name="slot" style="width: 100%; background: #1a2436; color: #fff; border: 1px solid rgba(0, 229, 255, 0.2); padding: 5px; border-radius: 4px;">
            <option value="aura">Aura Slot</option>
            ${(this.actor.items.some(i => i.type === "warframe" && i.name.toLowerCase().includes("jade")) || (this.actor.system.details?.frameClass || "").toLowerCase().includes("jade")) ? '<option value="aura2">Aura 2 Slot</option>' : ''}
            <option value="exilus">Exilus Slot</option>
            <option value="slot1">Slot 1</option>
            <option value="slot2">Slot 2</option>
            <option value="slot3">Slot 3</option>
            <option value="slot4">Slot 4</option>
            <option value="slot5">Slot 5</option>
            <option value="slot6">Slot 6</option>
            <option value="slot7">Slot 7</option>
            <option value="slot8">Slot 8</option>
          </select>
        </div>

        <div id="target-weapon-group" class="form-group" style="margin-bottom: 12px; display: none;">
          <label style="font-weight: bold; color: #00e5ff; display: block; margin-bottom: 5px;">Select Melee Weapon:</label>
          <select id="forma-weapon-select" name="weaponId" style="width: 100%; background: #1a2436; color: #fff; border: 1px solid rgba(0, 229, 255, 0.2); padding: 5px; border-radius: 4px;">
            ${weaponOptionsHtml || '<option value="">No Melee Weapons equipped/in Arsenal</option>'}
          </select>
        </div>

        <div id="polarity-group" class="form-group" style="margin-bottom: 12px;">
          <label style="font-weight: bold; color: #00e5ff; display: block; margin-bottom: 5px;">Select Polarity to Apply:</label>
          <select id="forma-polarity-select" name="polarity" style="width: 100%; background: #1a2436; color: #fff; border: 1px solid rgba(0, 229, 255, 0.2); padding: 5px; border-radius: 4px;">
            <option value="Madurai">Madurai (V)</option>
            <option value="Vazarin">Vazarin (D)</option>
            <option value="Naramon">Naramon (-)</option>
            <option value="Zenurik">Zenurik (=)</option>
            <option value="Unairu">Unairu</option>
          </select>
        </div>
      </form>
    `;

    new Dialog({
      title: "Apply Forma & Polarize",
      content: content,
      buttons: {
        apply: {
          icon: '<i class="fas fa-hammer"></i>',
          label: "Apply Polarity",
          callback: async html => {
            const formaId = html.find("#forma-item-select").val();
            const consumableItem = this.actor.items.get(formaId);
            if (!consumableItem) return;

            const formaType = consumableItem.system.type;
            const slot = html.find("#forma-slot-select").val();
            const weaponId = html.find("#forma-weapon-select").val();
            let polarity = html.find("#forma-polarity-select").val();

            // Set polarity based on Forma type
            if (formaType === "Omni Forma") {
              polarity = "universal";
            } else if (formaType === "Umbra Forma") {
              polarity = "Umbra";
            } else if (formaType === "Stance Forma") {
              polarity = "universal";
            }

            let targetName = "";
            let targetIcon = "";

            if (formaType === "Stance Forma") {
              if (!weaponId) {
                ui.notifications.warn("No Melee weapon selected!");
                return;
              }
              const weaponItem = this.actor.items.get(weaponId);
              if (!weaponItem) return;
              
              await weaponItem.update({ "system.stancePolarity": "universal" });
              targetName = `${weaponItem.name} Stance Slot`;
              targetIcon = "systems/warframe-ttrpg/asset/supercharger/StanceForma.png";
            } else {
              // Standard Warframe slot
              const updateData = {};
              updateData[`system.modSlots.${slot}.polarity`] = polarity;
              await this.actor.update(updateData);
              
              let slotLabel = slot.capitalize();
              if (slot.startsWith("slot")) slotLabel = `Slot ${slot.replace("slot", "")}`;
              targetName = `${slotLabel}`;
              
              if (formaType === "Omni Forma") targetIcon = "systems/warframe-ttrpg/asset/supercharger/AuraForma.png";
              else if (formaType === "Umbra Forma") targetIcon = "systems/warframe-ttrpg/asset/supercharger/UmbraForma.png";
              else targetIcon = "systems/warframe-ttrpg/asset/supercharger/Forma.png";
            }

            // Deduct consumable
            const currentQty = Number(consumableItem.system.quantity) || 1;
            if (currentQty <= 1) {
              await consumableItem.delete();
            } else {
              await consumableItem.update({ "system.quantity": currentQty - 1 });
            }

            // Chat notification
            const polarityLabels = {
              Madurai: "Madurai (V)",
              Vazarin: "Vazarin (D)",
              Naramon: "Naramon (-)",
              Zenurik: "Zenurik (=)",
              Unairu: "Unairu",
              Umbra: "Umbra",
              universal: "Universal (Any)"
            };

            const chatHtml = `
              <div class="warframe-chat-card rest-card" style="border-left: 3px solid #ffaa00;">
                <div class="card-header" style="display: flex; align-items: center; gap: 8px;">
                  <img src="${targetIcon}" width="28" height="28" style="border: none; background: transparent;" />
                  <h3 style="font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: bold; margin: 0; color: #ffaa00;">Forma Applied!</h3>
                </div>
                <div class="card-body" style="padding-top: 8px; font-size: 11px;">
                  <p><strong>${this.actor.name}</strong> used a <strong>${formaType}</strong>.</p>
                  <p style="margin-top: 5px; color: #00e5ff;">Modified <strong>${targetName}</strong> polarity to <strong>${polarityLabels[polarity] || polarity}</strong>.</p>
                </div>
              </div>
            `;
            
            await ChatMessage.create({
              speaker: ChatMessage.getSpeaker({ actor: this.actor }),
              content: chatHtml
            });

            ui.notifications.info(`Successfully polarized ${targetName} using ${formaType}.`);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "apply",
      render: dialogHtml => {
        const updateUI = () => {
          const selectedOption = dialogHtml.find("#forma-item-select option:selected");
          const type = selectedOption.data("type");

          if (type === "Stance Forma") {
            dialogHtml.find("#target-slot-group").hide();
            dialogHtml.find("#target-weapon-group").show();
            dialogHtml.find("#polarity-group").hide();
          } else {
            dialogHtml.find("#target-slot-group").show();
            dialogHtml.find("#target-weapon-group").hide();
            
            if (type === "Forma") {
              dialogHtml.find("#polarity-group").show();
            } else {
              dialogHtml.find("#polarity-group").hide();
            }
          }
        };

        dialogHtml.find("#forma-item-select").change(updateUI);
        updateUI();
      }
    }).render(true);
  }
}
