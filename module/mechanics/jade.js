/**
 * Warframe TTRPG - Jade Specialized Ability Mechanics
 * Canonical implementations:
 * - Symphony of Mercy: Modal selection of 3 hymns (Power of the Seven, Deathbringer, Spirit of Resilience)
 * - Ophanim Eyes: Gaze that slows enemies by 50% and continuously strips armor/shields
 * - Light's Judgment: Radiant circle that heals allies and smites foes with Solar damage
 * - Glory on High: Takes flight (hover/flight stance) and equips the Exalted weapon "Glory"
 */

export async function handleJadeAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const powerDC = context.powerDC || 14;
  const abilityName = ability.name || "";
  const isRank3 = abilityName.includes("III") || abilityName.includes("IV");
  const isRank2 = abilityName.includes("II");

  // ==========================================
  // 1. SYMPHONY OF MERCY (3 Hymns Modal Selection)
  // ==========================================
  if (baseName === "symphony of mercy") {
    // Open an interactive modal dialog to choose the active hymn
    const chosenHymn = await new Promise((resolve) => {
      new Dialog({
        title: "Symphony of Mercy - Select Hymn",
        content: `
          <div style="font-family: 'Inter', sans-serif; padding: 6px; color: #e2e8f0;">
            <div style="font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: bold; color: #00e5ff; margin-bottom: 8px; text-transform: uppercase;">
              <i class="fas fa-music"></i> Choose Active Hymn for Squad
            </div>
            <p style="font-size: 11px; color: #94a3b8; margin-bottom: 10px;">
              Jade radiates angelic choirs. Select which sacred hymn empowers you and all targeted allies (5 rounds duration):
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="border: 1px solid rgba(0, 229, 255, 0.3); background: rgba(0, 229, 255, 0.06); padding: 8px; border-radius: 4px;">
                <div style="font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #00e5ff;"><i class="fas fa-bolt"></i> 1. Power of the Seven</div>
                <div style="font-size: 10.5px; color: #bae6fd; margin-top: 2px;">+25% Ability Strength to all abilities cast by squad members.</div>
              </div>
              <div style="border: 1px solid rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.06); padding: 8px; border-radius: 4px;">
                <div style="font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #f59e0b;"><i class="fas fa-crosshairs"></i> 2. Deathbringer</div>
                <div style="font-size: 10.5px; color: #fde68a; margin-top: 2px;">+100% Weapon Damage bonus to all firearm and melee attacks.</div>
              </div>
              <div style="border: 1px solid rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.06); padding: 8px; border-radius: 4px;">
                <div style="font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #10b981;"><i class="fas fa-shield-alt"></i> 3. Spirit of Resilience</div>
                <div style="font-size: 10.5px; color: #6ee7b7; margin-top: 2px;">Regenerates 10% Shields per round and grants instant Shield Gating.</div>
              </div>
            </div>
          </div>
        `,
        buttons: {
          seven: {
            icon: '<i class="fas fa-bolt"></i>',
            label: "Power of Seven",
            callback: () => resolve("seven")
          },
          death: {
            icon: '<i class="fas fa-crosshairs"></i>',
            label: "Deathbringer",
            callback: () => resolve("deathbringer")
          },
          resilience: {
            icon: '<i class="fas fa-shield-alt"></i>',
            label: "Resilience",
            callback: () => resolve("resilience")
          }
        },
        default: "seven",
        close: () => resolve("seven")
      }).render(true);
    });

    const durationRounds = Math.max(1, Math.round(5 * (powerDuration / 100)));

    // Cleanse any existing Symphony hymns from Jade and targeted allies
    const hymnNames = ["Hymn: Power of the Seven", "Hymn: Deathbringer", "Hymn: Spirit of Resilience"];
    const actorsToBuff = [actor];
    for (const token of targets) {
      if (token.actor && token.actor.uuid !== actor.uuid) {
        actorsToBuff.push(token.actor);
      }
    }

    let hymnConfig = {};
    if (chosenHymn === "seven") {
      hymnConfig = {
        name: "Hymn: Power of the Seven",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/jade/SymphonyOfMercy.png",
        color: "#00e5ff",
        label: "Power of the Seven (+25% Pwr Str)",
        desc: "Increases Ability Strength by +25%.",
        changes: [{ key: "system.powerStrength.value", value: 25, mode: 2, priority: 20 }]
      };
    } else if (chosenHymn === "deathbringer") {
      hymnConfig = {
        name: "Hymn: Deathbringer",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/jade/SymphonyOfMercy.png",
        color: "#f59e0b",
        label: "Deathbringer (+100% Weapon Dmg)",
        desc: "Increases weapon damage bonus by +100%.",
        changes: [{ key: "system.damageBonus.value", value: 100, mode: 2, priority: 20 }]
      };
    } else {
      hymnConfig = {
        name: "Hymn: Spirit of Resilience",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/jade/SymphonyOfMercy.png",
        color: "#10b981",
        label: "Spirit of Resilience (+10% Shields/rnd)",
        desc: "Regenerates 10% Shields every round and enables instant shield gate recovery.",
        changes: [{ key: "system.shields.bonus", value: 50, mode: 2, priority: 20 }]
      };
    }

    for (const buffActor of actorsToBuff) {
      const existing = buffActor.effects.filter(e => !e.disabled && hymnNames.includes(e.name));
      if (existing.length > 0) {
        await buffActor.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
      }

      await buffActor.createEmbeddedDocuments("ActiveEffect", [{
        name: hymnConfig.name,
        icon: hymnConfig.icon,
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: hymnConfig.changes,
        description: `Symphony of Mercy: ${hymnConfig.desc} (Duration: ${durationRounds} rounds).`,
        flags: {
          core: { statusId: "symphony_hymn" },
          "warframe-ttrpg": { hymn: chosenHymn }
        }
      }]);
    }

    const recipientNames = actorsToBuff.map(a => a.name).join(", ");
    ui.notifications.info(`Activated ${hymnConfig.name} on ${recipientNames}!`);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(0, 229, 255, 0.08); border: 1px solid ${hymnConfig.color}; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: ${hymnConfig.color}; text-transform: uppercase;">
          <span><i class="fas fa-music"></i> ${hymnConfig.label}</span>
          <span>${durationRounds} Rounds</span>
        </div>
        <div style="font-size: 10.5px; color: #bae6fd; margin-top: 4px; line-height: 1.35;">
          <strong>Recipients:</strong> ${recipientNames}.<br/>
          <em>${hymnConfig.desc}</em>
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. OPHANIM EYES (Gaze Slow & Armor/Shield Strip)
  // ==========================================
  if (baseName === "ophanim eyes") {
    const stripPct = isRank3 ? 50 : (isRank2 ? 40 : 25);
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const afflicted = [];

    if (targets.length === 0) {
      ui.notifications.warn("Ophanim Eyes cast without targeted enemies. Target tokens to cast judgment gaze!");
    }

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      // Remove existing gaze if present
      const existing = targetActor.effects.filter(e => !e.disabled && e.name.includes("Ophanim Gaze"));
      if (existing.length > 0) {
        await targetActor.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
      }

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Ophanim Gaze (-50% Spd, -${stripPct}% Armor)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/jade/OphanimEyes.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["ophanim_gaze"],
        changes: [
          { key: "system.speed.land.value", value: 0.5, mode: 1, priority: 20 },
          { key: "system.armor.value", value: 1 - (stripPct / 100), mode: 1, priority: 20 }
        ],
        description: `Ophanim Eyes: Bathed in the divine gaze. Movement speed halved (-50%) and armor/shields continuously dissolved by ${stripPct}%.`,
        flags: {
          core: { statusId: "ophanim_gaze" }
        }
      }]);
      afflicted.push(token.name);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #f59e0b; text-transform: uppercase;">
          <span><i class="fas fa-eye animate-pulse"></i> Ophanim Eyes Gaze Inflicted</span>
          <span>Save DC ${powerDC}</span>
        </div>
        <div style="font-size: 10.5px; color: #fde68a; margin-top: 4px; line-height: 1.35;">
          ${afflicted.length > 0
            ? `<strong>Gazed Targets:</strong> ${afflicted.join(", ")}.<br/><em>Targets suffer 50% movement slow and -${stripPct}% Armor/Shield dissolution for ${durationRounds} rounds!</em>`
            : `<em>All enemies caught in Jade's direct line of sight are slowed by 50% and have armor dissolved.</em>`
          }
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. GLORY ON HIGH (Flight & Exalted Solar Weapon)
  // ==========================================
  if (baseName === "glory on high") {
    const isFlightActive = actor.effects.some(e => !e.disabled && e.name.includes("Glory Flight"));

    if (isFlightActive) {
      // Deactivate Glory on High
      const oldEffects = actor.effects.filter(e => !e.disabled && e.name.includes("Glory Flight"));
      await actor.deleteEmbeddedDocuments("ActiveEffect", oldEffects.map(e => e.id));
      const oldWeapons = actor.items.filter(i => i.type === "weapon" && i.name.includes("Glory"));
      await actor.deleteEmbeddedDocuments("Item", oldWeapons.map(i => i.id));
      ui.notifications.info("Glory on High deactivated. Jade lands gently.");

      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(243, 156, 18, 0.08); border: 1px solid rgba(243, 156, 18, 0.3); border-radius: 4px; font-size: 10.5px; color: #f39c12;">
          <i class="fas fa-feather-alt"></i> <strong>Glory on High Deactivated:</strong> Jade descends back to ground stance.
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    // Activate Flight and equip Glory
    const flightBonus = 15;
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Glory Flight Stance",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/jade/GloryOnHigh.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      statuses: ["flying"],
      changes: [
        { key: "system.speed.fly.value", value: flightBonus, mode: 2, priority: 20 },
        { key: "system.damageBonus.value", value: 20, mode: 2, priority: 20 }
      ],
      description: "Glory on High: Airborne divine flight stance. Gains +15 ft fly speed, immune to ground environmental hazards, and wields the Exalted Solar weapon Glory.",
      flags: {
        core: { statusId: "flying" }
      }
    }]);

    // Create Exalted Weapon Glory
    const oldWeapons = actor.items.filter(i => i.type === "weapon" && i.name.includes("Glory"));
    if (oldWeapons.length > 0) {
      await actor.deleteEmbeddedDocuments("Item", oldWeapons.map(i => i.id));
    }

    const gloryDamage = isRank3 ? "6d12" : (isRank2 ? "5d12" : "4d12");
    await actor.createEmbeddedDocuments("Item", [{
      name: "Glory (Exalted Solar Cannon)",
      type: "weapon",
      img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/jade/GloryOnHigh.png",
      system: {
        type: "ranged",
        damage: gloryDamage,
        damageType: "Solar",
        range: "Ranged (60 ft)",
        equipped: true
      },
      flags: {
        "warframe-ttrpg": { isExalted: true }
      }
    }]);

    ui.notifications.info("Glory on High activated! Flight stance engaged & Glory equipped.");

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.08); border: 1px solid rgba(243, 156, 18, 0.4); border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #f39c12; text-transform: uppercase;">
          <span><i class="fas fa-feather-alt animate-pulse"></i> Glory on High Manifested</span>
          <span>Flight Stance Active</span>
        </div>
        <div style="font-size: 10.5px; color: #fde68a; margin-top: 4px; line-height: 1.35;">
          Jade takes to the air with divine wings.<br/>
          ➔ <strong>Exalted Weapon Equipped:</strong> Glory (${gloryDamage} Solar Damage, 60 ft range).<br/>
          ➔ <strong>Mobility:</strong> Hover & Flying (+15 ft Speed, immunity to ground effects).
        </div>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard damage roll on cast
  }

  // ==========================================
  // 4. LIGHT'S JUDGMENT (Divine Light Pool)
  // ==========================================
  if (baseName === "light's judgment") {
    // Heal allies in targets, damage enemies
    const healed = [];
    const smited = [];
    const healVal = Math.round(15 * (powerStrength / 100));

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      if (token.disposition >= 0) {
        // Ally
        const currentHP = Number(targetActor.system.health?.value) || 0;
        const maxHP = Number(targetActor.system.health?.max) || 100;
        const newHP = Math.min(maxHP, currentHP + healVal);
        await targetActor.update({ "system.health.value": newHP });
        healed.push(`${token.name} (+${healVal} HP)`);
      } else {
        // Enemy
        smited.push(token.name);
      }
    }

    let cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(243, 156, 18, 0.08); border: 1px solid rgba(243, 156, 18, 0.3); border-radius: 4px; font-size: 10.5px; color: #fde68a;">
        <i class="fas fa-sun"></i> <strong>Light's Judgment Field:</strong>
        ${healed.length > 0 ? `<br/>➔ <strong>Blessed Allies:</strong> ${healed.join(", ")}` : ""}
        ${smited.length > 0 ? `<br/>➔ <strong>Smited Foes:</strong> ${smited.join(", ")}` : ""}
      </div>
    `;

    return { handled: false, cardExtraHTML };
  }

  return { handled: false };
}
