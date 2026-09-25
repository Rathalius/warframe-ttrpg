/**
 * Warframe TTRPG - Secondary Weapons Arsenal Dataset
 */

export const secondaryWeaponFolders = [
  {
    "_id": "wpnfldrsec000001",
    "name": "Armes Secondaires",
    "type": "Item",
    "folder": null,
    "sorting": "a",
    "color": "#2ecc71"
  },
  {
    "_id": "wpnfldrsecsemi01",
    "name": "Pistolets - Semi-automatique",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#3498db"
  },
  {
    "_id": "wpnfldrsecauto01",
    "name": "Pistolets - Automatique",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#00e5ff"
  },
  {
    "_id": "wpnfldrsecbrst01",
    "name": "Pistolets - Rafale",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#5dade2"
  },
  {
    "_id": "wpnfldrsecbeam01",
    "name": "Armes secondaires - Continu / Rayon",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#9b59b6"
  },
  {
    "_id": "wpnfldrsecspec01",
    "name": "Armes secondaires - À charge & Spéciaux",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#f39c12"
  },
  {
    "_id": "wpnfldrsecwrst01",
    "name": "Lanceurs de poignet & Acoustiques",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#e67e22"
  },
  {
    "_id": "wpnfldrsecshot01",
    "name": "Pistolets à pompe",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#e74c3c"
  },
  {
    "_id": "wpnfldrsecthrw01",
    "name": "Armes de jet & Fléchettes",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#1abc9c"
  },
  {
    "_id": "wpnfldrsecdual01",
    "name": "Armes secondaires doubles / Akimbo",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#95a5a6"
  },
  {
    "_id": "wpnfldrseckuva01",
    "name": "Armes Secondaires Kuva",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#8B0000"
  },
  {
    "_id": "wpnfldrsectene01",
    "name": "Armes Secondaires Tenet",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#D4AF37"
  },
  {
    "_id": "wpnfldrseccoda01",
    "name": "Armes Secondaires Coda",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#7D26CD"
  },
  {
    "_id": "wpnfldrsecstal01",
    "name": "Armes du Stalker",
    "type": "Item",
    "folder": "wpnfldrsec000001",
    "sorting": "a",
    "color": "#2C0000"
  }
];

