/**
 * Register all handlebars in Draw Steel.
 */
export function registerHandlebars() {
  Handlebars.registerHelper({
    "ds-tooltip": CONFIG.ux.TooltipManager.handlebarsHelper,
    "ds-test-status": function (value) { if (value === "succeeded") { return "☑️"; } else if (value === "failed") { return "❌"; } else { return ""; }},
  });
}
