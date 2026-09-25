/**
 * Warframe TTRPG - Star Chart Data (Origin System)
 * Exact 1:1 In-Game Geometry with dynamic Kuva Fortress orbit, official 3D wiki renders, and Solar Rail Junctions.
 */

export const ORIGIN_SYSTEM_FACTIONS = {
  "tenno": {
    "id": "tenno",
    "name": "Tenno & le Lotus",
    "color": "#58d8ff",
    "description": "Gardiens de l'équilibre du Système Origine guidés par le Lotus."
  },
  "grineer": {
    "id": "grineer",
    "name": "Empire Grineer",
    "color": "#c0392b",
    "description": "Empire militariste de clones impérialistes dirigés par les Reines Kuva."
  },
  "corpus": {
    "id": "corpus",
    "name": "Conglomérat Corpus",
    "color": "#2980b9",
    "description": "Méga-corporation techno-religieuse vénérant le Profit et la robotique."
  },
  "infested": {
    "id": "infested",
    "name": "Les Infestés",
    "color": "#27ae60",
    "description": "Fléau biologique et techno-organique dévorant toute matière vivante."
  },
  "orokin": {
    "id": "orokin",
    "name": "Vestiges Orokin",
    "color": "#f1c40f",
    "description": "Systèmes de défense automatisés des Tours dorées du Néant."
  },
  "sentient": {
    "id": "sentient",
    "name": "Sentients",
    "color": "#8e44ad",
    "description": "Machines intelligentes adaptatives issues du système de Tau."
  },
  "syndicate": {
    "id": "syndicate",
    "name": "Coloniaux & Syndicats",
    "color": "#e67e22",
    "description": "Colonies libres et factions humaines indépendantes."
  }
};

