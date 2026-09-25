/**
 * Warframe TTRPG - Sevagoth Specialized Ability Mechanics
 * Canonical implementations:
 * - Death Well: Unique resource gauge (0-100%) tracking harvested souls
 * - Sow: Plants Death Seeds in foes, draining life and charging the Death Well (+5% per target)
 * - Reap: Shadow rushes forward inflicting Death's Harvest (+50% vuln); detonates Sown foes for True damage & +15% Death Well!
 * - Gloom: Slows foes by up to 75% and grants 10% squad lifesteal; charges Death Well
 * - Exalted Shadow: Unleashes Shadow form at 75%+ Death Well; equips Shadow Claws & replaces power bar with Embrace, Consume, Death's Harvest, and Reunite!
 * - Reunite: Shadow explodes back into human Sevagoth, healing him to full and restoring human powers.
 */

export async function handleSevagothAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const powerDC = context.powerDC || 14;
  const abilityName = ability.name || "";
  const isRank3 = abilityName.includes("III") || abilityName.includes("IV");
  const isRank2 = abilityName.includes("II");

  // Ensure Death Well exists on actor
  const currentWell = Number(actor.system.deathWell?.value) || 0;
  const maxWell = Number(actor.system.deathWell?.max) || 100;

  // Helper to add Death Well charge
  async function addDeathWell(amount, reason = "") {
    const newWell = Math.min(maxWell, Math.max(0, currentWell + amount));
    await actor.update({ "system.deathWell.value": newWell });
    if (amount > 0) {
      ui.notifications.info(`Death Well: ${newWell}% (+${amount}% from ${reason})`);
    }
    return newWell;
  }

  // ==========================================
  // 1. SOW (Death Seed & Soul Harvest)
  // ==========================================
  if (baseName === "sow") {
    const seedGain = Math.max(1, targets.length) * 5;
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const sownTargets = [];

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Death Seed (Sown)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-Sow130xWhite.webp",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["death_seeded"],
        description: `Death Seed: Lifeforce siphoned by Sevagoth. Takes True damage over time. Detonates with explosive radial True damage when struck by Reap!`,
        flags: {
          core: { statusId: "death_seeded" },
          "warframe-ttrpg": { isSown: true }
        }
      }]);
      sownTargets.push(token.name);
    }

    const updatedWell = await addDeathWell(seedGain, "Sowing Death Seeds");

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(183, 21, 64, 0.08); border: 1px solid rgba(183, 21, 64, 0.35); border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ff5e3a; text-transform: uppercase;">
          <span><i class="fas fa-skull-crossbones"></i> Death Seeds Sown</span>
          <span>Death Well: ${updatedWell}% (+${seedGain}%)</span>
        </div>
        <div style="font-size: 10.5px; color: #fde68a; margin-top: 4px; line-height: 1.35;">
          ${sownTargets.length > 0
            ? `<strong>Sown Foes:</strong> ${sownTargets.join(", ")}.<br/><em>Aflicted enemies are primed for detonation! Strike them with Reap to trigger catastrophic radial soul bursts.</em>`
            : `<em>Nearby enemies are infused with dark seeds, charging the Death Well.</em>`
          }
        </div>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 2d8 True damage roll
  }

  // ==========================================
  // 2. REAP (Shadow Rush & Detonation Synergy)
  // ==========================================
  if (baseName === "reap") {
    let detonatedCount = 0;
    const reapedTargets = [];

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      // Check if target is already Sown
      const isSown = targetActor.effects.some(e => !e.disabled && e.name.includes("Death Seed"));

      if (isSown) {
        detonatedCount++;
        // Remove Death Seed
        const seedEffects = targetActor.effects.filter(e => !e.disabled && e.name.includes("Death Seed"));
        await targetActor.deleteEmbeddedDocuments("ActiveEffect", seedEffects.map(e => e.id));
      }

      // Apply Death's Harvest vulnerability
      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Death's Harvest (+50% Damage Vulnerability)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-Reap130xWhite.webp",
        origin: actor.uuid,
        duration: { rounds: 2 },
        statuses: ["vulnerable"],
        changes: [
          { key: "system.vulnerabilityBonus.value", value: 50, mode: 2, priority: 20 }
        ],
        description: "Death's Harvest: Shadow has ravaged target's soul. Suffers +50% damage from all attacks.",
        flags: { core: { statusId: "vulnerable" } }
      }]);

      reapedTargets.push(token.name);
    }

    const reapGain = 5 + (detonatedCount * 15);
    const updatedWell = await addDeathWell(reapGain, detonatedCount > 0 ? `${detonatedCount} Sow Detonations` : "Reap Souls");

    let cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid rgba(142, 68, 173, 0.35); border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #a55eea; text-transform: uppercase;">
          <span><i class="fas fa-ghost animate-pulse"></i> Reap Soul Surge</span>
          <span>Death Well: ${updatedWell}% (+${reapGain}%)</span>
        </div>
        <div style="font-size: 10.5px; color: #e9d5ff; margin-top: 4px; line-height: 1.35;">
          ${detonatedCount > 0 ? `<strong style="color: #ff5e3a;">💥 SOW DETONATION x${detonatedCount}!</strong> Sown foes exploded in radial True damage.<br/>` : ""}
          ${reapedTargets.length > 0 ? `<strong>Reaped Victims:</strong> ${reapedTargets.join(", ")} (Afflicted by Death's Harvest: +50% damage vulnerability).` : "Shadow rushes outward, scouring enemy souls."}
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. GLOOM (Lifesteal & Slow Aura)
  // ==========================================
  if (baseName === "gloom") {
    const slowPct = isRank3 ? 75 : (isRank2 ? 60 : 50);
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));

    // Apply Gloom Aura to Sevagoth
    const existing = actor.effects.filter(e => !e.disabled && e.name.includes("Gloom Aura"));
    if (existing.length > 0) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Gloom Aura (10% Lifesteal)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-Gloom130xWhite.webp",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.healingBonus.value", value: 10, mode: 2, priority: 20 }
      ],
      description: `Gloom Aura: 30ft shadow radius active. Enemies inside slowed by ${slowPct}%. Sevagoth and allies steal 10% HP from all attacks. Charges Death Well on hit.`,
      flags: { core: { statusId: "gloom_aura" } }
    }]);

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Gloom Slow (-${slowPct}% Spd)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-Gloom130xWhite.webp",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["slowed"],
        changes: [
          { key: "system.speed.land.value", value: 1 - (slowPct / 100), mode: 1, priority: 20 }
        ],
        description: `Gloom Field: Ensnared in Sevagoth's darkness. Movement and attack animations slowed by ${slowPct}%.`,
        flags: { core: { statusId: "slowed" } }
      }]);
    }

    const updatedWell = await addDeathWell(10, "Gloom Activation");

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 73, 94, 0.15); border: 1px solid rgba(52, 73, 94, 0.4); border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #4b6584; text-transform: uppercase;">
          <span><i class="fas fa-circle-notch animate-spin"></i> Gloom Darkness Deployed</span>
          <span>Death Well: ${updatedWell}%</span>
        </div>
        <div style="font-size: 10.5px; color: #d1d8e0; margin-top: 4px; line-height: 1.35;">
          30ft spherical shadow wave extends outward.<br/>
          ➔ <strong>Enemy Slow:</strong> Ensnared foes slowed by <strong>${slowPct}%</strong>.<br/>
          ➔ <strong>Squad Lifesteal:</strong> Allies heal <strong>10%</strong> of damage dealt on all attacks.
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. EXALTED SHADOW (Transformation into Shadow)
  // ==========================================
  if (baseName === "exalted shadow") {
    const isShadowActive = actor.effects.some(e => !e.disabled && e.name.includes("Exalted Shadow Active"));

    if (isShadowActive) {
      // Revert from Shadow Form (same as Reunite)
      return await handleReunite(actor, ability);
    }

    if (currentWell < 75) {
      const confirmRelease = await Dialog.confirm({
        title: "Death Well Sub-Optimal",
        content: `<p style="font-size: 12px;">The Death Well is only at <strong>${currentWell}%</strong> (75% recommended for full manifestation). Do you want to force early release anyway?</p>`,
        defaultYes: false
      });
      if (!confirmRelease) return { handled: true };
    }

    // Deduct Death Well
    const newWell = Math.max(0, currentWell - 75);
    await actor.update({ "system.deathWell.value": newWell });

    // Store human power IDs in flags to restore upon Reunite
    const humanPowers = actor.items.filter(i => i.type === "ability" && ["Reap", "Sow", "Gloom", "Exalted Shadow"].some(p => i.name.startsWith(p)));
    await actor.setFlag("warframe-ttrpg", "sevagothHumanPowers", humanPowers.map(p => p.toObject()));
    await actor.setFlag("warframe-ttrpg", "isSevagothShadow", true);

    // Apply Exalted Shadow Active Effect
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Exalted Shadow Active",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-ExaltedShadow130xWhite.webp",
      origin: actor.uuid,
      duration: { rounds: 99 },
      statuses: ["shadow_form"],
      changes: [
        { key: "system.armor.value", value: 1.5, mode: 1, priority: 20 },
        { key: "system.speed.land.value", value: 10, mode: 2, priority: 20 }
      ],
      description: "Exalted Shadow Form: Sevagoth has detached into his spectral Shadow. Wields devastating Shadow Claws and Shadow powers. +50% Armor and +10 ft Speed.",
      flags: { core: { statusId: "shadow_form" } }
    }]);

    // Create & Equip Shadow Claws
    const oldClaws = actor.items.filter(i => i.type === "weapon" && i.name.includes("Shadow Claws"));
    if (oldClaws.length > 0) {
      await actor.deleteEmbeddedDocuments("Item", oldClaws.map(i => i.id));
    }

    const clawDamage = isRank3 ? "6d8" : (isRank2 ? "5d8" : "4d8");
    await actor.createEmbeddedDocuments("Item", [{
      name: "Shadow Claws (Exalted Melee)",
      type: "weapon",
      img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth (ombre)/57px-Embrace130xWhite.webp",
      system: {
        type: "melee",
        damage: clawDamage,
        damageType: "Slash",
        range: "Melee",
        critRange: "18-20",
        equipped: true
      },
      flags: {
        "warframe-ttrpg": { isShadowClaw: true }
      }
    }]);

    // Swap Powers to Shadow Suite: Embrace, Consume, Death's Harvest, Reunite
    // Delete human powers from sheet
    if (humanPowers.length > 0) {
      await actor.deleteEmbeddedDocuments("Item", humanPowers.map(p => p.id));
    }

    // Add Shadow Powers
    const shadowAbilities = [
      {
        name: "Embrace",
        type: "ability",
        img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth (ombre)/57px-Embrace130xWhite.webp",
        system: { abilitySlot: "Power 1", cost: 25, actionType: "cc", damage: "", damageType: "", description: "Ghostly tendrils pull enemies into a cluster, suspending them in agony." }
      },
      {
        name: "Consume",
        type: "ability",
        img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth (ombre)/57px-Consume130xWhite.webp",
        system: { abilitySlot: "Power 2", cost: 50, actionType: "damage", damage: "3d8", damageType: "Radiation", description: "Dash through enemies, dealing radiation damage and converting 100% of damage dealt into health." }
      },
      {
        name: "Death's Harvest",
        type: "ability",
        img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth (ombre)/57px-DeathsHarvest130xWhite.webp",
        system: { abilitySlot: "Power 3", cost: 75, actionType: "debuff", damage: "", damageType: "", description: "Inflicts severe damage vulnerability (+50%) on all nearby foes." }
      },
      {
        name: "Reunite",
        type: "ability",
        img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth (ombre)/57px-Reunite130xWhite.webp",
        system: { abilitySlot: "Power 4", cost: 0, actionType: "utility", damage: "", damageType: "", description: "Explodes back into Sevagoth's physical form, transferring absorbed life force and restoring full human powers." }
      }
    ];

    await actor.createEmbeddedDocuments("Item", shadowAbilities);
    ui.notifications.info("Transformed into Sevagoth's Shadow! Shadow Claws equipped.");

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(44, 62, 80, 0.2); border: 1px solid #9b59b6; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #9b59b6; text-transform: uppercase;">
          <span><i class="fas fa-skull animate-pulse"></i> Exalted Shadow Unleashed</span>
          <span>Death Well: ${newWell}%</span>
        </div>
        <div style="font-size: 10.5px; color: #d7bde2; margin-top: 4px; line-height: 1.35;">
          Sevagoth's physical body remains stationary while his ethereal Shadow manifests!<br/>
          ➔ <strong>Exalted Weapon Equipped:</strong> Shadow Claws (${clawDamage} Slash, Crit 18-20).<br/>
          ➔ <strong>Shadow Suite Active:</strong> Embrace, Consume, Death's Harvest, and Reunite.<br/>
          ➔ <strong>Resilience:</strong> +50% Armor, +10 ft Speed.
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 5. REUNITE (Return to Sevagoth)
  // ==========================================
  if (baseName === "reunite") {
    return await handleReunite(actor, ability);
  }

  return { handled: false };
}

