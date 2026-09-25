/**
 * Warframe TTRPG - Gauss Specialized Ability Mechanics
 * Canonical implementations:
 * - Mach Rush: Hyper-kinetic sprint; ragdolls enemies in path, generates +10% Battery
 * - Kinetic Plating: Armor plating converting kinetic energy into Energy; grants up to 100% DR vs Physical/Heat/Cold/Blast
 * - Thermal Sunder: Kinetic thermodynamic siphon. Cold freezes and charges battery; Heat burns and vents battery; combining them triggers 100% Armor Strip Blast Cataclysm!
 * - Redline: Pushes battery limit past 100% into overdrive. Grants massive Fire Rate, Melee Speed, Reload Speed, and homing plasma discharge
 */

export async function handleGaussAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const currentBattery = Number(actor.system.battery?.value) || 0;
  const maxBattery = Number(actor.system.battery?.max) || 100;
  const abilityName = ability.name || "";

  async function adjustBattery(delta, reason = "") {
    const updated = Math.min(maxBattery, Math.max(0, currentBattery + delta));
    await actor.update({ "system.battery.value": updated });
    return updated;
  }

  // ==========================================
  // 1. MACH RUSH (Super Sprint & Kinetic Charge)
  // ==========================================
  if (baseName === "mach rush") {
    const newBattery = await adjustBattery(10, "Mach Rush sprint");

    // Ragdoll / knock down targeted enemies
    const knockedNames = [];
    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Mach Rush Knockdown (Prone)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gauss/MachRush.png",
        origin: actor.uuid,
        duration: { rounds: 1 },
        statuses: ["prone"],
        changes: [
          { key: "system.speed.land.value", value: -50, mode: 1, priority: 20 }
        ],
        description: "Mach Rush Shockwave: Sent tumbling ragdoll-style by kinetic shockwave. Knocks prone.",
        flags: { core: { statusId: "prone" } }
      }]);
      knockedNames.push(token.name);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(0, 210, 211, 0.08); border: 1px solid #00d2d3; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #00d2d3; text-transform: uppercase;">
          <span><i class="fas fa-bolt animate-pulse"></i> Mach Rush Sprint</span>
          <span>+10% Battery (${newBattery}%)</span>
        </div>
        <div style="font-size: 10.5px; color: #c8f7f7; margin-top: 4px; line-height: 1.35;">
          Gauss dashes at supersonic speed!<br/>
          ➔ <strong>Kinetic Battery:</strong> Charged by <strong>+10%</strong> (Current: ${newBattery}%).<br/>
          ${knockedNames.length > 0 ? `➔ <strong>Supersonic Impact:</strong> Knocked down prone: ${knockedNames.join(", ")}.<br/>` : ""}
          <em>Impact shockwave knocks foes sprawling and demolishes environmental obstacles.</em>
        </div>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d8 Impact damage roll
  }

  // ==========================================
  // 2. KINETIC PLATING (Kinetic Absorption & Energy Gain)
  // ==========================================
  if (baseName === "kinetic plating") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    // DR scales from 50% to 100% based on Battery percentage
    const drPercent = Math.min(100, Math.round(50 + (currentBattery * 0.5)));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Kinetic Plating (${drPercent}% DR)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gauss/KineticPlating.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `Kinetic Plating: ${drPercent}% Damage Reduction against Physical, Heat, Cold, and Blast damage. Absorbed kinetic hits convert 5% damage into Energy and stagger melee attackers. Knockdown immune!`,
      flags: { core: { statusId: "kinetic_plating" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #54a0ff; text-transform: uppercase;">
          <span><i class="fas fa-shield-alt"></i> Kinetic Plating Engaged</span>
          <span>${drPercent}% DR</span>
        </div>
        <div style="font-size: 10.5px; color: #dff9fb; margin-top: 4px; line-height: 1.35;">
          Galvanic armor plates deployed for ${durationRounds} rounds.<br/>
          ➔ <strong>Damage Resistance:</strong> <strong>${drPercent}% DR</strong> against Physical, Heat, Cold, and Blast damage.<br/>
          ➔ <strong>Kinetic Siphon:</strong> Converts kinetic impacts into Energy, grants total knockdown immunity, and staggers melee assailants!
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. THERMAL SUNDER (Thermodynamic Siphon & Armor Strip)
  // ==========================================
  if (baseName === "thermal sunder") {
    return new Promise((resolve) => {
      new Dialog({
        title: "Thermal Sunder - Thermodynamic Mode",
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #fff;">
            <p style="margin-bottom: 8px;">Select thermodynamic inversion mode for <strong>Thermal Sunder</strong>:</p>
            <div style="display: flex; gap: 8px;">
              <div style="flex: 1; padding: 6px; background: rgba(0, 210, 211, 0.1); border: 1px solid #00d2d3; border-radius: 4px;">
                <strong style="color: #00d2d3;"><i class="fas fa-snowflake"></i> Cold Sunder (Tap)</strong><br/>
                Siphons heat. Freezes enemies solid with Cold procs, charges Battery by <strong>+10%</strong>.
              </div>
              <div style="flex: 1; padding: 6px; background: rgba(235, 77, 75, 0.1); border: 1px solid #eb4d4b; border-radius: 4px;">
                <strong style="color: #eb4d4b;"><i class="fas fa-fire"></i> Heat Sunder (Hold)</strong><br/>
                Expels heat. Panics foes with Heat burn, drains Battery by <strong>-10%</strong>.<br/>
                <em>Strikes Cold targets for <strong>100% Armor Strip Blast</strong>!</em>
              </div>
            </div>
          </div>
        `,
        buttons: {
          cold: {
            icon: '<i class="fas fa-snowflake"></i>',
            label: "Cold (Charge +10%)",
            callback: async () => {
              const newBattery = await adjustBattery(10, "Cold Sunder");
              for (const token of targets) {
                if (token.actor) {
                  await token.actor.createEmbeddedDocuments("ActiveEffect", [{
                    name: "Thermal Sunder (Frozen)",
                    icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gauss/ThermalSunder.png",
                    origin: actor.uuid,
                    duration: { rounds: 2 },
                    statuses: ["frozen"],
                    changes: [{ key: "system.speed.land.value", value: -100, mode: 2, priority: 20 }],
                    description: "Flash Frozen: Body encased in absolute zero ice. Frozen solid.",
                    flags: { core: { statusId: "frozen" }, "warframe-ttrpg": { coldSunder: true } }
                  }]);
                }
              }

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(0, 210, 211, 0.1); border: 1px solid #00d2d3; border-radius: 4px;">
                  <strong style="color: #00d2d3; font-family: 'Orbitron';"><i class="fas fa-snowflake"></i> Cold Thermal Sunder (Flash Freeze)</strong><br/>
                  Battery charged by +10% (Current: ${newBattery}%). Targeted enemies flash frozen solid in ice!
                </div>
              `;
              resolve({ handled: false, cardExtraHTML });
            }
          },
          heat: {
            icon: '<i class="fas fa-fire"></i>',
            label: "Heat (Vent -10%)",
            callback: async () => {
              const newBattery = await adjustBattery(-10, "Heat Sunder");
              let blastStripCount = 0;

              for (const token of targets) {
                if (token.actor) {
                  const hasCold = token.actor.effects.some(e => !e.disabled && (e.name.includes("Frozen") || e.flags?.["warframe-ttrpg"]?.coldSunder));
                  if (hasCold) {
                    blastStripCount++;
                    await token.actor.createEmbeddedDocuments("ActiveEffect", [{
                      name: "Thermodynamic Blast (100% Armor Stripped)",
                      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gauss/ThermalSunder.png",
                      origin: actor.uuid,
                      duration: { rounds: 3 },
                      changes: [{ key: "system.armor.value", value: 0, mode: 1, priority: 20 }],
                      description: "Thermodynamic Blast: Cold and Heat collided! 100% Armor stripped permanently, knocked backwards.",
                      flags: { core: { statusId: "armor_stripped" } }
                    }]);
                  } else {
                    await token.actor.createEmbeddedDocuments("ActiveEffect", [{
                      name: "Thermal Sunder (Ignited)",
                      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gauss/ThermalSunder.png",
                      origin: actor.uuid,
                      duration: { rounds: 2 },
                      statuses: ["burning"],
                      description: "Ignited: Enveloped in kinetic thermal plasma flame.",
                      flags: { core: { statusId: "burning" } }
                    }]);
                  }
                }
              }

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(235, 77, 75, 0.1); border: 1px solid #eb4d4b; border-radius: 4px;">
                  <strong style="color: #eb4d4b; font-family: 'Orbitron';"><i class="fas fa-fire"></i> Heat Thermal Sunder (Plasma Burst)</strong><br/>
                  Battery vented by -10% (Current: ${newBattery}%). Enemies ignited in flames.<br/>
                  ${blastStripCount > 0 ? `<span style="color: #ff9ff3; font-weight: bold;"><i class="fas fa-bomb"></i> BLAST CATACLYSM x${blastStripCount}:</span> Stripped <strong>100% Armor</strong> from flash-frozen targets!` : ""}
                </div>
              `;
              resolve({ handled: false, cardExtraHTML });
            }
          }
        },
        default: "cold"
      }, {
        classes: ["dialog", "warframe-dialog", "gauss-dialog"]
      }).render(true);
    });
  }

  // ==========================================
  // 4. REDLINE (Supersonic Overclock & Plasma Bolts)
  // ==========================================
  if (baseName === "redline") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const newBattery = await adjustBattery(100, "Redline activation");

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Redline Overdrive (+50% Spd/FireRate)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/gauss/Redline.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.meleeSpeed.value", value: 50, mode: 2, priority: 20 },
        { key: "system.speed.land.value", value: 20, mode: 2, priority: 20 }
      ],
      description: `Redline Overdrive: Battery overclocked past 100%! +50% Melee Speed, +50% Fire Rate, +100% Reload/Cast Speed, and discharges homing lightning bolts.`,
      flags: { core: { statusId: "redline" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(255, 107, 107, 0.08); border: 1px solid #ff6b6b; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ff6b6b; text-transform: uppercase;">
          <span><i class="fas fa-tachometer-alt animate-pulse"></i> Redline Overdrive Engaged</span>
          <span>100% Battery</span>
        </div>
        <div style="font-size: 10.5px; color: #f8a5c2; margin-top: 4px; line-height: 1.35;">
          Gauss breaks the kinetic speed barrier for ${durationRounds} rounds!<br/>
          ➔ <strong>Hyper-Kinetic Buffs:</strong> +50% Melee Speed, +50% Fire Rate, +100% Reload Speed.<br/>
          ➔ <strong>Supersonic Arcs:</strong> Kinetic battery discharges homing lightning bolts at all foes in range!<br/>
          ➔ <strong>Invulnerability Synergy:</strong> While at 100% Redline, Kinetic Plating provides complete 100% DR!
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
