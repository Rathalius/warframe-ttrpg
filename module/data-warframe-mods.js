/**
 * Warframe TTRPG - Warframe Mods Dataset
 * Contains all 82 canonical Warframe mods and 8 compendium folders.
 */

export const warframeModFolders = [
    {
        "_id": "modfldraura00001",
        "name": "Mods d'Aura",
        "sorting": "a",
        "type": "Item",
        "color": "#2ecc71",
        "folder": null
    },
    {
        "_id": "modfldrcore00001",
        "name": "Essentiels & Survie",
        "sorting": "a",
        "type": "Item",
        "color": "#3498db",
        "folder": null
    },
    {
        "_id": "modfldrpwr000001",
        "name": "Pouvoirs & Aptitudes",
        "sorting": "a",
        "type": "Item",
        "color": "#9b59b6",
        "folder": null
    },
    {
        "_id": "modfldrcrpt00001",
        "name": "Mods Corrompus",
        "sorting": "a",
        "type": "Item",
        "color": "#e74c3c",
        "folder": null
    },
    {
        "_id": "modfldrexls00001",
        "name": "Exilus & Mobilité",
        "sorting": "a",
        "type": "Item",
        "color": "#f39c12",
        "folder": null
    },
    {
        "_id": "modfldrsets00001",
        "name": "Mods d'Ensemble",
        "sorting": "a",
        "type": "Item",
        "color": "#e67e22",
        "folder": null
    },
    {
        "_id": "modfldrtact00001",
        "name": "Tactiques Avancées",
        "sorting": "a",
        "type": "Item",
        "color": "#1abc9c",
        "folder": null
    },
    {
        "_id": "modfldrprmd00001",
        "name": "Accrus, Umbra & Archonte",
        "sorting": "a",
        "type": "Item",
        "color": "#ffd700",
        "folder": null
    }
];

