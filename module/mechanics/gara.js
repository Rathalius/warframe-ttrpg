/**
 * Warframe TTRPG - Gara Mechanics Module
 * Canonical implementation of Gara abilities
 */

export async function handleGaraAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Shattered Lash
  if (baseName === "shattered lash") {
    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 150, 136, 0.08); border: 1px solid #009688; border-radius: 4px; font-size: 10.5px; color: #e0f2f1;">
        <i class="fas fa-magic"></i> <strong>Shattered Lash Thrust / Sweep:</strong> Glass blade lunges in a straight line or sweeps an arc! Deals bonus damage scaling with equipped Melee weapon mods. If Mass Vitrify is struck, shatters the wall into a catastrophic outer explosion!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Splinter Storm
  if (baseName === "splinter storm") {
    const drPercent = Math.min(90, Math.round(90 * strMult));
    const durationRounds = Math.max(1, Math.round(3 * durMult));
    const dps = Math.round(150 * strMult);

    const targetActor = targets.length > 0 && targets[0].actor ? targets[0].actor : actor;

    await targetActor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Splinter Storm (${drPercent}% DR / ${dps} Glass DPS)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gara/SplinterStorm.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.damageReduction", value: drPercent, mode: 2, priority: 20 }
      ],
      description: `Swirling cloud of razor-sharp glass shards: Grants ${drPercent}% Damage Reduction. Deals ${dps} Slash/Puncture damage per round to all enemies within 3m. Damage stacks infinitely when Mass Vitrify is shattered!`,
      flags: { core: { statusId: "splinter_storm" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(38, 166, 154, 0.08); border: 1px solid #26a69a; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-wind"></i> <strong>Splinter Storm Cloak:</strong> Swirling glass maelstrom applied to ${targetActor.name}! Grants <strong>${drPercent}% Damage Reduction</strong> and shreds adjacent enemies for <strong>${dps} damage/round</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Spectrorage
  if (baseName === "spectrorage") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Spectrorage (Charmed / Mirror Carousel)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gara/Spectrorage.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["confused"],
          description: "Entranced by a spinning carousel of mirrors! Compelled to attack mirror reflections instead of Tenno. Foes killed drop guaranteed Energy Orbs.",
          flags: { core: { statusId: "spectrorage_mirror" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(77, 182, 172, 0.08); border: 1px solid #4db6ac; border-radius: 4px; font-size: 10.5px; color: #e0f2f1;">
        <i class="fas fa-clone"></i> <strong>Spectrorage Mirror Carousel:</strong> Encircled enemies in a ring of spectral mirrors! Foes are compelled to attack the glass mirrors. Slain enemies drop guaranteed Energy Orbs!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Mass Vitrify
  if (baseName === "mass vitrify") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Mass Vitrify (Crystallized in Molten Glass)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gara/MassVitrify.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Enveloped in molten liquid glass and solidified. Completely frozen and immobilized. Takes +50% increased damage.",
          flags: { core: { statusId: "mass_vitrify_freeze" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 105, 92, 0.08); border: 1px solid #00695c; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-shield-alt"></i> <strong>Mass Vitrify Expanded:</strong> Ring of molten glass expands outward, crystallizing and freezing ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"} into solid glass! Refreshes Splinter Storm duration. Strike wall with Shattered Lash to cause a catastrophic radial explosion!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
