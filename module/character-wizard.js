/**
 * Warframe TTRPG - Character Creation Wizard (Tenno Awakening)
 * Provides an interactive step-by-step guided creation experience for players.
 *
 * Steps:
 * 1. Warframe Selection (Canonical Starters Highlighted + Full Archive)
 * 2. Focus School Selection (Madurai, Vazarin, Naramon, Zenurik, Unairu)
 * 3. Arsenal Selection (Rank 1 Appropriate: 1 Primary, 1 Secondary, 1 Melee)
 *    - Signature weapons included dynamically for the chosen Warframe
 *    - Strict exclusions: Dread, Hate, Despair, War, Broken War, Kuva, Tenet, Coda, Primes, Incarnons
 * 4. Awakening Summary & Automated Character Scaffolding
 */

import { newWarframeClasses } from './data-warframes.js';
import { primaryWeaponsDataset } from './data-primary-weapons.js';
import { secondaryWeaponsDataset } from './data-secondary-weapons.js';
import { meleeWeaponsDataset } from './data-melee-weapons.js';

// Canonical Signature Weapons per Warframe
export const SIGNATURE_WEAPONS = {
  "Koumei": ["Higasa", "Amanata"],
  "Excalibur": ["AX-52", "Skana"],
  "Arthur": ["AX-52", "Skana"],
  "Uriel": ["Vinquibus"],
  "Sevagoth": ["Epitaph"],
  "Citrine": ["Steflos", "Corufell"],
  "Gyre": ["Alternox"],
  "Lavos": ["Cedo"],
  "Caliban": ["Venato"],
  "Gara": ["Astilla", "Volnus", "Fusilai"],
  "Garuda": ["Nagantaka"],
  "Harrow": ["Scourge", "Knell"],
  "Nezha": ["Guandao"],
  "Octavia": ["Tenora", "Pandero"],
  "Revenant": ["Phantasma", "Tatsu"],
  "Voruna": ["Perigale", "Sarofang"],
  "Wisp": ["Fulmin"],
  "Yareli": ["Kompressa"],
  "Dante": ["Ruvox", "Onos"],
  "Khora": ["Hystrix"],
  "Gauss": ["Acceltra", "Akarius"],
  "Protea": ["Velox"],
  "Mirage": ["Akzani"],
  "Jade": ["Evensong", "Cantare", "Harmony"]
};

// Strict exclusion regex for high-tier / endgame / boss weapons
export const STRICT_BANNED_WEAPONS = /dread|hate|despair|broken war|\bwar\b|kuva|tenet|coda|prime\b|incarnon|prisma|vandal|wraith/i;

// Standard Rank 1 Allowed Weapon Pools
export const BASE_STARTER_PRIMARIES = [
  "Braton", "Paris", "Strun", "Boltor", "Burston", "Latron",
  "Karak", "Grakata", "Dera", "Tetra", "Gorgon", "Boar", "Cernos", "Attica"
];

export const BASE_STARTER_SECONDARIES = [
  "Lato", "Kunai", "Furis", "Lex", "Sonicor"
];

export const BASE_STARTER_MELEES = [
  "Skana", "Dual Skana", "Bo", "Cronus", "Orthos", "Furax",
  "Pangolin Sword", "Guandao", "Dual Cleavers", "Fragor", "Dual Kamas"
];

// Baseline definitions for the iconic Starter Trio to guarantee availability
export const CANONICAL_STARTER_FRAMES = [
  {
    name: "Excalibur",
    theme: "The Swordsman (Balanced Melee & Mobility)",
    img: "systems/warframe-ttrpg/asset/classe/Excalibur.webp",
    system: {
      description: "Excalibur is a master of blades, combining offense and defense in a highly balanced kit. He excels at close-quarters sword combat and swift mobility.",
      baseHealth: 270,
      baseShields: 270,
      baseArmor: 240,
      baseEnergy: 100,
      passive: "Swordsmanship: +10% Damage and Speed with Sword Melee weapons.",
      activeMechanic: "Exalted Might: Access Exalted Blade.",
      advancements: {
        "adv_excal_hp_1": { level: 1, type: "HitPoints", health: 270, shields: 270, energy: 100, armor: 240 },
        "adv_excal_tr_1": { level: 1, type: "Traits", saves: ["physique", "prowess"], skills: ["athletics", "acrobatics"] },
        "adv_excal_gr_1": {
          level: 1,
          type: "GrantItems",
          uuids: [
            "Compendium.warframe-ttrpg.warframes.excalpassive0001",
            "Compendium.warframe-ttrpg.warframes.excalpower000001"
          ]
        }
      }
    }
  },
  {
    name: "Mag",
    theme: "The Magnetic Controller (Crowd Control & Shield Manipulation)",
    img: "systems/warframe-ttrpg/asset/classe/Mag.webp",
    system: {
      description: "Mag is a master of magnetic forces. She controls enemy positioning, strips shields and armor, and redirects enemy bullets into destructive gravity-wells.",
      baseHealth: 180,
      baseShields: 455,
      baseArmor: 105,
      baseEnergy: 140,
      passive: "Magnetic Attraction: Vacuum nearby loot and items to yourself within 15 ft.",
      activeMechanic: "Magnetize: Create a magnetic field around target.",
      advancements: {
        "adv_mag_hp_1": { level: 1, type: "HitPoints", health: 180, shields: 455, energy: 140, armor: 105 },
        "adv_mag_tr_1": { level: 1, type: "Traits", saves: ["systems", "focus"], skills: ["perception", "void"] },
        "adv_mag_gr_1": {
          level: 1,
          type: "GrantItems",
          uuids: [
            "Compendium.warframe-ttrpg.warframes.magpassive000001",
            "Compendium.warframe-ttrpg.warframes.magpower00000001"
          ]
        }
      }
    }
  },
  {
    name: "Volt",
    theme: "The Electric Specialist (High Speed & Chain-Lightning)",
    img: "systems/warframe-ttrpg/asset/classe/Volt.webp",
    system: {
      description: "Volt is an electrical storm controller. Highly mobile, he provides speed boosts and shielding to allies, shock-stunning entire squads with arcs of chain lightning.",
      baseHealth: 270,
      baseShields: 455,
      baseArmor: 105,
      baseEnergy: 100,
      passive: "Static Discharge: Gain extra electrical damage on next hit based on distance traveled.",
      activeMechanic: "Overload: Deal electrical damage in an area.",
      advancements: {
        "adv_volt_hp_1": { level: 1, type: "HitPoints", health: 270, shields: 455, energy: 100, armor: 105 },
        "adv_volt_tr_1": { level: 1, type: "Traits", saves: ["prowess", "systems"], skills: ["engineering", "reflexes"] },
        "adv_volt_gr_1": {
          level: 1,
          type: "GrantItems",
          uuids: [
            "Compendium.warframe-ttrpg.warframes.voltpassive00001",
            "Compendium.warframe-ttrpg.warframes.voltpower0000001"
          ]
        }
      }
    }
  }
];

