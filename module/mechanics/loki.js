/**
 * Warframe TTRPG - Loki Mechanics Module
 * Canonical implementation of Loki abilities (The Trickster)
 */

export async function handleLokiAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Decoy
  if (baseName === "decoy") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Decoy Deployed (100% Aggro Magnet)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/loki/Decoy.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: "Holographic Decoy deployed: Draws 100% of enemy gunfire and aggro away from Loki and Tenno allies.",
      flags: { core: { statusId: "loki_decoy" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(56, 142, 60, 0.08); border: 1px solid #388e3c; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-user-ninja"></i> <strong>Holographic Decoy Deployed:</strong> High-threat holographic decoy active for ${durationRounds} rounds! Diverts 100% of incoming gunfire and enemy aggression!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Invisibility
  if (baseName === "invisibility") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Invisibility (Undetectable / Stealth Crits)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/loki/Invisibility.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.meleeSpeed.value", value: 25, mode: 2, priority: 20 }
      ],
      description: "Active camouflage cloak: Completely undetectable by enemies and surveillance cameras. All melee attacks deal +100% stealth critical damage.",
      flags: { core: { statusId: "loki_invisibility" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(46, 125, 50, 0.08); border: 1px solid #2e7d32; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-ghost"></i> <strong>Invisibility Cloak Active:</strong> Loki vanishes from sight for ${durationRounds} rounds! Completely undetectable; melee strikes gain stealth multiplier bonuses!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Switch Teleport
  if (baseName === "switch teleport") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Switch Teleport (Disoriented)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/loki/SwitchTeleport.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["confused"],
          description: "Instantly swapped positions with Loki: Disoriented, confused, and prone to disorientation.",
          flags: { core: { statusId: "switch_disoriented" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(67, 160, 71, 0.08); border: 1px solid #43a047; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-exchange-alt"></i> <strong>Switch Teleport Translocated:</strong> Instantly traded positions with ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "target"}! Leaves target disoriented and confused!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Radial Disarm
  if (baseName === "radial disarm") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Radial Disarm (Weapons Stripped / Melee Only)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/loki/RadialDisarm.png",
          origin: actor.uuid,
          duration: { rounds: 99 },
          statuses: ["disarmed"],
          description: "All firearm and ranged weapon mechanisms permanently overloaded and destroyed! Forced into unarmed / improvised melee combat only.",
          flags: { core: { statusId: "loki_disarmed" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(27, 94, 32, 0.08); border: 1px solid #1b5e20; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-unlink"></i> <strong>Radial Disarm Pulse:</strong> Electromagnetic wave surges outward! <strong>Permanently disarms ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "all foes"}</strong> of their ranged firearms!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
