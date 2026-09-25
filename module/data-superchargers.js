/**
 * Canonical Upgrades & Superchargers Dataset for Warframe TTRPG
 * Contains Orokin Catalyst, Orokin Reactor, Formas, and Exilus Adapters.
 * All document IDs are strictly 16 alphanumeric characters for Foundry VTT.
 */

export const superchargerFolder = {
  _id: "upgsuperchargers",
  name: "Upgrades & Superchargers",
  type: "Item",
  color: "#00e5ff"
};

export const superchargersDataset = [
  {
    _id: "orokincatalyst01",
    name: "Orokin Catalyst",
    type: "consumable",
    img: "systems/warframe-ttrpg/asset/supercharger/OrokinCatalyst.png",
    folder: "upgsuperchargers",
    system: {
      description: "<p>A mysterious Orokin molecular reconfiguration device that supercharges weapons, permanently doubling their Mod Capacity from <strong>30 to 60</strong>.</p><p><em>Drag and drop onto any Weapon Sheet or click 'Install Catalyst' on the weapon's Mods tab.</em></p>",
      type: "Orokin Catalyst",
      superchargerType: "Orokin Catalyst",
      isSupercharger: true,
      isForma: false,
      isGear: false,
      quantity: 1,
      price: 20
    }
  },
  {
    _id: "orokinreactor001",
    name: "Orokin Reactor",
    type: "consumable",
    img: "systems/warframe-ttrpg/asset/supercharger/OrokinReactor.png",
    folder: "upgsuperchargers",
    system: {
      description: "<p>An ancient bio-energy conduit that supercharges Warframes, Companions, and Archwings, permanently doubling their Mod Capacity from <strong>30 to 60</strong>.</p><p><em>Drag and drop onto a Warframe character sheet or check 'Orokin Reactor' in the header.</em></p>",
      type: "Orokin Reactor",
      superchargerType: "Orokin Reactor",
      isSupercharger: true,
      isForma: false,
      isGear: false,
      quantity: 1,
      price: 20
    }
  },
  {
    _id: "forma00000000001",
    name: "Forma",
    type: "consumable",
    img: "systems/warframe-ttrpg/asset/supercharger/Forma.png",
    folder: "upgsuperchargers",
    system: {
      description: "<p>A shape-altering Orokin component used to modify the polarity of a mod slot on a Warframe or Weapon. Halves the drain of matching polarity mods.</p><p><em>Drag and drop onto a Warframe sheet to polarize a slot.</em></p>",
      type: "Forma",
      formaType: "Forma",
      isForma: true,
      isSupercharger: false,
      isGear: false,
      quantity: 1,
      price: 20
    }
  },
  {
    _id: "auraforma0000001",
    name: "Aura Forma",
    type: "consumable",
    img: "systems/warframe-ttrpg/asset/supercharger/AuraForma.png",
    folder: "upgsuperchargers",
    system: {
      description: "<p>A specialized Forma that polarizes a Warframe's Aura slot to <strong>Universal</strong>, allowing any Aura mod of any polarity to match and grant double capacity.</p><p><em>Drag and drop onto a Warframe sheet to polarize the Aura slot.</em></p>",
      type: "Omni Forma",
      formaType: "Omni Forma",
      isForma: true,
      isSupercharger: false,
      isGear: false,
      quantity: 1,
      price: 80
    }
  },
  {
    _id: "stanceforma00001",
    name: "Stance Forma",
    type: "consumable",
    img: "systems/warframe-ttrpg/asset/supercharger/StanceForma.png",
    folder: "upgsuperchargers",
    system: {
      description: "<p>A specialized Forma that polarizes a Melee Weapon's Stance slot to <strong>Universal</strong>, allowing any Stance mod of any polarity to match and grant double capacity (+20).</p><p><em>Drag and drop onto a Melee Weapon sheet or apply via the Arsenal Forma dialog.</em></p>",
      type: "Stance Forma",
      formaType: "Stance Forma",
      isForma: true,
      isSupercharger: false,
      isGear: false,
      quantity: 1,
      price: 80
    }
  },
  {
    _id: "umbraforma000001",
    name: "Umbra Forma",
    type: "consumable",
    img: "systems/warframe-ttrpg/asset/supercharger/UmbraForma.png",
    folder: "upgsuperchargers",
    system: {
      description: "<p>An extraordinarily rare Forma infused with Sentient essence that applies the mythical <strong>Umbra</strong> polarity to a Warframe or Weapon mod slot.</p>",
      type: "Umbra Forma",
      formaType: "Umbra Forma",
      isForma: true,
      isSupercharger: false,
      isGear: false,
      quantity: 1,
      price: 150
    }
  },
  {
    _id: "exiluswpnadpt001",
    name: "Exilus Weapon Adapter",
    type: "consumable",
    img: "systems/warframe-ttrpg/asset/supercharger/ExilusWeaponAdapter.png",
    folder: "upgsuperchargers",
    system: {
      description: "<p>An Orokin device that fuses with a Primary or Secondary weapon to permanently unlock its dedicated <strong>Exilus Mod Slot</strong> for utility and mobility mods.</p>",
      type: "Gear",
      isForma: false,
      isSupercharger: false,
      isGear: true,
      quantity: 1,
      price: 20
    }
  },
  {
    _id: "exiluswfradpt001",
    name: "Exilus Warframe Adapter",
    type: "consumable",
    img: "systems/warframe-ttrpg/asset/supercharger/ExilusWarframeAdapter.png",
    folder: "upgsuperchargers",
    system: {
      description: "<p>An Orokin device that fuses with a Warframe to permanently unlock its dedicated <strong>Exilus Mod Slot</strong> for utility and parkour mods.</p>",
      type: "Gear",
      isForma: false,
      isSupercharger: false,
      isGear: true,
      quantity: 1,
      price: 20
    }
  }
];