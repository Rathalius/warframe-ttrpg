/**
 * Warframe TTRPG - Grineer Adversaries Dataset
 * Source : Wiki Officiel Warframe (https://wiki.warframe.com)
 *
 * Contient les statistiques canoniques, armures, PV, résistances élémentaires
 * (Armure Ferrite + Chair Clonée) et attaques automatiques prêtes pour Foundry VTT.
 */

export const bestiaryFolders = [
  {
    _id: "grineerfldr00001",
    name: "Grineer",
    type: "Actor",
    folder: null,
    sorting: "a",
    color: "#b71540"
  },
  {
    _id: "corpusfldr000001",
    name: "Corpus",
    type: "Actor",
    folder: null,
    sorting: "a",
    color: "#00a8ff"
  },
  {
    _id: "infestedfldr0001",
    name: "Infestés",
    type: "Actor",
    folder: null,
    sorting: "a",
    color: "#27ae60"
  },
  {
    _id: "orokinfldr000001",
    name: "Orokin",
    type: "Actor",
    folder: null,
    sorting: "a",
    color: "#f1c40f"
  },
  {
    _id: "murmurfldr000001",
    name: "Murmure",
    type: "Actor",
    folder: null,
    sorting: "a",
    color: "#8e44ad"
  }
];

export const GRINEER_ADVERSARIES = [
  {
    _id: "grnclancer000001",
    id: "grineer-lancer",
    folder: "grineerfldr00001",
    name: "Lancier Grineer",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/LancerDE.png",
    prototypeToken: {
      name: "Lancier Grineer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_lancier.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 100, max: 100 },
      shields: { value: 0, max: 0 },
      armor: { value: 100 },
      details: {
        level: { value: 1 },
        faction: "Grineer",
        attacks: [
          "Fusil Grakata (Rafale): 2d8 Impact - Portée 35m, tir automatique à haute cadence (Précision modérée)",
          "Dague Sheev (Mêlée): 1d6 Puncture - Corps-à-corps, frappe d'estoc d'urgence",
          "Grenade à Plasma: 3d10 Blast - Portée 20m, rayon d'explosion 4m (Délai 1 tour)"
        ].join("\n"),
        description: `<strong>Infanterie Légère Grineer</strong><br/>
Les Lanciers constituent le gros des légions de clones Grineers. Équipés du fusil automatique d'assaut <em>Grakata</em> et d'une armure standard en Ferrite, ils se déplacent en escouades coordonnées et se mettent à couvert derrière des barricades.<br/>
• <strong>Grenade Plasma :</strong> Lorsqu'une cible reste à couvert, le Lancier lance une grenade incendiaire/explosive qui détonne au début de son tour suivant.<br/>
• <strong>Défense Canonique :</strong> Protégé par une <em>Armure en Ferrite</em> et composé de <em>Chair Clonée</em>, il est particulièrement vulnérable aux dégâts <strong>Corrosifs</strong>, <strong>Perforants</strong> et <strong>Viraux</strong>, mais résiste à l'<strong>Impact</strong> et aux <strong>Explosions</strong>.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grnctrooper00001",
    id: "grineer-trooper",
    folder: "grineerfldr00001",
    name: "Soldat Grineer",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/soldat.png",
    prototypeToken: {
      name: "Soldat Grineer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_soldat.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 120, max: 120 },
      shields: { value: 0, max: 0 },
      armor: { value: 150 },
      details: {
        level: { value: 1 },
        faction: "Grineer",
        attacks: [
          "Fusil à Pompe Sobek: 3d8 Slash - Portée 15m, gerbe de plombs à dispersion dévastatrice",
          "Dague Sheev (Mêlée): 1d6 Puncture - Corps-à-corps, attaque réflexe",
          "Grenade à Plasma: 3d10 Blast - Portée 20m, rayon d'explosion 4m"
        ].join("\n"),
        description: `<strong>Assaut Rapproché Grineer</strong><br/>
Plus résistant et mieux blindé que le Lancier de base, le Soldat (Trooper) est armé du redoutable fusil à pompe automatique <em>Sobek</em>. Il avance agressivement pour réduire la distance et déchaîner des salves à bout portant.<br/>
• <strong>Dispersion Meurtrière :</strong> À moins de 5 mètres, ses tirs au Sobek infligent +1d8 dégâts supplémentaires.<br/>
• <strong>Défense Canonique :</strong> Armure Ferrite renforcée (150). Vulnérable aux dégâts <strong>Corrosif</strong>, <strong>Perforant</strong> et <strong>Viral</strong>.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grncshield000001",
    id: "grineer-shield-lancer",
    folder: "grineerfldr00001",
    name: "Lancier à Bouclier",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/porte bouclier.png",
    prototypeToken: {
      name: "Lancier à Bouclier",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_porte_bouclier.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 100, max: 100 },
      shields: { value: 0, max: 0 },
      armor: { value: 100 },
      details: {
        level: { value: 2 },
        faction: "Grineer",
        attacks: [
          "Pistolet Viper: 2d6 Impact - Portée 25m, tir rapide par-dessus la fente du bouclier",
          "Coup de Bouclier Brutal: 1d8 Impact - Corps-à-corps, charge écrasante (Jette la cible à terre sur échec FOR DD 14)"
        ].join("\n"),
        description: `<strong>Unité Défensive Lourde</strong><br/>
Porteur d'un bouclier balistique en ferrite massif dans une main et d'un pistolet automatique <em>Viper</em> dans l'autre. Il avance méthodiquement en offrant un couvert mobile impénétrable aux troupes qui le suivent.<br/>
• <strong>Bouclier Balistique (Règle Spéciale) :</strong> Bloque 100% des attaques frontales à distance ne possédant pas de perforation d'obstacle (Punch Through). Doit être contourné, sauté ou renversé pour être vulnérable.<br/>
• <strong>Charge de Renversement :</strong> Si un ennemi s'approche au corps-à-corps, le Lancier assène un violent coup de bouclier qui renverse et étourdit la cible.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grncscorp0000001",
    id: "grineer-scorpion",
    folder: "grineerfldr00001",
    name: "Scorpion Grineer",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/scorpion.png",
    prototypeToken: {
      name: "Scorpion Grineer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_scorpion.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 150, max: 150 },
      shields: { value: 0, max: 0 },
      armor: { value: 150 },
      details: {
        level: { value: 2 },
        faction: "Grineer",
        attacks: [
          "Harpon d'Attraction (Grapple): 1d10 Slash - Portée 20m, propulse un câble barbelé qui attire la cible à ses pieds et la renverse",
          "Machette Grineer: 2d8 Slash - Corps-à-corps, taillade violente sur une cible à terre"
        ].join("\n"),
        description: `<strong>Assassin Féminin d'Interception</strong><br/>
Unité de corps-à-corps agile et impitoyable. Dès qu'elle repère une Warframe à portée, elle projette un câble grappin électro-magnétique muni d'un harpon barbelé pour arracher la cible à sa position, la traîner au sol et la lacérer de coups de machette.<br/>
• <strong>Traction d'Entrave :</strong> La cible touchée par le Harpon doit réussir un jet de Dextérité ou de Force (DD 14) sous peine d'être tirée jusqu'au Scorpion et de tomber <em>À Terre (Prone)</em>.<br/>
• <strong>Coup de Grâce :</strong> Attaque avec avantage contre les cibles à terre.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "vulnerable",
        gas: "vulnerable",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grncseeker000001",
    id: "grineer-seeker",
    folder: "grineerfldr00001",
    name: "Chercheur / Ingénieur",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/chercheur.png",
    prototypeToken: {
      name: "Chercheur Grineer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_chercheur.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 100, max: 100 },
      shields: { value: 0, max: 0 },
      armor: { value: 200 },
      details: {
        level: { value: 2 },
        faction: "Grineer",
        attacks: [
          "Pistolet Kraken (Double Rafale): 2d8 Impact - Portée 30m, rafale de 2 balles perforantes lourdes",
          "Déploiement Mine Sangsue (Latcher): 3d8 Blast - Portée 15m, largue 1 à 2 mines sphériques autonomes qui traquent les cibles",
          "Dague Sheev (Mêlée): 1d6 Puncture - Corps-à-corps, défense d'urgence"
        ].join("\n"),
        description: `<strong>Ingénieur Tactique & Déploiement</strong><br/>
Le Chercheur (Seeker) évite l'affrontement direct et privilégie les tirs de couverture tout en déployant des mines mobiles appelées <em>Latchers</em>. Il cherche fréquemment les consoles de commande pour déclencher le confinement d'urgence (Lockdown) et déclencher les alarmes.<br/>
• <strong>Mines Latchers :</strong> Largue de petites mines sphériques qui roulent vers les Warframes, s'y accrochent et explosent après un court délai.<br/>
• <strong>Armure Renforcée :</strong> Blindage d'ingénierie de 200 Armor.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grncbutcher00001",
    id: "grineer-butcher",
    folder: "grineerfldr00001",
    name: "Boucher Grineer",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/boucher.png",
    prototypeToken: {
      name: "Boucher Grineer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_boucher.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 50, max: 50 },
      shields: { value: 0, max: 0 },
      armor: { value: 5 },
      details: {
        level: { value: 1 },
        faction: "Grineer",
        attacks: [
          "Hachoirs Cleaver (Double Frappe): 2d6 Slash - Corps-à-corps, taillade frénétique (Critique sur 19-20)"
        ].join("\n"),
        description: `<strong>Troupe de Choc Sacrifiable</strong><br/>
Fanatique et sous-équipé, le Boucher compense son absence de blindage par une agressivité suicidaire. Armé d'une paire de machettes-hachoirs <em>Cleavers</em>, il sprinte à découvert en hurlant des imprécations pour saturer les lignes défensives.<br/>
• <strong>Sprint Frénétique :</strong> Peut utiliser son action bonus pour foncer au contact.<br/>
• <strong>Vulnérabilité Extrême :</strong> Quasiment dépourvu d'armure (5 Armor), il succombe instantanément aux dégâts Tranchants, Viraux et de Gaz.`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "vulnerable",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "vulnerable",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grncballista0001",
    id: "grineer-ballista",
    folder: "grineerfldr00001",
    name: "Baliste Grineer",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/ballista.png",
    prototypeToken: {
      name: "Baliste Grineer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_baliste.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 100, max: 100 },
      shields: { value: 0, max: 0 },
      armor: { value: 100 },
      details: {
        level: { value: 3 },
        faction: "Grineer",
        attacks: [
          "Fusil Sniper Vulkar (Tir Ciblé): 2d12 Puncture - Portée 80m, balle perforante de haute précision (Visée laser préalable)",
          "Dague Sheev (Mêlée): 1d6 Puncture - Corps-à-corps, défense d'extrême urgence"
        ].join("\n"),
        description: `<strong>Tireuse d'Élite Grineer</strong><br/>
Embusquée sur les plateformes surélevées, les passerelles ou en fond de salle, la Baliste traque ses cibles à l'aide d'un faisceau laser rouge visible avant de faire feu avec son puissant fusil sniper <em>Vulkar</em>.<br/>
• <strong>Visée Télémétrique :</strong> Si la Baliste ne se déplace pas pendant son tour, son tir inflige un coup critique automatique sur un jet de 18-20.<br/>
• <strong>Tir Perforant :</strong> Ignore 50% de la réduction d'armure de la cible.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grnchvygun000001",
    id: "grineer-heavy-gunner",
    folder: "grineerfldr00001",
    name: "Artilleur Lourd Grineer",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/HeavyGunnerDE.png",
    prototypeToken: {
      name: "Artilleur Lourd",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_artilleur_lourd.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 300, max: 300 },
      shields: { value: 0, max: 0 },
      armor: { value: 500 },
      details: {
        level: { value: 4 },
        faction: "Grineer",
        attacks: [
          "Mitrailleuse Lourde Gorgon: 3d10 Impact - Portée 40m, barrage de tirs automatiques à montée en cadence continue",
          "Onde de Choc Sismique (Ground Slam): 2d8 Impact - Rayon 10m au sol, frappe violemment le sol et projette/renverse toutes les cibles (DEX DD 15)",
          "Dague Sheev (Mêlée): 1d6 Puncture - Corps-à-corps"
        ].join("\n"),
        description: `<strong>Colosse de Répression Lourde</strong><br/>
Équipée d'un blindage en ferrite massif (500 Armor) et de la redoutable mitrailleuse lourde rotative <em>Gorgon</em>. Plus elle tire, plus sa cadence s'accélère, transformant le champ de bataille en un déluge d'acier.<br/>
• <strong>Onde de Choc Sismique :</strong> Si des Warframes s'approchent à moins de 10 mètres, l'Artilleur Lourd abat son poing au sol, créant une onde de choc sismique qui renverse et étourdit tout le monde autour d'elle.<br/>
• <strong>Résistance Supérieure :</strong> Réduit passivement tous les dégâts subis grâce à son armure colossale.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grncbombard00001",
    id: "grineer-bombard",
    folder: "grineerfldr00001",
    name: "Bombardier Grineer",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/bombardier.png",
    prototypeToken: {
      name: "Bombardier Grineer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_bombardier.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 300, max: 300 },
      shields: { value: 0, max: 0 },
      armor: { value: 500 },
      details: {
        level: { value: 4 },
        faction: "Grineer",
        attacks: [
          "Lance-Roquettes Ogris: 3d12 Blast - Portée 50m, roquette à tête chercheuse thermique, rayon d'explosion 5m (Renversement automatique)",
          "Onde de Choc Sismique (Ground Slam): 2d8 Impact - Rayon 10m au sol, onde de déflagration renversante",
          "Dague Sheev (Mêlée): 1d6 Puncture - Corps-à-corps"
        ].join("\n"),
        description: `<strong>Artillerie Lourde Cuirassée</strong><br/>
Unité de siège blindée transportant le lance-roquettes <em>Ogris</em>. Ses projectiles autopropulsés traquent les cibles à la chaleur et infligent des explosions titanesques capables de renverser même les Warframes les plus massives.<br/>
• <strong>Roquettes Téléguidées :</strong> Les roquettes de l'Ogris contournent partiellement les couvertures standards.<br/>
• <strong>Souffle Dévastateur :</strong> Toute cible prise dans l'explosion est jetée à terre.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "grncnoxchem00001",
    id: "grineer-nox",
    folder: "grineerfldr00001",
    name: "Nox Grineer (Chem Strike)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/nox.png",
    prototypeToken: {
      name: "Nox Grineer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/token_nox.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 350, max: 350 },
      shields: { value: 0, max: 0 },
      armor: { value: 500 },
      details: {
        level: { value: 5 },
        faction: "Grineer",
        attacks: [
          "Canon Chimique Stug: 2d10 Toxin - Portée 25m, projette des amas de gelée toxique visqueuse (Applique 1d6 poison par tour pendant 3 tours)",
          "Charge & Écrasement Brutal: 2d8 Impact - Corps-à-corps, charge aveugle renversant les cibles",
          "Déflagration Toxique Mortelle: 3d10 Toxin - Déclenchée à la mort du Nox, libère un nuage d'acide corrosif dans un rayon de 8m"
        ].join("\n"),
        description: `<strong>Unité Chimique d'Élite (Chem Strike)</strong><br/>
Combattant imposant revêtu d'une combinaison pressurisée hermétique remplie de biocides expérimentaux. Il tire des boules de gelée corrosive qui ralentissent et consument leurs victimes.<br/>
• <strong>Blindage Intégral Chimique (Règle Spéciale) :</strong> Le Nox subit <strong>-90% de dégâts</strong> sur l'ensemble de son corps.<br/>
• <strong>Point Faible : Casque de Verre :</strong> Son seul point vulnérable est sa visière de casque en verre renforcé (Points de vie du casque : 50). Dès que le casque est brisé, le Nox perd sa résistance de 90% et subit des dégâts critiques doublés à la tête !<br/>
• <strong>Explosion Toxique Finale :</strong> À sa mort, sa combinaison implose et inonde la zone d'un gaz acide suffocant.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "immune",
        blast: "normal",
        corrosive: "vulnerable",
        gas: "immune",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  }
];

export const KUVA_ADVERSARIES = [
  {
    _id: "kuvclancer000001",
    id: "kuva-lancer",
    folder: "grineerfldr00001",
    name: "Lancier Kuva (Kuva Lancer)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_lancer.png",
    prototypeToken: {
      name: "Lancier Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_lancier_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 140, min: 0, max: 140 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 200 },
      details: {
        level: { value: 2 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Fusil Automatique Kohm Kuva: 2d10 Slash - Portée 25m, cadence croissante libérant une pluie de plombs tranchants",
          "Dague Sheev Kuva (Mêlée): 1d8 Puncture - Corps-à-corps, estoc rapide",
          "Grenade Plasma Kuva: 3d10 Blast - Portée 20m, rayon d'explosion 4m"
        ].join("\n"),
        description: `<strong>Infanterie d'Assaut de la Forteresse Kuva</strong><br/>
Revêtus d'armures composites noires et cramoisies renforcées aux fluides de Kuva. Ils manient le fusil à dispersion <em>Kohm Kuva</em> dont la cadence s'accélère au fur et à mesure des tirs.<br/>
• <strong>Dispersion Surchargée :</strong> Après 2 rounds de tir consécutifs, le Kohm gagne +1d10 dégâts supplémentaires.<br/>
• <strong>Défense Canonique :</strong> Armure Ferrite Kuva renforcée (200). Vulnérable au <strong>Corrosif</strong>, <strong>Perforant</strong> et <strong>Viral</strong>.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvcelitelanc001",
    id: "kuva-elite-lancer",
    folder: "grineerfldr00001",
    name: "Lancier d'Élite Kuva (Kuva Elite Lancer)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_elite_lancer.png",
    prototypeToken: {
      name: "Lancier d'Élite Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_lancier_elite_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 180, min: 0, max: 180 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 300 },
      details: {
        level: { value: 3 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Fusil à Rafales Hind Kuva: 3d8 Puncture - Portée 40m, salve de 5 projectiles perforants lourds",
          "Dague de Choc Kuva: 1d8 Puncture + 1d6 Electricity - Corps-à-corps",
          "Grenade Incendiaire Kuva: 3d8 Heat - Portée 20m, zone embrasée au sol"
        ].join("\n"),
        description: `<strong>Vétéran d'Élite de la Garde Royale</strong><br/>
Sélectionnés parmi les meilleurs clones pour garder les couloirs stratégiques de la Forteresse Kuva. Leur fusil <em>Hind Kuva</em> délivre des rafales chirurgicales capables de transpercer les boucliers légers.<br/>
• <strong>Tirs Coordonnés :</strong> Si deux lanciers d'élite ciblent la même Warframe, ils bénéficient de l'avantage à l'attaque.<br/>
• <strong>Blindage Alliage Supérieur :</strong> 300 d'armure en alliage.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "vulnerable",
        electricity: "resistant",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "resistant",
        radiation: "vulnerable",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvcshield000001",
    id: "kuva-shield-lancer",
    folder: "grineerfldr00001",
    name: "Lancier à Bouclier Kuva (Kuva Shield Lancer)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_shield_lancer.png",
    prototypeToken: {
      name: "Lancier à Bouclier Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_porte_bouclier_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 160, min: 0, max: 160 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 300 },
      details: {
        level: { value: 3 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Pistolet Brakk Kuva: 2d10 Impact + 1d6 Puncture - Portée 20m, salve de plombs perforants lourds",
          "Charge Écrasante au Pavois Kuva: 2d8 Impact - Corps-à-corps, jette la cible à terre (FOR DD 15)"
        ].join("\n"),
        description: `<strong>Rempart Défensif Renforcé</strong><br/>
Équipé d'un pavois blindé impénétrable laqué au Kuva rouge et noir. Il forme une ligne infranchissable tout en arrosant les cibles au pistolet semi-automatique lourd <em>Brakk Kuva</em>.<br/>
• <strong>Pavois Absolu Frontal :</strong> Annule tous les dégâts des attaques à distance de face ne possédant pas de perforation d'obstacle (Punch Through).<br/>
• <strong>Percussion Renversante :</strong> Charge et renverse violemment les ennemis au corps-à-corps.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvcflamebld0001",
    id: "kuva-flameblade",
    folder: "grineerfldr00001",
    name: "Lame Flamboyante Kuva (Kuva Flameblade)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_flameblade.png",
    prototypeToken: {
      name: "Lame Flamboyante Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_lame_flamboyante_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 160, min: 0, max: 160 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 200 },
      details: {
        level: { value: 3 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Haches Jumelles Twin Basolk: 3d8 Heat + 1d8 Slash - Corps-à-corps, doubles lames thermiques incandescentes",
          "Téléportation Pyro-Tactique: Se téléporte instantanément jusqu'à 15m derrière une cible et frappe immédiatement avec avantage (Recharge 5-6)"
        ].join("\n"),
        description: `<strong>Duelliste Thermique Téléporteur</strong><br/>
Maniant la paire de haches thermiques <em>Twin Basolk</em> surchauffées à blanc, la Lame Flamboyante utilise un module de téléportation à courte portée pour contourner les défenses et frapper dans le dos.<br/>
• <strong>Flammes Persistantes :</strong> Les cibles touchées subissent 1d8 dégâts de Feu à chaque début de tour (durée 2 tours).<br/>
• <strong>Mobilité Téléportation :</strong> Peut disparaître en un éclair de fumée et réapparaître au contact.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "immune",
        cold: "vulnerable",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvcjester000001",
    id: "kuva-jester",
    folder: "grineerfldr00001",
    name: "Bouffon Kuva (Kuva Jester)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_jester.png",
    prototypeToken: {
      name: "Bouffon Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_bouffon_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 90, min: 0, max: 90 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 80 },
      details: {
        level: { value: 2 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Griffes Acérées de Bouffon: 2d6 Slash + 1d4 Puncture - Corps-à-corps, griffage frénétique",
          "Bond Parasite & Aveuglement: Portée 12m, bondit sur le casque ou les épaules d'une Warframe. La cible est Aveuglée, Ralentie et subit 1d6 Slash par tour jusqu'à réussir un jet de FOR ou DEX DD 15 pour l'arracher."
        ].join("\n"),
        description: `<strong>Gremlin Parasite Sadique</strong><br/>
Créature difforme et hyperactive servant de mascotte et d'auxiliaire aux Gardiens Kuva. Il chevauche généralement leurs épaules avant de s'élancer à une vitesse folle sur les Warframes pour leur obstruer la vue et leur lacérer le visage.<br/>
• <strong>Petite Taille & Agilité :</strong> Bénéficie de +3 en Défense (CA) et de l'esquive acrobatique contre les tirs.<br/>
• <strong>Désorientation Totale :</strong> Tant que le Bouffon est agrippé à une Warframe, tous ses jets d'attaque et de compétences ont un désavantage.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "vulnerable",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "vulnerable",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvctrokar000001",
    id: "kuva-trokar",
    folder: "grineerfldr00001",
    name: "Trokarien Kuva (Kuva Trokarian)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_trokar.png",
    prototypeToken: {
      name: "Trokarien Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_trokarien_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 250, min: 0, max: 250 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 350 },
      details: {
        level: { value: 4 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Fusil Mitrailleur Trokar: 2d10 Puncture + 1d8 Impact - Portée 35m, cadence lourde",
          "Balise d'Entrave Neurale Kuva: Portée 20m, projette une balise créant un dôme d'entrave de 6m. Les Warframes dans la zone sont Entravées (DEX DD 15)",
          "Dague Énergétique Kuva: 1d8 Puncture - Corps-à-corps"
        ].join("\n"),
        description: `<strong>Spécialiste de Neutralisation & Capture</strong><br/>
Conçu spécifiquement pour entraver et capturer les agents Tenno. Il déploie des balises de stase magnétique qui figent les mouvements des Warframes et bloquent leurs capacités d'esquive rapide.<br/>
• <strong>Balise d'Entrave :</strong> La balise dispose de 50 PV. La détruire libère immédiatement les cibles piégées.<br/>
• <strong>Résistance Supérieure :</strong> Blindage d'alliage lourd (350).`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "vulnerable",
        electricity: "resistant",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "resistant",
        radiation: "vulnerable",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvcbailiff00001",
    id: "kuva-bailiff",
    folder: "grineerfldr00001",
    name: "Bailli Kuva (Kuva Bailiff)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_bailiff.png",
    prototypeToken: {
      name: "Bailli Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_bailli_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 450, min: 0, max: 450 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 500 },
      details: {
        level: { value: 5 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Masse à Réaction Jat Kittag Kuva: 3d10 Impact + 1d8 Heat - Corps-à-corps, fracas colossal propulsant la cible à 10m (FOR DD 16)",
          "Écrasement Sismique Déflagrant: 2d10 Blast - Rayon 8m au sol, onde sismique renversant toutes les créatures"
        ].join("\n"),
        description: `<strong>Bourreau Géant de la Forteresse</strong><br/>
Clone difforme de stature herculéenne, cybernétiquement greffé d'une armure blindée massive et muni d'une version surdimensionnée de la masse à réaction <em>Jat Kittag</em>.<br/>
• <strong>Propulsion Sismique :</strong> Chaque coup de masse repousse violemment les victimes et déstabilise les lignes Tenno.<br/>
• <strong>Immunité aux Renversements :</strong> Grâce à son inertie colossale, le Bailli ne peut pas être mis à terre ni projeté.`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "resistant",
        corrosive: "vulnerable",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvchvygun000001",
    id: "kuva-heavy-gunner",
    folder: "grineerfldr00001",
    name: "Artilleur Lourd Kuva (Kuva Heavy Gunner)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_heavy_gunner.png",
    prototypeToken: {
      name: "Artilleur Lourd Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_artilleur_lourd_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 400, min: 0, max: 400 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 600 },
      details: {
        level: { value: 4 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Canon Flak Kuva Drakgoon / Grattler: 3d10 Slash + 1d10 Impact - Portée 35m, barrage de shrapnels perforants lourds",
          "Onde de Choc Sismique Kuva: 2d8 Impact - Rayon 10m, onde de déflagration renversant et repoussant les cibles (DEX DD 15)",
          "Dague Sheev Kuva: 1d8 Puncture - Corps-à-corps"
        ].join("\n"),
        description: `<strong>Forteresse Vivante de Répression</strong><br/>
Porteuse d'un blindage en alliage Kuva ultra-lourd (600 Armor) et armée d'une version Kuva surpuissante du canon à fragmentation <em>Drakgoon</em>. Ses salves déchiquètent les protections et nettoient les salles en quelques secondes.<br/>
• <strong>Onde de Choc Sismique :</strong> Frappe le sol de son poing pour repousser quiconque s'approche au corps-à-corps.<br/>
• <strong>Cuirasse en Alliage :</strong> Résistance exceptionnelle, vulnérable aux dégâts de <strong>Radiation</strong> (+75%) et de <strong>Froid</strong> (+25%).`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "vulnerable",
        electricity: "resistant",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "resistant",
        radiation: "vulnerable",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvcbombard00001",
    id: "kuva-bombard",
    folder: "grineerfldr00001",
    name: "Bombardier Kuva (Kuva Bombard)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_bombard.png",
    prototypeToken: {
      name: "Bombardier Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_bombardier_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 450, min: 0, max: 450 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 650 },
      details: {
        level: { value: 5 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Lance-Roquettes Ogris Kuva: 3d12 Blast + 1d8 Heat - Portée 50m, missiles guidés incendiaires à déflagration thermique (Renversement automatique)",
          "Onde Sismique Terrestre: 2d8 Impact - Rayon 10m, onde de souffle renversante",
          "Dague Sheev Kuva: 1d8 Puncture - Corps-à-corps"
        ].join("\n"),
        description: `<strong>Artillerie de Siège Incendiaire</strong><br/>
Doté du lance-roquettes lourd <em>Ogris Kuva</em>, ce colosse tire des missiles autoguidés chargés de napalm Kuva qui traquent les Warframes et provoquent des explosions thermiques en chaîne.<br/>
• <strong>Roquettes Téléguidées Incendiaires :</strong> Poursuivent les cibles autour des obstacles et laissent des zones enflammées.<br/>
• <strong>Super-Blindage :</strong> 650 points d'armure en alliage.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "vulnerable",
        electricity: "resistant",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "resistant",
        radiation: "vulnerable",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "kuvcguardian0001",
    id: "kuva-guardian",
    folder: "grineerfldr00001",
    name: "Gardien Kuva (Kuva Guardian)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_guardian.png",
    prototypeToken: {
      name: "Gardien Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_gardien_kuva.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 600, min: 0, max: 600 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 700 },
      details: {
        level: { value: 6 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Hallebarde Kesheg Royale: 3d10 Puncture + 2d8 Slash - Corps-à-corps, balayage dévastateur fendant les armures",
          "Double Pistolet Kuva Twin Rogga: 3d8 Impact - Portée 15m, double décharge d'artillerie de poche",
          "Écrasement de Barde Kuva: 2d10 Impact - Onde de souffle étourdissante (DEX DD 16)"
        ].join("\n"),
        description: `<strong>Garde Impériale Prétorienne des Reines</strong><br/>
Protecteurs jurés et incorruptibles des Reines Grineer, vêtus d'armures d'apparat massives et armés de la légendaire hallebarde <em>Kesheg</em> et des pistolets <em>Twin Rogga</em>.<br/>
• <strong>Invulnérabilité Impériale (Règle Canonique) :</strong> Le Gardien Kuva est <strong>totalement immunisé</strong> à toutes les armes et pouvoirs des Warframes tant qu'il porte son Kesheg. Seule une ruade du Néant (Void Dash) ou une décharge Néantique de l'Opérateur Tenno peut le désarmer et dissiper son invulnérabilité pendant 2 tours !<br/>
• <strong>Bouclier de Barde :</strong> Protège également les Bouffons Kuva qui se perchent sur ses épaules.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "vulnerable",
        electricity: "resistant",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "resistant",
        radiation: "vulnerable",
        viral: "normal",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "kuvclich00000001",
    id: "kuva-lich",
    folder: "grineerfldr00001",
    name: "Liche Kuva (Kuva Lich)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/kuva_lich.png",
    prototypeToken: {
      name: "Liche Kuva",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/grineer/kuva/token_liche_kuva.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 1100, min: 0, max: 1100 },
      shields: { value: 400, min: 0, max: 400 },
      armor: { value: 800 },
      details: {
        level: { value: 9 },
        faction: "Grineer (Kuva)",
        attacks: [
          "Arme Kuva Signature (Kuva Bramma / Zarr): 4d12 Blast + 2d8 Impact - Portée 50m, tir d'artillerie dévastateur générant des sous-munitions en grappe",
          "Décharge Élémentaire de Souche Warframe: 3d10 Heat/Electricity/Toxin/Cold - Rayon 15m, explosion élémentaire absorbée de son géniteur",
          "Prise Fracassante des Reins (Bane Grasp): 4d10 Impact - Corps-à-corps, empoigne la Warframe par le cou, lui brise la colonne vertébrale et la projette au sol (Jet de sauvegarde FOR DD 18)"
        ].join("\n"),
        description: `<strong>Champion Immortel Nemesis des Tenno</strong><br/>
Soldat Grineer ressuscité par transfusion directe de Kuva royal, ayant assimilé les gènes et capacités de la Warframe qui l'a abattu. Il traque les Tenno à travers le Système Origine et prend le contrôle de secteurs entiers.<br/>
• <strong>Immortalité Kuva & Parazon Requiem (Règle Canonique) :</strong> Lorsque les PV de la Liche tombent à 0, elle s'agenouille mais ne meurt pas. Elle ne peut être vaincue que par un coup de grâce au Parazon équipé de la <strong>séquence exacte de 3 Mods Requiem</strong>. Si la séquence échoue, la Liche exécute instantanément la Warframe, gagne +1 Rang de Menace (+250 PV) et s'enfuit dans la Forteresse Kuva !<br/>
• <strong>Téléportation de Traque :</strong> Peut se téléporter à volonté pour surprendre ou fuir une embuscade.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "resistant",
        toxin: "normal",
        blast: "resistant",
        corrosive: "resistant",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "vulnerable",
        viral: "normal",
        void: "vulnerable"
      }
    }
  }
];

export const CORPUS_ADVERSARIES = [
  {
    _id: "crpcrewman000001",
    id: "corpus-crewman",
    folder: "corpusfldr000001",
    name: "Homme d'Équipage Corpus",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/CrewmanNormal.png",
    prototypeToken: {
      name: "Homme d'Équipage Corpus",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_homme_equipage.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 60, max: 60 },
      shields: { value: 150, max: 150 },
      armor: { value: 0 },
      details: {
        level: { value: 1 },
        faction: "Corpus",
        attacks: [
          "Fusil Plasma Dera: 2d6 Puncture + 1d6 Electricity - Portée 30m, tir automatique d'énergie à moyenne portée",
          "Bâton Prova (Mêlée): 1d6 Electricity - Décharge paralysante au corps-à-corps"
        ].join("\n"),
        description: `<strong>Infanterie Régulière Corpus</strong><br/>
Sous contrat corporatif draconien, les Hommes d'Équipage manient le fusil à plasma <em>Dera</em> et portent un casque sous vide pressurisé. Contrairement aux Grineers lourdement blindés, leur défense repose sur de puissants <strong>Boucliers Énergétiques</strong> rechargeables.<br/>
• <strong>Points Faibles Canoniques :</strong> Leurs boucliers fondent sous les dégâts <strong>Magnétiques</strong> (+50%) et d'<strong>Impact</strong> (+25%), tandis que la <strong>Toxine</strong> (+50%) contourne complètement leurs boucliers pour frapper directement leur chair.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resistant",
        electricity: "normal",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "resistant",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crpsniper0000001",
    id: "corpus-sniper",
    folder: "corpusfldr000001",
    name: "Sniper Corpus",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/CrewmanSniper.png",
    prototypeToken: {
      name: "Sniper Corpus",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_sniper_corpus.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 75, max: 75 },
      shields: { value: 180, max: 180 },
      armor: { value: 0 },
      details: {
        level: { value: 2 },
        faction: "Corpus",
        attacks: [
          "Fusil Sniper Lanka: 2d12 Electricity - Portée 60m, tir de précision à haute perforation",
          "Déploiement de Ratel: Invoque 2 micro-robots Ratels rapides au sol (Délai 2 tours)"
        ].join("\n"),
        description: `<strong>Tireur d'Élite Corpus (Combinaison Jaune)</strong><br/>
Posté en surplomb sur les passerelles, le Sniper Corpus cible les Warframes à très longue distance avec son fusil sniper à rail <em>Lanka</em>. Lorsqu'il est sous pression, il déploie de petits robots à chenilles <em>Ratels</em> pour harceler les assaillants.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resistant",
        electricity: "normal",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "resistant",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crptech000000001",
    id: "corpus-tech",
    folder: "corpusfldr000001",
    name: "Technicien Corpus (Tech)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/CrewmanTech.png",
    prototypeToken: {
      name: "Technicien Corpus",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_technicien_corpus.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 200, max: 200 },
      shields: { value: 250, max: 250 },
      armor: { value: 50 },
      details: {
        level: { value: 3 },
        faction: "Corpus",
        attacks: [
          "Mitrailleuse Laser Supra: 3d8 Puncture + 1d8 Electricity - Cadence infernale, tir de saturation dévastateur",
          "Largage Drone de Bouclier: Déploie un Shield Osprey pour recharger instantanément son escouade"
        ].join("\n"),
        description: `<strong>Unité Lourde Corpus (Combinaison Rouge)</strong><br/>
Le Technicien Corpus est l'un des ennemis d'infanterie les plus redoutables du Système Origine. Armé de la redoutable mitrailleuse lourde laser <em>Supra</em>, il fait pleuvoir un déluge de plasma continu capable de faire fondre les boucliers des Warframes en quelques secondes.<br/>
• <strong>Soutien Robotique :</strong> Il déploie régulièrement un Drone Bouclier pour restaurer ses protections et celles de ses alliés.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resistant",
        electricity: "normal",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "resistant",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crpnull000000001",
    id: "corpus-nullifier",
    folder: "corpusfldr000001",
    name: "Sapeur Zéro (Nullifier Crewman)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/CrpNullRanger.png",
    prototypeToken: {
      name: "Sapeur Zéro",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_homme_equipage_zero.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 90, max: 90 },
      shields: { value: 150, max: 150 },
      armor: { value: 0 },
      details: {
        level: { value: 3 },
        faction: "Corpus",
        attacks: [
          "Bulle Zéro d'Annulation: Champ énergétique hémisphérique (rayon 6m) bloquant les tirs et désactivant immédiatement TOUS les pouvoirs Warframe actifs",
          "Fusil Sniper Lanka: 2d10 Electricity - Tir précis depuis l'intérieur de sa bulle protectrice"
        ].join("\n"),
        description: `<strong>Spécialiste de Neutralisation des Tenno</strong><br/>
Équipé d'un générateur dorsal projetant une immense coupole d'énergie dorée. Cette <strong>Bulle Zéro</strong> bloque tous les projectiles externes et dissipe instantanément les Pouvoirs de Warframe de tout Tenno qui y pénètre.<br/>
• <strong>Contre-Mesure :</strong> Un petit drone projecteur tourne au sommet de la bulle. Tirer sur ce drone détruit immédiatement la bulle protectrice !`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resistant",
        electricity: "normal",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "resistant",
        viral: "vulnerable",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "crpmoa0000000001",
    id: "corpus-moa",
    folder: "corpusfldr000001",
    name: "Moa Corpus",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/MOADE.png",
    prototypeToken: {
      name: "Moa Corpus",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_moa.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 100, max: 100 },
      shields: { value: 100, max: 100 },
      armor: { value: 50 },
      details: {
        level: { value: 1 },
        faction: "Corpus",
        attacks: [
          "Canon Répéteur Laser (Dôme): 2d6 Puncture - Cadence soutenue portée 25m",
          "Coup de Patte Bipède: 1d8 Impact - Frappe de recul au corps-à-corps"
        ].join("\n"),
        description: `<strong>Plateforme Robotique Bipède Autonome</strong><br/>
L'épine dorsale des armées mécanisées Corpus. Le Moa avance à pas réguliers en tirant avec son canon d'énergie monté sur pivot dorsal.<br/>
• <strong>Défense Robotique :</strong> Vulnérable aux surcharges d'<strong>Électricité</strong> (+50%) et à la <strong>Radiation</strong> (+50%), mais totalement insensible aux saignements conventionnels.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "vulnerable",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpshockmoa00001",
    id: "corpus-shockwave-moa",
    folder: "corpusfldr000001",
    name: "Moa Onde de Choc (Shockwave Moa)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/ShockwaveMOADE.png",
    prototypeToken: {
      name: "Moa Onde de Choc",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_moa_onde_de_choc.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 120, max: 120 },
      shields: { value: 150, max: 150 },
      armor: { value: 75 },
      details: {
        level: { value: 2 },
        faction: "Corpus",
        attacks: [
          "Onde de Choc Sismique: 2d8 Impact - Frotte et piétine le sol pour émettre une onde circulaire (rayon 10m). Toutes les créatures au sol sont Renversées (Knockdown) à moins de réussir un Jet de Sauvegarde de Dextérité DD 14",
          "Laser Impulsionnel: 2d6 Puncture - Portée 20m"
        ].join("\n"),
        description: `<strong>Unité Robotique de Répression Sismique (Moa Orange)</strong><br/>
Spécialisé dans le contrôle de foule, ce Moa piétine le sol avec force pour libérer une onde de choc bleutée qui renverse violemment les Warframes au sol, les laissant vulnérables aux tirs d'escouade.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "vulnerable",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crposprey0000001",
    id: "corpus-shield-osprey",
    folder: "corpusfldr000001",
    name: "Drone Bouclier (Shield Osprey)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/ShieldOspreyDE.png",
    prototypeToken: {
      name: "Drone Bouclier",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_drone_bouclier.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 75, max: 75 },
      shields: { value: 200, max: 200 },
      armor: { value: 25 },
      details: {
        level: { value: 2 },
        faction: "Corpus",
        attacks: [
          "Surcharge de Bouclier Alliée: Se lie par faisceau à 2 alliés proches (15m), conférant +150 Boucliers Max et régénérant 50 Boucliers par tour",
          "Tir Défensif Impulsionnel: 1d8 Electricity - Portée 15m"
        ].join("\n"),
        description: `<strong>Drone Volant de Soutien Tactique</strong><br/>
Flottant au-dessus des lignes d'infanterie, l'Osprey projette des liens énergétiques qui surchargent et restaurent en continu les boucliers des troupes Corpus environnantes. C'est la cible prioritaire absolue à abattre dans tout engagement Corpus !`
      },
      resistances: {
        impact: "resistant",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "vulnerable",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpraknoid000001",
    id: "corpus-mite-raknoid",
    folder: "corpusfldr000001",
    name: "Mite Raknoïde (Mite Raknoid)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/MiteRaknoid.webp",
    prototypeToken: {
      name: "Mite Raknoïde",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_mite_raknoide.png"
      },
      width: 0.5,
      height: 0.5,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 35, max: 35 },
      shields: { value: 35, max: 35 },
      armor: { value: 10 },
      details: {
        level: { value: 1 },
        faction: "Corpus",
        attacks: [
          "Bond Arachnide & Morsure Acide: 1d8 Corrosive + 1d6 Toxin - Bondit à 12m et injecte un liquide rongeur d'armure"
        ].join("\n"),
        description: `<strong>Miniature Arachnoïde de la Vallée d'Orbis</strong><br/>
Créature mécanique agile se déplaçant en essaim sur les murs, plafonds et tuyauteries. Elle bondit directement sur le torse des Warframes pour percer l'armure de ses mandibules acides.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "vulnerable",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpfusionmoa0001",
    id: "corpus-fusion-moa",
    folder: "corpusfldr000001",
    name: "Moa Fusion (Fusion Moa)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/FusionMOADE.png",
    prototypeToken: {
      name: "Moa Fusion",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_moa_fusion.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 250, max: 250 },
      shields: { value: 250, max: 250 },
      armor: { value: 200 },
      details: {
        level: { value: 4 },
        faction: "Corpus",
        attacks: [
          "Rayon Thermique Fusion Continu: 3d10 Heat - Faisceau à fusion ininterrompu faisant fondre 10% d'armure par tir consécutif",
          "Largage Drone Tactique: Lorsque ses boucliers sont détruits, éjecte un drone d'attaque automatique armé de lasers légers (2d6 Puncture)"
        ].join("\n"),
        description: `<strong>Blindé d'Assaut Robotique d'Élite (Blanc / Or)</strong><br/>
Conçu pour rivaliser avec les blindages Grineers, le Moa Fusion intègre un canon à faisceau thermique continu capable d'incinérer n'importe quelle matière vivante ou cybernétique. Il loge un drone de défense dans son torse supérieur.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "resistant",
        cold: "vulnerable",
        electricity: "normal",
        toxin: "immune",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "vulnerable",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpjackal0000001",
    id: "corpus-jackal",
    folder: "corpusfldr000001",
    name: "Le Chacal (Jackal)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/QuadJackal.webp",
    prototypeToken: {
      name: "Le Chacal",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/token_chacal.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 40,
      displayBars: 40
    },
    system: {
      health: { value: 800, max: 800 },
      shields: { value: 500, max: 500 },
      armor: { value: 400 },
      details: {
        level: { value: 8 },
        faction: "Corpus",
        attacks: [
          "Gatling Shrapnel Lourde: 4d8 Puncture - Rafale de mitrailleuse rotative lourde (Portée 45m)",
          "Volée de Missiles Guidés: 4d10 Blast - 4 roquettes explosives traquent différentes cibles (Rayon 4m chacune)",
          "Piétinement Sismique (Pattes): 3d8 Impact - Onde sismique écrasante repoussant et renversant toutes les créatures à 12m",
          "Réseau Laser Rotatif 360° (Phase Ultime): 4d12 Heat - 4 barrières laser tourbillonnent à hauteur d'homme pendant 2 rounds, forçant les Tenno à sauter et faire du parkour pour survivre"
        ].join("\n"),
        description: `<strong>Boss Quadrupède Blindé Expérimental (Fossa, Vénus)</strong><br/>
Le Chacal est le titan quadrupède robotisé développé par le Corpus. Doté d'une résistance colossale et de boucliers multicouches, il est conçu pour exterminer les escouades de Warframes isolées.<br/>
• <strong>Points Faibles Mécaniques :</strong> Ses pattes doivent être endommagées individuellement pour le forcer à s'agenouiller et exposer son noyau dorsal aux coups de grâce Tenno !`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "vulnerable",
        electricity: "normal",
        toxin: "immune",
        blast: "resistant",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "vulnerable",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcdetron000001",
    id: "corpus-detron-crewman",
    folder: "corpusfldr000001",
    name: "Homme d'Équipage Dētron (Detron Crewman)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/detron_crewman.png",
    prototypeToken: {
      name: "Homme d'Équipage Dētron",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_homme_equipage_detron.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 80, min: 0, max: 80 },
      shields: { value: 150, min: 0, max: 150 },
      armor: { value: 0 },
      details: {
        level: { value: 2 },
        faction: "Corpus",
        attacks: [
          "Pistolet à Pompe Dētron: 2d10 Radiation - Portée 18m, salve de grenaille de plasma lourd radioactif (Peut appliquer Confusion/Radiation sur échec CON DD 13)",
          "Bâton Prova (Mêlée): 1d6 Electricity - Corps-à-corps, décharge paralysante réflexe"
        ].join("\n"),
        description: `<strong>Garde Rapprochée & Assaut Radioactif</strong><br/>
Équipé d'une combinaison pressurisée renforcée et du pistolet à dispersion de plasma lourd <em>Dētron</em>. Ses décharges d'énergie pure infligent des dégâts de <strong>Radiation</strong> dévastateurs contre les armures en alliage et peuvent induire une confusion chimique poussant les Warframes à cibler leurs alliés.<br/>
• <strong>Statut Radiation (Confusion) :</strong> Sur échec à la sauvegarde de Constitution (DD 13), la cible subit le statut Radiation et considère temporairement ses alliés comme des ennemis.<br/>
• <strong>Défense de Boucliers :</strong> Vulnérable au <strong>Magnétique</strong> (+75%) et à l'<strong>Impact</strong> (+25%). La <strong>Toxine</strong> contourne ses boucliers.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resistant",
        electricity: "normal",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "resistant",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcprod00000001",
    id: "corpus-prod-crewman",
    folder: "corpusfldr000001",
    name: "Homme d'Équipage au Bâton (Prod Crewman)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/prod_crewman.png",
    prototypeToken: {
      name: "Homme d'Équipage au Bâton",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_homme_equipage_prod.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 70, min: 0, max: 70 },
      shields: { value: 120, min: 0, max: 120 },
      armor: { value: 0 },
      details: {
        level: { value: 1 },
        faction: "Corpus",
        attacks: [
          "Bâton Électrifié Prova: 2d8 Electricity - Corps-à-corps, matraquage à haute tension (Paralyse la cible sur échec DEX DD 13)",
          "Sprint du Travailleur Zélé: Action bonus, double sa vitesse de déplacement pour charger au contact"
        ].join("\n"),
        description: `<strong>Fantassin de Choc & Discipline Corporative</strong><br/>
Inspiré par le mythique <em>John Prodman</em>, cet employé zélé renonce aux armes à distance pour brandir le bâton à impulsion électrique <em>Prova</em> et charger sans aucune peur les Warframes au corps-à-corps.<br/>
• <strong>Charge Héroïque du Salarié :</strong> Gagne +2 à ses jets d'attaque au corps-à-corps s'il a sprinté en ligne droite vers sa cible.<br/>
• <strong>Décharge Stun :</strong> Ses coups de Prova peuvent étourdir et priver d'actions de réaction.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resistant",
        electricity: "resistant",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcscrambus0001",
    id: "corpus-scrambus",
    folder: "corpusfldr000001",
    name: "Scrambus Corpus (Modular Disruptor)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/scrambus.png",
    prototypeToken: {
      name: "Scrambus Corpus",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_scrambus.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 150, min: 0, max: 150 },
      shields: { value: 300, min: 0, max: 300 },
      armor: { value: 25 },
      details: {
        level: { value: 4 },
        faction: "Corpus",
        attacks: [
          "Double Pistolet Énergétique Angstrum: 2d10 Impact + 1d8 Electricity - Portée 30m, tir double à haute précision",
          "Champ d'Ondes de Brouillage Modulaire: Rayon 15m invisible, bloque et désactive tous les Pouvoirs Tenno d'une catégorie (Offensif, Défensif ou Tactique) tant que le casque n'est pas détruit",
          "Propulsion Antigravitique: Lévite à 1m du sol, ignore les terrains difficiles et se déplace de 18m par tour"
        ].join("\n"),
        description: `<strong>Unité d'Interception à Lévitation Antigrav</strong><br/>
Équipé de patins à sustentation magnétique et d'un casque à distorsion modulaire qui court-circuite les résonateurs d'énergie du Néant des Tenno sans déployer de bulle visible.<br/>
• <strong>Casque de Brouillage Modulaire (Point Faible) :</strong> Le champ de brouillage est émis par son casque (50 PV). Dès que le casque est brisé par un tir de précision à la tête, le brouillage cesse immédiatement et le Scrambus subit des dégâts critiques doublés !<br/>
• <strong>Hyper-Mobilité :</strong> Plane avec fluidité au-dessus du champ de bataille et esquive les attaques de zone.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resistant",
        electricity: "resistant",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcisolbursa001",
    id: "corpus-isolator-bursa",
    folder: "corpusfldr000001",
    name: "Bursa Isolateur (Isolator Bursa)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/bursa_isolator.png",
    prototypeToken: {
      name: "Bursa Isolateur",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_bursa_isolateur.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 450, min: 0, max: 450 },
      shields: { value: 600, min: 0, max: 600 },
      armor: { value: 400 },
      details: {
        level: { value: 5 },
        faction: "Corpus",
        attacks: [
          "Fusil à Pompe Lourd à Dispersion: 3d10 Impact + 1d8 Electricity - Portée 20m, salve de dispersion lourde",
          "Harpon Grappin d'Isolation & Bulle Zéro: Portée 25m, agrippe une Warframe, l'attire à ses pieds et projette une bulle d'annulation Zéro sur elle !",
          "Frappe Sismique Écrasante: 2d10 Impact - Rayon 10m au sol, onde de choc renversant les cibles (FOR DD 16)"
        ].join("\n"),
        description: `<strong>Robot Quadripode Lourd Anti-Émeute</strong><br/>
Blindé d'acier lourd et de boucliers énergétiques massifs, le Bursa Isolateur est déployé lors des alertes de confinement maximal pour neutraliser les menaces prioritaires.<br/>
• <strong>Pavois Frontal Impénétrable :</strong> Bloque 100% des dégâts des attaques frontales. Seul son panneau arrière de contrôle (console de piratage) est vulnérable.<br/>
• <strong>Piratage Post-Mortem :</strong> Lorsqu'il est vaincu, une Warframe peut pirater sa console arrière (Piratage DD 14) pour le rallier comme allié pendant 1 minute avant qu'il ne s'auto-détruise !`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "resistant",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "resistant",
        corrosive: "normal",
        gas: "immune",
        magnetic: "vulnerable",
        radiation: "resistant",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcterraplasm01",
    id: "corpus-terra-plasmor",
    folder: "corpusfldr000001",
    name: "Homme d'Équipage Terra Plasmor",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/terra_plasmor_crewman.png",
    prototypeToken: {
      name: "Homme d'Équipage Terra Plasmor",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_homme_equipage_terra_plasmor.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 120, min: 0, max: 120 },
      shields: { value: 250, min: 0, max: 250 },
      armor: { value: 50 },
      details: {
        level: { value: 3 },
        faction: "Corpus (Vallée d'Orbis)",
        attacks: [
          "Fusil à Impulsion Arca Plasmor: 3d10 Radiation - Portée 25m, projette une vaste onde de plasma concentré traversant les cibles en ligne droite (Largeur 3m, perforation automatique)",
          "Frappe de Crosse Cryogénique: 1d8 Cold - Corps-à-corps, recul défensif"
        ].join("\n"),
        description: `<strong>Tireur Lourd de la Vallée d'Orbis</strong><br/>
Équipé pour les conditions thermiques extrêmes des terres gelées de Vénus, ce fantassin d'élite manie le redoutable fusil à impulsion <em>Arca Plasmor</em>. Ses projectiles de radiation pure vaporisent les obstacles et transpercent plusieurs cibles d'un seul tir.<br/>
• <strong>Vague de Radiation Perforante :</strong> Les tirs d'Arca Plasmor ignorent les couverts légers et frappent toutes les cibles sur leur trajectoire rectiligne.<br/>
• <strong>Résistance au Froid :</strong> Totalement immunisé aux pénalités climatiques du blizzard vénusien.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "immune",
        electricity: "normal",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "resistant",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcterramoa0001",
    id: "corpus-terra-embattor-moa",
    folder: "corpusfldr000001",
    name: "Moa Blindé Terra (Terra Embattor MOA)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/terra_embattor_moa.png",
    prototypeToken: {
      name: "Moa Blindé Terra",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_moa_embattor_terra.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 200, min: 0, max: 200 },
      shields: { value: 300, min: 0, max: 300 },
      armor: { value: 150 },
      details: {
        level: { value: 3 },
        faction: "Corpus (Vallée d'Orbis)",
        attacks: [
          "Mortier de Mines Magnétiques: 3d8 Electricity + 1d8 Magnetic - Portée 35m, bombarde une zone de 3 mines magnétiques collantes qui s'accrochent aux Warframes et drainent leurs boucliers",
          "Canon Laser Cryogénique: 2d8 Cold - Portée 30m, tir cadencé ralentissant les cibles",
          "Onde Sismique de Vénus: 2d8 Impact - Rayon 8m, repousse et déséquilibre"
        ].join("\n"),
        description: `<strong>Unité Robotique de Siège & Barrage</strong><br/>
Variante tout-terrain lourdement blindée du Moa Corpus, conçue pour opérer sur les crêtes rocheuses de la Vallée d'Orbis. Son mortier dorsal pilonne les positions des Tenno à l'aide de grappes de mines magnétiques.<br/>
• <strong>Drain Magnétique :</strong> Les mines collées divisent par deux la vitesse de recharge des boucliers des Warframes.<br/>
• <strong>Châssis Renforcé :</strong> 150 d'armure et 300 de boucliers.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "immune",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "normal",
        corrosive: "normal",
        gas: "immune",
        magnetic: "vulnerable",
        radiation: "normal",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcterramank001",
    id: "corpus-terra-manker",
    folder: "corpusfldr000001",
    name: "Équarisseur Terra (Terra Manker)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/terra_manker.png",
    prototypeToken: {
      name: "Équarisseur Terra",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_manker_terra.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 150, min: 0, max: 150 },
      shields: { value: 200, min: 0, max: 200 },
      armor: { value: 75 },
      details: {
        level: { value: 3 },
        faction: "Corpus (Vallée d'Orbis)",
        attacks: [
          "Scies Énergétiques Jumelles: 3d8 Slash + 1d6 Cold - Corps-à-corps, doubles lames rotatives tourbillonnantes (Critique sur 19-20)",
          "Propulseur Dorsal de Charge: Bondit jusqu'à 15m par-dessus les obstacles pour s'écraser au contact (Jette la cible à terre sur échec DEX DD 14)"
        ].join("\n"),
        description: `<strong>Assaillant Aéroporté au Corps-à-Corps</strong><br/>
Muni d'un jetpack dorsal puissant et d'une paire de tronçonneuses énergétiques à haute vélocité. Il patrouille le ciel de Vénus et fond sur ses cibles avec une brutalité inouïe.<br/>
• <strong>Attaque en Piqué :</strong> S'il charge depuis une position surélevée ou en vol, son premier coup inflige des dégâts doublés.<br/>
• <strong>Lacération Frénétique :</strong> Provoque des saignements continus (1d6 Slash par tour pendant 2 tours).`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "immune",
        electricity: "normal",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcterratrench1",
    id: "corpus-terra-trencher",
    folder: "corpusfldr000001",
    name: "Tranchilleur Terra (Terra Trencher)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/terra_trencher.png",
    prototypeToken: {
      name: "Tranchilleur Terra",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_trencher_terra.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 100, min: 0, max: 100 },
      shields: { value: 200, min: 0, max: 200 },
      armor: { value: 50 },
      details: {
        level: { value: 2 },
        faction: "Corpus (Vallée d'Orbis)",
        attacks: [
          "Pioche-Pique Énergétique Kreska: 2d8 Puncture + 1d6 Electricity - Corps-à-corps, perforation brutale",
          "Fusil Mitrailleur Tetra Terra: 2d8 Puncture - Portée 30m, rafale de carreaux d'énergie à haute vélocité"
        ].join("\n"),
        description: `<strong>Ouvrier d'Excavation & Assaut Rapproché</strong><br/>
Mineur militarisé forant la roche et les installations thermiques sous la glace de Vénus. Armé de la pioche-pique assistée <em>Kreska</em>, il est capable de briser aussi bien le pergélisol que le plastron d'une Warframe.<br/>
• <strong>Perforation d'Armure :</strong> Ses frappes de pioche réduisent de 25 l'armure de la cible pour la durée du combat.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "immune",
        electricity: "normal",
        toxin: "vulnerable",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "vulnerable",
        radiation: "normal",
        viral: "vulnerable",
        void: "normal"
      }
    }
  },
  {
    _id: "crpckytarakn0001",
    id: "corpus-kyta-raknoid",
    folder: "corpusfldr000001",
    name: "Raknoïde Kyta (Kyta Raknoid)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/kyta_raknoid.png",
    prototypeToken: {
      name: "Raknoïde Kyta",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_raknoid_kyta.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 600, min: 0, max: 600 },
      shields: { value: 800, min: 0, max: 800 },
      armor: { value: 450 },
      details: {
        level: { value: 6 },
        faction: "Corpus (Vallée d'Orbis)",
        attacks: [
          "Frappe Orbitale Concentrée: 4d10 Blast + 2d8 Radiation - Portée 60m, désigne une zone de 6m par laser avant de déclencher un pilonnage orbital dévastateur depuis les satellites Corpus (Délai 1 tour)",
          "Rayons Lasers Quadruples: 3d10 Heat - Portée 40m, balayage thermique continu fendant les armures",
          "Bouclier Invulnérable à Surcharge: Action réflexe, déploie une sphère d'invulnérabilité totale absorbant tous les tirs pendant 1 tour tout en projetant 2 hologrammes leurres !",
          "Balayage des Pates Quadripodes: 2d10 Impact - Corps-à-corps, fauche toutes les créatures adjacentes"
        ].join("\n"),
        description: `<strong>Grand Arachnoïde Blindé de Suprématie</strong><br/>
Chef-d'œuvre de robotique autonome de Nef Anyo, le Raknoïde Kyta coordonne les opérations défensives majeures de la Vallée d'Orbis. Capable d'appeler des frappes orbitales ciblées et de lever des boucliers d'invulnérabilité par surcharge de flux.<br/>
• <strong>Invulnérabilité Temporaire & Hologrammes :</strong> Lorsqu'il active sa barrière, il est insensible à toutes les attaques et projette des répliques holographiques pour désorienter les assaillants.<br/>
• <strong>Taille Imposante :</strong> Châssis 2x2 dominant le champ de bataille.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "immune",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "resistant",
        corrosive: "normal",
        gas: "immune",
        magnetic: "vulnerable",
        radiation: "resistant",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcscytorakn001",
    id: "corpus-scyto-raknoid",
    folder: "corpusfldr000001",
    name: "Raknoïde Scyto (Scyto Raknoid)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/scyto_raknoid.png",
    prototypeToken: {
      name: "Raknoïde Scyto",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_raknoid_scyto.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 500, min: 0, max: 500 },
      shields: { value: 600, min: 0, max: 600 },
      armor: { value: 350 },
      details: {
        level: { value: 5 },
        faction: "Corpus (Vallée d'Orbis)",
        attacks: [
          "Souffle Cryogénique du Blizzard: 3d10 Cold - Cône de 15m, tempête de glace congelant et ralentissant les cibles (-50% vitesse, statut Glace)",
          "Éperonnage des Pates Acérées: 2d10 Puncture + 1d8 Cold - Corps-à-corps, empale la cible et la jette à terre",
          "Détection Sens-d'Araignée: Détecte automatiquement les Warframes invisibles et à travers les couvertures jusqu'à 30m"
        ].join("\n"),
        description: `<strong>Grand Arachnoïde Prédateur Traqueur</strong><br/>
Conçu spécifiquement pour traquer les proies dans les pires tempêtes de neige de la Vallée d'Orbis. Ses capteurs quantiques percent le camouflage optique des Tenno tandis que ses injecteurs d'azote liquide gèlent sur place les cibles les plus véloces.<br/>
• <strong>Vision Omnisciente :</strong> Ignore l'invisibilité (Loki, Ash, Ivara) et les obscurcissements de fumée.<br/>
• <strong>Gel Cryogénique :</strong> Les cibles prises dans son souffle ont leur vitesse divisée par 2 et subissent le désavantage à leurs jets d'attaque.`
      },
      resistances: {
        impact: "vulnerable",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "immune",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "normal",
        corrosive: "normal",
        gas: "immune",
        magnetic: "vulnerable",
        radiation: "normal",
        viral: "resistant",
        void: "normal"
      }
    }
  },
  {
    _id: "crpcprofittake01",
    id: "corpus-profit-taker-orb",
    folder: "corpusfldr000001",
    name: "Orbe Preneur de Profit (Profit-Taker Orb)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/profit_taker_orb.png",
    prototypeToken: {
      name: "Orbe Preneur de Profit",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/corpus/special/token_orbe_preneur_de_profit.png"
      },
      width: 3,
      height: 3,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 1500, min: 0, max: 1500 },
      shields: { value: 1200, min: 0, max: 1200 },
      armor: { value: 900 },
      details: {
        level: { value: 10 },
        faction: "Corpus (Vallée d'Orbis)",
        attacks: [
          "Artillerie de Siège Titanesque: 4d12 Blast + 2d10 Impact - Portée 100m, tir en cloche saturant une zone de 12m de projectiles explosifs lourds",
          "Balayage Laser Thermique 360°: 4d10 Heat - Rayon 30m, balayage horizontal circulaire fendant tout obstacle",
          "Choc Sismique d'Écrasement des Pylônes: 3d10 Impact - Rayon 20m au sol, projette toutes les Warframes à 25m et les jette à terre (FOR DD 18)",
          "Largage de Balises d'Alerte & Renforts: Déploie 2 balises d'alerte augmentant le niveau de menace et appelant des navettes de troupes Terra"
        ].join("\n"),
        description: `<strong>Colosse Arachnéen Monumental & Boss Suprême de Vénus</strong><br/>
Forteresse quadripode mobile colossale développée par Nef Anyo pour asservir Fortuna et la Vallée d'Orbis. Son armure composite titanesque et son bouclier harmonique adaptatif représentent le pinacle technologique du Corpus.<br/>
• <strong>Bouclier à Harmonique Élémentaire Variable (Règle Canonique) :</strong> L'Orbe projette un hologramme élémentaire sur son front (Feu, Froid, Électricité, Toxine, Explosion, Corrosif, Gaz, Magnétique, Radiation ou Viral). L'Orbe est <strong>STRICTEMENT INVULNÉRABLE</strong> à tous les types de dégâts SAUF celui actuellement affiché ! Une fois 200 dégâts infligés dans cet élément (ou par un tir d'amplificateur de l'Opérateur), l'harmonique change aléatoirement.<br/>
• <strong>Blindage d'Armes Lourdes (Archgun) :</strong> Lorsque son bouclier est abattu, son blindage de pattes ne peut être endommagé QUE par des armes de calibre lourd (Archguns / Artillerie lourde) !`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "immune",
        electricity: "resistant",
        toxin: "immune",
        blast: "resistant",
        corrosive: "resistant",
        gas: "immune",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  }
];

export const INFESTED_ADVERSARIES = [
  {
    _id: "infcharger000001",
    id: "infcharger000001",
    folder: "infestedfldr0001",
    name: "Chargeur (Charger)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/QuadrupedAvatar.webp",
    prototypeToken: {
      name: "Chargeur (Charger)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_chargeur.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 1 },
        biography: "Ancien clone Grineer déformé et asservi par le Technocyte. Quadrupède frénétique attaquant par meutes avec férocité au corps-à-corps."
      },
      health: { value: 80, min: 0, max: 80 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 25 },
      attacksText: "Griffes Démembrantes | 1d20 + 4 | 1d8 + 3 [slash] (Attaque au corps-à-corps féroce)\nBond Sauvage | 1d20 + 4 | 1d6 + 2 [impact] (Saut bondissant jusqu'à 8m)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "resist",
        blast: "normal",
        corrosive: "normal",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "infrunner0000001",
    id: "infrunner0000001",
    folder: "infestedfldr0001",
    name: "Coureur Infesté (Runner)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/InfestedRunner.webp",
    prototypeToken: {
      name: "Coureur Infesté (Runner)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_coureur.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 1 },
        biography: "Corps humanoïde Corpus métamorphosé en prédateur bipède rapide. Fonce sur les intrus en hurlant pour les lacérer."
      },
      health: { value: 60, min: 0, max: 60 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 0 },
      attacksText: "Balayage Mutant | 1d20 + 3 | 1d6 + 2 [slash] (Coups de bras déformés)\nFrénésie de Meute | 1d20 + 3 | 1d4 + 1 [impact] (Bousculade rapide)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "infvolatile00001",
    id: "infvolatile00001",
    folder: "infestedfldr0001",
    name: "Volatile Infesté (Volatile Runner)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/RunnerDE.png",
    prototypeToken: {
      name: "Volatile Infesté (Volatile Runner)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_volatile.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 1 },
        biography: "Coureur infesté boursouflé de gaz hautement instables et de pustules explosives. Se précipite pour déclencher une explosion suicidaire dévastatrice."
      },
      health: { value: 50, min: 0, max: 50 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 0 },
      attacksText: "Détonation Suicidaire | 1d20 + 5 | 2d10 + 4 [blast] (Explosion dans un rayon de 4m infligeant d'énormes dégâts d'explosion et de poison)\nCoup de Pustule | 1d20 + 3 | 1d6 + 2 [toxin] (Frappe toxique directe)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "weak",
        blast: "normal",
        corrosive: "normal",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "infcrawler000001",
    id: "infcrawler000001",
    folder: "infestedfldr0001",
    name: "Rampant Infesté (Crawler)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/CrawlerAvatar.webp",
    prototypeToken: {
      name: "Rampant Infesté (Crawler)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_rampant.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 1 },
        biography: "Buste d'hôte amputé de ses membres inférieurs se déplaçant en rampant sur le sol. Morsure virulente et sécrétions d'acide purulent."
      },
      health: { value: 40, min: 0, max: 40 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 0 },
      attacksText: "Morsure Venimeuse | 1d20 + 3 | 1d6 + 2 [toxin] (Morsure au ras du sol)\nCrachat de Bile | 1d20 + 3 | 1d4 + 1 [toxin] (Portée 6m)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "resist",
        blast: "normal",
        corrosive: "normal",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "infleaper0000001",
    id: "infleaper0000001",
    folder: "infestedfldr0001",
    name: "Sauteur Infesté (Leaper)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/LeaperDE.png",
    prototypeToken: {
      name: "Sauteur Infesté (Leaper)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_sauteur.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 2 },
        biography: "Infesté aux membres renforcés capable de bonds prodigieux. Surgit des angles morts pour plaquer ses proies au sol."
      },
      health: { value: 90, min: 0, max: 90 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 15 },
      attacksText: "Bond Prédateur & Placage | 1d20 + 5 | 1d10 + 3 [slash] (Bond de 12m, jette la cible à terre si échec DD 12 Dextérité)\nLacération Frénétique | 1d20 + 5 | 1d8 + 3 [slash] (Tranchage répété)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "infmutosprey0001",
    id: "infmutosprey0001",
    folder: "infestedfldr0001",
    name: "Drone Mutaliste (Mutalist Osprey)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/InfestedOsprey.webp",
    prototypeToken: {
      name: "Drone Mutaliste (Mutalist Osprey)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_drone_mutaliste.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 2 },
        biography: "Drone Corpus parasité et recouvert de biomatière infestée. Vole au-dessus du champ de bataille pour larguer des nuages de gaz toxique et transporter des rampants."
      },
      health: { value: 85, min: 0, max: 85 },
      shields: { value: 50, min: 0, max: 50 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 25 },
      attacksText: "Nuage de Spores Toxiques | 1d20 + 4 | 2d6 + 3 [toxin] (Créé une zone de gaz toxique de 4m durant 2 tours)\nCharge Aérienne Piquante | 1d20 + 4 | 1d6 + 2 [puncture] (Piqué aérien direct)",
      resistances: {
        impact: "weak",
        puncture: "normal",
        slash: "normal",
        heat: "weak",
        cold: "normal",
        electricity: "weak",
        toxin: "immune",
        blast: "normal",
        corrosive: "weak",
        gas: "weak",
        magnetic: "weak",
        radiation: "resist",
        viral: "normal",
        void: "normal"
      }
    }
  },
  {
    _id: "infhealer0000001",
    id: "infhealer0000001",
    folder: "infestedfldr0001",
    name: "Ancien Guérisseur (Ancient Healer)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/HealerAncientDE.webp",
    prototypeToken: {
      name: "Ancien Guérisseur (Ancient Healer)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_ancien_guerisseur.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 3 },
        biography: "Ancien spécimen Lorist Orokin métamorphosé. Projette une aura symbiotique qui réduit drastiquement les dégâts subis par les alliés proches et soigne régulièrement l'essaim."
      },
      health: { value: 300, min: 0, max: 300 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 100 },
      attacksText: "Grappin Vivant & Projection | 1d20 + 6 | 2d8 + 4 [impact] (Portée 15m, attire la cible à lui)\nBalayage Massif de Tentacule | 1d20 + 6 | 1d10 + 4 [impact] (Renversement au sol)\nPulsation Guérisseuse | 1d20 + 6 | 2d8 + 5 [void] (Soigne tous les Infestés à 10m de 25 PV)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "resist",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdisruptor0001",
    id: "infdisruptor0001",
    folder: "infestedfldr0001",
    name: "Ancien Perturbateur (Ancient Disruptor)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/AncientDisrupter.png",
    prototypeToken: {
      name: "Ancien Perturbateur (Ancient Disruptor)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_ancien_perturbateur.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 3 },
        biography: "Créature ancestrale émettant une aura anti-magnétique et d'interférence énergétique. Les attaques des infestés proches drainent l'énergie des Warframes."
      },
      health: { value: 280, min: 0, max: 280 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 100 },
      attacksText: "Harpon Magnétique Perturbateur | 1d20 + 6 | 2d8 + 4 [magnetic] (Draine 50 points d'énergie Tenno et attire la cible)\nDécharge de Rupture | 1d20 + 6 | 2d6 + 3 [electricity] (Onde de choc court rayon)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "resist",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "inftoxic00000001",
    id: "inftoxic00000001",
    folder: "infestedfldr0001",
    name: "Ancien Toxique (Toxic Ancient)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/ToxicAncient2DE.png",
    prototypeToken: {
      name: "Ancien Toxique (Toxic Ancient)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_ancien_toxique.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 3 },
        biography: "Monstre millénaire saturé de miasmes mortels. Son souffle et son rugissement confèrent du poison pur à tous les Infestés environnants, court-circuitant les boucliers."
      },
      health: { value: 280, min: 0, max: 280 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 100 },
      attacksText: "Souffle de Miasmes Mortels | 1d20 + 6 | 3d6 + 4 [toxin] (Cône de 8m, dégâts directs sur la Santé ignorant les boucliers)\nFouet Caustique | 1d20 + 6 | 2d6 + 3 [toxin] (Attaque de tentacule empoisonné)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "immune",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infjuggernaut001",
    id: "infjuggernaut001",
    folder: "infestedfldr0001",
    name: "Mastodonte Infesté (Juggernaut)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/Juggernaut.png",
    prototypeToken: {
      name: "Mastodonte Infesté (Juggernaut)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/token_mastodonte.png"
      },
      width: 2,
      height: 2
    },
    system: {
      details: {
        faction: "Infestés",
        level: { value: 6 },
        biography: "Colosse cuirassé d'os fossilisé et de tendons mutagènes. Déchaîne des charges destructrices et des salves d'épines dorsales. Seul son abdomen exposé est vulnérable."
      },
      health: { value: 750, min: 0, max: 750 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 500 },
      attacksText: "Charge Broyeuse Inarrêtable | 1d20 + 8 | 3d10 + 6 [impact] (Écrase tout sur une ligne droite de 20m, projection à 10m)\nVolée d'Épines Dorsales | 1d20 + 8 | 3d8 + 5 [puncture] (Rafale perforante à moyenne portée)\nPilonnage & Nuage Putride | 1d20 + 8 | 2d10 + 4 [toxin] (Frappe au sol libérant un nuage toxique acide)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "immune",
        blast: "normal",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdcarnis000001",
    id: "deimos-carnis",
    folder: "infestedfldr0001",
    name: "Carnis de Deimos (Deimos Carnis)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/deimos_carnis.png",
    prototypeToken: {
      name: "Carnis de Deimos",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_carnis_deimos.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 120, min: 0, max: 120 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 100 },
      details: {
        level: { value: 2 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Faux Tranchantes de Carnis: 2d10 Slash + 1d6 Puncture - Corps-à-corps, doubles lames acérées fendant les armures",
          "Bond de Prédation Aérienne: Portée 15m, bondit sur sa proie et la jette à terre (DEX DD 14)"
        ].join("\n"),
        description: `<strong>Prédateur Agile du Puy de Cambion</strong><br/>
Créature difforme à membres multiples ressemblant à une mante religieuse géante. Évoluant dans les dunes organiques de Deimos, il utilise ses pattes arrière surdéveloppées pour fondre sur ses proies en un éclair.<br/>
• <strong>Immunité Virale de la Souche Grise :</strong> Comme tous les Infestés de Deimos, le Carnis est résistant aux dégâts <strong>Viraux</strong>. Ses vulnérabilités sont le <strong>Feu</strong> (+50%) et le <strong>Corrosif</strong> (+50%).<br/>
• <strong>Tranchant Mortel :</strong> Ses attaques infligent des saignements continus.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "normal",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdjugulus00001",
    id: "deimos-jugulus",
    folder: "infestedfldr0001",
    name: "Jugulus de Deimos (Deimos Jugulus)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/deimos_jugulus.png",
    prototypeToken: {
      name: "Jugulus de Deimos",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_jugulus_deimos.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 350, min: 0, max: 350 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 250 },
      details: {
        level: { value: 4 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Rafale d'Épines Barbelées: 3d8 Puncture + 1d8 Toxin - Portée 35m, salve d'aiguillons osseux venimeux à cadence soutenue",
          "Éruption de Tentacules Souterrains: 3d10 Slash - Rayon 10m sous une cible jusqu'à 30m, des pieux géants jaillissent du sol et empalent les créatures (DEX DD 15)",
          "Enracinement Protecteur: Réduit passivement de 50% tous les dégâts subis tant qu'il reste ancré au sol"
        ].join("\n"),
        description: `<strong>Tourelle Biologique Végétale Enracinée</strong><br/>
Plante carnivore géante fusionnée à la matière vivante de Deimos. Elle crible ses ennemis d'épines perforantes et fait jaillir des tentacules osseux acérés directement sous les pieds des Warframes.<br/>
• <strong>Frappe Tellurique :</strong> Ignore la couverture normale grâce à ses tentacules souterrains.<br/>
• <strong>Carapace d'Ancrage :</strong> Réduit de 50% tous les dégâts tant qu'il est enraciné.`
      },
      resistances: {
        impact: "normal",
        puncture: "weak",
        slash: "normal",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "weak",
        corrosive: "weak",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdsaxum0000001",
    id: "deimos-saxum",
    folder: "infestedfldr0001",
    name: "Saxum de Deimos (Deimos Saxum)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/deimos_saxum.png",
    prototypeToken: {
      name: "Saxum de Deimos",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_saxum_deimos.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 400, min: 0, max: 400 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 400 },
      details: {
        level: { value: 4 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Projection de Poches Acides Explosives: 3d10 Blast + 1d8 Corrosive - Portée 25m, lance des amas biliaires corrosifs éclatant en zone de 5m",
          "Coup de Masse Brute: 2d10 Impact + 1d8 Toxin - Corps-à-corps, coup d'épaulière dévastateur",
          "Détonation d'Épaulières Saxum: Lorsqu'une de ses épaulières osseuses est brisée, elle explose en projetant du pus corrosif sur 6m"
        ].join("\n"),
        description: `<strong>Colosse Cuirassé d'Artillerie Biologique</strong><br/>
Mastodonte bipède bipolaire doté d'immenses excroissances scapulaires remplies de fluides acides corrosifs. Il bombarde les escouades de boules d'acide explosives tout en écrasant quiconque s'approche.<br/>
• <strong>Points Faibles d'Épaules :</strong> Ses deux épaulières peuvent être ciblées séparément. Les détruire déclenche de puissantes explosions de zone !<br/>
• <strong>Armure Fossilisée :</strong> 400 points d'armure naturelle.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "normal",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "weak",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdtherid000001",
    id: "deimos-therid",
    folder: "infestedfldr0001",
    name: "Therid de Deimos (Deimos Therid)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/deimos_therid.png",
    prototypeToken: {
      name: "Therid de Deimos",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_therid_deimos.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 110, min: 0, max: 110 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 50 },
      details: {
        level: { value: 2 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Crachat Biliaire Volatile: 2d8 Toxin + 1d6 Corrosive - Portée 25m, jet d'acide toxique visqueux rongeant les protections",
          "Toile d'Entrave Baveuse: Portée 20m, projette une nappe filamenteuse immobilisant la cible (DEX DD 14)"
        ].join("\n"),
        description: `<strong>Arachnide Tireur & Entraveur</strong><br/>
Araignée difforme crachant de la bile corrosive à moyenne portée et tissant des toiles biologiques pour ralentir et clouer au sol les Tenno.<br/>
• <strong>Entrave Glacée/Acide :</strong> Les cibles prises dans sa toile ne peuvent plus utiliser de Saut Propulsé (Bullet Jump) pendant 1 tour.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "normal",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdgenetrix0001",
    id: "deimos-genetrix",
    folder: "infestedfldr0001",
    name: "Génitrice de Deimos (Deimos Genetrix)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/deimos_genetrix.png",
    prototypeToken: {
      name: "Génitrice de Deimos",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_genetrix_deimos.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 500, min: 0, max: 500 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 300 },
      details: {
        level: { value: 5 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Largage de Cocons d'Engeance: Invoque 2 à 3 Carnis ou Therids à chaque tour dans un rayon de 10m",
          "Jet de Bile Putride: 3d8 Toxin + 1d8 Corrosive - Portée 20m, gerbe d'acide gastrique",
          "Nuage de Spores Asphyxiant: Rayon 10m, brouillard toxique persistant infligeant 2d6 poison par tour"
        ].join("\n"),
        description: `<strong>Ruche Volante d'Incubation & Mère de la Nuée</strong><br/>
Structure organique aéroportée pulsant dans l'atmosphère lourde de Deimos. Elle transporte des grappes de larves en incubation rapide et les expulse pour submerger les Tenno sous le nombre.<br/>
• <strong>Ponte Incessante :</strong> Doit être éliminée en priorité pour stopper l'arrivée continue de renforts.<br/>
• <strong>Vol Stationnaire :</strong> Flotte à 5-10m de hauteur.`
      },
      resistances: {
        impact: "normal",
        puncture: "weak",
        slash: "normal",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "normal",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdtendril00001",
    id: "deimos-tendril-drone",
    folder: "infestedfldr0001",
    name: "Drone à Tentacules (Deimos Tendril Drone)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/deimos_tendril_drone.png",
    prototypeToken: {
      name: "Drone à Tentacules",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_drone_tentacules_deimos.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 90, min: 0, max: 90 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 75 },
      details: {
        level: { value: 2 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Fouet de Tentacules Électro-Toxiques: 2d8 Toxin + 1d6 Electricity - Portée 6m, cinglement déstabilisant",
          "Succion d'Énergie Neurale: Draine 20 points d'énergie de la Warframe touchée pour soigner les Infestés proches"
        ].join("\n"),
        description: `<strong>Drone Aérien Parasitaire</strong><br/>
Créature volante maintenue par des cavités de gaz biologiques, pourvue de longs tentacules conducteurs qui fouettent et siphonnent les flux d'énergie des Tenno.<br/>
• <strong>Siphon Neurale :</strong> Privilégie les Warframes dotées de réserves d'énergie élevées.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "normal",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdpharaoh00001",
    id: "deimos-pharaoh-predasite",
    folder: "infestedfldr0001",
    name: "Prédasite Pharaon (Pharaoh Predasite)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/pharaoh_predasite.png",
    prototypeToken: {
      name: "Prédasite Pharaon",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_predasite_pharaon.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 220, min: 0, max: 220 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 200 },
      details: {
        level: { value: 3 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Morsure Féroce Venimeuse: 2d10 Slash + 1d8 Toxin - Corps-à-corps, mâchoire surpuissante déchirant la chair",
          "Nuée d'Anéroïdes Parasites: Portée 15m, libère un essaim d'insectes dévorant l'armure de la cible (-50 armure pendant le combat)"
        ].join("\n"),
        description: `<strong>Molosse Apex Sauvage de Deimos</strong><br/>
Canidé prédateur dominant du Puy de Cambion, orné d'une coiffe chitineuse imposante rappelant les ornements d'un monarque antique. Chassant avec une intelligence primitive redoutable.<br/>
• <strong>Dévoration d'Armure :</strong> Ses parasites affaiblissent rapidement les défenses physiques des Tenno.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "normal",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdpanzer000001",
    id: "deimos-panzer-vulpaphyla",
    folder: "infestedfldr0001",
    name: "Vulpaphyle Panzer (Panzer Vulpaphyla)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/panzer_vulpaphyla.png",
    prototypeToken: {
      name: "Vulpaphyle Panzer",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_vulpaphyle_panzer.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 180, min: 0, max: 180 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 150 },
      details: {
        level: { value: 3 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Volée d'Épines Sporeuses Virales: 2d8 Puncture + 2d6 Viral - Portée 25m, projette des dards infectés contaminant la cible et les ennemis proches",
          "Griffure Mutagène: 2d6 Slash - Corps-à-corps",
          "Forme Larvaire Immortelle: À sa mort, se transforme en cocon larvaire protecteur et renaît avec 100% de ses PV après 2 tours !"
        ].join("\n"),
        description: `<strong>Félin d'Assaut Viral Immortel</strong><br/>
Créature féline d'une agilité stupéfiante, hérissée d'épines dorsales capables de libérer des spores virulentes. Réputée pour son cycle de réincarnation larvaire quasi-immortel.<br/>
• <strong>Renaissance Larvaire :</strong> Doit être détruit sous sa forme de cocon pour être définitivement neutralisé.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "normal",
        viral: "immune",
        void: "normal"
      }
    }
  },
  {
    _id: "infdsaxumrex0001",
    id: "deimos-saxum-rex",
    folder: "infestedfldr0001",
    name: "Saxum Rex de Deimos (Deimos Saxum Rex)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/deimos_saxum_rex.png",
    prototypeToken: {
      name: "Saxum Rex de Deimos",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_saxum_rex_deimos.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 700, min: 0, max: 700 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 550 },
      details: {
        level: { value: 6 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Pilonnage de Clusters Acides Titan: 3d12 Blast + 2d8 Corrosive - Portée 35m, barrage de rochers d'os acide explosifs",
          "Charge Écrasante Monolithique: 3d10 Impact - Corps-à-corps, piétinement foudroyant",
          "Vague Sismique Corrosive: 2d10 Corrosive - Rayon 12m au sol, onde de choc réduisant de moitié l'armure de toutes les créatures touchées"
        ].join("\n"),
        description: `<strong>Variante Alpha Titanesque du Saxum</strong><br/>
Colosse osseux dominant la hiérarchie biologique du Puy de Cambion. Sa carapace fossilisée surdimensionnée et ses poches d'acides surpressurisées pilonnent des zones entières avec une férocité dévastatrice.<br/>
• <strong>Blindage Massif :</strong> 550 points d'armure naturelle.`
      },
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "normal",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "weak",
        gas: "normal",
        magnetic: "normal",
        radiation: "normal",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "infdlephantis001",
    id: "deimos-lephantis",
    folder: "infestedfldr0001",
    name: "Lephantis (Boss Ancien de Deimos)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/lephantis.png",
    prototypeToken: {
      name: "Lephantis",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/infestés/deimos/token_lephantis.png"
      },
      width: 3,
      height: 3,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 1400, min: 0, max: 1400 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 850 },
      details: {
        level: { value: 9 },
        faction: "Infestés (Deimos)",
        attacks: [
          "Tête Corpus (Tir de Mines Toxiques): 3d10 Toxin + 2d8 Blast - Portée 40m, gerbes de pus acide explosives",
          "Tête Grineer (Masse Dévastatrice & Balayage): 4d10 Impact + 2d8 Slash - Portée 20m, faux géante tranchante fendant les lignes",
          "Tête Infestée Antique (Souffle Corrosif & Spores): 3d10 Corrosive - Cône de 25m, souffle rongeant toute matière",
          "Écrasement Titanesque Tréphale: 4d12 Impact - Rayon 20m, effondrement de masse provoquant un séisme"
        ].join("\n"),
        description: `<strong>Monstruosité Antique Tréphale & Boss Suprême de Deimos</strong><br/>
Créature colossale tricéphale vestige des premières contaminations de l'Ancienne Guerre. Chaque tête incarne une faction assimilée par l'Infestation (Corpus, Grineer, Ancienne).<br/>
• <strong>Vulnérabilité aux Gueules Ouvertes (Règle Canonique) :</strong> Le corps cuirassé de Lephantis est 100% invulnérable. Seules les gueules de ses têtes peuvent être endommagées lorsqu'elles s'ouvrent pour préparer une attaque !<br/>
• <strong>Deux Phases de Combat :</strong> Phase 1 : Les 3 têtes combattent séparément en jaillissant du sol. Phase 2 : Le colosse émerge entièrement pour le combat final.`
      },
      resistances: {
        impact: "normal",
        puncture: "weak",
        slash: "normal",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "immune",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "weak",
        viral: "resist",
        void: "normal"
      }
    }
  }
];

export const OROKIN_ADVERSARIES = [
  {
    _id: "orkclancer000001",
    id: "orkclancer000001",
    folder: "orokinfldr000001",
    name: "Lancier Corrompu (Corrupted Lancer)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/OrokinRifleLancerAvatar.png",
    prototypeToken: {
      name: "Lancier Corrompu (Corrupted Lancer)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_lancier_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 1 },
        biography: "Lancier Grineer soumis au contrôle mental de la Sentinelle Neurale Orokin. Équipé d'un fusil Dera et doté d'une précision accrue au service des Tours du Néant."
      },
      health: { value: 80, min: 0, max: 80 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 100 },
      attacksText: "Fusil Dera Corrompu | 1d20 + 4 | 1d8 + 3 [puncture] (Rafale d'énergie perforante à moyenne portée)\nCrosse Renforcée | 1d20 + 4 | 1d6 + 2 [impact] (Coup de crosse défensif)",
      resistances: {
        impact: "normal",
        puncture: "weak",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "weak",
        blast: "normal",
        corrosive: "weak",
        gas: "normal",
        magnetic: "normal",
        radiation: "resist",
        viral: "weak",
        void: "normal"
      }
    }
  },
  {
    _id: "orkccrewman00001",
    id: "orkccrewman00001",
    folder: "orokinfldr000001",
    name: "Soldat Corrompu (Corrupted Crewman)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/OrokinRifleSpacemanAvatar.png",
    prototypeToken: {
      name: "Soldat Corrompu (Corrupted Crewman)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_soldat_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 1 },
        biography: "Membre d'équipage Corpus asservi par le masque Orokin. Armé d'un fusil à pompe Strun infligeant de lourds dégâts à courte portée."
      },
      health: { value: 80, min: 0, max: 80 },
      shields: { value: 100, min: 0, max: 100 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 0 },
      attacksText: "Fusil à Pompe Strun | 1d20 + 4 | 2d8 + 3 [impact] (Tir chevrotine dévastateur à courte portée)\nGrenade à Plasma du Néant | 1d20 + 4 | 2d6 + 2 [heat] (Zone de 3m)",
      resistances: {
        impact: "weak",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resist",
        electricity: "normal",
        toxin: "weak",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "weak",
        radiation: "resist",
        viral: "weak",
        void: "normal"
      }
    }
  },
  {
    _id: "orkcbutcher00001",
    id: "orkcbutcher00001",
    folder: "orokinfldr000001",
    name: "Boucher Corrompu (Corrupted Butcher)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/OrokinBladeSawman.png",
    prototypeToken: {
      name: "Boucher Corrompu (Corrupted Butcher)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_boucher_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 1 },
        biography: "Combattant de corps-à-corps frénétique galvanisé par l'énergie du Néant. Se rue sur les intrus avec un hachoir énergétique."
      },
      health: { value: 70, min: 0, max: 70 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 50 },
      attacksText: "Hachoir du Néant | 1d20 + 4 | 1d8 + 3 [slash] (Frappe tranchante vive)\nRuée Frénétique | 1d20 + 4 | 1d6 + 2 [impact] (Charge rapide)",
      resistances: {
        impact: "normal",
        puncture: "weak",
        slash: "weak",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "weak",
        blast: "normal",
        corrosive: "weak",
        gas: "normal",
        magnetic: "normal",
        radiation: "resist",
        viral: "weak",
        void: "normal"
      }
    }
  },
  {
    _id: "orkcdrone0000001",
    id: "orkcdrone0000001",
    folder: "orokinfldr000001",
    name: "Drone Corrompu (Corrupted Drone)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/FusionDroneDE.png",
    prototypeToken: {
      name: "Drone Corrompu (Corrupted Drone)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_drone_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 1 },
        biography: "Drone d'appui Orokin volant. Émet un faisceau de recharge et de suralimentation des boucliers pour toutes les unités corrompues alliées proches."
      },
      health: { value: 60, min: 0, max: 60 },
      shields: { value: 150, min: 0, max: 150 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 25 },
      attacksText: "Tir Laser d'Appui | 1d20 + 4 | 1d6 + 2 [electricity] (Tir de riposte rapide)\nFaisceau Protecteur Orokin | 1d20 + 4 | 1d4 + 1 [void] (Restaure 50 boucliers à un allié ciblé)",
      resistances: {
        impact: "weak",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "weak",
        electricity: "weak",
        toxin: "weak",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "weak",
        radiation: "weak",
        viral: "weak",
        void: "normal"
      }
    }
  },
  {
    _id: "orkcmoa000000001",
    id: "orkcmoa000000001",
    folder: "orokinfldr000001",
    name: "Moa Corrompu (Corrupted MOA)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/OrokinMoaBipedAvatar.png",
    prototypeToken: {
      name: "Moa Corrompu (Corrupted MOA)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_moa_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 2 },
        biography: "Moa bipède recouvert de dorures Orokin et reconfiguré pour la protection des Salles du Néant. Tire des salves laser continues et déploie des barrières de choc."
      },
      health: { value: 120, min: 0, max: 120 },
      shields: { value: 150, min: 0, max: 150 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 75 },
      attacksText: "Canon Laser du Néant | 1d20 + 5 | 1d10 + 3 [puncture] (Tir laser rapide haute précision)\nFrappe Sismique Statique | 1d20 + 5 | 1d8 + 2 [electricity] (Onde de choc repoussant les ennemis)",
      resistances: {
        impact: "weak",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resist",
        electricity: "weak",
        toxin: "weak",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "weak",
        radiation: "weak",
        viral: "weak",
        void: "normal"
      }
    }
  },
  {
    _id: "orkcnullifier001",
    id: "orkcnullifier001",
    folder: "orokinfldr000001",
    name: "Sapeur Zéro Corrompu (Corrupted Nullifier)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/OrokinNullifySpaceman.png",
    prototypeToken: {
      name: "Sapeur Zéro Corrompu (Corrupted Nullifier)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_sapeur_zero_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 3 },
        biography: "Sapeur Corpus d'élite contrôlé par la Sentinelle Neurale. Génère un dôme d'énergie dorée annulant tout pouvoir de Warframe et protégeant ses alliés des tirs à distance."
      },
      health: { value: 100, min: 0, max: 100 },
      shields: { value: 200, min: 0, max: 200 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 0 },
      attacksText: "Fusil de Sniper Lanka | 1d20 + 5 | 2d8 + 3 [electricity] (Tir perforant haute vélocité)\nBulle Zéro Dorée | 1d20 + 5 | 1d6 + 2 [void] (Dôme protecteur annulant les pouvoirs Tenno)",
      resistances: {
        impact: "weak",
        puncture: "normal",
        slash: "normal",
        heat: "normal",
        cold: "resist",
        electricity: "normal",
        toxin: "weak",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "weak",
        radiation: "resist",
        viral: "weak",
        void: "normal"
      }
    }
  },
  {
    _id: "orkchvgunner0001",
    id: "orkchvgunner0001",
    folder: "orokinfldr000001",
    name: "Artilleur Lourd Corrompu (Corrupted Heavy Gunner)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/OrokinHeavyGunner.png",
    prototypeToken: {
      name: "Artilleur Lourd Corrompu (Corrupted Heavy Gunner)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_artilleur_lourd_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 3 },
        biography: "Soldat lourdement blindé armé d'une gatling Gorgon surcadencée. Décoche des tirs de suppression massifs et effectue des frappes au sol projetant les Tenno à terre."
      },
      health: { value: 350, min: 0, max: 350 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 300 },
      attacksText: "Mitrailleuse Gatling Gorgon | 1d20 + 6 | 3d6 + 4 [impact] (Tir automatique lourd en rafale continue)\nOnde de Choc Tellurique | 1d20 + 6 | 2d6 + 3 [impact] (Frappe au sol projetant les cibles à 5m DD 13)",
      resistances: {
        impact: "normal",
        puncture: "weak",
        slash: "normal",
        heat: "normal",
        cold: "normal",
        electricity: "normal",
        toxin: "weak",
        blast: "normal",
        corrosive: "weak",
        gas: "normal",
        magnetic: "normal",
        radiation: "resist",
        viral: "weak",
        void: "normal"
      }
    }
  },
  {
    _id: "orkcbombard00001",
    id: "orkcbombard00001",
    folder: "orokinfldr000001",
    name: "Bombardier Corrompu (Corrupted Bombard)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/CorruptedBombardNew.png",
    prototypeToken: {
      name: "Bombardier Corrompu (Corrupted Bombard)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_bombardier_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 4 },
        biography: "Unité d'artillerie lourde cuirassée d'alliages du Néant. Tire des roquettes guidées Ogris traquant les Warframes pour provoquer des explosions dévastatrices."
      },
      health: { value: 400, min: 0, max: 400 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 400 },
      attacksText: "Lance-Roquettes Ogris Guidé | 1d20 + 6 | 3d10 + 5 [blast] (Roquette téléguidée détonant dans un rayon de 4m infligeant d'immenses dégâts)\nFrappe Cuirassée | 1d20 + 6 | 2d8 + 3 [impact] (Coup de lance-roquette au corps-à-corps)",
      resistances: {
        impact: "normal",
        puncture: "weak",
        slash: "normal",
        heat: "normal",
        cold: "weak",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "resist",
        gas: "normal",
        magnetic: "normal",
        radiation: "weak",
        viral: "weak",
        void: "normal"
      }
    }
  },
  {
    _id: "orkcancient00001",
    id: "orkcancient00001",
    folder: "orokinfldr000001",
    name: "Ancien Corrompu (Corrupted Ancient)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/OrokinHealingAncientAvatar.png",
    prototypeToken: {
      name: "Ancien Corrompu (Corrupted Ancient)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_ancien_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 4 },
        biography: "Ancien Infesté entièrement reprogrammé par la Sentinelle Neurale. Confère une réduction monumentale de 90% des dégâts et l'immunité au contrôle des foules à tous les Corrompus environnants."
      },
      health: { value: 350, min: 0, max: 350 },
      shields: { value: 0, min: 0, max: 0 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 150 },
      attacksText: "Grappin du Néant & Balayage | 1d20 + 6 | 2d8 + 4 [impact] (Attire la cible à 15m)\nAura Neurale de Protection | 1d20 + 6 | 2d6 + 3 [void] (Confère 90% de réduction de dégâts à tous les Corrompus dans un rayon de 15m)",
      resistances: {
        impact: "normal",
        puncture: "normal",
        slash: "weak",
        heat: "weak",
        cold: "normal",
        electricity: "normal",
        toxin: "resist",
        blast: "weak",
        corrosive: "weak",
        gas: "weak",
        magnetic: "normal",
        radiation: "resist",
        viral: "resist",
        void: "normal"
      }
    }
  },
  {
    _id: "orkcvorboss00001",
    id: "orkcvorboss00001",
    folder: "orokinfldr000001",
    name: "Capitaine Vor Corrompu (Corrupted Vor)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/VorTwo.png",
    prototypeToken: {
      name: "Capitaine Vor Corrompu (Corrupted Vor)",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/orokin/token_capitaine_vor_corrompu.png"
      },
      width: 1,
      height: 1
    },
    system: {
      details: {
        faction: "Orokin",
        level: { value: 8 },
        biography: "Ressuscité par la Clé de Janus après sa défaite sur Mercure. Prophète immortel du Néant maniant l'énergie primordiale et capable de se téléporter à volonté."
      },
      health: { value: 850, min: 0, max: 850 },
      shields: { value: 500, min: 0, max: 500 },
      energy: { value: 0, min: 0, max: 0 },
      armor: { value: 450 },
      attacksText: "Faisceau Divin de la Clé de Janus | 1d20 + 9 | 4d10 + 6 [void] (Rayon d'énergie du Néant continu à longue portée)\nMines Énergétiques du Néant | 1d20 + 9 | 3d8 + 4 [electricity] (Pièges électriques orbitaux)\nTéléportation Tactique & Bouclier | 1d20 + 9 | 2d10 + 5 [void] (Téléportation instantanée restaurant une partie des boucliers)",
      resistances: {
        impact: "normal",
        puncture: "weak",
        slash: "normal",
        heat: "normal",
        cold: "weak",
        electricity: "normal",
        toxin: "normal",
        blast: "normal",
        corrosive: "resist",
        gas: "normal",
        magnetic: "weak",
        radiation: "weak",
        viral: "weak",
        void: "weak"
      }
    }
  }
];

export const MURMUR_ADVERSARIES = [
  {
    _id: "mrmcshuffling001",
    id: "the-shuffling-fragment",
    folder: "murmurfldr000001",
    name: "Fragment Traînant (The Shuffling Fragment)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/shuffling_fragment.png",
    prototypeToken: {
      name: "Fragment Traînant",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_fragment_trainant.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 80, min: 0, max: 80 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 120 },
      details: {
        level: { value: 1 },
        faction: "Murmure",
        attacks: [
          "Griffes de Pierre du Néant: 2d8 Impact + 1d6 Void - Corps-à-corps, lacération de maçonnerie brute",
          "Ruée Entravante: Portée 10m, se projette vers la cible et s'accroche pour la ralentir (DEX DD 12)"
        ].join("\n"),
        description: `<strong>Infanterie Rampante de l'Indifférence</strong><br/>
Fragment inférieur du Murmure composé d'un buste de craie et de bras sculptés en béton rampant sur le sol. Ils avancent en meutes compactes sorties des failles du Néant.<br/>
• <strong>Nature de Maçonnerie du Néant :</strong> Résistant au <strong>Viral</strong>, au <strong>Tranchant</strong> et à l'<strong>Impact</strong>. Vulnérable à la <strong>Radiation</strong> (+75%) et à l'<strong>Électricité</strong> (+50%).`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmclumbering001",
    id: "the-lumbering-fragment",
    folder: "murmurfldr000001",
    name: "Fragment Titubant (The Lumbering Fragment)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/lumbering_fragment.png",
    prototypeToken: {
      name: "Fragment Titubant",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_fragment_titubant.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 320, min: 0, max: 320 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 300 },
      details: {
        level: { value: 3 },
        faction: "Murmure",
        attacks: [
          "Écrasement de Blocs de Béton: 3d10 Impact + 1d8 Void - Corps-à-corps, frappe monumentale broyant le sol",
          "Séisme Tellurique du Murmure: 2d10 Impact - Rayon 10m au sol, onde sismique renversant toutes les créatures (FOR DD 15)"
        ].join("\n"),
        description: `<strong>Colosse Pesant de Maçonnerie</strong><br/>
Brute cyclopéenne constituée d'empilements de blocs de béton et de membres sculptés géants. Il charge pesamment avant d'abattre ses poings monolithiques pour faire trembler les fondations des laboratoires.<br/>
• <strong>Inertie Monolithique :</strong> Immunisé aux renversements et aux projections.`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmchurling00001",
    id: "the-hurling-fragment",
    folder: "murmurfldr000001",
    name: "Fragment Lanceur (The Hurling Fragment)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/hurling_fragment.png",
    prototypeToken: {
      name: "Fragment Lanceur",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_fragment_lanceur.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 120, min: 0, max: 120 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 150 },
      details: {
        level: { value: 2 },
        faction: "Murmure",
        attacks: [
          "Lancer de Moellons du Néant: 2d10 Impact + 1d6 Void - Portée 30m, propulse des fragments de maçonnerie lourds imprégnés d'énergie entropique",
          "Revers de Bras de Pierre: 1d8 Impact - Corps-à-corps"
        ].join("\n"),
        description: `<strong>Artilleur de Pierres de l'Indifférence</strong><br/>
Fragment bipède arrachant des débris de béton et des dalles murales pour les projeter à grande vitesse sur les Warframes embusquées.<br/>
• <strong>Projectiles Résonnants :</strong> Les impacts de moellons libèrent une onde de choc désorientante.`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmcrupturing001",
    id: "the-rupturing-fragment",
    folder: "murmurfldr000001",
    name: "Fragment Rupturé (The Rupturing Fragment)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/rupturing_fragment.png",
    prototypeToken: {
      name: "Fragment Rupturé",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_fragment_rupture.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 100, min: 0, max: 100 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 100 },
      details: {
        level: { value: 2 },
        faction: "Murmure",
        attacks: [
          "Détonation Néantique Suicidaire: 3d10 Blast + 2d8 Void - Rayon 6m, fait exploser sa masse de béton dans un éclat d'énergie du Néant aveuglant",
          "Frappe d'Estropiement: 1d8 Impact - Corps-à-corps"
        ].join("\n"),
        description: `<strong>Bombe Biologique Instable du Murmure</strong><br/>
Fragment instable parcouru de fissures rougeoyantes d'énergie du Néant. Il court frénétiquement au contact avant de rompre sa cohésion dans une terrifiante déflagration entropique.<br/>
• <strong>Sprint Fanatique :</strong> Double sa vitesse de déplacement lorsqu'il repère une cible à moins de 15m.`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmcanatomize001",
    id: "the-anatomizer",
    folder: "murmurfldr000001",
    name: "L'Anatomiseur (The Anatomizer)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/the_anatomizer.png",
    prototypeToken: {
      name: "L'Anatomiseur",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_anatomiseur.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 260, min: 0, max: 260 },
      shields: { value: 150, min: 0, max: 150 },
      armor: { value: 200 },
      details: {
        level: { value: 4 },
        faction: "Murmure",
        attacks: [
          "Bombardement de Sphères d'Énergie Void: 3d10 Blast + 1d8 Radiation - Portée 35m, lance des orbes explosifs segmentés en grappe",
          "Décharge Répulsive Disséquante: 2d10 Radiation - Rayon 8m, repousse violemment les assaillants à 10m",
          "Lévitation Entropique: Vole librement à 3-6m de hauteur"
        ].join("\n"),
        description: `<strong>Sphère Disséquante Flottante</strong><br/>
Entité sphérique en lévitation formée de segments de pierre blanche articulés autour d'un noyau d'énergie pulsant. Il survole les salles des laboratoires en pilonnant les Tenno avec des projectiles fragmentaires explosifs.<br/>
• <strong>Vol Stationnaire :</strong> Immunisé aux effets au sol.`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmchollowvein01",
    id: "the-hollow-vein",
    folder: "murmurfldr000001",
    name: "La Veine Creuse (The Hollow Vein)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/the_hollow_vein.png",
    prototypeToken: {
      name: "La Veine Creuse",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_veine_creuse.png"
      },
      width: 2,
      height: 2,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 380, min: 0, max: 380 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 300 },
      details: {
        level: { value: 4 },
        faction: "Murmure",
        attacks: [
          "Faisceau Pétrifiant de l'Indifférence: 3d10 Void - Portée 25m, rayon continu pétrifiant ralentissant la cible (-50% vitesse, pétrification si échec CON DD 15)",
          "Balayage des Membres Quadripodes: 2d10 Impact + 1d8 Puncture - Corps-à-corps, fauche les assaillants",
          "Hurlement Psychique Résonnant: Rayon 12m, vague psychique imposant le désavantage sur les jets de compétences Tenno"
        ].join("\n"),
        description: `<strong>Monstruosité Pétrifiante Quadripode</strong><br/>
Créature difforme et fascinante constituée de bras sculptés et de colonnes de pierre évidées. Elle projette un rayon d'énergie du Néant pétrifiant qui transmute progressivement la chair et les Warframes en pierre inerte.<br/>
• <strong>Pétrification Graduelle :</strong> Deux touches consécutives transforment la victime en statue de pierre pendant 1 tour.`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmcseveredwd001",
    id: "the-severed-warden",
    folder: "murmurfldr000001",
    name: "Le Gardien Tranché (The Severed Warden)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/the_severed_warden.png",
    prototypeToken: {
      name: "Le Gardien Tranché",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_gardien_tranche.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 300, min: 0, max: 300 },
      shields: { value: 400, min: 0, max: 400 },
      armor: { value: 250 },
      details: {
        level: { value: 5 },
        faction: "Murmure",
        attacks: [
          "Rayons Croisés de Mains Tranchées: 3d8 Void + 1d8 Radiation - Portée 30m, tirs concentrés depuis les paumes flottantes",
          "Halo Protecteur de Mains Flottantes: Action réflexe, confère 75% de réduction de dégâts et immunité aux altérations d'état à tous les alliés du Murmure dans un rayon de 10m",
          "Étreinte Étrangulatrice à Distance: 2d8 Impact - Portée 15m, projette une main spectrale qui immobilise et soulève la cible (DEX DD 15)"
        ].join("\n"),
        description: `<strong>Protecteur Neurale aux Mains Flottantes</strong><br/>
Cercle de mains coupées de marbre blanc orbitant autour d'une relique d'énergie. Il projette des barrières impénétrables sur les troupes du Murmure et étrangle les intrus à distance.<br/>
• <strong>Aura de Sanctuaire :</strong> Protège férocement les autres unités du Murmure tant qu'il est en vie.`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "normal",
        blast: "normal",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmcarcocanid001",
    id: "rogue-arcocanid",
    folder: "murmurfldr000001",
    name: "Arcocanide Renégat (Rogue Arcocanid)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/rogue_arcocanid.png",
    prototypeToken: {
      name: "Arcocanide Renégat",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_arcocanide_renegat.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 280, min: 0, max: 280 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 350 },
      details: {
        level: { value: 4 },
        faction: "Murmure",
        attacks: [
          "Décharge d'Arc Électrique: 3d8 Electricity - Portée 20m, éclair en chaîne sautant sur 2 cibles supplémentaires",
          "Morsure Électro-Mécanique: 2d8 Puncture + 1d8 Electricity - Corps-à-corps, tenailles métalliques sous tension",
          "Déploiement Toile Électrostatique: Crée une zone de choc au sol de 6m paralysant les Warframes (DEX DD 14)"
        ].join("\n"),
        description: `<strong>Robot Quadripode Corrompu des Laboratoires</strong><br/>
Drone arachnéen de patrouille conçu par Albrecht Entrati, tombé sous l'emprise corruptrice du Murmure. Il électrocute le sol et libère des arcs voltaïques dévastateurs.<br/>
• <strong>Châssis d'Alliage Orokin :</strong> 350 d'armure renforcée.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "resistant",
        toxin: "immune",
        blast: "normal",
        corrosive: "normal",
        gas: "immune",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmcculverin0001",
    id: "rogue-culverin",
    folder: "murmurfldr000001",
    name: "Couleuvrine Renégate (Rogue Culverin)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/rogue_culverin.png",
    prototypeToken: {
      name: "Couleuvrine Renégate",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_couleuvrine_renegate.png"
      },
      width: 1,
      height: 1,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 220, min: 0, max: 220 },
      shields: { value: 0, min: 0, max: 0 },
      armor: { value: 300 },
      details: {
        level: { value: 3 },
        faction: "Murmure",
        attacks: [
          "Canons Énergétiques Doubles: 2d10 Heat + 1d8 Impact - Portée 30m, double tir thermique perforant",
          "Signal d'Appel de Renforts Necramech: Émet une balise d'appel d'urgence (délai 1 tour). Si non interrompu, fait surgir un Necramech renégat !",
          "Point Faible : Canons de Bras (Chaque bras possède 40 PV, les détruire désarme complètement la Couleuvrine)"
        ].join("\n"),
        description: `<strong>Sentinelle Mécanisée d'Appel de Renforts</strong><br/>
Necramech bipède léger doté de deux canons montés sur ses bras. Dès qu'il subit des dégâts, il tente de déclencher un signal d'appel pour invoquer de gigantesques Necramechs de combat.<br/>
• <strong>Priorité Tactique :</strong> Détruire ses bras neutralise son artillerie et interrompt son signal.`
      },
      resistances: {
        impact: "normal",
        puncture: "vulnerable",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "immune",
        blast: "normal",
        corrosive: "normal",
        gas: "immune",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  },
  {
    _id: "mrmcsuzerain0001",
    id: "the-fragmented-suzerain",
    folder: "murmurfldr000001",
    name: "Le Suzerain Fragmenté (The Fragmented Suzerain)",
    type: "adversary",
    img: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/fragmented_suzerain.png",
    prototypeToken: {
      name: "Le Suzerain Fragmenté",
      texture: {
        src: "systems/warframe-ttrpg/asset/Token/bestiaire/murmure/token_suzerain_fragmente.png"
      },
      width: 3,
      height: 3,
      disposition: -1,
      bar1: { attribute: "health" },
      bar2: { attribute: "shields" },
      displayName: 20,
      displayBars: 20
    },
    system: {
      health: { value: 1200, min: 0, max: 1200 },
      shields: { value: 600, min: 0, max: 600 },
      armor: { value: 650 },
      details: {
        level: { value: 8 },
        faction: "Murmure",
        attacks: [
          "Rayons Gravitationnels de l'Indifférence: 4d10 Void + 2d8 Radiation - Portée 50m, immenses faisceaux dévastateurs pivotants balayant le secteur",
          "Tempête de Membres de Pierre: 3d12 Impact - Rayon 15m, pluie de blocs de béton et de mains de craie s'écrasant du plafond",
          "Singularité du Néant (Vortex d'Attraction): Crée un vortex aspirant toutes les créatures à 20m et infligeant 2d10 Void par tour (FOR DD 17)",
          "Invocation de la Nuée Fragmentée: Invoque 3 Fragments Traînants ou Rupturés à chaque palier de santé"
        ].join("\n"),
        description: `<strong>Avatar Titanesque de l'Homme dans le Mur (Boss Suprême du Murmure)</strong><br/>
Manifestation colossale et terrifiante de l'Indifférence. Composé de blocs de marbre cyclopéens, de visages pétrifiés hurlants et de mains géantes enchevêtrées, il tente de déchirer la frontière entre le Néant et le Système Origine.<br/>
• <strong>Immunité Psychique & Altérations :</strong> Totalement insensible au sommeil, à la peur et aux manipulations mentales.<br/>
• <strong>Aura Entropique :</strong> Réduit l'efficacité des soins reçus par les Warframes de 50% dans un rayon de 20m.`
      },
      resistances: {
        impact: "resistant",
        puncture: "normal",
        slash: "resistant",
        heat: "normal",
        cold: "normal",
        electricity: "vulnerable",
        toxin: "normal",
        blast: "resistant",
        corrosive: "normal",
        gas: "normal",
        magnetic: "normal",
        radiation: "vulnerable",
        viral: "resistant",
        void: "vulnerable"
      }
    }
  }
];

export const ALL_ADVERSARIES = [
  ...GRINEER_ADVERSARIES,
  ...KUVA_ADVERSARIES,
  ...CORPUS_ADVERSARIES,
  ...INFESTED_ADVERSARIES,
  ...OROKIN_ADVERSARIES,
  ...MURMUR_ADVERSARIES
];

export function getAdversaryById(id) {
  return ALL_ADVERSARIES.find(a => a.id === id || a._id === id);
}

export function getAllAdversaries() {
  return ALL_ADVERSARIES;
}

export function getGrineerAdversaryById(id) {
  return GRINEER_ADVERSARIES.find(a => a.id === id || a._id === id);
}

export function getAllGrineerAdversaries() {
  return GRINEER_ADVERSARIES;
}

export function getKuvaAdversaryById(id) {
  return KUVA_ADVERSARIES.find(a => a.id === id || a._id === id);
}

export function getAllKuvaAdversaries() {
  return KUVA_ADVERSARIES;
}

export function getCorpusAdversaryById(id) {
  return CORPUS_ADVERSARIES.find(a => a.id === id || a._id === id);
}

export function getAllCorpusAdversaries() {
  return CORPUS_ADVERSARIES;
}

export function getInfestedAdversaryById(id) {
  return INFESTED_ADVERSARIES.find(a => a.id === id || a._id === id);
}

export function getAllInfestedAdversaries() {
  return INFESTED_ADVERSARIES;
}

export function getOrokinAdversaryById(id) {
  return OROKIN_ADVERSARIES.find(a => a.id === id || a._id === id);
}

export function getAllOrokinAdversaries() {
  return OROKIN_ADVERSARIES;
}

export function getMurmurAdversaryById(id) {
  return MURMUR_ADVERSARIES.find(a => a.id === id || a._id === id);
}

export function getAllMurmurAdversaries() {
  return MURMUR_ADVERSARIES;
}


