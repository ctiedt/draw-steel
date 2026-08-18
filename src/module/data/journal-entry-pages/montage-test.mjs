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

  /** Number of successes. */
  successes() {
    return this.challenges.filter((ch) => ch.status === "succeeded").length;
  }

  /** Number of failures. */
  failures() {
    return this.challenges.filter((ch) => ch.status === "failed").length;
  }

  /** Outcome, based on number of succeeded and failed challenges. */
  outcome() {
    const successes = this.successes();
    const failures = this.failures();
    if ((successes >= this.details.successLimit) && (failures < this.details.failureLimit)) {
      return "totalSuccess";
    } else if ((successes - failures) >= 2) {
      return "partialSuccess";
    } else {
      return "totalFailure";
    }
  }

  /** @inheritdoc */
  async toEmbed(config, options = {}) {
    return this.parent._embedTextPage(config, options);
  }
}
