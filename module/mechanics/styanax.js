/**
 * Warframe TTRPG - Styanax Mechanics Module
 * Canonical implementation of Styanax abilities (Spartan Hoplite Champion)
 */

export async function handleStyanaxAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Axios Javelin
  if (baseName === "axios javelin") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Axios Javelin (Pinned / Vortex Pulled)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/styanax/AxiosJavelin.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["restrained"],
          description: "Pinned to the wall/ground by an Axios javelin! An energy vortex drags all nearby enemies into a tight cluster.",
          flags: { core: { statusId: "axios_javelin_pin" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(183, 28, 28, 0.08); border: 1px solid #b71c1c; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-location-arrow"></i> <strong>Axios Javelin Hurled:</strong> Spear thrust pins target to the terrain! Generates an implosion vortex sucking all adjacent foes into a tight pile!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Tharros Strike
  if (baseName === "tharros strike") {
    const healPerEnemy = Math.round(50 * strMult);
    const hitCount = Math.max(1, targets.length);
    const curHP = Number(actor.system.health?.value) || 100;
    const maxHP = Number(actor.system.health?.max) || 100;
    const totalHeal = Math.min(maxHP - curHP, healPerEnemy * hitCount);

    if (totalHeal > 0) {
      await actor.update({ "system.health.value": curHP + totalHeal });
    }

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Tharros Strike (100% Armor & Shield Strip / Stagger)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/styanax/TharrosStrike.png",
          origin: actor.uuid,
          duration: { rounds: 99 },
          changes: [
            { key: "system.armor.value", value: 0, mode: 5, priority: 50 },
            { key: "system.shields.value", value: 0, mode: 5, priority: 50 }
          ],
          description: "Spartan Shield Bash: 100% of Armor and Shields shattered! Enemy is staggered and knocked back.",
          flags: { core: { statusId: "tharros_strike_strip" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(198, 40, 40, 0.08); border: 1px solid #c62828; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-shield"></i> <strong>Tharros Strike Slammed:</strong> Shield bash shreds <strong>100% of Armor and Shields</strong> from ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "targets"}! Restores <strong>+${totalHeal} HP</strong> to Styanax!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Rally Point
  if (baseName === "rally point") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));
    const energyPerSec = Math.round(3 * strMult);

    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: `Rally Point (+${energyPerSec} Energy/s & Shield on Kill)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/styanax/RallyPoint.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        description: `Rally Point Active: Inspires Tenno with +${energyPerSec} Energy/round. Every kill or assist recharges shields and awards +100 Overshields! Styanax draws enemy aggro.`,
        flags: { core: { statusId: "rally_point_morale" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(211, 47, 47, 0.08); border: 1px solid #d32f2f; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-flag"></i> <strong>Rally Point Commanded:</strong> Styanax rallies the squad! Grants <strong>+${energyPerSec} Energy/round</strong> and restores <strong>Overshields on every kill</strong> for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Final Stand
  if (baseName === "final stand") {
    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(136, 14, 79, 0.08); border: 1px solid #880e4f; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-meteor"></i> <strong>Final Stand Aerial Barrage:</strong> Styanax leaps high into the air, hovering invulnerable and launching a relentless barrage of 30 Axios Javelins! Causes devastating radial Slash explosions and forced bleed status on all enemies below!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
