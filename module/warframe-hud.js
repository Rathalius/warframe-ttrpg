/**
 * Warframe TTRPG - Bottom-Left Token ATH / HUD
 * Displays:
 *  - 4 Warframe Powers (clickable to cast with energy check)
 *  - Unlocked Focus School powers (active & passives)
 *  - Interactive Action, Bonus Action & Reaction tracker
 *  - Vitals: Health (PdV), Shields (Bouclier), and Energy (Énergie)
 */

export const FOCUS_NODES = {
  // MADURAI
  phoenixTalons: { school: "Madurai", name: "Griffes du Phénix (Phoenix Talons)", type: "passive", icon: "icons/svg/fire.svg", desc: "+10% aux dégâts physiques." },
  voidStrike: { school: "Madurai", name: "Frappe du Néant (Void Strike)", type: "active", icon: "icons/svg/sword.svg", cost: 20, desc: "Consomme 20 Énergie : +50% de dégâts sur la prochaine attaque." },
  contaminationWave: { school: "Madurai", name: "Vague de Contamination", type: "active", icon: "icons/svg/shield.svg", cost: 25, desc: "Consomme 25 Énergie : Projette une vague rendant les ennemis vulnérables (+25% dégâts subis)." },
  phoenixFlame: { school: "Madurai", name: "Flamme du Phénix", type: "passive", icon: "icons/svg/sun.svg", desc: "+15% aux dégâts de Feu." },
  chainedSling: { school: "Madurai", name: "Projection Enchaînée", type: "active", icon: "icons/svg/chain.svg", cost: 10, desc: "Consomme 10 Énergie : Double la portée de la Projection du Néant." },
  voidFuel: { school: "Madurai", name: "Carburant du Néant", type: "passive", icon: "icons/svg/explosion.svg", desc: "+25% d'efficacité de munitions." },
  savageSling: { school: "Madurai", name: "Projection Sauvage", type: "active", icon: "icons/svg/hazard.svg", cost: 15, desc: "Consomme 15 Énergie : La projection renverse les cibles traversées." },
  powerTransfer: { school: "Madurai", name: "Transfert de Puissance", type: "passive", icon: "icons/svg/direction.svg", desc: "+20% à la vitesse d'incantation des pouvoirs." },
  phoenixSpark: { school: "Madurai", name: "Étincelle du Phénix", type: "passive", icon: "icons/svg/daze.svg", desc: "Les ennemis touchés par le feu ont 20% de chance d'être aveuglés." },
  innerFlare: { school: "Madurai", name: "Éclat Intérieur", type: "passive", icon: "icons/svg/acid.svg", desc: "+15% à la Puissance de Pouvoir." },

  voidRadiance: { school: "Madurai", name: "Rayonnement du Néant (Void Radiance)", type: "active", icon: "icons/svg/sun.svg", cost: 25, desc: "Consomme 25 Énergie : Émet une vague de lumière aveuglant les ennemis proches pendant 1 round." },

  // VAZARIN
  mendingTalons: { school: "Vazarin", name: "Griffes Réparatrices (Mending Talons)", type: "passive", icon: "icons/svg/heal.svg", desc: "+10% à l'efficacité des soins prodigués." },
  guardianDash: { school: "Vazarin", name: "Ruée Gardienne (Guardian Dash)", type: "active", icon: "icons/svg/shield.svg", cost: 15, desc: "Consomme 15 Énergie : Confère l'invulnérabilité pendant 1 round aux alliés traversés." },
  protectiveDash: { school: "Vazarin", name: "Ruée Protectrice (Protective Dash)", type: "active", icon: "icons/svg/shield.svg", cost: 20, desc: "Consomme 20 Énergie : Soigne 25% de la Santé max des alliés et immunise aux dégâts pendant 1 round." },
  mendingWaves: { school: "Vazarin", name: "Ondes Réparatrices", type: "active", icon: "icons/svg/wave.svg", cost: 25, desc: "Consomme 25 Énergie : Pulse une onde de soin restaurant 30 Santé à tous les alliés à 15m." },
  pollutedWaters: { school: "Vazarin", name: "Eaux Polluées", type: "passive", icon: "icons/svg/water.svg", desc: "Répand une brume de soin régénérant 5 PV par round." },
  rejuvenatingTide: { school: "Vazarin", name: "Marée Régénératrice", type: "passive", icon: "icons/svg/drop.svg", desc: "+2 PV/round de régénération passive continue." },
  slingShield: { school: "Vazarin", name: "Bouclier de Ruée", type: "active", icon: "icons/svg/circle.svg", cost: 15, desc: "Consomme 15 Énergie : Crée une bulle défensive absorbant 100 dégâts." },
  aegisFlare: { school: "Vazarin", name: "Éclat de l'Égide", type: "passive", icon: "icons/svg/explosion.svg", desc: "La rupture de bouclier projette une onde de choc repoussant les ennemis." },
  reflectShield: { school: "Vazarin", name: "Bouclier Réflecteur", type: "passive", icon: "icons/svg/refractor.svg", desc: "Renvoie 20% des dégâts subis à l'assaillant." },

  // NARAMON
  affinitySpike: { school: "Naramon", name: "Pointe d'Affinité (Affinity Spike)", type: "passive", icon: "icons/svg/fire.svg", desc: "+10% aux dégâts de mêlée." },
  openingSlam: { school: "Naramon", name: "Frappe d'Ouverture (Opening Slam)", type: "active", icon: "icons/svg/daze.svg", cost: 15, desc: "Consomme 15 Énergie : Onde de choc au sol déséquilibrant tous les ennemis à 6m." },
  executingDash: { school: "Naramon", name: "Ruée Exécutrice", type: "active", icon: "icons/svg/skull.svg", cost: 20, desc: "Consomme 20 Énergie : Les ennemis traversés deviennent vulnérables aux Coups de Grâce." },
  sunderingStrike: { school: "Naramon", name: "Frappe Fracassante", type: "active", icon: "icons/svg/daze.svg", cost: 20, desc: "Consomme 20 Énergie : Frappe de mêlée lourde brisant 50 points d'armure." },
  woodRoots: { school: "Naramon", name: "Racines de Bois", type: "passive", icon: "icons/svg/hazard.svg", desc: "Immobilise les ennemis au contact au début du tour." },
  surgingDash: { school: "Naramon", name: "Ruée Déferlante", type: "active", icon: "icons/svg/lightning.svg", cost: 10, desc: "Consomme 10 Énergie : Augmente le multiplicateur de combo de mêlée de +1." },
  powerSpike: { school: "Naramon", name: "Pointe de Puissance", type: "passive", icon: "icons/svg/chain.svg", desc: "+2 aux jets d'attaque de mêlée." },
  savageFinisher: { school: "Naramon", name: "Coup de Grâce Sauvage", type: "passive", icon: "icons/svg/skull.svg", desc: "+50% aux dégâts des Coups de Grâce." },
  thornedBind: { school: "Naramon", name: "Lien Épineux", type: "passive", icon: "icons/svg/blood.svg", desc: "Les cibles entravées subissent 1d8 dégâts Tranchants par tour." },
  killerRush: { school: "Naramon", name: "Frénésie Meurtrière", type: "passive", icon: "icons/svg/running.svg", desc: "Abattre un ennemi confère +3m de déplacement pour le tour." },
  heartOfOak: { school: "Naramon", name: "Cœur de Chêne", type: "passive", icon: "icons/svg/heart.svg", desc: "Immunise aux renversements tant que vous êtes au sol." },

  // ZENURIK
  energyPulse: { school: "Zenurik", name: "Impulsion Énergétique (Energy Pulse)", type: "passive", icon: "icons/svg/lightning.svg", desc: "Les orbes d'énergie confèrent +50% d'énergie supplémentaire sur 5 secondes." },
  wellspring: { school: "Zenurik", name: "Source d'Énergie (Wellspring)", type: "active", icon: "icons/svg/bolt.svg", cost: 20, desc: "Consomme 20 Énergie : Crée une zone de régénération restaurant +5 Énergie par round pendant 15s." },
  temporalDrag: { school: "Zenurik", name: "Ralentissement Temporel (Temporal Drag)", type: "active", icon: "icons/svg/time.svg", cost: 25, desc: "Consomme 25 Énergie : Émet une impulsion radiale ralentissant tous les ennemis de 50% pendant 2 rounds." },
  innerGaze: { school: "Zenurik", name: "Regard Intérieur", type: "passive", icon: "icons/svg/bolt.svg", desc: "+20 à l'Énergie maximale de la Warframe." },
  channeledShield: { school: "Zenurik", name: "Bouclier Canalisé", type: "passive", icon: "icons/svg/shield.svg", desc: "Convertit 10% des dégâts subis en Énergie." },
  temporalShot: { school: "Zenurik", name: "Tir Temporel", type: "passive", icon: "icons/svg/daze.svg", desc: "+50% de dégâts critiques aux tirs à la tête sur les ennemis ralentis." },
  crystalShell: { school: "Zenurik", name: "Coquille de Cristal", type: "passive", icon: "icons/svg/refractor.svg", desc: "+20 à la capacité maximale des Boucliers." },
  voidFlow: { school: "Zenurik", name: "Flux du Néant", type: "passive", icon: "icons/svg/magic.svg", desc: "Réduit les coûts en Énergie de tous les pouvoirs de 5." },
  crystallineRecharge: { school: "Zenurik", name: "Recharge Cristalline", type: "passive", icon: "icons/svg/history.svg", desc: "Augmente la durée de Wellspring de +2 rounds." },
  temporalStorm: { school: "Zenurik", name: "Tempête Temporelle", type: "passive", icon: "icons/svg/wind.svg", desc: "Les ennemis ralentis vaincus explosent en infligeant 15 dégâts Perforants." },
  energyShield: { school: "Zenurik", name: "Bouclier d'Énergie", type: "passive", icon: "icons/svg/compress-arrows-alt.svg", desc: "Lorsque les boucliers sont épuisés, octroie immédiatement +50 Énergie (1x par combat)." },

  // UNAIRU
  stoneSkin: { school: "Unairu", name: "Peau de Pierre (Stone Skin)", type: "passive", icon: "icons/svg/shield.svg", desc: "+50 à la valeur d'Armure de base." },
  magneticOutburst: { school: "Unairu", name: "Éruption Magnétique", type: "active", icon: "icons/svg/hazard.svg", cost: 25, desc: "Consomme 25 Énergie : Onde radiale désintégrant 100% des boucliers ennemis dans un rayon de 10m." },
  causticStrike: { school: "Unairu", name: "Frappe Caustique", type: "active", icon: "icons/svg/acid.svg", cost: 25, desc: "Consomme 25 Énergie : Lance une bombe corrosive détruisant 100% de l'armure ennemie dans la zone." },
  voidShadow: { school: "Unairu", name: "Ombre du Néant (Void Shadow)", type: "active", icon: "icons/svg/eye.svg", cost: 20, desc: "Consomme 20 Énergie : Rend invisibles les alliés proches et confère +30% de résistance aux dégâts." },
  reinforcedReturn: { school: "Unairu", name: "Retour Renforcé", type: "passive", icon: "icons/svg/direction.svg", desc: "+20 à la valeur d'Armure." },
  staticShield: { school: "Unairu", name: "Bouclier Statique", type: "passive", icon: "icons/svg/lightning.svg", desc: "Électrocute les assaillants en mêlée (1d8 dégâts Électriques)." },
  voidShield: { school: "Unairu", name: "Bouclier du Néant", type: "passive", icon: "icons/svg/eye.svg", desc: "Accorde +25% de résistance aux dégâts physiques." },
  guardianShell: { school: "Unairu", name: "Coquille Tutélaire", type: "passive", icon: "icons/svg/unconscious.svg", desc: "+30 à la capacité maximale des Boucliers." },
  unairuWisp: { school: "Unairu", name: "Feu Follet d'Unairu", type: "active", icon: "icons/svg/sun.svg", cost: 15, desc: "Consomme 15 Énergie : Invoque un feu follet conférant +100% de dégâts du Néant aux alliés." },
  voidSpine: { school: "Unairu", name: "Épine du Néant", type: "passive", icon: "icons/svg/blood.svg", desc: "Renvoie 25% des dégâts de mêlée subis sous forme de dégâts de Perforation." },
  stoneFortitude: { school: "Unairu", name: "Fortitude de Pierre", type: "passive", icon: "icons/svg/net.svg", desc: "Immunité totale aux étourdissements et renversements." }
};

