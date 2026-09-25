import { ORIGIN_SYSTEM_BODIES, ORIGIN_SYSTEM_FACTIONS, ORIGIN_SYSTEM_JUNCTIONS, getPlanetById } from "./data-star-chart.js";
import { WarframePlanetSheet } from "./planet-sheet.js";

const SceneManagerClass = (typeof foundry !== "undefined" && foundry.canvas?.SceneManager) ? foundry.canvas.SceneManager : class {};

/** Native asset metadata to guarantee 100% distortion-free uniform aspect ratios */
const ASSET_METADATA = {
  "systems/warframe-ttrpg/asset/planets/full/Ceres.png": { w: 859, h: 905 },
  "systems/warframe-ttrpg/asset/planets/full/Deimos.png": { w: 338, h: 282 },
  "systems/warframe-ttrpg/asset/planets/full/Dojo.png": { w: 320, h: 903, isStation: true },
  "systems/warframe-ttrpg/asset/planets/full/Earth.png": { w: 1053, h: 902 },
  "systems/warframe-ttrpg/asset/planets/full/Eris.png": { w: 976, h: 854 },
  "systems/warframe-ttrpg/asset/planets/full/Europa.png": { w: 1125, h: 986 },
  "systems/warframe-ttrpg/asset/planets/full/Jupiter.png": { w: 833, h: 742 },
  "systems/warframe-ttrpg/asset/planets/full/Kuva_Fortress.png": { w: 612, h: 603, isStation: true },
  "systems/warframe-ttrpg/asset/planets/full/Lua.png": { w: 848, h: 792 },
  "systems/warframe-ttrpg/asset/planets/full/Mars.png": { w: 1054, h: 882 },
  "systems/warframe-ttrpg/asset/planets/full/Mercury.png": { w: 1219, h: 1076 },
  "systems/warframe-ttrpg/asset/planets/full/Neptune.png": { w: 1243, h: 961 },
  "systems/warframe-ttrpg/asset/planets/full/New_Zariman.png": { w: 1024, h: 1024 },
  "systems/warframe-ttrpg/asset/planets/full/OrokinVoid.png": { w: 1024, h: 1024 },
  "systems/warframe-ttrpg/asset/planets/full/Phobos.png": { w: 804, h: 866 },
  "systems/warframe-ttrpg/asset/planets/full/Pluto.png": { w: 954, h: 1037 },
  "systems/warframe-ttrpg/asset/planets/full/Saturn.png": { w: 1333, h: 584, hasRings: true },
  "systems/warframe-ttrpg/asset/planets/full/Sedna.png": { w: 981, h: 933 },
  "systems/warframe-ttrpg/asset/planets/full/Uranus.png": { w: 700, h: 909, hasVerticalRings: true },
  "systems/warframe-ttrpg/asset/planets/full/Venus.png": { w: 1253, h: 1050 }
};

/**
 * Diagnostic helper to report client logs to local test listener if running
 */
function sendDiagnostic(msg, data = {}) {
  console.log("[OriginSystemManager]", msg, data);
  try {
    fetch("http://127.0.0.1:31999/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "OriginSystemManager", msg, data, time: Date.now() })
    }).catch(() => {});
  } catch (e) {}
}

/**
 * WarframeOriginSystemManager - Native WebGL Scene Manager for the Origin System
 * Built following the architecture of Ember's Cosmos Map (foundry.canvas.SceneManager).
 * Renders directly into WebGL via canvas.interface (with stage fallback).
 */
export class WarframeOriginSystemManager extends SceneManagerClass {
  constructor(scene) {
    super(scene);
    this.center = { x: 4000, y: 4000 };
    this.speedMultiplier = 1.0;
    this.isPaused = false;
    this.activePlanetId = null;

    /** @type {Map<string, object>} Runtime mapping of celestial bodies */
    this.bodies = new Map();

    /** @type {Array<object>} Canonical Solar Rail Junctions */
    this.rails = [];

    /** @type {Function|null} Ticker callback reference */
    this._tickerFn = null;

    this._origMinZoom = null;
    this.root = null;
    this.solRays = null;
    this._texturesLoaded = false;
  }

  /* -------------------------------------------- */
  /*  Orbital Specifications                      */
  /* -------------------------------------------- */

