/**
 * Warframe TTRPG - Banshee Specialized Ability Mechanics
 * Canonical implementations:
 * - Sonic Boom: Frontal 180-degree cone, knockback/ragdoll, armor strip
 * - Sonar: Scans area, highlights weak spots, applies +100% damage vulnerability ActiveEffect to targets
 * - Silence: 20m aura, deafens & stuns enemies on entry, suppresses ability casting, +50% finisher damage
 * - Sound Quake: Channels acoustic ground shockwaves with knockdown and stagger
 */

export async function handleBansheeAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const powerDC = context.powerDC || 14;
  const abilityName = ability.name || "";
  const isRank3 = abilityName.includes("III") || abilityName.includes("IV");
  const isRank2 = abilityName.includes("II");

  // ==========================================
  // 1. SONAR (Weak Spot Marking)
  // ==========================================
  if (baseName === "sonar") {
    const vulnMultiplier = isRank3 ? 2.0 : (isRank2 ? 1.75 : 1.5);
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const markedTargets = [];

    if (targets.length === 0) {
      ui.notifications.warn("Sonar cast without targeted enemies. Target tokens on canvas to apply Sonar Weak Spots!");
    }

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      // Remove existing Sonar mark if present to refresh
      const existing = targetActor.effects.filter(e => !e.disabled && e.name.includes("Sonar Weak Spot"));
      if (existing.length > 0) {
        await targetActor.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
      }

      const effectData = {
        name: `Sonar Weak Spot (+${Math.round((vulnMultiplier - 1) * 100)}% Vuln)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/banshee/Sonar.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["sonar_marked"],
        changes: [
          { key: "system.vulnerabilityBonus.value", value: Math.round((vulnMultiplier - 1) * 100), mode: 2, priority: 20 }
        ],
        description: `Sonar Radar: Critical weak spot exposed. Takes +${Math.round((vulnMultiplier - 1) * 100)}% damage from all attacks and expands attacker Critical Threat Range by +2.`,
        flags: {
          core: { statusId: "sonar_marked" },
          "warframe-ttrpg": { vulnMultiplier: vulnMultiplier }
        }
      };

      await targetActor.createEmbeddedDocuments("ActiveEffect", [effectData]);
      markedTargets.push(token.name);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #f59e0b; text-transform: uppercase;">
          <span><i class="fas fa-bullseye animate-pulse"></i> Sonar Acoustic Radar</span>
          <span>+${Math.round((vulnMultiplier - 1) * 100)}% Weak Spot</span>
        </div>
        <div style="font-size: 10.5px; color: #fde68a; margin-top: 4px; line-height: 1.35;">
          ${markedTargets.length > 0 
            ? `<strong>Marked Targets:</strong> ${markedTargets.join(", ")}.<br/><em>All attacks hitting these targets receive +${Math.round((vulnMultiplier - 1) * 100)}% damage bonus for ${durationRounds} rounds!</em>`
            : `<em>Acoustic scan pulse activated. Targets entering line of sight will have weak spots exposed.</em>`
          }
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. SILENCE (Stun & Ability Suppression Aura)
  // ==========================================
  if (baseName === "silence") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));

    // Apply Silence Aura to Banshee
    const existingAura = actor.effects.filter(e => !e.disabled && e.name.includes("Silence Aura"));
    if (existingAura.length > 0) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", existingAura.map(e => e.id));
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Silence Aura",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/banshee/Silence.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      statuses: ["silence_aura"],
      changes: [
        { key: "system.stealthBonus", value: 5, mode: 2, priority: 20 }
      ],
      description: `Silence Aura: 20m sound suppression field active. Stuns entering enemies for 1 round, suppresses enemy special abilities and Eximus auras. +50% Finisher / Melee Critical damage.`,
      flags: {
        core: { statusId: "silence_aura" }
      }
    }]);

    // Apply Stun / Deafened to targeted enemies
    const stunnedList = [];
    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Deafened & Disoriented",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/banshee/Silence.png",
        origin: actor.uuid,
        duration: { rounds: 1 },
        statuses: ["deafened"],
        description: `Silence Disorientation: Stunned for 1 round upon entering Silence aura. Enemy ability casting suppressed. Disadvantage on perception and attacks.`,
        flags: {
          core: { statusId: "deafened" }
        }
      }]);
      stunnedList.push(token.name);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #c084fc; text-transform: uppercase;">
          <span><i class="fas fa-volume-mute"></i> Silence Field Deployed</span>
          <span>${durationRounds} Rounds</span>
        </div>
        <div style="font-size: 10.5px; color: #f3e8ff; margin-top: 4px; line-height: 1.35;">
          Acoustic dampening field wraps 20m around Banshee.
          ${stunnedList.length > 0 ? `<br/><strong>Disoriented Foes:</strong> ${stunnedList.join(", ")} (Stunned 1 round, special actions suppressed).` : ""}
          <br/><em>Allies gain sound suppression and +50% Finisher/Crit damage against affected foes.</em>
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. SONIC BOOM (Armor Strip & Ragdoll)
  // ==========================================
  if (baseName === "sonic boom") {
    const stripPct = isRank3 ? 70 : (isRank2 ? 50 : 30);
    const affected = [];

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Sonic Fracture (-${stripPct}% Armor)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/banshee/SonicBoom.png",
        origin: actor.uuid,
        duration: { rounds: 2 },
        statuses: ["prone"],
        changes: [
          { key: "system.armor.value", value: 1 - (stripPct / 100), mode: 1, priority: 20 }
        ],
        description: `Sonic Fracture: Smashed by ultrasonic wave. Knocked Prone / Ragdolled and Armor stripped by ${stripPct}%.`,
        flags: {
          core: { statusId: "prone" }
        }
      }]);
      affected.push(token.name);
    }

    let cardExtraHTML = "";
    if (affected.length > 0) {
      cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 4px; font-size: 10.5px; color: #bae6fd;">
          <i class="fas fa-wind"></i> <strong>Sonic Fracture:</strong> ${affected.join(", ")} knocked prone and lost <strong>${stripPct}% Armor</strong>!
        </div>
      `;
    }

    return { handled: false, cardExtraHTML };
  }

  // ==========================================
  // 4. SOUND QUAKE (Seismic Knockdown)
  // ==========================================
  if (baseName === "sound quake") {
    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Sound Quake Stagger",
        icon: ability.img,
        origin: actor.uuid,
        duration: { rounds: 1 },
        statuses: ["prone"],
        description: `Seismic Resonance: Shaken by ultrasonic tremor. Knocked Prone and movement speed reduced to 0 for 1 round.`,
        flags: { core: { statusId: "prone" } }
      }]);
    }

    return { handled: false };
  }

  return { handled: false };
}
