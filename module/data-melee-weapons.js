/**
 * Warframe TTRPG - Melee Weapons Arsenal Dataset
 */

export const meleeWeaponFolders = [
  {
    "_id": "wpnfldrmel000001",
    "name": "Armes de Mêlée",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#e67e22"
  },
  {
    "_id": "wpnfldrmelswrd01",
    "name": "Épées",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#3498db"
  },
  {
    "_id": "wpnfldrmeldual01",
    "name": "Doubles épées",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#00e5ff"
  },
  {
    "_id": "wpnfldrmelscyt01",
    "name": "Faux",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#9b59b6"
  },
  {
    "_id": "wpnfldrmelpole01",
    "name": "Bâtons & Armes d'hast",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#2ecc71"
  },
  {
    "_id": "wpnfldrmelhvbl01",
    "name": "Lames lourdes & Espadons",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#e74c3c"
  },
  {
    "_id": "wpnfldrmelnikn01",
    "name": "Nikanas & Katanas",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#f39c12"
  },
  {
    "_id": "wpnfldrmelhamm01",
    "name": "Marteaux & Armes d'impact lourd",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#d35400"
  },
  {
    "_id": "wpnfldrmelglav01",
    "name": "Glaives & Mêlée de jet",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#1abc9c"
  },
  {
    "_id": "wpnfldrmelgnbl01",
    "name": "Pisto-lames & Armes hybrides",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#e67e22"
  },
  {
    "_id": "wpnfldrmeldagg01",
    "name": "Dagues & Doubles dagues",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#95a5a6"
  },
  {
    "_id": "wpnfldrmelfist01",
    "name": "Gantelets, Pugilat & Griffes",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#e91e63"
  },
  {
    "_id": "wpnfldrmelwhip01",
    "name": "Fouets & Fouets-lames",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#8e44ad"
  },
  {
    "_id": "wpnfldrmelkuva01",
    "name": "Armes de Mêlée Kuva",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#8B0000"
  },
  {
    "_id": "wpnfldrmeltene01",
    "name": "Armes de Mêlée Tenet",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#D4AF37"
  },
  {
    "_id": "wpnfldrmelcoda01",
    "name": "Armes de Mêlée Coda",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#7D26CD"
  },
  {
    "_id": "wpnfldrmelstal01",
    "name": "Armes du Stalker",
    "type": "Item",
    "folder": "wpnfldrmel000001",
    "sorting": "a",
    "color": "#2C0000"
  }
];