  static CELESTIAL_CONFIGS = [
    // Central Sol (The Sun)
    {
      id: "sol-sun",
      name: "Le Soleil (Sol)",
      isSun: true,
      size: 540,
      color: 0xffb703,
      sort: -10
    },
    // Inner Planets
    {
      id: "planet-mercury",
      name: "Mercure",
      img: "systems/warframe-ttrpg/asset/planets/full/Mercury.png",
      rx: 540,
      ry: 450,
      period: 26,
      initialAngle: 2.4,
      size: 180,
      factionId: "grineer",
      color: 0xc0392b
    },
    {
      id: "planet-venus",
      name: "Vénus",
      img: "systems/warframe-ttrpg/asset/planets/full/Venus.png",
      rx: 840,
      ry: 700,
      period: 46,
      initialAngle: 1.2,
      size: 240,
      factionId: "corpus",
      color: 0x2980b9
    },
    {
      id: "planet-earth",
      name: "Terre",
      img: "systems/warframe-ttrpg/asset/planets/full/Earth.png",
      rx: 1200,
      ry: 980,
      period: 66,
      initialAngle: 0.3,
      size: 260,
      factionId: "grineer",
      color: 0x27ae60
    },
    {
      id: "planet-lua",
      name: "Lua",
      parent: "planet-earth",
      img: "systems/warframe-ttrpg/asset/planets/full/Lua.png",
      rx: 170,
      ry: 170,
      period: 16,
      initialAngle: 0.8,
      size: 90,
      isMoon: true,
      factionId: "orokin",
      color: 0xf1c40f
    },
    {
      id: "planet-mars",
      name: "Mars",
      img: "systems/warframe-ttrpg/asset/planets/full/Mars.png",
      rx: 1560,
      ry: 1260,
      period: 90,
      initialAngle: 5.7,
      size: 220,
      factionId: "grineer",
      color: 0xd35400
    },
    {
      id: "planet-phobos",
      name: "Phobos",
      parent: "planet-mars",
      img: "systems/warframe-ttrpg/asset/planets/full/Phobos.png",
      rx: 115,
      ry: 115,
      period: 9,
      initialAngle: 1.5,
      size: 75,
      isMoon: true,
      factionId: "corpus",
      color: 0x3498db
    },
    {
      id: "planet-deimos",
      name: "Deimos",
      parent: "planet-mars",
      img: "systems/warframe-ttrpg/asset/planets/full/Deimos.png",
      rx: 165,
      ry: 165,
      period: 17,
      initialAngle: 3.8,
      size: 85,
      isMoon: true,
      factionId: "infested",
      color: 0x2ecc71
    },
    {
      id: "planet-ceres",
      name: "Cérès",
      img: "systems/warframe-ttrpg/asset/planets/full/Ceres.png",
      rx: 1900,
      ry: 1520,
      period: 118,
      initialAngle: 4.2,
      size: 170,
      factionId: "grineer",
      color: 0x95a5a6
    },
    // Outer Gas Giants
    {
      id: "planet-jupiter",
      name: "Jupiter",
      img: "systems/warframe-ttrpg/asset/planets/full/Jupiter.png",
      rx: 2320,
      ry: 1840,
      period: 165,
      initialAngle: 3.3,
      size: 420,
      factionId: "corpus",
      color: 0xe67e22
    },
    {
      id: "planet-europa",
      name: "Europe",
      parent: "planet-jupiter",
      img: "systems/warframe-ttrpg/asset/planets/full/Europa.png",
      rx: 220,
      ry: 220,
      period: 20,
      initialAngle: 2.1,
      size: 100,
      isMoon: true,
      factionId: "corpus",
      color: 0x00e5ff
    },
    {
      id: "planet-saturn",
      name: "Saturne",
      img: "systems/warframe-ttrpg/asset/planets/full/Saturn.png",
      rx: 2800,
      ry: 2200,
      period: 215,
      initialAngle: 2.6,
      size: 400,
      factionId: "grineer",
      color: 0xf39c12
    },
    {
      id: "planet-uranus",
      name: "Uranus",
      img: "systems/warframe-ttrpg/asset/planets/full/Uranus.png",
      rx: 3220,
      ry: 2520,
      period: 270,
      initialAngle: 1.6,
      size: 290,
      factionId: "grineer",
      color: 0x1abc9c
    },
    {
      id: "planet-neptune",
      name: "Neptune",
      img: "systems/warframe-ttrpg/asset/planets/full/Neptune.png",
      rx: 3600,
      ry: 2820,
      period: 330,
      initialAngle: 0.8,
      size: 280,
      factionId: "corpus",
      color: 0x34495e
    },
    {
      id: "planet-pluto",
      name: "Pluton",
      img: "systems/warframe-ttrpg/asset/planets/full/Pluto.png",
      rx: 3940,
      ry: 3060,
      period: 390,
      initialAngle: 0.1,
      size: 180,
      factionId: "corpus",
      color: 0x7f8c8d
    },
    {
      id: "planet-sedna",
      name: "Sedna",
      img: "systems/warframe-ttrpg/asset/planets/full/Sedna.png",
      rx: 4220,
      ry: 3260,
      tilt: 0.22,
      period: 440,
      initialAngle: 5.9,
      size: 175,
      factionId: "grineer",
      color: 0x962d2d
    },
    {
      id: "planet-eris",
      name: "Éris",
      img: "systems/warframe-ttrpg/asset/planets/full/Eris.png",
      rx: 4100,
      ry: 3180,
      tilt: -0.18,
      period: 420,
      initialAngle: 4.8,
      size: 185,
      factionId: "infested",
      color: 0x27ae60
    },
    // Kuva Fortress (Mobile eccentric crimson orbit traversing the system)
    {
      id: "station-kuva",
      name: "Forteresse Kuva",
      img: "systems/warframe-ttrpg/asset/planets/full/Kuva_Fortress.png",
      rx: 2520,
      ry: 980,
      tilt: -0.42,
      period: 95,
      initialAngle: 4.0,
      size: 200,
      isKuva: true,
      factionId: "grineer",
      color: 0xff3838
    },
    // Static Deep Space Destinations
    {
      id: "zone-void",
      name: "Le Néant (Orokin Void)",
      img: "systems/warframe-ttrpg/asset/planets/full/OrokinVoid.png",
      isStatic: true,
      px: 700,
      py: 5200,
      size: 250,
      factionId: "orokin",
      color: 0xf1c40f
    },
    {
      id: "station-zariman",
      name: "Zariman Ten-Zero",
      img: "systems/warframe-ttrpg/asset/planets/full/New_Zariman.png",
      isStatic: true,
      px: 740,
      py: 2800,
      size: 240,
      factionId: "tenno",
      color: 0x00e5ff
    },
    {
      id: "hub-dojo",
      name: "Dojo Tenno",
      img: "systems/warframe-ttrpg/asset/planets/full/Dojo.png",
      isStatic: true,
      px: 900,
      py: 6100,
      size: 210,
      factionId: "tenno",
      color: 0x58d8ff
    }
  ];

