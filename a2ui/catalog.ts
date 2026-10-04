import { createCatalog } from "@copilotkit/a2ui-renderer";
import { studioDefinitions } from "./definitions";
import { studioRenderers } from "./renderers";

export const studioCatalog = createCatalog(studioDefinitions, studioRenderers, {
  catalogId: "agui-studio-catalog",
  includeBasicCatalog: true,
});