export const secondaryWeaponsDataset = [
  {
    "_id": "wpseclex00000000",
    "folder": "wpnfldrsecsemi01",
    "name": "Lex",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Lex.png",
    "system": {
      "description": "<p>Le Lex est un pistolet lourd semi-automatique Tenno de gros calibre. Vénéré comme un véritable fusil de précision de poche, il délivre une force d'arrêt cinétique dévastatrice avec une précision chirurgicale à moyenne et longue distance.</p><p><strong>Force d'arrêt lourde :</strong> Les tirs réussis contre des cibles non blindées ou affaiblies ont 25% de chances de repousser les ennemis de 3 mètres en arrière.</p>",
      "type": "secondary",
      "subtype": "Heavy Pistol",
      "damage": "2d8",
      "damageType": "Puncture",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
      },
      "ammoReserve": 48,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpseclato0000000",
    "folder": "wpnfldrsecsemi01",
    "name": "Lato",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Lato.png",
    "system": {
      "description": "<p>L'arme secondaire canonique des Tenno. Équilibré, fiable et véloce, le Lato tire des cartouches cinétiques semi-automatiques parfaitement adaptées à toutes les situations de combat standard.</p>",
      "type": "secondary",
      "subtype": "Semi-Auto Pistol",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 10,
      "critMultiplier": 1.8,
      "statusChance": 6,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 15,
        "max": 15
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
      "currentMode": "secondary",
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
    "_id": "wpsecknell000000",
    "folder": "wpnfldrsecsemi01",
    "name": "Knell",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Knell.png",
    "system": {
      "description": "<p>Le revolver lourd à lunette emblématique de Harrow. Réussir un tir de précision à la tête déclenche <strong>Glas Funèbre</strong> pendant 3 rounds : confère des munitions infinies (aucune munition consommée), +0,5x de multiplicateur critique et +20% de chances de statut.</p><p><strong>Synergie emblématique (Harrow) :</strong> La durée de Glas Funèbre est doublée à 6 rounds et la capacité du chargeur est accrue.</p>",
      "type": "secondary",
      "subtype": "Scoped Heavy Pistol",
      "damage": "2d8",
      "damageType": "Puncture",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 1.5,
      "statusChance": 5,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 8,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecpandero0000",
    "folder": "wpnfldrsecsemi01",
    "name": "Pandero",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Pandero.png",
    "system": {
      "description": "<p>Le revolver lourd rythmique emblématique d'Octavia. Ses tirs semi-automatiques de précision délivrent un impact balistique net et percutant.</p><p><strong>Tir secondaire (Éventail de coups) :</strong> Décharge d'un coup l'intégralité du barillet dans une rafale furieuse de tirs foudroyants.</p><p><strong>Synergie emblématique (Octavia) :</strong> Les éliminations par tir à la tête libèrent une onde de choc mélodique infligeant 2d6 dégâts d'Explosion dans un rayon de 5m.</p>",
      "type": "secondary",
      "subtype": "Heavy Revolver",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.8,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 8,
        "max": 8
      },
      "ammoReserve": 64,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Fan the Hammer",
      "altFireIcon": "fas fa-forward",
      "altDamage": "2d8",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecvasto000000",
    "folder": "wpnfldrsecsemi01",
    "name": "Vasto",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Vasto.png",
    "system": {
      "description": "<p>Un revolver à six coups Tenno classique façonné avec une précision exquise. Sa haute vélocité initiale et ses balles dentelées infligent de profondes blessures hémorragiques.</p>",
      "type": "secondary",
      "subtype": "Revolver",
      "damage": "2d6",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 1.8,
      "statusChance": 8,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
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
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecmagnus00000",
    "folder": "wpnfldrsecsemi01",
    "name": "Magnus",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Magnus.png",
    "system": {
      "description": "<p>Un revolver lourd à huit coups qui échange une cadence rapide contre un impact cinétique assourdissant. Déséquilibre les cibles légères sur coup direct.</p>",
      "type": "secondary",
      "subtype": "Heavy Revolver",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 8,
        "max": 8
      },
      "ammoReserve": 64,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecmarelok0000",
    "folder": "wpnfldrsecsemi01",
    "name": "Marelok",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Marelok.png",
    "system": {
      "description": "<p>Arme de poing Grineer lourde à levier de sous-garde. Conçue autour du châssis d'un fusil scié, elle libère des balles uniques dévastatrices capables de perforer les boucliers balistiques.</p>",
      "type": "secondary",
      "subtype": "Lever-Action Pistol",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 1.5,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
      },
      "ammoReserve": 48,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecseer0000000",
    "folder": "wpnfldrsecsemi01",
    "name": "Seer",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Seer.png",
    "system": {
      "description": "<p>La synthèse rudimentaire du Capitaine Vor combinant la technologie Orokin récupérée et l'ingénierie brute Grineer. Tire des projectiles explosifs corrosifs à travers une optique de zoom intégrée.</p>",
      "type": "secondary",
      "subtype": "Hybrid Pistol",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 1.5,
      "statusChance": 13,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 8,
        "max": 8
      },
      "ammoReserve": 64,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecbolto000000",
    "folder": "wpnfldrsecsemi01",
    "name": "Bolto",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Bolto.png",
    "system": {
      "description": "<p>Tire des fléchettes énergétisées à grande vitesse capables d'empaler les ennemis et de clouer les cadavres aux parois et cloisons.</p>",
      "type": "secondary",
      "subtype": "Bolt Pistol",
      "damage": "1d10",
      "damageType": "Puncture",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2.4,
      "statusChance": 2,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 15,
        "max": 15
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
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecplinx000000",
    "folder": "wpnfldrsecsemi01",
    "name": "Plinx",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Plinx.png",
    "system": {
      "description": "<p>Arme de poing à énergie conçue par les Solaris, alimentée par une batterie rechargeable. Sa batterie ultra-efficace régénère automatiquement ses réserves de munitions après 1,5 seconde sans tirer.</p>",
      "type": "secondary",
      "subtype": "Battery Pistol",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 32,
      "critMultiplier": 3,
      "statusChance": 4,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
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
      "currentMode": "secondary",
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
    "_id": "wpsecarcascisco0",
    "folder": "wpnfldrsecsemi01",
    "name": "Arca Scisco",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/ArcaScisco.png",
    "system": {
      "description": "<p>Arme de poing optique haute technologie des Corpus. Enchaîner des tirs consécutifs sur la même cible analyse ses faiblesses, cumulant jusqu'à +20% de Chances Critiques et de Statut.</p>",
      "type": "secondary",
      "subtype": "Target-Analysis Pistol",
      "damage": "2d8",
      "damageType": "Puncture",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 1.6,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 36,
        "max": 36
      },
      "ammoReserve": 288,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecathodai0000",
    "folder": "wpnfldrsecsemi01",
    "name": "Athodai",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Athodai.png",
    "system": {
      "description": "<p>Canon à main à propulsion dévastateur. Les éliminations par tir à la tête déclenchent <strong>Surcharge</strong>, octroyant une cadence de tir maximale et des munitions infinies pendant 1 round.</p><p><strong>Tir secondaire :</strong> Consomme l'intégralité du chargeur pour libérer un torrent thermique destructeur semblable à un lance-flammes.</p>",
      "type": "secondary",
      "subtype": "Heavy Handcannon",
      "damage": "2d10",
      "damageType": "Heat",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 32,
      "critMultiplier": 2,
      "statusChance": 8,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 24,
        "max": 24
      },
      "ammoReserve": 192,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": true,
      "altFireLabel": "Thermal Overcharge",
      "altFireIcon": "fas fa-fire",
      "altDamage": "3d8",
      "altDamageType": "Heat",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecsepulcrum00",
    "folder": "wpnfldrsecsemi01",
    "name": "Sepulcrum",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Sepulcrum.png",
    "system": {
      "description": "<p>Arme de poing lourde à double canon Entrati. Les tirs de précision à la tête chargent son système de guidage de roquettes.</p><p><strong>Tir secondaire :</strong> Verrouille jusqu'à 5 cibles et déclenche une salve de micromissiles thermoguidés infligeant 4d10 dégâts d'Explosion !</p>",
      "type": "secondary",
      "subtype": "Entrati Handcannon",
      "damage": "2d10",
      "damageType": "Heat",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2.2,
      "statusChance": 14,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 90,
        "max": 90
      },
      "ammoReserve": 720,
      "fireRate": 2,
      "reload": 4,
      "hasAltFire": true,
      "altFireLabel": "Guided Rockets",
      "altFireIcon": "fas fa-rocket",
      "altDamage": "4d10",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseczylok000000",
    "folder": "wpnfldrsecsemi01",
    "name": "Zylok",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Zylok.png",
    "system": {
      "description": "<p>Pistolet lourd Tenno à double canon et levier de sous-garde. Combine un rechargement rapide avec un tir simultané de deux cartouches percutantes à haute vélocité.</p>",
      "type": "secondary",
      "subtype": "Duplex Pistol",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 8,
      "critMultiplier": 2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 8,
        "max": 8
      },
      "ammoReserve": 64,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseclaetum00000",
    "folder": "wpnfldrsecsemi01",
    "name": "Laetum",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Laetum.png",
    "system": {
      "description": "<p>Arme de poing Incarnon d'origine Zariman. Les tirs de précision à la tête chargent sa métamorphose du Néant.</p><p><strong>Forme Incarnon (Tir secondaire) :</strong> Se transforme en un canon automatique lourd tirant des projectiles de plasma explosifs qui déchiquettent les blindages ennemis.</p>",
      "type": "secondary",
      "subtype": "Incarnon Pistol",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2.2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 12,
        "max": 12
      },
      "ammoReserve": 96,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecsicarus0000",
    "folder": "wpnfldrsecbrst01",
    "name": "Sicarus",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Sicarus.png",
    "system": {
      "description": "<p>Pistolet de service Tenno tirant des rafales contrôlées de 3 projectiles. Offre un excellent équilibre entre cadence de rafale et précision d'impact.</p>",
      "type": "secondary",
      "subtype": "Burst Pistol",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 6,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 15,
        "max": 15
      },
      "ammoReserve": 120,
      "fireRate": 4,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpseckraken00000",
    "folder": "wpnfldrsecbrst01",
    "name": "Kraken",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Kraken.png",
    "system": {
      "description": "<p>Pistolet lourd Grineer tirant des doubles coups saccadés. Son recul puissant compense une pénétration balistique brute appréciée des patrouilles de choc.</p>",
      "type": "secondary",
      "subtype": "Heavy Burst Pistol",
      "damage": "1d10",
      "damageType": "Impact",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 2,
      "statusChance": 13,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 14,
        "max": 14
      },
      "ammoReserve": 112,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecfuris000000",
    "folder": "wpnfldrsecauto01",
    "name": "Furis",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Furis.png",
    "system": {
      "description": "<p>Pistolet mitrailleur automatique Tenno réputé pour sa cadence de tir foudroyante. Idéal pour saturer les cibles à courte portée.</p>",
      "type": "secondary",
      "subtype": "Machine Pistol",
      "damage": "1d6",
      "damageType": "Puncture",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 2,
      "statusChance": 12,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 35,
        "max": 35
      },
      "ammoReserve": 280,
      "fireRate": 5,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecviper000000",
    "folder": "wpnfldrsecauto01",
    "name": "Viper",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Viper.png",
    "system": {
      "description": "<p>Pistolet mitrailleur compact Grineer à très haute vélocité de tir. Vide son chargeur en une fraction de seconde pour neutraliser les menaces immédiates.</p>",
      "type": "secondary",
      "subtype": "Machine Pistol",
      "damage": "1d6",
      "damageType": "Impact",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 1.5,
      "statusChance": 11,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 14,
        "max": 14
      },
      "ammoReserve": 112,
      "fireRate": 6,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "naramon"
        },
        "slot2": {
          "polarity": "none"
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
    "_id": "wpsecstubba00000",
    "folder": "wpnfldrsecauto01",
    "name": "Stubba",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Stubba.png",
    "system": {
      "description": "<p>Pistolet mitrailleur lourd des Goules Grineers. Tire des cartouches percutantes de gros calibre avec un recul stable et une cadence régulière.</p>",
      "type": "secondary",
      "subtype": "Submachine Gun",
      "damage": "1d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 1.9,
      "statusChance": 13,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 57,
        "max": 57
      },
      "ammoReserve": 456,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecvelox000000",
    "folder": "wpnfldrsecauto01",
    "name": "Velox",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Velox.png",
    "system": {
      "description": "<p>L'arme secondaire automatique emblématique de Protea. Décharge des munitions de haute précision avec une stabilité parfaite.</p><p><strong>Synergie emblématique (Protea) :</strong> Tirer avec le Velox confère 20% de chances d'économiser les munitions pour chaque balle tirée.</p>",
      "type": "secondary",
      "subtype": "High-Cadence Pistol",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 14,
      "critMultiplier": 1.8,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 62,
        "max": 62
      },
      "ammoReserve": 496,
      "fireRate": 6,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecquatz000000",
    "folder": "wpnfldrsecauto01",
    "name": "Quatz",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Quatz.png",
    "system": {
      "description": "<p>Pistolet compact Grineer à double mode de tir. Tire en rafales semi-automatiques de 4 coups avec zoom, ou en tir automatique saturant sans viser avec des décharges électriques étourdissantes.</p>",
      "type": "secondary",
      "subtype": "Hybrid Auto/Burst",
      "damage": "1d8",
      "damageType": "Electricity",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 13,
      "critMultiplier": 1.5,
      "statusChance": 27,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 72,
        "max": 72
      },
      "ammoReserve": 576,
      "fireRate": 6,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseccestra00000",
    "folder": "wpnfldrsecauto01",
    "name": "Cestra",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Cestra.png",
    "system": {
      "description": "<p>Pistolet mitrailleur Corpus à canon rotatif et capsules de micro-plasma. Accélère sa cadence de tir sous pression continue de la gâchette.</p>",
      "type": "secondary",
      "subtype": "Laser Gatling Pistol",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 6,
      "critMultiplier": 1.6,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 480,
      "fireRate": 4,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecazima000000",
    "folder": "wpnfldrsecauto01",
    "name": "Azima",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Azima.png",
    "system": {
      "description": "<p>Pistolet automatique Tenno doté d'une technologie modulaire avancée.</p><p><strong>Tir secondaire (Tourelle de chargeur) :</strong> Éjecte le chargeur restant qui s'ancre au sol et pivote à 360 degrés en arrosant la zone de tirs automatiques.</p>",
      "type": "secondary",
      "subtype": "Tactical SMG",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 16,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 75,
        "max": 75
      },
      "ammoReserve": 600,
      "fireRate": 5,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Turret Disc",
      "altFireIcon": "fas fa-record-vinyl",
      "altDamage": "1d8",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecatomos00000",
    "folder": "wpnfldrsecbeam01",
    "name": "Atomos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Atomos.png",
    "system": {
      "description": "<p>Projecteur thermique Grineer de poche. Projette un faisceau de plasma brûlant qui frappe sa cible initiale avant de ricocher sur plusieurs ennemis adjacents dans un enfer de flammes.</p>",
      "type": "secondary",
      "subtype": "Particle Beam",
      "damage": "1d10",
      "damageType": "Heat",
      "range": "18m (20 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 1.7,
      "statusChance": 21,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 70,
        "max": 70
      },
      "ammoReserve": 560,
      "fireRate": 4,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecnukor000000",
    "folder": "wpnfldrsecbeam01",
    "name": "Nukor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Nukor.png",
    "system": {
      "description": "<p>Arme micro-ondes expérimentale Grineer. Fait entrer les tissus cellulaires et les circuits électroniques en résonance hyperthermique, gonflant les membres des victimes jusqu'à éclatement.</p>",
      "type": "secondary",
      "subtype": "Microwave Beam",
      "damage": "1d10",
      "damageType": "Radiation",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 3,
      "critMultiplier": 4,
      "statusChance": 29,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 50,
        "max": 50
      },
      "ammoReserve": 400,
      "fireRate": 5,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecgammacor000",
    "folder": "wpnfldrsecbeam01",
    "name": "Gammacor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Gammacor.png",
    "system": {
      "description": "<p>Pistolet laser minier Corpus reconverti en arme de guerre. Émet un rayon d'énergie continue concentré vaporisant les blindages moléculaires.</p>",
      "type": "secondary",
      "subtype": "Cephalon Laser",
      "damage": "1d10",
      "damageType": "Magnetic",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 8,
      "critMultiplier": 1.8,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 480,
      "fireRate": 6,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpseccycron00000",
    "folder": "wpnfldrsecbeam01",
    "name": "Cycron",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Cycron.png",
    "system": {
      "description": "<p>Arme de poing à faisceau de plasma Corpus alimentée par une cellule à régénération continue. Élimine tout besoin de munitions physiques en rechargeant son énergie automatiquement.</p>",
      "type": "secondary",
      "subtype": "Plasma Cutter",
      "damage": "1d10",
      "damageType": "Heat",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 12,
      "critMultiplier": 1.8,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 40,
        "max": 40
      },
      "ammoReserve": 320,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecspectra0000",
    "folder": "wpnfldrsecbeam01",
    "name": "Spectra",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Spectra.png",
    "system": {
      "description": "<p>Outil de découpe chirurgicale laser Corpus adapté au combat tactique. Projette un rayon ultra-fin perforant les armures avec un fort potentiel d'hémorragie.</p>",
      "type": "secondary",
      "subtype": "Cutting Laser",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "22m (25 ft)",
      "equipped": false,
      "critChance": 14,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 480,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecocucor00000",
    "folder": "wpnfldrsecbeam01",
    "name": "Ocucor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Ocucor.png",
    "system": {
      "description": "<p>Pistolet Sentient bio-organique. Éliminer un ennemi génère des vrilles énergétiques secondaires qui traquent automatiquement les cibles proches jusqu'au rechargement.</p>",
      "type": "secondary",
      "subtype": "Sentient Beam",
      "damage": "1d10",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 1.8,
      "statusChance": 24,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 480,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseccatabolyst0",
    "folder": "wpnfldrsecbeam01",
    "name": "Catabolyst",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Catabolyst.png",
    "system": {
      "description": "<p>Pistolet biologique Infesté projetant un flot d'acide vivant corrosif.</p><p><strong>Rechargement caustique :</strong> Recharger jette la vessie acide usagée comme une grenade explosive infligeant des dégâts corrosifs massifs !</p>",
      "type": "secondary",
      "subtype": "Bio-Acid Blaster",
      "damage": "2d6",
      "damageType": "Corrosive",
      "range": "15m (20 ft)",
      "equipped": false,
      "critChance": 11,
      "critMultiplier": 2.9,
      "statusChance": 43,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 31,
        "max": 31
      },
      "ammoReserve": 248,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecembolist000",
    "folder": "wpnfldrsecbeam01",
    "name": "Embolist",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Embolist.png",
    "system": {
      "description": "<p>Projecteur biologique Infesté libérant un nuage dense de gaz toxique à courte portée qui asphyxie instantanément les cibles vivantes.</p>",
      "type": "secondary",
      "subtype": "Toxic Sprayer",
      "damage": "1d10",
      "damageType": "Toxin",
      "range": "12m (15 ft)",
      "equipped": false,
      "critChance": 3,
      "critMultiplier": 1.5,
      "statusChance": 41,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 33,
        "max": 33
      },
      "ammoReserve": 264,
      "fireRate": 4,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "naramon"
        },
        "slot2": {
          "polarity": "none"
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
    "_id": "wpsecaklato00000",
    "folder": "wpnfldrsecdual01",
    "name": "Aklato",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Aklato.png",
    "system": {
      "description": "<p>Paire de pistolets Lato maniés simultanément. Double la capacité du chargeur et la puissance de feu pour un style de tir acrobatique.</p>",
      "type": "secondary",
      "subtype": "Doubles pistolets",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 10,
      "critMultiplier": 1.8,
      "statusChance": 6,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 30,
        "max": 30
      },
      "ammoReserve": 240,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecaklex000000",
    "folder": "wpnfldrsecdual01",
    "name": "Aklex",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Aklex.png",
    "system": {
      "description": "<p>Deux pistolets lourds Lex maniés en akimbo. Une force d'arrêt cinétique monumentale capable d'abattre des blindés légers au détriment d'un recul substantiel.</p>",
      "type": "secondary",
      "subtype": "Dual Heavy Pistols",
      "damage": "2d8",
      "damageType": "Puncture",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 12,
        "max": 12
      },
      "ammoReserve": 96,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecakbolto0000",
    "folder": "wpnfldrsecdual01",
    "name": "Akbolto",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Akbolto.png",
    "system": {
      "description": "<p>Paire de pistolets Bolto tirant des salves de fléchettes perforantes pour épingler simultanément plusieurs ennemis aux cloisons.</p>",
      "type": "secondary",
      "subtype": "Dual Bolt Pistols",
      "damage": "1d10",
      "damageType": "Puncture",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2.4,
      "statusChance": 2,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 30,
        "max": 30
      },
      "ammoReserve": 240,
      "fireRate": 2,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecakvasto0000",
    "folder": "wpnfldrsecdual01",
    "name": "Akvasto",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Akvasto.png",
    "system": {
      "description": "<p>Deux revolvers Vasto maniés de concert. Cadence de tir et rechargement ultra-rapides pour les duellistes Tenno les plus aguerris.</p>",
      "type": "secondary",
      "subtype": "Dual Revolvers",
      "damage": "2d6",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 1.8,
      "statusChance": 12,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 12,
        "max": 12
      },
      "ammoReserve": 96,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecakmagnus000",
    "folder": "wpnfldrsecdual01",
    "name": "Akmagnus",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Akmagnus.png",
    "system": {
      "description": "<p>Doubles revolvers Magnus combinant 16 coups d'impact cinétique lourd pour saturer l'adversaire de tirs dévastateurs.</p>",
      "type": "secondary",
      "subtype": "Dual Revolvers",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 16,
        "max": 16
      },
      "ammoReserve": 128,
      "fireRate": 3,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecafuris00000",
    "folder": "wpnfldrsecdual01",
    "name": "Afuris",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Afuris.png",
    "system": {
      "description": "<p>Paire de pistolets mitrailleurs Furis délivrant un déluge continu de tirs automatiques à très haute vélocité.</p>",
      "type": "secondary",
      "subtype": "Dual Machine Pistols",
      "damage": "1d6",
      "damageType": "Puncture",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 2,
      "statusChance": 12,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 70,
        "max": 70
      },
      "ammoReserve": 560,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "naramon"
        },
        "slot2": {
          "polarity": "none"
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
    "_id": "wpsectwinvipers0",
    "folder": "wpnfldrsecdual01",
    "name": "Twin Vipers",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TwinVipers.png",
    "system": {
      "description": "<p>Doubles pistolets mitrailleurs Viper. Affichent la cadence de tir la plus fulgurante du système, vidant deux chargeurs en un battement de cil.</p>",
      "type": "secondary",
      "subtype": "Dual Machine Pistols",
      "damage": "1d6",
      "damageType": "Impact",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 1.5,
      "statusChance": 11,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 28,
        "max": 28
      },
      "ammoReserve": 224,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecakstiletto0",
    "folder": "wpnfldrsecdual01",
    "name": "Akstiletto",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Akstiletto.png",
    "system": {
      "description": "<p>Paire de pistolets mitrailleurs Tenno au design racé. Réputés pour leur précision chirurgicale, leur recul quasi inexistant et leur rechargement fluide.</p>",
      "type": "secondary",
      "subtype": "Dual SMGs",
      "damage": "1d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 1.8,
      "statusChance": 18,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 28,
        "max": 28
      },
      "ammoReserve": 224,
      "fireRate": 5,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecaksomati000",
    "folder": "wpnfldrsecdual01",
    "name": "Aksomati",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Aksomati.png",
    "system": {
      "description": "<p>Paire de pistolets automatiques compacts équipés de magasins à tambour rotatifs Somati, délivrant une cadence de feu progressive dévastatrice.</p>",
      "type": "secondary",
      "subtype": "Dual Spooling SMGs",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 3,
      "statusChance": 8,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 70,
        "max": 70
      },
      "ammoReserve": 560,
      "fireRate": 6,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "naramon"
        },
        "slot2": {
          "polarity": "none"
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
    "_id": "wpsecakjagara000",
    "folder": "wpnfldrsecdual01",
    "name": "Akjagara",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Akjagara.png",
    "system": {
      "description": "<p>Pistolets doubles Tenno équipés de lames de parade intégrées. Tirent des doubles cartouches de grenaille perforantes et lacérantes.</p>",
      "type": "secondary",
      "subtype": "Dual Bladed Pistols",
      "damage": "2d6",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 6,
      "critMultiplier": 2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 36,
        "max": 36
      },
      "ammoReserve": 288,
      "fireRate": 5,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "naramon"
        },
        "slot2": {
          "polarity": "none"
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
    "_id": "wpsectwingrakata",
    "folder": "wpnfldrsecdual01",
    "name": "Twin Grakatas",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TwinGrakatas.png",
    "system": {
      "description": "<p>Deux mitraillettes d'assaut Grakata maniées en même temps par un Tenno. Une puissance de saturation frénétique déchaînant un ouragan de plomb.</p>",
      "type": "secondary",
      "subtype": "Dual Assault Carbines",
      "damage": "1d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.7,
      "statusChance": 17,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 60,
        "max": 60
      },
      "ammoReserve": 480,
      "fireRate": 6,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsectwingremlin",
    "folder": "wpnfldrsecdual01",
    "name": "Twin Gremlins",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TwinGremlins.png",
    "system": {
      "description": "<p>Paire de cloueuses pneumatiques lourdes Grineers modifiées pour le combat, propulsant de gros clous industriels avec une force perforante extrême.</p>",
      "type": "secondary",
      "subtype": "Dual Nailguns",
      "damage": "1d10",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 15,
      "critMultiplier": 1.5,
      "statusChance": 15,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 30,
        "max": 30
      },
      "ammoReserve": 240,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsectwinrogga00",
    "folder": "wpnfldrsecdual01",
    "name": "Twin Rogga",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TwinRogga.png",
    "system": {
      "description": "<p>Paire de pistolets à double canon scié Grineers. Déchargent de violentes gerbes de chevrotine à bout portant avec une force de recul titanesque.</p>",
      "type": "secondary",
      "subtype": "Dual Hand Cannons",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "15m (20 ft)",
      "equipped": false,
      "critChance": 10,
      "critMultiplier": 2,
      "statusChance": 7,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 2,
        "max": 2
      },
      "ammoReserve": 16,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsectwinkohmak0",
    "folder": "wpnfldrsecdual01",
    "name": "Twin Kohmak",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TwinKohmak.png",
    "system": {
      "description": "<p>Doubles pistolets automatiques Grineers à dispersion de projectiles. Leur cadence s'accélère à chaque tir successif pour faucher des escouades entières.</p>",
      "type": "secondary",
      "subtype": "Dual Spooling Shotguns",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 11,
      "critMultiplier": 2,
      "statusChance": 69,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 80,
        "max": 80
      },
      "ammoReserve": 640,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecakzani00000",
    "folder": "wpnfldrsecdual01",
    "name": "Akzani",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Akzani.png",
    "system": {
      "description": "<p>Paire de pistolets automatiques ultra-véloces emblématiques de Mirage. Conçus pour dispenser une pluie de balles éclatantes avec une grâce acrobatique.</p>",
      "type": "secondary",
      "subtype": "Dual Machine Pistols",
      "damage": "1d6",
      "damageType": "Puncture",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 14,
      "critMultiplier": 2,
      "statusChance": 14,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 100,
        "max": 100
      },
      "ammoReserve": 800,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecakarius0000",
    "folder": "wpnfldrsecdual01",
    "name": "Akarius",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Akarius.png",
    "system": {
      "description": "<p>Les doubles lance-roquettes de poignet emblématiques de Gauss. Tirent des micromissiles à tête chercheuse équipés d'ogives thermiques explosives.</p><p><strong>Synergie emblématique (Gauss) :</strong> La vitesse de rechargement est considérablement accrue lorsque Gauss sprinte ou court.</p>",
      "type": "secondary",
      "subtype": "Dual Rocket Launchers",
      "damage": "2d10",
      "damageType": "Blast",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 6,
      "critMultiplier": 1.8,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 80,
      "fireRate": 2,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecdualtoxocys",
    "folder": "wpnfldrsecdual01",
    "name": "Dual Toxocyst",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/DualToxocyst.png",
    "system": {
      "description": "<p>Paire de pistolets biologiques Infestés vivants. Réussir un tir de précision à la tête excite leurs tissus biologiques, activant une frénésie temporaire avec recul nul et cadence maximale.</p>",
      "type": "secondary",
      "subtype": "Infested Biopistols",
      "damage": "2d6",
      "damageType": "Toxin",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 2,
      "statusChance": 37,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 12,
        "max": 12
      },
      "ammoReserve": 96,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecdualcestra0",
    "folder": "wpnfldrsecdual01",
    "name": "Dual Cestra",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/DualCestra.png",
    "system": {
      "description": "<p>Deux pistolets rotatifs Corpus à capsules de plasma maniés en duo. Déploient un barrage de tirs d'énergie aveuglant sous feu nourri.</p>",
      "type": "secondary",
      "subtype": "Dual Rotary Lasers",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 6,
      "critMultiplier": 1.6,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 120,
        "max": 120
      },
      "ammoReserve": 960,
      "fireRate": 6,
      "reload": 4,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecakbronco000",
    "folder": "wpnfldrsecdual01",
    "name": "Akbronco",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Akbronco.png",
    "system": {
      "description": "<p>Deux pistolets à pompe Bronco maniés simultanément. Démolissent les formations ennemies à bout portant sous deux gerbes de plombs massives.</p>",
      "type": "secondary",
      "subtype": "Dual Hand Shotguns",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "15m (20 ft)",
      "equipped": false,
      "critChance": 6,
      "critMultiplier": 2,
      "statusChance": 3,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 4,
        "max": 4
      },
      "ammoReserve": 32,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecbronco00000",
    "folder": "wpnfldrsecshot01",
    "name": "Bronco",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Bronco.png",
    "system": {
      "description": "<p>Le fusil à pompe de poing traditionnel des Tenno. Conçu pour stopper net les charges d'infanterie par un impact de grenaille surpuissant.</p>",
      "type": "secondary",
      "subtype": "Hand Shotgun",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "15m (20 ft)",
      "equipped": false,
      "critChance": 6,
      "critMultiplier": 2,
      "statusChance": 9,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 2,
        "max": 2
      },
      "ammoReserve": 16,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecbrakk000000",
    "folder": "wpnfldrsecshot01",
    "name": "Brakk",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Brakk.png",
    "system": {
      "description": "<p>Pistolet de démolition Grineer de réputation légendaire, autrefois réservé aux Chasseurs des Trois Grustrag. Dégâts d'Impact et de dispersion exceptionnels.</p>",
      "type": "secondary",
      "subtype": "Heavy Hand Cannon",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "15m (20 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2,
      "statusChance": 5,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 5,
        "max": 5
      },
      "ammoReserve": 40,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecpyrana00000",
    "folder": "wpnfldrsecshot01",
    "name": "Pyrana",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Pyrana.png",
    "system": {
      "description": "<p>Pistolet automatique à canon rayé Tenno tirant des gerbes de grenaille tranchante à haute cadence de tir.</p>",
      "type": "secondary",
      "subtype": "Auto-Shotgun Pistol",
      "damage": "2d8",
      "damageType": "Slash",
      "range": "15m (20 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 3,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 80,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecdetron00000",
    "folder": "wpnfldrsecshot01",
    "name": "Detron",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Detron.png",
    "system": {
      "description": "<p>Pistolet à dispersion Corpus tirant des volées de fragments de plasma surchauffés dotés d'une dispersion conique meurtrière.</p>",
      "type": "secondary",
      "subtype": "Radiation Hand Shotgun",
      "damage": "2d8",
      "damageType": "Radiation",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 4,
      "critMultiplier": 1.5,
      "statusChance": 13,
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
      "currentMode": "secondary",
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
    "_id": "wpseckohmak00000",
    "folder": "wpnfldrsecshot01",
    "name": "Kohmak",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Kohmak.png",
    "system": {
      "description": "<p>Pistolet lourd Grineer utilisant le système de découpe rotatif du Kohm. Chaque tir successif augmente le nombre de plombs projetés par coup.</p>",
      "type": "secondary",
      "subtype": "Spooling Shotgun Pistol",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 11,
      "critMultiplier": 2,
      "statusChance": 69,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 40,
        "max": 40
      },
      "ammoReserve": 320,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpseckunai000000",
    "folder": "wpnfldrsecthrw01",
    "name": "Kunai",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Kunai.png",
    "system": {
      "description": "<p>Dagues de jet équilibrées traditionnelles des Tenno. Silencieuses et rapides, elles transpercent les armures légères sans révéler la position du tireur.</p>",
      "type": "secondary",
      "subtype": "Throwing Daggers",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 8,
      "critMultiplier": 1.6,
      "statusChance": 8,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
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
      "currentMode": "secondary",
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
    "_id": "wpsechikou000000",
    "folder": "wpnfldrsecthrw01",
    "name": "Hikou",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Hikou.png",
    "system": {
      "description": "<p>Étoiles de jet Tenno ultra-légères projetées à une vitesse prodigieuse. Idéales pour saturer rapidement une zone de pointes empoisonnées.</p>",
      "type": "secondary",
      "subtype": "Throwing Stars",
      "damage": "1d6",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 4,
      "critMultiplier": 1.6,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 160,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecspira000000",
    "folder": "wpnfldrsecthrw01",
    "name": "Spira",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Spira.png",
    "system": {
      "description": "<p>Pointes de jet torsadées chirurgicales des Tenno. Leur géométrie hélicoïdale pénètre les défenses blindées avec une précision et un potentiel critique remarquables.</p>",
      "type": "secondary",
      "subtype": "Curved Throwing Knives",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 30,
      "critMultiplier": 2,
      "statusChance": 8,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 10,
        "max": 10
      },
      "ammoReserve": 80,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseccastanas000",
    "folder": "wpnfldrsecthrw01",
    "name": "Castanas",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Castanas.png",
    "system": {
      "description": "<p>Pièges de jet électriques télécommandés des Tenno. Se fixent aux parois ou aux ennemis avant d'être déclenchés à distance pour libérer de violents arcs électriques.</p>",
      "type": "secondary",
      "subtype": "Shock Traps",
      "damage": "2d6",
      "damageType": "Electricity",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 8,
      "critMultiplier": 1.5,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 2,
        "max": 2
      },
      "ammoReserve": 16,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Remote Detonation",
      "altFireIcon": "fas fa-bolt",
      "altDamage": "2d8",
      "altDamageType": "Electricity",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsectalons00000",
    "folder": "wpnfldrsecthrw01",
    "name": "Talons",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Talons.png",
    "system": {
      "description": "<p>Bombes de jet tactiques adhésives des Tenno. Déclenchées à distance pour libérer un nuage de fragments tranchants hautement létaux.</p>",
      "type": "secondary",
      "subtype": "Shrapnel Traps",
      "damage": "2d8",
      "damageType": "Blast",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 22,
      "critMultiplier": 2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 4,
        "max": 4
      },
      "ammoReserve": 32,
      "fireRate": 2,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Detonate Shrapnel",
      "altFireIcon": "fas fa-bomb",
      "altDamage": "3d8",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecpox00000000",
    "folder": "wpnfldrsecthrw01",
    "name": "Pox",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Pox.png",
    "system": {
      "description": "<p>Sacs biologiques Infestés projetés à la main. Éclatent à l'impact en libérant un nuage persistant de bio-toxines et de vapeurs corrosives.</p>",
      "type": "secondary",
      "subtype": "Bio-Spores",
      "damage": "1d10",
      "damageType": "Toxin",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 1,
      "critMultiplier": 2,
      "statusChance": 35,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 4,
        "max": 4
      },
      "ammoReserve": 32,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecfusilai0000",
    "folder": "wpnfldrsecthrw01",
    "name": "Fusilai",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Fusilai.png",
    "system": {
      "description": "<p>Couteaux de jet en verre trempé emblématiques de Gara. Tranchants comme des miroirs brisés.</p><p><strong>Tir secondaire :</strong> Projette l'ensemble des lames restantes d'un seul revers en éventail horizontal.</p>",
      "type": "secondary",
      "subtype": "Glass Darts",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 1.7,
      "statusChance": 29,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 6,
        "max": 6
      },
      "ammoReserve": 48,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Triple Fan Throw",
      "altFireIcon": "fas fa-fan",
      "altDamage": "2d8",
      "altDamageType": "Slash",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpseccantare0000",
    "folder": "wpnfldrsecthrw01",
    "name": "Cantare",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Cantare.png",
    "system": {
      "description": "<p>Dagues de jet musicales emblématiques de Jade. Se logent dans les surfaces ou les cibles avant de vibrer en harmonie.</p><p><strong>Harmonie de rappel (Rechargement) :</strong> Rappeler les dagues les fait traverser tous les ennemis sur leur trajectoire retour avec des dégâts critiques accrus !</p>",
      "type": "secondary",
      "subtype": "Sonic Feathers",
      "damage": "1d8",
      "damageType": "Slash",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 22,
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
      "currentMode": "secondary",
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
    "_id": "wpsecaegrit00000",
    "folder": "wpnfldrsecthrw01",
    "name": "Aegrit",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Aegrit.png",
    "system": {
      "description": "<p>Bombes de démolition manuelles lancées à bout de bras. Munies d'ogives explosives colossales déclenchées à distance par détonateur manuel.</p>",
      "type": "secondary",
      "subtype": "Sticky Cluster Bombs",
      "damage": "3d10",
      "damageType": "Blast",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 37,
      "critMultiplier": 1.9,
      "statusChance": 19,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 2,
        "max": 2
      },
      "ammoReserve": 16,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Cluster Detonation",
      "altFireIcon": "fas fa-bomb",
      "altDamage": "3d10",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecsonicor0000",
    "folder": "wpnfldrsecwrst01",
    "name": "Sonicor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Sonicor.png",
    "system": {
      "description": "<p>Canon d'ondes soniques Corpus monté sur le poignet. Projette des impulsions acoustiques lourdes qui font voler les ennemis dans les airs à l'impact.</p>",
      "type": "secondary",
      "subtype": "Acoustic Cannon",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 0,
      "critMultiplier": 1,
      "statusChance": 0,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 15,
        "max": 15
      },
      "ammoReserve": 120,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": true,
      "altFireLabel": "Acoustic Shockwave",
      "altFireIcon": "fas fa-volume-up",
      "altDamage": "2d8",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecepitaph0000",
    "folder": "wpnfldrsecspec01",
    "name": "Epitaph",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Epitaph.png",
    "system": {
      "description": "<p>L'arme de poing de poignet emblématique de Sevagoth. Tire des éclats d'énergie froids comme la tombe.</p><p><strong>Tir non chargé :</strong> Projette une vague d'énergie glaciale avec 100% de chances d'infliger un effet de statut Glace (Ralentissement de zone).</p><p><strong>Tir chargé :</strong> Tire un carreau spectral perforant infligeant de monstrueux dégâts d'Impact et de perforation avec un potentiel critique démesuré.</p>",
      "type": "secondary",
      "subtype": "Wrist Crossbow",
      "damage": "1d10",
      "damageType": "Cold",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 48,
      "critMultiplier": 2.6,
      "statusChance": 4,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 8,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Charged Snipe",
      "altFireIcon": "fas fa-crosshairs",
      "altDamage": "3d10",
      "altDamageType": "Puncture",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseckompressa00",
    "folder": "wpnfldrsecwrst01",
    "name": "Kompressa",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Kompressa.png",
    "system": {
      "description": "<p>L'arme de poing emblématique de Yareli. Tire des rafales de bulles d'eau pressurisées hyper-réactives qui explosent après un court instant en infligeant des dégâts Viraux de zone.</p>",
      "type": "secondary",
      "subtype": "Bubble Launcher",
      "damage": "2d8",
      "damageType": "Viral",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 6,
      "critMultiplier": 1.8,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 12,
        "max": 12
      },
      "ammoReserve": 96,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpseconos0000000",
    "folder": "wpnfldrsecwrst01",
    "name": "Onos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Onos.png",
    "system": {
      "description": "<p>Arme de poing de poignet d'origine bio-Sentiente d'Albrecht Entrati.</p><p><strong>Forme Incarnon :</strong> Se transforme en un canon thermique lourd projetant une onde de plasma brûlante qui calcine tout sur sa trajectoire.</p>",
      "type": "secondary",
      "subtype": "Wrist Bio-Cannon",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.4,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 160,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": true,
      "altFireLabel": "Incineration Beam",
      "altFireIcon": "fas fa-sun",
      "altDamage": "3d10",
      "altDamageType": "Heat",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecstaticor000",
    "folder": "wpnfldrsecwrst01",
    "name": "Staticor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Staticor.png",
    "system": {
      "description": "<p>Gantelets énergétiques projetant des orbes de plasma électrique à accumulation de charge. Peuvent être chargés pour libérer une détonation explosive de zone.</p>",
      "type": "secondary",
      "subtype": "Energy Gauntlets",
      "damage": "2d8",
      "damageType": "Radiation",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 14,
      "critMultiplier": 2.2,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 12,
        "max": 12
      },
      "ammoReserve": 96,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": true,
      "altFireLabel": "Charged Plasma Burst",
      "altFireIcon": "fas fa-atom",
      "altDamage": "3d10",
      "altDamageType": "Radiation",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecangstrum000",
    "folder": "wpnfldrsecwrst01",
    "name": "Angstrum",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Angstrum.png",
    "system": {
      "description": "<p>Lance-roquettes de poche compact des Corpus. Peut charger plusieurs micro-roquettes simultanément pour les expédier en une volée explosive destructrice.</p>",
      "type": "secondary",
      "subtype": "Pocket Rocket Launcher",
      "damage": "3d8",
      "damageType": "Blast",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 2,
      "statusChance": 22,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 1,
        "max": 1
      },
      "ammoReserve": 8,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": true,
      "altFireLabel": "Rocket Barrage",
      "altFireIcon": "fas fa-rocket",
      "altDamage": "4d8",
      "altDamageType": "Blast",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "vazarin"
        },
        "slot2": {
          "polarity": "none"
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
    "_id": "wpseckulstar0000",
    "folder": "wpnfldrsecwrst01",
    "name": "Kulstar",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Kulstar.png",
    "system": {
      "description": "<p>Lance-roquettes lourd Grineer de poing. Chaque roquette tirée se fragmente à l'impact en trois sous-munitions secondaires explosives.</p>",
      "type": "secondary",
      "subtype": "Cluster Rocket Launcher",
      "damage": "3d8",
      "damageType": "Blast",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 17,
      "critMultiplier": 2.3,
      "statusChance": 19,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 3,
        "max": 3
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
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpseccyanex00000",
    "folder": "wpnfldrsecspec01",
    "name": "Cyanex",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Cyanex.png",
    "system": {
      "description": "<p>Arme de poing hybride Corpus-Sentient tirant des aiguilles énergétiques autoguidées qui rebondissent sur les parois pour converger vers les cibles.</p>",
      "type": "secondary",
      "subtype": "Gas Needle Pistol",
      "damage": "1d8",
      "damageType": "Gas",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 8,
      "critMultiplier": 1.4,
      "statusChance": 32,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 11,
        "max": 11
      },
      "ammoReserve": 88,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": true,
      "altFireLabel": "Tracking Dump",
      "altFireIcon": "fas fa-random",
      "altDamage": "2d8",
      "altDamageType": "Gas",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseczakti000000",
    "folder": "wpnfldrsecspec01",
    "name": "Zakti",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Zakti.png",
    "system": {
      "description": "<p>Pistolet à fléchettes de gaz Tenno. Les fléchettes s'incrustent dans les ennemis avant de libérer un nuage de gaz toxique incapacitant ouvrant les cibles aux coups de grâce.</p>",
      "type": "secondary",
      "subtype": "Gas Dart Pistol",
      "damage": "1d8",
      "damageType": "Gas",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 2,
      "critMultiplier": 1.5,
      "statusChance": 20,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 3,
        "max": 3
      },
      "ammoReserve": 24,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseczymos000000",
    "folder": "wpnfldrsecspec01",
    "name": "Zymos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Zymos.png",
    "system": {
      "description": "<p>Arme de poing parasitaire Infestée. Les tirs de tête enfouissent des larves excavatrices dans le crâne de la cible, qui finissent par exploser en projetant des spores téléguidées.</p>",
      "type": "secondary",
      "subtype": "Burrowing Spore Gun",
      "damage": "2d6",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 2.3,
      "statusChance": 30,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 17,
        "max": 17
      },
      "ammoReserve": 136,
      "fireRate": 1,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecstug0000000",
    "folder": "wpnfldrsecspec01",
    "name": "Stug",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Stug.png",
    "system": {
      "description": "<p>Pistolet à fluide Grineer projetant des amas de gel caustique corrosif qui s'agglomèrent en une masse instable avant d'exploser violemment.</p>",
      "type": "secondary",
      "subtype": "Corrosive Sludge Cannon",
      "damage": "1d10",
      "damageType": "Corrosive",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 1.5,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 20,
        "max": 20
      },
      "ammoReserve": 160,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsecacrid000000",
    "folder": "wpnfldrsecspec01",
    "name": "Acrid",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Acrid.png",
    "system": {
      "description": "<p>Pistolet à aiguilles d'acide Grineer. Injecte des doses massives de toxines neurotoxiques qui rongent la chair sur la durée sans faiblir.</p>",
      "type": "secondary",
      "subtype": "Neuro-Toxin Needle Gun",
      "damage": "1d8",
      "damageType": "Toxin",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 5,
      "critMultiplier": 2,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 15,
        "max": 15
      },
      "ammoReserve": 120,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecgrimoire000",
    "folder": "wpnfldrsecspec01",
    "name": "Grimoire",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Grimoire.png",
    "system": {
      "description": "<p>Le grimoire ésotérique d'Albrecht Entrati canalisant les mystères du Néant. Tire des carreaux de foudre mystique sans consommer de munitions.</p><p><strong>Tir secondaire (Orbe du Néant) :</strong> Libère une sphère instable du Néant qui traverse le champ de bataille en foudroyant tous les ennemis proches.</p>",
      "type": "secondary",
      "subtype": "Void Tome",
      "damage": "2d8",
      "damageType": "Electricity",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 2,
      "statusChance": 26,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 15,
        "max": 15
      },
      "ammoReserve": 120,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": true,
      "altFireLabel": "Void Lightning Orb",
      "altFireIcon": "fas fa-book-dead",
      "altDamage": "3d8",
      "altDamageType": "Electricity",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsechystrix0000",
    "folder": "wpnfldrsecspec01",
    "name": "Hystrix",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Hystrix.png",
    "system": {
      "description": "<p>Le pistolet à dards élémentaires emblématique de Khora.</p><p><strong>Tir secondaire (Changement d'élément) :</strong> Permet d'alterner instantanément entre des aiguilles de Feu, Glace, Électricité ou Toxine, garantissant un effet de statut à chaque tir !</p>",
      "type": "secondary",
      "subtype": "Elemental Quill Pistol",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 24,
      "critMultiplier": 2.2,
      "statusChance": 10,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 16,
        "max": 16
      },
      "ammoReserve": 128,
      "fireRate": 4,
      "reload": 2,
      "hasAltFire": true,
      "altFireLabel": "Cycle Element",
      "altFireIcon": "fas fa-sync",
      "altDamage": "1d8",
      "altDamageType": "Heat",
      "canSwapMode": false,
      "currentMode": "secondary",
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
          "polarity": "none"
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
    "_id": "wpsece91dc747260",
    "folder": "wpnfldrsecstal01",
    "name": "Despair",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Despair.png",
    "system": {
      "description": "<p>Les dagues de jet d'assassinat emblématiques du Stalker. Forgées dans des alliages spectraux sombres, leurs pointes effilées percent les armures les plus denses.</p>",
      "type": "secondary",
      "subtype": "Throwing Daggers",
      "damage": "1d10",
      "damageType": "Puncture",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 16,
      "critMultiplier": 1.6,
      "statusChance": 16,
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
      "currentMode": "secondary",
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
    "_id": "wpse4ece92c1a635",
    "folder": "wpnfldrsecsemi01",
    "name": "Ballistica",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Ballistica.png",
    "system": {
      "description": "<p>Arbalète de poignet Tenno polyvalente. Tire des rafales de 4 carreaux en tir rapide, ou un unique carreau puissant et précis en tir chargé.</p>",
      "type": "secondary",
      "subtype": "Hand Crossbow",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 3,
      "critMultiplier": 1.5,
      "statusChance": 3,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 16,
        "max": 16
      },
      "ammoReserve": 96,
      "fireRate": 2,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpse9bb2897619ac",
    "folder": "wpnfldrsecspec01",
    "name": "Tysis",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/Tysis.png",
    "system": {
      "description": "<p>Arme de poing biologique Infestée en forme de dard vivant. Projette des spicules imprégnés d'un venin hautement corrosif avec 50% de chances de statut.</p>",
      "type": "secondary",
      "subtype": "Dart Pistol",
      "damage": "1d8",
      "damageType": "Corrosive",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 3,
      "critMultiplier": 1.5,
      "statusChance": 50,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 11,
        "max": 11
      },
      "ammoReserve": 66,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseb22d765d5bfb",
    "folder": "wpnfldrseckuva01",
    "name": "Kuva Brakk",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/KuvaBrakk.png",
    "system": {
      "description": "<p>Version Kuva royale du canon de poing Brakk. Bénéficie d'une cadence de tir accrue, d'un chargeur étendu et de dégâts élémentaires Kuva bonus.</p>",
      "type": "secondary",
      "subtype": "Kuva Hand Cannon",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "15m (20 ft)",
      "equipped": false,
      "critChance": 29,
      "critMultiplier": 2,
      "statusChance": 11,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 11,
        "max": 11
      },
      "ammoReserve": 66,
      "fireRate": 3,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpse2bc138a66d83",
    "folder": "wpnfldrseckuva01",
    "name": "Kuva Kraken",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/KuvaKraken.png",
    "system": {
      "description": "<p>Version Kuva surpuissante du pistolet Kraken. Son tir secondaire décharge instantanément l'intégralité du chargeur dans une rafale frénétique.</p>",
      "type": "secondary",
      "subtype": "Kuva Burst Pistol",
      "damage": "2d8",
      "damageType": "Impact",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 21,
      "critMultiplier": 2.3,
      "statusChance": 29,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 21,
        "max": 21
      },
      "ammoReserve": 126,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpse61735d3feff3",
    "folder": "wpnfldrseckuva01",
    "name": "Kuva Nukor",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/KuvaNukor.png",
    "system": {
      "description": "<p>L'arme secondaire la plus redoutée des Liches Kuva. Son faisceau à micro-ondes irradie jusqu'à 4 cibles simultanément avec un multiplicateur critique monstrueux de 5,0x !</p>",
      "type": "secondary",
      "subtype": "Kuva Microwave Beam",
      "damage": "1d10",
      "damageType": "Radiation",
      "range": "28m (30 ft)",
      "equipped": false,
      "critChance": 7,
      "critMultiplier": 5,
      "statusChance": 50,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 77,
        "max": 77
      },
      "ammoReserve": 462,
      "fireRate": 5,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpse203173d3d8e6",
    "folder": "wpnfldrseckuva01",
    "name": "Kuva Seer",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/KuvaSeer.png",
    "system": {
      "description": "<p>Version perfectionnée du pistolet du Capitaine Vor par le sang Kuva. Ses projectiles corrosifs explosent à l'impact en libérant des sous-détonations secondaires.</p>",
      "type": "secondary",
      "subtype": "Kuva Zoom Pistol",
      "damage": "2d10",
      "damageType": "Corrosive",
      "range": "45m (50 ft)",
      "equipped": false,
      "critChance": 21,
      "critMultiplier": 1.9,
      "statusChance": 33,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 9,
        "max": 9
      },
      "ammoReserve": 54,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpse7e5c5d2008fd",
    "folder": "wpnfldrseckuva01",
    "name": "Kuva Twin Stubbas",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/KuvaTwinStubbas.png",
    "system": {
      "description": "<p>Paire de pistolets mitrailleurs lourds Kuva dotés d'une capacité de chargeur colossale et d'une cadence de feu implacable.</p>",
      "type": "secondary",
      "subtype": "Kuva Dual SMGs",
      "damage": "1d8",
      "damageType": "Impact",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 23,
      "critMultiplier": 1.9,
      "statusChance": 31,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 114,
        "max": 114
      },
      "ammoReserve": 684,
      "fireRate": 5,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpse9e578e62b9bf",
    "folder": "wpnfldrsectene01",
    "name": "Tenet Cycron",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TenetCycron.png",
    "system": {
      "description": "<p>Version corporative perfectionnée du Cycron. Son faisceau de plasma énergétique ricoche désormais sur deux ennemis adjacents avec une recharge de batterie accélérée.</p>",
      "type": "secondary",
      "subtype": "Tenet Plasma Beam",
      "damage": "1d10",
      "damageType": "Heat",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 20,
      "critMultiplier": 1.8,
      "statusChance": 40,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 40,
        "max": 40
      },
      "ammoReserve": 240,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpseaa7f94e83759",
    "folder": "wpnfldrsectene01",
    "name": "Tenet Detron",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TenetDetron.png",
    "system": {
      "description": "<p>Version d'élite Tenet du Detron de Parvos Granum. Son tir secondaire permet de décharger tout le magasin en une seule salve d'énergie compacte.</p>",
      "type": "secondary",
      "subtype": "Tenet Hand Shotgun",
      "damage": "2d10",
      "damageType": "Radiation",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 18,
      "critMultiplier": 2,
      "statusChance": 10,
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
      "currentMode": "secondary",
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
    "_id": "wpsece5b95c433cb",
    "folder": "wpnfldrsectene01",
    "name": "Tenet Diplos",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TenetDiplos.png",
    "system": {
      "description": "<p>Paire de pistolets automatiques Tenet haute technologie. Viser active un système de ciblage automatique verrouillant jusqu'à 8 cibles pour des micromissiles guidés.</p>",
      "type": "secondary",
      "subtype": "Tenet Dual SMGs",
      "damage": "1d8",
      "damageType": "Puncture",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 36,
      "critMultiplier": 2.2,
      "statusChance": 14,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 92,
        "max": 92
      },
      "ammoReserve": 552,
      "fireRate": 5,
      "reload": 3,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpse526a6b3a8150",
    "folder": "wpnfldrsectene01",
    "name": "Tenet Plinx",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TenetPlinx.png",
    "system": {
      "description": "<p>Version optimisée pour les dirigeants Corpus du pistolet Plinx. Les tirs consécutifs chargent un projectile secondaire attirant les ennemis dans un vortex avant d'imploser.</p>",
      "type": "secondary",
      "subtype": "Tenet Battery Pistol",
      "damage": "2d8",
      "damageType": "Puncture",
      "range": "35m (40 ft)",
      "equipped": false,
      "critChance": 44,
      "critMultiplier": 3,
      "statusChance": 12,
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
      "currentMode": "secondary",
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
    "_id": "wpse912cc9a29e73",
    "folder": "wpnfldrsectene01",
    "name": "Tenet Spirex",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/TenetSpirex.png",
    "system": {
      "description": "<p>Pistolet lourd Tenet tirant des projectiles de plasma percutants. Chaque coup réussi augmente la vitesse de rechargement.</p>",
      "type": "secondary",
      "subtype": "Tenet Rail-Pistol",
      "damage": "2d10",
      "damageType": "Impact",
      "range": "40m (45 ft)",
      "equipped": false,
      "critChance": 26,
      "critMultiplier": 2.4,
      "statusChance": 40,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 8,
        "max": 8
      },
      "ammoReserve": 48,
      "fireRate": 1,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsea61829d77896",
    "folder": "wpnfldrseccoda01",
    "name": "Coda Catabolyst",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/CodaCatabolyst.png",
    "system": {
      "description": "<p>Version perfectionnée par les Liches Coda du pistolet bio-acide. La poche corrosive expulsée au rechargement génère une onde de choc virulente décuplée.</p>",
      "type": "secondary",
      "subtype": "Coda Bio-Acid Blaster",
      "damage": "2d8",
      "damageType": "Corrosive",
      "range": "20m (25 ft)",
      "equipped": false,
      "critChance": 11,
      "critMultiplier": 2.9,
      "statusChance": 50,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 37,
        "max": 37
      },
      "ammoReserve": 222,
      "fireRate": 6,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsecb194df854f9",
    "folder": "wpnfldrseccoda01",
    "name": "Coda Pox",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/CodaPox.png",
    "system": {
      "description": "<p>Capsules de spores Infestées issues de l'arsenal Coda de 1999. Génèrent des zones de contagion persistantes qui érodent les défenses des survivants.</p>",
      "type": "secondary",
      "subtype": "Coda Spore Pods",
      "damage": "1d10",
      "damageType": "Toxin",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 10,
      "critMultiplier": 2.2,
      "statusChance": 45,
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
      "currentMode": "secondary",
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
    "_id": "wpse7518ccb3009a",
    "folder": "wpnfldrseccoda01",
    "name": "Coda Tysis",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/CodaTysis.png",
    "system": {
      "description": "<p>Dard parasitaire Coda hautement mutant. Ses spicules inoculent des agents pathogènes neuro-destructeurs dévorant les blindages moléculaires.</p>",
      "type": "secondary",
      "subtype": "Coda Bio-Needler",
      "damage": "1d10",
      "damageType": "Corrosive",
      "range": "30m (35 ft)",
      "equipped": false,
      "critChance": 13,
      "critMultiplier": 2,
      "statusChance": 50,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 18,
        "max": 18
      },
      "ammoReserve": 108,
      "fireRate": 1,
      "reload": 1,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
    "_id": "wpsef6a0efa3e1fc",
    "folder": "wpnfldrseccoda01",
    "name": "Dual Coda Torxica",
    "type": "weapon",
    "img": "systems/warframe-ttrpg/asset/Weapon/secondary/DualCodaTorxica.png",
    "system": {
      "description": "<p>Doubles armes de poing automatiques Coda de 1999. Dégagent un flot de projectiles bio-organiques perforants à cadence vertigineuse.</p>",
      "type": "secondary",
      "subtype": "Dual Coda Pistols",
      "damage": "2d6",
      "damageType": "Toxin",
      "range": "25m (30 ft)",
      "equipped": false,
      "critChance": 25,
      "critMultiplier": 2.4,
      "statusChance": 28,
      "attackBonus": 1,
      "attribute": "prowess",
      "magazine": {
        "value": 160,
        "max": 160
      },
      "ammoReserve": 960,
      "fireRate": 3,
      "reload": 2,
      "hasAltFire": false,
      "altFireLabel": "",
      "altFireIcon": "",
      "altDamage": "",
      "altDamageType": "",
      "canSwapMode": false,
      "currentMode": "secondary",
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
