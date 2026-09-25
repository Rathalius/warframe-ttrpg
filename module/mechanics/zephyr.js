/**
 * Warframe TTRPG - Zephyr Mechanics Module
 * Canonical implementation of Zephyr abilities (Aerial Superiority & Wind Deflection)
 */

export async function handleZephyrAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Tail Wind
  if (baseName === "tail wind") {
    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(3, 169, 244, 0.08); border: 1px solid #03a9f4; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-feather-alt"></i> <strong>Tail Wind Flight:</strong> Zephyr launches into aerial flight or hover stance! While airborne, critical chance on weapons is doubled (+100% Crit). Dive bomb slams down with a 10m knockdown shockwave!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Airburst
  if (baseName === "airburst") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Airburst (Suction Clustered & Prone)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/zephyr/Airburst.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Struck by dense burst of compressed air: Pulled into the center vortex and knocked flat on the floor.",
          flags: { core: { statusId: "airburst_knockdown" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 188, 212, 0.08); border: 1px solid #00bcd4; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-compress-arrows-alt"></i> <strong>Airburst Detonated:</strong> Compressed blast of wind pulls ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "foes"} together into a tight cluster and knocks them prone!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Turbulence
  if (baseName === "turbulence") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Turbulence (100% Projectile & Bullet Deflection)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/zephyr/Turbulence.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.evasion.ranged", value: 100, mode: 2, priority: 50 }
      ],
      description: "Turbulence Wind Shield: Creates a chaotic vortex of wind around Zephyr that deflects 100% of all incoming bullets, rockets, and projectile attacks away harmlessly!",
      flags: { core: { statusId: "turbulence_shield" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 150, 136, 0.08); border: 1px solid #009688; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-shield-alt"></i> <strong>Turbulence Barrier Active:</strong> High-pressure wind shield deployed for ${durationRounds} rounds! <strong>100% of incoming gunfire, missiles, and projectiles are deflected away!</strong>
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Tornado
  if (baseName === "tornado") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Tornado (Trapped / Damage Distributed)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/zephyr/Tornado.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Trapped and spinning inside Zephyr's Tornado: Any weapon gunfire or damage shot into the tornado is distributed 100% to all trapped victims!",
          flags: { core: { statusId: "tornado_trapped" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(77, 182, 172, 0.08); border: 1px solid #4db6ac; border-radius: 4px; font-size: 10.5px; color: #e0f2f1;">
        <i class="fas fa-wind"></i> <strong>4 Towering Tornadoes Summoned:</strong> Trapped ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "foes"} in spinning vortex columns! <strong>Gunfire shot into the tornadoes is distributed 100% to ALL enemies inside!</strong> Absorbs elemental damage shot into it!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
