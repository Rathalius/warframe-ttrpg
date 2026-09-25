/**
 * Warframe TTRPG - Protea Specialized Ability Mechanics
 * Canonical implementations:
 * - Grenade Fan: Modal choice (Shrapnel Vortex bleed vs Shield Satellites overshields & shield gating)
 * - Blaze Artillery: Rapid plasma turret ramping +100% damage per hit
 * - Dispensary: Drops Health Orbs, Universal Ammo, and Energy Orbs
 * - Temporal Anchor: Drops time anchor; rewinds time on death/recast, restoring HP/Energy/Ammo and exploding
 */

export async function handleProteaAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. GRENADE FAN (Shrapnel Vortex vs Shield Satellites)
  // ==========================================
  if (baseName === "grenade fan") {
    return new Promise((resolve) => {
      new Dialog({
        title: "Protea - Grenade Fan Deployment",
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #fff;">
            <p style="margin-bottom: 8px;">Select grenade payload configuration:</p>
            <div style="display: flex; gap: 8px;">
              <div style="flex: 1; padding: 6px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
                <strong style="color: #ff6b6b;"><i class="fas fa-bomb"></i> Shrapnel Vortex (Tap)</strong><br/>
                3 cluster vortexes inflicting heavy Slash bleed and stagger.
              </div>
              <div style="flex: 1; padding: 6px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                <strong style="color: #54a0ff;"><i class="fas fa-shield-alt"></i> Shield Satellites (Hold)</strong><br/>
                Orbiting satellites restoring Shields, Overshields, and double Shield Gate!
              </div>
            </div>
          </div>
        `,
        buttons: {
          shrapnel: {
            icon: '<i class="fas fa-bomb"></i>',
            label: "Shrapnel Vortex",
            callback: async () => {
              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
                  <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-bomb animate-pulse"></i> Shrapnel Vortex Flung</strong><br/>
                  <span style="font-size: 11px; color: #f5cd79;">3 cluster grenades carpet the area, shredding caught foes for continuous <strong>2d8 Slash damage</strong> and severe bleed lacerations!</span>
                </div>
              `;
              resolve({ handled: false, cardExtraHTML }); // allows roll
            }
          },
          satellite: {
            icon: '<i class="fas fa-shield-alt"></i>',
            label: "Shield Satellites",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
              const bonusShields = Math.round(250 * (powerStrength / 100));

              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: `Shield Satellite (+${bonusShields} Shields)`,
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/protea/GrenadeFan.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                changes: [{ key: "system.shields.bonus", value: bonusShields, mode: 2, priority: 20 }],
                description: `Shield Satellite: Orbiting drone continuously restores Shields and Overshields (+${bonusShields}) and doubles Shield-Gate invulnerability.`,
                flags: { core: { statusId: "shield_satellite" } }
              }]);

              const curShields = Number(actor.system.shields?.value) || 0;
              const maxShields = Number(actor.system.shields?.max) || 150;
              await actor.update({ "system.shields.value": Math.min(maxShields * 2, curShields + bonusShields) });

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                  <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-satellite animate-pulse"></i> Shield Satellites Deployed</strong><br/>
                  <span style="font-size: 11px; color: #dff9fb;">Orbiting nanite satellites active for ${durationRounds} rounds! Grants <strong>+${bonusShields} Shield / Overshield buffer</strong> and extends Shield Gating!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          }
        },
        default: "satellite"
      }, {
        classes: ["dialog", "warframe-dialog", "protea-dialog"]
      }).render(true);
    });
  }

  // ==========================================
  // 2. BLAZE ARTILLERY (Ramping Plasma Turret)
  // ==========================================
  if (baseName === "blaze artillery") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-crosshairs animate-pulse"></i> Blaze Artillery Rapid Turret Deployed</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Automated plasma turret locks onto enemies in a 130° arc! Rapidly fires piercing plasma bolts (<strong>2d10 Heat</strong>), increasing damage by <strong>+100% per consecutive hit</strong>!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 2d10 Heat damage roll
  }

  // ==========================================
  // 3. DISPENSARY (Combat Logistics Station)
  // ==========================================
  if (baseName === "dispensary") {
    const durationRounds = Math.max(1, Math.round(5 * (powerDuration / 100)));

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-medkit animate-pulse"></i> Dispensary Unit Materialized</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;">Logistics beacon deployed for ${durationRounds} rounds!<br/>
        ➔ Drops a <strong>Vitality Health Orb (+100 HP)</strong> every 3 seconds.<br/>
        ➔ Drops a <strong>Universal Ammo Box</strong> every 6 seconds.<br/>
        ➔ Drops a <strong>Void Energy Orb (+50 Energy)</strong> every 9 seconds!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. TEMPORAL ANCHOR (Spacetime Rewind & Implosion)
  // ==========================================
  if (baseName === "temporal anchor") {
    const existingAnchor = actor.effects.find(e => !e.disabled && e.name.includes("Temporal Anchor"));

    if (existingAnchor) {
      // Rewind Spacetime
      await actor.deleteEmbeddedDocuments("ActiveEffect", [existingAnchor.id]);

      const snapshot = actor.getFlag("warframe-ttrpg", "temporalSnapshot") || {};
      if (snapshot.health !== undefined) {
        await actor.update({
          "system.health.value": snapshot.health,
          "system.shields.value": snapshot.shields,
          "system.energy.value": snapshot.energy
        });
      }

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
          <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-history animate-pulse"></i> Temporal Anchor: Spacetime Rewound!</strong><br/>
          <span style="font-size: 11px; color: #e0d0ea;">Protea rewinds spacetime back to the drop point!<br/>
          ➔ <strong>Restoration:</strong> Health (${snapshot.health || "100"}), Shields (${snapshot.shields || "150"}), and Energy restored to original state.<br/>
          ➔ <strong>Implosion:</strong> All damage dealt during the anchor window detonates in a massive <strong>4d12 Blast Implosion</strong>!</span>
        </div>
      `;
      return { handled: false, cardExtraHTML };
    }

    // Drop Anchor
    await actor.setFlag("warframe-ttrpg", "temporalSnapshot", {
      health: Number(actor.system.health?.value) || 100,
      shields: Number(actor.system.shields?.value) || 150,
      energy: Number(actor.system.energy?.value) || 100
    });

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Temporal Anchor (Spacetime Drop)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/protea/TemporalAnchor.png",
      origin: actor.uuid,
      duration: { rounds: 3 },
      description: "Temporal Anchor: Spacetime anchored. If lethal damage is taken or recast, rewinds to anchor point and detonates stored damage!",
      flags: { core: { statusId: "temporal_anchor" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid #8e44ad; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-anchor animate-pulse"></i> Temporal Anchor Planted</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Anchor fixed in spacetime for 3 rounds! Protea records all actions; taking fatal damage or recasting rewinds time to restore all HP/Energy and unleashes an explosive implosion!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
