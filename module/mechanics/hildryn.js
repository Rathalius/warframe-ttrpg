/**
 * Warframe TTRPG - Hildryn Specialized Ability Mechanics
 * Canonical implementations:
 * - Shield-Based Casting: Powers consume Shields instead of Energy
 * - Balefire: Equips Exalted Balefire Charger (plasma rocket hand-cannon)
 * - Shield Pillage: Strips Armor & Shields from all foes, cleanses status debuffs, replenishes Overshields
 * - Haven: Radiates protective energy giving allies +Shields/Recharge while zapping enemies with Radiation
 * - Aegis Storm: Hovers in anti-gravity, suspending all nearby enemies in mid-air
 */

export async function handleHildrynAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. BALEFIRE (Exalted Rocket Handgun)
  // ==========================================
  if (baseName === "balefire" || baseName === "balefire charger") {
    const existingBalefire = actor.items.find(i => i.type === "weapon" && (i.name.includes("Balefire") || i.flags?.["warframe-ttrpg"]?.isBalefire));

    if (existingBalefire) {
      await actor.deleteEmbeddedDocuments("Item", [existingBalefire.id]);
      const effects = actor.effects.filter(e => !e.disabled && e.name.includes("Balefire"));
      if (effects.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", effects.map(e => e.id));

      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Balefire Charger Holstered</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    const flatBonus = Math.max(0, Math.floor((powerStrength - 100) / 10));
    const formula = flatBonus > 0 ? `3d10 + ${flatBonus}` : "3d10";

    await actor.createEmbeddedDocuments("Item", [{
      name: "Balefire Charger (Exalted Cannon)",
      type: "weapon",
      img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/hildryn/Balefire.png",
      system: {
        type: "secondary",
        damage: formula,
        damageType: "Radiation/Electricity",
        range: "40m Rocket Blast",
        equipped: true
      },
      flags: { "warframe-ttrpg": { isBalefire: true } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-rocket animate-pulse"></i> Balefire Charger Equipped</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Heavy plasma rocket sidearm active (${formula} Rad/Elec). Fires devastating charged plasma rockets knocking foes back!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. SHIELD PILLAGE (Defense Strip & Cleanse & Overshields)
  // ==========================================
  if (baseName === "pillage" || baseName === "shield pillage") {
    // 1. Cleanse status effects from Hildryn
    const debuffs = actor.effects.filter(e => !e.disabled && e.statuses?.size > 0);
    if (debuffs.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", debuffs.map(e => e.id));

    // 2. Strip defenses from all targets
    const stripPct = Math.min(100, Math.round(25 * (powerStrength / 100)));
    let siphonedShields = 0;

    for (const token of targets) {
      if (token.actor) {
        siphonedShields += 100;
        const mult = Math.max(0, 1 - (stripPct / 100));
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Pillaged (-${stripPct}% Defenses)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/hildryn/Pillage.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          changes: [
            { key: "system.shields.value", value: mult, mode: 1, priority: 20 },
            { key: "system.armor.value", value: mult, mode: 1, priority: 20 }
          ],
          description: `Pillaged: ${stripPct}% Shields and Armor stripped by Hildryn's pulse.`,
          flags: { core: { statusId: "pillaged" } }
        }]);
      }
    }

    // 3. Restore shields & overshields to Hildryn
    const curShields = Number(actor.system.shields?.value) || 0;
    const maxShields = Number(actor.system.shields?.max) || 150;
    const restored = Math.min(maxShields * 2, curShields + Math.max(150, siphonedShields));
    await actor.update({ "system.shields.value": restored });

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(0, 210, 211, 0.08); border: 1px solid #00d2d3; border-radius: 4px;">
        <strong style="color: #00d2d3; font-family: 'Orbitron';"><i class="fas fa-shield-alt animate-pulse"></i> Shield Pillage Invoked</strong><br/>
        <span style="font-size: 11px; color: #c8f7f7;">➔ <strong>Cleanse:</strong> Purged all active status debuffs from Hildryn.<br/>
        ➔ <strong>Defense Strip:</strong> Siphoned <strong>${stripPct}% Shields & Armor</strong> from targets.<br/>
        ➔ <strong>Overshields:</strong> Restored shields to <strong>${restored} Shields</strong> (Overshield buffer)!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. HAVEN (Squad Shields & Radiation Tether)
  // ==========================================
  if (baseName === "haven") {
    const bonusShields = Math.round(200 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Haven (+${bonusShields} Shields)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/hildryn/Haven.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [{ key: "system.shields.bonus", value: bonusShields, mode: 2, priority: 20 }],
      description: `Haven: Radiates energy conduits. Allies in range gain +${bonusShields} Shields buffer; enemies are shocked with Radiation damage.`,
      flags: { core: { statusId: "haven_aura" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-satellite-dish"></i> Haven Defense Matrix Active</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Aura connects to all squad members within 15m, granting <strong>+${bonusShields} Shield buffer</strong> and continuous shield-gating while frying hostiles with Radiation beams!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. AEGIS STORM (Anti-Gravity Suspension)
  // ==========================================
  if (baseName === "aegis storm") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const liftedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Aegis Storm (Suspended in Mid-Air)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/hildryn/AegisStorm.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Aegis Storm: Suspended in mid-air by gravimetric fields. Helpless, constantly dropping energy particles.",
          flags: { core: { statusId: "aegis_storm" } }
        }]);
        liftedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(0, 210, 211, 0.1); border: 1px solid #00d2d3; border-radius: 4px;">
        <strong style="color: #00d2d3; font-family: 'Orbitron';"><i class="fas fa-meteor animate-pulse"></i> Aegis Storm Anti-Gravity Field</strong><br/>
        <span style="font-size: 11px; color: #c8f7f7;">Hildryn takes flight in anti-gravity hover!<br/>
        ${liftedNames.length > 0 ? `➔ <strong>Enemies Suspended:</strong> ${liftedNames.join(", ")} lifted helpless in mid-air for ${durationRounds} rounds!<br/>` : ""}
        ➔ <strong>Ordnance:</strong> Balefire rockets can be fired freely from above.</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
