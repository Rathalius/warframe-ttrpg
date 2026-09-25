/**
 * Warframe TTRPG - Grendel Specialized Ability Mechanics
 * Canonical implementations:
 * - Feast: Swallows enemies whole into gut (grants +250 Armor per swallowed enemy)
 * - Nourish: Digests swallowed foes; heals HP, grants 2x squad Energy multiplier & Viral buff
 * - Pulverize: Curls into a giant bowling meatball, flattening foes and stripping armor
 * - Regurgitate: Spews swallowed foes like toxic mortar artillery shells
 */

export async function handleGrendelAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const abilityName = ability.name || "";

  // ==========================================
  // 1. FEAST (Swallow Enemies Whole)
  // ==========================================
  if (baseName === "feast") {
    const swallowedCount = Math.min(5, Math.max(1, targets.length));
    const bonusArmor = swallowedCount * 250;

    for (const token of targets.slice(0, 5)) {
      if (token.actor) {
        await token.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Swallowed in Grendel's Belly",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/grendel/Feast.png",
          origin: actor.uuid,
          duration: { rounds: 3 },
          statuses: ["paralyzed"],
          description: "Swallowed: Trapped in the acid stomach of Grendel. Slowly digesting, helpless.",
          flags: { core: { statusId: "digesting" } }
        }]);
      }
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Feast Full Belly (+${bonusArmor} Armor)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/grendel/Feast.png",
      origin: actor.uuid,
      duration: { rounds: 4 },
      changes: [{ key: "system.armor.value", value: bonusArmor, mode: 2, priority: 20 }],
      description: `Feast: ${swallowedCount} enemies digesting in belly, providing +${bonusArmor} bonus Armor!`,
      flags: { core: { statusId: "feast_armor" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(243, 156, 18, 0.08); border: 1px solid #f39c12; border-radius: 4px;">
        <strong style="color: #f1c40f; font-family: 'Orbitron';"><i class="fas fa-utensils animate-pulse"></i> Feast: Enemies Inhaled Whole</strong><br/>
        <span style="font-size: 11px; color: #fef9e7;">Grendel opens his cavernous maw and devours <strong>${swallowedCount} enemies</strong> whole into his stomach!<br/>
        ➔ <strong>Belly Fortification:</strong> +250 Armor per swallowed foe (Total: <strong>+${bonusArmor} Armor</strong>)!<br/>
        ➔ Swallowed enemies can be expelled with <strong>Regurgitate</strong> or consumed with <strong>Nourish</strong>!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 2. NOURISH (Squad 2x Energy & Viral Retaliation)
  // ==========================================
  if (baseName === "nourish") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const healAmount = Math.round(100 * (powerStrength / 100));
    const bonusViral = Math.round(75 * (powerStrength / 100));

    // Heal Grendel
    const curHP = Number(actor.system.health?.value) || 0;
    const maxHP = Number(actor.system.health?.max) || 100;
    await actor.update({ "system.health.value": Math.min(maxHP, curHP + healAmount) });

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Nourish (2x Energy & +${bonusViral}% Viral Dmg)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/grendel/Nourish.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [{ key: "system.damageBonus.value", value: bonusViral, mode: 2, priority: 20 }],
      description: `Nourish: All energy gains are DOUBLED (2x Multiplier). Weapons deal +${bonusViral}% bonus Viral damage, and taking damage retaliates with radial Viral procs!`,
      flags: { core: { statusId: "nourish_buff" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid #8e44ad; border-radius: 4px;">
        <strong style="color: #be2edd; font-family: 'Orbitron';"><i class="fas fa-biohazard animate-pulse"></i> Nourish Digestive Surge Active</strong><br/>
        <span style="font-size: 11px; color: #e0d0ea;">Grendel digests consumed matter, belching viral energy for ${durationRounds} rounds!<br/>
        ➔ <strong>Regeneration:</strong> Restored <strong>+${healAmount} Health</strong>.<br/>
        ➔ <strong>Energy Multiplier:</strong> <strong>2x Energy Gain</strong> on all energy sources for Grendel and squad!<br/>
        ➔ <strong>Viral Infusion:</strong> +${bonusViral}% Viral damage on weapon hits and retaliatory viral pulses!</span>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. PULVERIZE (Bowling Meatball Form)
  // ==========================================
  if (baseName === "pulverize") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(230, 126, 34, 0.1); border: 1px solid #e67e22; border-radius: 4px;">
        <strong style="color: #e67e22; font-family: 'Orbitron';"><i class="fas fa-bowling-ball animate-pulse"></i> Pulverize Meatball Engaged</strong><br/>
        <span style="font-size: 11px; color: #f5cd79;">Grendel curls into a massive boulder-sized meatball, bowling over enemy ranks at high velocity! Flattens enemies prone, strips <strong>50% enemy Armor</strong> on impact, and bounces high into the air for crushing slams!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 3d10 damage roll
  }

  // ==========================================
  // 4. REGURGITATE (Toxic Belly Mortar)
  // ==========================================
  if (baseName === "regurgitate") {
    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(39, 174, 96, 0.1); border: 1px solid #27ae60; border-radius: 4px;">
        <strong style="color: #2ecc71; font-family: 'Orbitron';"><i class="fas fa-skull-crossbones animate-pulse"></i> Regurgitate Bile Artillery Launched</strong><br/>
        <span style="font-size: 11px; color: #a8e6cf;">Grendel vomits out a bile-soaked enemy like a high-speed mortar shell! Deals catastrophic <strong>4d10 Toxin/Acid AoE damage</strong> and melts enemy armor in a 6m toxic puddle!</span>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 4d10 damage roll
  }

  return { handled: false };
}