export const meleeWeaponsDataset = [
  {
    "_id": "wpmeskana0000001",
    "folder": "wpnfldrmelswrd01",
    "name": "Skana",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Swords/Skana.png",
    "system": {
      "description": "<p>L'épée traditionnelle à un seul tranchant des Tenno. Forgée dans un alliage à haute résistance plié selon d'antiques rites métallurgiques Orokins, le Skana concilie une maniabilité fluide et une précision de découpe tranchante.</p><p><strong>Posture recommandée :</strong> <em>Phénix de Fer</em> ou <em>Derviche Pourpre</em>.</p>",
      "type": "melee",
      "subtype": "Épée",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmecronus000001",
    "folder": "wpnfldrmelswrd01",
    "name": "Cronus",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Swords/Cronus.png",
    "system": {
      "description": "<p>Forgé à partir d'un alliage Grineer récupéré dans la forge personnelle du Capitaine Vor. Légèrement plus lourd que le Skana, il délivre de lourdes frappes tranchantes qui déséquilibrent les ennemis légers.</p>",
      "type": "melee",
      "subtype": "Épée",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmedakraprime01",
    "folder": "wpnfldrmelswrd01",
    "name": "Dakra Prime",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Swords/DakraPrime.png",
    "system": {
      "description": "<p>Une épée longue Orokin d'une élégance rare, réputée comme la référence absolue de l'art de l'escrime durant l'Ancienne Guerre. Parfaitement équilibrée pour des frappes critiques fulgurantes et de profondes lacérations.</p>",
      "type": "melee",
      "subtype": "Épée",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.4,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme63a45ca231c3",
    "folder": "wpnfldrmelstal01",
    "name": "Broken War",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/BrokenWar.png",
    "system": {
      "description": "<p>Un fragment brisé de la légendaire épée Sentiente Guerre, réemployé comme une lame à une main. Superbement équilibrée, dotée d'une létalité tranchante extrême et d'une puissance critique dévastatrice.</p>",
      "type": "melee",
      "subtype": "Longsword",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 35,
      "critMultiplier": 2.2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmepangolin0001",
    "folder": "wpnfldrmelswrd01",
    "name": "Pangolin Sword",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Swords/PangolinSword.png",
    "system": {
      "description": "<p>Une ancienne épée d'escrime lourde ornée d'une garde écailleuse. Délivre des entailles à fort taux d'effets de statut provoquant des hémorragies artérielles.</p>",
      "type": "melee",
      "subtype": "Épée",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "vazarin",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "vazarin"
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
    "_id": "wpmekrohkur00001",
    "folder": "wpnfldrmelswrd01",
    "name": "Krohkur",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Swords/Krohkur.png",
    "system": {
      "description": "<p>Épée de combat Grineer courbée en forme de faucille lourde. Ses entailles en crochet s'enfoncent profondément dans le blindage ennemi, avec 29% de Chances Critiques.</p>",
      "type": "melee",
      "subtype": "Épée",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 29,
      "critMultiplier": 2.3,
      "statusChance": 19,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmedualskana001",
    "folder": "wpnfldrmeldual01",
    "name": "Dual Skana",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dual swords/DualSkana.png",
    "system": {
      "description": "<p>Le maniement de deux lames Skana permet des enchaînements tourbillonnants fluides et des taillades croisées coordonnées. Frappe plusieurs adversaires adjacents simultanément lors de larges balayages.</p><p><strong>Posture recommandée :</strong> <em>Tigre Tourbillonnant</em> ou <em>Mante Religieuse</em>.</p>",
      "type": "melee",
      "subtype": "Doubles épées",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "dualkamas0000001",
    "folder": "wpnfldrmeldual01",
    "name": "Dual Kamas",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dual swords/DualKamas.png",
    "system": {
      "description": "<p>Maniant une faucille Kama dans chaque main, cette arme déchaîne une avalanche de dégâts tranchants sur vos ennemis. Leurs lames courbées compactes autorisent des enchaînements rapides et implacables au corps-à-corps.</p><p><strong>Rafale Jumelée :</strong> Le tempo effréné du maniement de deux faucilles courbées confère <strong>1 Attaque de Mêlée supplémentaire sous forme d'Action Rapide</strong> à votre tour !</p>",
      "type": "melee",
      "subtype": "Doubles épées",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "naramon"
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
    "_id": "wpmedualcleav001",
    "folder": "wpnfldrmeldual01",
    "name": "Dual Cleavers",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dual swords/DualCleavers.png",
    "system": {
      "description": "<p>Deux couperets de boucher lourds et rudimentaires, arme standard des bourreaux Grineers. Leur multiplicateur critique brutal de 3,0x tranche la chair et les tendons sans effort.</p>",
      "type": "melee",
      "subtype": "Doubles épées",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 3,
      "statusChance": 15,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmedexdakra0001",
    "folder": "wpnfldrmeldual01",
    "name": "Dex Dakra",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dual swords/DexDakra.png",
    "system": {
      "description": "<p>Doubles lames commémoratives ornées du sceau du Lotus, forgées pour les agents Tenno. Cadence d'enchaînement remarquablement rapide combinée à 28% de chances de statut.</p>",
      "type": "melee",
      "subtype": "Doubles épées",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmetwinkrohk001",
    "folder": "wpnfldrmeldual01",
    "name": "Twin Krohkur",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dual swords/TwinKrohkur.png",
    "system": {
      "description": "<p>Une paire de faucilles de combat Grineers à crochet. Le maniement double démultiplie leur effet de levier destructeur, arrachant les plaques de blindage des cibles lourdes.</p>",
      "type": "melee",
      "subtype": "Doubles épées",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 29,
      "critMultiplier": 2.3,
      "statusChance": 19,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmedualichor001",
    "folder": "wpnfldrmeldual01",
    "name": "Dual Ichor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dual swords/DualIchor.png",
    "system": {
      "description": "<p>Faucilles jumelles issues de protubérances infestées pulsant d'un bio-acide virulent. Inflige des dégâts de Toxine purs qui ignorent les boucliers, avec 30% de Chances Critiques et un multiplicateur de 3,0x.</p>",
      "type": "melee",
      "subtype": "Doubles épées",
      "damage": "2d8",
      "damageType": "Toxin",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 3,
      "statusChance": 15,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmeanku00000001",
    "folder": "wpnfldrmelscyt01",
    "name": "Anku",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Scythe/anku.webp",
    "system": {
      "description": "<p>Une faux de combat Tenno magistrale conçue selon l'esthétique géométrique de l'arc Paris. Ses crochets de lame effilés percent le blindage avec une précision chirurgicale.</p><p><strong>Moisson de Fléchettes :</strong> Les frappes au sol lourdes et tourbillonnantes projettent des fléchettes d'énergie perforantes dans un rayon de 5m, garantissant un effet de statut Tranchant (Saignement) sur tous les ennemis touchés.</p><p><strong>Posture recommandée :</strong> <em>Spirale Faucheuse</em> ou <em>Éventail Traqueur</em>.</p>",
      "type": "melee",
      "subtype": "Faux",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "naramon"
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
    "_id": "wpme4ad6c9287113",
    "folder": "wpnfldrmelstal01",
    "name": "Hate",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Hate.png",
    "system": {
      "description": "<p>La faux emblématique du Stalker. Forgée dans de sombres alliages abyssaux, ses larges balayages de faucheur infligent d'atroces blessures hémorragiques.</p>",
      "type": "melee",
      "subtype": "Faux",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.5,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmereaperprim01",
    "folder": "wpnfldrmelscyt01",
    "name": "Reaper Prime",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Scythe/ReaperPrime.png",
    "system": {
      "description": "<p>Chef-d'œuvre de faux ornementale Orokin transformant la récolte cérémonielle en poésie martiale. Vitesse incomparable, 35% de Chances Critiques et fauches d'une grâce absolue.</p>",
      "type": "melee",
      "subtype": "Faux",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 35,
      "critMultiplier": 2.5,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmecorufell0001",
    "folder": "wpnfldrmelscyt01",
    "name": "Corufell",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Scythe/Corufell.png",
    "system": {
      "description": "<p>Une imposante faux-canon forgée dans l'antique Duviri. Les attaques lourdes déploient la lame en un canon lourd de gros calibre, tirant une onde d'Explosion perforante de 4d10 le long du sol !</p>",
      "type": "melee",
      "subtype": "Heavy Scythe",
      "damage": "3d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "amanata000000001",
    "folder": "wpnfldrmelpole01",
    "name": "Amanata",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Staff/amanata.webp",
    "system": {
      "description": "<p>L'arme d'hast emblématique de Koumei. Chaque coup invite la fortune ou la ruine, lançant le Dé du Destin pour accorder des bénédictions éphémères.</p><p><strong>Trait emblématique (Dé de Koumei) :</strong> À chaque attaque, lancez un dé 1d6 pour obtenir de puissants bonus (1: Létalité/Critique, 2: Affliction/Statut, 3: Tourment/Dégâts de Statut, 4: Portée, 5: Célérité/Frappe supplémentaire, 6: Alignement Majeur/Toutes les bénédictions !). Entre les mains de Koumei, obtenir un 6 restaure 15 points d'Énergie.</p>",
      "type": "melee",
      "subtype": "Arme d'hast",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmebo0000000001",
    "folder": "wpnfldrmelpole01",
    "name": "Bo",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Staff/Bo.png",
    "system": {
      "description": "<p>Le bâton de combat traditionnel Tenno. Fabriqué en bois traité par résonance et renforcé d'embouts métalliques, ses balayages renversent les ennemis sous de violents chocs contondants.</p><p><strong>Posture recommandée :</strong> <em>Forêt Fracassante</em> ou <em>Branche Ondoyante</em>.</p>",
      "type": "melee",
      "subtype": "Bâton",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 14,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "vazarin",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "vazarin"
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
    "_id": "wpmeorthos000001",
    "folder": "wpnfldrmelpole01",
    "name": "Orthos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Staff/Orthos.png",
    "system": {
      "description": "<p>Une arme d'hast à double tranchant réputée pour son allonge immense. Ses attaques tourbillonnantes à 360 degrés fauchent des cohortes entières d'assaillants avant même qu'ils n'atteignent le corps-à-corps.</p><p><strong>Posture recommandée :</strong> <em>Fléau Scintillant</em> ou <em>Saule Pleureur</em>.</p>",
      "type": "melee",
      "subtype": "Arme d'hast",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmeguandao00001",
    "folder": "wpnfldrmelpole01",
    "name": "Guandao",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Staff/Guandao.png",
    "system": {
      "description": "<p>Une lourde hallebarde cérémonielle conçue pour les seigneurs de guerre. Son énorme multiplicateur critique de 2,4x et son arc de cercle fendeur tranchent les cibles en deux avec une grâce martiale.</p>",
      "type": "melee",
      "subtype": "Arme d'hast",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 28,
      "critMultiplier": 2.4,
      "statusChance": 16,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmelesion000001",
    "folder": "wpnfldrmelpole01",
    "name": "Lesion",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Staff/Lesion.png",
    "system": {
      "description": "<p>Une arme d'hast infestée vivante qui réagit avec avidité aux toxines. Déclencher un effet de statut accélère son métabolisme, lui conférant un bonus de vitesse d'attaque et des dégâts de Toxine additionnels.</p>",
      "type": "melee",
      "subtype": "Arme d'hast",
      "damage": "2d8",
      "damageType": "Toxin",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 37,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmecassowar0001",
    "folder": "wpnfldrmelpole01",
    "name": "Cassowar",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Staff/Cassowar.png",
    "system": {
      "description": "<p>Arme d'hast Tenno à deux lames courbées jumelées. Tranche à grande vitesse tout en infligeant de profonds saignements aux ennemis encerclants.</p>",
      "type": "melee",
      "subtype": "Arme d'hast",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 14,
      "critMultiplier": 2,
      "statusChance": 34,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmegalatine0001",
    "folder": "wpnfldrmelhvbl01",
    "name": "Galatine",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Heavy Blade/Galatine.png",
    "system": {
      "description": "<p>Une imposante épée à deux mains inspirée de l'héraldique chevaleresque terrienne. Ses larges revers balayent des pièces entières, projetant les adversaires sous la force pure de son tranchant.</p><p><strong>Posture recommandée :</strong> <em>Clémorist</em> ou <em>Tourbillon Tempétueux</em>.</p>",
      "type": "melee",
      "subtype": "Lame lourde",
      "damage": "3d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmegram00000001",
    "folder": "wpnfldrmelhvbl01",
    "name": "Gram",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Heavy Blade/Gram.png",
    "system": {
      "description": "<p>Une épée lourde high-tech de conception Tenno dotée d'amortisseurs de chocs cinétiques. Conçue pour briser les boucliers et armures lourdes par des impacts tranchants massifs.</p>",
      "type": "melee",
      "subtype": "Lame lourde",
      "damage": "3d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeparacesis001",
    "folder": "wpnfldrmelhvbl01",
    "name": "Paracesis",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Heavy Blade/Paracesis.png",
    "system": {
      "description": "<p>L'Épée Éliminatrice de Sentients créée par Ballas. Résonne avec le Néant, annulant les résistances d'adaptation Sentientes et gagnant en puissance jusqu'au rang 40.</p>",
      "type": "melee",
      "subtype": "Lame lourde",
      "damage": "3d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 31,
      "critMultiplier": 2.6,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeab4b1482cb2b",
    "folder": "wpnfldrmelstal01",
    "name": "War",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/War.png",
    "system": {
      "description": "<p>L'épée géante Sentiente complète forgée par Hunhow. Pulses d'énergie Sentiente pure infligeant de monstrueux dégâts d'Impact capables d'écraser des blindés.</p>",
      "type": "melee",
      "subtype": "Heavy Greatsword",
      "damage": "3d10",
      "damageType": "Impact",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.6,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "naramon"
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
    "_id": "wpmescindo000001",
    "folder": "wpnfldrmelhvbl01",
    "name": "Scindo",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Heavy Blade/Scindo.png",
    "system": {
      "description": "<p>Lourde hache de guerre d'exécuteur à deux mains. Ses puissants mouvements de hachage verticaux délivrent des frappes imparables de haut en bas qui brisent les boucliers et les casques.</p>",
      "type": "melee",
      "subtype": "Lame lourde",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.4,
      "statusChance": 18,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmevitrica00001",
    "folder": "wpnfldrmelhvbl01",
    "name": "Vitrica",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Heavy Blade/Vitrica.png",
    "system": {
      "description": "<p>L'épée de verre cérémonielle de Nihil, l'Exécuteur Orokin. Les attaques sautées projettent des éclats de verre qui cristallisent les ennemis sur place !</p>",
      "type": "melee",
      "subtype": "Lame lourde",
      "damage": "3d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 28,
      "critMultiplier": 2.4,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmenikana000001",
    "folder": "wpnfldrmelnikn01",
    "name": "Nikana",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Nikana/Nikana.png",
    "system": {
      "description": "<p>Le sabre traditionnel des Tenno. Rengainé dans son fourreau laqué, il est dégainé dans des mouvements de coupe éclair selon l'art martial du Iaido.</p><p><strong>Posture recommandée :</strong> <em>Tranchant Tranquille</em> ou <em>Justice Aveugle</em>.</p>",
      "type": "melee",
      "subtype": "Nikana",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmedragonnik001",
    "folder": "wpnfldrmelnikn01",
    "name": "Dragon Nikana",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Nikana/DragonNikana.png",
    "system": {
      "description": "<p>Une version forgée pour les maîtres épéistes, incorporant des os d'anciens béhémoths. Tranchant raffiné délivrant des entailles d'une précision mortelle.</p>",
      "type": "melee",
      "subtype": "Nikana",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeskiajati0001",
    "folder": "wpnfldrmelnikn01",
    "name": "Skiajati",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Nikana/Skiajati.png",
    "system": {
      "description": "<p>Le Nikana d'ombre emblématique d'Excalibur Umbra. Façonné dans une roche Sentiente sombre. Exécuter un coup de grâce élimine furtivement la cible, conférant à votre Warframe 5 secondes d'invisibilité totale !</p>",
      "type": "melee",
      "subtype": "Nikana",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 27,
      "critMultiplier": 2.1,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmetatsu0000001",
    "folder": "wpnfldrmelnikn01",
    "name": "Tatsu",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Nikana/Tatsu.png",
    "system": {
      "description": "<p>Le grand katana à deux mains emblématique de Revenant. Découpe ses proies et libère des feux follets traqueurs d'âmes après chaque élimination.</p>",
      "type": "melee",
      "subtype": "Two-Handed Nikana",
      "damage": "2d10",
      "damageType": "Radiation",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmepennant00001",
    "folder": "wpnfldrmelnikn01",
    "name": "Pennant",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Nikana/Pennant.png",
    "system": {
      "description": "<p>Un imposant odachi de commandement Dax orné. Réussir une élimination avec une Attaque Lourde accorde au porteur +75% de Vitesse d'Attaque pendant 8 secondes, transformant la grande lame en un tourbillon de mort.</p>",
      "type": "melee",
      "subtype": "Two-Handed Nikana",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 32,
      "critMultiplier": 2.8,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmesyam00000001",
    "folder": "wpnfldrmelnikn01",
    "name": "Syam",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Nikana/Syam.png",
    "system": {
      "description": "<p>Le Nikana du Vagabond imprégné de résonance Duviri. Les frappes d'estoc projettent des lames de vent sous pression qui traversent les groupes ennemis.</p>",
      "type": "melee",
      "subtype": "Nikana",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 28,
      "critMultiplier": 2.4,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmefragor000001",
    "folder": "wpnfldrmelhamm01",
    "name": "Fragor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Hammer/Fragor.png",
    "system": {
      "description": "<p>Un marteau de guerre de concassage lourd. Conçu à l'origine comme outil de démolition industrielle Orokin, il aplatit les armures lourdes Grineers comme du papier.</p><p><strong>Posture recommandée :</strong> <em>Choc Fracassant</em> ou <em>Rupture Casserole</em>.</p>",
      "type": "melee",
      "subtype": "Marteau",
      "damage": "3d10",
      "damageType": "Impact",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 15,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmejatkittag001",
    "folder": "wpnfldrmelhamm01",
    "name": "Jat Kittag",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Hammer/JatKittag.png",
    "system": {
      "description": "<p>Le terrifiant marteau de frappe Grineer propulsé par une fusée d'appoint. Déclenche une violente détonation de Feu à l'impact sur les frappes lourdes au sol.</p>",
      "type": "melee",
      "subtype": "Marteau",
      "damage": "3d10",
      "damageType": "Blast",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 2,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmearcatitron01",
    "folder": "wpnfldrmelhamm01",
    "name": "Arca Titron",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Hammer/ArcaTitron.png",
    "system": {
      "description": "<p>Le marteau à condensation d'énergie des Corpus. Chaque élimination charge son condensateur Slam Capacitor, libérant une onde de choc électrique gigantesque lors du prochain écrasement !</p>",
      "type": "melee",
      "subtype": "Marteau",
      "damage": "3d10",
      "damageType": "Electricity",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmemagistar0001",
    "folder": "wpnfldrmelhamm01",
    "name": "Magistar",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Hammer/Magistar.png",
    "system": {
      "description": "<p>Une masse à ailettes de paladin. Confère 15% de résistance aux contrôles de foule lorsqu'elle est dégainée. Les frappes lourdes au sol soignent les alliés proches de 15 PV et dissipent les effets de statut.</p>",
      "type": "melee",
      "subtype": "Mace",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "vazarin",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "vazarin"
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
    "_id": "wpmed00fb4a39063",
    "folder": "wpnfldrmelkuva01",
    "name": "Kuva Shildeg",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/KuvaShildeg.png",
    "system": {
      "description": "<p>Le grand marteau de guerre des Liches Kuva. Surpuissant, doté d'une tête de frappe renforcée par le Kuva royal, il écrase les ennemis avec un multiplicateur critique ravageur.</p>",
      "type": "melee",
      "subtype": "Kuva Rocket Hammer",
      "damage": "3d10",
      "damageType": "Impact",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 31,
      "critMultiplier": 2.7,
      "statusChance": 27,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeglaive000001",
    "folder": "wpnfldrmelglav01",
    "name": "Glaive",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Glaive/Glaive.png",
    "system": {
      "description": "<p>L'arme de jet emblématique des Tenno remontant à l'ère pré-Orokin. Peut être lancée pour rebondir de cible en cible avant de revenir dans la paume de son porteur.</p><p><strong>Détonation lourde :</strong> Appuyer sur l'Attaque Lourde pendant le vol fait exploser le Glaive en vol, infligeant de monstrueux dégâts d'Explosion et un saignement garanti.</p>",
      "type": "melee",
      "subtype": "Glaive",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Thrown 30m (35 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmecerata000001",
    "folder": "wpnfldrmelglav01",
    "name": "Cerata",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Glaive/Cerata.png",
    "system": {
      "description": "<p>Un glaive biologique Infesté doté de trois appendices en pinces osseuses. Déclenche des explosions d'acide caustique infligeant de purs dégâts de Toxine.</p>",
      "type": "melee",
      "subtype": "Glaive",
      "damage": "2d8",
      "damageType": "Toxin",
      "range": "Thrown 30m (35 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2,
      "statusChance": 31,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmeorvius000001",
    "folder": "wpnfldrmelglav01",
    "name": "Orvius",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Glaive/Orvius.png",
    "system": {
      "description": "<p>Le glaive rituel des gardes Kuva Teshin. Lorsqu'il est lancé en attaque lourde, il suspend la cible en lévitation dans les airs avant de la faire imploser dans une décharge glaciale.</p>",
      "type": "melee",
      "subtype": "Glaive",
      "damage": "2d8",
      "damageType": "Cold",
      "range": "Thrown 30m (35 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmexoris0000001",
    "folder": "wpnfldrmelglav01",
    "name": "Xoris",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Glaive/Xoris.png",
    "system": {
      "description": "<p>Le glaive à particules spectrales de Parvos Granum. Maintient un compteur de combo infini sans jamais se réinitialiser avec le temps, idéal pour alimenter des détonations continues.</p>",
      "type": "melee",
      "subtype": "Glaive",
      "damage": "2d8",
      "damageType": "Electricity",
      "range": "Thrown 30m (35 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.4,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmehalikar00001",
    "folder": "wpnfldrmelglav01",
    "name": "Halikar",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Glaive/Halikar.png",
    "system": {
      "description": "<p>Une masse de jet Grineer à propulsion par réaction dotée de tuyères à guidage automatique. Rebondit entre les cibles, les renversant et désarmant leurs armes à feu au contact.</p>",
      "type": "melee",
      "subtype": "Glaive",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "Thrown 30m (35 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2,
      "statusChance": 29,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "vinquibusmel0001",
    "folder": "wpnfldrmelgnbl01",
    "name": "Vinquibus (Bayonet)",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Primary/Rifle/Vinquibus.png",
    "system": {
      "description": "<p>La baïonnette-fusil emblématique d'<strong>Uriel</strong> (<em>L'Hérétique de Xata</em>), configurée dans sa <strong>Forme Baïonnette</strong> de corps-à-corps. Maniée dans la posture <em>Flèche Tourmentée</em> avec des coups d'estoc fluides, fentes et empalements.</p><p><strong>Fonctionnalité Hybride :</strong> Bascule sans transition entre le <strong>Mode Baïonnette</strong> et le <strong>Mode Fusil</strong> grâce au bouton d'alternance.</p><p><strong>Précision du Vinquibus (Ruée à la Baïonnette) :</strong> Libère la charge stockée du fusil pour <strong>+50% de dégâts bonus</strong> !</p><p><strong>Férocité du Vinquibus (Siphon de Munitions) :</strong> Les frappes de mêlée restaurent <strong>+4 munitions</strong> directement dans le chargeur du fusil.</p><p><strong>Synergie emblématique (Uriel) :</strong> Les frappes récoltent <strong>+5 Furie de Brimstone</strong>. Les fiélons actifs de la Légion reçoivent <strong>+10 PV de soin</strong> et les attaques infligent <strong>+25% de dégâts de Feu bonus</strong> !</p>",
      "type": "melee",
      "subtype": "Bayonet",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 40,
      "critMultiplier": 3.2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": true,
      "currentMode": "melee",
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
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeredeemer0001",
    "folder": "wpnfldrmelgnbl01",
    "name": "Redeemer",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Gunblade/Redeemer.png",
    "system": {
      "description": "<p>Le premier pisto-lame Tenno. Combine une lame à double tranchant avec un fusil à pompe de gros calibre dissimulé dans la garde.</p><p><strong>Tir de mêlée :</strong> Les attaques lourdes déchargent une gerbe de chevrotine à bout portant infligeant 3d8 dégâts balistiques.</p>",
      "type": "melee",
      "subtype": "Pisto-lame",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft) / Shot 25m",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2.2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmestropha00001",
    "folder": "wpnfldrmelgnbl01",
    "name": "Stropha",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Gunblade/Stropha.png",
    "system": {
      "description": "<p>Un pisto-lame Corpus de haute technologie. Déclenche une onde de choc cinétique ultra-dense à courte portée capable de traverser plusieurs ennemis en ligne.</p>",
      "type": "melee",
      "subtype": "Pisto-lame",
      "damage": "3d8",
      "damageType": "Impact",
      "range": "Melee (8 ft) / Shot 15m",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.4,
      "statusChance": 14,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmesarpa0000001",
    "folder": "wpnfldrmelgnbl01",
    "name": "Sarpa",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Gunblade/Sarpa.png",
    "system": {
      "description": "<p>Un pisto-lame Grineer tirant des rafales saccadées de 5 projectiles perforants. Conçu pour déchiqueter les blindages à courte distance.</p>",
      "type": "melee",
      "subtype": "Pisto-lame",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft) / Shot 30m",
      "equipped": false,
      "critChance": 14,
      "critMultiplier": 2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmevastilok0001",
    "folder": "wpnfldrmelgnbl01",
    "name": "Vastilok",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Gunblade/Vastilok.png",
    "system": {
      "description": "<p>Le pisto-lame Grineer des chantiers navals de Saturne. Tire une décharge de grenaille lourde perforante à cadence élevée.</p>",
      "type": "melee",
      "subtype": "Pisto-lame",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft) / Shot 20m",
      "equipped": false,
      "critChance": 19,
      "critMultiplier": 2.4,
      "statusChance": 29,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmekaryst000001",
    "folder": "wpnfldrmeldagg01",
    "name": "Karyst",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dagger/Karyst.png",
    "system": {
      "description": "<p>Une dague rituelle forgée dans des crocs d'abominations empoisonnées. Inflige des dégâts de Toxine purs à chaque estocade chirurgicale.</p>",
      "type": "melee",
      "subtype": "Dague",
      "damage": "2d6",
      "damageType": "Toxin",
      "range": "Melee (5 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmesheev0000001",
    "folder": "wpnfldrmeldagg01",
    "name": "Sheev",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dagger/Sheev.png",
    "system": {
      "description": "<p>Un couteau de combat de tranchée Grineer à lame plasma chauffée à blanc. Conçu pour les combats rapprochés et les coups de grâce furtifs.</p>",
      "type": "melee",
      "subtype": "Dague",
      "damage": "2d6",
      "damageType": "Heat",
      "range": "Melee (5 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeceramicdag01",
    "folder": "wpnfldrmeldagg01",
    "name": "Ceramic Dagger",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dagger/CeramicDagger.png",
    "system": {
      "description": "<p>Une dague de céramique ultra-légère au tranchant moléculaire. Vitesse de frappe fulgurante et temps de récupération minimal.</p>",
      "type": "melee",
      "subtype": "Dague",
      "damage": "2d6",
      "damageType": "Puncture",
      "range": "Melee (5 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmefang00000001",
    "folder": "wpnfldrmeldagg01",
    "name": "Fang",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Dagger/Fang.png",
    "system": {
      "description": "<p>Paire de dagues de combat Tenno conçues pour les assassinats rapides. Enchaîne des séries d'estocades rapides pour percer les points faibles de l'armure.</p>",
      "type": "melee",
      "subtype": "Doubles dagues",
      "damage": "2d6",
      "damageType": "Puncture",
      "range": "Melee (5 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmefurax0000001",
    "folder": "wpnfldrmelfist01",
    "name": "Furax",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Fist/Furax.png",
    "system": {
      "description": "<p>Gantelets de combat Tenno renforcés de plaques d'acier. Concentrent toute la force physique du porteur en coups de poing fracassants.</p>",
      "type": "melee",
      "subtype": "Fists",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "Melee (5 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.3,
      "statusChance": 15,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmetekko0000001",
    "folder": "wpnfldrmelfist01",
    "name": "Tekko",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Fist/Tekko.png",
    "system": {
      "description": "<p>Gantelets à lames de combat en fer trempé. Conçus à l'origine pour la Warframe Atlas, leurs griffes de tranchant pur déchiquettent la chair à l'impact.</p>",
      "type": "melee",
      "subtype": "Fists",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (5 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.6,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmehirudo000001",
    "folder": "wpnfldrmelfist01",
    "name": "Hirudo",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Fist/Hirudo.png",
    "system": {
      "description": "<p>Arme de pugilat Infestée dotée de pointes bio-organiques acérées. Chaque coup critique draine la force vitale ennemie pour soigner directement la Warframe !</p>",
      "type": "melee",
      "subtype": "Pugilat",
      "damage": "2d8",
      "damageType": "Puncture",
      "range": "Melee (5 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 3,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmevenka0000001",
    "folder": "wpnfldrmelfist01",
    "name": "Venka",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Fist/Venka.png",
    "system": {
      "description": "<p>Des griffes de combat rétractables fixées aux avant-bras. Leurs lames tranchantes comme le diamant augmentent le multiplicateur de combo de mêlée plus vite que toute autre arme.</p>",
      "type": "melee",
      "subtype": "Griffes",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (5 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.4,
      "statusChance": 16,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeatterax00001",
    "folder": "wpnfldrmelwhip01",
    "name": "Atterax",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Whip/Atterax.png",
    "system": {
      "description": "<p>Le fouet de châtiment Grineer garni de lames rotatives tranchantes. Son allonge démesurée et son immense potentiel critique fauchent des vagues entières d'ennemis.</p>",
      "type": "melee",
      "subtype": "Fouet",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 3,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmelecta0000001",
    "folder": "wpnfldrmelwhip01",
    "name": "Lecta",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Whip/Lecta.png",
    "system": {
      "description": "<p>Fouet électrique haute tension des Corpus. Électrocute les cibles sur de larges arcs de cercle, étourdissant les escouades sur place avec 35% de chances de statut d'Électricité.</p>",
      "type": "melee",
      "subtype": "Fouet",
      "damage": "2d8",
      "damageType": "Electricity",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 10,
      "critMultiplier": 1.5,
      "statusChance": 35,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmemios00000001",
    "folder": "wpnfldrmelwhip01",
    "name": "Mios",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Whip/Mios.png",
    "system": {
      "description": "<p>Un fouet-lame Infesté combinant une épée osseuse et un appendice articulé à chaîne. Permet d'attraper les ennemis à distance pour les rabattre au corps-à-corps.</p>",
      "type": "melee",
      "subtype": "Fouet-lame",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmelacera000001",
    "folder": "wpnfldrmelwhip01",
    "name": "Lacera",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Whip/Lacera.png",
    "system": {
      "description": "<p>Un fouet-lame Tenno à conduction électrique pure. Affiche un taux de déclenchement d'effets de statut spectaculaire de 45%.</p>",
      "type": "melee",
      "subtype": "Fouet-lame",
      "damage": "2d10",
      "damageType": "Electricity",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 1.5,
      "statusChance": 45,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
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
    "_id": "wpmevolnus000001",
    "folder": "wpnfldrmelhamm01",
    "name": "Volnus",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Hammer/Volnus.png",
    "system": {
      "description": "<p>Le marteau de verre léger de Gara. Alliant la vivacité d'une épée et la percussion d'un marteau, il inflige des dégâts Tranchants dévastateurs.</p>",
      "type": "melee",
      "subtype": "Light Hammer",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (9 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 25,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmevenato000001",
    "folder": "wpnfldrmelscyt01",
    "name": "Venato",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Scythe/Venato.png",
    "system": {
      "description": "<p>La faux de guerre Sentiente emblématique de Caliban. Forgée dans un bio-alliage vivant de Tau, ses frappes de faucheur tranchent aussi bien la chair que le blindage robotique.</p><p><strong>Synergie emblématique (Caliban) :</strong> Caliban gagne +50% de vitesse d'attaque de mêlée en maniant le Venato, et sa progéniture mortelle imite ses larges coups de faux lourds.</p>",
      "type": "melee",
      "subtype": "Faux",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2.2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme24505c98be3f",
    "folder": "wpnfldrmelscyt01",
    "name": "Harmony",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Harmony.png",
    "system": {
      "description": "<p>La faux emblématique de Jade. Sa lame chantante incurvée résonne entre la vie et la mort.</p><p><strong>Résonance Harmonique :</strong> Les attaques lourdes consument et font exploser immédiatement tous les effets de statut actifs sur la cible, infligeant instantanément l'intégralité de leurs dégâts restants !</p><p><strong>Synergie emblématique (Jade) :</strong> Réussir des éliminations prolonge la durée du Jugement de Jade de 3 secondes.</p>",
      "type": "melee",
      "subtype": "Faux",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.2,
      "statusChance": 36,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme82cc1e7ecf19",
    "folder": "wpnfldrmelscyt01",
    "name": "Hespar",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Hespar.png",
    "system": {
      "description": "<p>Antique faux cérémonielle à deux mains du Zariman. Manœuvrée avec élan, ses attaques tourbillonnantes aspirent des escouades ennemies entières dans un broyeur d'acier tranchant comme un rasoir.</p>",
      "type": "melee",
      "subtype": "Heavy Scythe",
      "damage": "3d10",
      "damageType": "Slash",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme98dba8b4cc65",
    "folder": "wpnfldrmeldual01",
    "name": "Sun & Moon",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/SunMoon.png",
    "system": {
      "description": "<p>Les sabres jumeaux légendaires de Teshin dans l'univers de Duviri. Conjuguent la discipline du katana et l'ardeur du sabre court pour des taillades doubles parfaites.</p>",
      "type": "melee",
      "subtype": "Dual Nikanas",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.4,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme1f9a14758e17",
    "folder": "wpnfldrmelnikn01",
    "name": "Azothane",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Azothane.png",
    "system": {
      "description": "<p>Une lame lourde monumentale à deux mains maniée par les dax de Duviri. Ses entailles cérémonielles génèrent des vagues d'énergie spectrale.</p>",
      "type": "melee",
      "subtype": "Two-Handed Nikana",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 34,
      "critMultiplier": 3,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeed30621b4f9a",
    "folder": "wpnfldrmelpole01",
    "name": "Edun",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Edun.png",
    "system": {
      "description": "<p>L'arme d'hast magistrale de Duviri. Lancée en attaque lourde, elle transperce la cible à distance avant de libérer une explosion d'énergie pure.</p>",
      "type": "melee",
      "subtype": "Arme d'hast",
      "damage": "2d10",
      "damageType": "Puncture",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 34,
      "critMultiplier": 2.6,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmee9fb168a0a1d",
    "folder": "wpnfldrmelhamm01",
    "name": "Sampotes",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Sampotes.png",
    "system": {
      "description": "<p>Une immense masse de forge lourde de Duviri. Écraser le sol en frappe lourde propulse des vagues de choc sismiques qui envoient valser les ennemis à des dizaines de mètres !</p>",
      "type": "melee",
      "subtype": "Heavy Hammer",
      "damage": "3d10",
      "damageType": "Impact",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 3,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme8866117c91b8",
    "folder": "wpnfldrmelswrd01",
    "name": "Argo & Vel",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/ArgoVel.png",
    "system": {
      "description": "<p>L'épée et le bouclier défensifs forgés dans les forges du néant. Bloquer les attaques charge le bouclier, qui peut être projeté comme un disque tranchant énergétique !</p>",
      "type": "melee",
      "subtype": "Sword & Shield",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 32,
      "critMultiplier": 2.4,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme53270784556f",
    "folder": "wpnfldrmelfist01",
    "name": "Ruvox",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Ruvox.png",
    "system": {
      "description": "<p>Les gantelets de pugilat forgés dans le Néant emblématiques de Dante. Les frappes lourdes au sol empalent les ennemis proches sur des pointes souterraines saillantes du Néant.</p><p><strong>Synergie emblématique (Dante) :</strong> Les coups de poing génèrent de la Garde Renforcée lors des frappes lourdes réussies.</p>",
      "type": "melee",
      "subtype": "Fist Gauntlets",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "Melee (6 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
        },
        "exilus": {
          "polarity": "madurai"
        },
        "slot1": {
          "polarity": "naramon"
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
    "_id": "wpme89d64c31f2dd",
    "folder": "wpnfldrmelhvbl01",
    "name": "Sarofang",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/Sarofang.png",
    "system": {
      "description": "<p>La lourde hache d'exécution emblématique de Voruna. Réussir des éliminations au corps-à-corps génère de la Soif de Sang ; les frappes lourdes au sol libèrent une onde de choc radiale qui attire les ennemis vers Voruna.</p>",
      "type": "melee",
      "subtype": "Heavy Axe",
      "damage": "3d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme6e64dadc4256",
    "folder": "wpnfldrmelkuva01",
    "name": "Kuva Ghoulsaw",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/KuvaGhoulsaw.png",
    "system": {
      "description": "<p>Scie circulaire motorisée récupérée sur les machines de guerre Goules. Chevaucher la lame en rotation vers l'avant déchiquette les formations ennemies sous de violentes lacérations continues.</p>",
      "type": "melee",
      "subtype": "Kuva Assault Saw",
      "damage": "2d10",
      "damageType": "Slash",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.1,
      "statusChance": 32,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmefd5da1c08c9d",
    "folder": "wpnfldrmeltene01",
    "name": "Tenet Agendus",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/TenetAgendus.png",
    "system": {
      "description": "<p>Épée et bouclier lourds de dirigeant Corpus. Les attaques lourdes déchargent un projectile de marteau énergétique foudroyant les cibles à distance.</p>",
      "type": "melee",
      "subtype": "Tenet Sword & Shield",
      "damage": "2d10",
      "damageType": "Electricity",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme59332c836ec4",
    "folder": "wpnfldrmeltene01",
    "name": "Tenet Exec",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/TenetExec.png",
    "system": {
      "description": "<p>Espadon massif des dirigeants Corpus. Les frappes lourdes au sol émettent des ondes de choc successives d'énergie sonique commotionnelle dans un cône frontal.</p>",
      "type": "melee",
      "subtype": "Tenet Heavy Blade",
      "damage": "3d10",
      "damageType": "Impact",
      "range": "Melee (12 ft)",
      "equipped": false,
      "critChance": 38,
      "critMultiplier": 2.4,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme6783d45fd2b0",
    "folder": "wpnfldrmeltene01",
    "name": "Tenet Grigori",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/TenetGrigori.png",
    "system": {
      "description": "<p>Faux Corpus de haute technologie. Les attaques lourdes glissées projettent un disque de plasma autonome à ricochet qui découpe les ennemis sur son passage.</p>",
      "type": "melee",
      "subtype": "Tenet Scythe",
      "damage": "2d10",
      "damageType": "Electricity",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 1.6,
      "statusChance": 38,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmefe60b39919f8",
    "folder": "wpnfldrmeltene01",
    "name": "Tenet Livia",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/TenetLivia.png",
    "system": {
      "description": "<p>Grand katana profilé des Corpus. Bloquer les attaques fait monter le multiplicateur de combo ; rengainer l'arme fige indéfiniment la durée du combo.</p>",
      "type": "melee",
      "subtype": "Tenet Two-Handed Nikana",
      "damage": "3d8",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 28,
      "critMultiplier": 2.2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme4f987f89f1e6",
    "folder": "wpnfldrmelcoda01",
    "name": "Coda Caustacyst",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/CodaCaustacyst.png",
    "system": {
      "description": "<p>Faux de Liche Infestée. Les attaques lourdes projettent une traînée de bio-boue corrosive qui persiste au sol et dissout les pieds des ennemis.</p>",
      "type": "melee",
      "subtype": "Coda Bio-Scythe",
      "damage": "2d10",
      "damageType": "Corrosive",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 19,
      "critMultiplier": 2.3,
      "statusChance": 41,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpme3bf6c830f526",
    "folder": "wpnfldrmelcoda01",
    "name": "Coda Hirudo",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/CodaHirudo.png",
    "system": {
      "description": "<p>Griffes de pugilat Infestées. Les coups critiques siphonnent la vitalité directement de la victime, soignant l'opérateur et augmentant la santé maximale.</p>",
      "type": "melee",
      "subtype": "Coda Sparring Fists",
      "damage": "2d8",
      "damageType": "Puncture",
      "range": "Melee (6 ft)",
      "equipped": false,
      "critChance": 34,
      "critMultiplier": 3.1,
      "statusChance": 18,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
    "_id": "wpmeb3c4c971cacb",
    "folder": "wpnfldrmelcoda01",
    "name": "Coda Mire",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/CodaMire.png",
    "system": {
      "description": "<p>Épée Infestée incrustée de pathogènes virulents. Inflige des dégâts de Toxine bonus innés contournant les boucliers à chaque balancement.</p>",
      "type": "melee",
      "subtype": "Coda Bio-Blade",
      "damage": "2d8",
      "damageType": "Toxin",
      "range": "Melee (8 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2.4,
      "statusChance": 40,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "vazarin",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "vazarin"
        },
        "exilus": {
          "polarity": "none"
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
    "_id": "wpme08b7d0234762",
    "folder": "wpnfldrmelcoda01",
    "name": "Coda Motovore",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/CodaMotovore.png",
    "system": {
      "description": "<p>Lame lourde Infestée féroce de 1999 qui se nourrit de l'élan ennemi, accélérant la cadence des frappes au fil des coups consécutifs.</p>",
      "type": "melee",
      "subtype": "Coda Heavy Cleaver",
      "damage": "3d10",
      "damageType": "Slash",
      "range": "Melee (10 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.3,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "naramon",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "naramon"
        },
        "exilus": {
          "polarity": "none"
        },
        "slot1": {
          "polarity": "naramon"
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
    "_id": "wpmefec9648eaeba",
    "folder": "wpnfldrmelcoda01",
    "name": "Coda Pathocyst",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/Melee/CodaPathocyst.png",
    "system": {
      "description": "<p>Glaive de jet Infesté. Faire exploser le glaive en plein vol engendre des nuées d'asticots voraces qui s'agrippent aux survivants avant d'exploser.</p>",
      "type": "melee",
      "subtype": "Coda Glaive",
      "damage": "2d10",
      "damageType": "Viral",
      "range": "Thrown (25 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2.3,
      "statusChance": 35,
      "attackBonus": 1,
      "attribute": "physique",
      "magazine": {
        "value": 0,
        "max": 0
      },
      "ammoReserve": 0,
      "fireRate": 1,
      "reload": 0,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "melee",
      "modes": {},
      "stancePolarity": "madurai",
      "orokinCatalyst": false,
      "modSlots": {
        "stance": {
          "polarity": "madurai"
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
  }
];
