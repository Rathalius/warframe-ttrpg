/**
 * Warframe TTRPG - Oberon Mechanics Module
 * Canonical implementation of Oberon abilities
 */

export async function handleOberonAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Smite
  if (baseName === "smite") {
    const orbCount = Math.round(6 * strMult);

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Smite (Infused Radiation / Knockdown)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/oberon/Smite.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Struck by holy radiation smite, knocked prone and radiating seeking holy energy.",
          flags: { core: { statusId: "smite_knockdown" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(76, 175, 80, 0.08); border: 1px solid #4caf50; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-crosshairs"></i> <strong>Smite Holy Burst:</strong> Primary target knocked prone! Disperses <strong>${orbCount} Seeking Holy Orbs</strong> tracking nearby foes, dealing damage equal to 35% of the target's maximum health!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Hallowed Ground
  if (baseName === "hallowed ground") {
    const armorBonus = Math.round(200 * strMult);
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    // Squad members standing on Hallowed Ground
    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      // Purge status ailments
      const debuffs = member.effects.filter(e => e.statuses && e.statuses.size > 0 && !e.name.toLowerCase().includes("hallowed"));
      if (debuffs.length > 0) {
        await member.deleteEmbeddedDocuments("ActiveEffect", debuffs.map(e => e.id));
      }

      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: `Hallowed Ground (+${armorBonus} Armor & Cleanse)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/oberon/HallowedGround.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.armor.value", value: armorBonus, mode: 2, priority: 20 }
        ],
        description: `Sanctified Ground: Purged of all status effects! +${armorBonus} Armor bonus and complete immunity to status procs and knockdowns while within the sacred zone.`,
        flags: { core: { statusId: "hallowed_ground" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(139, 195, 74, 0.08); border: 1px solid #8bc34a; border-radius: 4px; font-size: 10.5px; color: #dcedc8;">
        <i class="fas fa-leaf"></i> <strong>Hallowed Ground Sanctified:</strong> Sacred carpet carpets the battlefield for ${durationRounds} rounds! Enemies suffer continuous Radiation damage & confusion. Allies granted <strong>+${armorBonus} Armor</strong> and total status effect/knockdown immunity!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Renewal
  if (baseName === "renewal") {
    const healPerRound = Math.round(40 * strMult);
    const ironRenewalArmor = Math.round(300 * strMult);
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      const curHP = Number(member.system.health?.value) || 100;
      const maxHP = Number(member.system.health?.max) || 100;
      await member.update({ "system.health.value": Math.min(maxHP, curHP + healPerRound) });

      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: `Renewal (+${healPerRound} HP/Rnd & Iron Renewal +${ironRenewalArmor} Armor)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/oberon/Renewal.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.armor.value", value: ironRenewalArmor, mode: 2, priority: 20 }
        ],
        description: `Renewal Active: Restores +${healPerRound} Health every round. Iron Renewal synergy grants +${ironRenewalArmor} Armor! Phoenix Renewal wards against fatal death strikes.`,
        flags: { core: { statusId: "renewal_buff" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(46, 125, 50, 0.08); border: 1px solid #2e7d32; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-heartbeat"></i> <strong>Renewal Channeled:</strong> Restores <strong>+${healPerRound} HP</strong> immediately and each round to ${squad.map(a => a.name).join(", ")}! Triggers <strong>Iron Renewal (+${ironRenewalArmor} Armor)</strong> and wards squad against fatal blows!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Reckoning
  if (baseName === "reckoning") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Reckoning (100% Armor Strip & Blind)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/oberon/Reckoning.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["blind"],
          changes: [
            { key: "system.armor.value", value: 0, mode: 5, priority: 50 }
          ],
          description: "Violently lifted and slammed into the earth. Armor is completely stripped (100%) and vision blinded. Enemies slain while affected drop guaranteed Health Orbs.",
          flags: { core: { statusId: "reckoning_slam" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(56, 142, 60, 0.08); border: 1px solid #388e3c; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-gavel"></i> <strong>Reckoning Cataclysm:</strong> Enemies hoisted skyward and slammed down with seismic force! Survivors suffer <strong>100% Armor Strip</strong> and radial blindness. Slain enemies spawn Health Orbs!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
