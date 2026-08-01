import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import config from "../brand/brand.config.mjs";

const outputDirectory = path.resolve("brand/generated");
fs.mkdirSync(outputDirectory, { recursive: true });
fs.mkdirSync(path.resolve("public/social"), { recursive: true });

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const write = (name, content) => {
  const file = path.join(outputDirectory, name);
  fs.writeFileSync(file, content);
  console.log(`Created ${file}`);
  return file;
};

const iconSvg = (size = 512) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="120" fill="${config.background}"/>
  <rect x="56" y="56" width="400" height="400" rx="104" fill="${config.primary}"/>
  <path d="M151 151h210v58h-75v165h-60V209h-75z" fill="${config.foreground}"/>
</svg>`;

const horizontalLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="360" viewBox="0 0 1400 360">
  <rect width="1400" height="360" fill="transparent"/>
  <rect x="36" y="36" width="288" height="288" rx="76" fill="${config.primary}"/>
  <path d="M104 104h152v50h-51v118h-50V154h-51z" fill="${config.foreground}"/>
  <text x="380" y="190" font-family="Inter,Arial,sans-serif" font-size="112" font-weight="800" fill="${config.foreground}">${escapeXml(config.name)}</text>
  <text x="386" y="258" font-family="Inter,Arial,sans-serif" font-size="35" font-weight="500" fill="${config.muted}">${escapeXml(config.tagline)}</text>
</svg>`;

const banner = (width, height, titleSize) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="glow" cx="20%" cy="20%" r="80%">
      <stop offset="0" stop-color="${config.primary}" stop-opacity=".32"/>
      <stop offset=".55" stop-color="${config.primary}" stop-opacity=".08"/>
      <stop offset="1" stop-color="${config.background}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="${config.background}"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <rect x="${Math.round(width*.07)}" y="${Math.round(height*.14)}" width="${Math.round(height*.14)}" height="${Math.round(height*.14)}" rx="${Math.round(height*.035)}" fill="${config.primary}"/>
  <text x="${Math.round(width*.07 + height*.045)}" y="${Math.round(height*.14 + height*.105)}" font-family="Inter,Arial,sans-serif" font-size="${Math.round(height*.085)}" font-weight="800" fill="${config.foreground}">T</text>
  <text x="${Math.round(width*.07 + height*.18)}" y="${Math.round(height*.245)}" font-family="Inter,Arial,sans-serif" font-size="${Math.round(height*.08)}" font-weight="800" fill="${config.foreground}">${escapeXml(config.name)}</text>
  <text x="${Math.round(width*.07)}" y="${Math.round(height*.56)}" font-family="Inter,Arial,sans-serif" font-size="${titleSize}" font-weight="800" fill="${config.foreground}">${escapeXml(config.headline)}</text>
  <text x="${Math.round(width*.07)}" y="${Math.round(height*.70)}" font-family="Inter,Arial,sans-serif" font-size="${Math.round(titleSize*.42)}" font-weight="500" fill="${config.primaryLight}">${escapeXml(config.tagline)}</text>
  <text x="${Math.round(width*.07)}" y="${Math.round(height*.84)}" font-family="Inter,Arial,sans-serif" font-size="${Math.round(titleSize*.34)}" font-weight="500" fill="${config.muted}">${escapeXml(config.domain)}</text>
</svg>`;

const assets = [
  write("toolsiva-icon.svg", iconSvg()),
  write("toolsiva-logo-horizontal.svg", horizontalLogo),
  write("toolsiva-social-1200x630.svg", banner(1200, 630, 62)),
  write("toolsiva-square-1080x1080.svg", banner(1080, 1080, 66)),
  write("toolsiva-youtube-2560x1440.svg", banner(2560, 1440, 118)),
  write("toolsiva-linkedin-1584x396.svg", banner(1584, 396, 58)),
];

fs.copyFileSync(
  path.join(outputDirectory, "toolsiva-icon.svg"),
  path.resolve("public/favicon.svg"),
);

const canUseSips = process.platform === "darwin";
if (canUseSips) {
  for (const svgFile of assets) {
    const pngFile = svgFile.replace(/\.svg$/, ".png");
    try {
      execFileSync("sips", ["-s", "format", "png", svgFile, "--out", pngFile], {
        stdio: "ignore",
      });
      console.log(`Created ${pngFile}`);
    } catch {
      console.warn(`Could not convert ${svgFile} to PNG with sips.`);
    }
  }

  const socialPng = path.join(outputDirectory, "toolsiva-social-1200x630.png");
  if (fs.existsSync(socialPng)) {
    fs.copyFileSync(socialPng, path.resolve("public/social/toolsiva-default.png"));
  }
}

console.log("Brand assets generated.");
