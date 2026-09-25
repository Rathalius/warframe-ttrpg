/**
 * Warframe TTRPG - Frost Mechanics Module
 * Canonical implementation of Frost abilities (Cryogenic Controller)
 */

export async function handleFrostAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Freeze
  if (baseName === "freeze") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Freeze (Cryogenic Solid Ice)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/frost/Freeze.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Encased in a solid block of sub-zero cryo ice! Completely immobilized and frozen solid.",
          flags: { core: { statusId: "frost_frozen" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 188, 212, 0.08); border: 1px solid #00bcd4; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-icicles"></i> <strong>Cryogenic Freeze:</strong> Ray of absolute zero encases ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "target"} in solid cryo ice for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Ice Wave
  if (baseName === "ice wave") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Ice Wave (Frosted / 60% Slow)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/frost/IceWave.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.speed.land.value", value: -15, mode: 2, priority: 20 }
          ],
          description: "Ground frosted with razor-sharp ice crystals: Movement speed reduced by 60%.",
          flags: { core: { statusId: "ice_wave_slow" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(2, 136, 209, 0.08); border: 1px solid #0288d1; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-water"></i> <strong>Ice Wave Surged:</strong> Razor crystal wave sweeps through the field, damaging foes and slowing movement by <strong>60%</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Snow Globe
  if (baseName === "snow globe") {
    const armorVal = Number(actor.system.armor?.value) || 100;
    const globeHealth = Math.round((500 + (5 * armorVal)) * strMult);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 188, 212, 0.08); border: 1px solid #00bcd4; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-snowflake"></i> <strong>Snow Globe Erected:</strong> Impenetrable 5m ice dome created with <strong>${globeHealth} HP</strong>! Blocks external projectile fire; enemies inside are slowed by 67%. Enemies pushed out upon creation!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Avalanche
  if (baseName === "avalanche") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Avalanche (Frozen Brittle / 100% Armor Strip)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/frost/Avalanche.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          changes: [
            { key: "system.armor.value", value: 0, mode: 5, priority: 50 }
          ],
          description: "Flash-frozen into a brittle ice statue: 100% of Armor is stripped! Frozen solid. Slain victims shatter dealing heavy cold shrapnel damage to neighbors!",
          flags: { core: { statusId: "avalanche_frozen" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(3, 155, 229, 0.08); border: 1px solid #039be5; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-wind"></i> <strong>Avalanche Sub-Zero Cataclysm:</strong> Flash-freezes ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "all foes"} into brittle ice statues! Inflicts <strong>100% Armor Strip</strong>; shattered enemies explode!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
