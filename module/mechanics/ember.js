/**
 * Warframe TTRPG - Ember Specialized Ability Mechanics
 * Canonical implementations:
 * - Fireball: Launches fiery projectile (Heat damage + burning panic); builds +10% Immolation
 * - Immolation: Ignites protective flame armor granting 40% to 90% Damage Reduction based on gauge. Overheats at 100%
 * - Fire Blast: Slams ground to vent Immolation (-50%), knocks down enemies and strips 50% to 100% Armor based on gauge!
 * - Inferno: Rains fiery meteors down on all targeted foes (Heat damage + spreading flame aura); builds +10% Immolation
 */

export async function handleEmberAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const currentImmolation = Number(actor.system.immolation?.value) || 0;
  const maxImmolation = Number(actor.system.immolation?.max) || 100;
  const abilityName = ability.name || "";

  async function adjustImmolation(delta, reason = "") {
    const updated = Math.min(maxImmolation, Math.max(0, currentImmolation + delta));
    await actor.update({ "system.immolation.value": updated });
    return updated;
  }

  // ==========================================
  // 1. FIREBALL (Molten Plasma & Gauge Charge)
  // ==========================================
  if (baseName === "fireball") {
    const newImmolation = await adjustImmolation(10, "Fireball cast");

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Fireball Ignite (Heat Proc)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ember/Fireball.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["burning"],
          description: "Ignited: Flailing in fiery panic. Suffers Heat damage each round.",
          flags: { core: { statusId: "burning" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #e67e22; text-transform: uppercase;">
          <span><i class="fas fa-fire animate-pulse"></i> Fireball Launched</span>
          <span>+10% Immolation (${newImmolation}%)</span>
        </div>
        <div style="font-size: 10.5px; color: #fed330; margin-top: 4px; line-height: 1.35;">
          Molten projectile hurled at target!<br/>
          ➔ <strong>Immolation Gauge:</strong> Charged by +10% (Current: ${newImmolation}%).<br/>
          ➔ <strong>Heat Proc:</strong> Targets ignited in flailing panic for 2 rounds.
        </div>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d10 Heat damage roll
  }

  // ==========================================
  // 2. IMMOLATION (Flame Shield & Scaling DR)
  // ==========================================
  if (baseName === "immolation") {
    // Scaling DR: 40% at 0% gauge up to 90% at max gauge
    const drPercent = Math.min(90, Math.round(40 + (currentImmolation * 0.5)));
    const isOverheated = currentImmolation >= 90;

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Immolation Armor (${drPercent}% DR)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ember/Immolation.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      description: `Immolation: Surrounded by roaring flames. Grants ${drPercent}% Damage Reduction. ${isOverheated ? "CRITICAL HEAT: Vent with Fire Blast to avoid rapid energy drain!" : ""}`,
      flags: { core: { statusId: "immolation_shield" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(235, 77, 75, 0.08); border: 1px solid #eb4d4b; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ff7675; text-transform: uppercase;">
          <span><i class="fas fa-shield-alt"></i> Immolation Shield Active</span>
          <span>${drPercent}% DR</span>
        </div>
        <div style="font-size: 10.5px; color: #f5cd79; margin-top: 4px; line-height: 1.35;">
          Ember is enveloped in superheated plasma.<br/>
          ➔ <strong>Damage Reduction:</strong> <strong>${drPercent}% DR</strong> against all incoming damage (scales with Immolation).<br/>
          ${isOverheated 
            ? `<span style="color: #ff3838; font-weight: bold;"><i class="fas fa-exclamation-triangle"></i> OVERHEATED (90%+):</span> Gauge at maximum heat! Vent with <strong>Fire Blast</strong> to strip 100% enemy armor and prevent energy drain!` 
            : `➔ <strong>Thermal State:</strong> Stable heat output at ${currentImmolation}%.`
          }
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. FIRE BLAST (Vent & Armor Strip Shockwave)
  // ==========================================
  if (baseName === "fire blast") {
    // Vents 50% of the immolation gauge
    const stripPct = currentImmolation >= 85 ? 100 : Math.round(50 + (currentImmolation * 0.5));
    const newImmolation = await adjustImmolation(-50, "Fire Blast vent");

    const strippedNames = [];
    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      const armorMultiplier = Math.max(0, 1 - (stripPct / 100));
      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Fire Blast (${stripPct}% Armor Melted)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ember/FireBlast.png",
        origin: actor.uuid,
        duration: { rounds: 3 },
        statuses: ["prone"],
        changes: [
          { key: "system.armor.value", value: armorMultiplier, mode: 1, priority: 20 }
        ],
        description: `Fire Blast: Knocked down and armor melted away by ${stripPct}%!`,
        flags: { core: { statusId: "armor_melted" } }
      }]);
      strippedNames.push(token.name);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(214, 48, 49, 0.08); border: 1px solid #d63031; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ff7675; text-transform: uppercase;">
          <span><i class="fas fa-certificate animate-pulse"></i> Fire Blast Vented</span>
          <span>-${Math.min(50, currentImmolation)}% Immolation</span>
        </div>
        <div style="font-size: 10.5px; color: #f5cd79; margin-top: 4px; line-height: 1.35;">
          A wave of incinerating plasma slams outward, venting heat to <strong>${newImmolation}%</strong>.<br/>
          ➔ <strong>Armor Melted:</strong> <strong>-${stripPct}% Armor</strong> stripped from targets!<br/>
          ${strippedNames.length > 0 ? `➔ <strong>Targets Knocked Down & Melted:</strong> ${strippedNames.join(", ")}.<br/>` : ""}
          ➔ <strong>Ember Recovery:</strong> Immolation gauge vented safely back to ${newImmolation}%.
        </div>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d8 Heat damage roll
  }

  // ==========================================
  // 4. INFERNO (Meteor Cataclysm & Flaming Rings)
  // ==========================================
  if (baseName === "inferno") {
    const newImmolation = await adjustImmolation(10, "Inferno meteors");
    const meteorCount = Math.max(1, targets.length);

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Inferno Roaring Rings (Heat)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ember/Inferno.png",
          origin: actor.uuid,
          duration: { rounds: 3 },
          statuses: ["burning"],
          description: "Inferno Ring: Encircled in roaring fire rings, spreading Heat damage to adjacent allies.",
          flags: { core: { statusId: "inferno_burning" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(235, 77, 75, 0.1); border: 1px solid #eb4d4b; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ff7675; text-transform: uppercase;">
          <span><i class="fas fa-meteor animate-pulse"></i> Inferno Meteor Cataclysm</span>
          <span>${meteorCount} Meteors</span>
        </div>
        <div style="font-size: 10.5px; color: #fed330; margin-top: 4px; line-height: 1.35;">
          Blazing meteors rain down from the sky, crashing into ${meteorCount} targets!<br/>
          ➔ <strong>Immolation Gauge:</strong> Charged by +10% (Current: ${newImmolation}%).<br/>
          ➔ <strong>Roaring Flame Rings:</strong> Enemies enveloped in flame rings that continuously ignite them and burn adjacent foes.
        </div>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d10 Heat damage roll
  }

  return { handled: false };
}
