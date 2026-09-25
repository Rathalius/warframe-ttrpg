/**
 * Warframe TTRPG - Nezha Mechanics Module
 * Canonical implementation of Nezha abilities
 */

export async function handleNezhaAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Fire Walker
  if (baseName === "fire walker") {
    const speedBoost = Math.round(25 * strMult);
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    // Cleanse status effects from Nezha
    const badEffects = actor.effects.filter(e => e.statuses && e.statuses.size > 0 && !e.name.toLowerCase().includes("fire walker"));
    if (badEffects.length > 0) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", badEffects.map(e => e.id));
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Fire Walker (+${speedBoost} ft Speed)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nezha/FireWalker.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.speed.land.value", value: speedBoost, mode: 2, priority: 20 }
      ],
      description: `Fire Walker Active: Leaves a blazing trail of fire that scorches enemies with Heat damage and cleanses status effects from passing allies. Nezha movement speed increased by +${speedBoost} ft.`,
      flags: { core: { statusId: "fire_walker" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(230, 81, 0, 0.08); border: 1px solid #e65100; border-radius: 4px; font-size: 10.5px; color: #ffcc80;">
        <i class="fas fa-fire-alt"></i> <strong>Fire Walker Blazing:</strong> All status effects purged! Movement speed increased by <strong>+${speedBoost} ft</strong> for ${durationRounds} rounds. Leaves behind a trail of purifying holy flame!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Blazing Chakram
  if (baseName === "blazing chakram") {
    const vulPercent = Math.round(100 * strMult);
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Blazing Chakram Mark (+${vulPercent}% Damage Taken)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nezha/BlazingChakram.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.damageTakenBonus", value: vulPercent, mode: 2, priority: 20 }
          ],
          description: `Marked by Blazing Chakram: Takes +${vulPercent}% increased damage from all sources. On death, drops guaranteed Health and Energy Orbs!`,
          flags: { core: { statusId: "blazing_chakram_mark" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(245, 124, 0, 0.08); border: 1px solid #f57c00; border-radius: 4px; font-size: 10.5px; color: #ffe0b2;">
        <i class="fas fa-ring"></i> <strong>Blazing Chakram Hurled:</strong> Marked ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "targets"} with <strong>+${vulPercent}% Damage Vulnerability</strong>! Marked targets drop Health/Energy orbs when defeated. Recast to instantly teleport to the ring!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Warding Halo
  if (baseName === "warding halo") {
    const armorVal = Number(actor.system.armor?.value) || 100;
    const haloHealth = Math.round((250 + (2.5 * armorVal)) * strMult);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Warding Halo (${haloHealth} Buffer / 90% DR)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nezha/WardingHalo.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [
        { key: "system.damageReduction", value: 90, mode: 2, priority: 20 }
      ],
      description: `Warding Halo Active: A fiery ring absorbs 90% of incoming damage up to ${haloHealth} hit points. Grants total immunity to all status ailments and knockdowns. Enemies entering melee range suffer Heat damage and stagger.`,
      flags: { core: { statusId: "warding_halo" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(255, 152, 0, 0.08); border: 1px solid #ff9800; border-radius: 4px; font-size: 10.5px; color: #ffe0b2;">
        <i class="fas fa-sun"></i> <strong>Warding Halo Deployed:</strong> Blazing ring forged with <strong>${haloHealth} Buffer HP</strong>! Absorbs <strong>90% of incoming damage</strong>, grants complete status immunity, and scorches melee attackers!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Divine Spears
  if (baseName === "divine spears") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Divine Spears (Impaled)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nezha/DivineSpears.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Impaled on a sacred spear protruding from the ground! Helpless, unable to move or act.",
          flags: { core: { statusId: "divine_spears_impale" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(255, 193, 7, 0.08); border: 1px solid #ffc107; border-radius: 4px; font-size: 10.5px; color: #fff8e1;">
        <i class="fas fa-arrow-up"></i> <strong>Divine Spears Erupted:</strong> Sacred spears thrust through the earth, impaling and immobilizing ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "foes"} for ${durationRounds} rounds! Recast slams them violently into the ground!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
