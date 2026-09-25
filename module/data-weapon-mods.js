/**
 * Warframe TTRPG - Weapon Mods & Elemental Combinations Engine
 * Contains all canonical Primary, Secondary, Melee, Stance, and Galvanized/Primed weapon mods
 * along with the elemental combination resolver.
 */

/**
 * Resolves base elements into combined composite elements according to Warframe rules.
 * @param {Object} baseElements - { Heat, Cold, Electricity, Toxin }
 * @param {Object} standaloneCombined - { Blast, Radiation, Gas, Magnetic, Viral, Corrosive }
 * @returns {Object} Resulting elements map with active percentages and labels
 */
export function combineElements(baseElements = {}, standaloneCombined = {}) {
  const result = {};
  
  // Incorporate standalone combined elements
  for (const [el, val] of Object.entries(standaloneCombined)) {
    if (Number(val) > 0) {
      result[el] = (result[el] || 0) + Number(val);
    }
  }

  // Active base primaries in appearance order
  const rawPrimaries = [];
  if (Array.isArray(baseElements)) {
    for (const p of baseElements) {
      if (p && p.name && Number(p.val) > 0) {
        rawPrimaries.push({ name: p.name, val: Number(p.val) });
      }
    }
  } else if (baseElements && typeof baseElements === "object") {
    for (const [el, val] of Object.entries(baseElements)) {
      if (Number(val) > 0) {
        rawPrimaries.push({ name: el, val: Number(val) });
      }
    }
  }

  // Aggregate same elements while preserving first-seen order
  const activePrimaries = [];
  const nameIndexMap = new Map();
  for (const p of rawPrimaries) {
    if (nameIndexMap.has(p.name)) {
      const idx = nameIndexMap.get(p.name);
      activePrimaries[idx].val += p.val;
    } else {
      nameIndexMap.set(p.name, activePrimaries.length);
      activePrimaries.push({ name: p.name, val: p.val });
    }
  }

  const combinationTable = {
    "Heat+Cold": "Blast",
    "Cold+Heat": "Blast",
    "Heat+Electricity": "Radiation",
    "Electricity+Heat": "Radiation",
    "Heat+Toxin": "Gas",
    "Toxin+Heat": "Gas",
    "Cold+Electricity": "Magnetic",
    "Electricity+Cold": "Magnetic",
    "Cold+Toxin": "Viral",
    "Toxin+Cold": "Viral",
    "Electricity+Toxin": "Corrosive",
    "Toxin+Electricity": "Corrosive"
  };

  const used = new Set();
  for (let i = 0; i < activePrimaries.length; i++) {
    if (used.has(i)) continue;
    let combined = false;
    for (let j = i + 1; j < activePrimaries.length; j++) {
      if (used.has(j)) continue;
      const key = `${activePrimaries[i].name}+${activePrimaries[j].name}`;
      if (combinationTable[key]) {
        const composite = combinationTable[key];
        result[composite] = (result[composite] || 0) + activePrimaries[i].val + activePrimaries[j].val;
        used.add(i);
        used.add(j);
        combined = true;
        break;
      }
    }
    if (!combined && !used.has(i)) {
      result[activePrimaries[i].name] = (result[activePrimaries[i].name] || 0) + activePrimaries[i].val;
      used.add(i);
    }
  }

  return result;
}

export const weaponModFolders = [
  {
    "_id": "wpnfldrrifle0001",
    "name": "Arme Principale - Fusils",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#3498db"
  },
  {
    "_id": "wpnfldrshotg0001",
    "name": "Arme Principale - Fusils à pompe",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#2980b9"
  },
  {
    "_id": "wpnfldrpistl0001",
    "name": "Arme Secondaire - Pistolets",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#2ecc71"
  },
  {
    "_id": "wpnfldrmelee0001",
    "name": "Mêlée - Combat",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#e67e22"
  },
  {
    "_id": "wpnfldrstan00001",
    "name": "Mêlée - Postures",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#d35400"
  },
  {
    "_id": "wpnfldrprmg00001",
    "name": "Armes - Accrus & Galvanisés",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#ffd700"
  },
  {
    "_id": "wpnfldrexlw00001",
    "name": "Armes - Exilus & Utilitaire",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#f39c12"
  }
];

