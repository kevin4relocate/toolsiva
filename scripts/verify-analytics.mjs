import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function walk(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

export function verifyAnalyticsBuild(dist = path.resolve("dist")) {
  const errors = [];
  if (!fs.existsSync(dist)) {
    return { checked: 0, errors: ["Missing dist directory: run npm run build first."] };
  }
  const files = walk(dist).filter((file) => file.endsWith(".html"));
  if (files.length < 100) {
    errors.push("Unexpectedly few generated HTML pages: " + files.length);
  }
  if (!fs.existsSync(path.join(dist, "analyticsConsent.js"))) {
    errors.push("Missing compiled analyticsConsent.js asset.");
  }
  if (!fs.existsSync(path.join(dist, "analyticsEvents.js"))) {
    errors.push("Missing analyticsEvents.js asset.");
  }

  for (const file of files) {
    const name = path.relative(dist, file).replaceAll(path.sep, "/");
    const html = fs.readFileSync(file, "utf8");
    const bootstraps = html.match(/<script\b[^>]*\bsrc=["']\/analyticsConsent\.js["'][^>]*>/gi) || [];
    if (bootstraps.length !== 1) {
      errors.push(name + ": expected one local opt-in consent bootstrap, found " + bootstraps.length);
    }
    const legacyGoogleTags = html.match(/<script\b[^>]*\bsrc=["']https:\/\/www\.googletagmanager\.com\/(?:gtag\/js|gtm\.js)[^"']*/gi) || [];
    if (legacyGoogleTags.length) {
      errors.push(name + ": Google libraries must not load until consent.");
    }
    const hardcodedCloudflareBeacons = html.match(/<script\b[^>]*beacon\.min\.js[^>]*>/gi) || [];
    if (hardcodedCloudflareBeacons.length) {
      errors.push(name + ": Cloudflare beacon must not be duplicated alongside Automatic Setup.");
    }
    const expectedConsentBeforeEventScript = html.indexOf('src="/analyticsConsent.js"') < html.indexOf('src="/analyticsEvents.js"');
    if (html.includes('src="/analyticsEvents.js"') && !expectedConsentBeforeEventScript) {
      errors.push(name + ": analytics events are bootstrapped before the consent controller.");
    }
  }
  return { checked: files.length, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = verifyAnalyticsBuild();
  console.log("Privacy-first analytics checked across " + result.checked + " generated HTML pages.");
  if (result.errors.length) {
    console.error(result.errors.map((item) => "- " + item).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("No premature Google loads or static Cloudflare beacon duplication found.");
  }
}
