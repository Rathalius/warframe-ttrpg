/**
 * Warframe TTRPG - Combat Automation Engine
 * Gère automatiquement le calcul des dégâts et soins pour les armes des joueurs et des ennemis :
 * - Absorption par Garde Renforcée (Overguard)
 * - Absorption par les Boucliers (bypassed par le Toxin)
 * - Atténuation par l'Armure canonique Warframe (300 / (300 + Armure))
 * - Vulnérabilités / Résistances / Immunités élémentaires
 * - Dégâts de Finisher / Dégâts Purs (True Damage)
 * - Soins des PV et Boucliers
 * - Boutons interactifs sur les cartes de chat
 */

/**
 * Récupère les cibles actuelles de l'utilisateur (Cibles ciblées avec T ou Tokens sélectionnés sur le canvas)
 * @returns {Token[]}
 */
export function getCombatTargets() {
  if (game.user?.targets && game.user.targets.size > 0) {
    return Array.from(game.user.targets);
  }
  if (canvas?.tokens?.controlled && canvas.tokens.controlled.length > 0) {
    return Array.from(canvas.tokens.controlled);
  }
  return [];
}

/**
 * Applique des dégâts ou des soins à un acteur cible selon les règles Warframe TTRPG
 * @param {Actor} targetActor 
 * @param {object} options
 * @param {number} options.amount Montant de base
 * @param {string} [options.damageType="physical"] Type de dégâts (Slash, Puncture, Impact, Heat, etc.)
 * @param {boolean} [options.isHealing=false] S'il s'agit d'un soin
 * @param {boolean} [options.isFinisher=false] Coup de grâce / True Damage (ignore bouclier et armure)
 * @param {boolean} [options.isHalfDamage=false] 50% de dégâts (jet de sauvegarde ou demi-dégâts)
 * @param {number} [options.multiplier=1.0] Multiplicateur optionnel
 * @param {string} [options.sourceName=""] Nom de l'arme ou de l'attaque source
 * @returns {Promise<object>} Résultat détaillé de la résolution
 */