export const weaponModsDataset = [
  {
    "name": "Dentelure",
    "_id": "wfmodrifl0000001",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les dégâts de base du fusil de <strong>+165%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "uncommon",
      "drain": 14,
      "stats": {
        "damage": 165
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Serration.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Chambre Divisée",
    "_id": "wfmodrifl0000002",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+90% de Tir Multiple</strong>, accordant 90% de chances de tirer un projectile supplémentaire par tir.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 15,
      "stats": {
        "multishot": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/SplitChamber.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Frappe Précise",
    "_id": "wfmodrifl0000003",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances de Coup Critique du fusil de <strong>+150%</strong> de la valeur de base.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "critChance": 150
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PointStrike.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Sens Vital",
    "_id": "wfmodrifl0000004",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Dégâts Critiques du fusil de <strong>+120%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "critMultiplier": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/VitalSense.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Retard Critique",
    "_id": "wfmodrifl0000005",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "critChance": 200,
        "fireRate": -20
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CriticalDelay.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Gros Calibre",
    "_id": "wfmodrifl0000006",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+165% de Dégâts</strong> avec une pénalité à la précision de l'arme.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 16,
      "stats": {
        "damage": 165
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HeavyCaliber.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Munitions du Chasseur",
    "_id": "wfmodrifl0000007",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Sur Coup Critique : 30% de chances d'infliger automatiquement un effet de statut Tranchant (Saignement) !</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "slash": 30
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HunterMunitions.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Coup de Marteau",
    "_id": "wfmodrifl0000008",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+60% de Dégâts Critiques</strong> et <strong>+80% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "statusChance": 80,
        "critMultiplier": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HammerShot.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Aptitude au Fusil",
    "_id": "wfmodrifl0000009",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances de Statut du fusil de <strong>+90%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "rifle",
      "rarity": "uncommon",
      "drain": 7,
      "stats": {
        "statusChance": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/RifleAptitude.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Flammes de l'Enfer",
    "_id": "wfmodrifl0000010",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Feu</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "heat": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Hellfire.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Balles Cryogéniques",
    "_id": "wfmodrifl0000011",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Glace</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "rifle",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "cold": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CryoRounds.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Porteur de Tempête",
    "_id": "wfmodrifl0000012",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de fusil de <strong>+90% de Dégâts Électriques</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "electricity": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Stormbringer.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Chargeur Infecté",
    "_id": "wfmodrifl0000013",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de fusil de <strong>+90% de Dégâts de Toxine</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "toxin": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/InfectedClip.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Force Maligne",
    "_id": "wfmodrifl0000014",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "toxin": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/MalignantForce.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Balles GivFormat",
    "_id": "wfmodrifl0000015",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "cold": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/RimeRounds.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Balles Thermite",
    "_id": "wfmodrifl0000016",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "heat": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ThermiteRounds.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Haute Tension",
    "_id": "wfmodrifl0000017",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "electricity": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HighVoltage.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Gâchette Rapide",
    "_id": "wfmodrifl0000018",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Accélère le mécanisme cyclique, conférant <strong>+60% de Cadence de Tir</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "fireRate": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/SpeedTrigger.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Accélération Vile",
    "_id": "wfmodrifl0000019",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+90% de Cadence de Tir</strong>, mais réduit les Dégâts de <strong>-15%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "fireRate": 90,
        "damage": -15
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/VileAcceleration.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Mains Lestes",
    "_id": "wfmodrifl0000020",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente la Vitesse de Rechargement du fusil de <strong>+30%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "common",
      "drain": 7,
      "stats": {
        "reload": 30
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/FastHands.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Déformation de Chargeur",
    "_id": "wfmodrifl0000021",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente la Capacité du Chargeur du fusil de <strong>+30%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "magazine": 30
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/MagazineWarp.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Armements du Justicier",
    "_id": "wfmodrifl0000022",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+60% de Tir Multiple</strong> et 5% de chances d'augmenter le rang d'un coup critique.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "multishot": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/VigilanteArmaments.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Salve Dentelée",
    "_id": "wfmodrifl0000023",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Renforce le tranchant cinétique du fusil, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 11,
      "stats": {
        "slash": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/FangedFusillade.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Calibre Perforant",
    "_id": "wfmodrifl0000024",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Renforce la pénétration cinétique anti-blindage, conférant <strong>+120% de Dégâts Perforants</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 11,
      "stats": {
        "puncture": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PiercingCaliber.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Tir Fracassant",
    "_id": "wfmodrifl0000025",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Renforce les ondes de choc contondantes, conférant <strong>+120% de Dégâts d'Impact</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 11,
      "stats": {
        "impact": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CrashShot.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Rechargement Irradié",
    "_id": "wfmodrifl0000026",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de fusil de <strong>+60% de Dégâts de Radiation</strong> et améliore la Vitesse de Rechargement de <strong>+40%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "reload": 40,
        "radiation": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/RadiatedReload.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Balles Thermobariques",
    "_id": "wfmodrifl0000027",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts Explosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "blast": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Vapeur Toxique",
    "_id": "wfmodrifl0000028",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "gas": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "Balles Magnétiques",
    "_id": "wfmodrifl0000029",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les munitions de fusil de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "magnetic": 60,
        "statusChance": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png",
    "folder": "wpnfldrrifle0001"
  },
  {
    "name": "À Bout Portant",
    "_id": "wfmodshot0000001",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les dégâts de base du fusil à pompe de <strong>+90%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "damage": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PointBlank.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Chambre des Enfers",
    "_id": "wfmodshot0000002",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+120% de Tir Multiple</strong>, multipliant spectaculairement le nombre de plombs par décharge.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 15,
      "stats": {
        "multishot": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HellsChamber.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Tromblon",
    "_id": "wfmodshot0000003",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances Critiques du fusil à pompe de <strong>+90%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "critChance": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Blunderbuss.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Ravage",
    "_id": "wfmodshot0000004",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Dégâts Critiques du fusil à pompe de <strong>+60%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "critMultiplier": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Ravage.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Décélération Critique",
    "_id": "wfmodshot0000005",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "critChance": 200,
        "fireRate": -20
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CriticalDeceleration.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Dispersion Vicieuse",
    "_id": "wfmodshot0000006",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+90% de Dégâts</strong> avec une dispersion accrue des plombs.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "damage": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ViciousSpread.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Frénésie au Pompe",
    "_id": "wfmodshot0000007",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Accélère le cycle de réarmement à pompe / semi-auto, conférant <strong>+90% de Cadence de Tir</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "shotgun",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "fireRate": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ShotgunSpazz.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Maîtrise du Pompe",
    "_id": "wfmodshot0000008",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances de Statut du fusil à pompe de <strong>+90%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "shotgun",
      "rarity": "uncommon",
      "drain": 7,
      "stats": {
        "statusChance": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ShotgunSavvy.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Revêtement Incendiaire",
    "_id": "wfmodshot0000009",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Feu</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "shotgun",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "heat": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/IncendiaryCoat.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Étreinte Glaciale",
    "_id": "wfmodshot0000010",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Glace</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "shotgun",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "cold": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ChillingGrasp.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Cartouche Chargée",
    "_id": "wfmodshot0000011",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne la chevrotine de <strong>+90% de Dégâts Électriques</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "shotgun",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "electricity": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ChargedShell.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Dispersion Contagieuse",
    "_id": "wfmodshot0000012",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne la chevrotine de <strong>+90% de Dégâts de Toxine</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "shotgun",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "toxin": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ContagiousSpread.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Barrage Toxique",
    "_id": "wfmodshot0000013",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "toxin": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ToxicBarrage.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Souffle Frigide",
    "_id": "wfmodshot0000014",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "cold": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/FrigidBlast.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Enfer Dispersé",
    "_id": "wfmodshot0000015",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "heat": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ScatteringInferno.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Choc de Cartouche",
    "_id": "wfmodshot0000016",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "electricity": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ShellShock.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Pompe Tactique",
    "_id": "wfmodshot0000017",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente la Vitesse de Rechargement du fusil à pompe de <strong>+30%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "shotgun",
      "rarity": "common",
      "drain": 7,
      "stats": {
        "reload": 30
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/TacticalPump.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Stock de Munitions",
    "_id": "wfmodshot0000018",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente la Capacité du Chargeur du fusil à pompe de <strong>+60%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "shotgun",
      "rarity": "common",
      "drain": 7,
      "stats": {
        "magazine": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/AmmoStock.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Dentelure Balayante",
    "_id": "wfmodshot0000019",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Renforce le pouvoir de déchiquetage, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 11,
      "stats": {
        "slash": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/SweepingSerration.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Flambée",
    "_id": "wfmodshot0000020",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+60% de Dégâts de Base</strong> et <strong>+60% de Dégâts de Feu</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "heat": 60,
        "damage": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Blaze.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Dispersion Corrosive",
    "_id": "wfmodshot0000021",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "corrosive": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Balle Lourde Radiative",
    "_id": "wfmodshot0000022",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "radiation": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Injection Virale",
    "_id": "wfmodshot0000023",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les cartouches de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "viral": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png",
    "folder": "wpnfldrshotg0001"
  },
  {
    "name": "Frappe Frelon",
    "_id": "wfmodpist0000001",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les dégâts de base de l'arme secondaire de <strong>+220%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "uncommon",
      "drain": 14,
      "stats": {
        "damage": 220
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HornetStrike.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Diffusion de Canon",
    "_id": "wfmodpist0000002",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+120% de Tir Multiple</strong> aux pistolets.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 11,
      "stats": {
        "multishot": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/BarrelDiffusion.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Torrent Léthal",
    "_id": "wfmodpist0000003",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double amélioration de combat : Confère <strong>+60% de Cadence de Tir</strong> et <strong>+60% de Tir Multiple</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 11,
      "stats": {
        "multishot": 60,
        "fireRate": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/LethalTorrent.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Gambit du Pistolet",
    "_id": "wfmodpist0000004",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances Critiques du pistolet de <strong>+120%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "critChance": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PistolGambit.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Fracasseur de Cibles",
    "_id": "wfmodpist0000005",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Dégâts Critiques du pistolet de <strong>+60%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "critMultiplier": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/TargetCracker.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Œil-de-Bœuf Rampant",
    "_id": "wfmodpist0000006",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+200% de Chances Critiques</strong>, mais réduit la Cadence de Tir de <strong>-20%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "critChance": 200,
        "fireRate": -20
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CreepingBullseye.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Puissance Magnum",
    "_id": "wfmodpist0000007",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+165% de Dégâts</strong> avec une précision réduite.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 14,
      "stats": {
        "damage": 165
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/MagnumForce.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Tir Assuré",
    "_id": "wfmodpist0000008",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances de Statut du pistolet de <strong>+90%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "pistol",
      "rarity": "uncommon",
      "drain": 7,
      "stats": {
        "statusChance": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/SureShot.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Charge Chauffée",
    "_id": "wfmodpist0000009",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Feu</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "heat": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HeatedCharge.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Gel Profond",
    "_id": "wfmodpist0000010",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Glace</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "pistol",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "cold": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/DeepFreeze.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Convulsion",
    "_id": "wfmodpist0000011",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts Électriques</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "electricity": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Convulsion.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Balles Pathogènes",
    "_id": "wfmodpist0000012",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne les balles de pistolet de <strong>+90% de Dégâts de Toxine</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "toxin": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PathogenRounds.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Peste au Pistolet",
    "_id": "wfmodpist0000013",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "toxin": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PistolPestilence.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Gelure",
    "_id": "wfmodpist0000014",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "cold": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Frostbite.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Roussir",
    "_id": "wfmodpist0000015",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "heat": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Scorch.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Secousse",
    "_id": "wfmodpist0000016",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "electricity": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Jolt.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Pistolero",
    "_id": "wfmodpist0000017",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Déclenchement rapide de la détente conférant <strong>+72% de Cadence de Tir</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "fireRate": 72
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Gunslinger.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Agilité Anémique",
    "_id": "wfmodpist0000018",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+90% de Cadence de Tir</strong>, mais réduit les Dégâts de <strong>-15%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "fireRate": 90,
        "damage": -15
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/AnemicAgility.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Dégainement Rapide",
    "_id": "wfmodpist0000019",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente la Vitesse de Rechargement du pistolet de <strong>+48%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "common",
      "drain": 7,
      "stats": {
        "reload": 48
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Quickdraw.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Chargeur Glissant",
    "_id": "wfmodpist0000020",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente la Capacité du Chargeur du pistolet de <strong>+30%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "magazine": 30
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/SlipMagazine.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Mutilation",
    "_id": "wfmodpist0000021",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Renforce le déchirement balistique, conférant <strong>+120% de Dégâts Tranchants</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 11,
      "stats": {
        "slash": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Maim.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Charge Radiative",
    "_id": "wfmodpist0000022",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "radiation": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Balles Acides",
    "_id": "wfmodpist0000023",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "corrosive": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Givre Pathogène",
    "_id": "wfmodpist0000024",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "viral": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Frisson Électrostatique",
    "_id": "wfmodpist0000025",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "magnetic": 60,
        "statusChance": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Nuage de Vapeur",
    "_id": "wfmodpist0000026",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les tirs secondaires de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "gas": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png",
    "folder": "wpnfldrpistl0001"
  },
  {
    "name": "Point de Pression",
    "_id": "wfmodmelc0000001",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les dégâts des frappes de mêlée de base de <strong>+120%</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "damage": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PressurePoint.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Surcharge d'État",
    "_id": "wfmodmelc0000002",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Dégâts de Mêlée de <strong>+80% pour chaque Type de Statut unique</strong> affectant activement la cible !</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 15,
      "stats": {
        "damage": 80
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ConditionOverload.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Véritable Acier",
    "_id": "wfmodmelc0000003",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances Critiques en mêlée de <strong>+120%</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "critChance": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/TrueSteel.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Afflux de Sang",
    "_id": "wfmodmelc0000004",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Maîtrise martiale conférant <strong>+40% de Chances Critiques par niveau de Compteur de Combo</strong> !</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "critChance": 40
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/BloodRush.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Broie-Organes",
    "_id": "wfmodmelc0000005",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Dégâts Critiques en mêlée de <strong>+90%</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "critMultiplier": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/OrganShatter.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Puissance du Gladiateur",
    "_id": "wfmodmelc0000006",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+60% de Dégâts Critiques</strong> et +10% de Chances Critiques par niveau de combo.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "common",
      "drain": 9,
      "stats": {
        "critChance": 10,
        "critMultiplier": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/GladiatorMight.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Plaies Suintantes",
    "_id": "wfmodmelc0000007",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances de Statut en mêlée de <strong>+40% par niveau de Compteur de Combo</strong> !</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "statusChance": 40
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/WeepingWounds.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Prouesse en Mêlée",
    "_id": "wfmodmelc0000008",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente les Chances de Statut en mêlée de <strong>+90%</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 7,
      "stats": {
        "statusChance": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/MeleeProwess.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Furie",
    "_id": "wfmodmelc0000009",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente la Vitesse d'Attaque en mêlée de <strong>+30%</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "fireRate": 30
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Fury.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Furie Berserker",
    "_id": "wfmodmelc0000010",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Sur Élimination en Mêlée : Confère <strong>+70% de Vitesse d'Attaque</strong> pendant 10 secondes.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "fireRate": 70
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/BerserkerFury.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Accélération",
    "_id": "wfmodmelc0000011",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+40% de Vitesse d'Attaque</strong> et accélère la génération de combo.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 9,
      "stats": {
        "fireRate": 40
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Quickening.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Allonge",
    "_id": "wfmodmelc0000012",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Étend la portée des attaques de mêlée de <strong>+5 feet (1,5 m)</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "common",
      "drain": 7,
      "stats": {
        "range": 5
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Reach.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Impact Fusionnel",
    "_id": "wfmodmelc0000013",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Feu</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "heat": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/MoltenImpact.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Vent du Nord",
    "_id": "wfmodmelc0000014",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Glace</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "cold": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/NorthWind.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Contact Choquant",
    "_id": "wfmodmelc0000015",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts Électriques</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "electricity": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ShockingTouch.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Frappe de Fièvre",
    "_id": "wfmodmelc0000016",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Imprègne le tranchant de la mêlée de <strong>+90% de Dégâts de Toxine</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "toxin": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/FeverStrike.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Fléau Virulent",
    "_id": "wfmodmelc0000017",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Toxine</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "toxin": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/VirulentScourge.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Givre Vicieux",
    "_id": "wfmodmelc0000018",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Glace</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "cold": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ViciousFrost.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Fil Volcanique",
    "_id": "wfmodmelc0000019",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts de Feu</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "heat": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/VolcanicEdge.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Frappe Voltaïque",
    "_id": "wfmodmelc0000020",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut (60/60) : Confère <strong>+60% de Dégâts Électriques</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "electricity": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/VoltaicStrike.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Coup Mortel",
    "_id": "wfmodmelc0000021",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+120% de Dégâts d'Attaque Lourde</strong> et accélère l'exécution des attaques lourdes.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 11,
      "stats": {
        "damage": 120
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/KillingBlow.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Charge Corrompue",
    "_id": "wfmodmelc0000022",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Corrompu : Confère <strong>+30 au Compteur Initial de Combo</strong> dès le dégainement.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "initialCombo": 30
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CorruptCharge.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Contact Dérivant",
    "_id": "wfmodmelc0000023",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Augmente la Durée du Combo de <strong>+10s</strong> et confère <strong>+40% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 5,
      "stats": {
        "statusChance": 40,
        "comboDuration": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/DriftingContact.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Frappe Vitalisante",
    "_id": "wfmodmelc0000024",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Les attaques lourdes convertissent <strong>20% des dégâts infligés</strong> en Santé pour le porteur.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 9,
      "stats": {},
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/LifeStrike.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Mandibule de Carnis",
    "_id": "wfmodmelc0000025",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Confère <strong>+90% de Dégâts Tranchants</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 9,
      "stats": {
        "statusChance": 60,
        "slash": 90
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CarnisMandible.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Enfer Voltaïque",
    "_id": "wfmodmelc0000026",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts de Radiation</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "radiation": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialRadiationGlyph.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Lame Caustique",
    "_id": "wfmodmelc0000027",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Corrosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "corrosive": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialCorrosiveGlyph.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Givre Virulent",
    "_id": "wfmodmelc0000028",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Viraux</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "viral": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialViralGlyph.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Lame Magnétique",
    "_id": "wfmodmelc0000029",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Magnétiques</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "magnetic": 60,
        "statusChance": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialMagneticGlyph.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Fil Nocif",
    "_id": "wfmodmelc0000030",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts de Gaz</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "gas": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialGasGlyph.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Frappe Explosive",
    "_id": "wfmodmelc0000031",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Double Statut : Imprègne les frappes de mêlée de <strong>+60% de Dégâts Explosifs</strong> et <strong>+60% de Chances de Statut</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 7,
      "stats": {
        "statusChance": 60,
        "blast": 60
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Element icon/EssentialBlastGlyph.png",
    "folder": "wpnfldrmelee0001"
  },
  {
    "name": "Phénix de Fer",
    "_id": "wfmodstan0000001",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture d'Épée : Enchaînements de l'Aile de l'Aube. Confère <strong>+10 de Capacité de Mods</strong> (+20 en correspondance).</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/IronPhoenix.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Derviche Cramoisi",
    "_id": "wfmodstan0000002",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture d'Épée : Formes du Lotus Enroulé infligeant +50% de dégâts bonus sur les premières attaques. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10,
        "damage": 50
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CrimsonDervish.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Berserker Vengeur",
    "_id": "wfmodstan0000003",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Doubles Épées : Balayages déchirants furieux et décapitations tournantes. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/VengefulBerserker.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Tigre Tournoyant",
    "_id": "wfmodstan0000004",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Doubles Épées : Rafales rapides aux crocs jumeaux à fort déclenchement de statut. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Zenurik",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/SwirlingTiger.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Mante Sculptante",
    "_id": "wfmodstan0000005",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Doubles Épées : Frappes chirurgicales de mante garantissant des statuts Tranchants. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CarvingMantis.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Tempo Royal",
    "_id": "wfmodstan0000006",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Lame Lourde : Dévastation orbitale avec une forte capacité de renversement. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/TempoRoyale.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Tourbillon Tranchant",
    "_id": "wfmodstan0000007",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Lame Lourde : Frappes tournoyantes en ouragan du Taureau Brisé. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Unairu",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CleavingWhirlwind.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Grue Déchirante",
    "_id": "wfmodstan0000008",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Lame Lourde : Fentes descendantes écrasantes. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/RendingCrane.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Ruine Écrasante",
    "_id": "wfmodstan0000009",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Marteau : Fracas cinétiques orbitaux dévastateurs. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CrushingRuin.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Fléau Scintillant",
    "_id": "wfmodstan0000010",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture d'Arme d'Hast : Enchaînements fluides et circulaires continus. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Zenurik",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ShimmeringBlight.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Saule Sanglant",
    "_id": "wfmodstan0000011",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture d'Arme d'Hast : Larges arcs de balayage martial sur de vastes zones. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/BleedingWillow.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Flèche Tournoyante",
    "_id": "wfmodstan0000012",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture d'Arme d'Hast : Estocades plongeantes à forts dégâts et acrobaties à la lance. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/TwirlingSpire.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Forêt Entrecroisée",
    "_id": "wfmodstan0000013",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Bâton : Frappes acrobatiques de la floraison bondissante. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Zenurik",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ClashingForest.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Branche Agitée",
    "_id": "wfmodstan0000014",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Bâton : Combos percutants du tourbillon de feuilles d'automne. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/FlailingBranch.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Justice Aveugle",
    "_id": "wfmodstan0000015",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Nikana : Prise inversée style Zatoichi pour des coupes éclairs de iaido. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/BlindJustice.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Taille Tranquille",
    "_id": "wfmodstan0000016",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Nikana : Escrime formelle et élégante garantissant des coups de grâce critiques. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/TranquilCleave.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Jugement Décisif",
    "_id": "wfmodstan0000017",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Nikana à Deux Mains : Tranchants lourds d'exécution à deux mains. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/DecisiveJudgement.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Vent Pointu",
    "_id": "wfmodstan0000018",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Dague : Estocades perforantes infligeant un saignement létal. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PointedWind.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Croc Chercheur",
    "_id": "wfmodstan0000019",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Dague : Frappes vives d'estoc enchaînées rapidement. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HomingFang.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Paume Sismique",
    "_id": "wfmodstan0000020",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Poings : Coups de paume à onde de choc déstabilisant les adversaires. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/SeismicPalm.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Vent Fracturant",
    "_id": "wfmodstan0000021",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Poings : Combos brise-os provoquant de lourds statuts d'Impact. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/FracturingWind.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Furie Sinistre",
    "_id": "wfmodstan0000022",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Pugilat : Combinaisons d'arts martiaux mêlant coups de poing et coups de pied. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/GrimFury.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Marée Brutale",
    "_id": "wfmodstan0000023",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Pugilat : Balayages acrobatiques inspirés de la capoeira. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/BrutalTide.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Crépuscule Astral",
    "_id": "wfmodstan0000024",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Glaive : Arcs de lancer gracieux et retours cinétiques. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/AstralTwilight.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Serre Scintillante",
    "_id": "wfmodstan0000025",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Glaive : Décapitations féroces au disque et lancers explosifs. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/GleamingTalon.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Spirale Faucheuse",
    "_id": "wfmodstan0000026",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Faux : Larges fauchages sinistres récoltant les âmes ennemies. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "uncommon",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/ReapingSpiral.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Éventail Traqueur",
    "_id": "wfmodstan0000027",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Faux : Tourbillons tranchants mortels et taillades d'exécution. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/StalkingFan.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Plein Midi",
    "_id": "wfmodstan0000028",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Pisto-Lame : Taillades combinées harmonieusement avec des décharges à bout portant. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/HighNoon.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Danse des Balles",
    "_id": "wfmodstan0000029",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Pisto-Lame : Décharges balistiques rapides et virevoltantes. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/BulletDance.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Vipère Enroulée",
    "_id": "wfmodstan0000030",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Posture de Fouet : Coups de lanière balayant le sol pour faire trébucher les ennemis. Confère <strong>+10 de Capacité</strong>.</p>",
      "type": "stance",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "rare",
      "drain": 10,
      "stats": {
        "capacity": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/CoilingViper.png",
    "folder": "wpnfldrstan00001"
  },
  {
    "name": "Dentelure Accrue",
    "_id": "wfmodprmg0000001",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Augmente les dégâts de base du fusil de <strong>+220%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "legendary",
      "drain": 16,
      "stats": {
        "damage": 220
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedSerration.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "À Bout Portant Accru",
    "_id": "wfmodprmg0000002",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Augmente les dégâts de base du fusil à pompe de <strong>+165%</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "legendary",
      "drain": 14,
      "stats": {
        "damage": 165
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPointBlank.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Balles Cryogéniques Accrues",
    "_id": "wfmodprmg0000003",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Imprègne les balles de fusil de <strong>+165% de Dégâts de Glace</strong>.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Vazarin",
      "weaponType": "rifle",
      "rarity": "legendary",
      "drain": 16,
      "stats": {
        "cold": 165
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedCryoRounds.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Gambit du Pistolet Accru",
    "_id": "wfmodprmg0000004",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Augmente les Chances Critiques du pistolet de <strong>+187%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "legendary",
      "drain": 12,
      "stats": {
        "critChance": 187
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPistolGambit.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Fracasseur de Cibles Accru",
    "_id": "wfmodprmg0000005",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Augmente les Dégâts Critiques du pistolet de <strong>+110%</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "legendary",
      "drain": 12,
      "stats": {
        "critMultiplier": 110
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedTargetCracker.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Charge Chauffée Accrue",
    "_id": "wfmodprmg0000006",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Imprègne les balles de pistolet de <strong>+165% de Dégâts de Feu</strong>.</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "pistol",
      "rarity": "legendary",
      "drain": 15,
      "stats": {
        "heat": 165
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedHeatedCharge.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Point de Pression Accru",
    "_id": "wfmodprmg0000007",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Augmente les dégâts de mêlée de base de <strong>+165%</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "legendary",
      "drain": 14,
      "stats": {
        "damage": 165
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedPressurePoint.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Frappe de Fièvre Accrue",
    "_id": "wfmodprmg0000008",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Imprègne les frappes de mêlée de <strong>+165% de Dégâts de Toxine</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "melee",
      "rarity": "legendary",
      "drain": 16,
      "stats": {
        "toxin": 165
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedFeverStrike.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Allonge Accrue",
    "_id": "wfmodprmg0000009",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Étend la portée de frappe de mêlée de <strong>+10 feet (3,0 m)</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "legendary",
      "drain": 14,
      "stats": {
        "range": 10
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedReach.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Furie Accrue",
    "_id": "wfmodprmg0000010",
    "system": {
      "rank": {
        "value": 10,
        "max": 10
      },
      "description": "<p>Chef-d'œuvre Orokin : Augmente la Vitesse d'Attaque en mêlée de <strong>+55%</strong>.</p>",
      "type": "standard",
      "modType": "melee",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "melee",
      "rarity": "legendary",
      "drain": 14,
      "stats": {
        "fireRate": 55
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/PrimedFury.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Chambre Galvanisée",
    "_id": "wfmodprmg0000011",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod d'Arbitrage : Confère <strong>+80% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 5x).</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 12,
      "stats": {
        "multishot": 80
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedChamber.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Aptitude Galvanisée",
    "_id": "wfmodprmg0000012",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod d'Arbitrage : Confère <strong>+80% de Chances de Statut</strong> ; sur Élimination : Confère <strong>+40% de Dégâts Directs par Statut</strong> sur la cible.</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "rifle",
      "rarity": "rare",
      "drain": 12,
      "stats": {
        "statusChance": 80,
        "damage": 40
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedAptitude.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Diffusion Galvanisée",
    "_id": "wfmodprmg0000013",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod d'Arbitrage : Confère <strong>+110% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 4x).</p>",
      "type": "standard",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "pistol",
      "rarity": "rare",
      "drain": 12,
      "stats": {
        "multishot": 110
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedDiffusion.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Enfers Galvanisés",
    "_id": "wfmodprmg0000014",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod d'Arbitrage : Confère <strong>+110% de Tir Multiple</strong> ; sur Élimination : Confère <strong>+30% de Tir Multiple supplémentaire</strong> pendant 20s (cumulable 4x).</p>",
      "type": "standard",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "shotgun",
      "rarity": "rare",
      "drain": 12,
      "stats": {
        "multishot": 110
      },
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/GalvanizedHell.png",
    "folder": "wpnfldrprmg00001"
  },
  {
    "name": "Ravitaillement du Justicier",
    "_id": "wfmodexlw0000001",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Exilus : Convertit les ramassages de munitions secondaires et de sniper en Munitions Principales (+30% ramassage), avec 5% de chances d'augmenter le palier de coup critique.</p>",
      "type": "exilus",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "all",
      "rarity": "rare",
      "drain": 9,
      "stats": {},
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/VigilanteSupplies.png",
    "folder": "wpnfldrexlw00001"
  },
  {
    "name": "Vitesse Terminale",
    "_id": "wfmodexlw0000002",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Exilus : Augmente la Vitesse de Vol des Projectiles de <strong>+60%</strong>.</p>",
      "type": "exilus",
      "modType": "primary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "all",
      "rarity": "uncommon",
      "drain": 7,
      "stats": {},
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/TerminalVelocity.png",
    "folder": "wpnfldrexlw00001"
  },
  {
    "name": "Silence",
    "_id": "wfmodexlw0000003",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Mod Exilus : Réduit le bruit des tirs de fusil de 100% (tir complètement silencieux).</p>",
      "type": "exilus",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "all",
      "rarity": "common",
      "drain": 5,
      "stats": {},
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Hush.png",
    "folder": "wpnfldrexlw00001"
  },
  {
    "name": "Silencieux",
    "_id": "wfmodexlw0000004",
    "system": {
      "rank": {
        "value": 3,
        "max": 3
      },
      "description": "<p>Mod Exilus : Réduit le bruit des tirs de pistolet de 100% (tir complètement silencieux).</p>",
      "type": "exilus",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "all",
      "rarity": "common",
      "drain": 5,
      "stats": {},
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Suppress.png",
    "folder": "wpnfldrexlw00001"
  },
  {
    "name": "Moment Léthal",
    "_id": "wfmodexlw0000005",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Exilus : Augmente la Vitesse de Vol des Projectiles de pistolet de <strong>+40%</strong>.</p>",
      "type": "exilus",
      "modType": "secondary",
      "equipped": false,
      "polarity": "Madurai",
      "weaponType": "all",
      "rarity": "uncommon",
      "drain": 7,
      "stats": {},
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/LethalMomentum.png",
    "folder": "wpnfldrexlw00001"
  },
  {
    "name": "Stabilisateur",
    "_id": "wfmodexlw0000006",
    "system": {
      "rank": {
        "value": 5,
        "max": 5
      },
      "description": "<p>Mod Exilus : Réduit le recul de l'arme de <strong>-60%</strong>.</p>",
      "type": "exilus",
      "modType": "primary",
      "equipped": false,
      "polarity": "Naramon",
      "weaponType": "all",
      "rarity": "rare",
      "drain": 9,
      "stats": {},
      "slot": ""
    },
    "type": "mod",
    "img": "systems/warframe-ttrpg/asset/Mods/Weapon/Stabilizer.png",
    "folder": "wpnfldrexlw00001"
  }
];
