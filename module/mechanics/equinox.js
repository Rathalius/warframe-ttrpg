/**
 * Warframe TTRPG - Equinox Specialized Ability Mechanics
 * Canonical implementations:
 * - Metamorphosis: Switches between Day Form (Damage & Speed) and Night Form (Shields & Armor)
 * - Rest & Rage: Night rests foes to sleep; Day enrages foes to take +50% damage
 * - Pacify & Provoke: Night pacifies enemy damage (-50%); Day provokes squad Power Strength (+20%)
 * - Mend & Maim: Night heals and restores squad shields; Day causes Slash aura and room-clearing explosion
 */

export async function handleEquinoxAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const currentForm = actor.getFlag("warframe-ttrpg", "equinoxForm") || "Day"; // default Day

  // ==========================================
  // 1. METAMORPHOSIS (Day / Night Form Shift)
  // ==========================================
  if (baseName === "metamorphosis") {
    const newForm = currentForm === "Day" ? "Night" : "Day";
    await actor.setFlag("warframe-ttrpg", "equinoxForm", newForm);
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));

    // Clean old metamorphosis buffs
    const oldBuffs = actor.effects.filter(e => !e.disabled && e.name.includes("Metamorphosis"));
    if (oldBuffs.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", oldBuffs.map(e => e.id));

    if (newForm === "Day") {
      const bonusDmg = Math.round(25 * (powerStrength / 100));
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Metamorphosis: Day Form (+${bonusDmg}% Dmg)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/equinox/Metamorphosis.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.damageBonus.value", value: bonusDmg, mode: 2, priority: 20 },
          { key: "system.speed.land.value", value: 15, mode: 2, priority: 20 }
        ],
        description: `Metamorphosis (Day Form): Anima aspects unleashed. +${bonusDmg}% Weapon Damage and +15 ft Speed.`,
        flags: { core: { statusId: "equinox_day" } }
      }]);
    } else {
      const bonusDef = Math.round(150 * (powerStrength / 100));
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Metamorphosis: Night Form (+${bonusDef} Shields/Armor)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/equinox/Metamorphosis.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.shields.bonus", value: bonusDef, mode: 2, priority: 20 },
          { key: "system.armor.value", value: bonusDef, mode: 2, priority: 20 }
        ],
        description: `Metamorphosis (Night Form): Animus aspects embraced. +${bonusDef} Shields buffer and +${bonusDef} Armor.`,
        flags: { core: { statusId: "equinox_night" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px;">
        <strong style="color: #fff; font-family: 'Orbitron';"><i class="fas fa-adjust animate-pulse"></i> Metamorphosis: Shifted to ${newForm} Form</strong><br/>
        <span style="font-size: 11px; color: #eee;">
          ${newForm === "Day" 
            ? "<strong>Day Form Active:</strong> Offense focus (+25% Weapon Damage, +15ft Speed). Abilities cast as <em>Rage</em>, <em>Provoke</em>, and <em>Maim</em>." 
            : "<strong>Night Form Active:</strong> Defense focus (+150 Shields, +150 Armor). Abilities cast as <em>Rest</em>, <em>Pacify</em>, and <em>Mend</em>."}
        </span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. REST & RAGE
  // ==========================================
  if (baseName === "rest & rage" || baseName === "rest" || baseName === "rage") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));

    if (currentForm === "Day") {
      // RAGE: Enemies take +50% amplified damage
      const vulnPct = Math.round(50 * (powerStrength / 100));
      const targetNames = [];
      for (const token of targets) {
        if (token.actor) {
          await token.actor.createEmbeddedDocuments("ActiveEffect", [{
            name: `Rage Vulnerability (+${vulnPct}% Damage Taken)`,
            icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/equinox/RestAndRage.png",
            origin: actor.uuid,
            duration: { rounds: durationRounds },
            description: `Rage: Enraged and reckless. Takes +${vulnPct}% increased damage from all attacks.`,
            flags: { core: { statusId: "rage_vulnerability" } }
          }]);
          targetNames.push(token.name);
        }
      }

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
          <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-fire"></i> Rage Infused (Day Form)</strong><br/>
          <span style="font-size: 11px; color: #f5cd79;">Targeted enemies (${targetNames.join(", ")}) enraged! They suffer <strong>+${vulnPct}% increased damage</strong> from all sources!</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    } else {
      // REST: Deep slumber
      const targetNames = [];
      for (const token of targets) {
        if (token.actor) {
          await token.actor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Rest Slumber (Asleep)",
            icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/equinox/RestAndRage.png",
            origin: actor.uuid,
            duration: { rounds: durationRounds },
            statuses: ["asleep"],
            description: "Rest: Soothed into tranquil slumber. Alert wiped, vulnerable to Finishers.",
            flags: { core: { statusId: "asleep" } }
          }]);
          targetNames.push(token.name);
        }
      }

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
          <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-moon"></i> Rest Slumber (Night Form)</strong><br/>
          <span style="font-size: 11px; color: #e0d0ea;">Targeted foes (${targetNames.join(", ")}) put to sleep for ${durationRounds} rounds. Open to Finishers!</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }
  }

  // ==========================================
  // 3. PACIFY & PROVOKE
  // ==========================================
  if (baseName === "pacify & provoke" || baseName === "pacify" || baseName === "provoke") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));

    if (currentForm === "Day") {
      // PROVOKE: +20% Power Strength to squad
      const bonusStr = Math.round(20 * (powerStrength / 100));
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Provoke Aura (+${bonusStr}% Power Strength)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/equinox/PacifyAndProvoke.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [{ key: "system.powerStrength.value", value: bonusStr, mode: 2, priority: 20 }],
        description: `Provoke Aura: Surges squad Power Strength by +${bonusStr}%.`,
        flags: { core: { statusId: "provoke_buff" } }
      }]);

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
          <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-sun"></i> Provoke Aura Active (Day Form)</strong><br/>
          <span style="font-size: 11px; color: #fef9e7;">Empowering aura active! Grants <strong>+${bonusStr}% Power Strength</strong> to all allies in 16m radius.</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    } else {
      // PACIFY: -50% enemy damage output
      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
          <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-shield-alt"></i> Pacify Field Active (Night Form)</strong><br/>
          <span style="font-size: 11px; color: #dff9fb;">Aura of tranquility active. Enemies within 16m have their offensive damage output cut by up to <strong>50%</strong>.</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }
  }

  // ==========================================
  // 4. MEND & MAIM
  // ==========================================
  if (baseName === "mend & maim" || baseName === "mend" || baseName === "maim") {
    if (currentForm === "Day") {
      // MAIM: Slash aura + release explosion
      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
          <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-cut animate-pulse"></i> Maim Active (Day Form)</strong><br/>
          <span style="font-size: 11px; color: #f5cd79;">Lethal wave of energy slashes nearby foes with continuous Slash procs. Stores all damage dealt in radius into a death accumulator; recast to unleash the stored pool in a room-clearing detonation!</span>
        </div>
      `;
      return { handled: false, cardExtraHTML }; // allow standard damage roll
    } else {
      // MEND: Squad healing & shield replenish
      const healAmount = Math.round(100 * (powerStrength / 100));
      const curHP = Number(actor.system.health?.value) || 0;
      const maxHP = Number(actor.system.health?.max) || 100;
      await actor.update({ "system.health.value": Math.min(maxHP, curHP + healAmount) });

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
          <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-heart animate-pulse"></i> Mend Unleashed (Night Form)</strong><br/>
          <span style="font-size: 11px; color: #a8e6cf;">Restores <strong>+${healAmount} Health & Shields</strong> to Equinox and all squad members within affinity range!</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }
  }

  return { handled: false };
}
