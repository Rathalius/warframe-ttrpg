/**
 * Warframe TTRPG - Khora Specialized Ability Mechanics
 * Canonical implementations:
 * - Whipclaw: Metallic whip strike dealing heavy Slash/Impact damage
 * - Ensnare: Traps target in living metal cords, pulling and clustering all nearby foes
 * - Venari: Modal stance command for Kavat companion (Attack Bleed, Protect Disarm/Pin, Heal Aura)
 * - Strangledome: Weaves geodesic dome of living chains suspending up to 26 foes and drawing enemy fire
 */

export async function handleKhoraAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. WHIPCLAW
  // ==========================================
  if (baseName === "whipclaw") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-wave-square animate-pulse"></i> Whipclaw Metallic Crack</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Cracks barbed metallic whip! Striking targets trapped in Ensnare or Strangledome deals <strong>DOUBLE DAMAGE</strong> and causes the chains to vibrate with radial shockwaves!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d10 damage roll
  }

  // ==========================================
  // 2. ENSNARE (Living Metal Cluster Pull)
  // ==========================================
  if (baseName === "ensnare") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const ensnaredNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Ensnare (Living Metal Bind)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/khora/Ensnare.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["entangled"],
          changes: [{ key: "system.speed.land.value", value: -100, mode: 2, priority: 20 }],
          description: "Ensnare: Bound in living metal cords. Completely immobilized and dragged into central cluster.",
          flags: { core: { statusId: "entangled" } }
        }]);
        ensnaredNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.08); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-spider animate-pulse"></i> Ensnare Cords Deployed</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">${ensnaredNames.length > 0 ? `Targeted hostiles (${ensnaredNames.join(", ")}) wrapped in razor wire and pulled together into a helpless cluster for ${durationRounds} rounds!` : "Living metal cords deployed, waiting to wrap hostiles."}</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. VENARI (Kavat Posture Command)
  // ==========================================
  if (baseName === "venari") {
    return new Promise((resolve) => {
      new Dialog({
        title: "Venari - Kavat Combat Posture",
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #fff;">
            <p style="margin-bottom: 8px;">Direct Venari's combat behavioral posture:</p>
            <div style="display: flex; gap: 8px;">
              <div style="flex: 1; padding: 6px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
                <strong style="color: #ff6b6b;"><i class="fas fa-paw"></i> Attack Posture</strong><br/>
                Venari leaps at target inflicting deep Slash bleed and armor shred.
              </div>
              <div style="flex: 1; padding: 6px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                <strong style="color: #54a0ff;"><i class="fas fa-shield-alt"></i> Protect Posture</strong><br/>
                Venari intercepts dangerous threats, disarming and pinning them.
              </div>
              <div style="flex: 1; padding: 6px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                <strong style="color: #2ecc71;"><i class="fas fa-heart"></i> Heal Posture</strong><br/>
                Venari radiates healing aura restoring +50 HP/round to squad.
              </div>
            </div>
          </div>
        `,
        buttons: {
          attack: {
            icon: '<i class="fas fa-paw"></i>',
            label: "Attack Posture",
            callback: async () => {
              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
                  <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-paw"></i> Venari: Attack Posture Engaged</strong><br/>
                  <span style="font-size: 11px; color: #f5cd79;">Venari snarls and pounces upon the enemy, tearing flesh for <strong>3d8 Slash damage</strong> and inflicting severe bleed procs!</span>
                </div>
              `;
              resolve({ handled: false, cardExtraHTML });
            }
          },
          protect: {
            icon: '<i class="fas fa-shield-alt"></i>',
            label: "Protect Posture",
            callback: async () => {
              for (const token of targets) {
                if (token.actor) {
                  await token.actor.createEmbeddedDocuments("ActiveEffect", [{
                    name: "Venari Pin (Disarmed & Pinned)",
                    icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/khora/Venari.png",
                    origin: actor.uuid,
                    duration: { rounds: 2 },
                    statuses: ["prone"],
                    description: "Venari Pin: Pinned under the razor claws of Venari. Disarmed.",
                    flags: { core: { statusId: "pinned" } }
                  }]);
                }
              }

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                  <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-shield-alt"></i> Venari: Protect Posture Engaged</strong><br/>
                  <span style="font-size: 11px; color: #dff9fb;">Venari locks down the designated hostile, tackling them to the floor, disarming their weapon, and preventing attacks!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          heal: {
            icon: '<i class="fas fa-heart"></i>',
            label: "Heal Posture",
            callback: async () => {
              const healRate = Math.round(50 * (powerStrength / 100));
              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: `Venari Heal Aura (+${healRate} HP/rnd)`,
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/khora/Venari.png",
                origin: actor.uuid,
                duration: { rounds: 99 },
                description: `Venari Healing: Venari accompanies Khora, radiating restorative vitality of +${healRate} HP each round.`,
                flags: { core: { statusId: "venari_heal" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                  <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-heart"></i> Venari: Heal Posture Engaged</strong><br/>
                  <span style="font-size: 11px; color: #a8e6cf;">Venari radiates a tranquil life ward, regenerating <strong>+${healRate} Health</strong> every round to Khora and allies within 15m!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          }
        },
        default: "attack"
      }, {
        classes: ["dialog", "warframe-dialog", "khora-dialog"]
      }).render(true);
    });
  }

  // ==========================================
  // 4. STRANGLEDOME (Living Chain Geodesic Cage)
  // ==========================================
  if (baseName === "strangledome") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const trappedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Strangledome (Suspended in Agony)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/khora/Strangledome.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Strangledome: Suspended upside down in living chains. Takes continuous damage and draws all incoming projectile fire to the dome.",
          flags: { core: { statusId: "strangledome_trapped" } }
        }]);
        trappedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.1); border: 1px solid #9b59b6; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-network-wired animate-pulse"></i> Strangledome Geodesic Cage Erected</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Massive dome of living chains erected for ${durationRounds} rounds!<br/>
        ${trappedNames.length > 0 ? `➔ <strong>Snares Hostiles:</strong> ${trappedNames.join(", ")} strung up upside down in agony!<br/>` : ""}
        ➔ <strong>Aggro Magnet:</strong> Draws 100% of all enemy gunfire away from squad members and into the dome structure!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
