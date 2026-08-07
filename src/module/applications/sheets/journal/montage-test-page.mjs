import { systemPath } from "../../../constants.mjs";

export default class MontageTestPage extends foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["draw-steel", "configuration"],
  };

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [
        { id: "details" },
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
      case "details":
      case "challenges":
        context[partId] = { fields: this.document.system.schema.getField(partId).fields };
        console.log(context);
        break;
    }

    return context;
  }
}
