/**
 * Warframe TTRPG - Citrine Mechanics Module
 * Canonical implementation of Citrine abilities (The Crystal Bastion)
 */

export async function handleCitrineAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Fractured Blast
  if (baseName === "fractured blast") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Fractured Blast (Guaranteed Health & Energy Orbs)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/citrine/FracturedBlast.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["bleeding"],
          description: "Struck by crystalline shrapnel: Afflicted with Bleed and Impact procs. Slain while affected drops guaranteed Health and Energy Orbs!",
          flags: { core: { statusId: "fractured_blast_orbs" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(173, 20, 87, 0.08); border: 1px solid #ad1457; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-gem"></i> <strong>Fractured Blast Slashed:</strong> Crystal shards slash through ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"}! Targets are marked for <strong>100% Guaranteed Health & Energy Orb drops</strong> on death!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Preserving Shell
  if (baseName === "preserving shell") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));
    const maxDR = Math.min(90, Math.round(90 * strMult));

    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: `Preserving Shell (Scaling to ${maxDR}% DR)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/citrine/PreservingShell.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.damageReduction", value: 50, mode: 2, priority: 25 }
        ],
        description: `Preserving Shell Active: Starts at 50% Damage Reduction and ramps up to ${maxDR}% DR as Tenno score kills and assists! Decays slowly if no kills are scored.`,
        flags: { core: { statusId: "preserving_shell" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(194, 24, 91, 0.08); border: 1px solid #c2185b; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-shield-alt"></i> <strong>Preserving Shell Envelops Squad:</strong> Defensive crystalline layer deployed to ${squad.map(a => a.name).join(", ")}! Begins at 50% DR and ramps up to <strong>${maxDR}% Damage Reduction</strong> on squad kills!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Prismatic Gem
  if (baseName === "prismatic gem") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));
    const dice = ability.name.includes("III") ? 3 : (ability.name.includes("II") ? 2 : 1);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 8px; background: rgba(156, 39, 176, 0.08); border: 1px solid #9c27b0; border-radius: 4px; font-size: 11px; color: #e1bee7;">
        <div style="margin-bottom: 6px;">
          <i class="fas fa-certificate" style="color: #ba68c8;"></i> <strong>Gemme Prismatique Déployée :</strong> Gemme en lévitation déployée pour ${durationRounds} rounds ! Projette des rayons d'éléments multiples (Feu, Glace, Poison, Électricité) dès qu'un allié attaque à proximité ! Augmente les chances et la durée des effets de statut du groupe de +100%.
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; font-size: 10.5px; font-family: 'Orbitron', sans-serif;">
          <div style="background: rgba(235, 47, 6, 0.15); border: 1px solid #eb2f06; padding: 4px 6px; border-radius: 3px; color: #ff7675; display: flex; justify-content: space-between; align-items: center;">
            <span>🔥 <strong>Feu (Chaleur) :</strong></span> <span>[[/r ${dice}d4[Heat]]]</span>
          </div>
          <div style="background: rgba(116, 185, 255, 0.15); border: 1px solid #74b9ff; padding: 4px 6px; border-radius: 3px; color: #74b9ff; display: flex; justify-content: space-between; align-items: center;">
            <span>❄️ <strong>Glace (Froid) :</strong></span> <span>[[/r ${dice}d4[Cold]]]</span>
          </div>
          <div style="background: rgba(253, 203, 110, 0.15); border: 1px solid #fdcb6e; padding: 4px 6px; border-radius: 3px; color: #ffeaa7; display: flex; justify-content: space-between; align-items: center;">
            <span>⚡ <strong>Électricité :</strong></span> <span>[[/r ${dice}d4[Electricity]]]</span>
          </div>
          <div style="background: rgba(0, 184, 148, 0.15); border: 1px solid #00b894; padding: 4px 6px; border-radius: 3px; color: #55efc4; display: flex; justify-content: space-between; align-items: center;">
            <span>🧪 <strong>Poison (Toxine) :</strong></span> <span>[[/r ${dice}d4[Toxin]]]</span>
          </div>
        </div>
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 4. Crystallize
  if (baseName === "crystallize") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Crystallize (Crystal Weak Spot / 300% Red Crits)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/citrine/Crystallize.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          changes: [
            { key: "system.criticalChance.bonus", value: 300, mode: 2, priority: 30 }
          ],
          description: "Pierced by crystal geysers: Paralyzed in place. Fragile crystal growths sprout on body; shooting crystal growths guarantees 300% Red Critical Hits!",
          flags: { core: { statusId: "crystallize_red_crits" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(123, 31, 162, 0.08); border: 1px solid #7b1fa2; border-radius: 4px; font-size: 10.5px; color: #e1bee7;">
        <i class="fas fa-bullseye"></i> <strong>Crystallize Geysers Erupted:</strong> Crystalline spires spear through ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"}! Paralyzes victims and forces <strong>300% Red Critical Hits</strong> on crystal growths!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
