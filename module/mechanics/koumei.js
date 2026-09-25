/**
 * Warframe TTRPG - Koumei Mechanics Module
 * Canonical implementation of Koumei abilities (Fate, Decrees & Marionettes)
 */

export async function handleKoumeiAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Kumihimo
  if (baseName === "kumihimo") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Kumihimo (Threads of Fate / Tethered)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/koumei/Kumihimo.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["restrained"],
          description: "Entangled in threads of fate: Restrained in place and continuously afflicted with random status ailments.",
          flags: { core: { statusId: "kumihimo_threads" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(233, 30, 99, 0.08); border: 1px solid #e91e63; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-network-wired"></i> <strong>Kumihimo Threads Woven:</strong> 24 strings of fate crisscross the area! Foes stepping through are tethered and continuously bombarded by random elemental status effects!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Omikuji (Decree of Fate)
  if (baseName === "omikuji") {
    const decrees = [
      { name: "Fleet-Footed Fortune", buff: "+25% Movement Speed", key: "system.speed.land.value", val: 15, desc: "Challenge: Sprint 50m in battle." },
      { name: "Deadly Precision", buff: "+50% Critical Hit Chance", key: "system.criticalChance.bonus", val: 50, desc: "Challenge: Land 3 headshots." },
      { name: "Striking Wrath", buff: "+40% Melee & Weapon Damage", key: "system.damageBonus.value", val: 40, desc: "Challenge: Defeat 5 foes." },
      { name: "Impenetrable Weave", buff: "+300 Overguard Buffer", key: "system.shields.bonus", val: 300, desc: "Challenge: Cast 2 abilities." }
    ];

    // Roll 3 fate dice
    const roll = await new Roll("3d6").evaluate();
    const dIndex = roll.total % decrees.length;
    const chosenDecree = decrees[dIndex];
    const isTriple = roll.dice[0].results.every(r => r.result === roll.dice[0].results[0].result);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Omikuji Decree: ${chosenDecree.name} (${chosenDecree.buff})`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/koumei/Omikuji.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      changes: [
        { key: chosenDecree.key, value: chosenDecree.val * (isTriple ? 2 : 1), mode: 2, priority: 25 }
      ],
      description: `Decree of Fate: ${chosenDecree.desc} Granted permanent blessing: ${chosenDecree.buff}${isTriple ? " (TRIPLE SIXES: DOUBLE EFFECT!)" : ""}.`,
      flags: { core: { statusId: "omikuji_decree" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(156, 39, 176, 0.08); border: 1px solid #9c27b0; border-radius: 4px; font-size: 10.5px; color: #e1bee7;">
        <i class="fas fa-dice"></i> <strong>Omikuji Rolled [${roll.result}]:</strong> ${chosenDecree.name}! ${isTriple ? "<strong>TRIPLE ROLL TRIPLE BLESSING!</strong>" : ""} Granted <strong>${chosenDecree.buff}</strong>!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Tsugihagi
  if (baseName === "tsugihagi") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));
    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      // Purge debuffs
      const bad = member.effects.filter(e => e.statuses && e.statuses.size > 0 && !e.name.toLowerCase().includes("tsugihagi"));
      if (bad.length > 0) {
        await member.deleteEmbeddedDocuments("ActiveEffect", bad.map(e => e.id));
      }

      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: "Tsugihagi (Deflection & Purified)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/koumei/Tsugihagi.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.damageReduction", value: 50, mode: 2, priority: 20 }
        ],
        description: "Enveloped in protective silk charms: All debuffs removed, +50% damage reduction.",
        flags: { core: { statusId: "tsugihagi_silk" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(233, 30, 99, 0.08); border: 1px solid #e91e63; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-scroll"></i> <strong>Tsugihagi Warded:</strong> All status conditions purged from squad! Granted <strong>50% Damage Reduction</strong> for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Bunraku
  if (baseName === "bunraku") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Bunraku (Puppet Stasis / 5 Status Procs)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/koumei/Bunraku.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Suspended like a marionette puppet: Completely immobilized and afflicted with 5 random status effects stacked to level 3!",
          flags: { core: { statusId: "bunraku_marionette" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(171, 71, 188, 0.08); border: 1px solid #ab47bc; border-radius: 4px; font-size: 10.5px; color: #f3e5f5;">
        <i class="fas fa-theater-masks"></i> <strong>Bunraku Marionette Theatre:</strong> ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "Enemies"} suspended on fate strings like helpless puppets! Inflicts <strong>5 random status ailments</strong> simultaneously!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
