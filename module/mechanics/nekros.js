/**
 * Warframe TTRPG - Nekros Specialized Ability Mechanics
 * Canonical implementations:
 * - Soul Punch: Strikes soul out of enemy body as high-velocity projectile
 * - Terrify: Causes enemies to flee in panic, stripping up to 100% Armor
 * - Desecrate: Channeled aura looting corpses for extra Health Orbs and ammo
 * - Shadows of the Dead: Reanimates 7 shadow clones of fallen enemies to fight as minions
 */

export async function handleNekrosAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. SOUL PUNCH
  // ==========================================
  if (baseName === "soul punch") {
    const targetToken = targets[0];
    const victimName = targetToken ? targetToken.name : "Target";

    if (targetToken && targetToken.actor) {
      await targetToken.actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Soul Punched (Spiritual Rupture)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nekros/SoulPunch.png",
        origin: actor.uuid,
        duration: { rounds: 1 },
        statuses: ["prone"],
        description: "Soul Punched: Soul ripped outward, knocking target and foes behind prone.",
        flags: { core: { statusId: "prone" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-hand-rock animate-pulse"></i> Soul Punch Ripped</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;">Struck <strong>${victimName}</strong>'s soul directly! Soul turns into a projectile knocking enemies behind prone. If target dies, automatically marked for <strong>Shadows of the Dead</strong>!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d10 Impact damage roll
  }

  // ==========================================
  // 2. TERRIFY (Armor Strip & Fleeing Panic)
  // ==========================================
  if (baseName === "terrify") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const stripPct = Math.min(100, Math.round(60 * (powerStrength / 100)));
    const mult = Math.max(0, 1 - (stripPct / 100));
    const panickedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Terrified (-${stripPct}% Armor)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nekros/Terrify.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["frightened"],
          changes: [{ key: "system.armor.value", value: mult, mode: 1, priority: 20 }],
          description: `Terrified: Fleeing in absolute horror! -${stripPct}% Armor stripped.`,
          flags: { core: { statusId: "frightened" } }
        }]);
        panickedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid #8e44ad; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-ghost animate-pulse"></i> Terrifying Shriek</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">${panickedNames.length > 0 ? `➔ <strong>Fleeing in Terror:</strong> ${panickedNames.join(", ")} for ${durationRounds} rounds!<br/>➔ <strong>Armor Melted:</strong> <strong>-${stripPct}% Armor</strong> stripped!` : "Enemies in 15m radius terrified and running for their lives."}</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. DESECRATE (Corpse Loot Aura)
  // ==========================================
  if (baseName === "desecrate") {
    const existingDesecrate = actor.effects.find(e => !e.disabled && e.name.includes("Desecrate"));

    if (existingDesecrate) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [existingDesecrate.id]);
      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Desecrate Channeled Aura Deactivated</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Desecrate (Corpse Harvest Aura)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nekros/Desecrate.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      description: "Desecrate: Channeled aura. Corpses of fallen enemies within 25m are desecrated with a 54% chance to yield bonus Health Orbs, Energy, ammo, and rare drops.",
      flags: { core: { statusId: "desecrate_aura" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-skull animate-pulse"></i> Desecrate Channeled Aura Active</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;">Nekros consumes 10 Health per corpse to reroll enemy remains in 25m! Drops bonus <strong>Health Orbs, Energy, Ammo, and Mod Loot</strong>.</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. SHADOWS OF THE DEAD (Reanimate 7 Minions)
  // ==========================================
  if (baseName === "shadows of the dead") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const shadowCount = 7;

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Shadows of the Dead (${shadowCount} Minions)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nekros/ShadowsOfTheDead.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `Shadows of the Dead: ${shadowCount} reanimated shadow clones fight alongside Nekros, taunting foes and transferring damage away from squad.`,
      flags: { core: { statusId: "shadows_of_the_dead" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #e056fd; font-family: 'Orbitron';"><i class="fas fa-users-slash animate-pulse"></i> Shadows of the Dead Reanimated</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Nekros rips open the veil of the underworld, reanimating <strong>7 Shadow Minions</strong> of the strongest slain foes for ${durationRounds} rounds!<br/>
        ➔ <strong>Combat Support:</strong> Shadows fight autonomously with their original weaponry.<br/>
        ➔ <strong>Shield of Shadows:</strong> Draws enemy aggro and absorbs incoming damage!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
