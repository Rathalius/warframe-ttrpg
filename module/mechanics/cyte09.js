/**
 * Warframe TTRPG - Cyte-09 Mechanics Module
 * Canonical implementation of Cyte-09 abilities (The 1999 Tactical Recon Sniper)
 */

export async function handleCyte09Ability(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Evade
  if (baseName === "evade") {
    const durationRounds = Math.max(1, Math.round(2 * durMult));

    // Cleanse negative status effects
    const bad = actor.effects.filter(e => e.statuses && e.statuses.size > 0 && !e.name.toLowerCase().includes("evade"));
    if (bad.length > 0) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", bad.map(e => e.id));
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Evade (Tactical Roll / +50% Evasion)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Cyte-09/Evade.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.evasion.bonus", value: 50, mode: 2, priority: 25 },
        { key: "system.speed.land.value", value: 15, mode: 2, priority: 20 }
      ],
      description: "Tactical Evasive Dive: Purged of all status ailments! +50% Dodge Evasion and +15ft movement speed.",
      flags: { core: { statusId: "cyte_evade" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(55, 71, 79, 0.08); border: 1px solid #455a64; border-radius: 4px; font-size: 10.5px; color: #cfd8dc;">
        <i class="fas fa-running"></i> <strong>Tactical Evade Executed:</strong> Status effects cleansed! Gained <strong>+50% Dodge Evasion</strong> and +15ft Speed for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Resupply
  if (baseName === "resupply") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));
    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: "Resupply (Full Ammo & Armor-Piercing)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Cyte-09/Resupply.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.damageBonus.value", value: 30, mode: 2, priority: 20 }
        ],
        description: "Tactical Resupply Cache: All weapon magazines and ammo pools restored to 100%! Rounds gain armor-piercing punch-through and +30% damage.",
        flags: { core: { statusId: "cyte_resupply" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(38, 50, 56, 0.08); border: 1px solid #37474f; border-radius: 4px; font-size: 10.5px; color: #eceff1;">
        <i class="fas fa-boxes"></i> <strong>Resupply Cache Deployed:</strong> Ammo fully restocked for squad (${squad.map(a => a.name).join(", ")})! Granted <strong>+30% Armor-Piercing Damage</strong> for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Seek
  if (baseName === "seek") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Seek (Thermal Scanned / Vulnerable)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Cyte-09/Seek.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.damageTakenBonus", value: 50, mode: 2, priority: 20 }
          ],
          description: "Targeted by Cyte-09 Recon Scanner: Revealed through walls and solid cover. Critical weak spots illuminated, taking +50% increased damage!",
          flags: { core: { statusId: "cyte_seek_scan" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(69, 90, 100, 0.08); border: 1px solid #546e7a; border-radius: 4px; font-size: 10.5px; color: #b0bec5;">
        <i class="fas fa-crosshairs"></i> <strong>Seek Recon Sweep:</strong> Thermal scanner illuminates ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "targets"} through walls! Weak spots highlighted for <strong>+50% Damage Vulnerability</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Neutralize
  if (baseName === "neutralize") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Neutralize (Pierced & Staggered)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Cyte-09/Neutralize.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Struck by anti-materiel sniper round: Pierces cover and terrain, staggering and knocking target flat.",
          flags: { core: { statusId: "cyte_neutralize" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(96, 125, 139, 0.08); border: 1px solid #78909c; border-radius: 4px; font-size: 10.5px; color: #eceff1;">
        <i class="fas fa-bullseye"></i> <strong>Neutralize Sniper Round Fired:</strong> High-caliber anti-materiel round pierces cover and barriers with <strong>Guaranteed Red Critical Damage</strong>, knocking target prone!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
