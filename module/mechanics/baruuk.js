/**
 * Warframe TTRPG - Baruuk Specialized Ability Mechanics
 * Canonical implementations:
 * - Restraint Gauge: Starts at 100% (Restrained). Erodes toward 0% as Baruuk avoids conflict
 * - Elude: Enters complete evasion stance, dodging incoming projectiles while not attacking, eroding Restraint
 * - Lull: Calming aura putting targeted foes into Sleep, wiping alert state, eroding Restraint by -5% per target
 * - Desolate Hands: Summons orbiting daggers granting up to 90% Damage Reduction and flying to disarm foes
 * - Serene Storm: Unleashes Exalted Desert Wind fists; equips Desert Wind weapon sending concussive shockwaves
 */

export async function handleBaruukAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const currentRestraint = Number(actor.system.restraint?.value ?? 100);
  const maxRestraint = Number(actor.system.restraint?.max || 100);
  const abilityName = ability.name || "";

  async function erodeRestraint(amount, reason = "") {
    const updated = Math.max(0, Math.min(maxRestraint, currentRestraint - amount));
    await actor.update({ "system.restraint.value": updated });
    return updated;
  }

  // ==========================================
  // 1. ELUDE (Projectile Evasion)
  // ==========================================
  if (baseName === "elude") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const newRestraint = await erodeRestraint(10, "Elude activation");

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Elude (100% Projectile Evasion)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/baruuk/Elude.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: "Elude: In a 180° frontal arc, completely evades and phases through all incoming ranged projectiles while not attacking. Each dodged attack erodes Restraint by 2%.",
      flags: { core: { statusId: "elude_evasion" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(253, 203, 110, 0.08); border: 1px solid #fdcb6e; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ffeaa7; text-transform: uppercase;">
          <span><i class="fas fa-wind animate-pulse"></i> Elude Pacifist Stance</span>
          <span>Restraint: ${newRestraint}%</span>
        </div>
        <div style="font-size: 10.5px; color: #ffeaa7; margin-top: 4px; line-height: 1.35;">
          Baruuk slips into meditative pacifism for ${durationRounds} rounds.<br/>
          ➔ <strong>Projectile Evasion:</strong> Automatically phases through all incoming ranged bullets/projectiles while not attacking.<br/>
          ➔ <strong>Restraint Eroded:</strong> Restraint reduced to <strong>${newRestraint}%</strong> (Unlocks Serene Storm when lowered)!
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. LULL (Calming Sleep Wave)
  // ==========================================
  if (baseName === "lull") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const targetCount = Math.max(1, targets.length);
    const erosion = targetCount * 5;
    const newRestraint = await erodeRestraint(erosion, "Lull sleep");

    const asleepList = [];
    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Lull (Deep Slumber)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/baruuk/Lull.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["asleep"],
        description: "Lull: Soothed into peaceful slumber. Slowed until falling unconscious; wakes if damaged.",
        flags: { core: { statusId: "asleep" } }
      }]);
      asleepList.push(token.name);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(225, 112, 85, 0.08); border: 1px solid #e17055; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #fab1a0; text-transform: uppercase;">
          <span><i class="fas fa-moon animate-pulse"></i> Lull Calming Wave</span>
          <span>-${erosion}% Restraint (${newRestraint}%)</span>
        </div>
        <div style="font-size: 10.5px; color: #ffeaa7; margin-top: 4px; line-height: 1.35;">
          A wave of tranquility blankets the battlefield.<br/>
          ➔ <strong>Restraint Erosion:</strong> -${erosion}% Restraint (Current: ${newRestraint}%).<br/>
          ${asleepList.length > 0 ? `➔ <strong>Put to Sleep:</strong> ${asleepList.join(", ")} for ${durationRounds} rounds.<br/>` : ""}
          <em>Enemies lose all alert status and fall into deep slumber.</em>
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. DESOLATE HANDS (Orbiting Daggers & Disarm)
  // ==========================================
  if (baseName === "desolate hands") {
    const daggerCount = Math.round(8 * (powerStrength / 100));
    // Up to 90% DR based on dagger count (10% per dagger up to 90%)
    const drPct = Math.min(90, daggerCount * 10);
    const newRestraint = await erodeRestraint(5, "Desolate Hands");

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Desolate Hands (${daggerCount} Daggers - ${drPct}% DR)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/baruuk/DesolateHands.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      description: `Desolate Hands: Orbiting daggers provide ${drPct}% Damage Reduction. Daggers seek nearby armed enemies to destroy their weapons and erode Restraint.`,
      flags: { core: { statusId: "desolate_hands" } }
    }]);

    // Disarm targeted enemies if any
    const disarmedNames = [];
    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Desolate Hands (Disarmed)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/baruuk/DesolateHands.png",
          origin: actor.uuid,
          duration: { rounds: 3 },
          description: "Disarmed: Weapon detonated by Baruuk's orbiting daggers! Forced into unarmed combat.",
          flags: { core: { statusId: "disarmed" } }
        }]);
        disarmedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(253, 203, 110, 0.08); border: 1px solid #fdcb6e; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ffeaa7; text-transform: uppercase;">
          <span><i class="fas fa-khanda"></i> Desolate Hands Summoned</span>
          <span>${daggerCount} Daggers (${drPct}% DR)</span>
        </div>
        <div style="font-size: 10.5px; color: #ffeaa7; margin-top: 4px; line-height: 1.35;">
          ${daggerCount} spirit daggers orbit Baruuk.<br/>
          ➔ <strong>Defensive Ward:</strong> Grants <strong>${drPct}% Damage Reduction</strong>.<br/>
          ${disarmedNames.length > 0 ? `➔ <strong>Enemies Disarmed:</strong> ${disarmedNames.join(", ")}.<br/>` : ""}
          ➔ <strong>Restraint:</strong> Reduced to ${newRestraint}%.
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. SERENE STORM (Exalted Desert Wind)
  // ==========================================
  if (baseName === "serene storm") {
    if (currentRestraint >= 95) {
      ui.notifications.warn("Baruuk's Restraint is too high! Erode Restraint using Elude, Lull, or Desolate Hands before unleashing Serene Storm.");
      return {
        handled: true,
        cardExtraHTML: `<div style="color: #ff2a5f; padding: 6px; font-family: 'Orbitron', sans-serif;"><i class="fas fa-times-circle"></i> FAILED: Restraint too high (${currentRestraint}%). Must erode Restraint below 95% first.</div>`
      };
    }

    // Toggle logic: Check if Desert Wind weapon is currently equipped
    const existingDesertWind = actor.items.find(i => i.type === "weapon" && (i.name.includes("Desert Wind") || i.flags?.["warframe-ttrpg"]?.isDesertWind));

    if (existingDesertWind) {
      // Deactivate Serene Storm
      await actor.deleteEmbeddedDocuments("Item", [existingDesertWind.id]);
      const stormEffects = actor.effects.filter(e => !e.disabled && e.name.includes("Serene Storm"));
      if (stormEffects.length > 0) {
        await actor.deleteEmbeddedDocuments("ActiveEffect", stormEffects.map(e => e.id));
      }

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(253, 203, 110, 0.1); border: 1px solid #fdcb6e; border-radius: 4px;">
          <strong style="color: #ffeaa7; font-family: 'Orbitron';"><i class="fas fa-hand-paper"></i> Serene Storm Deactivated</strong><br/>
          <span style="font-size: 11px; color: #ffeaa7;">Baruuk returns to tranquil composure. Desert Wind stowed.</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    // Activate Serene Storm & Equip Desert Wind
    const bonusFlat = Math.max(0, Math.floor((powerStrength - 100) / 10));
    const damageFormula = bonusFlat > 0 ? `4d10 + ${bonusFlat}` : "4d10";

    await actor.createEmbeddedDocuments("Item", [{
      name: "Desert Wind (Exalted Fists)",
      type: "weapon",
      img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/baruuk/SereneStorm.png",
      system: {
        type: "melee",
        damage: damageFormula,
        damageType: "Impact",
        range: "Melee / 15m Wind Waves",
        equipped: true
      },
      flags: {
        "warframe-ttrpg": { isDesertWind: true }
      }
    }]);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Serene Storm Active (Desert Wind)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/baruuk/SereneStorm.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [
        { key: "system.damageBonus.value", value: 40, mode: 2, priority: 20 }
      ],
      description: `Serene Storm Active: Equips Desert Wind exalted fists (${damageFormula} Impact). Punches launch concussive shockwaves piercing walls and ragdolling foes. Slowly restores Restraint while active.`,
      flags: { core: { statusId: "serene_storm" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(253, 203, 110, 0.1); border: 1px solid #fdcb6e; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ffeaa7; text-transform: uppercase;">
          <span><i class="fas fa-fist-raised animate-pulse"></i> Serene Storm Unleashed</span>
          <span>Desert Wind Equipped</span>
        </div>
        <div style="font-size: 10.5px; color: #ffeaa7; margin-top: 4px; line-height: 1.35;">
          Baruuk releases his suppressed fury!<br/>
          ➔ <strong>Exalted Weapon:</strong> <strong>Desert Wind</strong> equipped (${damageFormula} Impact damage).<br/>
          ➔ <strong>Concussive Shockwaves:</strong> Punches send radial wind waves flying up to 15m, piercing terrain and sending enemies tumbling ragdoll-style!
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