// The 5 Focus Schools definitions
export const FOCUS_SCHOOLS_DATA = [
  {
    name: "Madurai",
    title: "The School of Destruction",
    icon: "systems/warframe-ttrpg/asset/polarity icon/Madurai_Pol(xBlack).jpg",
    philosophy: "Focuses on speed and overwhelming weapon ferocity. Promotes offensive power, critical strikes, and destructive physical and elemental damage.",
    starterNode: "Phoenix Talons",
    nodeDesc: "+10% Damage bonus to all physical and elemental attacks.",
    defaultNodes: { phoenixTalons: true }
  },
  {
    name: "Vazarin",
    title: "The School of Mending",
    icon: "systems/warframe-ttrpg/asset/polarity icon/Vazarin_Pol(xBlack).jpg",
    philosophy: "Focuses on defense, resilience, health, and shields. Promotes survivability, team warding, and rapid recovery from lethal trauma.",
    starterNode: "Mending Talons",
    nodeDesc: "+10% healing efficiency on all spells and abilities.",
    defaultNodes: { mendingTalons: true }
  },
  {
    name: "Naramon",
    title: "The School of Tactical Flow",
    icon: "systems/warframe-ttrpg/asset/polarity icon/Naramon_Pol(xBlack).jpg",
    philosophy: "Focuses on combat flow, agility, and melee supremacy. Mitigates combo decay and amplifies melee critical precision.",
    starterNode: "Affinity Spike",
    nodeDesc: "+10% Damage bonus to all melee attacks.",
    defaultNodes: { affinitySpike: true }
  },
  {
    name: "Zenurik",
    title: "L'École de la Maîtrise Mystique",
    icon: "systems/warframe-ttrpg/asset/polarity icon/Zenurik_Pol(xBlack).jpg",
    philosophy: "Se concentre sur la supériorité tactique, la maîtrise du Néant et la régénération constante d'Énergie. Maximise le temps de lancement des pouvoirs.",
    starterNode: "Impulsion Énergétique",
    nodeDesc: "+50 à la réserve maximale de points d'Énergie.",
    defaultNodes: { energyPulse: true }
  },
  {
    name: "Unairu",
    title: "L'École de la Pierre Indomptable",
    icon: "systems/warframe-ttrpg/asset/polarity icon/Unairu_Pol(xBlack).jpg",
    philosophy: "Se concentre sur la défense de pierre, la déviation des dégâts et la fermeté physique. Fait du Tenno une forteresse inébranlable.",
    starterNode: "Peau de Pierre",
    nodeDesc: "+50 à la valeur d'Armure de base.",
    defaultNodes: { stoneSkin: true }
  }
];

