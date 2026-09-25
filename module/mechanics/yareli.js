/**
 * Warframe TTRPG - Yareli Mechanics Module
 * Canonical implementation of Yareli abilities (The Wave Rider)
 */

export async function handleYareliAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Sea Snares
  if (baseName === "sea snares") {
    const vulPercent = Math.round(200 * strMult);
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Sea Snares (Bubbled / +${vulPercent}% Dmg Taken)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/yareli/SeaSnares.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          changes: [
            { key: "system.damageTakenBonus", value: vulPercent, mode: 2, priority: 25 }
          ],
          description: `Trapped inside a swirling water sphere: Helpless and takes +${vulPercent}% increased damage from all attacks! Takes cold water DoT.`,
          flags: { core: { statusId: "sea_snares_bubble" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 188, 212, 0.08); border: 1px solid #00bcd4; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-water"></i> <strong>Sea Snares Launched:</strong> 5 seeking water globes trap ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"}! Trapped foes suffer Cold DoT and take <strong>+${vulPercent}% Increased Damage</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Merulina
  if (baseName === "merulina") {
    const hpPool = Math.round((500 + (5 * (Number(actor.system.health?.max || 100)))) * strMult);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Merulina (${hpPool} HP / 75% DR Mount)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/yareli/Merulina.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [
        { key: "system.damageReduction", value: 75, mode: 2, priority: 25 },
        { key: "system.speed.land.value", value: 20, mode: 2, priority: 20 }
      ],
      description: `Mounted on Merulina: Absorbs 75% of all incoming damage up to ${hpPool} HP! Grants +20ft movement speed, complete knockdown/stagger immunity, and enhanced secondary weapon critical chance!`,
      flags: { core: { statusId: "merulina_mount" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(3, 169, 244, 0.08); border: 1px solid #03a9f4; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-skating"></i> <strong>Merulina Summoned:</strong> Living creature of the tides surfaces! Yareli mounts Merulina, gaining <strong>75% Damage Reduction</strong> (${hpPool} HP buffer), +20ft speed, and complete knockdown immunity!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Aquablades
  if (baseName === "aquablades") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));
    const bladeDmg = Math.round(150 * strMult);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Aquablades (${bladeDmg} Slash DPS / Orbit)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/yareli/Aquablades.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `3 spinning water blades orbit Yareli, dealing ${bladeDmg} Slash damage per round with guaranteed Bleed status to all enemies within 3m!`,
      flags: { core: { statusId: "aquablades" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 150, 136, 0.08); border: 1px solid #009688; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-fan"></i> <strong>Aquablades Orbiting:</strong> 3 razor-sharp spinning water discs surround Yareli! Slices nearby foes for <strong>${bladeDmg} Slash DPS</strong> with forced Bleed status!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Riptide
  if (baseName === "riptide") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Riptide (Cyclone Trapped & Crushed)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/yareli/Riptide.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Sucked into an immense underwater cyclone! Crushed by hydro-pressure and ragdolled outward upon detonation.",
          flags: { core: { statusId: "riptide_crush" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(2, 119, 189, 0.08); border: 1px solid #0277bd; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-atom"></i> <strong>Riptide Whirlpool:</strong> Massive hydro-vortex sucks in all foes, crushing them together before erupting in a catastrophic burst of water pressure!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
