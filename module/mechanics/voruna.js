/**
 * Warframe TTRPG - Voruna Mechanics Module
 * Canonical implementation of Voruna abilities (Wolf Pack Huntress)
 */

export async function handleVorunaAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Shroud of Dynar
  if (baseName === "shroud of dynar") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));
    const critBonus = Math.round(100 * strMult);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Shroud of Dynar (Stealth / +${critBonus}% Red Crits)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/voruna/ShroudOfDynar.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.criticalChance.bonus", value: critBonus, mode: 2, priority: 30 },
        { key: "system.meleeSpeed.value", value: 50, mode: 2, priority: 20 }
      ],
      description: `Dynar's Cloak: Complete invisibility, +50% melee attack speed, and +${critBonus}% Critical Hit Chance with forced bleed procs on melee strikes!`,
      flags: { core: { statusId: "shroud_of_dynar" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(183, 28, 28, 0.08); border: 1px solid #b71c1c; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-paw"></i> <strong>Shroud of Dynar Cloaked:</strong> Voruna enters stealth! +50% melee speed and <strong>+${critBonus}% Critical Hit Chance</strong> with guaranteed Bleed status!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 2. Fangs of Raksh
  if (baseName === "fangs of raksh") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Fangs of Raksh (5 Random Status Procs x10 Stacks)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/voruna/FangsOfRaksh.png",
          origin: actor.uuid,
          duration: { rounds: 3 },
          statuses: ["poisoned", "bleeding"],
          description: "Raksh's bite: Inflicted with 5 random elemental and physical status effects, each applied with 10 stacks! When this enemy dies, all status effects spread to nearby foes.",
          flags: { core: { statusId: "fangs_of_raksh" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(198, 40, 40, 0.08); border: 1px solid #c62828; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-skull"></i> <strong>Fangs of Raksh Pounce:</strong> Voruna pounces onto the prey, inflicting <strong>5 random status effects with 10 stacks each</strong>! Status effects spread radially on target death!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Lycath's Hunt
  if (baseName === "lycath's hunt" || baseName === "lycaths hunt") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Lycath's Hunt (Guaranteed Health & Energy Drops)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/voruna/LycathsHunt.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: "Lycath's Pack on the prowl: Melee kills spawn guaranteed Health Orbs, and Headshot kills spawn guaranteed Energy Orbs! Status kills extend hunt duration.",
      flags: { core: { statusId: "lycaths_hunt" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(136, 14, 79, 0.08); border: 1px solid #880e4f; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-crosshairs"></i> <strong>Lycath's Hunt Commenced:</strong> Melee kills spawn <strong>guaranteed Health Orbs</strong>; Headshot kills spawn <strong>guaranteed Energy Orbs</strong>! Duration extends on status kills.
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // 4. Ulfrun's Descent
  if (baseName === "ulfrun's descent" || baseName === "ulfruns descent") {
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Ulfrun's Descent (4 Pounce Charges / +100% Dmg/Kill)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/voruna/UlfrunsDescent.png",
      origin: actor.uuid,
      duration: { rounds: 4 },
      changes: [
        { key: "system.speed.land.value", value: 20, mode: 2, priority: 20 }
      ],
      description: "Ulfrun takes over: Drops to all fours with 4 lethal pounce charges. Each pounce lunges forward dealing massive Slash damage. Each kill doubles pounce damage and heals Voruna!",
      flags: { core: { statusId: "ulfruns_descent" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(74, 20, 140, 0.08); border: 1px solid #4a148c; border-radius: 4px; font-size: 10.5px; color: #e1bee7;">
        <i class="fas fa-dog"></i> <strong>Ulfrun's Descent Unleashed:</strong> Voruna assumes wolf stance with <strong>4 lethal pounce charges</strong>! Each pounce strike slashes prey and stacks <strong>+100% damage</strong> on kill!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
