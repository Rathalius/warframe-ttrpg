/**
 * Warframe TTRPG - Trinity Mechanics Module
 * Canonical implementation of Trinity abilities
 */

export async function handleTrinityAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Well of Life
  if (baseName === "well of life") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Well of Life (Suspended / 100% Lifesteal)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/trinity/WellOfLife.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Suspended in telekinetic stasis. All damage dealt to this target by Tenno is converted 100% into Health healing for nearby allies! Protects squad from fatal damage by absorbing the lethal blow.",
          flags: { core: { statusId: "well_of_life" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(3, 169, 244, 0.08); border: 1px solid #03a9f4; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-hand-holding-heart"></i> <strong>Well of Life Created:</strong> Target suspended helplessly in the air! Attacking Tenno leech <strong>100% of damage dealt as Health</strong>. Redirects fatal damage away from squad members!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Energy Vampire
  if (baseName === "energy vampire") {
    const energyPerPulse = Math.round(25 * strMult);
    const durationRounds = Math.max(1, Math.round(2 * durMult));

    // Squad members receive energy
    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      const curEnergy = Number(member.system.power?.value) || 0;
      const maxEnergy = Number(member.system.power?.max) || 150;
      await member.update({ "system.power.value": Math.min(maxEnergy, curEnergy + energyPerPulse) });
    }

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Energy Vampire (${energyPerPulse} Energy/Pulse)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/trinity/EnergyVampire.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["stunned"],
          description: `Target trapped in an energy vortex, emitting 4 pulses of raw void energy. Each pulse restores +${energyPerPulse} Energy to all Tenno and deals true damage equal to 25% of current HP.`,
          flags: { core: { statusId: "energy_vampire" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 188, 212, 0.08); border: 1px solid #00bcd4; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-battery-charging"></i> <strong>Energy Vampire Siphoning:</strong> Emits 4 pulses restoring <strong>+${energyPerPulse} Energy</strong> per pulse to all squad members! Deals true damage to the target scaling with their health!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Link
  if (baseName === "link") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));
    const linkedTargets = targets.slice(0, 3);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Link (75% Damage Redirect & Status Immunity)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/trinity/Link.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.damageReduction", value: 75, mode: 2, priority: 20 }
      ],
      description: "Linked to up to 3 nearby enemies. 75% of incoming damage and 100% of all status ailments/knockdowns are transferred directly onto the linked victims!",
      flags: { core: { statusId: "trinity_link" } }
    }]);

    for (const t of linkedTargets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Linked to Trinity (Damage Transfer)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/trinity/Link.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          description: "Bound by Trinity's Link: Receives 75% of all damage and all status procs inflicted upon Trinity!",
          flags: { core: { statusId: "link_victim" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(38, 198, 218, 0.08); border: 1px solid #26c6da; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-link"></i> <strong>Link Established:</strong> Tethered to ${linkedTargets.length > 0 ? linkedTargets.map(t => t.name).join(", ") : "3 foes"}! <strong>75% of all incoming damage and 100% of status effects</strong> are redirected back to the linked targets!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Blessing
  if (baseName === "blessing") {
    const drPercent = Math.min(75, Math.round(50 * strMult));
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      const maxHP = Number(member.system.health?.max) || 100;
      const maxShields = Number(member.system.shields?.max) || 100;
      await member.update({
        "system.health.value": maxHP,
        "system.shields.value": maxShields
      });

      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: `Blessing (${drPercent}% Damage Reduction)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/trinity/Blessing.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.damageReduction", value: drPercent, mode: 2, priority: 20 }
        ],
        description: `Blessed by Trinity: 100% Health & Shields fully restored! Fortified with ${drPercent}% universal Damage Reduction against all incoming damage.`,
        flags: { core: { statusId: "trinity_blessing" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 150, 136, 0.08); border: 1px solid #009688; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-sparkles"></i> <strong>Blessing Bestowed:</strong> 100% Health & Shields instantly restored to entire squad (${squad.map(a => a.name).join(", ")})! All allies granted <strong>${drPercent}% Damage Reduction</strong> for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  return { handled: false };
}