export const ORIGIN_SYSTEM_BODIES = [
  {
    "id": "sol-sun",
    "name": "Le Soleil (Sol)",
    "subtitle": "Étoile Centrale du Système Origine",
    "factionId": "orokin",
    "playerRank": "Zone Neutre Spatiale",
    "resources": [
      "Énergie Solaire",
      "Particules Photofluoriques"
    ],
    "city": null,
    "openWorld": null,
    "boss": null,
    "lore": "L'étoile au cœur du Système Origine. Autrefois source de vie de l'humanité antique et fondation de l'Empire Orokin. Aujourd'hui surveillé par des relais scientifiques et des balises Tenno.",
    "x": 12,
    "y": 50,
    "iconColor": "#ffaa00",
    "iconSize": 48,
    "renderSize": 160,
    "img": "systems/warframe-ttrpg/asset/planets/full/Sun.png",
    "iconStyle": "star",
    "px": 1970,
    "py": 1228
  },
  {
    "id": "planet-mercury",
    "name": "Mercure",
    "subtitle": "Bastion Industriel Incandescent",
    "factionId": "grineer",
    "playerRank": "Rang Tenno 3 à 5",
    "resources": [
      "Morphics",
      "Ferrite",
      "Paquet de Polymère",
      "Ampoule de Détonite"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Capitaine Vor",
      "location": "Tolstoj",
      "briefing": "Commandant Grineer d'élite retranché dans les mines solaires. Les rumeurs mentionnent un artefact du Néant en sa possession."
    },
    "lore": "Planète rocheuse incandescente la plus proche du Soleil. Convertie en forteresse et usine d'extraction minière lourde par l'Empire Grineer.",
    "x": 20,
    "y": 50,
    "iconColor": "#c0392b",
    "iconSize": 28,
    "renderSize": 68,
    "img": "systems/warframe-ttrpg/asset/planets/full/Mercury.png",
    "iconStyle": "planet",
    "px": 1752,
    "py": 1422
  },
  {
    "id": "planet-venus",
    "name": "Vénus",
    "subtitle": "Colonie Glaciaire & Usine Corpus",
    "factionId": "corpus",
    "playerRank": "Rang Tenno 2 à 4",
    "resources": [
      "Plaque d'Alliage",
      "Circuits",
      "Paquet de Polymère",
      "Échantillon de Fieldron"
    ],
    "city": {
      "name": "Fortuna",
      "subtitle": "Colonie d'Endettés & Union Solaris",
      "description": "Cité ouvrière souterraine et colonie d'endettés sous le joug de Nef Anyo. Les travailleurs cyborgs Solaris s'y organisent clandestinement au sein de l'Union Solaris pour saboter la tyrannie Corpus et racheter la liberté des leurs.",
      "notableNPCs": "Eudico, Smokefinger, The Business, Rude Zuud, Ticker, Legs"
    },
    "openWorld": "Vallée d'Orbis",
    "boss": {
      "name": "Le Jackal",
      "location": "Fossa",
      "briefing": "Prototype quadrupède de classe blindée lourde déployé dans l'usine centrale Corpus."
    },
    "lore": "Autrefois un enfer volcanique sulfurique, Vénus a été refroidie par les tours Orokin et transformée en immense complexe industriel à ciel ouvert par le Conglomérat Corpus.",
    "x": 28,
    "y": 50,
    "iconColor": "#2980b9",
    "iconSize": 32,
    "renderSize": 84,
    "img": "systems/warframe-ttrpg/asset/planets/full/Venus.png",
    "iconStyle": "planet",
    "px": 2149,
    "py": 1448
  },
  {
    "id": "planet-earth",
    "name": "Terre",
    "subtitle": "Berceau de l'Humanité & Jungle Vivante",
    "factionId": "grineer",
    "playerRank": "Rang Tenno 1 à 3 (Initiation)",
    "resources": [
      "Ferrite",
      "Rubedo",
      "Neurodes",
      "Ampoule de Détonite"
    ],
    "city": {
      "name": "Cétus",
      "subtitle": "Colonie Marchande des Ostrons",
      "description": "Bourgade marchande côtière des Ostrons, bâtie au pied de la Tour vivante de l'Unum. Communauté libre d'artisans et de pêcheurs alliée aux Tenno, résistant vaillamment aux purges Grineer du Conseiller Vay Hek.",
      "notableNPCs": "Konzu, Vieux Suumbaat, Hai-Luk, Hok, Nakak, Maître Teasonai"
    },
    "openWorld": "Plaines d'Eidolon",
    "boss": {
      "name": "Conseiller Vay Hek",
      "location": "Oro",
      "briefing": "Cyber-tyran Grineer retranché dans son châssis Terra Frame au cœur de la canopée."
    },
    "lore": "La Terre originelle, recouverte d'une jungle mutée impénétrable résultant de bio-ingénieries Orokin hors de contrôle. Les Grineers y maintiennent de gigantesques chantiers navals.",
    "x": 36,
    "y": 50,
    "iconColor": "#27ae60",
    "iconSize": 34,
    "renderSize": 92,
    "img": "systems/warframe-ttrpg/asset/planets/full/Earth.png",
    "iconStyle": "planet",
    "px": 2470,
    "py": 1378
  },
  {
    "id": "planet-lua",
    "name": "Lua (Lune de la Terre)",
    "subtitle": "Ruines Célestes Orokin Cachées",
    "factionId": "orokin",
    "playerRank": "Rang Tenno 12 à 16 (Ruines Orokin)",
    "resources": [
      "Neurodes",
      "Rubedo",
      "Ferrite",
      "Ampoule de Détonite"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Spectres Sentients & Vestiges de l'Ombre",
      "location": "Pavlov",
      "briefing": "Sentinelles biomécaniques immortelles protégeant les salles scellées du Réservoir."
    },
    "lore": "L'ancienne Lune de la Terre, jadis cachée dans les méandres du Néant par le Lotus pour protéger le Réservoir des Opérateurs Tenno.",
    "x": 40,
    "y": 42,
    "iconColor": "#f1c40f",
    "iconSize": 22,
    "renderSize": 52,
    "img": "systems/warframe-ttrpg/asset/planets/full/Lua.png",
    "iconStyle": "moon",
    "px": 2600,
    "py": 1420
  },
  {
    "id": "planet-mars",
    "name": "Mars",
    "subtitle": "Déserts Rouges & Cités Enfouies",
    "factionId": "grineer",
    "playerRank": "Rang Tenno 4 à 6",
    "resources": [
      "Morphics",
      "Récupération",
      "Gallium",
      "Échantillon de Fieldron"
    ],
    "city": {
      "name": "Bazar de Maroo",
      "subtitle": "Marché Clandestin & Comptoir Ayatan",
      "description": "Station orbitale de libre-échange tenue par la contrebandière Maroo. Plaque tournante neutre des Tenno pour le commerce d'équipements et l'échange de Sculptures Ayatan contre de l'Endo.",
      "notableNPCs": "Maroo, Varzia Dax"
    },
    "openWorld": null,
    "boss": {
      "name": "Lieutenant Lech Kril",
      "location": "War",
      "briefing": "Seigneur de guerre Grineer suréquipé en cryo-blindage lourd."
    },
    "lore": "La Planète Rouge, berceau de conflits incessants entre garnisons Grineer et expéditions de pillage Corpus excavant les reliques des sables.",
    "x": 44,
    "y": 50,
    "iconColor": "#e74c3c",
    "iconSize": 30,
    "renderSize": 76,
    "img": "systems/warframe-ttrpg/asset/planets/full/Mars.png",
    "iconStyle": "planet",
    "px": 2367,
    "py": 1024
  },
  {
    "id": "planet-phobos",
    "name": "Phobos",
    "subtitle": "Lune Martienne Monolithique",
    "factionId": "corpus",
    "playerRank": "Rang Tenno 5 à 7",
    "resources": [
      "Plaque d'Alliage",
      "Morphics",
      "Plastides",
      "Ampoule de Détonite"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Le Sergent",
      "location": "Iliad",
      "briefing": "Officier Corpus coordinateur des convois de fret et tireur d'élite."
    },
    "lore": "Astéroïde déchiqueté en orbite martienne, transformé en plateforme de stockage et avant-poste de patrouille tactique Corpus.",
    "x": 48,
    "y": 42,
    "iconColor": "#3498db",
    "iconSize": 20,
    "renderSize": 48,
    "img": "systems/warframe-ttrpg/asset/planets/full/Phobos.png",
    "iconStyle": "moon",
    "px": 2480,
    "py": 890
  },
  {
    "id": "planet-deimos",
    "name": "Deimos",
    "subtitle": "Biomasse Infestée Vivante & Nécrolyte",
    "factionId": "infested",
    "playerRank": "Rang Tenno 6 à 9",
    "resources": [
      "Nano Spores",
      "Échantillon Mutagène",
      "Cellule Orokin",
      "Neurodes"
    ],
    "city": {
      "name": "Le Nécralisk",
      "subtitle": "Sanctuaire de la Famille Entrati",
      "description": "Citadelle hermétique isolée au cœur de la biomasse de Deimos. Refuge des derniers aristocrates Orokin Entrati, fournissant aux Tenno l'artillerie des Necramechs et gardant les laboratoires du Néant.",
      "notableNPCs": "Mère, Père, Fille, Fils, Otak & Loid"
    },
    "openWorld": "Puy de Cambion",
    "boss": {
      "name": "L'Entité du Cœur",
      "location": "Sanctum Anatomica",
      "briefing": "Cœur vivant alimentant la résonance du Néant, constamment menacé par les créatures de l'Infestation."
    },
    "lore": "Deuxième lune de Mars, entièrement consumée par une souche primordiale d'Infestation. Abrite le Nécralisk, bastion souterrain de la famille Entrati et point de passage vers le Puy de Cambion.",
    "x": 48,
    "y": 58,
    "iconColor": "#9b59b6",
    "iconSize": 24,
    "renderSize": 58,
    "img": "systems/warframe-ttrpg/asset/planets/full/Deimos.png",
    "iconStyle": "infested",
    "px": 2123,
    "py": 831
  },
  {
    "id": "planet-ceres",
    "name": "Cérès",
    "subtitle": "Fonderies Impériales Grineer",
    "factionId": "grineer",
    "playerRank": "Rang Tenno 6 à 8",
    "resources": [
      "Plaque d'Alliage",
      "Circuits",
      "Cellule Orokin",
      "Ampoule de Détonite"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Capitaine Vor & Lieutenant Lech Kril",
      "location": "Extrema",
      "briefing": "Alliance inhabituelle des deux commandants Grineers assurant la sécurité des chantiers spatiaux."
    },
    "lore": "Planète naine de la ceinture d'astéroïdes, entièrement couverte de raffineries toxiques et de fonderies géantes fabriquant la flotte de guerre Grineer.",
    "x": 52,
    "y": 50,
    "iconColor": "#c0392b",
    "iconSize": 26,
    "renderSize": 62,
    "img": "systems/warframe-ttrpg/asset/planets/full/Ceres.png",
    "iconStyle": "planet",
    "px": 1630,
    "py": 894
  },
  {
    "id": "planet-jupiter",
    "name": "Jupiter",
    "subtitle": "Cités Gazeuses & Cité des Nuages",
    "factionId": "corpus",
    "playerRank": "Rang Tenno 7 à 9",
    "resources": [
      "Récupération",
      "Circuits",
      "Capteurs Neuraux",
      "Échantillon de Fieldron"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Alad V & Zanuka",
      "location": "Themisto",
      "briefing": "Directeur Corpus supervisant les laboratoires secrets des Cités Gazeuses et son prototype de garde."
    },
    "lore": "Géante gazeuse ornée d'immenses cités flottantes gérées par Alad V. Centre névralgique de la recherche Corpus sur les Amalgames Sentients.",
    "x": 58,
    "y": 50,
    "iconColor": "#f39c12",
    "iconSize": 46,
    "renderSize": 135,
    "img": "systems/warframe-ttrpg/asset/planets/full/Jupiter.png",
    "iconStyle": "gas_giant",
    "px": 1236,
    "py": 1146
  },
  {
    "id": "planet-europa",
    "name": "Europe",
    "subtitle": "Lune Glacée & Débris d'Épaves",
    "factionId": "corpus",
    "playerRank": "Rang Tenno 8 à 10",
    "resources": [
      "Morphics",
      "Rubedo",
      "Module de Contrôle",
      "Échantillon de Fieldron"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Le Raptor",
      "location": "Naamah",
      "briefing": "Escadron d'aéronefs d'assaut tactique lourd développé par les laboratoires de surface."
    },
    "lore": "Lune gelée de Jupiter jonchée d'épaves de vaisseaux capitaux Corpus et Orokin figés dans la glace millénaire.",
    "x": 62,
    "y": 42,
    "iconColor": "#74b9ff",
    "iconSize": 22,
    "renderSize": 56,
    "img": "systems/warframe-ttrpg/asset/planets/full/Europa.png",
    "iconStyle": "moon",
    "px": 936,
    "py": 1170
  },
  {
    "id": "planet-saturn",
    "name": "Saturne",
    "subtitle": "Forteresse aux Anneaux Dorés",
    "factionId": "grineer",
    "playerRank": "Rang Tenno 9 à 11",
    "resources": [
      "Nano Spores",
      "Plastides",
      "Cellule Orokin",
      "Ampoule de Détonite"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Général Sargas Ruk",
      "location": "Tethys",
      "briefing": "Général Grineer pyromane cybernétisé, impitoyable et réputé invincible dans ses fournaises."
    },
    "lore": "Géante aux anneaux majestueux contrôlée par la flotte militaire lourde des Grineers. Fournit les Cellules Orokin essentielles à la forge des Warframes.",
    "x": 66,
    "y": 50,
    "iconColor": "#e67e22",
    "iconSize": 42,
    "renderSize": 125,
    "img": "systems/warframe-ttrpg/asset/planets/full/Saturn.png",
    "iconStyle": "ringed_giant",
    "px": 1451,
    "py": 1572
  },
  {
    "id": "planet-uranus",
    "name": "Uranus",
    "subtitle": "Océans Sous-Marins & Laboratoires de Clonage",
    "factionId": "grineer",
    "playerRank": "Rang Tenno 10 à 13",
    "resources": [
      "Paquet de Polymère",
      "Plastides",
      "Gallium",
      "Ampoule de Détonite"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Tyl Regor",
      "location": "Titania",
      "briefing": "Chef de la génétique Grineer opérant dans les laboratoires subaquatiques sous haute sécurité."
    },
    "lore": "Planète océanique toxique abritant les laboratoires secrets sous-marins de Tyl Regor cherchant à réparer la dégradation génétique des clones Grineer.",
    "x": 72,
    "y": 50,
    "iconColor": "#1abc9c",
    "iconSize": 36,
    "renderSize": 96,
    "img": "systems/warframe-ttrpg/asset/planets/full/Uranus.png",
    "iconStyle": "ice_giant",
    "px": 1961,
    "py": 1750
  },
  {
    "id": "planet-neptune",
    "name": "Neptune",
    "subtitle": "Capitale Financière & L'Index Corpus",
    "factionId": "corpus",
    "playerRank": "Rang Tenno 12 à 14",
    "resources": [
      "Nano Spores",
      "Ferrite",
      "Module de Contrôle",
      "Échantillon de Fieldron"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Meute Hyena",
      "location": "Psamathe",
      "briefing": "Unités quadrupèdes autonomes expérimentales de la sécurité rapprochée Corpus."
    },
    "lore": "Centre financier du Conglomérat Corpus et fief de l'Index, où sont brassées des fortunes colossales en Crédits sous l'œil vigilant des Directeurs.",
    "x": 78,
    "y": 50,
    "iconColor": "#2980b9",
    "iconSize": 34,
    "renderSize": 90,
    "img": "systems/warframe-ttrpg/asset/planets/full/Neptune.png",
    "iconStyle": "ice_giant",
    "px": 2570,
    "py": 1640
  },
  {
    "id": "planet-pluto",
    "name": "Pluton",
    "subtitle": "Bordure Extérieure & Avant-Postes Avancés",
    "factionId": "corpus",
    "playerRank": "Rang Tenno 13 à 15",
    "resources": [
      "Rubedo",
      "Morphics",
      "Plastides",
      "Plaque d'Alliage"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Ambulas & Frohd Bek",
      "location": "Hades",
      "briefing": "Plateforme mécatronique d'infanterie lourde Corpus dotée d'une IA tactique supérieure."
    },
    "lore": "Monde glacé et désolé aux confins du système. Ses avant-postes servent de base de lancement vers l'espace profond et de sites d'essais d'armes interdites.",
    "x": 84,
    "y": 50,
    "iconColor": "#7f8c8d",
    "iconSize": 26,
    "renderSize": 64,
    "img": "systems/warframe-ttrpg/asset/planets/full/Pluto.png",
    "iconStyle": "planet",
    "px": 2840,
    "py": 1280
  },
  {
    "id": "planet-sedna",
    "name": "Sedna",
    "subtitle": "Bastion des Arènes du Rathuum",
    "factionId": "grineer",
    "playerRank": "Rang Tenno 15 à 18 (Vétéran)",
    "resources": [
      "Rubedo",
      "Plaque d'Alliage",
      "Plastides",
      "Ampoule de Détonite"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Kela De Thaym",
      "location": "Merrow",
      "briefing": "Maîtresse de guerre Grineer et arbitre suprême des combats du Rathuum."
    },
    "lore": "Planétoïde lointain transformé en cour martiale sanglante où la juge suprême Kela De Thaym condamne déserteurs et prisonniers aux jeux du Rathuum.",
    "x": 88,
    "y": 40,
    "iconColor": "#c0392b",
    "iconSize": 24,
    "renderSize": 60,
    "img": "systems/warframe-ttrpg/asset/planets/full/Sedna.png",
    "iconStyle": "planet",
    "px": 2850,
    "py": 780
  },
  {
    "id": "planet-eris",
    "name": "Éris",
    "subtitle": "Flotte Fantôme Infestée",
    "factionId": "infested",
    "playerRank": "Rang Tenno 15 à 18 (Haute Contagion)",
    "resources": [
      "Nano Spores",
      "Plastides",
      "Neurodes",
      "Échantillon Mutagène"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Golem Jordas",
      "location": "Assassinat Jordas",
      "briefing": "Épave colossale de céphalon dévorée et corrompue par la biomasse mutée."
    },
    "lore": "Cimetière spatial de vaisseaux capitaux Corpus dérivant dans l'ombre, entièrement consumés et fondus par la ruche biotechnologique des Infestés.",
    "x": 88,
    "y": 60,
    "iconColor": "#27ae60",
    "iconSize": 26,
    "renderSize": 64,
    "img": "systems/warframe-ttrpg/asset/planets/full/Eris.png",
    "iconStyle": "infested",
    "px": 2320,
    "py": 520
  },
  {
    "id": "station-kuva",
    "name": "Forteresse Kuva",
    "subtitle": "Citadelle Mobile des Reines Grineer",
    "factionId": "grineer",
    "playerRank": "Rang Tenno 16 à 20 (Bastion Élite)",
    "resources": [
      "Kuva",
      "Cellule Orokin",
      "Neurodes",
      "Ampoule de Détonite"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Garde Royale Kuva",
      "location": "Palais Intérieur",
      "briefing": "Troupes impériales d'élite protégeant le sanctuaire des Reines Grineer."
    },
    "lore": "Gigantesque astéroïde évidé et militarisé abritant le palais secret des Reines Grineer. Ses réacteurs colossaux la déplacent continuellement à travers le système.",
    "x": 60,
    "y": 75,
    "iconColor": "#e74c3c",
    "iconSize": 32,
    "renderSize": 82,
    "img": "systems/warframe-ttrpg/asset/planets/full/Kuva_Fortress.png",
    "iconStyle": "fortress",
    "px": 1780,
    "py": 460
  },
  {
    "id": "zone-void",
    "name": "Le Néant (Orokin Void)",
    "subtitle": "Tours Célestes & Voies du Néant",
    "factionId": "orokin",
    "playerRank": "Rang Tenno 8 à 20 (Tours I à IV)",
    "resources": [
      "Cristal d'Argon",
      "Module de Contrôle",
      "Plaque d'Alliage",
      "Rubedo"
    ],
    "city": null,
    "openWorld": null,
    "boss": {
      "name": "Gardiens Corrompus du Néant",
      "location": "Mot",
      "briefing": "Sentinelles automatisées du réseau neuronal Orokin patrouillant dans les tours dorées."
    },
    "lore": "Dimension extra-spatiale d'énergie pure abritant les splendides citadelles abandonnées de l'Empire Orokin, protégées par un réseau de drones et de guerriers asservis.",
    "x": 25,
    "y": 75,
    "iconColor": "#f1c40f",
    "iconSize": 36,
    "renderSize": 90,
    "img": "systems/warframe-ttrpg/asset/planets/full/OrokinVoid.png",
    "iconStyle": "void",
    "px": 1140,
    "py": 580
  },
  {
    "id": "station-zariman",
    "name": "Zariman Ten-Zero",
    "subtitle": "Vaisseau Colonisateur Naufragé",
    "factionId": "tenno",
    "playerRank": "Rang Tenno 16 à 20 (Anomalie Incarnon)",
    "resources": [
      "Lanterne Entrati",
      "Plume du Néant",
      "Pignon Entrati",
      "Ferrite"
    ],
    "city": {
      "name": "La Chrysalithe",
      "subtitle": "Refuge des Invisibles",
      "description": "Arche résidentielle du vaisseau-fantôme Zariman Ten-Zero. Sanctuaire spectral des Invisibles luttant pour contenir la Faille du Néant et forger des armes Incarnon aux côtés des Tenno.",
      "notableNPCs": "Quinn, Cavalero, Archimédienne Yonta, Hombask"
    },
    "openWorld": null,
    "boss": {
      "name": "Anges du Néant",
      "location": "Chambre Cryptée",
      "briefing": "Entités spectrales nées de la catastrophe du Saut du Néant."
    },
    "lore": "L'arche coloniale légendaire dont la disparition dans le Néant a donné naissance aux Tenno. Revenue dans l'espace réel, coincée à la lisière du voile dimensionnel.",
    "x": 30,
    "y": 25,
    "iconColor": "#58d8ff",
    "iconSize": 34,
    "renderSize": 85,
    "img": "systems/warframe-ttrpg/asset/planets/full/New_Zariman.png",
    "iconStyle": "zariman",
    "px": 980,
    "py": 860
  },
  {
    "id": "hub-dojo",
    "name": "Dojo Tenno",
    "subtitle": "Sanctuaire & Flotte du Clan",
    "factionId": "tenno",
    "playerRank": "Tous Rangs (Sanctuaire Tenno)",
    "resources": [
      "Forma",
      "Pigments de Clan",
      "Échantillons de Laboratoire"
    ],
    "city": {
      "name": "Dojo de Clan",
      "subtitle": "Forteresse Orbitale du Clan",
      "description": "Station spatiale fortifiée et sanctuaire privé de votre Clan Tenno. Dispose d'une Cale Sèche pour Railjack, de salles d'entraînement et de quatre laboratoires de recherche technologique.",
      "notableNPCs": "Céphalon Cy, Consoles de Laboratoire"
    },
    "openWorld": null,
    "boss": null,
    "lore": "Station spatiale orbitale fortifiée érigée par votre Clan Tenno. Abrite les laboratoires de recherche avancée, les quais de cale sèche pour Railjack et la salle des duels.",
    "x": 70,
    "y": 20,
    "iconColor": "#58d8ff",
    "iconSize": 28,
    "renderSize": 72,
    "img": "systems/warframe-ttrpg/asset/planets/full/Dojo.png",
    "iconStyle": "station",
    "px": 1420,
    "py": 620
  }
];

