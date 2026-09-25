import { combineElements } from "./data-weapon-mods.js";

export class WarframeItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["warframe-sheet", "item"],
      width: 780,
      height: 620,
      resizable: true,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }],
      dragDrop: [{ dragSelector: null, dropSelector: null }]
    });
  }

  /** @override */
  get template() {
    if (this.item.type === "weapon") {
      return `systems/warframe-ttrpg/templates/item-weapon-sheet.html`;
    }
    if (this.item.type === "mod") {
      return `systems/warframe-ttrpg/templates/item-mod-sheet.html`;
    }
    return `systems/warframe-ttrpg/templates/item-sheet.html`;
  }

  /** @override */
  render(force = false, options = {}) {
    if (this.item.type === "weapon") {
      options.width = Math.max(options.width || 0, 780);
      options.height = Math.max(options.height || 0, 620);
    } else if (this.item.type === "mod") {
      options.width = Math.max(options.width || 0, 540);
      options.height = Math.max(options.height || 0, 620);
    }
    return super.render(force, options);
  }

  /** @override */
  async getData() {
    const context = await super.getData();
    context.system = context.item.system;

    console.log("Warframe TTRPG | ItemSheet type:", this.item.type, "advancements:", this.item.system.advancements);

    if (this.item.type === "warframe") {
      const ranks = [];
      const advancements = this.item.system.advancements || {};
      for (let r = 1; r <= 30; r++) {
        const rankAdvancements = [];
        for (let [id, adv] of Object.entries(advancements)) {
          if (Number(adv.level) === r) {
            let typeLabel = adv.type;
            let typeIcon = "icons/svg/up.svg";
            let summary = "";

            if (adv.type === "HitPoints") {
              typeLabel = "Points de Vie & Ressources";
              typeIcon = "icons/svg/heart.svg";
              const hpInc = adv.healthIncrease !== undefined ? adv.healthIncrease : 3.45;
              const shdInc = adv.shieldIncrease !== undefined ? adv.shieldIncrease : 3.45;
              const enInc = adv.energyIncrease !== undefined ? adv.energyIncrease : 1.72;
              summary = `HP: ${adv.health || 0} (+${hpInc}/lvl) | Shd: ${adv.shields || 0} (+${shdInc}/lvl) | En: ${adv.energy || 0} (+${enInc}/lvl) | Arm: ${adv.armor || 0}`;
            } else if (adv.type === "AbilityScoreImprovement") {
              typeLabel = "Amélioration de Caractéristique (ASI)";
              typeIcon = "icons/svg/upgrade.svg";
              summary = `Points: ${adv.points || 2}`;
            } else if (adv.type === "GrantItems") {
              typeLabel = "Octroi d'Objets (Aptitudes / Pouvoirs)";
              typeIcon = "icons/svg/item-bag.svg";
              const names = [];
              if (adv.uuids) {
                for (let uuid of adv.uuids) {
                  try {
                    const doc = fromUuidSync(uuid);
                    if (doc) names.push(doc.name);
                    else {
                      const parts = uuid.split(".");
                      names.push(parts[parts.length - 1]);
                    }
                  } catch (e) {
                    const parts = uuid.split(".");
                    names.push(parts[parts.length - 1]);
                  }
                }
              }
              summary = names.join(", ") || "No items configured";
            } else if (adv.type === "Traits") {
              typeLabel = "Traits & Maîtrises";
              typeIcon = "icons/svg/book.svg";
              const savesList = adv.saves ? adv.saves.map(s => s.toUpperCase()).join(", ") : "";
              const skillsList = adv.skills ? adv.skills.map(sk => sk.capitalize()).join(", ") : "";
              const parts = [];
              if (savesList) parts.push(`Saves: ${savesList}`);
              if (skillsList) parts.push(`Skills: ${skillsList}`);
              summary = parts.join(" | ") || "None selected";
            }

            rankAdvancements.push({
              id: id,
              type: adv.type,
              label: typeLabel,
              icon: typeIcon,
              summary: summary,
              data: adv
            });
          }
        }
        ranks.push({
          level: r,
          advancements: rankAdvancements
        });
      }
      context.ranks = ranks;
    }

    if (this.item.type === "weapon") {
      const type = this.item.system.type || "primary";
      context.typeIcon = type === "melee" ? "fas fa-shield-alt" : type === "secondary" ? "fas fa-bullseye" : "fas fa-crosshairs";

      context.damageTypes = [
        { key: "Impact", label: "Impact" },
        { key: "Puncture", label: "Perforation" },
        { key: "Slash", label: "Tranchant" },
        { key: "Heat", label: "Feu (Chaleur)" },
        { key: "Cold", label: "Glace (Froid)" },
        { key: "Electricity", label: "Électricité" },
        { key: "Toxin", label: "Poison (Toxine)" },
        { key: "Blast", label: "Explosion" },
        { key: "Corrosive", label: "Corrosif" },
        { key: "Gas", label: "Gaz" },
        { key: "Magnetic", label: "Magnétique" },
        { key: "Radiation", label: "Radiation" },
        { key: "Viral", label: "Viral" },
        { key: "Void", label: "Néant" },
        { key: "True", label: "Dégâts Purs" }
      ];

      // Prepare Mod Grid & Capacity: 1 Special Slot (Stance for Melee, Exilus for Primary/Secondary) + 8 standard slots
      const isMelee = (type === "melee");
      const specialSlot = isMelee ? "stance" : "exilus";
      const slots = [specialSlot, "slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8"];
      const modSlots = this.item.system.modSlots || {};
      
      const allPossibleKeys = ["stance", "exilus", "slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8"];
      for (const s of allPossibleKeys) {
        if (!modSlots[s]) {
          modSlots[s] = { polarity: "none" };
        }
      }
      
      // Preserve / sync legacy stancePolarity or cross-sync stance & exilus polarity
      if (this.item.system.stancePolarity && this.item.system.stancePolarity !== "none") {
        if (modSlots.stance.polarity === "none") modSlots.stance.polarity = this.item.system.stancePolarity;
        if (modSlots.exilus.polarity === "none") modSlots.exilus.polarity = this.item.system.stancePolarity;
      }
      // Keep stance and exilus polarities aligned as the single special slot
      if (modSlots.stance.polarity !== "none" && modSlots.exilus.polarity === "none") {
        modSlots.exilus.polarity = modSlots.stance.polarity;
      } else if (modSlots.exilus.polarity !== "none" && modSlots.stance.polarity === "none") {
        modSlots.stance.polarity = modSlots.exilus.polarity;
      }
      context.system.modSlots = modSlots;

      let modCapacity = this.item.system.orokinCatalyst ? 60 : 30;
      let totalDrain = 0;
      context.modGrid = {};

      for (const s of slots) {
        const slotData = modSlots[s] || { polarity: "none" };
        const polarity = slotData.polarity || "none";
        const equippedMod = slotData.mod;

        if (equippedMod) {
          let baseDrain = Number(equippedMod.system?.drain || equippedMod.drain) || 0;
          if (s === "stance") {
            const cap = Number(equippedMod.system?.stats?.capacity || equippedMod.stats?.capacity);
            if (cap > 0 && baseDrain === 0) baseDrain = cap;
            else if (baseDrain === 0) baseDrain = 10;
          }
          const modPolarity = equippedMod.system?.polarity || equippedMod.polarity || "none";
          let actualCost = baseDrain;
          let polarityMatch = "neutral";

          if (s === "stance") {
            if (polarity !== "none" && modPolarity !== "none") {
              if (polarity === "universal" || modPolarity === "universal" || polarity === modPolarity) {
                actualCost = - (baseDrain * 2);
                polarityMatch = "match";
              } else {
                actualCost = - Math.max(0, baseDrain - 2);
                polarityMatch = "mismatch";
              }
            } else {
              actualCost = - baseDrain;
            }
            modCapacity -= actualCost; // Stance adds bonus capacity to weapon
          } else {
            if (polarity !== "none" && modPolarity !== "none") {
              if (polarity === "universal" || modPolarity === "universal" || polarity === modPolarity) {
                actualCost = Math.ceil(baseDrain / 2);
                polarityMatch = "match";
              } else {
                actualCost = Math.ceil(baseDrain * 1.25);
                polarityMatch = "mismatch";
              }
            } else {
              actualCost = baseDrain;
            }
            totalDrain += actualCost;
          }

          context.modGrid[s] = {
            id: equippedMod.id || s,
            name: equippedMod.name,
            img: equippedMod.img || "icons/svg/item-bag.svg",
            system: equippedMod.system || equippedMod,
            actualDrain: actualCost,
            polarityMatch: polarityMatch,
            polarity: modPolarity
          };
        } else {
          context.modGrid[s] = null;
        }
      }

      context.totalDrain = totalDrain;
      context.modCapacity = modCapacity;

      // Compute Modded Performance Metrics & Elemental Combinations
      let modDmgBonus = 0;
      let modCritChanceBonus = 0;
      let modCritMultBonus = 0;
      let modStatusBonus = 0;
      let modMultishotBonus = 0;
      let modFireRateBonus = 0;

      const orderedBaseElements = [];
      const standaloneCombined = { Blast: 0, Radiation: 0, Gas: 0, Magnetic: 0, Viral: 0, Corrosive: 0 };
      const physicalElements = { Slash: 0, Puncture: 0, Impact: 0 };

      let slottedCount = 0;
      for (const s of slots) {
        const m = modSlots[s]?.mod;
        if (!m) continue;
        slottedCount++;
        const st = m.system?.stats || {};
        if (st.damage) modDmgBonus += Number(st.damage) || 0;
        if (st.critChance) modCritChanceBonus += Number(st.critChance) || 0;
        if (st.critMultiplier) modCritMultBonus += Number(st.critMultiplier) || 0;
        if (st.statusChance) modStatusBonus += Number(st.statusChance) || 0;
        if (st.multishot) modMultishotBonus += Number(st.multishot) || 0;
        if (st.fireRate) modFireRateBonus += Number(st.fireRate) || 0;

        if (st.heat) orderedBaseElements.push({ name: "Heat", val: Number(st.heat) || 0 });
        if (st.cold) orderedBaseElements.push({ name: "Cold", val: Number(st.cold) || 0 });
        if (st.electricity) orderedBaseElements.push({ name: "Electricity", val: Number(st.electricity) || 0 });
        if (st.toxin) orderedBaseElements.push({ name: "Toxin", val: Number(st.toxin) || 0 });

        if (st.blast) standaloneCombined.Blast = (standaloneCombined.Blast || 0) + (Number(st.blast) || 0);
        if (st.radiation) standaloneCombined.Radiation = (standaloneCombined.Radiation || 0) + (Number(st.radiation) || 0);
        if (st.gas) standaloneCombined.Gas = (standaloneCombined.Gas || 0) + (Number(st.gas) || 0);
        if (st.magnetic) standaloneCombined.Magnetic = (standaloneCombined.Magnetic || 0) + (Number(st.magnetic) || 0);
        if (st.viral) standaloneCombined.Viral = (standaloneCombined.Viral || 0) + (Number(st.viral) || 0);
        if (st.corrosive) standaloneCombined.Corrosive = (standaloneCombined.Corrosive || 0) + (Number(st.corrosive) || 0);

        if (st.slash) physicalElements.Slash += Number(st.slash) || 0;
        if (st.puncture) physicalElements.Puncture += Number(st.puncture) || 0;
        if (st.impact) physicalElements.Impact += Number(st.impact) || 0;
      }

      const innateType = this.item.system.damageType || "";
      if (["Heat", "Cold", "Electricity", "Toxin"].includes(innateType)) {
        orderedBaseElements.push({ name: innateType, val: 100 });
      } else if (["Blast", "Radiation", "Gas", "Magnetic", "Viral", "Corrosive"].includes(innateType)) {
        standaloneCombined[innateType] = (standaloneCombined[innateType] || 0) + 100;
      }

      const activeElements = combineElements(orderedBaseElements, standaloneCombined);
      const elemColors = {
        Heat: "#ff7043", Cold: "#29b6f6", Electricity: "#ab47bc", Toxin: "#66bb6a",
        Blast: "#ffa726", Radiation: "#ffee58", Gas: "#9ccc65", Magnetic: "#26c6da", Viral: "#ec407a", Corrosive: "#d4e157",
        Slash: "#ef5350", Puncture: "#26a69a", Impact: "#b0bec5"
      };

      const elemBadges = [];
      for (const [el, val] of Object.entries(activeElements)) {
        if (val > 0) {
          const col = elemColors[el] || "#00e5ff";
          elemBadges.push(`<span style="color: ${col}; font-weight: bold; background: rgba(0,0,0,0.4); border: 1px solid ${col}; border-radius: 3px; padding: 1px 6px; font-size: 10px;">${el} +${val}%</span>`);
        }
      }

      const baseCrit = Number(this.item.system.critChance) || 5;
      const effCrit = Math.round(baseCrit * (1 + modCritChanceBonus / 100));
      const baseMult = Number(this.item.system.critMultiplier) || 2.0;
      const effMult = Math.round((1 + (baseMult - 1) * (1 + modCritMultBonus / 100)) * 10) / 10;
      const baseStatus = Number(this.item.system.statusChance) || 10;
      const effStatus = Math.round(baseStatus * (1 + modStatusBonus / 100));

      context.hasSlottedMods = slottedCount > 0;
      context.modStats = {
        damageBonus: modDmgBonus,
        effectiveCritChance: effCrit,
        effectiveCritMult: effMult,
        effectiveStatusChance: effStatus,
        multishot: modMultishotBonus,
        fireRate: modFireRateBonus,
        elementsHtml: elemBadges.join(" ")
      };
    }

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);



    if (this.item.type === "warframe") {
      html.find('.add-advancement-btn').on("click", async event => {
        event.preventDefault();
        
        const levelsOptions = Array.from({length: 30}, (_, i) => i + 1)
          .map(lvl => `<option value="${lvl}">Rank ${lvl}</option>`)
          .join('');

        const dlg = new Dialog({
          title: "Select Advancement Type",
          content: `
            <form class="advancement-selection-dialog" style="display: flex; flex-direction: column; gap: 12px; min-width: 320px; font-family: 'Orbitron', sans-serif; background: #0b0f1a; padding: 10px; border-radius: 6px; border: 1px solid rgba(0, 229, 255, 0.15);">
              <p style="font-size: 11px; color: #8892b0; margin: 0; font-family: 'Inter', sans-serif;">Select the Rank and the Type of advancement to add to this class:</p>
              
              <div class="form-group" style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-weight: bold; font-size: 11px; color: #00e5ff; text-transform: uppercase; font-family: 'Orbitron', sans-serif; letter-spacing: 0.5px;">Target Rank</label>
                <select id="adv-lvl" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(0, 229, 255, 0.25); color: #fff; padding: 6px; border-radius: 4px; font-family: 'Orbitron', sans-serif; outline: none; font-size: 12px;">
                  ${levelsOptions}
                </select>
              </div>
              
              <div class="form-group" style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-weight: bold; font-size: 11px; color: #00e5ff; text-transform: uppercase; font-family: 'Orbitron', sans-serif; letter-spacing: 0.5px;">Advancement Type</label>
                <div class="adv-type-list" style="display: flex; flex-direction: column; gap: 6px;">
                  <div class="adv-type-option active" data-type="HitPoints" style="display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(0, 229, 255, 0.05); border: 1px solid #00e5ff; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;">
                    <i class="fas fa-heart" style="color: #ff2a5f; font-size: 16px; width: 20px; text-align: center;"></i>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 11px; font-weight: bold; color: #fff; font-family: 'Orbitron', sans-serif;">Hit Points</span>
                      <span style="font-size: 9px; color: #8892b0; font-family: 'Inter', sans-serif;">Configure base health, shields, armor, and energy.</span>
                    </div>
                  </div>
                  <div class="adv-type-option" data-type="AbilityScoreImprovement" style="display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer; transition: all 0.2s ease;">
                    <i class="fas fa-tools" style="color: #00e5ff; font-size: 16px; width: 20px; text-align: center;"></i>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 11px; font-weight: bold; color: #fff; font-family: 'Orbitron', sans-serif;">Ability Score Improvement</span>
                      <span style="font-size: 9px; color: #8892b0; font-family: 'Inter', sans-serif;">Grant attribute points to distribute on level up.</span>
                    </div>
                  </div>
                  <div class="adv-type-option" data-type="GrantItems" style="display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer; transition: all 0.2s ease;">
                    <i class="fas fa-layer-group" style="color: #2ecc71; font-size: 16px; width: 20px; text-align: center;"></i>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 11px; font-weight: bold; color: #fff; font-family: 'Orbitron', sans-serif;">Grant Items</span>
                      <span style="font-size: 9px; color: #8892b0; font-family: 'Inter', sans-serif;">Automatically grant powers, abilities, or passives.</span>
                    </div>
                  </div>
                  <div class="adv-type-option" data-type="Traits" style="display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer; transition: all 0.2s ease;">
                    <i class="fas fa-shoe-prints" style="color: #f1c40f; font-size: 16px; width: 20px; text-align: center;"></i>
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 11px; font-weight: bold; color: #fff; font-family: 'Orbitron', sans-serif;">Traits</span>
                      <span style="font-size: 9px; color: #8892b0; font-family: 'Inter', sans-serif;">Grant saving throws or skill proficiencies.</span>
                    </div>
                  </div>
                </div>
              </div>
              <input type="hidden" id="selected-type" value="HitPoints" />
            </form>
          `,
          buttons: {
            create: {
              icon: '<i class="fas fa-check"></i>',
              label: "CREATE ADVANCEMENT",
              callback: async (dialogHtml) => {
                const html = dialogHtml.jquery ? dialogHtml : $(dialogHtml);
                const level = Number(html.find('#adv-lvl').val());
                const type = html.find('#selected-type').val();
                const advId = foundry.utils.randomID ? foundry.utils.randomID() : Math.random().toString(36).substring(2, 18);
                
                const defaults = {
                  HitPoints: { health: 100, shields: 100, energy: 100, armor: 100 },
                  AbilityScoreImprovement: { points: 2 },
                  GrantItems: { uuids: [] },
                  Traits: { saves: [], skills: [] }
                };

                const newAdv = {
                  level: level,
                  type: type,
                  ...defaults[type]
                };

                await this.item.update({
                  [`system.advancements.${advId}`]: newAdv
                });
                
                this._onEditAdvancement(advId, newAdv);
              }
            }
          },
          default: "create",
          render: (dialogHtml) => {
            const html = dialogHtml.jquery ? dialogHtml : $(dialogHtml);
            html.find('.adv-type-option').click(event => {
              html.find('.adv-type-option').removeClass('active').css({
                'border': '1px solid rgba(255,255,255,0.1)',
                'background': 'rgba(255,255,255,0.03)'
              });
              const option = $(event.currentTarget);
              option.addClass('active').css({
                'border': '1px solid #00e5ff',
                'background': 'rgba(0, 229, 255, 0.05)'
              });
              html.find('#selected-type').val(option.data('type'));
            });
          }
        }, { classes: ["dialog", "warframe-dialog"] });
        dlg.render(true);
      });
      html.find('.edit-advancement').on("click", async event => {
        event.preventDefault();
        const advId = event.currentTarget.dataset.advancementId;
        this._onEditAdvancement(advId);
      });

      html.find('.delete-advancement').on("click", async event => {
        event.preventDefault();
        const advId = event.currentTarget.dataset.advancementId;
        Dialog.confirm({
          title: "Delete Advancement",
          content: "<p>Are you sure you want to delete this advancement configuration?</p>",
          yes: async () => {
            await this.item.update({
              [`system.advancements.-=${advId}`]: null
            });
          }
        }, { classes: ["dialog", "warframe-dialog"] });
      });
    }

    if (this.item.type === "weapon") {
      html.find('.roll-weapon-btn').click(async event => {
        event.preventDefault();
        if (this.item.actor) {
          await this.item.actor.rollWeapon(this.item.id);
        } else {
          // Standalone roll if unowned
          const formula = this.item.system.damage || "1d10";
          const roll = new Roll(formula);
          await roll.evaluate({ async: true });
          const critChance = Number(this.item.system.critChance) || 5;
          const critMultiplier = Number(this.item.system.critMultiplier) || 2.0;
          const isCrit = (Math.floor(Math.random() * 100) + 1) <= critChance;
          const totalDmg = isCrit ? Math.round(roll.total * critMultiplier) : roll.total;

          const cardContent = `
            <div class="warframe-chat-card weapon-card" style="font-family: 'Inter', sans-serif;">
              <div class="card-header" style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 8px; margin-bottom: 10px;">
                <img src="${this.item.img}" width="30" height="30" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;" />
                <div>
                  <h3 style="font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: bold; color: #fff; margin: 0;">${this.item.name} Attack</h3>
                  <span style="font-size: 9px; color: #00e5ff; text-transform: uppercase;">${this.item.system.type || "Weapon"} (${this.item.system.subtype || "General"})</span>
                </div>
              </div>
              <div class="card-body" style="font-size: 12px; color: #ccd6f6;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span>Base Roll (${this.item.system.damageType || "Slash"}):</span>
                  <span style="color: #ccd6f6; font-weight: bold;">${roll.total}</span>
                </div>
                ${isCrit ? `
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; color: #f1c40f; font-size: 11px;">
                    <span>✨ Critical Hit (x${critMultiplier}):</span>
                    <strong style="color: #f1c40f;">${roll.total} x ${critMultiplier}</strong>
                  </div>
                ` : ""}
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 6px; font-size: 13px;">
                  <span style="font-weight: bold; color: #fff;">Total Damage:</span>
                  <span style="color: #ffaa00; font-weight: bold; font-size: 15px;">${totalDmg}</span>
                </div>
                <div style="margin-top: 6px; font-size: 11px; display: flex; justify-content: space-between;">
                  <span>Range: <strong>${this.item.system.range || "50m"}</strong></span>
                  <span>Status: <strong>${this.item.system.statusChance || 15}%</strong></span>
                </div>
              </div>
            </div>
          `;
          await ChatMessage.create({
            user: game.user.id,
            content: cardContent
          });
        }
      });

      html.find('.roll-weapon-finisher-btn').click(async event => {
        event.preventDefault();
        if (this.item.actor) {
          await this.item.actor.rollWeapon(this.item.id, { isFinisher: true });
        }
      });

      html.find('.roll-weapon-alt-btn').click(async event => {
        event.preventDefault();
        if (this.item.actor) {
          await this.item.actor.rollWeapon(this.item.id, { isAltFire: true });
        }
      });

      html.find('.swap-weapon-mode-btn').click(async event => {
        event.preventDefault();
        const currentMode = this.item.system.currentMode || (this.item.system.type === "melee" ? "melee" : "rifle");
        const newMode = currentMode === "melee" ? "rifle" : "melee";
        const modes = this.item.system.modes || {};
        const modeData = modes[newMode];

        const updates = {
          "system.currentMode": newMode
        };

        if (modeData) {
          if (modeData.type) updates["system.type"] = modeData.type;
          if (modeData.subtype) updates["system.subtype"] = modeData.subtype;
          if (modeData.damage) updates["system.damage"] = modeData.damage;
          if (modeData.damageType) updates["system.damageType"] = modeData.damageType;
          if (modeData.range) updates["system.range"] = modeData.range;
          if (modeData.hasAltFire !== undefined) updates["system.hasAltFire"] = modeData.hasAltFire;
          if (modeData.altFireLabel !== undefined) updates["system.altFireLabel"] = modeData.altFireLabel;
          if (modeData.altFireIcon !== undefined) updates["system.altFireIcon"] = modeData.altFireIcon;
          if (modeData.altDamage !== undefined) updates["system.altDamage"] = modeData.altDamage;
          if (modeData.altDamageType !== undefined) updates["system.altDamageType"] = modeData.altDamageType;
        } else {
          if (newMode === "melee") {
            updates["system.type"] = "melee";
            updates["system.subtype"] = "Bayonet";
            updates["system.damage"] = "2d10";
            updates["system.damageType"] = "Puncture";
            updates["system.range"] = "Melee (8 ft)";
            updates["system.hasAltFire"] = false;
          } else {
            updates["system.type"] = "primary";
            updates["system.subtype"] = "Bayonet Rifle";
            updates["system.damage"] = "2d12";
            updates["system.damageType"] = "Puncture";
            updates["system.range"] = "50m (60 ft)";
            updates["system.hasAltFire"] = true;
            updates["system.altFireLabel"] = "Bayonet Strike";
            updates["system.altFireIcon"] = "fas fa-dagger";
            updates["system.altDamage"] = "2d10";
            updates["system.altDamageType"] = "Puncture";
          }
        }

        await this.item.update(updates);
        ui.notifications.info(`${this.item.name} transformed into ${newMode === "melee" ? "Bayonet (Melee)" : "Rifle (Primary)"} mode!`);
      });

      html.find('.toggle-catalyst-btn').click(async event => {
        event.preventDefault();
        const current = !!this.item.system.orokinCatalyst;
        const newState = !current;
        await this.item.update({ "system.orokinCatalyst": newState });
        if (newState) {
          ui.notifications.info(`Installed Orokin Catalyst on ${this.item.name}! Weapon mod capacity doubled to 60.`);
        } else {
          ui.notifications.info(`Removed Orokin Catalyst from ${this.item.name}. Weapon mod capacity returned to 30.`);
        }
      });

      // Cycle slot polarity on click (identical to Character Sheet)
      html.find('.slot-polarity').click(async event => {
        event.stopPropagation();
        const slotKey = event.currentTarget.dataset.slot;
        const currentPolarity = this.item.system.modSlots?.[slotKey]?.polarity || (slotKey === "stance" ? this.item.system.stancePolarity : "none") || "none";
        
        const polarities = ["universal", "none", "Madurai", "Vazarin", "Naramon", "Zenurik", "Unairu", "Umbra"];
        let nextIndex = (polarities.indexOf(currentPolarity) + 1) % polarities.length;
        const newPolarity = polarities[nextIndex];

        const updates = {
          [`system.modSlots.${slotKey}.polarity`]: newPolarity
        };
        if (slotKey === "stance") {
          updates["system.stancePolarity"] = newPolarity;
        }
        await this.item.update(updates);
      });

      // Unequip slotted Mod
      html.find('.mod-slot-card.occupied').click(async event => {
        if ($(event.target).closest(".slot-polarity, .mod-polarity-badge").length > 0) return;
        event.preventDefault();
        const slotKey = event.currentTarget.dataset.slot || event.currentTarget.closest(".mod-slot-card")?.dataset.slot;
        const cardContainer = event.currentTarget.closest(".mod-slot-card-container");
        const targetSlot = slotKey || cardContainer?.querySelector(".slot-polarity")?.dataset.slot;
        if (targetSlot) {
          const modName = this.item.system.modSlots?.[targetSlot]?.mod?.name || "Mod";
          await this.item.update({
            [`system.modSlots.${targetSlot}.mod`]: null
          });
          ui.notifications.info(`${modName} retiré de l'emplacement ${targetSlot} !`);
        }
      });

      // Right-click to inspect slotted Mod
      html.find('.mod-slot-card.occupied').on("contextmenu", async event => {
        event.preventDefault();
        const slotKey = event.currentTarget.dataset.slot || event.currentTarget.closest(".mod-slot-card")?.dataset.slot;
        const cardContainer = event.currentTarget.closest(".mod-slot-card-container");
        const targetSlot = slotKey || cardContainer?.querySelector(".slot-polarity")?.dataset.slot;
        const slottedMod = this.item.system.modSlots?.[targetSlot]?.mod;
        if (slottedMod) {
          const tempItem = new Item(slottedMod, { parent: this.item.actor || null });
          new WarframeItemSheet(tempItem).render(true);
        }
      });

      // Equip Mod into empty slot with Compendium Querying, Filtering & Live Search
      html.find('.mod-slot-card.empty').click(async event => {
        if ($(event.target).closest(".slot-polarity").length > 0) return;
        event.preventDefault();
        const slotKey = event.currentTarget.dataset.slot;

        // Collect mods from Actor, World, and Compendium Pack
        const modCandidates = [];
        if (this.item.actor) {
          modCandidates.push(...this.item.actor.items.filter(i => i.type === "mod"));
        }
        modCandidates.push(...game.items.filter(i => i.type === "mod"));

        const compendium = game.packs.get("warframe-ttrpg.mods");
        if (compendium) {
          try {
            const compDocs = await compendium.getDocuments();
            modCandidates.push(...compDocs.filter(i => i.type === "mod"));
          } catch (e) {
            console.warn("Warframe TTRPG | Could not load mods compendium documents", e);
          }
        }

        // Deduplicate by name
        const seenNames = new Set();
        const uniqueMods = [];
        for (const m of modCandidates) {
          if (!m.name || seenNames.has(m.name)) continue;
          seenNames.add(m.name);
          uniqueMods.push(m);
        }

        // Weapon properties for filtering
        const weaponSlot = (this.item.system.type || "primary").toLowerCase();
        const subtype = (this.item.system.subtype || "").toLowerCase();
        const isShotgun = subtype.includes("shotgun");

        // Identify mods already equipped on this weapon
        const equippedNames = new Set(
          Object.values(this.item.system.modSlots || {})
            .map(s => s?.mod?.name)
            .filter(Boolean)
        );

        // Filter based on target slot and weapon type
        const availableMods = uniqueMods.filter(m => {
          if (equippedNames.has(m.name)) return false;

          const mType = (m.system.type || "standard").toLowerCase();
          const mModType = (m.system.modType || "weapon").toLowerCase();
          const mWeaponType = (m.system.weaponType || "all").toLowerCase();

          // Exclude pure Warframe / Aura mods from weapons
          if (mModType === "warframe" || mType === "aura") return false;

          if (slotKey === "stance") {
            return mType === "stance";
          }

          if (slotKey === "exilus") {
            return mType === "exilus";
          }

          // Regular slots (slot1 - slot8): cannot accept stance or aura mods
          if (mType === "stance" || mType === "aura") return false;

          // Weapon type matching
          if (weaponSlot === "primary") {
            if (mModType !== "primary" && mModType !== "weapon" && mModType !== "all") return false;
            if (mWeaponType === "shotgun" && !isShotgun) return false;
            if (mWeaponType === "rifle" && isShotgun) return false;
            return true;
          } else if (weaponSlot === "secondary") {
            return mModType === "secondary" || mModType === "weapon" || mModType === "all";
          } else if (weaponSlot === "melee") {
            return mModType === "melee" || mModType === "weapon" || mModType === "all";
          }

          return true;
        });

        if (availableMods.length === 0) {
          ui.notifications.warn(`Aucun mod compatible trouvé pour l'emplacement ${slotKey.toUpperCase()} (${weaponSlot}) !`);
          return;
        }

        // Sort alphabetically
        availableMods.sort((a, b) => a.name.localeCompare(b.name));

        const rarityColors = {
          common: "#cd7f32",
          uncommon: "#c0c0c0",
          rare: "#ffd700",
          legendary: "#e0e6ed"
        };

        const slotPolarity = this.item.system.modSlots?.[slotKey]?.polarity || (slotKey === "stance" ? this.item.system.stancePolarity : "none") || "none";
        const slotPolNorm = String(slotPolarity).toLowerCase();
        
        const getPolIcon = (pol) => {
          if (!pol || pol === "none") return "";
          const norm = String(pol).toLowerCase();
          const icons = {
            universal: 'systems/warframe-ttrpg/asset/polarity icon/Any_Pol.jpg',
            any: 'systems/warframe-ttrpg/asset/polarity icon/Any_Pol.jpg',
            madurai: 'systems/warframe-ttrpg/asset/polarity icon/Madurai_Pol(xBlack).jpg',
            vazarin: 'systems/warframe-ttrpg/asset/polarity icon/Vazarin_Pol(xBlack).jpg',
            naramon: 'systems/warframe-ttrpg/asset/polarity icon/Naramon_Pol(xBlack).jpg',
            zenurik: 'systems/warframe-ttrpg/asset/polarity icon/Zenurik_Pol(xBlack).jpg',
            unairu: 'systems/warframe-ttrpg/asset/polarity icon/Unairu_Pol(xBlack).jpg',
            umbra: 'systems/warframe-ttrpg/asset/polarity icon/Umbra_Pol(xBlack).jpg'
          };
          return icons[norm] || "";
        };

        const slotPolIconUrl = getPolIcon(slotPolarity);

        let listHtml = `
          <div class="mod-selector-dialog" style="display: flex; flex-direction: column; gap: 10px; max-height: 480px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 6px;">
              <span style="font-size: 11px; color: #8892b0; font-family: 'Inter', sans-serif; display: flex; align-items: center; gap: 6px;">
                Installer dans l'emplacement : <strong style="color: #00e5ff; text-transform: uppercase;">${slotKey}</strong>
                ${slotPolarity !== 'none' ? `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 1px 6px; border-radius: 3px; background: rgba(0,229,255,0.1); border: 1px solid #00e5ff; color: #00e5ff; font-size: 9px; font-family: 'Orbitron', sans-serif;">${slotPolIconUrl ? `<img src="${slotPolIconUrl}" style="width: 12px; height: 12px; mix-blend-mode: screen;" />` : ''}${slotPolarity}</span>` : '<span style="font-size: 9px; color: #8892b0;">(Non polarisé)</span>'}
              </span>
              <span style="font-size: 10px; color: #ffd700; font-family: 'Orbitron', sans-serif;">
                ${availableMods.length} Mods Compatibles
              </span>
            </div>
            
            <input type="text" class="weapon-mod-search-input" placeholder="🔍 Rechercher par nom, polarité, stat ou élément..." style="width: 100%; padding: 6px 10px; font-size: 11px; font-family: 'Inter', sans-serif; background: rgba(0,0,0,0.5); border: 1px solid rgba(0, 229, 255, 0.3); color: #fff; border-radius: 4px; outline: none;" />

            <ul class="weapon-mod-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; max-height: 380px; overflow-y: auto;">
        `;

        for (let m of availableMods) {
          const rar = (m.system.rarity || "common").toLowerCase();
          const rarColor = rarityColors[rar] || "#cd7f32";
          const st = m.system.stats || {};
          const statSnippets = [];
          if (st.damage) statSnippets.push(`+${st.damage}% Dmg`);
          if (st.critChance) statSnippets.push(`+${st.critChance}% Crit`);
          if (st.critMultiplier) statSnippets.push(`+${st.critMultiplier}% CD`);
          if (st.statusChance) statSnippets.push(`+${st.statusChance}% Stat`);
          if (st.multishot) statSnippets.push(`+${st.multishot}% Multi`);
          if (st.fireRate) statSnippets.push(`+${st.fireRate}% Spd`);
          if (st.heat) statSnippets.push(`+${st.heat}% Heat`);
          if (st.cold) statSnippets.push(`+${st.cold}% Cold`);
          if (st.electricity) statSnippets.push(`+${st.electricity}% Elec`);
          if (st.toxin) statSnippets.push(`+${st.toxin}% Toxin`);
          if (st.blast) statSnippets.push(`+${st.blast}% Blast`);
          if (st.radiation) statSnippets.push(`+${st.radiation}% Rad`);
          if (st.gas) statSnippets.push(`+${st.gas}% Gas`);
          if (st.magnetic) statSnippets.push(`+${st.magnetic}% Mag`);
          if (st.viral) statSnippets.push(`+${st.viral}% Viral`);
          if (st.corrosive) statSnippets.push(`+${st.corrosive}% Corr`);
          if (st.capacity) statSnippets.push(`+${st.capacity} Cap`);

          const statLabel = statSnippets.length > 0 ? statSnippets.join(" | ") : (m.system.description ? m.system.description.replace(/<[^>]*>?/gm, '').substring(0, 45) + '...' : '');

          const mPol = m.system.polarity || "none";
          const mPolNorm = String(mPol).toLowerCase();
          const mPolIcon = getPolIcon(mPol);

          let polarityMatch = "neutral";
          let matchLabel = "";
          let badgeColor = "#8892b0";
          let badgeBg = "rgba(255, 255, 255, 0.05)";
          let badgeBorder = "rgba(255, 255, 255, 0.15)";
          let baseDrain = Number(m.system?.drain || m.drain) || 0;
          if (slotKey === "stance" && baseDrain === 0) {
            baseDrain = Number(m.system?.stats?.capacity || m.stats?.capacity) || 10;
          }
          let effectiveDrain = baseDrain;

          if (slotPolNorm !== "none" && mPolNorm !== "none") {
            if (slotPolNorm === "universal" || mPolNorm === "universal" || slotPolNorm === mPolNorm) {
              polarityMatch = "match";
              badgeColor = "#2ecc71";
              badgeBg = "rgba(46, 204, 113, 0.2)";
              badgeBorder = "#2ecc71";
              if (slotKey === "stance") {
                effectiveDrain = baseDrain * 2;
                matchLabel = `CORRESPONDANCE : +${effectiveDrain} Cap`;
              } else {
                effectiveDrain = Math.ceil(baseDrain / 2);
                matchLabel = `CORRESPONDANCE : ${effectiveDrain} Coût`;
              }
            } else {
              polarityMatch = "mismatch";
              badgeColor = "#ff2a5f";
              badgeBg = "rgba(255, 42, 95, 0.2)";
              badgeBorder = "#ff2a5f";
              if (slotKey === "stance") {
                effectiveDrain = Math.max(0, baseDrain - 2);
                matchLabel = `DISCORDANCE : +${effectiveDrain} Cap`;
              } else {
                effectiveDrain = Math.ceil(baseDrain * 1.25);
                matchLabel = `DISCORDANCE : ${effectiveDrain} Coût`;
              }
            }
          }

          const polIconHtml = mPolIcon
            ? `<img src="${mPolIcon}" style="width: 14px; height: 14px; object-fit: contain; mix-blend-mode: screen; filter: ${polarityMatch === 'match' ? 'drop-shadow(0 0 3px #2ecc71) brightness(1.3)' : polarityMatch === 'mismatch' ? 'drop-shadow(0 0 3px #ff2a5f) brightness(1.3)' : 'none'}; vertical-align: middle;" />`
            : "";

          listHtml += `
            <li class="weapon-mod-item" data-mod-id="${m.id}" data-mod-search="${m.name.toLowerCase()} ${mPolNorm} ${statLabel.toLowerCase()}" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: rgba(13, 17, 24, 0.7); border: 1px solid ${rarColor}; border-radius: 4px; gap: 8px;">
              <img src="${m.img || 'icons/svg/sword.svg'}" style="width: 28px; height: 28px; object-fit: contain; border-radius: 3px; border: 1px solid rgba(255,255,255,0.1);" />
              <div style="flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <span style="font-weight: bold; font-family: 'Orbitron', sans-serif; color: #fff; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</span>
                  <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; padding: 1px 5px; border-radius: 3px; background: ${badgeBg}; border: 1px solid ${badgeBorder}; color: ${badgeColor}; font-family: 'Orbitron', sans-serif;">
                    ${polIconHtml}
                    <span>${mPol}</span>
                    ${matchLabel ? `<span style="font-size: 8px; opacity: 0.9;">(${matchLabel})</span>` : ''}
                  </span>
                </div>
                <div style="font-size: 9px; color: ${polarityMatch === 'match' ? '#2ecc71' : polarityMatch === 'mismatch' ? '#ff2a5f' : '#ffd700'}; font-family: 'Inter', sans-serif; display: flex; align-items: center; gap: 6px;">
                  <span>${slotKey === 'stance' ? `Capacité : +${effectiveDrain}` : `Coût : ${effectiveDrain}`}</span>
                  ${statLabel ? `&bull; <span style="color: #2ecc71;">${statLabel}</span>` : ''}
                </div>
              </div>
              <button type="button" class="select-weapon-mod-btn" data-mod-id="${m.id}" style="width: auto; padding: 4px 8px; background: rgba(0,229,255,0.12); border: 1px solid #00e5ff; color: #00e5ff; font-family: 'Orbitron', sans-serif; font-size: 9px; font-weight: bold; border-radius: 3px; cursor: pointer;">
                Installer
              </button>
            </li>
          `;
        }

        listHtml += `
            </ul>
          </div>
        `;

        new Dialog({
          title: `Installer un Mod sur l'Arme (${slotKey.toUpperCase()})`,
          content: listHtml,
          buttons: {},
          render: dialogHtml => {
            // Live Search Filter
            dialogHtml.find(".weapon-mod-search-input").on("input", ev => {
              const query = ev.currentTarget.value.toLowerCase().trim();
              dialogHtml.find(".weapon-mod-item").each((idx, el) => {
                const searchStr = el.dataset.modSearch || "";
                if (!query || searchStr.includes(query)) {
                  el.style.display = "flex";
                } else {
                  el.style.display = "none";
                }
              });
            });

            // Slot Mod button handler
            dialogHtml.find(".select-weapon-mod-btn").click(async ev => {
              const modId = ev.currentTarget.dataset.modId;
              const targetMod = availableMods.find(m => m.id === modId);
              if (targetMod) {
                let drainVal = Number(targetMod.system?.drain || targetMod.drain) || 0;
                if (slotKey === "stance" && drainVal === 0) {
                  drainVal = Number(targetMod.system?.stats?.capacity || targetMod.stats?.capacity) || 10;
                }
                const modObj = {
                  id: targetMod.id,
                  name: targetMod.name,
                  img: targetMod.img,
                  system: {
                    drain: drainVal,
                    polarity: targetMod.system?.polarity || targetMod.polarity || "none",
                    rarity: targetMod.system?.rarity || "common",
                    type: targetMod.system?.type || "standard",
                    modType: targetMod.system?.modType || "weapon",
                    weaponType: targetMod.system?.weaponType || "all",
                    description: targetMod.system?.description || "",
                    stats: foundry.utils.duplicate(targetMod.system?.stats || {})
                  }
                };
                await this.item.update({
                  [`system.modSlots.${slotKey}.mod`]: modObj
                });
                ui.notifications.info(`${targetMod.name} installé dans l'emplacement ${slotKey} !`);
              }
              ev.currentTarget.closest(".app").querySelector(".close").click();
            });
          }
        }, {
          width: 440,
          classes: ["dialog", "warframe-dialog", "warframe-selector-popup"]
        }).render(true);
      });
    }
  }

  async _onEditAdvancement(advId, fallbackAdv = null) {
    const adv = this.item.system.advancements?.[advId] || fallbackAdv;
    if (!adv) return;

    if (adv.type === "HitPoints") {
      new Dialog({
        title: `Configure Hit Points - Rank ${adv.level}`,
        content: `
          <form style="display: flex; flex-direction: column; gap: 8px; padding: 5px;">
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color: #ccd6f6;">Base Health</label>
              <input type="number" id="hp-val" value="${adv.health || 0}" style="width: 60px; text-align: center; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.15);" />
            </div>
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color: #ccd6f6;">Base Shields</label>
              <input type="number" id="shd-val" value="${adv.shields || 0}" style="width: 60px; text-align: center; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.15);" />
            </div>
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color: #ccd6f6;">Base Energy</label>
              <input type="number" id="en-val" value="${adv.energy || 0}" style="width: 60px; text-align: center; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.15);" />
            </div>
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color: #ccd6f6;">Base Armor</label>
              <input type="number" id="arm-val" value="${adv.armor || 0}" style="width: 60px; text-align: center; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.15);" />
            </div>
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; margin-top: 8px;">
              <label style="color: #00e5ff; font-weight: bold;">Health / level</label>
              <input type="number" step="0.01" id="hp-inc" value="${adv.healthIncrease !== undefined ? adv.healthIncrease : 3.45}" style="width: 60px; text-align: center; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.15);" />
            </div>
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color: #00e5ff;">Shields / level</label>
              <input type="number" step="0.01" id="shd-inc" value="${adv.shieldIncrease !== undefined ? adv.shieldIncrease : 3.45}" style="width: 60px; text-align: center; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.15);" />
            </div>
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color: #00e5ff;">Energy / level</label>
              <input type="number" step="0.01" id="en-inc" value="${adv.energyIncrease !== undefined ? adv.energyIncrease : 1.72}" style="width: 60px; text-align: center; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.15);" />
            </div>
          </form>
        `,
        buttons: {
          save: {
            icon: '<i class="fas fa-save"></i>',
            label: "Save Changes",
            callback: async (dialogHtml) => {
              const html = dialogHtml.jquery ? dialogHtml : $(dialogHtml);
              await this.item.update({
                [`system.advancements.${advId}.health`]: Number(html.find('#hp-val').val()) || 0,
                [`system.advancements.${advId}.shields`]: Number(html.find('#shd-val').val()) || 0,
                [`system.advancements.${advId}.energy`]: Number(html.find('#en-val').val()) || 0,
                [`system.advancements.${advId}.armor`]: Number(html.find('#arm-val').val()) || 0,
                [`system.advancements.${advId}.healthIncrease`]: Number(html.find('#hp-inc').val()) || 0,
                [`system.advancements.${advId}.shieldIncrease`]: Number(html.find('#shd-inc').val()) || 0,
                [`system.advancements.${advId}.energyIncrease`]: Number(html.find('#en-inc').val()) || 0
              });
            }
          }
        }
      }, { classes: ["dialog", "warframe-dialog"] }).render(true);
    } else if (adv.type === "AbilityScoreImprovement") {
      new Dialog({
        title: `Configure ASI - Rank ${adv.level}`,
        content: `
          <form style="display: flex; flex-direction: column; gap: 8px; padding: 5px;">
            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
              <label style="color: #ccd6f6;">ASI Points Granted</label>
              <input type="number" id="pts-val" value="${adv.points || 2}" style="width: 60px; text-align: center; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.15);" />
            </div>
          </form>
        `,
        buttons: {
          save: {
            icon: '<i class="fas fa-save"></i>',
            label: "Save Changes",
            callback: async (dialogHtml) => {
              const html = dialogHtml.jquery ? dialogHtml : $(dialogHtml);
              await this.item.update({
                [`system.advancements.${advId}.points`]: Number(html.find('#pts-val').val()) || 2
              });
            }
          }
        }
      }, { classes: ["dialog", "warframe-dialog"] }).render(true);
    } else if (adv.type === "GrantItems") {
      const uuidsList = adv.uuids || [];
      const uuidsHtml = uuidsList.map((uuid, i) => `
        <div class="uuid-row" style="display: flex; align-items: center; justify-content: space-between; gap: 6px; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 2px;">
          <span style="font-size: 10px; color: #ccd6f6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px;" title="${uuid}">${uuid}</span>
          <button type="button" class="del-uuid-btn" data-index="${i}" style="background: transparent; border: none; color: #ff2a5f; cursor: pointer; font-size: 10px;"><i class="fas fa-trash"></i></button>
        </div>
      `).join('');

      const d = new Dialog({
        title: `Configure Grant Items - Rank ${adv.level}`,
        content: `
          <div style="display: flex; flex-direction: column; gap: 8px; min-width: 320px;">
            <p style="font-size: 11px; color: #8892b0; margin: 0;">Drag and drop or paste item UUIDs below to grant them on rank up.</p>
            <div class="uuid-list-container" style="display: flex; flex-direction: column; gap: 4px; max-height: 150px; overflow-y: auto; margin-top: 4px;">
              ${uuidsHtml || '<p class="empty-uuid-msg" style="font-size: 10px; color: #8892b0; font-style: italic; text-align: center; margin: 10px 0;">No items configured.</p>'}
            </div>
            <div style="display: flex; gap: 6px; align-items: center; margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px;">
              <input type="text" id="new-uuid-input" placeholder="Paste UUID (e.g. Compendium.pack.itemid)" style="flex: 1; font-size: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 4px; border-radius: 4px;" />
              <button type="button" id="add-uuid-btn" style="background: #00e5ff; border: none; color: #000; font-weight: bold; font-size: 10px; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Add</button>
            </div>
          </div>
        `,
        buttons: {
          close: {
            label: "Done"
          }
        },
        render: (dialogHtml) => {
          const html = dialogHtml.jquery ? dialogHtml : $(dialogHtml);
          html.find('#add-uuid-btn').click(async () => {
            const input = html.find('#new-uuid-input');
            const val = input.val().trim();
            if (val) {
              const current = Array.from(this.item.system.advancements[advId].uuids || []);
              if (!current.includes(val)) {
                current.push(val);
                await this.item.update({
                  [`system.advancements.${advId}.uuids`]: current
                });
                d.close();
                this._onEditAdvancement(advId);
              }
            }
          });

          html.find('.del-uuid-btn').click(async event => {
            const idx = Number(event.currentTarget.dataset.index);
            const current = Array.from(this.item.system.advancements[advId].uuids || []);
            current.splice(idx, 1);
            await this.item.update({
              [`system.advancements.${advId}.uuids`]: current
            });
            d.close();
            this._onEditAdvancement(advId);
          });
        }
      }, { classes: ["dialog", "warframe-dialog"] });
      d.render(true);
    } else if (adv.type === "Traits") {
      const saves = adv.saves || [];
      const skills = adv.skills || [];

      const saveKeys = ["physique", "prowess", "systems", "focus"];
      const skillKeys = [
        "athletics", "acrobatics", "stealth", "perception", 
        "hacking", "engineering", "void", "reflexes"
      ];

      const saveCheckboxes = saveKeys.map(k => `
        <div style="display: flex; align-items: center; gap: 6px;">
          <input type="checkbox" class="save-cb" value="${k}" ${saves.includes(k) ? 'checked' : ''} />
          <span style="font-size: 11px; color: #ccd6f6; text-transform: capitalize;">${k}</span>
        </div>
      `).join('');

      const skillCheckboxes = skillKeys.map(k => `
        <div style="display: flex; align-items: center; gap: 6px;">
          <input type="checkbox" class="skill-cb" value="${k}" ${skills.includes(k) ? 'checked' : ''} />
          <span style="font-size: 11px; color: #ccd6f6; text-transform: capitalize;">${k}</span>
        </div>
      `).join('');

      new Dialog({
        title: `Configure Traits - Rank ${adv.level}`,
        content: `
          <div style="display: flex; flex-direction: column; gap: 12px; padding: 5px; min-width: 280px;">
            <div>
              <h3 style="font-family: 'Orbitron', sans-serif; font-size: 11px; color: #00e5ff; border-bottom: 1px solid rgba(0,229,255,0.15); margin-bottom: 6px; padding-bottom: 2px;">Saving Throws Proficiencies</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
                ${saveCheckboxes}
              </div>
            </div>
            <div>
              <h3 style="font-family: 'Orbitron', sans-serif; font-size: 11px; color: #00e5ff; border-bottom: 1px solid rgba(0,229,255,0.15); margin-bottom: 6px; padding-bottom: 2px;">Skill Proficiencies</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
                ${skillCheckboxes}
              </div>
            </div>
          </div>
        `,
        buttons: {
          save: {
            icon: '<i class="fas fa-save"></i>',
            label: "Save Changes",
            callback: async (dialogHtml) => {
              const html = dialogHtml.jquery ? dialogHtml : $(dialogHtml);
              const selectedSaves = [];
              html.find('.save-cb:checked').each((_, cb) => {
                selectedSaves.push($(cb).val());
              });

              const selectedSkills = [];
              html.find('.skill-cb:checked').each((_, cb) => {
                selectedSkills.push($(cb).val());
              });

              await this.item.update({
                [`system.advancements.${advId}.saves`]: selectedSaves,
                [`system.advancements.${advId}.skills`]: selectedSkills
              });
            }
          }
        }
      }, { classes: ["dialog", "warframe-dialog"] }).render(true);
    }
  }

  /** @override */
  async _updateObject(event, formData) {
    if (this.item.type === "consumable") {
      const isForma = formData["system.isForma"];
      const isSupercharger = formData["system.isSupercharger"];
      const isGear = formData["system.isGear"];

      // If one of them changed, force other checkbox fields to false in database
      if (isForma) {
        formData["system.isSupercharger"] = false;
        formData["system.isGear"] = false;
        
        const fType = formData["system.formaType"] || this.item.system.formaType || "Forma";
        formData["system.type"] = fType;
      } else if (isSupercharger) {
        formData["system.isForma"] = false;
        formData["system.isGear"] = false;
        
        const sType = formData["system.superchargerType"] || this.item.system.superchargerType || "Orokin Reactor";
        formData["system.type"] = sType;
      } else if (isGear) {
        formData["system.isForma"] = false;
        formData["system.isSupercharger"] = false;
        formData["system.type"] = "Gear";
      } else {
        // Fallback: default to gear if all are unchecked
        formData["system.isGear"] = true;
        formData["system.type"] = "Gear";
      }

      const type = formData["system.type"] || this.item.system.type;
      if (type) {
        const typeImages = {
          "Forma": "systems/warframe-ttrpg/asset/supercharger/Forma.png",
          "Omni Forma": "systems/warframe-ttrpg/asset/supercharger/AuraForma.png",
          "Umbra Forma": "systems/warframe-ttrpg/asset/supercharger/UmbraForma.png",
          "Stance Forma": "systems/warframe-ttrpg/asset/supercharger/StanceForma.png",
          "Orokin Reactor": "systems/warframe-ttrpg/asset/supercharger/OrokinReactor.png",
          "Orokin Catalyst": "systems/warframe-ttrpg/asset/supercharger/OrokinCatalyst.png",
          "Exilus Weapon Adapter": "systems/warframe-ttrpg/asset/supercharger/ExilusWeaponAdapter.png",
          "Exilus Warframe Adapter": "systems/warframe-ttrpg/asset/supercharger/ExilusWarframeAdapter.png",
          "Gear": "icons/svg/item-bag.svg"
        };
        formData["img"] = typeImages[type] || "icons/svg/item-bag.svg";
        
        const currentName = formData["name"] || this.item.name;
        const defaultNames = ["Forma", "Omni Forma", "Umbra Forma", "Stance Forma", "Orokin Reactor", "Orokin Catalyst", "Exilus Weapon Adapter", "Exilus Warframe Adapter", "Gear", "New Consumable"];
        if (currentName.startsWith("New ") || defaultNames.includes(currentName)) {
          formData["name"] = type;
        }
      }
    }
    return super._updateObject(event, formData);
  }
}