export async function applyWarframeDamageOrHealing(targetActor, {
  amount = 0,
  damageType = "physical",
  isHealing = false,
  isFinisher = false,
  isHalfDamage = false,
  multiplier = 1.0,
  sourceName = ""
} = {}) {
  if (!targetActor) return null;

  const rawAmount = Number(amount) || 0;
  const mult = Number(multiplier) || 1.0;
  const halfMult = isHalfDamage ? 0.5 : 1.0;

  // Récupération des valeurs actuelles
  const curHealth = Number(targetActor.system.health?.value) || 0;
  const maxHealth = Number(targetActor.system.health?.max) || 100;
  const curShields = Number(targetActor.system.shields?.value) || 0;
  const maxShields = Number(targetActor.system.shields?.max) || 0;

  // Overguard (supporte system.overguard.value ou system.details.overguard.value)
  const hasOverguardField = targetActor.system.overguard?.value !== undefined;
  const curOverguard = Number(targetActor.system.overguard?.value ?? targetActor.system.details?.overguard?.value) || 0;
  const maxOverguard = Number(targetActor.system.overguard?.max ?? targetActor.system.details?.overguard?.max) || 0;

  // --- BRANCHE 1 : SOIN (HEALING) ---
  if (isHealing || rawAmount < 0) {
    const healVal = Math.round(Math.abs(rawAmount) * halfMult * mult);
    const missingHealth = Math.max(0, maxHealth - curHealth);
    const healthRestored = Math.min(missingHealth, healVal);
    const newHealth = curHealth + healthRestored;

    const remainingHeal = healVal - healthRestored;
    let shieldsRestored = 0;
    let newShields = curShields;

    if (maxShields > 0 && remainingHeal > 0) {
      const missingShields = Math.max(0, maxShields - curShields);
      shieldsRestored = Math.min(missingShields, remainingHeal);
      newShields = curShields + shieldsRestored;
    }

    const updates = { "system.health.value": newHealth };
    if (maxShields > 0) {
      updates["system.shields.value"] = newShields;
    }

    await targetActor.update(updates);
    await syncLinkedWarframeActors(targetActor, updates);

    return {
      actor: targetActor,
      isHealing: true,
      isFinisher: false,
      healAmount: healVal,
      healthRestored,
      shieldsRestored,
      previous: { health: curHealth, shields: curShields, overguard: curOverguard },
      current: { health: newHealth, shields: newShields, overguard: curOverguard }
    };
  }

  // --- BRANCHE 2 : DÉGÂTS (DAMAGE) ---
  let baseDamage = Math.round(rawAmount * halfMult * mult);
  const normalizedType = (damageType || "physical").toLowerCase().trim();

  // 1. Résistances / Vulnérabilités élémentaires de la cible
  let resistanceState = "normal";
  let resistanceMult = 1.0;
  const resistances = targetActor.system.resistances || {};

  if (resistances[normalizedType]) {
    resistanceState = resistances[normalizedType].toLowerCase();
    if (resistanceState === "vulnerable") {
      resistanceMult = 1.5;
    } else if (resistanceState === "resistant") {
      resistanceMult = 0.5;
    } else if (resistanceState === "immune") {
      resistanceMult = 0.0;
    }
  }

  // Vérification d'effets actifs de vulnérabilité (ex: Petrified, etc.)
  const vulnEffect = targetActor.effects?.find(e => !e.disabled && (
    e.statuses?.has("petrified") ||
    e.statuses?.has("vulnerable") ||
    e.flags?.core?.statusId === "petrified" ||
    e.flags?.["warframe-ttrpg"]?.damageVuln != null ||
    e.name === "Petrified" ||
    e.name === "Damage Vulnerability"
  ));

  let activeEffectBonusMult = 1.0;
  let activeEffectName = "";
  if (vulnEffect) {
    const bonusPct = Number(vulnEffect.flags?.["warframe-ttrpg"]?.damageVuln) || 50;
    activeEffectBonusMult += (bonusPct / 100);
    activeEffectName = vulnEffect.name || "Vulnérabilité";
  }

  let effectiveDamage = Math.round(baseDamage * resistanceMult * activeEffectBonusMult);
  if (resistanceState === "immune" || effectiveDamage <= 0) {
    return {
      actor: targetActor,
      isHealing: false,
      isImmune: true,
      damageType,
      resistanceState,
      effectiveDamage: 0,
      previous: { health: curHealth, shields: curShields, overguard: curOverguard },
      current: { health: curHealth, shields: curShields, overguard: curOverguard }
    };
  }

  let newOverguard = curOverguard;
  let newShields = curShields;
  let newHealth = curHealth;

  let overguardAbsorbed = 0;
  let shieldsAbsorbed = 0;
  let healthDamage = 0;
  let armorReductionPct = 0;
  let armorValue = Number(targetActor.system.armor?.value ?? targetActor.system.armor?.total) || 0;

  // --- FINISHER / TRUE DAMAGE ---
  if (isFinisher) {
    healthDamage = effectiveDamage;
    newHealth = Math.max(0, curHealth - healthDamage);
  } else {
    let pool = effectiveDamage;

    // A. Étape 1 : Garde Renforcée (Overguard)
    if (newOverguard > 0) {
      overguardAbsorbed = Math.min(newOverguard, pool);
      newOverguard -= overguardAbsorbed;
      pool -= overguardAbsorbed;
    }

    // B. Étape 2 : Boucliers (Shields)
    // Note canonique Warframe : Les dégâts de Toxine (Toxin) contournent les boucliers directement vers les PV
    const isToxinBypass = normalizedType === "toxin";
    if (!isToxinBypass && newShields > 0 && pool > 0) {
      shieldsAbsorbed = Math.min(newShields, pool);
      newShields -= shieldsAbsorbed;
      pool -= shieldsAbsorbed;
    }

    // C. Étape 3 : Points de Vie & Atténuation par l'Armure (Armor Reduction)
    if (pool > 0) {
      if (armorValue > 0) {
        // Formule canonique Warframe : Réduction = Armure / (Armure + 300)
        // Multiplicateur sur les PV = 300 / (300 + Armure)
        const armorMult = 300 / (300 + armorValue);
        armorReductionPct = Math.round((armorValue / (300 + armorValue)) * 100);
        healthDamage = Math.max(1, Math.round(pool * armorMult));
      } else {
        healthDamage = pool;
      }
      newHealth = Math.max(0, curHealth - healthDamage);
    }
  }

  // Construction des mises à jour
  const updates = {
    "system.health.value": newHealth,
    "system.shields.value": newShields
  };
  if (hasOverguardField) {
    updates["system.overguard.value"] = newOverguard;
  } else if (targetActor.system.details?.overguard?.value !== undefined) {
    updates["system.details.overguard.value"] = newOverguard;
  }

  await targetActor.update(updates);
  await syncLinkedWarframeActors(targetActor, updates);

  return {
    actor: targetActor,
    isHealing: false,
    isFinisher,
    isHalfDamage,
    damageType,
    rawAmount,
    baseDamage,
    effectiveDamage,
    resistanceState,
    resistanceMult,
    activeEffectName,
    activeEffectBonusMult,
    armorValue,
    armorReductionPct,
    overguardAbsorbed,
    shieldsAbsorbed,
    healthDamage,
    previous: { health: curHealth, shields: curShields, overguard: curOverguard },
    current: { health: newHealth, shields: newShields, overguard: newOverguard }
  };
}

