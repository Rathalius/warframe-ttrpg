/**
 * Warframe TTRPG - Qorvex Specialized Ability Mechanics
 * Canonical implementations:
 * - Chyrinka Pillar: Radioactive concrete pillars pulse slow & radiation
 * - Containment Wall: Slams 2 massive walls together, crushing enemies
 * - Disometric Guard: Orbiting fusion plates grant total status proc immunity
 * - Crucible Blast: Chest reactor core beam triggers chain reaction explosions
 */

export async function handleQorvexAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. CHYRINKA PILLAR (Radioactive Totems)
  // ==========================================
  if (baseName === "chyrinka pillar") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-monument animate-pulse"></i> Chyrinka Radioactive Pillars Erected</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Concrete radiation pillars active for ${durationRounds} rounds!<br/>
        ➔ <strong>Pulsing Fallout:</strong> Emits continuous radiation waves in 10m radius, slowing enemies by <strong>50%</strong> and stacking Radiation confusion procs!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. CONTAINMENT WALL (Concrete Crush)
  // ==========================================
  if (baseName === "containment wall") {
    const crushedNames = [];
    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Containment Wall (Crushed & Staggered)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/qorvex/ContainmentWall.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Containment Wall: Crushed between radioactive concrete slabs. Knocks prone.",
          flags: { core: { statusId: "prone" } }
        }]);
        crushedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-columns animate-pulse"></i> Containment Walls Slammed</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Two colossal concrete slabs slam together with hydraulic force!<br/>
        ${crushedNames.length > 0 ? `➔ <strong>Trapped & Crushed:</strong> ${crushedNames.join(", ")} crushed and knocked prone.<br/>` : ""}
        ➔ Afflicts all victims with guaranteed Radiation procs!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 2d10 Radiation damage roll
  }

  // ==========================================
  // 3. DISOMETRIC GUARD (Status Immunity Plates)
  // ==========================================
  if (baseName === "disometric guard") {
    const plateCount = Math.round(5 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Disometric Guard (${plateCount} Fusion Plates)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/qorvex/DisometricGuard.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      description: `Disometric Guard: ${plateCount} rotating lead-infused fusion plates. Blocks status effects, knockdowns, and staggers completely.`,
      flags: { core: { statusId: "disometric_guard" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-shield-alt animate-pulse"></i> Disometric Guard Plates Orbiting</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;"><strong>${plateCount} lead-lined fusion plates</strong> orbit Qorvex and nearby allies!<br/>
        ➔ <strong>Total Immunity:</strong> Grants complete immunity to status procs, staggers, and knockdowns!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. CRUCIBLE BLAST (Reactor Core Laser)
  // ==========================================
  if (baseName === "crucible blast") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-radiation animate-pulse"></i> Crucible Core Beam Unleashed!</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Qorvex unlatches his chest containment doors, discharging a roaring nuclear reactor beam (<strong>4d10 Radiation</strong>)!<br/>
        ➔ <strong>Chain Reactions:</strong> Any enemy afflicted with Radiation triggers secondary nuclear detonations upon impact!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d10 Radiation damage roll
  }

  return { handled: false };
}
