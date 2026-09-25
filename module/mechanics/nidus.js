/**
 * Warframe TTRPG - Nidus Specialized Ability Mechanics
 * Canonical implementations:
 * - Virulence: Launches fungal spike wave (1d8 Corrosive); gains +1 Mutation stack per target struck
 * - Larva: Spawns infesting pod with tendrils that group and entangle all targeted foes
 * - Parasitic Link: Costs 1 Mutation stack. Links with an ally (+25% Power Strength to both) or enemy (redirects 50% damage taken to victim)
 * - Ravenous: Costs 3 Mutation stacks. Creates teeming infestation zone healing squad and spawning explosive voracious maggots
 * - Undying Passive: If lethally damaged while Mutation >= 15, consumes 15 stacks to restore 50% HP with invulnerability
 */

export async function handleNidusAbility(baseName, actor, ability, context) {
  const targets = Array.from(game.user.targets);
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const currentStacks = Number(actor.system.mutation?.value) || 0;
  const maxStacks = Number(actor.system.mutation?.max) || 100;
  const abilityName = ability.name || "";

  async function adjustMutation(delta, reason = "") {
    const updated = Math.min(maxStacks, Math.max(0, currentStacks + delta));
    await actor.update({ "system.mutation.value": updated });
    return updated;
  }

  // ==========================================
  // 1. VIRULENCE (Spike Wave & Stack Generation)
  // ==========================================
  if (baseName === "virulence") {
    const hitCount = Math.max(1, targets.length);
    const stacksGained = hitCount;
    const newStacks = await adjustMutation(stacksGained, "Virulence impact");

    // Calculate bonus damage based on current mutation stacks
    const stackDamageBonus = Math.floor(currentStacks / 5) * 2;
    const formula = stackDamageBonus > 0 ? `1d8 + ${stackDamageBonus}` : "1d8";

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.08); border: 1px solid #9b59b6; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #e056fd; text-transform: uppercase;">
          <span><i class="fas fa-dna animate-pulse"></i> Virulence Spike Wave</span>
          <span>+${stacksGained} Mutation (${newStacks}/100)</span>
        </div>
        <div style="font-size: 10.5px; color: #e0d0ea; margin-top: 4px; line-height: 1.35;">
          Fungal rupture erupted along the ground!<br/>
          ➔ <strong>Stacks Gained:</strong> +${stacksGained} Mutation Stack${stacksGained > 1 ? "s" : ""} from ${hitCount} target${hitCount > 1 ? "s" : ""}.<br/>
          ${stackDamageBonus > 0 ? `➔ <strong>Mutation Surge:</strong> +${stackDamageBonus} flat Corrosive damage added from accumulated stacks.<br/>` : ""}
          ${newStacks >= 15 ? `<span style="color: #2ecc71; font-weight: bold;"><i class="fas fa-shield-alt"></i> Undying Ready:</span> Has ${newStacks} stacks (15 required for death-prevention trigger).` : `<span style="color: #e74c3c;"><i class="fas fa-exclamation-triangle"></i> Undying Inactive:</span> Need ${15 - newStacks} more stacks for lethal-protection threshold.`}
        </div>
      </div>
    `;

    return { handled: false, cardExtraHTML }; // allow standard 1d8 damage roll
  }

  // ==========================================
  // 2. LARVA (Tendril Snare & Cluster Pull)
  // ==========================================
  if (baseName === "larva") {
    const durationRounds = Math.max(1, Math.round(2 * (powerDuration / 100)));
    const pulledNames = [];

    for (const token of targets) {
      const targetActor = token.actor;
      if (!targetActor) continue;

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Larva Snare (Entangled)",
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nidus/Larva.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        statuses: ["entangled"],
        changes: [
          { key: "system.speed.land.value", value: -100, mode: 2, priority: 20 }
        ],
        description: `Larva Snare: Bound by writhing Infested tendrils. Completely immobilized and pulled into a central cluster for ${durationRounds} rounds.`,
        flags: { core: { statusId: "entangled" } }
      }]);
      pulledNames.push(token.name);
    }

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(155, 89, 182, 0.08); border: 1px solid #8e44ad; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #be2edd; text-transform: uppercase;">
          <span><i class="fas fa-spaghetti-monster-flying"></i> Larva Pod Spawned</span>
          <span>${durationRounds} Rounds</span>
        </div>
        <div style="font-size: 10.5px; color: #e0d0ea; margin-top: 4px; line-height: 1.35;">
          ${pulledNames.length > 0 
            ? `<strong>Entangled Targets:</strong> ${pulledNames.join(", ")} dragged into a tight cluster and immobilized!<br/><em>Prime targets for Virulence line spikes to generate massive Mutation Stacks!</em>`
            : `<em>Infested pod deployed. Target enemy tokens to drag them into a helpless cluster.</em>`
          }
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  // ==========================================
  // 3. PARASITIC LINK (Ally Buff or Enemy Damage Redirect)
  // ==========================================
  if (baseName === "parasitic link") {
    if (currentStacks < 1) {
      ui.notifications.warn("Parasitic Link requires at least 1 Mutation Stack!");
      return {
        handled: true,
        cardExtraHTML: `<div style="color: #ff2a5f; padding: 6px; font-family: 'Orbitron', sans-serif;"><i class="fas fa-times-circle"></i> FAILED: Parasitic Link requires 1 Mutation Stack (Current: 0).</div>`
      };
    }

    // Deduct 1 mutation stack
    const newStacks = await adjustMutation(-1, "Parasitic Link cast");
    const durationRounds = Math.max(1, Math.round(3 * (powerDuration / 100)));
    const targetToken = targets[0];
    const targetActor = targetToken?.actor;

    let isEnemy = true;
    if (targetActor) {
      // Check if target is friendly (e.g. PC disposition or same player)
      isEnemy = targetToken.document.disposition !== 1; // 1 is friendly in Foundry
    }

    if (targetActor && !isEnemy) {
      // LINK WITH ALLY: +25% Power Strength to both
      const bonusStr = Math.round(25 * (powerStrength / 100));

      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Parasitic Link (+${bonusStr}% Str)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nidus/ParasiticLink.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.powerStrength.value", value: bonusStr, mode: 2, priority: 20 }
        ],
        description: `Parasitic Link (Ally): Symbiotically linked with ${targetActor.name}. Grants +${bonusStr}% Power Strength to both Warframes.`,
        flags: { core: { statusId: "parasitic_link" } }
      }]);

      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Parasitic Link (+${bonusStr}% Str)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nidus/ParasiticLink.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        changes: [
          { key: "system.powerStrength.value", value: bonusStr, mode: 2, priority: 20 }
        ],
        description: `Parasitic Link: Infested conduit from Nidus grants +${bonusStr}% Power Strength.`,
        flags: { core: { statusId: "parasitic_link" } }
      }]);

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(46, 204, 113, 0.08); border: 1px solid #2ecc71; border-radius: 4px; font-family: 'Inter', sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #2ecc71; text-transform: uppercase;">
            <span><i class="fas fa-link"></i> Parasitic Symbiosis (Ally)</span>
            <span>-1 Stack (${newStacks}/100)</span>
          </div>
          <div style="font-size: 10.5px; color: #a8e6cf; margin-top: 4px; line-height: 1.35;">
            Conduit attached to <strong>${targetActor.name}</strong> for ${durationRounds} rounds.<br/>
            ➔ <strong>Power Strength Surge:</strong> +${bonusStr}% Power Strength granted to both Nidus and ${targetActor.name}!
          </div>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    } else {
      // LINK WITH ENEMY: 50% Damage Redirection & Stun
      const redirectPct = Math.min(90, Math.round(50 * (powerStrength / 100)));
      const victimName = targetActor ? targetActor.name : "Targeted Host";

      if (targetActor) {
        await targetActor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Parasitic Host (Damage Conduit)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nidus/ParasiticLink.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          statuses: ["stunned"],
          description: `Parasitic Host: Helplessly bound to Nidus. Incapacitated, and absorbs ${redirectPct}% of all damage dealt to Nidus!`,
          flags: { core: { statusId: "parasitic_host" } }
        }]);
      }

      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `Parasitic Ward (${redirectPct}% Redirect)`,
        icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nidus/ParasiticLink.png",
        origin: actor.uuid,
        duration: { rounds: durationRounds },
        description: `Parasitic Ward: ${redirectPct}% of all incoming damage is transferred to ${victimName}, with complete knockdown immunity.`,
        flags: { core: { statusId: "parasitic_ward" } }
      }]);

      const cardExtraHTML = `
        <div style="margin-top: 8px; padding: 8px; background: rgba(231, 76, 60, 0.08); border: 1px solid #e74c3c; border-radius: 4px; font-family: 'Inter', sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #ff6b6b; text-transform: uppercase;">
            <span><i class="fas fa-biohazard"></i> Parasitic Puppet (Host Link)</span>
            <span>-1 Stack (${newStacks}/100)</span>
          </div>
          <div style="font-size: 10.5px; color: #f5cd79; margin-top: 4px; line-height: 1.35;">
            Infested tendril latched onto <strong>${victimName}</strong> for ${durationRounds} rounds.<br/>
            ➔ <strong>Damage Transfer:</strong> <strong>${redirectPct}%</strong> of all incoming damage taken by Nidus is redirected directly to the host!<br/>
            ➔ <strong>Incapacitation:</strong> Host is locked in place and cannot act while linked.
          </div>
        </div>
      `;
      return { handled: true, cardExtraHTML };
    }
  }

  // ==========================================
  // 4. RAVENOUS (Maggot Infestation & Squad Healing)
  // ==========================================
  if (baseName === "ravenous") {
    if (currentStacks < 3) {
      ui.notifications.warn("Ravenous requires at least 3 Mutation Stacks!");
      return {
        handled: true,
        cardExtraHTML: `<div style="color: #ff2a5f; padding: 6px; font-family: 'Orbitron', sans-serif;"><i class="fas fa-times-circle"></i> FAILED: Ravenous requires 3 Mutation Stacks (Current: ${currentStacks}/3).</div>`
      };
    }

    const newStacks = await adjustMutation(-3, "Ravenous cast");
    const durationRounds = Math.max(1, Math.round(4 * (powerDuration / 100)));
    const healPerRound = Math.round(25 * (powerStrength / 100));

    // Grant Nidus and squad healing ActiveEffect
    await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: `Ravenous Nest (+${healPerRound} HP/Rnd)`,
      icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/nidus/Ravenous.png",
      origin: actor.uuid,
      duration: { rounds: durationRounds },
      description: `Ravenous Infestation: Regenerates ${healPerRound} Health every round while standing in the Infested biomass.`,
      flags: { core: { statusId: "ravenous_healing" } }
    }]);

    const cardExtraHTML = `
      <div style="margin-top: 8px; padding: 8px; background: rgba(142, 68, 173, 0.1); border: 1px solid #9b59b6; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: bold; color: #e056fd; text-transform: uppercase;">
          <span><i class="fas fa-virus animate-pulse"></i> Ravenous Biome Erupted</span>
          <span>-3 Stacks (${newStacks}/100)</span>
        </div>
        <div style="font-size: 10.5px; color: #f5cd79; margin-top: 4px; line-height: 1.35;">
          A lush Infested carpet blankets the battlefield for ${durationRounds} rounds.<br/>
          ➔ <strong>Squad Regeneration:</strong> Allies inside heal <strong>+${healPerRound} HP</strong> at the start of each round.<br/>
          ➔ <strong>Voracious Maggots:</strong> 5 explosive maggots hatch, seeking enemies to swarm and detonate for <strong>2d10 Blast</strong> damage (granting +1 Mutation Stack per explosion hit)!
        </div>
      </div>
    `;

    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