export const CORE_ADDITIONAL_FRAMES = [
  {
    name: "Koumei",
    img: "systems/warframe-ttrpg/asset/classe/koumei.webp",
    system: {
      description: "Koumei is the Dice-Maiden, weaving threads of fate to manipulate probability and ensure victory. She gambles with fate, unleashing random effects and using shrine charms to survive.",
      baseHealth: 344,
      baseShields: 122,
      baseArmor: 444,
      baseEnergy: 122,
      passive: "Koumei Passive: Inflict random status effects on hits.",
      activeMechanic: "The Five Fates: Roll d6s to boost ability effectiveness.",
      advancements: {
        "adv_koumei_hp_1": { level: 1, type: "HitPoints", health: 344, shields: 122, energy: 122, armor: 444 },
        "adv_koumei_tr_1": { level: 1, type: "Traits", saves: ["prowess", "focus"], skills: ["reflexes", "perception"] },
        "adv_koumei_gr_1": {
          level: 1,
          type: "GrantItems",
          uuids: ["Compendium.warframe-ttrpg.warframes.koumeipassive001", "Compendium.warframe-ttrpg.warframes.koumeipower00001"]
        }
      }
    }
  },
  {
    name: "Valkyr",
    img: "systems/warframe-ttrpg/asset/classe/valkyr.webp",
    system: {
      description: "Valkyr was modified into a highly motivated and fearsome killer. She is adept at dealing damage and surviving. Her battle cry strikes terror into all who hear it.",
      baseHealth: 650,
      baseShields: 135,
      baseArmor: 855,
      baseEnergy: 100,
      passive: "Rage: builds Rage from melee hits/kills, up to +300% melee damage.",
      activeMechanic: "Nimble Recovery: Valkyr stands up from prone 50% faster.",
      advancements: {
        "adv_valkyr_hp_1": { level: 1, type: "HitPoints", health: 650, shields: 135, energy: 100, armor: 855 },
        "adv_valkyr_tr_1": { level: 1, type: "Traits", saves: ["physique", "prowess"], skills: ["athletics", "reflexes"] },
        "adv_valkyr_gr_1": {
          level: 1,
          type: "GrantItems",
          uuids: ["Compendium.warframe-ttrpg.warframes.valkyrpassive001", "Compendium.warframe-ttrpg.warframes.valkyrpower00011"]
        }
      }
    }
  },
  {
    name: "Ash",
    img: "systems/warframe-ttrpg/asset/classe/Ash.webp",
    system: {
      description: "Behold the patron saint of the Orokin school of political assassination. Ash specializes in stealth. The edge of his blade is sooner felt than seen.",
      baseHealth: 455,
      baseShields: 270,
      baseArmor: 105,
      baseEnergy: 100,
      passive: "Bleed Amplification: Slash procs deal +25% damage.",
      activeMechanic: "Ninja Prowess: Advantage on Stealth and Acrobatics.",
      advancements: {
        "adv_ash_hp_1": { level: 1, type: "HitPoints", health: 455, shields: 270, energy: 100, armor: 105 },
        "adv_ash_tr_1": { level: 1, type: "Traits", saves: ["prowess", "focus"], skills: ["stealth", "acrobatics"] },
        "adv_ash_gr_1": {
          level: 1,
          type: "GrantItems",
          uuids: ["Compendium.warframe-ttrpg.warframes.ashpassive000001", "Compendium.warframe-ttrpg.warframes.ashpower00000011"]
        }
      }
    }
  },
  {
    name: "Nokko",
    img: "systems/warframe-ttrpg/asset/classe/Nokko.webp",
    system: {
      description: "Nokko is a mushroom-themed defender who grows tricky fungi to control the battlefield. He regenerates energy for his allies, and turns into an invulnerable Sprodling to revive himself.",
      baseHealth: 150,
      baseShields: 300,
      baseArmor: 135,
      baseEnergy: 130,
      passive: "Vital Decay: revive with mushrooms upon fatal damage.",
      activeMechanic: "Fungal Spawning: Spawn Stinkbrain and Brightbonnet mushrooms.",
      advancements: {
        "adv_nokko_hp_1": { level: 1, type: "HitPoints", health: 150, shields: 300, energy: 130, armor: 135 },
        "adv_nokko_tr_1": { level: 1, type: "Traits", saves: ["physique", "focus"], skills: ["survival", "perception"] },
        "adv_nokko_gr_1": {
          level: 1,
          type: "GrantItems",
          uuids: ["Compendium.warframe-ttrpg.warframes.nokkopassive0001", "Compendium.warframe-ttrpg.warframes.nokkopower000001"]
        }
      }
    }
  },
  {
    name: "Uriel",
    img: "systems/warframe-ttrpg/asset/classe/Uriel.webp",
    system: {
      description: "L'Hérétique de Xata commande à la Légion des démons. Uriel canalise les flammes sombres, sacrifie la vitalité de ses fiélons pour maudire ses proies et déchaîne l'enfer de Brimstone.",
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
  },
  {
    name: "Atlas",
    img: "systems/warframe-ttrpg/asset/classe/Atlas.webp",
    system: {
      description: "Enemies tremble before the brawler with fists as hard as stone. Atlas deals high damage. Command terrestrial elements that form the foundation of any battlefield.",
      baseHealth: 270,
      baseShields: 270,
      baseArmor: 475,
      baseEnergy: 175,
      passive: "Immovable Rock: Immune to Knockdown while on ground.",
      activeMechanic: "Rubble: Stacks bonus armor up to 1500.",
      advancements: {
        "adv_atlas_hp_1": { level: 1, type: "HitPoints", health: 270, shields: 270, energy: 175, armor: 475 },
        "adv_atlas_tr_1": { level: 1, type: "Traits", saves: ["physique", "focus"], skills: ["athletics", "survival"] },
        "adv_atlas_gr_1": {
          level: 1,
          type: "GrantItems",
          uuids: ["Compendium.warframe-ttrpg.warframes.atlaspassive0001", "Compendium.warframe-ttrpg.warframes.atlaspower000011"]
        }
      }
    }
  },
  {
    name: "Vauban",
    img: "systems/warframe-ttrpg/asset/classe/vauban.webp",
    system: {
      description: "Vauban is the model of innovative technology. He deploys clever inventions to provide crowd control. His tenacity and focus make him formidable.",
      baseHealth: 270,
      baseShields: 270,
      baseArmor: 160,
      baseEnergy: 150,
      passive: "Passive: Invalidate targets with tactical devices.",
      activeMechanic: "Deployable Ordnance: Deploy multi-functional traps.",
      advancements: {
        "adv_vauban_hp_1": { level: 1, type: "HitPoints", health: 270, shields: 270, energy: 150, armor: 160 },
        "adv_vauban_tr_1": { level: 1, type: "Traits", saves: ["systems", "focus"], skills: ["engineering", "perception"] },
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
        "adv_vauban_gr_22": { level: 22, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
        "adv_vauban_gr_23": { level: 23, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
        "adv_vauban_asi24": { level: 24, type: "AbilityScoreImprovement", points: 2 },
        "adv_vauban_gr_25": { level: 25, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubanpower00143"] },
        "adv_vauban_gr_26": { level: 26, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.bonusskillprof01"] },
        "adv_vauban_gr_27": { level: 27, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.magsavefocus0001"] },
        "adv_vauban_asi28": { level: 28, type: "AbilityScoreImprovement", points: 2 },
        "adv_vauban_gr_29": { level: 29, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.excalsavephys001"] },
        "adv_vauban_gr_30": { level: 30, type: "GrantItems", uuids: ["Compendium.warframe-ttrpg.warframes.vaubancaps000001"] }
      }
    }
  }
];

const BaseApplication = (typeof Application !== "undefined")
  ? Application
  : (globalThis.Application || class {
      render() { return this; }
      close() { return Promise.resolve(); }
      getData() { return Promise.resolve({}); }
      activateListeners() {}
    });

export const STAT_PRESETS_DATA = [
  {
    id: "balanced",
    name: "Équilibré",
    icon: "fas fa-balance-scale",
    scores: { physique: 12, prowess: 12, systems: 12, focus: 12 },
    scoresLabel: "12 / 12 / 12 / 12",
    tagline: "Polyvalent Universel",
    description: "Équilibre parfait sur les quatre caractéristiques (+1 chacune). Fiable et complet, sans aucune faiblesse critique."
  },
  {
    id: "specialist",
    name: "Spécialiste",
    icon: "fas fa-shield-alt",
    scores: { physique: 16, prowess: 12, systems: 10, focus: 10 },
    scoresLabel: "16 / 12 / 10 / 10",
    tagline: "Première Ligne / Tank",
    description: "Physique maximal (+3) avec une solide Prouesse (+1). Santé et survie maximales pour les colosses de première ligne."
  },
  {
    id: "martial",
    name: "Martial",
    icon: "fas fa-fist-raised",
    scores: { physique: 15, prowess: 15, systems: 9, focus: 9 },
    scoresLabel: "15 / 15 / 9 / 9",
    tagline: "Maître d'Armes / Éclaireur",
    description: "Double maîtrise en Physique et Prouesse (+2/+2). Conçu pour les maîtres de la lame agiles et les escarmoucheurs véloces."
  },
  {
    id: "techno",
    name: "Techno-Néant",
    icon: "fas fa-microchip",
    scores: { physique: 10, prowess: 10, systems: 15, focus: 13 },
    scoresLabel: "10 / 10 / 15 / 13",
    tagline: "Lanceur Techno / Contrôleur",
    description: "Systèmes (+2) et Focalisation (+1) puissants. Optimisé pour la puissance des pouvoirs, le piratage et l'énergie du Néant."
  },
  {
    id: "random",
    name: "Aléatoire (48)",
    icon: "fas fa-random",
    scores: null,
    scoresLabel: "Aléatoire (48 pts)",
    tagline: "Matrice Neurale Dynamique",
    description: "Distribution neurale Orokin imprévisible. Génère une configuration équilibrée aléatoire totalisant exactement 48 points."
  }
];

export class CharacterCreationWizard extends BaseApplication {
  constructor(actor, options = {}) {
    super(options);
    this.actor = actor;
    this.step = 1; // 1: Warframe, 2: Attributes, 3: Focus School, 4: Arsenal, 5: Summary
    this.tennoName = actor?.name || "Initiate Tenno";
    this.selectedWarframe = null;
    this.selectedSchool = null;
    this.selectedPrimary = null;
    this.selectedSecondary = null;
    this.selectedMelee = null;
    this.weaponTab = "primary"; // "primary" | "secondary" | "melee"
    this.warframeSearch = "";
    this.weaponSearch = "";

    // Attributes & Stat Allocation
    this.statMethod = "point_buy"; // "point_buy" | "rolled"
    this.attributes = {
      physique: 12,
      prowess: 12,
      systems: 12,
      focus: 12
    };
    this.activePreset = "balanced";

    // Load Roll Sets and Active Set Index
    this.rollSets = actor?.getFlag("warframe-ttrpg", "wizardRollSets") || [];
    this.activeSetIndex = Number(actor?.getFlag("warframe-ttrpg", "wizardActiveSetIndex")) || 0;

    // Backward compatibility & migration: if legacy wizardRolledScores exists but wizardRollSets is empty
    if ((!this.rollSets || this.rollSets.length === 0) && actor?.getFlag("warframe-ttrpg", "wizardRolledScores")?.length === 4) {
      const oldScores = actor.getFlag("warframe-ttrpg", "wizardRolledScores");
      const oldAssigned = actor.getFlag("warframe-ttrpg", "wizardAssignedRolls") || {
        physique: null, prowess: null, systems: null, focus: null
      };
      const totalSum = oldScores.reduce((acc, r) => acc + (r.total || 0), 0);
      this.rollSets = [{
        index: 0,
        rolls: oldScores,
        totalSum,
        assignedRolls: oldAssigned
      }];
      this.activeSetIndex = 0;
    }

    this.rollCount = Number(actor?.getFlag("warframe-ttrpg", "statRollAttempts")) || this.rollSets.length;
    // Ensure rollCount is never desynced from actual recorded sets during character creation
    if (this.rollSets.length < 2 && this.rollCount > this.rollSets.length) {
      this.rollCount = this.rollSets.length;
      if (this.actor) {
        this.actor.setFlag("warframe-ttrpg", "statRollAttempts", this.rollCount);
      }
    }

    if (this.activeSetIndex >= this.rollSets.length) {
      this.activeSetIndex = Math.max(0, this.rollSets.length - 1);
    }

    const currentSet = this.rollSets[this.activeSetIndex] || null;
    this.rolledScores = currentSet ? currentSet.rolls : [];
    this.assignedRolls = currentSet ? currentSet.assignedRolls : {
      physique: null,
      prowess: null,
      systems: null,
      focus: null
    };

    // If active set rolls already exist and are assigned, sync this.attributes
    if (this.rolledScores && this.rolledScores.length === 4) {
      for (let [s, idx] of Object.entries(this.assignedRolls)) {
        if (idx !== null && this.rolledScores[idx]) {
          this.attributes[s] = this.rolledScores[idx].total;
        }
      }
    }

    // Track state on actor
    if (this.actor) {
      this.actor._wizardOpen = true;
    }
  }

  static get defaultOptions() {
    const w = (typeof window !== "undefined" && window.innerWidth) ? window.innerWidth : 1200;
    const h = (typeof window !== "undefined" && window.innerHeight) ? window.innerHeight : 900;
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "character-creation-wizard",
      classes: ["warframe-sheet", "character-wizard-window", "fullscreen-wizard"],
      template: "systems/warframe-ttrpg/templates/character-wizard.html",
      title: "Éveil Tenno - Protocole de Création de Personnage",
      width: w,
      height: h,
      top: 0,
      left: 0,
      resizable: true
    });
  }

  /** @override */
  setPosition(position = {}) {
    if (typeof window !== "undefined") {
      position.top = 0;
      position.left = 0;
      position.width = window.innerWidth;
      position.height = window.innerHeight;
    }
    return super.setPosition(position);
  }

  /** @override */
  async close(options = {}) {
    if (this._onWindowResize) {
      window.removeEventListener("resize", this._onWindowResize);
    }
    if (this.actor) {
      this.actor._wizardOpen = false;
    }
    return super.close(options);
  }

  /**
   * Static helper to check if wizard should automatically open for a blank actor
   */
  static checkAndPrompt(actor, sheet) {
    if (!actor || actor.type !== "warframe") return false;

    // Check permissions: Trusted Player (role >= 2) or GM
    const isTrusted = (game.user.role >= (CONST.USER_ROLES.TRUSTED ?? 2)) || game.user.isGM;
    if (!isTrusted) return false;

    // Check if actor is blank
    const hasEquippedFrame = actor.items.some(i => i.type === "warframe");
    const wizardCompleted = actor.getFlag("warframe-ttrpg", "wizardCompleted");
    if (hasEquippedFrame || wizardCompleted) return false;

    // Avoid double opening
    if (actor._wizardOpen) return false;

    const wizard = new CharacterCreationWizard(actor);
    wizard.render(true);
    return true;
  }

  /**
   * Helper to detect which preset matches current attributes
   */
  _detectActivePreset() {
    const { physique, prowess, systems, focus } = this.attributes;
    if (physique === 12 && prowess === 12 && systems === 12 && focus === 12) return "balanced";
    if (physique === 16 && prowess === 12 && systems === 10 && focus === 10) return "specialist";
    if (physique === 15 && prowess === 15 && systems === 9 && focus === 9) return "martial";
    if (physique === 10 && prowess === 10 && systems === 15 && focus === 13) return "techno";
    if (this.activePreset === "random") return "random";
    return null;
  }

  /** @override */
  async getData() {
    const context = (typeof super.getData === "function" ? await super.getData() : {}) || {};

    context.step = this.step;
    context.tennoName = this.tennoName;
    context.selectedWarframe = this.selectedWarframe;
    context.selectedSchool = this.selectedSchool;
    context.selectedPrimary = this.selectedPrimary;
    context.selectedSecondary = this.selectedSecondary;
    context.selectedMelee = this.selectedMelee;
    context.weaponTab = this.weaponTab;
    context.warframeSearch = this.warframeSearch;
    context.weaponSearch = this.weaponSearch;

    // 1. Gather all Warframes
    const allFrames = await this._getAvailableWarframes();
    context.allWarframes = allFrames;

    // Starters Trio
    context.starters = allFrames.filter(f => ["Excalibur", "Mag", "Volt"].includes(f.name));

    // Filtered archive frames
    const query = (this.warframeSearch || "").toLowerCase().trim();
    context.filteredWarframes = allFrames.filter(f => {
      if (!query) return true;
      return f.name.toLowerCase().includes(query) || (f.system?.description || "").toLowerCase().includes(query);
    });

    // Signature weapons tag for selected frame
    if (this.selectedWarframe) {
      const sigs = SIGNATURE_WEAPONS[this.selectedWarframe.name];
      context.selectedWarframeSignatures = sigs ? sigs.join(", ") : null;
    }

    // 2. Focus Schools
    context.focusSchools = FOCUS_SCHOOLS_DATA;
    context.selectedSchoolData = FOCUS_SCHOOLS_DATA.find(s => s.name === this.selectedSchool) || null;

    // 3. Weapons
    const currentFrameName = this.selectedWarframe?.name || "";
    const weaponPools = this._getAvailableWeapons(currentFrameName);
    context.primaryWeapons = weaponPools.primaries;
    context.secondaryWeapons = weaponPools.secondaries;
    context.meleeWeapons = weaponPools.melees;

    // Active weapon tab list
    let currentList = [];
    if (this.weaponTab === "primary") currentList = weaponPools.primaries;
    else if (this.weaponTab === "secondary") currentList = weaponPools.secondaries;
    else if (this.weaponTab === "melee") currentList = weaponPools.melees;

    // Filter by search query & mark selected
    const wQuery = (this.weaponSearch || "").toLowerCase().trim();
    context.currentWeaponList = currentList.filter(w => {
      if (!wQuery) return true;
      return w.name.toLowerCase().includes(wQuery) || (w.system?.subtype || "").toLowerCase().includes(wQuery);
    }).map(w => {
      let isSelected = false;
      if (this.weaponTab === "primary" && this.selectedPrimary?.name === w.name) isSelected = true;
      if (this.weaponTab === "secondary" && this.selectedSecondary?.name === w.name) isSelected = true;
      if (this.weaponTab === "melee" && this.selectedMelee?.name === w.name) isSelected = true;
      return { ...w, isSelected };
    });

    // 0. Attributes calculations
    const totalAllocated = Number(this.attributes.physique) + Number(this.attributes.prowess) + Number(this.attributes.systems) + Number(this.attributes.focus);
    const remainingPoints = 48 - totalAllocated;
    const overPoints = Math.max(0, totalAllocated - 48);
    const isPointBuyValid = (totalAllocated === 48);

    const statMods = {
      physique: Math.floor((this.attributes.physique - 10) / 2),
      prowess: Math.floor((this.attributes.prowess - 10) / 2),
      systems: Math.floor((this.attributes.systems - 10) / 2),
      focus: Math.floor((this.attributes.focus - 10) / 2)
    };
    const statModLabels = {
      physique: statMods.physique >= 0 ? `+${statMods.physique}` : `${statMods.physique}`,
      prowess: statMods.prowess >= 0 ? `+${statMods.prowess}` : `${statMods.prowess}`,
      systems: statMods.systems >= 0 ? `+${statMods.systems}` : `${statMods.systems}`,
      focus: statMods.focus >= 0 ? `+${statMods.focus}` : `${statMods.focus}`
    };

    const activeSet = this.rollSets[this.activeSetIndex] || null;
    const rolledScores = activeSet ? activeSet.rolls : (this.rolledScores || []);
    const assignedRolls = activeSet ? activeSet.assignedRolls : (this.assignedRolls || {
      physique: null, prowess: null, systems: null, focus: null
    });

    const hasRolled = rolledScores && rolledScores.length === 4;
    const allRollsAssigned = hasRolled &&
      assignedRolls.physique !== null &&
      assignedRolls.prowess !== null &&
      assignedRolls.systems !== null &&
      assignedRolls.focus !== null;

    const rolledOptions = (rolledScores || []).map((roll, idx) => {
      let isAssignedTo = null;
      for (let [s, aIdx] of Object.entries(assignedRolls)) {
        if (aIdx === idx) {
          isAssignedTo = s.capitalize();
          break;
        }
      }
      return {
        id: idx,
        displayIndex: idx + 1,
        total: roll.total,
        kept: roll.kept.join(" + "),
        dropped: roll.dropped,
        dice: roll.dice,
        isAssignedTo
      };
    });

    const formattedRollSets = (this.rollSets || []).map((set, idx) => {
      const scores = (set.rolls || []).map(r => r.total);
      const totalSum = set.totalSum || scores.reduce((a, b) => a + b, 0);
      const isAssignedComplete = Boolean(
        set.assignedRolls &&
        set.assignedRolls.physique !== null &&
        set.assignedRolls.prowess !== null &&
        set.assignedRolls.systems !== null &&
        set.assignedRolls.focus !== null
      );
      return {
        index: idx,
        displayIndex: idx + 1,
        totalSum,
        scoresList: scores,
        scoresSummary: scores.join(", "),
        isActive: (idx === this.activeSetIndex),
        isAssignedComplete
      };
    });

    const activePresetId = this._detectActivePreset();
    const statPresets = STAT_PRESETS_DATA.map(p => ({
      ...p,
      isActive: (activePresetId === p.id)
    }));

    const canProceedFromStats = this.statMethod === "point_buy" ? isPointBuyValid : allRollsAssigned;

    context.statMethod = this.statMethod;
    context.statPresets = statPresets;
    context.activePreset = activePresetId;
    context.attributes = this.attributes;
    context.statMods = statMods;
    context.statModLabels = statModLabels;
    context.totalAllocated = totalAllocated;
    context.remainingPoints = remainingPoints;
    context.overPoints = overPoints;
    context.isPointBuyValid = isPointBuyValid;
    context.rollCount = this.rollCount;
    context.canRoll = this.rollCount < 2;
    context.hasRolled = hasRolled;
    context.rollSets = formattedRollSets;
    context.hasMultipleSets = formattedRollSets.length > 1;
    context.activeSetIndex = this.activeSetIndex;
    context.activeSetDisplayIndex = this.activeSetIndex + 1;
    context.activeSet = activeSet;
    context.rolledScores = rolledScores;
    context.rolledOptions = rolledOptions;
    context.assignedRolls = assignedRolls;
    context.allRollsAssigned = allRollsAssigned;
    context.canProceedFromStats = canProceedFromStats;

    // Step navigation validations
    context.canProceedFromWeapons = Boolean(this.selectedPrimary && this.selectedSecondary && this.selectedMelee);
    context.canGoNext = false;
    if (this.step === 1 && this.selectedWarframe) context.canGoNext = true;
    if (this.step === 2 && canProceedFromStats) context.canGoNext = true;
    if (this.step === 3 && this.selectedSchool) context.canGoNext = true;
    if (this.step === 4 && context.canProceedFromWeapons) context.canGoNext = true;
    if (this.step === 5) context.canGoNext = true;

    return context;
  }

  /**
   * Resolves all Warframes from Compendium, World, and Datasets
   */
  async _getAvailableWarframes() {
    const frameMap = new Map();

    // 1. Add canonical starter trio baseline
    for (let starter of CANONICAL_STARTER_FRAMES) {
      frameMap.set(starter.name, { ...starter, _id: starter.name.toLowerCase() + "_def" });
    }

    // 1b. Add additional core baseline frames (Koumei, Valkyr, Ash, Nokko, Uriel, Atlas, Vauban)
    for (let frame of CORE_ADDITIONAL_FRAMES) {
      if (!frameMap.has(frame.name)) {
        frameMap.set(frame.name, { ...frame, _id: frame.name.toLowerCase() + "_core" });
      }
    }

    // 2. Add from newWarframeClasses dataset
    for (let wf of newWarframeClasses) {
      if (!frameMap.has(wf.name)) {
        frameMap.set(wf.name, wf);
      }
    }

    // 3. Query world items
    for (let item of game.items) {
      if (item.type === "warframe") {
        frameMap.set(item.name, {
          name: item.name,
          img: item.img,
          system: foundry.utils.deepClone(item.system),
          _id: item.id
        });
      }
    }

    // 4. Query Compendium pack if available
    const pack = game.packs.get("warframe-ttrpg.warframes");
    if (pack) {
      try {
        const index = await pack.getIndex({ fields: ["img", "system", "type"] });
        for (let ent of index) {
          if (ent.type === "warframe") {
            const existing = frameMap.get(ent.name);
            if (existing) {
              if (ent.system?.advancements && Object.keys(ent.system.advancements).length > Object.keys(existing.system?.advancements || {}).length) {
                existing.system.advancements = foundry.utils.deepClone(ent.system.advancements);
              }
              if (ent.system?.description && !existing.system?.description) {
                existing.system.description = ent.system.description;
              }
            } else {
              frameMap.set(ent.name, {
                name: ent.name,
                img: ent.img,
                system: foundry.utils.deepClone(ent.system),
                _id: ent._id || ent.id
              });
            }
          }
        }
      } catch (e) {
        console.warn("Warframe TTRPG | Failed to index warframes pack:", e);
      }
    }

    // Sort: Starters first, then alphabetical
    const all = Array.from(frameMap.values());
    all.sort((a, b) => {
      const aStarter = ["Excalibur", "Mag", "Volt"].indexOf(a.name);
      const bStarter = ["Excalibur", "Mag", "Volt"].indexOf(b.name);
      if (aStarter !== -1 && bStarter !== -1) return aStarter - bStarter;
      if (aStarter !== -1) return -1;
      if (bStarter !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    return all;
  }

  /**
   * Resolves starter weapons, applying strict bans and injecting chosen Warframe's signature gear
   */
  _getAvailableWeapons(frameName) {
    const signatures = (SIGNATURE_WEAPONS[frameName] || []).map(s => s.toLowerCase());

    const primMap = new Map();
    const secMap = new Map();
    const melMap = new Map();

    // 1. Ingest all primary weapons from dataset
    for (let w of primaryWeaponsDataset) {
      if (!STRICT_BANNED_WEAPONS.test(w.name)) {
        const isSig = signatures.includes(w.name.toLowerCase());
        primMap.set(w.name.toLowerCase(), { ...w, isSignature: isSig });
      }
    }

    // 2. Ingest all secondary weapons from dataset
    for (let w of secondaryWeaponsDataset) {
      if (!STRICT_BANNED_WEAPONS.test(w.name)) {
        const isSig = signatures.includes(w.name.toLowerCase());
        secMap.set(w.name.toLowerCase(), { ...w, isSignature: isSig });
      }
    }

    // 3. Ingest all melee weapons from dataset
    for (let w of meleeWeaponsDataset) {
      if (!STRICT_BANNED_WEAPONS.test(w.name)) {
        const isSig = signatures.includes(w.name.toLowerCase());
        melMap.set(w.name.toLowerCase(), { ...w, isSignature: isSig });
      }
    }

    // 4. Ingest any world weapons (e.g. GM created or compendium items)
    if (typeof game !== "undefined" && game.items) {
      for (let item of game.items) {
        if (item.type === "weapon" && !STRICT_BANNED_WEAPONS.test(item.name)) {
          const wObj = item.toObject();
          const sub = (wObj.system?.type || "").toLowerCase();
          const isSig = signatures.includes(wObj.name.toLowerCase());
          const packaged = { ...wObj, isSignature: isSig };
          const key = wObj.name.toLowerCase();

          if (sub === "primary" && !primMap.has(key)) primMap.set(key, packaged);
          else if (sub === "secondary" && !secMap.has(key)) secMap.set(key, packaged);
          else if (sub === "melee" && !melMap.has(key)) melMap.set(key, packaged);
        }
      }
    }

    const sortFn = (a, b) => {
      if (a.isSignature && !b.isSignature) return -1;
      if (!a.isSignature && b.isSignature) return 1;
      return a.name.localeCompare(b.name);
    };

    const primaries = Array.from(primMap.values()).sort(sortFn);
    const secondaries = Array.from(secMap.values()).sort(sortFn);
    const melees = Array.from(melMap.values()).sort(sortFn);

    return { primaries, secondaries, melees };
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Keep wizard synced to full viewport on resize
    if (!this._resizeAttached && typeof window !== "undefined") {
      this._onWindowResize = () => {
        this.setPosition();
      };
      window.addEventListener("resize", this._onWindowResize);
      this._resizeAttached = true;
    }

    // Stepper header navigation
    html.find(".step-badge").click(ev => {
      const targetStep = Number(ev.currentTarget.dataset.step);
      if (targetStep < this.step) {
        this.step = targetStep;
        this.render();
      }
    });

    // Footer Next / Prev buttons
    html.find(".btn-prev").click(() => {
      if (this.step > 1) {
        this.step--;
        this.render();
      }
    });

    html.find(".btn-next").click(() => {
      if (this.step < 5) {
        this.step++;
        this.render();
      }
    });

    html.find(".btn-finish-shortcut").click(() => {
      this._completeAwakening();
    });

    // STEP 1: Warframe Selection
    if (this.step === 1) {
      // Live search input
      html.find(".warframe-search-input").on("input", ev => {
        this.warframeSearch = ev.target.value;
        const query = this.warframeSearch.toLowerCase().trim();
        html.find(".archive-cards-grid .warframe-card").each((_, el) => {
          const name = ($(el).data("frameName") || "").toLowerCase();
          $(el).toggle(!query || name.includes(query));
        });
      });

      // Selecting a Warframe card
      html.find(".warframe-card").click(async ev => {
        const frameName = $(ev.currentTarget).data("frameName");
        const all = await this._getAvailableWarframes();
        const found = all.find(f => f.name === frameName);
        if (found) {
          this.selectedWarframe = found;
          // Pre-select signature weapon if available
          const sigs = SIGNATURE_WEAPONS[frameName] || [];
          if (sigs.length > 0) {
            const pools = this._getAvailableWeapons(frameName);
            const sigPrim = pools.primaries.find(p => p.isSignature);
            const sigSec = pools.secondaries.find(s => s.isSignature);
            const sigMel = pools.melees.find(m => m.isSignature);
            if (sigPrim && !this.selectedPrimary) this.selectedPrimary = sigPrim;
            if (sigSec && !this.selectedSecondary) this.selectedSecondary = sigSec;
            if (sigMel && !this.selectedMelee) this.selectedMelee = sigMel;
          }
          this.render();
        }
      });
    }

    // STEP 2: Attributes & Stat Allocation
    if (this.step === 2) {
      // Toggle allocation method tabs
      html.find(".stat-method-tab").click(ev => {
        ev.preventDefault();
        const method = ev.currentTarget.dataset.method;
        if (method && method !== this.statMethod) {
          this.statMethod = method;
          this.render();
        }
      });

      // Point allocation +/- buttons
      html.find(".point-buy-btn").click(ev => {
        ev.preventDefault();
        const stat = ev.currentTarget.dataset.stat;
        const action = ev.currentTarget.dataset.action;
        const currentVal = Number(this.attributes[stat]) || 10;
        const total = Number(this.attributes.physique) + Number(this.attributes.prowess) + Number(this.attributes.systems) + Number(this.attributes.focus);
        const rem = 48 - total;

        if (action === "inc") {
          if (rem > 0 && currentVal < 18) {
            this.attributes[stat] = currentVal + 1;
            this.render();
          } else if (rem <= 0) {
            ui.notifications.warn("Tous les 48 points sont alloués ! Diminuez une autre caractéristique d'abord pour augmenter celle-ci.");
          } else if (currentVal >= 18) {
            ui.notifications.warn("Le maximum d'une caractéristique est de 18.");
          }
        } else if (action === "dec") {
          if (currentVal > 6) {
            this.attributes[stat] = currentVal - 1;
            this.render();
          } else {
            ui.notifications.warn("Le minimum d'une caractéristique est de 6.");
          }
        }
      });

      // Direct stat input
      html.find(".stat-score-input").on("change", ev => {
        const stat = ev.currentTarget.dataset.stat;
        let val = parseInt(ev.target.value, 10);
        if (isNaN(val)) val = 10;
        val = Math.max(6, Math.min(18, val));
        this.attributes[stat] = val;
        this.render();
      });

      // Point allocation presets
      html.find(".btn-stat-preset").click(ev => {
        ev.preventDefault();
        const preset = ev.currentTarget.dataset.preset;
        this.activePreset = preset;
        if (preset === "balanced") {
          this.attributes = { physique: 12, prowess: 12, systems: 12, focus: 12 };
        } else if (preset === "specialist") {
          this.attributes = { physique: 16, prowess: 12, systems: 10, focus: 10 };
        } else if (preset === "martial") {
          this.attributes = { physique: 15, prowess: 15, systems: 9, focus: 9 };
        } else if (preset === "techno") {
          this.attributes = { physique: 10, prowess: 10, systems: 15, focus: 13 };
        } else if (preset === "random") {
          let a, b, c, d;
          do {
            a = Math.floor(Math.random() * 9) + 8; // 8-16
            b = Math.floor(Math.random() * 9) + 8;
            c = Math.floor(Math.random() * 9) + 8;
            d = 48 - (a + b + c);
          } while (d < 8 || d > 16);
          this.attributes = { physique: a, prowess: b, systems: c, focus: d };
        }
        this.render();
      });

      // Select Active Roll Set (Set 1 vs Set 2)
      html.find(".btn-select-roll-set, .set-choice-card").click(async ev => {
        ev.preventDefault();
        const setIndex = Number(ev.currentTarget.dataset.setIndex);
        if (isNaN(setIndex) || !this.rollSets[setIndex]) return;
        if (this.activeSetIndex === setIndex) return;

        this.activeSetIndex = setIndex;
        const activeSet = this.rollSets[setIndex];
        this.rolledScores = activeSet.rolls;
        this.assignedRolls = activeSet.assignedRolls || {
          physique: null, prowess: null, systems: null, focus: null
        };

        // Sync this.attributes for assigned stats in this set
        for (let [s, idx] of Object.entries(this.assignedRolls)) {
          if (idx !== null && this.rolledScores[idx]) {
            this.attributes[s] = this.rolledScores[idx].total;
          } else {
            this.attributes[s] = 10;
          }
        }

        if (this.actor) {
          await this.actor.setFlag("warframe-ttrpg", "wizardActiveSetIndex", this.activeSetIndex);
          await this.actor.setFlag("warframe-ttrpg", "wizardRolledScores", this.rolledScores);
          await this.actor.setFlag("warframe-ttrpg", "wizardAssignedRolls", this.assignedRolls);
        }

        ui.notifications.info(`Passage au Set ${setIndex + 1} (Total : ${activeSet.totalSum}).`);
        this.render();
      });

      // Reset Rolls button (Creation only)
      html.find(".btn-reset-rolls").click(async ev => {
        ev.preventDefault();
        const confirmed = await Dialog.confirm({
          title: "Réinitialiser les Lancers de Dés ?",
          content: "<p>Êtes-vous sûr de vouloir réinitialiser vos lancers ? Les deux sets seront effacés, vous permettant de relancer à zéro.</p>"
        });
        if (!confirmed) return;

        this.rollCount = 0;
        this.rollSets = [];
        this.activeSetIndex = 0;
        this.rolledScores = [];
        this.assignedRolls = { physique: null, prowess: null, systems: null, focus: null };
        this.attributes = { physique: 12, prowess: 12, systems: 12, focus: 12 };

        if (this.actor) {
          await this.actor.unsetFlag("warframe-ttrpg", "statRollAttempts");
          await this.actor.unsetFlag("warframe-ttrpg", "wizardRollSets");
          await this.actor.unsetFlag("warframe-ttrpg", "wizardActiveSetIndex");
          await this.actor.unsetFlag("warframe-ttrpg", "wizardRolledScores");
          await this.actor.unsetFlag("warframe-ttrpg", "wizardAssignedRolls");
        }

        ui.notifications.info("Lancers de dés réinitialisés. Vous pouvez relancer vos caractéristiques.");
        this.render();
      });

      // Roll 4d6 (best 3) button
      html.find(".btn-roll-stats").click(async ev => {
        ev.preventDefault();
        if (this.rollCount >= 2) {
          ui.notifications.warn("Nombre maximal de 2 tentatives de lancer atteint pour ce personnage lors de la création !");
          return;
        }

        this.rollCount++;
        const rolls = [];
        for (let i = 0; i < 4; i++) {
          const dice = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
          ];
          dice.sort((a, b) => b - a);
          const kept = dice.slice(0, 3);
          const dropped = dice[3];
          const total = kept.reduce((acc, d) => acc + d, 0);
          rolls.push({ id: i, dice, kept, dropped, total });
        }

        const totalSum = rolls.reduce((acc, r) => acc + r.total, 0);
        const newSetIndex = this.rollSets.length;
        const newSet = {
          index: newSetIndex,
          rolls,
          totalSum,
          assignedRolls: { physique: null, prowess: null, systems: null, focus: null }
        };

        this.rollSets.push(newSet);
        this.activeSetIndex = newSetIndex;
        this.rolledScores = newSet.rolls;
        this.assignedRolls = newSet.assignedRolls;

        // Reset attributes for new unassigned set
        this.attributes = { physique: 10, prowess: 10, systems: 10, focus: 10 };

        if (this.actor) {
          await this.actor.setFlag("warframe-ttrpg", "statRollAttempts", this.rollCount);
          await this.actor.setFlag("warframe-ttrpg", "wizardRollSets", this.rollSets);
          await this.actor.setFlag("warframe-ttrpg", "wizardActiveSetIndex", this.activeSetIndex);
          await this.actor.setFlag("warframe-ttrpg", "wizardRolledScores", this.rolledScores);
          await this.actor.setFlag("warframe-ttrpg", "wizardAssignedRolls", this.assignedRolls);
        }

        if (this.rollCount === 1) {
          ui.notifications.info(`Set 1 lancé (Total : ${totalSum}) ! Il vous reste 1 tentative de relance.`);
        } else {
          ui.notifications.info(`Set 2 lancé (Total : ${totalSum}) ! Vous pouvez maintenant basculer entre le Set 1 et le Set 2 pour choisir le meilleur.`);
        }
        this.render();
      });

      // Assignment dropdown change
      html.find(".assign-stat-select").on("change", async ev => {
        const stat = ev.currentTarget.dataset.stat;
        const valStr = ev.target.value;
        const rollIdx = valStr === "" ? null : Number(valStr);

        if (rollIdx !== null) {
          // If another stat currently has this roll assigned, swap it
          for (let [otherStat, currentIdx] of Object.entries(this.assignedRolls)) {
            if (otherStat !== stat && currentIdx === rollIdx) {
              this.assignedRolls[otherStat] = this.assignedRolls[stat];
            }
          }
          this.assignedRolls[stat] = rollIdx;
        } else {
          this.assignedRolls[stat] = null;
        }

        // Update active set in rollSets
        if (this.rollSets[this.activeSetIndex]) {
          this.rollSets[this.activeSetIndex].assignedRolls = foundry.utils.duplicate(this.assignedRolls);
        }

        // Synchronize this.attributes from assigned rolls
        for (let [s, idx] of Object.entries(this.assignedRolls)) {
          if (idx !== null && this.rolledScores[idx]) {
            this.attributes[s] = this.rolledScores[idx].total;
          }
        }

        if (this.actor) {
          await this.actor.setFlag("warframe-ttrpg", "wizardRollSets", this.rollSets);
          await this.actor.setFlag("warframe-ttrpg", "wizardAssignedRolls", this.assignedRolls);
        }

        this.render();
      });
    }

    // STEP 3: Focus School Selection
    if (this.step === 3) {
      html.find(".school-card").click(ev => {
        const schoolName = $(ev.currentTarget).data("schoolName");
        this.selectedSchool = schoolName;
        this.render();
      });
    }

    // STEP 4: Weapon Selection
    if (this.step === 4) {
      // Switch weapon tab
      html.find(".weapon-tab-btn").click(ev => {
        this.weaponTab = ev.currentTarget.dataset.tab;
        this.weaponSearch = "";
        this.render();
      });

      // Click summary slot to jump to that tab
      html.find(".arsenal-slot-preview").click(ev => {
        const targetTab = $(ev.currentTarget).data("switchTab");
        if (targetTab) {
          this.weaponTab = targetTab;
          this.weaponSearch = "";
          this.render();
        }
      });

      // Weapon live search filter
      html.find(".weapon-search-input").on("input", ev => {
        this.weaponSearch = ev.target.value;
        const query = this.weaponSearch.toLowerCase().trim();
        html.find(".weapons-grid .weapon-card").each((_, el) => {
          const name = ($(el).data("weaponName") || "").toLowerCase();
          $(el).toggle(!query || name.includes(query));
        });
      });

      // Selecting a weapon card
      html.find(".weapon-card").click(ev => {
        const weaponName = $(ev.currentTarget).data("weaponName");
        const pools = this._getAvailableWeapons(this.selectedWarframe?.name || "");
        let pool = [];
        if (this.weaponTab === "primary") pool = pools.primaries;
        else if (this.weaponTab === "secondary") pool = pools.secondaries;
        else if (this.weaponTab === "melee") pool = pools.melees;

        const weapon = pool.find(w => w.name === weaponName);
        if (weapon) {
          if (this.weaponTab === "primary") this.selectedPrimary = weapon;
          else if (this.weaponTab === "secondary") this.selectedSecondary = weapon;
          else if (this.weaponTab === "melee") this.selectedMelee = weapon;
          this.render();
        }
      });
    }

    // STEP 5: Summary & Awakening
    if (this.step === 5) {
      html.find(".wizard-name-input").on("change", ev => {
        this.tennoName = ev.target.value.trim() || this.actor.name;
      });

      html.find(".btn-awaken-tenno").click(() => {
        this._completeAwakening();
      });
    }
  }

  /**
   * Final Transference Awakening Action: Seeds the Actor with all configured elements
   */
  async _completeAwakening() {
    if (!this.selectedWarframe) {
      ui.notifications.warn("Please select a Warframe first!");
      this.step = 1;
      return this.render();
    }

    const totalAllocated = Number(this.attributes.physique) + Number(this.attributes.prowess) + Number(this.attributes.systems) + Number(this.attributes.focus);
    if (this.statMethod === "point_buy" && totalAllocated !== 48) {
      ui.notifications.warn(`Please allocate exactly 48 points across your attributes (Currently ${totalAllocated}/48)!`);
      this.step = 2;
      return this.render();
    }

    const allRollsAssigned = this.rolledScores && this.rolledScores.length === 4 &&
      this.assignedRolls.physique !== null &&
      this.assignedRolls.prowess !== null &&
      this.assignedRolls.systems !== null &&
      this.assignedRolls.focus !== null;
    if (this.statMethod === "rolled" && !allRollsAssigned) {
      ui.notifications.warn("Please roll and assign all 4 attribute scores!");
      this.step = 2;
      return this.render();
    }

    if (!this.selectedSchool) {
      ui.notifications.warn("Please select a Focus School!");
      this.step = 3;
      return this.render();
    }
    if (!this.selectedPrimary || !this.selectedSecondary || !this.selectedMelee) {
      ui.notifications.warn("Please equip 1 Primary, 1 Secondary, and 1 Melee weapon!");
      this.step = 4;
      return this.render();
    }

    ui.notifications.info(`Initialisation de la séquence d'Éveil par Transférence pour ${this.tennoName}...`);

    try {
      // 1. Prepare Actor Updates
      const baseH = Number(this.selectedWarframe.system?.baseHealth) || 100;
      const baseS = Number(this.selectedWarframe.system?.baseShields) || 100;
      const baseE = Number(this.selectedWarframe.system?.baseEnergy) || 100;
      const baseA = Number(this.selectedWarframe.system?.baseArmor) || 100;

      const updates = {
        "system.details.operator": this.selectedSchool,
        "system.details.level.value": 1,
        "system.attributes.physique.value": Number(this.attributes.physique) || 10,
        "system.attributes.prowess.value": Number(this.attributes.prowess) || 10,
        "system.attributes.systems.value": Number(this.attributes.systems) || 10,
        "system.attributes.focus.value": Number(this.attributes.focus) || 10,
        "system.health.value": baseH,
        "system.health.max": baseH,
        "system.shields.value": baseS,
        "system.shields.max": baseS,
        "system.energy.value": baseE,
        "system.energy.max": baseE,
        "system.armor.value": baseA
      };

      if (this.tennoName && this.tennoName !== this.actor.name) {
        updates.name = this.tennoName;
      }

      // Update avatar/token if default or empty
      const isDefaultImg = !this.actor.img ||
        this.actor.img.includes("mystery-man") ||
        this.actor.img === "icons/svg/mystery-man.svg";

      if (isDefaultImg && this.selectedWarframe.img) {
        updates.img = this.selectedWarframe.img;
        updates["prototypeToken.texture.src"] = this.selectedWarframe.img;
      }

      await this.actor.update(updates);

      // 2. Set Default Focus Node Flag
      const schoolData = FOCUS_SCHOOLS_DATA.find(s => s.name === this.selectedSchool);
      if (schoolData?.defaultNodes) {
        await this.actor.setFlag("warframe-ttrpg", "focusNodes", schoolData.defaultNodes);
        if (typeof this.actor.syncFocusActiveEffects === "function") {
          await this.actor.syncFocusActiveEffects(schoolData.defaultNodes);
        } else if (typeof this.actor.sheet?._syncFocusActiveEffects === "function") {
          await this.actor.sheet._syncFocusActiveEffects(schoolData.defaultNodes);
        }
      }

      // 3. Create Warframe Class Item
      const frameData = {
        name: this.selectedWarframe.name,
        type: "warframe",
        img: this.selectedWarframe.img,
        system: foundry.utils.deepClone(this.selectedWarframe.system || {})
      };

      // Check if actor already has an old frame item; delete if needed
      const oldFrames = this.actor.items.filter(i => i.type === "warframe").map(i => i.id);
      if (oldFrames.length > 0) {
        await this.actor.deleteEmbeddedDocuments("Item", oldFrames);
      }

      const createdFrames = await this.actor.createEmbeddedDocuments("Item", [frameData]);

      // 4. Create Starter Weapons
      const weaponsToCreate = [];

      // Primary
      const primObj = foundry.utils.deepClone(this.selectedPrimary);
      delete primObj._id;
      primObj.system = primObj.system || {};
      primObj.system.equipped = true;
      weaponsToCreate.push(primObj);

      // Secondary
      const secObj = foundry.utils.deepClone(this.selectedSecondary);
      delete secObj._id;
      secObj.system = secObj.system || {};
      secObj.system.equipped = true;
      weaponsToCreate.push(secObj);

      // Melee
      const melObj = foundry.utils.deepClone(this.selectedMelee);
      delete melObj._id;
      melObj.system = melObj.system || {};
      melObj.system.equipped = true;
      weaponsToCreate.push(melObj);

      await this.actor.createEmbeddedDocuments("Item", weaponsToCreate);

      // 5. Explicitly Trigger Advancement Check to Grant Rank 1 Abilities & Passive
      if (createdFrames.length > 0 && typeof this.actor.checkAndGrantAdvancements === "function") {
        await this.actor.checkAndGrantAdvancements(createdFrames[0]);
      }

      // 5b. Guarantee actor health, shields, and energy match derived maximums upon awakening
      const finalMaxH = this.actor.system.health?.max || baseH;
      const finalMaxS = this.actor.system.shields?.max || baseS;
      const finalMaxE = this.actor.system.energy?.max || baseE;
      await this.actor.update({
        "system.health.value": finalMaxH,
        "system.health.max": finalMaxH,
        "system.shields.value": finalMaxS,
        "system.shields.max": finalMaxS,
        "system.energy.value": finalMaxE,
        "system.energy.max": finalMaxE,
        "system.armor.value": baseA
      });

      // 6. Mark Wizard Completed & save stat generation flag
      await this.actor.setFlag("warframe-ttrpg", "wizardCompleted", true);
      await this.actor.setFlag("warframe-ttrpg", "statGeneration", {
        method: this.statMethod,
        rollAttempts: this.rollCount,
        selectedSetIndex: this.activeSetIndex,
        selectedSetLabel: `Set ${this.activeSetIndex + 1}`,
        scores: { ...this.attributes },
        rollSets: this.rollSets
      });

      // 7. Post Transference Awakening Chat Card
      const chatHtml = `
        <div class="warframe-chat-card awakening-announcement-card" style="background: radial-gradient(circle at top, #161e29 0%, #080a0f 100%); border: 1px solid #00e5ff; border-radius: 8px; padding: 14px; color: #e2e8f0; font-family: 'Inter', sans-serif; box-shadow: 0 0 25px rgba(0, 229, 255, 0.3);">
          <div style="display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(0, 229, 255, 0.25); padding-bottom: 10px; margin-bottom: 12px;">
            <img src="${this.selectedWarframe.img}" width="48" height="48" style="border: 2px solid #00e5ff; border-radius: 50%; object-fit: cover; background: rgba(0,0,0,0.5); filter: drop-shadow(0 0 6px rgba(0,229,255,0.6));" />
            <div style="flex: 1;">
              <div style="font-family: 'Orbitron', sans-serif; font-size: 10px; color: #ffd700; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                <i class="fas fa-atom"></i> Éveil par Transférence Terminé
              </div>
              <h2 style="font-family: 'Orbitron', sans-serif; font-size: 16px; color: #fff; margin: 2px 0 0 0; letter-spacing: 0.5px;">
                ${this.tennoName} <span style="font-size: 11px; color: #00e5ff;">(${this.selectedWarframe.name})</span>
              </h2>
            </div>
            <img src="${schoolData?.icon}" width="32" height="32" style="border-radius: 50%; mix-blend-mode: screen;" title="${this.selectedSchool} School" />
          </div>

          <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 4px; padding: 8px 10px; margin-bottom: 12px; font-size: 11px; font-style: italic; color: #cbd5e1;">
            « Réveillez-vous, Tenno. Ne rêvez pas de ce que vous êtes, mais de ce que vous voulez devenir. Le Réservoir vous appelle, et votre conduit est prêt au combat. »
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 4px; padding: 6px; text-align: center;">
            <div>
              <div style="font-size: 8px; color: #94a3b8; font-family: 'Orbitron', sans-serif;">PHYSIQUE</div>
              <div style="font-size: 12px; font-weight: bold; color: #fff;">${this.attributes.physique} <small style="color: #00e5ff;">(${Math.floor((this.attributes.physique - 10) / 2) >= 0 ? '+' : ''}${Math.floor((this.attributes.physique - 10) / 2)})</small></div>
            </div>
            <div>
              <div style="font-size: 8px; color: #94a3b8; font-family: 'Orbitron', sans-serif;">PROWESS</div>
              <div style="font-size: 12px; font-weight: bold; color: #fff;">${this.attributes.prowess} <small style="color: #00e5ff;">(${Math.floor((this.attributes.prowess - 10) / 2) >= 0 ? '+' : ''}${Math.floor((this.attributes.prowess - 10) / 2)})</small></div>
            </div>
            <div>
              <div style="font-size: 8px; color: #94a3b8; font-family: 'Orbitron', sans-serif;">SYSTEMS</div>
              <div style="font-size: 12px; font-weight: bold; color: #fff;">${this.attributes.systems} <small style="color: #00e5ff;">(${Math.floor((this.attributes.systems - 10) / 2) >= 0 ? '+' : ''}${Math.floor((this.attributes.systems - 10) / 2)})</small></div>
            </div>
            <div>
              <div style="font-size: 8px; color: #94a3b8; font-family: 'Orbitron', sans-serif;">FOCUS</div>
              <div style="font-size: 12px; font-weight: bold; color: #fff;">${this.attributes.focus} <small style="color: #00e5ff;">(${Math.floor((this.attributes.focus - 10) / 2) >= 0 ? '+' : ''}${Math.floor((this.attributes.focus - 10) / 2)})</small></div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 3px;">
              <span style="color: #94a3b8; font-family: 'Orbitron', sans-serif; font-size: 9.5px;">ÉCOLE DE FOCALISATION</span>
              <span style="font-weight: bold; color: #ffd700;">${this.selectedSchool} (${schoolData?.starterNode})</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 3px;">
              <span style="color: #94a3b8; font-family: 'Orbitron', sans-serif; font-size: 9.5px;">ARME PRINCIPALE</span>
              <span style="color: #fff; font-weight: 500;">${this.selectedPrimary.name} <small style="color: #00e5ff;">(${this.selectedPrimary.system.damage} ${this.selectedPrimary.system.damageType})</small></span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 3px;">
              <span style="color: #94a3b8; font-family: 'Orbitron', sans-serif; font-size: 9.5px;">ARME SECONDAIRE</span>
              <span style="color: #fff; font-weight: 500;">${this.selectedSecondary.name} <small style="color: #00e5ff;">(${this.selectedSecondary.system.damage} ${this.selectedSecondary.system.damageType})</small></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8; font-family: 'Orbitron', sans-serif; font-size: 9.5px;">ARME DE MÊLÉE</span>
              <span style="color: #fff; font-weight: 500;">${this.selectedMelee.name} <small style="color: #00e5ff;">(${this.selectedMelee.system.damage} ${this.selectedMelee.system.damageType})</small></span>
            </div>
          </div>
        </div>
      `;

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: chatHtml,
        sound: "sounds/notify.wav"
      });

      ui.notifications.info(`Tenno awakened! ${this.selectedWarframe.name} is fully operational.`);
      
      // Close wizard and refresh actor sheet
      this.close();
      if (this.actor.sheet) {
        this.actor.sheet.render(true);
      }
    } catch (err) {
      console.error("Warframe TTRPG | Critical error during Character Awakening:", err);
      ui.notifications.error("Failed to complete Character Creation: " + err.message);
    }
  }

  /** @override */
  async close(options = {}) {
    if (this.actor) {
      this.actor._wizardOpen = false;
    }
    return super.close(options);
  }
}
