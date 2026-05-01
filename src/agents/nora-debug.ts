// NORA debug toggle — see NORA/19-function-calls-natifs/10-plan-phase-6-finalisation.md
//
// All NORA-specific diagnostic traces go through `noraDiag()`. The function
// is a no-op unless the `NORA_DEBUG` environment variable is set to "1",
// "true", "yes" or "on" at process start.
//
// Activation:
//   sudo systemctl --user edit openclaw-gateway
//   # add: Environment="NORA_DEBUG=1"
//   systemctl --user restart openclaw-gateway
//
// Deactivation: drop the env var and restart. No rebuild required.
//
// Lazy `() => string` form is preferred for non-trivial payloads — the
// closure isn't evaluated when the toggle is off, so production runtime
// cost is zero.

import { logInfo } from "../logger.js";

const NORA_DEBUG_FLAG: boolean =
  process.env.NORA_DEBUG === "1" ||
  process.env.NORA_DEBUG === "true" ||
  process.env.NORA_DEBUG === "yes" ||
  process.env.NORA_DEBUG === "on";

export function isNoraDebugEnabled(): boolean {
  return NORA_DEBUG_FLAG;
}

export function noraDiag(scope: string, message: string | (() => string)): void {
  if (!NORA_DEBUG_FLAG) return;
  let text: string;
  try {
    text = typeof message === "function" ? message() : message;
  } catch (err) {
    text = `<noraDiag formatter threw: ${err instanceof Error ? err.message : String(err)}>`;
  }
  logInfo(`[NORA-DIAG][${scope}] ${text}`);
}