// Helper to revert from Shadow form to human Sevagoth
async function handleReunite(actor, ability) {
  // 1. Remove Shadow Form ActiveEffect
  const shadowEffects = actor.effects.filter(e => !e.disabled && (e.name.includes("Exalted Shadow") || e.name.includes("Shadow Form")));
  if (shadowEffects.length > 0) {
    await actor.deleteEmbeddedDocuments("ActiveEffect", shadowEffects.map(e => e.id));
  }

  // 2. Remove Shadow Claws
  const claws = actor.items.filter(i => i.type === "weapon" && (i.name.includes("Shadow Claws") || i.flags?.["warframe-ttrpg"]?.isShadowClaw));
  if (claws.length > 0) {
    await actor.deleteEmbeddedDocuments("Item", claws.map(i => i.id));
  }

  // 3. Remove Shadow Powers
  const shadowPowerNames = ["Embrace", "Consume", "Death's Harvest", "Reunite"];
  const currentShadowPowers = actor.items.filter(i => i.type === "ability" && shadowPowerNames.some(sp => i.name.startsWith(sp)));
  if (currentShadowPowers.length > 0) {
    await actor.deleteEmbeddedDocuments("Item", currentShadowPowers.map(p => p.id));
  }

  // 4. Restore Stored Human Powers
  const storedHumanPowers = actor.getFlag("warframe-ttrpg", "sevagothHumanPowers");
  if (storedHumanPowers && Array.isArray(storedHumanPowers) && storedHumanPowers.length > 0) {
    await actor.createEmbeddedDocuments("Item", storedHumanPowers);
    await actor.unsetFlag("warframe-ttrpg", "sevagothHumanPowers");
  } else {
    // Fallback: restore default Sevagoth powers
    const defaultPowers = [
      { name: "Reap", type: "ability", img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-Reap130xWhite.webp", system: { abilitySlot: "Power 1", cost: 25, actionType: "debuff", damage: "", damageType: "Radiation", description: "Sevagoth's Shadow flies outward ravaging enemies in his path. The souls of the dead fill the Death Well." } },
      { name: "Sow", type: "ability", img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-Sow130xWhite.webp", system: { abilitySlot: "Power 2", cost: 50, actionType: "damage", damage: "2d8", damageType: "True", description: "Plant a death seed in nearby targets to drain their lifeforce. The souls of the dead fill the Death Well." } },
      { name: "Gloom", type: "ability", img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-Gloom130xWhite.webp", system: { abilitySlot: "Power 3", cost: 75, actionType: "cc", damage: "", damageType: "Healing", description: "Summon a radial pulse wave that ensnares and slows enemies, siphoning lifeforce for the Death Well." } },
      { name: "Exalted Shadow", type: "ability", img: "systems/warframe-ttrpg/asset/classe/Power icon/sevagoth/57px-ExaltedShadow130xWhite.webp", system: { abilitySlot: "Power 4", cost: 100, actionType: "buff", damage: "", damageType: "", description: "When the Death Well fills, Sevagoth's Shadow form is ready to be released." } }
    ];
    await actor.createEmbeddedDocuments("Item", defaultPowers);
  }

  await actor.unsetFlag("warframe-ttrpg", "isSevagothShadow");

  // 5. Restore full HP
  const maxHP = Number(actor.system.health?.max) || 100;
  await actor.update({ "system.health.value": maxHP });

  ui.notifications.info("Reunited! Sevagoth returns to physical form, fully restored.");

  const cardExtraHTML = `
    <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px; font-family: 'Inter', sans-serif;">
      <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #2ecc71; text-transform: uppercase;">
        <span><i class="fas fa-compress-arrows-alt"></i> Reunited with Sevagoth</span>
        <span>Physical Form Restored</span>
      </div>
      <div style="font-size: 10.5px; color: #a8e6cf; margin-top: 4px; line-height: 1.35;">
        Shadow implodes back into Sevagoth's physical form.<br/>
        ➔ <strong>Health Restored:</strong> Fully restored to max HP (${maxHP} HP).<br/>
        ➔ <strong>Powers:</strong> Reap, Sow, Gloom, and Exalted Shadow returned to combat bar.
      </div>
    </div>
  `;

  return { handled: true, cardExtraHTML };
}