/**
 * Synchronise les acteurs et leurs tokens liés sur la scène
 */
async function syncLinkedWarframeActors(actor, updates) {
  if (actor.type !== "warframe") return;
  try {
    if (actor.isToken) {
      const baseActor = game.actors?.get(actor.id);
      if (baseActor) await baseActor.update(updates);
    } else if (canvas?.tokens?.placeables) {
      const activeTokens = canvas.tokens.placeables.filter(t => t.actor?.id === actor.id);
      for (let token of activeTokens) {
        if (token.actor && token.actor !== actor) {
          await token.actor.update(updates);
        }
      }
    }
  } catch (err) {
    console.warn("Warframe TTRPG | Avertissement synchronisation acteur/token:", err);
  }
}

/**
 * Génère un bloc HTML décrivant le résultat de l'application de dégâts ou soins
 * @param {object} res Résultat renvoyé par applyWarframeDamageOrHealing
 * @returns {string} HTML prêt pour la carte de chat
 */
export function formatDamageResolutionHtml(res) {
  if (!res) return "";
  const name = res.actor.name;

  if (res.isHealing) {
    return `
      <div style="padding: 5px 6px; background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.3); border-radius: 4px; margin-top: 5px; font-size: 11px;">
        <div style="font-weight: bold; color: #2ecc71;">
          💚 Soin appliqué à <strong>${name}</strong> : +${res.healthRestored} PV${res.shieldsRestored > 0 ? ` (+${res.shieldsRestored} Bouclier)` : ""}
        </div>
        <div style="color: #cbd5e1; font-size: 10.5px; margin-top: 2px;">
          PV : ${res.previous.health} ➔ <strong>${res.current.health}</strong>
          ${res.shieldsRestored > 0 ? ` | Boucliers : ${res.previous.shields} ➔ <strong>${res.current.shields}</strong>` : ""}
        </div>
      </div>
    `;
  }

  if (res.isImmune) {
    return `
      <div style="padding: 5px 6px; background: rgba(149, 165, 166, 0.1); border: 1px solid rgba(149, 165, 166, 0.3); border-radius: 4px; margin-top: 5px; font-size: 11px;">
        <span style="color: #bdc3c7; font-weight: bold;">🛡️ ${name} est immunisé(e) aux dégâts ${res.damageType} ! (0 dégât subi)</span>
      </div>
    `;
  }

  let tags = [];
  if (res.isFinisher) {
    tags.push(`<span style="color: #ff2a5f; font-weight: bold;">💀 Coup de Grâce (Ignore Bouclier & Armure)</span>`);
  }
  if (res.resistanceState === "vulnerable") {
    tags.push(`<span style="color: #e74c3c; font-weight: bold;">⚡ Vulnérabilité ${res.damageType} (+50%)</span>`);
  } else if (res.resistanceState === "resistant") {
    tags.push(`<span style="color: #3498db; font-weight: bold;">🛡️ Résistance ${res.damageType} (-50%)</span>`);
  }
  if (res.activeEffectName) {
    tags.push(`<span style="color: #f39c12;">🎯 ${res.activeEffectName}</span>`);
  }
  if (res.armorReductionPct > 0) {
    tags.push(`<span style="color: #e67e22;">🛡️ Armure ${res.armorValue} (-${res.armorReductionPct}%)</span>`);
  }
  if (res.damageType?.toLowerCase() === "toxin") {
    tags.push(`<span style="color: #2ecc71;">☣️ Toxine (Contourne les Boucliers)</span>`);
  }

  const tagsHtml = tags.length > 0 ? `<div style="font-size: 10px; margin-bottom: 3px; display: flex; flex-wrap: wrap; gap: 4px;">${tags.join(" • ")}</div>` : "";

  return `
    <div style="padding: 5px 6px; background: rgba(255, 42, 95, 0.08); border: 1px solid rgba(255, 42, 95, 0.25); border-radius: 4px; margin-top: 5px; font-size: 11px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 3px; margin-bottom: 3px;">
        <span style="font-weight: bold; color: #fff;">🎯 ${name}</span>
        <span style="font-weight: bold; color: #ff2a5f; font-size: 12px;">-${res.effectiveDamage} ${res.damageType}</span>
      </div>
      ${tagsHtml}
      <div style="color: #cbd5e1; font-size: 10.5px;">
        ${res.overguardAbsorbed > 0 ? `<span>Garde : ${res.previous.overguard} ➔ <strong>${res.current.overguard}</strong> | </span>` : ""}
        ${res.shieldsAbsorbed > 0 ? `<span>Boucliers : ${res.previous.shields} ➔ <strong>${res.current.shields}</strong> | </span>` : ""}
        <span>PV : ${res.previous.health} ➔ <strong>${res.current.health}</strong></span>
      </div>
    </div>
  `;
}

