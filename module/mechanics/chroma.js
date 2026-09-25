/**
 * Warframe TTRPG - Chroma Specialized Ability Mechanics
 * Canonical implementations:
 * - Spectral Scream: Channels continuous elemental breath cone (Heat, Cold, Elec, Toxin)
 * - Elemental Ward: Defensive aura (Heat +HP, Cold +Armor/Reflect, Elec +Shields/Arc, Toxin +Holster/Reload)
 * - Vex Armor: Scorn (+Armor on shield dmg) & Fury (+Weapon Dmg on health dmg)
 * - Effigy: Sheds dragon pelt as autonomous sentry turret (radial stun + credit boost)
 */

export async function handleChromaAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. SPECTRAL SCREAM (Elemental Breath Cone)
  // ==========================================
  if (baseName === "spectral scream") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-dragon animate-pulse"></i> Spectral Scream Dragon Breath</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Chroma exhales a 15m cone of continuous elemental destruction! Afflicts all caught foes with guaranteed elemental status procs.</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 2d8 damage roll
  }

  // ==========================================
  // 2. ELEMENTAL WARD
  // ==========================================
  if (baseName === "elemental ward") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const bonusArmor = Math.round(150 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Elemental Ward (+${bonusArmor} Armor / Life Aura)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/chroma/ElementalWard.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [{ key: "system.armor.value", value: bonusArmor, mode: 2, priority: 20 }],
      description: `Elemental Ward: Dragon's elemental mantle surrounds Chroma and allies. Grants +${bonusArmor} Armor and elemental retaliation.`,
      flags: { core: { statusId: "elemental_ward" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-shield-alt animate-pulse"></i> Elemental Ward Emanating</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;">Draconic defensive field active for ${durationRounds} rounds!<br/>
        ➔ <strong>Defensive Bastion:</strong> Grants <strong>+${bonusArmor} bonus Armor</strong> to Chroma and squad within 15m.<br/>
        ➔ <strong>Retaliation:</strong> Staggers and inflicts elemental procs on incoming attackers!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. VEX ARMOR (Scorn Armor & Fury Weapon Damage)
  // ==========================================
  if (baseName === "vex armor") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const maxScorn = Math.round(350 * (powerStrength / 100));
    const maxFury = Math.round(275 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Vex Armor (Scorn +${maxScorn}%, Fury +${maxFury}%)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/chroma/VexArmor.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.damageBonus.value", value: Math.round(maxFury * 0.5), mode: 2, priority: 20 }
      ],
      description: `Vex Armor: Dragon rage active for ${durationRounds} rounds! Scorn multiplies Armor up to +${maxScorn}% when taking Shield damage. Fury multiplies Weapon Damage up to +${maxFury}% when taking Health damage!`,
      flags: { core: { statusId: "vex_armor" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-fire-alt animate-pulse"></i> Vex Armor Engaged</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Chroma channels all received punishment into combat supremacy for ${durationRounds} rounds!<br/>
        ➔ <strong>Scorn:</strong> Shield damage taken converts up to <strong>+${maxScorn}% Armor</strong>!<br/>
        ➔ <strong>Fury:</strong> Health damage taken converts up to <strong>+${maxFury}% Weapon Damage</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. EFFIGY (Autonomous Dragon Sentry)
  // ==========================================
  if (baseName === "effigy") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.1); border: 1px solid #f39c12; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-dragon animate-pulse"></i> Effigy Dragon Turret Materialized</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Chroma sheds his outer dragon pelt, forming an autonomous winged sentry turret for ${durationRounds} rounds!<br/>
        ➔ <strong>Terrifying Roar:</strong> Stuns all enemies in 15m radius.<br/>
        ➔ <strong>Elemental Turret:</strong> Breathes continuous elemental fire at approaching hostiles.<br/>
        ➔ <strong>Credit Bounty:</strong> Enemies killed near Effigy drop <strong>+100% bonus Credits</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
