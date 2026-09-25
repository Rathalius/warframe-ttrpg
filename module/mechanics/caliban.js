/**
 * Warframe TTRPG - Caliban Mechanics Module
 * Canonical implementation of Caliban abilities (Sentient / Warframe Hybrid)
 */

export async function handleCalibanAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Razor Gyre
  if (baseName === "razor gyre") {
    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(92, 107, 115, 0.08); border: 1px solid #78909c; border-radius: 4px; font-size: 10.5px; color: #eceff1;">
        <i class="fas fa-tornado"></i> <strong>Razor Gyre Cyclone:</strong> Spins into a vortex of Sentient energy! Dashes through enemies, shredding armor with Impact/Slash and converting 10% of damage dealt into Health regeneration.
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Sentient Wrath
  if (baseName === "sentient wrath") {
    const vulPercent = Math.round(50 * strMult);
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Sentient Wrath (Lifted / +${vulPercent}% Dmg Taken)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/caliban/SentientWrath.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          changes: [
            { key: "system.damageTakenBonus", value: vulPercent, mode: 2, priority: 20 }
          ],
          description: `Lifted helplessly in anti-gravity Sentient field! Helpless and takes +${vulPercent}% increased damage from all attacks.`,
          flags: { core: { statusId: "sentient_wrath_lift" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(144, 164, 174, 0.08); border: 1px solid #90a4ae; border-radius: 4px; font-size: 10.5px; color: #cfd8dc;">
        <i class="fas fa-meteor"></i> <strong>Sentient Wrath Concussion:</strong> Shockwave smashes through the field! Lifted ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"} into anti-gravity stasis with <strong>+${vulPercent}% Damage Vulnerability</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Lethal Progeny
  if (baseName === "lethal progeny") {
    const shieldBonus = Math.round(300 * strMult);
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Lethal Progeny (3 Conculysts / +${shieldBonus} Shields)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/caliban/LethalProgeny.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.shields.bonus", value: shieldBonus, mode: 2, priority: 20 }
      ],
      description: `Sentient Escort: 3 Conculyst warriors fight alongside Caliban, continuously repairing shields and Overshields up to +${shieldBonus}!`,
      flags: { core: { statusId: "lethal_progeny" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(84, 110, 122, 0.08); border: 1px solid #546e7a; border-radius: 4px; font-size: 10.5px; color: #b0bec5;">
        <i class="fas fa-users"></i> <strong>Lethal Progeny Summoned:</strong> 3 Sentient Conculysts materialize! They strike foes with spinning blades and continuously reinforce Caliban's shields by <strong>+${shieldBonus} Overshields</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Fusion Strike
  if (baseName === "fusion strike") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Fusion Strike (100% Permanent Armor & Shield Strip)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/caliban/FusionStrike.png",
          origin: actor.uuid,
          duration: { rounds: 99 },
          changes: [
            { key: "system.armor.value", value: 0, mode: 5, priority: 50 },
            { key: "system.shields.value", value: 0, mode: 5, priority: 50 }
          ],
          description: "Struck by converging Sentient energy: 100% of Armor and Shields permanently obliterated!",
          flags: { core: { statusId: "fusion_strike_strip" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(38, 50, 56, 0.2); border: 1px solid #37474f; border-radius: 4px; font-size: 10.5px; color: #eceff1;">
        <i class="fas fa-sun"></i> <strong>Fusion Strike Singularity:</strong> Three Sentient beams converge and detonate! Inflicts <strong>100% Permanent Armor & Shield Strip</strong> on ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "targets"} and leaves a radioactive fallout field!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