export const CANONICAL_FRAME_POWERS = {
  "Excalibur": [
    { name: "Élan Tranchant", cost: 25, img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/coupe rapide.webp", desc: "Fonce vers l'avant et taillade les ennemis." },
    { name: "Aveuglement Radial", cost: 50, img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/aveuglement radial.webp", desc: "Émet un flash aveuglant étourdissant les ennemis proches." },
    { name: "Javelot Radial", cost: 75, img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/javelot radial.webp", desc: "Projette des javelots de lumière transperçant les ennemis." },
    { name: "Lame Exaltée", cost: 100, img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/lame exalté.webp", desc: "Invoque une lame de pure lumière projetant des vagues d'énergie." }
  ],
  "Mag": [
    { name: "Attraction", cost: 25, img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/pull.webp", desc: "Attire violemment les ennemis vers vous." },
    { name: "Magnétisation", cost: 50, img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/magnetize.webp", desc: "Crée une sphère magnétique piégeant les projectiles." },
    { name: "Polarisation", cost: 75, img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/polarize.webp", desc: "Émet une vague drainant boucliers et armure." },
    { name: "Écrasement", cost: 100, img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/crush.webp", desc: "Magnétise et broie les os des ennemis dans la zone." }
  ],
  "Volt": [
    { name: "Choc", cost: 25, img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/shock.webp", desc: "Projette un arc électrique sautant d'ennemi en ennemi." },
    { name: "Vitesse", cost: 50, img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/speed.webp", desc: "Accélère la vitesse de déplacement et d'attaque du groupe." },
    { name: "Bouclier Électrique", cost: 75, img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/electric_shield.webp", desc: "Déploie un bouclier bloquant les tirs et électrisant vos attaques." },
    { name: "Décharge", cost: 100, img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/discharge.webp", desc: "Paralyse les ennemis dans un rayon et les transforme en bobines Tesla." }
  ],
  "Uriel": [
    { name: "Infernalis", cost: 25, img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-InfernalisIcon(xWhite).webp", desc: "Projette un jet de flammes démoniaques calcinant les cibles." },
    { name: "Brimstone", cost: 50, img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-BrimstoneIcon(xWhite).webp", desc: "Enflamme le sol de soufre volcanique infligeant des dégâts continus." },
    { name: "Demonium", cost: 75, img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-DemoniumIcon(xWhite).webp", desc: "Déploie des ailes démoniaques conférant armure et puissance dévastatrice." },
    { name: "Cataclysme Démoniaque", cost: 100, img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-InfernalisIcon(xWhite).webp", desc: "Libère toute la fureur des Enfers dans une explosion colossale." }
  ]
};

export class WarframeHUD {
  static currentToken = null;
  static currentActor = null;
  static isMinimized = false;

  static init() {
    console.log("Warframe TTRPG | Initializing Bottom-Left Token ATH / HUD...");
    
    // Create DOM container if missing
    if (!document.getElementById("warframe-token-hud")) {
      const hudDiv = document.createElement("div");
      hudDiv.id = "warframe-token-hud";
      hudDiv.className = "warframe-token-hud hidden";
      document.body.appendChild(hudDiv);
    }

    // Register Hooks
    Hooks.on("controlToken", (token, controlled) => {
      this.onControlToken(token, controlled);
    });

    Hooks.on("updateActor", (actor, changes) => {
      if (this.currentActor && this.currentActor.id === actor.id) {
        this.render(this.currentActor, this.currentToken);
      }
    });

    Hooks.on("createItem", (item) => {
      if (this.currentActor && item.parent?.id === this.currentActor.id) {
        this.render(this.currentActor, this.currentToken);
      }
    });

    Hooks.on("updateItem", (item) => {
      if (this.currentActor && item.parent?.id === this.currentActor.id) {
        this.render(this.currentActor, this.currentToken);
      }
    });

    Hooks.on("deleteItem", (item) => {
      if (this.currentActor && item.parent?.id === this.currentActor.id) {
        this.render(this.currentActor, this.currentToken);
      }
    });

    Hooks.on("combatTurn", (combat, updateData, updateOptions) => {
      this.onCombatTurn(combat);
    });

    Hooks.on("canvasReady", () => {
      const controlled = canvas.tokens?.controlled || [];
      if (controlled.length === 1 && (controlled[0].actor?.type === "warframe" || controlled[0].actor?.hasPlayerOwner)) {
        this.render(controlled[0].actor, controlled[0]);
      } else {
        this.hide();
      }
    });
  }

  static onControlToken(token, controlled) {
    const controlledTokens = canvas.tokens?.controlled || [];
    if (controlledTokens.length === 1) {
      const t = controlledTokens[0];
      if (t.actor && (t.actor.type === "warframe" || t.actor.hasPlayerOwner)) {
        this.currentToken = t;
        this.currentActor = t.actor;
        this.render(t.actor, t);
        return;
      }
    }
    this.currentToken = null;
    this.currentActor = null;
    this.hide();
  }

  static async onCombatTurn(combat) {
    if (!combat) return;
    const currentCombatant = combat.combatant;
    if (currentCombatant && currentCombatant.actor) {
      // Reset action indicators for the actor taking their turn (Parkour, Action 1, Action 2, Réaction)
      await currentCombatant.actor.setFlag("warframe-ttrpg", "combatActions", {
        parkour: true,
        action1: true,
        action2: true,
        reaction: true
      });
      if (this.currentActor && this.currentActor.id === currentCombatant.actor.id) {
        this.render(this.currentActor, this.currentToken);
      }
    }
  }

  static hide() {
    const el = document.getElementById("warframe-token-hud");
    if (el) {
      el.classList.add("hidden");
      el.style.display = "none";
    }
  }

  static show() {
    const el = document.getElementById("warframe-token-hud");
    if (el) {
      el.classList.remove("hidden");
      el.style.display = "flex";
    }
  }

  static async render(actor, token) {
    if (!actor) {
      this.hide();
      return;
    }

    const hud = document.getElementById("warframe-token-hud");
    if (!hud) return;

    this.show();

    // 1. Vitals extraction
    const health = actor.system?.health || { value: 0, max: 1 };
    const shields = actor.system?.shields || { value: 0, max: 0 };
    const energy = actor.system?.energy || { value: 0, max: 100 };

    const hpPct = Math.min(100, Math.max(0, health.max > 0 ? (health.value / health.max) * 100 : 0));
    const shieldPct = Math.min(100, Math.max(0, shields.max > 0 ? (shields.value / shields.max) * 100 : 0));
    const energyPct = Math.min(100, Math.max(0, energy.max > 0 ? (energy.value / energy.max) * 100 : 0));

    // 2. Action Indicators (Économie Cinétique : Parkour, Action 1, Action 2, Réaction)
    let actions = actor.getFlag("warframe-ttrpg", "combatActions");
    if (!actions || typeof actions !== "object" || actions.action1 === undefined) {
      actions = { parkour: true, action1: true, action2: true, reaction: true };
    }

    // 3. Powers Extraction (4 powers)
    const actorAbilities = actor.items.filter(i => i.type === "ability" && i.system?.abilitySlot !== "Passive");
    
    // Sort powers: Power 1..4 or by index
    const powers = [null, null, null, null];
    actorAbilities.forEach(ab => {
      const slotStr = String(ab.system?.abilitySlot || "");
      if (slotStr.includes("1")) powers[0] = ab;
      else if (slotStr.includes("2")) powers[1] = ab;
      else if (slotStr.includes("3")) powers[2] = ab;
      else if (slotStr.includes("4")) powers[3] = ab;
    });

    // Fill empty slots with leftover active abilities in order
    actorAbilities.forEach(ab => {
      if (!powers.includes(ab)) {
        const emptyIdx = powers.findIndex(p => p === null);
        if (emptyIdx !== -1) powers[emptyIdx] = ab;
      }
    });

    const frameClass = actor.system?.details?.frameClass || actor.name;
    const canonList = CANONICAL_FRAME_POWERS[frameClass] || [];

    // 4. Focus School & Active Unlocked Nodes Extraction ONLY (No passives!)
    let focusSchool = actor.system?.details?.operator;
    let focusNodesFlag = actor.getFlag("warframe-ttrpg", "focusNodes") || {};
    
    // Fallback: si l'acteur du token n'a pas de focusNodes enregistrés, chercher dans l'acteur racine par nom ou actorId
    if (!focusNodesFlag || Object.keys(focusNodesFlag).length === 0) {
      const baseActor = actor.baseActor || (actor.token?.actorId ? game.actors.get(actor.token.actorId) : null) || game.actors.find(a => a.name === actor.name);
      if (baseActor) {
        focusNodesFlag = baseActor.getFlag("warframe-ttrpg", "focusNodes") || focusNodesFlag;
        if (!focusSchool || focusSchool === "Aucune") focusSchool = baseActor.system?.details?.operator;
      }
    }
    focusSchool = focusSchool || "Aucune";

    const unlockedActiveFocus = [];
    Object.keys(focusNodesFlag).forEach(key => {
      // Exclure formellement les passifs : uniquement les pouvoirs actifs débloqués
      if (focusNodesFlag[key] === true && FOCUS_NODES[key] && FOCUS_NODES[key].type === "active") {
        unlockedActiveFocus.push({ key, ...FOCUS_NODES[key] });
      }
    });

    // 5. Arsenal: Armes Équipées
    let equippedWeapons = actor.items.filter(i => i.type === "weapon" && i.system?.equipped === true);
    if (equippedWeapons.length === 0) {
      // Fallback si aucune arme n'est encore marquée équipée : prend les 3 premières armes de l'inventaire
      equippedWeapons = actor.items.filter(i => i.type === "weapon").slice(0, 3);
    }

    // 6. Warframe Unique Gauges (Uriel, Atlas, Nidus, Gauss, Ember, Baruuk, Sevagoth, Valkyr)
    let uniqueGaugeHtml = "";
    const frameLower = (frameClass || "").toLowerCase();

    if (frameLower.includes("uriel") || actor.system?.brimstone?.value !== undefined) {
      const cur = Number(actor.system?.brimstone?.value) || 0;
      const max = Number(actor.system?.brimstone?.max) || 100;
      const pct = Math.min(100, Math.max(0, Math.round((cur / max) * 100)));
      
      let legionTooltip = "";
      if (actor.system?.legion) {
        const cat = actor.system.legion.catenach;
        const gul = actor.system.legion.gulphagor;
        const vyt = actor.system.legion.vythelas;
        legionTooltip = `&#10;Légion de Xata:&#10;• Catenach (Chaîne): ${cat?.health ?? 0}/150 PV [${cat?.active ? 'Actif' : 'Repos'}]&#10;• Gulphagor (Brûlure): ${gul?.health ?? 0}/150 PV [${gul?.active ? 'Actif' : 'Repos'}]&#10;• Vythelas (Rituel): ${vyt?.health ?? 0}/150 PV [${vyt?.active ? 'Actif' : 'Repos'}]`;
      }

      uniqueGaugeHtml = `
        <div class="wf-vital-row unique-gauge uriel-brimstone" title="Fureur du Soufre (Brimstone Fury): ${cur}% / ${max}%${legionTooltip}">
          <span class="wf-vital-label" style="color: #ff5e3a;"><i class="fas fa-fire-alt"></i> SOUF</span>
          <div class="wf-bar-track">
            <div class="wf-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #b71540 0%, #e55039 50%, #fa983a 100%); box-shadow: 0 0 8px rgba(250, 152, 58, 0.6);"></div>
          </div>
          <span class="wf-vital-val" style="color: #ff5e3a;">${cur}<span>%</span></span>
        </div>
      `;
    } else if (frameLower.includes("atlas") || actor.system?.rubble?.value !== undefined) {
      const cur = Number(actor.system?.rubble?.value) || 0;
      const max = Number(actor.system?.rubble?.max) || 1500;
      const pct = Math.min(100, Math.max(0, Math.round((cur / max) * 100)));
      uniqueGaugeHtml = `
        <div class="wf-vital-row unique-gauge atlas-rubble" title="Décombres (Rubble Armor): ${cur} / ${max}">
          <span class="wf-vital-label" style="color: #f1c40f;"><i class="fas fa-cubes"></i> DÉCO</span>
          <div class="wf-bar-track">
            <div class="wf-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #d35400 0%, #e67e22 50%, #f1c40f 100%); box-shadow: 0 0 8px rgba(241, 196, 15, 0.6);"></div>
          </div>
          <span class="wf-vital-val" style="color: #f1c40f;">${cur}<span>/${max}</span></span>
        </div>
      `;
    } else if (frameLower.includes("nidus") || actor.system?.mutation?.value !== undefined) {
      const cur = Number(actor.system?.mutation?.value) || 0;
      const max = 100;
      const pct = Math.min(100, Math.max(0, cur));
      uniqueGaugeHtml = `
        <div class="wf-vital-row unique-gauge nidus-mutation" title="Cumuls de Mutation: ${cur} / ${max}">
          <span class="wf-vital-label" style="color: #e056fd;"><i class="fas fa-dna"></i> MUTA</span>
          <div class="wf-bar-track">
            <div class="wf-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #6c5ce7 0%, #8e44ad 50%, #e056fd 100%); box-shadow: 0 0 8px rgba(224, 86, 253, 0.6);"></div>
          </div>
          <span class="wf-vital-val" style="color: #e056fd;">${cur}<span>/100</span></span>
        </div>
      `;
    } else if (frameLower.includes("gauss") || actor.system?.battery?.value !== undefined) {
      const cur = Number(actor.system?.battery?.value) || 0;
      const max = 100;
      const pct = Math.min(100, Math.max(0, cur));
      uniqueGaugeHtml = `
        <div class="wf-vital-row unique-gauge gauss-battery" title="Batterie Cinétique (Redline): ${cur}% / 100%">
          <span class="wf-vital-label" style="color: #00d2d3;"><i class="fas fa-bolt"></i> BATT</span>
          <div class="wf-bar-track">
            <div class="wf-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #00cec9 0%, #00d2d3 50%, #54a0ff 100%); box-shadow: 0 0 8px rgba(0, 210, 211, 0.6);"></div>
          </div>
          <span class="wf-vital-val" style="color: #00d2d3;">${cur}<span>%</span></span>
        </div>
      `;
    } else if (frameLower.includes("ember") || actor.system?.immolation?.value !== undefined) {
      const cur = Number(actor.system?.immolation?.value) || 0;
      const max = 100;
      const pct = Math.min(100, Math.max(0, cur));
      uniqueGaugeHtml = `
        <div class="wf-vital-row unique-gauge ember-immolation" title="Immolation: ${cur}% / 100%">
          <span class="wf-vital-label" style="color: #ff7675;"><i class="fas fa-fire"></i> IMMO</span>
          <div class="wf-bar-track">
            <div class="wf-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #fdcb6e 0%, #e17055 50%, #d63031 100%); box-shadow: 0 0 8px rgba(214, 48, 49, 0.6);"></div>
          </div>
          <span class="wf-vital-val" style="color: #ff7675;">${cur}<span>%</span></span>
        </div>
      `;
    } else if (frameLower.includes("baruuk") || actor.system?.restraint?.value !== undefined) {
      const cur = Number(actor.system?.restraint?.value) ?? 100;
      const max = 100;
      const pct = Math.min(100, Math.max(0, cur));
      uniqueGaugeHtml = `
        <div class="wf-vital-row unique-gauge baruuk-restraint" title="Retenue (Restraint): ${cur}% / 100%">
          <span class="wf-vital-label" style="color: #fdcb6e;"><i class="fas fa-yin-yang"></i> RETE</span>
          <div class="wf-bar-track">
            <div class="wf-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #e17055 0%, #fdcb6e 50%, #ffeaa7 100%); box-shadow: 0 0 8px rgba(253, 203, 110, 0.6);"></div>
          </div>
          <span class="wf-vital-val" style="color: #fdcb6e;">${cur}<span>%</span></span>
        </div>
      `;
    } else if (frameLower.includes("sevagoth") || actor.system?.deathWell?.value !== undefined) {
      const cur = Number(actor.system?.deathWell?.value) || 0;
      const max = 100;
      const pct = Math.min(100, Math.max(0, cur));
      uniqueGaugeHtml = `
        <div class="wf-vital-row unique-gauge sevagoth-deathwell" title="Puits de Mort (Death Well): ${cur}% / 100%">
          <span class="wf-vital-label" style="color: #a55eea;"><i class="fas fa-skull"></i> PUIT</span>
          <div class="wf-bar-track">
            <div class="wf-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #4b6584 0%, #8e44ad 50%, #9b59b6 100%); box-shadow: 0 0 8px rgba(155, 89, 182, 0.6);"></div>
          </div>
          <span class="wf-vital-val" style="color: #a55eea;">${cur}<span>%</span></span>
        </div>
      `;
    } else if (frameLower.includes("valkyr") || actor.system?.rage?.value !== undefined) {
      const cur = Number(actor.system?.rage?.value) || 0;
      const max = 300;
      const pct = Math.min(100, Math.max(0, Math.round((cur / max) * 100)));
      uniqueGaugeHtml = `
        <div class="wf-vital-row unique-gauge valkyr-rage" title="Jauge de Rage: ${cur}% / 300%">
          <span class="wf-vital-label" style="color: #e74c3c;"><i class="fas fa-fire"></i> RAGE</span>
          <div class="wf-bar-track">
            <div class="wf-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, #c0392b 0%, #e74c3c 100%); box-shadow: 0 0 8px rgba(231, 76, 60, 0.6);"></div>
          </div>
          <span class="wf-vital-val" style="color: #e74c3c;">${cur}<span>%</span></span>
        </div>
      `;
    }

    // Build Horizontal HUD HTML
    const actorImg = token?.texture?.src || actor.img || "icons/svg/mystery-man.svg";
    const actorLevel = actor.system?.details?.level?.value ?? actor.system?.level ?? 1;

    let html = `
      <div class="wf-hud-horizontal">

        <!-- PANEL 1: IDENTITÉ & VITALS -->
        <div class="wf-hud-panel vitals-panel">
          <div class="wf-identity-row">
            <img class="wf-hud-avatar" src="${actorImg}" alt="${actor.name}" />
            <div class="wf-hud-titles">
              <span class="wf-hud-name" title="${actor.name}">${actor.name}</span>
              <span class="wf-hud-sub">${frameClass} • R${actorLevel}</span>
            </div>
            <button type="button" class="wf-hud-btn-rest" title="Prendre un Repos (Restaurer Santé, Boucliers, Énergie et Actions)"><i class="fas fa-bed"></i></button>
            <button type="button" class="wf-hud-btn-toggle" title="${this.isMinimized ? 'Développer' : 'Réduire'}">
              <i class="fas ${this.isMinimized ? 'fa-chevron-right' : 'fa-chevron-left'}"></i>
            </button>
          </div>

          <div class="wf-vitals-stack">
            <!-- Shields -->
            <div class="wf-vital-row shields" title="Boucliers: ${shields.value} / ${shields.max}">
              <span class="wf-vital-label"><i class="fas fa-shield-alt"></i> BOUC</span>
              <div class="wf-bar-track">
                <div class="wf-bar-fill shields-fill" style="width: ${shieldPct}%;"></div>
              </div>
              <span class="wf-vital-val">${shields.value}<span>/${shields.max}</span></span>
            </div>

            <!-- Health (PdV) -->
            <div class="wf-vital-row health" title="Santé (PdV): ${health.value} / ${health.max}">
              <span class="wf-vital-label"><i class="fas fa-heart"></i> SANT</span>
              <div class="wf-bar-track">
                <div class="wf-bar-fill health-fill" style="width: ${hpPct}%;"></div>
              </div>
              <span class="wf-vital-val">${health.value}<span>/${health.max}</span></span>
            </div>

            <!-- Energy -->
            <div class="wf-vital-row energy" title="Énergie: ${energy.value} / ${energy.max}">
              <span class="wf-vital-label"><i class="fas fa-bolt"></i> ÉNER</span>
              <div class="wf-bar-track">
                <div class="wf-bar-fill energy-fill" style="width: ${energyPct}%;"></div>
              </div>
              <span class="wf-vital-val">${energy.value}<span>/${energy.max}</span></span>
            </div>

            ${uniqueGaugeHtml}
          </div>
        </div>

        <!-- COLLAPSIBLE WIDE CONTAINER -->
        <div class="wf-hud-collapsible-row ${this.isMinimized ? 'collapsed' : ''}">

          <!-- PANEL 2: ACTIONS DU TOUR (DOUBLE ACTION + PARKOUR + RÉACTION) -->
          <div class="wf-hud-panel actions-panel">
            <div class="wf-panel-header">
              <span>ACTIONS</span>
              <button type="button" class="wf-action-reset" title="Réinitialiser les actions du tour"><i class="fas fa-undo-alt"></i></button>
            </div>
            <div class="wf-actions-col">
              <button type="button" class="wf-action-pill ${actions.parkour ? 'active' : 'spent'}" data-action-type="parkour" title="Manœuvre de Parkour Gratuite (Bullet Jump, Glissade rechargement gratuit, Visée planée, Prise murale +15% Crit / Tremplin)">
                <i class="fas fa-running"></i>
                <span class="wf-act-name">Parkour</span>
                <span class="wf-act-status">${actions.parkour ? '1' : '0'}</span>
              </button>

              <button type="button" class="wf-action-pill ${actions.action1 ? 'active' : 'spent'}" data-action-type="action1" title="Action Majeure 1 (Tir, Mêlée, Pouvoir, Rechargement, Consommable)">
                <i class="fas fa-bolt"></i>
                <span class="wf-act-name">Action 1</span>
                <span class="wf-act-status">${actions.action1 ? '1' : '0'}</span>
              </button>

              <button type="button" class="wf-action-pill ${actions.action2 ? 'active' : 'spent'}" data-action-type="action2" title="Action Majeure 2 (Tir, Mêlée, Pouvoir, Rechargement, Consommable)">
                <i class="fas fa-bolt"></i>
                <span class="wf-act-name">Action 2</span>
                <span class="wf-act-status">${actions.action2 ? '1' : '0'}</span>
              </button>

              <button type="button" class="wf-action-pill ${actions.reaction ? 'active' : 'spent'}" data-action-type="reaction" title="Réaction Réflexe (Parade & Déviation, Projection du Néant 5-10ft ÷2 Dégâts, Riposte d'opportunité Mêlée immédiate)">
                <i class="fas fa-shield-alt"></i>
                <span class="wf-act-name">Réaction</span>
                <span class="wf-act-status">${actions.reaction ? '1' : '0'}</span>
              </button>
            </div>
          </div>

          <!-- PANEL 3: ARSENAL (ARMES ÉQUIPÉES) -->
          <div class="wf-hud-panel arsenal-panel">
            <div class="wf-panel-header">
              <span>ARSENAL ÉQUIPÉ</span>
              <span class="wf-panel-badge">${equippedWeapons.length}</span>
            </div>
            <div class="wf-weapons-list">
              ${equippedWeapons.length > 0 ? equippedWeapons.map(w => {
                const wNameLower = (w.name || "").toLowerCase();
                const isVinquibus = wNameLower.includes("vinquibus") || wNameLower.includes("vinquidibus");
                const wType = (w.system?.type || "").toLowerCase();
                const isMelee = wType === "melee" || (w.system?.range || "").toLowerCase() === "melee";
                const maxMag = Number(w.system?.magazine?.max) || (isVinquibus ? 16 : 0);
                const curMag = Number(w.system?.magazine?.value) ?? maxMag;
                const hasMagazine = maxMag > 0;
                const isLowAmmo = hasMagazine && curMag <= Math.ceil(maxMag * 0.25);
                const isEmpty = hasMagazine && curMag === 0;

                const canSwap = !!w.system?.canSwapMode || isVinquibus || (w.system?.modes && typeof w.system.modes === "object" && Object.keys(w.system.modes).length > 1);
                const currentMode = w.system?.currentMode || (isMelee ? "melee" : "rifle");
                const isMeleeMode = currentMode === "melee" || (isMelee && !w.system?.currentMode);
                const swapTitle = isMeleeMode 
                  ? `Transformer en Fusil (Mode Distance 2d12)` 
                  : `Transformer en Baïonnette (Mode Mêlée 2d10)`;

                const hasAltFire = !!w.system?.hasAltFire || 
                                   !!w.system?.altDamage || 
                                   isVinquibus ||
                                   wNameLower.includes("higasa") || 
                                   wNameLower.includes("ax-52") || 
                                   wNameLower.includes("ax52") ||
                                   wNameLower.includes("corinth");

                const altFireTitle = isVinquibus ? (isMeleeMode ? "Tir Rapide Fusil (2d12 Perforant)" : "Empalement Baïonnette (2d10 Perforant)")
                  : wNameLower.includes("higasa") ? "Tir Rayon Néant (4d10 Néant)"
                  : wNameLower.includes("ax-52") ? "Mode Visée Précision (ADS)"
                  : "Tir Secondaire / Mode Alternatif";

                return `
                  <div class="wf-weapon-item" data-weapon-id="${w.id}" title="${w.name} (${w.system?.type || 'Arme'})&#10;Dégâts: ${w.system?.damage || ''} ${w.system?.damageType || ''}">
                    <img class="wf-weapon-img" src="${w.img}" alt="${w.name}" />
                    <div class="wf-weapon-info">
                      <div class="wf-weapon-name-row">
                        <span class="wf-weapon-name" title="${w.name}">${w.name}</span>
                        ${canSwap ? `<span class="wf-weapon-mode-badge ${isMeleeMode ? 'mode-melee' : 'mode-ranged'}">${isMeleeMode ? 'MÊLÉE' : 'FUSIL'}</span>` : ''}
                      </div>
                      <div class="wf-weapon-meta-row">
                        <span class="wf-weapon-meta">${w.system?.damage || '1d6'} ${w.system?.damageType || ''}</span>
                        ${hasMagazine ? `
                          <span class="wf-weapon-ammo ${isEmpty ? 'empty' : (isLowAmmo ? 'low' : '')}" title="Munitions: ${curMag} / ${maxMag}">
                            <i class="fas fa-layer-group"></i> ${curMag}/${maxMag}
                          </span>
                        ` : ''}
                      </div>
                    </div>
                    <div class="wf-weapon-actions">
                      ${canSwap ? `
                        <button type="button" class="wf-weapon-sub-btn wf-weapon-swapmode-btn" data-weapon-id="${w.id}" title="${swapTitle}">
                          <i class="fas fa-sync-alt"></i>
                        </button>
                      ` : ''}
                      ${hasMagazine ? `
                        <button type="button" class="wf-weapon-sub-btn wf-weapon-reload-btn" data-weapon-id="${w.id}" title="Recharger ${w.name} (${curMag}/${maxMag})">
                          <i class="fas fa-redo"></i>
                        </button>
                      ` : ''}
                      ${hasAltFire ? `
                        <button type="button" class="wf-weapon-sub-btn wf-weapon-altfire-btn" data-weapon-id="${w.id}" title="${altFireTitle}">
                          <i class="fas fa-crosshairs"></i>
                        </button>
                      ` : ''}
                      <button type="button" class="wf-weapon-roll-btn" data-weapon-id="${w.id}" title="Attaque Principale (${isMeleeMode ? 'Mêlée' : 'Tir'})">
                        <i class="fas fa-dice-d20"></i>
                      </button>
                    </div>
                  </div>
                `;
              }).join("") : `
                <div class="wf-hud-empty">Aucune arme équipée.<br/><span style="font-size: 8px; color: #64748b;">(Cochez dans la fiche)</span></div>
              `}
            </div>
          </div>

          <!-- PANEL 4: 4 POUVOIRS WARFRAME -->
          <div class="wf-hud-panel powers-panel">
            <div class="wf-panel-header">
              <span>POUVOIRS WARFRAME</span>
            </div>
            <div class="wf-powers-grid">
              ${[0, 1, 2, 3].map(idx => {
                const p = powers[idx];
                const canon = canonList[idx];
                const slotNum = idx + 1;
                if (p) {
                  const cost = Number(p.system?.cost) || (slotNum === 1 ? 25 : (slotNum === 2 ? 50 : (slotNum === 3 ? 75 : 100)));
                  const canAfford = Number(energy.value) >= cost;
                  return `
                    <div class="wf-power-slot ${canAfford ? 'affordable' : 'unaffordable'}" data-ability-id="${p.id}" title="${p.name} (${cost} PE)&#10;${p.system?.description || ''}&#10;Cliquer pour lancer !">
                      <div class="wf-power-key">[${slotNum}]</div>
                      <img class="wf-power-img" src="${p.img}" alt="${p.name}" />
                      <div class="wf-power-overlay">
                        <span class="wf-power-name">${p.name}</span>
                        <span class="wf-power-cost"><i class="fas fa-bolt"></i> ${cost}</span>
                      </div>
                    </div>
                  `;
                } else if (canon) {
                  return `
                    <div class="wf-power-slot locked" title="${canon.name} (${canon.cost} PE) - Verrouillé ou non assigné&#10;${canon.desc}">
                      <div class="wf-power-key">[${slotNum}]</div>
                      <img class="wf-power-img" src="${canon.img}" alt="${canon.name}" />
                      <div class="wf-power-overlay">
                        <span class="wf-power-name">${canon.name}</span>
                        <span class="wf-power-cost"><i class="fas fa-lock"></i> ${canon.cost}</span>
                      </div>
                    </div>
                  `;
                } else {
                  return `
                    <div class="wf-power-slot locked" title="Pouvoir ${slotNum} verrouillé ou non assigné">
                      <div class="wf-power-key">[${slotNum}]</div>
                      <div class="wf-power-locked-icon"><i class="fas fa-lock"></i></div>
                      <div class="wf-power-overlay">
                        <span class="wf-power-name">Pouvoir ${slotNum}</span>
                        <span class="wf-power-cost">--</span>
                      </div>
                    </div>
                  `;
                }
              }).join("")}
            </div>
          </div>

          <!-- PANEL 5: POUVOIRS DE FOCUS (ACTIFS SEULEMENT) -->
          <div class="wf-hud-panel focus-panel">
            <div class="wf-panel-header">
              <span>FOCUS : ${focusSchool}</span>
              <span class="wf-panel-badge">${unlockedActiveFocus.length} Actif(s)</span>
            </div>
            <div class="wf-focus-list">
              ${unlockedActiveFocus.length > 0 ? unlockedActiveFocus.map(node => `
                <div class="wf-focus-chip active-power" data-node-key="${node.key}" title="${node.name} (${node.cost || 0} PE)&#10;${node.desc}&#10;Cliquer pour déclencher !">
                  <img class="wf-focus-icon" src="${node.icon}" alt="${node.name}" />
                  <div class="wf-focus-info">
                    <span class="wf-focus-name">${node.name}</span>
                    <span class="wf-focus-cost"><i class="fas fa-bolt"></i> ${node.cost || 0} PE</span>
                  </div>
                  <span class="wf-focus-badge active"><i class="fas fa-play"></i></span>
                </div>
              `).join("") : `
                <div class="wf-hud-empty">Aucun pouvoir de Focus actif débloqué.</div>
              `}
            </div>
          </div>

        </div>

      </div>
    `;

    hud.innerHTML = html;

    // Attach HUD listeners
    this.activateListeners(hud, actor);
  }

  static activateListeners(html, actor) {
    // 1. Toggle minimize / expand
    const toggleBtn = html.querySelector(".wf-hud-btn-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        this.isMinimized = !this.isMinimized;
        const collapsible = html.querySelector(".wf-hud-collapsible-row");
        if (collapsible) {
          collapsible.classList.toggle("collapsed", this.isMinimized);
        }
        toggleBtn.innerHTML = `<i class="fas ${this.isMinimized ? 'fa-chevron-right' : 'fa-chevron-left'}"></i>`;
      });
    }

    // 1b. Rest Character Button
    const restBtn = html.querySelector(".wf-hud-btn-rest");
    if (restBtn) {
      restBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (typeof actor.rest === "function") {
          await actor.rest();
        }
      });
    }

    // 2. Action Buttons toggle manual & Dialog Popups
    html.querySelectorAll(".wf-action-pill").forEach(pill => {
      // Left click: open interactive popup for Parkour and Reaction, toggle for Actions
      pill.addEventListener("click", async (e) => {
        e.preventDefault();
        const type = pill.dataset.actionType;
        if (type === "parkour") {
          if (typeof actor.showParkourDialog === "function") {
            return await actor.showParkourDialog();
          }
        } else if (type === "reaction") {
          if (typeof actor.showReactionDialog === "function") {
            return await actor.showReactionDialog();
          }
        }

        // Default direct toggle for action1 / action2
        let actions = actor.getFlag("warframe-ttrpg", "combatActions") || { parkour: true, action1: true, action2: true, reaction: true };
        actions[type] = !actions[type];
        await actor.setFlag("warframe-ttrpg", "combatActions", actions);
        this.render(actor, this.currentToken);
        if (actor.sheet?.rendered) {
          actor.sheet.render(false);
        }
      });

      // Right click (contextmenu): toggle state directly without opening dialog
      pill.addEventListener("contextmenu", async (e) => {
        e.preventDefault();
        const type = pill.dataset.actionType;
        let actions = actor.getFlag("warframe-ttrpg", "combatActions") || { parkour: true, action1: true, action2: true, reaction: true };
        actions[type] = !actions[type];
        await actor.setFlag("warframe-ttrpg", "combatActions", actions);
        this.render(actor, this.currentToken);
        if (actor.sheet?.rendered) {
          actor.sheet.render(false);
        }
      });
    });

    // 3. Reset Actions
    const resetBtn = html.querySelector(".wf-action-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (typeof actor.resetCombatActions === "function") {
          await actor.resetCombatActions();
        } else {
          await actor.setFlag("warframe-ttrpg", "combatActions", { parkour: true, action1: true, action2: true, reaction: true });
          this.render(actor, this.currentToken);
        }
        ui.notifications?.info("Actions du tour réinitialisées (2 Actions, 1 Parkour, 1 Réaction).");
      });
    }

    // 4. Cast Warframe Ability
    html.querySelectorAll(".wf-power-slot.affordable").forEach(slot => {
      slot.addEventListener("click", async (e) => {
        e.preventDefault();
        const abilityId = slot.dataset.abilityId;
        if (!abilityId) return;
        if (typeof actor.castAbility === "function") {
          await actor.castAbility(abilityId);
        } else {
          const item = actor.items.get(abilityId);
          if (item) item.roll?.();
        }
      });
    });

    html.querySelectorAll(".wf-power-slot.locked").forEach(slot => {
      slot.addEventListener("click", (e) => {
        e.preventDefault();
        ui.notifications?.info("Ce pouvoir est verrouillé ou non assigné sur la fiche.");
      });
    });

    // 5. Cast Focus Active Power
    html.querySelectorAll(".wf-focus-chip.active-power").forEach(chip => {
      chip.addEventListener("click", async (e) => {
        e.preventDefault();
        const nodeKey = chip.dataset.nodeKey;
        const node = FOCUS_NODES[nodeKey];
        if (!node) return;

        const cost = node.cost || 0;
        const currentEnergy = Number(actor.system?.energy?.value) || 0;
        if (cost > 0 && currentEnergy < cost) {
          ui.notifications?.warn(`Énergie insuffisante pour déclencher ${node.name} ! (Coût: ${cost}, Actuel: ${currentEnergy})`);
          return;
        }

        // Deduct energy if cost
        if (cost > 0) {
          const maxEnergy = Number(actor.system?.energy?.max) || 100;
          await actor.update({ "system.energy.value": Math.max(0, currentEnergy - cost) });
        }

        // Consume Major Action
        if (typeof actor.consumeCombatAction === "function") {
          await actor.consumeCombatAction("action");
        }

        // Post rich activation message to Chat
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor, token: this.currentToken }),
          content: `
            <div style="font-family: 'Inter', sans-serif; background: rgba(10, 14, 23, 0.95); border: 1px solid rgba(0, 229, 255, 0.4); border-radius: 6px; padding: 10px; color: #e2e8f0; box-shadow: 0 0 10px rgba(0,229,255,0.2);">
              <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 6px; margin-bottom: 8px;">
                <img src="${node.icon}" width="28" height="28" style="border: none; filter: drop-shadow(0 0 4px #00e5ff);" />
                <div>
                  <h4 style="margin: 0; font-family: 'Orbitron', sans-serif; color: #00e5ff; font-size: 13px;">${node.name}</h4>
                  <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Pouvoir de Focalisation (${node.school})</span>
                </div>
              </div>
              <p style="font-size: 12px; margin: 0; line-height: 1.4; color: #cbd5e1;">${node.desc}</p>
              ${cost > 0 ? `<div style="margin-top: 6px; font-size: 11px; color: #a855f7; font-weight: bold;"><i class="fas fa-bolt"></i> Coût dépensé : ${cost} Énergie</div>` : ''}
            </div>
          `
        });
      });
    });

    // 6. Weapon Actions from Arsenal Panel
    // 6a. Reload Weapon Button
    html.querySelectorAll(".wf-weapon-reload-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const weaponId = btn.dataset.weaponId || btn.closest(".wf-weapon-item")?.dataset.weaponId;
        if (!weaponId) return;
        if (typeof actor.reloadWeapon === "function") {
          await actor.reloadWeapon(weaponId);
        }
      });
    });

    // 6b. Alt-Fire Weapon Button
    html.querySelectorAll(".wf-weapon-altfire-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const weaponId = btn.dataset.weaponId || btn.closest(".wf-weapon-item")?.dataset.weaponId;
        if (!weaponId) return;
        await actor.rollWeapon(weaponId, { isAltFire: true });
      });
    });

    // 6c. Primary Attack Roll
    html.querySelectorAll(".wf-weapon-roll-btn, .wf-weapon-img").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const row = btn.closest(".wf-weapon-item");
        const weaponId = row?.dataset.weaponId;
        if (!weaponId) return;
        await actor.rollWeapon(weaponId);
      });
    });

    // 6d. Swap Weapon Mode Button
    html.querySelectorAll(".wf-weapon-swapmode-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const weaponId = btn.dataset.weaponId || btn.closest(".wf-weapon-item")?.dataset.weaponId;
        if (!weaponId) return;
        if (typeof actor.swapWeaponMode === "function") {
          await actor.swapWeaponMode(weaponId);
        }
      });
    });
  }
}
