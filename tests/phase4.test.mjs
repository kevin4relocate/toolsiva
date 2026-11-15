import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { calculateTool } from "../src/lib/calculatorEngine.ts";
import { convertToolValue, unitSets } from "../src/lib/converterEngine.ts";
import { buildQrPayload } from "../src/lib/qrPayloads.ts";
import { simplifiedRatio, fractionOperation, integerGcdLcm, paceMetrics } from "../src/lib/expansionMath.ts";

const calc = (mode, ...inputs) => calculateTool(mode, inputs);
const qr = (mode, fields, opts) => buildQrPayload(mode, fields, opts);

test("Calculator: missing values must not be interpreted as zero", () => {
  assert.equal(calc("percentage-calculator", "", "100").main, "Enter values");
  assert.equal(calc("discount-calculator", "100", "").main, "Enter values");
  assert.equal(calc("loan-calculator", "10000", "", "10").main, "Enter values");
  assert.equal(calc("average-calculator", "").main, "Enter values");
  assert.equal(calc("tip-calculator", "100", "10", "").main, "Enter values");
});
test("Calculator: percent, change, discount and tip", () => {
  assert.equal(calc("percentage-calculator", "25", "80").main, "20");
  assert.equal(calc("percentage-change-calculator", "100", "125").main, "25%");
  assert.equal(calc("percentage-change-calculator", "0", "1").main, "Invalid input");
  assert.equal(calc("discount-calculator", "200", "25").main, "150");
  assert.equal(calc("discount-calculator", "200", "110").main, "Invalid input");
  assert.equal(calc("tip-calculator", "100", "10", "2").main, "55");
  assert.equal(calc("tip-calculator", "100", "10", "2.5").main, "Invalid input");
});
test("Calculator: BMI and zero/normal APR loans and interest", () => {
  assert.equal(calc("bmi-calculator", "70", "170").main, "24.2");
  assert.equal(calc("bmi-calculator", "-70", "170").main, "Invalid input");
  assert.equal(calc("loan-calculator", "1200", "0", "1").main, "100");
  assert.equal(calc("loan-calculator", "100000", "6", "30").main, "599.55");
  assert.equal(calc("loan-calculator", "1000", "-3", "1").main, "Invalid input");
  assert.equal(calc("simple-interest-calculator", "1000", "5", "2").main, "1,100");
  assert.equal(calc("compound-interest-calculator", "1000", "5", "2", "1").main, "1,102.5");
  assert.equal(calc("compound-interest-calculator", "1000", "5", "2", "0").main, "Invalid input");
});
test("Calculator: average rejects bad tokens without silent filtering", () => {
  assert.equal(calc("average-calculator", "10,20,30").main, "20");
  assert.equal(calc("average-calculator", "10,broken,30").main, "Invalid input");
  assert.equal(calc("average-calculator", "Infinity,30").main, "Invalid input");
});
test("Calculator: age/calendar and overnight time math", () => {
  assert.equal(calculateTool("age-calculator", ["2000-02-29"], new Date("2026-02-28T12:00:00Z")).main, "25 years");
  assert.equal(calculateTool("age-calculator", ["2000-02-29"], new Date("2026-03-01T12:00:00Z")).main, "26 years");
  assert.equal(calculateTool("age-calculator", ["2027-01-01"], new Date("2026-11-15T12:00:00Z")).main, "Invalid input");
  assert.equal(calc("date-difference-calculator", "2026-03-07", "2026-03-09").main, "2 days");
  assert.equal(calc("date-difference-calculator", "2026-02-29", "2026-03-01").main, "Invalid input");
  assert.equal(calc("time-duration-calculator", "23:50", "00:20").main, "0h 30m");
  assert.equal(calc("time-duration-calculator", "24:50", "00:20").main, "Invalid input");
});
test("Converter: all twenty modes roundtrip across first two units", () => {
  assert.equal(Object.keys(unitSets).length, 20);
  for (const [mode, units] of Object.entries(unitSets)) {
    const keys = Object.keys(units);
    assert.ok(keys.length >= 2, mode);
    const [from, to] = keys;
    const converted = convertToolValue(mode, "5", from, to);
    assert.equal(converted.error, null, mode);
    const reverse = convertToolValue(mode, String(converted.value), to, from);
    assert.equal(reverse.error, null, mode);
    assert.ok(Math.abs(reverse.value - 5) < 1e-7, mode + ": reverse = " + reverse.value);
  }
});
test("Converter: known conversions, empty input and physical constraints", () => {
  assert.ok(Math.abs(convertToolValue("length-converter", "1", "mi", "km").value - 1.609344) < 1e-9);
  assert.ok(Math.abs(convertToolValue("temperature-converter", "32", "F", "C").value) < 1e-9);
  assert.ok(Math.abs(convertToolValue("temperature-converter", "0", "K", "C").value + 273.15) < 1e-9);
  assert.equal(convertToolValue("temperature-converter", "-500", "F", "K").value, null);
  assert.equal(convertToolValue("fuel-economy-converter", "0", "mpgUS", "L100").value, null);
  assert.equal(convertToolValue("fuel-economy-converter", "-15", "L100", "mpgUK").value, null);
  assert.ok(Math.abs(convertToolValue("fuel-economy-converter", "30", "mpgUS", "L100").value - 235.214583 / 30) < 1e-9);
  assert.equal(convertToolValue("length-converter", "", "m", "km").value, null);
  assert.equal(convertToolValue("length-converter", "Infinity", "m", "km").value, null);
});
test("Expanded math: integer ratio, fraction and safe GCD/LCM validation", () => {
  assert.equal(simplifiedRatio("12", "18")[0][1], "2:3");
  assert.equal(simplifiedRatio("1.5", "2")[0][0], "Status");
  assert.equal(fractionOperation({ n1: "1", d1: "2", n2: "1", d2: "3", op: "+" })[0][1], "5/6");
  assert.equal(fractionOperation({ n1: "1", d1: "2", n2: "0", d2: "3", op: "÷" })[0][0], "Status");
  assert.equal(fractionOperation({ n1: "1.5", d1: "2", n2: "1", d2: "3", op: "+" })[0][0], "Status");
  assert.deepEqual(integerGcdLcm("12,18,30"), [["GCD", "6"], ["LCM", "180"]]);
  assert.equal(integerGcdLcm("12,nope,18")[0][0], "Status");
});
test("Expanded pace: fix 4:60 rounding, validate duration", () => {
  assert.equal(paceMetrics({ distance: "6.01", hours: "0", minutes: "30", unit: "km" })[0][1], "5:00 min/km");
  assert.equal(paceMetrics({ distance: "5", hours: "0", minutes: "30", unit: "km" })[0][1], "6:00 min/km");
  assert.equal(paceMetrics({ distance: "5", hours: "0", minutes: "60", unit: "km" })[0][0], "Status");
});
test("QR: text, URL allowlisting and exact WiFi escaping including password spaces", () => {
  assert.equal(qr("qr-text-generator", { text: "hello" }).value, "hello");
  assert.equal(qr("qr-url-generator", { url: "https://example.org/page" }).value, "https://example.org/page");
  assert.equal(qr("qr-url-generator", { url: "javascript:alert(1)" }).value, "");
  const wifi = qr("qr-wifi-generator", {
    ssid: "Cafe;Network", password: " pass:,word ", security: "WPA", hidden: true,
  }).value;
  assert.ok(wifi.includes("S:Cafe\\;Network"));
  assert.ok(wifi.includes("P: pass\\:\\,word "));
  assert.ok(wifi.includes("H:true"));
  assert.equal(qr("qr-wifi-generator", { ssid: "Open", security: "nopass" }).error, null);
});
test("QR: email, phone, SMS and WhatsApp URI encoding", () => {
  assert.ok(qr("qr-email-generator", { email: "a@example.com", subject: "A&B", message: "Hi there" }).value.includes("subject=A%26B"));
  assert.equal(qr("qr-phone-generator", { phone: "+1 (212) 555-0111" }).value, "tel:+12125550111");
  assert.equal(qr("qr-sms-generator", { phone: "12125550111", message: "Hi!" }).value, "SMSTO:12125550111:Hi!");
  assert.equal(qr("qr-whatsapp-generator", { phone: "+1 (212) 555-0111", message: "Hi!" }).value, "https://wa.me/12125550111?text=Hi!");
  assert.equal(qr("qr-whatsapp-generator", { phone: "abc" }).value, "");
});
test("QR: vCard 3.0 escaping/mandatory fields and geo coordinates", () => {
  const vcard = qr("qr-vcard-generator", {
    name: "Jane, Doe\nManager", organization: "A;B", phone: "+44123456789", email: "jane@example.com",
  }).value;
  assert.ok(vcard.includes("BEGIN:VCARD\r\nVERSION:3.0\r\nN:;"));
  assert.ok(vcard.includes("FN:Jane\\, Doe\\nManager"));
  assert.ok(vcard.includes("ORG:A\\;B"));
  assert.ok(vcard.includes("END:VCARD"));
  assert.equal(qr("qr-location-generator", { latitude: "0", longitude: "0" }).value, "geo:0,0");
  assert.equal(qr("qr-location-generator", { latitude: "95", longitude: "0" }).value, "");
  assert.equal(qr("qr-vcard-generator", { name: "Jane", email: "nope" }).value, "");
});
test("QR: RFC5545 event has calendar wrapper, escaped fields and valid order", () => {
  const event = qr("qr-event-generator", {
    title: "Team, meeting; plan", start: "2026-11-15T10:00", end: "2026-11-15T11:30",
    location: "Room A\nFloor 2",
  }, { now: new Date("2026-11-15T02:00:00Z"), uid: "test-uid" }).value;
  assert.ok(event.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0"));
  assert.ok(event.includes("UID:test-uid@toolsiva.com"));
  assert.ok(event.includes("DTSTAMP:20261115T020000Z"));
  assert.ok(event.includes("DTSTART:20261115T100000"));
  assert.ok(event.includes("DTEND:20261115T113000"));
  assert.ok(event.includes("SUMMARY:Team\\, meeting\\; plan"));
  assert.ok(event.includes("LOCATION:Room A\\nFloor 2"));
  assert.ok(event.endsWith("END:VEVENT\r\nEND:VCALENDAR"));
  assert.equal(qr("qr-event-generator", { title: "Test", start: "2026-11-15T12:00", end: "2026-11-15T10:00" }).value, "");
  assert.equal(qr("qr-event-generator", { title: "Test" }).value, "");
});
test("Modified UI components are integrated with the tested engines", () => {
  const read = (name) => fs.readFileSync(new URL("../src/components/tools/" + name + ".astro", import.meta.url), "utf8");
  assert.match(read("CalculatorToolWorkspace"), /calculateTool\(mode,/);
  assert.match(read("ConverterToolWorkspace"), /convertToolValue\(mode,/);
  assert.match(read("QrToolWorkspace"), /buildQrPayload\(mode,/);
  assert.match(read("ExpansionToolWorkspace"), /paceMetrics\(v\)/);
  assert.match(read("ExpansionToolWorkspace"), /fractionOperation\(v\)/);
});
