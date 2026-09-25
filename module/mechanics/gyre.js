/**
 * Warframe TTRPG - Gyre Mechanics Module
 * Canonical implementation of Gyre abilities (High-Voltage Dynamo)
 */

export async function handleGyreAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Arcsphere
  if (baseName === "arcsphere") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Arcsphere (Continuous Shock Pulses)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gyre/Arcsphere.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["shocked"],
          description: "Trapped in an Arcsphere field: Continuously electrocuted, stunned, and shocked with high-voltage electricity.",
          flags: { core: { statusId: "arcsphere_shock" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(2, 136, 209, 0.08); border: 1px solid #0288d1; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-bolt"></i> <strong>Arcsphere Deployed:</strong> Gyrating electrical sphere anchored! Emits continuous high-voltage electrical pulses shocking all surrounding foes for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Coil Horizon
  if (baseName === "coil horizon") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Coil Horizon (Electrical Implosion / Prone)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gyre/CoilHorizon.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Caught in electromagnetic implosion: Pulled violently to center and knocked flat.",
          flags: { core: { statusId: "coil_horizon_pull" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(3, 169, 244, 0.08); border: 1px solid #03a9f4; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-compact-disc"></i> <strong>Coil Horizon Detonated:</strong> Gyroscopic mine implodes! Sucks in all nearby enemies with massive magnetic force and knocks them prone!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Cathode Grace
  if (baseName === "cathode grace") {
    const critBonus = Math.round(50 * strMult);
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Cathode Grace (+${critBonus}% Crit & +2 Energy/s)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gyre/CathodeGrace.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.criticalChance.bonus", value: critBonus, mode: 2, priority: 30 }
      ],
      description: `Cathode Grace Active: Grants +${critBonus}% Critical Hit Chance and continuous Energy regeneration (+2/s). Scoring kills extends the ability duration by +1 round!`,
      flags: { core: { statusId: "cathode_grace" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 188, 212, 0.08); border: 1px solid #00bcd4; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-battery-charging"></i> <strong>Cathode Grace Activated:</strong> Gyre enters high-frequency excitation! <strong>+${critBonus}% Critical Chance</strong> and <strong>+2 Energy/round</strong>! Kills extend duration!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Rotorswell
  if (baseName === "rotorswell") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Rotorswell (Chain Lightning on Crits)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gyre/Rotorswell.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: "Rotorswell Overdrive: An electric field surrounds Gyre. Whenever Gyre lands a Critical Hit, a massive discharge of chain lightning strikes nearby enemies! Synergizes with Cathode Grace.",
      flags: { core: { statusId: "rotorswell_lightning" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(38, 198, 218, 0.08); border: 1px solid #26c6da; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-bolt"></i> <strong>Rotorswell Electric Dynamo:</strong> High-voltage dynamo unleashed! <strong>Every Critical Hit unleashes violent chain lightning</strong> striking multiple nearby foes! Kills extend duration!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  return { handled: false };
}
