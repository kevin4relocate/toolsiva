// QR payload builders. Keep all user-supplied content in browser memory.
// vCard 3.0: RFC 2426; iCalendar: RFC 5545 (floating local date-times).
export type QrPayload = { value: string; error: string | null };
export type QrFields = Record<string, string | boolean | undefined>;

const good = (value: string): QrPayload => ({ value, error: null });
const bad = (error: string): QrPayload => ({ value: "", error });
const get = (fields: QrFields, name: string): string => String(fields[name] ?? "");
const text = (fields: QrFields, name: string): string => get(fields, name).trim();

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function phoneNumber(raw: string): string | null {
  const value = raw.trim();
  if (!/^\+?[\d\s().-]+$/.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 3 || digits.length > 15) return null;
  return (value.startsWith("+") ? "+" : "") + digits;
}

function emailAddress(raw: string): string | null {
  const value = raw.trim();
  return /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(value) && value.length <= 254 ? value : null;
}

function calendarDateTime(raw: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(raw);
  if (!m) return null;
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  const h = Number(m[4]), min = Number(m[5]), sec = Number(m[6] ?? "0");
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || min > 59 || sec > 59) return null;
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(y, mo - 1, d);
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
  return m[1]! + m[2]! + m[3]! + "T" + m[4]! + m[5]! + (m[6] ?? "00");
}

export function buildQrPayload(
  mode: string,
  fields: QrFields,
  options: { uid?: string; now?: Date } = {},
): QrPayload {
  switch (mode) {
    case "qr-text-generator":
      return get(fields, "text") ? good(get(fields, "text")) : bad("Enter text to generate a QR code.");

    case "qr-url-generator": {
      const raw = text(fields, "url");
      if (!raw) return bad("Enter a website URL.");
      try {
        const url = new URL(raw);
        if (!["http:", "https:"].includes(url.protocol) || !url.hostname) {
          return bad("Use a complete http:// or https:// URL.");
        }
        return good(url.href);
      } catch {
        return bad("Enter a valid website URL, including https://.");
      }
    }

    case "qr-wifi-generator": {
      const ssid = get(fields, "ssid");
      const security = text(fields, "security") || "WPA";
      const password = get(fields, "password");
      const hidden = fields.hidden === true;
      if (!ssid.trim()) return bad("Enter the Wi-Fi network name.");
      if (!["WPA", "WEP", "nopass"].includes(security)) return bad("Select a valid Wi-Fi security type.");
      if (security !== "nopass" && !password) return bad("Enter a Wi-Fi password or choose No password.");
      const passwordField = security === "nopass" ? "" : "P:" + escapeWifi(password) + ";";
      return good("WIFI:S:" + escapeWifi(ssid) + ";T:" + security + ";" + passwordField +
        "H:" + (hidden ? "true" : "false") + ";;");
    }

    case "qr-email-generator": {
      const address = emailAddress(get(fields, "email"));
      if (!address) return bad("Enter a valid email address.");
      const query = new URLSearchParams();
      if (get(fields, "subject")) query.set("subject", get(fields, "subject"));
      if (get(fields, "message")) query.set("body", get(fields, "message"));
      return good("mailto:" + address + (query.size ? "?" + query.toString() : ""));
    }

    case "qr-phone-generator":
    case "qr-sms-generator": {
      const phone = phoneNumber(get(fields, "phone"));
      if (!phone) return bad("Enter a valid phone number.");
      return good(mode === "qr-phone-generator" ? "tel:" + phone :
        "SMSTO:" + phone + ":" + get(fields, "message"));
    }

    case "qr-whatsapp-generator": {
      const phone = phoneNumber(get(fields, "phone"));
      if (!phone || phone.replace(/\D/g, "").length < 7) return bad("Enter a full international phone number.");
      const message = get(fields, "message");
      return good("https://wa.me/" + phone.replace(/\D/g, "") +
        (message ? "?text=" + encodeURIComponent(message) : ""));
    }

    case "qr-vcard-generator": {
      const name = text(fields, "name");
      if (!name) return bad("Enter the contact's name.");
      const rawPhone = get(fields, "phone");
      const rawEmail = get(fields, "email");
      const phone = rawPhone.trim() ? phoneNumber(rawPhone) : null;
      const email = rawEmail.trim() ? emailAddress(rawEmail) : null;
      if (rawPhone.trim() && !phone) return bad("Enter a valid contact phone number.");
      if (rawEmail.trim() && !email) return bad("Enter a valid contact email address.");
      const lines = [
        "BEGIN:VCARD", "VERSION:3.0",
        "N:;" + escapeText(name) + ";;;",
        "FN:" + escapeText(name),
      ];
      if (phone) lines.push("TEL:" + phone);
      if (email) lines.push("EMAIL:" + email);
      if (get(fields, "organization").trim()) lines.push("ORG:" + escapeText(get(fields, "organization")));
      lines.push("END:VCARD");
      return good(lines.join("\r\n"));
    }

    case "qr-location-generator": {
      const latRaw = text(fields, "latitude"), lonRaw = text(fields, "longitude");
      if (!latRaw || !lonRaw) return bad("Enter latitude and longitude.");
      const lat = Number(latRaw), lon = Number(lonRaw);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return bad("Latitude must be -90 to 90 and longitude -180 to 180.");
      }
      return good("geo:" + lat + "," + lon);
    }

    case "qr-event-generator": {
      const title = text(fields, "title");
      const start = calendarDateTime(text(fields, "start"));
      const end = calendarDateTime(text(fields, "end"));
      if (!title || !start || !end) return bad("Enter an event title and valid start/end times.");
      if (end <= start) return bad("End time must be after start time.");
      const stamp = options.now ?? new Date();
      if (!Number.isFinite(stamp.getTime())) return bad("Invalid event creation time.");
      const dtstamp = stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const uid = (options.uid || "toolsiva-event").replace(/[^a-zA-Z0-9@_.-]/g, "").slice(0, 100);
      return good([
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Toolsiva//QR Calendar//EN",
        "BEGIN:VEVENT", "UID:" + uid + "@toolsiva.com", "DTSTAMP:" + dtstamp,
        // Floating date-time: the scanning calendar interprets its own local time zone.
        "DTSTART:" + start, "DTEND:" + end, "SUMMARY:" + escapeText(title),
        ...(get(fields, "location").trim() ? ["LOCATION:" + escapeText(get(fields, "location"))] : []),
        "END:VEVENT", "END:VCALENDAR",
      ].join("\r\n"));
    }

    default:
      return bad("Unknown QR generator.");
  }
}
