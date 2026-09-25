/**
 * Warframe TTRPG - Hydroid Mechanics Module
 * Canonical implementation of Hydroid abilities (The Ocean Marauder)
 */

export async function handleHydroidAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Tempest Barrage
  if (baseName === "tempest barrage") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Tempest Barrage (Corrosive Rain / Knockdown)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/hydroid/TempestBarrage.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["prone"],
          description: "Struck by torrential corrosive cannon fire: Staggered, knocked prone, and continuously afflicted with Corrosive status stripping Armor.",
          flags: { core: { statusId: "tempest_corrosive" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 150, 136, 0.08); border: 1px solid #009688; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-cloud-showers-heavy"></i> <strong>Tempest Barrage Unleashed:</strong> Torrent of corrosive water cannons pelts the target zone for ${durationRounds} rounds! Knocks foes prone and continuously inflicts Corrosive armor strip!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Tidal Surge
  if (baseName === "tidal surge") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Tidal Surge (Washed Away / Prone)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/hydroid/TidalSurge.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Swept up in a crashing tidal wave: Dragged along and knocked flat.",
          flags: { core: { statusId: "tidal_surge_prone" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(38, 166, 154, 0.08); border: 1px solid #26a69a; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-water"></i> <strong>Tidal Surge Wave:</strong> Hydroid transforms into a crashing wall of water, gaining total invulnerability and sweeping all enemies in his path prone!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Plunder
  if (baseName === "plunder") {
    const armorBonus = Math.min(1500, Math.round(300 * strMult * Math.max(1, targets.length)));
    const corrosiveBonus = Math.round(75 * strMult);
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Plunder (+${armorBonus} Armor / +${corrosiveBonus}% Corrosive Dmg)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/hydroid/Plunder.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.armor.value", value: armorBonus, mode: 2, priority: 25 },
        { key: "system.damageBonus.value", value: corrosiveBonus, mode: 2, priority: 20 }
      ],
      description: `Plunder Active: Stole armor from corroded foes! Grants +${armorBonus} Armor and infuses all Tenno weapons with +${corrosiveBonus}% Corrosive damage!`,
      flags: { core: { statusId: "hydroid_plunder" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 121, 107, 0.08); border: 1px solid #00796b; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-coins"></i> <strong>Plunder Siphoned:</strong> Hydroid strips armor from ${targets.length > 0 ? targets.length : 3} foes! Gains <strong>+${armorBonus} Armor</strong> and infuses weapons with <strong>+${corrosiveBonus}% Corrosive Damage</strong> for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Tentacle Swarm
  if (baseName === "tentacle swarm") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Tentacle Swarm (Kraken Entangled / True Damage)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/hydroid/TentacleSwarm.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["restrained"],
          description: "Seized by the deep Kraken tentacles: Lifted, flailed, and crushed with True Magnetic/Impact damage. Slain enemies yield 100% bonus loot!",
          flags: { core: { statusId: "tentacle_swarm_kraken" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 77, 64, 0.2); border: 1px solid #004d40; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-skull-crossbones"></i> <strong>Tentacle Swarm Kraken Erupted:</strong> Deep sea kraken tentacles burst from the floor! Entangles and flails ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "foes"} for ${durationRounds} rounds, dealing continuous True Damage and doubling loot drops!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
