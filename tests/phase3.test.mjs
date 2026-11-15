import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";

const consentSource = fs.readFileSync(new URL("../public/analyticsConsent.js", import.meta.url), "utf8");
const eventsSource = fs.readFileSync(new URL("../public/analyticsEvents.js", import.meta.url), "utf8");

function createBrowser({ savedConsent = null, storageBlocked = false, readyState = "complete" } = {}) {
  const values = new Map();
  if (savedConsent) values.set("toolsiva_analytics_consent", savedConsent);
  const scripts = [];
  const events = [];
  const listeners = new Map();
  let reloads = 0;
  const storage = {
    getItem(key) {
      if (storageBlocked) throw new Error("blocked");
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (storageBlocked) throw new Error("blocked");
      values.set(key, String(value));
    },
    removeItem(key) { values.delete(key); },
  };
  const document = {
    title: "Toolsiva Word Counter",
    referrer: "https://example.org/ref?password=should-not-leak#secret",
    readyState,
    head: { appendChild(node) { scripts.push(node); } },
    createElement(tag) { assert.equal(tag, "script"); return { async: false, src: "" }; },
    addEventListener(name, callback) { listeners.set(name, callback); },
  };
  const window = {
    dataLayer: undefined,
    location: {
      origin: "https://toolsiva.com",
      pathname: "/tools/text/word-counter",
      search: "?secret=should-not-leak",
      hash: "#secret",
      reload() { reloads++; },
    },
    dispatchEvent(event) { events.push(event); },
  };
  const sandbox = {
    window,
    document,
    localStorage: storage,
    URL,
    Date,
    CustomEvent: class {
      constructor(type, options) { this.type = type; this.detail = options.detail; }
    },
  };
  vm.runInNewContext(consentSource, sandbox, { filename: "analyticsConsent.js" });
  return {
    window, document, scripts, events, listeners, values,
    get reloads() { return reloads; },
    commands() { return [...window.dataLayer].filter((item) => item && typeof item[0] === "string"); },
    command(name, type) { return this.commands().filter((args) => args[0] === name && (type === undefined || args[1] === type)); },
  };
}

test("No consent = no Google scripts, no Google pageviews and denied consent v2 defaults", () => {
  const browser = createBrowser();
  assert.equal(browser.scripts.length, 0);
  assert.equal(browser.command("event", "page_view").length, 0);
  assert.equal(browser.window.toolsivaConsent.getChoice(), null);
  const defaults = browser.command("consent", "default");
  assert.equal(defaults.length, 1);
  assert.equal(defaults[0][2].analytics_storage, "denied");
  for (const item of ["ad_storage", "ad_user_data", "ad_personalization"]) {
    assert.equal(defaults[0][2][item], "denied");
  }
});

test("Consent accepted = exactly one GA4 loader, GTM loader and sanitized explicit pageview", () => {
  const browser = createBrowser();
  assert.equal(browser.window.toolsivaConsent.setChoice("granted"), true);
  assert.equal(browser.scripts.length, 2);
  assert.ok(browser.scripts.some((script) => script.src === "https://www.googletagmanager.com/gtag/js?id=G-SM8H6H5D74"));
  assert.ok(browser.scripts.some((script) => script.src === "https://www.googletagmanager.com/gtm.js?id=GTM-TVGV8PTP"));
  assert.equal(browser.command("config")[0][2].send_page_view, false);
  assert.equal(browser.command("event", "page_view").length, 1);
  const params = browser.command("event", "page_view")[0][2];
  assert.equal(params.send_to, "G-SM8H6H5D74");
  assert.equal(params.page_location, "https://toolsiva.com/tools/text/word-counter");
  assert.equal(params.page_referrer, "https://example.org/ref");
  assert.ok(!JSON.stringify(params).includes("should-not-leak"));
  assert.equal(browser.window.toolsivaConsent.setChoice("granted"), true);
  assert.equal(browser.scripts.length, 2);
  assert.equal(browser.command("event", "page_view").length, 1);
});

test("Stored consent restores Google tags; saved rejection leaves them disabled", () => {
  const yes = createBrowser({ savedConsent: "granted", readyState: "loading" });
  assert.equal(yes.scripts.length, 2);
  assert.equal(yes.command("event", "page_view").length, 0);
  yes.listeners.get("DOMContentLoaded")();
  assert.equal(yes.command("event", "page_view").length, 1);
  const no = createBrowser({ savedConsent: "denied" });
  assert.equal(no.scripts.length, 0);
  assert.equal(no.command("event", "page_view").length, 0);
});

test("Revoking granted consent queues denied state and reloads to unload tags", () => {
  const browser = createBrowser({ savedConsent: "granted" });
  assert.equal(browser.window.toolsivaConsent.setChoice("denied"), true);
  assert.equal(browser.reloads, 1);
  assert.equal(browser.values.get("toolsiva_analytics_consent"), "denied");
  assert.equal(browser.command("consent", "update").at(-1)[2].analytics_storage, "denied");
  assert.equal(browser.events.at(-1).detail.analytics, "denied");
  assert.equal(browser.window.toolsivaConsent.hasAnalyticsConsent(), false);
  const subsequent = createBrowser({ savedConsent: "denied" });
  assert.equal(subsequent.scripts.length, 0);
});

test("Storage-blocked browser defaults to no tracking and can consent for current page", () => {
  const browser = createBrowser({ storageBlocked: true });
  assert.equal(browser.scripts.length, 0);
  assert.equal(browser.window.toolsivaConsent.setChoice("granted"), true);
  assert.equal(browser.scripts.length, 2);
});

test("Analytics event handler only sends allowlisted fields and static action names", () => {
  const source = eventsSource;
  assert.match(source, /window\.toolsivaConsent\?\.hasAnalyticsConsent\(\)/);
  assert.match(source, /return element\.tagName\.toLowerCase\(\) === "a" \? "link" : "button"/);
  assert.doesNotMatch(source, /return buttonLabel\(element\) \|\|/);
  assert.match(source, /if \(target\.closest\("form"\)\) return/);
  assert.doesNotMatch(source, /input\.value/);
  assert.doesNotMatch(source, /search_term/);
});

test("Markdown draft persistence is optional and includes user deletion", () => {
  const source = fs.readFileSync(new URL("../src/components/tools/MarkdownLivePreviewWorkspace.astro", import.meta.url), "utf8");
  assert.match(source, /data-save-draft/);
  assert.match(source, /if \(!draftToggle\?\.checked\) return/);
  assert.match(source, /data-restore-saved-draft/);
  assert.match(source, /data-delete-saved-draft/);
  assert.match(source, /localStorage\.removeItem\(STORAGE_KEY\)/);
});
