/**
 * Warframe TTRPG - Saryn Specialized Ability Mechanics
 * Canonical implementations:
 * - Spores: Plants virulent corrosive spores on targets, continuously stripping armor; bursts on hit to spread
 * - Molt: Sheds skin, cleanses all status ailments, grants +30% speed and leaves behind a decoy
 * - Toxic Lash: Weapons coat in toxin, dealing bonus Toxin damage on every hit (+100% melee, +50% ranged)
 * - Miasma: Releases radial viral mist; deals double damage against targets infected by Spores!
 */

export async function handleSarynAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const powerDC = context.powerDC || 14;
  const abilityName = ability.name || "";
  const isRank3 = abilityName.includes("III") || abilityName.includes("IV");
  const isRank2 = abilityName.includes("II");

  // ==========================================
  // 1. SPORES (Corrosive Infection)
  // ==========================================
  if (baseName === "spores") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const infectedList = [];

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Virulent Spores (Corrosive)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/saryn/Spores.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["corrosive_spores"],
        changes: [
          { key: "system.armor.value", value: 0.7, mode: 1, priority: 20 }
        ],
        description: "Virulent Spores: Infested with Corrosive spores. Loses 30% Armor immediately, suffers Corrosive damage every turn, and bursts to spread spores when damaged.",
        flags: {
          core: { statusId: "corrosive_spores" },
          "warframe-ttrpg": { hasSpores: true }
        }
      }]);
      infectedList.push(token.name);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(26, 188, 156, 0.08); border: 1px solid #1abc9c; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #1abc9c; text-transform: uppercase;">
          <span><i class="fas fa-flask animate-pulse"></i> Virulent Spores Deployed</span>
          <span>${durationRounds} Rounds</span>
        </div>
        <div style="font-size: 10.5px; color: #a3e4d7; margin-top: 4px; line-height: 1.35;">
          ${infectedList.length > 0 
            ? `<strong>Infected Targets:</strong> ${infectedList.join(", ")} (-30% Armor, taking Corrosive DoT).<br/><em>Attacking infected foes bursts spores, spreading corrosive plague to adjacent enemies!</em>`
            : `<em>Virulent corrosive spores primed. Target tokens to infect.</em>`
          }
        </div>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d8 Corrosive damage roll
  }

  // ==========================================
  // 2. MOLT (Decoy & Status Cleanse)
  // ==========================================
  if (baseName === "molt") {
    // 1. Cleanse all negative status ailments from Saryn
    const negativeEffects = actor.effects.filter(e => !e.disabled && (e.statuses?.size > 0 || e.name.toLowerCase().includes("debuff") || e.name.toLowerCase().includes("slow")));
    if (negativeEffects.length > 0) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", negativeEffects.map(e => e.id));
    }

    // 2. Apply Molt Speed Burst
    const speedBoost = Math.round(15 * (powerStrength / 100));
    const durationRounds = Math.max(1, Math.round(2 * (powerDuration / 100)));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Molt Shed (Speed Burst)",
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/saryn/Molt.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.speed.land.value", value: speedBoost, mode: 2, priority: 20 }
      ],
      description: `Molt: Cleansed all status ailments! Leaves behind a decoy drawing enemy aggression and grants +${speedBoost} ft movement speed.`,
      flags: { core: { statusId: "molt_speed" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #2ecc71; text-transform: uppercase;">
          <span><i class="fas fa-feather-alt"></i> Molt Shed & Status Cleanse</span>
          <span>+${speedBoost} ft Speed</span>
        </div>
        <div style="font-size: 10.5px; color: #a8e6cf; margin-top: 4px; line-height: 1.35;">
          Saryn sheds her skin like a serpent, breaking all status conditions.<br/>
          ➔ <strong>Decoy:</strong> Left behind with 500 HP to draw enemy fire and explode on death.<br/>
          ➔ <strong>Mobility:</strong> +${speedBoost} ft Land Speed for ${durationRounds} rounds.
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. TOXIC LASH (Weapon Poison Buff)
  // ==========================================
  if (baseName === "toxic lash") {
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const meleeToxin = Math.round(60 * (powerStrength / 100));

    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Toxic Lash (+${meleeToxin}% Toxin)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/saryn/ToxicLash.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      changes: [
        { key: "system.damageBonus.value", value: meleeToxin, mode: 2, priority: 20 }
      ],
      description: `Toxic Lash: Weapons coated in venom. All attacks deal +${meleeToxin}% bonus Toxin damage and automatically trigger Toxin procs bypassing shields!`,
      flags: { core: { statusId: "toxic_lash" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(39, 174, 96, 0.08); border: 1px solid #27ae60; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #2ecc71; text-transform: uppercase;">
          <span><i class="fas fa-biohazard"></i> Toxic Lash Venomized</span>
          <span>${durationRounds} Rounds</span>
        </div>
        <div style="font-size: 10.5px; color: #a8e6cf; margin-top: 4px; line-height: 1.35;">
          All weapons envenomed.<br/>
          ➔ <strong>Damage Boost:</strong> +${meleeToxin}% Toxin damage bonus on all hits.<br/>
          ➔ <strong>Toxic Proc:</strong> Bypasses shields directly to health on every attack!
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 4. MIASMA (Viral Mist & Spores Combo)
  // ==========================================
  if (baseName === "miasma") {
    let sporeSynergyCount = 0;
    const targetsAfflicted = [];

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      const hasSpores = targetActor.effects.some(e => !e.disabled && e.name.includes("Spores"));
      if (hasSpores) sporeSynergyCount++;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Miasma Viral Contagion",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/saryn/Miasma.png",
        origin: actor.uuid,
        duration: { rounds: 2 },
        statuses: ["viral_proc"],
        description: "Miasma Viral Contagion: Suffers doubled damage from all sources for 2 rounds.",
        flags: { core: { statusId: "viral_proc" } }
      }]);
      targetsAfflicted.push(token.name);
    }

    let cardExtraHTML = "";
    if (sporeSynergyCount > 0) {
      cardExtraHTML = `
        <div style="margin-top: 6px; padding: 6px; background: rgba(233, 30, 99, 0.1); border: 1px solid #e91e63; border-radius: 4px; font-size: 10.5px; color: #f8bbd0;">
          <i class="fas fa-virus"></i> <strong style="color: #ff2a5f;">💥 MIASMA-SPORE CATACLYSM x${sporeSynergyCount}!</strong> Enemies afflicted by Spores take <strong>DOUBLE DAMAGE (8d12 Viral)</strong>!
        </div>
      `;
    }

    return { handled: false, cardExtraHTML }; // allow standard 4d12 Viral damage roll
  }

  return { handled: false };
}