/**
 * Génère la barre de boutons d'action rapide dans le chat pour appliquer dégâts ou soins
 * @param {object} params
 * @param {number} params.damage Montant total calculé
 * @param {string} params.damageType Type de dégâts
 * @param {boolean} [params.isFinisher=false]
 * @returns {string} HTML des boutons interactifs
 */
export function renderCombatActionButtons({ damage = 0, damageType = "physical", isFinisher = false } = {}) {
  const dmg = Number(damage) || 0;
  const halfDmg = Math.floor(dmg / 2);

  return `
    <div class="warframe-chat-combat-actions" style="display: flex; gap: 4px; margin-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 6px;">
      <button type="button" class="apply-combat-effect-btn" data-action="damage" data-amount="${dmg}" data-damage-type="${damageType}" data-is-finisher="${isFinisher}" style="flex: 1; background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; color: #ff6b6b; border-radius: 3px; padding: 4px 6px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
        💥 Dégâts (${dmg})
      </button>
      <button type="button" class="apply-combat-effect-btn" data-action="damage-half" data-amount="${halfDmg}" data-damage-type="${damageType}" data-is-finisher="${isFinisher}" style="flex: 1; background: rgba(243, 156, 18, 0.2); border: 1px solid #f39c12; color: #f39c12; border-radius: 3px; padding: 4px 6px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
        🛡️ Demi (${halfDmg})
      </button>
      <button type="button" class="apply-combat-effect-btn" data-action="heal" data-amount="${dmg}" style="flex: 1; background: rgba(46, 204, 113, 0.2); border: 1px solid #2ecc71; color: #2ecc71; border-radius: 3px; padding: 4px 6px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
        💚 Soin (${dmg})
      </button>
    </div>
  `;
}
