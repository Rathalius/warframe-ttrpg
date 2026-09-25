/**
 * Warframe TTRPG - Kullervo Specialized Ability Mechanics
 * Canonical implementations:
 * - Wrathful Advance: Teleport heavy melee attack with guaranteed Red Crits (+200% Crit)
 * - Recompense: Orbiting daggers stab foes to heal; missed daggers stab Kullervo to grant Overguard!
 * - Collective Curse: Chains enemies in damage web (damage to one is dealt to all!)
 * - Storm of Ukko: Rains storm of void daggers across target zone
 */

export async function handleKullervoAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. WRATHFUL ADVANCE (Teleport & Red Crits)
  // ==========================================
  if (baseName === "wrathful advance") {
    const bonusCrit = Math.round(200 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Wrathful Advance (+${bonusCrit}% Melee Crit)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/kullervo/WrathfulAdvance.png",
      origin: actor.uuid,
      duration: { rounds: 1 },
      description: `Wrathful Advance: Teleported into striking distance. Next melee attack has +${bonusCrit}% Critical Chance (Guaranteed Red Criticals)!`,
      flags: { core: { statusId: "wrathful_advance" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-bolt animate-pulse"></i> Wrathful Advance: Teleport Strike</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Kullervo teleports instantly to target and delivers a ferocious heavy melee blow!<br/>
        ➔ <strong>Guaranteed Red Crits:</strong> Grants <strong>+${bonusCrit}% Critical Chance</strong> on the next melee attack!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 3d10 damage roll
  }

  // ==========================================
  // 2. RECOMPENSE (Healing Daggers or Self-Stab Overguard)
  // ==========================================
  if (baseName === "recompense") {
    const hitCount = targets.length;

    if (hitCount > 0) {
      // Heal Kullervo per enemy hit
      const healAmount = hitCount * Math.round(50 * (powerStrength / 100));
      const curHP = Number(actor.system.health?.value) || 0;
      const maxHP = Number(actor.system.health?.max) || 100;
      await actor.update({ "system.health.value": Math.min(maxHP, curHP + healAmount) });

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
          <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-khanda animate-pulse"></i> Recompense: Foes Pierced</strong><br/>
          <span style="font-size: 11px; color: #a8e6cf;">Daggers pierce ${hitCount} enemies, dealing damage and restoring <strong>+${healAmount} Health</strong> to Kullervo!</span>
        </div>
      `;
      return { handled: false, cardExtraHTML };
    } else {
      // Daggers miss: Self-stab for Overguard
      const overguardGain = Math.round(300 * (powerStrength / 100));
      const curShields = Number(actor.system.shields?.value) || 0;
      const maxShields = Number(actor.system.shields?.max) || 150;
      await actor.update({ "system.shields.value": Math.min(maxShields * 3, curShields + overguardGain) });

      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Recompense Overguard (+${overguardGain} Absorption)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/kullervo/Recompense.png",
        origin: actor.uuid,
        duration: { rounds: 99 },
        description: `Recompense Overguard: Daggers pierced Kullervo, forging +${overguardGain} Overguard and knockdown immunity.`,
        flags: { core: { statusId: "recompense_overguard" } }
      }]);

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
          <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-shield-alt animate-pulse"></i> Recompense: Overguard Forged</strong><br/>
          <span style="font-size: 11px; color: #dff9fb;">No targets nearby: Daggers plunge into Kullervo's own body!<br/>
          ➔ <strong>Overguard Armor:</strong> Forged <strong>+${overguardGain} Overguard Absorption Buffer</strong> and complete knockdown immunity!</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }
  }

  // ==========================================
  // 3. COLLECTIVE CURSE (Shared Damage Web)
  // ==========================================
  if (baseName === "collective curse") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const cursedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Collective Curse (Damage Chained)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/kullervo/CollectiveCurse.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          description: "Collective Curse: Bound in void agony. 100% of damage taken by any cursed ally is transmitted to this unit!",
          flags: { core: { statusId: "collective_curse" } }
        }]);
        cursedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-project-diagram animate-pulse"></i> Collective Curse Damage Web Bound</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">${cursedNames.length > 0 ? `➔ <strong>Chained Foes:</strong> ${cursedNames.join(", ")} for ${durationRounds} rounds.<br/>` : ""}
        ➔ <strong>Shared Agony:</strong> <strong>100% of all damage dealt to ONE cursed enemy is dealt to ALL chained enemies simultaneously!</strong></span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. STORM OF UKKO (Dagger Rain)
  // ==========================================
  if (baseName === "storm of ukko") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-cloud-showers-heavy animate-pulse"></i> Storm of Ukko Void Daggers Raining</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Kullervo summons a relentless storm of spectral daggers in a 10m target zone for 4 rounds!<br/>
        ➔ Continuous <strong>3d10 Slash/Puncture damage</strong> every round to all enemies standing in the storm!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 3d10 damage roll
  }

  return { handled: false };
}
