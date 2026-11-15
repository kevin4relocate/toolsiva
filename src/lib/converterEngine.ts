export type Unit ={label:string,factor?:number,toBase?:(v:number)=>number,fromBase?:(v:number)=>number};
export const unitSets:Record<string,Record<string,Unit>>={
  "length-converter":{m:{label:"metres",factor:1},km:{label:"kilometres",factor:1000},cm:{label:"centimetres",factor:.01},mm:{label:"millimetres",factor:.001},mi:{label:"miles",factor:1609.344},yd:{label:"yards",factor:.9144},ft:{label:"feet",factor:.3048},in:{label:"inches",factor:.0254}},
  "weight-converter":{kg:{label:"kilograms",factor:1},g:{label:"grams",factor:.001},mg:{label:"milligrams",factor:.000001},lb:{label:"pounds",factor:.45359237},oz:{label:"ounces",factor:.028349523125},t:{label:"metric tonnes",factor:1000}},
  "temperature-converter":{C:{label:"Celsius",toBase:v=>v,fromBase:v=>v},F:{label:"Fahrenheit",toBase:v=>(v-32)*5/9,fromBase:v=>v*9/5+32},K:{label:"Kelvin",toBase:v=>v-273.15,fromBase:v=>v+273.15}},
  "area-converter":{m2:{label:"square metres",factor:1},km2:{label:"square kilometres",factor:1e6},cm2:{label:"square centimetres",factor:1e-4},ha:{label:"hectares",factor:1e4},acre:{label:"acres",factor:4046.8564224},ft2:{label:"square feet",factor:.09290304}},
  "volume-converter":{L:{label:"litres",factor:1},mL:{label:"millilitres",factor:.001},m3:{label:"cubic metres",factor:1000},gal:{label:"US gallons",factor:3.785411784},qt:{label:"US quarts",factor:.946352946},cup:{label:"US cups",factor:.2365882365}},
  "speed-converter":{mps:{label:"metres/second",factor:1},kph:{label:"kilometres/hour",factor:.2777777778},mph:{label:"miles/hour",factor:.44704},knot:{label:"knots",factor:.5144444444},fps:{label:"feet/second",factor:.3048}},
  "time-converter":{s:{label:"seconds",factor:1},min:{label:"minutes",factor:60},h:{label:"hours",factor:3600},day:{label:"days",factor:86400},week:{label:"weeks",factor:604800}},
  "data-storage-converter":{B:{label:"bytes",factor:1},KB:{label:"kilobytes",factor:1000},MB:{label:"megabytes",factor:1e6},GB:{label:"gigabytes",factor:1e9},TB:{label:"terabytes",factor:1e12},KiB:{label:"kibibytes",factor:1024},MiB:{label:"mebibytes",factor:1048576},GiB:{label:"gibibytes",factor:1073741824}},
  "pressure-converter":{Pa:{label:"pascals",factor:1},kPa:{label:"kilopascals",factor:1000},bar:{label:"bar",factor:100000},psi:{label:"PSI",factor:6894.757293},atm:{label:"atmospheres",factor:101325},mmHg:{label:"mmHg",factor:133.3223874}},
  "energy-converter":{J:{label:"joules",factor:1},kJ:{label:"kilojoules",factor:1000},cal:{label:"calories",factor:4.184},kcal:{label:"kilocalories",factor:4184},Wh:{label:"watt-hours",factor:3600},kWh:{label:"kilowatt-hours",factor:3600000}},
  "power-converter":{W:{label:"watts",factor:1},kW:{label:"kilowatts",factor:1000},MW:{label:"megawatts",factor:1e6},hp:{label:"horsepower",factor:745.699872}},
  "angle-converter":{deg:{label:"degrees",factor:Math.PI/180},rad:{label:"radians",factor:1},turn:{label:"turns",factor:Math.PI*2},grad:{label:"gradians",factor:Math.PI/200}},
  "frequency-converter":{Hz:{label:"hertz",factor:1},kHz:{label:"kilohertz",factor:1e3},MHz:{label:"megahertz",factor:1e6},GHz:{label:"gigahertz",factor:1e9}},
  "force-converter":{N:{label:"newtons",factor:1},kN:{label:"kilonewtons",factor:1000},lbf:{label:"pound-force",factor:4.4482216153},kgf:{label:"kilogram-force",factor:9.80665}},
  "torque-converter":{Nm:{label:"newton-metres",factor:1},lbft:{label:"pound-feet",factor:1.3558179483},lbin:{label:"pound-inches",factor:.112984829},kgfm:{label:"kilogram-force metres",factor:9.80665}},
  "density-converter":{kgm3:{label:"kg/m³",factor:1},gcm3:{label:"g/cm³",factor:1000},gL:{label:"g/L",factor:1},lbft3:{label:"lb/ft³",factor:16.01846337}},
  "acceleration-converter":{mps2:{label:"m/s²",factor:1},g:{label:"g-force",factor:9.80665},fps2:{label:"ft/s²",factor:.3048},gal:{label:"Gal",factor:.01}},
  "fuel-economy-converter":{L100:{label:"L/100 km",toBase:v=>v,fromBase:v=>v},mpgUS:{label:"MPG (US)",toBase:v=>235.214583/v,fromBase:v=>235.214583/v},mpgUK:{label:"MPG (UK)",toBase:v=>282.480936/v,fromBase:v=>282.480936/v},kmL:{label:"km/L",toBase:v=>100/v,fromBase:v=>100/v}},
  "data-transfer-rate-converter":{bps:{label:"bits/s",factor:1},Kbps:{label:"kilobits/s",factor:1e3},Mbps:{label:"megabits/s",factor:1e6},Gbps:{label:"gigabits/s",factor:1e9},Bps:{label:"bytes/s",factor:8},MBps:{label:"megabytes/s",factor:8e6}},
  "cooking-volume-converter":{mL:{label:"millilitres",factor:1},L:{label:"litres",factor:1000},tsp:{label:"US teaspoons",factor:4.92892159375},tbsp:{label:"US tablespoons",factor:14.78676478125},cup:{label:"US cups",factor:236.5882365},floz:{label:"US fluid ounces",factor:29.5735295625}}
 };

export type ConversionResult = { value: number | null; error: string | null };

export function convertToolValue(
  mode: string,
  rawInput: string,
  from: string,
  to: string,
): ConversionResult {
  const units = unitSets[mode];
  if (!units) return { value: null, error: "Unknown converter." };
  const source = units[from], target = units[to];
  if (!source || !target) return { value: null, error: "Select valid units." };
  if (!rawInput.trim()) return { value: null, error: "Enter a number to convert." };
  const value = Number(rawInput);
  if (!Number.isFinite(value)) return { value: null, error: "Enter a finite number." };
  if (mode === "fuel-economy-converter" && value <= 0) {
    return { value: null, error: "Fuel economy must be greater than zero." };
  }
  const base = source.toBase ? source.toBase(value) : value * (source.factor ?? 1);
  if (!Number.isFinite(base)) return { value: null, error: "Value is outside the supported range." };
  // Celsius is the base unit of the temperature converter.
  if (mode === "temperature-converter" && base < -273.150000000001) {
    return { value: null, error: "Temperature cannot be below absolute zero." };
  }
  const converted = target.fromBase ? target.fromBase(base) : base / (target.factor ?? 1);
  if (!Number.isFinite(converted)) return { value: null, error: "Value is outside the supported range." };
  return { value: Object.is(converted, -0) ? 0 : converted, error: null };
}
