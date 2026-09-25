/**
 * Warframe TTRPG - Ability Mechanics Engine Registry
 * Central routing system that executes specialized canonical mechanics for all Warframes
 */

import { handleBansheeAbility } from "./banshee.js";
import { handleJadeAbility } from "./jade.js";
import { handleSevagothAbility } from "./sevagoth.js";
import { handleSarynAbility } from "./saryn.js";
import { handleNidusAbility } from "./nidus.js";
import { handleGaussAbility } from "./gauss.js";
import { handleEmberAbility } from "./ember.js";
import { handleBaruukAbility } from "./baruuk.js";
import { handleIvaraAbility } from "./ivara.js";
import { handleVaubanAbility } from "./vauban.js";
import { handleEquinoxAbility } from "./equinox.js";
import { handleTitaniaAbility } from "./titania.js";
import { handleMesaAbility } from "./mesa.js";
import { handleWispAbility } from "./wisp.js";
import { handleHildrynAbility } from "./hildryn.js";
import { handleKhoraAbility } from "./khora.js";
import { handleChromaAbility } from "./chroma.js";
import { handleLimboAbility } from "./limbo.js";
import { handleAshAbility } from "./ash.js";
import { handleAtlasAbility } from "./atlas.js";
import { handleMagAbility } from "./mag.js";
import { handleNekrosAbility } from "./nekros.js";
import { handleInarosAbility } from "./inaros.js";
import { handleWukongAbility } from "./wukong.js";
import { handleProteaAbility } from "./protea.js";
import { handleHarrowAbility } from "./harrow.js";
import { handleGarudaAbility } from "./garuda.js";
import { handleGrendelAbility } from "./grendel.js";
import { handleKullervoAbility } from "./kullervo.js";
import { handleDanteAbility } from "./dante.js";
import { handleDagathAbility } from "./dagath.js";
import { handleQorvexAbility } from "./qorvex.js";
import { handleMirageAbility } from "./mirage.js";
import { handleNezhaAbility } from "./nezha.js";
import { handleOberonAbility } from "./oberon.js";
import { handleTrinityAbility } from "./trinity.js";
import { handleNovaAbility } from "./nova.js";
import { handleNyxAbility } from "./nyx.js";
import { handleGaraAbility } from "./gara.js";
import { handleLavosAbility } from "./lavos.js";
import { handleKoumeiAbility } from "./koumei.js";
import { handleCalibanAbility } from "./caliban.js";
import { handleStyanaxAbility } from "./styanax.js";
import { handleVorunaAbility } from "./voruna.js";
import { handleZephyrAbility } from "./zephyr.js";
import { handleXakuAbility } from "./xaku.js";
import { handleYareliAbility } from "./yareli.js";
import { handleCitrineAbility } from "./citrine.js";
import { handleGyreAbility } from "./gyre.js";
import { handleOctaviaAbility } from "./octavia.js";
import { handleLokiAbility } from "./loki.js";
import { handleHydroidAbility } from "./hydroid.js";
import { handleFrostAbility } from "./frost.js";
import { handleRhinoAbility } from "./rhino.js";
import { handleVoltAbility } from "./volt.js";
import { handleRevenantAbility } from "./revenant.js";
import { handleCyte09Ability } from "./cyte09.js";
import { handleCustomFrameAbility } from "./customframes.js";