  /* -------------------------------------------- */
  /*  Lifecycle Methods                           */
  /* -------------------------------------------- */

  /** @override */
  async _onInit() {
    sendDiagnostic("_onInit started");
    if (super._onInit) await super._onInit();

    this._origMinZoom = CONFIG.Canvas.minZoom;
    CONFIG.Canvas.minZoom = 0.05;

    // Preload textures before drawing to guarantee instant rendering with native aspect ratios
    try {
      await this._preloadTextures();
    } catch (e) {
      console.warn("[OSM] Texture preload warning:", e);
    }
    sendDiagnostic("_onInit completed");
  }

  /**
   * Preloads all celestial textures to guarantee instantaneous rendering with correct aspect ratios
   */
  async _preloadTextures() {
    if (this._texturesLoaded) return;
    const promises = [];
    for (const cfg of this.constructor.CELESTIAL_CONFIGS) {
      if (cfg.img) {
        if (typeof foundry !== "undefined" && foundry.canvas?.loadTexture) {
          promises.push(foundry.canvas.loadTexture(cfg.img).catch(e => console.warn("Failed texture load:", cfg.img, e)));
        } else if (typeof PIXI !== "undefined" && PIXI.Assets?.load) {
          promises.push(PIXI.Assets.load(cfg.img).catch(e => console.warn("Failed PIXI load:", cfg.img, e)));
        }
      }
    }
    await Promise.allSettled(promises);
    this._texturesLoaded = true;
    sendDiagnostic("Textures preloaded successfully", { count: promises.length });
  }

  /** @override */
  async _onDraw() {
    sendDiagnostic("_onDraw started");
    if (super._onDraw) await super._onDraw();
    await this._draw();
    sendDiagnostic("_onDraw completed");
  }

  /** @override */
  async _onReady() {
    sendDiagnostic("_onReady started");
    if (super._onReady) await super._onReady();

    const targetParent = canvas.interface || canvas.stage;
    // Ensure root is drawn and attached to targetParent
    if (!this.root || this.root.destroyed || this.root.parent !== targetParent) {
      await this._draw();
    }

    // Hide standard Foundry placeable layers to prevent clutter on the Star Chart
    if (canvas.interface?.grid) canvas.interface.grid.visible = false;
    if (canvas.notes) canvas.notes.visible = false;
    if (canvas.tokens) canvas.tokens.visible = false;
    if (canvas.tiles) canvas.tiles.visible = false;
    if (canvas.drawings) canvas.drawings.visible = false;

    // Start 60 FPS animation ticker
    this._startTicker();

    // Pan camera to central Sol at scale: 0.32 for magnificent immediate visibility
    canvas.pan({ x: this.center.x, y: this.center.y, scale: 0.32 });
    sendDiagnostic("_onReady completed, canvas panned to Sol", { center: this.center });
  }