export const ORIGIN_SYSTEM_JUNCTIONS = [
  { "id": "junc-earth-venus", "from": "planet-earth", "to": "planet-venus", "name": "Jonction Vénus" },
  { "id": "junc-venus-mercury", "from": "planet-venus", "to": "planet-mercury", "name": "Jonction Mercure" },
  { "id": "junc-earth-mars", "from": "planet-earth", "to": "planet-mars", "name": "Jonction Mars" },
  { "id": "junc-mars-phobos", "from": "planet-mars", "to": "planet-phobos", "name": "Jonction Phobos" },
  { "id": "junc-mars-ceres", "from": "planet-mars", "to": "planet-ceres", "name": "Jonction Cérès" },
  { "id": "junc-ceres-jupiter", "from": "planet-ceres", "to": "planet-jupiter", "name": "Jonction Jupiter" },
  { "id": "junc-jupiter-europa", "from": "planet-jupiter", "to": "planet-europa", "name": "Jonction Europe" },
  { "id": "junc-jupiter-saturn", "from": "planet-jupiter", "to": "planet-saturn", "name": "Jonction Saturne" },
  { "id": "junc-saturn-uranus", "from": "planet-saturn", "to": "planet-uranus", "name": "Jonction Uranus" },
  { "id": "junc-uranus-neptune", "from": "planet-uranus", "to": "planet-neptune", "name": "Jonction Neptune" },
  { "id": "junc-neptune-pluto", "from": "planet-neptune", "to": "planet-pluto", "name": "Jonction Pluton" },
  { "id": "junc-pluto-sedna", "from": "planet-pluto", "to": "planet-sedna", "name": "Jonction Sedna" },
  { "id": "junc-pluto-eris", "from": "planet-pluto", "to": "planet-eris", "name": "Jonction Éris" }
];

export function getPlanetById(id) {
  return ORIGIN_SYSTEM_BODIES.find(b => b.id === id);
}

export function getFactionById(id) {
  return ORIGIN_SYSTEM_FACTIONS[id];
}

export function getPlanetByPixel(x, y, radius = 60) {
  return ORIGIN_SYSTEM_BODIES.find(b => {
    const px = b.px ?? (b.x ? (b.x / 100) * 8000 : 0);
    const py = b.py ?? (b.y ? (b.y / 100) * 8000 : 0);
    const dx = px - x;
    const dy = py - y;
    return Math.sqrt(dx * dx + dy * dy) <= (b.renderSize || radius);
  });
}

export function getJunctionByPixel(x, y, radius = 40) {
  return ORIGIN_SYSTEM_JUNCTIONS.find(j => {
    if (!j.px || !j.py) return false;
    const dx = j.px - x;
    const dy = j.py - y;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  });
}

export function getKuvaFortressPosition() {
  return ORIGIN_SYSTEM_BODIES.find(b => b.id === "planet-kuva-fortress" || b.name?.includes("Kuva"));
}

