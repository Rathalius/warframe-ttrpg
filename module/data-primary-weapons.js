/**
 * Warframe TTRPG - Primary Weapons Arsenal Dataset
 */

export const primaryWeaponFolders = [
  {
    "_id": "wpnfldrprim00001",
    "name": "Armes Principales",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#3498db"
  },
  {
    "_id": "wpnfldrrifauto01",
    "name": "Fusils - Automatique",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#00e5ff"
  },
  {
    "_id": "wpnfldrrifsemi01",
    "name": "Fusils - Semi-automatique",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#3498db"
  },
  {
    "_id": "wpnfldrrifbrst01",
    "name": "Fusils - Rafale",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#5dade2"
  },
  {
    "_id": "wpnfldrrifbeam01",
    "name": "Fusils - Continu / Rayon",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#9b59b6"
  },
  {
    "_id": "wpnfldrrifspec01",
    "name": "Fusils - À charge & Spéciaux",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#f39c12"
  },
  {
    "_id": "wpnfldrshotgun01",
    "name": "Fusils à pompe",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#e74c3c"
  },
  {
    "_id": "wpnfldrbowxbow01",
    "name": "Bows & Crossbows",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#2ecc71"
  },
  {
    "_id": "wpnfldrsniper001",
    "name": "Fusils de précision",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#1abc9c"
  },
  {
    "_id": "wpnfldrlaunch001",
    "name": "Lanceurs & Armes lourdes",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#e67e22"
  },
  {
    "_id": "wpnfldrarmcan001",
    "name": "Canons de bras",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#95a5a6"
  },
  {
    "_id": "wpnfldrprimkuva1",
    "name": "Armes Principales Kuva",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#8B0000"
  },
  {
    "_id": "wpnfldrprimtene1",
    "name": "Armes Principales Tenet",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#D4AF37"
  },
  {
    "_id": "wpnfldrprimcoda1",
    "name": "Armes Principales Coda",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#7D26CD"
  },
  {
    "_id": "wpnfldrprimstal1",
    "name": "Armes du Stalker",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#2C0000"
  },
  {
    "_id": "wpnfldrprimspea1",
    "name": "Fusils-lances",
    "type": "Item",
    "folder": "wpnfldrprim00001",
    "sorting": "a",
    "color": "#16a085"
  }
];

