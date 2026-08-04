(() => {
  const ROOT_SELECTOR = [
    "[data-text-tool]",
    "[data-new-text-tool]",
    "[data-developer-tool]",
    "[data-content-tools]",
    "[data-expansion-tool]",
    "[data-security-tool]",
    "[data-converter]",
    "[data-high-value-tool]",
    "[data-qr-workspace]",
    "[data-calculator]",
    "[data-word-counter]",
  ].join(",");

  const CLEAR_SELECTORS = [
    "[data-clear]",
    "[data-clear-random]",
    "[data-clear-converter]",
  ].join(",");

  const feedbackTimers = new WeakMap();

  const isEditableTextControl = (control) => {
    if (control instanceof HTMLTextAreaElement) {
      return !control.readOnly && !control.disabled;
    }

    if (!(control instanceof HTMLInputElement)) return false;
    if (control.disabled || control.readOnly) return false;

    return [
      "text",
      "search",
      "email",
      "url",
      "tel",
      "password",
      "number",
      "date",
      "datetime-local",
      "time",
      "month",
      "week",
    ].includes(control.type);
  };

  const isOutputControl = (control) =>
    control instanceof HTMLTextAreaElement &&
    (control.readOnly ||
      control.matches("[data-output], [data-result], [data-preview-output]"));

  const getControls = (root) =>
    Array.from(
      root.querySelectorAll("input, textarea, select"),
    ).filter((control) => !control.closest("[data-tool-actions-generated]"));

  const snapshotControl = (control) => {
    if (control instanceof HTMLInputElement) {
      if (control.type === "checkbox" || control.type === "radio") {
        return {
          type: "checked",
          checked: control.checked,
        };
      }

      return {
        type: "value",
        value: control.value,
      };
    }

    if (
      control instanceof HTMLTextAreaElement ||
      control instanceof HTMLSelectElement
    ) {
      return {
        type: "value",
        value: control.value,
      };
    }

    return { type: "value", value: "" };
  };

  const restoreControl = (control, state) => {
    if (
      state.type === "checked" &&
      control instanceof HTMLInputElement
    ) {
      control.checked = state.checked;
      return;
    }

    if (
      state.type === "value" &&
      (
        control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement
      )
    ) {
      control.value = state.value;
    }
  };

  const controlChanged = (control, state) => {
    if (
      state.type === "checked" &&
      control instanceof HTMLInputElement
    ) {
      return control.checked !== state.checked;
    }

    if (
      state.type === "value" &&
      (
        control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement
      )
    ) {
      return control.value !== state.value;
    }

    return false;
  };

  const dispatchUpdates = (control) => {
    control.dispatchEvent(new Event("input", { bubbles: true }));
    control.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const showButtonFeedback = (button, temporaryLabel) => {
    const originalLabel =
      button.dataset.originalLabel ||
      button.textContent?.trim() ||
      "";

    button.dataset.originalLabel = originalLabel;
    button.textContent = temporaryLabel;

    button.classList.add(
      "border-brand-400/60",
      "bg-brand-500/20",
      "text-brand-100",
      "scale-[0.97]",
    );

    const oldTimer = feedbackTimers.get(button);
    if (oldTimer) window.clearTimeout(oldTimer);

    const timer = window.setTimeout(() => {
      button.textContent = originalLabel;

      button.classList.remove(
        "border-brand-400/60",
        "bg-brand-500/20",
        "text-brand-100",
        "scale-[0.97]",
      );

      feedbackTimers.delete(button);
    }, 1000);

    feedbackTimers.set(button, timer);
  };

  const buttonClasses = [
    "focus-ring",
    "min-w-20",
    "cursor-pointer",
    "rounded-xl",
    "border",
    "border-white/10",
    "px-4",
    "py-2",
    "text-sm",
    "font-medium",
    "text-zinc-300",
    "transition",
    "duration-150",
    "hover:border-red-400/40",
    "hover:bg-red-500/10",
    "hover:text-red-200",
    "active:scale-95",
    "disabled:cursor-not-allowed",
    "disabled:opacity-40",
  ];

  const createButton = (action, label) => {
    const button = document.createElement("button");

    button.type = "button";
    button.dataset[action] = "";
    button.textContent = label;
    button.disabled = true;
    button.classList.add(...buttonClasses);

    return button;
  };

  const createToolbar = (root) => {
    const clearButton = createButton("universalClear", "Clear");

    const preferredAnchor =
      root.querySelector("[data-copy-editor]") ||
      root.querySelector("[data-copy]") ||
      root.querySelector("[data-download-output]") ||
      root.querySelector("[data-convert]");

    const existingActionContainer =
      preferredAnchor?.parentElement || null;

    if (existingActionContainer && preferredAnchor) {
      const actionGroup = document.createElement("div");

      actionGroup.dataset.toolActionsGenerated = "";
      actionGroup.className =
        "flex flex-wrap items-center justify-end gap-2";

      preferredAnchor.before(actionGroup);
      actionGroup.append(preferredAnchor, clearButton);

      return {
        toolbar: actionGroup,
        clearButton,
      };
    }

    const toolbar = document.createElement("div");

    toolbar.dataset.toolActionsGenerated = "";
    toolbar.className =
      "mb-3 flex flex-wrap items-center justify-end gap-2";

    toolbar.append(clearButton);
    root.prepend(toolbar);

    return {
      toolbar,
      clearButton,
    };
  };

  const hasMeaningfulConfiguration = (controls) =>
    controls.some((control) => {
      if (control instanceof HTMLSelectElement) return true;

      if (!(control instanceof HTMLInputElement)) return false;

      return [
        "checkbox",
        "radio",
        "range",
        "color",
      ].includes(control.type);
    });

  const setupRoot = (root) => {
    if (root.dataset.toolActionsReady === "true") return;
    root.dataset.toolActionsReady = "true";

    const controls = getControls(root);
    const defaults = new Map(
      controls.map((control) => [
        control,
        snapshotControl(control),
      ]),
    );

    let clearButtons = Array.from(
      root.querySelectorAll(CLEAR_SELECTORS),
    );

    let toolbar = null;

    if (clearButtons.length === 0) {
      const generated = createToolbar(root);
      toolbar = generated.toolbar;
      clearButtons = [generated.clearButton];
    }

    const primaryClear = clearButtons[0] || null;
    const actionContainer =
      primaryClear?.parentElement ||
      toolbar;

    const copyButtons = Array.from(
      root.querySelectorAll(
        "[data-copy], [data-copy-editor], [data-copy-output], [data-copy-random]",
      ),
    ).filter((button) => button instanceof HTMLButtonElement);

    copyButtons.forEach((button) => {
      button.dataset.originalLabel = "Copy";
      button.textContent = "Copy";

      button.classList.add(
        "transition",
        "duration-150",
        "active:scale-95",
        "disabled:cursor-not-allowed",
        "disabled:opacity-40",
      );
    });

    const needsReset =
      hasMeaningfulConfiguration(controls) ||
      controls.filter((control) => !isOutputControl(control)).length > 2;

    let resetButton = root.querySelector("[data-universal-reset]");

    if (needsReset && !resetButton && actionContainer) {
      resetButton = createButton("universalReset", "Reset");
      actionContainer.append(resetButton);
    }

    const getClearableControls = () =>
      controls.filter(
        (control) =>
          isEditableTextControl(control) ||
          isOutputControl(control),
      );

    const hasClearableData = () =>
      getClearableControls().some((control) => {
        if (
          control instanceof HTMLInputElement ||
          control instanceof HTMLTextAreaElement
        ) {
          return control.value.length > 0;
        }

        return false;
      });

    const hasChangedState = () =>
      controls.some((control) => {
        const state = defaults.get(control);
        return state ? controlChanged(control, state) : false;
      });

    const getCopyValue = (button) => {
      if (button.matches("[data-copy-editor]")) {
        const editor = root.querySelector(
          "[data-input]",
        );

        if (
          editor instanceof HTMLInputElement ||
          editor instanceof HTMLTextAreaElement
        ) {
          return editor.value;
        }
      }

      const output = root.querySelector(
        "[data-output], [data-result], [data-preview-output]",
      );

      if (
        output instanceof HTMLInputElement ||
        output instanceof HTMLTextAreaElement
      ) {
        return output.value;
      }

      if (
        root.dataset.mode === "word-counter" ||
        root.dataset.mode === "character-counter"
      ) {
        const input = root.querySelector("[data-input]");

        if (
          input instanceof HTMLInputElement ||
          input instanceof HTMLTextAreaElement
        ) {
          return input.value;
        }
      }

      return "";
    };

    const updateButtons = () => {
      const canClear = hasClearableData();

      clearButtons.forEach((button) => {
        button.disabled = !canClear;
        button.classList.add(
          "transition",
          "duration-150",
          "active:scale-95",
          "disabled:cursor-not-allowed",
          "disabled:opacity-40",
        );
      });

      copyButtons.forEach((button) => {
        button.disabled = getCopyValue(button).trim().length === 0;
      });

      if (resetButton instanceof HTMLButtonElement) {
        resetButton.disabled = !hasChangedState();
      }
    };

    const scheduleUpdate = () => {
      window.setTimeout(updateButtons, 0);

      // Một số tool như JSON Formatter dùng debounce.
      window.setTimeout(updateButtons, 250);
    };

    const genericClear = () => {
      getClearableControls().forEach((control) => {
        if (
          control instanceof HTMLInputElement ||
          control instanceof HTMLTextAreaElement
        ) {
          control.value = "";
          dispatchUpdates(control);
        }
      });
    };

    clearButtons.forEach((button) => {
      if (button.matches("[data-universal-clear]")) {
        button.addEventListener("click", genericClear);
      }

      button.addEventListener("click", () => {
        window.setTimeout(() => {
          showButtonFeedback(button, "Cleared");
          updateButtons();
        }, 0);
      });
    });

    if (resetButton instanceof HTMLButtonElement) {
      resetButton.addEventListener("click", () => {
        controls.forEach((control) => {
          const state = defaults.get(control);
          if (!state) return;

          restoreControl(control, state);
          dispatchUpdates(control);
        });

        root.dispatchEvent(
          new CustomEvent("toolsiva:reset", {
            bubbles: true,
          }),
        );

        showButtonFeedback(resetButton, "Reset!");
        window.setTimeout(updateButtons, 0);
      });
    }

    controls.forEach((control) => {
      control.addEventListener("input", scheduleUpdate);
      control.addEventListener("change", scheduleUpdate);
    });

    root.addEventListener("click", scheduleUpdate);

    updateButtons();
  };

  const setup = () => {
    document
      .querySelectorAll(ROOT_SELECTOR)
      .forEach(setupRoot);
  };

  setup();

  document.addEventListener("astro:page-load", setup);
})();