  /** @override */
  async _onTearDown(options) {
    sendDiagnostic("_onTearDown started");
    this._stopTicker();

    if (this._origMinZoom !== null) {
      CONFIG.Canvas.minZoom = this._origMinZoom;
      this._origMinZoom = null;
    }

    // Restore standard layer visibility
    if (canvas.interface?.grid) canvas.interface.grid.visible = true;
    if (canvas.notes) canvas.notes.visible = true;
    if (canvas.tokens) canvas.tokens.visible = true;
    if (canvas.tiles) canvas.tiles.visible = true;
    if (canvas.drawings) canvas.drawings.visible = true;

    // Clean up root container
    if (this.root && !this.root.destroyed) {
      this.root.destroy({ children: true });
      this.root = null;
    }
    this.bodies.clear();

    if (super._onTearDown) await super._onTearDown(options);
    sendDiagnostic("_onTearDown completed");
  }

  /* -------------------------------------------- */
  /*  Scene Construction (Draw)                   */
  /* -------------------------------------------- */

  async _draw() {
    try {
      sendDiagnostic("_draw executing");
      // Clean up previous root if any
      if (this.root && !this.root.destroyed) {
        this.root.destroy({ children: true });
        this.root = null;
      }
      this.bodies.clear();

      // Hide canvas grid
      if (canvas.interface?.grid) canvas.interface.grid.visible = false;

      // Attach root container directly to canvas.interface (with fallback to canvas.stage)
      // canvas.interface is rendered above primary/lighting/fog, inheriting camera world pan & zoom
      const targetParent = canvas.interface || canvas.stage;
      this.root = targetParent.addChild(new PIXI.Container());
      this.root.name = "WarframeOriginSystemRoot";
      this.root.sortableChildren = true;
      this.root.zIndex = 50;

      // Deep cosmic space background covering full 8000x8000
      this._drawBackground();

      // Background starfield & cosmic ambience
      this._drawStarfield();

      // Orbits graphics layer
      this.orbitsGraphics = this.root.addChild(new PIXI.Graphics());
      this.orbitsGraphics.name = "OriginSystemOrbits";
      this.orbitsGraphics.zIndex = 1;
      this._drawOrbits();

      // Solar Rails graphics layer (rendered above orbits, below planets)
      this.railsGraphics = this.root.addChild(new PIXI.Graphics());
      this.railsGraphics.name = "OriginSystemSolarRails";
      this.railsGraphics.zIndex = 5;

      // Central Sol
      this._drawSol();

      // Celestial Bodies
      for (const cfg of this.constructor.CELESTIAL_CONFIGS) {
        if (cfg.isSun) continue;
        this._drawBody(cfg);
      }

      // Prepare Solar Rail connections
      this._setupRails();

      // Initial positioning
      this._updatePositions(Date.now());
      sendDiagnostic("_draw successful", { bodiesCount: this.bodies.size });
    } catch (err) {
      console.error("WarframeOriginSystemManager _draw error:", err);
      sendDiagnostic("_draw error", { message: err.message, stack: err.stack });
      if (typeof ui !== "undefined" && ui?.notifications) {
        ui.notifications.error("Erreur de rendu Système Origine: " + err.message);
      }
    }
  }

  /* -------------------------------------------- */
  /*  Background & Starfield                      */
  /* -------------------------------------------- */

  _drawBackground() {
    const bg = this.root.addChild(new PIXI.Graphics());
    bg.name = "OriginSystemBackground";
    bg.zIndex = 0;
    // Deep cosmic space background covering full 8000x8000 canvas
    bg.beginFill(0x02050e, 1.0).drawRect(0, 0, 8000, 8000).endFill();
  }

