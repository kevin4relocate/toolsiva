// @ts-nocheck
(function () {
  "use strict";

  var MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
    H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
    O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
    V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
    "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.",
    "(": "-.--.", ")": "-.--.-", ":": "---...", ";": "-.-.-.", "=": "-...-",
    "+": ".-.-.", "-": "-....-", "_": "..--.-", "@": ".--.-."
  };
  var MORSE_REVERSE = {};
  Object.keys(MORSE).forEach(function (key) { MORSE_REVERSE[MORSE[key]] = key; });

  function element(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else if (key === "checked") node.checked = Boolean(attrs[key]);
      else if (key === "value") node.value = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function append(parent) {
    for (var i = 1; i < arguments.length; i += 1) {
      if (arguments[i]) parent.appendChild(arguments[i]);
    }
    return parent;
  }

  function field(labelText, control) {
    var label = element("label", "grid gap-2 text-sm text-zinc-300");
    append(label, element("span", "", { text: labelText }), control);
    return label;
  }

  function input(attrs) {
    return element("input", "focus-ring rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100", attrs || {});
  }

  function select(options, attrs) {
    var node = element("select", "focus-ring cursor-pointer rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100", attrs || {});
    options.forEach(function (option) {
      node.appendChild(element("option", "", { value: option[0], text: option[1] }));
    });
    return node;
  }

  function textarea(attrs, short) {
    return element(
      "textarea",
      "focus-ring " + (short ? "min-h-28" : "h-[clamp(16rem,36vh,23rem)] min-h-64") +
        " w-full resize-y rounded-xl border border-white/10 bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100",
      attrs || {}
    );
  }

  function pane(title, control) {
    var wrapper = element("div", "min-w-0");
    var heading = element("div", "mb-2 flex h-11 items-center");
    heading.appendChild(element("h3", "text-sm font-semibold text-zinc-200", { text: title }));
    append(wrapper, heading, control);
    return wrapper;
  }

  function value(root, selector) {
    var node = root.querySelector(selector);
    return node && "value" in node ? node.value : "";
  }

  function checked(root, selector) {
    var node = root.querySelector(selector);
    return Boolean(node && node.checked);
  }

  function setResult(root, result) {
    var output = root.querySelector("[data-output]");
    var copy = root.querySelector("[data-copy]");
    if (output) output.value = result;
    if (copy) copy.disabled = !result;
  }

  function commonGrid(area, options) {
    if (options) area.appendChild(options);
    var grid = element("div", "grid gap-4 lg:grid-cols-2");
    append(
      grid,
      pane("Input", textarea({ "data-input": "", placeholder: "Enter or paste content..." })),
      pane("Result", textarea({ "data-output": "", readonly: "", placeholder: "Result appears here..." }))
    );
    area.appendChild(grid);
  }

  function build(root, mode, state) {
    var area = root.querySelector("[data-workspace]");
    var help = root.querySelector("[data-help]");
    area.replaceChildren();

    if (mode === "regex-tester") {
      help.textContent = "JavaScript-compatible regular expression tester.";
      var top = element("div", "mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem]");
      append(
        top,
        field("Regular expression", input({ "data-regex": "", placeholder: "Example: tool+" })),
        field("Flags", input({ "data-flags": "", value: "gi", placeholder: "gim..." }))
      );
      var regexGrid = element("div", "grid gap-4 lg:grid-cols-2");
      var matches = element("div", "h-[clamp(16rem,36vh,23rem)] min-h-64 overflow-auto rounded-xl border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-300", { "data-match-list": "" });
      append(regexGrid, pane("Sample text", textarea({ "data-input": "", placeholder: "Paste sample text..." })), pane("Matches", matches));
      append(area, top, regexGrid);
      return;
    }

    if (mode === "utm-url-generator") {
      help.textContent = "Build a campaign URL with UTM parameters.";
      var utm = element("div", "grid gap-4 md:grid-cols-2");
      var urlWrap = element("div", "md:col-span-2");
      urlWrap.appendChild(field("Destination URL", input({ "data-base-url": "", type: "url", placeholder: "https://example.com/page" })));
      append(
        utm,
        urlWrap,
        field("Campaign source", input({ "data-source": "", placeholder: "newsletter" })),
        field("Campaign medium", input({ "data-medium": "", placeholder: "email" })),
        field("Campaign name", input({ "data-campaign": "", placeholder: "summer_launch" })),
        field("Campaign term (optional)", input({ "data-term": "" })),
        field("Campaign content (optional)", input({ "data-content": "" }))
      );
      var resultWrap = element("div", "mt-4");
      resultWrap.appendChild(field("Generated URL", textarea({ "data-output": "", readonly: "" }, true)));
      append(area, utm, resultWrap);
      return;
    }

    if (mode === "markdown-table-generator") {
      help.textContent = "Edit cells, alignment, rows and columns.";
      var actions = element("div", "mb-4 flex flex-wrap gap-2");
      [
        ["data-add-row", "Add row"], ["data-remove-row", "Remove row"],
        ["data-add-col", "Add column"], ["data-remove-col", "Remove column"]
      ].forEach(function (item) {
        actions.appendChild(element("button", "focus-ring rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/5", { type: "button", text: item[1], [item[0]]: "" }));
      });
      var editor = element("div", "overflow-x-auto", { "data-table-editor": "" });
      var markdown = element("div", "mt-4");
      markdown.appendChild(field("Markdown", textarea({ "data-output": "", readonly: "" }, true)));
      append(area, actions, editor, markdown);
      renderTable(root, state);
      return;
    }

    var options = element("div", "mb-4 flex flex-wrap items-end gap-3");
    var hasOptions = true;

    if (mode === "word-frequency-counter") {
      var ignore = element("label", "flex items-center gap-2 text-sm text-zinc-300");
      append(ignore, input({ "data-ignore-case": "", type: "checkbox", checked: true }), document.createTextNode("Ignore case"));
      append(options, ignore, select([["frequency", "Frequency"], ["alphabetical", "Alphabetical"]], { "data-sort-mode": "" }));
    } else if (mode === "morse-code-translator" || mode === "binary-code-translator") {
      options.appendChild(select([["encode", "Encode"], ["decode", "Decode"]], { "data-direction": "" }));
    } else if (mode === "number-sorter") {
      options.appendChild(select([["asc", "Ascending"], ["desc", "Descending"]], { "data-direction": "" }));
    } else if (mode === "remove-line-breaks") {
      append(
        options,
        select([[" ", "Space"], [", ", "Comma"], ["; ", "Semicolon"], ["custom", "Custom"]], { "data-separator-mode": "" }),
        input({ "data-custom-separator": "", placeholder: "Custom separator" })
      );
    } else if (mode === "random-choice-generator") {
      append(
        options,
        field("Number of choices", input({ "data-pick-count": "", type: "number", min: "1", value: "1" }))
      );
      var unique = element("label", "flex items-center gap-2 text-sm text-zinc-300");
      append(unique, input({ "data-unique": "", type: "checkbox", checked: true }), document.createTextNode("No repeated items"));
      append(options, unique, element("button", "focus-ring rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-500", { "data-pick": "", type: "button", text: "Pick now" }));
    } else {
      hasOptions = false;
    }

    commonGrid(area, hasOptions ? options : null);
  }

  function renderTable(root, state) {
    var host = root.querySelector("[data-table-editor]");
    if (!host) return;
    host.replaceChildren();
    var table = element("table", "min-w-full border-separate border-spacing-2");
    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    for (var column = 0; column < state.columns; column += 1) {
      var th = document.createElement("th");
      var align = select([["left", "Left"], ["center", "Center"], ["right", "Right"]], { "data-align": String(column) });
      align.value = state.alignments[column] || "left";
      th.appendChild(align);
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var row = 0; row < state.rows; row += 1) {
      var tr = document.createElement("tr");
      for (var col = 0; col < state.columns; col += 1) {
        var td = document.createElement("td");
        td.appendChild(input({ "data-cell": row + ":" + col, value: (state.data[row] && state.data[row][col]) || "" }));
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    host.appendChild(table);
  }

  function markdown(state) {
    function clean(cell) { return String(cell).replaceAll("|", "\\\\|").replaceAll("\\n", " "); }
    var first = state.data[0] || [];
    var header = "| " + first.map(clean).join(" | ") + " |";
    var divider = "| " + state.alignments.map(function (alignment) {
      return alignment === "center" ? ":---:" : alignment === "right" ? "---:" : "---";
    }).join(" | ") + " |";
    var body = state.data.slice(1).map(function (row) {
      return "| " + row.map(clean).join(" | ") + " |";
    }).join("\\n");
    return [header, divider, body].filter(Boolean).join("\\n");
  }

  function update(root, mode, state) {
    var result = "";

    if (mode === "regex-tester") {
      var list = root.querySelector("[data-match-list]");
      var copy = root.querySelector("[data-copy]");
      var pattern = value(root, "[data-regex]");
      if (!pattern) {
        list.textContent = "Enter a regular expression.";
        copy.disabled = true;
        copy.dataset.result = "";
        return;
      }
      try {
        var flags = value(root, "[data-flags]");
        if (flags.indexOf("g") < 0) flags += "g";
        var regex = new RegExp(pattern, flags);
        var found = Array.from(value(root, "[data-input]").matchAll(regex)).slice(0, 500);
        list.replaceChildren();
        var lines = [];
        found.forEach(function (match, index) {
          var row = element("div", "border-b border-white/10 py-2 last:border-0");
          row.textContent = (index + 1) + ". " + match[0] + " at index " + (match.index || 0);
          list.appendChild(row);
          lines.push(row.textContent);
        });
        if (!found.length) list.textContent = "No matches.";
        result = lines.join("\\n");
        copy.dataset.result = result;
        copy.disabled = !result;
      } catch (error) {
        list.textContent = error instanceof Error ? error.message : "Invalid regular expression";
        copy.dataset.result = "";
        copy.disabled = true;
      }
      return;
    }

    if (mode === "utm-url-generator") {
      var base = value(root, "[data-base-url]").trim();
      if (base) {
        try {
          var url = new URL(base);
          [
            ["utm_source", value(root, "[data-source]")],
            ["utm_medium", value(root, "[data-medium]")],
            ["utm_campaign", value(root, "[data-campaign]")],
            ["utm_term", value(root, "[data-term]")],
            ["utm_content", value(root, "[data-content]")]
          ].forEach(function (pair) {
            pair[1].trim() ? url.searchParams.set(pair[0], pair[1].trim()) : url.searchParams.delete(pair[0]);
          });
          result = url.toString();
        } catch (_) { result = ""; }
      }
    } else if (mode === "markdown-table-generator") {
      result = markdown(state);
    } else if (mode === "word-frequency-counter") {
      var words = value(root, "[data-input]").match(/[\p{L}\p{N}'’-]+/gu) || [];
      var counts = new Map();
      words.forEach(function (original) {
        var word = checked(root, "[data-ignore-case]") ? original.toLocaleLowerCase() : original;
        counts.set(word, (counts.get(word) || 0) + 1);
      });
      var entries = Array.from(counts.entries());
      entries.sort(value(root, "[data-sort-mode]") === "alphabetical"
        ? function (a, b) { return a[0].localeCompare(b[0]); }
        : function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); });
      result = entries.map(function (item) { return item[0] + "\\t" + item[1]; }).join("\\n");
    } else if (mode === "programming-case-converter") {
      var raw = value(root, "[data-input]").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
      var parts = raw.split(/[^\p{L}\p{N}]+/u).filter(Boolean).map(function (part) { return part.toLocaleLowerCase(); });
      function cap(word) { return word.charAt(0).toLocaleUpperCase() + word.slice(1); }
      if (parts.length) {
        result = [
          "camelCase: " + parts[0] + parts.slice(1).map(cap).join(""),
          "PascalCase: " + parts.map(cap).join(""),
          "snake_case: " + parts.join("_"),
          "kebab-case: " + parts.join("-"),
          "dot.case: " + parts.join("."),
          "CONSTANT_CASE: " + parts.join("_").toLocaleUpperCase()
        ].join("\\n");
      }
    } else if (mode === "morse-code-translator") {
      var morseInput = value(root, "[data-input]");
      if (value(root, "[data-direction]") === "encode") {
        result = morseInput.toLocaleUpperCase().split(/\s+/).map(function (word) {
          return Array.from(word).map(function (char) { return MORSE[char] || "?"; }).join(" ");
        }).join(" / ");
      } else {
        result = morseInput.trim().split(/\s*\/\s*/).map(function (word) {
          return word.split(/\s+/).map(function (code) { return MORSE_REVERSE[code] || "?"; }).join("");
        }).join(" ");
      }
    } else if (mode === "binary-code-translator") {
      var binaryInput = value(root, "[data-input]");
      try {
        if (value(root, "[data-direction]") === "encode") {
          result = Array.from(new TextEncoder().encode(binaryInput)).map(function (byte) {
            return byte.toString(2).padStart(8, "0");
          }).join(" ");
        } else {
          var bytes = binaryInput.trim().split(/[\s,]+/).filter(Boolean).map(function (byte) {
            if (!/^[01]{8}$/.test(byte)) throw new Error("Use 8-bit binary bytes.");
            return Number.parseInt(byte, 2);
          });
          result = new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
        }
      } catch (error) {
        result = "Error: " + (error instanceof Error ? error.message : "Invalid binary input");
      }
    } else if (mode === "number-sorter") {
      var numbers = value(root, "[data-input]").split(/[\s,;]+/).filter(Boolean).map(Number).filter(Number.isFinite);
      numbers.sort(value(root, "[data-direction]") === "desc"
        ? function (a, b) { return b - a; }
        : function (a, b) { return a - b; });
      result = numbers.join("\\n");
    } else if (mode === "remove-line-breaks") {
      var lines = value(root, "[data-input]").split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean);
      var selected = value(root, "[data-separator-mode]");
      result = lines.join(selected === "custom" ? value(root, "[data-custom-separator]") : selected);
    }

    setResult(root, result);
  }

  function initialState() {
    return {
      rows: 3,
      columns: 3,
      data: [
        ["Column 1", "Column 2", "Column 3"],
        ["Cell 1-1", "Cell 1-2", "Cell 1-3"],
        ["Cell 2-1", "Cell 2-2", "Cell 2-3"]
      ],
      alignments: ["left", "left", "left"]
    };
  }

  function setup(root) {
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";
    var mode = root.dataset.mode || "";
    var state = initialState();
    build(root, mode, state);

    root.addEventListener("input", function (event) {
      var target = event.target;
      if (target && target.matches && target.matches("[data-cell]")) {
        var indexes = target.dataset.cell.split(":").map(Number);
        if (state.data[indexes[0]]) state.data[indexes[0]][indexes[1]] = target.value;
      }
      update(root, mode, state);
    });

    root.addEventListener("change", function (event) {
      var target = event.target;
      if (target && target.matches && target.matches("[data-align]")) {
        state.alignments[Number(target.dataset.align)] = target.value;
      }
      update(root, mode, state);
    });

    function rerender() { renderTable(root, state); update(root, mode, state); }

    root.querySelector("[data-add-row]")?.addEventListener("click", function () {
      state.rows += 1; state.data.push(Array.from({ length: state.columns }, function () { return ""; })); rerender();
    });
    root.querySelector("[data-remove-row]")?.addEventListener("click", function () {
      if (state.rows > 2) { state.rows -= 1; state.data.pop(); rerender(); }
    });
    root.querySelector("[data-add-col]")?.addEventListener("click", function () {
      state.columns += 1; state.data.forEach(function (row) { row.push(""); }); state.alignments.push("left"); rerender();
    });
    root.querySelector("[data-remove-col]")?.addEventListener("click", function () {
      if (state.columns > 1) { state.columns -= 1; state.data.forEach(function (row) { row.pop(); }); state.alignments.pop(); rerender(); }
    });

    root.querySelector("[data-pick]")?.addEventListener("click", function () {
      var items = value(root, "[data-input]").split(/\r?\n/).map(function (item) { return item.trim(); }).filter(Boolean);
      var pool = checked(root, "[data-unique]") ? Array.from(new Set(items)) : items.slice();
      var wanted = Number.parseInt(value(root, "[data-pick-count]") || "1", 10);
      var count = Math.max(1, Math.min(pool.length, Number.isFinite(wanted) ? wanted : 1));
      var picks = [];
      while (picks.length < count && pool.length) {
        var randomValue = crypto.getRandomValues(new Uint32Array(1))[0] || 0;
        var index = randomValue % pool.length;
        picks.push(pool[index]);
        if (checked(root, "[data-unique]")) pool.splice(index, 1);
      }
      setResult(root, picks.join("\\n"));
    });

    root.querySelector("[data-copy]").addEventListener("click", function () {
      var copy = root.querySelector("[data-copy]");
      var result = copy.dataset.result || value(root, "[data-output]");
      if (!result) return;
      navigator.clipboard.writeText(result).then(function () {
        copy.textContent = "Copied";
        window.setTimeout(function () { copy.textContent = "Copy result"; }, 900);
      });
    });

    root.querySelector("[data-clear]").addEventListener("click", function () {
      root.querySelectorAll("[data-workspace] input, [data-workspace] textarea").forEach(function (node) {
        if (node.type === "checkbox") node.checked = node.hasAttribute("checked");
        else if (node.type === "number") node.value = node.getAttribute("value") || "";
        else node.value = "";
      });
      state = initialState();
      if (mode === "markdown-table-generator") renderTable(root, state);
      update(root, mode, state);
    });

    update(root, mode, state);
  }

  document.querySelectorAll("[data-high-value-tool]").forEach(setup);
})();
