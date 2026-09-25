/**
 * Warframe TTRPG - Ash Specialized Ability Mechanics
 * Canonical implementations:
 * - Shuriken: Seeking shurikens with true armor-ignoring Slash bleed
 * - Smoke Screen: Radial stun + invisibility (+50% Crit Chance)
 * - Teleport: Blinks behind target, opening immediate Melee Finisher
 * - Blade Storm: Shadow clones assassinate all marked foes with true Finisher damage
 */

export async function handleAshAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. SHURIKEN (Armor-Bypassing Bleed)
  // ==========================================
  if (baseName === "shuriken") {
    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Shuriken Bleed (Armor Piercing)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ash/Shuriken.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["bleeding"],
          description: "Shuriken Sever: Deep arterial lacerations. Suffers true Slash damage bypassing Armor each round.",
          flags: { core: { statusId: "bleeding" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-crosshairs animate-pulse"></i> Seeking Shuriken Flung</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">2 razor ninja stars seek out enemy vitals! Guaranteed true <strong>Slash Bleed</strong> bypassing 100% of enemy Armor!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d10 damage roll
  }

  // ==========================================
  // 2. SMOKE SCREEN (Stun & Invisibility)
  // ==========================================
  if (baseName === "smoke screen") {
    const durationRounds = Math.max(1, Math.round(2 * (powerDuration / 100)));

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Smoke Screen (Staggered)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ash/SmokeScreen.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["blind"],
          description: "Smoke Blind: Coughing and disoriented in choking smoke bomb vapor.",
          flags: { core: { statusId: "blind" } }
        }]);
      }
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Smoke Screen (Invisibility +50% Crit)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ash/SmokeScreen.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      statuses: ["invisible"],
      description: "Smoke Screen: Cloaked in smoke shadows. Invisible with +50% Critical Chance.",
      flags: { core: { statusId: "invisible" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-smog animate-pulse"></i> Smoke Bomb Detonated</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;">➔ <strong>Invisibility:</strong> Ash turns completely invisible for ${durationRounds} rounds (+50% Crit Chance).<br/>
        ➔ <strong>Smoke Shock:</strong> Enemies in 5m staggered and blinded!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. TELEPORT (Blink & Open Finisher)
  // ==========================================
  if (baseName === "teleport") {
    const targetToken = targets[0];
    const victimName = targetToken ? targetToken.name : "Target";

    if (targetToken && targetToken.actor) {
      await targetToken.actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Teleport Stun (Open to Finisher)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ash/Teleport.png",
        origin: actor.uuid,
        duration: { rounds: 1 },
        statuses: ["stunned"],
        description: "Open to Finisher: Ash materialized directly behind. Completely vulnerable to instant lethal Finisher attack!",
        flags: { core: { statusId: "open_finisher" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-bolt animate-pulse"></i> Shadow Teleport</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Ash dissolves into shadow and materializes directly behind <strong>${victimName}</strong>!<br/>
        ➔ <strong>Finisher Vulnerability:</strong> Hostile is stunned and wide open for an instant lethal <strong>Melee Stealth Finisher</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. BLADE STORM (Shadow Clone Assassination)
  // ==========================================
  if (baseName === "blade storm") {
    const markedCount = Math.max(1, targets.length);

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Blade Storm Mark (Shadow Target)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/ash/BladeStorm.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["bleeding"],
          description: "Blade Storm Marked: Shadow clones descend to assassinate, delivering true Finisher damage and deadly bleeding.",
          flags: { core: { statusId: "blade_storm" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; border-radius: 4px;">
        <strong style="color: #ff6b6b; font-family: 'Orbitron';"><i class="fas fa-khanda animate-pulse"></i> Blade Storm Shadow Flurry</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Ash unleashes his army of shadow clones upon ${markedCount} marked targets!<br/>
        ➔ <strong>True Damage:</strong> Clones deliver cinematic throat-slits dealing <strong>4d12 True Slash Finisher damage</strong>, completely bypassing all enemy Armor and Shields!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d12 damage roll
  }

  return { handled: false };
}
