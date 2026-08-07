const { ArrayField, NumberField, SchemaField, StringField } = foundry.data.fields;

export default class MontageTestModel extends foundry.abstract.TypeDataModel {
/** Metadata for this JournalEntryPage subtype.
 * @type {SubtypeMetadata}
 */
  static get metadata() {
    return {
      type: "montageTest",
      icons: "fa-solid fa-dice-d10",
      embedded: {},
    };
  }

  /** @inheritdoc */
  static defineSchema() {
    return {
      details: new SchemaField({
        successLimit: new NumberField({ required: true }),
        failureLimit: new NumberField({ required: true }),
      }),
      challenges: new ArrayField(new SchemaField({
        title: new StringField({ required: true }),
      })),
    };
  }

  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["DRAW_STEEL.JournalEntryPage.montageTest"];

  /** @inheritdoc */
  async toEmbed(config, options = {}) {
    return this.parent._embedTextPage(config, options);
  }
}
