// Warframe TTRPG System Entry Point
function wfDiagLog(msg) {
  console.log("[Warframe TTRPG]", msg);
}
globalThis.wfDiagLog = wfDiagLog;
import { WarframeActor } from "./actor.js";
import { WarframeActorSheet } from "./actor-sheet.js";
import { WarframeItemSheet, WarframeWeaponSheet } from "./item-sheet.js";
import { warframeModFolders, warframeModsDataset } from "./data-warframe-mods.js";
import { weaponModFolders, weaponModsDataset, combineElements } from "./data-weapon-mods.js";
import { superchargerFolder, superchargersDataset } from "./data-superchargers.js";
import { primaryWeaponFolders, primaryWeaponsDataset } from "./data-primary-weapons.js";
import { secondaryWeaponFolders, secondaryWeaponsDataset } from "./data-secondary-weapons.js";
import { meleeWeaponFolders, meleeWeaponsDataset } from "./data-melee-weapons.js";
import { newWarframeFolders, newWarframeFeats, newWarframeClasses, newWarframeSyncData } from "./data-warframes.js";
import { CharacterCreationWizard } from "./character-wizard.js";
import { WarframePlanetSheet } from "./planet-sheet.js";
import { WarframeOriginSystemManager } from "./origin-system-manager.js";
import { ALL_ADVERSARIES, GRINEER_ADVERSARIES, KUVA_ADVERSARIES, CORPUS_ADVERSARIES, INFESTED_ADVERSARIES, OROKIN_ADVERSARIES, MURMUR_ADVERSARIES, bestiaryFolders, getAllAdversaries, getAdversaryById, getAllGrineerAdversaries, getGrineerAdversaryById, getAllKuvaAdversaries, getKuvaAdversaryById, getAllCorpusAdversaries, getCorpusAdversaryById, getAllInfestedAdversaries, getInfestedAdversaryById, getAllOrokinAdversaries, getOrokinAdversaryById, getAllMurmurAdversaries, getMurmurAdversaryById } from "./data-adversaries.js";
import { applyWarframeDamageOrHealing, formatDamageResolutionHtml, getCombatTargets } from "./combat-automation.js";
import { ORIGIN_SYSTEM_BODIES, ORIGIN_SYSTEM_FACTIONS, ORIGIN_SYSTEM_JUNCTIONS, getPlanetById, getPlanetByPixel, getJunctionByPixel, getKuvaFortressPosition } from "./data-star-chart.js";
import { WarframeHUD } from "./warframe-hud.js";

export function isStarChartScene(scene) {
  if (!scene) return false;
  return scene.name === "Système Origine" || scene.name?.includes("Origine") || scene.flags?.["warframe-ttrpg"]?.isStarChart;
}

Hooks.once("init", function() {
  console.log("Warframe TTRPG | Initializing System"); wfDiagLog("2. Hooks init fired");

  // Register Managed Scene class (Ember-style native SceneManager)
      // Dynamic SceneManager Proxy for Star Chart scene
  CONFIG.Canvas.managedScenes = new Proxy(CONFIG.Canvas.managedScenes || {}, {
    get(target, prop, receiver) {
      if (prop in target) return target[prop];
      const scene = game.scenes?.get(prop);
      if (scene && isStarChartScene(scene)) {
        return WarframeOriginSystemManager;
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  CONFIG.Canvas.sceneManagers = CONFIG.Canvas.managedScenes;

  const CanvasClass = globalThis.Canvas || (typeof foundry !== "undefined" ? foundry.canvas?.Canvas : null);
  if (CanvasClass && CanvasClass.getSceneManager) {
    const origGetSceneManager = CanvasClass.getSceneManager;
    CanvasClass.getSceneManager = function(scene) {
      if (scene && isStarChartScene(scene)) {
        return new WarframeOriginSystemManager(scene);
      }
      return origGetSceneManager ? origGetSceneManager.call(this, scene) : null;
    };
  }

  // Expose public system API surface
  globalThis.warframeTTRPG = {
    WarframeActor,
    WarframeActorSheet,
    WarframeItemSheet,
    WarframeHUD,
    WarframeWeaponSheet,
    WarframePlanetSheet,
    WarframeOriginSystemManager,
    CharacterCreationWizard,
    combineElements,
    primaryWeaponFolders,
    primaryWeaponsDataset,
    secondaryWeaponFolders,
    secondaryWeaponsDataset,
    meleeWeaponFolders,
    meleeWeaponsDataset,
    newWarframeFolders,
    newWarframeFeats,
    newWarframeClasses,
    newWarframeSyncData,
    ORIGIN_SYSTEM_BODIES,
    ORIGIN_SYSTEM_FACTIONS,
    ORIGIN_SYSTEM_JUNCTIONS,
    getPlanetById,
    getPlanetByPixel,
    getJunctionByPixel,
    getKuvaFortressPosition,
    openPlanetSheet: (planetId) => new WarframePlanetSheet(planetId).render(true),
    openStarChart: async () => {
      const scene = game.scenes.find(s => isStarChartScene(s));
      if (scene) await scene.view();
    },
    viewStarChartScene: async () => {
      const scene = game.scenes.find(s => isStarChartScene(s));
      if (scene) await scene.view();
    },
    bestiaryFolders,
    ALL_ADVERSARIES,
    GRINEER_ADVERSARIES,
    KUVA_ADVERSARIES,
    CORPUS_ADVERSARIES,
    INFESTED_ADVERSARIES,
    OROKIN_ADVERSARIES,
    MURMUR_ADVERSARIES,
    getAllAdversaries,
    getAdversaryById,
    getAllGrineerAdversaries,
    getGrineerAdversaryById,
    getAllKuvaAdversaries,
    getKuvaAdversaryById,
    getAllCorpusAdversaries,
    getCorpusAdversaryById,
    getAllInfestedAdversaries,
    getInfestedAdversaryById,
    getAllOrokinAdversaries,
    getOrokinAdversaryById,
    getAllMurmurAdversaries,
    getMurmurAdversaryById,
    syncBestiary: (log = console.log, options = {}) => syncBestiary(log, options),
    syncGrineerBestiary: (log = console.log, options = {}) => syncBestiary(log, options),
    openBestiary: async () => {
      const pack = game.packs.get("warframe-ttrpg.bestiary") || game.packs.find(p => p.metadata.name === "bestiary");
      if (pack) {
        pack.render(true);
      } else {
        const res = await syncBestiary();
        if (res?.pack) res.pack.render(true);
      }
    }
  };
  game.warframe = globalThis.warframeTTRPG;

  // Assign custom document classes
  CONFIG.Actor.documentClass = WarframeActor;

  // Set default initiative formula
  CONFIG.Combat.initiative = {
    formula: "1d20 + floor((@attributes.prowess.value - 10) / 2)",
    decimals: 2
  };

  // Custom Warframe Status Effects (with both img and icon for v12/v13/v14 compatibility)
  CONFIG.statusEffects = [
    { id: "slash", name: "Tranchant (Saignement)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png" },
    { id: "impact", name: "Impact (Chancellement)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialImpactGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialImpactGlyph.png" },
    { id: "puncture", name: "Perforation (Affaiblissement)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialPunctureGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialPunctureGlyph.png" },
    { id: "heat", name: "Feu (Brûlure)", img: "systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png", icon: "systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png" },
    { id: "cold", name: "Glace (Gel)", img: "systems/warframe-ttrpg/asset/Element icon/ColdModBundleIcon.png", icon: "systems/warframe-ttrpg/asset/Element icon/ColdModBundleIcon.png" },
    { id: "electricity", name: "Électricité (Foudre)", img: "systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png", icon: "systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png" },
    { id: "toxin", name: "Toxine (Poison)", img: "systems/warframe-ttrpg/asset/Element icon/300px-ToxinModBundleIcon.webp", icon: "systems/warframe-ttrpg/asset/Element icon/300px-ToxinModBundleIcon.webp" },
    { id: "magnetic", name: "Magnétique (Perturbation de Bouclier)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png" },
    { id: "blast", name: "Explosion (Déflagration)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png" },
    { id: "corrosive", name: "Corrosif (Dissolution d'Armure)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png" },
    { id: "gas", name: "Gaz (Nuage Toxique)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png" },
    { id: "radiation", name: "Radiation (Confusion)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png" },
    { id: "viral", name: "Viral (Affliction)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png" },
    { id: "void", name: "Néant (Attraction de Projectiles)", img: "systems/warframe-ttrpg/asset/Element icon/EssentialVoidGlyph.png", icon: "systems/warframe-ttrpg/asset/Element icon/EssentialVoidGlyph.png" },
    { id: "restrained", name: "Entravé", img: "icons/svg/net.svg", icon: "icons/svg/net.svg" },
    { id: "stunned", name: "Étourdi (Paralysé)", img: "icons/svg/daze.svg", icon: "icons/svg/daze.svg" },
    { id: "wall_latch", name: "Prise Murale (+15% Crit)", img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp", icon: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp" },
    { id: "dead", name: "Mort", img: "icons/svg/skull.svg", icon: "icons/svg/skull.svg" }
  ];

  // Register custom sheets with namespaced collections
  const actorsCollection = foundry.documents?.collections?.Actors ?? Actors;
  const itemsCollection = foundry.documents?.collections?.Items ?? Items;

  actorsCollection.registerSheet("warframe-ttrpg", WarframeActorSheet, {
    types: ["warframe", "adversary"],
    makeDefault: true,
    label: "WF.ActorSheet"
  });

  itemsCollection.registerSheet("warframe-ttrpg", WarframeWeaponSheet, {
    types: ["weapon"],
    makeDefault: true,
    label: "WF.WeaponSheet"
  });

  itemsCollection.registerSheet("warframe-ttrpg", WarframeItemSheet, {
    types: ["ability", "mod", "consumable", "warframe"],
    makeDefault: true,
    label: "WF.ItemSheet"
  });

  // Preload system Handlebars templates into cache
  const templatePaths = [
    "systems/warframe-ttrpg/templates/actor-warframe-sheet.html",
    "systems/warframe-ttrpg/templates/actor-adversary-sheet.html",
    "systems/warframe-ttrpg/templates/item-sheet.html",
    "systems/warframe-ttrpg/templates/item-weapon-sheet.html",
    "systems/warframe-ttrpg/templates/item-mod-sheet.html",
    "systems/warframe-ttrpg/templates/chat-card.html",
    "systems/warframe-ttrpg/templates/character-wizard.html",
    "systems/warframe-ttrpg/templates/planet-sheet.html"
  ];
  const loadTpls = foundry.applications?.handlebars?.loadTemplates ?? (typeof loadTemplates === "function" ? loadTemplates : null);
  if (loadTpls) {
    loadTpls(templatePaths);
  }

  // Register custom Handlebars helpers for sheet layout and logic
  Handlebars.registerHelper("eq", (a, b) => a == b);
  Handlebars.registerHelper("gt", (a, b) => Number(a) > Number(b));
  Handlebars.registerHelper("pct", (a, b) => {
    const val = Number(a) || 0;
    const max = Number(b) || 1;
    return Math.round((val / max) * 100);
  });
  Handlebars.registerHelper("min", (a, b) => Math.min(Number(a) || 0, Number(b) || 0));
  Handlebars.registerHelper("capitalize", str => typeof str === "string" ? str.capitalize() : "");

  Handlebars.registerHelper("formatAbilitySlot", (slot) => {
    if (!slot) return "";
    const s = String(slot).toLowerCase().trim();
    if (s.includes("power 1") || s === "1" || s === "power1" || s.includes("pouvoir 1")) return "Pouvoir 1";
    if (s.includes("power 2") || s === "2" || s === "power2" || s.includes("pouvoir 2")) return "Pouvoir 2";
    if (s.includes("power 3") || s === "3" || s === "power3" || s.includes("pouvoir 3")) return "Pouvoir 3";
    if (s.includes("power 4") || s === "4" || s === "power4" || s.includes("pouvoir 4")) return "Pouvoir 4";
    if (s.includes("passive") || s.includes("passif")) return "Passif";
    if (s.includes("stance") || s.includes("posture")) return "Posture";
    if (s.includes("aura")) return "Aura";
    if (s.includes("exilus")) return "Exilus";
    if (s.includes("focus")) return "Focalisation";
    return slot;
  });

  Handlebars.registerHelper("formatDamageType", (dmg) => {
    if (!dmg) return "";
    const map = {
      slash: "Tranchant",
      puncture: "Perforation",
      impact: "Impact",
      heat: "Feu",
      cold: "Glace",
      electricity: "Électricité",
      electric: "Électricité",
      toxin: "Toxine",
      blast: "Explosion",
      corrosive: "Corrosif",
      gas: "Gaz",
      magnetic: "Magnétique",
      radiation: "Radiation",
      viral: "Viral",
      void: "Néant",
      true: "Pur",
      pure: "Pur",
      kinetic: "Cinétique",
      tau: "Tau",
      psychic: "Psychique",
      sonic: "Sonique",
      solar: "Solaire",
      overguard: "Garde Renforcée",
      healing: "Soin",
      adaptive: "Adaptatif",
      "buff / aura": "Bonus / Aura",
      "debuff / strip": "Affaiblissement",
      "crowd control": "Contrôle",
      "restoration": "Restauration",
      "energy restore": "Restauration d'Énergie",
      "combat summon": "Invocation",
      "tactical maneuver": "Manœuvre"
    };
    const key = String(dmg).toLowerCase().trim();
    return map[key] || (typeof dmg === "string" ? dmg : "");
  });
  
  const getPolIcon = (pol) => {
    if (!pol || pol === "none") return "";
    const norm = String(pol).toLowerCase();
    const icons = {
      universal: 'systems/warframe-ttrpg/asset/polarity icon/Any_Pol.jpg',
      any: 'systems/warframe-ttrpg/asset/polarity icon/Any_Pol.jpg',
      madurai: 'systems/warframe-ttrpg/asset/polarity icon/Madurai_Pol(xBlack).jpg',
      vazarin: 'systems/warframe-ttrpg/asset/polarity icon/Vazarin_Pol(xBlack).jpg',
      naramon: 'systems/warframe-ttrpg/asset/polarity icon/Naramon_Pol(xBlack).jpg',
      zenurik: 'systems/warframe-ttrpg/asset/polarity icon/Zenurik_Pol(xBlack).jpg',
      unairu: 'systems/warframe-ttrpg/asset/polarity icon/Unairu_Pol(xBlack).jpg',
      umbra: 'systems/warframe-ttrpg/asset/polarity icon/Umbra_Pol(xBlack).jpg'
    };
    return icons[norm] || "";
  };

  Handlebars.registerHelper("polarityIcon", (polarity) => {
    const iconUrl = getPolIcon(polarity);
    if (!iconUrl) return "";
    return new Handlebars.SafeString(`<img class="polarity-icon-img" src="${iconUrl}" title="Polarity: ${polarity}" style="vertical-align: middle; width: 13px; height: 13px; display: inline-block; object-fit: contain; mix-blend-mode: screen;" />`);
  });

  Handlebars.registerHelper("renderModSlot", (modGrid, modSlots, slotKey) => {
    const mod = modGrid[slotKey];
    const slotInfo = modSlots[slotKey] || { polarity: "none" };
    const polarity = slotInfo.polarity || "none";
    
    const slotIconUrl = getPolIcon(polarity);
    const slotPolarityIconHtml = slotIconUrl ? `<img class="polarity-icon-img" src="${slotIconUrl}" title="Polarité d'emplacement : ${polarity} (Cliquer pour changer)" />` : `<span class="polarity-blank" title="Polarité d'emplacement : Aucune (Cliquer pour changer)"></span>`;

    let slotLabel = slotKey.capitalize();
    if (slotKey === "aura2") {
      slotLabel = "Aura 2";
    } else if (slotKey === "aura") {
      slotLabel = "Aura";
    } else if (slotKey.startsWith("slot")) {
      slotLabel = `Emplacement ${slotKey.replace("slot", "")}`;
    }

    if (mod) {
      const isAuraOrStance = (slotKey === "aura" || slotKey === "aura2" || slotKey === "stance");
      const displayDrain = isAuraOrStance ? `+${Math.abs(mod.actualDrain)}` : mod.actualDrain;
      const modImg = mod.img || "icons/svg/aura.svg";
      const rarity = (mod.system?.rarity || "common").toLowerCase();
      const modPolarity = mod.system?.polarity || mod.polarity || "none";
      const polarityMatch = mod.polarityMatch || "neutral";

      // Mod Polarity Icon with green/red status
      const modIconUrl = getPolIcon(modPolarity);
      let modPolarityHtml = "";
      let polarityTitle = `Polarité du Mod : ${modPolarity}`;

      if (polarityMatch === "match") {
        polarityTitle = isAuraOrStance
          ? `Polarité du Mod : ${modPolarity} (CORRESPONDANCE : Emplacement ${polarity} — Capacité bonus doublée à ${displayDrain} !)`
          : `Polarité du Mod : ${modPolarity} (CORRESPONDANCE : Emplacement ${polarity} — Coût divisé par deux à ${displayDrain} !)`;
      } else if (polarityMatch === "mismatch") {
        polarityTitle = isAuraOrStance
          ? `Polarité du Mod : ${modPolarity} (DISCORDANCE : Emplacement ${polarity} — Capacité bonus réduite à ${displayDrain})`
          : `Polarité du Mod : ${modPolarity} (DISCORDANCE : Emplacement ${polarity} — Coût augmenté à ${displayDrain} !)`;
      } else {
        polarityTitle = `Polarité du Mod : ${modPolarity} (Emplacement neutre)`;
      }

      if (modPolarity && modPolarity !== "none" && modIconUrl) {
        modPolarityHtml = `
          <span class="mod-polarity-badge ${polarityMatch}" title="${polarityTitle}">
            <img class="polarity-icon-img mod-pol-img ${polarityMatch}" src="${modIconUrl}" alt="${modPolarity}" />
          </span>
        `;
      }

      // Clean description: strip outer <p>...</p> tags and clean whitespace
      let desc = mod.system?.description || "";
      desc = desc.replace(/^<p\b[^>]*>/i, "").replace(/<\/p>$/i, "").trim();

      return new Handlebars.SafeString(`
        <div class="mod-slot-card-container">
          <span class="slot-label">${slotLabel}</span>
          <div class="mod-slot-card occupied item-row rarity-${rarity}" data-slot="${slotKey}" data-item-id="${mod.id}" title="${mod.name}">
            <div class="card-top-bar">
              <span class="mod-drain-badge ${polarityMatch}" title="${polarityTitle}">${displayDrain}</span>
              <div class="card-polarities-cluster">
                ${modPolarityHtml}
                <span class="slot-polarity ${polarityMatch}" data-slot="${slotKey}" title="Slot Polarity: ${polarity} (Click to cycle)">${slotPolarityIconHtml}</span>
              </div>
            </div>
            <div class="mod-art-container">
              <img class="mod-art-img" src="${modImg}" alt="${mod.name}" />
            </div>
            <div class="mod-card-header">
              <span class="mod-name" title="${mod.name}">${mod.name}</span>
            </div>
            <div class="mod-card-body">
              <div class="mod-desc">${desc}</div>
            </div>
          </div>
        </div>
      `);
    } else {
      return new Handlebars.SafeString(`
        <div class="mod-slot-card-container">
          <span class="slot-label">${slotLabel}</span>
          <div class="mod-slot-card empty" data-slot="${slotKey}">
            <span class="slot-polarity" data-slot="${slotKey}" title="Slot Polarity: ${polarity} (Click to cycle)">${slotPolarityIconHtml}</span>
            <div class="empty-slot-content">
              <i class="fas fa-plus"></i>
              <span>Vide</span>
            </div>
          </div>
        </div>
      `);
    }
  });
});

Hooks.on("renderChatMessage", (message, html, data) => {
  // Gestion unifiée des boutons d'application de combat (.apply-combat-effect-btn & .apply-chat-effect-btn)
  html.find(".apply-combat-effect-btn, .apply-chat-effect-btn").click(async event => {
    event.preventDefault();
    const btn = event.currentTarget;
    const action = btn.dataset.action; // "damage", "damage-half", "heal"
    const rawVal = Number(btn.dataset.amount ?? btn.dataset.value) || 0;
    const damageType = btn.dataset.damageType || "physical";
    const isFinisher = btn.dataset.isFinisher === "true";
    const isHealing = action === "heal";
    const isHalfDamage = action === "damage-half";

    const targets = getCombatTargets();
    if (targets.length === 0) {
      ui.notifications.warn("Veuillez cibler un token (touche T) ou sélectionner un token sur la scène pour appliquer cet effet !");
      return;
    }

    for (let t of targets) {
      const actor = t.actor;
      if (!actor) continue;

      const res = await applyWarframeDamageOrHealing(actor, {
        amount: rawVal,
        damageType,
        isHealing,
        isFinisher,
        isHalfDamage,
        sourceName: message.speaker?.alias || "Action de Combat"
      });

      if (res) {
        if (res.isHealing) {
          ui.notifications.info(`💚 Soin appliqué à ${actor.name} : +${res.healthRestored} PV (${res.previous.health} ➔ ${res.current.health})`);
        } else if (res.isImmune) {
          ui.notifications.info(`🛡️ ${actor.name} est immunisé(e) aux dégâts ${damageType} !`);
        } else {
          ui.notifications.info(`💥 Dégâts appliqués à ${actor.name} : -${res.effectiveDamage} ${damageType} (PV: ${res.previous.health} ➔ ${res.current.health})`);
        }
      }
    }
  });
});

Hooks.on("createItem", (item, options, userId) => {
  if (item.parent && item.parent.type === "warframe" && item.type === "warframe") {
    console.log("Warframe TTRPG | createItem hook triggered for frame:", item.name);
    setTimeout(() => {
      item.parent.checkAndGrantAdvancements(item);
    }, 100);
  }
});

Hooks.on("deleteActiveEffect", async (effect, options, userId) => {
  if (game.user.id !== userId) return;

  const actor = effect.parent;
  if (!actor || actor.type !== "warframe") return;

  const isHysteria = effect.statuses?.has("hysteria") || effect.flags?.core?.statusId === "hysteria" || effect.name?.startsWith("Hysteria");
  if (isHysteria) {
    const talons = actor.items.find(i => i.type === "weapon" && (i.name === "Valkyr Talons" || i.flags?.["warframe-ttrpg"]?.isTalon));
    if (talons) {
      await actor.deleteEmbeddedDocuments("Item", [talons.id]);
      ui.notifications.info("Hysteria ended: Removed Valkyr Talons from inventory.");
    }
  }

  const isExaltedBlade = effect.statuses?.has("exalted_blade") || effect.flags?.core?.statusId === "exalted_blade" || effect.name?.startsWith("Exalted Blade");
  if (isExaltedBlade) {
    const blade = actor.items.find(i => i.type === "weapon" && (i.name === "Exalted Blade" || i.flags?.["warframe-ttrpg"]?.isExaltedBlade));
    if (blade) {
      await actor.deleteEmbeddedDocuments("Item", [blade.id]);
      ui.notifications.info("Exalted Blade ended: Removed Exalted Blade weapon from inventory.");
    }
  }
});

Hooks.on("deleteItem", async (item, options, userId) => {
  if (game.user.id !== userId) return;

  const actor = item.parent;
  if (!actor || actor.type !== "warframe") return;

  const isTalon = item.type === "weapon" && (item.name === "Valkyr Talons" || item.flags?.["warframe-ttrpg"]?.isTalon);
  if (isTalon) {
    const effect = actor.effects.find(e => !e.disabled && (e.statuses?.has("hysteria") || e.flags?.core?.statusId === "hysteria" || e.name?.startsWith("Hysteria")));
    if (effect) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
      ui.notifications.info("Valkyr Talons removed: Hysteria effect ended.");
    }
  }

  const isExaltedBlade = item.type === "weapon" && (item.name === "Exalted Blade" || item.flags?.["warframe-ttrpg"]?.isExaltedBlade);
  if (isExaltedBlade) {
    const effect = actor.effects.find(e => !e.disabled && (e.statuses?.has("exalted_blade") || e.flags?.core?.statusId === "exalted_blade" || e.name?.startsWith("Exalted Blade")));
    if (effect) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
      ui.notifications.info("Exalted Blade weapon removed: Exalted Blade effect ended.");
    }
  }
});

Hooks.on("preCreateActiveEffect", (effect, data, options, userId) => {
  const actor = effect.parent;
  if (!actor || actor.type !== "warframe") return true;

  const statusId = effect.statuses?.first() || effect.flags?.core?.statusId;
  if (!statusId) return true;

  // List of standard statuses that should NOT stack
  const standardStatuses = ["slash", "impact", "puncture", "heat", "cold", "electricity", "toxin", "magnetic", "blast", "gas", "radiation", "viral", "void"];
  if (standardStatuses.includes(statusId)) {
    const alreadyHas = actor.effects.some(e => e.id !== effect.id && !e.disabled && (e.statuses?.has(statusId) || e.flags?.core?.statusId === statusId));
    if (alreadyHas) {
      ui.notifications.warn(`Target already has the ${effect.name || statusId} status effect. Only Corrosive can stack.`);
      return false; // Prevent creation of the duplicate effect
    }
  }

  // Ash Passive check for Slash (Bleed) duration boost
  if (statusId === "slash") {
    let originActor = null;
    if (effect.origin) {
      try {
        const originDoc = fromUuidSync(effect.origin);
        originActor = originDoc instanceof Actor ? originDoc : originDoc?.parent;
      } catch (e) {}
    }
    if (originActor?.system?.details?.frameClass === "Ash") {
      const statusDurationBonus = Number(originActor.system.statusDuration?.value) || 0;
      const totalBonus = statusDurationBonus + 50; // stacks additively
      const baseRounds = effect.duration?.rounds || 1;
      const newRounds = Math.ceil(baseRounds * (1 + totalBonus / 100));
      effect.updateSource({ "duration.rounds": newRounds });
      log(`Ash Passive: Bleed duration increased to ${newRounds} rounds (additive bonus: ${totalBonus}%).`);
    }
  }

  // Vauban Passive check: damaging status applied while target is incapacitated
  const damagingStatuses = ["slash", "heat", "toxin", "gas", "electricity"];
  if (damagingStatuses.includes(statusId) && effect.origin) {
    let originActor = null;
    try {
      const originDoc = fromUuidSync(effect.origin);
      originActor = originDoc instanceof Actor ? originDoc : originDoc?.parent;
    } catch (e) {}
    if (originActor?.system?.details?.frameClass === "Vauban") {
      if (actor.isIncapacitated && actor.isIncapacitated()) {
        effect.updateSource({
          "flags.warframe-ttrpg.isVaubanIncapacitatedStatus": true
        });
        log(`Vauban Passive: Damaging status ${statusId} tagged for double-dipping damage.`);
      }
    }
  }

  return true;
});

Hooks.on("preUpdateActor", (actor, update, options, userId) => {
  if (actor.type !== "warframe") return;

  const isValkyr = actor.system.details?.frameClass === "Valkyr";

  // 1. Invulnerability check (for both Hysteria and Defiance)
  const isInvulnerable = actor.effects.some(e => !e.disabled && (
    e.statuses?.has("invulnerable") || 
    e.flags?.core?.statusId === "invulnerable"
  ));

  if (isInvulnerable) {
    // Block Health damage
    if (update.system?.health?.value !== undefined) {
      const newHealth = Number(update.system.health.value);
      const oldHealth = Number(actor.system.health.value) || 0;
      if (newHealth < oldHealth) {
        update.system.health.value = oldHealth;
      }
    }
    // Block Shield damage
    if (update.system?.shields?.value !== undefined) {
      const newShields = Number(update.system.shields.value);
      const oldShields = Number(actor.system.shields.value) || 0;
      if (newShields < oldShields) {
        update.system.shields.value = oldShields;
      }
    }
  }

  // 2. Fatal damage prevention check (Valkyr Defiance)
  if (isValkyr && update.system?.health?.value !== undefined) {
    const newHealth = Number(update.system.health.value);
    const oldHealth = Number(actor.system.health.value) || 0;
    
    if (newHealth <= 0 && oldHealth > 0) {
      const currentRage = Number(actor.system.rage?.value) || 0;
      
      if (currentRage >= 150) {
        const maxHealth = Number(actor.system.health.max) || 100;
        
        update.system.health.value = maxHealth;
        
        if (!update.system.rage) update.system.rage = {};
        update.system.rage.value = 0;
        
        (async () => {
          await actor.createEmbeddedDocuments("ActiveEffect", [{
            name: "Valkyr Invulnerability (Defy)",
            icon: "icons/skills/melee/shield-block-gray-orange.webp",
            origin: actor.uuid,
            duration: { rounds: 2 },
            statuses: ["invulnerable"],
            description: "Invulnerable after consuming Rage to prevent fatal damage!",
            flags: {
              core: { statusId: "invulnerable" },
              customDescription: "Invulnerable after consuming Rage to prevent fatal damage!"
            }
          }]);
          
          await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `
              <div style="background: rgba(231, 76, 60, 0.1); border: 1px solid rgba(231, 76, 60, 0.4); border-radius: 6px; padding: 10px; font-family: 'Orbitron', sans-serif; color: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                <h3 style="margin: 0 0 6px 0; color: #e74c3c; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid rgba(231, 76, 60, 0.2); padding-bottom: 4px;">
                  💥 Valkyr's Defiance 💥
                </h3>
                <p style="margin: 0; font-size: 11px; color: #cbd5e1; line-height: 1.4;">
                  A fatal blow was struck! Valkyr consumed <strong>${currentRage}% Rage</strong> to prevent death, regenerated <strong>100% Health</strong>, and gained <strong>Invulnerability</strong> for 2 rounds!
                </p>
              </div>
            `
          });
        })();
      }
    }
  }
});
Hooks.on("updateCombat", async (combat, update, options, userId) => {
  // Only process if the turn or round changed
  if (update.turn === undefined && update.round === undefined) return;
  
  // Prevent duplicate execution by only letting the first active GM run it
  const firstGM = game.users.find(u => u.isGM && u.active);
  if (firstGM && game.user.id !== firstGM.id) return;

  const combatant = combat.combatant;
  const actor = combatant?.actor;
  if (!actor) return;

  // Auto-reset turn kinetic economy (2 Actions, 1 Parkour, 1 Reaction)
  if (typeof actor.resetCombatActions === "function") {
    await actor.resetCombatActions();
  }

  const activeEffect = actor.effects.find(e => e.statuses?.has("brightbonnet_buff") || e.flags.core?.statusId === "brightbonnet_buff");
  if (activeEffect) {
    const energyRegen = activeEffect.flags.energyRegen || 10;
    const currentEnergy = Number(actor.system.energy?.value) || 0;
    const maxEnergy = Number(actor.system.energy?.max) || 100;
    const newEnergy = Math.min(maxEnergy, currentEnergy + energyRegen);
    
    if (newEnergy !== currentEnergy) {
      await actor.update({ "system.energy.value": newEnergy });
      
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `
          <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 4px; padding: 6px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #00e5ff;">
            ✨ <strong>Brightbonnet Rejuvenation</strong>: Automatically restored <strong>${energyRegen} Energy</strong> to ${actor.name}.
          </div>
        `
      });
    }
  }

  // Reroot Health & Shield Regen
  const rerootEffect = actor.effects.find(e => e.statuses?.has("reroot_buff") || e.flags.core?.statusId === "reroot_buff");
  if (rerootEffect) {
    const rerootHeal = rerootEffect.flags.rerootHeal || 24;
    const currentHealth = Number(actor.system.health?.value) || 0;
    const maxHealth = Number(actor.system.health?.max) || 100;
    const currentShields = Number(actor.system.shields?.value) || 0;
    const maxShields = Number(actor.system.shields?.max) || 100;

    const newHealth = Math.min(maxHealth, currentHealth + rerootHeal);
    const newShields = Math.min(maxShields, currentShields + rerootHeal);

    if (newHealth !== currentHealth || newShields !== currentShields) {
      await actor.update({
        "system.health.value": newHealth,
        "system.shields.value": newShields
      });

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `
          <div style="background: rgba(46, 204, 113, 0.05); border: 1px solid rgba(46, 204, 113, 0.25); border-radius: 4px; padding: 6px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #2ecc71;">
            🌿 <strong>Sprodling Form (Reroot)</strong>: Automatically healed <strong>${rerootHeal} Health & Shields</strong> to ${actor.name}.
          </div>
        `
      });
    }
  }

  // --- Vauban Turn-Start Ticks ---
  // 1. Tesla Nervos Drone Tick
  const teslaDrone = actor.effects.find(e => !e.disabled && e.name === "Tesla Nervos Drone");
  if (teslaDrone) {
    const tickFormula = teslaDrone.flags?.["warframe-ttrpg"]?.tickFormula || "1d4";
    const powerStrength = teslaDrone.flags?.["warframe-ttrpg"]?.powerStrength || 100;
    
    const rollVal = new Roll(tickFormula);
    await rollVal.evaluate();
    await rollVal.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `${actor.name} takes Tesla Nervos drone tick damage`
    });
    let dmg = Math.round(rollVal.total * (powerStrength / 100));
    
    // Vauban passive applies +25% damage since they are incapacitated
    dmg = Math.round(dmg * 1.25);

    let currentShields = Number(actor.system.shields?.value) || 0;
    let currentHealth = Number(actor.system.health?.value) || 0;
    let dmgToShields = Math.min(currentShields, dmg);
    let dmgToHealth = dmg - dmgToShields;
    
    await actor.update({
      "system.shields.value": currentShields - dmgToShields,
      "system.health.value": Math.max(0, currentHealth - dmgToHealth)
    });

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `
        <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 4px; padding: 10px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #00e5ff;">
          🤖 <strong>Tesla Nervos Shock</strong>: drone shocked <strong>${actor.name}</strong> for <strong>${dmg} Electricity damage</strong> (Shields: ${currentShields} ➔ ${currentShields - dmgToShields}, Health: ${currentHealth} ➔ ${Math.max(0, currentHealth - dmgToHealth)}).
        </div>
      `
    });
  }

  // 2. Bastille Armor Strip & Transfer
  const bastillePrison = actor.effects.find(e => !e.disabled && e.name === "Bastille Lifting Prison");
  if (bastillePrison) {
    const stripPercent = bastillePrison.flags?.["warframe-ttrpg"]?.stripPercent || 10;
    const casterId = bastillePrison.flags?.["warframe-ttrpg"]?.casterId;
    const caster = game.actors.get(casterId);
    
    if (caster) {
      const currentArmor = Number(actor.system.armor?.value) || 0;
      const stripped = Math.round(currentArmor * (stripPercent / 100));
      
      if (stripped > 0) {
        await actor.update({ "system.armor.value": Math.max(0, currentArmor - stripped) });
        
        // Find or create Bastille Armor Buff on caster
        let armorBuff = caster.effects.find(e => !e.disabled && e.name === "Bastille Armor Buff");
        let currentBuffedArmor = 0;
        if (armorBuff) {
          const change = armorBuff.changes.find(c => c.key === "system.armor.value");
          currentBuffedArmor = Number(change?.value) || 0;
        }

        const newBuffedArmor = Math.min(1500, currentBuffedArmor + stripped);
        const addedThisTick = newBuffedArmor - currentBuffedArmor;

        if (addedThisTick > 0) {
          if (armorBuff) {
            const changes = foundry.utils.duplicate(armorBuff.changes);
            const change = changes.find(c => c.key === "system.armor.value");
            if (change) change.value = String(newBuffedArmor);
            await armorBuff.update({ changes });
          } else {
            await caster.createEmbeddedDocuments("ActiveEffect", [{
              name: "Bastille Armor Buff",
              icon: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
              origin: bastillePrison.origin,
              duration: { rounds: bastillePrison.duration?.rounds || 2 },
              description: `Stealing armor from Bastille stasis prison.`,
              changes: [
                { key: "system.armor.value", mode: 2, value: String(newBuffedArmor) }
              ]
            }]);
          }
        }

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor }),
          content: `
            <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 4px; padding: 10px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #00e5ff;">
              ⛓️ <strong>Bastille Armor Strip</strong>: Stripped <strong>${stripped} Armor</strong> from <strong>${actor.name}</strong> and transferred to <strong>${caster.name}</strong> (Caster Buff: +${newBuffedArmor} Armor).
            </div>
          `
        });
      }
    }
  }

  // 3. Vortex Gravity Damage & Status
  const vortexPull = actor.effects.find(e => !e.disabled && e.name === "Vortex Pull");
  if (vortexPull) {
    const vortexFormula = vortexPull.flags?.["warframe-ttrpg"]?.vortexFormula || "3d10";
    const powerStrength = vortexPull.flags?.["warframe-ttrpg"]?.powerStrength || 100;

    const rollVal = new Roll(vortexFormula);
    await rollVal.evaluate();
    await rollVal.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `${actor.name} takes Vortex gravity damage`
    });
    let dmg = Math.round(rollVal.total * (powerStrength / 100));

    dmg = Math.round(dmg * 1.25);

    let currentShields = Number(actor.system.shields?.value) || 0;
    let currentHealth = Number(actor.system.health?.value) || 0;
    let dmgToShields = Math.min(currentShields, dmg);
    let dmgToHealth = dmg - dmgToShields;

    await actor.update({
      "system.shields.value": currentShields - dmgToShields,
      "system.health.value": Math.max(0, currentHealth - dmgToHealth)
    });

    let magMsg = "";
    if (Math.random() < 0.40) {
      const magIcon = "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png";
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Magnetic (Vortex)",
        icon: magIcon,
        origin: vortexPull.origin,
        duration: { rounds: 1 },
        statuses: ["magnetic"],
        description: "Disrupted: Halves maximum shields.",
        flags: {
          core: { statusId: "magnetic" }
        }
      }]);
      magMsg = " and applied 🧲 Magnetic status (halves shields)";
    }

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `
        <div style="background: rgba(255, 42, 95, 0.05); border: 1px solid rgba(255, 42, 95, 0.25); border-radius: 4px; padding: 10px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #ff2a5f;">
          🌀 <strong>Vortex Gravity Strike</strong>: dealt <strong>${dmg} Magnetic damage</strong> to <strong>${actor.name}</strong>${magMsg} (Shields: ${currentShields} ➔ ${currentShields - dmgToShields}, Health: ${currentHealth} ➔ ${Math.max(0, currentHealth - dmgToHealth)}).
        </div>
      `
    });
  }

  // Hysteria Energy Drain
  const hysteriaEffect = actor.effects.find(e => !e.disabled && (e.statuses?.has("hysteria") || e.flags?.core?.statusId === "hysteria"));
  if (hysteriaEffect) {
    const energyDrain = 5; // 5 Energy per turn
    const currentEnergy = Number(actor.system.energy?.value) || 0;
    const newEnergy = Math.max(0, currentEnergy - energyDrain);
    
    await actor.update({ "system.energy.value": newEnergy });
    
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `
        <div style="background: rgba(231, 76, 60, 0.05); border: 1px solid rgba(231, 76, 60, 0.25); border-radius: 4px; padding: 6px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #e74c3c;">
          🔥 <strong>Hysteria Drain</strong>: Consumed <strong>${energyDrain} Energy</strong> to maintain active Talons (Current: ${newEnergy} Energy).
        </div>
      `
    });

    if (newEnergy === 0) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [hysteriaEffect.id]);
      ui.notifications.warn(`${actor.name} has run out of Energy! Hysteria has deactivated.`);
    }
  }

  // Exalted Blade Energy Drain
  const exaltedBladeEffect = actor.effects.find(e => !e.disabled && (e.statuses?.has("exalted_blade") || e.flags?.core?.statusId === "exalted_blade"));
  if (exaltedBladeEffect) {
    const energyDrain = 5; // 5 Energy per turn
    const currentEnergy = Number(actor.system.energy?.value) || 0;
    const newEnergy = Math.max(0, currentEnergy - energyDrain);
    
    await actor.update({ "system.energy.value": newEnergy });
    
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `
        <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 4px; padding: 6px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #00e5ff;">
          ⚡ <strong>Exalted Blade Drain</strong>: Consumed <strong>${energyDrain} Energy</strong> to maintain active Exalted Blade (Current: ${newEnergy} Energy).
        </div>
      `
    });

    if (newEnergy === 0) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [exaltedBladeEffect.id]);
      ui.notifications.warn(`${actor.name} has run out of Energy! Exalted Blade has deactivated.`);
    }
  }

  // --- Helper to check status effects ---
  const hasStatus = (statusId) => {
    return actor.effects.some(e => !e.disabled && (e.statuses?.has(statusId) || e.flags?.core?.statusId === statusId));
  };

  // --- Initialize values for this turn ---
  let healthUpdated = Number(actor.system.health?.value) || 0;
  let shieldsUpdated = Number(actor.system.shields?.value) || 0;
  const maxHealth = Number(actor.system.health?.max) || 100;
  const maxShields = Number(actor.system.shields?.max) || 0;
  const originalShields = shieldsUpdated;

  // --- Valkyr Rage Decay calculations ---
  const isValkyr = actor.system.details?.frameClass === "Valkyr";
  let rageUpdated = isValkyr ? (Number(actor.system.rage?.value) || 0) : 0;
  let decayAmount = 0;
  if (isValkyr) {
    const builtThisRound = actor.flags?.["warframe-ttrpg"]?.rageBuiltThisRound;
    if (!builtThisRound && rageUpdated > 0) {
      decayAmount = Math.max(10, Math.round(rageUpdated * 0.1));
      rageUpdated = Math.max(0, rageUpdated - decayAmount);
    }
  }

  // --- Atlas Rubble Decay calculations ---
  const isAtlas = actor.system.details?.frameClass === "Atlas";
  let rubbleUpdated = isAtlas ? (Number(actor.system.rubble?.value) || 0) : 0;
  let rubbleDecayAmount = 0;
  if (isAtlas && rubbleUpdated > 0) {
    const hasCapstone = actor.items.some(i => i.name === "Rubbled Landslide" || i.id === "atlascaps0000001");
    rubbleDecayAmount = hasCapstone ? 25 : 50;
    rubbleUpdated = Math.max(0, rubbleUpdated - rubbleDecayAmount);
  }

  // Check if target is currently affected by any damaging status effect (pauses shield regen)
  const hasDamagingStatus = 
    hasStatus("slash") || 
    hasStatus("heat") || 
    hasStatus("toxin") || 
    hasStatus("electricity") || 
    hasStatus("blast") || 
    hasStatus("gas") || 
    hasStatus("void");

  // --- 1. Natural Shield Regeneration (calculated in memory first) ---
  let regenAmount = 0;
  if (maxShields > 0 && !hasStatus("magnetic") && !hasDamagingStatus) {
    regenAmount = Math.max(1, Math.round(maxShields * 0.1));
    shieldsUpdated = Math.min(maxShields, shieldsUpdated + regenAmount);
    regenAmount = shieldsUpdated - originalShields; // Actual regenerated amount
  }

  // --- 2. Automated Status Effects Damage & Chaining ---
  const statusLog = [];
  const statusIcons = {
    slash: "systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png",
    heat: "systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png",
    toxin: "systems/warframe-ttrpg/asset/Element icon/300px-ToxinModBundleIcon.webp",
    electricity: "systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png",
    blast: "systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png",
    gas: "systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png",
    void: "systems/warframe-ttrpg/asset/Element icon/EssentialVoidGlyph.png"
  };

  const findAdjacentTokens = (sourceToken, maxDistFt) => {
    if (!sourceToken || !canvas.grid) return [];
    const maxPixels = maxDistFt * (canvas.grid.size / (canvas.scene?.grid?.distance || 5)) + 5;
    return canvas.tokens.placeables.filter(t => {
      if (t.id === sourceToken.id || !t.actor) return false;
      const dx = (sourceToken.x + sourceToken.document.width * canvas.grid.size / 2) - (t.x + t.document.width * canvas.grid.size / 2);
      const dy = (sourceToken.y + sourceToken.document.height * canvas.grid.size / 2) - (t.y + t.document.height * canvas.grid.size / 2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      return dist <= maxPixels;
    });
  };

  const getSourceToken = () => {
    return combatant.token?.object || canvas.tokens.placeables.find(t => t.actor?.id === actor.id);
  };

  // A. Toxin (Poison) - Bypasses shields completely
  if (hasStatus("toxin")) {
    const toxinEffect = actor.effects.find(e => !e.disabled && (e.statuses?.has("toxin") || e.flags?.core?.statusId === "toxin"));
    let statusDamageBonus = 0;
    if (toxinEffect && toxinEffect.flags?.["warframe-ttrpg"]?.isVaubanIncapacitatedStatus) {
      statusDamageBonus += 25;
    }
    const baseToxinDmg = Math.max(1, Math.round(maxHealth * 0.1));
    const toxinDmg = Math.round(baseToxinDmg * (1 + statusDamageBonus / 100));
    healthUpdated = Math.max(0, healthUpdated - toxinDmg);
    statusLog.push({
      status: "toxin",
      label: "Toxin (Poison)",
      msg: `Took <strong>${toxinDmg} Poison damage</strong> directly to Health (bypassing shields).`
    });
  }

  // B. Slash (Bleed) - Physical, absorbed by shields first, bypasses armor
  if (hasStatus("slash")) {
    const slashEffect = actor.effects.find(e => !e.disabled && (e.statuses?.has("slash") || e.flags?.core?.statusId === "slash"));
    let originActor = null;
    if (slashEffect && slashEffect.origin) {
      try {
        const originDoc = fromUuidSync(slashEffect.origin);
        originActor = originDoc instanceof Actor ? originDoc : originDoc?.parent;
      } catch (e) {}
    }
    const isAshOrigin = originActor?.system?.details?.frameClass === "Ash";

    let statusDamageBonus = 0;
    if (originActor) {
      statusDamageBonus += Number(originActor.system.statusDamage?.value) || 0;
    }
    if (isAshOrigin) {
      statusDamageBonus += 25; // Additive 25% Ash Bleed Passive
    }
    if (slashEffect?.flags?.["warframe-ttrpg"]?.isFatalTeleportBleed) {
      statusDamageBonus += 50; // Additive 50% Fatal Teleport Bleed
    }
    if (slashEffect?.flags?.["warframe-ttrpg"]?.isVaubanIncapacitatedStatus) {
      statusDamageBonus += 25; // Additive 25% Vauban Passive
    }

    const baseSlashDmg = Math.max(1, Math.round(maxHealth * 0.1));
    const slashDmg = Math.round(baseSlashDmg * (1 + statusDamageBonus / 100));

    let dmgToShields = Math.min(shieldsUpdated, slashDmg);
    let dmgToHealth = slashDmg - dmgToShields;
    shieldsUpdated -= dmgToShields;
    healthUpdated = Math.max(0, healthUpdated - dmgToHealth);
    statusLog.push({
      status: "slash",
      label: "Slash (Bleed)",
      msg: `Took <strong>${slashDmg} Bleed damage</strong> (Shields absorbed ${dmgToShields}, Health took ${dmgToHealth}).`
    });
  }

  // C. Heat (Burn) - Standard damage, absorbed by shields first
  if (hasStatus("heat")) {
    const heatEffect = actor.effects.find(e => !e.disabled && (e.statuses?.has("heat") || e.flags?.core?.statusId === "heat"));
    let statusDamageBonus = 0;
    if (heatEffect && heatEffect.flags?.["warframe-ttrpg"]?.isVaubanIncapacitatedStatus) {
      statusDamageBonus += 25;
    }
    const baseHeatDmg = Math.max(1, Math.round(maxHealth * 0.05));
    const heatDmg = Math.round(baseHeatDmg * (1 + statusDamageBonus / 100));
    let dmgToShields = Math.min(shieldsUpdated, heatDmg);
    let dmgToHealth = heatDmg - dmgToShields;
    shieldsUpdated -= dmgToShields;
    healthUpdated = Math.max(0, healthUpdated - dmgToHealth);
    statusLog.push({
      status: "heat",
      label: "Heat (Burn)",
      msg: `Took <strong>${heatDmg} Burn damage</strong> (Shields absorbed ${dmgToShields}, Health took ${dmgToHealth}).`
    });
  }

  // D. Gas (Cloud) - Poison, absorbed by shields first
  if (hasStatus("gas")) {
    const gasEffect = actor.effects.find(e => !e.disabled && (e.statuses?.has("gas") || e.flags?.core?.statusId === "gas"));
    let statusDamageBonus = 0;
    if (gasEffect && gasEffect.flags?.["warframe-ttrpg"]?.isVaubanIncapacitatedStatus) {
      statusDamageBonus += 25;
    }
    const baseGasDmg = Math.max(1, Math.round(maxHealth * 0.1));
    const gasDmg = Math.round(baseGasDmg * (1 + statusDamageBonus / 100));
    let dmgToShields = Math.min(shieldsUpdated, gasDmg);
    let dmgToHealth = gasDmg - dmgToShields;
    shieldsUpdated -= dmgToShields;
    healthUpdated = Math.max(0, healthUpdated - dmgToHealth);
    statusLog.push({
      status: "gas",
      label: "Gas (Cloud)",
      msg: `Took <strong>${gasDmg} Gas Cloud damage</strong> (Shields absorbed ${dmgToShields}, Health took ${dmgToHealth}).`
    });
  }

  // E. Electricity (Tesla) - Shock damage + chain
  if (hasStatus("electricity")) {
    const elecEffect = actor.effects.find(e => !e.disabled && (e.statuses?.has("electricity") || e.flags?.core?.statusId === "electricity"));
    let statusDamageBonus = 0;
    if (elecEffect && elecEffect.flags?.["warframe-ttrpg"]?.isVaubanIncapacitatedStatus) {
      statusDamageBonus += 25;
    }
    const baseElecDmg = Math.max(1, Math.round(maxHealth * 0.1));
    const elecDmg = Math.round(baseElecDmg * (1 + statusDamageBonus / 100));
    let dmgToShields = Math.min(shieldsUpdated, elecDmg);
    let dmgToHealth = elecDmg - dmgToShields;
    shieldsUpdated -= dmgToShields;
    healthUpdated = Math.max(0, healthUpdated - dmgToHealth);
    
    let chainMsg = "";
    const sourceToken = getSourceToken();
    if (sourceToken) {
      const adj = findAdjacentTokens(sourceToken, 5);
      const chainDmg = Math.max(1, Math.round(maxHealth * 0.1));
      for (let t of adj) {
        const adjActor = t.actor;
        let adjHealth = Number(adjActor.system.health?.value) || 0;
        let adjShields = Number(adjActor.system.shields?.value) || 0;
        
        let adjDmgToShields = Math.min(adjShields, chainDmg);
        let adjDmgToHealth = chainDmg - adjDmgToShields;
        adjShields -= adjDmgToShields;
        adjHealth = Math.max(0, adjHealth - adjDmgToHealth);
        
        await adjActor.update({
          "system.health.value": adjHealth,
          "system.shields.value": adjShields
        });
        chainMsg += `<br/>⚡ Chained to <strong>${t.name}</strong> for ${chainDmg} electric damage.`;
      }
    }
    
    statusLog.push({
      status: "electricity",
      label: "Electricity (Tesla)",
      msg: `Took <strong>${elecDmg} Shock damage</strong>.${chainMsg}`
    });
  }

  // F. Blast (Explosion) - Explosion damage + radial area
  if (hasStatus("blast")) {
    const blastDmg = Math.max(1, Math.round(maxHealth * 0.1));
    let dmgToShields = Math.min(shieldsUpdated, blastDmg);
    let dmgToHealth = blastDmg - dmgToShields;
    shieldsUpdated -= dmgToShields;
    healthUpdated = Math.max(0, healthUpdated - dmgToHealth);
    
    let blastMsg = "";
    const sourceToken = getSourceToken();
    if (sourceToken) {
      const adj = findAdjacentTokens(sourceToken, 5);
      const halfDmg = Math.max(1, Math.round(blastDmg / 2));
      for (let t of adj) {
        const adjActor = t.actor;
        let adjHealth = Number(adjActor.system.health?.value) || 0;
        let adjShields = Number(adjActor.system.shields?.value) || 0;
        
        let adjDmgToShields = Math.min(adjShields, halfDmg);
        let adjDmgToHealth = halfDmg - adjDmgToShields;
        adjShields -= adjDmgToShields;
        adjHealth = Math.max(0, adjHealth - adjDmgToHealth);
        
        await adjActor.update({
          "system.health.value": adjHealth,
          "system.shields.value": adjShields
        });
        blastMsg += `<br/>💥 Blast radius hit <strong>${t.name}</strong> for ${halfDmg} explosive damage.`;
      }
    }
    
    statusLog.push({
      status: "blast",
      label: "Blast (Explosion)",
      msg: `Took <strong>${blastDmg} Explosion damage</strong>.${blastMsg}`
    });
  }

  // G. Void (Chaotic Rift) - Random d6 effect
  if (hasStatus("void")) {
    const voidRoll = Math.floor(Math.random() * 6) + 1;
    let voidMsg = "";
    if (voidRoll <= 2) {
      const voidDmg = Math.max(1, Math.round(maxHealth * 0.1));
      let dmgToShields = Math.min(shieldsUpdated, voidDmg);
      let dmgToHealth = voidDmg - dmgToShields;
      shieldsUpdated -= dmgToShields;
      healthUpdated = Math.max(0, healthUpdated - dmgToHealth);
      voidMsg = `Rolled <strong>${voidRoll}</strong>: Took <strong>${voidDmg} Void damage</strong>.`;
    } else if (voidRoll <= 4) {
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Restrained (Void Tendrils)",
        icon: "icons/svg/net.svg",
        origin: actor.uuid,
        duration: { rounds: 1 },
        statuses: ["restrained"],
        description: "Restrained by void tendrils! Speed is 0.",
        flags: {
          core: { statusId: "restrained" },
          customDescription: "Restrained by void tendrils! Speed is 0."
        }
      }]);
      voidMsg = `Rolled <strong>${voidRoll}</strong>: Applied <strong>Restrained</strong> (Speed set to 0, attacks have disadvantage).`;
    } else {
      voidMsg = `Rolled <strong>${voidRoll}</strong>: Confused! Target must attack the nearest ally on their turn.`;
    }
    
    statusLog.push({
      status: "void",
      label: "Void (Chaotic Rift)",
      msg: voidMsg
    });
  }

  // --- 3. Single Consolidated Database Update ---
  const updateData = {};
  if (healthUpdated !== (Number(actor.system.health?.value) || 0)) {
    updateData["system.health.value"] = healthUpdated;
  }
  if (shieldsUpdated !== (Number(actor.system.shields?.value) || 0)) {
    updateData["system.shields.value"] = shieldsUpdated;
  }
  if (isValkyr) {
    updateData["system.rage.value"] = rageUpdated;
    updateData["flags.warframe-ttrpg.rageBuiltThisRound"] = false;
  }
  if (isAtlas) {
    updateData["system.rubble.value"] = rubbleUpdated;
  }
  if (Object.keys(updateData).length > 0) {
    await actor.update(updateData);
  }

  // --- 4. Chat Logs ---
  if (decayAmount > 0) {
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `
        <div style="background: rgba(231, 76, 60, 0.05); border: 1px solid rgba(231, 76, 60, 0.25); border-radius: 4px; padding: 6px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #e74c3c;">
          🔥 <strong>Rage Decay</strong>: Rage decreased by <strong>-${decayAmount}%</strong> due to inactivity (Current: ${rageUpdated}%).
        </div>
      `
    });
  }

  if (rubbleDecayAmount > 0) {
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `
        <div style="background: rgba(229, 152, 102, 0.05); border: 1px solid rgba(229, 152, 102, 0.25); border-radius: 4px; padding: 6px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #e59866;">
          ⛰️ <strong>Rubble Decay</strong>: Rubble decreased by <strong>-${rubbleDecayAmount}</strong> (Current: ${rubbleUpdated}/1500).
        </div>
      `
    });
  }

  if (regenAmount > 0) {
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `
        <div style="background: rgba(52, 152, 219, 0.05); border: 1px solid rgba(52, 152, 219, 0.25); border-radius: 4px; padding: 6px; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #3498db;">
          🛡️ <strong>Shield Recharge</strong>: Automatically recharged <strong>${regenAmount} Shields</strong> for ${actor.name}.
        </div>
      `
    });
  }

  if (statusLog.length > 0) {
    let cardHTML = `
      <div style="background: rgba(26, 26, 36, 0.95); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 10px; font-family: 'Inter', sans-serif; color: #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
        <h4 style="margin: 0 0 8px 0; font-family: 'Orbitron', sans-serif; color: #e74c3c; text-transform: uppercase; font-size: 11px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 4px;">
          ⚡ Turn Start Status Report - ${actor.name} ⚡
        </h4>
    `;
    
    for (let logEntry of statusLog) {
      const icon = statusIcons[logEntry.status] || "icons/svg/hazard.svg";
      cardHTML += `
        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: flex-start; background: rgba(0,0,0,0.25); padding: 6px; border-radius: 4px;">
          <img src="${icon}" style="height: 20px; width: 20px; border: none; border-radius: 2px;" />
          <div style="font-size: 11px;">
            <strong style="color: #fff;">${logEntry.label}</strong>: <span style="color: #cbd5e1;">${logEntry.msg}</span>
          </div>
        </div>
      `;
    }
    
    cardHTML += `</div>`;
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: cardHTML
    });
  }
});

Hooks.on("updateToken", async (tokenDoc, update, options, userId) => {
  // Only process on the GM's client to prevent duplicate execution
  const firstGM = game.users.find(u => u.isGM && u.active);
  if (firstGM && game.user.id !== firstGM.id) return;

  // Only check if coordinates changed
  if (update.x === undefined && update.y === undefined) return;

  const token = tokenDoc.object;
  if (!token || !token.actor) return;

  // Only allies can pick up spores
  const isHostile = token.document.disposition === CONST.TOKEN_DISPOSITIONS?.HOSTILE || token.document.disposition === -1;
  if (isHostile) return;

  // Get token center
  const tokenX = token.x + (token.document.width || 1) * canvas.grid.size / 2;
  const tokenY = token.y + (token.document.height || 1) * canvas.grid.size / 2;

  // Scan for active spore templates on the scene
  const sporeTemplates = canvas.scene?.templates?.filter(t => t.flags?.["warframe-ttrpg"]?.isSpore) || [];
  
  for (let tDoc of sporeTemplates) {
    const templateX = tDoc.x;
    const templateY = tDoc.y;
    const radiusPixels = (tDoc.distance || 0) * (canvas.grid.size / canvas.scene.grid.distance);

    const dx = tokenX - templateX;
    const dy = tokenY - templateY;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist <= radiusPixels + (canvas.grid.size / 2)) {
      // Picked up!
      const flags = tDoc.flags["warframe-ttrpg"];
      const healAmount = flags.heal || 50;
      const speedPercent = flags.speedPercent || 50;

      // 1. Delete the template immediately to prevent double-triggering
      await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [tDoc.id]);

      // 2. Apply heal to actor
      const actor = token.actor;
      const currentHealth = Number(actor.system.health?.value) || 0;
      const maxHealth = Number(actor.system.health?.max) || 100;
      const newHealth = Math.min(maxHealth, currentHealth + healAmount);
      await actor.update({ "system.health.value": newHealth });

      // 3. Apply speed buff
      const baseSpeed = Number(actor.system.speed?.land?.value) || 30;
      const speedBonus = Math.round(baseSpeed * (speedPercent / 100));

      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: "Spore Speed Buff",
        icon: "icons/skills/movement/wind-slashes-blue.webp",
        origin: tDoc.uuid,
        duration: { rounds: 1 },
        statuses: ["spore_speed"],
        changes: [{
          key: "system.speed.land.bonus",
          value: String(speedBonus),
          mode: 2
        }],
        description: `<strong>Spore Speed Buff</strong>: Gained +50% land speed (+${speedBonus} ft).`,
        flags: {
          core: { statusId: "spore_speed" },
          customDescription: `<strong>Spore Speed Buff</strong>: Gained +50% land speed (+${speedBonus} ft).`
        }
      }]);

      // 4. Send chat message
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `
          <div style="background: rgba(57, 255, 20, 0.05); border: 1px solid rgba(57, 255, 20, 0.25); border-radius: 6px; padding: 10px; font-family: 'Inter', sans-serif; color: #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <h4 style="margin: 0 0 6px 0; font-family: 'Orbitron', sans-serif; color: #39ff14; text-transform: uppercase; font-size: 11px;">
              🍄 Spore Picked Up! 🍄
            </h4>
            <div style="font-size: 11px;">
              <strong>${actor.name}</strong> stepped on a spore!<br/>
              ➔ Healed <strong>${healAmount} HP</strong><br/>
              ➔ Gained <strong>+${speedPercent}% Land Speed</strong> (+${speedBonus} ft) for 1 round.
            </div>
          </div>
        `
      });
      break; // Process one pickup per move update to be safe
    }
  }
});

Hooks.on("canvasInit", async (canvas) => {
  const scene = canvas.scene;
  if (!scene || isStarChartScene(scene)) return;

  // Only the active GM performs updates to avoid collisions
  const firstGM = game.users.find(u => u.isGM && u.active);
  if (firstGM && game.user.id !== firstGM.id) return;

  const currentUnits = scene.grid?.units || scene.units || "";
  const currentDiagonals = scene.grid?.diagonals;
  try {
    if (currentUnits === "m" || currentUnits === "meters" || currentUnits === "meter" || currentDiagonals !== 0) {
      // Automatically convert scene units to feet (ft) and set diagonals to 5/5/5 Equidistant (0)
      await scene.update({
        "grid.units": "ft",
        "grid.distance": 5,
        "grid.diagonals": 0
      });
      ui.notifications.info(`Warframe TTRPG | Automatically set Scene to 5 ft grid with 5/5/5 diagonals.`);
    }
  } catch (e) {
    ui.notifications.error(`Failed to update scene grid: ${e.message}`);
    console.error("Warframe TTRPG | Scene update error:", e);
  }
});

Hooks.on("preCreateToken", (tokenDoc, data, options, userId) => {
  tokenDoc.updateSource({ lockRotation: true });
});

Hooks.once("ready", async () => {
  const logs = [];
  const log = (msg) => {
    console.log(`Warframe TTRPG | ${msg}`);
    logs.push(`[INFO] ${msg}`);
  };
  const logErr = (msg, err) => {
    console.error(`Warframe TTRPG | ${msg}`, err);
    logs.push(`[ERROR] ${msg} - ${err?.message || err}`);
  };

  try {
    log("Ready hook started.");

    // Initialisation de l'ATH / HUD Warframe en bas à gauche pour tous les utilisateurs
    WarframeHUD.init();

    if (!game.user.isGM) {
      log("Not GM user, skipping.");
      return;
    }

    // Force the global core setting to 0 (EQUIDISTANT) after the game is ready
    if (game.settings.get("core", "gridDiagonals") !== 0) {
      await game.settings.set("core", "gridDiagonals", 0);
      log("Automatically set core grid diagonals setting to Equidistant.");
    }

    // Automatically set prototypeToken.lockRotation to true for all existing actors
    for (let actor of game.actors) {
      if (!actor.prototypeToken?.lockRotation) {
        await actor.update({ "prototypeToken.lockRotation": true });
        log(`Enabled Lock Artwork Rotation for existing actor: ${actor.name}`);
      }
    }

    // 0. Purge des journaux en double et versions obsolètes anglaises
    const englishJournals = game.journal.filter(j => 
      j.name === "Warframe Actions Reference" || 
      j.name === "Warframe Status Effects Reference"
    );
    for (const ej of englishJournals) {
      await ej.delete();
      log(`Journal anglais en double supprimé : ${ej.name} [${ej.id}]`);
    }

    // Auto-create/update Status Effects Reference Journal Entry in World (100% Français)
    const rulesContent = `
      <div style="font-family: 'Inter', sans-serif; color: #cbd5e1; max-width: 800px; line-height: 1.5;">
        <h1 style="font-family: 'Orbitron', sans-serif; color: #00e5ff; border-bottom: 2px solid rgba(0, 229, 255, 0.3); padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Référence des Effets de Statut Warframe</h1>
        <p style="font-size: 13px; color: #94a3b8; font-style: italic; margin-bottom: 20px;">Guide de référence complet pour tous les effets de statut physiques, élémentaires et de contrôle dans Warframe JdR.</p>
        
        <h3 style="font-family: 'Orbitron', sans-serif; color: #e74c3c; border-bottom: 1px solid rgba(231, 76, 60, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 14px; margin-top: 20px;">Éléments Physiques</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialSlashGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Tranchant (Saignement)</strong> : Inflige des dégâts de saignement sur la durée. La cible subit des dégâts physiques équivalents à 10% de sa Santé maximale au début de son tour, contournant totalement l'armure (mais bloqués par les boucliers).</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialImpactGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Impact (Ébranlement)</strong> : Fait tituber et déstabilise la cible. La cible subit un désavantage sur son prochain jet d'attaque, et se relever de l'état À Terre lui coûte la totalité (100%) de sa vitesse de déplacement.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialPunctureGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Perforant (Affaiblissement)</strong> : Affaiblit la puissance musculaire et cinétique. Les dégâts de toutes les attaques de la cible sont réduits de 20%.</span>
          </div>
        </div>
        
        <h3 style="font-family: 'Orbitron', sans-serif; color: #f39c12; border-bottom: 1px solid rgba(243, 156, 18, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 14px; margin-top: 20px;">Éléments Principaux</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/HeatModBundleIcon.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Feu (Brûlure)</strong> : Inflige des dégâts thermiques continus et consume l'armure. La cible subit des dégâts de feu équivalents à 5% de sa Santé maximale au début de son tour, et la valeur de son armure est réduite de 50%.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/ColdModBundleIcon.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Glace (Gel)</strong> : Ralentit considérablement les réflexes et la cadence motrice. La vitesse de déplacement de la cible est réduite de moitié, et toutes les attaques portées contre elle étendent leur plage de coup critique d'un cran (ex. 19-20 au lieu de 20).</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/ElectricModBundleIcon.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Électricité (Décharge Tesla)</strong> : Étourdit la cible et propage un arc voltaïque en chaîne. La cible est étourdie pendant 1 round, et toutes les créatures adjacentes subissent des dégâts électriques équivalents à 10% de la Santé maximale de la cible.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/300px-ToxinModBundleIcon.webp" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Toxine (Empoisonnement)</strong> : Attaque directement la constitution biologique. La cible subit des dégâts de toxine équivalents à 10% de sa Santé maximale au début de son tour, contournant totalement les boucliers.</span>
          </div>
        </div>
        
        <h3 style="font-family: 'Orbitron', sans-serif; color: #9b59b6; border-bottom: 1px solid rgba(155, 89, 182, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 14px; margin-top: 20px;">Éléments Combinés</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Magnétique (Perturbation de Bouclier)</strong> : Désorganise les flux d'énergie défensifs. Les boucliers maximaux de la cible sont réduits de 50%, et sa régénération de bouclier est entièrement bloquée.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Explosion (Déflagration Radiale)</strong> : Onde de choc dévastatrice. Inflige des dégâts d'explosion équivalents à 10% de la Santé maximale à la cible principale, et la moitié de ces dégâts à toutes les créatures adjacentes.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Corrosif (Dissolution d'Armure)</strong> : Ronge chimiquement les blindages. Réduit l'armure de la cible d'une valeur fixe de 100 points. Chaque nouvelle application de Corrosif cumule 100 points de réduction d'armure supplémentaires.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Gaz (Nuage Toxique)</strong> : Répand un aérosol suffocant. Crée un nuage toxique de 3 mètres de rayon infligeant des dégâts de poison équivalents à 10% de la Santé maximale par round à quiconque se trouve à l'intérieur.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Radiation (Confusion & Frénésie)</strong> : Désoriente l'esprit ou les systèmes de ciblage. La cible perd tout discernement et attaque l'allié le plus proche lors de son tour.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png" style="height: 24px; width: 24px; border: none;" />
            <span><strong>Viral (Infection Cellulaire)</strong> : Sape l'immunité et la résistance biologique. Augmente de 50% tous les dégâts infligés directement à la Santé de la cible.</span>
          </div>
        </div>
        
        <h3 style="font-family: 'Orbitron', sans-serif; color: #1abc9c; border-bottom: 1px solid rgba(26, 188, 156, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 14px; margin-top: 20px;">Éléments Spéciaux</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          <div style="display: flex; align-items: flex-start; gap: 8px;">
            <img src="systems/warframe-ttrpg/asset/Element icon/EssentialVoidGlyph.png" style="height: 24px; width: 24px; border: none; margin-top: 2px;" />
            <span><strong>Néant (Faille Entropique)</strong> : Tourmente la cible avec une énergie chaotique distordant la réalité. Au début de son tour, la cible lance 1d6 :<br/>• <strong>1-2</strong> : Subit des dégâts du Néant équivalents à 10% de sa Santé maximale.<br/>• <strong>3-4</strong> : Entravée par des vrilles du Néant (Vitesse 0).<br/>• <strong>5-6</strong> : Prise de panique et attaque la créature la plus proche.</span>
          </div>
        </div>
        
        <h3 style="font-family: 'Orbitron', sans-serif; color: #3498db; border-bottom: 1px solid rgba(52, 152, 219, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 14px; margin-top: 20px;">États de Contrôle</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="icons/svg/net.svg" style="height: 24px; width: 24px; border: none; filter: invert(0.85);" />
            <span><strong>Entravé</strong> : La vitesse de déplacement de la cible est réduite à 0, elle subit un désavantage sur ses jets d'attaque, et toutes les attaques portées contre elle bénéficient d'un avantage.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="icons/svg/daze.svg" style="height: 24px; width: 24px; border: none; filter: invert(0.85);" />
            <span><strong>Étourdi</strong> : La cible est neutralisée, incapable de se déplacer ou d'agir, et échoue automatiquement tous ses jets de sauvegarde d'Agilité ou de Réflexes.</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="icons/svg/falling.svg" style="height: 24px; width: 24px; border: none; filter: invert(0.85);" />
            <span><strong>À Terre (Renversé)</strong> : La seule option de déplacement de la cible est de ramper (coût doublé). Elle subit un désavantage sur ses attaques. Les attaques au corps-à-corps contre elle ont l'avantage, tandis que les attaques à distance ont le désavantage.</span>
          </div>
        </div>
      </div>
    `;

    let rulesJournals = game.journal.filter(j => j.name === "Référence des Effets de Statut Warframe");
    let rulesJournal = rulesJournals[0];
    if (rulesJournals.length > 1) {
      for (let i = 1; i < rulesJournals.length; i++) {
        await rulesJournals[i].delete();
        log(`Journal en doublon supprimé : Référence des Effets de Statut Warframe [${rulesJournals[i].id}]`);
      }
    }

    if (rulesJournal) {
      const page = rulesJournal.pages.contents[0];
      if (page) {
        await page.update({ name: "Guide des Effets de Statut", "text.content": rulesContent });
        log("Mise à jour de la page du journal des Effets de Statut en français.");
      }
    } else {
      JournalEntry.create({
        name: "Référence des Effets de Statut Warframe",
        pages: [{
          name: "Guide des Effets de Statut",
          type: "text",
          text: { content: rulesContent, format: 1 }
        }],
        ownership: { default: 2 } // OBSERVER
      }).then(() => log("Création du journal Référence des Effets de Statut Warframe.")).catch(e => logErr("Échec de création du Journal Entry", e));
    }

    // Auto-create/update Actions Reference Journal Entry in World (100% Français - Économie Cinétique)
    const actionsContent = `
      <div style="font-family: 'Inter', sans-serif; color: #cbd5e1; max-width: 820px; line-height: 1.6;">
        <h2 style="font-family: 'Orbitron', sans-serif; color: #00e5ff; border-bottom: 2px solid rgba(0, 229, 255, 0.4); padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 14px;">
          Économie d'Action Cinétique - Warframe JdR
        </h2>
        
        <p style="font-size: 13px; color: #94a3b8; font-style: italic; margin-bottom: 18px; border-left: 3px solid #00e5ff; padding-left: 12px;">
          Les Tenno sont des maîtres martiaux d'une vélocité et d'une létalité inégalées. Pour refléter la vitesse fulgurante et la fluidité des affrontements de l'univers Warframe, le système de combat s'articule autour d'une <strong>Économie Cinétique 2+1+1</strong> par tour : <strong>1 Manœuvre de Parkour Gratuite</strong>, <strong>2 Actions Majeures Universelles</strong>, et <strong>1 Réaction Réflexe</strong> par round.
        </p>

        <!-- SYNTHÈSE TACTIQUE -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px;">
          <div style="background: rgba(0, 229, 255, 0.08); border: 1px solid rgba(0, 229, 255, 0.35); border-radius: 6px; padding: 10px;">
            <h4 style="margin: 0 0 6px 0; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #00e5ff; text-transform: uppercase;">
              <i class="fas fa-running"></i> 1. Parkour Gratuit
            </h4>
            <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">1 Manœuvre cinétique par tour sans dépenser d'action (Bullet Jump, Glissade, Visée Planée, Course murale).</p>
          </div>

          <div style="background: rgba(46, 204, 113, 0.08); border: 1px solid rgba(46, 204, 113, 0.35); border-radius: 6px; padding: 10px;">
            <h4 style="margin: 0 0 6px 0; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #2ecc71; text-transform: uppercase;">
              <i class="fas fa-bolt"></i> 2. Double Action (2)
            </h4>
            <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">2 Actions Majeures universelles au choix (Tirs, Mêlée, Pouvoirs, Focus, Rechargement, Gear). Pas de malus d'attaque !</p>
          </div>

          <div style="background: rgba(241, 196, 15, 0.08); border: 1px solid rgba(241, 196, 15, 0.35); border-radius: 6px; padding: 10px;">
            <h4 style="margin: 0 0 6px 0; font-family: 'Orbitron', sans-serif; font-size: 11px; color: #f1c40f; text-transform: uppercase;">
              <i class="fas fa-shield-alt"></i> 3. Réaction Réflexe (1)
            </h4>
            <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">1 Réaction par round hors de votre tour (Parade défensive, Dévier les tirs, Esquive du Néant, Riposte).</p>
          </div>
        </div>

        <!-- SECTION 1: MANŒUVRES DE PARKOUR -->
        <h3 style="font-family: 'Orbitron', sans-serif; color: #00e5ff; border-bottom: 1px solid rgba(0, 229, 255, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 13px; margin-top: 20px;">
          1. Manœuvres de Parkour Cinétique (1 par tour - Gratuite)
        </h3>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">
          À chaque tour, en plus de sa vitesse de déplacement normale, le Tenno peut exécuter <strong>une manœuvre cinétique de pointe</strong> sans consommer d'Action Majeure :
        </p>
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 12px;">
          <li style="margin-bottom: 10px;">
            <strong style="color: #00e5ff;">Bullet Jump (Saut Propulsé)</strong> : Bond explosif hélicoïdal propulsé par l'énergie du Néant (jusqu'à 30 ft dans n'importe quelle direction, y compris verticalement). Ignore le terrain difficile et projette une onde de choc au décollage (repousse ou déséquilibre les cibles légères adjacentes).
          </li>
          <li style="margin-bottom: 10px;">
            <strong style="color: #00e5ff;">Glissade Tactique (Rechargement Gratuit)</strong> : Se propulser en glissade rapide au ras du sol jusqu'à la moitié de votre Vitesse de déplacement. Cette manœuvre permet d'insérer instantanément un nouveau chargeur plein dans votre arme à feu équipée sans dépenser d'Action Majeure (<strong>Rechargement cinétique gratuit</strong>).
          </li>
          <li style="margin-bottom: 10px;">
            <strong style="color: #00e5ff;">Visée Planée (Aim Glide)</strong> : Dans les airs (après un saut ou Bullet Jump), déployer ses répulseurs pour ralentir la chute. Confère <em>Avantage (+2 au Toucher)</em> sur les tirs à distance effectués pendant le vol stationnaire.
          </li>
          <li style="margin-bottom: 10px;">
            <strong style="color: #00e5ff;">Prise / Course Murale (Wall Latch & Tremplin)</strong> : S'ancrer magnétiquement à une paroi verticale ou courir le long d'un mur jusqu'à votre Vitesse de déplacement. Confère deux avantages clés :
            <ul style="margin-top: 4px; padding-left: 15px; color: #cbd5e1;">
              <li><strong>Visée Stabilisée (+15% Chance Critique)</strong> : L'ancrage au mur stabilise l'arme de façon optimale, accordant automatiquement un bonus de <strong>+15% de Chance Critique</strong> sur vos tirs à distance tant que l'effet <em>Prise Murale</em> est actif sur le token.</li>
              <li><strong>Tremplin Cinétique (Manœuvre Gratuite)</strong> : Quitter la paroi vous permet d'enchaîner directement un <strong>Bullet Jump ou une Visée Planée gratuit(e)</strong> depuis le mur sans dépenser votre action de parkour du tour !</li>
            </ul>
          </li>
        </ul>

        <!-- SECTION 2: ACTIONS MAJEURES UNIVERSELLES -->
        <h3 style="font-family: 'Orbitron', sans-serif; color: #2ecc71; border-bottom: 1px solid rgba(46, 204, 113, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 13px; margin-top: 24px;">
          2. Actions Majeures Universelles (2 Actions au choix par tour)
        </h3>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">
          Chaque Tenno dispose d'un capital de <strong>2 Actions Majeures (Action 1 et Action 2)</strong>. Il n'existe <em>aucun malus d'attaque multiple</em> : vous pouvez composer librement vos 2 actions selon la situation tactique :
        </p>
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 12px;">
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Tir d'Arme à Distance (1 Action)</strong> : Tirer avec son arme Principale (fusil d'assaut, arc, lance-grenades) ou Secondaire (pistolet, revolver cinétique).
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Combo de Mêlée (1 Action)</strong> : Déchaîner un enchaînement d'attaques au corps-à-corps avec son arme de mêlée équipée (lame, marteau, katanas, nunchaku).
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Déchaîner un Pouvoir Warframe (1 Action)</strong> : Canaliser et lancer l'une des 4 compétences actives de votre Warframe en dépensant les Points d'Énergie requis.
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Pouvoir Actif de Focalisation (Focus) (1 Action)</strong> : Activer une compétence de transmutation de votre école d'Opérateur débloquée (Flamme du Néant Madurai, Vague Protectrice Vazarin, Transcendance Zenurik, etc.).
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Combinaisons Libres (Double Attaque / Attaque + Pouvoir)</strong> :
            <ul style="margin-top: 4px; padding-left: 15px; color: #a5b4fc;">
              <li>2 Tirs d'armes à feu dans le même tour.</li>
              <li>1 Tir à distance + 1 Frappe de mêlée (style Gun-Kata / Gunblade).</li>
              <li>1 Pouvoir Warframe + 1 Attaque d'arme (lancer Paralysie puis frapper au Skana).</li>
              <li>2 Pouvoirs consécutifs si votre jauge d'Énergie le permet.</li>
            </ul>
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Recharger son Arme (1 Action)</strong> : Insérer un nouveau chargeur (si non accompli via une Glissade Tactique cinétique).
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Utiliser un Consommable / Équipement de Gear (1 Action)</strong> : Déployer une balise de ravitaillement, utiliser une capsule d'énergie/santé, pirater une console ou déployer un Spectre.
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Réanimer un Allié au Sol (1 Action)</strong> : Vous approcher d'un équipier neutralisé et canaliser votre bouclier pour le relever immédiatement au combat.
          </li>
        </ul>

        <!-- SECTION 3: GESTES FLUIDES & GRATUITS -->
        <h3 style="font-family: 'Orbitron', sans-serif; color: #38bdf8; border-bottom: 1px solid rgba(56, 189, 248, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 13px; margin-top: 24px;">
          3. Gestes Fluides & Gratuits (0 Action)
        </h3>
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 12px;">
          <li style="margin-bottom: 6px;"><strong style="color: #38bdf8;">Changer d'Arme (Switch Rapide)</strong> : Rengainer son arme en cours et dégainer une autre arme de son arsenal (1 switch gratuit par tour).</li>
          <li style="margin-bottom: 6px;"><strong style="color: #38bdf8;">Communiquer</strong> : Transmettre un repère tactique ou un ordre vocal à l'escouade via les transmetteurs du Lotus.</li>
          <li style="margin-bottom: 6px;"><strong style="color: #38bdf8;">Lâcher un Objet tenu</strong> : Déposer immédiatement une batterie énergétique, une cellule de données ou un conteneur.</li>
        </ul>

        <!-- SECTION 4: RÉACTIONS RÉFLEXES TENNO -->
        <h3 style="font-family: 'Orbitron', sans-serif; color: #f1c40f; border-bottom: 1px solid rgba(241, 196, 15, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 13px; margin-top: 24px;">
          4. Réactions Réflexes Tenno (1 par round)
        </h3>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">
          Chaque Tenno possède des réflexes surhumains pouvant être déclenchés <strong>en réponse à un événement hors de son tour</strong> (1 seule Réaction par round de combat) :
        </p>
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 12px;">
          <li style="margin-bottom: 10px;">
            <strong style="color: #f1c40f;">Parade & Déviation des Tirs (Melee Parry)</strong> : Lorsqu'une attaque ou une salve de projectiles vous cible, levez votre arme de mêlée pour absorber les dégâts (réduit les dégâts reçus de la valeur de blocage de l'arme) et renvoyer une partie des tirs vers les assaillants.
          </li>
          <li style="margin-bottom: 10px;">
            <strong style="color: #f1c40f;">Esquive Acrobatique (Roulade Réflexe)</strong> : Déclenchée face à une attaque de zone (grenade, roquette, rayon laser). Divise par deux les dégâts subis et déplace le Tenno de 10 ft hors de l'épicentre de l'explosion.
          </li>
          <li style="margin-bottom: 10px;">
            <strong style="color: #f1c40f;">Projection du Néant (Void Sling Réflexe)</strong> : Déclenchée lorsqu'une attaque vous touche OU lorsque vous subissez une altération d'état incapacitante (renversement, étourdissement, gel, entrave).
            <ul style="margin-top: 4px; padding-left: 15px; color: #cbd5e1;">
              <li><strong>Projection Éthérée Courte (5 à 10 ft / 1 à 2 cases)</strong> : Le Tenno se dématérialise brièvement dans le Néant et réapparaît à 5 ou 10 ft, brisant les lignes d'engagement sans provoquer de réaction ennemie.</li>
              <li><strong>Atténuation Transdimensionnelle (Dégâts ÷ 2)</strong> : Le corps physique entrant dans la faille au moment de l'impact, les dégâts de l'attaque déclenchante sont immédiatement <strong>divisés par deux</strong> (appliqués après vos Boucliers).</li>
              <li><strong>Purge d'Entrave</strong> : Brise et annule instantanément l'effet de renversement ou d'étourdissement qui accompagnait l'attaque.</li>
            </ul>
          </li>
          <li style="margin-bottom: 10px;">
            <strong style="color: #f1c40f;">Riposte d'Opportunité (Mêlée)</strong> : Déclenchée lorsqu'un ennemi adjacent tente de s'éloigner sans action de désengagement, OU lorsqu'un ennemi au corps-à-corps rate son attaque de mêlée contre vous.
            <ul style="margin-top: 4px; padding-left: 15px; color: #cbd5e1;">
              <li><strong>1. Frappe Réflexe Immédiate</strong> : Vous assénez immédiatement une attaque avec votre arme de mêlée équipée hors de votre tour.</li>
              <li><strong>2. Dégâts Complets</strong> : En cas de touche, applique tous les dégâts normaux de votre arme (pouvant infliger un Coup Critique).</li>
            </ul>
          </li>
        </ul>

        <!-- SECTION 5: SYSTÈMES CRITIQUES ET FINISHER -->
        <h3 style="font-family: 'Orbitron', sans-serif; color: #e5a93b; border-bottom: 1px solid rgba(229, 169, 59, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 13px; margin-top: 24px;">
          5. Systèmes de Dégâts Avancés
        </h3>
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 12px; color: #ccd6f6;">
          <li style="margin-bottom: 8px;">
            <strong style="color: #ffd700;">Système de Coups Critiques Multi-Paliers</strong> :
            <ul style="margin-top: 4px; padding-left: 15px;">
              <li><strong style="color: #facc15;">Critique Jaune (Palier 1)</strong> : Multiplicateur critique de base appliqué aux dégâts.</li>
              <li><strong style="color: #fb923c;">Critique Orange (Palier 2)</strong> : Chance Critique de 101% à 200%, dégâts amplifiés.</li>
              <li><strong style="color: #f87171;">Critique Rouge (Palier 3+)</strong> : Chance Critique > 200%, dévastation cinétique maximale.</li>
            </ul>
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #ff2a5f;">Coup de Grâce (Finisher - True Damage)</strong> : Exécutable contre les cibles étourdies, aveuglées, endormies ou renversées. Les dégâts ignorent totalement les Boucliers et l'Armure pour s'appliquer directement sur les Points de Santé, avec un multiplicateur brut de 2.0x.
          </li>
        </ul>

        <!-- SECTION 6: SYNERGIES DE MODS ET EXTENSIONS -->
        <h3 style="font-family: 'Orbitron', sans-serif; color: #9b59b6; border-bottom: 1px solid rgba(155, 89, 182, 0.25); padding-bottom: 4px; text-transform: uppercase; font-size: 13px; margin-top: 24px;">
          6. Synergies de Mods (Actions, Réactions & Parkour)
        </h3>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">
          L'Économie Cinétique s'articule avec l'Arsenal de Mods. Certains sont déjà présents dans le compendium officiel, d'autres sont des adaptations spécifiques au jeu de rôle sur table :
        </p>
        <ul style="margin: 8px 0; padding-left: 20px; font-size: 12px; color: #ccd6f6;">
          <li style="margin-bottom: 8px;">
            <strong style="color: #00e5ff;">Mods de Parkour & Mobilité (Déjà créés dans le Compendium) :</strong>
            <ul style="margin-top: 3px; padding-left: 15px; color: #cbd5e1;">
              <li><em>Mobilisation (Mobilize)</em> : +20% de distance au Bullet Jump et durée de Visée Planée.</li>
              <li><em>Patagium</em> : +90% de durée de suspension en Visée Planée et en Prise Murale.</li>
              <li><em>Course (Rush) & Maglev</em> : +10 ft de Vitesse de déplacement au sol et +30% d'allonge de Glissade.</li>
              <li><em>Mods Élémentaires de Saut (Firewalker, Ice Spring, Toxic Flight, Lightning Dash)</em> : Propulsion accrue + décharge élémentaire de zone au décollage.</li>
            </ul>
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #2ecc71;">Actions Majeures Additionnelles (+1 Action) :</strong>
            <ul style="margin-top: 3px; padding-left: 15px; color: #cbd5e1;">
              <li><em>Talent Naturel (Natural Talent) [Adaptation JdR]</em> : Réduit la friction neuro-cinétique pour octroyer <strong>1 Action Majeure supplémentaire par tour</strong> dédiée au lancement de Pouvoirs Warframe.</li>
              <li><em>Accélération Neuro-Cinétique [Mod JdR Exclusif]</em> : Permet de réaliser une 3e Action Majeure libre lors d'un tour charnière.</li>
            </ul>
          </li>
          <li style="margin-bottom: 8px;">
            <strong style="color: #f1c40f;">Réactions Supplémentaires (+1 Réaction / round) :</strong>
            <ul style="margin-top: 3px; padding-left: 15px; color: #cbd5e1;">
              <li><em>Garde Roulante (Rolling Guard) [Adaptation JdR]</em> : Débloque une <strong>2e Réaction gratuite par round</strong> dédiée exclusivement à l'Esquive Acrobatique réflexe.</li>
              <li><em>Réflexes Tenno / Instinct de Survie [Mod JdR Exclusif]</em> : Accorde 1 Réaction réflexe supplémentaire par round pour Parer ou Riposter aux attaques adverses.</li>
            </ul>
          </li>
        </ul>
      </div>
    `;

    let actionsJournals = game.journal.filter(j => j.name === "Référence des Actions - Warframe JdR");
    let actionsJournal = actionsJournals[0];
    if (actionsJournals.length > 1) {
      for (let i = 1; i < actionsJournals.length; i++) {
        await actionsJournals[i].delete();
        log(`Journal en doublon supprimé : Référence des Actions - Warframe JdR [${actionsJournals[i].id}]`);
      }
    }

    if (actionsJournal) {
      const page = actionsJournal.pages.contents[0];
      if (page) {
        await page.update({ name: "Économie d'Action Cinétique", "text.content": actionsContent });
        log("Mise à jour de la page du journal des Actions en français.");
      }
    } else {
      JournalEntry.create({
        name: "Référence des Actions - Warframe JdR",
        pages: [{
          name: "Économie d'Action Cinétique",
          type: "text",
          text: { content: actionsContent, format: 1 }
        }],
        ownership: { default: 2 } // OBSERVER
      }).then(() => log("Création du journal Référence des Actions - Warframe JdR.")).catch(e => logErr("Échec de création du Journal Entry", e));
    }
    const pack = game.packs.get("warframe-ttrpg.warframes");
    const weaponsPack = game.packs.get("warframe-ttrpg.weapons");
    if (!pack) {
      log("Pack 'warframe-ttrpg.warframes' not found.");
      return;
    }

    const index = await pack.getIndex();
    const indexSize = index.size || index.length || 0;
    const warframeDocsCount = Array.from(index).filter(i => i.type === "warframe").length;
    const foldersCount = pack.folders?.size || 0;
    const hasOutdatedFollie = Array.from(index).some(i => i.name === "Follie" && i.img && !i.img.includes("Follie_Thumb.webp"));
    
    // Purge corrupted thunder-icon Volt or null-ID Volt
    const corruptVoltEntries = Array.from(index).filter(i => i.name === "Volt" && (i.img?.includes("lightning.svg") || !i._id || i._id === "null"));
    if (corruptVoltEntries.length > 0) {
      log(`Detected ${corruptVoltEntries.length} corrupt thunder-icon Volt entry/entries in warframes compendium. Purging...`);
      try {
        await pack.configure({ locked: false });
        for (const cVolt of corruptVoltEntries) {
          try {
            await SocketInterface.dispatch("modifyDocument", {
              action: "delete",
              type: "Item",
              operation: { pack: "warframe-ttrpg.warframes", ids: [cVolt._id || "null"] }
            });
            log("Successfully dispatched deletion of corrupt Volt from compendium.");
            if (cVolt._id) pack.index.delete(cVolt._id);
            pack.index.delete(null);
            pack.index.delete("null");
          } catch (err) {
            logErr("Failed to dispatch deletion of corrupt Volt", err);
          }
        }
      } catch (err) {
        logErr("Failed to unlock warframes pack for Volt purge", err);
      } finally {
        try { await pack.configure({ locked: true }); } catch (e) {}
      }
    }

    // Ensure pack index only contains canonical Volt and re-render open compendiums
    let purgedFromIndex = false;
    for (const [key, entry] of Array.from(pack.index.entries())) {
      if (entry.name === "Volt" && (entry.img?.includes("lightning.svg") || (entry._id && entry._id !== "wfvoltclass00002") || !entry._id)) {
        log(`Removing non-canonical Volt from pack.index: key=${key}, id=${entry._id}, img=${entry.img}`);
        pack.index.delete(key);
        purgedFromIndex = true;
      }
    }
    if (purgedFromIndex) {
      for (const app of pack.apps || []) {
        try { app.render(true); } catch (e) {}
      }
    }

    const currentWarframes = Array.from(pack.index).filter(i => i.type === "warframe" && (i.name !== "Volt" || i.img?.includes("asset/classe/Volt.webp")));
    const hasThunderVolt = Array.from(pack.index).some(i => i.name === "Volt" && (i.img?.includes("lightning.svg") || !i._id || i._id === "null"));
    const hasDuplicateVolt = Array.from(pack.index).filter(i => i.name === "Volt").length > 1;
    const isWarframesFrench = Array.from(pack.index).some(i => i.name === "Élan Tranchant" || i.name === "Coupe Rapide");
    const isWarframesPopulated = currentWarframes.length >= 67 && foldersCount >= 68 && !hasOutdatedFollie && !hasThunderVolt && !hasDuplicateVolt && isWarframesFrench;

    const excalProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(0, 229, 255, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #00e5ff;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpassive0001]{Escrime}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">+10% de dégâts et de vitesse avec les épées.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000001]{Élan Tranchant}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Fonce et taillade en infligeant 1d10 dégâts physiques (25 Énergie).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalmechanic001]{Puissance Exaltée}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Toutes les épées ont une plage de coup critique de 19-20.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000002]{Aveuglement Radial}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Aveugle les ennemis à moins de 30 ft pendant 1 round (50 Énergie).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 4</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000003]{Javelot Radial}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Empale jusqu'à 5 ennemis proches en infligeant 2d12 dégâts (75 Énergie).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 6</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000012]{Élan Tranchant II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Élan Tranchant : Dégâts portés à 2d10, enchaîne jusqu'à 3 cibles.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 7</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Speed Increase I}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">+5 ft to Land and Climb speeds.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 8</td>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 7</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">+5 ft to Land and Climb speeds.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 8</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 9</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000022]{Aveuglement Radial II}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Aveuglement Radial : Aveugle pendant 2 rounds et ouvre aux coups de grâce.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 10</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000004]{Lame Exaltée}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Matérialise une lame de pure énergie (100 Énergie).</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 11</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000032]{Javelot Radial II}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Radial Javelin: Damage to 4d12, targets up to 8, stuns for 1 round.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 12</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 13</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">L'augmentation de vitesse passe à +10 ft.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 14</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain +1 skill proficiency of your choice.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 15</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000042]{Lame Exaltée II}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Exalted Blade: Damage to 4d10, waves travel 40 ft, blinds on crit.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 16</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 17</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000013]{Élan Tranchant III}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Slash Dash: Damage to 3d10, chains up to 5 targets, invulnerability.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 18</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">L'augmentation de vitesse passe à +15 ft.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 19</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000023]{Aveuglement Radial III}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Radial Blind: Blinds for 3 rounds, radius to 45 ft, strips 30% armor.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 20</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 21</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000033]{Javelot Radial III}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Radial Javelin: Damage to 6d12, targets all in 30 ft, +10% melee damage/hit.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 22</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalswordmast01]{Sword Mastery}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Sword weapons crit range improved to 18-20.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 23</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalsavephys001]{Spécialisation de Sauvegarde : Physique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency in Physique Saving Throws.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 24</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 25</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalpower000043]{Lame Exaltée III}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Exalted Blade: Damage to 6d10, waves pierce barriers, cost is halved.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 26</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain +1 skill proficiency of your choice.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 27</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalsaveprow001]{Spécialisation de Sauvegarde : Prouesse}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency in Prowess Saving Throws.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 28</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 29</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalbladerush01]{Blade Rush}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">When you take the Bullet Jump action, you can make a free melee strike with a +2 attack bonus.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 30</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalcaps0000001]{Master of the Blade}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: Exalted Blade critical hits deal 3x damage.</td>
             </tr>
          </tbody>
        </table>
    `;

    const voltProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(0, 229, 255, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #00e5ff;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpassive00001]{Décharge Statique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Extra electrical damage based on movement.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000001]{Choc}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Chain electric strike hitting up to 2 targets (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltmechanic0001]{Static Capacitor}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain 10% electric resistance.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000002]{Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Speed boost to movement and reload speed (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 4</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000003]{Bouclier Électrique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Deploy energy barrier blocking projectiles (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 6</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000012]{Shock II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Shock: Damage to 2d8, chains to 4 targets, stuns for 1 round.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 7</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Speed Increase I}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">+5 ft to Land and Climb speeds.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 8</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 9</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000022]{Speed II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Speed: Speed +40%, duration to 3 rounds, +10% melee speed.</td>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 7</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">+5 ft to Land and Climb speeds.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 8</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 9</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000022]{Speed II}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Speed: Speed +40%, duration to 3 rounds, +10% melee speed.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 10</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000004]{Décharge}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Paralyze and shock enemies in a 30 ft radius (100 Energy).</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 11</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000032]{Electric Shield II}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Electric Shield: Projectiles through shield gain +50% electricity.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 12</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 13</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">L'augmentation de vitesse passe à +10 ft.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 14</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain +1 skill proficiency of your choice.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 15</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000042]{Discharge II}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Discharge: Area to 45 ft, paralyzed targets pulse 1d10 electricity.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 16</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 17</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000013]{Shock III}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Shock: Damage to 3d8, chains to 6 targets, generates shields.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 18</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">L'augmentation de vitesse passe à +15 ft.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 19</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000023]{Speed III}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Speed: Speed +60%, duration to 4 rounds, knockback resistance.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 20</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 21</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000033]{Electric Shield III}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Electric Shield: Carry shield, double critical damage.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 22</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltcapoverch001]{Capacitor Overcharge}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Static Capacitor electrical resistance increases to 25%.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 23</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltsavesyst0001]{Spécialisation de Sauvegarde : Systèmes}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency in Systems Saving Throws.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 24</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 25</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltpower0000043]{Discharge III}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Discharge: Area to 60 ft, pulses deal 2d10, grants overshields.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 26</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain +1 skill proficiency of your choice.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 27</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltsaveprow0001]{Spécialisation de Sauvegarde : Prouesse}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency in Prowess Saving Throws.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 28</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 29</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltlightrefl001]{Lightning Reflexes}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Advantage on Reflexes checks and Land Speed +10 ft.</td>
             </tr>
             <tr>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 30</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.voltcaps00000001]{Stormlord}</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
               <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: 25% chance to double electrical damage dealt.</td>
             </tr>
          </tbody>
        </table>
    `;

    const magProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(0, 229, 255, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #00e5ff;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpassive000001]{Attraction Magnétique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Vacuum nearby loot and items within 15 ft.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000001]{Attraction}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Pull targets within 30 ft dealing 1d6 magnetic damage (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magmechanic00001]{Polarized Shield}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Reflect 5% damage back as magnetic.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000002]{Magnétisation}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Create magnetic bubble trapping and damaging enemies (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 4</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000003]{Polarisation}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Restore shield to allies / strip armor of enemies (75 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 6</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000012]{Pull II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Pull: Area to 45 ft, damage to 2d6, pulls targets prone.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 7</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Speed Increase I}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">+5 ft to Land and Climb speeds.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 8</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 9</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000022]{Magnetize II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Magnetize: Deals 2d8/round, explodes for 3d10 damage.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 10</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000004]{Écrasement}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Crush bones in a 30 ft radius for 3d12 damage (100 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 11</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000032]{Polarize II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Polarize: Restores/depletes 40 shields, triggers 2d6 shrapnel.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 12</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 13</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">L'augmentation de vitesse passe à +10 ft.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 14</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain +1 skill proficiency of your choice.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 15</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000042]{Crush II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Crush: Radius to 45 ft, damage to 5d12, strips 50% armor.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 16</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 17</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000013]{Pull III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Pull: Area to 60 ft, damage to 3d6, energy orb drops.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 18</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">L'augmentation de vitesse passe à +15 ft.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 19</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000023]{Magnetize III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Magnetize: Deals 4d8/round, pulls nearby, explodes for 6d10.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 20</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 21</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000033]{Polarize III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Polarize: Restores/depletes 80 shields (overshields), shrapnel deals 4d6.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 22</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpolarrefl0001]{Polarized Reflection}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Polarized Shield active reflection increases to 15%.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 23</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magsavefocus0001]{Spécialisation de Sauvegarde : Focalisation}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency in Focus Saving Throws.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 24</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 25</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpower00000043]{Crush III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Crush: Radius to 60 ft, damage to 8d12, armor stripped 100%, full shields.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 26</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain +1 skill proficiency of your choice.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 27</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magsavesyst00001]{Spécialisation de Sauvegarde : Systèmes}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency in Systems Saving Throws.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 28</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 29</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magpolarizer0001]{Magnetic Polarizer}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Polarizing or Magnetizing grants temporary shields (10% max shields).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 30</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magcaps000000001]{Magnetic Singularity}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: Magnetize spheres draw in enemies from 15 ft away.</td>
            </tr>
          </tbody>
        </table>
    `;

    const koumeiProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(0, 229, 255, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #00e5ff;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipassive001]{Koumei Passive}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Inflict random Status Effects on weapon hits.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00001]{Kumihimo}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Weave threads dealing 1d4 * Fates Total damage (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeimechanic01]{Les Cinq Destins}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Passive Mechanic: Roll Fates Dice when casting abilities.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00002]{Omikuji}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain a random encounter Decree (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 4</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00003]{Omamori}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Summon defensive charms that ignore hits (75 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 6</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00012]{Kumihimo II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Kumihimo: Damage to 1d6 * Fates, and slows by 50%.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 7</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">+5 ft to Land and Climb speeds.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 8</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 9</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00022]{Omikuji II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Omikuji: Decree duration increases to 10 minutes.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 10</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00004]{Bunraku}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Entrap enemies in strings and apply random statuses (100 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 11</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00032]{Omamori II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Omamori: Negation chance increases to 25%.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 12</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 13</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">L'augmentation de vitesse passe à +10 ft.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 14</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère la maîtrise d'une compétence au choix.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 15</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00042]{Bunraku II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Bunraku: Range to 45 ft, duration to 3 rounds.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 16</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 17</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00013]{Kumihimo III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Kumihimo: Damage to 1d8 * Fates, and binds for 1 round.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 18</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">L'augmentation de vitesse passe à +15 ft.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 19</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00023]{Omikuji III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Omikuji: Duration to 1 hour, roll twice and choose.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 20</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 21</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00033]{Omamori III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Omamori: Negation chance increases to 50%.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 22</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeifatefavor1]{Fate's Favor}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Reroll any Fates Dice that land on 1.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 23</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeisavefocus1]{Spécialisation de Sauvegarde : Focalisation}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère l'expertise dans les jets de sauvegarde de Focalisation.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 24</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 25</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeipower00043]{Bunraku III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Bunraku: Range to 60 ft, stuns targets. Applies Fates + 5 effects.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 26</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère la maîtrise d'une compétence au choix.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 27</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeisaveprow01]{Spécialisation de Sauvegarde : Prouesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère l'expertise dans les jets de sauvegarde de Prouesse.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 28</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 29</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeishadowbles]{Shadow's Blessing}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Requires only two 6s to trigger Shadow's Trinity.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00e5ff;">Rang 30</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.koumeicaps000001]{Fates Weaver}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: Once per encounter, force all Fates Dice to land on 6.</td>
            </tr>
        </table>
    `;

    const nokkoProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(46, 204, 113, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #2ecc71;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopassive0001]{Vital Decay}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">revive with mushrooms upon receiving fatal damage.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000001]{Cerveau Puant}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Throw a spore mushroom dealing 2d6 Viral and lulling targets to sleep (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkomechanic001]{Fungal Spawning}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Allows placing mushroom templates. walking over mushrooms gives bounce jump.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000002]{Bonnet Brillant}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Release energy-recharging mushroom, granting +15% Ability Strength (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 4</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000003]{Reroot}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">revert to invulnerable, invisible Sprodling, healing and spawning spores (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 6</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000012]{Stinkbrain II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">stinkbrain: damage increases to 3d6 Viral and pulses for 3 rounds.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 7</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Sprint speed increases by +0.05.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 8</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 9</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000022]{Brightbonnet II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Brightbonnet: Energy restore increases to 12, Ability Strength bonus increases to 20%.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 10</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000004]{Source de Spores}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Unleash bouncing spore dealing 10d6 Toxin (75 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 11</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000032]{Reroot II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Reroot: duration increases to 3 rounds, healing to 6 per second.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 12</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 13</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Sprint speed increases by +0.05.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 14</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency in one skill of choice.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 15</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000042]{Sporespring II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Sporespring: damage increases to 12d6 Toxin, bounces increase to 8.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 16</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 17</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000013]{Stinkbrain III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">stinkbrain: damage increases to 4d6 Viral, pulses for 4 rounds, sleep duration 2 rounds.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 18</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Sprint speed increases by +0.05.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 19</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000023]{Brightbonnet III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Brightbonnet: Energy restore increases to 15, Ability Strength bonus increases to 30%.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 20</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 21</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000033]{Reroot III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Reroot: duration increases to 4 rounds, healing to 10 per second.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 22</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkosavephys001]{Spécialisation de Sauvegarde : Physique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency/expertise in Physique Saving Throws.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 23</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkosavefocus01]{Spécialisation de Sauvegarde : Focalisation}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency/expertise in Focus Saving Throws.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 24</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 25</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkopower000043]{Sporespring III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Sporespring: damage increases to 15d6 Toxin, bounces increase to 10.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 26</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency in one skill of choice.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 27</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkosavephys001]{Spécialisation de Sauvegarde : Physique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency/expertise in Physique Saving Throws.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 28</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 29</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkosavefocus01]{Spécialisation de Sauvegarde : Focalisation}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gain proficiency/expertise in Focus Saving Throws.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #2ecc71;">Rang 30</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.nokkocaps0000001]{Spore Overlord}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: massive fungal explosion inflicting Viral and buffing allies.</td>
            </tr>
          </tbody>
        </table>
    `;

    const ashProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(52, 73, 94, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #cbd5e1;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.ashpassive000001]{Bleed Amplification (Passive)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Slash procs inflicted by Ash's weapons and abilities deal +25% damage and last +50% longer (stacks additively).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.ashpower00000011]{Shuriken}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Launches 2 shurikens dealing 1d12 Slash damage on hit and applying Bleed (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.ashmechanic00001]{Ninja Prowess (Passive Mechanic)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Passive Mechanic: Ash gains Advantage on all Stealth and Acrobatics checks.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.ashpower00000021]{Smoke Screen}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Drops a smoke bomb that stuns nearby enemies and turns Ash Invisible for 3s (35 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.ashpower00000031]{Teleport}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Teleport to target, executing a +125% Finisher attack. Refunds 50% energy on kill (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 10</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.ashpower00000041]{Blade Storm}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Unleash clones dealing 3d12 True damage and applying Bleed. Costs 12 energy per mark, or 6 energy if invisible (0 Base).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 30</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.ashcaps000000001]{Fatal Teleport}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: Teleport automatically scores a Critical Hit on the Finisher (x2 damage). Furthermore, the Bleed status inflicted by this finisher deals +50% damage.</td>
            </tr>
          </tbody>
        </table>
    `;

    const vaubanProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(230, 126, 34, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #cbd5e1;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.vaubanpassive001]{Technologist's Demolition (Passive)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Inflicts +25% bonus damage with weapons/abilities against incapacitated enemies. Double-dips on status damage applied while incapacitated.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.vaubanpower00111]{Tesla Nervos}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Deploys a roller drone that attaches to targets, dealing 1d8 Electricity damage to nearby enemies and stunning them (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.vaubanmechanic01]{Trap Specialist (Passive Mechanic)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Passive Mechanic: Vauban's ability save DCs are increased by +2. Additionally, the range of all his abilities is increased by +15 ft.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.vaubanpower00121]{Pose de Mines}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Choose Tether-Flechette (restrains targets and rolls 2d8 Puncture damage) or Vector-Overdrive (+25% Speed & Weapon Damage to allies) (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.vaubanpower00131]{Frappe Photonique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Calls in a laser strike dealing 6d12 Blast damage in a 21 ft radius. Deals double damage to targets with Overguard (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 10</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.vaubanpower00141]{Bastille}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Erect Bastille (stasis prison, steals enemy armor to buff allies) or Collapse Vortex (gravity pull, dealing 3d10 Magnetic damage/round) (100 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 30</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.vaubancaps000001]{Repelling Bastille}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: Bastille stasis capacity has no limit, and all enemies inside take +25% extra damage from all sources.</td>
            </tr>
          </tbody>
        </table>
    `;

    const atlasProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(229, 152, 102, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #cbd5e1;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.atlaspassive0001]{Immovable Rock (Passive)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Becomes immune to Knockdown effects while on the ground.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.atlaspower000011]{Éboulement}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Bash enemies with an explosive sliding punch. Cast consecutively up to 3 times in a combo for increased radius, damage, and reduced cost. Deals Impact damage with high crit (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.atlasrubblemech1]{Rubble (Passive Mechanic)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Passive Mechanic: Adds Rubble resource bar (max 1500). Rubble directly increases derived Armor on a 1:1 basis. Decays by -50 at turn start.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.atlaspower000021]{Tectonique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Summon a Bulwark rock-wall (1500 HP). Cast again to roll it forward, dealing 6d10 Impact damage and exploding for 3d10 Puncture damage (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.atlaspower000031]{Pétrification}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Gaze fossilizes foes, incapacitating them, applying a +50% damage vulnerability, and forcing them to drop Rubble on death (75 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 10</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.atlaspower000041]{Ramblers}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Summons two stone brawlers to fight alongside Atlas. Drops Rubble on death/expiration (100 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #cbd5e1;">Rang 30</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.atlascaps0000001]{Rubbled Landslide}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: Landslide deals +100% damage while Rubble is above 1000. Additionally, Rubble decays 50% slower.</td>
            </tr>
          </tbody>
        </table>
    `;

    const valkyrProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(231, 76, 60, 0.1); text-align: left; font-family: 'Orbitron', sans-serif; color: #e74c3c;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #e74c3c;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.valkyrpassive001]{Rage (Passive)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Builds Rage from melee (+3% hit, +12% kill, +27% finisher). Above 150% Rage, prevents fatal damage and grants 2 rounds of Invulnerability.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #e74c3c;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.valkyrpower00011]{Rip Line}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Pulls targets/self, dealing 3d8 Slash damage (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #e74c3c;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.valkyrmechanic01]{Nimble Recovery}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Active Mechanic: Stands up from prone 50% faster (consumes 50% speed/movement instead of the standard 100%).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #e74c3c;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.valkyrpower00021]{Warcry}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Bolsters allies' Armor by +25% and attack speed (+2 flat melee hits) within 30 ft for 10s (75 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #e74c3c;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.valkyrpower00031]{Paralysis}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Radial blast dealing 1d10 Impact, 15% slow, and +20% Melee Vulnerability (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #e74c3c;">Rang 10</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.valkyrpower00041]{Hysteria}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Equips Talons (2d10), grants complete Invulnerability, Status Immunity, and lifesteals (25 Energy + 5/s drain).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #e74c3c;">Rang 30</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.valkyrcaps000001]{Eternal War}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: Melee kills while Warcry is active extend its duration by 2 seconds (1 round) per kill.</td>
            </tr>
          </tbody>
        </table>
    `;

    const urielProgTable = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 11px; background: rgba(0,0,0,0.25);">
          <thead>
            <tr style="background: rgba(231, 76, 60, 0.15); text-align: left; font-family: 'Orbitron', sans-serif; color: #ff5e3a;">
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 100px;">Rang / Niveau</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 150px;">Aptitude / Pouvoir</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1); width: 80px;">Type</th>
              <th style="padding: 6px; border: 1px solid rgba(255,255,255,0.1);">Description Résumée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpassive0001]{Legion (Passive)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Commands 3 fiendish flying summons: Catenach, Gulphagor, and Vythelas with slow, shared damage, latches, and Demonium Runes.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 1</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000011]{Infernalis}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Unleash a 15 ft radius flame aura dealing 2d6 Heat damage and inflicting Heat status. Ignites living demons in fire spheres (+25% damage). Unlocks Catenach (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 2</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urieldemonmech01]{Demonic Bond (Passive Mechanic)}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Demons build Brimstone Fury on kills (+25%). Fallen demons can be resurrected and fully restored with Remedium. Tracks Brimstone Fury (0–100%).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 3</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000021]{Remedium}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Restores 50 HP to Uriel. Revives all fallen Legion demons to full HP (150) and summons Gulphagor (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 4</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 5</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000031]{Demonium}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Drains 10% HP from living demons to launch homing souls dealing 3d8 Void/Heat damage and applying Damage Vulnerability (+50% incoming damage). Generates +15% Brimstone Fury. Unlocks Vythelas (75 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 6</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000012]{Infernalis II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Radius expands to 20 ft, damage increases to 3d6 Heat. Ignited demons burn nearby enemies for 1d6 Heat per turn (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 7</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Augmente la vitesse de déplacement (+5 ft).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 8</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 9</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000022]{Remedium II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Restores 100 HP to Uriel. Fully restores all Legion demons and grants 50 bonus Overguard (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 10</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000041]{Brimstone}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Expanding ring of hellfire (30 ft radius) dealing 4d12 Heat damage, knocking down enemies, and inflicting Heat status (75 Energy + 100% Brimstone Fury).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 11</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000032]{Demonium II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Drains 10% HP from living demons. Homing souls deal 5d8 Void/Heat damage, inflict Damage Vulnerability, and grant +20% Brimstone Fury per demon (75 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 12</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 13</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Augmente la vitesse de déplacement (+5 ft).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 14</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère la maîtrise d'une compétence au choix.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 15</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000042]{Brimstone II}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Expanding ring (45 ft radius) dealing 8d12 Heat damage with 100% Heat status proc (75 Energy + 100% Brimstone Fury).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 16</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 17</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000013]{Infernalis III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Radius expands to 25 ft, damage increases to 4d6 Heat. Ignited demons burn nearby enemies for 2d6 Heat per turn (25 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 18</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.speedincrease001]{Augmentation de Vitesse}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Augmente la vitesse de déplacement (+5 ft).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 19</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000023]{Remedium III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Restores 150 HP to Uriel. Fully restores all Legion demons with 100 bonus Overguard (50 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 20</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 21</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000033]{Demonium III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Drains 10% HP from living demons. Homing souls deal 7d8 Void/Heat damage, inflict Damage Vulnerability, and grant +25% Brimstone Fury per demon (75 Energy).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 22</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magsavefocus0001]{Spécialisation de Sauvegarde : Focalisation}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère l'expertise dans les jets de sauvegarde de Focalisation.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 23</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalsavephys001]{Spécialisation de Sauvegarde : Physique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère l'expertise dans les jets de sauvegarde de Physique.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 24</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 25</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielpower000043]{Brimstone III}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #ff2a5f;">Actif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Expanding ring (60 ft radius) dealing 12d12 Heat damage and setting ground ablaze for 3 rounds (75 Energy + 100% Brimstone Fury).</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 26</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.bonusskillprof01]{Maîtrise de Compétence Bonus}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère la maîtrise d'une compétence au choix.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 27</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.magsavefocus0001]{Spécialisation de Sauvegarde : Focalisation}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère l'expertise dans les jets de sauvegarde de Focalisation.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 28</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.asi0000000000001]{Amélioration de Caractéristique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère +2 points de caractéristique à répartir sur les attributs principaux.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 29</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.excalsavephys001]{Spécialisation de Sauvegarde : Physique}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Confère l'expertise dans les jets de sauvegarde de Physique.</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ff7675;">Rang 30</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">@UUID[Compendium.warframe-ttrpg.warframes.urielcaps0000001]{Hellgate of Xata}</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05); color: #2ecc71;">Passif</td>
              <td style="padding: 6px; border: 1px solid rgba(255,255,255,0.05);">Capstone: Brimstone summons the full Triad of Legion demons at maximum fury, doubling their aura radiuses and granting +50% Heat damage across all demonic powers for 30s.</td>
            </tr>
          </tbody>
        </table>
    `;

    if (!isWarframesPopulated) {
      log(`Re-populating Warframes & Feats Compendium (found ${warframeDocsCount}/67 warframes, ${foldersCount}/68 folders)...`);
      await pack.configure({ locked: false });

      // Wipe old entries via batch deletion to prevent timeout/F5 freeze
      const docs = await pack.getDocuments();
      log(`Found ${docs.length} items to delete in warframes compendium.`);
      try {
        const docIds = docs.map(d => d.id).filter(Boolean);
        if (docIds.length > 0) {
          await Item.deleteDocuments(docIds, { pack: "warframe-ttrpg.warframes" });
          log(`Batch deleted ${docIds.length} items.`);
        }
      } catch (err) {
        logErr("Batch item deletion failed, falling back to sequential deletion", err);
        for (let doc of docs) {
          try {
            if (doc && doc.id) await doc.delete();
          } catch (e) {}
        }
      }

      // Wipe old folders via batch deletion
      const packFolders = Array.from(pack.folders || []);
      log(`Found ${packFolders.length} folders to delete in warframes compendium.`);
      try {
        const folderIds = packFolders.map(f => f.id).filter(Boolean);
        if (folderIds.length > 0) {
          await Folder.deleteDocuments(folderIds, { pack: "warframe-ttrpg.warframes" });
          log(`Batch deleted ${folderIds.length} folders.`);
        }
      } catch (err) {
        logErr("Batch folder deletion failed, falling back to sequential deletion", err);
        for (let f of packFolders) {
          try {
            if (f && f.id) await f.delete();
          } catch (e) {}
        }
      }

      // Create new folders inside the compendium
      const foldersData = [
        {
          _id: "excalfldr0000001",
          name: "Aptitudes d'Excalibur",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#00e5ff"
        },
        {
          _id: "voltfldr00000002",
          name: "Aptitudes de Volt",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#ffaa00"
        },
        {
          _id: "magfldr000000003",
          name: "Aptitudes de Mag",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#ff00bb"
        },
        {
          _id: "koumeifldr000001",
          name: "Aptitudes de Koumei",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#9b59b6"
        },
        {
          _id: "nokkofldr0000001",
          name: "Aptitudes de Nokko",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#2ecc71"
        },
        {
          _id: "valkyrfldr000001",
          name: "Aptitudes de Valkyr",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#e74c3c"
        },
        {
          _id: "ashfldr000000001",
          name: "Aptitudes d'Ash",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#34495e"
        },
        {
          _id: "vaubanfldr000001",
          name: "Aptitudes de Vauban",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#e67e22"
        },
        {
          _id: "atlasfldr0000001",
          name: "Aptitudes d'Atlas",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#d35400"
        },
        {
          _id: "urielfldr0000001",
          name: "Aptitudes d'Uriel",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#b71540"
        },
        {
          _id: "genfldr000000004",
          name: "Aptitudes Générales",
          type: "Item",
          folder: null,
          sorting: "a",
          color: "#888888"
        }
      ];

      const allWarframeFolders = [...foldersData, ...newWarframeFolders];
      try {
        await Folder.createDocuments(allWarframeFolders, { pack: "warframe-ttrpg.warframes", keepId: true });
        log(`Created ${allWarframeFolders.length} compendium folders successfully.`);
      } catch (err) {
        logErr("Failed to create compendium folders", err);
      }

      const featData = [
        {
          _id: "asi0000000000001",
          folder: "genfldr000000004",
          name: "Amélioration de Caractéristique (ASI)",
          type: "ability",
          img: "icons/skills/melee/weapons-crossed-swords-white-blue.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Confère +2 points de caractéristique." }
        },
        {
          _id: "tennoagility0001",
          folder: "genfldr000000004",
          name: "Agilité Tenno (Passif)",
          type: "ability",
          img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Confère +1 aux tests de Réflexes." }
        },
        {
          _id: "excalpassive0001",
          folder: "excalfldr0000001",
          name: "Escrime (Passif)",
          type: "ability",
          img: "icons/skills/melee/strike-weapons-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "+10% de dégâts et de vitesse avec les épées." }
        },
        {
          _id: "excalmechanic001",
          folder: "excalfldr0000001",
          name: "Puissance Exaltée (Mécanique Passive)",
          type: "ability",
          img: "icons/skills/melee/weapons-crossed-swords-white-blue.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Toutes les épées ont une plage de coup critique de 19-20." }
        },
        {
          _id: "excalpower000001",
          folder: "excalfldr0000001",
          name: "Élan Tranchant",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/coupe rapide.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "1d10", damageType: "Slash", description: "Fonce vers l'avant et taillade les ennemis en infligeant 1d10 dégâts Tranchants." }
        },
        {
          _id: "excalpower000012",
          folder: "excalfldr0000001",
          name: "Élan Tranchant II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/coupe rapide.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d10", damageType: "Slash", description: "Les dégâts passent à 2d10 et enchaîne jusqu'à 3 cibles." }
        },
        {
          _id: "excalpower000013",
          folder: "excalfldr0000001",
          name: "Élan Tranchant III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/coupe rapide.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d10", damageType: "Slash", description: "Les dégâts passent à 3d10, enchaîne jusqu'à 5 cibles et confère l'invulnérabilité pendant l'élan." }
        },
        {
          _id: "excalpower000002",
          folder: "excalfldr0000001",
          name: "Aveuglement Radial",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/aveuglement radial.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "cc", damage: "", damageType: "", description: "Émet un éclair aveuglant tous les ennemis à moins de 30 ft pendant 1 round." }
        },
        {
          _id: "excalpower000022",
          folder: "excalfldr0000001",
          name: "Aveuglement Radial II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/aveuglement radial.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "cc", damage: "", damageType: "", description: "Aveugle pendant 2 rounds et expose aux coups de grâce (dégâts de mêlée doublés)." }
        },
        {
          _id: "excalpower000023",
          folder: "excalfldr0000001",
          name: "Aveuglement Radial III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/aveuglement radial.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "cc", damage: "", damageType: "", description: "Aveugle pendant 3 rounds, rayon étendu à 45 ft et réduit l'armure de 30%." }
        },
        {
          _id: "excalpower000003",
          folder: "excalfldr0000001",
          name: "Javelot Radial",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/javelot radial.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "damage", damage: "3d8", damageType: "Puncture", description: "Impale up to 5 nearby enemies with javelins dealing 2d12 physical damage." }
        },
        {
          _id: "excalpower000032",
          folder: "excalfldr0000001",
          name: "Javelot Radial II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/javelot radial.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "damage", damage: "5d8", damageType: "Puncture", description: "Damage increases to 4d12, targets up to 8, and stuns targets for 1 round." }
        },
        {
          _id: "excalpower000033",
          folder: "excalfldr0000001",
          name: "Javelot Radial III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/javelot radial.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "damage", damage: "8d8", damageType: "Puncture", description: "Damage increases to 6d12, targets all enemies within 30 ft, and grants +10% melee damage per hit for 1 round." }
        },
        {
          _id: "excalpower000004",
          folder: "excalfldr0000001",
          name: "Lame Exaltée",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/lame exalté.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "buff", damage: "", damageType: "Radiant", description: "Summon a sword of pure light dealing 2d10 radiant damage with light waves." }
        },
        {
          _id: "excalpower000042",
          folder: "excalfldr0000001",
          name: "Lame Exaltée II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/lame exalté.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "buff", damage: "", damageType: "Radiant", description: "Damage increases to 4d10, waves travel 40 ft, and waves blind on a critical hit." }
        },
        {
          _id: "excalpower000043",
          folder: "excalfldr0000001",
          name: "Lame Exaltée III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Excalibur/lame exalté.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "buff", damage: "", damageType: "Radiant", description: "Damage increases to 6d10, waves pierce through obstacles, and energy drain is halved." }
        },
        {
          _id: "voltpassive00001",
          folder: "voltfldr00000002",
          name: "Décharge Statique (Passif)",
          type: "ability",
          img: "icons/skills/melee/strike-weapons-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Extra electrical damage based on movement." }
        },
        {
          _id: "voltmechanic0001",
          folder: "voltfldr00000002",
          name: "Condensateur Statique (Mécanique Active)",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Active", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain 10% electric resistance." }
        },
        {
          _id: "voltpower0000001",
          folder: "voltfldr00000002",
          name: "Choc",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/choc.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "1d8", damageType: "Electricity", description: "Chain electric strike hitting up to 2 targets dealing 1d8 electricity damage." }
        },
        {
          _id: "voltpower0000012",
          folder: "voltfldr00000002",
          name: "Choc II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/choc.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d8", damageType: "Electricity", description: "Damage increases to 2d8, chains to 4 targets, and stuns them for 1 round." }
        },
        {
          _id: "voltpower0000013",
          folder: "voltfldr00000002",
          name: "Choc III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/choc.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d8", damageType: "Electricity", description: "Damage increases to 3d8, chains to 6 targets, stuns, and generates 5 shields per target hit." }
        },
        {
          _id: "voltpower0000002",
          folder: "voltfldr00000002",
          name: "Vitesse",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/vitesse.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "buff", damage: "", damageType: "", description: "Grant +20% movement and reload speed to self and allies for 2 rounds." }
        },
        {
          _id: "voltpower0000022",
          folder: "voltfldr00000002",
          name: "Vitesse II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/vitesse.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "buff", damage: "", damageType: "", description: "Speed increases to +40%, duration to 3 rounds, and grants +10% melee attack speed." }
        },
        {
          _id: "voltpower0000023",
          folder: "voltfldr00000002",
          name: "Vitesse III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/vitesse.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "buff", damage: "", damageType: "", description: "Speed increases to +60%, duration to 4 rounds, and grants melee speed and knockback resistance." }
        },
        {
          _id: "voltpower0000003",
          folder: "voltfldr00000002",
          name: "Bouclier Électrique",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/bouclier electrique.webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "buff", damage: "", damageType: "Electricity", description: "Deploy an energy barrier blocking all incoming projectiles." }
        },
        {
          _id: "voltpower0000032",
          folder: "voltfldr00000002",
          name: "Bouclier Électrique II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/bouclier electrique.webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "buff", damage: "", damageType: "Electricity", description: "Projectiles shot through the shield gain +50% electricity damage (max 2 shields active)." }
        },
        {
          _id: "voltpower0000033",
          folder: "voltfldr00000002",
          name: "Bouclier Électrique III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/bouclier electrique.webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "buff", damage: "", damageType: "Electricity", description: "Projectiles shot through shield gain +50% electricity and double critical damage (can carry shield)." }
        },
        {
          _id: "voltpower0000004",
          folder: "voltfldr00000002",
          name: "Décharge",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/décharge.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "damage", damage: "4d12", damageType: "Electricity", description: "Paralyze enemies and deal 3d10 damage in a 30 ft radius." }
        },
        {
          _id: "voltpower0000042",
          folder: "voltfldr00000002",
          name: "Décharge II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/décharge.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "damage", damage: "6d12", damageType: "Electricity", description: "Area increases to 45 ft, and paralyzed enemies pulse electricity dealing 1d10 to adjacent targets." }
        },
        {
          _id: "voltpower0000043",
          folder: "voltfldr00000002",
          name: "Décharge III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Volt/décharge.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "damage", damage: "10d12", damageType: "Electricity", description: "Area increases to 60 ft, pulses deal 2d10, and converts 20% of damage dealt into overshields." }
        },
        {
          _id: "magpassive000001",
          folder: "magfldr000000003",
          name: "Attraction Magnétique (Passif)",
          type: "ability",
          img: "icons/skills/melee/strike-weapons-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Vacuum nearby loot and items within 15 ft." }
        },
        {
          _id: "magmechanic00001",
          folder: "magfldr000000003",
          name: "Bouclier Polarisé (Mécanique Active)",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Active", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Reflect 5% damage back as magnetic." }
        },
        {
          _id: "magpower00000001",
          folder: "magfldr000000003",
          name: "Attraction",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/Attraction.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "1d6", damageType: "Magnetic", description: "Pull targets within 30 ft towards self, dealing 1d6 magnetic damage." }
        },
        {
          _id: "magpower00000012",
          folder: "magfldr000000003",
          name: "Attraction II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/Attraction.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d6", damageType: "Magnetic", description: "Area increases to 45 ft, damage to 2d6, and pulls targets prone." }
        },
        {
          _id: "magpower00000013",
          folder: "magfldr000000003",
          name: "Attraction III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/Attraction.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d6", damageType: "Magnetic", description: "Area increases to 60 ft, damage to 3d6, and has a 50% chance to drop energy orbs." }
        },
        {
          _id: "magpower00000002",
          folder: "magfldr000000003",
          name: "Magnétisation",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/magnetisation.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "damage", damage: "2d8", damageType: "Magnetic", description: "Create a magnetic sphere around target drawing in all projectiles and dealing 1d8 damage/round." }
        },
        {
          _id: "magpower00000022",
          folder: "magfldr000000003",
          name: "Magnétisation II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/magnetisation.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "damage", damage: "3d8", damageType: "Magnetic", description: "Sphere deals 2d8/round and explodes for 3d10 damage when expiring." }
        },
        {
          _id: "magpower00000023",
          folder: "magfldr000000003",
          name: "Magnétisation III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/magnetisation.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "damage", damage: "4d8", damageType: "Magnetic", description: "Sphere deals 4d8/round, draws in nearby enemies, and explodes for 6d10 damage." }
        },
        {
          _id: "magpower00000003",
          folder: "magfldr000000003",
          name: "Polarisation",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/polarisation.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "debuff", damage: "", damageType: "Magnetic", description: "Restores 20 shields to allies and depletes 20 shields/armor of enemies." }
        },
        {
          _id: "magpower00000032",
          folder: "magfldr000000003",
          name: "Polarisation II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/polarisation.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "debuff", damage: "", damageType: "Magnetic", description: "Restores/depletes 40 shields/armor, and creates shrapnel dealing 2d6 damage to nearby targets." }
        },
        {
          _id: "magpower00000033",
          folder: "magfldr000000003",
          name: "Polarisation III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/polarisation.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "debuff", damage: "", damageType: "Magnetic", description: "Restores/depletes 80 shields/armor (overshields allowed), and shrapnel deals 4d6 damage." }
        },
        {
          _id: "magpower00000004",
          folder: "magfldr000000003",
          name: "Écrasement",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/écrasement.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "damage", damage: "4d12", damageType: "Magnetic", description: "Crush the bones of nearby enemies for 3d12 damage in a 30 ft radius." }
        },
        {
          _id: "magpower00000042",
          folder: "magfldr000000003",
          name: "Écrasement II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/écrasement.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "damage", damage: "6d12", damageType: "Magnetic", description: "Radius increases to 45 ft, damage to 5d12, and reduces target armor by 50% for 3 rounds." }
        },
        {
          _id: "magpower00000043",
          folder: "magfldr000000003",
          name: "Écrasement III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Mag/écrasement.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "damage", damage: "10d12", damageType: "Magnetic", description: "Radius increases to 60 ft, damage to 8d12, reduces armor by 100%, and grants full shields to allies." }
        },
        {
          _id: "speedincrease001",
          folder: "genfldr000000004",
          name: "Speed Increase",
          type: "ability",
          img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Your Land Speed and Climb Speed increase based on your Warframe level (+5 ft at level 7, +10 ft at level 13, +15 ft at level 18)." },
          effects: [
            {
              name: "Speed Increase",
              icon: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
              changes: [
                { key: "system.speed.land.bonus", value: "5", mode: 2, priority: 20 },
                { key: "system.speed.climb.bonus", value: "5", mode: 2, priority: 20 }
              ],
              disabled: false,
              transfer: true
            }
          ]
        },
        {
          _id: "bonusskillprof01",
          folder: "genfldr000000004",
          name: "Bonus Skill Proficiency",
          type: "ability",
          img: "icons/sundries/books/book-open-brown.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Confère la maîtrise d'une compétence au choix." }
        },
        {
          _id: "acrododge0000001",
          folder: "genfldr000000004",
          name: "Esquive Acrobatique",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Once per round, you can use a reaction to add your proficiency bonus to your AC or a save against an incoming attack." }
        },
        {
          _id: "excalsavephys001",
          folder: "excalfldr0000001",
          name: "Spécialisation de Sauvegarde : Physique",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency in Physique Saving Throws." }
        },
        {
          _id: "excalsaveprow001",
          folder: "excalfldr0000001",
          name: "Spécialisation de Sauvegarde : Prouesse",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency in Prowess Saving Throws." }
        },
        {
          _id: "excalcaps0000001",
          folder: "excalfldr0000001",
          name: "Maître de la Lame",
          type: "ability",
          img: "icons/svg/fire-sword.svg",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "While Exalted Blade is active, critical hits deal 3x damage instead of 2x." }
        },
        {
          _id: "excalswordmast01",
          folder: "excalfldr0000001",
          name: "Maîtrise de l'Épée",
          type: "ability",
          img: "icons/skills/melee/weapons-crossed-swords-white-blue.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Critical hit range of all sword weapons is improved to 18-20." }
        },
        {
          _id: "excalbladerush01",
          folder: "excalfldr0000001",
          name: "Ruée de Lame",
          type: "ability",
          img: "icons/skills/melee/strike-weapons-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "When you take the Bullet Jump action, you can make a single melee weapon attack against one target along your path with a +2 bonus to the attack roll." }
        },
        {
          _id: "voltsavesyst0001",
          folder: "voltfldr00000002",
          name: "Spécialisation de Sauvegarde : Systèmes",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency in Systems Saving Throws." }
        },
        {
          _id: "voltsaveprow0001",
          folder: "voltfldr00000002",
          name: "Spécialisation de Sauvegarde : Prouesse",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency in Prowess Saving Throws." }
        },
        {
          _id: "voltcaps00000001",
          folder: "voltfldr00000002",
          name: "Seigneur des Tempêtes",
          type: "ability",
          img: "icons/skills/melee/strike-weapons-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "When you deal electric damage, there is a 25% chance to double the damage." }
        },
        {
          _id: "voltcapoverch001",
          folder: "voltfldr00000002",
          name: "Surcharge du Condensateur",
          type: "ability",
          img: "icons/skills/melee/weapons-crossed-swords-white-blue.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Your Static Capacitor electrical resistance increases to 25%." }
        },
        {
          _id: "voltlightrefl001",
          folder: "voltfldr00000002",
          name: "Réflexes Fulgurants",
          type: "ability",
          img: "icons/skills/movement/wind-slashes-blue.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "You have advantage on Reflexes skill checks and your Land Speed increases by an additional 10 ft." }
        },
        {
          _id: "magsavefocus0001",
          folder: "magfldr000000003",
          name: "Spécialisation de Sauvegarde : Focalisation",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency in Focus Saving Throws." }
        },
        {
          _id: "magsavesyst00001",
          folder: "magfldr000000003",
          name: "Spécialisation de Sauvegarde : Systèmes",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency in Systems Saving Throws." }
        },
        {
          _id: "magcaps000000001",
          folder: "magfldr000000003",
          name: "Singularité Magnétique",
          type: "ability",
          img: "icons/skills/melee/strike-weapons-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Magnetize spheres draw in enemies from 15 ft away instead of 5 ft." }
        },
        {
          _id: "magpolarrefl0001",
          folder: "magfldr000000003",
          name: "Réflexion Polarisée",
          type: "ability",
          img: "icons/skills/melee/weapons-crossed-swords-white-blue.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Your Polarized Shield active mechanic reflection damage increases to 15%." }
        },
        {
          _id: "magpolarizer0001",
          folder: "magfldr000000003",
          name: "Polariseur Magnétique",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "When you cast Polarize or Magnetize, you immediately gain temporary shields equal to 10% of your maximum shields." }
        },
        {
          _id: "koumeipassive001",
          folder: "koumeifldr000001",
          name: "Passif de Koumei (Passif)",
          type: "ability",
          img: "icons/svg/eye.svg",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Every 60 seconds, one of Koumei's weapons will inflict random Status Effects on hits for 60 seconds." }
        },
        {
          _id: "koumeimechanic01",
          folder: "koumeifldr000001",
          name: "Les Cinq Destins (Mécanique Active)",
          type: "ability",
          img: "icons/sundries/gaming/dice-runed-brown.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Casting an ability rolls Fates Dice (up to 5d6 based on Rank). The sum is your Fates Total, determining ability effectiveness. Rolling three 6s triggers Shadow's Trinity, granting amplified bonus effects." }
        },
        {
          _id: "koumeipower00001",
          folder: "koumeifldr000001",
          name: "Kumihimo",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/kumihimo.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "1d8", damageType: "Slash", description: "Weave threads of fate in a 30 ft line. Enemies passing through take 1d4 damage multiplied by your Fates Total. Shadow's Trinity: Applies 1 stack of all elemental status effects." }
        },
        {
          _id: "koumeipower00012",
          folder: "koumeifldr000001",
          name: "Kumihimo II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/kumihimo.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d8", damageType: "Slash", description: "Kumihimo: Damage increases to 1d6 multiplied by Fates Total, and slows enemies by 50%." }
        },
        {
          _id: "koumeipower00013",
          folder: "koumeifldr000001",
          name: "Kumihimo III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/kumihimo.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d8", damageType: "Slash", description: "Kumihimo: Damage increases to 1d8 multiplied by Fates Total, and binds (restrains) enemies for 1 round." }
        },
        {
          _id: "koumeipower00002",
          folder: "koumeifldr000001",
          name: "Omikuji",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/omikuji.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "buff", damage: "", damageType: "", description: "Roll a d6 to gain a Decree for 1 minute: (1) +2 attack, (2) +15 ft speed, (3) +100 shields, (4) +20% damage, (5) regen 30 HP/rd, (6) power DC +1. Shadow's Trinity: Grants 2 Decrees." }
        },
        {
          _id: "koumeipower00022",
          folder: "koumeifldr000001",
          name: "Omikuji II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/omikuji.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "buff", damage: "", damageType: "", description: "Omikuji: Decree duration increases to 10 minutes." }
        },
        {
          _id: "koumeipower00023",
          folder: "koumeifldr000001",
          name: "Omikuji III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/omikuji.webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "buff", damage: "", damageType: "", description: "Omikuji: Decree duration increases to 1 hour. Roll twice and choose which Decree to gain." }
        },
        {
          _id: "koumeipower00003",
          folder: "koumeifldr000001",
          name: "Omamori",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/omamori.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "buff", damage: "", damageType: "", description: "Summon charms equal to half your Fates Total (rounded up). Spend a charm to roll 1d10 when hit; on a 10, the hit is negated. Shadow's Trinity: Complete invulnerability while any charms remain." }
        },
        {
          _id: "koumeipower00032",
          folder: "koumeifldr000001",
          name: "Omamori II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/omamori.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "buff", damage: "", damageType: "", description: "Omamori: Negation chance increases to 25% (4 on a 1d4)." }
        },
        {
          _id: "koumeipower00033",
          folder: "koumeifldr000001",
          name: "Omamori III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/omamori.webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "buff", damage: "", damageType: "", description: "Omamori: Negation chance increases to 50% (2 on a 1d2)." }
        },
        {
          _id: "koumeipower00004",
          folder: "koumeifldr000001",
          name: "Bunraku",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/bunraku.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "cc", damage: "", damageType: "", description: "Entrap enemies in a 30 ft cone, restraining them for 1 round. Applies random status effects equal to half your Fates Total (rounded up) to all targets. Shadow's Trinity: Maximum stacks (30) and 360-degree range." }
        },
        {
          _id: "koumeipower00042",
          folder: "koumeifldr000001",
          name: "Bunraku II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/bunraku.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "cc", damage: "", damageType: "", description: "Bunraku: Range to 45 ft cone, duration to 3 rounds. Applies status effects equal to your Fates Total." }
        },
        {
          _id: "koumeipower00043",
          folder: "koumeifldr000001",
          name: "Bunraku III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/koumei/bunraku.webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "cc", damage: "", damageType: "", description: "Bunraku: Range to 60 ft cone, rendering targets stunned (paralyzed) for 3 rounds. Applies status effects equal to Fates Total + 5." }
        },
        {
          _id: "koumeifatefavor1",
          folder: "koumeifldr000001",
          name: "Faveur du Destin",
          type: "ability",
          img: "icons/sundries/gaming/dice-runed-brown.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "When rolling Fates Dice, you can reroll any dice that land on 1." }
        },
        {
          _id: "koumeisavefocus1",
          folder: "koumeifldr000001",
          name: "Spécialisation de Sauvegarde : Focalisation",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency/expertise in Focus Saving Throws." }
        },
        {
          _id: "koumeisaveprow01",
          folder: "koumeifldr000001",
          name: "Spécialisation de Sauvegarde : Prouesse",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency/expertise in Prowess Saving Throws." }
        },
        {
          _id: "koumeishadowbles",
          folder: "koumeifldr000001",
          name: "Shadow's Blessing",
          type: "ability",
          img: "icons/sundries/gaming/dice-runed-brown.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Shadow's Blessing: You only need two 6s instead of three to trigger Shadow's Trinity." }
        },
        {
          _id: "koumeicaps000001",
          folder: "koumeifldr000001",
          name: "Tisseuse des Destins",
          type: "ability",
          img: "icons/sundries/gaming/dice-runed-brown.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Capstone: Once per encounter, you can choose to make all your Fates Dice automatically land on 6." }
        },
        {
          _id: "nokkopassive0001",
          folder: "nokkofldr0000001",
          name: "Décomposition Vitale",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Vital Decay: If you take fatal damage, if you have at least one active Stinkbrain or Brightbonnet mushroom placed, you transform into an invulnerable Sprodling form instead of entering bleedout. If you reach any active mushroom within 15 seconds (3 rounds), you revive with 100% Health/Shields and gain 1 second of invulnerability." }
        },
        {
          _id: "nokkomechanic001",
          folder: "nokkofldr0000001",
          name: "Éclosion Fongique",
          type: "ability",
          img: "icons/sundries/herbs/mushroom-spotted-red.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Fungal Spawning: Allows placing Stinkbrain and Brightbonnet mushroom templates on the battlefield. Walking over your active mushrooms launches you into the air (trampoline effect)." }
        },
        {
          _id: "nokkopower000001",
          folder: "nokkofldr0000001",
          name: "Cerveau Fétide",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-StinkbrainIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d6", damageType: "Viral", description: "Throw a mushroom creating a 15 ft radius circle. On spawn and at the start of your turn, it pulses dealing 2d6 Viral damage to all enemies inside, forcing a Prowess/Physique save against Power DC. On failure, enemies fall asleep for 1 round (finisher vulnerability). Max 4 Stinkbrain mushrooms." }
        },
        {
          _id: "nokkopower000012",
          folder: "nokkofldr0000001",
          name: "Cerveau Fétide II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-StinkbrainIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d6", damageType: "Viral", description: "Stinkbrain: Spores pulse for 3 rounds, and damage increases to 3d6 Viral." }
        },
        {
          _id: "nokkopower000013",
          folder: "nokkofldr0000001",
          name: "Cerveau Fétide III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-StinkbrainIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "4d6", damageType: "Viral", description: "Stinkbrain: Spores pulse for 4 rounds, damage increases to 4d6 Viral, and sleep duration increases to 2 rounds." }
        },
        {
          _id: "nokkopower000002",
          folder: "nokkofldr0000001",
          name: "Chapeau Lumineux",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-BrightbonnetIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "heal", damage: "", damageType: "Energy", description: "Release a mushroom creating a 30 ft radius circle. Staggers enemies inside the radius on sprout. Pulses every round: restores 10 Energy and grants +15% Ability Strength for 1 round to allies. Max 2 Brightbonnets." }
        },
        {
          _id: "nokkopower000022",
          folder: "nokkofldr0000001",
          name: "Chapeau Lumineux II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-BrightbonnetIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "heal", damage: "", damageType: "Energy", description: "Brightbonnet: Energy restore increases to 12, and Ability Strength bonus increases to 20%." }
        },
        {
          _id: "nokkopower000023",
          folder: "nokkofldr0000001",
          name: "Chapeau Lumineux III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-BrightbonnetIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "heal", damage: "", damageType: "Energy", description: "Brightbonnet: Energy restore increases to 15, Ability Strength bonus increases to 30%." }
        },
        {
          _id: "nokkopower000003",
          folder: "nokkofldr0000001",
          name: "Réenracinement",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-RerootIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "buff", damage: "", damageType: "Healing", description: "Revert to invulnerable, invisible, intangible Sprodling form for 2 rounds. Cannot attack or cast other powers. Heals 4 Health/Shields per second, spawning up to 3 spores. Allies picking up spores heal 50 and gain +50% speed for 1 round." }
        },
        {
          _id: "nokkopower000032",
          folder: "nokkofldr0000001",
          name: "Réenracinement II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-RerootIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "buff", damage: "", damageType: "Healing", description: "Reroot: Duration increases to 3 rounds, health restore increases to 6 per second, and spore pickups heal 60." }
        },
        {
          _id: "nokkopower000033",
          folder: "nokkofldr0000001",
          name: "Réenracinement III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-RerootIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "buff", damage: "", damageType: "Healing", description: "Reroot: Duration increases to 4 rounds, health restore increases to 10 per second, and spore pickups heal 80." }
        },
        {
          _id: "nokkopower000004",
          folder: "nokkofldr0000001",
          name: "Source de Spores",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-SporespringIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 75, actionType: "damage", damage: "10d6", damageType: "Toxin", description: "Unleash a ballistic mushroom that bounces up to 5 times (30 ft range). Deals 10d6 Toxin damage (bypassing shields) on each hit. Initial crit chance is 75% (dealing 2x damage). Each bounce increases crit chance by +25% flat. Doubles active mushroom pulse rates." }
        },
        {
          _id: "nokkopower000042",
          folder: "nokkofldr0000001",
          name: "Source de Spores II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-SporespringIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 75, actionType: "damage", damage: "15d6", damageType: "Toxin", description: "Sporespring: Damage increases to 12d6 Toxin, and bounces increase to 8." }
        },
        {
          _id: "nokkopower000043",
          folder: "nokkofldr0000001",
          name: "Source de Spores III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/nokko/150px-SporespringIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 75, actionType: "damage", damage: "30d6", damageType: "Toxin", description: "Sporespring: Damage increases to 15d6 Toxin, and bounces increase to 10." }
        },
        {
          _id: "nokkosavephys001",
          folder: "nokkofldr0000001",
          name: "Spécialisation de Sauvegarde : Physique",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency/expertise in Physique Saving Throws." }
        },
        {
          _id: "nokkosavefocus01",
          folder: "nokkofldr0000001",
          name: "Spécialisation de Sauvegarde : Focalisation",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency/expertise in Focus Saving Throws." }
        },
        {
          _id: "nokkocaps0000001",
          folder: "nokkofldr0000001",
          name: "Seigneur des Spores",
          type: "ability",
          img: "icons/sundries/herbs/mushroom-spotted-red.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Capstone: Once per encounter, you can trigger a massive fungal explosion that inflicts Viral status on all enemies and applies Brightbonnet buffs to all allies within 60 ft." }
        },
        {
          _id: "valkyrsaveprow01",
          folder: "valkyrfldr000001",
          name: "Spécialisation de Sauvegarde : Prouesse",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency/expertise in Prowess Saving Throws." }
        },
        {
          _id: "valkyrsavephys01",
          folder: "valkyrfldr000001",
          name: "Spécialisation de Sauvegarde : Physique",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Gain proficiency/expertise in Physique Saving Throws." }
        },
        {
          _id: "valkyrmechanic01",
          folder: "valkyrfldr000001",
          name: "Rétablissement Agile (Mécanique Active)",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Active", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Valkyr stands up from prone 50% faster, only consuming half her movement speed (50% speed instead of the standard 100%)." }
        },
        {
          _id: "valkyrpassive001",
          folder: "valkyrfldr000001",
          name: "Rage (Passif)",
          type: "ability",
          img: "icons/svg/fire.svg",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Valkyr accumulates Rage when hitting or killing enemies with melee weapons (+3% per hit, +12% per kill, +27% per finisher), increasing her Melee Damage up to 300%. If Valkyr receives a fatal hit while at or above 150% Rage, all of it is consumed to prevent death, regenerate 100% health, and grant 2 rounds of complete Invulnerability." }
        },
        {
          _id: "valkyrpower00011",
          folder: "valkyrfldr000001",
          name: "Corde Mortelle",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-RipLineIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "1d8", damageType: "Slash", description: "Valkyr hurls forth a hook and pulls herself to terrain, or pulls target enemy in to deal Slash damage. Range: 25m. Deals 3d8 Slash damage." }
        },
        {
          _id: "valkyrpower00012",
          folder: "valkyrfldr000001",
          name: "Corde Mortelle II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-RipLineIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d8", damageType: "Slash", description: "Rip Line: Range increases to 40m. Damage increases to 4d8 Slash." }
        },
        {
          _id: "valkyrpower00013",
          folder: "valkyrfldr000001",
          name: "Corde Mortelle III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-RipLineIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d8", damageType: "Slash", description: "Rip Line: Range increases to 60m. Damage increases to 5d8 Slash." }
        },
        {
          _id: "valkyrpower00014",
          folder: "valkyrfldr000001",
          name: "Corde Mortelle IV",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-RipLineIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d8", damageType: "Slash", description: "Rip Line: Range increases to 75m. Damage increases to 6d8 Slash." }
        },
        {
          _id: "valkyrpower00021",
          folder: "valkyrfldr000001",
          name: "Cri de Guerre",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-WarcryIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 75, actionType: "buff", damage: "", damageType: "", description: "Warcry lets out a rallying cry that bolsters Armor by +25% and attack speed (adds +2 to melee hit rolls) for all allies within 30 ft for 10 seconds (2 rounds)." }
        },
        {
          _id: "valkyrpower00022",
          folder: "valkyrfldr000001",
          name: "Cri de Guerre II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-WarcryIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 75, actionType: "buff", damage: "", damageType: "", description: "Warcry: Duration increases to 14 seconds (3 rounds). Armor boost increases to +35% and attack speed increases to +20%." }
        },
        {
          _id: "valkyrpower00023",
          folder: "valkyrfldr000001",
          name: "Cri de Guerre III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-WarcryIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 75, actionType: "buff", damage: "", damageType: "", description: "Warcry: Duration increases to 17 seconds (3 rounds). Armor boost increases to +45% and attack speed increases to +25%." }
        },
        {
          _id: "valkyrpower00024",
          folder: "valkyrfldr000001",
          name: "Cri de Guerre IV",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-WarcryIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 75, actionType: "buff", damage: "", damageType: "", description: "Warcry: Duration increases to 20 seconds (4 rounds). Armor boost increases to +50% and attack speed increases to +50%." }
        },
        {
          _id: "valkyrpower00031",
          folder: "valkyrfldr000001",
          name: "Paralysie",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-ParalysisIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 25, actionType: "damage", damage: "1d10", damageType: "Impact", description: "Unleash a damaging blast. Range: 5m. Deals 1d10 Impact damage and slows enemies by 15%, applying +20% Melee Damage Vulnerability for 15s (3 rounds)." }
        },
        {
          _id: "valkyrpower00032",
          folder: "valkyrfldr000001",
          name: "Paralysie II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-ParalysisIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 25, actionType: "damage", damage: "2d10", damageType: "Impact", description: "Paralysis: Range increases to 7m. Damage increases to 2d10 Impact, slow increases to 20%, and vulnerability increases to +30%." }
        },
        {
          _id: "valkyrpower00033",
          folder: "valkyrfldr000001",
          name: "Paralysie III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-ParalysisIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 25, actionType: "damage", damage: "3d10", damageType: "Impact", description: "Paralysis: Range increases to 8m. Damage increases to 3d10 Impact, slow increases to 25%, and vulnerability increases to +40%." }
        },
        {
          _id: "valkyrpower00034",
          folder: "valkyrfldr000001",
          name: "Paralysie IV",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-ParalysisIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 25, actionType: "damage", damage: "3d10", damageType: "Impact", description: "Paralysis: Range increases to 10m. Damage increases to 4d10 Impact, slow increases to 30%, and vulnerability increases to +50%." }
        },
        {
          _id: "valkyrpower00041",
          folder: "valkyrfldr000001",
          name: "Hystérie",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-HysteriaIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 25, actionType: "buff", damage: "", damageType: "", description: "Bare deadly claws (Talons: 2d10 Slash/Impact damage). Valkyr becomes Invulnerable and Immune to Status Effects (except unconscious). Warcry's armor bonus is multiplied by 1.5x while claws are active. Talons attacks restore 70 HP on hit." }
        },
        {
          _id: "valkyrpower00042",
          folder: "valkyrfldr000001",
          name: "Hystérie II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-HysteriaIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 25, actionType: "buff", damage: "", damageType: "", description: "Hysteria: Talons damage increases to 3d10, lifesteal increases to 80 HP, and Warcry armor bonus multiplier increases to 2.0x." }
        },
        {
          _id: "valkyrpower00043",
          folder: "valkyrfldr000001",
          name: "Hystérie III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-HysteriaIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 25, actionType: "buff", damage: "", damageType: "", description: "Hysteria: Talons damage increases to 4d10, lifesteal increases to 90 HP, and Warcry armor bonus multiplier increases to 2.5x." }
        },
        {
          _id: "valkyrpower00044",
          folder: "valkyrfldr000001",
          name: "Hystérie IV",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/valkyr/50px-HysteriaIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 25, actionType: "buff", damage: "", damageType: "", description: "Hysteria: Talons damage increases to 5d10, lifesteal increases to 100 HP, and Warcry armor bonus multiplier increases to 3.0x." }
        },
        {
          _id: "valkyrcaps000001",
          folder: "valkyrfldr000001",
          name: "Guerre Éternelle",
          type: "ability",
          img: "icons/svg/skull.svg",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Capstone: Melee kills while Warcry is active extend its duration by 2 seconds (1 round) per kill." }
        },
        {
          _id: "ashpassive000001",
          folder: "ashfldr000000001",
          name: "Amplification d'Hémorragie (Passif)",
          type: "ability",
          img: "icons/skills/melee/strike-slash-pain-red.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Slash procs inflicted by Ash's weapons and abilities deal 25% more damage and last 50% longer (stacks additively with status duration and status damage modifiers)." }
        },
        {
          _id: "ashpower00000011",
          folder: "ashfldr000000001",
          name: "Shuriken",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/shuriken.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "1d8", damageType: "Slash", description: "Launches 2 spinning blades of pain dealing 1d8 Slash damage on hit, automatically inflicting a Slash status." }
        },
        {
          _id: "ashpower00000012",
          folder: "ashfldr000000001",
          name: "Shuriken II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/shuriken.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d8", damageType: "Slash", description: "Damage increases to 2d8 Slash and launches 3 shurikens." }
        },
        {
          _id: "ashpower00000013",
          folder: "ashfldr000000001",
          name: "Shuriken III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/shuriken.webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d8", damageType: "Slash", description: "Damage increases to 4d8 Slash and launches 5 shurikens." }
        },
        {
          _id: "ashpower00000021",
          folder: "ashfldr000000001",
          name: "Écran de Fumée",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/ecran de fumee.webp",
          system: { abilitySlot: "Power 2", cost: 35, actionType: "buff", damage: "", damageType: "Stealth", description: "Drops a smoke bomb that staggers/stuns enemies in a 10m radius and renders Ash Invisible for 3s (1 round)." }
        },
        {
          _id: "ashpower00000022",
          folder: "ashfldr000000001",
          name: "Écran de Fumée II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/ecran de fumee.webp",
          system: { abilitySlot: "Power 2", cost: 35, actionType: "buff", damage: "", damageType: "Stealth", description: "Smoke Screen: Stuns nearby enemies, invisibility duration increases to 6s (1 round)." }
        },
        {
          _id: "ashpower00000023",
          folder: "ashfldr000000001",
          name: "Écran de Fumée III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/ecran de fumee.webp",
          system: { abilitySlot: "Power 2", cost: 35, actionType: "buff", damage: "", damageType: "Stealth", description: "Smoke Screen: Stuns nearby enemies, invisibility duration increases to 12s (2 rounds)." }
        },
        {
          _id: "ashpower00000031",
          folder: "ashfldr000000001",
          name: "Téléportation",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/teleportation.webp",
          system: { abilitySlot: "Power 3", cost: 25, actionType: "utility", damage: "", damageType: "", description: "Teleport to a target in range (20m) and perform a Finisher dealing +125% damage. Refunds 50% energy cost on finisher kill." }
        },
        {
          _id: "ashpower00000032",
          folder: "ashfldr000000001",
          name: "Téléportation II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/teleportation.webp",
          system: { abilitySlot: "Power 3", cost: 25, actionType: "utility", damage: "", damageType: "", description: "Teleport: Range increases to 45m, Finisher damage increases to +150%." }
        },
        {
          _id: "ashpower00000033",
          folder: "ashfldr000000001",
          name: "Téléportation III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/teleportation.webp",
          system: { abilitySlot: "Power 3", cost: 25, actionType: "utility", damage: "", damageType: "", description: "Teleport: Range increases to 60m, Finisher damage is +200%, and enjoys a 100% discount on Blade Storm marked targets." }
        },
        {
          _id: "ashpower00000041",
          folder: "ashfldr000000001",
          name: "Tempête de Lames",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/tempete de lames.webp",
          system: { abilitySlot: "Power 4", cost: 0, actionType: "damage", damage: "4d12", damageType: "True", description: "Project 2 Shadow Clones to strike marked enemies within 50m for 3d12 True damage, applying Slash. Costs 12 energy per mark, or 6 energy if invisible." }
        },
        {
          _id: "ashpower00000042",
          folder: "ashfldr000000001",
          name: "Tempête de Lames II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/tempete de lames.webp",
          system: { abilitySlot: "Power 4", cost: 0, actionType: "damage", damage: "6d12", damageType: "True", description: "Blade Storm: Clone damage increases to 6d12 True damage." }
        },
        {
          _id: "ashpower00000043",
          folder: "ashfldr000000001",
          name: "Tempête de Lames III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/tempete de lames.webp",
          system: { abilitySlot: "Power 4", cost: 0, actionType: "damage", damage: "10d12", damageType: "True", description: "Blade Storm: Clone damage increases to 12d12 True damage." }
        },
        {
          _id: "ashcaps000000001",
          folder: "ashfldr000000001",
          name: "Téléportation Fatale",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Ash/teleportation.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Capstone: Teleport automatically scores a Critical Hit on the Finisher (x2 damage). Furthermore, the Bleed status inflicted by this finisher deals +50% damage." }
        },
        {
          _id: "vaubanpassive001",
          folder: "vaubanfldr000001",
          name: "Démolition du Technologiste (Passif)",
          type: "ability",
          img: "icons/skills/melee/hand-grip-slash-red.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Vauban inflicts 25% bonus damage with weapons and abilities against incapacitated enemies. Furthermore, damaging status effects applied to incapacitated targets permanently deal +25% damage." }
        },
        {
          _id: "vaubanpower00111",
          folder: "vaubanfldr000001",
          name: "Tesla Nervos",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-TeslaNervosIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "1d8", damageType: "Electricity", description: "Deploy a roller drone that attaches itself to enemies, dealing 1d8 Electricity damage to the target and nearby enemies in a 12 ft shock radius, with a 50% chance to stun/shock." }
        },
        {
          _id: "vaubanpower00112",
          folder: "vaubanfldr000001",
          name: "Tesla Nervos II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-TeslaNervosIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d8", damageType: "Electricity", description: "Tesla Nervos: Damage increases to 2d8 Electricity, radius to 12 ft, drone attaches for 2 rounds." }
        },
        {
          _id: "vaubanpower00113",
          folder: "vaubanfldr000001",
          name: "Tesla Nervos III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-TeslaNervosIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d8", damageType: "Electricity", description: "Tesla Nervos: Damage increases to 4d8 Electricity, radius to 18 ft, drone attaches for 3 rounds." }
        },
        {
          _id: "vaubanpower00121",
          folder: "vaubanfldr000001",
          name: "Champ de Mines",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-MinelayerIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 25, actionType: "damage", damage: "2d8", damageType: "Puncture", description: "Control the battlefield with mines. Choose Tether-Flechette Orb (restrains and launches flechette nails dealing 2d8 Puncture damage) or Vector-Overdrive Pad (+25% Speed & +25% Weapon Damage to allies) (25 Energy)." }
        },
        {
          _id: "vaubanpower00122",
          folder: "vaubanfldr000001",
          name: "Champ de Mines II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-MinelayerIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 25, actionType: "damage", damage: "3d8", damageType: "Puncture", description: "Minelayer: Tether-Flechette deals 3d8 Puncture damage. Vector-Overdrive lasts 3 rounds." }
        },
        {
          _id: "vaubanpower00123",
          folder: "vaubanfldr000001",
          name: "Champ de Mines III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-MinelayerIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 25, actionType: "damage", damage: "4d8", damageType: "Puncture", description: "Minelayer: Tether-Flechette deals 4d8 Puncture damage and tethers 2 targets. Vector-Overdrive lasts 3 rounds." }
        },
        {
          _id: "vaubanpower00131",
          folder: "vaubanfldr000001",
          name: "Frappe Photonique",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-PhotonStrikeIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "damage", damage: "6d12", damageType: "Blast", description: "Drop a targeting beacon that calls in a laser artillery strike dealing 6d12 Blast damage in a 21 ft radius. Deals double damage to targets with Overguard." }
        },
        {
          _id: "vaubanpower00132",
          folder: "vaubanfldr000001",
          name: "Frappe Photonique II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-PhotonStrikeIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "damage", damage: "9d12", damageType: "Blast", description: "Photon Strike: Explosion damage increases to 9d12 Blast damage." }
        },
        {
          _id: "vaubanpower00133",
          folder: "vaubanfldr000001",
          name: "Frappe Photonique III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-PhotonStrikeIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 50, actionType: "damage", damage: "18d12", damageType: "Blast", description: "Photon Strike: Explosion damage increases to 15d12 Blast damage." }
        },
        {
          _id: "vaubanpower00141",
          folder: "vaubanfldr000001",
          name: "Bastille",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-BastilleIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "cc", damage: "", damageType: "", description: "Erect a stasis field to capture enemies (suspended, speed = 0) and strip armor. Alternatively, HOLD to collapse Bastilles into a vortex dealing 3d10 Magnetic damage per round." }
        },
        {
          _id: "vaubanpower00142",
          folder: "vaubanfldr000001",
          name: "Bastille II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-BastilleIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "cc", damage: "", damageType: "", description: "Bastille: Vortex deals 4d10 Magnetic damage. Armor stripping increases to 15%." }
        },
        {
          _id: "vaubanpower00143",
          folder: "vaubanfldr000001",
          name: "Bastille III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/vauban/50px-BastilleIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "cc", damage: "", damageType: "", description: "Bastille: Vortex deals 6d10 Magnetic damage. Armor stripping increases to 25%." }
        },
        {
          _id: "vaubancaps000001",
          folder: "vaubanfldr000001",
          name: "Bastille Repoussante",
          type: "ability",
          img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Capstone: Bastille stasis capacity has no limit, and all enemies inside take +25% extra damage from all sources." }
        },
        {
          _id: "ashmechanic00001",
          folder: "ashfldr000000001",
          name: "Prouesse de Ninja (Mécanique Passive)",
          type: "ability",
          img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Passive Mechanic: Ash gains Advantage on all Stealth and Acrobatics checks." }
        },
        {
          _id: "vaubanmechanic01",
          folder: "vaubanfldr000001",
          name: "Spécialiste des Pièges (Mécanique Passive)",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Passive Mechanic: Vauban's ability save DCs are increased by +2. Additionally, the range of all his abilities is increased by +15 ft." }
        },
        {
          _id: "atlaspassive0001",
          folder: "atlasfldr0000001",
          name: "Roc Inamovible (Passif)",
          type: "ability",
          img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Becomes immune to Knockdown effects while on the ground." }
        },
        {
          _id: "atlaspower000011",
          folder: "atlasfldr0000001",
          name: "Éboulement",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-LandslideIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "1d10", damageType: "Impact", description: "Bash enemies with an explosive sliding punch. Repeat consecutively up to 3 times in a combo. 1st hit: 4m radius, deals 2d10 Impact damage. Has 35% Crit Chance and 2.0x Crit Multiplier, and generates 50% bonus Rubble." }
        },
        {
          _id: "atlaspower000012",
          folder: "atlasfldr0000001",
          name: "Éboulement II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-LandslideIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d10", damageType: "Impact", description: "Landslide: 2nd hit: 6m radius, deals 4d10 Impact damage. Cost is reduced to 15 Energy." }
        },
        {
          _id: "atlaspower000013",
          folder: "atlasfldr0000001",
          name: "Éboulement III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-LandslideIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d10", damageType: "Impact", description: "Landslide: 3rd hit: 8m radius, deals 6d10 Impact damage. Cost is reduced to 10 Energy." }
        },
        {
          _id: "atlaspower000021",
          folder: "atlasfldr0000001",
          name: "Tectonique",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-TectonicsIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "summon", damage: "", damageType: "", description: "Summon a Bulwark rock-wall (1500 HP). Activate again to send it rolling toward enemies, dealing 6d10 Impact damage and exploding for 3d10 Puncture damage." }
        },
        {
          _id: "atlaspower000022",
          folder: "atlasfldr0000001",
          name: "Tectonique II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-TectonicsIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "summon", damage: "", damageType: "", description: "Tectonics: Bulwark health increases to 2500 HP, rolling deals 10d10 Impact damage, and explosion deals 5d10 Puncture damage." }
        },
        {
          _id: "atlaspower000023",
          folder: "atlasfldr0000001",
          name: "Tectonique III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-TectonicsIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "summon", damage: "", damageType: "", description: "Tectonics: Bulwark health increases to 4000 HP, rolling deals 15d10 Impact damage, and explosion deals 8d10 Puncture damage." }
        },
        {
          _id: "atlaspower000031",
          folder: "atlasfldr0000001",
          name: "Pétrification",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-PetrifyIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "cc", damage: "", damageType: "", description: "Cone of fossilization (14m cone length). Petrified targets are incapacitated and take +50% extra damage from all sources. Shattering them drops Rubble." }
        },
        {
          _id: "atlaspower000032",
          folder: "atlasfldr0000001",
          name: "Pétrification II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-PetrifyIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "cc", damage: "", damageType: "", description: "Petrify: Cone length increases to 18m, and damage vulnerability increases to +75%." }
        },
        {
          _id: "atlaspower000033",
          folder: "atlasfldr0000001",
          name: "Pétrification III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-PetrifyIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "cc", damage: "", damageType: "", description: "Petrify: Cone length increases to 24m, and damage vulnerability increases to +100%." }
        },
        {
          _id: "atlaspower000041",
          folder: "atlasfldr0000001",
          name: "Colosses",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-RumblersIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "summon", damage: "", damageType: "", description: "Summon two elemental stone brawlers (1200 HP, 10d10 melee Impact damage) for 45s. Cast petrifies nearby enemies on spawn. Rumblers drop Rubble on death." }
        },
        {
          _id: "atlaspower000042",
          folder: "atlasfldr0000001",
          name: "Colosses II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-RumblersIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "summon", damage: "", damageType: "", description: "Rumblers: Brawler health increases to 2000 HP, melee damage to 15d10 Impact, and rock throw damage to 5d10 Impact." }
        },
        {
          _id: "atlaspower000043",
          folder: "atlasfldr0000001",
          name: "Colosses III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/atlas/50px-RumblersIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 100, actionType: "summon", damage: "", damageType: "", description: "Rumblers: Brawler health increases to 3000 HP, melee damage to 20d10 Impact, and rock throw damage to 8d10 Impact." }
        },
        {
          _id: "atlascaps0000001",
          folder: "atlasfldr0000001",
          name: "Éboulement de Gravats",
          type: "ability",
          img: "icons/magic/earth/strike-fist-stone-yellow.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Capstone: Landslide deals +100% damage while Rubble is above 1000. Additionally, Rubble decays 50% slower (-25 instead of -50 per turn)." }
        },
        {
          _id: "atlasrubblemech1",
          folder: "atlasfldr0000001",
          name: "Décombres (Mécanique Passive)",
          type: "ability",
          img: "icons/skills/melee/shield-block-gray-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Passive Mechanic: Adds the Rubble resource bar (max 1500). Gaining Rubble grants a 1:1 bonus to Atlas' Armor calculation. Rubble decays by -50 at the start of Atlas' turn." }
        },
        {
          _id: "urielpassive0001",
          folder: "urielfldr0000001",
          name: "Légion (Passif)",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-InfernalisIcon(xWhite).webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Passive: Commands 3 fiendish flying summons: Catenach (chains up to 5 enemies, 50% Slow, 100% shared damage), Gulphagor (latches onto enemies, creates 15 ft Circle of Pain on death with 500% Heat status chance), and Vythelas (harvests Demonium Runes on corpses granting +30% Fire Rate and +30% Heat extra hit damage)." }
        },
        {
          _id: "urieldemonmech01",
          folder: "urielfldr0000001",
          name: "Lien Démoniaque (Mécanique Passive)",
          type: "ability",
          img: "icons/magic/fire/orb-vortex-fire-purple.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Passive Mechanic: Establishes the occult Brimstone Fury gauge (0–100%) and tracks the Triad of Legion demons. Demons generate +25% Brimstone Fury on kills, +20% on Demonium Runes, and +15% per Demonium soul hit. Fallen demons can be resurrected with Remedium." }
        },
        {
          _id: "urielpower000011",
          folder: "urielfldr0000001",
          name: "Infernalis",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-InfernalisIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "2d6", damageType: "Heat", description: "Infernalis: Unleashes a 15 ft radius aura of roaring hellfire dealing 2d6 Heat damage and inflicting Heat status. Ignites living demons in fire spheres (+25% damage). Unlocks and manifests Catenach." }
        },
        {
          _id: "urielpower000012",
          folder: "urielfldr0000001",
          name: "Infernalis II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-InfernalisIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "3d6", damageType: "Heat", description: "Infernalis: Radius expands to 20 ft, damage increases to 3d6 Heat damage. Ignited demons burn nearby enemies for 1d6 Heat damage per turn." }
        },
        {
          _id: "urielpower000013",
          folder: "urielfldr0000001",
          name: "Infernalis III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-InfernalisIcon(xWhite).webp",
          system: { abilitySlot: "Power 1", cost: 25, actionType: "damage", damage: "4d6", damageType: "Heat", description: "Infernalis: Radius expands to 25 ft, damage increases to 4d6 Heat damage. Ignited demons burn nearby enemies for 2d6 Heat damage per turn." }
        },
        {
          _id: "urielpower000021",
          folder: "urielfldr0000001",
          name: "Remedium",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-RemediumIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "heal", damage: "", damageType: "Healing", description: "Remedium: Channels occult restorative energy, instantly restoring 50 HP to Uriel. Revives all fallen Legion demons to full HP (150) and manifests Gulphagor." }
        },
        {
          _id: "urielpower000022",
          folder: "urielfldr0000001",
          name: "Remedium II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-RemediumIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "heal", damage: "", damageType: "Healing", description: "Remedium: Restores 100 HP to Uriel. Fully revives and restores all Legion demons, granting them 50 bonus Overguard shields." }
        },
        {
          _id: "urielpower000023",
          folder: "urielfldr0000001",
          name: "Remedium III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-RemediumIcon(xWhite).webp",
          system: { abilitySlot: "Power 2", cost: 50, actionType: "heal", damage: "", damageType: "Healing", description: "Remedium: Restores 150 HP to Uriel. Fully revives and restores all Legion demons with 100 bonus Overguard shields." }
        },
        {
          _id: "urielpower000031",
          folder: "urielfldr0000001",
          name: "Demonium",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-DemoniumIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "damage", damage: "3d8", damageType: "Void", description: "Demonium: Drains 10% max HP (15 HP) from each living demon to launch homing souls dealing 3d8 Void/Heat damage and inflicting Damage Vulnerability (+50% incoming damage for 2 rounds). Generates +15% Brimstone Fury per demon. Unlocks and manifests Vythelas." }
        },
        {
          _id: "urielpower000032",
          folder: "urielfldr0000001",
          name: "Demonium II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-DemoniumIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "damage", damage: "5d8", damageType: "Void", description: "Demonium: Drains 10% max HP from living demons. Homing souls deal 5d8 Void/Heat damage, inflict Damage Vulnerability (+50% incoming damage), and generate +20% Brimstone Fury per demon." }
        },
        {
          _id: "urielpower000033",
          folder: "urielfldr0000001",
          name: "Demonium III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-DemoniumIcon(xWhite).webp",
          system: { abilitySlot: "Power 3", cost: 75, actionType: "damage", damage: "8d8", damageType: "Void", description: "Demonium: Drains 10% max HP from living demons. Homing souls deal 7d8 Void/Heat damage, inflict Damage Vulnerability (+50% incoming damage), and generate +25% Brimstone Fury per demon." }
        },
        {
          _id: "urielpower000041",
          folder: "urielfldr0000001",
          name: "Brimstone",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-BrimstoneIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 75, actionType: "damage", damage: "4d12", damageType: "Heat", description: "Brimstone: Requires 100% Brimstone Fury. Consumes the gauge to release an expanding ring of flaming brimstone (30 ft radius) dealing 4d12 Heat damage, knocking down enemies, and inflicting Heat status." }
        },
        {
          _id: "urielpower000042",
          folder: "urielfldr0000001",
          name: "Brimstone II",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-BrimstoneIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 75, actionType: "damage", damage: "6d12", damageType: "Heat", description: "Brimstone: Requires 100% Brimstone Fury. Expanding ring (45 ft radius) dealing 8d12 Heat damage with 100% Heat status proc and knockdown." }
        },
        {
          _id: "urielpower000043",
          folder: "urielfldr0000001",
          name: "Brimstone III",
          type: "ability",
          img: "systems/warframe-ttrpg/asset/classe/Power icon/Uriel/150px-BrimstoneIcon(xWhite).webp",
          system: { abilitySlot: "Power 4", cost: 75, actionType: "damage", damage: "10d12", damageType: "Heat", description: "Brimstone: Requires 100% Brimstone Fury. Expanding apocalyptic ring (60 ft radius) dealing 12d12 Heat damage, knocking down enemies, and setting the ground ablaze for 3 rounds." }
        },
        {
          _id: "urielcaps0000001",
          folder: "urielfldr0000001",
          name: "Porte Infernale de Xata",
          type: "ability",
          img: "icons/magic/fire/portal-flame-rings-orange.webp",
          system: { abilitySlot: "Passive", cost: 0, actionType: "passive", damage: "", damageType: "", description: "Capstone: Casting Brimstone summons the full Triad of Legion demons at maximum fury, doubling their aura radiuses and granting +50% Heat damage across all demonic powers for 30s." }
        }
      ];

      const classesData = [
        {
          _id: "wfexcaliburclass",
          folder: null,
          name: "Excalibur",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/Excalibur.webp",
          system: {
            description: "Excalibur est le maître incontesté des lames, alliant attaque et défense dans un profil parfaitement équilibré. Il excelle au corps-à-corps à l'épée et possède une agilité fulgurante.",
            progression: excalProgTable,
            baseHealth: 270,
            baseShields: 270,
            baseArmor: 240,
            baseEnergy: 100,
            passive: "Escrime : +10% de Dégâts et de Vitesse avec les armes de mêlée de type Épée.",
            activeMechanic: "Puissance Exaltée : Accès à la Lame Exaltée.",
            advancements: {
              "adv_excal_hp_1": { level: 1, type: "HitPoints", health: 270, shields: 270, energy: 100, armor: 240, healthIncrease: 3.45, shieldIncrease: 3.45, energyIncrease: 1.72 },
              "adv_excal_tr_1": { level: 1, type: "Traits", saves: ["physique", "prowess"], skills: ["athletics", "acrobatics"] },
              "adv_excal_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.excalpassive0001",
                  "Compendium.warframe-ttrpg.warframes.excalpower000001"
                ]
              },
              "adv_excal_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalmechanic001"] },
              "adv_excal_gr3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000002"] },
              "adv_excal_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_excal_gr5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000003"] },
              "adv_excal_gr6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000012"] },
              "adv_excal_gr7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_excal_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_excal_gr9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000022"] },
              "adv_excal_gr10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000004"] },
              "adv_excal_gr11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000032"] },
              "adv_excal_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_excal_gr13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_excal_gr14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_excal_gr15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000042"] },
              "adv_excal_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_excal_gr16_p": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000013"] },
              "adv_excal_gr18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_excal_gr19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000023"] },
              "adv_excal_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_excal_gr21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000033"] },
              "adv_excal_gr22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalswordmast01"] },
              "adv_excal_gr23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
              "adv_excal_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_excal_gr25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalpower000043"] },
              "adv_excal_gr26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_excal_gr27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsaveprow001"] },
              "adv_excal_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_excal_gr29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalbladerush01"] },
              "adv_excal_gr30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalcaps0000001"] }
            }
          }
        },
        {
          _id: "wfvoltclass00002",
          folder: null,
          name: "Volt",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/Volt.webp",
          system: {
            description: "Volt is an electrical storm controller. He is highly mobile and provides speed boosts and shielding to allies, shock-stunning entire squads with arcs of chain lightning.",
            progression: voltProgTable,
            baseHealth: 270,
            baseShields: 455,
            baseArmor: 105,
            baseEnergy: 100,
            passive: "Static Discharge: Gain extra electrical damage on next hit based on distance traveled.",
            activeMechanic: "Overload: Deal electrical damage in an area.",
            advancements: {
              "adv_volt_hp_1": { level: 1, type: "HitPoints", health: 270, shields: 455, energy: 100, armor: 105, healthIncrease: 3.45, shieldIncrease: 3.45, energyIncrease: 1.72 },
              "adv_volt_tr_1": { level: 1, type: "Traits", saves: ["prowess", "systems"], skills: ["engineering", "reflexes"] },
              "adv_volt_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.voltpassive00001",
                  "Compendium.warframe-ttrpg.warframes.voltpower0000001"
                ]
              },
              "adv_volt_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltmechanic0001"] },
              "adv_volt_gr3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000002"] },
              "adv_volt_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_volt_gr5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000003"] },
              "adv_volt_gr6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000012"] },
              "adv_volt_gr7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_volt_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_volt_gr9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000022"] },
              "adv_volt_gr10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000004"] },
              "adv_volt_gr11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000032"] },
              "adv_volt_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_volt_gr13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_volt_gr14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_volt_gr15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000042"] },
              "adv_volt_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_volt_gr16_p": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000013"] },
              "adv_volt_gr18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_volt_gr19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000023"] },
              "adv_volt_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_volt_gr21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000033"] },
              "adv_volt_gr22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltcapoverch001"] },
              "adv_volt_gr23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltsavesyst0001"] },
              "adv_volt_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_volt_gr25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltpower0000043"] },
              "adv_volt_gr26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_volt_gr27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltsaveprow0001"] },
              "adv_volt_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_volt_gr29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltlightrefl001"] },
              "adv_volt_gr30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.voltcaps00000001"] }
            }
          }
        },
        {
          _id: "wfmagclass000003",
          folder: null,
          name: "Mag",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/Mag.webp",
          system: {
            description: "Mag is a master of magnetic forces. She controls enemy positioning, strips shields and armor, and redirects enemy bullets into destructive gravity-wells.",
            progression: magProgTable,
            baseHealth: 180,
            baseShields: 455,
            baseArmor: 105,
            baseEnergy: 140,
            passive: "Magnetic Attraction: Vacuum nearby loot and items to yourself within 15 ft.",
            activeMechanic: "Magnetize: Create a magnetic field around target.",
            advancements: {
              "adv_mag_hp_1": { level: 1, type: "HitPoints", health: 180, shields: 455, energy: 140, armor: 105, healthIncrease: 3.45, shieldIncrease: 3.45, energyIncrease: 1.72 },
              "adv_mag_tr_1": { level: 1, type: "Traits", saves: ["systems", "focus"], skills: ["perception", "void"] },
              "adv_mag_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.magpassive000001",
                  "Compendium.warframe-ttrpg.warframes.magpower00000001"
                ]
              },
              "adv_mag_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magmechanic00001"] },
              "adv_mag_gr3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000002"] },
              "adv_mag_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_mag_gr5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000003"] },
              "adv_mag_gr6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000012"] },
              "adv_mag_gr7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_mag_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_mag_gr9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000022"] },
              "adv_mag_gr10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000004"] },
              "adv_mag_gr11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000032"] },
              "adv_mag_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_mag_gr13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_mag_gr14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_mag_gr15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000042"] },
              "adv_mag_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_mag_gr16_p": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000013"] },
              "adv_mag_gr18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_mag_gr19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000023"] },
              "adv_mag_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_mag_gr21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000033"] },
              "adv_mag_gr22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpolarrefl0001"] },
              "adv_mag_gr23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_mag_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_mag_gr25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpower00000043"] },
              "adv_mag_gr26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_mag_gr27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavesyst00001"] },
              "adv_mag_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_mag_gr29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magpolarizer0001"] },
              "adv_mag_gr30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magcaps000000001"] }
            }
          }
        },
        {
          _id: "wfkoumeiclass001",
          folder: null,
          name: "Koumei",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/koumei.webp",
          system: {
            description: "Koumei is the Dice-Maiden, weaving threads of fate to manipulate probability and ensure victory. She gambles with fate, unleashing random effects and using shrine charms to survive.",
            progression: koumeiProgTable,
            baseHealth: 344,
            baseShields: 122,
            baseArmor: 444,
            baseEnergy: 122,
            passive: "Koumei Passive: Inflict random status effects on hits.",
            activeMechanic: "The Five Fates: Roll d6s to boost ability effectiveness.",
            advancements: {
              "adv_koumei_hp_1": { level: 1, type: "HitPoints", health: 344, shields: 122, energy: 122, armor: 444, healthIncrease: 3.45, shieldIncrease: 3.45, energyIncrease: 3.45 },
              "adv_koumei_tr_1": { level: 1, type: "Traits", saves: ["prowess", "focus"], skills: ["reflexes", "perception"] },
              "adv_koumei_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.koumeipassive001",
                  "Compendium.warframe-ttrpg.warframes.koumeipower00001"
                ]
              },
              "adv_koumei_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeimechanic01"] },
              "adv_koumei_gr3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00002"] },
              "adv_koumei_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_koumei_gr5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00003"] },
              "adv_koumei_gr6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00012"] },
              "adv_koumei_gr7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_koumei_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_koumei_gr9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00022"] },
              "adv_koumei_gr10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00004"] },
              "adv_koumei_gr11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00032"] },
              "adv_koumei_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_koumei_gr13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_koumei_gr14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_koumei_gr15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00042"] },
              "adv_koumei_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_koumei_gr16_p": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00013"] },
              "adv_koumei_gr18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_koumei_gr19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00023"] },
              "adv_koumei_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_koumei_gr21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00033"] },
              "adv_koumei_gr22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeifatefavor1"] },
              "adv_koumei_gr23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeisavefocus1"] },
              "adv_koumei_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_koumei_gr25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeipower00043"] },
              "adv_koumei_gr26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_koumei_gr27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeisaveprow01"] },
              "adv_koumei_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_koumei_gr29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeishadowbles"] },
              "adv_koumei_gr30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.koumeicaps000001"] }
            }
          }
        },
        {
          _id: "wfnokkoclass0001",
          folder: null,
          name: "Nokko",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/Nokko.webp",
          system: {
            description: "Nokko is a mushroom-themed defender who grows tricky fungi to control the battlefield. He regenerates energy for his allies, and turns into an invulnerable Sprodling to revive himself.",
            progression: nokkoProgTable,
            baseHealth: 150,
            baseShields: 300,
            baseArmor: 135,
            baseEnergy: 130,
            passive: "Vital Decay: revive with mushrooms upon receiving fatal damage.",
            activeMechanic: "Fungal Spawning: Spawn Stinkbrain and Brightbonnet mushrooms.",
            advancements: {
              "adv_nokko_hp_1": { level: 1, type: "HitPoints", health: 150, shields: 300, energy: 130, armor: 135, healthIncrease: 3.45, shieldIncrease: 3.45, energyIncrease: 1.72 },
              "adv_nokko_tr_1": { level: 1, type: "Traits", saves: ["physique", "focus"], skills: ["survival", "perception"] },
              "adv_nokko_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.nokkopassive0001",
                  "Compendium.warframe-ttrpg.warframes.nokkopower000001"
                ]
              },
              "adv_nokko_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkomechanic001"] },
              "adv_nokko_gr3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000002"] },
              "adv_nokko_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_nokko_gr5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000003"] },
              "adv_nokko_gr6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000012"] },
              "adv_nokko_gr7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_nokko_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_nokko_gr9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000022"] },
              "adv_nokko_gr10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000004"] },
              "adv_nokko_gr11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000032"] },
              "adv_nokko_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_nokko_gr13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_nokko_gr14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_nokko_gr15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000042"] },
              "adv_nokko_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_nokko_gr16_p": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000013"] },
              "adv_nokko_gr18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_nokko_gr19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000023"] },
              "adv_nokko_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_nokko_gr21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000033"] },
              "adv_nokko_gr22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkosavephys001"] },
              "adv_nokko_gr23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkosavefocus01"] },
              "adv_nokko_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_nokko_gr25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkopower000043"] },
              "adv_nokko_gr26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_nokko_gr27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkosavephys001"] },
              "adv_nokko_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_nokko_gr29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkosavefocus01"] },
              "adv_nokko_gr30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.nokkocaps0000001"] }
            }
          }
        },
        {
          _id: "wfvalkyrclass001",
          folder: null,
          name: "Valkyr",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/valkyr.webp",
          system: {
            description: "Torturée et forgée en une tueuse d'une férocité absolue. Valkyr excelle dans l'annihilation au corps-à-corps et la survie pure. Son cri de guerre glace le sang de tous ses ennemis.",
            progression: valkyrProgTable,
            baseHealth: 650,
            baseShields: 135,
            baseArmor: 855,
            baseEnergy: 100,
            passive: "Rage : Accumule de la Rage en frappant au corps-à-corps, jusqu'à +300% de dégâts de mêlée. Un coup mortel consomme la Rage (>=150%) pour empêcher la mort.",
            activeMechanic: "Rétablissement Agile : Valkyr se relève de l'état à terre deux fois plus vite, ne consommant que la moitié de sa vitesse.",
            advancements: {
              "adv_valkyr_hp_1": { level: 1, type: "HitPoints", health: 650, shields: 135, energy: 100, armor: 855, healthIncrease: 3.45, shieldIncrease: 1.72, energyIncrease: 1.72 },
              "adv_valkyr_tr_1": { level: 1, type: "Traits", saves: ["physique", "prowess"], skills: ["athletics", "reflexes"] },
              "adv_valkyr_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.valkyrpassive001",
                  "Compendium.warframe-ttrpg.warframes.valkyrpower00011"
                ]
              },
              "adv_valkyr_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrmechanic01"] },
              "adv_valkyr_gr3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00021"] },
              "adv_valkyr_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_valkyr_gr5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00031"] },
              "adv_valkyr_gr6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00012"] },
              "adv_valkyr_gr7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_valkyr_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_valkyr_gr9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00022"] },
              "adv_valkyr_gr10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00041"] },
              "adv_valkyr_gr11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00032"] },
              "adv_valkyr_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_valkyr_gr13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_valkyr_gr14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_valkyr_gr15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00042"] },
              "adv_valkyr_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_valkyr_gr17": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00013"] },
              "adv_valkyr_gr18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_valkyr_gr19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00023"] },
              "adv_valkyr_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_valkyr_gr21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00033"] },
              "adv_valkyr_gr22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00043"] },
              "adv_valkyr_gr23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrsaveprow01"] },
              "adv_valkyr_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_valkyr_gr25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00024"] },
              "adv_valkyr_gr26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_valkyr_gr27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrsavephys01"] },
              "adv_valkyr_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_valkyr_gr29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpower00034"] },
              "adv_valkyr_gr30": { level: 30, type: "GrantItems", uuids: [
                "Compendium.warframe-ttrpg.warframes.valkyrpower00044",
                "Compendium.warframe-ttrpg.warframes.valkyrcaps000001"
              ] }
            }
          }
        },
        {
          _id: "wfashclass000001",
          folder: null,
          name: "Ash",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/Ash.webp",
          system: {
            description: "Admirez le saint patron de l'école d'assassinat politique des Orokins. Ash règne en maître sur la furtivité. Le fil de sa lame est ressenti bien avant d'être aperçu.",
            progression: ashProgTable,
            baseHealth: 455,
            baseShields: 270,
            baseArmor: 105,
            baseEnergy: 100,
            passive: "Amplification d'Hémorragie : Les statuts Tranchants infligés par Ash infligent +25% de dégâts et durent 50% plus longtemps.",
            activeMechanic: "Prouesse de Ninja : Avantage systématique sur tous les tests de Furtivité et d'Acrobaties.",
            advancements: {
              "adv_ash_hp_1": { level: 1, type: "HitPoints", health: 455, shields: 270, energy: 100, armor: 105, healthIncrease: 3.45, shieldIncrease: 3.45, energyIncrease: 1.72 },
              "adv_ash_tr_1": { level: 1, type: "Traits", saves: ["prowess", "focus"], skills: ["stealth", "acrobatics"] },
              "adv_ash_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.ashpassive000001",
                  "Compendium.warframe-ttrpg.warframes.ashpower00000011"
                ]
              },
              "adv_ash_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashmechanic00001"] },
              "adv_ash_gr_3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000021"] },
              "adv_ash_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_ash_gr_5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000031"] },
              "adv_ash_gr_6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000012"] },
              "adv_ash_gr_7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_ash_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_ash_gr_9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000022"] },
              "adv_ash_gr_10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000041"] },
              "adv_ash_gr_11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000032"] },
              "adv_ash_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_ash_gr_13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_ash_gr_14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_ash_gr_15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000042"] },
              "adv_ash_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_ash_gr_17": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000013"] },
              "adv_ash_gr_18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_ash_gr_19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000023"] },
              "adv_ash_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_ash_gr_21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000033"] },
              "adv_ash_gr_22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsaveprow001"] },
              "adv_ash_gr_23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_ash_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_ash_gr_25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashpower00000043"] },
              "adv_ash_gr_26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_ash_gr_27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsaveprow001"] },
              "adv_ash_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_ash_gr_29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_ash_gr_30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.ashcaps000000001"] }
            }
          }
        },
        {
          _id: "wfvaubanclass001",
          folder: null,
          name: "Vauban",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/vauban.webp",
          system: {
            description: "Vauban is the model of innovative technology. He deploys clever inventions to provide crowd control. His tenacity and focus make him formidable.",
            progression: vaubanProgTable,
            baseHealth: 270,
            baseShields: 180,
            baseArmor: 160,
            baseEnergy: 175,
            passive: "Technologist's Demolition: Vauban inflicts 25% bonus damage with weapons and abilities against incapacitated enemies. Furthermore, damaging status effects applied to incapacitated targets permanently deal +25% damage.",
            activeMechanic: "Trap Specialist: Vauban's ability save DCs are increased by +2. Additionally, the range of all his abilities is increased by +15 ft.",
            advancements: {
              "adv_vauban_hp_1": { level: 1, type: "HitPoints", health: 270, shields: 180, energy: 175, armor: 160, healthIncrease: 3.45, shieldIncrease: 3.45, energyIncrease: 1.72 },
              "adv_vauban_tr_1": { level: 1, type: "Traits", saves: ["physique", "focus"], skills: ["engineering", "hacking"] },
              "adv_vauban_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.vaubanpassive001",
                  "Compendium.warframe-ttrpg.warframes.vaubanpower00111"
                ]
              },
              "adv_vauban_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanmechanic01"] },
              "adv_vauban_gr_3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00121"] },
              "adv_vauban_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_vauban_gr_5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00131"] },
              "adv_vauban_gr_6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00112"] },
              "adv_vauban_gr_7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_vauban_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_vauban_gr_9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00122"] },
              "adv_vauban_gr_10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00141"] },
              "adv_vauban_gr_11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00132"] },
              "adv_vauban_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_vauban_gr_13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_vauban_gr_14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_vauban_gr_15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00142"] },
              "adv_vauban_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_vauban_gr_17": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00113"] },
              "adv_vauban_gr_18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_vauban_gr_19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00123"] },
              "adv_vauban_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_vauban_gr_21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00133"] },
              "adv_vauban_gr_22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
              "adv_vauban_gr_23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_vauban_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_vauban_gr_25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00143"] },
              "adv_vauban_gr_26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_vauban_gr_27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
              "adv_vauban_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_vauban_gr_29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_vauban_gr_30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubancaps000001"] }
            }
          }
        },
        {
          _id: "wfatlasclass0001",
          folder: null,
          name: "Atlas",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/Atlas.webp",
          system: {
            description: "Enemies tremble before the brawler with fists as hard as stone. Atlas deals high damage. Command terrestrial elements that form the foundation of any battlefield.",
            progression: atlasProgTable,
            baseHealth: 270,
            baseShields: 270,
            baseArmor: 475,
            baseEnergy: 175,
            passive: "Immovable Rock: Atlas is immune to Knockdown effects while on the ground.",
            activeMechanic: "Rubble: Picked up rubble stacks up to 1500 to grant equivalent bonus Armor. Decays by -50 per round.",
            advancements: {
              "adv_atlas_hp_1": { level: 1, type: "HitPoints", health: 270, shields: 270, energy: 175, armor: 475, healthIncrease: 3.45, shieldIncrease: 3.45, energyIncrease: 1.72 },
              "adv_atlas_tr_1": { level: 1, type: "Traits", saves: ["physique", "focus"], skills: ["athletics", "survival"] },
              "adv_atlas_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.atlaspassive0001",
                  "Compendium.warframe-ttrpg.warframes.atlaspower000011"
                ]
              },
              "adv_atlas_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlasrubblemech1"] },
              "adv_atlas_gr_3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000021"] },
              "adv_atlas_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_atlas_gr_5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000031"] },
              "adv_atlas_gr_6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000012"] },
              "adv_atlas_gr_7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_atlas_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_atlas_gr_9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000022"] },
              "adv_atlas_gr_10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000041"] },
              "adv_atlas_gr_11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000032"] },
              "adv_atlas_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_atlas_gr_13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_atlas_gr_14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_atlas_gr_15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000042"] },
              "adv_atlas_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_atlas_gr_17": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000013"] },
              "adv_atlas_gr_18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_atlas_gr_19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000023"] },
              "adv_atlas_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_atlas_gr_21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000033"] },
              "adv_atlas_gr_22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
              "adv_atlas_gr_23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_atlas_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_atlas_gr_25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlaspower000043"] },
              "adv_atlas_gr_26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_atlas_gr_27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
              "adv_atlas_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_atlas_gr_29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_atlas_gr_30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.atlascaps0000001"] }
            }
          }
        },
        {
          _id: "wfurielclass0001",
          folder: null,
          name: "Uriel",
          type: "warframe",
          img: "systems/warframe-ttrpg/asset/classe/Uriel.webp",
          system: {
            description: "L'Hérétique de Xata commande à la Légion des démons. Uriel canalise les flammes sombres, sacrifie la vitalité de ses fiélons pour maudire ses proies et déchaîne l'enfer de Brimstone.",
            progression: urielProgTable,
            baseHealth: 350,
            baseShields: 150,
            baseArmor: 105,
            baseEnergy: 150,
            passive: "Légion : Commande à 3 démons volants (Catenach, Gulphagor, Vythelas) partageant les dégâts et gravant des runes arcaniques.",
            activeMechanic: "Lien Démoniaque : Gère la Fureur de Brimstone (0-100%) et la vitalité des démons. Les démons vaincus sont ramenés à la vie grâce à Remedium.",
            advancements: {
              "adv_uriel_hp_1": { level: 1, type: "HitPoints", health: 350, shields: 150, energy: 150, armor: 105, healthIncrease: 3.448, shieldIncrease: 3.448, energyIncrease: 2.586 },
              "adv_uriel_tr_1": { level: 1, type: "Traits", saves: ["focus", "physique"], skills: ["void", "perception"] },
              "adv_uriel_gr_1": {
                level: 1,
                type: "GrantItems",
                uuids: [
                  "Compendium.warframe-ttrpg.warframes.urielpassive0001",
                  "Compendium.warframe-ttrpg.warframes.urielpower000011"
                ]
              },
              "adv_uriel_gr_2": { level: 2, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urieldemonmech01"] },
              "adv_uriel_gr_3": { level: 3, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000021"] },
              "adv_uriel_asi4": { level: 4, type: "AbilityScoreImprovement", points: 2 },
              "adv_uriel_gr_5": { level: 5, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000031"] },
              "adv_uriel_gr_6": { level: 6, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000012"] },
              "adv_uriel_gr_7": { level: 7, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_uriel_asi8": { level: 8, type: "AbilityScoreImprovement", points: 2 },
              "adv_uriel_gr_9": { level: 9, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000022"] },
              "adv_uriel_gr_10": { level: 10, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000041"] },
              "adv_uriel_gr_11": { level: 11, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000032"] },
              "adv_uriel_asi12": { level: 12, type: "AbilityScoreImprovement", points: 2 },
              "adv_uriel_gr_13": { level: 13, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_uriel_gr_14": { level: 14, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_uriel_gr_15": { level: 15, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000042"] },
              "adv_uriel_asi16": { level: 16, type: "AbilityScoreImprovement", points: 2 },
              "adv_uriel_gr_17": { level: 17, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000013"] },
              "adv_uriel_gr_18": { level: 18, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.speedincrease001"] },
              "adv_uriel_gr_19": { level: 19, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000023"] },
              "adv_uriel_asi20": { level: 20, type: "AbilityScoreImprovement", points: 2 },
              "adv_uriel_gr_21": { level: 21, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000033"] },
              "adv_uriel_gr_22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_uriel_gr_23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
              "adv_uriel_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
              "adv_uriel_gr_25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielpower000043"] },
              "adv_uriel_gr_26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
              "adv_uriel_gr_27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
              "adv_uriel_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
              "adv_uriel_gr_29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
              "adv_uriel_gr_30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.urielcaps0000001"] }
            }
          }
        }
      ];

      const fullDataset = [...featData, ...newWarframeFeats, ...classesData, ...newWarframeClasses];

      try {
        await Item.createDocuments(fullDataset, { pack: "warframe-ttrpg.warframes", keepId: true });
        log(`Successfully populated Warframes & Feats Compendium with ${fullDataset.length} items!`);
        const debugExcal = await pack.getDocument("wfexcaliburclass");
        log(`Debug Excalibur advancements: ${JSON.stringify(debugExcal?.system?.advancements || {})}`);
      } catch (err) {
        logErr("Failed to populate Warframes & Feats Compendium", err);
      } finally {
        await pack.configure({ locked: true });
      }
    }

    // --- POPULATE WEAPONS COMPENDIUM ---
    if (weaponsPack) {
      log("Checking Weapons Compendium population...");
      await weaponsPack.configure({ locked: false });

      const oldWeaponDocs = await weaponsPack.getDocuments();
      const oldWeaponFolders = Array.from(weaponsPack.folders || []);

      const allWeaponFolders = [...primaryWeaponFolders, ...secondaryWeaponFolders, ...meleeWeaponFolders];
      const fullWeaponsDataset = [...primaryWeaponsDataset, ...secondaryWeaponsDataset, ...meleeWeaponsDataset];
      const hasOutdatedWeaponIcons = oldWeaponDocs.some(d => d.img && d.img.includes("Element icon"));
      const hasOrphanedWeapons = oldWeaponDocs.some(d => !d.folder || !weaponsPack.folders.has(d.folder));
      const isWeaponsFrench = oldWeaponFolders.some(f => f.name === "Armes Principales");
      const hasEnglishWeaponDesc = oldWeaponDocs.some(d => d.system?.description?.includes("Stance Recommendation:") || d.system?.description?.includes("The traditional single-edged") || d.system?.description?.includes("Alt-Fire ("));
      const hasWrongCount = oldWeaponDocs.length !== fullWeaponsDataset.length || oldWeaponFolders.length !== allWeaponFolders.length || !isWeaponsFrench || hasEnglishWeaponDesc;

      if (hasOrphanedWeapons && oldWeaponDocs.length === fullWeaponsDataset.length && oldWeaponFolders.length === allWeaponFolders.length && !hasOutdatedWeaponIcons) {
        log("Orphaned weapons detected with complete count. Updating weapon folders in-place...");
        const folderMap = new Map(fullWeaponsDataset.map(w => [w._id, w.folder]));
        const updates = [];
        for (let doc of oldWeaponDocs) {
          const correctFolder = folderMap.get(doc.id);
          if (correctFolder && doc.folder !== correctFolder) {
            updates.push({ _id: doc.id, folder: correctFolder });
          }
        }
        if (updates.length > 0) {
          log(`Updating ${updates.length} weapons with correct folder IDs...`);
          try {
            await Item.updateDocuments(updates, { pack: "warframe-ttrpg.weapons" });
            log(`Successfully moved ${updates.length} weapons into their compendium folders!`);
          } catch (err) {
            logErr("Failed in-place update, falling back to full re-seed", err);
          }
        }
      } else if (hasOrphanedWeapons || hasWrongCount || hasOutdatedWeaponIcons || oldWeaponDocs.length < 300) {
        log(`Seeding/updating Weapons Compendium (found ${oldWeaponDocs.length}/${fullWeaponsDataset.length} weapons, ${oldWeaponFolders.length}/${allWeaponFolders.length} folders, orphaned=${hasOrphanedWeapons})...`);

        // Wipe old weapon items via batch deletion
        try {
          const docIds = oldWeaponDocs.map(d => d.id).filter(Boolean);
          if (docIds.length > 0) {
            await Item.deleteDocuments(docIds, { pack: "warframe-ttrpg.weapons" });
            log(`Batch deleted ${docIds.length} weapon items.`);
          }
        } catch (e) {
          logErr("Batch weapon deletion failed, falling back to individual deletion", e);
          for (let doc of oldWeaponDocs) {
            try {
              if (doc && doc.id) await doc.delete();
            } catch (err) {}
          }
        }

        // Wipe old weapon folders via batch deletion
        try {
          const folderIds = oldWeaponFolders.map(f => f.id).filter(Boolean);
          if (folderIds.length > 0) {
            await Folder.deleteDocuments(folderIds, { pack: "warframe-ttrpg.weapons" });
            log(`Batch deleted ${folderIds.length} weapon folders.`);
          }
        } catch (e) {
          logErr("Batch folder deletion failed, falling back to individual deletion", e);
          for (let f of oldWeaponFolders) {
            try {
              if (f && f.id) await f.delete();
            } catch (err) {}
          }
        }

        // Create category folders
        try {
          await Folder.createDocuments(allWeaponFolders, { pack: "warframe-ttrpg.weapons", keepId: true });
          log(`Created ${allWeaponFolders.length} weapon compendium folders successfully.`);
        } catch (err) {
          logErr("Failed to create weapon compendium folders", err);
        }

        try {
          await Item.createDocuments(fullWeaponsDataset, { pack: "warframe-ttrpg.weapons", keepId: true });
          log(`Successfully populated Weapons Compendium with ${fullWeaponsDataset.length} weapons across ${allWeaponFolders.length} folders!`);
        } catch (err) {
          logErr("Failed to populate Weapons Compendium", err);
        }
      } else {
        log(`Weapons Compendium already populated (${oldWeaponDocs.length} weapons, ${oldWeaponFolders.length} folders). Skipping seeding.`);
      }

      await weaponsPack.configure({ locked: true });
    }

    // --- SEED MODS COMPENDIUM PACK ---
    const modsPack = game.packs.get("warframe-ttrpg.mods");
    if (modsPack) {
      log("Found mods compendium pack. Checking population...");
      await modsPack.configure({ locked: false });
      const oldModDocs = await modsPack.getDocuments();
      const oldModFolders = Array.from(modsPack.folders || []);
      const hasOutdatedModIcons = oldModDocs.some(d => d.img && d.img.startsWith("icons/svg/"));
      const hasEnglishModDesc = oldModDocs.some(d => d.system?.description && (
        d.system.description.includes("Squad members regenerate") ||
        d.system.description.includes("Increases squad") ||
        d.system.description.includes("Increases base rifle") ||
        d.system.description.includes("Increases base shotgun") ||
        d.system.description.includes("Increases base secondary") ||
        d.system.description.includes("Increases base melee") ||
        d.system.description.includes("Grants +") ||
        d.system.description.includes("Reduces enemy") ||
        d.system.description.includes("Orokin Masterwork:")
      ));
      if (oldModDocs.length < 241 || oldModFolders.length < 15 || hasOutdatedModIcons || hasEnglishModDesc) {
        log(`Seeding/updating Mods compendium (found ${oldModDocs.length} mods, ${oldModFolders.length} folders)...`);
        for (let doc of oldModDocs) {
          try { if (doc) await doc.delete(); } catch (e) { logErr(`Failed to delete mod doc ${doc?.name || doc?.id}`, e); }
        }
        for (let f of oldModFolders) {
          try { if (f) await f.delete(); } catch (e) { logErr(`Failed to delete mod folder ${f?.name || f?.id}`, e); }
        }
        const modFoldersData = [
          ...warframeModFolders,
          ...weaponModFolders
        ];
        try {
          await Folder.createDocuments(modFoldersData, { pack: "warframe-ttrpg.mods", keepId: true });
          log("Created mod compendium folders successfully.");
        } catch (err) { logErr("Failed to create mod compendium folders", err); }

        const fullModsDataset = [
          ...warframeModsDataset,
          ...weaponModsDataset
        ];
        try {
          await Item.createDocuments(fullModsDataset, { pack: "warframe-ttrpg.mods", keepId: true });
          log(`Successfully populated Mods Compendium with ${fullModsDataset.length} canonical Warframe and Weapon mods!`);
        } catch (err) { logErr("Failed to populate Mods Compendium", err); }
        finally { await modsPack.configure({ locked: true }); }
      }
    }

    // --- WORLD ITEMS CLEANUP & SYNC ROUTINE ---
    try {
      const syncData = {
        Excalibur: {
          description: "Excalibur est le maître incontesté des lames, alliant attaque et défense dans un profil parfaitement équilibré. Il excelle au corps-à-corps à l'épée et possède une agilité fulgurante.",
          progression: excalProgTable
        },
        Volt: {
          description: "Volt est un maître des tempêtes électriques. Hautement mobile, il confère des bonus de vitesse et des boucliers énergétiques à ses alliés tout en électrocutant des escouades entières d'ennemis par des décharges en chaîne.",
          progression: voltProgTable
        },
        Mag: {
          description: "Mag est la maîtresse absolue des forces magnétiques. Elle manipule le placement des ennemis, arrache les boucliers et armures adverses, et redirige les projectiles ennemis dans des vortex gravitationnels destructeurs.",
          progression: magProgTable
        },
        Koumei: {
          description: "Koumei est la Tisseuse de Destins, manipulant les fils du hasard et de la probabilité pour assurer la victoire. Elle joue avec la chance, déclenchant des effets aléatoires et utilisant des charmes sacrés pour triompher.",
          progression: koumeiProgTable
        },
        Nokko: {
          description: "Nokko est un protecteur fongique mystique qui fait germer des spores magiques pour contrôler le champ de bataille. Il régénère l'énergie de ses alliés et se métamorphose en Sporillon invulnérable pour se réanimer.",
          progression: nokkoProgTable
        },
        Valkyr: {
          description: "Torturée et forgée en une tueuse d'une férocité absolue. Valkyr excelle dans l'annihilation au corps-à-corps et la survie pure. Son cri de guerre glace le sang de tous ses ennemis.",
          progression: valkyrProgTable
        },
        Ash: {
          description: "Admirez le saint patron de l'école d'assassinat politique des Orokins. Ash règne en maître sur la furtivité. Le fil de sa lame est ressenti bien avant d'être aperçu.",
          progression: ashProgTable
        },
        Vauban: {
          description: "Vauban incarne l'ingénierie tactique et la technologie de pointe. Il déploie des inventions sophistiquées et des bastilles électrifiées pour neutraliser méthodiquement toute menace.",
          progression: vaubanProgTable
        },
        Atlas: {
          description: "Les ennemis tremblent devant ce colosse aux poings d'acier et de pierre. Atlas inflige des frappes titanesques et commande aux éléments terrestres qui forment le socle du champ de bataille.",
          progression: atlasProgTable
        },
        Uriel: {
          description: "L'Hérétique de Xata commande à la Légion des démons. Uriel canalise les flammes sombres, sacrifie la vitalité de ses fiélons pour maudire ses proies et déchaîne l'enfer de Brimstone.",
          progression: urielProgTable
        },
        ...newWarframeSyncData
      };

      // 1. Clean up duplicate warframe items in world items sidebar
      const seenFrames = new Set();
      for (let item of game.items) {
        if (item.type === "warframe") {
          const nameClean = item.name?.trim().toLowerCase();
          if (nameClean === "volt" && item.id !== "wfvoltclass00002") {
            log(`Explicitly deleting duplicate Volt world item: ${item.name} (${item.id})`);
            await item.delete();
          } else if (seenFrames.has(item.name)) {
            log(`Deleting duplicate world warframe class: ${item.name} (${item.id})`);
            await item.delete();
          } else {
            seenFrames.add(item.name);
          }
        }
      }

      // Clean up duplicate Volt and sync updated documents in the warframe compendium pack
      try {
        await pack.configure({ locked: false });
        let compDocs = await pack.getDocuments();
        for (let cDoc of compDocs) {
          const cNameClean = cDoc.name?.trim().toLowerCase();
          if (cDoc.type === "warframe" && cNameClean === "volt" && (cDoc.id !== "wfvoltclass00002" || cDoc.img?.includes("lightning.svg"))) {
            log(`Explicitly deleting duplicate Volt compendium item: ${cDoc.name} (${cDoc.id})`);
            try { await cDoc.delete(); } catch (e) {}
          }
        }

        // Refresh documents after deletion
        compDocs = await pack.getDocuments();
        const compMap = new Map(compDocs.map(d => [d.id, d]));

        // In-place sync updated Warframe classes
        const classUpdates = [];
        const missingClasses = [];
        for (let cls of newWarframeClasses) {
          const doc = compMap.get(cls._id);
          if (doc) {
            const needsUpdate = doc.system?.passive !== cls.system?.passive ||
                                doc.system?.activeMechanic !== cls.system?.activeMechanic ||
                                doc.system?.progression !== cls.system?.progression ||
                                doc.system?.description !== cls.system?.description;
            if (needsUpdate) {
              classUpdates.push({
                _id: cls._id,
                "system.passive": cls.system.passive,
                "system.activeMechanic": cls.system.activeMechanic,
                "system.progression": cls.system.progression,
                "system.description": cls.system.description
              });
            }
          } else {
            missingClasses.push(cls);
          }
        }
        if (classUpdates.length > 0) {
          await Item.updateDocuments(classUpdates, { pack: "warframe-ttrpg.warframes" });
          log(`Updated ${classUpdates.length} warframe classes in compendium with latest passives and progressions.`);
        }
        if (missingClasses.length > 0) {
          await Item.createDocuments(missingClasses, { pack: "warframe-ttrpg.warframes", keepId: true });
          log(`Created ${missingClasses.length} missing warframe classes in compendium.`);
        }

        // In-place sync updated Warframe abilities/feats
        const featUpdates = [];
        const missingFeats = [];
        for (let feat of newWarframeFeats) {
          const doc = compMap.get(feat._id);
          if (doc) {
            const descChanged = doc.system?.description !== feat.system?.description;
            const dmgChanged = feat.system?.damage !== undefined && doc.system?.damage !== feat.system?.damage;
            const dmgTypeChanged = feat.system?.damageType !== undefined && doc.system?.damageType !== feat.system?.damageType;
            if (descChanged || dmgChanged || dmgTypeChanged) {
              const upd = { _id: feat._id };
              if (descChanged) upd["system.description"] = feat.system.description;
              if (dmgChanged) upd["system.damage"] = feat.system.damage;
              if (dmgTypeChanged) upd["system.damageType"] = feat.system.damageType;
              featUpdates.push(upd);
            }
          } else {
            missingFeats.push(feat);
          }
        }
        if (featUpdates.length > 0) {
          await Item.updateDocuments(featUpdates, { pack: "warframe-ttrpg.warframes" });
          log(`Updated ${featUpdates.length} abilities/feats in compendium with latest descriptions and damage.`);
        }
        if (missingFeats.length > 0) {
          await Item.createDocuments(missingFeats, { pack: "warframe-ttrpg.warframes", keepId: true });
          log(`Created ${missingFeats.length} missing feats in compendium.`);
        }

        await pack.configure({ locked: true });
      } catch (err) {
        logErr("Failed to sync warframes compendium pack", err);
      }

      // 2. Sync world items
      const compendiumItems = await pack.getDocuments();
      for (let item of game.items) {
        if (item.type === "warframe") {
          const match = syncData[item.name];
          const compMatch = compendiumItems.find(f => f.type === "warframe" && f.name === item.name);
          if (match) {
            const updateObj = {
              "img": match.img,
              "system.progression": match.progression,
              "system.description": match.description
            };
            if (compMatch) {
              updateObj["system.advancements"] = compMatch.system.advancements;
              if (compMatch.system?.passive) updateObj["system.passive"] = compMatch.system.passive;
              if (compMatch.system?.activeMechanic) updateObj["system.activeMechanic"] = compMatch.system.activeMechanic;
            }
            await item.update(updateObj);
            log(`Auto-synced world item ${item.name} image, description, progression & advancements.`);
          }
        }
      }

      // 3. Sync actor sheet warframe items
      for (let actor of game.actors) {
        for (let item of actor.items) {
          if (item.type === "warframe") {
            const match = syncData[item.name];
            const compMatch = compendiumItems.find(f => f.type === "warframe" && f.name === item.name);
            if (match) {
              const updateObj = {
                "img": match.img,
                "system.progression": match.progression,
                "system.description": match.description
              };
              if (compMatch) {
                updateObj["system.advancements"] = compMatch.system.advancements;
                if (compMatch.system?.passive) updateObj["system.passive"] = compMatch.system.passive;
                if (compMatch.system?.activeMechanic) updateObj["system.activeMechanic"] = compMatch.system.activeMechanic;
              }
              await item.update(updateObj);
              if (item.name === "Follie" && actor.img && (actor.img.includes("Follie") || actor.img.includes("mystery-man"))) {
                await actor.update({ img: match.img, "prototypeToken.texture.src": match.img });
              }
              log(`Auto-synced actor item ${item.name} for ${actor.name} image, description, progression & advancements.`);
              try {
                await actor.checkAndGrantAdvancements();
              } catch (e) {
                logErr(`Failed to run checkAndGrantAdvancements for ${actor.name}`, e);
              }
            }
          }
        }
      }

      // 3b. Sync world abilities/features
      for (let item of game.items) {
        if (item.type === "ability") {
          const match = compendiumItems.find(f => f.id === item.id || f.name === item.name);
          if (match) {
            const upd = {
              "img": match.img,
              "system.description": match.system?.description
            };
            if (match.system?.damage !== undefined) upd["system.damage"] = match.system.damage;
            if (match.system?.damageType !== undefined) upd["system.damageType"] = match.system.damageType;
            await item.update(upd);
            log(`Auto-synced world ability ${item.name} image & description.`);
          }
        }
      }

      // 3c. Sync actor sheet abilities/features
      for (let actor of game.actors) {
        for (let item of actor.items) {
          if (item.type === "ability") {
            const match = compendiumItems.find(f => f.id === item.id || f.name === item.name);
            if (match) {
              const upd = {
                "img": match.img,
                "system.description": match.system?.description
              };
              if (match.system?.damage !== undefined) upd["system.damage"] = match.system.damage;
              if (match.system?.damageType !== undefined) upd["system.damageType"] = match.system.damageType;
              await item.update(upd);
              log(`Auto-synced actor ability ${item.name} for ${actor.name} image & description.`);
            }
          }
        }
      }

      // 3d. Migrate old Active Mechanic / Ability instances on actors
      for (let actor of game.actors) {
        const itemsToDelete = [];
        let hasOldVaubanMechanic = false;
        let hasOldAshMechanic = false;

        for (let item of actor.items) {
          if (item.type === "ability") {
            if (item.name === "Innovative Technology (Active Mechanic)" || item.name === "Trap Specialist (Active Mechanic)") {
              itemsToDelete.push(item.id);
              hasOldVaubanMechanic = true;
            }
            if (item.name === "Ninja Prowess (Active Mechanic)") {
              itemsToDelete.push(item.id);
              hasOldAshMechanic = true;
            }
            if (item.name.endsWith(" IV")) {
              itemsToDelete.push(item.id);
            }
          }
        }

        if (itemsToDelete.length > 0) {
          await actor.deleteEmbeddedDocuments("Item", itemsToDelete);
          log(`Deleted old abilities/mechanics on ${actor.name}: ${itemsToDelete.join(", ")}`);
        }

        if (hasOldVaubanMechanic) {
          const freshMech = compendiumItems.find(f => f.id === "vaubanmechanic01");
          if (freshMech) {
            await actor.createEmbeddedDocuments("Item", [freshMech.toObject()]);
            log(`Added fresh Trap Specialist (Passive Mechanic) to ${actor.name}`);
          }
        }
        if (hasOldAshMechanic) {
          const freshMech = compendiumItems.find(f => f.id === "ashmechanic00001");
          if (freshMech) {
            await actor.createEmbeddedDocuments("Item", [freshMech.toObject()]);
            log(`Added fresh Ninja Prowess (Passive Mechanic) to ${actor.name}`);
          }
        }
      }

      // 3e. Focus nodes: actors retain their exact unlocked state without forced auto-granting on refresh

      // 4. Clean up / delete all Warframe classes and ability items/folders from the World Items sidebar
      const foldersToDeleteNames = ["Atlas", "Ash", "Excalibur", "Koumei", "Mag", "Nokko", "Valkyr", "Vauban", "Volt", "Warframe (Class)", "Warframes", "Ability / Power", "Ability/Power"];

      // Find folders to delete
      const foldersToDelete = game.folders.filter(f => f.type === "Item" && foldersToDeleteNames.includes(f.name));
      const folderIds = foldersToDelete.map(f => f.id);

      // Find items to delete:
      // - any item of type "warframe"
      // - any item of type "ability" that is in one of the deleted folders, or whose name matches one of the compendium items
      const itemsToDeleteIds = [];
      for (let item of game.items) {
        if (item.type === "warframe") {
          itemsToDeleteIds.push(item.id);
        } else if (item.type === "ability") {
          if (item.folder && folderIds.includes(item.folder.id)) {
            itemsToDeleteIds.push(item.id);
          } else {
            const isCompMatch = compendiumItems.some(f => f.name === item.name);
            if (isCompMatch) {
              itemsToDeleteIds.push(item.id);
            }
          }
        }
      }

      if (itemsToDeleteIds.length > 0) {
        for (let itemId of itemsToDeleteIds) {
          const item = game.items.get(itemId);
          if (item) {
            await item.delete();
            log(`Deleted world sidebar item: ${item.name} (${item.id})`);
          }
        }
      }

      if (foldersToDelete.length > 0) {
        for (let folder of foldersToDelete) {
          await folder.delete();
          log(`Deleted world sidebar folder: ${folder.name} (${folder.id})`);
        }
      }

      // 5. Ensure Amanata & Higasa are created in World Items sidebar
      let weaponDocs = [];
      if (weaponsPack) {
        weaponDocs = await weaponsPack.getDocuments();
      }

      const hasWorldAmanata = game.items.some(i => i.name === "Amanata" && i.type === "weapon");
      const compAmanata = weaponDocs.find(i => (i.id === "amanata000000001" || i.name === "Amanata") && i.type === "weapon") ||
                          compendiumItems.find(i => (i.id === "amanata000000001" || i.name === "Amanata") && i.type === "weapon");
      if (!hasWorldAmanata && compAmanata) {
        await Item.create(compAmanata.toObject());
        log("Auto-created Amanata in World Items sidebar.");
      }

      const hasWorldHigasa = game.items.some(i => i.name === "Higasa" && i.type === "weapon");
      const compHigasa = weaponDocs.find(i => (i.id === "higasa0000000001" || i.name === "Higasa") && i.type === "weapon") ||
                         compendiumItems.find(i => (i.id === "higasa0000000001" || i.name === "Higasa") && i.type === "weapon");
      if (!hasWorldHigasa && compHigasa) {
        await Item.create(compHigasa.toObject());
        log("Auto-created Higasa in World Items sidebar.");
      }

      const hasWorldVinquibus = game.items.some(i => (i.name === "Vinquibus" || i.id === "vinquibusprim001") && i.type === "weapon");
      const compVinquibus = weaponDocs.find(i => (i.id === "vinquibusprim001" || i.name === "Vinquibus") && i.type === "weapon") ||
                            compendiumItems.find(i => (i.id === "vinquibusprim001" || i.name === "Vinquibus") && i.type === "weapon");
      if (!hasWorldVinquibus && compVinquibus) {
        await Item.create(compVinquibus.toObject());
        log("Auto-created Vinquibus in World Items sidebar.");
      }

      const hasWorldDualKamas = game.items.some(i => (i.name === "Dual Kamas" || i.id === "dualkamas0000001") && i.type === "weapon");
      const compDualKamas = weaponDocs.find(i => (i.id === "dualkamas0000001" || i.name === "Dual Kamas") && i.type === "weapon") ||
                            compendiumItems.find(i => (i.id === "dualkamas0000001" || i.name === "Dual Kamas") && i.type === "weapon");
      if (!hasWorldDualKamas && compDualKamas) {
        await Item.create(compDualKamas.toObject());
        log("Auto-created Dual Kamas in World Items sidebar.");
      }

      const hasWorldAX52 = game.items.some(i => (i.name === "AX-52" || i.id === "ax52primary00001") && i.type === "weapon");
      const compAX52 = weaponDocs.find(i => (i.id === "ax52primary00001" || i.name === "AX-52") && i.type === "weapon") ||
                       compendiumItems.find(i => (i.id === "ax52primary00001" || i.name === "AX-52") && i.type === "weapon");
      if (!hasWorldAX52 && compAX52) {
        await Item.create(compAX52.toObject());
        log("Auto-created AX-52 in World Items sidebar.");
      }

      const hasWorldEpitaph = game.items.some(i => (i.name === "Epitaph" || i.id === "wpsecepitaph0001") && i.type === "weapon");
      const compEpitaph = weaponDocs.find(i => (i.id === "wpsecepitaph0001" || i.name === "Epitaph") && i.type === "weapon") ||
                          compendiumItems.find(i => (i.id === "wpsecepitaph0001" || i.name === "Epitaph") && i.type === "weapon");
      if (!hasWorldEpitaph && compEpitaph) {
        await Item.create(compEpitaph.toObject());
        log("Auto-created Epitaph in World Items sidebar.");
      }

      // 6. Give signature weapons to Koumei (Amanata & Higasa), Uriel (Vinquibus), Excalibur/Arthur (AX-52), and Sevagoth (Epitaph)
      for (let actor of game.actors) {
        const isKoumeiActor = actor.system.details?.frameClass === "Koumei" || actor.items.some(i => i.type === "warframe" && i.name === "Koumei");
        if (isKoumeiActor) {
          const itemsToCreate = [];
          if (compAmanata && !actor.items.some(i => i.name === "Amanata" && i.type === "weapon")) {
            const amanataObj = compAmanata.toObject();
            amanataObj.system.equipped = true;
            itemsToCreate.push(amanataObj);
          }
          if (compHigasa && !actor.items.some(i => i.name === "Higasa" && i.type === "weapon")) {
            const higasaObj = compHigasa.toObject();
            higasaObj.system.equipped = true;
            itemsToCreate.push(higasaObj);
          }
          if (itemsToCreate.length > 0) {
            await actor.createEmbeddedDocuments("Item", itemsToCreate);
            log(`Auto-granted signature weapon(s) (${itemsToCreate.map(i => i.name).join(", ")}) to Koumei actor: ${actor.name}`);
          }
        }

        const isUrielActor = actor.system.details?.frameClass === "Uriel" || actor.items.some(i => i.type === "warframe" && i.name === "Uriel");
        if (isUrielActor) {
          if (compVinquibus && !actor.items.some(i => (i.name === "Vinquibus" || i.id === "vinquibusprim001") && i.type === "weapon")) {
            const vinquibusObj = compVinquibus.toObject();
            vinquibusObj.system.equipped = true;
            await actor.createEmbeddedDocuments("Item", [vinquibusObj]);
            log(`Auto-granted signature weapon (Vinquibus) to Uriel actor: ${actor.name}`);
          }
        }

        const isArthurOrExcal = actor.system.details?.frameClass === "Excalibur" || actor.items.some(i => i.type === "warframe" && (i.name === "Excalibur" || i.name === "Arthur"));
        if (isArthurOrExcal) {
          if (compAX52 && !actor.items.some(i => (i.name === "AX-52" || i.id === "ax52primary00001") && i.type === "weapon")) {
            const ax52Obj = compAX52.toObject();
            ax52Obj.system.equipped = true;
            await actor.createEmbeddedDocuments("Item", [ax52Obj]);
            log(`Auto-granted signature weapon (AX-52) to Excalibur/Arthur actor: ${actor.name}`);
          }
        }

        const isSevagothActor = actor.system.details?.frameClass === "Sevagoth" || actor.items.some(i => i.type === "warframe" && (i.name === "Sevagoth" || i.name?.toLowerCase().includes("sevagoth")));
        if (isSevagothActor) {
          if (compEpitaph && !actor.items.some(i => (i.name === "Epitaph" || i.id === "wpsecepitaph0001") && i.type === "weapon")) {
            const epitaphObj = compEpitaph.toObject();
            epitaphObj.system.equipped = true;
            await actor.createEmbeddedDocuments("Item", [epitaphObj]);
            log(`Auto-granted signature weapon (Epitaph) to Sevagoth actor: ${actor.name}`);
          }
        }
      }

      // 6b. Auto-repair and restore abilities for any Warframe actors with missing abilities or broken advancements
      for (let actor of game.actors) {
        if (actor.type === "warframe") {
          const equippedFrame = actor.items.find(i => i.type === "warframe");
          if (equippedFrame) {
            const abilitiesCount = actor.items.filter(i => i.type === "ability").length;
            const advStr = JSON.stringify(equippedFrame.system?.advancements || {});
            const hasBrokenAdv = advStr.includes("urielpassive000001") ||
                                 advStr.includes("urielpower0000001") ||
                                 advStr.includes("vaubanpower00011") ||
                                 Object.keys(equippedFrame.system?.advancements || {}).length < 5;
            if (abilitiesCount === 0 || hasBrokenAdv) {
              log(`Auto-restoring abilities for actor: ${actor.name} (${equippedFrame.name})...`);
              try {
                await actor.checkAndGrantAdvancements(equippedFrame);
              } catch (err) {
                logErr(`Failed to auto-restore abilities for ${actor.name}:`, err);
              }
            }
          }
        }
      }
      let upgFolder = game.folders.find(f => f.type === "Item" && (f.id === "upgsuperchargers" || f.name === "Upgrades & Superchargers"));
      if (!upgFolder) {
        try {
          upgFolder = await Folder.create(superchargerFolder, { keepId: true });
          log("Created Upgrades & Superchargers folder in World Items sidebar.");
        } catch (e) {
          logErr("Could not create Upgrades folder", e);
        }
      }

      for (let upg of superchargersDataset) {
        const existing = game.items.find(i => (i.id === upg._id || i.name === upg.name) && i.type === "consumable");
        if (!existing) {
          try {
            await Item.create({ ...upg, folder: upgFolder?.id || "upgsuperchargers" }, { keepId: true });
            log(`Auto-created upgrade item in World Items sidebar: ${upg.name}`);
          } catch (e) {
            logErr(`Failed to create upgrade item ${upg.name}`, e);
          }
        } else {
          // Sync image, folder, and description if needed
          const updates = {};
          if (existing.img !== upg.img) updates.img = upg.img;
          if (!existing.folder && upgFolder) updates.folder = upgFolder.id;
          if (Object.keys(updates).length > 0) {
            await existing.update(updates);
          }
        }
      }

      // 8. Sanitize existing slotted stance mods on all weapons in game.items and actor.items
      const allWeapons = [
        ...Array.from(game.items).filter(i => i.type === "weapon"),
        ...Array.from(game.actors).flatMap(a => Array.from(a.items).filter(i => i.type === "weapon"))
      ];
      for (let w of allWeapons) {
        const stanceMod = w.system?.modSlots?.stance?.mod;
        if (stanceMod) {
          const drain = Number(stanceMod.system?.drain || stanceMod.drain) || 0;
          if (drain === 0) {
            log(`Sanitizing 0-drain stance mod ${stanceMod.name} on weapon ${w.name}`);
            await w.update({
              "system.modSlots.stance.mod.system.drain": 10,
              "system.modSlots.stance.mod.drain": 10
            });
          }
        }
      }

      // 9. Auto-sync canonical images and French descriptions for all mods & weapons across world items and actor items
      const allModsMigration = {"wfmodaura0000001":{"id":"wfmodaura0000001","name":"Siphon d'Énergie","oldName":"Energy Siphon","desc":"<p>Les membres de l'escouade régénèrent <strong>+3 points d'Énergie par round</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnergySiphon.png"},"energy siphon":{"id":"wfmodaura0000001","name":"Siphon d'Énergie","oldName":"Energy Siphon","desc":"<p>Les membres de l'escouade régénèrent <strong>+3 points d'Énergie par round</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnergySiphon.png"},"siphon d'énergie":{"id":"wfmodaura0000001","name":"Siphon d'Énergie","oldName":"Energy Siphon","desc":"<p>Les membres de l'escouade régénèrent <strong>+3 points d'Énergie par round</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnergySiphon.png"},"wfmodaura0000002":{"id":"wfmodaura0000002","name":"Charge d'Acier","oldName":"Steel Charge","desc":"<p>Augmente les dégâts des attaques de Mêlée de l'escouade de <strong>+60%</strong>. Confère un énorme bonus de <strong>+18 de Capacité de Mods</strong> lorsque la polarité correspond !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SteelCharge.png"},"steel charge":{"id":"wfmodaura0000002","name":"Charge d'Acier","oldName":"Steel Charge","desc":"<p>Augmente les dégâts des attaques de Mêlée de l'escouade de <strong>+60%</strong>. Confère un énorme bonus de <strong>+18 de Capacité de Mods</strong> lorsque la polarité correspond !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SteelCharge.png"},"charge d'acier":{"id":"wfmodaura0000002","name":"Charge d'Acier","oldName":"Steel Charge","desc":"<p>Augmente les dégâts des attaques de Mêlée de l'escouade de <strong>+60%</strong>. Confère un énorme bonus de <strong>+18 de Capacité de Mods</strong> lorsque la polarité correspond !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SteelCharge.png"},"wfmodaura0000003":{"id":"wfmodaura0000003","name":"Projection Corrosive","oldName":"Corrosive Projection","desc":"<p>Réduit l'Armure ennemie de <strong>-18%</strong> sur l'ensemble du champ de bataille.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CorrosiveProjection.png"},"corrosive projection":{"id":"wfmodaura0000003","name":"Projection Corrosive","oldName":"Corrosive Projection","desc":"<p>Réduit l'Armure ennemie de <strong>-18%</strong> sur l'ensemble du champ de bataille.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CorrosiveProjection.png"},"projection corrosive":{"id":"wfmodaura0000003","name":"Projection Corrosive","oldName":"Corrosive Projection","desc":"<p>Réduit l'Armure ennemie de <strong>-18%</strong> sur l'ensemble du champ de bataille.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CorrosiveProjection.png"},"wfmodaura0000004":{"id":"wfmodaura0000004","name":"Perturbation de Bouclier","oldName":"Shield Disruption","desc":"<p>Réduit les Boucliers Max ennemis de <strong>-18%</strong> sur l'ensemble du champ de bataille.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ShieldDisruption.png"},"shield disruption":{"id":"wfmodaura0000004","name":"Perturbation de Bouclier","oldName":"Shield Disruption","desc":"<p>Réduit les Boucliers Max ennemis de <strong>-18%</strong> sur l'ensemble du champ de bataille.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ShieldDisruption.png"},"perturbation de bouclier":{"id":"wfmodaura0000004","name":"Perturbation de Bouclier","oldName":"Shield Disruption","desc":"<p>Réduit les Boucliers Max ennemis de <strong>-18%</strong> sur l'ensemble du champ de bataille.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ShieldDisruption.png"},"wfmodaura0000005":{"id":"wfmodaura0000005","name":"Physique","oldName":"Physique","desc":"<p>Augmente la Santé Max de l'escouade de <strong>+90 PV</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Physique.png"},"physique":{"id":"wfmodaura0000005","name":"Physique","oldName":"Physique","desc":"<p>Augmente la Santé Max de l'escouade de <strong>+90 PV</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Physique.png"},"wfmodaura0000006":{"id":"wfmodaura0000006","name":"Rajeunissement","oldName":"Rejuvenation","desc":"<p>Les membres de l'escouade régénèrent <strong>+3 points de Santé par round</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Rejuvenation.png"},"rejuvenation":{"id":"wfmodaura0000006","name":"Rajeunissement","oldName":"Rejuvenation","desc":"<p>Les membres de l'escouade régénèrent <strong>+3 points de Santé par round</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Rejuvenation.png"},"rajeunissement":{"id":"wfmodaura0000006","name":"Rajeunissement","oldName":"Rejuvenation","desc":"<p>Les membres de l'escouade régénèrent <strong>+3 points de Santé par round</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Rejuvenation.png"},"wfmodaura0000007":{"id":"wfmodaura0000007","name":"Boost de Vitesse","oldName":"Sprint Boost","desc":"<p>Augmente la Vitesse de Déplacement de l'escouade de <strong>+15% (+5 ft)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SprintBoost.png"},"sprint boost":{"id":"wfmodaura0000007","name":"Boost de Vitesse","oldName":"Sprint Boost","desc":"<p>Augmente la Vitesse de Déplacement de l'escouade de <strong>+15% (+5 ft)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SprintBoost.png"},"boost de vitesse":{"id":"wfmodaura0000007","name":"Boost de Vitesse","oldName":"Sprint Boost","desc":"<p>Augmente la Vitesse de Déplacement de l'escouade de <strong>+15% (+5 ft)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SprintBoost.png"},"wfmodaura0000008":{"id":"wfmodaura0000008","name":"Amplificateur de Fusil","oldName":"Rifle Amp","desc":"<p>Augmente les dégâts des attaques au Fusil Principal de l'escouade de <strong>+27%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/RifleAmp.png"},"rifle amp":{"id":"wfmodaura0000008","name":"Amplificateur de Fusil","oldName":"Rifle Amp","desc":"<p>Augmente les dégâts des attaques au Fusil Principal de l'escouade de <strong>+27%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/RifleAmp.png"},"amplificateur de fusil":{"id":"wfmodaura0000008","name":"Amplificateur de Fusil","oldName":"Rifle Amp","desc":"<p>Augmente les dégâts des attaques au Fusil Principal de l'escouade de <strong>+27%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/RifleAmp.png"},"wfmodaura0000009":{"id":"wfmodaura0000009","name":"Amplificateur de Pistolet","oldName":"Pistol Amp","desc":"<p>Augmente les dégâts des attaques au Pistolet Secondaire de l'escouade de <strong>+27%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PistolAmp.png"},"pistol amp":{"id":"wfmodaura0000009","name":"Amplificateur de Pistolet","oldName":"Pistol Amp","desc":"<p>Augmente les dégâts des attaques au Pistolet Secondaire de l'escouade de <strong>+27%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PistolAmp.png"},"amplificateur de pistolet":{"id":"wfmodaura0000009","name":"Amplificateur de Pistolet","oldName":"Pistol Amp","desc":"<p>Augmente les dégâts des attaques au Pistolet Secondaire de l'escouade de <strong>+27%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PistolAmp.png"},"wfmodaura0000010":{"id":"wfmodaura0000010","name":"Tir Mortel","oldName":"Dead Eye","desc":"<p>Augmente les dégâts des attaques au Fusil de Précision de l'escouade de <strong>+52,5%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/DeadEye.png"},"dead eye":{"id":"wfmodaura0000010","name":"Tir Mortel","oldName":"Dead Eye","desc":"<p>Augmente les dégâts des attaques au Fusil de Précision de l'escouade de <strong>+52,5%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/DeadEye.png"},"tir mortel":{"id":"wfmodaura0000010","name":"Tir Mortel","oldName":"Dead Eye","desc":"<p>Augmente les dégâts des attaques au Fusil de Précision de l'escouade de <strong>+52,5%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/DeadEye.png"},"wfmodaura0000011":{"id":"wfmodaura0000011","name":"Récupérateur de Fusil à Pompe","oldName":"Shotgun Scavenger","desc":"<p>Augmente la quantité de munitions de fusil à pompe trouvées et récupérées de <strong>+100%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ShotgunScavenger.png"},"shotgun scavenger":{"id":"wfmodaura0000011","name":"Récupérateur de Fusil à Pompe","oldName":"Shotgun Scavenger","desc":"<p>Augmente la quantité de munitions de fusil à pompe trouvées et récupérées de <strong>+100%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ShotgunScavenger.png"},"récupérateur de fusil à pompe":{"id":"wfmodaura0000011","name":"Récupérateur de Fusil à Pompe","oldName":"Shotgun Scavenger","desc":"<p>Augmente la quantité de munitions de fusil à pompe trouvées et récupérées de <strong>+100%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ShotgunScavenger.png"},"wfmodaura0000012":{"id":"wfmodaura0000012","name":"Puissance Grandissante","oldName":"Growing Power","desc":"<p>Infliger un effet de statut avec une arme confère <strong>+25% de Puissance des Pouvoirs</strong> pendant 6 tours.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GrowingPower.png"},"growing power":{"id":"wfmodaura0000012","name":"Puissance Grandissante","oldName":"Growing Power","desc":"<p>Infliger un effet de statut avec une arme confère <strong>+25% de Puissance des Pouvoirs</strong> pendant 6 tours.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GrowingPower.png"},"puissance grandissante":{"id":"wfmodaura0000012","name":"Puissance Grandissante","oldName":"Growing Power","desc":"<p>Infliger un effet de statut avec une arme confère <strong>+25% de Puissance des Pouvoirs</strong> pendant 6 tours.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GrowingPower.png"},"wfmodaura0000013":{"id":"wfmodaura0000013","name":"Bref Répit","oldName":"Brief Respite","desc":"<p>Lancer une aptitude convertit <strong>150% de l'Énergie dépensée</strong> directement en Boucliers actifs.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BriefRespite.png"},"brief respite":{"id":"wfmodaura0000013","name":"Bref Répit","oldName":"Brief Respite","desc":"<p>Lancer une aptitude convertit <strong>150% de l'Énergie dépensée</strong> directement en Boucliers actifs.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BriefRespite.png"},"bref répit":{"id":"wfmodaura0000013","name":"Bref Répit","oldName":"Brief Respite","desc":"<p>Lancer une aptitude convertit <strong>150% de l'Énergie dépensée</strong> directement en Boucliers actifs.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BriefRespite.png"},"wfmodaura0000014":{"id":"wfmodaura0000014","name":"Unis dans l'Action","oldName":"Stand United","desc":"<p>Renforce le blindage défensif de l'escouade, conférant <strong>+25,5% (+40 d'Armure)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/StandUnited.png"},"stand united":{"id":"wfmodaura0000014","name":"Unis dans l'Action","oldName":"Stand United","desc":"<p>Renforce le blindage défensif de l'escouade, conférant <strong>+25,5% (+40 d'Armure)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/StandUnited.png"},"unis dans l'action":{"id":"wfmodaura0000014","name":"Unis dans l'Action","oldName":"Stand United","desc":"<p>Renforce le blindage défensif de l'escouade, conférant <strong>+25,5% (+40 d'Armure)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/StandUnited.png"},"wfmodaura0000015":{"id":"wfmodaura0000015","name":"Discipline de Combat","oldName":"Combat Discipline","desc":"<p>Éliminer un ennemi soigne tous les alliés de l'escouade de <strong>+20 PV</strong>, mais le porteur sacrifie <strong>10 PV</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CombatDiscipline.png"},"combat discipline":{"id":"wfmodaura0000015","name":"Discipline de Combat","oldName":"Combat Discipline","desc":"<p>Éliminer un ennemi soigne tous les alliés de l'escouade de <strong>+20 PV</strong>, mais le porteur sacrifie <strong>10 PV</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CombatDiscipline.png"},"discipline de combat":{"id":"wfmodaura0000015","name":"Discipline de Combat","oldName":"Combat Discipline","desc":"<p>Éliminer un ennemi soigne tous les alliés de l'escouade de <strong>+20 PV</strong>, mais le porteur sacrifie <strong>10 PV</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CombatDiscipline.png"},"wfmodaura0000016":{"id":"wfmodaura0000016","name":"Aérodynamique","oldName":"Aerodynamic","desc":"<p>Prolonge la durée du Vol Plané de <strong>+6s</strong> et réduit les dégâts subis en l'air de <strong>-24%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Aerodynamic.png"},"aerodynamic":{"id":"wfmodaura0000016","name":"Aérodynamique","oldName":"Aerodynamic","desc":"<p>Prolonge la durée du Vol Plané de <strong>+6s</strong> et réduit les dégâts subis en l'air de <strong>-24%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Aerodynamic.png"},"aérodynamique":{"id":"wfmodaura0000016","name":"Aérodynamique","oldName":"Aerodynamic","desc":"<p>Prolonge la durée du Vol Plané de <strong>+6s</strong> et réduit les dégâts subis en l'air de <strong>-24%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Aerodynamic.png"},"wfmodaura0000017":{"id":"wfmodaura0000017","name":"Radar Ennemi","oldName":"Enemy Radar","desc":"<p>Détecte et suit la position des ennemis sur la grille tactique dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnemyRadar.png"},"enemy radar":{"id":"wfmodaura0000017","name":"Radar Ennemi","oldName":"Enemy Radar","desc":"<p>Détecte et suit la position des ennemis sur la grille tactique dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnemyRadar.png"},"radar ennemi":{"id":"wfmodaura0000017","name":"Radar Ennemi","oldName":"Enemy Radar","desc":"<p>Détecte et suit la position des ennemis sur la grille tactique dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnemyRadar.png"},"wfmodaura0000018":{"id":"wfmodaura0000018","name":"Détecteur de Butin","oldName":"Loot Detector","desc":"<p>Détecte les conteneurs, caches de butin et ressources dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/LootDetector.png"},"loot detector":{"id":"wfmodaura0000018","name":"Détecteur de Butin","oldName":"Loot Detector","desc":"<p>Détecte les conteneurs, caches de butin et ressources dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/LootDetector.png"},"détecteur de butin":{"id":"wfmodaura0000018","name":"Détecteur de Butin","oldName":"Loot Detector","desc":"<p>Détecte les conteneurs, caches de butin et ressources dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/LootDetector.png"},"wfmodaura0000019":{"id":"wfmodaura0000019","name":"Don de Puissance","oldName":"Power Donation","desc":"<p>Le porteur sacrifie <strong>-30% de Puissance des Pouvoirs</strong>, mais accorde <strong>+30% de Puissance des Pouvoirs</strong> à tous les alliés de l'escouade ! Confère +18 de Capacité en correspondance.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PowerDonation.png"},"power donation":{"id":"wfmodaura0000019","name":"Don de Puissance","oldName":"Power Donation","desc":"<p>Le porteur sacrifie <strong>-30% de Puissance des Pouvoirs</strong>, mais accorde <strong>+30% de Puissance des Pouvoirs</strong> à tous les alliés de l'escouade ! Confère +18 de Capacité en correspondance.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PowerDonation.png"},"don de puissance":{"id":"wfmodaura0000019","name":"Don de Puissance","oldName":"Power Donation","desc":"<p>Le porteur sacrifie <strong>-30% de Puissance des Pouvoirs</strong>, mais accorde <strong>+30% de Puissance des Pouvoirs</strong> à tous les alliés de l'escouade ! Confère +18 de Capacité en correspondance.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PowerDonation.png"},"wfmodaura0000020":{"id":"wfmodaura0000020","name":"Élan Fulgurant","oldName":"Swift Momentum","desc":"<p>Prolonge la durée du Combo de Mêlée de <strong>+6s</strong> et accélère la préparation des Attaques Lourdes de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SwiftMomentum.png"},"swift momentum":{"id":"wfmodaura0000020","name":"Élan Fulgurant","oldName":"Swift Momentum","desc":"<p>Prolonge la durée du Combo de Mêlée de <strong>+6s</strong> et accélère la préparation des Attaques Lourdes de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SwiftMomentum.png"},"élan fulgurant":{"id":"wfmodaura0000020","name":"Élan Fulgurant","oldName":"Swift Momentum","desc":"<p>Prolonge la durée du Combo de Mêlée de <strong>+6s</strong> et accélère la préparation des Attaques Lourdes de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SwiftMomentum.png"},"wfmodcore0000001":{"id":"wfmodcore0000001","name":"Vitalité","oldName":"Vitality","desc":"<p>Augmente la Santé Max de <strong>+100 PV</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Vitality.png"},"vitality":{"id":"wfmodcore0000001","name":"Vitalité","oldName":"Vitality","desc":"<p>Augmente la Santé Max de <strong>+100 PV</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Vitality.png"},"vitalité":{"id":"wfmodcore0000001","name":"Vitalité","oldName":"Vitality","desc":"<p>Augmente la Santé Max de <strong>+100 PV</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Vitality.png"},"wfmodcore0000002":{"id":"wfmodcore0000002","name":"Redirection","oldName":"Redirection","desc":"<p>Augmente les Boucliers Max de <strong>+100 Boucliers</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Redirection.png"},"redirection":{"id":"wfmodcore0000002","name":"Redirection","oldName":"Redirection","desc":"<p>Augmente les Boucliers Max de <strong>+100 Boucliers</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Redirection.png"},"wfmodcore0000003":{"id":"wfmodcore0000003","name":"Fibre d'Acier","oldName":"Steel Fiber","desc":"<p>Renforce le blindage du châssis, conférant <strong>+100 d'Armure</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SteelFiber.png"},"steel fiber":{"id":"wfmodcore0000003","name":"Fibre d'Acier","oldName":"Steel Fiber","desc":"<p>Renforce le blindage du châssis, conférant <strong>+100 d'Armure</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SteelFiber.png"},"fibre d'acier":{"id":"wfmodcore0000003","name":"Fibre d'Acier","oldName":"Steel Fiber","desc":"<p>Renforce le blindage du châssis, conférant <strong>+100 d'Armure</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SteelFiber.png"},"wfmodcore0000004":{"id":"wfmodcore0000004","name":"Flux","oldName":"Flow","desc":"<p>Augmente la capacité du réservoir de Néant interne, conférant <strong>+75 d'Énergie Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Flow.png"},"flow":{"id":"wfmodcore0000004","name":"Flux","oldName":"Flow","desc":"<p>Augmente la capacité du réservoir de Néant interne, conférant <strong>+75 d'Énergie Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Flow.png"},"flux":{"id":"wfmodcore0000004","name":"Flux","oldName":"Flow","desc":"<p>Augmente la capacité du réservoir de Néant interne, conférant <strong>+75 d'Énergie Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Flow.png"},"wfmodcore0000005":{"id":"wfmodcore0000005","name":"Déviation Rapide","oldName":"Fast Deflection","desc":"<p>Augmente la vitesse de recharge des Boucliers de <strong>+90%</strong> et réduit le délai avant le début de la recharge.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/FastDeflection.png"},"fast deflection":{"id":"wfmodcore0000005","name":"Déviation Rapide","oldName":"Fast Deflection","desc":"<p>Augmente la vitesse de recharge des Boucliers de <strong>+90%</strong> et réduit le délai avant le début de la recharge.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/FastDeflection.png"},"déviation rapide":{"id":"wfmodcore0000005","name":"Déviation Rapide","oldName":"Fast Deflection","desc":"<p>Augmente la vitesse de recharge des Boucliers de <strong>+90%</strong> et réduit le délai avant le début de la recharge.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/FastDeflection.png"},"wfmodcore0000006":{"id":"wfmodcore0000006","name":"Vigueur","oldName":"Vigor","desc":"<p>Amélioration défensive combinée : confère <strong>+50 de Santé Max</strong> et <strong>+50 de Boucliers Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Vigor.png"},"vigor":{"id":"wfmodcore0000006","name":"Vigueur","oldName":"Vigor","desc":"<p>Amélioration défensive combinée : confère <strong>+50 de Santé Max</strong> et <strong>+50 de Boucliers Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Vigor.png"},"vigueur":{"id":"wfmodcore0000006","name":"Vigueur","oldName":"Vigor","desc":"<p>Amélioration défensive combinée : confère <strong>+50 de Santé Max</strong> et <strong>+50 de Boucliers Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Vigor.png"},"wfmodcore0000007":{"id":"wfmodcore0000007","name":"Agilité Blindée","oldName":"Armored Agility","desc":"<p>Matériaux composites légers et renforcés conférant <strong>+45 d'Armure</strong> et <strong>+5 ft de Vitesse de Déplacement</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArmoredAgility.png"},"armored agility":{"id":"wfmodcore0000007","name":"Agilité Blindée","oldName":"Armored Agility","desc":"<p>Matériaux composites légers et renforcés conférant <strong>+45 d'Armure</strong> et <strong>+5 ft de Vitesse de Déplacement</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArmoredAgility.png"},"agilité blindée":{"id":"wfmodcore0000007","name":"Agilité Blindée","oldName":"Armored Agility","desc":"<p>Matériaux composites légers et renforcés conférant <strong>+45 d'Armure</strong> et <strong>+5 ft de Vitesse de Déplacement</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArmoredAgility.png"},"wfmodcore0000008":{"id":"wfmodcore0000008","name":"Résolution du Gladiateur","oldName":"Gladiator Resolve","desc":"<p>Ensemble Gladiateur : Confère <strong>+40 de Santé Max</strong>. (Bonus d'Ensemble : +10% de Chances Critiques en mêlée par niveau de combo).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GladiatorResolve.png"},"gladiator resolve":{"id":"wfmodcore0000008","name":"Résolution du Gladiateur","oldName":"Gladiator Resolve","desc":"<p>Ensemble Gladiateur : Confère <strong>+40 de Santé Max</strong>. (Bonus d'Ensemble : +10% de Chances Critiques en mêlée par niveau de combo).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GladiatorResolve.png"},"résolution du gladiateur":{"id":"wfmodcore0000008","name":"Résolution du Gladiateur","oldName":"Gladiator Resolve","desc":"<p>Ensemble Gladiateur : Confère <strong>+40 de Santé Max</strong>. (Bonus d'Ensemble : +10% de Chances Critiques en mêlée par niveau de combo).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GladiatorResolve.png"},"wfmodcore0000009":{"id":"wfmodcore0000009","name":"Égide du Gladiateur","oldName":"Gladiator Aegis","desc":"<p>Ensemble Gladiateur : Confère <strong>+45 d'Armure</strong>. (Bonus d'Ensemble : +10% de Chances Critiques en mêlée par niveau de combo).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GladiatorAegis.png"},"gladiator aegis":{"id":"wfmodcore0000009","name":"Égide du Gladiateur","oldName":"Gladiator Aegis","desc":"<p>Ensemble Gladiateur : Confère <strong>+45 d'Armure</strong>. (Bonus d'Ensemble : +10% de Chances Critiques en mêlée par niveau de combo).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GladiatorAegis.png"},"égide du gladiateur":{"id":"wfmodcore0000009","name":"Égide du Gladiateur","oldName":"Gladiator Aegis","desc":"<p>Ensemble Gladiateur : Confère <strong>+45 d'Armure</strong>. (Bonus d'Ensemble : +10% de Chances Critiques en mêlée par niveau de combo).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/GladiatorAegis.png"},"wfmodcore0000010":{"id":"wfmodcore0000010","name":"Réflexe Vital","oldName":"Quick Thinking","desc":"<p>Consomme l'Énergie restante pour empêcher les dégâts mortels avec une efficacité de 240%. Empêche l'agonie tant qu'il reste de l'Énergie !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/QuickThinking.png"},"quick thinking":{"id":"wfmodcore0000010","name":"Réflexe Vital","oldName":"Quick Thinking","desc":"<p>Consomme l'Énergie restante pour empêcher les dégâts mortels avec une efficacité de 240%. Empêche l'agonie tant qu'il reste de l'Énergie !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/QuickThinking.png"},"réflexe vital":{"id":"wfmodcore0000010","name":"Réflexe Vital","oldName":"Quick Thinking","desc":"<p>Consomme l'Énergie restante pour empêcher les dégâts mortels avec une efficacité de 240%. Empêche l'agonie tant qu'il reste de l'Énergie !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/QuickThinking.png"},"wfmodpwrr0000001":{"id":"wfmodpwrr0000001","name":"Intensification","oldName":"Intensify","desc":"<p>Amplifie la puissance déployée, conférant <strong>+30% de Puissance des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Intensify.png"},"intensify":{"id":"wfmodpwrr0000001","name":"Intensification","oldName":"Intensify","desc":"<p>Amplifie la puissance déployée, conférant <strong>+30% de Puissance des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Intensify.png"},"intensification":{"id":"wfmodpwrr0000001","name":"Intensification","oldName":"Intensify","desc":"<p>Amplifie la puissance déployée, conférant <strong>+30% de Puissance des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Intensify.png"},"wfmodpwrr0000002":{"id":"wfmodpwrr0000002","name":"Continuité","oldName":"Continuity","desc":"<p>Stabilise la résonance du Néant, conférant <strong>+30% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Continuity.png"},"continuity":{"id":"wfmodpwrr0000002","name":"Continuité","oldName":"Continuity","desc":"<p>Stabilise la résonance du Néant, conférant <strong>+30% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Continuity.png"},"continuité":{"id":"wfmodpwrr0000002","name":"Continuité","oldName":"Continuity","desc":"<p>Stabilise la résonance du Néant, conférant <strong>+30% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Continuity.png"},"wfmodpwrr0000003":{"id":"wfmodpwrr0000003","name":"Rationalisation","oldName":"Streamline","desc":"<p>Optimise la dépense énergétique des aptitudes, conférant <strong>+30% d'Efficacité des Pouvoirs</strong> (plafonné à 190% max).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Streamline.png"},"streamline":{"id":"wfmodpwrr0000003","name":"Rationalisation","oldName":"Streamline","desc":"<p>Optimise la dépense énergétique des aptitudes, conférant <strong>+30% d'Efficacité des Pouvoirs</strong> (plafonné à 190% max).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Streamline.png"},"rationalisation":{"id":"wfmodpwrr0000003","name":"Rationalisation","oldName":"Streamline","desc":"<p>Optimise la dépense énergétique des aptitudes, conférant <strong>+30% d'Efficacité des Pouvoirs</strong> (plafonné à 190% max).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Streamline.png"},"wfmodpwrr0000004":{"id":"wfmodpwrr0000004","name":"Allonge","oldName":"Stretch","desc":"<p>Étend les champs de dispersion spatiale, conférant <strong>+45% de Portée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Stretch.png"},"stretch":{"id":"wfmodpwrr0000004","name":"Allonge","oldName":"Stretch","desc":"<p>Étend les champs de dispersion spatiale, conférant <strong>+45% de Portée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Stretch.png"},"allonge":{"id":"wfmodmelc0000012","name":"Allonge","oldName":"Reach","desc":"<p>Étend la portée des attaques de mêlée de <strong>+5 feet (1,5 m)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Reach.png"},"wfmodpwrr0000005":{"id":"wfmodpwrr0000005","name":"Équilibre","oldName":"Equilibrium","desc":"<p>Synthèse parfaite : les Orbes de Santé confèrent <strong>+110%</strong> de leur valeur en Énergie, et les Orbes d'Énergie confèrent <strong>+110%</strong> en Santé !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Equilibrium.png"},"equilibrium":{"id":"wfmodpwrr0000005","name":"Équilibre","oldName":"Equilibrium","desc":"<p>Synthèse parfaite : les Orbes de Santé confèrent <strong>+110%</strong> de leur valeur en Énergie, et les Orbes d'Énergie confèrent <strong>+110%</strong> en Santé !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Equilibrium.png"},"équilibre":{"id":"wfmodpwrr0000005","name":"Équilibre","oldName":"Equilibrium","desc":"<p>Synthèse parfaite : les Orbes de Santé confèrent <strong>+110%</strong> de leur valeur en Énergie, et les Orbes d'Énergie confèrent <strong>+110%</strong> en Santé !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Equilibrium.png"},"wfmodpwrr0000006":{"id":"wfmodpwrr0000006","name":"Talent Naturel","oldName":"Natural Talent","desc":"<p>Améliore les réflexes neuro-cinétiques, accélérant la Vitesse de Lancement des Aptitudes de <strong>+50%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NaturalTalent.png"},"natural talent":{"id":"wfmodpwrr0000006","name":"Talent Naturel","oldName":"Natural Talent","desc":"<p>Améliore les réflexes neuro-cinétiques, accélérant la Vitesse de Lancement des Aptitudes de <strong>+50%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NaturalTalent.png"},"talent naturel":{"id":"wfmodpwrr0000006","name":"Talent Naturel","oldName":"Natural Talent","desc":"<p>Améliore les réflexes neuro-cinétiques, accélérant la Vitesse de Lancement des Aptitudes de <strong>+50%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NaturalTalent.png"},"wfmodpwrr0000007":{"id":"wfmodpwrr0000007","name":"Rage","oldName":"Rage","desc":"<p>Convertit <strong>40% des dégâts subis sur la Santé</strong> directement en Énergie utilisable.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Rage.png"},"rage":{"id":"wfmodpwrr0000007","name":"Rage","oldName":"Rage","desc":"<p>Convertit <strong>40% des dégâts subis sur la Santé</strong> directement en Énergie utilisable.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Rage.png"},"wfmodpwrr0000008":{"id":"wfmodpwrr0000008","name":"Adrénaline du Chasseur","oldName":"Hunter Adrenaline","desc":"<p>Ensemble Chasseur : Convertit <strong>45% des dégâts subis sur la Santé</strong> directement en Énergie utilisable.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/HunterAdrenaline.png"},"hunter adrenaline":{"id":"wfmodpwrr0000008","name":"Adrénaline du Chasseur","oldName":"Hunter Adrenaline","desc":"<p>Ensemble Chasseur : Convertit <strong>45% des dégâts subis sur la Santé</strong> directement en Énergie utilisable.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/HunterAdrenaline.png"},"adrénaline du chasseur":{"id":"wfmodpwrr0000008","name":"Adrénaline du Chasseur","oldName":"Hunter Adrenaline","desc":"<p>Ensemble Chasseur : Convertit <strong>45% des dégâts subis sur la Santé</strong> directement en Énergie utilisable.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/HunterAdrenaline.png"},"wfmodcrpt0000001":{"id":"wfmodcrpt0000001","name":"Colère Aveugle","oldName":"Blind Rage","desc":"<p>Artéfact des Soutes Orokin : Confère un titanesque <strong>+99% de Puissance des Pouvoirs</strong>, au prix de <strong>-55% d'Efficacité des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BlindRage.png"},"blind rage":{"id":"wfmodcrpt0000001","name":"Colère Aveugle","oldName":"Blind Rage","desc":"<p>Artéfact des Soutes Orokin : Confère un titanesque <strong>+99% de Puissance des Pouvoirs</strong>, au prix de <strong>-55% d'Efficacité des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BlindRage.png"},"colère aveugle":{"id":"wfmodcrpt0000001","name":"Colère Aveugle","oldName":"Blind Rage","desc":"<p>Artéfact des Soutes Orokin : Confère un titanesque <strong>+99% de Puissance des Pouvoirs</strong>, au prix de <strong>-55% d'Efficacité des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BlindRage.png"},"wfmodcrpt0000002":{"id":"wfmodcrpt0000002","name":"Courage Passager","oldName":"Transient Fortitude","desc":"<p>Artéfact des Soutes Orokin : Confère <strong>+55% de Puissance des Pouvoirs</strong>, au prix de <strong>-27% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/TransientFortitude.png"},"transient fortitude":{"id":"wfmodcrpt0000002","name":"Courage Passager","oldName":"Transient Fortitude","desc":"<p>Artéfact des Soutes Orokin : Confère <strong>+55% de Puissance des Pouvoirs</strong>, au prix de <strong>-27% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/TransientFortitude.png"},"courage passager":{"id":"wfmodcrpt0000002","name":"Courage Passager","oldName":"Transient Fortitude","desc":"<p>Artéfact des Soutes Orokin : Confère <strong>+55% de Puissance des Pouvoirs</strong>, au prix de <strong>-27% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/TransientFortitude.png"},"wfmodcrpt0000003":{"id":"wfmodcrpt0000003","name":"Expertise Éphémère","oldName":"Fleeting Expertise","desc":"<p>Artéfact des Soutes Orokin : Confère <strong>+60% d'Efficacité des Pouvoirs</strong>, au prix de <strong>-60% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/FleetingExpertise.png"},"fleeting expertise":{"id":"wfmodcrpt0000003","name":"Expertise Éphémère","oldName":"Fleeting Expertise","desc":"<p>Artéfact des Soutes Orokin : Confère <strong>+60% d'Efficacité des Pouvoirs</strong>, au prix de <strong>-60% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/FleetingExpertise.png"},"expertise éphémère":{"id":"wfmodcrpt0000003","name":"Expertise Éphémère","oldName":"Fleeting Expertise","desc":"<p>Artéfact des Soutes Orokin : Confère <strong>+60% d'Efficacité des Pouvoirs</strong>, au prix de <strong>-60% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/FleetingExpertise.png"},"wfmodcrpt0000004":{"id":"wfmodcrpt0000004","name":"Surexpansion","oldName":"Overextended","desc":"<p>Artéfact des Soutes Orokin : Confère un massif <strong>+90% de Portée des Pouvoirs</strong>, au prix de <strong>-60% de Puissance des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Overextended.png"},"overextended":{"id":"wfmodcrpt0000004","name":"Surexpansion","oldName":"Overextended","desc":"<p>Artéfact des Soutes Orokin : Confère un massif <strong>+90% de Portée des Pouvoirs</strong>, au prix de <strong>-60% de Puissance des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Overextended.png"},"surexpansion":{"id":"wfmodcrpt0000004","name":"Surexpansion","oldName":"Overextended","desc":"<p>Artéfact des Soutes Orokin : Confère un massif <strong>+90% de Portée des Pouvoirs</strong>, au prix de <strong>-60% de Puissance des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Overextended.png"},"wfmodcrpt0000005":{"id":"wfmodcrpt0000005","name":"Pensée Étroite","oldName":"Narrow Minded","desc":"<p>Artéfact des Soutes Orokin : Confère un immense <strong>+99% de Durée des Pouvoirs</strong>, au prix de <strong>-66% de Portée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NarrowMinded.png"},"narrow minded":{"id":"wfmodcrpt0000005","name":"Pensée Étroite","oldName":"Narrow Minded","desc":"<p>Artéfact des Soutes Orokin : Confère un immense <strong>+99% de Durée des Pouvoirs</strong>, au prix de <strong>-66% de Portée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NarrowMinded.png"},"pensée étroite":{"id":"wfmodcrpt0000005","name":"Pensée Étroite","oldName":"Narrow Minded","desc":"<p>Artéfact des Soutes Orokin : Confère un immense <strong>+99% de Durée des Pouvoirs</strong>, au prix de <strong>-66% de Portée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NarrowMinded.png"},"wfmodexls0000001":{"id":"wfmodexls0000001","name":"Ruée","oldName":"Rush","desc":"<p>Surcadence les servomoteurs des jambes, conférant <strong>+10 ft de Vitesse de Sprint</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Rush.png"},"rush":{"id":"wfmodexls0000001","name":"Ruée","oldName":"Rush","desc":"<p>Surcadence les servomoteurs des jambes, conférant <strong>+10 ft de Vitesse de Sprint</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Rush.png"},"ruée":{"id":"wfmodexls0000001","name":"Ruée","oldName":"Rush","desc":"<p>Surcadence les servomoteurs des jambes, conférant <strong>+10 ft de Vitesse de Sprint</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Rush.png"},"wfmodexls0000002":{"id":"wfmodexls0000002","name":"Maglev","oldName":"Maglev","desc":"<p>Réduit les frottements de surface de <strong>-30%</strong> et augmente la Vitesse de Glissade de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Maglev.png"},"maglev":{"id":"wfmodexls0000002","name":"Maglev","oldName":"Maglev","desc":"<p>Réduit les frottements de surface de <strong>-30%</strong> et augmente la Vitesse de Glissade de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Maglev.png"},"wfmodexls0000003":{"id":"wfmodexls0000003","name":"Mobilisation","oldName":"Mobilize","desc":"<p>Confère <strong>+20% de vélocité au Saut Propulsé</strong> et <strong>+20% de durée au Vol Plané</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Mobilize.png"},"mobilize":{"id":"wfmodexls0000003","name":"Mobilisation","oldName":"Mobilize","desc":"<p>Confère <strong>+20% de vélocité au Saut Propulsé</strong> et <strong>+20% de durée au Vol Plané</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Mobilize.png"},"mobilisation":{"id":"wfmodexls0000003","name":"Mobilisation","oldName":"Mobilize","desc":"<p>Confère <strong>+20% de vélocité au Saut Propulsé</strong> et <strong>+20% de durée au Vol Plané</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Mobilize.png"},"wfmodexls0000004":{"id":"wfmodexls0000004","name":"Patagium","oldName":"Patagium","desc":"<p>Déploie des voiles sustentatrices conférant <strong>+90% de durée au Vol Plané</strong> et à la Prise Murale.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Patagium.png"},"patagium":{"id":"wfmodexls0000004","name":"Patagium","oldName":"Patagium","desc":"<p>Déploie des voiles sustentatrices conférant <strong>+90% de durée au Vol Plané</strong> et à la Prise Murale.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Patagium.png"},"wfmodexls0000005":{"id":"wfmodexls0000005","name":"Rétablissement Rapide","oldName":"Handspring","desc":"<p>Accélère les réflexes de récupération, conférant <strong>+160% de Vitesse de Relèvement</strong> après un renversement.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Handspring.png"},"handspring":{"id":"wfmodexls0000005","name":"Rétablissement Rapide","oldName":"Handspring","desc":"<p>Accélère les réflexes de récupération, conférant <strong>+160% de Vitesse de Relèvement</strong> après un renversement.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Handspring.png"},"rétablissement rapide":{"id":"wfmodexls0000005","name":"Rétablissement Rapide","oldName":"Handspring","desc":"<p>Accélère les réflexes de récupération, conférant <strong>+160% de Vitesse de Relèvement</strong> après un renversement.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Handspring.png"},"wfmodexls0000006":{"id":"wfmodexls0000006","name":"Pied Léger","oldName":"Sure Footed","desc":"<p>Stabilisateurs gyroscopiques conférant <strong>+60% de Chances de Résister aux Renversements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SureFooted.png"},"sure footed":{"id":"wfmodexls0000006","name":"Pied Léger","oldName":"Sure Footed","desc":"<p>Stabilisateurs gyroscopiques conférant <strong>+60% de Chances de Résister aux Renversements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SureFooted.png"},"pied léger":{"id":"wfmodexls0000006","name":"Pied Léger","oldName":"Sure Footed","desc":"<p>Stabilisateurs gyroscopiques conférant <strong>+60% de Chances de Résister aux Renversements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SureFooted.png"},"wfmodexls0000007":{"id":"wfmodexls0000007","name":"Pied Léger Accru","oldName":"Primed Sure Footed","desc":"<p>Matrice de stabilisation Orokin immaculée : Confère une <strong>Immunité Totale (100%) aux Renversements et Chancellement</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedSureFooted.png"},"primed sure footed":{"id":"wfmodexls0000007","name":"Pied Léger Accru","oldName":"Primed Sure Footed","desc":"<p>Matrice de stabilisation Orokin immaculée : Confère une <strong>Immunité Totale (100%) aux Renversements et Chancellement</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedSureFooted.png"},"pied léger accru":{"id":"wfmodexls0000007","name":"Pied Léger Accru","oldName":"Primed Sure Footed","desc":"<p>Matrice de stabilisation Orokin immaculée : Confère une <strong>Immunité Totale (100%) aux Renversements et Chancellement</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedSureFooted.png"},"wfmodexls0000008":{"id":"wfmodexls0000008","name":"Dérive de Puissance","oldName":"Power Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+15% de Puissance des Pouvoirs</strong> et <strong>+30% de Résistance aux Renversements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PowerDrift.png"},"power drift":{"id":"wfmodexls0000008","name":"Dérive de Puissance","oldName":"Power Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+15% de Puissance des Pouvoirs</strong> et <strong>+30% de Résistance aux Renversements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PowerDrift.png"},"dérive de puissance":{"id":"wfmodexls0000008","name":"Dérive de Puissance","oldName":"Power Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+15% de Puissance des Pouvoirs</strong> et <strong>+30% de Résistance aux Renversements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PowerDrift.png"},"wfmodexls0000009":{"id":"wfmodexls0000009","name":"Dérive Rusée","oldName":"Cunning Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+15% de Portée des Pouvoirs</strong>, <strong>+12% de Vitesse de Glissade</strong> et <strong>-30% de Frottements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CunningDrift.png"},"cunning drift":{"id":"wfmodexls0000009","name":"Dérive Rusée","oldName":"Cunning Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+15% de Portée des Pouvoirs</strong>, <strong>+12% de Vitesse de Glissade</strong> et <strong>-30% de Frottements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CunningDrift.png"},"dérive rusée":{"id":"wfmodexls0000009","name":"Dérive Rusée","oldName":"Cunning Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+15% de Portée des Pouvoirs</strong>, <strong>+12% de Vitesse de Glissade</strong> et <strong>-30% de Frottements</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CunningDrift.png"},"wfmodexls0000010":{"id":"wfmodexls0000010","name":"Dérive Furtive","oldName":"Stealth Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+18m de Radar Ennemi</strong> et <strong>+12% de durée de Vol Plané</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/StealthDrift.png"},"stealth drift":{"id":"wfmodexls0000010","name":"Dérive Furtive","oldName":"Stealth Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+18m de Radar Ennemi</strong> et <strong>+12% de durée de Vol Plané</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/StealthDrift.png"},"dérive furtive":{"id":"wfmodexls0000010","name":"Dérive Furtive","oldName":"Stealth Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+18m de Radar Ennemi</strong> et <strong>+12% de durée de Vol Plané</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/StealthDrift.png"},"wfmodexls0000011":{"id":"wfmodexls0000011","name":"Dérive de Cohésion","oldName":"Coaction Drift","desc":"<p>Mod de Dérive de Lua : Augmente la Puissance de l'Aura de <strong>+15%</strong> et l'Efficacité de l'Aura de <strong>+15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CoactionDrift.png"},"coaction drift":{"id":"wfmodexls0000011","name":"Dérive de Cohésion","oldName":"Coaction Drift","desc":"<p>Mod de Dérive de Lua : Augmente la Puissance de l'Aura de <strong>+15%</strong> et l'Efficacité de l'Aura de <strong>+15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CoactionDrift.png"},"dérive de cohésion":{"id":"wfmodexls0000011","name":"Dérive de Cohésion","oldName":"Coaction Drift","desc":"<p>Mod de Dérive de Lua : Augmente la Puissance de l'Aura de <strong>+15%</strong> et l'Efficacité de l'Aura de <strong>+15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CoactionDrift.png"},"wfmodexls0000012":{"id":"wfmodexls0000012","name":"Dérive d'Endurance","oldName":"Endurance Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+25 d'Énergie Max</strong> et <strong>+12% de Vélocité de Parkour</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnduranceDrift.png"},"endurance drift":{"id":"wfmodexls0000012","name":"Dérive d'Endurance","oldName":"Endurance Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+25 d'Énergie Max</strong> et <strong>+12% de Vélocité de Parkour</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnduranceDrift.png"},"dérive d'endurance":{"id":"wfmodexls0000012","name":"Dérive d'Endurance","oldName":"Endurance Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+25 d'Énergie Max</strong> et <strong>+12% de Vélocité de Parkour</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/EnduranceDrift.png"},"wfmodexls0000013":{"id":"wfmodexls0000013","name":"Dérive de Vitesse","oldName":"Speed Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+5 ft de Vitesse de Sprint</strong> et <strong>+15% de Vitesse de Lancement</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SpeedDrift.png"},"speed drift":{"id":"wfmodexls0000013","name":"Dérive de Vitesse","oldName":"Speed Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+5 ft de Vitesse de Sprint</strong> et <strong>+15% de Vitesse de Lancement</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SpeedDrift.png"},"dérive de vitesse":{"id":"wfmodexls0000013","name":"Dérive de Vitesse","oldName":"Speed Drift","desc":"<p>Mod de Dérive de Lua : Confère <strong>+5 ft de Vitesse de Sprint</strong> et <strong>+15% de Vitesse de Lancement</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SpeedDrift.png"},"wfmodexls0000014":{"id":"wfmodexls0000014","name":"Dérive d'Agilité","oldName":"Agility Drift","desc":"<p>Mod de Dérive de Lua : Réduit les dégâts subis en vol de <strong>-12%</strong> et confère <strong>+6% d'Évasion</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AgilityDrift.png"},"agility drift":{"id":"wfmodexls0000014","name":"Dérive d'Agilité","oldName":"Agility Drift","desc":"<p>Mod de Dérive de Lua : Réduit les dégâts subis en vol de <strong>-12%</strong> et confère <strong>+6% d'Évasion</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AgilityDrift.png"},"dérive d'agilité":{"id":"wfmodexls0000014","name":"Dérive d'Agilité","oldName":"Agility Drift","desc":"<p>Mod de Dérive de Lua : Réduit les dégâts subis en vol de <strong>-12%</strong> et confère <strong>+6% d'Évasion</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AgilityDrift.png"},"wfmodexls0000015":{"id":"wfmodexls0000015","name":"Aviateur","oldName":"Aviator","desc":"<p>Les stabilisateurs aérodynamiques réduisent tous les dégâts subis en vol de <strong>-40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Aviator.png"},"aviator":{"id":"wfmodexls0000015","name":"Aviateur","oldName":"Aviator","desc":"<p>Les stabilisateurs aérodynamiques réduisent tous les dégâts subis en vol de <strong>-40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Aviator.png"},"aviateur":{"id":"wfmodexls0000015","name":"Aviateur","oldName":"Aviator","desc":"<p>Les stabilisateurs aérodynamiques réduisent tous les dégâts subis en vol de <strong>-40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Aviator.png"},"wfmodexls0000016":{"id":"wfmodexls0000016","name":"Ruse du Voleur","oldName":"Thief's Wit","desc":"<p>Les capteurs de butin détectent conteneurs, médaillons et ressources dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ThiefsWit.png"},"thief's wit":{"id":"wfmodexls0000016","name":"Ruse du Voleur","oldName":"Thief's Wit","desc":"<p>Les capteurs de butin détectent conteneurs, médaillons et ressources dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ThiefsWit.png"},"ruse du voleur":{"id":"wfmodexls0000016","name":"Ruse du Voleur","oldName":"Thief's Wit","desc":"<p>Les capteurs de butin détectent conteneurs, médaillons et ressources dans un rayon de <strong>30 mètres</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ThiefsWit.png"},"wfmodsets0000001":{"id":"wfmodsets0000001","name":"Secrets de l'Augure","oldName":"Augur Secrets","desc":"<p>Ensemble Augure : Confère <strong>+24% de Puissance des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurSecrets.png"},"augur secrets":{"id":"wfmodsets0000001","name":"Secrets de l'Augure","oldName":"Augur Secrets","desc":"<p>Ensemble Augure : Confère <strong>+24% de Puissance des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurSecrets.png"},"secrets de l'augure":{"id":"wfmodsets0000001","name":"Secrets de l'Augure","oldName":"Augur Secrets","desc":"<p>Ensemble Augure : Confère <strong>+24% de Puissance des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurSecrets.png"},"wfmodsets0000002":{"id":"wfmodsets0000002","name":"Message de l'Augure","oldName":"Augur Message","desc":"<p>Ensemble Augure : Confère <strong>+24% de Durée des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurMessage.png"},"augur message":{"id":"wfmodsets0000002","name":"Message de l'Augure","oldName":"Augur Message","desc":"<p>Ensemble Augure : Confère <strong>+24% de Durée des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurMessage.png"},"message de l'augure":{"id":"wfmodsets0000002","name":"Message de l'Augure","oldName":"Augur Message","desc":"<p>Ensemble Augure : Confère <strong>+24% de Durée des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurMessage.png"},"wfmodsets0000003":{"id":"wfmodsets0000003","name":"Portée de l'Augure","oldName":"Augur Reach","desc":"<p>Ensemble Augure : Confère <strong>+30% de Portée des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurReach.png"},"augur reach":{"id":"wfmodsets0000003","name":"Portée de l'Augure","oldName":"Augur Reach","desc":"<p>Ensemble Augure : Confère <strong>+30% de Portée des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurReach.png"},"portée de l'augure":{"id":"wfmodsets0000003","name":"Portée de l'Augure","oldName":"Augur Reach","desc":"<p>Ensemble Augure : Confère <strong>+30% de Portée des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurReach.png"},"wfmodsets0000004":{"id":"wfmodsets0000004","name":"Accord de l'Augure","oldName":"Augur Accord","desc":"<p>Ensemble Augure : Confère <strong>+70 de Boucliers Max</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurAccord.png"},"augur accord":{"id":"wfmodsets0000004","name":"Accord de l'Augure","oldName":"Augur Accord","desc":"<p>Ensemble Augure : Confère <strong>+70 de Boucliers Max</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurAccord.png"},"accord de l'augure":{"id":"wfmodsets0000004","name":"Accord de l'Augure","oldName":"Augur Accord","desc":"<p>Ensemble Augure : Confère <strong>+70 de Boucliers Max</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AugurAccord.png"},"wfmodsets0000005":{"id":"wfmodsets0000005","name":"Haine de Boréal","oldName":"Boreal's Hatred","desc":"<p>Ensemble Boréal : Confère <strong>+65 de Boucliers Max</strong> et <strong>+15% d'Efficacité des Pouvoirs</strong>. (Bonus d'Ensemble : +20% de réduction des dégâts en vol).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BorealsHatred.png"},"boreal's hatred":{"id":"wfmodsets0000005","name":"Haine de Boréal","oldName":"Boreal's Hatred","desc":"<p>Ensemble Boréal : Confère <strong>+65 de Boucliers Max</strong> et <strong>+15% d'Efficacité des Pouvoirs</strong>. (Bonus d'Ensemble : +20% de réduction des dégâts en vol).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BorealsHatred.png"},"haine de boréal":{"id":"wfmodsets0000005","name":"Haine de Boréal","oldName":"Boreal's Hatred","desc":"<p>Ensemble Boréal : Confère <strong>+65 de Boucliers Max</strong> et <strong>+15% d'Efficacité des Pouvoirs</strong>. (Bonus d'Ensemble : +20% de réduction des dégâts en vol).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/BorealsHatred.png"},"wfmodsets0000006":{"id":"wfmodsets0000006","name":"Haine d'Amar","oldName":"Amar's Hatred","desc":"<p>Ensemble Amar : Confère <strong>+30 d'Armure</strong> et <strong>+15% de Puissance des Pouvoirs</strong>. (Bonus d'Ensemble : les Attaques Lourdes téléportent sur la cible à 10m).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AmarsHatred.png"},"amar's hatred":{"id":"wfmodsets0000006","name":"Haine d'Amar","oldName":"Amar's Hatred","desc":"<p>Ensemble Amar : Confère <strong>+30 d'Armure</strong> et <strong>+15% de Puissance des Pouvoirs</strong>. (Bonus d'Ensemble : les Attaques Lourdes téléportent sur la cible à 10m).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AmarsHatred.png"},"haine d'amar":{"id":"wfmodsets0000006","name":"Haine d'Amar","oldName":"Amar's Hatred","desc":"<p>Ensemble Amar : Confère <strong>+30 d'Armure</strong> et <strong>+15% de Puissance des Pouvoirs</strong>. (Bonus d'Ensemble : les Attaques Lourdes téléportent sur la cible à 10m).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/AmarsHatred.png"},"wfmodsets0000007":{"id":"wfmodsets0000007","name":"Haine de Nira","oldName":"Nira's Hatred","desc":"<p>Ensemble Nira : Confère <strong>+50 de Santé Max</strong> et <strong>+15% de Durée des Pouvoirs</strong>. (Bonus d'Ensemble : les Attaques Écrasantes infligent +100% de dégâts).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NirasHatred.png"},"nira's hatred":{"id":"wfmodsets0000007","name":"Haine de Nira","oldName":"Nira's Hatred","desc":"<p>Ensemble Nira : Confère <strong>+50 de Santé Max</strong> et <strong>+15% de Durée des Pouvoirs</strong>. (Bonus d'Ensemble : les Attaques Écrasantes infligent +100% de dégâts).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NirasHatred.png"},"haine de nira":{"id":"wfmodsets0000007","name":"Haine de Nira","oldName":"Nira's Hatred","desc":"<p>Ensemble Nira : Confère <strong>+50 de Santé Max</strong> et <strong>+15% de Durée des Pouvoirs</strong>. (Bonus d'Ensemble : les Attaques Écrasantes infligent +100% de dégâts).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/NirasHatred.png"},"wfmodsets0000008":{"id":"wfmodsets0000008","name":"Carapace de Carnis","oldName":"Carnis Carapace","desc":"<p>Ensemble Carnis : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les éliminations par Attaque Lourde confèrent 10% d'Évasion et Immunité aux Statuts pendant 6s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CarnisCarapace.png"},"carnis carapace":{"id":"wfmodsets0000008","name":"Carapace de Carnis","oldName":"Carnis Carapace","desc":"<p>Ensemble Carnis : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les éliminations par Attaque Lourde confèrent 10% d'Évasion et Immunité aux Statuts pendant 6s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CarnisCarapace.png"},"carapace de carnis":{"id":"wfmodsets0000008","name":"Carapace de Carnis","oldName":"Carnis Carapace","desc":"<p>Ensemble Carnis : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les éliminations par Attaque Lourde confèrent 10% d'Évasion et Immunité aux Statuts pendant 6s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/CarnisCarapace.png"},"wfmodsets0000009":{"id":"wfmodsets0000009","name":"Carapace de Jugulus","oldName":"Jugulus Carapace","desc":"<p>Ensemble Jugulus : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les Écrasements Lourds font jaillir des vrilles empalantes).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/JugulusCarapace.png"},"jugulus carapace":{"id":"wfmodsets0000009","name":"Carapace de Jugulus","oldName":"Jugulus Carapace","desc":"<p>Ensemble Jugulus : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les Écrasements Lourds font jaillir des vrilles empalantes).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/JugulusCarapace.png"},"carapace de jugulus":{"id":"wfmodsets0000009","name":"Carapace de Jugulus","oldName":"Jugulus Carapace","desc":"<p>Ensemble Jugulus : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les Écrasements Lourds font jaillir des vrilles empalantes).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/JugulusCarapace.png"},"wfmodsets0000010":{"id":"wfmodsets0000010","name":"Carapace de Saxum","oldName":"Saxum Carapace","desc":"<p>Ensemble Saxum : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les ennemis projetés en l'air explosent à leur mort).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SaxumCarapace.png"},"saxum carapace":{"id":"wfmodsets0000010","name":"Carapace de Saxum","oldName":"Saxum Carapace","desc":"<p>Ensemble Saxum : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les ennemis projetés en l'air explosent à leur mort).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SaxumCarapace.png"},"carapace de saxum":{"id":"wfmodsets0000010","name":"Carapace de Saxum","oldName":"Saxum Carapace","desc":"<p>Ensemble Saxum : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les ennemis projetés en l'air explosent à leur mort).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/SaxumCarapace.png"},"wfmodtact0000001":{"id":"wfmodtact0000001","name":"Adaptation","oldName":"Adaptation","desc":"<p>Lorsque vous subissez des dégâts, gagnez <strong>+10% de Résistance</strong> à ce type de dégâts pendant 20s. Se cumule jusqu'à un impressionnant <strong>90% de Résistance aux Dégâts</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Adaptation.png"},"adaptation":{"id":"wfmodtact0000001","name":"Adaptation","oldName":"Adaptation","desc":"<p>Lorsque vous subissez des dégâts, gagnez <strong>+10% de Résistance</strong> à ce type de dégâts pendant 20s. Se cumule jusqu'à un impressionnant <strong>90% de Résistance aux Dégâts</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/Adaptation.png"},"wfmodtact0000002":{"id":"wfmodtact0000002","name":"Roulade Protectrice","oldName":"Rolling Guard","desc":"<p>Effectuer une Roulade d'Esquive confère <strong>3 secondes d'Invulnérabilité Totale</strong> et purge tous les statuts négatifs actifs (temps de recharge de 7s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/RollingGuard.png"},"rolling guard":{"id":"wfmodtact0000002","name":"Roulade Protectrice","oldName":"Rolling Guard","desc":"<p>Effectuer une Roulade d'Esquive confère <strong>3 secondes d'Invulnérabilité Totale</strong> et purge tous les statuts négatifs actifs (temps de recharge de 7s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/RollingGuard.png"},"roulade protectrice":{"id":"wfmodtact0000002","name":"Roulade Protectrice","oldName":"Rolling Guard","desc":"<p>Effectuer une Roulade d'Esquive confère <strong>3 secondes d'Invulnérabilité Totale</strong> et purge tous les statuts négatifs actifs (temps de recharge de 7s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/RollingGuard.png"},"wfmodprmd0000001":{"id":"wfmodprmd0000001","name":"Continuité Accrue","oldName":"Primed Continuity","desc":"<p>Relique Orokin immaculée : Confère un extraordinaire <strong>+55% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedContinuity.png"},"primed continuity":{"id":"wfmodprmd0000001","name":"Continuité Accrue","oldName":"Primed Continuity","desc":"<p>Relique Orokin immaculée : Confère un extraordinaire <strong>+55% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedContinuity.png"},"continuité accrue":{"id":"wfmodprmd0000001","name":"Continuité Accrue","oldName":"Primed Continuity","desc":"<p>Relique Orokin immaculée : Confère un extraordinaire <strong>+55% de Durée des Pouvoirs</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedContinuity.png"},"wfmodprmd0000002":{"id":"wfmodprmd0000002","name":"Flux Accru","oldName":"Primed Flow","desc":"<p>Condensateur de Néant Orokin d'exception : Confère un immense <strong>+150 d'Énergie Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedFlow.png"},"primed flow":{"id":"wfmodprmd0000002","name":"Flux Accru","oldName":"Primed Flow","desc":"<p>Condensateur de Néant Orokin d'exception : Confère un immense <strong>+150 d'Énergie Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedFlow.png"},"flux accru":{"id":"wfmodprmd0000002","name":"Flux Accru","oldName":"Primed Flow","desc":"<p>Condensateur de Néant Orokin d'exception : Confère un immense <strong>+150 d'Énergie Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedFlow.png"},"wfmodprmd0000003":{"id":"wfmodprmd0000003","name":"Vigueur Accrue","oldName":"Primed Vigor","desc":"<p>Biomécanique Orokin d'exception : Confère <strong>+75 de Santé Max</strong> et <strong>+75 de Boucliers Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedVigor.png"},"primed vigor":{"id":"wfmodprmd0000003","name":"Vigueur Accrue","oldName":"Primed Vigor","desc":"<p>Biomécanique Orokin d'exception : Confère <strong>+75 de Santé Max</strong> et <strong>+75 de Boucliers Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedVigor.png"},"vigueur accrue":{"id":"wfmodprmd0000003","name":"Vigueur Accrue","oldName":"Primed Vigor","desc":"<p>Biomécanique Orokin d'exception : Confère <strong>+75 de Santé Max</strong> et <strong>+75 de Boucliers Max</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/PrimedVigor.png"},"wfmodprmd0000004":{"id":"wfmodprmd0000004","name":"Vitalité Umbra","oldName":"Umbral Vitality","desc":"<p>Synthèse sacrificielle Dax : Confère <strong>+180 de Santé Max</strong> et <strong>+11% de Résistance Tau</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralVitality.png"},"umbral vitality":{"id":"wfmodprmd0000004","name":"Vitalité Umbra","oldName":"Umbral Vitality","desc":"<p>Synthèse sacrificielle Dax : Confère <strong>+180 de Santé Max</strong> et <strong>+11% de Résistance Tau</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralVitality.png"},"vitalité umbra":{"id":"wfmodprmd0000004","name":"Vitalité Umbra","oldName":"Umbral Vitality","desc":"<p>Synthèse sacrificielle Dax : Confère <strong>+180 de Santé Max</strong> et <strong>+11% de Résistance Tau</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralVitality.png"},"wfmodprmd0000005":{"id":"wfmodprmd0000005","name":"Fibre Umbra","oldName":"Umbral Fiber","desc":"<p>Tissage sacrificiel Dax : Confère <strong>+180 d'Armure</strong> et <strong>+11% de Résistance Tau</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralFiber.png"},"umbral fiber":{"id":"wfmodprmd0000005","name":"Fibre Umbra","oldName":"Umbral Fiber","desc":"<p>Tissage sacrificiel Dax : Confère <strong>+180 d'Armure</strong> et <strong>+11% de Résistance Tau</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralFiber.png"},"fibre umbra":{"id":"wfmodprmd0000005","name":"Fibre Umbra","oldName":"Umbral Fiber","desc":"<p>Tissage sacrificiel Dax : Confère <strong>+180 d'Armure</strong> et <strong>+11% de Résistance Tau</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralFiber.png"},"wfmodprmd0000006":{"id":"wfmodprmd0000006","name":"Intensification Umbra","oldName":"Umbral Intensify","desc":"<p>Focalisation sacrificielle Dax : Confère <strong>+44% de Puissance des Pouvoirs</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralIntensify.png"},"umbral intensify":{"id":"wfmodprmd0000006","name":"Intensification Umbra","oldName":"Umbral Intensify","desc":"<p>Focalisation sacrificielle Dax : Confère <strong>+44% de Puissance des Pouvoirs</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralIntensify.png"},"intensification umbra":{"id":"wfmodprmd0000006","name":"Intensification Umbra","oldName":"Umbral Intensify","desc":"<p>Focalisation sacrificielle Dax : Confère <strong>+44% de Puissance des Pouvoirs</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/UmbralIntensify.png"},"wfmodprmd0000007":{"id":"wfmodprmd0000007","name":"Intensification d'Archonte","oldName":"Archon Intensify","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+30% de Puissance des Pouvoirs</strong>. Restaurer de la santé avec une aptitude accorde <strong>+30% de Puissance supplémentaire</strong> pendant 10s !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonIntensify.png"},"archon intensify":{"id":"wfmodprmd0000007","name":"Intensification d'Archonte","oldName":"Archon Intensify","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+30% de Puissance des Pouvoirs</strong>. Restaurer de la santé avec une aptitude accorde <strong>+30% de Puissance supplémentaire</strong> pendant 10s !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonIntensify.png"},"intensification d'archonte":{"id":"wfmodprmd0000007","name":"Intensification d'Archonte","oldName":"Archon Intensify","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+30% de Puissance des Pouvoirs</strong>. Restaurer de la santé avec une aptitude accorde <strong>+30% de Puissance supplémentaire</strong> pendant 10s !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonIntensify.png"},"wfmodprmd0000008":{"id":"wfmodprmd0000008","name":"Continuité d'Archonte","oldName":"Archon Continuity","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+30% de Durée des Pouvoirs</strong>. Les aptitudes qui infligent un statut de Toxine infligent aussi automatiquement un statut Corrosif !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonContinuity.png"},"archon continuity":{"id":"wfmodprmd0000008","name":"Continuité d'Archonte","oldName":"Archon Continuity","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+30% de Durée des Pouvoirs</strong>. Les aptitudes qui infligent un statut de Toxine infligent aussi automatiquement un statut Corrosif !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonContinuity.png"},"continuité d'archonte":{"id":"wfmodprmd0000008","name":"Continuité d'Archonte","oldName":"Archon Continuity","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+30% de Durée des Pouvoirs</strong>. Les aptitudes qui infligent un statut de Toxine infligent aussi automatiquement un statut Corrosif !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonContinuity.png"},"wfmodprmd0000009":{"id":"wfmodprmd0000009","name":"Allonge d'Archonte","oldName":"Archon Stretch","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+45% de Portée des Pouvoirs</strong>. Les aptitudes infligeant des dégâts d'Électricité régénèrent <strong>+2 Énergie/sec</strong> pendant 5s !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonStretch.png"},"archon stretch":{"id":"wfmodprmd0000009","name":"Allonge d'Archonte","oldName":"Archon Stretch","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+45% de Portée des Pouvoirs</strong>. Les aptitudes infligeant des dégâts d'Électricité régénèrent <strong>+2 Énergie/sec</strong> pendant 5s !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonStretch.png"},"allonge d'archonte":{"id":"wfmodprmd0000009","name":"Allonge d'Archonte","oldName":"Archon Stretch","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+45% de Portée des Pouvoirs</strong>. Les aptitudes infligeant des dégâts d'Électricité régénèrent <strong>+2 Énergie/sec</strong> pendant 5s !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonStretch.png"},"wfmodprmd0000010":{"id":"wfmodprmd0000010","name":"Vitalité d'Archonte","oldName":"Archon Vitality","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+100 de Santé Max</strong>. Les effets de statut infligeant des dégâts de Feu issus d'aptitudes se déclenchent deux fois !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonVitality.png"},"archon vitality":{"id":"wfmodprmd0000010","name":"Vitalité d'Archonte","oldName":"Archon Vitality","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+100 de Santé Max</strong>. Les effets de statut infligeant des dégâts de Feu issus d'aptitudes se déclenchent deux fois !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonVitality.png"},"vitalité d'archonte":{"id":"wfmodprmd0000010","name":"Vitalité d'Archonte","oldName":"Archon Vitality","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+100 de Santé Max</strong>. Les effets de statut infligeant des dégâts de Feu issus d'aptitudes se déclenchent deux fois !</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonVitality.png"},"wfmodprmd0000011":{"id":"wfmodprmd0000011","name":"Flux d'Archonte","oldName":"Archon Flow","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+75 d'Énergie Max</strong>. Les ennemis éliminés par des aptitudes de Froid ont 10% de chances de lâcher un Orbe d'Énergie (recharge 10s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonFlow.png"},"archon flow":{"id":"wfmodprmd0000011","name":"Flux d'Archonte","oldName":"Archon Flow","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+75 d'Énergie Max</strong>. Les ennemis éliminés par des aptitudes de Froid ont 10% de chances de lâcher un Orbe d'Énergie (recharge 10s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonFlow.png"},"flux d'archonte":{"id":"wfmodprmd0000011","name":"Flux d'Archonte","oldName":"Archon Flow","desc":"<p>Résonance de Fragment d'Archonte : Confère <strong>+75 d'Énergie Max</strong>. Les ennemis éliminés par des aptitudes de Froid ont 10% de chances de lâcher un Orbe d'Énergie (recharge 10s).</p>","img":"systems/warframe-ttrpg/asset/Mods/Warframe/ArchonFlow.png"},"wfmodrifl0000001":{"id":"wfmodrifl0000001","name":"Dentelure","oldName":"Serration","desc":"<p>Augmente les dégâts de base du fusil de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Serration.png"},"serration":{"id":"wfmodrifl0000001","name":"Dentelure","oldName":"Serration","desc":"<p>Augmente les dégâts de base du fusil de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Serration.png"},"dentelure":{"id":"wfmodrifl0000001","name":"Dentelure","oldName":"Serration","desc":"<p>Augmente les dégâts de base du fusil de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Serration.png"},"wfmodrifl0000002":{"id":"wfmodrifl0000002","name":"Chambre Divisée","oldName":"Split Chamber","desc":"<p>Confère <strong>+90% de Tir Multiple</strong>, accordant 90% de chances de tirer un projectile supplémentaire par tir.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SplitChamber.png"},"split chamber":{"id":"wfmodrifl0000002","name":"Chambre Divisée","oldName":"Split Chamber","desc":"<p>Confère <strong>+90% de Tir Multiple</strong>, accordant 90% de chances de tirer un projectile supplémentaire par tir.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SplitChamber.png"},"chambre divisée":{"id":"wfmodrifl0000002","name":"Chambre Divisée","oldName":"Split Chamber","desc":"<p>Confère <strong>+90% de Tir Multiple</strong>, accordant 90% de chances de tirer un projectile supplémentaire par tir.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SplitChamber.png"},"wfmodrifl0000003":{"id":"wfmodrifl0000003","name":"Frappe Précise","oldName":"Point Strike","desc":"<p>Augmente les Chances de Coup Critique du fusil de <strong>+150%</strong> de la valeur de base.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointStrike.png"},"point strike":{"id":"wfmodrifl0000003","name":"Frappe Précise","oldName":"Point Strike","desc":"<p>Augmente les Chances de Coup Critique du fusil de <strong>+150%</strong> de la valeur de base.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointStrike.png"},"frappe précise":{"id":"wfmodrifl0000003","name":"Frappe Précise","oldName":"Point Strike","desc":"<p>Augmente les Chances de Coup Critique du fusil de <strong>+150%</strong> de la valeur de base.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointStrike.png"},"wfmodrifl0000004":{"id":"wfmodrifl0000004","name":"Sens Vital","oldName":"Vital Sense","desc":"<p>Augmente les Dégâts Critiques du fusil de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VitalSense.png"},"vital sense":{"id":"wfmodrifl0000004","name":"Sens Vital","oldName":"Vital Sense","desc":"<p>Augmente les Dégâts Critiques du fusil de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VitalSense.png"},"sens vital":{"id":"wfmodrifl0000004","name":"Sens Vital","oldName":"Vital Sense","desc":"<p>Augmente les Dégâts Critiques du fusil de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VitalSense.png"},"wfmodrifl0000005":{"id":"wfmodrifl0000005","name":"Retard Critique","oldName":"Critical Delay","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CriticalDelay.png"},"critical delay":{"id":"wfmodrifl0000005","name":"Retard Critique","oldName":"Critical Delay","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CriticalDelay.png"},"retard critique":{"id":"wfmodrifl0000005","name":"Retard Critique","oldName":"Critical Delay","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CriticalDelay.png"},"wfmodrifl0000006":{"id":"wfmodrifl0000006","name":"Gros Calibre","oldName":"Heavy Caliber","desc":"<p>Mod Corrompu : Confère <strong>+165% de Dégâts</strong> avec une pénalité à la précision de l'arme.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HeavyCaliber.png"},"heavy caliber":{"id":"wfmodrifl0000006","name":"Gros Calibre","oldName":"Heavy Caliber","desc":"<p>Mod Corrompu : Confère <strong>+165% de Dégâts</strong> avec une pénalité à la précision de l'arme.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HeavyCaliber.png"},"gros calibre":{"id":"wfmodrifl0000006","name":"Gros Calibre","oldName":"Heavy Caliber","desc":"<p>Mod Corrompu : Confère <strong>+165% de Dégâts</strong> avec une pénalité à la précision de l'arme.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HeavyCaliber.png"},"wfmodrifl0000007":{"id":"wfmodrifl0000007","name":"Munitions du Chasseur","oldName":"Hunter Munitions","desc":"<p>Sur Coup Critique : 30% de chances d'infliger automatiquement un effet de statut Tranchant (Saignement) !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HunterMunitions.png"},"hunter munitions":{"id":"wfmodrifl0000007","name":"Munitions du Chasseur","oldName":"Hunter Munitions","desc":"<p>Sur Coup Critique : 30% de chances d'infliger automatiquement un effet de statut Tranchant (Saignement) !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HunterMunitions.png"},"munitions du chasseur":{"id":"wfmodrifl0000007","name":"Munitions du Chasseur","oldName":"Hunter Munitions","desc":"<p>Sur Coup Critique : 30% de chances d'infliger automatiquement un effet de statut Tranchant (Saignement) !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HunterMunitions.png"},"wfmodrifl0000008":{"id":"wfmodrifl0000008","name":"Coup de Marteau","oldName":"Hammer Shot","desc":"<p>Confère <strong>+60% de Dégâts Critiques</strong> et <strong>+80% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HammerShot.png"},"hammer shot":{"id":"wfmodrifl0000008","name":"Coup de Marteau","oldName":"Hammer Shot","desc":"<p>Confère <strong>+60% de Dégâts Critiques</strong> et <strong>+80% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HammerShot.png"},"coup de marteau":{"id":"wfmodrifl0000008","name":"Coup de Marteau","oldName":"Hammer Shot","desc":"<p>Confère <strong>+60% de Dégâts Critiques</strong> et <strong>+80% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HammerShot.png"},"wfmodrifl0000009":{"id":"wfmodrifl0000009","name":"Aptitude au Fusil","oldName":"Rifle Aptitude","desc":"<p>Augmente les Chances de Statut du fusil de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RifleAptitude.png"},"rifle aptitude":{"id":"wfmodrifl0000009","name":"Aptitude au Fusil","oldName":"Rifle Aptitude","desc":"<p>Augmente les Chances de Statut du fusil de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RifleAptitude.png"},"aptitude au fusil":{"id":"wfmodrifl0000009","name":"Aptitude au Fusil","oldName":"Rifle Aptitude","desc":"<p>Augmente les Chances de Statut du fusil de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RifleAptitude.png"},"wfmodrifl0000010":{"id":"wfmodrifl0000010","name":"Flammes de l'Enfer","oldName":"Hellfire","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Hellfire.png"},"hellfire":{"id":"wfmodrifl0000010","name":"Flammes de l'Enfer","oldName":"Hellfire","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Hellfire.png"},"flammes de l'enfer":{"id":"wfmodrifl0000010","name":"Flammes de l'Enfer","oldName":"Hellfire","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Hellfire.png"},"wfmodrifl0000011":{"id":"wfmodrifl0000011","name":"Balles Cryogéniques","oldName":"Cryo Rounds","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CryoRounds.png"},"cryo rounds":{"id":"wfmodrifl0000011","name":"Balles Cryogéniques","oldName":"Cryo Rounds","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CryoRounds.png"},"balles cryogéniques":{"id":"wfmodrifl0000011","name":"Balles Cryogéniques","oldName":"Cryo Rounds","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CryoRounds.png"},"wfmodrifl0000012":{"id":"wfmodrifl0000012","name":"Porteur de Tempête","oldName":"Stormbringer","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Stormbringer.png"},"stormbringer":{"id":"wfmodrifl0000012","name":"Porteur de Tempête","oldName":"Stormbringer","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Stormbringer.png"},"porteur de tempête":{"id":"wfmodrifl0000012","name":"Porteur de Tempête","oldName":"Stormbringer","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Stormbringer.png"},"wfmodrifl0000013":{"id":"wfmodrifl0000013","name":"Chargeur Infecté","oldName":"Infected Clip","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/InfectedClip.png"},"infected clip":{"id":"wfmodrifl0000013","name":"Chargeur Infecté","oldName":"Infected Clip","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/InfectedClip.png"},"chargeur infecté":{"id":"wfmodrifl0000013","name":"Chargeur Infecté","oldName":"Infected Clip","desc":"<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/InfectedClip.png"},"wfmodrifl0000014":{"id":"wfmodrifl0000014","name":"Force Maligne","oldName":"Malignant Force","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MalignantForce.png"},"malignant force":{"id":"wfmodrifl0000014","name":"Force Maligne","oldName":"Malignant Force","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MalignantForce.png"},"force maligne":{"id":"wfmodrifl0000014","name":"Force Maligne","oldName":"Malignant Force","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MalignantForce.png"},"wfmodrifl0000015":{"id":"wfmodrifl0000015","name":"Balles GivFormat","oldName":"Rime Rounds","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RimeRounds.png"},"rime rounds":{"id":"wfmodrifl0000015","name":"Balles GivFormat","oldName":"Rime Rounds","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RimeRounds.png"},"balles givformat":{"id":"wfmodrifl0000015","name":"Balles GivFormat","oldName":"Rime Rounds","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RimeRounds.png"},"wfmodrifl0000016":{"id":"wfmodrifl0000016","name":"Balles Thermite","oldName":"Thermite Rounds","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ThermiteRounds.png"},"thermite rounds":{"id":"wfmodrifl0000016","name":"Balles Thermite","oldName":"Thermite Rounds","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ThermiteRounds.png"},"balles thermite":{"id":"wfmodrifl0000016","name":"Balles Thermite","oldName":"Thermite Rounds","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ThermiteRounds.png"},"wfmodrifl0000017":{"id":"wfmodrifl0000017","name":"Haute Tension","oldName":"High Voltage","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HighVoltage.png"},"high voltage":{"id":"wfmodrifl0000017","name":"Haute Tension","oldName":"High Voltage","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HighVoltage.png"},"haute tension":{"id":"wfmodrifl0000017","name":"Haute Tension","oldName":"High Voltage","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HighVoltage.png"},"wfmodrifl0000018":{"id":"wfmodrifl0000018","name":"Gâchette Rapide","oldName":"Speed Trigger","desc":"<p>Accélère le mécanisme cyclique, conférant <strong>+60% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SpeedTrigger.png"},"speed trigger":{"id":"wfmodrifl0000018","name":"Gâchette Rapide","oldName":"Speed Trigger","desc":"<p>Accélère le mécanisme cyclique, conférant <strong>+60% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SpeedTrigger.png"},"gâchette rapide":{"id":"wfmodrifl0000018","name":"Gâchette Rapide","oldName":"Speed Trigger","desc":"<p>Accélère le mécanisme cyclique, conférant <strong>+60% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SpeedTrigger.png"},"wfmodrifl0000019":{"id":"wfmodrifl0000019","name":"Accélération Vile","oldName":"Vile Acceleration","desc":"<p>Mod Corrompu : Confère <strong>+90% de Cadence de Tir</strong>, mais réduit les Dégâts de <strong>-15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VileAcceleration.png"},"vile acceleration":{"id":"wfmodrifl0000019","name":"Accélération Vile","oldName":"Vile Acceleration","desc":"<p>Mod Corrompu : Confère <strong>+90% de Cadence de Tir</strong>, mais réduit les Dégâts de <strong>-15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VileAcceleration.png"},"accélération vile":{"id":"wfmodrifl0000019","name":"Accélération Vile","oldName":"Vile Acceleration","desc":"<p>Mod Corrompu : Confère <strong>+90% de Cadence de Tir</strong>, mais réduit les Dégâts de <strong>-15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VileAcceleration.png"},"wfmodrifl0000020":{"id":"wfmodrifl0000020","name":"Mains Lestes","oldName":"Fast Hands","desc":"<p>Augmente la Vitesse de Rechargement du fusil de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FastHands.png"},"fast hands":{"id":"wfmodrifl0000020","name":"Mains Lestes","oldName":"Fast Hands","desc":"<p>Augmente la Vitesse de Rechargement du fusil de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FastHands.png"},"mains lestes":{"id":"wfmodrifl0000020","name":"Mains Lestes","oldName":"Fast Hands","desc":"<p>Augmente la Vitesse de Rechargement du fusil de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FastHands.png"},"wfmodrifl0000021":{"id":"wfmodrifl0000021","name":"Déformation de Chargeur","oldName":"Magazine Warp","desc":"<p>Augmente la Capacité du Chargeur du fusil de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MagazineWarp.png"},"magazine warp":{"id":"wfmodrifl0000021","name":"Déformation de Chargeur","oldName":"Magazine Warp","desc":"<p>Augmente la Capacité du Chargeur du fusil de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MagazineWarp.png"},"déformation de chargeur":{"id":"wfmodrifl0000021","name":"Déformation de Chargeur","oldName":"Magazine Warp","desc":"<p>Augmente la Capacité du Chargeur du fusil de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MagazineWarp.png"},"wfmodrifl0000022":{"id":"wfmodrifl0000022","name":"Armements du Justicier","oldName":"Vigilante Armaments","desc":"<p>Confère <strong>+60% de Tir Multiple</strong> et 5% de chances d'augmenter le rang d'un coup critique.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VigilanteArmaments.png"},"vigilante armaments":{"id":"wfmodrifl0000022","name":"Armements du Justicier","oldName":"Vigilante Armaments","desc":"<p>Confère <strong>+60% de Tir Multiple</strong> et 5% de chances d'augmenter le rang d'un coup critique.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VigilanteArmaments.png"},"armements du justicier":{"id":"wfmodrifl0000022","name":"Armements du Justicier","oldName":"Vigilante Armaments","desc":"<p>Confère <strong>+60% de Tir Multiple</strong> et 5% de chances d'augmenter le rang d'un coup critique.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VigilanteArmaments.png"},"wfmodrifl0000023":{"id":"wfmodrifl0000023","name":"Salve Dentelée","oldName":"Fanged Fusillade","desc":"<p>Renforce le tranchant cinétique du fusil, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FangedFusillade.png"},"fanged fusillade":{"id":"wfmodrifl0000023","name":"Salve Dentelée","oldName":"Fanged Fusillade","desc":"<p>Renforce le tranchant cinétique du fusil, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FangedFusillade.png"},"salve dentelée":{"id":"wfmodrifl0000023","name":"Salve Dentelée","oldName":"Fanged Fusillade","desc":"<p>Renforce le tranchant cinétique du fusil, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FangedFusillade.png"},"wfmodrifl0000024":{"id":"wfmodrifl0000024","name":"Calibre Perforant","oldName":"Piercing Caliber","desc":"<p>Renforce la pénétration cinétique anti-blindage, conférant <strong>+120% de Dégâts Perforants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PiercingCaliber.png"},"piercing caliber":{"id":"wfmodrifl0000024","name":"Calibre Perforant","oldName":"Piercing Caliber","desc":"<p>Renforce la pénétration cinétique anti-blindage, conférant <strong>+120% de Dégâts Perforants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PiercingCaliber.png"},"calibre perforant":{"id":"wfmodrifl0000024","name":"Calibre Perforant","oldName":"Piercing Caliber","desc":"<p>Renforce la pénétration cinétique anti-blindage, conférant <strong>+120% de Dégâts Perforants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PiercingCaliber.png"},"wfmodrifl0000025":{"id":"wfmodrifl0000025","name":"Tir Fracassant","oldName":"Crash Shot","desc":"<p>Renforce les ondes de choc contondantes, conférant <strong>+120% de Dégâts d'Impact</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrashShot.png"},"crash shot":{"id":"wfmodrifl0000025","name":"Tir Fracassant","oldName":"Crash Shot","desc":"<p>Renforce les ondes de choc contondantes, conférant <strong>+120% de Dégâts d'Impact</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrashShot.png"},"tir fracassant":{"id":"wfmodrifl0000025","name":"Tir Fracassant","oldName":"Crash Shot","desc":"<p>Renforce les ondes de choc contondantes, conférant <strong>+120% de Dégâts d'Impact</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrashShot.png"},"wfmodrifl0000026":{"id":"wfmodrifl0000026","name":"Rechargement Irradié","oldName":"Radiated Reload","desc":"<p>Imprègne les balles de fusil de <strong>+60% de Dégâts de Radiation</strong> et améliore la Vitesse de Rechargement de <strong>+40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RadiatedReload.png"},"radiated reload":{"id":"wfmodrifl0000026","name":"Rechargement Irradié","oldName":"Radiated Reload","desc":"<p>Imprègne les balles de fusil de <strong>+60% de Dégâts de Radiation</strong> et améliore la Vitesse de Rechargement de <strong>+40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RadiatedReload.png"},"rechargement irradié":{"id":"wfmodrifl0000026","name":"Rechargement Irradié","oldName":"Radiated Reload","desc":"<p>Imprègne les balles de fusil de <strong>+60% de Dégâts de Radiation</strong> et améliore la Vitesse de Rechargement de <strong>+40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RadiatedReload.png"},"wfmodrifl0000027":{"id":"wfmodrifl0000027","name":"Balles Thermobariques","oldName":"Thermobaric Rounds","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts Explosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png"},"thermobaric rounds":{"id":"wfmodrifl0000027","name":"Balles Thermobariques","oldName":"Thermobaric Rounds","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts Explosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png"},"balles thermobariques":{"id":"wfmodrifl0000027","name":"Balles Thermobariques","oldName":"Thermobaric Rounds","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts Explosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png"},"wfmodrifl0000028":{"id":"wfmodrifl0000028","name":"Vapeur Toxique","oldName":"Toxic Vapor","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"toxic vapor":{"id":"wfmodrifl0000028","name":"Vapeur Toxique","oldName":"Toxic Vapor","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"vapeur toxique":{"id":"wfmodrifl0000028","name":"Vapeur Toxique","oldName":"Toxic Vapor","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"wfmodrifl0000029":{"id":"wfmodrifl0000029","name":"Balles Magnétiques","oldName":"Magnetic Rounds","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"magnetic rounds":{"id":"wfmodrifl0000029","name":"Balles Magnétiques","oldName":"Magnetic Rounds","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"balles magnétiques":{"id":"wfmodrifl0000029","name":"Balles Magnétiques","oldName":"Magnetic Rounds","desc":"<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"wfmodshot0000001":{"id":"wfmodshot0000001","name":"À Bout Portant","oldName":"Point Blank","desc":"<p>Augmente les dégâts de base du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointBlank.png"},"point blank":{"id":"wfmodshot0000001","name":"À Bout Portant","oldName":"Point Blank","desc":"<p>Augmente les dégâts de base du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointBlank.png"},"à bout portant":{"id":"wfmodshot0000001","name":"À Bout Portant","oldName":"Point Blank","desc":"<p>Augmente les dégâts de base du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointBlank.png"},"wfmodshot0000002":{"id":"wfmodshot0000002","name":"Chambre des Enfers","oldName":"Hell's Chamber","desc":"<p>Confère <strong>+120% de Tir Multiple</strong>, multipliant spectaculairement le nombre de plombs par décharge.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HellsChamber.png"},"hell's chamber":{"id":"wfmodshot0000002","name":"Chambre des Enfers","oldName":"Hell's Chamber","desc":"<p>Confère <strong>+120% de Tir Multiple</strong>, multipliant spectaculairement le nombre de plombs par décharge.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HellsChamber.png"},"chambre des enfers":{"id":"wfmodshot0000002","name":"Chambre des Enfers","oldName":"Hell's Chamber","desc":"<p>Confère <strong>+120% de Tir Multiple</strong>, multipliant spectaculairement le nombre de plombs par décharge.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HellsChamber.png"},"wfmodshot0000003":{"id":"wfmodshot0000003","name":"Tromblon","oldName":"Blunderbuss","desc":"<p>Augmente les Chances Critiques du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Blunderbuss.png"},"blunderbuss":{"id":"wfmodshot0000003","name":"Tromblon","oldName":"Blunderbuss","desc":"<p>Augmente les Chances Critiques du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Blunderbuss.png"},"tromblon":{"id":"wfmodshot0000003","name":"Tromblon","oldName":"Blunderbuss","desc":"<p>Augmente les Chances Critiques du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Blunderbuss.png"},"wfmodshot0000004":{"id":"wfmodshot0000004","name":"Ravage","oldName":"Ravage","desc":"<p>Augmente les Dégâts Critiques du fusil à pompe de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Ravage.png"},"ravage":{"id":"wfmodshot0000004","name":"Ravage","oldName":"Ravage","desc":"<p>Augmente les Dégâts Critiques du fusil à pompe de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Ravage.png"},"wfmodshot0000005":{"id":"wfmodshot0000005","name":"Décélération Critique","oldName":"Critical Deceleration","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CriticalDeceleration.png"},"critical deceleration":{"id":"wfmodshot0000005","name":"Décélération Critique","oldName":"Critical Deceleration","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CriticalDeceleration.png"},"décélération critique":{"id":"wfmodshot0000005","name":"Décélération Critique","oldName":"Critical Deceleration","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CriticalDeceleration.png"},"wfmodshot0000006":{"id":"wfmodshot0000006","name":"Dispersion Vicieuse","oldName":"Vicious Spread","desc":"<p>Mod Corrompu : Confère <strong>+90% de Dégâts</strong> avec une dispersion accrue des plombs.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ViciousSpread.png"},"vicious spread":{"id":"wfmodshot0000006","name":"Dispersion Vicieuse","oldName":"Vicious Spread","desc":"<p>Mod Corrompu : Confère <strong>+90% de Dégâts</strong> avec une dispersion accrue des plombs.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ViciousSpread.png"},"dispersion vicieuse":{"id":"wfmodshot0000006","name":"Dispersion Vicieuse","oldName":"Vicious Spread","desc":"<p>Mod Corrompu : Confère <strong>+90% de Dégâts</strong> avec une dispersion accrue des plombs.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ViciousSpread.png"},"wfmodshot0000007":{"id":"wfmodshot0000007","name":"Frénésie au Pompe","oldName":"Shotgun Spazz","desc":"<p>Accélère le cycle de réarmement à pompe / semi-auto, conférant <strong>+90% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShotgunSpazz.png"},"shotgun spazz":{"id":"wfmodshot0000007","name":"Frénésie au Pompe","oldName":"Shotgun Spazz","desc":"<p>Accélère le cycle de réarmement à pompe / semi-auto, conférant <strong>+90% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShotgunSpazz.png"},"frénésie au pompe":{"id":"wfmodshot0000007","name":"Frénésie au Pompe","oldName":"Shotgun Spazz","desc":"<p>Accélère le cycle de réarmement à pompe / semi-auto, conférant <strong>+90% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShotgunSpazz.png"},"wfmodshot0000008":{"id":"wfmodshot0000008","name":"Maîtrise du Pompe","oldName":"Shotgun Savvy","desc":"<p>Augmente les Chances de Statut du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShotgunSavvy.png"},"shotgun savvy":{"id":"wfmodshot0000008","name":"Maîtrise du Pompe","oldName":"Shotgun Savvy","desc":"<p>Augmente les Chances de Statut du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShotgunSavvy.png"},"maîtrise du pompe":{"id":"wfmodshot0000008","name":"Maîtrise du Pompe","oldName":"Shotgun Savvy","desc":"<p>Augmente les Chances de Statut du fusil à pompe de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShotgunSavvy.png"},"wfmodshot0000009":{"id":"wfmodshot0000009","name":"Revêtement Incendiaire","oldName":"Incendiary Coat","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/IncendiaryCoat.png"},"incendiary coat":{"id":"wfmodshot0000009","name":"Revêtement Incendiaire","oldName":"Incendiary Coat","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/IncendiaryCoat.png"},"revêtement incendiaire":{"id":"wfmodshot0000009","name":"Revêtement Incendiaire","oldName":"Incendiary Coat","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/IncendiaryCoat.png"},"wfmodshot0000010":{"id":"wfmodshot0000010","name":"Étreinte Glaciale","oldName":"Chilling Grasp","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ChillingGrasp.png"},"chilling grasp":{"id":"wfmodshot0000010","name":"Étreinte Glaciale","oldName":"Chilling Grasp","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ChillingGrasp.png"},"étreinte glaciale":{"id":"wfmodshot0000010","name":"Étreinte Glaciale","oldName":"Chilling Grasp","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ChillingGrasp.png"},"wfmodshot0000011":{"id":"wfmodshot0000011","name":"Cartouche Chargée","oldName":"Charged Shell","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ChargedShell.png"},"charged shell":{"id":"wfmodshot0000011","name":"Cartouche Chargée","oldName":"Charged Shell","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ChargedShell.png"},"cartouche chargée":{"id":"wfmodshot0000011","name":"Cartouche Chargée","oldName":"Charged Shell","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ChargedShell.png"},"wfmodshot0000012":{"id":"wfmodshot0000012","name":"Dispersion Contagieuse","oldName":"Contagious Spread","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ContagiousSpread.png"},"contagious spread":{"id":"wfmodshot0000012","name":"Dispersion Contagieuse","oldName":"Contagious Spread","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ContagiousSpread.png"},"dispersion contagieuse":{"id":"wfmodshot0000012","name":"Dispersion Contagieuse","oldName":"Contagious Spread","desc":"<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ContagiousSpread.png"},"wfmodshot0000013":{"id":"wfmodshot0000013","name":"Barrage Toxique","oldName":"Toxic Barrage","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ToxicBarrage.png"},"toxic barrage":{"id":"wfmodshot0000013","name":"Barrage Toxique","oldName":"Toxic Barrage","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ToxicBarrage.png"},"barrage toxique":{"id":"wfmodshot0000013","name":"Barrage Toxique","oldName":"Toxic Barrage","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ToxicBarrage.png"},"wfmodshot0000014":{"id":"wfmodshot0000014","name":"Souffle Frigide","oldName":"Frigid Blast","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FrigidBlast.png"},"frigid blast":{"id":"wfmodshot0000014","name":"Souffle Frigide","oldName":"Frigid Blast","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FrigidBlast.png"},"souffle frigide":{"id":"wfmodshot0000014","name":"Souffle Frigide","oldName":"Frigid Blast","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FrigidBlast.png"},"wfmodshot0000015":{"id":"wfmodshot0000015","name":"Enfer Dispersé","oldName":"Scattering Inferno","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ScatteringInferno.png"},"scattering inferno":{"id":"wfmodshot0000015","name":"Enfer Dispersé","oldName":"Scattering Inferno","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ScatteringInferno.png"},"enfer dispersé":{"id":"wfmodshot0000015","name":"Enfer Dispersé","oldName":"Scattering Inferno","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ScatteringInferno.png"},"wfmodshot0000016":{"id":"wfmodshot0000016","name":"Choc de Cartouche","oldName":"Shell Shock","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShellShock.png"},"shell shock":{"id":"wfmodshot0000016","name":"Choc de Cartouche","oldName":"Shell Shock","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShellShock.png"},"choc de cartouche":{"id":"wfmodshot0000016","name":"Choc de Cartouche","oldName":"Shell Shock","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShellShock.png"},"wfmodshot0000017":{"id":"wfmodshot0000017","name":"Pompe Tactique","oldName":"Tactical Pump","desc":"<p>Augmente la Vitesse de Rechargement du fusil à pompe de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TacticalPump.png"},"tactical pump":{"id":"wfmodshot0000017","name":"Pompe Tactique","oldName":"Tactical Pump","desc":"<p>Augmente la Vitesse de Rechargement du fusil à pompe de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TacticalPump.png"},"pompe tactique":{"id":"wfmodshot0000017","name":"Pompe Tactique","oldName":"Tactical Pump","desc":"<p>Augmente la Vitesse de Rechargement du fusil à pompe de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TacticalPump.png"},"wfmodshot0000018":{"id":"wfmodshot0000018","name":"Stock de Munitions","oldName":"Ammo Stock","desc":"<p>Augmente la Capacité du Chargeur du fusil à pompe de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AmmoStock.png"},"ammo stock":{"id":"wfmodshot0000018","name":"Stock de Munitions","oldName":"Ammo Stock","desc":"<p>Augmente la Capacité du Chargeur du fusil à pompe de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AmmoStock.png"},"stock de munitions":{"id":"wfmodshot0000018","name":"Stock de Munitions","oldName":"Ammo Stock","desc":"<p>Augmente la Capacité du Chargeur du fusil à pompe de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AmmoStock.png"},"wfmodshot0000019":{"id":"wfmodshot0000019","name":"Dentelure Balayante","oldName":"Sweeping Serration","desc":"<p>Renforce le pouvoir de déchiquetage, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SweepingSerration.png"},"sweeping serration":{"id":"wfmodshot0000019","name":"Dentelure Balayante","oldName":"Sweeping Serration","desc":"<p>Renforce le pouvoir de déchiquetage, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SweepingSerration.png"},"dentelure balayante":{"id":"wfmodshot0000019","name":"Dentelure Balayante","oldName":"Sweeping Serration","desc":"<p>Renforce le pouvoir de déchiquetage, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SweepingSerration.png"},"wfmodshot0000020":{"id":"wfmodshot0000020","name":"Flambée","oldName":"Blaze","desc":"<p>Confère <strong>+60% de Dégâts de Base</strong> et <strong>+60% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Blaze.png"},"blaze":{"id":"wfmodshot0000020","name":"Flambée","oldName":"Blaze","desc":"<p>Confère <strong>+60% de Dégâts de Base</strong> et <strong>+60% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Blaze.png"},"flambée":{"id":"wfmodshot0000020","name":"Flambée","oldName":"Blaze","desc":"<p>Confère <strong>+60% de Dégâts de Base</strong> et <strong>+60% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Blaze.png"},"wfmodshot0000021":{"id":"wfmodshot0000021","name":"Dispersion Corrosive","oldName":"Corrosive Spread","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"corrosive spread":{"id":"wfmodshot0000021","name":"Dispersion Corrosive","oldName":"Corrosive Spread","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"dispersion corrosive":{"id":"wfmodshot0000021","name":"Dispersion Corrosive","oldName":"Corrosive Spread","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"wfmodshot0000022":{"id":"wfmodshot0000022","name":"Balle Lourde Radiative","oldName":"Radiation Slug","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"radiation slug":{"id":"wfmodshot0000022","name":"Balle Lourde Radiative","oldName":"Radiation Slug","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"balle lourde radiative":{"id":"wfmodshot0000022","name":"Balle Lourde Radiative","oldName":"Radiation Slug","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"wfmodshot0000023":{"id":"wfmodshot0000023","name":"Injection Virale","oldName":"Viral Injection","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"viral injection":{"id":"wfmodshot0000023","name":"Injection Virale","oldName":"Viral Injection","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"injection virale":{"id":"wfmodshot0000023","name":"Injection Virale","oldName":"Viral Injection","desc":"<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"wfmodpist0000001":{"id":"wfmodpist0000001","name":"Frappe Frelon","oldName":"Hornet Strike","desc":"<p>Augmente les dégâts de base de l'arme secondaire de <strong>+220%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HornetStrike.png"},"hornet strike":{"id":"wfmodpist0000001","name":"Frappe Frelon","oldName":"Hornet Strike","desc":"<p>Augmente les dégâts de base de l'arme secondaire de <strong>+220%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HornetStrike.png"},"frappe frelon":{"id":"wfmodpist0000001","name":"Frappe Frelon","oldName":"Hornet Strike","desc":"<p>Augmente les dégâts de base de l'arme secondaire de <strong>+220%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HornetStrike.png"},"wfmodpist0000002":{"id":"wfmodpist0000002","name":"Diffusion de Canon","oldName":"Barrel Diffusion","desc":"<p>Confère <strong>+120% de Tir Multiple</strong> aux pistolets.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BarrelDiffusion.png"},"barrel diffusion":{"id":"wfmodpist0000002","name":"Diffusion de Canon","oldName":"Barrel Diffusion","desc":"<p>Confère <strong>+120% de Tir Multiple</strong> aux pistolets.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BarrelDiffusion.png"},"diffusion de canon":{"id":"wfmodpist0000002","name":"Diffusion de Canon","oldName":"Barrel Diffusion","desc":"<p>Confère <strong>+120% de Tir Multiple</strong> aux pistolets.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BarrelDiffusion.png"},"wfmodpist0000003":{"id":"wfmodpist0000003","name":"Torrent Léthal","oldName":"Lethal Torrent","desc":"<p>Double amélioration de combat : Confère <strong>+60% de Cadence de Tir</strong> et <strong>+60% de Tir Multiple</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LethalTorrent.png"},"lethal torrent":{"id":"wfmodpist0000003","name":"Torrent Léthal","oldName":"Lethal Torrent","desc":"<p>Double amélioration de combat : Confère <strong>+60% de Cadence de Tir</strong> et <strong>+60% de Tir Multiple</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LethalTorrent.png"},"torrent léthal":{"id":"wfmodpist0000003","name":"Torrent Léthal","oldName":"Lethal Torrent","desc":"<p>Double amélioration de combat : Confère <strong>+60% de Cadence de Tir</strong> et <strong>+60% de Tir Multiple</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LethalTorrent.png"},"wfmodpist0000004":{"id":"wfmodpist0000004","name":"Gambit du Pistolet","oldName":"Pistol Gambit","desc":"<p>Augmente les Chances Critiques du pistolet de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PistolGambit.png"},"pistol gambit":{"id":"wfmodpist0000004","name":"Gambit du Pistolet","oldName":"Pistol Gambit","desc":"<p>Augmente les Chances Critiques du pistolet de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PistolGambit.png"},"gambit du pistolet":{"id":"wfmodpist0000004","name":"Gambit du Pistolet","oldName":"Pistol Gambit","desc":"<p>Augmente les Chances Critiques du pistolet de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PistolGambit.png"},"wfmodpist0000005":{"id":"wfmodpist0000005","name":"Fracasseur de Cibles","oldName":"Target Cracker","desc":"<p>Augmente les Dégâts Critiques du pistolet de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TargetCracker.png"},"target cracker":{"id":"wfmodpist0000005","name":"Fracasseur de Cibles","oldName":"Target Cracker","desc":"<p>Augmente les Dégâts Critiques du pistolet de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TargetCracker.png"},"fracasseur de cibles":{"id":"wfmodpist0000005","name":"Fracasseur de Cibles","oldName":"Target Cracker","desc":"<p>Augmente les Dégâts Critiques du pistolet de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TargetCracker.png"},"wfmodpist0000006":{"id":"wfmodpist0000006","name":"Œil-de-Bœuf Rampant","oldName":"Creeping Bullseye","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CreepingBullseye.png"},"creeping bullseye":{"id":"wfmodpist0000006","name":"Œil-de-Bœuf Rampant","oldName":"Creeping Bullseye","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CreepingBullseye.png"},"œil-de-bœuf rampant":{"id":"wfmodpist0000006","name":"Œil-de-Bœuf Rampant","oldName":"Creeping Bullseye","desc":"<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CreepingBullseye.png"},"wfmodpist0000007":{"id":"wfmodpist0000007","name":"Puissance Magnum","oldName":"Magnum Force","desc":"<p>Mod Corrompu : Confère <strong>+165% de Dégâts</strong> avec une précision réduite.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MagnumForce.png"},"magnum force":{"id":"wfmodpist0000007","name":"Puissance Magnum","oldName":"Magnum Force","desc":"<p>Mod Corrompu : Confère <strong>+165% de Dégâts</strong> avec une précision réduite.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MagnumForce.png"},"puissance magnum":{"id":"wfmodpist0000007","name":"Puissance Magnum","oldName":"Magnum Force","desc":"<p>Mod Corrompu : Confère <strong>+165% de Dégâts</strong> avec une précision réduite.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MagnumForce.png"},"wfmodpist0000008":{"id":"wfmodpist0000008","name":"Tir Assuré","oldName":"Sure Shot","desc":"<p>Augmente les Chances de Statut du pistolet de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SureShot.png"},"sure shot":{"id":"wfmodpist0000008","name":"Tir Assuré","oldName":"Sure Shot","desc":"<p>Augmente les Chances de Statut du pistolet de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SureShot.png"},"tir assuré":{"id":"wfmodpist0000008","name":"Tir Assuré","oldName":"Sure Shot","desc":"<p>Augmente les Chances de Statut du pistolet de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SureShot.png"},"wfmodpist0000009":{"id":"wfmodpist0000009","name":"Charge Chauffée","oldName":"Heated Charge","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HeatedCharge.png"},"heated charge":{"id":"wfmodpist0000009","name":"Charge Chauffée","oldName":"Heated Charge","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HeatedCharge.png"},"charge chauffée":{"id":"wfmodpist0000009","name":"Charge Chauffée","oldName":"Heated Charge","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HeatedCharge.png"},"wfmodpist0000010":{"id":"wfmodpist0000010","name":"Gel Profond","oldName":"Deep Freeze","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DeepFreeze.png"},"deep freeze":{"id":"wfmodpist0000010","name":"Gel Profond","oldName":"Deep Freeze","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DeepFreeze.png"},"gel profond":{"id":"wfmodpist0000010","name":"Gel Profond","oldName":"Deep Freeze","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DeepFreeze.png"},"wfmodpist0000011":{"id":"wfmodpist0000011","name":"Convulsion","oldName":"Convulsion","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Convulsion.png"},"convulsion":{"id":"wfmodpist0000011","name":"Convulsion","oldName":"Convulsion","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Convulsion.png"},"wfmodpist0000012":{"id":"wfmodpist0000012","name":"Balles Pathogènes","oldName":"Pathogen Rounds","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PathogenRounds.png"},"pathogen rounds":{"id":"wfmodpist0000012","name":"Balles Pathogènes","oldName":"Pathogen Rounds","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PathogenRounds.png"},"balles pathogènes":{"id":"wfmodpist0000012","name":"Balles Pathogènes","oldName":"Pathogen Rounds","desc":"<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PathogenRounds.png"},"wfmodpist0000013":{"id":"wfmodpist0000013","name":"Peste au Pistolet","oldName":"Pistol Pestilence","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PistolPestilence.png"},"pistol pestilence":{"id":"wfmodpist0000013","name":"Peste au Pistolet","oldName":"Pistol Pestilence","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PistolPestilence.png"},"peste au pistolet":{"id":"wfmodpist0000013","name":"Peste au Pistolet","oldName":"Pistol Pestilence","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PistolPestilence.png"},"wfmodpist0000014":{"id":"wfmodpist0000014","name":"Gelure","oldName":"Frostbite","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Frostbite.png"},"frostbite":{"id":"wfmodpist0000014","name":"Gelure","oldName":"Frostbite","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Frostbite.png"},"gelure":{"id":"wfmodpist0000014","name":"Gelure","oldName":"Frostbite","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Frostbite.png"},"wfmodpist0000015":{"id":"wfmodpist0000015","name":"Roussir","oldName":"Scorch","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Scorch.png"},"scorch":{"id":"wfmodpist0000015","name":"Roussir","oldName":"Scorch","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Scorch.png"},"roussir":{"id":"wfmodpist0000015","name":"Roussir","oldName":"Scorch","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Scorch.png"},"wfmodpist0000016":{"id":"wfmodpist0000016","name":"Secousse","oldName":"Jolt","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Jolt.png"},"jolt":{"id":"wfmodpist0000016","name":"Secousse","oldName":"Jolt","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Jolt.png"},"secousse":{"id":"wfmodpist0000016","name":"Secousse","oldName":"Jolt","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Jolt.png"},"wfmodpist0000017":{"id":"wfmodpist0000017","name":"Pistolero","oldName":"Gunslinger","desc":"<p>Déclenchement rapide de la détente conférant <strong>+72% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Gunslinger.png"},"gunslinger":{"id":"wfmodpist0000017","name":"Pistolero","oldName":"Gunslinger","desc":"<p>Déclenchement rapide de la détente conférant <strong>+72% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Gunslinger.png"},"pistolero":{"id":"wfmodpist0000017","name":"Pistolero","oldName":"Gunslinger","desc":"<p>Déclenchement rapide de la détente conférant <strong>+72% de Cadence de Tir</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Gunslinger.png"},"wfmodpist0000018":{"id":"wfmodpist0000018","name":"Agilité Anémique","oldName":"Anemic Agility","desc":"<p>Mod Corrompu : Confère <strong>+90% de Cadence de Tir</strong>, mais réduit les Dégâts de <strong>-15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AnemicAgility.png"},"anemic agility":{"id":"wfmodpist0000018","name":"Agilité Anémique","oldName":"Anemic Agility","desc":"<p>Mod Corrompu : Confère <strong>+90% de Cadence de Tir</strong>, mais réduit les Dégâts de <strong>-15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AnemicAgility.png"},"agilité anémique":{"id":"wfmodpist0000018","name":"Agilité Anémique","oldName":"Anemic Agility","desc":"<p>Mod Corrompu : Confère <strong>+90% de Cadence de Tir</strong>, mais réduit les Dégâts de <strong>-15%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AnemicAgility.png"},"wfmodpist0000019":{"id":"wfmodpist0000019","name":"Dégainement Rapide","oldName":"Quickdraw","desc":"<p>Augmente la Vitesse de Rechargement du pistolet de <strong>+48%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Quickdraw.png"},"quickdraw":{"id":"wfmodpist0000019","name":"Dégainement Rapide","oldName":"Quickdraw","desc":"<p>Augmente la Vitesse de Rechargement du pistolet de <strong>+48%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Quickdraw.png"},"dégainement rapide":{"id":"wfmodpist0000019","name":"Dégainement Rapide","oldName":"Quickdraw","desc":"<p>Augmente la Vitesse de Rechargement du pistolet de <strong>+48%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Quickdraw.png"},"wfmodpist0000020":{"id":"wfmodpist0000020","name":"Chargeur Glissant","oldName":"Slip Magazine","desc":"<p>Augmente la Capacité du Chargeur du pistolet de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SlipMagazine.png"},"slip magazine":{"id":"wfmodpist0000020","name":"Chargeur Glissant","oldName":"Slip Magazine","desc":"<p>Augmente la Capacité du Chargeur du pistolet de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SlipMagazine.png"},"chargeur glissant":{"id":"wfmodpist0000020","name":"Chargeur Glissant","oldName":"Slip Magazine","desc":"<p>Augmente la Capacité du Chargeur du pistolet de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SlipMagazine.png"},"wfmodpist0000021":{"id":"wfmodpist0000021","name":"Mutilation","oldName":"Maim","desc":"<p>Renforce le déchirement balistique, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Maim.png"},"maim":{"id":"wfmodpist0000021","name":"Mutilation","oldName":"Maim","desc":"<p>Renforce le déchirement balistique, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Maim.png"},"mutilation":{"id":"wfmodpist0000021","name":"Mutilation","oldName":"Maim","desc":"<p>Renforce le déchirement balistique, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Maim.png"},"wfmodpist0000022":{"id":"wfmodpist0000022","name":"Charge Radiative","oldName":"Radiation Charge","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"radiation charge":{"id":"wfmodpist0000022","name":"Charge Radiative","oldName":"Radiation Charge","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"charge radiative":{"id":"wfmodpist0000022","name":"Charge Radiative","oldName":"Radiation Charge","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"wfmodpist0000023":{"id":"wfmodpist0000023","name":"Balles Acides","oldName":"Acidic Rounds","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"acidic rounds":{"id":"wfmodpist0000023","name":"Balles Acides","oldName":"Acidic Rounds","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"balles acides":{"id":"wfmodpist0000023","name":"Balles Acides","oldName":"Acidic Rounds","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"wfmodpist0000024":{"id":"wfmodpist0000024","name":"Givre Pathogène","oldName":"Pathogenic Frost","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"pathogenic frost":{"id":"wfmodpist0000024","name":"Givre Pathogène","oldName":"Pathogenic Frost","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"givre pathogène":{"id":"wfmodpist0000024","name":"Givre Pathogène","oldName":"Pathogenic Frost","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"wfmodpist0000025":{"id":"wfmodpist0000025","name":"Frisson Électrostatique","oldName":"Electrostatic Chill","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"electrostatic chill":{"id":"wfmodpist0000025","name":"Frisson Électrostatique","oldName":"Electrostatic Chill","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"frisson électrostatique":{"id":"wfmodpist0000025","name":"Frisson Électrostatique","oldName":"Electrostatic Chill","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"wfmodpist0000026":{"id":"wfmodpist0000026","name":"Nuage de Vapeur","oldName":"Vapor Cloud","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"vapor cloud":{"id":"wfmodpist0000026","name":"Nuage de Vapeur","oldName":"Vapor Cloud","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"nuage de vapeur":{"id":"wfmodpist0000026","name":"Nuage de Vapeur","oldName":"Vapor Cloud","desc":"<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"wfmodmelc0000001":{"id":"wfmodmelc0000001","name":"Point de Pression","oldName":"Pressure Point","desc":"<p>Augmente les dégâts des frappes de mêlée de base de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PressurePoint.png"},"pressure point":{"id":"wfmodmelc0000001","name":"Point de Pression","oldName":"Pressure Point","desc":"<p>Augmente les dégâts des frappes de mêlée de base de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PressurePoint.png"},"point de pression":{"id":"wfmodmelc0000001","name":"Point de Pression","oldName":"Pressure Point","desc":"<p>Augmente les dégâts des frappes de mêlée de base de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PressurePoint.png"},"wfmodmelc0000002":{"id":"wfmodmelc0000002","name":"Surcharge d'État","oldName":"Condition Overload","desc":"<p>Augmente les Dégâts de Mêlée de <strong>+80% pour chaque Type de Statut unique</strong> affectant activement la cible !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ConditionOverload.png"},"condition overload":{"id":"wfmodmelc0000002","name":"Surcharge d'État","oldName":"Condition Overload","desc":"<p>Augmente les Dégâts de Mêlée de <strong>+80% pour chaque Type de Statut unique</strong> affectant activement la cible !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ConditionOverload.png"},"surcharge d'état":{"id":"wfmodmelc0000002","name":"Surcharge d'État","oldName":"Condition Overload","desc":"<p>Augmente les Dégâts de Mêlée de <strong>+80% pour chaque Type de Statut unique</strong> affectant activement la cible !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ConditionOverload.png"},"wfmodmelc0000003":{"id":"wfmodmelc0000003","name":"Véritable Acier","oldName":"True Steel","desc":"<p>Augmente les Chances Critiques en mêlée de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TrueSteel.png"},"true steel":{"id":"wfmodmelc0000003","name":"Véritable Acier","oldName":"True Steel","desc":"<p>Augmente les Chances Critiques en mêlée de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TrueSteel.png"},"véritable acier":{"id":"wfmodmelc0000003","name":"Véritable Acier","oldName":"True Steel","desc":"<p>Augmente les Chances Critiques en mêlée de <strong>+120%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TrueSteel.png"},"wfmodmelc0000004":{"id":"wfmodmelc0000004","name":"Afflux de Sang","oldName":"Blood Rush","desc":"<p>Maîtrise martiale conférant <strong>+40% de Chances Critiques par niveau de Compteur de Combo</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BloodRush.png"},"blood rush":{"id":"wfmodmelc0000004","name":"Afflux de Sang","oldName":"Blood Rush","desc":"<p>Maîtrise martiale conférant <strong>+40% de Chances Critiques par niveau de Compteur de Combo</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BloodRush.png"},"afflux de sang":{"id":"wfmodmelc0000004","name":"Afflux de Sang","oldName":"Blood Rush","desc":"<p>Maîtrise martiale conférant <strong>+40% de Chances Critiques par niveau de Compteur de Combo</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BloodRush.png"},"wfmodmelc0000005":{"id":"wfmodmelc0000005","name":"Broie-Organes","oldName":"Organ Shatter","desc":"<p>Augmente les Dégâts Critiques en mêlée de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/OrganShatter.png"},"organ shatter":{"id":"wfmodmelc0000005","name":"Broie-Organes","oldName":"Organ Shatter","desc":"<p>Augmente les Dégâts Critiques en mêlée de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/OrganShatter.png"},"broie-organes":{"id":"wfmodmelc0000005","name":"Broie-Organes","oldName":"Organ Shatter","desc":"<p>Augmente les Dégâts Critiques en mêlée de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/OrganShatter.png"},"wfmodmelc0000006":{"id":"wfmodmelc0000006","name":"Puissance du Gladiateur","oldName":"Gladiator Might","desc":"<p>Confère <strong>+60% de Dégâts Critiques</strong> et +10% de Chances Critiques par niveau de combo.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GladiatorMight.png"},"gladiator might":{"id":"wfmodmelc0000006","name":"Puissance du Gladiateur","oldName":"Gladiator Might","desc":"<p>Confère <strong>+60% de Dégâts Critiques</strong> et +10% de Chances Critiques par niveau de combo.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GladiatorMight.png"},"puissance du gladiateur":{"id":"wfmodmelc0000006","name":"Puissance du Gladiateur","oldName":"Gladiator Might","desc":"<p>Confère <strong>+60% de Dégâts Critiques</strong> et +10% de Chances Critiques par niveau de combo.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GladiatorMight.png"},"wfmodmelc0000007":{"id":"wfmodmelc0000007","name":"Plaies Suintantes","oldName":"Weeping Wounds","desc":"<p>Augmente les Chances de Statut en mêlée de <strong>+40% par niveau de Compteur de Combo</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/WeepingWounds.png"},"weeping wounds":{"id":"wfmodmelc0000007","name":"Plaies Suintantes","oldName":"Weeping Wounds","desc":"<p>Augmente les Chances de Statut en mêlée de <strong>+40% par niveau de Compteur de Combo</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/WeepingWounds.png"},"plaies suintantes":{"id":"wfmodmelc0000007","name":"Plaies Suintantes","oldName":"Weeping Wounds","desc":"<p>Augmente les Chances de Statut en mêlée de <strong>+40% par niveau de Compteur de Combo</strong> !</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/WeepingWounds.png"},"wfmodmelc0000008":{"id":"wfmodmelc0000008","name":"Prouesse en Mêlée","oldName":"Melee Prowess","desc":"<p>Augmente les Chances de Statut en mêlée de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MeleeProwess.png"},"melee prowess":{"id":"wfmodmelc0000008","name":"Prouesse en Mêlée","oldName":"Melee Prowess","desc":"<p>Augmente les Chances de Statut en mêlée de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MeleeProwess.png"},"prouesse en mêlée":{"id":"wfmodmelc0000008","name":"Prouesse en Mêlée","oldName":"Melee Prowess","desc":"<p>Augmente les Chances de Statut en mêlée de <strong>+90%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MeleeProwess.png"},"wfmodmelc0000009":{"id":"wfmodmelc0000009","name":"Furie","oldName":"Fury","desc":"<p>Augmente la Vitesse d'Attaque en mêlée de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Fury.png"},"fury":{"id":"wfmodmelc0000009","name":"Furie","oldName":"Fury","desc":"<p>Augmente la Vitesse d'Attaque en mêlée de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Fury.png"},"furie":{"id":"wfmodmelc0000009","name":"Furie","oldName":"Fury","desc":"<p>Augmente la Vitesse d'Attaque en mêlée de <strong>+30%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Fury.png"},"wfmodmelc0000010":{"id":"wfmodmelc0000010","name":"Furie Berserker","oldName":"Berserker Fury","desc":"<p>Sur Élimination en Mêlée : Confère <strong>+70% de Vitesse d'Attaque</strong> pendant 10 secondes.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BerserkerFury.png"},"berserker fury":{"id":"wfmodmelc0000010","name":"Furie Berserker","oldName":"Berserker Fury","desc":"<p>Sur Élimination en Mêlée : Confère <strong>+70% de Vitesse d'Attaque</strong> pendant 10 secondes.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BerserkerFury.png"},"furie berserker":{"id":"wfmodmelc0000010","name":"Furie Berserker","oldName":"Berserker Fury","desc":"<p>Sur Élimination en Mêlée : Confère <strong>+70% de Vitesse d'Attaque</strong> pendant 10 secondes.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BerserkerFury.png"},"wfmodmelc0000011":{"id":"wfmodmelc0000011","name":"Accélération","oldName":"Quickening","desc":"<p>Confère <strong>+40% de Vitesse d'Attaque</strong> et accélère la génération de combo.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Quickening.png"},"quickening":{"id":"wfmodmelc0000011","name":"Accélération","oldName":"Quickening","desc":"<p>Confère <strong>+40% de Vitesse d'Attaque</strong> et accélère la génération de combo.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Quickening.png"},"accélération":{"id":"wfmodmelc0000011","name":"Accélération","oldName":"Quickening","desc":"<p>Confère <strong>+40% de Vitesse d'Attaque</strong> et accélère la génération de combo.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Quickening.png"},"wfmodmelc0000012":{"id":"wfmodmelc0000012","name":"Allonge","oldName":"Reach","desc":"<p>Étend la portée des attaques de mêlée de <strong>+5 feet (1,5 m)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Reach.png"},"reach":{"id":"wfmodmelc0000012","name":"Allonge","oldName":"Reach","desc":"<p>Étend la portée des attaques de mêlée de <strong>+5 feet (1,5 m)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Reach.png"},"wfmodmelc0000013":{"id":"wfmodmelc0000013","name":"Impact Fusionnel","oldName":"Molten Impact","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MoltenImpact.png"},"molten impact":{"id":"wfmodmelc0000013","name":"Impact Fusionnel","oldName":"Molten Impact","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MoltenImpact.png"},"impact fusionnel":{"id":"wfmodmelc0000013","name":"Impact Fusionnel","oldName":"Molten Impact","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/MoltenImpact.png"},"wfmodmelc0000014":{"id":"wfmodmelc0000014","name":"Vent du Nord","oldName":"North Wind","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/NorthWind.png"},"north wind":{"id":"wfmodmelc0000014","name":"Vent du Nord","oldName":"North Wind","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/NorthWind.png"},"vent du nord":{"id":"wfmodmelc0000014","name":"Vent du Nord","oldName":"North Wind","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/NorthWind.png"},"wfmodmelc0000015":{"id":"wfmodmelc0000015","name":"Contact Choquant","oldName":"Shocking Touch","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShockingTouch.png"},"shocking touch":{"id":"wfmodmelc0000015","name":"Contact Choquant","oldName":"Shocking Touch","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShockingTouch.png"},"contact choquant":{"id":"wfmodmelc0000015","name":"Contact Choquant","oldName":"Shocking Touch","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts Électriques</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShockingTouch.png"},"wfmodmelc0000016":{"id":"wfmodmelc0000016","name":"Frappe de Fièvre","oldName":"Fever Strike","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FeverStrike.png"},"fever strike":{"id":"wfmodmelc0000016","name":"Frappe de Fièvre","oldName":"Fever Strike","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FeverStrike.png"},"frappe de fièvre":{"id":"wfmodmelc0000016","name":"Frappe de Fièvre","oldName":"Fever Strike","desc":"<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FeverStrike.png"},"wfmodmelc0000017":{"id":"wfmodmelc0000017","name":"Fléau Virulent","oldName":"Virulent Scourge","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VirulentScourge.png"},"virulent scourge":{"id":"wfmodmelc0000017","name":"Fléau Virulent","oldName":"Virulent Scourge","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VirulentScourge.png"},"fléau virulent":{"id":"wfmodmelc0000017","name":"Fléau Virulent","oldName":"Virulent Scourge","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VirulentScourge.png"},"wfmodmelc0000018":{"id":"wfmodmelc0000018","name":"Givre Vicieux","oldName":"Vicious Frost","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ViciousFrost.png"},"vicious frost":{"id":"wfmodmelc0000018","name":"Givre Vicieux","oldName":"Vicious Frost","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ViciousFrost.png"},"givre vicieux":{"id":"wfmodmelc0000018","name":"Givre Vicieux","oldName":"Vicious Frost","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ViciousFrost.png"},"wfmodmelc0000019":{"id":"wfmodmelc0000019","name":"Fil Volcanique","oldName":"Volcanic Edge","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VolcanicEdge.png"},"volcanic edge":{"id":"wfmodmelc0000019","name":"Fil Volcanique","oldName":"Volcanic Edge","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VolcanicEdge.png"},"fil volcanique":{"id":"wfmodmelc0000019","name":"Fil Volcanique","oldName":"Volcanic Edge","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VolcanicEdge.png"},"wfmodmelc0000020":{"id":"wfmodmelc0000020","name":"Frappe Voltaïque","oldName":"Voltaic Strike","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VoltaicStrike.png"},"voltaic strike":{"id":"wfmodmelc0000020","name":"Frappe Voltaïque","oldName":"Voltaic Strike","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VoltaicStrike.png"},"frappe voltaïque":{"id":"wfmodmelc0000020","name":"Frappe Voltaïque","oldName":"Voltaic Strike","desc":"<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VoltaicStrike.png"},"wfmodmelc0000021":{"id":"wfmodmelc0000021","name":"Coup Mortel","oldName":"Killing Blow","desc":"<p>Confère <strong>+120% de Dégâts d'Attaque Lourde</strong> et accélère l'exécution des attaques lourdes.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/KillingBlow.png"},"killing blow":{"id":"wfmodmelc0000021","name":"Coup Mortel","oldName":"Killing Blow","desc":"<p>Confère <strong>+120% de Dégâts d'Attaque Lourde</strong> et accélère l'exécution des attaques lourdes.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/KillingBlow.png"},"coup mortel":{"id":"wfmodmelc0000021","name":"Coup Mortel","oldName":"Killing Blow","desc":"<p>Confère <strong>+120% de Dégâts d'Attaque Lourde</strong> et accélère l'exécution des attaques lourdes.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/KillingBlow.png"},"wfmodmelc0000022":{"id":"wfmodmelc0000022","name":"Charge Corrompue","oldName":"Corrupt Charge","desc":"<p>Mod Corrompu : Confère <strong>+30 au Compteur Initial de Combo</strong> dès le dégainement.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CorruptCharge.png"},"corrupt charge":{"id":"wfmodmelc0000022","name":"Charge Corrompue","oldName":"Corrupt Charge","desc":"<p>Mod Corrompu : Confère <strong>+30 au Compteur Initial de Combo</strong> dès le dégainement.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CorruptCharge.png"},"charge corrompue":{"id":"wfmodmelc0000022","name":"Charge Corrompue","oldName":"Corrupt Charge","desc":"<p>Mod Corrompu : Confère <strong>+30 au Compteur Initial de Combo</strong> dès le dégainement.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CorruptCharge.png"},"wfmodmelc0000023":{"id":"wfmodmelc0000023","name":"Contact Dérivant","oldName":"Drifting Contact","desc":"<p>Augmente la Durée du Combo de <strong>+10s</strong> et confère <strong>+40% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DriftingContact.png"},"drifting contact":{"id":"wfmodmelc0000023","name":"Contact Dérivant","oldName":"Drifting Contact","desc":"<p>Augmente la Durée du Combo de <strong>+10s</strong> et confère <strong>+40% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DriftingContact.png"},"contact dérivant":{"id":"wfmodmelc0000023","name":"Contact Dérivant","oldName":"Drifting Contact","desc":"<p>Augmente la Durée du Combo de <strong>+10s</strong> et confère <strong>+40% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DriftingContact.png"},"wfmodmelc0000024":{"id":"wfmodmelc0000024","name":"Frappe Vitalisante","oldName":"Life Strike","desc":"<p>Les attaques lourdes convertissent <strong>20% des dégâts infligés</strong> en Santé pour le porteur.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LifeStrike.png"},"life strike":{"id":"wfmodmelc0000024","name":"Frappe Vitalisante","oldName":"Life Strike","desc":"<p>Les attaques lourdes convertissent <strong>20% des dégâts infligés</strong> en Santé pour le porteur.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LifeStrike.png"},"frappe vitalisante":{"id":"wfmodmelc0000024","name":"Frappe Vitalisante","oldName":"Life Strike","desc":"<p>Les attaques lourdes convertissent <strong>20% des dégâts infligés</strong> en Santé pour le porteur.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LifeStrike.png"},"wfmodmelc0000025":{"id":"wfmodmelc0000025","name":"Mandibule de Carnis","oldName":"Carnis Mandible","desc":"<p>Confère <strong>+90% de Dégâts Tranchants</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CarnisMandible.png"},"carnis mandible":{"id":"wfmodmelc0000025","name":"Mandibule de Carnis","oldName":"Carnis Mandible","desc":"<p>Confère <strong>+90% de Dégâts Tranchants</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CarnisMandible.png"},"mandibule de carnis":{"id":"wfmodmelc0000025","name":"Mandibule de Carnis","oldName":"Carnis Mandible","desc":"<p>Confère <strong>+90% de Dégâts Tranchants</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CarnisMandible.png"},"wfmodmelc0000026":{"id":"wfmodmelc0000026","name":"Enfer Voltaïque","oldName":"Voltaic Inferno","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"voltaic inferno":{"id":"wfmodmelc0000026","name":"Enfer Voltaïque","oldName":"Voltaic Inferno","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"enfer voltaïque":{"id":"wfmodmelc0000026","name":"Enfer Voltaïque","oldName":"Voltaic Inferno","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png"},"wfmodmelc0000027":{"id":"wfmodmelc0000027","name":"Lame Caustique","oldName":"Caustic Edge","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"caustic edge":{"id":"wfmodmelc0000027","name":"Lame Caustique","oldName":"Caustic Edge","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"lame caustique":{"id":"wfmodmelc0000027","name":"Lame Caustique","oldName":"Caustic Edge","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png"},"wfmodmelc0000028":{"id":"wfmodmelc0000028","name":"Givre Virulent","oldName":"Virulent Frost","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"virulent frost":{"id":"wfmodmelc0000028","name":"Givre Virulent","oldName":"Virulent Frost","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"givre virulent":{"id":"wfmodmelc0000028","name":"Givre Virulent","oldName":"Virulent Frost","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png"},"wfmodmelc0000029":{"id":"wfmodmelc0000029","name":"Lame Magnétique","oldName":"Magnetic Blade","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"magnetic blade":{"id":"wfmodmelc0000029","name":"Lame Magnétique","oldName":"Magnetic Blade","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"lame magnétique":{"id":"wfmodmelc0000029","name":"Lame Magnétique","oldName":"Magnetic Blade","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png"},"wfmodmelc0000030":{"id":"wfmodmelc0000030","name":"Fil Nocif","oldName":"Noxious Edge","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"noxious edge":{"id":"wfmodmelc0000030","name":"Fil Nocif","oldName":"Noxious Edge","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"fil nocif":{"id":"wfmodmelc0000030","name":"Fil Nocif","oldName":"Noxious Edge","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png"},"wfmodmelc0000031":{"id":"wfmodmelc0000031","name":"Frappe Explosive","oldName":"Explosive Strike","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Explosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png"},"explosive strike":{"id":"wfmodmelc0000031","name":"Frappe Explosive","oldName":"Explosive Strike","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Explosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png"},"frappe explosive":{"id":"wfmodmelc0000031","name":"Frappe Explosive","oldName":"Explosive Strike","desc":"<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Explosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>","img":"systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png"},"wfmodstan0000001":{"id":"wfmodstan0000001","name":"Phénix de Fer","oldName":"Iron Phoenix","desc":"<p>Posture d'Épée : Enchaînements de l'Aile de l'Aube. Confère <strong>+10 de Capacité de Mods</strong> (+20 en correspondance).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/IronPhoenix.png"},"iron phoenix":{"id":"wfmodstan0000001","name":"Phénix de Fer","oldName":"Iron Phoenix","desc":"<p>Posture d'Épée : Enchaînements de l'Aile de l'Aube. Confère <strong>+10 de Capacité de Mods</strong> (+20 en correspondance).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/IronPhoenix.png"},"phénix de fer":{"id":"wfmodstan0000001","name":"Phénix de Fer","oldName":"Iron Phoenix","desc":"<p>Posture d'Épée : Enchaînements de l'Aile de l'Aube. Confère <strong>+10 de Capacité de Mods</strong> (+20 en correspondance).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/IronPhoenix.png"},"wfmodstan0000002":{"id":"wfmodstan0000002","name":"Derviche Cramoisi","oldName":"Crimson Dervish","desc":"<p>Posture d'Épée : Formes du Lotus Enroulé infligeant +50% de dégâts bonus sur les premières attaques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrimsonDervish.png"},"crimson dervish":{"id":"wfmodstan0000002","name":"Derviche Cramoisi","oldName":"Crimson Dervish","desc":"<p>Posture d'Épée : Formes du Lotus Enroulé infligeant +50% de dégâts bonus sur les premières attaques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrimsonDervish.png"},"derviche cramoisi":{"id":"wfmodstan0000002","name":"Derviche Cramoisi","oldName":"Crimson Dervish","desc":"<p>Posture d'Épée : Formes du Lotus Enroulé infligeant +50% de dégâts bonus sur les premières attaques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrimsonDervish.png"},"wfmodstan0000003":{"id":"wfmodstan0000003","name":"Berserker Vengeur","oldName":"Vengeful Berserker","desc":"<p>Posture de Doubles Épées : Balayages déchirants furieux et décapitations tournantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VengefulBerserker.png"},"vengeful berserker":{"id":"wfmodstan0000003","name":"Berserker Vengeur","oldName":"Vengeful Berserker","desc":"<p>Posture de Doubles Épées : Balayages déchirants furieux et décapitations tournantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VengefulBerserker.png"},"berserker vengeur":{"id":"wfmodstan0000003","name":"Berserker Vengeur","oldName":"Vengeful Berserker","desc":"<p>Posture de Doubles Épées : Balayages déchirants furieux et décapitations tournantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VengefulBerserker.png"},"wfmodstan0000004":{"id":"wfmodstan0000004","name":"Tigre Tournoyant","oldName":"Swirling Tiger","desc":"<p>Posture de Doubles Épées : Rafales rapides aux crocs jumeaux à fort déclenchement de statut. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SwirlingTiger.png"},"swirling tiger":{"id":"wfmodstan0000004","name":"Tigre Tournoyant","oldName":"Swirling Tiger","desc":"<p>Posture de Doubles Épées : Rafales rapides aux crocs jumeaux à fort déclenchement de statut. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SwirlingTiger.png"},"tigre tournoyant":{"id":"wfmodstan0000004","name":"Tigre Tournoyant","oldName":"Swirling Tiger","desc":"<p>Posture de Doubles Épées : Rafales rapides aux crocs jumeaux à fort déclenchement de statut. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SwirlingTiger.png"},"wfmodstan0000005":{"id":"wfmodstan0000005","name":"Mante Sculptante","oldName":"Carving Mantis","desc":"<p>Posture de Doubles Épées : Frappes chirurgicales de mante garantissant des statuts Tranchants. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CarvingMantis.png"},"carving mantis":{"id":"wfmodstan0000005","name":"Mante Sculptante","oldName":"Carving Mantis","desc":"<p>Posture de Doubles Épées : Frappes chirurgicales de mante garantissant des statuts Tranchants. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CarvingMantis.png"},"mante sculptante":{"id":"wfmodstan0000005","name":"Mante Sculptante","oldName":"Carving Mantis","desc":"<p>Posture de Doubles Épées : Frappes chirurgicales de mante garantissant des statuts Tranchants. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CarvingMantis.png"},"wfmodstan0000006":{"id":"wfmodstan0000006","name":"Tempo Royal","oldName":"Tempo Royale","desc":"<p>Posture de Lame Lourde : Dévastation orbitale avec une forte capacité de renversement. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TempoRoyale.png"},"tempo royale":{"id":"wfmodstan0000006","name":"Tempo Royal","oldName":"Tempo Royale","desc":"<p>Posture de Lame Lourde : Dévastation orbitale avec une forte capacité de renversement. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TempoRoyale.png"},"tempo royal":{"id":"wfmodstan0000006","name":"Tempo Royal","oldName":"Tempo Royale","desc":"<p>Posture de Lame Lourde : Dévastation orbitale avec une forte capacité de renversement. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TempoRoyale.png"},"wfmodstan0000007":{"id":"wfmodstan0000007","name":"Tourbillon Tranchant","oldName":"Cleaving Whirlwind","desc":"<p>Posture de Lame Lourde : Frappes tournoyantes en ouragan du Taureau Brisé. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CleavingWhirlwind.png"},"cleaving whirlwind":{"id":"wfmodstan0000007","name":"Tourbillon Tranchant","oldName":"Cleaving Whirlwind","desc":"<p>Posture de Lame Lourde : Frappes tournoyantes en ouragan du Taureau Brisé. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CleavingWhirlwind.png"},"tourbillon tranchant":{"id":"wfmodstan0000007","name":"Tourbillon Tranchant","oldName":"Cleaving Whirlwind","desc":"<p>Posture de Lame Lourde : Frappes tournoyantes en ouragan du Taureau Brisé. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CleavingWhirlwind.png"},"wfmodstan0000008":{"id":"wfmodstan0000008","name":"Grue Déchirante","oldName":"Rending Crane","desc":"<p>Posture de Lame Lourde : Fentes descendantes écrasantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RendingCrane.png"},"rending crane":{"id":"wfmodstan0000008","name":"Grue Déchirante","oldName":"Rending Crane","desc":"<p>Posture de Lame Lourde : Fentes descendantes écrasantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RendingCrane.png"},"grue déchirante":{"id":"wfmodstan0000008","name":"Grue Déchirante","oldName":"Rending Crane","desc":"<p>Posture de Lame Lourde : Fentes descendantes écrasantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/RendingCrane.png"},"wfmodstan0000009":{"id":"wfmodstan0000009","name":"Ruine Écrasante","oldName":"Crushing Ruin","desc":"<p>Posture de Marteau : Fracas cinétiques orbitaux dévastateurs. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrushingRuin.png"},"crushing ruin":{"id":"wfmodstan0000009","name":"Ruine Écrasante","oldName":"Crushing Ruin","desc":"<p>Posture de Marteau : Fracas cinétiques orbitaux dévastateurs. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrushingRuin.png"},"ruine écrasante":{"id":"wfmodstan0000009","name":"Ruine Écrasante","oldName":"Crushing Ruin","desc":"<p>Posture de Marteau : Fracas cinétiques orbitaux dévastateurs. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CrushingRuin.png"},"wfmodstan0000010":{"id":"wfmodstan0000010","name":"Fléau Scintillant","oldName":"Shimmering Blight","desc":"<p>Posture d'Arme d'Hast : Enchaînements fluides et circulaires continus. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShimmeringBlight.png"},"shimmering blight":{"id":"wfmodstan0000010","name":"Fléau Scintillant","oldName":"Shimmering Blight","desc":"<p>Posture d'Arme d'Hast : Enchaînements fluides et circulaires continus. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShimmeringBlight.png"},"fléau scintillant":{"id":"wfmodstan0000010","name":"Fléau Scintillant","oldName":"Shimmering Blight","desc":"<p>Posture d'Arme d'Hast : Enchaînements fluides et circulaires continus. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ShimmeringBlight.png"},"wfmodstan0000011":{"id":"wfmodstan0000011","name":"Saule Sanglant","oldName":"Bleeding Willow","desc":"<p>Posture d'Arme d'Hast : Larges arcs de balayage martial sur de vastes zones. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BleedingWillow.png"},"bleeding willow":{"id":"wfmodstan0000011","name":"Saule Sanglant","oldName":"Bleeding Willow","desc":"<p>Posture d'Arme d'Hast : Larges arcs de balayage martial sur de vastes zones. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BleedingWillow.png"},"saule sanglant":{"id":"wfmodstan0000011","name":"Saule Sanglant","oldName":"Bleeding Willow","desc":"<p>Posture d'Arme d'Hast : Larges arcs de balayage martial sur de vastes zones. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BleedingWillow.png"},"wfmodstan0000012":{"id":"wfmodstan0000012","name":"Flèche Tournoyante","oldName":"Twirling Spire","desc":"<p>Posture d'Arme d'Hast : Estocades plongeantes à forts dégâts et acrobaties à la lance. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TwirlingSpire.png"},"twirling spire":{"id":"wfmodstan0000012","name":"Flèche Tournoyante","oldName":"Twirling Spire","desc":"<p>Posture d'Arme d'Hast : Estocades plongeantes à forts dégâts et acrobaties à la lance. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TwirlingSpire.png"},"flèche tournoyante":{"id":"wfmodstan0000012","name":"Flèche Tournoyante","oldName":"Twirling Spire","desc":"<p>Posture d'Arme d'Hast : Estocades plongeantes à forts dégâts et acrobaties à la lance. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TwirlingSpire.png"},"wfmodstan0000013":{"id":"wfmodstan0000013","name":"Forêt Entrecroisée","oldName":"Clashing Forest","desc":"<p>Posture de Bâton : Frappes acrobatiques de la floraison bondissante. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ClashingForest.png"},"clashing forest":{"id":"wfmodstan0000013","name":"Forêt Entrecroisée","oldName":"Clashing Forest","desc":"<p>Posture de Bâton : Frappes acrobatiques de la floraison bondissante. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ClashingForest.png"},"forêt entrecroisée":{"id":"wfmodstan0000013","name":"Forêt Entrecroisée","oldName":"Clashing Forest","desc":"<p>Posture de Bâton : Frappes acrobatiques de la floraison bondissante. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ClashingForest.png"},"wfmodstan0000014":{"id":"wfmodstan0000014","name":"Branche Agitée","oldName":"Flailing Branch","desc":"<p>Posture de Bâton : Combos percutants du tourbillon de feuilles d'automne. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FlailingBranch.png"},"flailing branch":{"id":"wfmodstan0000014","name":"Branche Agitée","oldName":"Flailing Branch","desc":"<p>Posture de Bâton : Combos percutants du tourbillon de feuilles d'automne. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FlailingBranch.png"},"branche agitée":{"id":"wfmodstan0000014","name":"Branche Agitée","oldName":"Flailing Branch","desc":"<p>Posture de Bâton : Combos percutants du tourbillon de feuilles d'automne. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FlailingBranch.png"},"wfmodstan0000015":{"id":"wfmodstan0000015","name":"Justice Aveugle","oldName":"Blind Justice","desc":"<p>Posture de Nikana : Prise inversée style Zatoichi pour des coupes éclairs de iaido. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BlindJustice.png"},"blind justice":{"id":"wfmodstan0000015","name":"Justice Aveugle","oldName":"Blind Justice","desc":"<p>Posture de Nikana : Prise inversée style Zatoichi pour des coupes éclairs de iaido. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BlindJustice.png"},"justice aveugle":{"id":"wfmodstan0000015","name":"Justice Aveugle","oldName":"Blind Justice","desc":"<p>Posture de Nikana : Prise inversée style Zatoichi pour des coupes éclairs de iaido. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BlindJustice.png"},"wfmodstan0000016":{"id":"wfmodstan0000016","name":"Taille Tranquille","oldName":"Tranquil Cleave","desc":"<p>Posture de Nikana : Escrime formelle et élégante garantissant des coups de grâce critiques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TranquilCleave.png"},"tranquil cleave":{"id":"wfmodstan0000016","name":"Taille Tranquille","oldName":"Tranquil Cleave","desc":"<p>Posture de Nikana : Escrime formelle et élégante garantissant des coups de grâce critiques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TranquilCleave.png"},"taille tranquille":{"id":"wfmodstan0000016","name":"Taille Tranquille","oldName":"Tranquil Cleave","desc":"<p>Posture de Nikana : Escrime formelle et élégante garantissant des coups de grâce critiques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TranquilCleave.png"},"wfmodstan0000017":{"id":"wfmodstan0000017","name":"Jugement Décisif","oldName":"Decisive Judgement","desc":"<p>Posture de Nikana à Deux Mains : Tranchants lourds d'exécution à deux mains. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DecisiveJudgement.png"},"decisive judgement":{"id":"wfmodstan0000017","name":"Jugement Décisif","oldName":"Decisive Judgement","desc":"<p>Posture de Nikana à Deux Mains : Tranchants lourds d'exécution à deux mains. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DecisiveJudgement.png"},"jugement décisif":{"id":"wfmodstan0000017","name":"Jugement Décisif","oldName":"Decisive Judgement","desc":"<p>Posture de Nikana à Deux Mains : Tranchants lourds d'exécution à deux mains. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/DecisiveJudgement.png"},"wfmodstan0000018":{"id":"wfmodstan0000018","name":"Vent Pointu","oldName":"Pointed Wind","desc":"<p>Posture de Dague : Estocades perforantes infligeant un saignement létal. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointedWind.png"},"pointed wind":{"id":"wfmodstan0000018","name":"Vent Pointu","oldName":"Pointed Wind","desc":"<p>Posture de Dague : Estocades perforantes infligeant un saignement létal. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointedWind.png"},"vent pointu":{"id":"wfmodstan0000018","name":"Vent Pointu","oldName":"Pointed Wind","desc":"<p>Posture de Dague : Estocades perforantes infligeant un saignement létal. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PointedWind.png"},"wfmodstan0000019":{"id":"wfmodstan0000019","name":"Croc Chercheur","oldName":"Homing Fang","desc":"<p>Posture de Dague : Frappes vives d'estoc enchaînées rapidement. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HomingFang.png"},"homing fang":{"id":"wfmodstan0000019","name":"Croc Chercheur","oldName":"Homing Fang","desc":"<p>Posture de Dague : Frappes vives d'estoc enchaînées rapidement. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HomingFang.png"},"croc chercheur":{"id":"wfmodstan0000019","name":"Croc Chercheur","oldName":"Homing Fang","desc":"<p>Posture de Dague : Frappes vives d'estoc enchaînées rapidement. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HomingFang.png"},"wfmodstan0000020":{"id":"wfmodstan0000020","name":"Paume Sismique","oldName":"Seismic Palm","desc":"<p>Posture de Poings : Coups de paume à onde de choc déstabilisant les adversaires. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SeismicPalm.png"},"seismic palm":{"id":"wfmodstan0000020","name":"Paume Sismique","oldName":"Seismic Palm","desc":"<p>Posture de Poings : Coups de paume à onde de choc déstabilisant les adversaires. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SeismicPalm.png"},"paume sismique":{"id":"wfmodstan0000020","name":"Paume Sismique","oldName":"Seismic Palm","desc":"<p>Posture de Poings : Coups de paume à onde de choc déstabilisant les adversaires. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/SeismicPalm.png"},"wfmodstan0000021":{"id":"wfmodstan0000021","name":"Vent Fracturant","oldName":"Fracturing Wind","desc":"<p>Posture de Poings : Combos brise-os provoquant de lourds statuts d'Impact. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FracturingWind.png"},"fracturing wind":{"id":"wfmodstan0000021","name":"Vent Fracturant","oldName":"Fracturing Wind","desc":"<p>Posture de Poings : Combos brise-os provoquant de lourds statuts d'Impact. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FracturingWind.png"},"vent fracturant":{"id":"wfmodstan0000021","name":"Vent Fracturant","oldName":"Fracturing Wind","desc":"<p>Posture de Poings : Combos brise-os provoquant de lourds statuts d'Impact. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/FracturingWind.png"},"wfmodstan0000022":{"id":"wfmodstan0000022","name":"Furie Sinistre","oldName":"Grim Fury","desc":"<p>Posture de Pugilat : Combinaisons d'arts martiaux mêlant coups de poing et coups de pied. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GrimFury.png"},"grim fury":{"id":"wfmodstan0000022","name":"Furie Sinistre","oldName":"Grim Fury","desc":"<p>Posture de Pugilat : Combinaisons d'arts martiaux mêlant coups de poing et coups de pied. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GrimFury.png"},"furie sinistre":{"id":"wfmodstan0000022","name":"Furie Sinistre","oldName":"Grim Fury","desc":"<p>Posture de Pugilat : Combinaisons d'arts martiaux mêlant coups de poing et coups de pied. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GrimFury.png"},"wfmodstan0000023":{"id":"wfmodstan0000023","name":"Marée Brutale","oldName":"Brutal Tide","desc":"<p>Posture de Pugilat : Balayages acrobatiques inspirés de la capoeira. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BrutalTide.png"},"brutal tide":{"id":"wfmodstan0000023","name":"Marée Brutale","oldName":"Brutal Tide","desc":"<p>Posture de Pugilat : Balayages acrobatiques inspirés de la capoeira. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BrutalTide.png"},"marée brutale":{"id":"wfmodstan0000023","name":"Marée Brutale","oldName":"Brutal Tide","desc":"<p>Posture de Pugilat : Balayages acrobatiques inspirés de la capoeira. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BrutalTide.png"},"wfmodstan0000024":{"id":"wfmodstan0000024","name":"Crépuscule Astral","oldName":"Astral Twilight","desc":"<p>Posture de Glaive : Arcs de lancer gracieux et retours cinétiques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AstralTwilight.png"},"astral twilight":{"id":"wfmodstan0000024","name":"Crépuscule Astral","oldName":"Astral Twilight","desc":"<p>Posture de Glaive : Arcs de lancer gracieux et retours cinétiques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AstralTwilight.png"},"crépuscule astral":{"id":"wfmodstan0000024","name":"Crépuscule Astral","oldName":"Astral Twilight","desc":"<p>Posture de Glaive : Arcs de lancer gracieux et retours cinétiques. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/AstralTwilight.png"},"wfmodstan0000025":{"id":"wfmodstan0000025","name":"Serre Scintillante","oldName":"Gleaming Talon","desc":"<p>Posture de Glaive : Décapitations féroces au disque et lancers explosifs. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GleamingTalon.png"},"gleaming talon":{"id":"wfmodstan0000025","name":"Serre Scintillante","oldName":"Gleaming Talon","desc":"<p>Posture de Glaive : Décapitations féroces au disque et lancers explosifs. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GleamingTalon.png"},"serre scintillante":{"id":"wfmodstan0000025","name":"Serre Scintillante","oldName":"Gleaming Talon","desc":"<p>Posture de Glaive : Décapitations féroces au disque et lancers explosifs. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GleamingTalon.png"},"wfmodstan0000026":{"id":"wfmodstan0000026","name":"Spirale Faucheuse","oldName":"Reaping Spiral","desc":"<p>Posture de Faux : Larges fauchages sinistres récoltant les âmes ennemies. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ReapingSpiral.png"},"reaping spiral":{"id":"wfmodstan0000026","name":"Spirale Faucheuse","oldName":"Reaping Spiral","desc":"<p>Posture de Faux : Larges fauchages sinistres récoltant les âmes ennemies. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ReapingSpiral.png"},"spirale faucheuse":{"id":"wfmodstan0000026","name":"Spirale Faucheuse","oldName":"Reaping Spiral","desc":"<p>Posture de Faux : Larges fauchages sinistres récoltant les âmes ennemies. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/ReapingSpiral.png"},"wfmodstan0000027":{"id":"wfmodstan0000027","name":"Éventail Traqueur","oldName":"Stalking Fan","desc":"<p>Posture de Faux : Tourbillons tranchants mortels et taillades d'exécution. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/StalkingFan.png"},"stalking fan":{"id":"wfmodstan0000027","name":"Éventail Traqueur","oldName":"Stalking Fan","desc":"<p>Posture de Faux : Tourbillons tranchants mortels et taillades d'exécution. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/StalkingFan.png"},"éventail traqueur":{"id":"wfmodstan0000027","name":"Éventail Traqueur","oldName":"Stalking Fan","desc":"<p>Posture de Faux : Tourbillons tranchants mortels et taillades d'exécution. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/StalkingFan.png"},"wfmodstan0000028":{"id":"wfmodstan0000028","name":"Plein Midi","oldName":"High Noon","desc":"<p>Posture de Pisto-Lame : Taillades combinées harmonieusement avec des décharges à bout portant. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HighNoon.png"},"high noon":{"id":"wfmodstan0000028","name":"Plein Midi","oldName":"High Noon","desc":"<p>Posture de Pisto-Lame : Taillades combinées harmonieusement avec des décharges à bout portant. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HighNoon.png"},"plein midi":{"id":"wfmodstan0000028","name":"Plein Midi","oldName":"High Noon","desc":"<p>Posture de Pisto-Lame : Taillades combinées harmonieusement avec des décharges à bout portant. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/HighNoon.png"},"wfmodstan0000029":{"id":"wfmodstan0000029","name":"Danse des Balles","oldName":"Bullet Dance","desc":"<p>Posture de Pisto-Lame : Décharges balistiques rapides et virevoltantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BulletDance.png"},"bullet dance":{"id":"wfmodstan0000029","name":"Danse des Balles","oldName":"Bullet Dance","desc":"<p>Posture de Pisto-Lame : Décharges balistiques rapides et virevoltantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BulletDance.png"},"danse des balles":{"id":"wfmodstan0000029","name":"Danse des Balles","oldName":"Bullet Dance","desc":"<p>Posture de Pisto-Lame : Décharges balistiques rapides et virevoltantes. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/BulletDance.png"},"wfmodstan0000030":{"id":"wfmodstan0000030","name":"Vipère Enroulée","oldName":"Coiling Viper","desc":"<p>Posture de Fouet : Coups de lanière balayant le sol pour faire trébucher les ennemis. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CoilingViper.png"},"coiling viper":{"id":"wfmodstan0000030","name":"Vipère Enroulée","oldName":"Coiling Viper","desc":"<p>Posture de Fouet : Coups de lanière balayant le sol pour faire trébucher les ennemis. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CoilingViper.png"},"vipère enroulée":{"id":"wfmodstan0000030","name":"Vipère Enroulée","oldName":"Coiling Viper","desc":"<p>Posture de Fouet : Coups de lanière balayant le sol pour faire trébucher les ennemis. Confère <strong>+10 de Capacité</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/CoilingViper.png"},"wfmodprmg0000001":{"id":"wfmodprmg0000001","name":"Dentelure Accrue","oldName":"Primed Serration","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de base du fusil de <strong>+220%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedSerration.png"},"primed serration":{"id":"wfmodprmg0000001","name":"Dentelure Accrue","oldName":"Primed Serration","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de base du fusil de <strong>+220%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedSerration.png"},"dentelure accrue":{"id":"wfmodprmg0000001","name":"Dentelure Accrue","oldName":"Primed Serration","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de base du fusil de <strong>+220%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedSerration.png"},"wfmodprmg0000002":{"id":"wfmodprmg0000002","name":"À Bout Portant Accru","oldName":"Primed Point Blank","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de base du fusil à pompe de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPointBlank.png"},"primed point blank":{"id":"wfmodprmg0000002","name":"À Bout Portant Accru","oldName":"Primed Point Blank","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de base du fusil à pompe de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPointBlank.png"},"à bout portant accru":{"id":"wfmodprmg0000002","name":"À Bout Portant Accru","oldName":"Primed Point Blank","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de base du fusil à pompe de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPointBlank.png"},"wfmodprmg0000003":{"id":"wfmodprmg0000003","name":"Balles Cryogéniques Accrues","oldName":"Primed Cryo Rounds","desc":"<p>Chef-d'œuvre Orokin : Imprègne les balles de fusil de <strong>+165% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedCryoRounds.png"},"primed cryo rounds":{"id":"wfmodprmg0000003","name":"Balles Cryogéniques Accrues","oldName":"Primed Cryo Rounds","desc":"<p>Chef-d'œuvre Orokin : Imprègne les balles de fusil de <strong>+165% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedCryoRounds.png"},"balles cryogéniques accrues":{"id":"wfmodprmg0000003","name":"Balles Cryogéniques Accrues","oldName":"Primed Cryo Rounds","desc":"<p>Chef-d'œuvre Orokin : Imprègne les balles de fusil de <strong>+165% de Dégâts de Glace</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedCryoRounds.png"},"wfmodprmg0000004":{"id":"wfmodprmg0000004","name":"Gambit du Pistolet Accru","oldName":"Primed Pistol Gambit","desc":"<p>Chef-d'œuvre Orokin : Augmente les Chances Critiques du pistolet de <strong>+187%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPistolGambit.png"},"primed pistol gambit":{"id":"wfmodprmg0000004","name":"Gambit du Pistolet Accru","oldName":"Primed Pistol Gambit","desc":"<p>Chef-d'œuvre Orokin : Augmente les Chances Critiques du pistolet de <strong>+187%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPistolGambit.png"},"gambit du pistolet accru":{"id":"wfmodprmg0000004","name":"Gambit du Pistolet Accru","oldName":"Primed Pistol Gambit","desc":"<p>Chef-d'œuvre Orokin : Augmente les Chances Critiques du pistolet de <strong>+187%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPistolGambit.png"},"wfmodprmg0000005":{"id":"wfmodprmg0000005","name":"Fracasseur de Cibles Accru","oldName":"Primed Target Cracker","desc":"<p>Chef-d'œuvre Orokin : Augmente les Dégâts Critiques du pistolet de <strong>+110%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedTargetCracker.png"},"primed target cracker":{"id":"wfmodprmg0000005","name":"Fracasseur de Cibles Accru","oldName":"Primed Target Cracker","desc":"<p>Chef-d'œuvre Orokin : Augmente les Dégâts Critiques du pistolet de <strong>+110%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedTargetCracker.png"},"fracasseur de cibles accru":{"id":"wfmodprmg0000005","name":"Fracasseur de Cibles Accru","oldName":"Primed Target Cracker","desc":"<p>Chef-d'œuvre Orokin : Augmente les Dégâts Critiques du pistolet de <strong>+110%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedTargetCracker.png"},"wfmodprmg0000006":{"id":"wfmodprmg0000006","name":"Charge Chauffée Accrue","oldName":"Primed Heated Charge","desc":"<p>Chef-d'œuvre Orokin : Imprègne les balles de pistolet de <strong>+165% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedHeatedCharge.png"},"primed heated charge":{"id":"wfmodprmg0000006","name":"Charge Chauffée Accrue","oldName":"Primed Heated Charge","desc":"<p>Chef-d'œuvre Orokin : Imprègne les balles de pistolet de <strong>+165% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedHeatedCharge.png"},"charge chauffée accrue":{"id":"wfmodprmg0000006","name":"Charge Chauffée Accrue","oldName":"Primed Heated Charge","desc":"<p>Chef-d'œuvre Orokin : Imprègne les balles de pistolet de <strong>+165% de Dégâts de Feu</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedHeatedCharge.png"},"wfmodprmg0000007":{"id":"wfmodprmg0000007","name":"Point de Pression Accru","oldName":"Primed Pressure Point","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de mêlée de base de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPressurePoint.png"},"primed pressure point":{"id":"wfmodprmg0000007","name":"Point de Pression Accru","oldName":"Primed Pressure Point","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de mêlée de base de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPressurePoint.png"},"point de pression accru":{"id":"wfmodprmg0000007","name":"Point de Pression Accru","oldName":"Primed Pressure Point","desc":"<p>Chef-d'œuvre Orokin : Augmente les dégâts de mêlée de base de <strong>+165%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPressurePoint.png"},"wfmodprmg0000008":{"id":"wfmodprmg0000008","name":"Frappe de Fièvre Accrue","oldName":"Primed Fever Strike","desc":"<p>Chef-d'œuvre Orokin : Imprègne les frappes de mêlée de <strong>+165% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedFeverStrike.png"},"primed fever strike":{"id":"wfmodprmg0000008","name":"Frappe de Fièvre Accrue","oldName":"Primed Fever Strike","desc":"<p>Chef-d'œuvre Orokin : Imprègne les frappes de mêlée de <strong>+165% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedFeverStrike.png"},"frappe de fièvre accrue":{"id":"wfmodprmg0000008","name":"Frappe de Fièvre Accrue","oldName":"Primed Fever Strike","desc":"<p>Chef-d'œuvre Orokin : Imprègne les frappes de mêlée de <strong>+165% de Dégâts de Toxine</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedFeverStrike.png"},"wfmodprmg0000009":{"id":"wfmodprmg0000009","name":"Allonge Accrue","oldName":"Primed Reach","desc":"<p>Chef-d'œuvre Orokin : Étend la portée de frappe de mêlée de <strong>+10 feet (3,0 m)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedReach.png"},"primed reach":{"id":"wfmodprmg0000009","name":"Allonge Accrue","oldName":"Primed Reach","desc":"<p>Chef-d'œuvre Orokin : Étend la portée de frappe de mêlée de <strong>+10 feet (3,0 m)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedReach.png"},"allonge accrue":{"id":"wfmodprmg0000009","name":"Allonge Accrue","oldName":"Primed Reach","desc":"<p>Chef-d'œuvre Orokin : Étend la portée de frappe de mêlée de <strong>+10 feet (3,0 m)</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedReach.png"},"wfmodprmg0000010":{"id":"wfmodprmg0000010","name":"Furie Accrue","oldName":"Primed Fury","desc":"<p>Chef-d'œuvre Orokin : Augmente la Vitesse d'Attaque en mêlée de <strong>+55%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedFury.png"},"primed fury":{"id":"wfmodprmg0000010","name":"Furie Accrue","oldName":"Primed Fury","desc":"<p>Chef-d'œuvre Orokin : Augmente la Vitesse d'Attaque en mêlée de <strong>+55%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedFury.png"},"furie accrue":{"id":"wfmodprmg0000010","name":"Furie Accrue","oldName":"Primed Fury","desc":"<p>Chef-d'œuvre Orokin : Augmente la Vitesse d'Attaque en mêlée de <strong>+55%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/PrimedFury.png"},"wfmodprmg0000011":{"id":"wfmodprmg0000011","name":"Chambre Galvanisée","oldName":"Galvanized Chamber","desc":"<p>Mod d'Arbitrage : Confère <strong>+80% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 5x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedChamber.png"},"galvanized chamber":{"id":"wfmodprmg0000011","name":"Chambre Galvanisée","oldName":"Galvanized Chamber","desc":"<p>Mod d'Arbitrage : Confère <strong>+80% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 5x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedChamber.png"},"chambre galvanisée":{"id":"wfmodprmg0000011","name":"Chambre Galvanisée","oldName":"Galvanized Chamber","desc":"<p>Mod d'Arbitrage : Confère <strong>+80% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 5x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedChamber.png"},"wfmodprmg0000012":{"id":"wfmodprmg0000012","name":"Aptitude Galvanisée","oldName":"Galvanized Aptitude","desc":"<p>Mod d'Arbitrage : Confère <strong>+80% de Chances de Statut</strong> ; sur Élimination : Confère <strong>+40% de Dégâts Directs par Statut</strong> sur la cible.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedAptitude.png"},"galvanized aptitude":{"id":"wfmodprmg0000012","name":"Aptitude Galvanisée","oldName":"Galvanized Aptitude","desc":"<p>Mod d'Arbitrage : Confère <strong>+80% de Chances de Statut</strong> ; sur Élimination : Confère <strong>+40% de Dégâts Directs par Statut</strong> sur la cible.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedAptitude.png"},"aptitude galvanisée":{"id":"wfmodprmg0000012","name":"Aptitude Galvanisée","oldName":"Galvanized Aptitude","desc":"<p>Mod d'Arbitrage : Confère <strong>+80% de Chances de Statut</strong> ; sur Élimination : Confère <strong>+40% de Dégâts Directs par Statut</strong> sur la cible.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedAptitude.png"},"wfmodprmg0000013":{"id":"wfmodprmg0000013","name":"Diffusion Galvanisée","oldName":"Galvanized Diffusion","desc":"<p>Mod d'Arbitrage : Confère <strong>+110% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 4x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedDiffusion.png"},"galvanized diffusion":{"id":"wfmodprmg0000013","name":"Diffusion Galvanisée","oldName":"Galvanized Diffusion","desc":"<p>Mod d'Arbitrage : Confère <strong>+110% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 4x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedDiffusion.png"},"diffusion galvanisée":{"id":"wfmodprmg0000013","name":"Diffusion Galvanisée","oldName":"Galvanized Diffusion","desc":"<p>Mod d'Arbitrage : Confère <strong>+110% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 4x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedDiffusion.png"},"wfmodprmg0000014":{"id":"wfmodprmg0000014","name":"Enfers Galvanisés","oldName":"Galvanized Hell","desc":"<p>Mod d'Arbitrage : Confère <strong>+110% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 4x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedHell.png"},"galvanized hell":{"id":"wfmodprmg0000014","name":"Enfers Galvanisés","oldName":"Galvanized Hell","desc":"<p>Mod d'Arbitrage : Confère <strong>+110% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 4x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedHell.png"},"enfers galvanisés":{"id":"wfmodprmg0000014","name":"Enfers Galvanisés","oldName":"Galvanized Hell","desc":"<p>Mod d'Arbitrage : Confère <strong>+110% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 4x).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedHell.png"},"wfmodexlw0000001":{"id":"wfmodexlw0000001","name":"Ravitaillement du Justicier","oldName":"Vigilante Supplies","desc":"<p>Mod Exilus : Convertit les ramassages de munitions secondaires et de sniper en Munitions Principales (+30% ramassage), avec 5% de chances d'augmenter le palier de coup critique.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VigilanteSupplies.png"},"vigilante supplies":{"id":"wfmodexlw0000001","name":"Ravitaillement du Justicier","oldName":"Vigilante Supplies","desc":"<p>Mod Exilus : Convertit les ramassages de munitions secondaires et de sniper en Munitions Principales (+30% ramassage), avec 5% de chances d'augmenter le palier de coup critique.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VigilanteSupplies.png"},"ravitaillement du justicier":{"id":"wfmodexlw0000001","name":"Ravitaillement du Justicier","oldName":"Vigilante Supplies","desc":"<p>Mod Exilus : Convertit les ramassages de munitions secondaires et de sniper en Munitions Principales (+30% ramassage), avec 5% de chances d'augmenter le palier de coup critique.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/VigilanteSupplies.png"},"wfmodexlw0000002":{"id":"wfmodexlw0000002","name":"Vitesse Terminale","oldName":"Terminal Velocity","desc":"<p>Mod Exilus : Augmente la Vitesse de Vol des Projectiles de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TerminalVelocity.png"},"terminal velocity":{"id":"wfmodexlw0000002","name":"Vitesse Terminale","oldName":"Terminal Velocity","desc":"<p>Mod Exilus : Augmente la Vitesse de Vol des Projectiles de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TerminalVelocity.png"},"vitesse terminale":{"id":"wfmodexlw0000002","name":"Vitesse Terminale","oldName":"Terminal Velocity","desc":"<p>Mod Exilus : Augmente la Vitesse de Vol des Projectiles de <strong>+60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/TerminalVelocity.png"},"wfmodexlw0000003":{"id":"wfmodexlw0000003","name":"Silence","oldName":"Hush","desc":"<p>Mod Exilus : Réduit le bruit des tirs de fusil de 100% (tir complètement silencieux).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Hush.png"},"hush":{"id":"wfmodexlw0000003","name":"Silence","oldName":"Hush","desc":"<p>Mod Exilus : Réduit le bruit des tirs de fusil de 100% (tir complètement silencieux).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Hush.png"},"silence":{"id":"wfmodexlw0000003","name":"Silence","oldName":"Hush","desc":"<p>Mod Exilus : Réduit le bruit des tirs de fusil de 100% (tir complètement silencieux).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Hush.png"},"wfmodexlw0000004":{"id":"wfmodexlw0000004","name":"Silencieux","oldName":"Suppress","desc":"<p>Mod Exilus : Réduit le bruit des tirs de pistolet de 100% (tir complètement silencieux).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Suppress.png"},"suppress":{"id":"wfmodexlw0000004","name":"Silencieux","oldName":"Suppress","desc":"<p>Mod Exilus : Réduit le bruit des tirs de pistolet de 100% (tir complètement silencieux).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Suppress.png"},"silencieux":{"id":"wfmodexlw0000004","name":"Silencieux","oldName":"Suppress","desc":"<p>Mod Exilus : Réduit le bruit des tirs de pistolet de 100% (tir complètement silencieux).</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Suppress.png"},"wfmodexlw0000005":{"id":"wfmodexlw0000005","name":"Moment Léthal","oldName":"Lethal Momentum","desc":"<p>Mod Exilus : Augmente la Vitesse de Vol des Projectiles de pistolet de <strong>+40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LethalMomentum.png"},"lethal momentum":{"id":"wfmodexlw0000005","name":"Moment Léthal","oldName":"Lethal Momentum","desc":"<p>Mod Exilus : Augmente la Vitesse de Vol des Projectiles de pistolet de <strong>+40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LethalMomentum.png"},"moment léthal":{"id":"wfmodexlw0000005","name":"Moment Léthal","oldName":"Lethal Momentum","desc":"<p>Mod Exilus : Augmente la Vitesse de Vol des Projectiles de pistolet de <strong>+40%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/LethalMomentum.png"},"wfmodexlw0000006":{"id":"wfmodexlw0000006","name":"Stabilisateur","oldName":"Stabilizer","desc":"<p>Mod Exilus : Réduit le recul de l'arme de <strong>-60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Stabilizer.png"},"stabilizer":{"id":"wfmodexlw0000006","name":"Stabilisateur","oldName":"Stabilizer","desc":"<p>Mod Exilus : Réduit le recul de l'arme de <strong>-60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Stabilizer.png"},"stabilisateur":{"id":"wfmodexlw0000006","name":"Stabilisateur","oldName":"Stabilizer","desc":"<p>Mod Exilus : Réduit le recul de l'arme de <strong>-60%</strong>.</p>","img":"systems/warframe-ttrpg/asset/Mods/Weapon/Stabilizer.png"}};
      const allModsMap = new Map([...warframeModsDataset, ...weaponModsDataset].map(m => [m.name, m.img]));
      const allModsDescMap = new Map([...warframeModsDataset, ...weaponModsDataset].map(m => [m.name, m.system?.description]));
      const allWeaponsMap = new Map([...primaryWeaponsDataset, ...secondaryWeaponsDataset, ...meleeWeaponsDataset].map(w => [w.name, w.img]));
      const allWeaponsDescMap = new Map([...primaryWeaponsDataset, ...secondaryWeaponsDataset, ...meleeWeaponsDataset].map(w => [w.name, w.system?.description]));

      for (let item of game.items) {
        if (item.type === "mod") {
          const modMatch = allModsMigration[item.id] || allModsMigration[item.name.toLowerCase()];
          if (modMatch) {
            const updates = {};
            if (item.name !== modMatch.name) updates.name = modMatch.name;
            if (item.img !== modMatch.img) updates.img = modMatch.img;
            if (item.system?.description !== modMatch.desc) updates["system.description"] = modMatch.desc;
            if (Object.keys(updates).length > 0) await item.update(updates);
          }
        }
        if (item.type === "weapon" && allWeaponsMap.has(item.name)) {
          const updates = {};
          const expectedImg = allWeaponsMap.get(item.name);
          if (item.img !== expectedImg) updates.img = expectedImg;
          const expectedDesc = allWeaponsDescMap.get(item.name);
          if (expectedDesc && item.system?.description !== expectedDesc) {
            updates["system.description"] = expectedDesc;
          }
          if (Object.keys(updates).length > 0) await item.update(updates);
        }
      }

      for (let actor of game.actors) {
        for (let item of actor.items) {
          if (item.type === "mod") {
            const modMatch = allModsMigration[item.id] || allModsMigration[item.name.toLowerCase()];
            if (modMatch) {
              const updates = {};
              if (item.name !== modMatch.name) updates.name = modMatch.name;
              if (item.img !== modMatch.img) updates.img = modMatch.img;
              if (item.system?.description !== modMatch.desc) updates["system.description"] = modMatch.desc;
              if (Object.keys(updates).length > 0) await item.update(updates);
            }
          }
          if (item.type === "weapon") {
            const updates = {};
            if (allWeaponsMap.has(item.name) && item.img !== allWeaponsMap.get(item.name)) {
              updates.img = allWeaponsMap.get(item.name);
            }
            if (allWeaponsDescMap.has(item.name)) {
              const expectedDesc = allWeaponsDescMap.get(item.name);
              if (expectedDesc && item.system?.description !== expectedDesc) {
                updates["system.description"] = expectedDesc;
              }
            }
            const slots = item.system?.modSlots || {};
            for (const [slotKey, sData] of Object.entries(slots)) {
              if (sData?.mod) {
                const sMod = sData.mod;
                const modMatch = allModsMigration[sMod.id] || allModsMigration[sMod.name?.toLowerCase()];
                if (modMatch) {
                  if (sMod.name !== modMatch.name) {
                    updates[`system.modSlots.${slotKey}.mod.name`] = modMatch.name;
                  }
                  if (sMod.img !== modMatch.img) {
                    updates[`system.modSlots.${slotKey}.mod.img`] = modMatch.img;
                  }
                  if (sMod.system?.description !== modMatch.desc) {
                    updates[`system.modSlots.${slotKey}.mod.system.description`] = modMatch.desc;
                  }
                }
              }
            }
            if (Object.keys(updates).length > 0) {
              await item.update(updates);
              log(`Auto-synced weapon & slotted mod images & French description on ${actor.name} -> ${item.name}`);
            }
          }
        }
      }

      
      // --- AUTO-MIGRATE WORLD ACTORS TO FRENCH ---
      const frenchItemMap = {
        "Swordsmanship (Passive)": { name: "Escrime (Passif)", desc: "+10% de dégâts et de vitesse avec les épées." },
        "Swordsmanship": { name: "Escrime (Passif)", desc: "+10% de dégâts et de vitesse avec les épées." },
        "Exalted Might (Passive Mechanic)": { name: "Puissance Exaltée (Mécanique Passive)", desc: "Toutes les épées ont une plage de coup critique de 19-20." },
        "Exalted Might": { name: "Puissance Exaltée (Mécanique Passive)", desc: "Toutes les épées ont une plage de coup critique de 19-20." },
        "Slash Dash": { name: "Élan Tranchant", desc: "Fonce vers l'avant et taillade les ennemis en infligeant 1d10 dégâts Tranchants." },
        "Slash Dash II": { name: "Élan Tranchant II", desc: "Les dégâts passent à 2d10 et enchaîne jusqu'à 3 cibles." },
        "Slash Dash III": { name: "Élan Tranchant III", desc: "Les dégâts passent à 3d10, enchaîne jusqu'à 5 cibles et confère l'invulnérabilité pendant l'élan." },
        "Radial Blind": { name: "Aveuglement Radial", desc: "Émet un éclair aveuglant tous les ennemis à moins de 30 ft pendant 1 round." },
        "Radial Blind II": { name: "Aveuglement Radial II", desc: "Aveugle pendant 2 rounds et expose aux coups de grâce (dégâts de mêlée doublés)." },
        "Radial Blind III": { name: "Aveuglement Radial III", desc: "Aveugle pendant 3 rounds, rayon étendu à 45 ft et réduit l'armure de 30%." },
        "Radial Javelin": { name: "Javelot Radial", desc: "Lance des javelots éthérés infligeant 2d8 dégâts de Perforation aux ennemis proches." },
        "Radial Javelin II": { name: "Javelot Radial II", desc: "Les dégâts passent à 3d8 et immobilise les cibles (vitesse 0) pendant 1 round." },
        "Radial Javelin III": { name: "Javelot Radial III", desc: "Les dégâts passent à 4d8, rayon 45 ft, et chaque ennemi touché confère +10% de dégâts de mêlée pendant 2 rounds." },
        "Exalted Blade": { name: "Lame Exaltée", desc: "Matérialise une lame de pure lumière. Les attaques projettent des vagues d'énergie infligeant 3d10 dégâts." },
        "Exalted Blade II": { name: "Lame Exaltée II", desc: "Les vagues d'énergie infligent 4d10 dégâts et traversent les parois minces et plusieurs ennemis." },
        "Exalted Blade III": { name: "Lame Exaltée III", desc: "Les vagues infligent 5d10 dégâts, aveuglent sur coup critique et l'épée gagne +20% de vitesse d'attaque." },
        "Attribute Score Improvement (ASI)": { name: "Amélioration de Caractéristique (ASI)", desc: "Confère +2 points de caractéristique." },
        "Speed Increase": { name: "Augmentation de Vitesse", desc: "Augmente la vitesse de déplacement (+5 ft)." },
        "Bonus Skill Proficiency": { name: "Maîtrise de Compétence Bonus", desc: "Confère la maîtrise d'une compétence au choix." },
        "Save Specialization: Physique": { name: "Spécialisation de Sauvegarde : Physique" },
        "Save Specialization: Prowess": { name: "Spécialisation de Sauvegarde : Prouesse" },
        "Save Specialization: Systems": { name: "Spécialisation de Sauvegarde : Systèmes" },
        "Save Specialization: Focus": { name: "Spécialisation de Sauvegarde : Focalisation" }
      };

      for (let actor of game.actors) {
        if (actor.type === "warframe") {
          const itemUpdates = [];
          for (let item of actor.items) {
            const tr = frenchItemMap[item.name];
            if (tr) {
              const u = { _id: item.id, name: tr.name };
              if (tr.desc && (!item.system?.description || item.system.description.length < 200)) {
                u["system.description"] = tr.desc;
              }
              itemUpdates.push(u);
            } else if (item.name.includes("(Passive)") || item.name.includes("(Passive Mechanic)")) {
              const frName = item.name.replace("(Passive Mechanic)", "(Mécanique Passive)").replace("(Passive)", "(Passif)");
              if (frName !== item.name) {
                itemUpdates.push({ _id: item.id, name: frName });
              }
            }
          }
          if (itemUpdates.length > 0) {
            await actor.updateEmbeddedDocuments("Item", itemUpdates);
            log(`Migrated ${itemUpdates.length} items to French for actor: ${actor.name}`);
          }

          // Also force French attributes, skills, saves labels
          const sys = actor.system;
          if (sys?.attributes?.physique?.label === "Physique" || sys?.attributes?.prowess?.label !== "Prouesse") {
            await actor.update({
              "system.attributes.physique.label": "Physique",
              "system.attributes.prowess.label": "Prouesse",
              "system.attributes.systems.label": "Systèmes",
              "system.attributes.focus.label": "Focalisation",
              "system.saves.physique.label": "Physique",
              "system.saves.prowess.label": "Prouesse",
              "system.saves.systems.label": "Systèmes",
              "system.saves.focus.label": "Focalisation",
              "system.skills.athletics.label": "Athlétisme",
              "system.skills.survival.label": "Survie",
              "system.skills.acrobatics.label": "Acrobaties",
              "system.skills.stealth.label": "Furtivité",
              "system.skills.reflexes.label": "Réflexes",
              "system.skills.hacking.label": "Piratage",
              "system.skills.engineering.label": "Ingénierie",
              "system.skills.perception.label": "Perception",
              "system.skills.void.label": "Canalisation du Néant"
            });
            log(`Forced French labels on actor stats: ${actor.name}`);
          }
        }
      }

      // Auto-sync Warframe actor vitals (HP, Shields, Energy, Armor)
      for (let actor of game.actors) {
        if (actor.type === "warframe") {
          const equippedFrame = actor.items.find(i => i.type === "warframe");
          if (equippedFrame) {
            const level = Number(actor.system.details?.level?.value) || 1;
            const maxH = actor.system.health?.max;
            const maxS = actor.system.shields?.max;
            const maxE = actor.system.energy?.max;
            const curH = actor.system.health?.value;
            const curS = actor.system.shields?.value;
            const curE = actor.system.energy?.value;

            // Detect legacy hardcoded/mismatched values (e.g. 107 shields, 100/150 defaults, or uninitialized nulls)
            const hasLegacyValues = curH === 100 || curS === 150 || curS === 107 || curH == null || curS == null || curE == null;
            if ((level === 1 && (curS !== maxS || curH !== maxH || curE !== maxE)) || hasLegacyValues) {
              const baseA = Number(equippedFrame.system?.baseArmor) || 100;
              await actor.update({
                "system.health.value": maxH,
                "system.health.max": maxH,
                "system.shields.value": maxS,
                "system.shields.max": maxS,
                "system.energy.value": maxE,
                "system.energy.max": maxE,
                "system.armor.value": baseA
              });
              log(`Auto-synced vitals for ${actor.name} to full (${maxH} HP, ${maxS} Shields, ${maxE} Energy, ${baseA} Armor).`);
            }
          }
        }
      }
    } catch (e) {
      logErr("Error during world item cleanup/sync", e);
    }

    // Auto-seed Warframe Origin System Star Chart if Galaxy Map is active
    if (game.modules.get("galaxy-map")?.active && game.galaxyMap) {
      try {
        const existingMaps = game.settings.get("galaxy-map", "maps") || {};
        if (!existingMaps["origin-system"] || !existingMaps["origin-system"].systems?.length) {
          log("Seeding Warframe Origin System Star Chart into Galaxy Map...");
          await game.galaxyMap.importMapData(ORIGIN_SYSTEM_MAP, { replace: true });
          log("Warframe Origin System Star Chart seeded successfully.");
        }
      } catch (e) {
        logErr("Failed to seed Origin System Star Chart into Galaxy Map", e);
      }
    }

    // Auto-create / verify the "Système Origine" Scene and Codex Journal
    try {
      await ensureStarChartSceneAndCodex(log);
    } catch (e) {
      logErr("Failed to ensure Star Chart scene and codex", e);
    }

    // Auto-create / verify Bestiary in Compendium
    try {
      await syncBestiary(log);
    } catch (e) {
      logErr("Failed to synchronize Bestiary", e);
    }

    // Auto-create / verify Official Warframe Playlists by Arc
    try {
      await syncWarframePlaylists(log);
    } catch (e) {
      logErr("Failed to synchronize Warframe Playlists", e);
    }

    // Migrate world actors and tokens from legacy paths
    try {
      await migrateWorldAssetPaths(log);
    } catch (e) {
      logErr("Failed to migrate world asset paths", e);
    }

    log("Ready hook completed successfully.");
  } catch (err) {
    logErr("Critical error in ready hook", err);
    ui.notifications.error("Seeder Error: " + err.message);
  } finally {
    try {
      const logContent = logs.join("\n");
      // Logs kept in memory
      console.log("Warframe TTRPG | Ready logs finalized.");
    } catch (e) {
      console.error("Failed to write log file:", e);
    }
  }
});

// ========================================================
// WARFRAME TTRPG - BESTIAIRE : COMPENDIUM SYNCHRONIZATION
// ========================================================

/**
 * Synchronise les fiches du Bestiaire dans le Compendium officiel ("warframe-ttrpg.bestiary")
 * et nettoie le répertoire d'acteurs du monde (game.actors).
 * @param {Function} [log=console.log]
 * @param {object} [options={}]
 * @param {boolean} [options.force=false]
 * @returns {Promise<{created: string[], updated: string[], pack: object|null}>}
 */
export async function syncBestiary(log = console.log, { force = false } = {}) {
  if (!game.user?.isGM) return { created: [], updated: [], pack: null };

  try {
    log("Synchronisation du Bestiaire dans le Compendium officiel...");

    // 0. Supprimer les compendiums doublons déclarés dans le monde pour ne garder que "warframe-ttrpg.bestiary"
    try {
      const duplicateWorldPacks = game.packs.filter(p => 
        (p.metadata.name === "bestiary" || p.metadata.label === "Bestiaire") &&
        p.collection !== "warframe-ttrpg.bestiary" &&
        (p.metadata.packageType === "world" || p.collection.startsWith("world.") || p.collection.startsWith("warframe-5e."))
      );
      for (const dwp of duplicateWorldPacks) {
        log(`Suppression du compendium mondial en double : ${dwp.collection}`);
        if (dwp.locked) await dwp.configure({ locked: false });
        await dwp.deleteCompendium();
      }
    } catch (wpErr) {
      console.warn("Warframe TTRPG | Avertissement suppression compendium doublon monde :", wpErr);
    }

    // 1. Nettoyage et déduplication des acteurs du monde (game.actors)
    try {
      // Supprimer les anciens dossiers de bestiaire résiduels dans le monde si existants
      const worldFoldersToDelete = game.folders.filter(f => 
        f.type === "Actor" && (
          f.name === "Bestiaire : Grineer" || f.name === "Bestiaire Grineer" ||
          f.name === "Bestiaire : Corpus" || f.name === "Bestiaire Corpus" ||
          f.name === "Bestiaire : Infestés" || f.name === "Bestiaire Infestés" ||
          f.name === "Bestiaire : Orokin" || f.name === "Bestiaire Orokin" ||
          f.name === "Bestiaire : Murmure" || f.name === "Bestiaire Murmure" ||
          f.name === "Bestiaire"
        )
      );
      for (const wf of worldFoldersToDelete) {
        await wf.delete();
      }

      // Purge de la "Mine Sangsue" / Latcher dans les acteurs du monde
      const latcherWorld = game.actors.filter(a => 
        a.type === "adversary" && (
          a.name.toLowerCase().includes("mine sangsue") ||
          a.name.toLowerCase().includes("latcher") ||
          a.flags?.["warframe-ttrpg"]?.adversaryId === "grnclatcher00001"
        )
      );
      if (latcherWorld.length > 0) {
        await Actor.deleteDocuments(latcherWorld.map(a => a.id));
        log(`Suppression de ${latcherWorld.length} 'Mine Sangsue' résiduelle(s) dans le monde.`);
      }

      // Dédupliquer les acteurs du monde pour ne garder strictement qu'un seul acteur par monstre
      const worldActorsToDelete = [];
      for (const adv of ALL_ADVERSARIES) {
        const matches = game.actors.filter(a => a.type === "adversary" && (a.name === adv.name || a.flags?.["warframe-ttrpg"]?.adversaryId === adv.id));
        if (matches.length > 1) {
          // Conserver le premier, marquer les autres doublons pour suppression
          for (let i = 1; i < matches.length; i++) {
            worldActorsToDelete.push(matches[i].id);
          }
        }
        // Pour l'acteur restant (s'il existe dans le monde), s'assurer qu'il a le bon portrait et le bon token
        const remaining = matches[0];
        if (remaining) {
          const needsFix = remaining.img !== adv.img || remaining.prototypeToken?.texture?.src !== adv.prototypeToken?.texture?.src;
          if (needsFix || force) {
            await remaining.update({
              img: adv.img,
              prototypeToken: foundry.utils.mergeObject(remaining.prototypeToken?.toObject?.() || {}, {
                texture: { src: adv.prototypeToken.texture.src }
              }),
              "flags.warframe-ttrpg.adversaryId": adv.id
            });
            log(`Acteur du monde synchronisé (Portrait + Token) : ${remaining.name}`);
          }
        }
      }
      if (worldActorsToDelete.length > 0) {
        await Actor.deleteDocuments(worldActorsToDelete);
        log(`Nettoyage de ${worldActorsToDelete.length} doublon(s) d'adversaires dans le journal d'acteurs.`);
      }
    } catch (cleanErr) {
      console.warn("Warframe TTRPG | Avertissement lors du nettoyage des acteurs du monde:", cleanErr);
    }

    // 2. Recherche ou initialisation du Compendium Pack officiel
    let bestiaryPack = game.packs.get("warframe-ttrpg.bestiary");
    if (!bestiaryPack) {
      bestiaryPack = game.packs.find(p => p.metadata.name === "bestiary" && p.metadata.packageName === "warframe-ttrpg");
    }
    if (!bestiaryPack) {
      bestiaryPack = game.packs.find(p => p.metadata.name === "bestiary" || p.metadata.label === "Bestiaire");
    }
    if (!bestiaryPack && typeof CompendiumCollection?.createCompendium === "function") {
      try {
        bestiaryPack = await CompendiumCollection.createCompendium({
          name: "bestiary",
          label: "Bestiaire",
          type: "Actor",
          system: "warframe-ttrpg"
        });
        log("Création dynamique du compendium 'Bestiaire' réussie.");
      } catch (err) {
        console.warn("Warframe TTRPG | Impossible de créer le compendium dynamiquement:", err);
      }
    }

    if (!bestiaryPack) {
      log("Compendium 'warframe-ttrpg.bestiary' introuvable (veuillez recharger Foundry pour charger le manifest system.json).");
      return { created: [], updated: [], pack: null };
    }

    await bestiaryPack.configure({ locked: false });

    // 3. Création / vérification des dossiers ("Grineer", "Corpus") dans le Compendium
    const packFolders = Array.from(bestiaryPack.folders || []);
    const missingFolders = bestiaryFolders.filter(bf => !packFolders.some(pf => pf.id === bf._id || pf.name === bf.name));
    if (missingFolders.length > 0) {
      try {
        await Folder.createDocuments(missingFolders, { pack: bestiaryPack.collection, keepId: true });
        log(`Dossiers créés dans le compendium Bestiaire : ${missingFolders.map(f => f.name).join(", ")}`);
      } catch (err) {
        console.warn("Warframe TTRPG | Avertissement création dossiers compendium:", err);
      }
    }

    // 4. Nettoyage de la "Mine Sangsue" / Latcher dans le Compendium
    const initialPackDocs = await bestiaryPack.getDocuments();
    const latcherCompendiumDocs = initialPackDocs.filter(d => 
      d.name.toLowerCase().includes("mine sangsue") ||
      d.name.toLowerCase().includes("latcher") ||
      d.id === "grnclatcher00001" ||
      d.flags?.["warframe-ttrpg"]?.adversaryId === "grnclatcher00001"
    );
    if (latcherCompendiumDocs.length > 0) {
      await Actor.deleteDocuments(latcherCompendiumDocs.map(d => d.id), { pack: bestiaryPack.collection });
      log(`Suppression de ${latcherCompendiumDocs.length} 'Mine Sangsue' dans le Compendium Bestiaire.`);
    }

    // 5. Déduplication et Seeding de TOUS les Adversaires (Grineer + Corpus) dans le Compendium
    const existingDocs = await bestiaryPack.getDocuments();
    const created = [];
    const updated = [];
    const deepClone = foundry.utils?.deepClone ?? ((obj) => JSON.parse(JSON.stringify(obj)));

    // Déduplication préventive dans le Compendium : un seul document par monstre
    const compendiumDuplicatesToDelete = [];
    for (const adv of ALL_ADVERSARIES) {
      const matches = existingDocs.filter(d => d.id === adv._id || d.id === adv.id || d.name === adv.name);
      if (matches.length > 1) {
        const canonical = matches.find(m => m.id === adv._id) || matches[0];
        for (const m of matches) {
          if (m.id !== canonical.id) {
            compendiumDuplicatesToDelete.push(m.id);
          }
        }
      }
    }
    if (compendiumDuplicatesToDelete.length > 0) {
      await Actor.deleteDocuments(compendiumDuplicatesToDelete, { pack: bestiaryPack.collection });
      log(`Suppression de ${compendiumDuplicatesToDelete.length} doublon(s) dans le Compendium Bestiaire.`);
    }

    // Récupérer les documents après déduplication
    const currentPackDocs = await bestiaryPack.getDocuments();
    if (bestiaryPack.locked) {
      await bestiaryPack.configure({ locked: false });
    }

    for (const adv of ALL_ADVERSARIES) {
      const targetFolder = adv.folder || ((adv._id?.startsWith("crp") || adv.id?.startsWith("crp")) ? "corpusfldr000001" : ((adv._id?.startsWith("inf") || adv.id?.startsWith("inf")) ? "infestedfldr0001" : ((adv._id?.startsWith("ork") || adv.id?.startsWith("ork")) ? "orokinfldr000001" : ((adv._id?.startsWith("mrm") || adv.id?.startsWith("mrm") || adv.id?.includes("fragment") || adv.system?.details?.faction === "Murmure") ? "murmurfldr000001" : "grineerfldr00001"))));
      const existing = currentPackDocs.find(d => d.id === adv._id || d.id === adv.id || d.name === adv.name);

      if (!existing) {
        const actorData = deepClone(adv);
        actorData._id = adv._id;
        actorData.folder = targetFolder;
        actorData.flags = actorData.flags || {};
        actorData.flags["warframe-ttrpg"] = { adversaryId: adv.id || adv._id };

        try {
          if (bestiaryPack.locked) await bestiaryPack.configure({ locked: false });
          await Actor.createDocuments([actorData], { pack: bestiaryPack.collection, keepId: true });
          created.push(adv.name);
          log(`Adversaire ajouté au Compendium : ${adv.name} [${adv.system?.details?.faction || "Inconnu"}]`);
        } catch (err) {
          console.error(`Warframe TTRPG | Échec d'ajout de ${adv.name} au Compendium:`, err);
        }
      } else {
        const needsUpdate = existing.img !== adv.img || 
                            existing.prototypeToken?.texture?.src !== adv.prototypeToken?.texture?.src ||
                            existing.name !== adv.name ||
                            existing.folder !== targetFolder;
        if (force || needsUpdate) {
          try {
            if (bestiaryPack.locked) await bestiaryPack.configure({ locked: false });
            await existing.update({
              name: adv.name,
              img: adv.img,
              prototypeToken: adv.prototypeToken,
              system: adv.system,
              folder: targetFolder,
              "flags.warframe-ttrpg.adversaryId": adv.id
            }, { pack: bestiaryPack.collection });
            updated.push(existing.name);
            log(`Adversaire mis à jour dans le Compendium : ${existing.name} (Portrait + Token)`);
          } catch (err) {
            console.error(`Warframe TTRPG | Échec de mise à jour de ${existing.name}:`, err);
          }
        }
      }
    }

    await bestiaryPack.configure({ locked: true });
    log(`Compendium Bestiaire synchronisé avec succès. Créés : ${created.length}, Mis à jour : ${updated.length}`);
    return { created, updated, pack: bestiaryPack };
  } catch (err) {
    console.error("Warframe TTRPG | Échec de synchronisation du Bestiaire dans le Compendium:", err);
    throw err;
  }
}

export const syncGrineerBestiary = syncBestiary;

// ========================================================
// WARFRAME TTRPG - OFFICIAL PLAYLISTS BY STORY ARC
// ========================================================

export async function syncWarframePlaylists(log = console.log) {
  if (!game.user?.isGM) return;

  const PLAYLISTS_CONFIG = [
    {
      name: "Warframe - 01. Vanilla & Système Origine",
      description: "Thèmes classiques du Système Origine, Second Dream, The War Within et factions ennemies.",
      mode: CONST.PLAYLIST_MODES?.SHUFFLE ?? 1,
      sounds: [
        { name: "This Is What You Are (Thème Opérateur / Second Dream)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/This Is What You Are - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Grineer Onslaught (Combat Grineer)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/Grineer Onslaught - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Wretched Things (Ambiance Galleon Grineer)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/Wretched Things - Keith Power.mp3", repeat: true, volume: 0.5 },
        { name: "Corpus Greed (Combat Corpus)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/Corpus Greed - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Hybrid Abominations (Invasion Infestée)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/Hybrid Abominations - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Our Disease (Ruche Infestée)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/Our Disease - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Rapid Adaptation (Mutations Infestées)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/Rapid Adaptation - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "A Cephalon Remembers (Céphale Ordis / Suda)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/A Cephalon Remembers - Keith Power.mp3", repeat: true, volume: 0.5 },
        { name: "The Weave (Sanctuaire de Simaris)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/The Weave - Keith Power.mp3", repeat: true, volume: 0.5 },
        { name: "Let's Get into Trouble (Escarmouche Dynamique)", path: "systems/warframe-ttrpg/asset/musique/01_Vanilla_et_Origine/Let's Get into Trouble - Digital Extremes.mp3", repeat: true, volume: 0.6 }
      ]
    },
    {
      name: "Warframe - 02. The New War",
      description: "La Nouvelle Guerre, invasion Sentient, Ballas & Narmer, Kahl-175, Veso et Railjack.",
      mode: CONST.PLAYLIST_MODES?.SHUFFLE ?? 1,
      sounds: [
        { name: "For Narmer (Hymne de Ballas & Narmer)", path: "systems/warframe-ttrpg/asset/musique/02_The_New_War/For Narmer - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Brothers Dead: Only Kahl (Kahl-175)", path: "systems/warframe-ttrpg/asset/musique/02_The_New_War/Brothers Dead - Only Kahl - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Veso Dash R (Mission Veso Corpus)", path: "systems/warframe-ttrpg/asset/musique/02_The_New_War/Veso Dash R - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Final Stand (Assaut Final The New War)", path: "systems/warframe-ttrpg/asset/musique/02_The_New_War/Final Stand - Keith Power.mp3", repeat: true, volume: 0.65 },
        { name: "Sentient Tombs (Murex Sentient)", path: "systems/warframe-ttrpg/asset/musique/02_The_New_War/Sentient Tombs - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Storm Category 5 (Railjack & Appel de Tempestarii)", path: "systems/warframe-ttrpg/asset/musique/02_The_New_War/Storm Category 5 - Keith Power.mp3", repeat: true, volume: 0.6 }
      ]
    },
    {
      name: "Warframe - 03. Anges du Zariman & Néant",
      description: "Le Zariman Ten-Zero, la Chrysalithe, les Sans-Logis et les profondeurs du Néant.",
      mode: CONST.PLAYLIST_MODES?.SHUFFLE ?? 1,
      sounds: [
        { name: "The Offering (Zariman Chrysalithe / Les Sans-Logis)", path: "systems/warframe-ttrpg/asset/musique/03_Anges_du_Zariman/The Offering - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Riders of the Void (Le Néant & Paradoxe de Duviri)", path: "systems/warframe-ttrpg/asset/musique/03_Anges_du_Zariman/Riders of the Void - Keith Power.mp3", repeat: true, volume: 0.6 }
      ]
    },
    {
      name: "Warframe - 04. Murmures dans les Murs & Indifférence",
      description: "Sanctum Anatomica, Albrecht Entrati, l'Indifférence et les créatures du Murmure.",
      mode: CONST.PLAYLIST_MODES?.SHUFFLE ?? 1,
      sounds: [
        { name: "Shadowgrapher (Albrecht Entrati & Laboratoires)", path: "systems/warframe-ttrpg/asset/musique/04_Whispers_in_the_Walls/Shadowgrapher - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Harrowed (Tourment & Sanctum Anatomica)", path: "systems/warframe-ttrpg/asset/musique/04_Whispers_in_the_Walls/Harrowed - Keith Power.mp3", repeat: true, volume: 0.6 },
        { name: "Rap Tap Tap (Rell & L'Homme dans le Mur)", path: "systems/warframe-ttrpg/asset/musique/04_Whispers_in_the_Walls/Rap Tap Tap - The Man in the Wall.mp3", repeat: false, volume: 0.7 },
        { name: "The Man in the Wall Quote (Voix de l'Indifférence)", path: "systems/warframe-ttrpg/asset/musique/04_Whispers_in_the_Walls/The Man in the Wall Quote.mp3", repeat: false, volume: 0.7 }
      ]
    },
    {
      name: "Warframe - 05. Mondes Ouverts & 1999",
      description: "Fortuna, la Vallée Orbis, Koumei et les Cinq Destins, et Warframe 1999 (On-lyne).",
      mode: CONST.PLAYLIST_MODES?.SHUFFLE ?? 1,
      sounds: [
        { name: "We All Lift Together (Hymne de Fortuna & Solaris)", path: "systems/warframe-ttrpg/asset/musique/05_Monde_Ouverts_et_1999/We All Lift Together - Keith Power.mp3", repeat: true, volume: 0.65 },
        { name: "Aurax (Combat dans la Vallée Orbis)", path: "systems/warframe-ttrpg/asset/musique/05_Monde_Ouverts_et_1999/Aurax - Digital Extremes.mp3", repeat: true, volume: 0.6 },
        { name: "What Is My Fate (Koumei et les Cinq Destins)", path: "systems/warframe-ttrpg/asset/musique/05_Monde_Ouverts_et_1999/What Is My Fate - Koumei and the Five Fates.mp3", repeat: true, volume: 0.6 },
        { name: "THE GREAT DESPAIR (On-lyne / Höllvan 1999)", path: "systems/warframe-ttrpg/asset/musique/05_Monde_Ouverts_et_1999/THE GREAT DESPAIR - On-lyne.mp3", repeat: true, volume: 0.65 },
        { name: "Running Late (Instrumental) (On-lyne / 1999)", path: "systems/warframe-ttrpg/asset/musique/05_Monde_Ouverts_et_1999/Running Late (Instrumental) - On-lyne.mp3", repeat: true, volume: 0.6 }
      ]
    }
  ];

  for (const pConfig of PLAYLISTS_CONFIG) {
    let playlist = game.playlists.find(p => p.name === pConfig.name);
    if (!playlist) {
      playlist = await Playlist.create({
        name: pConfig.name,
        description: pConfig.description,
        mode: pConfig.mode
      });
      log(`Playlist créée : ${pConfig.name}`);
    }

    if (playlist) {
      const existingPaths = new Set(playlist.sounds.map(s => s.path));
      const soundsToCreate = pConfig.sounds.filter(s => !existingPaths.has(s.path));
      if (soundsToCreate.length > 0) {
        await playlist.createEmbeddedDocuments("PlaylistSound", soundsToCreate);
        log(`Ajout de ${soundsToCreate.length} pistes audio à la playlist '${pConfig.name}'`);
      }
    }
  }
}

// ========================================================
// WARFRAME TTRPG - AUTOMATIC WORLD ASSET PATH MIGRATION
// ========================================================

export async function migrateWorldAssetPaths(log = console.log) {
  if (!game.user?.isGM) return;

  // 1. Acteurs du monde
  for (const actor of game.actors) {
    let needsUpdate = false;
    const updates = {};
    if (actor.img?.includes("Warframe 5e/Token/")) {
      updates.img = actor.img.replace("Warframe 5e/Token/", "systems/warframe-ttrpg/asset/Token/");
      needsUpdate = true;
    }
    if (actor.prototypeToken?.texture?.src?.includes("Warframe 5e/Token/")) {
      updates["prototypeToken.texture.src"] = actor.prototypeToken.texture.src.replace("Warframe 5e/Token/", "systems/warframe-ttrpg/asset/Token/");
      needsUpdate = true;
    }
    if (needsUpdate) {
      await actor.update(updates);
      log(`Chemins d'assets migrés pour l'acteur : ${actor.name}`);
    }
  }

  // 2. Tokens dans les scènes
  for (const scene of game.scenes) {
    for (const token of scene.tokens) {
      if (token.texture?.src?.includes("Warframe 5e/Token/")) {
        const newSrc = token.texture.src.replace("Warframe 5e/Token/", "systems/warframe-ttrpg/asset/Token/");
        await token.update({ "texture.src": newSrc });
        log(`Token migré dans la scène '${scene.name}' : ${token.name}`);
      }
    }
  }
}

// ========================================================
// ========================================================
// ========================================================
// WARFRAME TTRPG - NATIVE ORIGIN SYSTEM SCENE & SCENEMANAGER
// ========================================================

export async function ensureStarChartSceneAndCodex(log = console.log) {
  if (!game.user?.isGM) return;

  // 1. Ensure Journal Entry "Codex : Système Origine" exists
  let journal = game.journal.find(j => 
    j.name === "Codex : Système Origine" || 
    j.name?.includes("Origine") || 
    j.flags?.["warframe-ttrpg"]?.isStarChartCodex
  );
  if (!journal) {
    const pages = ORIGIN_SYSTEM_BODIES.map(body => {
      const faction = ORIGIN_SYSTEM_FACTIONS[body.factionId] || { name: "Neutre" };
      const resList = (body.resources || []).map(r => `<li>${r}</li>`).join("");
      return {
        name: body.name,
        type: "text",
        text: {
          content: `
            <h2>${body.name} (${body.subtitle || ""})</h2>
            <p><b>Faction dominante :</b> ${faction.name}</p>
            <p><b>Paliers Tenno Conseillés :</b> ${body.playerRank || "Non défini"}</p>
            <p><b>Ressources récoltables :</b></p>
            <ul>${resList}</ul>
            <p><b>Renseignements du Lotus :</b> ${body.lore || ""}</p>
            ${body.city ? `<p><b>Colonie & Refuge :</b> ${typeof body.city === 'object' ? `<strong>${body.city.name}</strong> (${body.city.subtitle || ""})<br/><i>${body.city.description || ""}</i>${body.city.notableNPCs ? `<br/><small><b>Personnalités & Artisans :</b> ${body.city.notableNPCs}</small>` : ""}` : body.city}</p>` : ""}
            ${body.openWorld ? `<p><b>Paysage Ouvert :</b> ${body.openWorld}</p>` : ""}
            ${body.boss ? `<p><b>Cible d'Assassinat :</b> ${body.boss.name} (${body.boss.location}) ${body.boss.briefing ? `- <i>${body.boss.briefing}</i>` : ""}</p>` : ""}
          `,
          format: 1
        }
      };
    });
    journal = await JournalEntry.create({
      name: "Codex : Système Origine",
      pages: pages,
      flags: {
        "warframe-ttrpg": {
          isStarChartCodex: true
        }
      }
    });
    log(`Created JournalEntry 'Codex : Système Origine' with ${pages.length} pages.`);
  } else if (journal.name !== "Codex : Système Origine") {
    await journal.update({ name: "Codex : Système Origine" });
  }

  // 2. Ensure Scene "Système Origine" exists and is cleanly configured for WarframeOriginSystemManager
  let scene = game.scenes.find(s => 
    s.name === "Système Origine" || 
    s.name?.includes("Origine") || 
    s.flags?.["warframe-ttrpg"]?.isStarChart
  );

  const sceneConfig = {
    name: "Système Origine",
    navName: "Système Origine",
    navigation: true, // Appears as an official tab in the scene navigation bar
    background: {
      src: null
    },
    backgroundColor: "#020408",
    width: 8000,
    height: 8000,
    padding: 0,
    grid: {
      type: CONST.GRID_TYPES.GRIDLESS,
      size: 100,
      distance: 1,
      units: "UA",
      alpha: 0
    },
    tokenVision: false,
    fog: { exploration: false },
    globalLight: true,
    darkness: 0,
    flags: {
      "warframe-ttrpg": {
        isStarChart: true
      }
    }
  };

  if (!scene) {
    scene = await Scene.create(sceneConfig);
    log("Created Scene 'Système Origine' (Native WebGL Managed Scene).");
  } else {
    const updates = {};
    if (scene.name !== "Système Origine") updates.name = "Système Origine";
    if (scene.navName !== "Système Origine") updates.navName = "Système Origine";
    if (scene.navigation !== true) updates.navigation = true;
    if (scene.backgroundColor !== "#020408") updates.backgroundColor = "#020408";
    if (scene.grid?.alpha !== 0) updates["grid.alpha"] = 0;
    if (scene.width !== 8000) updates.width = 8000;
    if (scene.height !== 8000) updates.height = 8000;
    if (scene.background?.src) updates["background.src"] = null;

    if (!foundry.utils.isEmpty(updates)) {
      await scene.update(updates);
      log("Synchronized Scene 'Système Origine' properties:", JSON.stringify(updates));
    }
  }

  // 3. Purge any residual embedded documents from legacy tests (notes, tokens, tiles, drawings)
  try {
    if (scene.notes?.size) {
      await scene.deleteEmbeddedDocuments("Note", Array.from(scene.notes.keys()));
      log(`Purged legacy notes from 'Système Origine'.`);
    }
    if (scene.tokens?.size) {
      await scene.deleteEmbeddedDocuments("Token", Array.from(scene.tokens.keys()));
      log(`Purged legacy tokens from 'Système Origine'.`);
    }
    if (scene.tiles?.size) {
      await scene.deleteEmbeddedDocuments("Tile", Array.from(scene.tiles.keys()));
      log(`Purged legacy tiles from 'Système Origine'.`);
    }
    if (scene.drawings?.size) {
      await scene.deleteEmbeddedDocuments("Drawing", Array.from(scene.drawings.keys()));
      log(`Purged legacy drawings from 'Système Origine'.`);
    }
  } catch (err) {
    console.warn("Could not purge legacy scene documents:", err);
  }

  // Register Scene in CONFIG.Canvas.managedScenes (Ember Architecture)
  CONFIG.Canvas.managedScenes = CONFIG.Canvas.managedScenes || {};
  CONFIG.Canvas.managedScenes[scene.id] = WarframeOriginSystemManager;
}

// Canvas Ready Hook: Ensure WarframeOriginSystemManager is active on Star Chart scene
Hooks.on("canvasReady", async () => { wfDiagLog("3. Hooks canvasReady fired! Scene: " + canvas?.scene?.name + " | isStarChart: " + isStarChartScene(canvas?.scene));
  if (isStarChartScene(canvas?.scene)) {
    CONFIG.Canvas.managedScenes = CONFIG.Canvas.managedScenes || {};
    CONFIG.Canvas.managedScenes[canvas.scene.id] = WarframeOriginSystemManager;

    const mgr = (canvas.manager instanceof WarframeOriginSystemManager) ? canvas.manager : canvas._warframeOriginManager;
    if (mgr) {
      if (!mgr.root || mgr.root.destroyed || !mgr.root.parent) {
        await mgr._draw();
      }
      mgr._startTicker();
      canvas.pan({ x: mgr.center.x, y: mgr.center.y, scale: 0.32 });
    } else {
      if (canvas._warframeOriginManager) {
        await canvas._warframeOriginManager._onTearDown();
      }
      canvas._warframeOriginManager = new WarframeOriginSystemManager(canvas.scene);
      await canvas._warframeOriginManager._onInit();
      await canvas._warframeOriginManager._onDraw();
      await canvas._warframeOriginManager._onReady();
    }
  }
});

// Canvas Teardown Hook: Clean up custom manager instance if active
Hooks.on("canvasTearDown", async () => {
  if (canvas._warframeOriginManager) {
    await canvas._warframeOriginManager._onTearDown();
    canvas._warframeOriginManager = null;
  }
  if (canvas.manager instanceof WarframeOriginSystemManager) {
    await canvas.manager._onTearDown();
  }
});

// Scene Control Buttons: Left Toolbar access
Hooks.on("getSceneControlButtons", (controls) => {
  const isArray = Array.isArray(controls);
  const tokenControls = isArray ? controls.find(c => c.name === "token") : (controls?.token || controls?.["token"]);
  if (tokenControls) {
    if (Array.isArray(tokenControls.tools)) {
      if (!tokenControls.tools.some(t => t.name === "warframeStarChartScene")) {
        tokenControls.tools.push({
          name: "warframeStarChartScene",
          title: "Carte Céleste (Système Origine)",
          icon: "fa-solid fa-globe",
          button: true,
          onClick: () => {
            warframeTTRPG?.openStarChart?.();
          }
        });
      }
      if (!tokenControls.tools.some(t => t.name === "warframeOpenBestiary")) {
        tokenControls.tools.push({
          name: "warframeOpenBestiary",
          title: "Bestiaire (Compendium)",
          icon: "fa-solid fa-skull-crossbones",
          button: true,
          onClick: async () => {
            await warframeTTRPG?.openBestiary?.();
          }
        });
      }
    }
  }

  const starChartGroup = {
    name: "warframeStarChartGroup",
    title: "Système Origine (Carte Céleste)",
    icon: "fa-solid fa-globe",
    layer: "tokens",
    visible: true,
    tools: [
      {
        name: "openOriginSystem",
        title: "Afficher le Système Origine",
        icon: "fa-solid fa-globe",
        button: true,
        onClick: () => {
          warframeTTRPG?.openStarChart?.();
        }
      }
    ],
    activeTool: "openOriginSystem"
  };

  if (isArray) {
    controls.push(starChartGroup);
  } else if (controls && typeof controls === "object") {
    controls.warframeStarChartGroup = starChartGroup;
  }
});
