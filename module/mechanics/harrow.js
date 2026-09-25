/**
 * Warframe TTRPG - Harrow Specialized Ability Mechanics
 * Canonical implementations:
 * - Condemn: Waves of void chains lock enemies in stasis, restores +150 Shields per enemy
 * - Penance: Sacrifices shields for +50% Fire Rate, +100% Reload, and 10% Squad Lifesteal
 * - Thurible: Channels censer; kills grant massive squad Energy (quadruple on headshots)
 * - Covenant: Complete squad invulnerability, converting absorbed damage into +50% Crit / +200% Headshot Crit
 */

export async function handleHarrowAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. CONDEMN (Void Chains & Shield Restore)
  // ==========================================
  if (baseName === "condemn") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const chainedCount = targets.length;
    const chainedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Condemned (Bound in Chains)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/harrow/Condemn.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Condemned: Held helpless in void chains. Cannot move or take actions.",
          flags: { core: { statusId: "condemned" } }
        }]);
        chainedNames.push(token.name);
      }
    }

    const shieldGain = Math.max(150, chainedCount * 150);
    const curShields = Number(actor.system.shields?.value) || 0;
    const maxShields = Number(actor.system.shields?.max) || 150;
    const updatedShields = Math.min(maxShields * 2, curShields + shieldGain);
    await actor.update({ "system.shields.value": updatedShields });

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-link animate-pulse"></i> Condemn Void Chains</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">➔ <strong>Bound in Chains:</strong> ${chainedNames.length > 0 ? chainedNames.join(", ") : "Enemies in line"} frozen in stasis for ${durationRounds} rounds.<br/>
        ➔ <strong>Shields Siphoned:</strong> Restored <strong>+${shieldGain} Shields</strong> (Current: ${updatedShields} Shields / Overshields)!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. PENANCE (Shield Sacrifice, Fire Rate & Lifesteal)
  // ==========================================
  if (baseName === "penance") {
    const curShields = Number(actor.system.shields?.value) || 0;
    if (curShields <= 0) {
      ui.notifications.warn("Penance requires active Shields to sacrifice!");
      return {
        handled: true,
        cardExtraHTML: `<div style="color: #ff2a5f; padding: 6px; font-family: 'Orbitron';"><i class="fas fa-times-circle"></i> FAILED: Penance requires shields to sacrifice.</div>`
      };
    }

    // Sacrifice all shields
    await actor.update({ "system.shields.value": 0 });
    const durationRounds = Math.max(2, Math.round((curShields / 100) * 2 * (powerDuration / 100)));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Penance Flagellation (+50% FireRate, 10% Lifesteal)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/harrow/Penance.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [{ key: "system.meleeSpeed.value", value: 50, mode: 2, priority: 20 }],
      description: `Penance: Sacrificed ${curShields} shields. +50% Fire Rate, +100% Reload Speed, and 10% squad lifesteal on all weapon damage!`,
      flags: { core: { statusId: "penance_buff" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-heartbeat animate-pulse"></i> Penance Sacred Flagellation</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Harrow sacrificed <strong>${curShields} Shields</strong> for ${durationRounds} rounds of holy zeal!<br/>
        ➔ <strong>Combat Haste:</strong> +50% Fire Rate & +100% Reload Speed.<br/>
        ➔ <strong>Squad Lifesteal:</strong> 10% of all weapon damage dealt by Harrow heals himself and squad members!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. THURIBLE (Channeled Energy Generation)
  // ==========================================
  if (baseName === "thurible") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const energyPerKill = Math.round(25 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Thurible (+${energyPerKill} Energy/Kill)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/harrow/Thurible.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `Thurible: Swings sacred censer. Every kill grants +${energyPerKill} Energy to squad (+${energyPerKill * 4} on Headshots)!`,
      flags: { core: { statusId: "thurible_aura" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-fire animate-pulse"></i> Thurible Censer Swung</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Sacred incense blankets the squad for ${durationRounds} rounds!<br/>
        ➔ <strong>Energy Harvest:</strong> Every weapon kill grants <strong>+${energyPerKill} Energy</strong> to all Tenno within 20m.<br/>
        ➔ <strong>Precision Headshots:</strong> Headshot kills grant <strong>+${energyPerKill * 4} Energy</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. COVENANT (Squad Invulnerability & Critical Surge)
  // ==========================================
  if (baseName === "covenant") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Covenant: Invulnerability (Phase 1)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/harrow/Covenant.png",
      origin: actor.uuid,
      duration: { rounds: 1 },
      description: "Covenant Invulnerability: Completely immune to all damage. Absorbed damage converts into +50% Crit / +200% Headshot Crit in Phase 2!",
      flags: { core: { statusId: "covenant_invuln" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #e056fd; font-family: 'Orbitron';"><i class="fas fa-cross animate-pulse"></i> Covenant: Sacred Ward Cast</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">➔ <strong>Phase 1 (1 Round):</strong> Entire squad gains <strong>TOTAL INVULNERABILITY</strong>, absorbing all attacks.<br/>
        ➔ <strong>Phase 2 (${durationRounds} Rounds):</strong> Absorbed damage converts into <strong>+50% Critical Chance</strong> (+200% on Headshots) for the entire squad!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
