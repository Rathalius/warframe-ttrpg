/**
 * Warframe TTRPG - Revenant Mechanics Module
 * Canonical implementation of Revenant abilities (The Eidolon / Sentient Phantasm)
 */

export async function handleRevenantAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Enthrall
  if (baseName === "enthrall") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Enthrall (Mindless Thrall / Infectious)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/revenant/Enthrall.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          description: "Enthralled into a Sentient Thrall: Fights alongside Tenno. Attacks infect and enthrall other foes (up to 7 thralls). Slain thralls erupt into damaging Sentient energy pillars.",
          flags: { core: { statusId: "revenant_thrall" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 150, 136, 0.08); border: 1px solid #009688; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-ghost"></i> <strong>Enthrall Invoked:</strong> Converted ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "target"} into a Sentient Thrall! Thrall attacks spread infection to up to 7 enemies, and slain thralls leave explosive Sentient energy pillars!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Mesmer Skin
  if (baseName === "mesmer skin") {
    const chargeCount = Math.max(6, Math.round(6 * strMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Mesmer Skin (${chargeCount} Charges / Total Immunity)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/revenant/MesmerSkin.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [
        { key: "system.damageReduction", value: 100, mode: 2, priority: 50 }
      ],
      description: `Mesmer Skin Active: Fortified with ${chargeCount} Sentient energy charges. Completely negates incoming damage, reflects attacks, and puts attackers into an immediate slumber (sleep stasis)!`,
      flags: { core: { statusId: "mesmer_skin" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(38, 166, 154, 0.08); border: 1px solid #26a69a; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-shield-alt"></i> <strong>Mesmer Skin Hardened:</strong> Fortified with <strong>${chargeCount} Sentient Absorption Charges</strong>! Completely nullifies incoming damage; any enemy that attacks Revenant is put into a deep sleep!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Reave
  if (baseName === "reave") {
    const leechPct = Math.round(40 * strMult);

    for (const t of targets) {
      if (t.actor) {
        const isThrall = t.actor.effects.some(e => e.name.toLowerCase().includes("enthrall"));
        const actualLeech = isThrall ? 100 : leechPct;

        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Reave Siphoned (-${actualLeech}% HP & Shields)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/revenant/Reave.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["blind"],
          description: `Reaved by the Sentient phantasm: Siphoned of ${actualLeech}% of total Health and Shields.`,
          flags: { core: { statusId: "reave_siphon" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 121, 107, 0.08); border: 1px solid #00796b; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-stream"></i> <strong>Reave Phantasm Dash:</strong> Revenant dashes through foes as pure Sentient energy! Drains <strong>${leechPct}% Health & Shields (100% vs Thralls!)</strong>, replenishing Revenant's HP, Shields, and Mesmer Skin charges!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 4. Danse Macabre
  if (baseName === "danse macabre") {
    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 77, 64, 0.2); border: 1px solid #004d40; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-sun"></i> <strong>Danse Macabre Eidolon Lasers:</strong> Revenant spins in a 360-degree whirlwind of 9 Sentient energy beams! <strong>Automatically adapts damage type to the enemy's elemental weaknesses</strong> (Corrosive vs Ferrite, Magnetic vs Shields, Radiation vs Alloy)! Incoming damage is redirected into beam output!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
