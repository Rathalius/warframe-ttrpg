/**
 * Warframe TTRPG - Dante Specialized Ability Mechanics
 * Canonical implementations:
 * - Noctua: Equips Exalted Grimoire tome Noctua (fires void pages)
 * - Light Verse: Inscribes life verse granting squad Overguard
 * - Dark Verse: Inscribes ruin verse dealing Slash damage and bleed
 * - Final Verse: Unleashes chronicle based on verse combination (Triumph, Tragedy, Wordwarden, Pageflight)
 */

export async function handleDanteAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. NOCTUA (Exalted Grimoire Tome)
  // ==========================================
  if (baseName === "noctua") {
    const existingNoctua = actor.items.find(i => i.type === "weapon" && (i.name.includes("Noctua") || i.flags?.["warframe-ttrpg"]?.isNoctua));

    if (existingNoctua) {
      await actor.deleteEmbeddedDocuments("Item", [existingNoctua.id]);
      const effects = actor.effects.filter(e => !e.disabled && e.name.includes("Noctua"));
      if (effects.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", effects.map(e => e.id));

      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Noctua Grimoire Closed</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    const flatBonus = Math.max(0, Math.floor((powerStrength - 100) / 10));
    const formula = flatBonus > 0 ? `3d10 + ${flatBonus}` : "3d10";

    await actor.createEmbeddedDocuments("Item", [{
      name: "Noctua (Exalted Grimoire Tome)",
      type: "weapon",
      img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/dante/Noctua.png",
      system: {
        type: "secondary",
        damage: formula,
        damageType: "Slash/Void",
        range: "40m Grimoire",
        equipped: true
      },
      flags: { "warframe-ttrpg": { isNoctua: true } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.1); border: 1px solid #f39c12; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-book-open animate-pulse"></i> Noctua Grimoire Opened</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Exalted tome equipped (${formula} Void/Slash). Flings razor-sharp flying pages of void prose and homing word missiles!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. LIGHT VERSE (Overguard Inscription)
  // ==========================================
  if (baseName === "light verse") {
    const overguardGain = Math.round(250 * (powerStrength / 100));
    const curShields = Number(actor.system.shields?.value) || 0;
    const maxShields = Number(actor.system.shields?.max) || 150;
    await actor.update({ "system.shields.value": Math.min(maxShields * 3, curShields + overguardGain) });

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-feather animate-pulse"></i> Light Verse Inscribed</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Dante pens a verse of life! Grants <strong>+${overguardGain} Overguard</strong> to Dante and squad members.</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. DARK VERSE (Ruin Inscription)
  // ==========================================
  if (baseName === "dark verse") {
    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Dark Verse (Severing Bleed)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/dante/DarkVerse.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["bleeding"],
          description: "Dark Verse: Words of ruin carve into flesh. Bleeding true Slash damage each round.",
          flags: { core: { statusId: "bleeding" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-feather-alt animate-pulse"></i> Dark Verse Inscribed</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Dante writes words of ruin! Strikes enemies in a wide fan with razor Slash ink, inflicting guaranteed Bleed procs.</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 2d10 Slash damage roll
  }

  // ==========================================
  // 4. FINAL VERSE (Triumph, Tragedy, Wordwarden, Pageflight)
  // ==========================================
  if (baseName === "final verse") {
    return new Promise((resolve) => {
      new Dialog({
        title: "Dante - Final Verse Composition",
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #fff;">
            <p style="margin-bottom: 8px;">Select narrative composition for <strong>Final Verse</strong>:</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="padding: 6px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                <strong style="color: #f1c40f;"><i class="fas fa-shield-alt"></i> Triumph (Light + Light)</strong><br/>
                +500 Squad Overguard & Health regen.
              </div>
              <div style="padding: 6px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
                <strong style="color: #ff6b6b;"><i class="fas fa-skull"></i> Tragedy (Dark + Dark)</strong><br/>
                Detonates all active DoTs for 3x damage!
              </div>
              <div style="padding: 6px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                <strong style="color: #54a0ff;"><i class="fas fa-book"></i> Wordwarden (Light + Dark)</strong><br/>
                Spawns floating Noctua copies for all allies.
              </div>
              <div style="padding: 6px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                <strong style="color: #2ecc71;"><i class="fas fa-crow"></i> Pageflight (Dark + Light)</strong><br/>
                4 Paragrimm birds strip enemy status resistance.
              </div>
            </div>
          </div>
        `,
        buttons: {
          triumph: {
            icon: '<i class="fas fa-shield-alt"></i>',
            label: "Triumph",
            callback: async () => {
              const overguard = Math.round(500 * (powerStrength / 100));
              const curShields = Number(actor.system.shields?.value) || 0;
              const maxShields = Number(actor.system.shields?.max) || 150;
              await actor.update({ "system.shields.value": Math.min(maxShields * 4, curShields + overguard) });

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 4px;">
                  <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-shield-alt"></i> Final Verse: Triumph Recited</strong><br/>
                  <span style="font-size: 11px; color: #fef9e7;">Triumphant chronicle surges across the squad! Grants <strong>+${overguard} Overguard buffer</strong> and status immunity to all allies!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          tragedy: {
            icon: '<i class="fas fa-skull"></i>',
            label: "Tragedy",
            callback: async () => {
              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
                  <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-skull-crossbones"></i> Final Verse: Tragedy Detonated</strong><br/>
                  <span style="font-size: 11px; color: #f5cd79;">Tragic catastrophe consumes the battlefield! Detonates all active Slash, Heat, and Toxin procs on enemies for <strong>3x accumulated damage</strong> in an instant blood burst!</span>
                </div>
              `;
              resolve({ handled: false, cardExtraHTML });
            }
          },
          wordwarden: {
            icon: '<i class="fas fa-book"></i>',
            label: "Wordwarden",
            callback: async () => {
              const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
              await actor.createEmbeddedDocuments("ActiveEffect", [{
                name: "Wordwarden (Noctua Escorts)",
                icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/dante/FinalVerse.png",
                origin: actor.uuid,
                duration: { rounds: durationRounds },
                description: "Wordwarden: Autonomous floating copies of Noctua accompany squad, copying weapon fire with void bolts.",
                flags: { core: { statusId: "wordwarden" } }
              }]);

              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; border-radius: 4px;">
                  <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-book"></i> Final Verse: Wordwarden Summoned</strong><br/>
                  <span style="font-size: 11px; color: #dff9fb;">Spectral copies of Noctua manifest beside all squad members for ${durationRounds} rounds! They auto-fire void bolts mirroring ally attacks!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          },
          pageflight: {
            icon: '<i class="fas fa-crow"></i>',
            label: "Pageflight",
            callback: async () => {
              const cardExtraHTML = `
                <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; border-radius: 4px;">
                  <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-crow"></i> Final Verse: Pageflight Paragrimms</strong><br/>
                  <span style="font-size: 11px; color: #a8e6cf;">4 mystical Paragrimm spirit birds take flight, swarming hostiles, drawing aggro, and increasing damage taken by <strong>+50%</strong>!</span>
                </div>
              `;
              resolve({ handled: true, cardExtraHTML });
            }
          }
        },
        default: "triumph"
      }, {
        classes: ["dialog", "warframe-dialog", "dante-dialog"]
      }).render(true);
    });
  }

  return { handled: false };
}
