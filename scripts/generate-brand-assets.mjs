import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import config from "../brand/brand.config.mjs";

const generatedDirectory = path.resolve("brand/generated");
const publicDirectory = path.resolve("public");
const publicSocialDirectory = path.resolve("public/social");

for (const directory of [generatedDirectory, publicDirectory, publicSocialDirectory]) {
  fs.mkdirSync(directory, { recursive: true });
}

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const write = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Created ${filePath}`);
  return filePath;
};

const copy = (source, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  console.log(`Created ${destination}`);
};

const markDefinitions = `
  <defs>
    <linearGradient id="toolsivaGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${config.primaryLight}"/>
      <stop offset="0.48" stop-color="${config.primary}"/>
      <stop offset="1" stop-color="${config.primaryDark}"/>
    </linearGradient>
    <filter id="tileShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#2E1065" flood-opacity=".28"/>
    </filter>
  </defs>`;

const markGroup = ({ x = 0, y = 0, size = 512, includeBackground = true } = {}) => {
  const scale = size / 512;
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      ${includeBackground ? `<rect width="512" height="512" rx="118" fill="url(#toolsivaGradient)"/>` : ""}
      <g fill="${config.foreground}" filter="url(#tileShadow)">
        <rect x="196" y="91" width="120" height="120" rx="26" transform="rotate(45 256 151)"/>
        <rect x="99" y="190" width="120" height="120" rx="26" transform="rotate(45 159 250)"/>
        <rect x="196" y="291" width="120" height="120" rx="26" transform="rotate(45 256 351)"/>
        <path d="M318 204c8-15 25-23 42-19l72 17c19 5 28 27 18 43l-39 61c-9 14-27 20-43 14l-64-24c-18-7-25-29-15-45l29-47Z"/>
      </g>
    </g>`;
};

const iconSvg = (size = 512) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  ${markDefinitions}
  ${markGroup({ size: 512 })}
</svg>`;

const horizontalLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="420" viewBox="0 0 1500 420">
  ${markDefinitions}
  ${markGroup({ x: 36, y: 36, size: 348 })}
  <text x="440" y="235" font-family="Inter,Arial,sans-serif" font-size="142" font-weight="760" letter-spacing="-5" fill="${config.foreground}">${escapeXml(config.name)}</text>
  <text x="446" y="302" font-family="Inter,Arial,sans-serif" font-size="34" font-weight="500" fill="${config.muted}">${escapeXml(config.tagline)}</text>
</svg>`;

