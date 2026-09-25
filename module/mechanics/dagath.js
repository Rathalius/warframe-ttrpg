/**
 * Warframe TTRPG - Dagath Specialized Ability Mechanics
 * Canonical implementations:
 * - Wyrd Scythes: Spinning spectral scythes inflicting slow and Viral procs
 * - Doom: Marks enemies with phantom scythe curse (echoes extra true damage on hit)
 * - Grave Spirit: +100% Crit Dmg, prevents death by turning into invulnerable phantom
 * - Rakhali's Cavalry: 5 phantom Kaithe horses stampede, stripping 100% Armor & Shields
 */

export async function handleDagathAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. WYRD SCYTHES (Spectral Scythe Vortex)
  // ==========================================
  if (baseName === "wyrd scythes") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Wyrd Scythes (Slowed & Viral)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/dagath/WyrdScythes.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["viral_proc"],
          changes: [{ key: "system.speed.land.value", value: -50, mode: 1, priority: 20 }],
          description: "Wyrd Scythes: Slit by spectral scythes. Speed reduced by 50%, suffering Viral procs.",
          flags: { core: { statusId: "viral_proc" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid #8e44ad; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-sickle animate-pulse"></i> Wyrd Scythes Flung</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Spectral scythes orbit and slice through hostiles!<br/>
        ➔ <strong>Speed Debuff:</strong> Enemies slowed by <strong>50%</strong> for ${durationRounds} rounds.<br/>
        ➔ <strong>Viral Infliction:</strong> Afflicts all caught foes with Viral procs!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 2d8 Viral damage roll
  }

  // ==========================================
  // 2. DOOM (Phantom Void Strike Mark)
  // ==========================================
  if (baseName === "doom") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const doomedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Doom (Phantom Scythe Mark)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/dagath/Doom.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          description: "Doom: Cursed by phantom scythe. Whenever damaged, a ghostly blade strikes from the void dealing 50% extra true damage!",
          flags: { core: { statusId: "doom_curse" } }
        }]);
        doomedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-skull animate-pulse"></i> Doom Phantom Curse Laid</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">${doomedNames.length > 0 ? `➔ <strong>Doomed Hostiles:</strong> ${doomedNames.join(", ")} for ${durationRounds} rounds.<br/>` : ""}
        ➔ <strong>Phantom Echo:</strong> Whenever doomed enemies take damage, spectral scythes strike them from the void for <strong>50% bonus true damage</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. GRAVE SPIRIT (Crit Buff & Death Ward)
  // ==========================================
  if (baseName === "grave spirit") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const critBonus = Math.round(100 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Grave Spirit (+${critBonus}% Crit Dmg & Undying)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/dagath/GraveSpirit.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `Grave Spirit: +${critBonus}% Critical Damage. If Dagath suffers lethal damage, transforms into an invulnerable phantom for 20 seconds, completely preventing death!`,
      flags: { core: { statusId: "grave_spirit" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-ghost animate-pulse"></i> Grave Spirit Risen</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;">Spectral resolve manifests for ${durationRounds} rounds!<br/>
        ➔ <strong>Lethal Precision:</strong> <strong>+${critBonus}% Critical Damage</strong> on all weapons.<br/>
        ➔ <strong>Death Defiance:</strong> Taking lethal damage triggers spectral phantom form with <strong>total invulnerability</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. RAKHALI'S CAVALRY (Phantom Kaithe Stampede)
  // ==========================================
  if (baseName === "rakhali's cavalry" || baseName === "rakhali cavalry") {
    const strippedNames = [];
    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Kaithe Trampled (100% Defense Stripped)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/dagath/Rakhali'sCavalry.png",
          origin: actor.uuid,
          duration: { rounds: 3 },
          statuses: ["prone"],
          changes: [
            { key: "system.armor.value", value: 0, mode: 1, priority: 20 },
            { key: "system.shields.value", value: 0, mode: 1, priority: 20 }
          ],
          description: "Kaithe Stampede: Trampled under spectral hooves. 100% Armor and Shields stripped, knocked prone!",
          flags: { core: { statusId: "kaithe_trampled" } }
        }]);
        strippedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-horse-head animate-pulse"></i> Rakhali's Cavalry Stampede Unleashed!</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">5 galloping phantom Kaithe spirit horses trample the battlefield!<br/>
        ${strippedNames.length > 0 ? `➔ <strong>Trampled Foes:</strong> ${strippedNames.join(", ")} knocked prone.<br/>` : ""}
        ➔ <strong>Total Defense Annihilation:</strong> Stripped <strong>100% Armor and Shields</strong> from all enemies struck!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d10 damage roll
  }

  return { handled: false };
}
