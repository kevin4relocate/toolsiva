(() => {
  "use strict";

  const CONSENT_KEY = "toolsiva_analytics_consent";
  const TOOL_PATH = /^\/tools\/([^/]+)\/([^/]+)\/?$/;
  const SAFE_EVENTS = new Set(["tool_run", "tool_copy", "tool_download", "search_used"]);

  function hasAnalyticsConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) === "granted";
    } catch {
      return false;
    }
  }

  function currentTool() {
    const match = window.location.pathname.match(TOOL_PATH);
    if (!match) return null;
    return {
      tool_category: match[1],
      tool_slug: match[2],
    };
  }

  function cleanValue(value, maxLength = 80) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, maxLength);
  }

  function send(eventName, parameters = {}) {
    if (!SAFE_EVENTS.has(eventName) || !hasAnalyticsConsent()) return false;
    if (typeof window.gtag !== "function") return false;

    const safeParameters = {};
    for (const [key, value] of Object.entries(parameters)) {
      if (
        ["tool_category", "tool_slug", "action_source", "search_location"].includes(key)
      ) {
        safeParameters[key] = cleanValue(value);
      } else if (key === "result_count" && Number.isFinite(Number(value))) {
        safeParameters[key] = Math.max(0, Math.min(1000, Number(value)));
      }
    }

    window.gtag("event", eventName, safeParameters);
    return true;
  }

  function buttonLabel(element) {
    return cleanValue(
      element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        element.textContent ||
        "",
    );
  }

  function actionSource(element) {
    const dataNames = [
      "run",
      "transform",
      "generate",
      "calculate",
      "convert",
      "pick",
      "process",
      "copy",
      "download",
      "export",
    ];

    for (const name of dataNames) {
      if (element.hasAttribute(`data-${name}`)) return name;
    }
    return buttonLabel(element) || element.tagName.toLowerCase();
  }

  function isCopyAction(element) {
    const label = buttonLabel(element);
    return (
      element.matches("[data-copy], [data-copy-result], [data-copy-output]") ||
      /\bcopy\b/.test(label)
    );
  }

  function isDownloadAction(element) {
    const label = buttonLabel(element);
    return (
      element.matches(
        "[download], [data-download], [data-export], [data-download-result]",
      ) ||
      /\b(download|export|save_file)\b/.test(label)
    );
  }

  function isRunAction(element) {
    const label = buttonLabel(element);
    return (
      element.matches(
        "[data-run], [data-transform], [data-generate], [data-calculate], [data-convert], [data-pick], [data-process]",
      ) ||
      /\b(run|generate|calculate|convert|process|transform|pick_now|test_regex|format|validate|encode|decode)\b/.test(
        label,
      )
    );
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const actionable = target.closest("button, a, [role='button']");
      if (!actionable) return;

      const tool = currentTool();
      if (!tool) return;

      if (isCopyAction(actionable)) {
        send("tool_copy", {
          ...tool,
          action_source: actionSource(actionable),
        });
        return;
      }

      if (isDownloadAction(actionable)) {
        send("tool_download", {
          ...tool,
          action_source: actionSource(actionable),
        });
        return;
      }

      if (isRunAction(actionable)) {
        send("tool_run", {
          ...tool,
          action_source: actionSource(actionable),
        });
      }
    },
    { capture: true },
  );

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    const searchInput = form.querySelector(
      "input[type='search'], input[name='q'], [data-search-input]",
    );
    if (!searchInput) return;

    send("search_used", {
      search_location: cleanValue(
        form.getAttribute("data-search-location") ||
          form.getAttribute("aria-label") ||
          window.location.pathname,
      ),
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (
      !target.matches(
        "input[type='search'], input[name='q'], [data-search-input]",
      )
    ) {
      return;
    }

    send("search_used", {
      search_location: cleanValue(
        target.getAttribute("data-search-location") ||
          target.closest("form")?.getAttribute("aria-label") ||
          window.location.pathname,
      ),
    });
  });

  window.toolsivaAnalytics = Object.freeze({
    trackToolRun(actionSourceName = "custom") {
      const tool = currentTool();
      if (tool) {
        send("tool_run", {
          ...tool,
          action_source: actionSourceName,
        });
      }
    },
    trackToolCopy(actionSourceName = "custom") {
      const tool = currentTool();
      if (tool) {
        send("tool_copy", {
          ...tool,
          action_source: actionSourceName,
        });
      }
    },
    trackToolDownload(actionSourceName = "custom") {
      const tool = currentTool();
      if (tool) {
        send("tool_download", {
          ...tool,
          action_source: actionSourceName,
        });
      }
    },
    trackSearch(searchLocation = "custom") {
      send("search_used", { search_location: searchLocation });
    },
  });
})();
