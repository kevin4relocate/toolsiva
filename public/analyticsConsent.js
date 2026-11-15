// Toolsiva's basic (opt-in) Google Consent Mode v2 integration.
// This script must run in <head>, before any Google tag or GTM library.
(() => {
  "use strict";

  const CONSENT_KEY = "toolsiva_analytics_consent";
  const GA4_ID = "G-SM8H6H5D74";
  const GTM_ID = "GTM-TVGV8PTP";
  const ADS_DENIED = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  const GRANTED = "granted";
  const DENIED = "denied";

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  // No third-party Google script is fetched while consent is unknown/denied.
  window.gtag("consent", "default", {
    analytics_storage: DENIED,
    ...ADS_DENIED,
  });

  let choice = null;
  let tagsStarted = false;
  let pageViewSent = false;

  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === GRANTED || saved === DENIED) choice = saved;
  } catch {
    // Browsers with unavailable storage stay in privacy-preserving default state.
  }

  function safeLocation() {
    // Never transmit search queries or URL fragments in explicit page views.
    return window.location.origin + window.location.pathname;
  }

  function safeReferrer() {
    if (!document.referrer) return "";
    try {
      const parsed = new URL(document.referrer);
      return /^https?:$/.test(parsed.protocol) ? parsed.origin + parsed.pathname : "";
    } catch {
      return "";
    }
  }

  function sendPageView() {
    if (pageViewSent || choice !== GRANTED || !tagsStarted) return;
    pageViewSent = true;
    window.gtag("event", "page_view", {
      send_to: GA4_ID,
      page_title: document.title,
      page_location: safeLocation(),
      page_referrer: safeReferrer(),
      page_path: window.location.pathname,
    });
  }

  function loadScript(src) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    document.head.appendChild(script);
  }

  function startTags() {
    if (tagsStarted || choice !== GRANTED) return;
    tagsStarted = true;

    window.gtag("consent", "update", {
      analytics_storage: GRANTED,
      ...ADS_DENIED,
    });
    window.gtag("js", new Date());
    // Explicitly control one page_view per document, never auto-emit from this config.
    window.gtag("config", GA4_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: safeLocation(),
    });

    // GTM is for non-GA4 tags; do not configure another GA4 Google tag in GTM.
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + GA4_ID);
    loadScript("https://www.googletagmanager.com/gtm.js?id=" + GTM_ID);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", sendPageView, { once: true });
    } else {
      sendPageView();
    }
  }

  function setChoice(nextChoice) {
    if (nextChoice !== GRANTED && nextChoice !== DENIED) return false;
    const wasActive = tagsStarted;
    choice = nextChoice;

    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // The current-page preference still applies.
    }

    window.gtag("consent", "update", {
      analytics_storage: choice,
      ...ADS_DENIED,
    });

    if (choice === GRANTED) startTags();
    window.dispatchEvent(
      new CustomEvent("toolsiva:consent-changed", { detail: { analytics: choice } }),
    );

    // A previously loaded GTM container cannot be reliably unloaded in place.
    // Reload after revocation so no Google scripts are loaded on the denied page.
    if (nextChoice === DENIED && wasActive) {
      window.location.reload();
    }
    return true;
  }

  window.toolsivaConsent = Object.freeze({
    getChoice: () => choice,
    hasAnalyticsConsent: () => choice === GRANTED,
    setChoice,
    isGoogleTrackingLoaded: () => tagsStarted,
  });

  if (choice === GRANTED) startTags();
})();