export const warframeModsDataset = [
    {
        "name": "Siphon d'Énergie",
        "_id": "wfmodaura0000001",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Les membres de l'escouade régénèrent <strong>+3 points d'Énergie par round</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/EnergySiphon.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Charge d'Acier",
        "_id": "wfmodaura0000002",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente les dégâts des attaques de Mêlée de l'escouade de <strong>+60%</strong>. Confère un énorme bonus de <strong>+18 de Capacité de Mods</strong> lorsque la polarité correspond !</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/SteelCharge.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Projection Corrosive",
        "_id": "wfmodaura0000003",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Réduit l'Armure ennemie de <strong>-18%</strong> sur l'ensemble du champ de bataille.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/CorrosiveProjection.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Perturbation de Bouclier",
        "_id": "wfmodaura0000004",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Réduit les Boucliers Max ennemis de <strong>-18%</strong> sur l'ensemble du champ de bataille.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ShieldDisruption.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Physique",
        "_id": "wfmodaura0000005",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente la Santé Max de l'escouade de <strong>+90 PV</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {
                "health": 90
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Physique.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Rajeunissement",
        "_id": "wfmodaura0000006",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Les membres de l'escouade régénèrent <strong>+3 points de Santé par round</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Rejuvenation.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Boost de Vitesse",
        "_id": "wfmodaura0000007",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente la Vitesse de Déplacement de l'escouade de <strong>+15% (+5 ft)</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "common",
            "drain": 7,
            "stats": {
                "sprintSpeed": 5
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/SprintBoost.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Amplificateur de Fusil",
        "_id": "wfmodaura0000008",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente les dégâts des attaques au Fusil Principal de l'escouade de <strong>+27%</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/RifleAmp.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Amplificateur de Pistolet",
        "_id": "wfmodaura0000009",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente les dégâts des attaques au Pistolet Secondaire de l'escouade de <strong>+27%</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/PistolAmp.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Tir Mortel",
        "_id": "wfmodaura0000010",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente les dégâts des attaques au Fusil de Précision de l'escouade de <strong>+52,5%</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/DeadEye.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Récupérateur de Fusil à Pompe",
        "_id": "wfmodaura0000011",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente la quantité de munitions de fusil à pompe trouvées et récupérées de <strong>+100%</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ShotgunScavenger.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Puissance Grandissante",
        "_id": "wfmodaura0000012",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Infliger un effet de statut avec une arme confère <strong>+25% de Puissance des Pouvoirs</strong> pendant 6 tours.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/GrowingPower.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Bref Répit",
        "_id": "wfmodaura0000013",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Lancer une aptitude convertit <strong>150% de l'Énergie dépensée</strong> directement en Boucliers actifs.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/BriefRespite.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Unis dans l'Action",
        "_id": "wfmodaura0000014",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Renforce le blindage défensif de l'escouade, conférant <strong>+25,5% (+40 d'Armure)</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {
                "armor": 40
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/StandUnited.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Discipline de Combat",
        "_id": "wfmodaura0000015",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Éliminer un ennemi soigne tous les alliés de l'escouade de <strong>+20 PV</strong>, mais le porteur sacrifie <strong>10 PV</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/CombatDiscipline.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Aérodynamique",
        "_id": "wfmodaura0000016",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Prolonge la durée du Vol Plané de <strong>+6s</strong> et réduit les dégâts subis en l'air de <strong>-24%</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Aerodynamic.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Radar Ennemi",
        "_id": "wfmodaura0000017",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Détecte et suit la position des ennemis sur la grille tactique dans un rayon de <strong>30 mètres</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "common",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/EnemyRadar.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Détecteur de Butin",
        "_id": "wfmodaura0000018",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Détecte les conteneurs, caches de butin et ressources dans un rayon de <strong>30 mètres</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "common",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/LootDetector.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Don de Puissance",
        "_id": "wfmodaura0000019",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Le porteur sacrifie <strong>-30% de Puissance des Pouvoirs</strong>, mais accorde <strong>+30% de Puissance des Pouvoirs</strong> à tous les alliés de l'escouade ! Confère +18 de Capacité en correspondance.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "powerStrength": -30
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/PowerDonation.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Élan Fulgurant",
        "_id": "wfmodaura0000020",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Prolonge la durée du Combo de Mêlée de <strong>+6s</strong> et accélère la préparation des Attaques Lourdes de <strong>+30%</strong>.</p>",
            "type": "aura",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/SwiftMomentum.png",
        "folder": "modfldraura00001"
    },
    {
        "name": "Vitalité",
        "_id": "wfmodcore0000001",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente la Santé Max de <strong>+100 PV</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "common",
            "drain": 12,
            "stats": {
                "health": 100
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Vitality.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Redirection",
        "_id": "wfmodcore0000002",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente les Boucliers Max de <strong>+100 Boucliers</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "common",
            "drain": 12,
            "stats": {
                "shields": 100
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Redirection.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Fibre d'Acier",
        "_id": "wfmodcore0000003",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Renforce le blindage du châssis, conférant <strong>+100 d'Armure</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "common",
            "drain": 12,
            "stats": {
                "armor": 100
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/SteelFiber.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Flux",
        "_id": "wfmodcore0000004",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente la capacité du réservoir de Néant interne, conférant <strong>+75 d'Énergie Max</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "energy": 75
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Flow.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Déviation Rapide",
        "_id": "wfmodcore0000005",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Augmente la vitesse de recharge des Boucliers de <strong>+90%</strong> et réduit le délai avant le début de la recharge.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/FastDeflection.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Vigueur",
        "_id": "wfmodcore0000006",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Amélioration défensive combinée : confère <strong>+50 de Santé Max</strong> et <strong>+50 de Boucliers Max</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "shields": 50,
                "health": 50
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Vigor.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Agilité Blindée",
        "_id": "wfmodcore0000007",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Matériaux composites légers et renforcés conférant <strong>+45 d'Armure</strong> et <strong>+5 ft de Vitesse de Déplacement</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "armor": 45,
                "sprintSpeed": 5
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ArmoredAgility.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Résolution du Gladiateur",
        "_id": "wfmodcore0000008",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Gladiateur : Confère <strong>+40 de Santé Max</strong>. (Bonus d'Ensemble : +10% de Chances Critiques en mêlée par niveau de combo).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "health": 40
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/GladiatorResolve.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Égide du Gladiateur",
        "_id": "wfmodcore0000009",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Gladiateur : Confère <strong>+45 d'Armure</strong>. (Bonus d'Ensemble : +10% de Chances Critiques en mêlée par niveau de combo).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "armor": 45
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/GladiatorAegis.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Réflexe Vital",
        "_id": "wfmodcore0000010",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Consomme l'Énergie restante pour empêcher les dégâts mortels avec une efficacité de 240%. Empêche l'agonie tant qu'il reste de l'Énergie !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 15,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/QuickThinking.png",
        "folder": "modfldrcore00001"
    },
    {
        "name": "Intensification",
        "_id": "wfmodpwrr0000001",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Amplifie la puissance déployée, conférant <strong>+30% de Puissance des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "powerStrength": 30
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Intensify.png",
        "folder": "modfldrpwr000001"
    },
    {
        "name": "Continuité",
        "_id": "wfmodpwrr0000002",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Stabilise la résonance du Néant, conférant <strong>+30% de Durée des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "powerDuration": 30
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Continuity.png",
        "folder": "modfldrpwr000001"
    },
    {
        "name": "Rationalisation",
        "_id": "wfmodpwrr0000003",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Optimise la dépense énergétique des aptitudes, conférant <strong>+30% d'Efficacité des Pouvoirs</strong> (plafonné à 190% max).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "powerEfficiency": 30
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Streamline.png",
        "folder": "modfldrpwr000001"
    },
    {
        "name": "Allonge",
        "_id": "wfmodpwrr0000004",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Étend les champs de dispersion spatiale, conférant <strong>+45% de Portée des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {
                "powerRange": 45
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Stretch.png",
        "folder": "modfldrpwr000001"
    },
    {
        "name": "Équilibre",
        "_id": "wfmodpwrr0000005",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Synthèse parfaite : les Orbes de Santé confèrent <strong>+110%</strong> de leur valeur en Énergie, et les Orbes d'Énergie confèrent <strong>+110%</strong> en Santé !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Equilibrium.png",
        "folder": "modfldrpwr000001"
    },
    {
        "name": "Talent Naturel",
        "_id": "wfmodpwrr0000006",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Améliore les réflexes neuro-cinétiques, accélérant la Vitesse de Lancement des Aptitudes de <strong>+50%</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/NaturalTalent.png",
        "folder": "modfldrpwr000001"
    },
    {
        "name": "Rage",
        "_id": "wfmodpwrr0000007",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Convertit <strong>40% des dégâts subis sur la Santé</strong> directement en Énergie utilisable.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Rage.png",
        "folder": "modfldrpwr000001"
    },
    {
        "name": "Adrénaline du Chasseur",
        "_id": "wfmodpwrr0000008",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Chasseur : Convertit <strong>45% des dégâts subis sur la Santé</strong> directement en Énergie utilisable.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/HunterAdrenaline.png",
        "folder": "modfldrpwr000001"
    },
    {
        "name": "Colère Aveugle",
        "_id": "wfmodcrpt0000001",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Artéfact des Soutes Orokin : Confère un titanesque <strong>+99% de Puissance des Pouvoirs</strong>, au prix de <strong>-55% d'Efficacité des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 16,
            "stats": {
                "powerStrength": 99,
                "powerEfficiency": -55
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/BlindRage.png",
        "folder": "modfldrcrpt00001"
    },
    {
        "name": "Courage Passager",
        "_id": "wfmodcrpt0000002",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Artéfact des Soutes Orokin : Confère <strong>+55% de Puissance des Pouvoirs</strong>, au prix de <strong>-27% de Durée des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 16,
            "stats": {
                "powerStrength": 55,
                "powerDuration": -27
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/TransientFortitude.png",
        "folder": "modfldrcrpt00001"
    },
    {
        "name": "Expertise Éphémère",
        "_id": "wfmodcrpt0000003",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Artéfact des Soutes Orokin : Confère <strong>+60% d'Efficacité des Pouvoirs</strong>, au prix de <strong>-60% de Durée des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "powerDuration": -60,
                "powerEfficiency": 60
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/FleetingExpertise.png",
        "folder": "modfldrcrpt00001"
    },
    {
        "name": "Surexpansion",
        "_id": "wfmodcrpt0000004",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Artéfact des Soutes Orokin : Confère un massif <strong>+90% de Portée des Pouvoirs</strong>, au prix de <strong>-60% de Puissance des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "powerStrength": -60,
                "powerRange": 90
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Overextended.png",
        "folder": "modfldrcrpt00001"
    },
    {
        "name": "Pensée Étroite",
        "_id": "wfmodcrpt0000005",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Artéfact des Soutes Orokin : Confère un immense <strong>+99% de Durée des Pouvoirs</strong>, au prix de <strong>-66% de Portée des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 16,
            "stats": {
                "powerRange": -66,
                "powerDuration": 99
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/NarrowMinded.png",
        "folder": "modfldrcrpt00001"
    },
    {
        "name": "Ruée",
        "_id": "wfmodexls0000001",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Surcadence les servomoteurs des jambes, conférant <strong>+10 ft de Vitesse de Sprint</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 11,
            "stats": {
                "sprintSpeed": 10
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Rush.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Maglev",
        "_id": "wfmodexls0000002",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Réduit les frottements de surface de <strong>-30%</strong> et augmente la Vitesse de Glissade de <strong>+30%</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Maglev.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Mobilisation",
        "_id": "wfmodexls0000003",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Confère <strong>+20% de vélocité au Saut Propulsé</strong> et <strong>+20% de durée au Vol Plané</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "common",
            "drain": 5,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Mobilize.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Patagium",
        "_id": "wfmodexls0000004",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Déploie des voiles sustentatrices conférant <strong>+90% de durée au Vol Plané</strong> et à la Prise Murale.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Patagium.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Rétablissement Rapide",
        "_id": "wfmodexls0000005",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Accélère les réflexes de récupération, conférant <strong>+160% de Vitesse de Relèvement</strong> après un renversement.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Handspring.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Pied Léger",
        "_id": "wfmodexls0000006",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Stabilisateurs gyroscopiques conférant <strong>+60% de Chances de Résister aux Renversements</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/SureFooted.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Pied Léger Accru",
        "_id": "wfmodexls0000007",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Matrice de stabilisation Orokin immaculée : Confère une <strong>Immunité Totale (100%) aux Renversements et Chancellement</strong> !</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/PrimedSureFooted.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Dérive de Puissance",
        "_id": "wfmodexls0000008",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Mod de Dérive de Lua : Confère <strong>+15% de Puissance des Pouvoirs</strong> et <strong>+30% de Résistance aux Renversements</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "powerStrength": 15
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/PowerDrift.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Dérive Rusée",
        "_id": "wfmodexls0000009",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Mod de Dérive de Lua : Confère <strong>+15% de Portée des Pouvoirs</strong>, <strong>+12% de Vitesse de Glissade</strong> et <strong>-30% de Frottements</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "powerRange": 15
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/CunningDrift.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Dérive Furtive",
        "_id": "wfmodexls0000010",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Mod de Dérive de Lua : Confère <strong>+18m de Radar Ennemi</strong> et <strong>+12% de durée de Vol Plané</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/StealthDrift.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Dérive de Cohésion",
        "_id": "wfmodexls0000011",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Mod de Dérive de Lua : Augmente la Puissance de l'Aura de <strong>+15%</strong> et l'Efficacité de l'Aura de <strong>+15%</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/CoactionDrift.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Dérive d'Endurance",
        "_id": "wfmodexls0000012",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Mod de Dérive de Lua : Confère <strong>+25 d'Énergie Max</strong> et <strong>+12% de Vélocité de Parkour</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Zenurik",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "energy": 25
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/EnduranceDrift.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Dérive de Vitesse",
        "_id": "wfmodexls0000013",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Mod de Dérive de Lua : Confère <strong>+5 ft de Vitesse de Sprint</strong> et <strong>+15% de Vitesse de Lancement</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {
                "sprintSpeed": 5
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/SpeedDrift.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Dérive d'Agilité",
        "_id": "wfmodexls0000014",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Mod de Dérive de Lua : Réduit les dégâts subis en vol de <strong>-12%</strong> et confère <strong>+6% d'Évasion</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/AgilityDrift.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Aviateur",
        "_id": "wfmodexls0000015",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Les stabilisateurs aérodynamiques réduisent tous les dégâts subis en vol de <strong>-40%</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Aviator.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Ruse du Voleur",
        "_id": "wfmodexls0000016",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Les capteurs de butin détectent conteneurs, médaillons et ressources dans un rayon de <strong>30 mètres</strong>.</p>",
            "type": "exilus",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "common",
            "drain": 7,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ThiefsWit.png",
        "folder": "modfldrexls00001"
    },
    {
        "name": "Secrets de l'Augure",
        "_id": "wfmodsets0000001",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Augure : Confère <strong>+24% de Puissance des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "powerStrength": 24
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/AugurSecrets.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Message de l'Augure",
        "_id": "wfmodsets0000002",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Augure : Confère <strong>+24% de Durée des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "common",
            "drain": 7,
            "stats": {
                "powerDuration": 24
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/AugurMessage.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Portée de l'Augure",
        "_id": "wfmodsets0000003",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Augure : Confère <strong>+30% de Portée des Pouvoirs</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 7,
            "stats": {
                "powerRange": 30
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/AugurReach.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Accord de l'Augure",
        "_id": "wfmodsets0000004",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Augure : Confère <strong>+70 de Boucliers Max</strong>. (Bonus d'Ensemble : 40% de l'Énergie dépensée en aptitudes est convertie en Boucliers).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "common",
            "drain": 7,
            "stats": {
                "shields": 70
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/AugurAccord.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Haine de Boréal",
        "_id": "wfmodsets0000005",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Boréal : Confère <strong>+65 de Boucliers Max</strong> et <strong>+15% d'Efficacité des Pouvoirs</strong>. (Bonus d'Ensemble : +20% de réduction des dégâts en vol).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "shields": 65,
                "powerEfficiency": 15
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/BorealsHatred.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Haine d'Amar",
        "_id": "wfmodsets0000006",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Amar : Confère <strong>+30 d'Armure</strong> et <strong>+15% de Puissance des Pouvoirs</strong>. (Bonus d'Ensemble : les Attaques Lourdes téléportent sur la cible à 10m).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "armor": 30,
                "powerStrength": 15
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/AmarsHatred.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Haine de Nira",
        "_id": "wfmodsets0000007",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Nira : Confère <strong>+50 de Santé Max</strong> et <strong>+15% de Durée des Pouvoirs</strong>. (Bonus d'Ensemble : les Attaques Écrasantes infligent +100% de dégâts).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 11,
            "stats": {
                "powerDuration": 15,
                "health": 50
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/NirasHatred.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Carapace de Carnis",
        "_id": "wfmodsets0000008",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Carnis : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les éliminations par Attaque Lourde confèrent 10% d'Évasion et Immunité aux Statuts pendant 6s).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {
                "armor": 55,
                "health": 20
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/CarnisCarapace.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Carapace de Jugulus",
        "_id": "wfmodsets0000009",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Jugulus : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les Écrasements Lourds font jaillir des vrilles empalantes).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {
                "armor": 55,
                "health": 20
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/JugulusCarapace.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Carapace de Saxum",
        "_id": "wfmodsets0000010",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Ensemble Saxum : Confère <strong>+55 d'Armure</strong> et <strong>+20 de Santé Max</strong>. (Bonus d'Ensemble : les ennemis projetés en l'air explosent à leur mort).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "uncommon",
            "drain": 9,
            "stats": {
                "armor": 55,
                "health": 20
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/SaxumCarapace.png",
        "folder": "modfldrsets00001"
    },
    {
        "name": "Adaptation",
        "_id": "wfmodtact0000001",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Lorsque vous subissez des dégâts, gagnez <strong>+10% de Résistance</strong> à ce type de dégâts pendant 20s. Se cumule jusqu'à un impressionnant <strong>90% de Résistance aux Dégâts</strong> !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 12,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/Adaptation.png",
        "folder": "modfldrtact00001"
    },
    {
        "name": "Roulade Protectrice",
        "_id": "wfmodtact0000002",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Effectuer une Roulade d'Esquive confère <strong>3 secondes d'Invulnérabilité Totale</strong> et purge tous les statuts négatifs actifs (temps de recharge de 7s).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "rare",
            "drain": 12,
            "stats": {},
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/RollingGuard.png",
        "folder": "modfldrtact00001"
    },
    {
        "name": "Continuité Accrue",
        "_id": "wfmodprmd0000001",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Relique Orokin immaculée : Confère un extraordinaire <strong>+55% de Durée des Pouvoirs</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 14,
            "stats": {
                "powerDuration": 55
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/PrimedContinuity.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Flux Accru",
        "_id": "wfmodprmd0000002",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Condensateur de Néant Orokin d'exception : Confère un immense <strong>+150 d'Énergie Max</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 14,
            "stats": {
                "energy": 150
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/PrimedFlow.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Vigueur Accrue",
        "_id": "wfmodprmd0000003",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Biomécanique Orokin d'exception : Confère <strong>+75 de Santé Max</strong> et <strong>+75 de Boucliers Max</strong>.</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "shields": 75,
                "health": 75
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/PrimedVigor.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Vitalité Umbra",
        "_id": "wfmodprmd0000004",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Synthèse sacrificielle Dax : Confère <strong>+180 de Santé Max</strong> et <strong>+11% de Résistance Tau</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Umbra",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "health": 180
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/UmbralVitality.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Fibre Umbra",
        "_id": "wfmodprmd0000005",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Tissage sacrificiel Dax : Confère <strong>+180 d'Armure</strong> et <strong>+11% de Résistance Tau</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Umbra",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "armor": 180
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/UmbralFiber.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Intensification Umbra",
        "_id": "wfmodprmd0000006",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Focalisation sacrificielle Dax : Confère <strong>+44% de Puissance des Pouvoirs</strong>. Gagne en puissance lorsqu'il est équipé avec d'autres mods Umbra !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Umbra",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "powerStrength": 44
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/UmbralIntensify.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Intensification d'Archonte",
        "_id": "wfmodprmd0000007",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Résonance de Fragment d'Archonte : Confère <strong>+30% de Puissance des Pouvoirs</strong>. Restaurer de la santé avec une aptitude accorde <strong>+30% de Puissance supplémentaire</strong> pendant 10s !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "powerStrength": 30
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ArchonIntensify.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Continuité d'Archonte",
        "_id": "wfmodprmd0000008",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Résonance de Fragment d'Archonte : Confère <strong>+30% de Durée des Pouvoirs</strong>. Les aptitudes qui infligent un statut de Toxine infligent aussi automatiquement un statut Corrosif !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Madurai",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "powerDuration": 30
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ArchonContinuity.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Allonge d'Archonte",
        "_id": "wfmodprmd0000009",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Résonance de Fragment d'Archonte : Confère <strong>+45% de Portée des Pouvoirs</strong>. Les aptitudes infligeant des dégâts d'Électricité régénèrent <strong>+2 Énergie/sec</strong> pendant 5s !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "powerRange": 45
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ArchonStretch.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Vitalité d'Archonte",
        "_id": "wfmodprmd0000010",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Résonance de Fragment d'Archonte : Confère <strong>+100 de Santé Max</strong>. Les effets de statut infligeant des dégâts de Feu issus d'aptitudes se déclenchent deux fois !</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Vazarin",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "health": 100
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ArchonVitality.png",
        "folder": "modfldrprmd00001"
    },
    {
        "name": "Flux d'Archonte",
        "_id": "wfmodprmd0000011",
        "system": {
            "rank": {
                "value": 5,
                "max": 5
            },
            "description": "<p>Résonance de Fragment d'Archonte : Confère <strong>+75 d'Énergie Max</strong>. Les ennemis éliminés par des aptitudes de Froid ont 10% de chances de lâcher un Orbe d'Énergie (recharge 10s).</p>",
            "type": "standard",
            "modType": "warframe",
            "equipped": false,
            "polarity": "Naramon",
            "weaponType": "all",
            "rarity": "legendary",
            "drain": 16,
            "stats": {
                "energy": 75
            },
            "slot": ""
        },
        "type": "mod",
        "img": "systems/warframe-ttrpg/asset/Mods/Warframe/ArchonFlow.png",
        "folder": "modfldrprmd00001"
    }
];
