/**
 * Warframe TTRPG - Limbo Specialized Ability Mechanics
 * Canonical implementations:
 * - Banish: Displaces target units into or out of the Rift Plane
 * - Rift Walk: Enters Rift Plane (+10 Energy/rnd, material damage immunity)
 * - Stasis: Freezes all hostiles and projectiles within the Rift in time!
 * - Cataclysm: Collapses spherical pocket of Rift Plane causing Blast implosion
 */

export async function handleLimboAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. BANISH (Dimensional Displacement)
  // ==========================================
  if (baseName === "banish") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const banishedNames = [];

    for (const token of targets) {
      if (token.actor) {
        const inRift = token.actor.effects.some(e => !e.disabled && e.statuses?.has("rift_plane"));
        if (inRift) {
          // Unbanish back to material plane
          const riftEffects = token.actor.effects.filter(e => !e.disabled && e.statuses?.has("rift_plane"));
          await token.actor.deleteEmbeddedDocuments("ActiveEffect", riftEffects.map(e => e.id));
        } else {
          // Banish into Rift
          await token.actor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Rift Plane (Banished)",
            icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/limbo/Banish.png",
            origin: actor.uuid,
            duration: { rounds: durationRounds },
            statuses: ["rift_plane"],
            description: "Rift Plane: Displaced into the Rift dimension. Cannot harm or be harmed by material plane entities.",
            flags: { core: { statusId: "rift_plane" } }
          }]);
        }
        banishedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid #8e44ad; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-portal-exit animate-pulse"></i> Banish: Dimensional Displacement</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">${banishedNames.length > 0 ? `Toggled plane state for <strong>${banishedNames.join(", ")}</strong> for ${durationRounds} rounds! Entities in the Rift Plane phase through material reality and cannot interact with the material world except via powers.` : "Target tokens to displace them between the Rift and Material planes."}</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. RIFT WALK (Limbo Enters Rift)
  // ==========================================
  if (baseName === "rift walk" || baseName === "rift phase") {
    const existingRift = actor.effects.find(e => !e.disabled && e.statuses?.has("rift_plane"));

    if (existingRift) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [existingRift.id]);
      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Rift Walk Deactivated: Returned to Material Plane</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Rift Plane (Limbo Walking)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/limbo/Banish.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      statuses: ["rift_plane"],
      description: "Rift Plane: Phased into pocket dimension. Immune to all material attacks, hazards, and lasers. Regenerates +10 Energy each round!",
      flags: { core: { statusId: "rift_plane" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #e056fd; font-family: 'Orbitron';"><i class="fas fa-magic animate-pulse"></i> Rift Walk Phased</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Limbo steps into the Rift Plane!<br/>
        ➔ <strong>Material Immunity:</strong> Total immunity to all material damage, bullets, explosions, and alarms.<br/>
        ➔ <strong>Void Siphon:</strong> Regenerates <strong>+10 Energy</strong> at the start of each round while phased!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. STASIS (Temporal Freeze)
  // ==========================================
  if (baseName === "stasis") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Stasis (Time Frozen in Rift)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/limbo/Stasis.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Stasis: Completely frozen in time while inside the Rift Plane. Projectiles and enemies hang suspended in air.",
          flags: { core: { statusId: "stasis_freeze" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-hourglass-half animate-pulse"></i> Stasis Temporal Freeze Active</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Rift time dilation stopped for ${durationRounds} rounds! All hostiles inside the Rift Plane are frozen completely motionless. Enemy bullets and rockets hang suspended harmlessly in mid-air!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. CATACLYSM (Rift Sphere Implosion)
  // ==========================================
  if (baseName === "cataclysm") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-globe animate-pulse"></i> Cataclysm Pocket Opened</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">16m sphere of violent Rift energy collapses onto the battlefield for ${durationRounds} rounds! Everything inside is immersed into the Rift Plane, taking continuous Void energy and dealing <strong>4d10 Blast damage</strong> on closure!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d10 damage roll
  }

  return { handled: false };
}
