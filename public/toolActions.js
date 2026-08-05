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

  const COPY_SELECTOR = [
    "[data-copy]",
    "[data-copy-editor]",
    "[data-copy-output]",
    "[data-copy-random]",
  ].join(",");

  const CLEAR_SELECTOR = [
    "[data-clear]",
    "[data-clear-random]",
    "[data-clear-converter]",
  ].join(",");

  const DOWNLOAD_SELECTOR = [
    "[data-download]",
    "[data-download-output]",
    "[data-download-random]",
  ].join(",");

  const OUTPUT_SELECTOR = [
    "[data-output]",
    "[data-result]",
    "[data-preview-output]",
    "[data-convert-output]",
    "[data-random-output]",
  ].join(",");

  const feedbackTimers = new WeakMap();

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
    "hover:border-brand-400/40",
    "hover:bg-brand-500/10",
    "hover:text-white",
    "active:scale-95",
    "disabled:cursor-not-allowed",
    "disabled:opacity-40",
  ];

  const isFormControl = (element) =>
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement;

  const isTextControl = (element) => {
    if (element instanceof HTMLTextAreaElement) return true;

    if (!(element instanceof HTMLInputElement)) return false;

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
    ].includes(element.type);
  };

  const isVisible = (element) => {
    if (!(element instanceof HTMLElement)) return false;

    return (
      !element.hidden &&
      element.getAttribute("type") !== "hidden" &&
      getComputedStyle(element).display !== "none"
    );
  };

  const createButton = (action, label) => {
    const button = document.createElement("button");

    button.type = "button";
    button.dataset[action] = "";
    button.dataset.originalLabel = label;
    button.textContent = label;
    button.disabled = true;
    button.classList.add(...buttonClasses);

    return button;
  };

  const showFeedback = (button, label) => {
    const original =
      button.dataset.originalLabel ||
      button.textContent?.trim() ||
      "";

    button.dataset.originalLabel = original;
    button.textContent = label;

    button.classList.add(
      "border-brand-400/60",
      "bg-brand-500/20",
      "text-brand-100",
      "scale-[0.97]",
    );

    const previousTimer = feedbackTimers.get(button);
    if (previousTimer) window.clearTimeout(previousTimer);

    const timer = window.setTimeout(() => {
      button.textContent = original;

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

  const snapshot = (control) => {
    if (
      control instanceof HTMLInputElement &&
      (control.type === "checkbox" || control.type === "radio")
    ) {
      return {
        kind: "checked",
        value: control.checked,
      };
    }

    return {
      kind: "value",
      value: control.value,
    };
  };

  const differsFromSnapshot = (control, state) => {
    if (
      state.kind === "checked" &&
      control instanceof HTMLInputElement
    ) {
      return control.checked !== state.value;
    }

    return control.value !== state.value;
  };

  const restoreSnapshot = (control, state) => {
    if (
      state.kind === "checked" &&
      control instanceof HTMLInputElement
    ) {
      control.checked = state.value;
      return;
    }

    control.value = state.value;
  };

  const dispatchUpdates = (control) => {
    control.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );

    control.dispatchEvent(
      new Event("change", {
        bubbles: true,
      }),
    );
  };

  const findVisibleOutput = (root) =>
    Array.from(root.querySelectorAll(OUTPUT_SELECTOR)).find(
      (element) =>
        isFormControl(element) &&
        isVisible(element),
    ) || null;

  const getSourceControl = (root, button, datasetKey) => {
    const selector =
      button.dataset[datasetKey] ||
      button.dataset.actionSource ||
      "";

    if (selector) {
      const source = root.querySelector(selector);

      if (isFormControl(source)) return source;
    }

    const fallback = root.querySelector(OUTPUT_SELECTOR);

    return isFormControl(fallback) ? fallback : null;
  };

  const removeDirectLabelText = (label) => {
    const textNode = Array.from(label.childNodes).find(
      (node) =>
        node.nodeType === Node.TEXT_NODE &&
        node.textContent?.trim(),
    );

    const labelText = textNode?.textContent?.trim() || "Result";

    textNode?.remove();

    return labelText;
  };

  const createActionGroup = () => {
    const group = document.createElement("div");

    group.dataset.toolActionGroup = "";
    group.className =
      "flex flex-wrap items-center justify-end gap-2";

    return group;
  };

  const placeActionsBesideResult = (
    output,
    buttons,
  ) => {
    const existingHeader =
      output.previousElementSibling instanceof HTMLElement &&
      (
        output.previousElementSibling.querySelector("label") ||
        output.previousElementSibling.textContent
          ?.trim()
          .toLowerCase() === "result"
      )
        ? output.previousElementSibling
        : null;

    if (existingHeader) {
      existingHeader.classList.add(
        "flex",
        "min-h-11",
        "items-center",
        "justify-between",
        "gap-3",
      );

      const oldGeneratedGroup =
        existingHeader.querySelector("[data-tool-action-group]");

      oldGeneratedGroup?.remove();

      const group = createActionGroup();
      group.append(...buttons);
      existingHeader.append(group);

      return true;
    }

    const label = output.closest("label");

    if (label instanceof HTMLLabelElement) {
      const labelText = removeDirectLabelText(label);
      const header = document.createElement("div");
      const title = document.createElement("span");
      const group = createActionGroup();

      header.dataset.toolResultHeader = "";
      header.className =
        "flex min-h-11 items-center justify-between gap-3";

      title.className =
        "text-sm font-semibold text-zinc-200";
      title.textContent = labelText;

      group.append(...buttons);
      header.append(title, group);
      label.prepend(header);

      return true;
    }

    return false;
  };

  const placeActionsTopRight = (root, buttons) => {
    const existingContainer =
      buttons
        .map((button) => button.parentElement)
        .find(Boolean) || null;

    if (existingContainer) {
      existingContainer.classList.add(
        "flex",
        "flex-wrap",
        "items-center",
        "justify-end",
        "gap-2",
      );

      existingContainer.append(...buttons);
      return;
    }

    const toolbar = document.createElement("div");

    toolbar.dataset.toolActionsGenerated = "";
    toolbar.className =
      "mb-3 flex flex-wrap items-center justify-end gap-2";

    toolbar.append(...buttons);
    root.prepend(toolbar);
  };

  const setupRoot = (root) => {
    if (root.dataset.toolActionsReady === "true") return;
    root.dataset.toolActionsReady = "true";

    const mode = root.dataset.mode || "";

    if (mode === "case-converter") {
      const duplicateStatus =
        root.querySelector("[data-status]");

      duplicateStatus?.classList.add("hidden");
    }

    const controls = Array.from(
      root.querySelectorAll(
        "input, textarea, select",
      ),
    ).filter(isFormControl);

    const defaults = new Map(
      controls.map((control) => [
        control,
        snapshot(control),
      ]),
    );

    let copyButtons = Array.from(
      root.querySelectorAll(COPY_SELECTOR),
    ).filter(
      (button) =>
        button instanceof HTMLButtonElement,
    );

    let clearButtons = Array.from(
      root.querySelectorAll(CLEAR_SELECTOR),
    ).filter(
      (button) =>
        button instanceof HTMLButtonElement,
    );

    const downloadButtons = Array.from(
      root.querySelectorAll(DOWNLOAD_SELECTOR),
    ).filter(
      (button) =>
        button instanceof HTMLButtonElement,
    );

    downloadButtons.forEach((button) => {
      button.dataset.originalLabel =
        button.textContent?.trim() || "Download";
      button.classList.add(...buttonClasses);
    });

    copyButtons.forEach((button) => {
      button.dataset.originalLabel = "Copy";
      button.textContent = "Copy";
      button.classList.add(...buttonClasses);
    });

    if (clearButtons.length === 0) {
      clearButtons = [
        createButton("universalClear", "Clear"),
      ];
    } else {
      clearButtons.forEach((button) => {
        button.dataset.originalLabel = "Clear";
        button.textContent = "Clear";
        button.classList.add(...buttonClasses);
      });
    }

    const hasConfiguration = controls.some(
      (control) =>
        control instanceof HTMLSelectElement ||
        (
          control instanceof HTMLInputElement &&
          [
            "checkbox",
            "radio",
            "range",
            "color",
          ].includes(control.type)
        ),
    );

    let resetButton =
      root.querySelector("[data-universal-reset]");

    if (
      hasConfiguration &&
      !(resetButton instanceof HTMLButtonElement)
    ) {
      resetButton = createButton(
        "universalReset",
        "Reset",
      );
    }

    const actionButtons = [
      ...copyButtons,
      ...downloadButtons,
      ...clearButtons,
      ...(resetButton instanceof HTMLButtonElement
        ? [resetButton]
        : []),
    ];

    const output = findVisibleOutput(root);

    const isTwoPane =
      output !== null &&
      root.querySelector("[data-input]") !== null;

    const placedBesideResult =
      isTwoPane &&
      placeActionsBesideResult(
        output,
        actionButtons,
      );

    if (!placedBesideResult) {
      placeActionsTopRight(root, actionButtons);
    }

    const getCopyValue = (button) => {
      if (button.matches("[data-copy-editor]")) {
        const editor =
          root.querySelector("[data-input]");

        return isFormControl(editor)
          ? editor.value
          : "";
      }

      const outputControl =
        getSourceControl(
          root,
          button,
          "actionSource",
        );

      if (
        isFormControl(outputControl) &&
        outputControl.value.trim()
      ) {
        return outputControl.value;
      }

      if (
        mode === "word-counter" ||
        mode === "character-counter"
      ) {
        const input =
          root.querySelector("[data-input]");

        return isFormControl(input)
          ? input.value
          : "";
      }

      return "";
    };

    const clearableControls = controls.filter(
      (control) =>
        isTextControl(control) &&
        (
          !(
            control instanceof HTMLInputElement ||
            control instanceof HTMLTextAreaElement
          ) ||
          !control.disabled
        ),
    );

    const hasClearableData = () =>
      clearableControls.some(
        (control) => control.value.length > 0,
      );

    const hasChangedState = () =>
      controls.some((control) => {
        const state = defaults.get(control);

        return state
          ? differsFromSnapshot(control, state)
          : false;
      });

    const updateButtons = () => {
      copyButtons.forEach((button) => {
        button.disabled =
          getCopyValue(button).trim().length === 0;
      });

      downloadButtons.forEach((button) => {
        const source = getSourceControl(
          root,
          button,
          "downloadSource",
        );

        button.disabled =
          !source ||
          source.value.trim().length === 0;
      });

      clearButtons.forEach((button) => {
        const sourceSelector =
          button.dataset.clearSource || "";

        if (sourceSelector) {
          const source =
            root.querySelector(sourceSelector);

          button.disabled =
            !isFormControl(source) ||
            source.value.length === 0;
        } else {
          button.disabled = !hasClearableData();
        }
      });

      if (resetButton instanceof HTMLButtonElement) {
        resetButton.disabled = !hasChangedState();
      }
    };

    const scheduleUpdate = () => {
      window.setTimeout(updateButtons, 0);
      window.setTimeout(updateButtons, 220);
      window.setTimeout(updateButtons, 400);
    };

    clearButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const sourceSelector =
          button.dataset.clearSource || "";

        if (sourceSelector) {
          const source =
            root.querySelector(sourceSelector);

          if (isFormControl(source)) {
            source.value = "";
            dispatchUpdates(source);
          }
        } else if (
          button.matches("[data-universal-clear]")
        ) {
          clearableControls.forEach((control) => {
            control.value = "";
            dispatchUpdates(control);
          });
        }
      });

      button.addEventListener("click", () => {
        window.setTimeout(() => {
          showFeedback(button, "Cleared");
          updateButtons();
        }, 0);
      });
    });

    downloadButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const source = getSourceControl(
          root,
          button,
          "downloadSource",
        );

        if (
          !source ||
          source.value.length === 0
        ) {
          return;
        }

        const filename =
          button.dataset.downloadFilename ||
          "download.txt";

        const mime =
          button.dataset.downloadMime ||
          "text/plain;charset=utf-8";

        const url = URL.createObjectURL(
          new Blob([source.value], {
            type: mime,
          }),
        );

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
        showFeedback(button, "Downloaded!");
        scheduleUpdate();
      });
    });

    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (!button.disabled) {
          window.setTimeout(() => {
            showFeedback(button, "Copied!");
          }, 0);
        }
      });
    });

    if (resetButton instanceof HTMLButtonElement) {
      resetButton.addEventListener("click", () => {
        controls.forEach((control) => {
          const state = defaults.get(control);
          if (!state) return;

          restoreSnapshot(control, state);
          dispatchUpdates(control);
        });

        root.dispatchEvent(
          new CustomEvent("toolsiva:reset", {
            bubbles: true,
          }),
        );

        showFeedback(resetButton, "Reset!");
        scheduleUpdate();
      });
    }

    controls.forEach((control) => {
      control.addEventListener(
        "input",
        scheduleUpdate,
      );

      control.addEventListener(
        "change",
        scheduleUpdate,
      );
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
  document.addEventListener(
    "astro:page-load",
    setup,
  );
})();
