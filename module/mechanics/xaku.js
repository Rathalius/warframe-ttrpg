/**
 * Warframe TTRPG - Xaku Mechanics Module
 * Canonical implementation of Xaku abilities (The Broken Warframe & Void Energy)
 */

export async function handleXakuAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Xata's Whisper
  if (baseName === "xata's whisper" || baseName === "xatas whisper") {
    const voidDmg = Math.round(25 * strMult);
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Xata's Whisper (+${voidDmg}% Void Damage)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/xaku/XatasWhisper.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.damageBonus.value", value: voidDmg, mode: 2, priority: 25 }
      ],
      description: `Void Infusion: Adds +${voidDmg}% true Void damage to all weapon attacks. Bullets create miniature Void attractor bubbles on enemies!`,
      flags: { core: { statusId: "xatas_whisper" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(3, 169, 244, 0.08); border: 1px solid #03a9f4; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-ghost"></i> <strong>Xata's Whisper Imbued:</strong> Tenno weapons infused with <strong>+${voidDmg}% Void Damage</strong> for ${durationRounds} rounds! Gunfire spawns bullet attractor bubbles!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Grasp of Lohk
  if (baseName === "grasp of lohk") {
    const gunCount = Math.min(16, Math.max(4, Math.round(6 * (Number(actor.system.powerRange?.value || 100) / 100))));
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    // Disarm targeted enemies
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Grasp of Lohk (Disarmed / Staggered)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/xaku/GraspOfLohk.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["disarmed"],
          description: "Weapons ripped from hands by Void tendrils! Disarmed and forced into melee.",
          flags: { core: { statusId: "grasp_disarmed" } }
        }]);
      }
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Grasp of Lohk (${gunCount} Spectral Cannons)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/xaku/GraspOfLohk.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `${gunCount} stolen weapons float around Xaku as autonomous Void turrets, rapidly firing at any enemy within range!`,
      flags: { core: { statusId: "grasp_of_lohk" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 188, 212, 0.08); border: 1px solid #00bcd4; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-crosshairs"></i> <strong>Grasp of Lohk Siphoned:</strong> Ripped firearms away from enemies! <strong>${gunCount} Floating Void Guns</strong> hover around Xaku, auto-targeting nearby foes!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. The Lost (Modal: Accuse / Gaze / Deny)
  if (baseName === "the lost") {
    const dialogContent = `
      <div style="text-align: center; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">Invoke one of the three lost components of Xaku:</p>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="xaku-lost-btn" data-mode="accuse" style="background: rgba(156, 39, 176, 0.2); border: 1px solid #ab47bc; color: #e1bee7; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-users-slash"></i> Accuse (Corrupt Allies)
          </button>
          <button type="button" class="xaku-lost-btn" data-mode="gaze" style="background: rgba(3, 169, 244, 0.2); border: 1px solid #29b6f6; color: #b3e5fc; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-eye"></i> Gaze (100% Armor/Shield Strip Aura)
          </button>
          <button type="button" class="xaku-lost-btn" data-mode="deny" style="background: rgba(239, 83, 80, 0.2); border: 1px solid #e57373; color: #ffcdd2; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-bolt"></i> Deny (Void Laser & Anti-Sentient)
          </button>
        </div>
      </div>
    `;

    const chosenMode = await new Promise((resolve) => {
      let resolved = false;
      const dlg = new Dialog({
        title: "Xaku - The Lost",
        content: dialogContent,
        buttons: {},
        render: (html) => {
          html.find(".xaku-lost-btn").click((ev) => {
            const mode = $(ev.currentTarget).data("mode");
            resolved = true;
            dlg.close();
            resolve(mode);
          });
        },
        close: () => {
          if (!resolved) resolve("gaze");
        }
      }, { classes: ["dialog", "warframe-dialog", "xaku-lost-dialog"], width: 440 });
      dlg.render(true);
    });

    if (chosenMode === "gaze") {
      for (const t of targets) {
        if (t.actor) {
          await t.actor.createEmbeddedDocuments("ActiveEffect", [{
            name: "The Lost: Gaze (100% Armor & Shield Strip Aura)",
            icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/xaku/TheLost.png",
            origin: actor.uuid,
            duration: { rounds: 4 },
            statuses: ["paralyzed"],
            changes: [
              { key: "system.armor.value", value: 0, mode: 5, priority: 50 },
              { key: "system.shields.value", value: 0, mode: 5, priority: 50 }
            ],
            description: "Trapped in Gaze Void Stasis: Target and all enemies within 12m have 100% of Armor and Shields completely stripped!",
            flags: { core: { statusId: "xaku_gaze" } }
          }]);
        }
      }
      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(3, 169, 244, 0.08); border: 1px solid #03a9f4; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
          <i class="fas fa-eye"></i> <strong>The Lost: Gaze Invoked:</strong> Trapped target in Void stasis! Creates a 12m aura stripping <strong>100% of all Armor and Shields</strong>!
        </div>
      `;
      return { handled: true, cardExtraHTML };
    } else if (chosenMode === "accuse") {
      for (const t of targets) {
        if (t.actor) {
          await t.actor.createEmbeddedDocuments("ActiveEffect", [{
            name: "The Lost: Accuse (Corrupted Ally)",
            icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/xaku/TheLost.png",
            origin: actor.uuid,
            duration: { rounds: 4 },
            description: "Corrupted by the Void: Fights alongside Tenno against other enemies.",
            flags: { core: { statusId: "xaku_accuse" } }
          }]);
        }
      }
      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(156, 39, 176, 0.08); border: 1px solid #9c27b0; border-radius: 4px; font-size: 10.5px; color: #e1bee7;">
          <i class="fas fa-users-slash"></i> <strong>The Lost: Accuse Invoked:</strong> Corrupted ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "targets"} into allied fighters!
        </div>
      `;
      return { handled: true, cardExtraHTML };
    } else {
      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(239, 83, 80, 0.08); border: 1px solid #ef5350; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
          <i class="fas fa-bolt"></i> <strong>The Lost: Deny Invoked:</strong> Sweeping Void beam fires, lifting survivors and stripping Sentient damage resistances!
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }
  }

  // 4. The Vast Untime
  if (baseName === "the vast untime") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "The Vast Untime (75% Evasion / Ability Freeze)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/xaku/TheVastUntime.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.evasion.bonus", value: 75, mode: 2, priority: 30 },
        { key: "system.speed.land.value", value: 15, mode: 2, priority: 20 }
      ],
      description: "Outer armor shattered into flying shrapnel: 75% evasion to all attacks, +15ft speed, and all active abilities are FROZEN in duration indefinitely!",
      flags: { core: { statusId: "vast_untime" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(2, 136, 209, 0.08); border: 1px solid #0288d1; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-skull"></i> <strong>The Vast Untime Shattered:</strong> Armor explodes into shrapnel! Xaku gains <strong>75% Dodge Evasion</strong>, +15ft Speed, and <strong>freezes the duration of all active abilities</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