export class AbilityMechanicsRegistry {
  /**
   * Execute specialized Warframe mechanics if registered
   * @param {string} baseName Lowercase base name of ability
   * @param {WarframeActor} actor The casting actor
   * @param {Item} ability The ability item
   * @param {object} context Context object containing cost, powerDC, etc.
   * @returns {Promise<object>} Result object: { handled: boolean, cardExtraHTML: string, rollFormula?: string }
   */
  static async execute(baseName, actor, ability, context) {
    const frameClass = (actor.system.details?.frameClass || "").toLowerCase();

    // 1. Banshee
    const bansheePowers = ["sonar", "silence", "sonic boom", "sound quake"];
    if (frameClass.includes("banshee") || bansheePowers.includes(baseName)) {
      const res = await handleBansheeAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 2. Jade
    const jadePowers = ["symphony of mercy", "ophanim eyes", "glory on high", "light's judgment", "lights judgment"];
    if (frameClass.includes("jade") || jadePowers.includes(baseName)) {
      const res = await handleJadeAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 3. Sevagoth & Sevagoth Shadow
    const sevagothPowers = ["reap", "sow", "gloom", "exalted shadow", "embrace", "consume", "death's harvest", "deaths harvest", "reunite"];
    if (frameClass.includes("sevagoth") || sevagothPowers.includes(baseName)) {
      const res = await handleSevagothAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 4. Saryn
    const sarynPowers = ["spores", "molt", "toxic lash", "miasma"];
    if (frameClass.includes("saryn") || sarynPowers.includes(baseName)) {
      const res = await handleSarynAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 5. Nidus
    const nidusPowers = ["virulence", "larva", "parasitic link", "ravenous"];
    if (frameClass.includes("nidus") || nidusPowers.includes(baseName)) {
      const res = await handleNidusAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 6. Gauss
    const gaussPowers = ["mach rush", "kinetic plating", "thermal sunder", "redline"];
    if (frameClass.includes("gauss") || gaussPowers.includes(baseName)) {
      const res = await handleGaussAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 7. Ember
    const emberPowers = ["fireball", "immolation", "fire blast", "inferno"];
    if (frameClass.includes("ember") || emberPowers.includes(baseName)) {
      const res = await handleEmberAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 8. Baruuk
    const baruukPowers = ["elude", "lull", "desolate hands", "serene storm"];
    if (frameClass.includes("baruuk") || baruukPowers.includes(baseName)) {
      const res = await handleBaruukAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 9. Ivara
    const ivaraPowers = ["quiver", "navigator", "prowl", "artemis bow"];
    if (frameClass.includes("ivara") || ivaraPowers.includes(baseName)) {
      const res = await handleIvaraAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 10. Vauban
    const vaubanPowers = ["tesla nervos", "minelayer", "photon strike", "bastille", "vortex"];
    if (frameClass.includes("vauban") || vaubanPowers.includes(baseName)) {
      const res = await handleVaubanAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 11. Equinox
    const equinoxPowers = ["metamorphosis", "rest & rage", "rest and rage", "pacify & provoke", "pacify and provoke", "mend & maim", "mend and maim"];
    if (frameClass.includes("equinox") || equinoxPowers.includes(baseName)) {
      const res = await handleEquinoxAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 12. Titania
    const titaniaPowers = ["spellbind", "tribute", "lantern", "razorwing"];
    if (frameClass.includes("titania") || titaniaPowers.includes(baseName)) {
      const res = await handleTitaniaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 13. Mesa
    const mesaPowers = ["ballistic battery", "shooting gallery", "shatter shield", "peacemaker"];
    if (frameClass.includes("mesa") || mesaPowers.includes(baseName)) {
      const res = await handleMesaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 14. Wisp
    const wispPowers = ["reservoirs", "wil-o-wisp", "breach surge", "sol gate"];
    if (frameClass.includes("wisp") || wispPowers.includes(baseName)) {
      const res = await handleWispAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 15. Hildryn
    const hildrynPowers = ["balefire", "shield pillage", "haven", "aegis storm"];
    if (frameClass.includes("hildryn") || hildrynPowers.includes(baseName)) {
      const res = await handleHildrynAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 16. Khora
    const khoraPowers = ["whipclaw", "ensnare", "venari", "strangledome"];
    if (frameClass.includes("khora") || khoraPowers.includes(baseName)) {
      const res = await handleKhoraAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 17. Chroma
    const chromaPowers = ["spectral scream", "elemental ward", "vex armor", "effigy"];
    if (frameClass.includes("chroma") || chromaPowers.includes(baseName)) {
      const res = await handleChromaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 18. Limbo
    const limboPowers = ["banish", "stasis", "rift walk", "rift surge", "cataclysm"];
    if (frameClass.includes("limbo") || limboPowers.includes(baseName)) {
      const res = await handleLimboAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 19. Ash
    const ashPowers = ["shuriken", "smoke screen", "teleport", "blade storm"];
    if (frameClass.includes("ash") || ashPowers.includes(baseName)) {
      const res = await handleAshAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 20. Atlas
    const atlasPowers = ["landslide", "tectonics", "petrify", "rumblers"];
    if (frameClass.includes("atlas") || atlasPowers.includes(baseName)) {
      const res = await handleAtlasAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 21. Mag
    const magPowers = ["pull", "magnetize", "polarize", "crush"];
    if (frameClass.includes("mag") || magPowers.includes(baseName)) {
      const res = await handleMagAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 22. Nekros
    const nekrosPowers = ["soul punch", "terrify", "desecrate", "shadows of the dead"];
    if (frameClass.includes("nekros") || nekrosPowers.includes(baseName)) {
      const res = await handleNekrosAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 23. Inaros
    const inarosPowers = ["desiccation", "devour", "sandstorm", "scarab swarm", "scarab shell"];
    if (frameClass.includes("inaros") || inarosPowers.includes(baseName)) {
      const res = await handleInarosAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 24. Wukong
    const wukongPowers = ["celestial twin", "cloud walker", "defy", "primal fury"];
    if (frameClass.includes("wukong") || wukongPowers.includes(baseName)) {
      const res = await handleWukongAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 25. Protea
    const proteaPowers = ["grenade fan", "blaze artillery", "dispensary", "temporal anchor"];
    if (frameClass.includes("protea") || proteaPowers.includes(baseName)) {
      const res = await handleProteaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 26. Harrow
    const harrowPowers = ["condemn", "penance", "thurible", "covenant"];
    if (frameClass.includes("harrow") || harrowPowers.includes(baseName)) {
      const res = await handleHarrowAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 27. Garuda
    const garudaPowers = ["dread mirror", "blood altar", "bloodletting", "seeking talons"];
    if (frameClass.includes("garuda") || garudaPowers.includes(baseName)) {
      const res = await handleGarudaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 28. Grendel
    const grendelPowers = ["feast", "nourish", "pulverize", "regurgitate"];
    if (frameClass.includes("grendel") || grendelPowers.includes(baseName)) {
      const res = await handleGrendelAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 29. Kullervo
    const kullervoPowers = ["wrathful advance", "recompense", "collective curse", "storm of ukko"];
    if (frameClass.includes("kullervo") || kullervoPowers.includes(baseName)) {
      const res = await handleKullervoAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 30. Dante
    const dantePowers = ["noctua", "light verse", "dark verse", "final verse"];
    if (frameClass.includes("dante") || dantePowers.includes(baseName)) {
      const res = await handleDanteAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 31. Dagath
    const dagathPowers = ["wyrd scythes", "doom", "grave spirit", "rakhali's cavalry", "rakhali cavalry"];
    if (frameClass.includes("dagath") || dagathPowers.includes(baseName)) {
      const res = await handleDagathAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 32. Qorvex
    const qorvexPowers = ["chyrinka pillar", "containment wall", "disometric guard", "crucible blast"];
    if (frameClass.includes("qorvex") || qorvexPowers.includes(baseName)) {
      const res = await handleQorvexAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 33. Mirage
    const miragePowers = ["hall of mirrors", "sleight of hand", "eclipse", "prism"];
    if (frameClass.includes("mirage") || miragePowers.includes(baseName)) {
      const res = await handleMirageAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 34. Nezha
    const nezhaPowers = ["fire walker", "blazing chakram", "warding halo", "divine spears"];
    if (frameClass.includes("nezha") || nezhaPowers.includes(baseName)) {
      const res = await handleNezhaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 35. Oberon
    const oberonPowers = ["smite", "hallowed ground", "renewal", "reckoning"];
    if (frameClass.includes("oberon") || oberonPowers.includes(baseName)) {
      const res = await handleOberonAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 36. Trinity
    const trinityPowers = ["well of life", "energy vampire", "link", "blessing"];
    if (frameClass.includes("trinity") || trinityPowers.includes(baseName)) {
      const res = await handleTrinityAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 37. Nova
    const novaPowers = ["null star", "antimatter drop", "worm hole", "molecular prime"];
    if (frameClass.includes("nova") || novaPowers.includes(baseName)) {
      const res = await handleNovaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 38. Nyx
    const nyxPowers = ["mind control", "psychic bolts", "chaos", "absorb"];
    if (frameClass.includes("nyx") || nyxPowers.includes(baseName)) {
      const res = await handleNyxAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 39. Gara
    const garaPowers = ["shattered lash", "splinter storm", "spectrorage", "mass vitrify"];
    if (frameClass.includes("gara") || garaPowers.includes(baseName)) {
      const res = await handleGaraAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 40. Lavos
    const lavosPowers = ["ophidian bite", "vial rush", "transmutation probe", "catalyze"];
    if (frameClass.includes("lavos") || lavosPowers.includes(baseName)) {
      const res = await handleLavosAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 41. Koumei
    const koumeiPowers = ["kumihimo", "omikuji", "tsugihagi", "bunraku"];
    if (frameClass.includes("koumei") || koumeiPowers.includes(baseName)) {
      const res = await handleKoumeiAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 42. Caliban
    const calibanPowers = ["razor gyre", "sentient wrath", "lethal progeny", "fusion strike"];
    if (frameClass.includes("caliban") || calibanPowers.includes(baseName)) {
      const res = await handleCalibanAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 43. Styanax
    const styanaxPowers = ["axios javelin", "tharros strike", "rally point", "final stand"];
    if (frameClass.includes("styanax") || styanaxPowers.includes(baseName)) {
      const res = await handleStyanaxAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 44. Voruna
    const vorunaPowers = ["shroud of dynar", "fangs of raksh", "lycath's hunt", "lycaths hunt", "ulfrun's descent", "ulfruns descent"];
    if (frameClass.includes("voruna") || vorunaPowers.includes(baseName)) {
      const res = await handleVorunaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 45. Zephyr
    const zephyrPowers = ["tail wind", "airburst", "turbulence", "tornado"];
    if (frameClass.includes("zephyr") || zephyrPowers.includes(baseName)) {
      const res = await handleZephyrAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 46. Xaku
    const xakuPowers = ["xata's whisper", "xatas whisper", "grasp of lohk", "the lost", "the vast untime"];
    if (frameClass.includes("xaku") || xakuPowers.includes(baseName)) {
      const res = await handleXakuAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 47. Yareli
    const yareliPowers = ["sea snares", "merulina", "aquablades", "riptide"];
    if (frameClass.includes("yareli") || yareliPowers.includes(baseName)) {
      const res = await handleYareliAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 48. Citrine
    const citrinePowers = ["fractured blast", "preserving shell", "prismatic gem", "crystallize"];
    if (frameClass.includes("citrine") || citrinePowers.includes(baseName)) {
      const res = await handleCitrineAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 49. Gyre
    const gyrePowers = ["arcsphere", "coil horizon", "cathode grace", "rotorswell"];
    if (frameClass.includes("gyre") || gyrePowers.includes(baseName)) {
      const res = await handleGyreAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 50. Octavia
    const octaviaPowers = ["mallet", "resonator", "metronome", "amp"];
    if (frameClass.includes("octavia") || octaviaPowers.includes(baseName)) {
      const res = await handleOctaviaAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 51. Loki
    const lokiPowers = ["decoy", "invisibility", "switch teleport", "radial disarm"];
    if (frameClass.includes("loki") || lokiPowers.includes(baseName)) {
      const res = await handleLokiAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 52. Hydroid
    const hydroidPowers = ["tempest barrage", "tidal surge", "plunder", "tentacle swarm"];
    if (frameClass.includes("hydroid") || hydroidPowers.includes(baseName)) {
      const res = await handleHydroidAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 53. Frost
    const frostPowers = ["freeze", "ice wave", "snow globe", "avalanche"];
    if (frameClass.includes("frost") || frostPowers.includes(baseName)) {
      const res = await handleFrostAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 54. Rhino
    const rhinoPowers = ["rhino charge", "iron skin", "roar", "rhino stomp"];
    if (frameClass.includes("rhino") || rhinoPowers.includes(baseName)) {
      const res = await handleRhinoAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 55. Volt
    const voltPowers = ["shock", "speed", "electric shield", "discharge"];
    if (frameClass.includes("volt") || voltPowers.includes(baseName)) {
      const res = await handleVoltAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 56. Revenant
    const revenantPowers = ["enthrall", "mesmer skin", "reave", "danse macabre"];
    if (frameClass.includes("revenant") || revenantPowers.includes(baseName)) {
      const res = await handleRevenantAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 57. Cyte-09
    const cytePowers = ["evade", "resupply", "seek", "neutralize"];
    if (frameClass.includes("cyte-09") || frameClass.includes("cyte09") || cytePowers.includes(baseName)) {
      const res = await handleCyte09Ability(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    // 58. Custom Campaign Frames (Temple, Oraxia, Follie, Nokko, Uriel, Sirius & Orion)
    const customPowers = [
      "lizzie", "overdrive", "plainte du ripper", "pyrotechnique", "solo exalté", "solo exalte",
      "mercy's kiss", "mercys kiss", "silken stride", "webbed embrace", "widow's brood", "widows brood",
      "forced perspective", "plein air", "self portrait", "shadowgraph",
      "brightbonnet", "reroot", "sporespring", "stinkbrain",
      "brimstone", "demonium", "infernalis", "remedium",
      "sirius", "orion"
    ];
    const customClasses = ["temple", "oraxia", "follie", "nokko", "uriel", "sirius", "orion"];
    if (customClasses.some(c => frameClass.includes(c)) || customPowers.includes(baseName)) {
      const res = await handleCustomFrameAbility(baseName, actor, ability, context);
      if (res && (res.handled || res.cardExtraHTML)) return res;
    }

    return { handled: false };
  }
}
