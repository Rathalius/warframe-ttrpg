/**
 * Warframe TTRPG - Volt Mechanics Module
 * Canonical implementation of Volt abilities (High-Voltage Electrician)
 */

export async function handleVoltAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Shock
  if (baseName === "shock") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Shock (Chain Electrocuted / Stun)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/volt/Shock.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["shocked"],
          description: "Struck by high-voltage lightning: Stunned in electrical spasms and arcs bolts to up to 5 adjacent targets.",
          flags: { core: { statusId: "volt_shock" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px; font-size: 10.5px; color: #fef9e7;">
        <i class="fas fa-bolt"></i> <strong>Shock Discharged:</strong> Direct bolt strikes target and chains to up to 5 nearby foes, stunning them with electrical spasms!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Speed
  if (baseName === "speed") {
    const speedBoost = Math.round(15 * strMult);
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: `Volt Speed (+${speedBoost} ft)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/volt/Speed.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.speed.land.value", value: speedBoost, mode: 2, priority: 20 },
          { key: "system.meleeSpeed.value", value: 25, mode: 2, priority: 20 }
        ],
        description: `Electric Overdrive: +${speedBoost} ft movement speed and +25% melee attack speed for ${durationRounds} rounds.`,
        flags: { core: { statusId: "volt_speed" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px; font-size: 10.5px; color: #fef9e7;">
        <i class="fas fa-running"></i> <strong>Volt Speed Surge:</strong> +${speedBoost} ft speed & +25% melee speed granted to ${squad.map(a => a.name).join(", ")}!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Electric Shield
  if (baseName === "electric shield") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Electric Shield (+50% Elec / +200% Crit Dmg)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/volt/ElectricShield.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.criticalDamage.bonus", value: 200, mode: 2, priority: 25 }
      ],
      description: "Electric Shield Active: Blocks 100% of incoming gunfire. Shots fired through shield gain +50% Electric damage and +200% Critical Damage!",
      flags: { core: { statusId: "volt_shield" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(243, 156, 18, 0.08); border: 1px solid #f39c12; border-radius: 4px; font-size: 10.5px; color: #fde68a;">
        <i class="fas fa-shield-alt"></i> <strong>Electric Shield Deployed:</strong> Impassable energy barrier erected! <strong>Blocks 100% of enemy gunfire</strong>; Tenno shots fired through gain <strong>+50% Electric Damage</strong> and <strong>+200% Critical Damage</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Discharge
  if (baseName === "discharge") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Discharge (Tesla Coil Stasis)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/volt/Discharge.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Paralyzed in electrical stasis: Transforms into a living Tesla coil, discharging high-voltage arcs into nearby enemies and recharging Tenno shields!",
          flags: { core: { statusId: "volt_discharge" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px; font-size: 10.5px; color: #fef9e7;">
        <i class="fas fa-atom"></i> <strong>Discharge Overload:</strong> Massive electric shockwave paralyzes ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"} in electrical stasis! Enemies become living Tesla coils discharging electricity into their comrades!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
