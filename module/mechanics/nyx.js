/**
 * Warframe TTRPG - Nyx Mechanics Module
 * Canonical implementation of Nyx abilities
 */

export async function handleNyxAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Mind Control
  if (baseName === "mind control") {
    const durationRounds = Math.max(1, Math.round(5 * durMult));
    const bonusDmg = Math.round(100 * strMult);

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Mind Controlled (+${bonusDmg}% Dmg / Ally)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nyx/MindControl.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.damageBonus.value", value: bonusDmg, mode: 2, priority: 20 }
          ],
          description: `Psychically Enslaved: Fights alongside Tenno as an allied minion for ${durationRounds} rounds! Absorbs incoming fire to multiply its weapon attack damage.`,
          flags: { core: { statusId: "mind_controlled" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 150, 136, 0.08); border: 1px solid #009688; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-brain"></i> <strong>Mind Control Invoked:</strong> Psychically enthralled ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "target"}! Target becomes an immune ally for ${durationRounds} rounds with <strong>+${bonusDmg}% attack damage</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Psychic Bolts
  if (baseName === "psychic bolts") {
    const stripPercent = Math.min(100, Math.round(80 * strMult));
    const durationRounds = Math.max(1, Math.round(3 * durMult));
    const hitTargets = targets.slice(0, 6);

    for (const t of hitTargets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Psychic Bolts (-${stripPercent}% Defenses)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nyx/PsychicBolts.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.armor.value", value: stripPercent >= 100 ? 0 : 0.2, mode: 5, priority: 50 },
            { key: "system.shields.value", value: stripPercent >= 100 ? 0 : 0.2, mode: 5, priority: 50 }
          ],
          description: `Telepathic Bolts: Telekinetic disruption strips ${stripPercent}% of Armor and Shields, and nullifies defensive auras!`,
          flags: { core: { statusId: "psychic_bolts_strip" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(38, 166, 154, 0.08); border: 1px solid #26a69a; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-bolt"></i> <strong>Psychic Bolts Fired:</strong> Seeking telepathic needles strike ${hitTargets.length > 0 ? hitTargets.map(t => t.name).join(", ") : "up to 6 foes"}, stripping <strong>${stripPercent}% of all Armor and Shields</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Chaos
  if (baseName === "chaos") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Chaos (Confused / Friendly Fire)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nyx/Chaos.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["confused"],
          description: "Psychic hysteria: Hallucinates allies as enemies and Tenno, turning guns and blades against fellow troops!",
          flags: { core: { statusId: "nyx_chaos" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 121, 107, 0.08); border: 1px solid #00796b; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-random"></i> <strong>Chaos Erupted:</strong> Mass psychic psychosis engulfs the battlefield! ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "Foes"} hallucinate phantom Tenno and fire upon each other for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Absorb
  if (baseName === "absorb") {
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Absorb (Invulnerable / Kinetic Store)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nyx/Absorb.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [
        { key: "system.damageReduction", value: 100, mode: 2, priority: 50 }
      ],
      description: "Absorb Sphere Active: 100% invulnerable to all incoming enemy and friendly fire. All absorbed damage is stored and unleashed in a massive radial knockdown explosion upon deactivation!",
      flags: { core: { statusId: "nyx_absorb" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(128, 203, 196, 0.08); border: 1px solid #80cbc4; border-radius: 4px; font-size: 10.5px; color: #e0f2f1;">
        <i class="fas fa-shield-virus"></i> <strong>Absorb Sphere Formed:</strong> Nyx enters complete invulnerability! Absorbs all incoming firepower and stores kinetic force. Recast detonates a catastrophic radial blast!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  return { handled: false };
}
