/**
 * Warframe TTRPG - Inaros Specialized Ability Mechanics
 * Canonical implementations:
 * - Desiccation: Blinding sand wave, opens Finishers and leeches health
 * - Devour: Traps target in quicksand, feed to restore HP and summon Sand Shadow
 * - Sandstorm: Transforms into sand vortex ragdolling and devouring foes
 * - Scarab Shell / Swarm: Consumes HP for +100% Armor; unleash swarm to stun foes and heal squad!
 */

export async function handleInarosAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. DESICCATION (Sand Blind & Finisher Leech)
  // ==========================================
  if (baseName === "desiccation") {
    const durationRounds = Math.max(1, Math.round(2 * (powerDuration / 100)));
    const blindedNames = [];

    for (const token of targets) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Desiccation Sand Blind (Open to Finisher)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/inaros/Desiccation.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["blind"],
          description: "Desiccation Blind: Cursed sand in eyes. Blinded and vulnerable to Melee Stealth Finishers!",
          flags: { core: { statusId: "blind" } }
        }]);
        blindedNames.push(token.name);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.08); border: 1px solid #f39c12; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-eye-slash animate-pulse"></i> Desiccation Cursed Sand Wave</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">${blindedNames.length > 0 ? `➔ <strong>Blinded Foes:</strong> ${blindedNames.join(", ")} for ${durationRounds} rounds.<br/>➔ <strong>Finisher Leech:</strong> Targets are wide open to Finishers! Finishers restore <strong>25% Max HP</strong> to Inaros!` : "Blinds foes in a 15m cone, opening them for Finishers."}</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d8 Corrosive damage roll
  }

  // ==========================================
  // 2. DEVOUR (Quicksand & Sand Shadow)
  // ==========================================
  if (baseName === "devour") {
    const targetToken = targets[0];
    const victimName = targetToken ? targetToken.name : "Hostile";

    if (targetToken && targetToken.actor) {
      await targetToken.actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Devoured (Trapped in Quicksand)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/inaros/Devour.png",
        origin: actor.uuid,
        duration: { rounds: 3 },
        statuses: ["paralyzed"],
        description: "Devoured: Sinking in cursed quicksand. Inaros and allies can devour to restore full Health!",
        flags: { core: { statusId: "quicksand" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-hourglass-start animate-pulse"></i> Devour Quicksand Entrapment</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;"><strong>${victimName}</strong> is trapped in swallowing quicksand!<br/>
        ➔ <strong>Feast:</strong> Interacting with the victim drains their health to restore <strong>+50 HP/rnd</strong> to squad!<br/>
        ➔ <strong>Sand Shadow:</strong> When victim dies, a Sand Golem clone rises to fight for Inaros!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. SANDSTORM (Whirlwind Vortex)
  // ==========================================
  if (baseName === "sandstorm") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.1); border: 1px solid #f39c12; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-tornado animate-pulse"></i> Sandstorm Whirlwind Engaged</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Inaros transforms into a roaring desert cyclone! Sucks in all enemies within 15m, ragdolling them and flinging them violently into walls for continuous Impact/Slash damage!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 2d10 damage roll
  }

  // ==========================================
  // 4. SCARAB SHELL / SCARAB SWARM
  // ==========================================
  if (baseName === "scarab swarm" || baseName === "scarab shell") {
    const existingShell = actor.effects.find(e => !e.disabled && e.name.includes("Scarab Armor"));

    if (!existingShell) {
      // Forge Scarab Armor (+100% Armor)
      const bonusArmor = Math.round(200 * (powerStrength / 100));
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Scarab Armor (+${bonusArmor} Armor)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/inaros/ScarabSwarm.png",
        origin: actor.uuid,
        duration: { rounds: 99 },
        changes: [{ key: "system.armor.value", value: bonusArmor, mode: 2, priority: 20 }],
        description: `Scarab Armor: Carapace of hardened sacred beetles provides +${bonusArmor} Armor and immunity to status procs.`,
        flags: { core: { statusId: "scarab_armor" } }
      }]);

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
          <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-bug animate-pulse"></i> Scarab Shell Forged</strong><br/>
          <span style="font-size: 11px; color: #a8e6cf;">Inaros hardens his carapace with living scarabs!<br/>
          ➔ <strong>Armor Fortification:</strong> <strong>+${bonusArmor} Armor</strong> and complete status immunity!<br/>
          ➔ Recast at enemies to release the Scarab Swarm to heal squad!</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    } else {
      // Discharge Scarab Swarm
      await actor.deleteEmbeddedDocuments("ActiveEffect", [existingShell.id]);

      for (const token of targets) {
        if (token.actor) {
          await token.actor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Scarab Swarm (Devoured by Beetles)",
            icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/inaros/ScarabSwarm.png",
            origin: actor.uuid,
            duration: { rounds: 3 },
            statuses: ["paralyzed"],
            description: "Devoured by Scarabs: Thrashing in agony. Siphons health to all nearby Tenno.",
            flags: { core: { statusId: "scarab_swarm" } }
          }]);
        }
      }

      // Squad heal
      const healAmount = Math.round(150 * (powerStrength / 100));
      const curHP = Number(actor.system.health?.value) || 0;
      const maxHP = Number(actor.system.health?.max) || 100;
      await actor.update({ "system.health.value": Math.min(maxHP, curHP + healAmount) });

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.1); border: 1px solid #e67e22; border-radius: 4px;">
          <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-bug animate-pulse"></i> Scarab Swarm Unleashed</strong><br/>
          <span style="font-size: 11px; color: #f5cd79;">Sacred beetles swarm hostiles, paralyzing them in agony!<br/>
          ➔ <strong>Squad Life Fountain:</strong> Siphons health to restore <strong>+${healAmount} Health</strong> to Inaros and squad within 15m!</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }
  }

  return { handled: false };
}
