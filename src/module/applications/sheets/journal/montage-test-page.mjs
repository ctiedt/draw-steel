import { systemPath } from "../../../constants.mjs";
import { DrawSteelChatMessage } from "../../../documents/_module.mjs";

export default class MontageTestPage extends foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["draw-steel", "montageTest"],
    actions: {
      addChallenge: this.#addChallenge,
      removeChallenge: this.#removeChallenge,
      roll: this.#roll,
      showOutcome: this.#showOutcome,
    },
  };

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        { id: "details" },
        { id: "outcomes" },
        { id: "challenges" },
      ],
      initial: "details",
      labelPrefix: "DRAW_STEEL.JournalEntryPage.Tabs",
    },
  };

  /** @inheritdoc */
  static EDIT_PARTS = {
    header: super.EDIT_PARTS.header,
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    details: {
      template: systemPath("templates/sheets/journal/pages/montage-test/details.hbs"),
      scrollable: [".scrollable"],
    },
    outcomes: {
      template: systemPath("templates/sheets/journal/pages/montage-test/outcomes.hbs"),
      scrollabel: [".scrollable"],
    },
    challenges: {
      template: systemPath("templates/sheets/journal/pages/montage-test/challenges.hbs"),
      scrollable: [".scrollable"],
    },
    footer: super.EDIT_PARTS.footer,
  };

  /** @inheritdoc */
  static VIEW_PARTS = {
    content: {
      template: systemPath("templates/sheets/journal/pages/montage-test/content.hbs"),
      root: true,
    },
  };

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.systemFields = this.page.system.schema.fields;
    context.system = this.page.system;
    return context;
  }

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);

    switch (partId) {
      case "content":
        console.log(context);
        break;
      case "details":
        context[partId] = { fields: this.document.system.schema.getField(partId).fields };
        break;
      case "challenges":
        context[partId] = this.document.system[partId].map((values, index) => {
          const fields = this.document.system.schema.getField(partId).element.fields;
          console.log(this.document.system.schema.getField(partId).element);
          const entry = { fields, values };
          entry.names = Object.keys(values).reduce((names, key) => {
            names[key] = `system.${partId}.${index}.${key}`;
            return names;
          }, {});
          entry.statusOptions = {
            notAttempted: _loc("DRAW_STEEL.JournalEntryPage.montageTest.status.notAttempted"),
            succeeded: _loc("DRAW_STEEL.JournalEntryPage.montageTest.status.succeeded"),
            failed: _loc("DRAW_STEEL.JournalEntryPage.montageTest.status.failed"),
          };
          //entry.charOptions = {
          //  might: "DRAW_STEEL.Actor.characteristics.might.full",
          //  agility: "DRAW_STEEL.Actor.characteristics.agility.full",
          //  reason: "DRAW_STEEL.Actor.characteristics.reason.full",
          //  intuition: "DRAW_STEEL.Actor.characteristics.intuition.full",
          //  presence: "DRAW_STEEL.Actor.characteristics.presence.full",
          //};
          entry.charOptions = ds.CONFIG.characteristics;

          return entry;
        });
        break;
    }
    console.log(partId, context);

    return context;
  }

  /** Add a challenge to this montage test.
   * @this MontageTestPage
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #addChallenge(event, target) {
    const { path } = target.dataset;
    const newEntry = { title: "", status: "notAttempted", suggestedCharacteristics: [] };

    return this.document.update({ [`system.${path}`]: this.document.system[path].concat(newEntry) });
  }

  /**
   * Remove a challenge from this montage test.
   *
   * @this MontageTestPage
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #removeChallenge(event, target) {
    const { path, index } = target.dataset;
    console.log(target);

    const updatedArray = this.document.system[path].splice(index, 1);

    return this.document.update({ [`system.${path}`]: updatedArray });
  }

  /**
   * Make a test for this challenge using currently selected tokens.
   *
   * @this MontageTestPage
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #roll(event, target) {
    let { characteristic, index } = target.dataset;
    console.log(target.dataset);
    for (const token of canvas.tokens.placeables) {
      console.log(token);
      if (token.controlled) {
        let roll = await token.actor.rollCharacteristic(characteristic);
        if (roll !== undefined) {
          let tier = roll.rolls[0].tier;
          let result;
          switch (tier) {
            case "tier1":
              result = "failed";
              break;
            case "tier2":
            case "tier3":
              result = "succeeded";
              break;
          }
          this.document.system.challenges[parseInt(index)].status = result;
          this.render();
        }
      }
    }
  }

  /**
   * Show an outcome as a chat message.
   *
   * @this MontageTestPage
   * @param {PointerEvent} event   The originating click event.
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action].
   */
  static async #showOutcome(event, target) {
    let { outcome } = target.dataset;
    if (outcome === "totalSuccess") {
      await DrawSteelChatMessage.create({ title: "Total Success", content: this.document.system.outcomes.totalSuccess });
    }
    else if (outcome === "partialSuccess") {
      await DrawSteelChatMessage.create({ title: "Partial Success", content: this.document.system.outcomes.partialSuccess });
    }
    else if (outcome === "totalFailure") {
      await DrawSteelChatMessage.create({ title: "Total Failure", content: this.document.system.outcomes.totalFailure });
    }
  }
}
