/**
 * Warframe TTRPG - Mesa Specialized Ability Mechanics
 * Canonical implementations:
 * - Ballistic Battery: Stores gun damage dealt, expelling it as high flat bonus on next shot
 * - Shooting Gallery: Gun damage buff (+25%) while jamming enemy firearms
 * - Shatter Shield: 95% Damage Reduction vs ranged attacks + bullet reflection
 * - Peacemaker: Gunslinger turret stance, draws Exalted Regulators dual pistols (auto-aim rapid fire)
 */

export async function handleMesaAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. BALLISTIC BATTERY
  // ==========================================
  if (baseName === "ballistic battery") {
    const bonusDmg = Math.round(50 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Ballistic Battery (+${bonusDmg} Damage)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mesa/BallisticBattery.png",
      origin: actor.uuid,
      duration: { rounds: 1 },
      changes: [{ key: "system.damageBonus.value", value: bonusDmg, mode: 2, priority: 20 }],
      description: `Ballistic Battery: Stored kinetic energy primed. Adds +${bonusDmg} flat damage to the next firearm shot!`,
      flags: { core: { statusId: "ballistic_battery" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.08); border: 1px solid #f39c12; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-crosshairs animate-pulse"></i> Ballistic Battery Primed</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Kinetic energy channeled into weapon barrel. Next gun attack deals <strong>+${bonusDmg} flat damage</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. SHOOTING GALLERY (Damage Buff & Gun Jam)
  // ==========================================
  if (baseName === "shooting gallery") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const bonusDmg = Math.round(25 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Shooting Gallery (+${bonusDmg}% Gun Dmg)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mesa/ShootingGallery.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [{ key: "system.damageBonus.value", value: bonusDmg, mode: 2, priority: 20 }],
      description: `Shooting Gallery: Energy lasso orbits Mesa. Grants +${bonusDmg}% firearm damage and periodically jams enemy weapons in radius.`,
      flags: { core: { statusId: "shooting_gallery" } }
    }]);

    const jammedNames = [];
    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Shooting Gallery (Guns Jammed)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mesa/ShootingGallery.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          description: "Guns Jammed: Energy lasso tangled firearms. Cannot fire ranged weapons this turn.",
          flags: { core: { statusId: "gun_jammed" } }
        }]);
        jammedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-lasso animate-pulse"></i> Shooting Gallery Active</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Lasso of energy deployed for ${durationRounds} rounds.<br/>
        ➔ <strong>Gun Damage Boost:</strong> +${bonusDmg}% firearm damage.<br/>
        ${jammedNames.length > 0 ? `➔ <strong>Weapons Jammed:</strong> ${jammedNames.join(", ")} firearms disabled for 1 round!` : "➔ Ensnaring nearby hostiles' trigger mechanisms."}</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. SHATTER SHIELD (95% DR & Bullet Reflection)
  // ==========================================
  if (baseName === "shatter shield") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const drPct = Math.min(95, Math.round(80 * (powerStrength / 100)));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Shatter Shield (${drPct}% DR & Ricochet)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mesa/ShatterShield.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `Shatter Shield: Crystalline energy barrier provides ${drPct}% Damage Reduction against all ranged attacks and ricochets bullets back into enemies with stagger!`,
      flags: { core: { statusId: "shatter_shield" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-shield-alt animate-pulse"></i> Shatter Shield Deployed</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Crystalline barrier active for ${durationRounds} rounds.<br/>
        ➔ <strong>Ranged Defense:</strong> <strong>${drPct}% Damage Reduction</strong> against all incoming bullets, rockets, and beams.<br/>
        ➔ <strong>Ricochet:</strong> Deflects absorbed projectiles directly back at attackers with Impact stagger!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. PEACEMAKER (Exalted Regulators Pistols)
  // ==========================================
  if (baseName === "peacemaker") {
    const existingRegulators = actor.items.find(i => i.type === "weapon" && (i.name.includes("Regulators") || i.flags?.["warframe-ttrpg"]?.isRegulators));

    if (existingRegulators) {
      await actor.deleteEmbeddedDocuments("Item", [existingRegulators.id]);
      const effects = actor.effects.filter(e => !e.disabled && e.name.includes("Peacemaker"));
      if (effects.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", effects.map(e => e.id));

      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Peacemaker Deactivated: Regulators Holstered</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    const flatBonus = Math.max(0, Math.floor((powerStrength - 100) / 10));
    const formula = flatBonus > 0 ? `4d10 + ${flatBonus}` : "4d10";

    await actor.createEmbeddedDocuments("Item", [{
      name: "Regulators (Exalted Dual Pistols)",
      type: "weapon",
      img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mesa/Peacemaker.png",
      system: {
        type: "secondary",
        damage: formula,
        damageType: "Physical",
        range: "50m Gunslinger Field",
        equipped: true
      },
      flags: { "warframe-ttrpg": { isRegulators: true } }
    }]);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Peacemaker Focus Stance",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mesa/Peacemaker.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [
        { key: "system.speed.land.value", value: -100, mode: 1, priority: 20 }
      ],
      description: `Peacemaker: Anchored in gunfighter stance. Fires Regulators (${formula}) with auto-aim focus field, doubling fire rate each consecutive round.`,
      flags: { core: { statusId: "peacemaker_stance" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.1); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-crosshairs animate-pulse"></i> Peacemaker Gunfighter Stance Engaged</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">➔ <strong>Exalted Weapon:</strong> <strong>Regulators</strong> equipped (${formula} damage).<br/>
        ➔ <strong>Auto-Aim Target Grid:</strong> Automatically locks on and sweeps all visible targets in field of view with blazing rapid-fire salvos!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
