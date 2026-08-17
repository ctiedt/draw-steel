const { ArrayField, NumberField, SchemaField, StringField, HTMLField } = foundry.data.fields;

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
        successLimit: new NumberField({ required: true, initial: 5 }),
        failureLimit: new NumberField({ required: true, initial: 5 }),
        description: new HTMLField({ required: true }),
      }),
      challenges: new ArrayField(new SchemaField({
        title: new StringField({ required: true }),
        status: new StringField({ required: true }),
        suggestedCharacteristics: new ArrayField(new StringField({ required: true })),
      })),
      outcomes: new SchemaField({
        totalSuccess: new HTMLField({ required: true }),
        partialSuccess: new HTMLField({ required: true }),
        totalFailure: new HTMLField({ required: true }),
      }),
    };
  }

  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["DRAW_STEEL.JournalEntryPage.montageTest"];

  /** @inheritdoc */
  async toEmbed(config, options = {}) {
    return this.parent._embedTextPage(config, options);
  }
}
