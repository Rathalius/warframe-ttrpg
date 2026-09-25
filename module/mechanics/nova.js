/**
 * Warframe TTRPG - Nova Mechanics Module
 * Canonical implementation of Nova abilities
 */

export async function handleNovaAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Null Star
  if (baseName === "null star") {
    const particleCount = Math.min(18, Math.round(12 * durMult));
    const drPercent = Math.min(90, particleCount * 5);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Null Star (${particleCount} Particles / ${drPercent}% DR)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nova/NullStar.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [
        { key: "system.damageReduction", value: drPercent, mode: 2, priority: 20 }
      ],
      description: `Null Star Orbit: ${particleCount} antimatter particles orbit Nova, granting ${drPercent}% Health Damage Reduction (5% per particle, max 90%). Particles automatically launch at nearby enemies to deal Blast damage.`,
      flags: { core: { statusId: "null_star" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(156, 39, 176, 0.08); border: 1px solid #9c27b0; border-radius: 4px; font-size: 10.5px; color: #e1bee7;">
        <i class="fas fa-atom"></i> <strong>Null Star Conjured:</strong> ${particleCount} antimatter particles in orbit! Grants <strong>${drPercent}% Damage Reduction</strong> against Health damage. Particles seek out and detonate against approaching foes.
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Antimatter Drop
  if (baseName === "antimatter drop") {
    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(103, 58, 183, 0.08); border: 1px solid #673ab7; border-radius: 4px; font-size: 10.5px; color: #d1c4e9;">
        <i class="fas fa-meteor"></i> <strong>Antimatter Drop Launched:</strong> Slow-floating sphere of volatile antimatter deployed! <strong>Absorbs 100% of weapon gunfire</strong> fired into it by squadmates, multiplying absorbed damage by <strong>4x</strong> before detonating in a catastrophic 15m blast radius!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Worm Hole
  if (baseName === "worm hole") {
    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(63, 81, 181, 0.08); border: 1px solid #3f51b5; border-radius: 4px; font-size: 10.5px; color: #c5cae9;">
        <i class="fas fa-circle-notch"></i> <strong>Worm Hole Opened:</strong> Spatial rift torn across spacetime up to 50m! Allies, vehicles, and projectiles passing through are instantly teleported to the exit coordinate.
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Molecular Prime
  if (baseName === "molecular prime") {
    const slowPercent = Math.min(75, Math.round(30 + (strMult > 1 ? (strMult - 1) * 100 : -(1 - strMult) * 100)));
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Molecular Prime (${slowPercent > 0 ? `-${slowPercent}% Speed` : `+${Math.abs(slowPercent)}% Speed`} / 2x Damage)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nova/MolecularPrime.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.damageTakenMultiplier", value: 2, mode: 2, priority: 30 }
          ],
          description: `Infused with antimatter: Takes 2x (100% more) damage from all attacks! ${slowPercent > 0 ? `Slowed by ${slowPercent}%.` : `Accelerated by ${Math.abs(slowPercent)}%.`} Slain victims detonate in a volatile antimatter explosion dealing heavy blast damage to neighbors!`,
          flags: { core: { statusId: "molecular_prime" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(142, 36, 170, 0.08); border: 1px solid #8e24aa; border-radius: 4px; font-size: 10.5px; color: #e1bee7;">
        <i class="fas fa-radiation"></i> <strong>Molecular Prime Wave:</strong> Antimatter wave primed ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"}! Targets take <strong>2x Double Damage</strong> from all sources and are ${slowPercent >= 0 ? `slowed by <strong>${slowPercent}%</strong>` : `sped up by <strong>${Math.abs(slowPercent)}% (Speed Nova)</strong>`}! Slain foes detonate in chain-reaction antimatter explosions!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