export const primaryWeaponsDataset = [
  {
    "_id": "wpprimscourge001",
    "folder": "wpnfldrrifspec01",
    "name": "Scourge",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Scourge.png",
    "system": {
      "description": "<p>Le fusil-lance emblématique de Harrow. Tire des projectiles de plasma corrosif accompagnés de détonations radiales explosives.</p><p><strong>Tir secondaire (Lancer de lance) :</strong> Plante la lance dans le sol, émettant une impulsion d'énergie qui crée des champs magnétiques attirant les balles vers la tête des ennemis dans un rayon de 14m pendant 10 secondes.</p><p><strong>Synergie emblématique (Harrow) :</strong> Les éliminations par tir à la tête accordent à Harrow +20% de cadence de tir et +20% de vitesse de rechargement pendant 6 secondes.</p>",
      "type": "primary",
      "subtype": "Fusil-lance",
      "damage": "2d10",
      "damageType": "Corrosive",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 160,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": true,
      "altFireLabel": "Lancer de lance",
      "altFireIcon": "fas fa-bullseye",
      "altDamage": "3d10",
      "altDamageType": "Corrosive",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimaeolak0001",
    "folder": "wpnfldrrifauto01",
    "name": "Aeolak",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Aeolak.webp",
    "system": {
      "description": "<p>Le fusil de service traditionnel des anciens pionniers du Zariman. Tire des projectiles cinétiques irradiés avec une stabilité millimétrique.</p><p><strong>Tir secondaire :</strong> Consomme 10 munitions pour propulser une grenade à dispersion de radiation instable infligeant 3d10 dégâts de Radiation dans un rayon de 5m.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Radiation",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.3,
      "statusChance": 29,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 30,
        "max": 30
      },
      "ammoReserve": 210,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Radiation Grenade",
      "altFireIcon": "fas fa-bomb",
      "altDamage": "3d10",
      "altDamageType": "Radiation",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimalternox01",
    "folder": "wpnfldrrifauto01",
    "name": "Alternox",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Alternox.png",
    "system": {
      "description": "<p>Le fusil d'assaut emblématique de Gyre. Décharge des arcs concentrés de bobines électriques à haute tension.</p><p><strong>Tir secondaire :</strong> Projette une sphère électrique qui adhère aux surfaces, électrocutant continuellement les ennemis proches et les aspirant dans un vortex électrique.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Electricity",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 2.1,
      "statusChance": 31,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 40,
        "max": 40
      },
      "ammoReserve": 240,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Lightning Sphere",
      "altFireIcon": "fas fa-bolt",
      "altDamage": "3d8",
      "altDamageType": "Electricity",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimambassad01",
    "folder": "wpnfldrrifauto01",
    "name": "Ambassador",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Ambassador.webp",
    "system": {
      "description": "<p>Le fusil d'assaut de prestige des dirigeants Corpus, combinant luxe corporatif et projection d'énergie létale.</p><p><strong>Tir secondaire :</strong> Bascule en mode sniper chargé, consommant 24 munitions pour tirer un rayon électrique haute densité perforant plusieurs cibles en ligne.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Electricity",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 96,
        "max": 96
      },
      "ammoReserve": 384,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Charged Sniper Beam",
      "altFireIcon": "fas fa-crosshairs",
      "altDamage": "4d10",
      "altDamageType": "Electricity",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "ax52primary00001",
    "folder": "wpnfldrrifauto01",
    "name": "AX-52",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/AX-52.png",
    "system": {
      "description": "<p>Le fusil d'assaut Scaldra pré-Orokin réutilisé par <strong>Arthur Nightingale</strong> dans <em>Warframe: 1999</em>. Sa mécanique robuste à emprunt de gaz et sa garniture en polymère offrent une précision balistique exceptionnelle et une puissance de feu automatique dévastatrice.</p><p><strong>Précision visée (Tir secondaire ADS) :</strong> Viser à la mire active le tir de précision, conférant <strong>+104% de Chances Critiques</strong> (+400% de base) et <strong>+100% de Dégâts de Statut</strong> sur les tirs à la tête !</p><p><strong>Tir au jugé (Efficacité des munitions) :</strong> Tirer au jugé offre <strong>+60% d'Efficacité des munitions</strong>, accordant 60% de chances de consommer <strong>0 munition</strong> du chargeur !</p><p><strong>Synergie Protoframe (Arthur / Excalibur) :</strong> Les tirs précis visés déchirent les défenses ennemies, infligeant <strong>+5 points de dégâts de Perforation bonus</strong> (Perce-armure) et restaurant <strong>+5 points d'Énergie / Adrénaline</strong> !</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.4,
      "statusChance": 18,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 40,
        "max": 40
      },
      "ammoReserve": 540,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Aimed Precision (ADS)",
      "altFireIcon": "fas fa-crosshairs",
      "altDamage": "2d10",
      "altDamageType": "Puncture",
      "canSwapMode": false,
      "currentMode": "rifle",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "vazarin"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimbasmu00001",
    "folder": "wpnfldrrifauto01",
    "name": "Basmu",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Basmu.webp",
    "system": {
      "description": "<p>Fusil d'assaut biologique Sentient à double canon. Alterne entre des fléchettes électriques et des rafales thermiques ardentes. Vider le chargeur déclenche une impulsion organique drainant la vie des ennemis proches pour soigner votre Warframe.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Electricity",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 21,
      "critMultiplier": 2.1,
      "statusChance": 29,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 21,
        "max": 21
      },
      "ammoReserve": 100,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Healing Pulse Wave",
      "altFireIcon": "fas fa-heartbeat",
      "altDamage": "2d8",
      "altDamageType": "Heat",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimbattacor01",
    "folder": "wpnfldrrifauto01",
    "name": "Battacor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Battacor.png",
    "system": {
      "description": "<p>Fusil à rafale hybride issu de technologie Sentiente. Chaque élimination charge sa batterie centrale jusqu'à 3 charges.</p><p><strong>Tir secondaire :</strong> Décharge l'énergie accumulée sous la forme d'un rayon laser explosif destructeur de type Opticor !</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d10",
      "damageType": "Magnetic",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 300,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Optic Laser Cannon",
      "altFireIcon": "fas fa-sun",
      "altDamage": "4d12",
      "altDamageType": "Radiation",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimbaza000001",
    "folder": "wpnfldrrifauto01",
    "name": "Baza",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Baza.png",
    "system": {
      "description": "<p>Pistolet mitrailleur d'infiltration Tenno. Entièrement silencieux, doté d'un silencieux intégré et d'une précision chirurgicale avec 30% de Chances Critiques et un multiplicateur de 3,0x.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 3,
      "statusChance": 14,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 40,
        "max": 40
      },
      "ammoReserve": 240,
      "fireRate": 5,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimboltor0001",
    "folder": "wpnfldrrifauto01",
    "name": "Boltor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Boltor.webp",
    "system": {
      "description": "<p>Le fusil d'assaut à fléchettes emblématique des Tenno. Projette de lourds carreaux cinétiques dotés d'une force d'impact massive capable de clouer les corps ennemis aux murs.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 360,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimbraton0001",
    "folder": "wpnfldrrifauto01",
    "name": "Braton",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Braton.webp",
    "system": {
      "description": "<p>Le fusil d'assaut automatique standard des Tenno. Renommé à travers tout le Système Origine pour son ergonomie équilibrée, son recul maîtrisé et sa fiabilité mortelle.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 45,
        "max": 45
      },
      "ammoReserve": 270,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimdera000001",
    "folder": "wpnfldrrifauto01",
    "name": "Dera",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Dera.webp",
    "system": {
      "description": "<p>Le fusil à énergie des hommes d'équipage Corpus. Décharge des carreaux de super-plasma sans aucun recul, garantissant des tirs perforants rectilignes d'une précision absolue.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "55m (65 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 45,
        "max": 45
      },
      "ammoReserve": 270,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimgorgon0001",
    "folder": "wpnfldrrifauto01",
    "name": "Gorgon",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Gorgon.png",
    "system": {
      "description": "<p>Mitrailleuse lourde d'appui Grineer. Équipée d'un tambour de 120 cartouches de gros calibre, sa cadence de tir s'accélère progressivement jusqu'à un régime de saturation maximal sous tir continu.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2,
      "statusChance": 15,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 120,
        "max": 120
      },
      "ammoReserve": 600,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimgotvapr001",
    "folder": "wpnfldrrifauto01",
    "name": "Gotva Prime",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/GotvaPrime.webp",
    "system": {
      "description": "<p>Le fusil d'assaut militaire d'élite de l'Ancienne Guerre. Chaque fois qu'un tir n'inflige pas de coup critique, il accumule un bonus cumulatif massif jusqu'à garantir un tir critique dévastateur.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.4,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 50,
        "max": 50
      },
      "ammoReserve": 300,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimgrakata001",
    "folder": "wpnfldrrifauto01",
    "name": "Grakata",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Grakata.png",
    "system": {
      "description": "<p>Le pistolet mitrailleur emblématique des troupes d'assaut Grineers. Déchaîne une cadence de tir frénétique et chaotique, compensant son imprécision par une avalanche continue de projectiles.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 480,
      "fireRate": 5,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimkarak00001",
    "folder": "wpnfldrrifauto01",
    "name": "Karak",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Karak.png",
    "system": {
      "description": "<p>Le fusil d'assaut militaire conventionnel de l'armée Grineer. Robuste et efficace, conçu pour infliger de lourds dégâts d'Impact à moyenne portée.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 19,
      "critMultiplier": 2,
      "statusChance": 21,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 30,
        "max": 30
      },
      "ammoReserve": 210,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimpanthera01",
    "folder": "wpnfldrrifauto01",
    "name": "Panthera",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Panthera.png",
    "system": {
      "description": "<p>Arme d'assaut Tenno tirant des disques de scies circulaires tranchants à grande vitesse qui rebondissent sur les parois.</p><p><strong>Tir secondaire :</strong> Maintient une lame de scie rotative suspendue à quelques mètres du canon pour scier continuellement les ennemis au corps-à-corps.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2.2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 240,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Suspended Buzzsaw",
      "altFireIcon": "fas fa-cog",
      "altDamage": "3d8",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimquellor001",
    "folder": "wpnfldrrifauto01",
    "name": "Quellor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Quellor.png",
    "system": {
      "description": "<p>Lourde mitrailleuse de bord des capitaines de Railjack Orokins.</p><p><strong>Tir secondaire :</strong> Consomme 50 munitions pour libérer une décharge givrante conique qui gèle et endort les cibles sur place.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Cold",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 300,
        "max": 300
      },
      "ammoReserve": 600,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Cryo-Shotgun Blast",
      "altFireIcon": "fas fa-snowflake",
      "altDamage": "4d8",
      "altDamageType": "Cold",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsoma000001",
    "folder": "wpnfldrrifauto01",
    "name": "Soma",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Soma.png",
    "system": {
      "description": "<p>Le fusil d'assaut d'élite des Tenno à haute précision et chargeur tambour en demi-lune. Réputé pour sa cadence de tir ascendante et son potentiel critique exceptionnel de 30% à multiplicateur 3,0x.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 3,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 100,
        "max": 100
      },
      "ammoReserve": 540,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimstahlta001",
    "folder": "wpnfldrrifauto01",
    "name": "Stahlta",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Stahlta.png",
    "system": {
      "description": "<p>Fusil automatique lourd de pionnier à munitions d'acier trempé.</p><p><strong>Tir secondaire :</strong> Consomme 20 cartouches pour projeter un obus à rayonnement thermique provoquant une implosion dévastatrice de 4d12 dégâts de Radiation !</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 40,
        "max": 40
      },
      "ammoReserve": 200,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Charged Explosive Rod",
      "altFireIcon": "fas fa-radiation",
      "altDamage": "4d10",
      "altDamageType": "Radiation",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsupra00001",
    "folder": "wpnfldrrifauto01",
    "name": "Supra",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Supra.png",
    "system": {
      "description": "<p>La mitrailleuse lourde laser de ligne de front des Corpus. Déverse un torrent continu de projectiles laser ioniques pour saturer les couloirs et positions fortifiées.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 180,
        "max": 180
      },
      "ammoReserve": 540,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimtenora0001",
    "folder": "wpnfldrrifauto01",
    "name": "Tenora",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Tenora.png",
    "system": {
      "description": "<p>Le fusil d'assaut rotatif harmonique emblématique d'Octavia. Sa cadence et sa précision augmentent sous tir prolongé.</p><p><strong>Tir secondaire :</strong> Consomme 10 munitions pour décocher un tir de sniper surchargé à fort coefficient de coup critique.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 28,
      "critMultiplier": 2.4,
      "statusChance": 16,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 150,
        "max": 150
      },
      "ammoReserve": 450,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Concentrated Sniper Shot",
      "altFireIcon": "fas fa-bullseye",
      "altDamage": "4d10",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimtetra00001",
    "folder": "wpnfldrrifauto01",
    "name": "Tetra",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/automatique/Tetra.png",
    "system": {
      "description": "<p>Fusil d'infanterie Corpus tirant des rafales saccadées de 4 cartouches d'énergie condensée. Robuste et perforant.</p>",
      "type": "primary",
      "subtype": "Fusil d'assaut",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 360,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimargonak001",
    "folder": "wpnfldrrifsemi01",
    "name": "Argonak",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Argonak.png",
    "system": {
      "description": "<p>Fusil de combat Grineer équipé d'une lunette thermique tactique mettant en surbrillance les ennemis à travers les fumigènes et obstacles.</p><p><strong>Tir secondaire :</strong> Alterne entre le tir automatique de dispersion et le tir semi-automatique perforant d'armure.</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "2d12",
      "damageType": "Puncture",
      "range": "55m (65 ft)",
      "equipped": false,
      "critChance": 27,
      "critMultiplier": 2.3,
      "statusChance": 27,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 43,
        "max": 43
      },
      "ammoReserve": 215,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Full-Auto Mode",
      "altFireIcon": "fas fa-sync-alt",
      "altDamage": "2d8",
      "altDamageType": "Impact",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimbuzlok0001",
    "folder": "wpnfldrrifsemi01",
    "name": "Buzlok",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Buzlok.png",
    "system": {
      "description": "<p>Fusil d'assaut lourd Grineer doté d'un traceur de guidage balistique.</p><p><strong>Tir secondaire :</strong> Tire une balise traceuse sur une cible ; toutes les balles suivantes sont téléguidées automatiquement vers le point d'impact !</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "2d12",
      "damageType": "Impact",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 2.3,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 50,
        "max": 50
      },
      "ammoReserve": 250,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Homing Tracer Beacon",
      "altFireIcon": "fas fa-crosshairs",
      "altDamage": "1d6",
      "altDamageType": "Impact",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimfulmin0001",
    "folder": "wpnfldrrifsemi01",
    "name": "Fulmin",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Fulmin.png",
    "system": {
      "description": "<p>L'arme polyvalente silencieuse emblématique de Wisp. Alimentée par une batterie à recharge automatique continue.</p><p><strong>Tir principal :</strong> Tir semi-automatique silencieux à dispersion électrique conique de courte portée.</p><p><strong>Tir secondaire :</strong> Retire le silencieux pour basculer en mode fusil automatique à foudre continue.</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "3d8",
      "damageType": "Electricity",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.4,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 120,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Automatic Lightning Mode",
      "altFireIcon": "fas fa-bolt",
      "altDamage": "2d8",
      "altDamageType": "Electricity",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimgrinlok001",
    "folder": "wpnfldrrifsemi01",
    "name": "Grinlok",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Grinlok.png",
    "system": {
      "description": "<p>Carabine de précision semi-automatique Grineer à levier de culasse. Délivre des tirs uniques lourds à très haute vélocité provoquant de graves lésions hémorragiques.</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "2d12",
      "damageType": "Slash",
      "range": "60m (70 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.1,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 9,
        "max": 9
      },
      "ammoReserve": 120,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr63709f1860cc",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Chakkhurr",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaChakkhurr.png",
    "system": {
      "description": "<p>Mousquet lourd à silex et cartouches explosives des Liches Kuva. Chaque balle percutante déclenche une détonation interne provoquant des dégâts critiques colossaux lors des tirs à la tête.</p>",
      "type": "primary",
      "subtype": "Kuva Flintlock Rifle",
      "damage": "3d10",
      "damageType": "Impact",
      "range": "55m (65 ft)",
      "equipped": false,
      "critChance": 50,
      "critMultiplier": 2.3,
      "statusChance": 27,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 11,
        "max": 11
      },
      "ammoReserve": 66,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimlatron0001",
    "folder": "wpnfldrrifsemi01",
    "name": "Latron",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Latron.png",
    "system": {
      "description": "<p>La carabine de tireur d'élite Tenno semi-automatique classique. Conçue pour engager les cibles à moyenne et longue portée avec une précision exemplaire.</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "2d12",
      "damageType": "Puncture",
      "range": "60m (70 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2,
      "statusChance": 18,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 15,
        "max": 15
      },
      "ammoReserve": 150,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimmquanta001",
    "folder": "wpnfldrrifsemi01",
    "name": "Mutalist Quanta",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/MutalistQuanta.png",
    "system": {
      "description": "<p>Fusil à faisceau hybride infecté par la souche Mutaliste.</p><p><strong>Tir secondaire :</strong> Projette une masse organique d'infestation ; tirer à travers cette sphère imprègne les tirs de dégâts d'Électricité et de Radiation accrus !</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "2d10",
      "damageType": "Radiation",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 300,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Infested Spore Mass",
      "altFireIcon": "fas fa-biohazard",
      "altDamage": "2d8",
      "altDamageType": "Toxin",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimphenmor001",
    "folder": "wpnfldrrifsemi01",
    "name": "Phenmor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Phenmor.png",
    "system": {
      "description": "<p>Carabine de tireur semi-automatique Incarnon d'origine Zariman. Les tirs à la tête chargent son réveil.</p><p><strong>Forme Incarnon (Tir secondaire) :</strong> Se transforme en une sulfateuse Gatling du Néant déchaînant une cadence de tir ahurissante et des perforations infinies.</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "2d12",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 160,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Incarnon Void Minigun",
      "altFireIcon": "fas fa-meteor",
      "altDamage": "2d10",
      "altDamageType": "Radiation",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimstradava01",
    "folder": "wpnfldrrifsemi01",
    "name": "Stradavar",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Stradavar.webp",
    "system": {
      "description": "<p>Fusil de combat Tenno à double alimentation. Alterne instantanément entre un mode semi-automatique de précision à fort potentiel critique et un mode automatique pour le combat rapproché.</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "2d12",
      "damageType": "Slash",
      "range": "55m (65 ft)",
      "equipped": false,
      "critChance": 28,
      "critMultiplier": 2,
      "statusChance": 16,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 45,
        "max": 45
      },
      "ammoReserve": 270,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Full-Auto High-Status Mode",
      "altFireIcon": "fas fa-sync-alt",
      "altDamage": "2d8",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimtrumna0001",
    "folder": "wpnfldrrifsemi01",
    "name": "Trumna",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Trumna.webp",
    "system": {
      "description": "<p>Lourd fusil de combat automatique Entrati propulsant des munitions incendiaires perforantes.</p><p><strong>Tir secondaire (Grenade thermonucléaire) :</strong> Après 5 éliminations, décharge une bombe incendiaire à ricochets qui rebondit et déclenche plusieurs explosions de Feu massives !</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "3d10",
      "damageType": "Heat",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 200,
        "max": 200
      },
      "ammoReserve": 400,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Incendiary Cluster Grenade",
      "altFireIcon": "fas fa-fire",
      "altDamage": "5d10",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimveldt00001",
    "folder": "wpnfldrrifsemi01",
    "name": "Veldt",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Veldt.png",
    "system": {
      "description": "<p>Carabine de chasse sportive des plaines d'Ostron. Maniable, semi-automatique et dotée d'une visée télescopique pour abattre la faune et les envahisseurs Grineers.</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "2d12",
      "damageType": "Slash",
      "range": "60m (70 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2.2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 16,
        "max": 16
      },
      "ammoReserve": 160,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "vinquibusprim001",
    "folder": "wpnfldrrifsemi01",
    "name": "Vinquibus",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/Vinquibus.png",
    "system": {
      "description": "<p>Le fusil-baïonnette emblématique d'<strong>Uriel</strong> (<em>L'Hérétique de Xata</em>), configuré en <strong>Mode Fusil</strong>. Tire des cartouches d'assaut lourdes à charge de feu impie.</p><p><strong>Fonctionnalité Hybride :</strong> Bascule instantanément entre le <strong>Mode Fusil</strong> et le <strong>Mode Baïonnette</strong> de corps-à-corps.</p><p><strong>Calibre Vinquibus (Tir chargé) :</strong> Viser à la mire charge un coup dévastateur infligeant <strong>+50% de dégâts de Feu</strong> !</p><p><strong>Synergie emblématique (Uriel) :</strong> Les éliminations restaurent <strong>+5 Furie de Brimstone</strong> et accélèrent la recharge des fiélons de la Légion de 25%.</p>",
      "type": "primary",
      "subtype": "Bayonet Rifle",
      "damage": "2d12",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 40,
      "critMultiplier": 3.2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 16,
        "max": 16
      },
      "ammoReserve": 160,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Bayonet Strike",
      "altFireIcon": "fas fa-dagger",
      "altDamage": "2d10",
      "altDamageType": "Puncture",
      "canSwapMode": true,
      "currentMode": "rifle",
      "modes": {
        "rifle": {
          "type": "primary",
          "subtype": "Bayonet Rifle",
          "damage": "2d12",
          "damageType": "Puncture",
          "range": "50m (60 ft)",
          "hasAltFire": true,
          "altFireLabel": "Bayonet Strike",
          "altFireIcon": "fas fa-dagger",
          "altDamage": "2d10",
          "altDamageType": "Puncture"
        },
        "melee": {
          "type": "melee",
          "subtype": "Bayonet",
          "damage": "2d10",
          "damageType": "Puncture",
          "range": "Melee (8 ft)",
          "hasAltFire": false,
          "altFireLabel": "",
          "altFireIcon": "",
          "altDamage": "",
          "altDamageType": ""
        }
      },
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "universal"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimzenith0001",
    "folder": "wpnfldrrifsemi01",
    "name": "Zenith",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/semi-auto/Zenith.png",
    "system": {
      "description": "<p>Le fusil d'assaut tactique d'élite Tenno offert pour 500 jours de service.</p><p><strong>Tir secondaire (Disque radar) :</strong> Lance un disque capteur qui révèle la position de tous les ennemis à travers les murs et active un mode semi-automatique avec pénétration d'obstacles illimitée !</p>",
      "type": "primary",
      "subtype": "Fusil semi-automatique",
      "damage": "3d10",
      "damageType": "Puncture",
      "range": "70m (80 ft)",
      "equipped": false,
      "critChance": 35,
      "critMultiplier": 2.6,
      "statusChance": 16,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 180,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Sonar Sensor Disc",
      "altFireIcon": "fas fa-satellite-dish",
      "altDamage": "0",
      "altDamageType": "None",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimburston001",
    "folder": "wpnfldrrifbrst01",
    "name": "Burston",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rafale/Burston.png",
    "system": {
      "description": "<p>Le fusil à rafales classique des Tenno. Tire des salves disciplinées de 3 cartouches assurant un groupement d'impacts resserré.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 45,
        "max": 45
      },
      "ammoReserve": 270,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimharpak0001",
    "folder": "wpnfldrrifbrst01",
    "name": "Harpak",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rafale/Harpak.png",
    "system": {
      "description": "<p>Fusil à rafales d'assaut Grineer équipé de dards barbelés.</p><p><strong>Tir secondaire (Harpon) :</strong> Tire un harpon à câble relié qui empale un ennemi et le tire brutalement au corps-à-corps devant le tireur.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.3,
      "statusChance": 17,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 45,
        "max": 45
      },
      "ammoReserve": 225,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Barbed Harpoon Reel",
      "altFireIcon": "fas fa-anchor",
      "altDamage": "2d8",
      "altDamageType": "Puncture",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimhema000001",
    "folder": "wpnfldrrifbrst01",
    "name": "Hema",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rafale/Hema.png",
    "system": {
      "description": "<p>Fusil à rafales Infesté alimenté par la force vitale. Consomme une portion de la santé de son porteur pour recharger ses munitions ; chaque tir à la tête draine la vitalité de l'ennemi pour soigner la Warframe.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d10",
      "damageType": "Viral",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 11,
      "critMultiplier": 2,
      "statusChance": 33,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 100,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimhind000001",
    "folder": "wpnfldrrifbrst01",
    "name": "Hind",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rafale/Hind.png",
    "system": {
      "description": "<p>Le redoutable fusil à rafales Grineer surnommé 'La Baguette'. Tire des salves saccadées de 5 cartouches lourdes capables de déstabiliser n'importe quel fantassin.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2,
      "statusChance": 21,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 65,
        "max": 65
      },
      "ammoReserve": 390,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Single Heavy Slug",
      "altFireIcon": "fas fa-crosshairs",
      "altDamage": "2d12",
      "altDamageType": "Puncture",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimparacyst01",
    "folder": "wpnfldrrifbrst01",
    "name": "Paracyst",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rafale/Paracyst.png",
    "system": {
      "description": "<p>Fusil à rafales Infesté tirant des graines caustiques de bio-toxines.</p><p><strong>Tir secondaire :</strong> Déploie un appendice de chair tentaculaire qui harponne et attire les ennemis vers vous.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d10",
      "damageType": "Toxin",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 13,
      "critMultiplier": 2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 300,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Organic Tether Tendril",
      "altFireIcon": "fas fa-link",
      "altDamage": "2d8",
      "altDamageType": "Impact",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimquartakk01",
    "folder": "wpnfldrrifbrst01",
    "name": "Quartakk",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rafale/Quartakk.png",
    "system": {
      "description": "<p>Fusil de tir d'élite Grineer à 4 canons jumelés. Fait feu simultanément des quatre canons à chaque tir semi-automatique, pulvérisant la cible sous un mur de plomb.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "3d8",
      "damageType": "Impact",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 27,
      "critMultiplier": 2.3,
      "statusChance": 27,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 84,
        "max": 84
      },
      "ammoReserve": 336,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsybaris001",
    "folder": "wpnfldrrifbrst01",
    "name": "Sybaris",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rafale/Sybaris.webp",
    "system": {
      "description": "<p>La carabine à levier de sous-garde d'aristocrate Tenno. Tire d'élégantes doubles salves de haute précision avec un profil critique exceptionnel.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d12",
      "damageType": "Slash",
      "range": "55m (65 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2,
      "statusChance": 15,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 120,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimtiberon001",
    "folder": "wpnfldrrifbrst01",
    "name": "Tiberon",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rafale/Tiberon.png",
    "system": {
      "description": "<p>Fusil d'assaut Tenno d'une polyvalence exemplaire. Peut alterner à volonté entre le tir par rafales de 3 coups, le coup par coup semi-automatique et le tir entièrement automatique.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "55m (65 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.4,
      "statusChance": 16,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 30,
        "max": 30
      },
      "ammoReserve": 210,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimamprex0001",
    "folder": "wpnfldrrifbeam01",
    "name": "Amprex",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rayon/Amprex.png",
    "system": {
      "description": "<p>Générateur d'arcs électriques Corpus. Projette un faisceau de foudre continue qui électrocute sa cible et crée des arcs secondaires foudroyant tous les ennemis dans la pièce !</p>",
      "type": "primary",
      "subtype": "Fusil à rayon",
      "damage": "2d8",
      "damageType": "Electricity",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 32,
      "critMultiplier": 2.2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 100,
        "max": 100
      },
      "ammoReserve": 400,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimfluxrif001",
    "folder": "wpnfldrrifbeam01",
    "name": "Flux Rifle",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rayon/FluxRifle.png",
    "system": {
      "description": "<p>Fusil à faisceau laser continu des Corpus. Émet une ligne d'énergie thermique ultra-concentrée qui cisaille les blindages moléculaires avec des coupures Tranchantes pures.</p>",
      "type": "primary",
      "subtype": "Fusil à rayon",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 100,
        "max": 100
      },
      "ammoReserve": 400,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimglaxion001",
    "folder": "wpnfldrrifbeam01",
    "name": "Glaxion",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rayon/Glaxion.png",
    "system": {
      "description": "<p>Canon thermique cryogénique Corpus. Projette un rayon glacial continu qui abaisse la température au zéro absolu, gelant instantanément les cibles sur place.</p>",
      "type": "primary",
      "subtype": "Fusil à rayon",
      "damage": "2d8",
      "damageType": "Cold",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 14,
      "critMultiplier": 2,
      "statusChance": 34,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 100,
        "max": 100
      },
      "ammoReserve": 400,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimignis00001",
    "folder": "wpnfldrrifbeam01",
    "name": "Ignis",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rayon/Ignis.png",
    "system": {
      "description": "<p>Le légendaire lance-flammes lourd Grineer. Crache un cône continu de flammes infernales qui calcine des escouades entières et traverse les foules d'ennemis.</p>",
      "type": "primary",
      "subtype": "Flamethrower",
      "damage": "2d8",
      "damageType": "Heat",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2,
      "statusChance": 27,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 150,
        "max": 150
      },
      "ammoReserve": 600,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimquanta0001",
    "folder": "wpnfldrrifbeam01",
    "name": "Quanta",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rayon/Quanta.png",
    "system": {
      "description": "<p>Outil d'excavation minière laser Corpus adapté pour la guerre. Projette deux lasers parallèles rectilignes sans aucun recul.</p><p><strong>Tir secondaire :</strong> Éjecte un cube de plasma explosif qui explose au contact ou lorsqu'il est abattu par les lasers du Quanta.</p>",
      "type": "primary",
      "subtype": "Fusil à rayon",
      "damage": "2d8",
      "damageType": "Electricity",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 300,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Explosive Plasma Cube",
      "altFireIcon": "fas fa-cube",
      "altDamage": "3d10",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsynapse001",
    "folder": "wpnfldrrifbeam01",
    "name": "Synapse",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/rayon/Synapse.png",
    "system": {
      "description": "<p>Fusil à bio-faisceau Infesté vivant. Déverse un courant électrique biotoxique continu avec un taux critique stupéfiant de 39% capable d'infliger des coups critiques rouges.</p>",
      "type": "primary",
      "subtype": "Fusil à rayon",
      "damage": "2d8",
      "damageType": "Corrosive",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 39,
      "critMultiplier": 2.7,
      "statusChance": 13,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 70,
        "max": 70
      },
      "ammoReserve": 350,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimacceltra01",
    "folder": "wpnfldrrifspec01",
    "name": "Acceltra",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/fusil speciaux/Acceltra.webp",
    "system": {
      "description": "<p>Les micro-lance-roquettes automatiques jumelés emblématiques de Gauss. Tire une cadence affolante de micro-missiles à armature plasma qui explosent à l'impact.</p><p><strong>Synergie emblématique (Gauss) :</strong> La vitesse de rechargement est drastiquement accrue lorsque Gauss sprinte.</p>",
      "type": "primary",
      "subtype": "Rocket Rifle",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 32,
      "critMultiplier": 2.8,
      "statusChance": 6,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 48,
        "max": 48
      },
      "ammoReserve": 96,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "higasa0000000001",
    "folder": "wpnfldrrifspec01",
    "name": "Higasa",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/Fusil Gardien/higasa.webp",
    "system": {
      "description": "<p>L'arme principale emblématique de <strong>Koumei</strong>, se déployant à la fois comme un fusil de précision rayonnant et un bouclier ombrelle protecteur.</p><p><strong>Bouclier Ombrelle (Visée ADS) :</strong> Déploie une ombrelle énergétique absorbant les tirs ennemis frontaux et accumulant leur puissance.</p><p><strong>Rayon Concentré (Tir secondaire) :</strong> Décharge l'énergie cinétique accumulée par le bouclier dans un rayon perforant colossal traversant les ennemis !</p><p><strong>Synergie emblématique (Koumei) :</strong> Absorber des dégâts avec l'ombrelle a une chance de lancer un Dé du Destin pour recharger instantanément les compétences.</p>",
      "type": "primary",
      "subtype": "Fusil à rafale",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 36,
        "max": 36
      },
      "ammoReserve": 216,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Canopy Laser Beam",
      "altFireIcon": "fas fa-umbrella",
      "altDamage": "4d10",
      "altDamageType": "Void",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "vazarin"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimmiter00001",
    "folder": "wpnfldrrifspec01",
    "name": "Miter",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/charge/Miter.png",
    "system": {
      "description": "<p>Lanceur de scies circulaires des Goules Grineers. Peut projeter des scies en tir rapide ou charger son tir pour lancer une lame dentelée surchauffée qui rebondit et démembre les cibles.</p>",
      "type": "primary",
      "subtype": "Charge Rifle",
      "damage": "2d12",
      "damageType": "Slash",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 10,
      "critMultiplier": 2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 100,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Charged Sawblade",
      "altFireIcon": "fas fa-circle-notch",
      "altDamage": "4d10",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimopticor001",
    "folder": "wpnfldrrifspec01",
    "name": "Opticor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/charge/Opticor.png",
    "system": {
      "description": "<p>Le canon laser à particules lourdes des Corpus. Charge un faisceau d'énergie colossale semblable à un canon de vaisseau pour délivrer une explosion atomique en ligne droite.</p>",
      "type": "primary",
      "subtype": "Charge Rifle",
      "damage": "5d10",
      "damageType": "Magnetic",
      "range": "60m (70 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.5,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 5,
        "max": 5
      },
      "ammoReserve": 40,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsimulor001",
    "folder": "wpnfldrrifspec01",
    "name": "Simulor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/fusil speciaux/300px-Simulor.webp",
    "system": {
      "description": "<p>Générateur de singularités gravitationnelles Cephalon. Tire des sphères gravitationnelles miniatures qui fusionnent entre elles, provoquant des implosions vortex dévastatrices.</p>",
      "type": "primary",
      "subtype": "Singularity Rifle",
      "damage": "2d10",
      "damageType": "Magnetic",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 12,
      "critMultiplier": 2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 60,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Manual Singularity Detonation",
      "altFireIcon": "fas fa-atom",
      "altDamage": "3d10",
      "altDamageType": "Magnetic",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsynsimul01",
    "folder": "wpnfldrrifspec01",
    "name": "Synoid Simulor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/fusil speciaux/SynoidSimulor.webp",
    "system": {
      "description": "<p>Version Cephalon Suda optimisée du Simulor. Fusionner des singularités libère des vagues d'énergie Magnétique et restaure l'Énergie du porteur.</p>",
      "type": "primary",
      "subtype": "Singularity Rifle",
      "damage": "2d10",
      "damageType": "Magnetic",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 35,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 15,
        "max": 15
      },
      "ammoReserve": 75,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Entropy Gravitational Detonation",
      "altFireIcon": "fas fa-infinity",
      "altDamage": "3d10",
      "altDamageType": "Magnetic",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimarcaplasm1",
    "folder": "wpnfldrshotgun01",
    "name": "Arca Plasmor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/semi-auto/ArcaPlasmor.png",
    "system": {
      "description": "<p>Fusil à dispersion de plasma lourd des gardes Corpus. Expédie une onde de choc massive de particules de plasma qui traverse et vaporise les groupes d'infanterie.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "4d8",
      "damageType": "Radiation",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 50,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimastilla001",
    "folder": "wpnfldrshotgun01",
    "name": "Astilla",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/auto/Astilla.png",
    "system": {
      "description": "<p>Le fusil à pompe de projectiles de verre emblématique de Gara. Tire des balles de verre trempé qui se brisent à l'impact en d'innombrables éclats tranchants causant de violentes hémorragies.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 21,
      "critMultiplier": 2.1,
      "statusChance": 33,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 16,
        "max": 16
      },
      "ammoReserve": 80,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimboar000001",
    "folder": "wpnfldrshotgun01",
    "name": "Boar",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/auto/Boar.png",
    "system": {
      "description": "<p>Le fusil à pompe automatique classique des Tenno. Déverse des volées continues de chevrotine à haute cadence pour balayer les pièces exigües.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 80,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimcedo000001",
    "folder": "wpnfldrshotgun01",
    "name": "Cedo",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/auto/Cedo.webp",
    "system": {
      "description": "<p>Le fusil à pompe tactique emblématique de Lavos.</p><p><strong>Tir secondaire (Glaive rebondissant) :</strong> Projette un glaive autonome qui ricoche sur les ennemis en leur infligeant des effets de statut élémentaires variés.</p><p><strong>Synergie emblématique (Lavos) :</strong> Le tir principal gagne des dégâts considérablement accrus pour chaque effet de statut différent affectant la cible !</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.2,
      "statusChance": 32,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 40,
        "max": 40
      },
      "ammoReserve": 160,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Elemental Glaive Discs",
      "altFireIcon": "fas fa-compact-disc",
      "altDamage": "3d6",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppre05b36ea4bfc",
    "folder": "wpnfldrprimcoda1",
    "name": "Coda Bassocyst",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/CodaBassocyst.png",
    "system": {
      "description": "<p>Fusil à pompe lourd acoustique Coda de 1999. Tire des impulsions de basses fréquences sonores combinées à du bio-slime caustique qui écrasent les cibles au sol.</p>",
      "type": "primary",
      "subtype": "Coda Bio-Cannon",
      "damage": "3d10",
      "damageType": "Viral",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2.2,
      "statusChance": 40,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 24,
        "max": 24
      },
      "ammoReserve": 144,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimconvectr01",
    "folder": "wpnfldrshotgun01",
    "name": "Convectrix",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/held/convectrix.webp",
    "system": {
      "description": "<p>Fusil à découpe industrielle Corpus à deux lasers convergents. Concentre deux faisceaux distincts qui se rejoignent sur le point d'impact pour cisailler la matière avec un statut Tranchant extrême.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 70,
        "max": 70
      },
      "ammoReserve": 280,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimcorinth001",
    "folder": "wpnfldrshotgun01",
    "name": "Corinth",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/semi-auto/Corinth.png",
    "system": {
      "description": "<p>Le fusil à pompe lourd d'assaut Tenno d'une ergonomie luxueuse. Projette des gerbes de chevrotine chirurgicales avec un bruit d'impact magistral.</p><p><strong>Tir secondaire (Grenade aérienne) :</strong> Tire une grenade qui explose à distance précise en une détonation aérienne projetant des éclats d'Explosion.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "4d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.8,
      "statusChance": 12,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
      },
      "ammoReserve": 36,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Airburst Grenade",
      "altFireIcon": "fas fa-bomb",
      "altDamage": "4d6",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimdrakgoon01",
    "folder": "wpnfldrshotgun01",
    "name": "Drakgoon",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/charge/drakgoon.webp",
    "system": {
      "description": "<p>Le fusil à fragmentation lourd Grineer. Tire des volées de plombs éclatés en cône large, ou permet de charger le tir pour resserrer le faisceau en un tir concentré mortel.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 23,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 7,
        "max": 7
      },
      "ammoReserve": 42,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Choked Shrapnel Slug",
      "altFireIcon": "fas fa-bullseye",
      "altDamage": "4d8",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimexergis001",
    "folder": "wpnfldrshotgun01",
    "name": "Exergis",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/semi-auto/Exergis.png",
    "system": {
      "description": "<p>Fusil à pompe à cristal énergétique Corpus. Projette un éclat de cristal surchargé qui perfore les blindages en ligne droite avec de purs dégâts de Radiation.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "4d10",
      "damageType": "Radiation",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 8,
      "critMultiplier": 2,
      "statusChance": 36,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 30,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimfelarx0001",
    "folder": "wpnfldrshotgun01",
    "name": "Felarx",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/auto/Felarx.png",
    "system": {
      "description": "<p>Fusil à pompe Incarnon du Zariman. Ses canons superposés délivrent une puissance balistique massive.</p><p><strong>Forme Incarnon (Tir secondaire) :</strong> Se métamorphose en deux pistolets automatiques du Néant tirant des salves d'énergie hyper-rapides.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
      },
      "ammoReserve": 48,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Incarnon Dual Void Pistols",
      "altFireIcon": "fas fa-meteor",
      "altDamage": "2d8",
      "altDamageType": "Radiation",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimhek0000001",
    "folder": "wpnfldrshotgun01",
    "name": "Hek",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/semi-auto/Hek.png",
    "system": {
      "description": "<p>Le légendaire fusil à pompe à 4 canons de l'armée Grineer. Conçu par le Conseiller Vay Hek, ses 4 canons simultanés écrasent les blindages à courte portée avec une puissance de perforation dévastatrice.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "4d8",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 4,
        "max": 4
      },
      "ammoReserve": 32,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimkohm000001",
    "folder": "wpnfldrshotgun01",
    "name": "Kohm",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/auto/Kohm.png",
    "system": {
      "description": "<p>Le fusil à dispersion à canons rotatifs Grineer. Sa cadence de tir et le nombre de projectiles par cartouche augmentent à chaque coup successif jusqu'à former un mur de métal hurlant.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2.3,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 245,
        "max": 245
      },
      "ammoReserve": 980,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimphage00001",
    "folder": "wpnfldrshotgun01",
    "name": "Phage",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/held/phage.webp",
    "system": {
      "description": "<p>Arme biologique Infestée dotée de 7 tentacules à faisceaux d'énergie virale. Viser à la mire resserre les 7 tentacules en un unique faisceau hyper-concentré.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Viral",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 19,
      "critMultiplier": 2,
      "statusChance": 31,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 90,
        "max": 90
      },
      "ammoReserve": 360,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimphantasm01",
    "folder": "wpnfldrshotgun01",
    "name": "Phantasma",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/held/Phantasma.png",
    "system": {
      "description": "<p>Le fusil à rayon de plasma spectral emblématique de Revenant. Déverse un torrent continu d'énergie radioactive avec une cadence de statut phénoménale.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Radiation",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 11,
      "critMultiplier": 1.9,
      "statusChance": 37,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 11,
        "max": 11
      },
      "ammoReserve": 55,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Homing Plasma Bomb",
      "altFireIcon": "fas fa-ghost",
      "altDamage": "3d10",
      "altDamageType": "Radiation",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimrauta00001",
    "folder": "wpnfldrshotgun01",
    "name": "Rauta",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/semi-auto/Rauta.png",
    "system": {
      "description": "<p>Le fusil à pompe d'assaut emblématique de Kullervo. Chaque plomb qui touche un ennemi fait grimper directement le Compteur de Combo de Mêlée !</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 1.8,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 60,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsobek00001",
    "folder": "wpnfldrshotgun01",
    "name": "Sobek",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/auto/Sobek.png",
    "system": {
      "description": "<p>Fusil à pompe automatique lourd Grineer doté d'un imposant tambour de 20 cartouches pour maintenir une pression de feu constante.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 27,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 80,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsteflos001",
    "folder": "wpnfldrshotgun01",
    "name": "Steflos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/semi-auto/Steflos.png",
    "system": {
      "description": "<p>Le fusil à énergie emblématique de Citrine. Projette des ondes de choc lumineuses qui s'élargissent et gagnent en puissance à mesure qu'elles traversent les ennemis.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Heat",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 21,
      "critMultiplier": 2.1,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 12,
        "max": 12
      },
      "ammoReserve": 60,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimstrun00001",
    "folder": "wpnfldrshotgun01",
    "name": "Strun",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/semi-auto/Strun.png",
    "system": {
      "description": "<p>Le fusil à pompe de combat éprouvé des Tenno. Robuste, puissant et fiable, il délivre d'énormes dégâts d'Impact pour neutraliser les assaillants.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "3d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
      },
      "ammoReserve": 36,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimtigris0001",
    "folder": "wpnfldrshotgun01",
    "name": "Tigris",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Shotgun/duplex/tigris.webp",
    "system": {
      "description": "<p>Le fusil de chasse à double canon traditionnel Tenno utilisant une détente duplex-auto : tire un canon en pressant la gâchette, et le second en la relâchant. Dégâts Tranchants titanesques.</p>",
      "type": "primary",
      "subtype": "Fusil à pompe",
      "damage": "5d8",
      "damageType": "Slash",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 2,
        "max": 2
      },
      "ammoReserve": 24,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimattica0001",
    "folder": "wpnfldrbowxbow01",
    "name": "Attica",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Crossbow/300px-Attica.webp",
    "system": {
      "description": "<p>Arbalète d'assaut automatique Tenno. Projette de lourds carreaux d'acier perforants à cadence élevée capables d'épingler les ennemis aux cloisons.</p>",
      "type": "primary",
      "subtype": "Crossbow",
      "damage": "2d12",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2,
      "statusChance": 14,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 16,
        "max": 16
      },
      "ammoReserve": 80,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimcernos0001",
    "folder": "wpnfldrbowxbow01",
    "name": "Cernos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Bow/300px-Cernos.webp",
    "system": {
      "description": "<p>L'arc de chasse traditionnel Tenno taillé dans des alliages incurvés. Spécialisé dans les dégâts d'Impact pour briser les boucliers à distance.</p>",
      "type": "primary",
      "subtype": "Arc",
      "damage": "2d12",
      "damageType": "Impact",
      "range": "70m (80 ft)",
      "equipped": false,
      "critChance": 35,
      "critMultiplier": 2,
      "statusChance": 18,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 72,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimcinta00001",
    "folder": "wpnfldrbowxbow01",
    "name": "Cinta",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Bow/300px-Cinta.webp",
    "system": {
      "description": "<p>L'arc Dax antique de Duviri. Permet de relâcher la corde sur un timing de décoche parfaite pour libérer une flèche explosive traversante.</p>",
      "type": "primary",
      "subtype": "Arc",
      "damage": "2d12",
      "damageType": "Puncture",
      "range": "75m (85 ft)",
      "equipped": false,
      "critChance": 36,
      "critMultiplier": 2.4,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 72,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Explosive Energy Pulse",
      "altFireIcon": "fas fa-wave-square",
      "altDamage": "3d10",
      "altDamageType": "Heat",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimdaikyu0001",
    "folder": "wpnfldrbowxbow01",
    "name": "Daikyu",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Bow/300px-Daikyu.webp",
    "system": {
      "description": "<p>Le grand arc de guerre traditionnel Tenno. Exige une allonge complète et une force physique considérable, mais décoche des flèches à vélocité foudroyante infligeant des coups mortels.</p>",
      "type": "primary",
      "subtype": "Arc",
      "damage": "3d12",
      "damageType": "Puncture",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 34,
      "critMultiplier": 2,
      "statusChance": 34,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 72,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr5c55e1e9bcea",
    "folder": "wpnfldrprimstal1",
    "name": "Dread",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Dread.png",
    "system": {
      "description": "<p>L'arc d'assassinat emblématique du Stalker. Décoche des flèches à pointes barbelées qui décapitent et démembrent les cibles avec un taux de critique supérieur à 50% !</p>",
      "type": "primary",
      "subtype": "Hunting Bow",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 50,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 6,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprc68a4e4b415e",
    "folder": "wpnfldrbowxbow01",
    "name": "Evensong",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Evensong.png",
    "system": {
      "description": "<p>L'arc chantant emblématique de Jade. Frapper des ennemis avec ses flèches harmoniques confère des bonus de vitesse d'attaque à toute l'escouade.</p>",
      "type": "primary",
      "subtype": "Canticle Bow",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.2,
      "statusChance": 38,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 6,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppradee850a0539",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Bramma",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaBramma.png",
    "system": {
      "description": "<p>Le colossal arc de siège des Liches Kuva. Tire des flèches équipées d'ogives à sous-munitions qui explosent en dispersant une pluie de bombes secondaires !</p>",
      "type": "primary",
      "subtype": "Kuva Cluster Bow",
      "damage": "3d10",
      "damageType": "Blast",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 35,
      "critMultiplier": 2.1,
      "statusChance": 21,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 6,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimlenz000001",
    "folder": "wpnfldrbowxbow01",
    "name": "Lenz",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Bow/300px-Lenz.webp",
    "system": {
      "description": "<p>L'arc à ogives cryo-explosives des Corpus. Chaque flèche tirée génère une sphère de froid glacial immobilisant les cibles avant d'imploser dans une immense détonation.</p>",
      "type": "primary",
      "subtype": "Arc",
      "damage": "4d10",
      "damageType": "Blast",
      "range": "60m (70 ft)",
      "equipped": false,
      "critChance": 50,
      "critMultiplier": 2,
      "statusChance": 5,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 6,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimmcernos001",
    "folder": "wpnfldrbowxbow01",
    "name": "Mutalist Cernos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Bow/300px-MutalistCernos.webp",
    "system": {
      "description": "<p>Arc Tenno contaminé par des spores Mutalistes. Chaque flèche engendre un nuage de bio-gaz toxique persistant sur le point d'impact.</p>",
      "type": "primary",
      "subtype": "Arc",
      "damage": "2d12",
      "damageType": "Toxin",
      "range": "65m (75 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 45,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 72,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimnagantak01",
    "folder": "wpnfldrbowxbow01",
    "name": "Nagantaka",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Crossbow/300px-Nagantaka.webp",
    "system": {
      "description": "<p>L'arbalète à répétition emblématique de Garuda. Décoche des volées chirurgicales de fléchettes d'acier provoquant de sévères hémorragies.</p>",
      "type": "primary",
      "subtype": "Crossbow",
      "damage": "2d12",
      "damageType": "Slash",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 2.3,
      "statusChance": 39,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 9,
        "max": 9
      },
      "ammoReserve": 72,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Volley Mag Dump",
      "altFireIcon": "fas fa-stream",
      "altDamage": "2d10",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimnataruk001",
    "folder": "wpnfldrbowxbow01",
    "name": "Nataruk",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Bow/300px-Nataruk.webp",
    "system": {
      "description": "<p>L'arc Sentient semi-vivant offert par le Chasseur de l'Ombre. Décoche des flèches de pur Néant sans jamais consommer de munitions physiques.</p>",
      "type": "primary",
      "subtype": "Arc",
      "damage": "3d12",
      "damageType": "Puncture",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 50,
      "critMultiplier": 2.4,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 999,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimparis00001",
    "folder": "wpnfldrbowxbow01",
    "name": "Paris",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Bow/Paris.png",
    "system": {
      "description": "<p>L'arc de guerre classique des Tenno. Son allonge tendue transperce les blindages corporels avec une puissance de pénétration exceptionnelle.</p>",
      "type": "primary",
      "subtype": "Arc",
      "damage": "2d12",
      "damageType": "Puncture",
      "range": "70m (80 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2,
      "statusChance": 18,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 72,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimprobcern01",
    "folder": "wpnfldrbowxbow01",
    "name": "Proboscis Cernos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Bow/300px-ProboscisCernos.webp",
    "system": {
      "description": "<p>Arc Infesté dont les flèches déploient des tentacules voraces attirant tous les ennemis proches vers le centre avant de les dissoudre dans un nuage acide.</p>",
      "type": "primary",
      "subtype": "Arc",
      "damage": "3d10",
      "damageType": "Viral",
      "range": "65m (75 ft)",
      "equipped": false,
      "critChance": 7,
      "critMultiplier": 1.9,
      "statusChance": 43,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 9,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimzhuge00001",
    "folder": "wpnfldrbowxbow01",
    "name": "Zhuge",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Crossbow/300px-Zhuge.webp",
    "system": {
      "description": "<p>Arbalète automatique Tenno à tir rapide. Combine la discrétion des carreaux avec la cadence d'une arme automatique moderne.</p>",
      "type": "primary",
      "subtype": "Crossbow",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 35,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 80,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimkomorex001",
    "folder": "wpnfldrsniper001",
    "name": "Komorex",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/semi-auto/Komorex.png",
    "system": {
      "description": "<p>Fusil de précision hybride Sentient. Offre deux niveaux de zoom : un tir rapide à moyenne portée, ou un tir lourd avec zoom maximal tirant des balles à détonation virale.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "3d10",
      "damageType": "Viral",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2.1,
      "statusChance": 35,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 80,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Explosive Viral Zoom",
      "altFireIcon": "fas fa-search-plus",
      "altDamage": "4d10",
      "altDamageType": "Viral",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimlanka00001",
    "folder": "wpnfldrsniper001",
    "name": "Lanka",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/charge/Lanka.png",
    "system": {
      "description": "<p>Fusil de sniper magnétique à rail des Corpus. Projette des aiguilles magnétisées à haute vélocité infligeant de purs dégâts d'Électricité.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "4d10",
      "damageType": "Electricity",
      "range": "90m (110 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 40,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimperigale01",
    "folder": "wpnfldrsniper001",
    "name": "Perigale",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/burst/Perigale.png",
    "system": {
      "description": "<p>Le fusil de précision à rafales emblématique de Voruna. Tire des rafales de 4 balles de précision chirurgicale ; réussir 4 tirs à la tête recharge instantanément le chargeur.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "3d10",
      "damageType": "Puncture",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.4,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 32,
        "max": 32
      },
      "ammoReserve": 96,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimrubico0001",
    "folder": "wpnfldrsniper001",
    "name": "Rubico",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/semi-auto/Rubico.png",
    "system": {
      "description": "<p>Le fusil de précision lourd des Tenno. Conçu pour éliminer les cibles blindées et les béhémoths grâce à un multiplicateur critique prodigieux de 3,0x et un rechargement rapide.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "3d12",
      "damageType": "Impact",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 38,
      "critMultiplier": 3,
      "statusChance": 12,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 5,
        "max": 5
      },
      "ammoReserve": 40,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsnipetro01",
    "folder": "wpnfldrsniper001",
    "name": "Snipetron",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/semi-auto/Snipetron.png",
    "system": {
      "description": "<p>Le fusil de précision conventionnel à cartouches cinétiques autrefois employé par le personnel de sécurité Corpus.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "3d10",
      "damageType": "Puncture",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2,
      "statusChance": 16,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 4,
        "max": 4
      },
      "ammoReserve": 40,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimsporothr01",
    "folder": "wpnfldrsniper001",
    "name": "Sporothrix",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/semi-auto/Sporothrix.png",
    "system": {
      "description": "<p>Fusil de précision biologique Infesté d'Entrati. Tire des spicules virulents qui s'incrustent dans la chair avant d'exploser dans un nuage de bio-épines.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "3d10",
      "damageType": "Viral",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 1,
      "critMultiplier": 1.5,
      "statusChance": 44,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 9,
        "max": 9
      },
      "ammoReserve": 36,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimvadaryap01",
    "folder": "wpnfldrsniper001",
    "name": "Vadarya Prime",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/charge/VadaryaPrime.png",
    "system": {
      "description": "<p>Le fusil de sniper à plasma Orokin ancestral. Décoche des projectiles d'énergie condensée capables d'annihiler les cibles stratégiques à travers le blindage.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "3d12",
      "damageType": "Electricity",
      "range": "85m (105 ft)",
      "equipped": false,
      "critChance": 35,
      "critMultiplier": 2.5,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 8,
        "max": 8
      },
      "ammoReserve": 48,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimvectis0001",
    "folder": "wpnfldrsniper001",
    "name": "Vectis",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/semi-auto/Vectis.png",
    "system": {
      "description": "<p>Le fusil de tireur d'élite Tenno à culasse manuelle et coup unique. Dégâts cinétiques massifs et temps de cycle ultra-rapide pour les tireurs d'élite mobiles.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "3d12",
      "damageType": "Puncture",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 40,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimvulkar0001",
    "folder": "wpnfldrsniper001",
    "name": "Vulkar",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sniper/semi-auto/Vulkar.png",
    "system": {
      "description": "<p>Le lourd fusil de sniper standard des tireurs d'élite Grineers. Conçu pour infliger de gigantesques traumatismes d'Impact à travers les blindages de combat.</p>",
      "type": "primary",
      "subtype": "Fusil de précision",
      "damage": "3d10",
      "damageType": "Impact",
      "range": "80m (100 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
      },
      "ammoReserve": 48,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimogris00001",
    "folder": "wpnfldrlaunch001",
    "name": "Ogris",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Launcher/300px-Ogris.webp",
    "system": {
      "description": "<p>Le lance-roquettes lourd de siège des Grineers. Propulse de massives roquettes d'artillerie provoquant des détonations explosives colossales de zone.</p>",
      "type": "primary",
      "subtype": "Lanceur lourd",
      "damage": "4d10",
      "damageType": "Blast",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 10,
      "critMultiplier": 2,
      "statusChance": 35,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 3,
        "max": 3
      },
      "ammoReserve": 12,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimpenta00001",
    "folder": "wpnfldrlaunch001",
    "name": "Penta",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Launcher/300px-Penta.webp",
    "system": {
      "description": "<p>Le lance-grenades tactique des Corpus. Projette des grenades à ricochets déclenchées à volonté par détonateur manuel à distance.</p>",
      "type": "primary",
      "subtype": "Lanceur lourd",
      "damage": "3d10",
      "damageType": "Blast",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 10,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 5,
        "max": 5
      },
      "ammoReserve": 20,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Manual Detonation",
      "altFireIcon": "fas fa-rss",
      "altDamage": "4d10",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprca42b8a85fbc",
    "folder": "wpnfldrprimtene1",
    "name": "Tenet Envoy",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/TenetEnvoy.png",
    "system": {
      "description": "<p>Le lance-missiles de luxe des dirigeants Corpus. Déploie une mallette lance-roquettes tirant des missiles téléguidés par le pointeur laser de la lunette.</p>",
      "type": "primary",
      "subtype": "Tenet Rocket Launcher",
      "damage": "4d10",
      "damageType": "Cold",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 28,
      "critMultiplier": 2.6,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 8,
        "max": 8
      },
      "ammoReserve": 48,
      "fireRate": 1,
      "reload": 4,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimtonkor0001",
    "folder": "wpnfldrlaunch001",
    "name": "Tonkor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Launcher/300px-Tonkor.webp",
    "system": {
      "description": "<p>Le célèbre lance-grenades Grineer à propulsion d'appoint. Projette des ogives explosives qui détonent au contact direct des ennemis.</p>",
      "type": "primary",
      "subtype": "Lanceur lourd",
      "damage": "4d10",
      "damageType": "Blast",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.5,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 12,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimtorid00001",
    "folder": "wpnfldrlaunch001",
    "name": "Torid",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Launcher/300px-Torid.webp",
    "system": {
      "description": "<p>Le lance-biochimique lourd Infesté. Projette des poches d'acide caustique qui explosent et laissent une nappe toxique persistante au sol.</p>",
      "type": "primary",
      "subtype": "Lanceur lourd",
      "damage": "3d10",
      "damageType": "Toxin",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 39,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 5,
        "max": 5
      },
      "ammoReserve": 25,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimzarr000001",
    "folder": "wpnfldrlaunch001",
    "name": "Zarr",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Launcher/300px-Zarr.webp",
    "system": {
      "description": "<p>Le canon de bordage pirate des Grineers. Peut tirer de lourdes boules de canon explosives qui se fragmentent en grappes de bombes, ou basculer en tromblon de chevrotine.</p>",
      "type": "primary",
      "subtype": "Lanceur lourd",
      "damage": "4d10",
      "damageType": "Blast",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2.5,
      "statusChance": 29,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 3,
        "max": 3
      },
      "ammoReserve": 15,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Barrage (Shotgun) Mode",
      "altFireIcon": "fas fa-th",
      "altDamage": "3d8",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimbubonico01",
    "folder": "wpnfldrarmcan001",
    "name": "Bubonico",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Arm cannon/300px-Bubonico.webp",
    "system": {
      "description": "<p>Le bio-canon de bras lourd Infesté. Tire des pointes toxiques en rafale, ou décharge une salve de 3 orbes de bio-gaz explosifs en tir secondaire.</p>",
      "type": "primary",
      "subtype": "Canon de bras",
      "damage": "3d8",
      "damageType": "Toxin",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 2.3,
      "statusChance": 31,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 27,
        "max": 27
      },
      "ammoReserve": 100,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Viral Bladder Barrage",
      "altFireIcon": "fas fa-biohazard",
      "altDamage": "4d8",
      "altDamageType": "Viral",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprimshedu00001",
    "folder": "wpnfldrarmcan001",
    "name": "Shedu",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Arm cannon/300px-Shedu.webp",
    "system": {
      "description": "<p>Le canon de bras biologique Sentient. Tire des impulsions de plasma thermique sans consommer de munitions ; vider sa batterie émet une onde de choc qui dissipe les résistances Sentientes.</p>",
      "type": "primary",
      "subtype": "Canon de bras",
      "damage": "3d8",
      "damageType": "Heat",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 32,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 7,
        "max": 7
      },
      "ammoReserve": 100,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr861cf2388f20",
    "folder": "wpnfldrprimspea1",
    "name": "Afentis",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Afentis.png",
    "system": {
      "description": "<p>Le fusil-lance d'honneur emblématique de Styanax. Les éliminations au tir augmentent la précision et les cadences de tir des alliés.</p><p><strong>Tir secondaire (Bannière de guerre) :</strong> Plante la lance au sol pour créer un champ de ralliement accordant des bonus de vitesse, de rechargement et de résistance aux alliés.</p>",
      "type": "primary",
      "subtype": "Fusil-lance",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 4,
        "max": 4
      },
      "ammoReserve": 24,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "naramon"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "madurai"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprd5063c37fd48",
    "folder": "wpnfldrprimspea1",
    "name": "Javlok",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Javlok.png",
    "system": {
      "description": "<p>Fusil-lance thermique des Grineers. Tire des boules de feu explosives en tir principal.</p><p><strong>Tir secondaire (Lancer de javelot) :</strong> Projette le javelot au sol pour déclencher un brasier dévastateur.</p>",
      "type": "primary",
      "subtype": "Fusil-lance",
      "damage": "2d10",
      "damageType": "Heat",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
      },
      "ammoReserve": 36,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr1a16a3c00838",
    "folder": "wpnfldrprimspea1",
    "name": "Ferrox",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Ferrox.png",
    "system": {
      "description": "<p>Fusil-lance à rail électromagnétique des Corpus. Tire des aiguilles laser chirurgicales à haute vélocité.</p><p><strong>Tir secondaire (Champ électrique) :</strong> Plante la lance pour créer un pylône électrique qui zappe et étourdit continuellement tous les ennemis proches.</p>",
      "type": "primary",
      "subtype": "Fusil-lance",
      "damage": "2d10",
      "damageType": "Electricity",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 32,
      "critMultiplier": 2.8,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 60,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "vazarin"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprb8c3220df082",
    "folder": "wpnfldrrifsemi01",
    "name": "Sirocco",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Sirocco.png",
    "system": {
      "description": "<p>Le pistolet-fusil énergétique du Vagabond dans Duviri. Décoche des projectiles de plasma avec un mécanisme de recharge parfaite offrant des tirs critiques amplifiés.</p>",
      "type": "primary",
      "subtype": "Void Pistol-Rifle",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 40,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 60,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprb33475a5f553",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Drakgoon",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaDrakgoon.png",
    "system": {
      "description": "<p>Version Kuva du tromblon Drakgoon dotée d'une pénétration accrue et de ricochets de plombs démultipliés.</p>",
      "type": "primary",
      "subtype": "Kuva Flak Cannon",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 19,
      "critMultiplier": 2.1,
      "statusChance": 9,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 11,
        "max": 11
      },
      "ammoReserve": 66,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr3259d805761f",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Hek",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaHek.png",
    "system": {
      "description": "<p>Version Kuva suprême du fusil à 4 canons Hek. Son tir secondaire permet de faire feu des 4 canons en même temps pour un impact d'annihilation totale !</p>",
      "type": "primary",
      "subtype": "Kuva Quad Shotgun",
      "damage": "3d8",
      "damageType": "Puncture",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 2.1,
      "statusChance": 13,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 4,
        "max": 4
      },
      "ammoReserve": 24,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprb6318381a14e",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Hind",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaHind.png",
    "system": {
      "description": "<p>Version perfectionnée de la 'Baguette' par les Liches Kuva, offrant les modes automatique, rafale de 5 coups et coup par coup.</p>",
      "type": "primary",
      "subtype": "Kuva Burst/Auto Rifle",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.1,
      "statusChance": 33,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 90,
        "max": 90
      },
      "ammoReserve": 540,
      "fireRate": 5,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr07f1716dd9ce",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Karak",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaKarak.png",
    "system": {
      "description": "<p>Le fusil de combat Kuva par excellence, alliant cadence régulière, recul nul et dégâts élémentaires Kuva renforcés.</p>",
      "type": "primary",
      "subtype": "Kuva Assault Rifle",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 2.1,
      "statusChance": 31,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 70,
        "max": 70
      },
      "ammoReserve": 420,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr2e969931ca8b",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Kohm",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaKohm.png",
    "system": {
      "description": "<p>Version royale Kuva du fusil rotatif Kohm, augmentant la puissance de découpe et infligeant de monstrueux dégâts de statut sous tir continu.</p>",
      "type": "primary",
      "subtype": "Kuva Spooling Shotgun",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 19,
      "critMultiplier": 2.3,
      "statusChance": 90,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 209,
        "max": 209
      },
      "ammoReserve": 1254,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "vazarin"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprc64918bf2ef2",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Ogris",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaOgris.png",
    "system": {
      "description": "<p>Le lance-roquettes Kuva lourd équipé de détonations thermiques et d'un réservoir de roquettes augmenté.</p>",
      "type": "primary",
      "subtype": "Kuva Rocket Launcher",
      "damage": "4d10",
      "damageType": "Blast",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 9,
      "critMultiplier": 2,
      "statusChance": 47,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 3,
        "max": 3
      },
      "ammoReserve": 18,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr50f134924687",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Quartakk",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaQuartakk.png",
    "system": {
      "description": "<p>Le fusil d'assaut à 4 canons des Liches Kuva. Tire en automatique fluide sans viser, et décharge ses 4 canons simultanément en visant à la mire.</p>",
      "type": "primary",
      "subtype": "Kuva Quad Rifle",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 21,
      "critMultiplier": 1.9,
      "statusChance": 33,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 88,
        "max": 88
      },
      "ammoReserve": 528,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppra7ade0cf48d1",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Sobek",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaSobek.png",
    "system": {
      "description": "<p>Version Kuva du fusil à pompe automatique Sobek avec chargeur étendu et dispersion optimisée.</p>",
      "type": "primary",
      "subtype": "Kuva Drum Shotgun",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 21,
      "critMultiplier": 2.3,
      "statusChance": 21,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 120,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr7b84ca4e8a9b",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Tonkor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaTonkor.png",
    "system": {
      "description": "<p>Le lance-grenades Kuva à rechargement éclair et vélocité de trajectoire accrue.</p>",
      "type": "primary",
      "subtype": "Kuva Grenade Launcher",
      "damage": "4d10",
      "damageType": "Blast",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.5,
      "statusChance": 17,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 6,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr68e0c19505ed",
    "folder": "wpnfldrprimkuva1",
    "name": "Kuva Zarr",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/KuvaZarr.png",
    "system": {
      "description": "<p>Le canon de vaisseau Kuva déchaînant une puissance de feu explosive et des sous-munitions incendiaires capables de raser des salles entières.</p>",
      "type": "primary",
      "subtype": "Kuva Hand Cannon",
      "damage": "4d10",
      "damageType": "Blast",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.5,
      "statusChance": 31,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 5,
        "max": 5
      },
      "ammoReserve": 30,
      "fireRate": 1,
      "reload": 5,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "madurai"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr99af651ab52a",
    "folder": "wpnfldrprimtene1",
    "name": "Tenet Arca Plasmor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/TenetArcaPlasmor.png",
    "system": {
      "description": "<p>Version d'élite Tenet de l'Arca Plasmor, dont l'onde de plasma ricoche désormais sur les surfaces solides pour nettoyer les coursives.</p>",
      "type": "primary",
      "subtype": "Tenet Plasma Shotgun",
      "damage": "3d10",
      "damageType": "Radiation",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2,
      "statusChance": 34,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 60,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wpprb4cd20fd65c8",
    "folder": "wpnfldrprimtene1",
    "name": "Tenet Ferrox",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/TenetFerrox.png",
    "system": {
      "description": "<p>Version Tenet du fusil-lance Ferrox dotée d'un champ de tethering gravitationnel retenant les ennemis dans son rayon électrique.</p>",
      "type": "primary",
      "subtype": "Tenet Rail-Spear",
      "damage": "2d10",
      "damageType": "Electricity",
      "range": "50m (60 ft)",
      "equipped": false,
      "critChance": 34,
      "critMultiplier": 3,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 120,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "vazarin"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr4e1e01245879",
    "folder": "wpnfldrprimtene1",
    "name": "Tenet Flux Rifle",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/TenetFluxRifle.png",
    "system": {
      "description": "<p>Version modernisée du Flux Rifle Corpus convertie en fusil automatique à munitions physiques avec un taux de statut exceptionnel.</p>",
      "type": "primary",
      "subtype": "Tenet Pulse Rifle",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 1.8,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 120,
        "max": 120
      },
      "ammoReserve": 720,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr2bb754ba24e9",
    "folder": "wpnfldrprimtene1",
    "name": "Tenet Glaxion",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/TenetGlaxion.png",
    "system": {
      "description": "<p>Version d'élite Tenet du canon à froid Glaxion, créant des chaînes de gel secondaire sautant d'ennemi en ennemi.</p>",
      "type": "primary",
      "subtype": "Tenet Cryo-Beam",
      "damage": "2d8",
      "damageType": "Cold",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.2,
      "statusChance": 40,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 90,
        "max": 90
      },
      "ammoReserve": 540,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr9f0c87ac29ee",
    "folder": "wpnfldrprimtene1",
    "name": "Tenet Quanta",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/TenetQuanta.png",
    "system": {
      "description": "<p>Version Tenet optimisée du Quanta permettant de déployer et de faire détoner des grappes de cubes de plasma simultanément.</p>",
      "type": "primary",
      "subtype": "Tenet Laser Cutter",
      "damage": "2d8",
      "damageType": "Electricity",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 31,
      "critMultiplier": 2.5,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 100,
        "max": 100
      },
      "ammoReserve": 600,
      "fireRate": 5,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "vazarin"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "naramon"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr685d04db687f",
    "folder": "wpnfldrprimtene1",
    "name": "Tenet Tetra",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/TenetTetra.png",
    "system": {
      "description": "<p>Version Tenet du Tetra équipée d'un tir secondaire qui vide un chargeur complet dans une méga-grenade explosive à concussion.</p>",
      "type": "primary",
      "subtype": "Tenet Pulse Rifle",
      "damage": "2d8",
      "damageType": "Puncture",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 28,
      "critMultiplier": 2.2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 80,
        "max": 80
      },
      "ammoReserve": 480,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr0449442a9691",
    "folder": "wpnfldrprimcoda1",
    "name": "Coda Bubonico",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/CodaBubonico.png",
    "system": {
      "description": "<p>Version mutante Coda de 1999 du bio-canon de bras. Déverse des sécrétions biochimiques virales hautement corrosives.</p>",
      "type": "primary",
      "subtype": "Coda Arm Cannon",
      "damage": "2d10",
      "damageType": "Toxin",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 27,
      "critMultiplier": 2.3,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 36,
        "max": 36
      },
      "ammoReserve": 216,
      "fireRate": 3,
      "reload": 6,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "naramon"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "naramon"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr1a50ec310113",
    "folder": "wpnfldrprimcoda1",
    "name": "Coda Hema",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/CodaHema.png",
    "system": {
      "description": "<p>Version Coda du fusil à rafale hématophage. Son siphon sanguin siphonne la vitalité des cibles avec une puissance décuplée.</p>",
      "type": "primary",
      "subtype": "Coda Blood Rifle",
      "damage": "2d8",
      "damageType": "Viral",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.3,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 72,
        "max": 72
      },
      "ammoReserve": 432,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "madurai"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppredc17f976556",
    "folder": "wpnfldrprimcoda1",
    "name": "Coda Sporothrix",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/CodaSporothrix.png",
    "system": {
      "description": "<p>Fusil de précision Coda d'élite de 1999 dont les tirs génèrent des grappes de spores explosives dévastatrices.</p>",
      "type": "primary",
      "subtype": "Coda Bio-Sniper",
      "damage": "3d10",
      "damageType": "Viral",
      "range": "60m (70 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 3,
      "statusChance": 55,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 11,
        "max": 11
      },
      "ammoReserve": 66,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "vazarin"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  },
  {
    "_id": "wppr326be939b193",
    "folder": "wpnfldrprimcoda1",
    "name": "Coda Synapse",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/CodaSynapse.png",
    "system": {
      "description": "<p>Version Coda du faisceau biologique Infesté. Concentre une foudre organique hyper-critique faisant fondre les défenses ennemies.</p>",
      "type": "primary",
      "subtype": "Coda Neuro-Beam",
      "damage": "2d10",
      "damageType": "Corrosive",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 40,
      "critMultiplier": 2.7,
      "statusChance": 15,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 76,
        "max": 76
      },
      "ammoReserve": 456,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "primary",
      "modes": {},
      "stancePolarity": "none",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "none"
        },
        "exilus": {
          "polarity": "naramon"
        },
        "slot1": {
          "polarity": "madurai"
        },
        "slot2": {
          "polarity": "naramon"
        },
        "slot3": {
          "polarity": "none"
        },
        "slot4": {
          "polarity": "none"
        },
        "slot5": {
          "polarity": "none"
        },
        "slot6": {
          "polarity": "none"
        },
        "slot7": {
          "polarity": "none"
        },
        "slot8": {
          "polarity": "none"
        }
      }
    }
  }
];
