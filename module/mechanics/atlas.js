/**
 * Warframe TTRPG - Atlas Specialized Ability Mechanics
 * Canonical implementations:
 * - Rubble: Killing petrified foes grants Rubble (heals HP or adds up to +1500 Armor!)
 * - Landslide: 1-2-3 rock punch combo with dash and invulnerability
 * - Tectonics: Erects stone bulwark, recast launches rolling boulder
 * - Petrify: Turns enemies into solid stone (vulnerable to bonus damage, drops Rubble)
 * - Rumblers: Summons 2 rock brawler golems fighting alongside Atlas
 */

export async function handleAtlasAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const currentRubble = Number(actor.system.rubble?.value) || 0;
  const maxRubble = Number(actor.system.rubble?.max) || 1500;
  const abilityName = ability.name || "";

  async function adjustRubble(amount) {
    const updated = Math.min(maxRubble, Math.max(0, currentRubble + amount));
    await actor.update({ "system.rubble.value": updated });

    if (updated > 0) {
      const oldRubbleBuff = actor.effects.find(e => !e.disabled && e.flags?.["warframe-ttrpg"]?.isRubbleArmor);
      if (oldRubbleBuff) await actor.deleteEmbeddedDocuments("ActiveEffect", [oldRubbleBuff.id]);

      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Rubble Plating (+${updated} Armor)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/atlas/Petrify.png",
        origin: actor.uuid,
        duration: { rounds: 99 },
        changes: [{ key: "system.armor.value", value: updated, mode: 2, priority: 20 }],
        description: `Rubble Plating: Hardened stone fragments coat Atlas's chassis, providing +${updated} Armor and total knockdown immunity.`,
        flags: { core: { statusId: "rubble_plating" }, "warframe-ttrpg": { isRubbleArmor: true } }
      }]);
    }
    return updated;
  }

  // ==========================================
  // 1. LANDSLIDE (Brawler Dash Combo)
  // ==========================================
  if (baseName === "landslide") {
    const newRubble = await adjustRubble(50);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.08); border: 1px solid #f39c12; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-fist-raised animate-pulse"></i> Landslide Kinetic Brawler Strike</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Atlas rockets forward with hardened rock fist! Completely invulnerable during dash.<br/>
        ➔ <strong>Rubble Plating:</strong> +50 Rubble gathered (Current: <strong>${newRubble}/1500 Armor</strong>).<br/>
        ➔ Striking petrified targets deals <strong>DOUBLE DAMAGE</strong> and drops extra Rubble!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d10 Impact damage roll
  }

  // ==========================================
  // 2. TECTONICS (Stone Bulwark & Rolling Boulder)
  // ==========================================
  if (baseName === "tectonics") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-shield-alt animate-pulse"></i> Tectonics Stone Bulwark</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Impenetrable stone barricade erected blocking enemy bullets and movement.<br/>
        ➔ <strong>Avalanche Recast:</strong> Recast to collapse the wall into a rolling boulder that crushes all enemies in its path for <strong>3d10 Impact damage</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. PETRIFY (Fossilization Cone & Rubble Generation)
  // ==========================================
  if (baseName === "petrify") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const petrifiedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Petrified (Turned to Solid Stone)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/atlas/Petrify.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          changes: [{ key: "system.speed.land.value", value: -100, mode: 2, priority: 20 }],
          description: "Petrified: Turned into solid, brittle stone. Completely paralyzed, takes +50% bonus damage from all attacks, and drops Rubble upon death.",
          flags: { core: { statusId: "petrified" } }
        }]);
        petrifiedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid #8e44ad; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-gem animate-pulse"></i> Petrify Fossilization Gaze</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">${petrifiedNames.length > 0 ? `➔ <strong>Fossilized in Stone:</strong> ${petrifiedNames.join(", ")} for ${durationRounds} rounds!<br/>➔ <strong>Brittle Targets:</strong> Petrified foes take <strong>+50% bonus damage</strong> and drop healing/armor <strong>Rubble</strong> when shattered!` : "Fossilization beam sweeps the field, turning enemies to brittle stone."}</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. RUMBLERS (Elemental Rock Golems)
  // ==========================================
  if (baseName === "rumblers") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.1); border: 1px solid #f39c12; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-cubes animate-pulse"></i> Rumblers Rock Golems Summoned</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Atlas summons 2 massive elemental brawler golems for ${durationRounds} rounds!<br/>
        ➔ <strong>Brawler Golems:</strong> Pummel enemies with heavy rock slams, taunting foes and drawing enemy fire.<br/>
        ➔ <strong>Rubble Core:</strong> When rumblers expire or are destroyed, they erupt into a mountain of Rubble pickups!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
