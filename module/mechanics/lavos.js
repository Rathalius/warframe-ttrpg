/**
 * Warframe TTRPG - Lavos Mechanics Module
 * Canonical implementation of Lavos abilities (Alchemy & Elemental Infusion)
 */

export async function handleLavosAbility(baseName, actor, ability, context) {
  const powerStrength = Number(actor.system.powerStrength?.value) || 100;
  const powerDuration = Number(actor.system.powerDuration?.value) || 100;
  const strMult = powerStrength / 100;
  const durMult = powerDuration / 100;
  const targets = Array.from(game.user.targets);

  // 1. Ophidian Bite
  if (baseName === "ophidian bite") {
    const healPct = Math.round(15 * strMult);
    const maxHP = Number(actor.system.health?.max) || 100;
    const curHP = Number(actor.system.health?.value) || 100;
    const hitCount = Math.max(1, targets.length);
    const totalHeal = Math.min(maxHP - curHP, Math.round(maxHP * (healPct / 100) * hitCount));

    if (totalHeal > 0) {
      await actor.update({ "system.health.value": curHP + totalHeal });
    }

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Ophidian Toxin (Poisoned & Staggered)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/lavos/OphidianBite.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["poisoned"],
          description: "Struck by the twin serpents: takes Toxin DoT bypassing shields and is staggered.",
          flags: { core: { statusId: "ophidian_bite_toxin" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(46, 125, 50, 0.08); border: 1px solid #2e7d32; border-radius: 4px; font-size: 10.5px; color: #c8e6c9;">
        <i class="fas fa-staff-snake"></i> <strong>Ophidian Bite Strikes:</strong> Twin serpents lunge forward! Restores <strong>+${totalHeal} HP</strong> (${healPct}% per hit enemy) to Lavos and reduces cooldowns by 1 round!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 2. Vial Rush
  if (baseName === "vial rush") {
    const durationRounds = Math.max(1, Math.round(3 * durMult));

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Vial Rush (Cryo Frosted / 75% Slow)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/lavos/VialRush.png",
          origin: actor.uuid,
          duration: { rounds: durationRounds },
          changes: [
            { key: "system.speed.land.value", value: -15, mode: 2, priority: 20 }
          ],
          description: "Coated in frozen transmutation liquid: Movement speed reduced by 75% and afflicted with Cold procs.",
          flags: { core: { statusId: "vial_rush_frost" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(2, 136, 209, 0.08); border: 1px solid #0288d1; border-radius: 4px; font-size: 10.5px; color: #b3e5fc;">
        <i class="fas fa-flask"></i> <strong>Vial Rush Slide:</strong> Lavos dashes forward shedding vials of liquid nitrogen! Leaves an icy trail slowing foes by <strong>75%</strong> and shattering frozen enemies!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 3. Transmutation Probe
  if (baseName === "transmutation probe") {
    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Transmutation Probe (Electrocuted & Siphoned)",
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/lavos/TransmutationProbe.png",
          origin: actor.uuid,
          duration: { rounds: 2 },
          statuses: ["shocked"],
          description: "Zapped by Mephitic Probe: Stunned by Electricity. Each enemy hit reduces Lavos's active cooldowns by 1.5 rounds!",
          flags: { core: { statusId: "transmutation_probe" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(0, 150, 136, 0.08); border: 1px solid #009688; border-radius: 4px; font-size: 10.5px; color: #b2dfdb;">
        <i class="fas fa-satellite"></i> <strong>Transmutation Probe Launched:</strong> Autonomous drone electrifies enemies and transmutes all pickups into <strong>Universal Orbs & Universal Ammo</strong>! Reduces Lavos cooldowns by 1.5 rounds per enemy zapped!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  // 4. Catalyze (Alchemical Infusion Modal)
  if (baseName === "catalyze") {
    const dialogContent = `
      <div style="text-align: center; margin-bottom: 12px;">
        <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">Select an Alchemical Element to infuse into the Catalyze probes:</p>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="lavos-elem-btn" data-elem="Viral" style="background: rgba(142, 36, 170, 0.2); border: 1px solid #ab47bc; color: #e1bee7; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-biohazard"></i> Viral (Cold + Toxin)
          </button>
          <button type="button" class="lavos-elem-btn" data-elem="Corrosive" style="background: rgba(46, 125, 50, 0.2); border: 1px solid #66bb6a; color: #c8e6c9; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-vial"></i> Corrosive (Elec + Toxin)
          </button>
          <button type="button" class="lavos-elem-btn" data-elem="Radiation" style="background: rgba(245, 124, 0, 0.2); border: 1px solid #ffa726; color: #ffe0b2; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-radiation"></i> Radiation (Heat + Elec)
          </button>
          <button type="button" class="lavos-elem-btn" data-elem="Gas" style="background: rgba(0, 150, 136, 0.2); border: 1px solid #26a69a; color: #b2dfdb; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
            <i class="fas fa-smog"></i> Gas (Heat + Toxin)
          </button>
        </div>
      </div>
    `;

    const chosenElem = await new Promise((resolve) => {
      let resolved = false;
      const dlg = new Dialog({
        title: "Lavos - Catalyze Alchemical Infusion",
        content: dialogContent,
        buttons: {
          default: {
            icon: '<i class="fas fa-fire"></i>',
            label: "Pure Heat (Base)",
            callback: () => { resolved = true; resolve("Heat"); }
          }
        },
        default: "default",
        render: (html) => {
          html.find(".lavos-elem-btn").click((ev) => {
            const elem = $(ev.currentTarget).data("elem");
            resolved = true;
            dlg.close();
            resolve(elem);
          });
        },
        close: () => {
          if (!resolved) resolve("Heat");
        }
      }, { classes: ["dialog", "warframe-dialog", "lavos-infusion-dialog"], width: 440 });
      dlg.render(true);
    });

    for (const t of targets) {
      if (t.actor) {
        await t.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Catalyze (${chosenElem} Procs / 2x Dmg Per Status)`,
          icon: ability.img || "systems/warframe-ttrpg/asset/classe/Power icon/lavos/Catalyze.png",
          origin: actor.uuid,
          duration: { rounds: 3 },
          description: `Infused with alchemical Catalyze (${chosenElem}). Takes double damage for each active status condition currently affecting it!`,
          flags: { core: { statusId: "catalyze_proc" } }
        }]);
      }
    }

    const cardExtraHTML = `
      <div style="margin-top: 6px; padding: 6px; background: rgba(198, 40, 40, 0.08); border: 1px solid #c62828; border-radius: 4px; font-size: 10.5px; color: #ffcdd2;">
        <i class="fas fa-burn"></i> <strong>Catalyze Eruption (${chosenElem}):</strong> 9 catalyst probes erupt in an expanding ring of transmutation! Inflicts guaranteed <strong>${chosenElem} status</strong> and deals <strong>double damage (2x) for each status effect</strong> currently on the target!
      </div>
    `;
    return { handled: true, cardExtraHTML };
  }

  return { handled: false };
}
