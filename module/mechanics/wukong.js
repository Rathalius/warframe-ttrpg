/**
 * Warframe TTRPG - Wukong Specialized Ability Mechanics
 * Canonical implementations:
 * - Celestial Twin: Spawns immortal clone fighting with opposite weapon
 * - Cloud Walker: Misty flight, cleanses all status ailments, fully heals HP
 * - Defy: Invulnerable parry, counter-spin attack, grants up to +1500 Armor
 * - Primal Fury: Equips Exalted Iron Staff (sweeping radial melee strikes)
 */

export async function handleWukongAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. CELESTIAL TWIN (Immortal Clone)
  // ==========================================
  if (baseName === "celestial twin") {
    const existingTwin = actor.effects.find(e => !e.disabled && e.name.includes("Celestial Twin"));

    if (existingTwin) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [existingTwin.id]);
      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Celestial Twin Recalled</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Celestial Twin Active",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wukong/CelestialTwin.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      description: "Celestial Twin: Autonomous clone fights alongside Wukong with 2x Health, wielding opposite weapon.",
      flags: { core: { statusId: "celestial_twin" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-user-friends animate-pulse"></i> Celestial Twin Materialized</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Wukong sheds a lock of hair, spawning his autonomous immortal Twin!<br/>
        ➔ <strong>Tactical Harmony:</strong> When Wukong uses Melee, Twin fires Primary/Secondary weapon. When Wukong fires guns, Twin slashes with Melee weapon.<br/>
        ➔ <strong>Durability:</strong> Possesses 2x Wukong's Max HP!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. CLOUD WALKER (Misty Flight & Complete Heal)
  // ==========================================
  if (baseName === "cloud walker") {
    // 1. Cleanse all debuffs
    const debuffs = actor.effects.filter(e => !e.disabled && e.statuses?.size > 0);
    if (debuffs.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", debuffs.map(e => e.id));

    // 2. Fully heal HP
    const maxHP = Number(actor.system.health?.max) || 100;
    await actor.update({ "system.health.value": maxHP });

    // 3. Grant flight & invisibility
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Cloud Walker (Misty Flight & Stealth)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wukong/CloudWalker.png",
      origin: actor.uuid,
      duration: { rounds: 1 },
      statuses: ["flying", "invisible"],
      changes: [{ key: "system.speed.land.value", value: 50, mode: 2, priority: 20 }],
      description: "Cloud Walker: Transformed into vapor. Invisible, flying with +50 ft speed, stunned enemies passed through.",
      flags: { core: { statusId: "cloud_walker" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-cloud animate-pulse"></i> Cloud Walker Soaring</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">➔ <strong>Full Health Restoration:</strong> Restored to <strong>${maxHP} HP (100% Health)</strong>!<br/>
        ➔ <strong>Purification:</strong> Cleansed of all negative status ailments.<br/>
        ➔ <strong>Misty Flight:</strong> Flying at supersonic speed (+50ft) and invisible to security sensors!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. DEFY (Invulnerable Parry & Armor Surge)
  // ==========================================
  if (baseName === "defy") {
    const bonusArmor = Math.min(1500, Math.round(750 * (powerStrength / 100)));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Defy Bastion (+${bonusArmor} Armor)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wukong/Defy.png",
      origin: actor.uuid,
      duration: { rounds: 4 },
      changes: [{ key: "system.armor.value", value: bonusArmor, mode: 2, priority: 20 }],
      description: `Defy Bastion: Absorbed incoming damage. Grants +${bonusArmor} Armor and knockdown immunity.`,
      flags: { core: { statusId: "defy_armor" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-shield-alt animate-pulse"></i> Defy Counter-Spin Executed</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Wukong spins invulnerable, deflecting all harm and sweeping 360° with a devastating staff strike!<br/>
        ➔ <strong>Hardened Defenses:</strong> Surged with <strong>+${bonusArmor} bonus Armor</strong> for 4 rounds!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 3d10 damage roll
  }

  // ==========================================
  // 4. PRIMAL FURY (Exalted Iron Staff)
  // ==========================================
  if (baseName === "primal fury") {
    const existingStaff = actor.items.find(i => i.type === "weapon" && (i.name.includes("Iron Staff") || i.flags?.["warframe-ttrpg"]?.isIronStaff));

    if (existingStaff) {
      await actor.deleteEmbeddedDocuments("Item", [existingStaff.id]);
      const effects = actor.effects.filter(e => !e.disabled && e.name.includes("Iron Staff"));
      if (effects.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", effects.map(e => e.id));

      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Iron Staff Stowed</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    const flatBonus = Math.max(0, Math.floor((powerStrength - 100) / 10));
    const formula = flatBonus > 0 ? `4d10 + ${flatBonus}` : "4d10";

    await actor.createEmbeddedDocuments("Item", [{
      name: "Iron Staff (Exalted Staff)",
      type: "weapon",
      img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wukong/PrimalFury.png",
      system: {
        type: "melee",
        damage: formula,
        damageType: "Impact",
        range: "Melee / 8m Sweep",
        equipped: true
      },
      flags: { "warframe-ttrpg": { isIronStaff: true } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-staff animate-pulse"></i> Primal Fury: Iron Staff Summoned</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Legendary size-shifting <strong>Iron Staff</strong> equipped (${formula} Impact). Sweeps wide 8m arcs, ragdolling and shattering enemies with overwhelming concussive force!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