export class WarframeWeaponSheet extends WarframeItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["warframe-sheet", "item", "weapon-sheet"],
      width: 780,
      height: 620,
      resizable: true,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }],
      dragDrop: [{ dragSelector: null, dropSelector: null }]
    });
  }

  /** @override */
  get template() {
    return `systems/warframe-ttrpg/templates/item-weapon-sheet.html`;
  }

  /** @override */
  render(force = false, options = {}) {
    options.width = Math.max(options.width || 0, 780);
    options.height = Math.max(options.height || 0, 620);
    return super.render(force, options);
  }

  /**
   * Handle dropping an Item (Orokin Catalyst, Forma, or Mod) onto the weapon sheet
   * @override
   */
  async _onDrop(event) {
    if (!this.isEditable) return false;
    let data;
    try {
      data = JSON.parse(event.dataTransfer.getData("text/plain"));
    } catch (e) {
      return false;
    }
    if (!data || data.type !== "Item") return false;

    let droppedItem = null;
    try {
      droppedItem = await Item.fromDropData(data);
    } catch (e) {
      if (data.uuid) droppedItem = await fromUuid(data.uuid);
    }
    if (!droppedItem) return false;

    const itemNameLower = (droppedItem.name || "").toLowerCase();
    const itemType = droppedItem.type;
    const isCatalyst = itemNameLower.includes("orokin catalyst") || (itemType === "consumable" && droppedItem.system?.superchargerType === "Orokin Catalyst");
    const isReactor = itemNameLower.includes("orokin reactor") || (itemType === "consumable" && droppedItem.system?.superchargerType === "Orokin Reactor");
    const isStanceForma = itemNameLower.includes("stance forma") || (itemType === "consumable" && droppedItem.system?.formaType === "Stance Forma");

    // 1. Orokin Catalyst: Install onto weapon
    if (isCatalyst) {
      if (this.item.system.orokinCatalyst) {
        ui.notifications.info(`${this.item.name} already has an Orokin Catalyst installed!`);
        return false;
      }
      await this.item.update({ "system.orokinCatalyst": true });
      ui.notifications.info(`Installed Orokin Catalyst on ${this.item.name}! Weapon mod capacity doubled to 60.`);
      return true;
    }

    // 2. Orokin Reactor warning
    if (isReactor) {
      ui.notifications.warn("Orokin Reactor can only be installed on Warframes, Companions, or Vehicles. Use an Orokin Catalyst for weapons!");
      return false;
    }

    // 3. Stance Forma: Polarize stance to Universal
    if (isStanceForma) {
      if (this.item.system.type !== "melee") {
        ui.notifications.warn("Stance Forma can only be applied to Melee weapons!");
        return false;
      }
      await this.item.update({
        "system.stancePolarity": "universal",
        "system.modSlots.stance.polarity": "universal"
      });
      ui.notifications.info(`Applied Stance Forma to ${this.item.name}! Stance slot is now Universal.`);
      return true;
    }

    // 4. Mod Dropped: Slot into target or first compatible slot
    if (itemType === "mod") {
      const slotElement = event.target.closest(".mod-slot-card");
      let targetSlot = slotElement?.dataset?.slot;

      const modType = (droppedItem.system?.type || "standard").toLowerCase();
      const modCategory = (droppedItem.system?.modType || "weapon").toLowerCase();
      const weaponType = (this.item.system.type || "primary").toLowerCase();

      // If dropped onto a specific slot
      if (targetSlot) {
        if (targetSlot === "stance" && (weaponType !== "melee" || modType !== "stance")) {
          ui.notifications.warn("Only Stance mods can be equipped into the Stance slot of a Melee weapon!");
          return false;
        }
        if (targetSlot === "exilus" && modType !== "exilus") {
          ui.notifications.warn("Only Exilus utility mods can be equipped into the Exilus slot!");
          return false;
        }
        if (targetSlot.startsWith("slot") && (modType === "stance" || modType === "aura")) {
          ui.notifications.warn("Stance and Aura mods cannot be equipped into regular weapon mod slots!");
          return false;
        }
      } else {
        // Auto-detect target slot
        if (modType === "stance") {
          if (weaponType !== "melee") {
            ui.notifications.warn("Stance mods can only be equipped on Melee weapons!");
            return false;
          }
          targetSlot = "stance";
        } else if (modType === "exilus") {
          targetSlot = "exilus";
        } else {
          // Find first empty slot among slot1 to slot8
          const regularSlots = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8"];
          for (const s of regularSlots) {
            if (!this.item.system.modSlots?.[s]?.mod) {
              targetSlot = s;
              break;
            }
          }
          if (!targetSlot) {
            ui.notifications.warn(`All mod slots on ${this.item.name} are full! Unequip a mod first.`);
            return false;
          }
        }
      }

      // Check weapon type compatibility
      if (modCategory === "warframe") {
        ui.notifications.warn("Warframe mods cannot be equipped on weapons!");
        return false;
      }
      if (modCategory === "primary" && weaponType !== "primary") {
        ui.notifications.warn("This mod can only be equipped on Primary weapons!");
        return false;
      }
      if (modCategory === "secondary" && weaponType !== "secondary") {
        ui.notifications.warn("This mod can only be equipped on Secondary weapons!");
        return false;
      }
      if (modCategory === "melee" && weaponType !== "melee") {
        ui.notifications.warn("This mod can only be equipped on Melee weapons!");
        return false;
      }

      let drainVal = Number(droppedItem.system?.drain || droppedItem.drain) || 0;
      if (targetSlot === "stance" && drainVal === 0) {
        drainVal = Number(droppedItem.system?.stats?.capacity || droppedItem.stats?.capacity) || 10;
      }

      const modObj = {
        id: droppedItem.id,
        name: droppedItem.name,
        img: droppedItem.img,
        system: {
          drain: drainVal,
          polarity: droppedItem.system?.polarity || droppedItem.polarity || "none",
          rarity: droppedItem.system?.rarity || "common",
          type: droppedItem.system?.type || "standard",
          modType: droppedItem.system?.modType || "weapon",
          weaponType: droppedItem.system?.weaponType || "all",
          description: droppedItem.system?.description || "",
          stats: foundry.utils.duplicate(droppedItem.system?.stats || {})
        }
      };

      await this.item.update({
        [`system.modSlots.${targetSlot}.mod`]: modObj
      });
      ui.notifications.info(`Slotted ${droppedItem.name} into ${targetSlot.toUpperCase()} on ${this.item.name}!`);
      return true;
    }

    return super._onDrop ? super._onDrop(event) : false;
  }
}
