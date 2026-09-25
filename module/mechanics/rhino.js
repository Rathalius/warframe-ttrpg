/**
 * Warframe TTRPG - Rhino Mechanics Module
 * Canonical implementation of Rhino abilities (The Unstoppable Juggernaut)
 */

export async function handleRhinoAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Rhino Charge
  if (baseName === "rhino charge") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Rhino Charge (Ragdolled & Prone)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/rhino/RhinoCharge.png",
          origin: actor.uuid,
          duration: { rounds: 1 },
          statuses: ["prone"],
          description: "Gored and plowed through by Rhino: Ragdolled into the air and knocked flat.",
          flags: { core: { statusId: "rhino_charge_ragdoll" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px; font-size: 10.5px; color: #fde68a;">
        <i class="fas fa-truck-monster"></i> <strong>Rhino Charge Plowed:</strong> Unstoppable charge bulldozes ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"}! Sends foes flying into ragdoll knockdowns!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Iron Skin
  if (baseName === "iron skin") {
    const armorVal = Number(actor.system.armor?.value) || 100;
    const skinHealth = Math.round((200 + (2.5 * armorVal)) * strMult);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Iron Skin (${skinHealth} Absorption)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/rhino/IronSkin.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      statuses: ["iron_skin"],
      changes: [
        { key: "system.shields.bonus", value: skinHealth, mode: 2, priority: 20 }
      ],
      description: `Iron Skin Active: Fortified with hardened ferrite armor. Grants a +${skinHealth} absorption buffer and complete immunity to status procs, knockdowns, and staggers!`,
      flags: { core: { statusId: "iron_skin" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(243, 156, 18, 0.08); border: 1px solid #f39c12; border-radius: 4px; font-size: 10.5px; color: #fde68a;">
        <i class="fas fa-shield-alt"></i> <strong>Iron Skin Fortified:</strong> +${skinHealth} damage absorption buffer deployed! Full status effect, knockdown, and stagger immunity.
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 3. Roar
  if (baseName === "roar") {
    const roarDmgBoost = Math.round(50 * strMult);
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const member of squad) {
      await member.createEmbeddedDocuments("ActiveEffect", [{
        name: `Roar (+${roarDmgBoost}% Damage)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/rhino/Roar.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.damageBonus.value", value: roarDmgBoost, mode: 2, priority: 20 }
        ],
        description: `Roar of the Rhino: Battle morale surged! +${roarDmgBoost}% damage bonus to all weapon attacks and offensive abilities.`,
        flags: { core: { statusId: "roar_buff" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(230, 126, 34, 0.08); border: 1px solid #e67e22; border-radius: 4px; font-size: 10.5px; color: #fde68a;">
        <i class="fas fa-bullhorn"></i> <strong>Rhino Roar Active:</strong> +${roarDmgBoost}% damage bonus granted to ${squad.map(a => a.name).join(", ")} for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Rhino Stomp
  if (baseName === "rhino stomp") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Rhino Stomp (Time Disruption Stasis)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/rhino/RhinoStomp.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["paralyzed"],
          description: "Suspended in anti-gravity time stasis! Helplessly floats in mid-air in slow-motion, unable to move or act.",
          flags: { core: { statusId: "rhino_stomp_stasis" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(211, 84, 0, 0.08); border: 1px solid #d35400; border-radius: 4px; font-size: 10.5px; color: #fde68a;">
        <i class="fas fa-shoe-prints"></i> <strong>Rhino Stomp Cataclysm:</strong> Rhino breaks time itself! Suspends ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"} in slow-motion anti-gravity stasis for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
