"use client";

import {
  CopilotKit,
  OpenGenerativeUIActivityType,
  OpenGenerativeUIContentSchema,
} from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";
import { studioCatalog } from "../a2ui/catalog";
import { STUDIO_OPEN_GEN_UI_DESIGN_SKILL } from "../lib/open-gen-ui-design-skill";
import { SaveableOpenGenUi } from "./catalog/SaveableOpenGenUi";
import { UiCatalogProvider } from "./catalog/UiCatalogProvider";
import { UiCatalogTools } from "./catalog/UiCatalogTools";
import { ShellLayoutProvider } from "./shell/ShellLayout";

const SAVEABLE_OPEN_GEN_UI = [
  {
    activityType: OpenGenerativeUIActivityType,
    content: OpenGenerativeUIContentSchema,
    render: SaveableOpenGenUi,
  },
];

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      showDevConsole={false}
      useSingleEndpoint={false}
      a2ui={{ catalog: studioCatalog }}
      openGenerativeUI={{ designSkill: STUDIO_OPEN_GEN_UI_DESIGN_SKILL }}
      renderActivityMessages={SAVEABLE_OPEN_GEN_UI}
    >
      <UiCatalogProvider>
        <ShellLayoutProvider>
          <UiCatalogTools />
          {children}
        </ShellLayoutProvider>
      </UiCatalogProvider>
    </CopilotKit>
  );
}
