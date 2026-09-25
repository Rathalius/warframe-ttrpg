/**
 * Warframe TTRPG - Octavia Mechanics Module
 * Canonical implementation of Octavia abilities (The Maestro of Mandachord)
 */

export async function handleOctaviaAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Mallet
  if (baseName === "mallet") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(233, 30, 99, 0.08); border: 1px solid #e91e63; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-drum"></i> <strong>Mallet Resonator Deployed:</strong> Rhythm beacon deployed for ${durationRounds} rounds! Absorbs all incoming enemy damage, multiplies it by <strong>2.5x</strong>, and pulses rhythmic kinetic blasts back at all foes in range!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Resonator
  if (baseName === "resonator") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Resonator (Charmed / Pacified)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/octavia/Resonator.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["pacified"],
          description: "Entranced by the rolling rollerball music: Completely pacified and compelled to follow the beat, unable to attack Tenno.",
          flags: { core: { statusId: "resonator_pacified" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(171, 71, 188, 0.08); border: 1px solid #ab47bc; border-radius: 4px; font-size: 10.5px; color: #f3e5f5;">
        <i class="fas fa-music"></i> <strong>Resonator Roller Released:</strong> Rolling bass rollerball charms and pacifies ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"}! Carries the Mallet along with it!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Metronome (Interactive Mandachord Harmony Modal)
  if (baseName === "metronome") {
    const dialogContent = `
      <div style="text-align: center; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">Synchronize with the Mandachord rhythm to activate a harmony buff:</p>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="octavia-rhythm-btn" data-buff="nocturne" style="background: rgba(63, 81, 181, 0.2); border: 1px solid #5c6bc0; color: #c5cae9; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-user-secret"></i> Nocturne (Crouch: Invisibility)
          </button>
          <button type="button" class="octavia-rhythm-btn" data-buff="vivace" style="background: rgba(0, 188, 212, 0.2); border: 1px solid #26c6da; color: #b2ebf2; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-running"></i> Vivace (Jump: +35% Speed)
          </button>
          <button type="button" class="octavia-rhythm-btn" data-buff="opera" style="background: rgba(233, 30, 99, 0.2); border: 1px solid #ec407a; color: #f8bbd0; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-bullseye"></i> Opera (Shoot: +35% Multishot)
          </button>
          <button type="button" class="octavia-rhythm-btn" data-buff="forte" style="background: rgba(245, 124, 0, 0.2); border: 1px solid #ffa726; color: #ffe0b2; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-fist-raised"></i> Forte (Melee: +30% Melee Dmg)
          </button>
        </div>
      </div>
    `;

    const chosenBuff = await new Promise((resolve) => {
      let resolved = false;
      const dlg = new Dialog({
        title: "Octavia - Metronome Mandachord",
        content: dialogContent,
        buttons: {},
        render: (html) => {
          html.find(".octavia-rhythm-btn").click((ev) => {
            const buff = $(ev.currentTarget).data("buff");
            resolved = true;
            dlg.close();
            resolve(buff);
          });
        },
        close: () => {
          if (!resolved) resolve("nocturne");
        }
      }, { classes: ["dialog", "warframe-dialog", "octavia-rhythm-dialog"], width: 460 });
      dlg.render(true);
    });

    const durationRounds = Math.max(1, Math.round(3 * durMult));
    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    let effectName = "Metronome: Nocturne (Invisibility)";
    let changes = [];
    if (chosenBuff === "nocturne") {
      effectName = "Metronome: Nocturne (Invisibility)";
    } else if (chosenBuff === "vivace") {
      effectName = "Metronome: Vivace (+35% Movement Speed)";
      changes = [{ key: "system.speed.land.value", value: 15, mode: 2, priority: 20 }];
    } else if (chosenBuff === "opera") {
      effectName = "Metronome: Opera (+35% Multishot)";
      changes = [{ key: "system.multishot.bonus", value: 35, mode: 2, priority: 20 }];
    } else {
      effectName = "Metronome: Forte (+30% Melee Damage)";
      changes = [{ key: "system.damageBonus.value", value: 30, mode: 2, priority: 20 }];
    }

    for (const member of squad) {
      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: effectName,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/octavia/Metronome.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: changes,
        description: `Metronome Rhythm: In sync with the Mandachord! Granted ${effectName}.`,
        flags: { core: { statusId: `metronome_${chosenBuff}` } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(142, 36, 170, 0.08); border: 1px solid #8e24aa; border-radius: 4px; font-size: 10.5px; color: #e1bee7;">
        <i class="fas fa-headphones"></i> <strong>Metronome Harmony Triggered:</strong> Synchronized with <strong>${chosenBuff.toUpperCase()}</strong>! Granted to ${squad.map(a => a.name).join(", ")} for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Amp
  if (baseName === "amp") {
    const dmgBuff = Math.round(100 * strMult);
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: `Amp (+${dmgBuff}% Weapon Damage)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/octavia/Amp.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.damageBonus.value", value: dmgBuff, mode: 2, priority: 25 }
        ],
        description: `Acoustic Amp: Doubles Mallet damage and radius! Increases weapon damage by +${dmgBuff}% for all Tenno in the acoustic zone!`,
        flags: { core: { statusId: "octavia_amp" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(233, 30, 99, 0.08); border: 1px solid #e91e63; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-volume-up"></i> <strong>Amp Acoustic Field Deployed:</strong> Massive acoustic amplifier active! Doubles Mallet range and damage, and grants <strong>+${dmgBuff}% Weapon Damage</strong> to squad!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  return { handled: false };
}
