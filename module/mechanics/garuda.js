/**
 * Warframe TTRPG - Garuda Specialized Ability Mechanics
 * Canonical implementations:
 * - Dread Mirror: Frontal shield absorbing 100% damage, charges blood orb bomb
 * - Blood Altar: Impales enemy to create AoE healing fountain (+25% HP/round)
 * - Bloodletting: Sacrifices 50% HP to restore 100% Energy and cleanse status
 * - Seeking Talons: Radial talon blades mark foes to suffer guaranteed Slash bleeds
 */

export async function handleGarudaAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. DREAD MIRROR (Frontal Shield & Blood Orb)
  // ==========================================
  if (baseName === "dread mirror") {
    const existingMirror = actor.effects.find(e => !e.disabled && e.name.includes("Dread Mirror"));

    if (existingMirror) {
      // Detonate Blood Heart Orb
      await actor.deleteEmbeddedDocuments("ActiveEffect", [existingMirror.id]);
      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
          <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-heart animate-pulse"></i> Dread Heart Blood Orb Detonated!</strong><br/>
          <span style="font-size: 11px; color: #f5cd79;">Garuda hurls the charged blood orb, detonating in a massive <strong>4d12 Impact/Slash</strong> explosion tearing through all enemies in a 10m radius!</span>
        </div>
      `;
      return { handled: false, cardExtraHTML };
    }

    // Deploy Mirror
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Dread Mirror (100% Frontal Shield)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/garuda/DreadMirror.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: "Dread Mirror: Orbiting blood shield absorbs 100% of incoming frontal damage, charging the Dread Heart bomb!",
      flags: { core: { statusId: "dread_mirror" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-shield-alt animate-pulse"></i> Dread Mirror Frontal Shield Deployed</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Garuda rips the life force from a target to form an impenetrable blood barrier for ${durationRounds} rounds!<br/>
        ➔ <strong>Frontal Immunity:</strong> Absorbs 100% of all incoming frontal damage.<br/>
        ➔ <strong>Recast:</strong> Hurls the charged Dread Heart blood orb for cataclysmic AoE damage!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. BLOOD ALTAR (Impale & AoE Healing Fountain)
  // ==========================================
  if (baseName === "blood altar") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const targetToken = targets[0];
    const victimName = targetToken ? targetToken.name : "Target";

    if (targetToken && targetToken.actor) {
      await targetToken.actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Blood Altar (Impaled in Agony)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/garuda/BloodAltar.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["paralyzed"],
        description: "Blood Altar: Impaled on a taloned spire of crystal blood. Emits a restorative healing fountain to Tenno.",
        flags: { core: { statusId: "blood_altar" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-hand-holding-medical animate-pulse"></i> Blood Altar Spire Erected</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;"><strong>${victimName}</strong> is impaled upon a blood crystal spire for ${durationRounds} rounds!<br/>
        ➔ <strong>Life Fountain:</strong> Radiates an 8m aura regenerating <strong>+25% Max HP</strong> each round to all Tenno standing nearby!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. BLOODLETTING (HP Sacrifice for 100% Energy)
  // ==========================================
  if (baseName === "bloodletting") {
    const curHP = Number(actor.system.health?.value) || 100;
    const sacrificed = Math.max(1, Math.round(curHP * 0.5));
    const newHP = curHP - sacrificed;

    // Cleanse debuffs
    const debuffs = actor.effects.filter(e => !e.disabled && e.statuses?.size > 0);
    if (debuffs.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", debuffs.map(e => e.id));

    // Restore 100% Energy
    const maxEnergy = Number(actor.system.energy?.max) || 100;
    await actor.update({
      "system.health.value": newHP,
      "system.energy.value": maxEnergy
    });

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-tint animate-pulse"></i> Bloodletting Sacred Sacrifice</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Garuda cuts her own flesh, sacrificing <strong>${sacrificed} Health</strong> (Current: ${newHP} HP).<br/>
        ➔ <strong>Energy Restored:</strong> Refilled to <strong>${maxEnergy} Energy (100% Full)</strong>!<br/>
        ➔ <strong>Purification:</strong> Cleansed all active status debuffs!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. SEEKING TALONS (Slash Bleed Mark)
  // ==========================================
  if (baseName === "seeking talons") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const markedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Seeking Talons Mark (Lethal Bleed Mark)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/garuda/SeekingTalons.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["bleeding"],
          description: "Seeking Talons: Marked by Garuda's blades. Any incoming damage automatically inflicts true Slash Bleed procs!",
          flags: { core: { statusId: "seeking_talons" } }
        }]);
        markedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-cut animate-pulse"></i> Seeking Talons Radial Slashes</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Blades of razor death sweep the field for ${durationRounds} rounds!<br/>
        ${markedNames.length > 0 ? `➔ <strong>Bleed Marked:</strong> ${markedNames.join(", ")}.<br/>` : ""}
        ➔ <strong>Death Mark:</strong> ANY damage dealt to marked targets by any weapon or power immediately triggers guaranteed true <strong>Slash Bleed procs</strong>!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 3d10 damage roll
  }

  return { handled: false };
}