  _drawStarfield() {
    const starsG = this.root.addChild(new PIXI.Graphics());
    starsG.name = "OriginSystemStarfield";
    starsG.zIndex = 1;

    const count = 1800;
    const minX = 0;
    const maxX = 8000;
    const minY = 0;
    const maxY = 8000;

    let seed = 1337;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < count; i++) {
      const x = minX + random() * (maxX - minX);
      const y = minY + random() * (maxY - minY);
      const r = random() * 2.2 + 0.5;
      const alpha = random() * 0.7 + 0.2;
      const tint = random() > 0.85 ? 0x00e5ff : (random() > 0.65 ? 0xffeaa7 : 0xffffff);
      starsG.beginFill(tint, alpha).drawCircle(x, y, r).endFill();
    }
  }

  _drawOrbits() {
    const g = this.orbitsGraphics;
    g.clear();

    for (const cfg of this.constructor.CELESTIAL_CONFIGS) {
      if (cfg.isSun || cfg.isStatic || cfg.isMoon) continue;

      const isKuva = cfg.isKuva;
      const color = isKuva ? 0xe74c3c : 0x2c4460;
      const alpha = isKuva ? 0.60 : 0.28;
      const width = isKuva ? 3.0 : 1.4;

      g.lineStyle(width, color, alpha);

      const steps = 180;
      const tilt = cfg.tilt || 0;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const ex = Math.cos(theta) * cfg.rx;
        const ey = Math.sin(theta) * cfg.ry;
        const px = this.center.x + (ex * cosT - ey * sinT);
        const py = this.center.y + (ex * sinT + ey * cosT);

        if (i === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
    }
  }

  /* -------------------------------------------- */
  /*  Central Sun (Sol)                           */
  /* -------------------------------------------- */

  _drawSol() {
    const sunContainer = this.root.addChild(new PIXI.Container());
    sunContainer.name = "OriginSystemSol";
    sunContainer.position.set(this.center.x, this.center.y);
    sunContainer.zIndex = 3;

    // Multi-layer glowing solar corona
    const g = sunContainer.addChild(new PIXI.Graphics());
    g.name = "solCorona";

    // Outermost coronal flares
    g.beginFill(0xffaa00, 0.05).drawCircle(0, 0, 850).endFill();
    // Mid solar atmosphere
    g.beginFill(0xff8800, 0.10).drawCircle(0, 0, 620).endFill();
    // Chromosphere glow
    g.beginFill(0xff6600, 0.22).drawCircle(0, 0, 440).endFill();
    // Solar prominence core
    g.beginFill(0xffb703, 0.55).drawCircle(0, 0, 280).endFill();
    // Bright photosphere
    g.beginFill(0xffdd00, 0.88).drawCircle(0, 0, 190).endFill();
    // Pure radiant incandescent core
    g.beginFill(0xffffff, 0.98).drawCircle(0, 0, 110).endFill();

    // Radiant dynamic rays container (rotates gently in ticker)
    const rays = sunContainer.addChild(new PIXI.Graphics());
    rays.name = "solRays";
    const numRays = 16;
    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * Math.PI * 2;
      const rayLen = 580 + (i % 2 === 0 ? 180 : 70);
      const halfW = 0.04;
      const p1x = Math.cos(angle - halfW) * 160;
      const p1y = Math.sin(angle - halfW) * 160;
      const p2x = Math.cos(angle + halfW) * 160;
      const p2y = Math.sin(angle + halfW) * 160;
      const tipX = Math.cos(angle) * rayLen;
      const tipY = Math.sin(angle) * rayLen;

      rays.beginFill(0xffb703, 0.06);
      rays.moveTo(p1x, p1y);
      rays.lineTo(tipX, tipY);
      rays.lineTo(p2x, p2y);
      rays.endFill();
    }
    this.solRays = rays;

    // Register Sol in bodies mapping
    this.bodies.set("sol-sun", {
      config: { id: "sol-sun", name: "Le Soleil (Sol)", isSun: true },
      container: sunContainer,
      sprite: sunContainer,
      corona: g,
      rays,
      pos: { x: this.center.x, y: this.center.y }
    });
  }

  /* -------------------------------------------- */
  /*  Celestial Body Construction                 */
  /* -------------------------------------------- */

  _drawBody(cfg) {
    const bodyContainer = this.root.addChild(new PIXI.Container());
    bodyContainer.name = `Body_${cfg.id}`;
    bodyContainer.zIndex = cfg.isMoon ? 8 : 10;

    const meta = (cfg.img && ASSET_METADATA[cfg.img]) || { w: 1000, h: 1000 };
    const rawW = meta.w;
    const rawH = meta.h;

    // Calculate uniform scale factor (scaleX === scaleY ALWAYS to guarantee 0% distortion)
    let scale;
    if (meta.isStation) {
      scale = (cfg.size * 1.15) / rawH;
    } else {
      scale = cfg.size / rawH;
    }

    const spriteW = rawW * scale;
    const spriteH = rawH * scale;
    const halfW = spriteW * 0.5;
    const halfH = spriteH * 0.5;

    // For spherical planets, the sphere diameter is rawH * scale = cfg.size
    const sphereRadius = cfg.size * 0.5;
    const atmoColor = cfg.color || 0x00e5ff;

    // 1. Atmospheric Glow Layer (Corona Scatter behind the planet)
    const atmoGlow = bodyContainer.addChild(new PIXI.Graphics());
    atmoGlow.name = "atmosphereGlow";

    if (!meta.isStation) {
      // Outer atmospheric haze
      atmoGlow.beginFill(atmoColor, 0.10).drawCircle(0, 0, sphereRadius + 26).endFill();
      // Mid atmospheric layer
      atmoGlow.beginFill(atmoColor, 0.22).drawCircle(0, 0, sphereRadius + 15).endFill();
      // Dense limb scattering
      atmoGlow.beginFill(atmoColor, 0.40).drawCircle(0, 0, sphereRadius + 5).endFill();
    } else {
      // High-tech station energy beacon
      atmoGlow.beginFill(atmoColor, 0.18).drawCircle(0, 0, 45).endFill();
    }

    // 2. Planet Sprite (high-res official 3D render)
    let sprite;
    if (cfg.img) {
      let texture = (typeof foundry !== "undefined" && foundry.canvas?.getTexture && foundry.canvas.getTexture(cfg.img)) || (PIXI.Texture?.from ? PIXI.Texture.from(cfg.img) : null);
      sprite = bodyContainer.addChild(new PIXI.Sprite(texture));
      sprite.anchor.set(0.5, 0.5);

      const applyDimensions = () => {
        const th = texture?.height || texture?.orig?.height || rawH;
        let s;
        if (meta.isStation) {
          s = (cfg.size * 1.15) / th;
        } else {
          s = cfg.size / th;
        }
        // Strictly uniform scaling: scale.x MUST equal scale.y
        sprite.scale.set(s, s);
      };

      applyDimensions();

      if (texture?.baseTexture?.on && typeof texture.baseTexture.on === "function") {
        texture.baseTexture.on("update", applyDimensions);
        texture.baseTexture.on("loaded", applyDimensions);
      }
    } else {
      const fallback = bodyContainer.addChild(new PIXI.Graphics());
      fallback.beginFill(cfg.color || 0x58d8ff).drawCircle(0, 0, sphereRadius).endFill();
      sprite = fallback;
    }

    // 3. Tactical Reticle & Corner Brackets (Warframe HUD aesthetics)
    const tacticalHUD = bodyContainer.addChild(new PIXI.Graphics());
    tacticalHUD.name = "tacticalHUD";

    // Ambient segmented circular reticle (always subtly visible)
    tacticalHUD.lineStyle(1.8, atmoColor, 0.35);
    const segs = 4;
    const steps = 16;
    const reticleRadius = meta.hasRings ? (halfW * 0.75) : (sphereRadius + 14);
    for (let s = 0; s < segs; s++) {
      const startA = (s / segs) * Math.PI * 2 + 0.20;
      const endA = ((s + 1) / segs) * Math.PI * 2 - 0.20;
      for (let st = 0; st <= steps; st++) {
        const theta = startA + (st / steps) * (endA - startA);
        const px = Math.cos(theta) * reticleRadius;
        const py = Math.sin(theta) * (meta.hasRings ? (halfH + 10) : reticleRadius);
        if (st === 0) tacticalHUD.moveTo(px, py);
        else tacticalHUD.lineTo(px, py);
      }
    }

    // Tactical corner brackets [ ] (expand and brighten on hover)
    const brackets = bodyContainer.addChild(new PIXI.Graphics());
    brackets.name = "tacticalBrackets";
    const padX = Math.max(12, halfW * 0.10);
    const padY = Math.max(12, halfH * 0.10);
    const bW = halfW + padX;
    const bH = halfH + padY;
    const bLen = Math.min(22, Math.max(10, Math.min(bW, bH) * 0.25));

    brackets.lineStyle(2.4, atmoColor, 1.0);
    // Top-Left ┌
    brackets.moveTo(-bW, -bH + bLen).lineTo(-bW, -bH).lineTo(-bW + bLen, -bH);
    // Top-Right ┐
    brackets.moveTo(bW - bLen, -bH).lineTo(bW, -bH).lineTo(bW, -bH + bLen);
    // Bottom-Right ┘
    brackets.moveTo(bW, bH - bLen).lineTo(bW, bH).lineTo(bW - bLen, bH);
    // Bottom-Left └
    brackets.moveTo(-bW + bLen, bH).lineTo(-bW, bH).lineTo(-bW, bH - bLen);
    brackets.visible = false;

    // Hover glow ring (intense highlight)
    const glowRing = bodyContainer.addChild(new PIXI.Graphics());
    glowRing.name = "glowRing";
    if (meta.hasRings) {
      glowRing.lineStyle(2.8, atmoColor, 0.90).drawEllipse(0, 0, halfW + 12, halfH + 12);
    } else {
      glowRing.lineStyle(2.8, atmoColor, 0.90).drawCircle(0, 0, Math.max(halfW, halfH) + 12);
    }
    glowRing.visible = false;

    // 4. Holographic label text (Orbitron, large and crisp)
    const labelFontSize = cfg.isMoon ? 18 : 23;
    const labelStyle = new PIXI.TextStyle({
      fontFamily: "'Orbitron', 'Cinzel', sans-serif",
      fontSize: labelFontSize,
      fontWeight: "700",
      fill: cfg.color ? `#${cfg.color.toString(16).padStart(6, "0")}` : "#ffffff",
      letterSpacing: 1.5,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 6,
      dropShadowDistance: 0
    });
    const label = bodyContainer.addChild(new PIXI.Text(cfg.name, labelStyle));
    label.anchor.set(0.5, 0);
    label.position.set(0, halfH + 18);
    label.alpha = cfg.isMoon ? 0.80 : 0.98;

    // Interactive event mode directly on bodyContainer with generous hitArea
    bodyContainer.eventMode = "static";
    bodyContainer.cursor = "pointer";
    const hitRadius = Math.max(halfW, halfH) + 24;
    if (typeof PIXI !== "undefined" && typeof PIXI.Circle === "function") {
      bodyContainer.hitArea = new PIXI.Circle(0, 0, hitRadius);
    }

    bodyContainer.on("pointerover", () => this.highlightPlanet(cfg.id));
    bodyContainer.on("pointerout", () => this.unhighlightPlanet(cfg.id));
    bodyContainer.on("pointerdown", (event) => {
      // Open sector / tactical sheet on left click
      if (event.button === 0) {
        new WarframePlanetSheet(cfg.id).render(true);
      }
    });

    this.bodies.set(cfg.id, {
      config: cfg,
      container: bodyContainer,
      sprite,
      atmoGlow,
      tacticalHUD,
      brackets,
      label,
      pos: { x: 0, y: 0 }
    });

    return bodyContainer;
  }

  /* -------------------------------------------- */
  /*  Solar Rails Setup                           */
  /* -------------------------------------------- */

  _setupRails() {
    this.rails = [];
    for (const junc of ORIGIN_SYSTEM_JUNCTIONS) {
      this.rails.push({
        junction: junc,
        fromId: junc.from,
        toId: junc.to,
        active: false
      });
    }
  }

  /* -------------------------------------------- */
  /*  Kinematics & Animation Loop (60 FPS)        */
  /* -------------------------------------------- */

  _startTicker() {
    this._stopTicker();
    this._tickerFn = (delta) => {
      if (this.isPaused) return;
      this._updatePositions(Date.now());
    };
    canvas.app.ticker.add(this._tickerFn);
  }

  _stopTicker() {
    if (this._tickerFn) {
      canvas.app.ticker.remove(this._tickerFn);
      this._tickerFn = null;
    }
  }

  _updatePositions(timestamp) {
    const tSec = (timestamp * 0.001) * this.speedMultiplier;

    // Pulse central Sol corona & rotate solar rays
    const sol = this.bodies.get("sol-sun");
    if (sol?.container) {
      const pulse = 1.0 + Math.sin(tSec * 1.5) * 0.04;
      sol.container.scale.set(pulse, pulse);
      if (this.solRays) {
        this.solRays.rotation += 0.0006;
      }
    }

    // 1. Calculate positions for heliocentric bodies & Kuva Fortress
    for (const [id, body] of this.bodies.entries()) {
      const cfg = body?.config;
      if (!cfg || cfg.isSun || !body.container) continue;

      if (cfg.isStatic) {
        body.pos = { x: cfg.px, y: cfg.py };
        body.container.position.set(cfg.px, cfg.py);
        if (body.atmoGlow) {
          const breath = 1.0 + Math.sin(tSec * 1.4) * 0.06;
          body.atmoGlow.scale.set(breath, breath);
        }
        continue;
      }

      if (cfg.isMoon) continue; // Resolved in 2nd pass

      const period = cfg.period || 60;
      const angle = (cfg.initialAngle || 0) + (tSec / period) * Math.PI * 2;
      const ex = Math.cos(angle) * cfg.rx;
      const ey = Math.sin(angle) * cfg.ry;

      const tilt = cfg.tilt || 0;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const px = this.center.x + (ex * cosT - ey * sinT);
      const py = this.center.y + (ex * sinT + ey * cosT);

      body.pos = { x: px, y: py };
      body.container.position.set(px, py);

      // Atmospheric dynamic breathing (fluid 60 FPS pulsation)
      if (body.atmoGlow && body.atmoGlow.scale && typeof body.atmoGlow.scale.set === "function") {
        const breath = 1.0 + Math.sin(tSec * 1.8 + angle) * 0.07;
        body.atmoGlow.scale.set(breath, breath);
        body.atmoGlow.alpha = 0.85 + Math.sin(tSec * 2.2 + angle) * 0.15;
      }
    }

    // 2. Calculate positions for relative moons (Lua -> Earth, Phobos/Deimos -> Mars, Europa -> Jupiter)
    for (const [id, body] of this.bodies.entries()) {
      const cfg = body?.config;
      if (!cfg || !cfg.isMoon || !body.container) continue;

      const parentBody = this.bodies.get(cfg.parent);
      const parentPos = parentBody?.pos || this.center;

      const period = cfg.period || 15;
      const angle = (cfg.initialAngle || 0) + (tSec / period) * Math.PI * 2;
      const px = parentPos.x + Math.cos(angle) * cfg.rx;
      const py = parentPos.y + Math.sin(angle) * cfg.ry;

      body.pos = { x: px, y: py };
      if (body.container?.position?.set) {
        body.container.position.set(px, py);
      }

      if (body.atmoGlow && body.atmoGlow.scale && typeof body.atmoGlow.scale.set === "function") {
        const breath = 1.0 + Math.sin(tSec * 2.4 + angle) * 0.08;
        body.atmoGlow.scale.set(breath, breath);
      }
    }

    // 3. Render dynamic Solar Rails if any planet is hovered
    this._renderSolarRails();
  }

  /* -------------------------------------------- */
  /*  Solar Rails Rendering                       */
  /* -------------------------------------------- */

  _renderSolarRails() {
    const g = this.railsGraphics;
    g.clear();

    if (!this.activePlanetId) return;

    for (const rail of this.rails) {
      const isConnected = (rail.fromId === this.activePlanetId || rail.toId === this.activePlanetId);
      if (!isConnected) continue;

      const fromBody = this.bodies.get(rail.fromId);
      const toBody = this.bodies.get(rail.toId);
      if (!fromBody?.pos || !toBody?.pos) continue;

      const x1 = fromBody.pos.x;
      const y1 = fromBody.pos.y;
      const x2 = toBody.pos.x;
      const y2 = toBody.pos.y;
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      // Outer energetic cyan beam
      g.lineStyle(8, 0x00e5ff, 0.45);
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);

      // Core white energetic beam
      g.lineStyle(2.8, 0xffffff, 0.95);
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);

      // Midpoint Junction Node Diamond
      g.lineStyle(2.0, 0x00e5ff, 1.0);
      g.beginFill(0x021726, 0.95);
      g.drawPolygon([
        midX, midY - 14,
        midX + 11, midY,
        midX, midY + 14,
        midX - 11, midY
      ]);
      g.endFill();

      // Inner diamond glow
      g.beginFill(0x00e5ff, 0.9).drawCircle(midX, midY, 4.5).endFill();
    }
  }

  /* -------------------------------------------- */
  /*  Interactivity & Hover Highlighting          */
  /* -------------------------------------------- */

  highlightPlanet(planetId) {
    this.activePlanetId = planetId;
    const body = this.bodies.get(planetId);
    if (!body) return;

    // Scale up slightly and activate tactical brackets & intense aura
    if (body.container) {
      body.container.scale.set(1.18, 1.18);
      if (body.glowRing) body.glowRing.visible = true;
      if (body.brackets) body.brackets.visible = true;
      if (body.label) body.label.alpha = 1.0;
    }

    // Light up destination glow rings for connected targets
    for (const rail of this.rails) {
      if (rail.fromId === planetId) {
        const dest = this.bodies.get(rail.toId);
        if (dest?.glowRing) dest.glowRing.visible = true;
      } else if (rail.toId === planetId) {
        const dest = this.bodies.get(rail.fromId);
        if (dest?.glowRing) dest.glowRing.visible = true;
      }
    }
  }

  unhighlightPlanet(planetId) {
    if (this.activePlanetId === planetId) {
      this.activePlanetId = null;
    }
    const body = this.bodies.get(planetId);
    if (!body) return;

    if (body.container) {
      body.container.scale.set(1.0, 1.0);
      if (body.glowRing) body.glowRing.visible = false;
      if (body.brackets) body.brackets.visible = false;
      if (body.label) body.label.alpha = body.config.isMoon ? 0.80 : 0.98;
    }

    // Reset glow rings on connected targets
    for (const rail of this.rails) {
      if (rail.fromId === planetId) {
        const dest = this.bodies.get(rail.toId);
        if (dest?.glowRing) dest.glowRing.visible = false;
      } else if (rail.toId === planetId) {
        const dest = this.bodies.get(rail.fromId);
        if (dest?.glowRing) dest.glowRing.visible = false;
      }
    }
  }
}
