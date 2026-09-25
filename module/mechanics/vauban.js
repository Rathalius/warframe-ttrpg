/**
 * Warframe TTRPG - Vauban Specialized Ability Mechanics
 * Canonical implementations:
 * - Tesla Nervos: Deploys 4 tracking roller drones that latch onto foes and electrocute them
 * - Minelayer: Modal selector with 4 mines (Flechette Orb, Tether Coil, Vector Pad, Overdriver)
 * - Photon Strike: Calls down devastating orbital laser strike from space
 * - Bastille / Vortex: Suspends enemies in stasis field while stripping Armor and granting it to Vauban; collapses into singularity Vortex
 */

export async function handleVaubanAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. TESLA NERVOS (Tracking Shock Rollers)
  // ==========================================
  if (baseName === "tesla nervos") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const shockNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Tesla Nervo Attached (Electrocuted)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/vauban/TeslaNervos.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["shocked"],
          description: "Tesla Nervo: Micro-drone latched onto chassis/flesh. Electrocutes host and arcs to nearby foes every round.",
          flags: { core: { statusId: "shocked" } }
        }]);
        shockNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-robot animate-pulse"></i> Tesla Nervos Deployed</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">4 tracking drone rollers seek out enemies for ${durationRounds} rounds.<br/>
        ${shockNames.length > 0 ? `➔ <strong>Latched onto:</strong> ${shockNames.join(", ")} (continuous shock stun & chain arcs)!` : "➔ Rollers patrolling for hostiles."}</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. MINELAYER (Tactical Mine Selection)
  // ==========================================
  if (baseName === "minelayer") {
    return new Promise((resolve) => {
      new Dialog({
        title: "Vauban - Minelayer Payload Selection",
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #fff;">
            <p style="margin-bottom: 8px;">Select tactical mine to deploy:</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="padding: 6px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
                <strong style="color: #ff6b6b;"><i class="fas fa-certificate"></i> Flechette Orb</strong><br/>
                High-rate nail turret spraying armor-piercing puncture darts.
              </div>
              <div style="padding: 6px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
                <strong style="color: #be2edd;"><i class="fas fa-magnet"></i> Tether Coil</strong><br/>
                Shoots harpoon cables to drag and pin up to 4 enemies.
              </div>
              <div style="padding: 6px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                <strong style="color: #2ecc71;"><i class="fas fa-chevron-circle-up"></i> Vector Pad</strong><br/>
                Kinetic boost plate launching allies forward or deflecting foes.
              </div>
              <div style="padding: 6px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                <strong style="color: #f1c40f;"><i class="fas fa-tachometer-alt"></i> Overdriver</strong><br/>
                Attaches combat booster giving ally +25% Weapon Damage.
              </div>
            </div>
          </div>
        `,
        buttons: {
          flechette: {
            icon: '<i class="fas fa-certificate"></i>',
            label: "Flechette Orb",
            callback: async () => {
              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
                  <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-certificate animate-pulse"></i> Flechette Orb Erected</strong><br/>
                  <span style="font-size: 11px; color: #f5cd79;">Turret sprays high-velocity flechette darts across 10m area, dealing continuous <strong>2d8 Puncture damage</strong> ignoring armor.</span>
                </div>
              `;
              resolve({ handled: false, cardExtraHTML }); // allows roll
            }
          },
          tether: {
            icon: '<i class="fas fa-magnet"></i>',
            label: "Tether Coil",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
              const hookedNames = [];
              for (const token of targets.slice(0, 4)) {
                if (token.actor) {
                  await token.actor.createEmbeddedDocuments("ActiveEffect", [{
                    name: "Tether Coil (Harpooned)",
                    icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/vauban/Minelayer.png",
                    origin: actor.uuid,
                    duration: { rounds: durationRounds },
                    statuses: ["entangled"],
                    changes: [{ key: "system.speed.land.value", value: -100, mode: 2, priority: 20 }],
                    description: "Tether Coil: Harpooned by magnetic steel wire. Pinned to the floor.",
                    flags: { core: { statusId: "entangled" } }
                  }]);
                  hookedNames.push(token.name);
                }
              }

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
                  <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-magnet"></i> Tether Coil Deployed</strong><br/>
                  <span style="font-size: 11px; color: #e0d0ea;">${hookedNames.length > 0 ? `Harpooned and pinned to the floor: <strong>${hookedNames.join(", ")}</strong>!` : "Magnetic coil deployed, awaiting targets to grapple."}</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          vector: {
            icon: '<i class="fas fa-chevron-circle-up"></i>',
            label: "Vector Pad",
            callback: async () => {
              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                  <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-chevron-circle-up"></i> Vector Pad Placed</strong><br/>
                  <span style="font-size: 11px; color: #a8e6cf;">Kinetic acceleration pad active. Stepping on the pad flings allies +30ft in direction of movement or launches intruding foes sprawling!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          overdriver: {
            icon: '<i class="fas fa-tachometer-alt"></i>',
            label: "Overdriver",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
              const targetActor = targets[0]?.actor || actor;
              const bonusDmg = Math.round(25 * (powerStrength / 100));

              await targetActor.createEmbeddedDocuments("ActiveEffect", [{
                name: `Overdriver (+${bonusDmg}% Damage)`,
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/vauban/Minelayer.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                changes: [{ key: "system.damageBonus.value", value: bonusDmg, mode: 2, priority: 20 }],
                description: `Overdriver: Nanite transceiver attached. Grants +${bonusDmg}% weapon damage bonus.`,
                flags: { core: { statusId: "overdriver" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                  <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-tachometer-alt"></i> Overdriver Attached</strong><br/>
                  <span style="font-size: 11px; color: #fef9e7;">Nanite beacon linked to <strong>${targetActor.name}</strong> for ${durationRounds} rounds! Grants <strong>+${bonusDmg}% Weapon Damage</strong>.</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          }
        },
        default: "flechette"
      }, {
        classes: ["dialog", "warframe-dialog", "vauban-dialog"]
      }).render(true);
    });
  }

  // ==========================================
  // 3. PHOTON STRIKE (Orbital Laser Strike)
  // ==========================================
  if (baseName === "photon strike") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-satellite animate-pulse"></i> Orbital Photon Beacon Targeted</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Target coordinates locked. High-orbit satellite delivers a blinding solar particle beam, incinerating all matter in a 7m blast radius!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d10 Blast damage roll
  }

  // ==========================================
  // 4. BASTILLE / VORTEX (Armor Strip & Stasis)
  // ==========================================
  if (baseName === "bastille" || baseName === "vortex") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const strippedCount = targets.length;
    const bonusArmor = Math.min(1000, strippedCount * 150);

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Bastille Stasis (100% Armor Stripped)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/vauban/Bastille.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          changes: [{ key: "system.armor.value", value: 0, mode: 1, priority: 20 }],
          description: "Bastille Containment: Suspended in mid-air kinetic stasis. 100% Armor stripped.",
          flags: { core: { statusId: "bastille_stasis" } }
        }]);
      }
    }

    if (bonusArmor > 0) {
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Bastille Fortification (+${bonusArmor} Armor)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/vauban/Bastille.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [{ key: "system.armor.value", value: bonusArmor, mode: 2, priority: 20 }],
        description: `Bastille Fortification: Harvested armor plates grant +${bonusArmor} bonus Armor.`,
        flags: { core: { statusId: "bastille_buff" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-cube animate-pulse"></i> Bastille Containment Grid Active</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Kinetic stasis field erected for ${durationRounds} rounds.<br/>
        ➔ <strong>Stasis:</strong> Enemies trapped helpless in mid-air.<br/>
        ➔ <strong>Armor Strip:</strong> 100% enemy armor stripped!<br/>
        ${bonusArmor > 0 ? `➔ <strong>Vauban Reinforced:</strong> Siphoned <strong>+${bonusArmor} bonus Armor</strong> to Vauban!` : ""}
        </span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
