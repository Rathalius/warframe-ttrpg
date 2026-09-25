/**
 * Warframe TTRPG - Mirage Specialized Ability Mechanics
 * Canonical implementations:
 * - Hall of Mirrors: Creates 4 holographic doppelgangers that mimic attacks
 * - Sleight of Hand: Booby-traps objects; blind jewels in light, explosive mines in dark
 * - Eclipse: Modal/toggle between Light (+200% Weapon Damage) and Shadow (75% DR)
 * - Prism: Laser disco sphere sweeps 20 laser beams; detonates into radial blind
 */

export async function handleMirageAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. HALL OF MIRRORS (4 Doppelgangers)
  // ==========================================
  if (baseName === "hall of mirrors") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const cloneDamagePct = Math.round(20 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Hall of Mirrors (4 Doppelgangers)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mirage/HallOfMirrors.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `Hall of Mirrors: 4 holographic clones mimic every attack, firing alongside Mirage and drawing enemy fire.`,
      flags: { core: { statusId: "hall_of_mirrors" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.08); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-clone animate-pulse"></i> Hall of Mirrors Manifested</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Mirage deploys <strong>4 holographic doppelgangers</strong> for ${durationRounds} rounds!<br/>
        ➔ <strong>Multiplied Firepower:</strong> Clones fire simultaneously, adding an extra <strong>2d8 damage roll</strong> to every attack!<br/>
        ➔ <strong>Confusion Decoy:</strong> Enemies suffer a 50% miss chance trying to target the real Mirage!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. SLEIGHT OF HAND (Booby Traps)
  // ==========================================
  if (baseName === "sleight of hand") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-theater-masks animate-pulse"></i> Sleight of Hand Traps Laid</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">All ammo, pickups, consoles, and lockers in 20m are rigged with trickster traps!<br/>
        ➔ <strong>In Light:</strong> Spawns dazzling prism jewels that blind and confuse hostiles.<br/>
        ➔ <strong>In Shadow:</strong> Spawns explosive shrapnel traps dealing <strong>3d8 Blast damage</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. ECLIPSE (Light / Shadow Stance)
  // ==========================================
  if (baseName === "eclipse") {
    return new Promise((resolve) => {
      new Dialog({
        title: "Mirage - Eclipse Lunar Stance",
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #fff;">
            <p style="margin-bottom: 8px;">Select illumination aspect for <strong>Eclipse</strong>:</p>
            <div style="display: flex; gap: 8px;">
              <div style="flex: 1; padding: 6px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                <strong style="color: #f1c40f;"><i class="fas fa-sun"></i> Solar Aspect (Light)</strong><br/>
                +150% to +200% Weapon Damage bonus.
              </div>
              <div style="flex: 1; padding: 6px; background: rgba(142, 68, 173, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
                <strong style="color: #be2edd;"><i class="fas fa-moon"></i> Lunar Aspect (Shadow)</strong><br/>
                Up to 75% Damage Reduction against all attacks.
              </div>
            </div>
          </div>
        `,
        buttons: {
          light: {
            icon: '<i class="fas fa-sun"></i>',
            label: "Solar Aspect (Damage)",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
              const bonusDmg = Math.round(150 * (powerStrength / 100));

              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: `Eclipse: Solar (+${bonusDmg}% Weapon Dmg)`,
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mirage/Eclipse.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                changes: [{ key: "system.damageBonus.value", value: bonusDmg, mode: 2, priority: 20 }],
                description: `Eclipse (Solar): Bathed in radiant light. +${bonusDmg}% Weapon Damage bonus!`,
                flags: { core: { statusId: "eclipse_solar" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                  <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-sun"></i> Eclipse: Solar Aspect Engaged</strong><br/>
                  <span style="font-size: 11px; color: #fef9e7;">Mirage channels radiant light for ${durationRounds} rounds!<br/>➔ <strong>Weapon Damage Boost:</strong> <strong>+${bonusDmg}% Weapon Damage</strong> on all firearms and melee hits!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          shadow: {
            icon: '<i class="fas fa-moon"></i>',
            label: "Lunar Aspect (75% DR)",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));

              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: "Eclipse: Lunar (75% Damage Reduction)",
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/mirage/Eclipse.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                description: "Eclipse (Lunar): Veiled in deep shadow. 75% Damage Reduction against all incoming damage.",
                flags: { core: { statusId: "eclipse_lunar" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
                  <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-moon"></i> Eclipse: Lunar Aspect Engaged</strong><br/>
                  <span style="font-size: 11px; color: #e0d0ea;">Mirage conceals herself in umbral shadows for ${durationRounds} rounds!<br/>➔ <strong>Damage Reduction:</strong> <strong>75% Damage Reduction</strong> against all incoming attacks!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          }
        },
        default: "light"
      }, {
        classes: ["dialog", "warframe-dialog", "mirage-dialog"]
      }).render(true);
    });
  }

  // ==========================================
  // 4. PRISM (Laser Disco Sphere)
  // ==========================================
  if (baseName === "prism") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(233, 30, 99, 0.1); border: 1px solid #e91e63; border-radius: 4px;">
        <strong style="color: #ff2a5f; font-family: 'Orbitron';"><i class="fas fa-sun animate-pulse"></i> Prism Energy Core Launched</strong><br/>
        <span style="font-size: 11px; color: #f8bbd0;">A floating crystalline core hovers through the room, firing 20 sweeping laser beams dealing continuous <strong>Radiation damage</strong>! Recasting detonates the prism in an overwhelming flash, blinding all enemies in 25m!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d10 Radiation damage roll
  }

  return { handled: false };
}