const bannerSvg = ({ width, height, headlineSize, iconSize, compact = false }) => {
  const iconX = Math.round(width * 0.07);
  const iconY = Math.round(height * (compact ? 0.15 : 0.12));
  const brandX = iconX + iconSize + Math.round(height * 0.05);
  const brandBaseline = iconY + Math.round(iconSize * 0.63);
  const headlineY = Math.round(height * (compact ? 0.60 : 0.57));
  const taglineY = Math.round(height * (compact ? 0.75 : 0.72));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="backgroundGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${config.background}"/>
        <stop offset=".58" stop-color="#11101A"/>
        <stop offset="1" stop-color="#09090B"/>
      </linearGradient>
      <radialGradient id="brandGlow" cx="16%" cy="18%" r="72%">
        <stop offset="0" stop-color="${config.primary}" stop-opacity=".36"/>
        <stop offset=".55" stop-color="${config.primary}" stop-opacity=".08"/>
        <stop offset="1" stop-color="${config.background}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="toolsivaGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${config.primaryLight}"/>
        <stop offset="0.48" stop-color="${config.primary}"/>
        <stop offset="1" stop-color="${config.primaryDark}"/>
      </linearGradient>
      <filter id="tileShadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#2E1065" flood-opacity=".28"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#backgroundGradient)"/>
    <rect width="${width}" height="${height}" fill="url(#brandGlow)"/>
    <circle cx="${Math.round(width * 0.88)}" cy="${Math.round(height * 0.17)}" r="${Math.round(height * 0.22)}" fill="${config.primary}" opacity=".06"/>
    ${markGroup({ x: iconX, y: iconY, size: iconSize })}
    <text x="${brandX}" y="${brandBaseline}" font-family="Inter,Arial,sans-serif" font-size="${Math.round(iconSize * 0.43)}" font-weight="760" letter-spacing="${Math.round(iconSize * -0.012)}" fill="${config.foreground}">${escapeXml(config.name)}</text>
    <text x="${iconX}" y="${headlineY}" font-family="Inter,Arial,sans-serif" font-size="${headlineSize}" font-weight="780" letter-spacing="${Math.round(headlineSize * -0.025)}" fill="${config.foreground}">${escapeXml(config.headline)}</text>
    <text x="${iconX}" y="${taglineY}" font-family="Inter,Arial,sans-serif" font-size="${Math.round(headlineSize * 0.42)}" font-weight="500" fill="${config.primarySoft}">${escapeXml(config.tagline)}</text>
    <text x="${iconX}" y="${Math.round(height * 0.88)}" font-family="Inter,Arial,sans-serif" font-size="${Math.round(headlineSize * 0.31)}" font-weight="500" fill="${config.muted}">${escapeXml(config.domain)}</text>
  </svg>`;
};

const svgAssets = [
  ["toolsiva-icon.svg", iconSvg()],
  ["toolsiva-logo-horizontal.svg", horizontalLogoSvg],
  ["toolsiva-social-1200x630.svg", bannerSvg({ width: 1200, height: 630, headlineSize: 61, iconSize: 116 })],
  ["toolsiva-square-1080x1080.svg", bannerSvg({ width: 1080, height: 1080, headlineSize: 66, iconSize: 142 })],
  ["toolsiva-youtube-2560x1440.svg", bannerSvg({ width: 2560, height: 1440, headlineSize: 116, iconSize: 210 })],
  ["toolsiva-linkedin-1584x396.svg", bannerSvg({ width: 1584, height: 396, headlineSize: 48, iconSize: 82, compact: true })],
];

const generatedSvgPaths = svgAssets.map(([name, content]) =>
  write(path.join(generatedDirectory, name), content),
);

copy(path.join(generatedDirectory, "toolsiva-icon.svg"), path.join(publicDirectory, "favicon.svg"));
copy(path.join(generatedDirectory, "toolsiva-icon.svg"), path.join(publicDirectory, "logo-mark.svg"));
copy(
  path.join(generatedDirectory, "toolsiva-logo-horizontal.svg"),
  path.join(publicDirectory, "logo-horizontal.svg"),
);
copy(
  path.join(generatedDirectory, "toolsiva-social-1200x630.svg"),
  path.join(publicSocialDirectory, "toolsiva-default.svg"),
);

const canUseSips = process.platform === "darwin";

if (canUseSips) {
  for (const svgPath of generatedSvgPaths) {
    const pngPath = svgPath.replace(/\.svg$/, ".png");
    try {
      execFileSync("sips", ["-s", "format", "png", svgPath, "--out", pngPath], {
        stdio: "ignore",
      });
      console.log(`Created ${pngPath}`);
    } catch (error) {
      console.warn(`Could not convert ${svgPath} to PNG with sips.`);
    }
  }

  const iconPng = path.join(generatedDirectory, "toolsiva-icon.png");
  const resizeTargets = [
    [48, path.join(publicDirectory, "favicon-48x48.png")],
    [96, path.join(publicDirectory, "favicon-96x96.png")],
    [180, path.join(publicDirectory, "apple-touch-icon.png")],
    [192, path.join(publicDirectory, "icon-192.png")],
    [512, path.join(publicDirectory, "icon-512.png")],
  ];

  if (fs.existsSync(iconPng)) {
    for (const [size, destination] of resizeTargets) {
      copy(iconPng, destination);
      try {
        execFileSync("sips", ["-z", String(size), String(size), destination], {
          stdio: "ignore",
        });
        console.log(`Resized ${destination} to ${size}x${size}`);
      } catch {
        console.warn(`Could not resize ${destination}.`);
      }
    }
  }

  const socialPng = path.join(generatedDirectory, "toolsiva-social-1200x630.png");
  if (fs.existsSync(socialPng)) {
    copy(socialPng, path.join(publicSocialDirectory, "toolsiva-default.png"));
  }
} else {
  console.warn("PNG generation skipped because sips is available only on macOS.");
  console.warn("All SVG source assets were generated successfully.");
}

console.log("Toolsiva modular brand assets generated.");
