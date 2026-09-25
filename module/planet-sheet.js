import { ORIGIN_SYSTEM_FACTIONS, getPlanetById } from "./data-star-chart.js";

const BaseApplication = (typeof Application !== "undefined") ? Application : ((typeof foundry !== "undefined" && foundry.appv1?.api?.Application) ? foundry.appv1.api.Application : class {});

/**
 * Warframe TTRPG - Native Planet Sheet Application
 * Displays official tactical briefing, resources, mysterious boss intel, and player rank guidance.
 */
export class WarframePlanetSheet extends BaseApplication {
  constructor(planetId, options = {}) {
    super(options);
    this.planetId = planetId;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "warframe-planet-sheet",
      classes: ["warframe-sheet", "warframe-planet-sheet"],
      template: "systems/warframe-ttrpg/templates/planet-sheet.html",
      width: 540,
      height: 600,
      resizable: true,
      title: "Console de Navigation // Fiche Tactique du Lotus"
    });
  }

  getData() {
    const planet = getPlanetById(this.planetId) || {
      name: "Secteur Inconnu",
      subtitle: "Aucune donnée orbitale",
      factionId: "tenno",
      playerRank: "Non défini",
      resources: [],
      lore: "Aucune information de télémétrie disponible pour ce secteur."
    };
    const faction = ORIGIN_SYSTEM_FACTIONS[planet.factionId] || { name: "Non affilié", color: "#58d8ff" };

    return {
      planet,
      faction
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
