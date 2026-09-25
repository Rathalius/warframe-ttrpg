/**
 * Warframe TTRPG - Mag Specialized Ability Mechanics
 * Canonical implementations:
 * - Pull: Magnetic drag pulling all foes to Mag's feet (prone ragdoll)
 * - Magnetize: Magnetic field redirecting bullets into center, exploding on end
 * - Polarize: Depletes enemy shields/armor into shrapnel, restores squad overshields
 * - Crush: Magnetizes enemy skeletons, lifting and crushing them (overshield gain)
 */

export async function handleMagAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. PULL (Magnetic Ragdoll)
  // ==========================================
  if (baseName === "pull") {
    const pulledNames = [];
    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Pull Ragdoll (Prone)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mag/Pull.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Pull: Magnetically ripped across the battlefield, knocked sprawling prone at Mag's feet.",
          flags: { core: { statusId: "prone" } }
        }]);
        pulledNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-magnet animate-pulse"></i> Magnetic Pull</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">${pulledNames.length > 0 ? `➔ <strong>Dragged & Knocked Down:</strong> ${pulledNames.join(", ")} pulled violently to Mag's feet and knocked prone!<br/>` : ""}
        ➔ Enemies killed by Pull drop guaranteed Energy Orbs!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d10 Magnetic damage roll
  }

  // ==========================================
  // 2. MAGNETIZE (Bullet Attractor Bubble)
  // ==========================================
  if (baseName === "magnetize") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const targetToken = targets[0];
    const victimName = targetToken ? targetToken.name : "Hostile";

    if (targetToken && targetToken.actor) {
      await targetToken.actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Magnetize Bubble (Bullet Singularity)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mag/Magnetize.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["entangled"],
        description: "Magnetize Bubble: Enclosed in a magnetic containment sphere. All projectiles entering the sphere curve into the center dealing continuous damage, then detonates upon expiring.",
        flags: { core: { statusId: "magnetize_bubble" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-circle-notch animate-pulse"></i> Magnetize Singularity Trapped</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Magnetic sphere encases <strong>${victimName}</strong> for ${durationRounds} rounds!<br/>
        ➔ <strong>Bullet Redirection:</strong> 100% of firearm attacks shot towards the bubble curve into the center for <strong>2x damage</strong>!<br/>
        ➔ <strong>Explosive Collapse:</strong> Detonates for <strong>3d10 Blast damage</strong> upon expiring.</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. POLARIZE (Defense Depletion & Overshields)
  // ==========================================
  if (baseName === "polarize") {
    const stripPct = Math.min(100, Math.round(50 * (powerStrength / 100)));
    const siphonedCount = targets.length;

    for (const token of targets) {
      if (token.actor) {
        const mult = Math.max(0, 1 - (stripPct / 100));
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Polarized (-${stripPct}% Armor/Shields)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mag/Polarize.png",
          origin: actor.uuid,
          duration: { rounds: 3 },
          changes: [
            { key: "system.shields.value", value: mult, mode: 1, priority: 20 },
            { key: "system.armor.value", value: mult, mode: 1, priority: 20 }
          ],
          description: `Polarized: ${stripPct}% Armor and Shields stripped, erupting in shrapnel.`,
          flags: { core: { statusId: "polarized" } }
        }]);
      }
    }

    // Restore shields to Mag and squad
    const shieldRestored = Math.max(100, siphonedCount * 75);
    const curShields = Number(actor.system.shields?.value) || 0;
    const maxShields = Number(actor.system.shields?.max) || 150;
    await actor.update({ "system.shields.value": Math.min(maxShields * 2, curShields + shieldRestored) });

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-wave-square animate-pulse"></i> Polarize Wave Radiated</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">➔ <strong>Enemy Defense Depletion:</strong> Stripped <strong>${stripPct}% Armor & Shields</strong> from enemies, creating razor magnetic shrapnel!<br/>
        ➔ <strong>Overshields Recharged:</strong> Restored <strong>+${shieldRestored} Shields</strong> to Mag and squad!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 2d8 damage roll
  }

  // ==========================================
  // 4. CRUSH (Bone Crush & Overshields)
  // ==========================================
  if (baseName === "crush") {
    const liftedNames = [];
    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Crushed (Armor Fractured)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mag/Crush.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["prone"],
          changes: [{ key: "system.armor.value", value: 0.5, mode: 1, priority: 20 }],
          description: "Crush: Skeletal structure magnetized and collapsed. 50% Armor fractured.",
          flags: { core: { statusId: "crush_fracture" } }
        }]);
        liftedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-compress-alt animate-pulse"></i> Crush Skeletal Implosion</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Mag magnetizes the bones of all surrounding hostiles, hoisting them into the air and crushing them into the floor!<br/>
        ${liftedNames.length > 0 ? `➔ <strong>Victims Crushed:</strong> ${liftedNames.join(", ")} (-50% Armor, knocked down prone).<br/>` : ""}
        ➔ <strong>Overshield Harvest:</strong> Grants Mag +50 Overshields per target hit!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d10 Magnetic damage roll
  }

  return { handled: false };
}
