/**
 * Warframe TTRPG - Titania Specialized Ability Mechanics
 * Canonical implementations:
 * - Spellbind: Anti-gravity float on foes; status immunity & cleanse on allies/self
 * - Tribute: Extracts 4 soul tributes (Thorns, Dust, Full Moon, Entangle)
 * - Lantern: Creates hypnotic floating decoy beacon that charms foes and detonates
 * - Razorwing: Shrinks into 3D fairy flight, +50% Evasion, 6 Razorflies, equips Exalted Dex Pixia & Diwata!
 */

export async function handleTitaniaAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. SPELLBIND (Anti-Gravity Float & Status Immunity)
  // ==========================================
  if (baseName === "spellbind") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));

    // If targeting self or friendly allies: Cleanse + Immunity
    const isTargetingFriendly = targets.length > 0 && targets.every(t => t.actor?.uuid === actor.uuid || t.document.disposition === 1);

    if (targets.length === 0 || isTargetingFriendly) {
      const buffed = targets.length > 0 ? targets.map(t => t.actor).filter(Boolean) : [actor];
      for (const a of buffed) {
        // Cleanse existing status effects
        const curDebuffs = a.effects.filter(e => !e.disabled && e.statuses?.size > 0);
        if (curDebuffs.length > 0) await a.deleteEmbeddedDocuments("ActiveEffect", curDebuffs.map(e => e.id));

        await a.createEmbeddedDocuments("ActiveEffect", [{
          name: "Spellbind (Status Immunity)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/titania/Spellbind.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          description: "Spellbind: Surrounded by enchanted butterflies. Complete immunity to all status procs, staggers, and knockdowns.",
          flags: { core: { statusId: "spellbind_immunity" } }
        }]);
      }

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px;">
          <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-magic"></i> Spellbind Ward (Status Immunity)</strong><br/>
          <span style="font-size: 11px; color: #a8e6cf;">Enchanted butterfly shield granted to <strong>${buffed.map(b => b.name).join(", ")}</strong> for ${durationRounds} rounds! Cleansed all active status effects; complete immunity to future debuffs.</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    } else {
      // Cast on enemies: Anti-Gravity Float
      const floatedNames = [];
      for (const token of targets) {
        if (token.actor) {
          await token.actor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Spellbind Float (Helpless)",
            icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/titania/Spellbind.png",
            origin: actor.uuid,
            duration: { rounds: durationRounds },
            statuses: ["levitating"],
            changes: [{ key: "system.speed.land.value", value: -100, mode: 2, priority: 20 }],
            description: "Spellbind: Suspended helplessly floating in mid-air.",
            flags: { core: { statusId: "levitating" } }
          }]);
          floatedNames.push(token.name);
        }
      }

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.08); border: 1px solid #9b59b6; border-radius: 4px;">
          <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-feather-alt"></i> Spellbind Float</strong><br/>
          <span style="font-size: 11px; color: #e0d0ea;">Targeted foes (${floatedNames.join(", ")}) swept into zero-gravity float for ${durationRounds} rounds, dropping their firearms!</span>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }
  }

  // ==========================================
  // 2. TRIBUTE (Soul Extraction)
  // ==========================================
  if (baseName === "tribute") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Tribute Aura (Thorns & Dust)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/titania/Tribute.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: "Tribute: 50% damage reflection (Thorns) and 50% enemy accuracy penalty (Dust) within affinity range.",
      flags: { core: { statusId: "tribute_aura" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(241, 196, 15, 0.08); border: 1px solid #f1c40f; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-sparkles"></i> Tribute Soul Aura Harvested</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">➔ <strong>Thorns:</strong> Reflects 50% of incoming damage back to attackers.<br/>➔ <strong>Dust:</strong> Imposes -50% accuracy penalty on nearby enemy ranged fire for ${durationRounds} rounds!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. LANTERN (Hypnotic Beacon)
  // ==========================================
  if (baseName === "lantern") {
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const targetToken = targets[0];

    if (targetToken && targetToken.actor) {
      await targetToken.actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Lantern Beacon (Charmed Decoy)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/titania/Lantern.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["charmed"],
        description: "Lantern Beacon: Transmuted into a glowing floating lure. Nearby enemies are hypnotized and cannot attack.",
        flags: { core: { statusId: "lantern_beacon" } }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(52, 152, 219, 0.08); border: 1px solid #3498db; border-radius: 4px;">
        <strong style="color: #54a0ff; font-family: 'Orbitron';"><i class="fas fa-lightbulb animate-pulse"></i> Lantern Beacon Transmuted</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">Target lifted into a mesmerizing glowing beacon for ${durationRounds} rounds! Nearby enemies are pacified and lured helplessly towards the lantern. Explodes for Fire/Blast damage when expired!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. RAZORWING (Miniature Fairy Flight & Exalted Weapons)
  // ==========================================
  if (baseName === "razorwing") {
    const existingPixia = actor.items.find(i => i.type === "weapon" && (i.name.includes("Dex Pixia") || i.flags?.["warframe-ttrpg"]?.isDexPixia));

    if (existingPixia) {
      // Revert Razorwing
      const oldWeapons = actor.items.filter(i => i.type === "weapon" && (i.name.includes("Dex Pixia") || i.name.includes("Diwata")));
      if (oldWeapons.length > 0) await actor.deleteEmbeddedDocuments("Item", oldWeapons.map(i => i.id));
      const oldEffects = actor.effects.filter(e => !e.disabled && e.name.includes("Razorwing"));
      if (oldEffects.length > 0) await actor.deleteEmbeddedDocuments("ActiveEffect", oldEffects.map(e => e.id));

      const cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;">
          <strong style="color: #fff; font-family: 'Orbitron';">Razorwing Deactivated: Returned to Full Size</strong>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }

    // Activate Razorwing
    const flatBonus = Math.max(0, Math.floor((powerStrength - 100) / 10));
    const pixiaFormula = flatBonus > 0 ? `3d8 + ${flatBonus}` : "3d8";
    const diwataFormula = flatBonus > 0 ? `2d10 + ${flatBonus}` : "2d10";

    // 1. Create Dex Pixia & Diwata
    await actor.createEmbeddedDocuments("Item", [
      {
        name: "Dex Pixia (Exalted Dual Pistols)",
        type: "weapon",
        img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/titania/Razorwing.png",
        system: {
          type: "secondary",
          damage: pixiaFormula,
          damageType: "Slash/Puncture",
          range: "45m Ranged",
          equipped: true
        },
        flags: { "warframe-ttrpg": { isDexPixia: true } }
      },
      {
        name: "Diwata (Exalted Archwing Blade)",
        type: "weapon",
        img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/titania/Razorwing.png",
        system: {
          type: "melee",
          damage: diwataFormula,
          damageType: "Puncture",
          range: "Melee",
          equipped: true
        },
        flags: { "warframe-ttrpg": { isDiwata: true } }
      }
    ]);

    // 2. Apply Razorwing flight effect (+50% Evasion, flight)
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Razorwing Flight (+50% Evasion)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/titania/Razorwing.png",
      origin: actor.uuid,
      duration: { rounds: 99 },
      statuses: ["flying"],
      changes: [
        { key: "system.speed.land.value", value: 30, mode: 2, priority: 20 }
      ],
      description: `Razorwing: Shrunk into fairy form! 3D Archwing flight with +30 ft speed, +50% Evasion to dodge all attacks, and 6 Razorfly escorts.`,
      flags: { core: { statusId: "razorwing_flight" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(0, 206, 201, 0.1); border: 1px solid #00cec9; border-radius: 4px;">
        <strong style="color: #81ecec; font-family: 'Orbitron';"><i class="fas fa-feather animate-pulse"></i> Razorwing Fairy Flight Engaged</strong><br/>
        <span style="font-size: 11px; color: #dff9fb;">➔ <strong>Fairy Stature:</strong> Shrunk to pixie size, gaining <strong>+50% Evasion</strong> against all incoming attacks.<br/>
        ➔ <strong>Exalted Arsenal:</strong> <strong>Dex Pixia</strong> (${pixiaFormula}) and <strong>Diwata</strong> (${diwataFormula}) equipped.<br/>
        ➔ <strong>Razorfly Squadron:</strong> 6 razorflies deployed to harass and draw enemy fire!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
