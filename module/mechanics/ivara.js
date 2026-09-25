/**
 * Warframe TTRPG - Ivara Specialized Ability Mechanics
 * Canonical implementations:
 * - Quiver: Modal selector with 4 arrow types (Cloak, Dashwire, Noise, Sleep)
 * - Navigator: Steers projectile in flight with escalating damage multiplier (up to 5x)
 * - Prowl: Invisibility stance, headshot bonus (+40% crit), pickpocket extra loot
 * - Artemis Bow: Exalted multi-shot composite bow (horizontal/vertical spread of 7 energy arrows)
 */

export async function handleIvaraAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. QUIVER (Tactical Arrow Selection)
  // ==========================================
  if (baseName === "quiver") {
    return new Promise((resolve) => {
      new Dialog({
        title: "Ivara - Tactical Quiver Selection",
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #fff;">
            <p style="margin-bottom: 8px;">Select arrow to chamber into your tactical quiver:</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="padding: 6px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                <strong style="color: #2ecc71;"><i class="fas fa-ghost"></i> Cloak Arrow</strong><br/>
                Creates 5m sphere of invisibility for squad (+50% Crit).
              </div>
              <div style="padding: 6px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                <strong style="color: #3498db;"><i class="fas fa-route"></i> Dashwire Arrow</strong><br/>
                Shoots zipline; walking wire grants +100% Crit Damage.
              </div>
              <div style="padding: 6px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                <strong style="color: #f1c40f;"><i class="fas fa-volume-up"></i> Noise Arrow</strong><br/>
                High-pitch lure drawing enemy investigation.
              </div>
              <div style="padding: 6px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
                <strong style="color: #9b59b6;"><i class="fas fa-moon"></i> Sleep Arrow</strong><br/>
                Puts enemies in radius to deep sleep (opens Finishers).
              </div>
            </div>
          </div>
        `,
        buttons: {
          cloak: {
            icon: '<i class="fas fa-ghost"></i>',
            label: "Cloak Arrow",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: "Cloak Arrow Sphere (Invisible)",
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ivara/Quiver.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                statuses: ["invisible"],
                description: "Cloak Arrow Sphere: Cloaked in localized active camouflage. Invisible to enemies and grants +50% Critical Chance.",
                flags: { core: { statusId: "invisible" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                  <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-ghost"></i> Cloak Arrow Deployed</strong><br/>
                  <span style="font-size: 11px; color: #a8e6cf;">Invisibility dome created for ${durationRounds} rounds. Squad inside is completely concealed with +50% Crit Chance!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          dashwire: {
            icon: '<i class="fas fa-route"></i>',
            label: "Dashwire",
            callback: async () => {
              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                  <strong style="color: #3498db; font-family: 'Orbitron';"><i class="fas fa-route"></i> Dashwire Arrow Anchored</strong><br/>
                  <span style="font-size: 11px; color: #dff9fb;">Traversing zipline suspended across terrain. Allies perched on the wire gain <strong>+100% Critical Damage</strong> on all ranged attacks!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          noise: {
            icon: '<i class="fas fa-volume-up"></i>',
            label: "Noise Arrow",
            callback: async () => {
              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                  <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-volume-up"></i> Noise Arrow Lure</strong><br/>
                  <span style="font-size: 11px; color: #fef9e7;">Acoustic lure pinging at target location. All unalerted foes investigate the source, leaving their posts exposed.</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          sleep: {
            icon: '<i class="fas fa-moon"></i>',
            label: "Sleep Arrow",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(2 * (powerDuration / 100)));
              const targetNames = [];
              for (const token of targets) {
                if (token.actor) {
                  await token.actor.createEmbeddedDocuments("ActiveEffect", [{
                    name: "Sleep Arrow (Incapacitated)",
                    icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ivara/Quiver.png",
                    origin: actor.uuid,
                    duration: { rounds: durationRounds },
                    statuses: ["asleep"],
                    description: "Sleep Arrow: Plunged into sudden narcotic slumber. Alert wiped, vulnerable to Stealth Finishers!",
                    flags: { core: { statusId: "asleep" } }
                  }]);
                  targetNames.push(token.name);
                }
              }

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
                  <strong style="color: #e056fd; font-family: 'Orbitron';"><i class="fas fa-moon"></i> Sleep Arrow Detonated</strong><br/>
                  <span style="font-size: 11px; color: #e0d0ea;">
                    ${targetNames.length > 0 ? `Enemies put to sleep: <strong>${targetNames.join(", ")}</strong> for ${durationRounds} rounds. Open to lethal Stealth Finishers!` : "Narcotic mist primed. Target enemies to put them into deep slumber."}
                  </span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          }
        },
        default: "cloak"
      }, {
        classes: ["dialog", "warframe-dialog", "ivara-dialog"]
      }).render(true);
    });
  }

  // ==========================================
  // 2. NAVIGATOR (Projectile Remote Control)
  // ==========================================
  if (baseName === "navigator") {
    const maxMultiplier = Math.round(5 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Navigator (${maxMultiplier}x Multiplier)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ivara/Navigator.png",
      origin: actor.uuid,
      duration: { rounds: 1 },
      description: `Navigator: Next projectile fired is guided manually in third-person view, ramping up to ${maxMultiplier}x damage!`,
      flags: { core: { statusId: "navigator" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-crosshairs animate-pulse"></i> Navigator Guided Projectile</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Ivara commandeers next projectile in mid-air. Steer projectile around obstacles; damage ramps up to <strong>${maxMultiplier}x total damage</strong> on impact!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. PROWL (Invisibility & Headshot Multiplier)
  // ==========================================
  if (baseName === "prowl") {
    const existingProwl = actor.effects.find(e => !e.disabled && e.name.includes("Prowl"));
    if (existingProwl) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [existingProwl.id]);
      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Prowl Stance Deactivated</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    const headshotBonus = Math.round(40 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Prowl Invisibility (+${headshotBonus}% Headshot)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ivara/Prowl.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      statuses: ["invisible"],
      changes: [
        { key: "system.speed.land.value", value: -10, mode: 2, priority: 20 }
      ],
      description: `Prowl: Invisible while walking. Grants +${headshotBonus}% Headshot / Critical Damage, and automatically pickpockets bonus loot from enemies in melee range. Sprinting breaks stealth.`,
      flags: { core: { statusId: "prowl_invis" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-mask"></i> Prowl Camouflage Engaged</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;">➔ <strong>Invisibility:</strong> Completely unseen by enemy sensors.<br/>➔ <strong>Precision Lethality:</strong> +${headshotBonus}% Headshot Critical Damage bonus.<br/>➔ <strong>Pickpocket:</strong> Drops extra ammo and credits when stalking past foes.</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. ARTEMIS BOW (Exalted Composite Bow)
  // ==========================================
  if (baseName === "artemis bow") {
    const existingBow = actor.items.find(i => i.type === "weapon" && (i.name.includes("Artemis Bow") || i.flags?.["warframe-ttrpg"]?.isArtemisBow));

    if (existingBow) {
      await actor.deleteEmbeddedDocuments("Item", [existingBow.id]);
      const effects = actor.effects.filter(e => !e.disabled && e.name.includes("Artemis Bow"));
      if (effects.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", effects.map(e => e.id));

      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Artemis Bow Stowed</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    const flatBonus = Math.max(0, Math.floor((powerStrength - 100) / 10));
    const bowFormula = flatBonus > 0 ? `4d12 + ${flatBonus}` : "4d12";

    await actor.createEmbeddedDocuments("Item", [{
      name: "Artemis Bow (Exalted Bow)",
      type: "weapon",
      img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ivara/ArtemisBow.png",
      system: {
        type: "primary",
        damage: bowFormula,
        damageType: "Puncture/Slash",
        range: "60m Ranged",
        equipped: true
      },
      flags: {
        "warframe-ttrpg": { isArtemisBow: true }
      }
    }]);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Artemis Bow Deployed",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ivara/ArtemisBow.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      description: `Artemis Bow Active: Fires a spread of 7 concentrated energy arrows (${bowFormula} damage).`,
      flags: { core: { statusId: "artemis_bow" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-bow-arrow animate-pulse"></i> Artemis Bow Summoned</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Exalted multi-shot bow equipped (${bowFormula} damage). Fires volleys of 7 piercing arrows in horizontal or vertical fan patterns!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
