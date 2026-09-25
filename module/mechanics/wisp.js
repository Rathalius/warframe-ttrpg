/**
 * Warframe TTRPG - Wisp Specialized Ability Mechanics
 * Canonical implementations:
 * - Reservoirs: Modal selector for 3 motes (Vitality HP/Regen, Haste Speed/FireRate, Shock Stun/Arcs)
 * - Wil-O-Wisp: Decoy clone dispatch, recast to teleport with temporary invulnerability
 * - Breach Surge: Radial blind + homing surge sparks erupting on damage dealt
 * - Sol Gate: Channeled solar beam portal straight from the Sun (Heat/Radiation beam)
 */

export async function handleWispAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. RESERVOIRS (Vitality, Haste, Shock Motes)
  // ==========================================
  if (baseName === "reservoirs" || baseName === "reservoir") {
    return new Promise((resolve) => {
      new Dialog({
        title: "Wisp - Reservoirs Mote Selection",
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #fff;">
            <p style="margin-bottom: 8px;">Select ethereal Reservoir mote to materialize:</p>
            <div style="display: flex; gap: 8px;">
              <div style="flex: 1; padding: 6px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                <strong style="color: #2ecc71;"><i class="fas fa-heart"></i> Vitality Mote</strong><br/>
                +300 Max HP & +30 HP/round health regeneration.
              </div>
              <div style="flex: 1; padding: 6px; background: rgba(41, 128, 185, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                <strong style="color: #54a0ff;"><i class="fas fa-running"></i> Haste Mote</strong><br/>
                +30ft Speed, +30% Fire Rate & +30% Melee Speed.
              </div>
              <div style="flex: 1; padding: 6px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                <strong style="color: #f1c40f;"><i class="fas fa-bolt"></i> Shock Mote</strong><br/>
                Zaps up to 5 nearby hostiles, stunning them in place.
              </div>
            </div>
          </div>
        `,
        buttons: {
          vitality: {
            icon: '<i class="fas fa-heart"></i>',
            label: "Vitality Mote",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(5 * (powerDuration / 100)));
              const bonusHP = Math.round(300 * (powerStrength / 100));
              const regen = Math.round(30 * (powerStrength / 100));

              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: `Vitality Mote (+${bonusHP} Max HP, +${regen} HP/rnd)`,
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wisp/Reservoirs.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                changes: [
                  { key: "system.health.bonus", value: bonusHP, mode: 2, priority: 20 }
                ],
                description: `Vitality Mote: Imbued with life essence. Grants +${bonusHP} Max HP and regenerates +${regen} HP every round.`,
                flags: { core: { statusId: "vitality_mote" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                  <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-heart animate-pulse"></i> Vitality Mote Planted</strong><br/>
                  <span style="font-size: 11px; color: #a8e6cf;">Spiritual flora active for ${durationRounds} rounds! Grants <strong>+${bonusHP} Max HP</strong> and regenerates <strong>+${regen} Health</strong> each round.</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          haste: {
            icon: '<i class="fas fa-running"></i>',
            label: "Haste Mote",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(5 * (powerDuration / 100)));
              const speedBoost = Math.round(30 * (powerStrength / 100));

              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: `Haste Mote (+${speedBoost} ft Spd, +30% Atk Spd)`,
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wisp/Reservoirs.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                changes: [
                  { key: "system.speed.land.value", value: speedBoost, mode: 2, priority: 20 },
                  { key: "system.meleeSpeed.value", value: 30, mode: 2, priority: 20 }
                ],
                description: `Haste Mote: Overclocked temporal frequency. Grants +${speedBoost} ft movement speed, +30% firearm fire rate, and +30% melee speed.`,
                flags: { core: { statusId: "haste_mote" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(41, 128, 185, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                  <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-running animate-pulse"></i> Haste Mote Planted</strong><br/>
                  <span style="font-size: 11px; color: #dff9fb;">Temporal flora active for ${durationRounds} rounds! Grants <strong>+${speedBoost} ft Movement Speed</strong>, +30% Fire Rate, and +30% Melee Speed.</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          shock: {
            icon: '<i class="fas fa-bolt"></i>',
            label: "Shock Mote",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(5 * (powerDuration / 100)));

              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: "Shock Mote Ward (Chain Arcs)",
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wisp/Reservoirs.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                description: "Shock Mote: Discharges chain lightning zapping up to 5 hostiles within 15m every round with Electricity procs.",
                flags: { core: { statusId: "shock_mote" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                  <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-bolt animate-pulse"></i> Shock Mote Planted</strong><br/>
                  <span style="font-size: 11px; color: #fef9e7;">Electric flora active for ${durationRounds} rounds! Automatically arcs chain electricity into up to 5 nearby foes, stunning them!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          }
        },
        default: "vitality"
      }, {
        classes: ["dialog", "warframe-dialog", "wisp-dialog"]
      }).render(true);
    });
  }

  // ==========================================
  // 2. WIL-O-WISP (Decoy Clone & Invulnerability Teleport)
  // ==========================================
  if (baseName === "wil-o-wisp") {
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Wil-O-Wisp (Dimensional Cloak)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wisp/Wil-O-Wisp.png",
      origin: actor.uuid,
      duration: { rounds: 1 },
      statuses: ["invisible"],
      description: "Wil-O-Wisp: Ghostly specter projected forward drawing all enemy fire. Reactivating teleports Wisp to specter's position with temporary invulnerability.",
      flags: { core: { statusId: "wil_o_wisp" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.08); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-ghost animate-pulse"></i> Wil-O-Wisp Projected</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Spectral double dispatched forward drawing all enemy aggro! Wisp turns invisible; recast to instantly teleport to the decoy with invulnerability!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. BREACH SURGE (Blind & Homing Radiation Sparks)
  // ==========================================
  if (baseName === "breach surge") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const blindedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Breach Surge (Blinded & Primed)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/wisp/BreachSurge.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["blind"],
          description: "Breach Surge: Blinded by interdimensional rift. When damaged, discharges homing surge sparks dealing 2x damage to other foes!",
          flags: { core: { statusId: "breach_surge" } }
        }]);
        blindedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-sun animate-pulse"></i> Breach Surge Blinding Pulse</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Rift expands blinding targets for ${durationRounds} rounds.<br/>
        ${blindedNames.length > 0 ? `➔ <strong>Primed Foes:</strong> ${blindedNames.join(", ")}.<br/>` : ""}
        ➔ <strong>Surge Sparks:</strong> Whenever afflicted foes take damage, homing energy sparks burst from their heads and seek adjacent enemies for <strong>DOUBLE DAMAGE</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. SOL GATE (Solar Aperture Beam)
  // ==========================================
  if (baseName === "sol gate") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.1); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-sun animate-pulse"></i> Sol Gate Aperture Opened</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Wisp opens a portal directly to the surface of the Sun, channeling a roaring beam of continuous <strong>Heat and Radiation</strong> plasma! Foes afflicted by Breach Surge suffer double beam damage!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d12 Heat/Radiation damage roll
  }

  return { handled: false };
}
