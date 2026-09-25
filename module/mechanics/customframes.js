/**
 * Warframe TTRPG - Custom Warframes Mechanics Module
 * Canonical / System implementation for Campaign Custom Warframes:
 * - Temple (Rock God & Lizzie Axe-Guitar)
 * - Oraxia (The Arachnid Huntress)
 * - Follie (The Ink & Illusion Virtuoso)
 * - Nokko (The Fungal Shroom Alchemist)
 * - Uriel (The Demonic Infernus Archon)
 * - Sirius & Orion (The Celestial Binary Twins)
 */

export async function handleCustomFrameAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // ==========================================
  // 1. TEMPLE (Rock God / Lizzie Axe-Guitar)
  // ==========================================
  if (baseName === "lizzie" || baseName === "solo exalté" || baseName === "solo exalte") {
    // Equips Exalted Axe-Guitar weapon
    const existing = actor.items.find(i => i.name.toLowerCase().includes("lizzie") && i.type === "weapon");
    if (!existing) {
      await actor.createEmbeddedDocuments("Item", [{
        name: "Lizzie (Exalted Infested Axe-Guitar)",
        type: "weapon",
        img: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/temple/300px-Lizzie.webp",
        system: {
          weaponType: "melee",
          damageFormula: "4d10 + @strMod",
          damageType: "slash",
          criticalChance: 35,
          criticalMultiplier: 2.5,
          statusChance: 35,
          range: "Melee (2m)",
          attackBonus: "@proficiencyBonus + @strMod",
          description: "Temple's signature Infested Axe-Guitar! Unleashes earth-shaking sonic riffs and heavy shredding slash chords.",
          isExalted: true
        }
      }]);
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(229, 57, 53, 0.08); border: 1px solid #e53935; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-guitar"></i> <strong>Lizzie Wielded:</strong> Temple cranks the volume to 11! <strong>Exalted Infested Axe-Guitar Lizzie equipped</strong>! Sonic riffs build Amplification and stagger all nearby foes!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  if (baseName === "overdrive") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));
    const bonusDmg = Math.round(50 * strMult);

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Overdrive (+${bonusDmg}% Fire & Sonic Dmg)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/temple/overdrive.webp",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.damageBonus.value", value: bonusDmg, mode: 2, priority: 25 },
        { key: "system.meleeSpeed.value", value: 30, mode: 2, priority: 20 }
      ],
      description: `Overdrive Active: Cranks amp wattage past the safety limit! +${bonusDmg}% bonus Heat and Sonic damage on all attacks, and +30% melee attack speed!`,
      flags: { core: { statusId: "temple_overdrive" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(244, 81, 30, 0.08); border: 1px solid #f4511e; border-radius: 4px; font-size: 10.5px; color: #ffccbc;">
        <i class="fas fa-bolt"></i> <strong>Overdrive Unleashed:</strong> High-gain overdrive active! +${bonusDmg}% Heat & Sonic damage, +30% attack speed for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  if (baseName === "plainte du ripper") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Plainte du Ripper (Deafened & Stunned)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/temple/plainte du ripper.webp",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["deafened", "stunned"],
          description: "Eardrums ruptured by agonizing guitar screech: Stunned, deafened, and unable to cast abilities.",
          flags: { core: { statusId: "ripper_screech" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(186, 104, 200, 0.08); border: 1px solid #ba68c8; border-radius: 4px; font-size: 10.5px; color: #f3e5f5;">
        <i class="fas fa-volume-mute"></i> <strong>Plainte du Ripper:</strong> Agonizing high-frequency guitar screech stuns and deafens ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"}!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  if (baseName === "pyrotechnique") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Pyrotechnique (Scorched & Blinded)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/temple/pyrotechnique.webp",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["blind"],
          description: "Blinded by stage pyrotechnics and suffering continuous Heat burns.",
          flags: { core: { statusId: "stage_pyro" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(255, 112, 67, 0.08); border: 1px solid #ff7043; border-radius: 4px; font-size: 10.5px; color: #ffccbc;">
        <i class="fas fa-fire"></i> <strong>Pyrotechnique Stage Eruption:</strong> Blazing pyrotechnic blast blinds enemies and sets the stage ablaze!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. ORAXIA (The Arachnid Huntress)
  // ==========================================
  if (baseName === "mercy's kiss" || baseName === "mercys kiss") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Mercy's Kiss (Venomous Paralysis)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Oraxia/150px-Mercy'sKissIcon(xWhite).webp",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["poisoned", "paralyzed"],
          description: "Arachnid fangs inject neurotoxic venom: Paralyzed and suffering lethal Toxin DoT bypassing shields.",
          flags: { core: { statusId: "oraxia_kiss" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(76, 175, 80, 0.08); border: 1px solid #4caf50; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-skull"></i> <strong>Mercy's Kiss Injected:</strong> Fatal venom paralyzes target and deals massive shield-bypassing Toxin damage!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  if (baseName === "silken stride") {
    const speedBoost = Math.round(20 * strMult);
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Silken Stride (+${speedBoost} ft & Wall Run)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Oraxia/150px-SilkenStrideIcon(xWhite).webp",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.speed.land.value", value: speedBoost, mode: 2, priority: 20 },
        { key: "system.evasion.bonus", value: 30, mode: 2, priority: 20 }
      ],
      description: "Traverses vertical walls and ceilings effortlessly with silken web lines. +20ft speed, +30% evasion.",
      flags: { core: { statusId: "silken_stride" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(56, 142, 60, 0.08); border: 1px solid #388e3c; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-spider"></i> <strong>Silken Stride Active:</strong> Oraxia scuttles across walls and ceilings with <strong>+${speedBoost} ft Speed</strong> and +30% Evasion!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  if (baseName === "webbed embrace") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Webbed Embrace (Cocooned Restraint)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Oraxia/150px-WebbedEmbraceIcon(xWhite).webp",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["restrained"],
          description: "Cocooned in dense sticky spider silk: Restrained, unable to move or fire weapons, takes +50% damage.",
          flags: { core: { statusId: "webbed_embrace" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(139, 195, 74, 0.08); border: 1px solid #8bc34a; border-radius: 4px; font-size: 10.5px; color: #dcedc8;">
        <i class="fas fa-cubes"></i> <strong>Webbed Embrace Trapped:</strong> Silk cocoons ensnare ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "targets"}!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  if (baseName === "widow's brood" || baseName === "widows brood") {
    const spiderCount = Math.max(4, Math.round(4 * strMult));
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Widow's Brood (${spiderCount} Spiderlings)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Oraxia/150px-Widow'sBroodIcon(xWhite).webp",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `${spiderCount} spiderling hatchlings swarm enemies, latching onto faces, blinding them, and injecting corrosive venom!`,
      flags: { core: { statusId: "widows_brood" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(46, 125, 50, 0.08); border: 1px solid #2e7d32; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-bug"></i> <strong>Widow's Brood Hatched:</strong> Swarm of <strong>${spiderCount} arachnid hatchlings</strong> unleashed to devour and venom-coat foes!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. FOLLIE (The Ink & Illusion Virtuoso)
  // ==========================================
  if (baseName === "forced perspective") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Forced Perspective (Distorted Stasis)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Follie/150px-ForcedPerspectiveIcon(xWhite).webp",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["confused"],
          description: "Optical geometry distorted: Target perceives distance incorrectly, missing all attacks and stumbling prone.",
          flags: { core: { statusId: "forced_perspective" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(121, 85, 72, 0.08); border: 1px solid #795548; border-radius: 4px; font-size: 10.5px; color: #d7ccc8;">
        <i class="fas fa-compress"></i> <strong>Forced Perspective Warped:</strong> Distorts geometric scale and distance! Enemies miss all attacks and stumble confused!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  if (baseName === "plein air") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Plein Air (Ink Splashed / 100% Armor Strip)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Follie/150px-PleinAirIcon(xWhite).webp",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.armor.value", value: 0, mode: 5, priority: 50 }
          ],
          description: "Bathed in corrosive watercolor ink: Armor completely stripped (100%) and vision blinded.",
          flags: { core: { statusId: "plein_air_ink" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(93, 64, 55, 0.08); border: 1px solid #5d4037; border-radius: 4px; font-size: 10.5px; color: #d7ccc8;">
        <i class="fas fa-paint-brush"></i> <strong>Plein Air Canvas Splashed:</strong> Corrosive watercolor ink washes over the sector! Strips <strong>100% of Armor</strong> and blinds foes for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  if (baseName === "self portrait") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Self Portrait (Ink Clone Mimic)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Follie/150px-SelfPortraitIcon(xWhite).webp",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: "Paints a living ink clone of Follie! Draws all enemy fire and mimics Follie's weapon attacks.",
      flags: { core: { statusId: "self_portrait_clone" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(109, 76, 65, 0.08); border: 1px solid #6d4c41; border-radius: 4px; font-size: 10.5px; color: #d7ccc8;">
        <i class="fas fa-portrait"></i> <strong>Self Portrait Painted:</strong> Living ink duplicate manifests! Draws enemy aggro and mimics weapon attacks for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  if (baseName === "shadowgraph") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Shadowgraph (Dark Silhouette / Bleeding)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Follie/150px-ShadowgraphIcon(xWhite).webp",
          origin: actor.uuid,
          duration: { rounds: 3 },
          statuses: ["bleeding"],
          description: "Silhouette detached and shredded by dark ink needles! Suffering severe true Slash bleed.",
          flags: { core: { statusId: "shadowgraph_bleed" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(62, 39, 35, 0.2); border: 1px solid #3e2723; border-radius: 4px; font-size: 10.5px; color: #d7ccc8;">
        <i class="fas fa-camera-retro"></i> <strong>Shadowgraph Silhouette Captured:</strong> Targets have their silhouettes severed, suffering catastrophic true Bleed damage!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. NOKKO (The Fungal Shroom Alchemist)
  // ==========================================
  if (baseName === "brightbonnet") {
    const healVal = Math.round(60 * strMult);
    const squad = [actor];
    for (const t of targets) {
      if (t.actor && t.actor.uuid !== actor.uuid) squad.push(t.actor);
    }

    for (const m of squad) {
      const curHP = Number(m.system.health?.value) || 100;
      const maxHP = Number(m.system.health?.max) || 100;
      await m.update({ "system.health.value": Math.min(maxHP, curHP + healVal) });
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(139, 195, 74, 0.08); border: 1px solid #8bc34a; border-radius: 4px; font-size: 10.5px; color: #dcedc8;">
        <i class="fas fa-spa"></i> <strong>Brightbonnet Spores Released:</strong> Bioluminescent spores bloom! Restores <strong>+${healVal} HP</strong> to squad and illuminates hidden enemies!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  if (baseName === "reroot") {
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Reroot (Subterranean Mycelium / +1000 Armor)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-RerootIcon(xWhite).webp",
      origin: actor.uuid,
      duration: { rounds: 3 },
      changes: [
        { key: "system.armor.value", value: 1000, mode: 2, priority: 30 }
      ],
      description: "Roots into subterranean mycelial network: +1000 Armor, immune to knockdowns, regenerates +50 HP/round.",
      flags: { core: { statusId: "nokko_reroot" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(104, 159, 56, 0.08); border: 1px solid #689f38; border-radius: 4px; font-size: 10.5px; color: #dcedc8;">
        <i class="fas fa-tree"></i> <strong>Reroot Anchored:</strong> Nokko sinks deep roots into the mycelial network! Gained <strong>+1000 Armor</strong> and rapid health regeneration!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  if (baseName === "sporespring" || baseName === "stinkbrain") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Stinkbrain / Sporespring (Hallucinogenic Spores)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-StinkbrainIcon(xWhite).webp",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["confused", "poisoned"],
          description: "Choked by hallucinogenic fungal cloud: Confused, vomiting, and taking Viral/Toxin DoT.",
          flags: { core: { statusId: "fungal_stinkbrain" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(51, 105, 30, 0.08); border: 1px solid #33691e; border-radius: 4px; font-size: 10.5px; color: #dcedc8;">
        <i class="fas fa-biohazard"></i> <strong>Fungal Spores Exploded:</strong> Dense mushroom spores engulf ${targets.length > 0 ? targets.map(t => t.name).join(", ") : "enemies"}, confusing them and inflicting Viral DoT!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 5. URIEL (The Demonic Infernus Archon)
  // ==========================================
  if (baseName === "brimstone" || baseName === "infernalis") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Brimstone Fire (Hellfire Scorch / 100% Armor Melt)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-BrimstoneIcon(xWhite).webp",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.armor.value", value: 0, mode: 5, priority: 50 }
          ],
          description: "Engulfed in sulfurous demonic fire: 100% of Armor melted away; suffering heavy Heat DoT.",
          flags: { core: { statusId: "uriel_brimstone" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(198, 40, 40, 0.08); border: 1px solid #c62828; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-fire-flame-curved"></i> <strong>Brimstone Hellfire Erupted:</strong> Sulfurous flames melt <strong>100% of enemy Armor</strong> and scorch the ground!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  if (baseName === "demonium") {
    const durationRounds = Math.max(1, Math.round(4 * durMult));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Demonium (Demonic Aspect / 75% DR)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-DemoniumIcon(xWhite).webp",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.damageReduction", value: 75, mode: 2, priority: 30 },
        { key: "system.damageBonus.value", value: 50, mode: 2, priority: 25 }
      ],
      description: "Demonic Ascendance: Sprouts blazing hellfire wings, gaining 75% Damage Reduction and +50% weapon damage!",
      flags: { core: { statusId: "uriel_demonium" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(183, 28, 28, 0.08); border: 1px solid #b71c1c; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-dragon"></i> <strong>Demonium Aspect Manifested:</strong> Demonic wings unfold! Uriel gains <strong>75% Damage Reduction</strong> and <strong>+50% Weapon Damage</strong> for ${durationRounds} rounds!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  if (baseName === "remedium") {
    const healVal = Math.round(100 * strMult);
    const maxHP = Number(actor.system.health?.max) || 100;
    const curHP = Number(actor.system.health?.value) || 100;
    await actor.update({ "system.health.value": Math.min(maxHP, curHP + healVal) });

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(136, 14, 79, 0.08); border: 1px solid #880e4f; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
        <i class="fas fa-heart"></i> <strong>Remedium Cleansing:</strong> Hellfire purifies wounds, restoring <strong>+${healVal} HP</strong> and burning away all debuffs!
      </div>
    `;
    return { handled: true, cardExtraHTML, rollFormula: "0" };
  }

  // ==========================================
  // 6. SIRIUS & ORION (The Binary Twins)
  // ==========================================
  if (baseName.includes("sirius") || baseName.includes("orion")) {
    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 188, 212, 0.08); border: 1px solid #00bcd4; border-radius: 4px; font-size: 10.5px; color: #b2ebf2;">
        <i class="fas fa-star"></i> <strong>Celestial Binary Resonance:</strong> Sirius and Orion synchronize their twin gravitational cores, granting +25% Speed and +50% Shields to both twins!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
