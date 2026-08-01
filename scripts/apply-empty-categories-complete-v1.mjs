import fs from "node:fs";

const toolsPath = "src/data/tools.ts";
const pagePath = "src/pages/tools/[category]/[slug].astro";
const instructionsPath = "src/data/toolInstructions.ts";
const newTools = [
  {
    "slug": "qr-text-generator",
    "category": "qr",
    "name": "QR Text Generator",
    "shortDescription": "Create a QR code from plain text.",
    "metaDescription": "Generate a QR code for plain text locally in your browser.",
    "keywords": [
      "qr code text",
      "text qr generator"
    ],
    "featured": true,
    "relatedTools": [
      "qr-url-generator",
      "qr-email-generator",
      "qr-wifi-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-url-generator",
    "category": "qr",
    "name": "QR URL Generator",
    "shortDescription": "Create a QR code that opens a website URL.",
    "metaDescription": "Generate a QR code for a website URL locally in your browser.",
    "keywords": [
      "url qr code",
      "website qr generator"
    ],
    "featured": true,
    "relatedTools": [
      "qr-text-generator",
      "qr-whatsapp-generator",
      "qr-email-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-wifi-generator",
    "category": "qr",
    "name": "WiFi QR Code Generator",
    "shortDescription": "Create a QR code for joining a WiFi network.",
    "metaDescription": "Generate a WiFi QR code with network name, password and security type.",
    "keywords": [
      "wifi qr code",
      "wifi password qr"
    ],
    "featured": true,
    "relatedTools": [
      "qr-text-generator",
      "qr-url-generator",
      "qr-vcard-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-email-generator",
    "category": "qr",
    "name": "Email QR Code Generator",
    "shortDescription": "Create a QR code for a prefilled email message.",
    "metaDescription": "Generate a QR code with email address, subject and message.",
    "keywords": [
      "email qr code",
      "mailto qr generator"
    ],
    "featured": false,
    "relatedTools": [
      "qr-phone-generator",
      "qr-sms-generator",
      "qr-url-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-phone-generator",
    "category": "qr",
    "name": "Phone QR Code Generator",
    "shortDescription": "Create a QR code that starts a phone call.",
    "metaDescription": "Generate a QR code for a phone number locally in your browser.",
    "keywords": [
      "phone qr code",
      "call qr generator"
    ],
    "featured": false,
    "relatedTools": [
      "qr-sms-generator",
      "qr-whatsapp-generator",
      "qr-vcard-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-sms-generator",
    "category": "qr",
    "name": "SMS QR Code Generator",
    "shortDescription": "Create a QR code for a prefilled SMS message.",
    "metaDescription": "Generate a QR code with a phone number and SMS message.",
    "keywords": [
      "sms qr code",
      "text message qr"
    ],
    "featured": false,
    "relatedTools": [
      "qr-phone-generator",
      "qr-whatsapp-generator",
      "qr-email-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-whatsapp-generator",
    "category": "qr",
    "name": "WhatsApp QR Code Generator",
    "shortDescription": "Create a QR code that opens a WhatsApp chat.",
    "metaDescription": "Generate a WhatsApp chat QR code with an optional prefilled message.",
    "keywords": [
      "whatsapp qr code",
      "wa.me qr generator"
    ],
    "featured": false,
    "relatedTools": [
      "qr-phone-generator",
      "qr-sms-generator",
      "qr-url-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-vcard-generator",
    "category": "qr",
    "name": "vCard QR Code Generator",
    "shortDescription": "Create a QR code containing contact details.",
    "metaDescription": "Generate a vCard contact QR code locally in your browser.",
    "keywords": [
      "vcard qr code",
      "contact qr generator"
    ],
    "featured": false,
    "relatedTools": [
      "qr-phone-generator",
      "qr-email-generator",
      "qr-wifi-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-location-generator",
    "category": "qr",
    "name": "Location QR Code Generator",
    "shortDescription": "Create a QR code for geographic coordinates.",
    "metaDescription": "Generate a QR code for latitude and longitude coordinates.",
    "keywords": [
      "location qr code",
      "geo qr generator"
    ],
    "featured": false,
    "relatedTools": [
      "qr-event-generator",
      "qr-url-generator",
      "qr-text-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "qr-event-generator",
    "category": "qr",
    "name": "Event QR Code Generator",
    "shortDescription": "Create a QR code for a calendar event.",
    "metaDescription": "Generate an iCalendar event QR code with title, dates and location.",
    "keywords": [
      "event qr code",
      "calendar qr generator"
    ],
    "featured": false,
    "relatedTools": [
      "qr-location-generator",
      "qr-email-generator",
      "qr-vcard-generator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "percentage-calculator",
    "category": "calculator",
    "name": "Percentage Calculator",
    "shortDescription": "Calculate a percentage of any number.",
    "metaDescription": "Calculate percentages instantly in your browser.",
    "keywords": [
      "percentage calculator"
    ],
    "featured": true,
    "relatedTools": [
      "percentage-change-calculator",
      "discount-calculator",
      "average-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "percentage-change-calculator",
    "category": "calculator",
    "name": "Percentage Change Calculator",
    "shortDescription": "Calculate percentage increase or decrease.",
    "metaDescription": "Calculate percentage change between two values.",
    "keywords": [
      "percentage change calculator"
    ],
    "featured": true,
    "relatedTools": [
      "percentage-calculator",
      "discount-calculator",
      "average-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "discount-calculator",
    "category": "calculator",
    "name": "Discount Calculator",
    "shortDescription": "Calculate sale price and savings.",
    "metaDescription": "Calculate a discounted price and total savings.",
    "keywords": [
      "discount calculator",
      "sale price calculator"
    ],
    "featured": true,
    "relatedTools": [
      "percentage-calculator",
      "tip-calculator",
      "simple-interest-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "tip-calculator",
    "category": "calculator",
    "name": "Tip Calculator",
    "shortDescription": "Calculate tip and total per person.",
    "metaDescription": "Calculate a restaurant tip and split the total between people.",
    "keywords": [
      "tip calculator",
      "split bill calculator"
    ],
    "featured": true,
    "relatedTools": [
      "discount-calculator",
      "percentage-calculator",
      "average-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "age-calculator",
    "category": "calculator",
    "name": "Age Calculator",
    "shortDescription": "Calculate age from a date of birth.",
    "metaDescription": "Calculate age in years, months and days.",
    "keywords": [
      "age calculator",
      "birthday calculator"
    ],
    "featured": false,
    "relatedTools": [
      "date-difference-calculator",
      "time-duration-calculator",
      "average-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "bmi-calculator",
    "category": "calculator",
    "name": "BMI Calculator",
    "shortDescription": "Calculate body mass index from height and weight.",
    "metaDescription": "Calculate BMI from metric height and weight inputs.",
    "keywords": [
      "bmi calculator",
      "body mass index"
    ],
    "featured": false,
    "relatedTools": [
      "average-calculator",
      "percentage-calculator",
      "age-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "loan-calculator",
    "category": "calculator",
    "name": "Loan Calculator",
    "shortDescription": "Estimate monthly loan payments and total interest.",
    "metaDescription": "Calculate monthly payment, total payment and interest for a fixed-rate loan.",
    "keywords": [
      "loan calculator",
      "monthly payment calculator"
    ],
    "featured": false,
    "relatedTools": [
      "simple-interest-calculator",
      "compound-interest-calculator",
      "percentage-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "simple-interest-calculator",
    "category": "calculator",
    "name": "Simple Interest Calculator",
    "shortDescription": "Calculate simple interest and final amount.",
    "metaDescription": "Calculate simple interest from principal, annual rate and time.",
    "keywords": [
      "simple interest calculator"
    ],
    "featured": false,
    "relatedTools": [
      "compound-interest-calculator",
      "loan-calculator",
      "percentage-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "compound-interest-calculator",
    "category": "calculator",
    "name": "Compound Interest Calculator",
    "shortDescription": "Estimate compound growth over time.",
    "metaDescription": "Calculate compound interest with selectable compounding frequency.",
    "keywords": [
      "compound interest calculator"
    ],
    "featured": false,
    "relatedTools": [
      "simple-interest-calculator",
      "loan-calculator",
      "percentage-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "date-difference-calculator",
    "category": "calculator",
    "name": "Date Difference Calculator",
    "shortDescription": "Find the number of days between two dates.",
    "metaDescription": "Calculate the difference between two calendar dates.",
    "keywords": [
      "date difference calculator",
      "days between dates"
    ],
    "featured": false,
    "relatedTools": [
      "age-calculator",
      "time-duration-calculator",
      "average-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "time-duration-calculator",
    "category": "calculator",
    "name": "Time Duration Calculator",
    "shortDescription": "Calculate elapsed time between two times.",
    "metaDescription": "Calculate hours and minutes between two times.",
    "keywords": [
      "time duration calculator",
      "hours between times"
    ],
    "featured": false,
    "relatedTools": [
      "date-difference-calculator",
      "age-calculator",
      "average-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "average-calculator",
    "category": "calculator",
    "name": "Average Calculator",
    "shortDescription": "Calculate mean, sum, minimum and maximum.",
    "metaDescription": "Calculate summary statistics from a list of numbers.",
    "keywords": [
      "average calculator",
      "mean calculator"
    ],
    "featured": false,
    "relatedTools": [
      "percentage-calculator",
      "percentage-change-calculator",
      "date-difference-calculator"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "length-converter",
    "category": "converter",
    "name": "Length Converter",
    "shortDescription": "Convert between common length units.",
    "metaDescription": "Convert between common length units. Results update instantly and processing stays in your browser.",
    "keywords": [
      "length converter",
      "length converter"
    ],
    "featured": true,
    "relatedTools": [
      "weight-converter",
      "temperature-converter",
      "cooking-volume-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "weight-converter",
    "category": "converter",
    "name": "Weight Converter",
    "shortDescription": "Convert between common mass and weight units.",
    "metaDescription": "Convert between common mass and weight units. Results update instantly and processing stays in your browser.",
    "keywords": [
      "weight converter",
      "weight converter"
    ],
    "featured": true,
    "relatedTools": [
      "temperature-converter",
      "area-converter",
      "length-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "temperature-converter",
    "category": "converter",
    "name": "Temperature Converter",
    "shortDescription": "Convert Celsius, Fahrenheit and Kelvin.",
    "metaDescription": "Convert Celsius, Fahrenheit and Kelvin. Results update instantly and processing stays in your browser.",
    "keywords": [
      "temperature converter",
      "temperature converter"
    ],
    "featured": true,
    "relatedTools": [
      "area-converter",
      "volume-converter",
      "weight-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "area-converter",
    "category": "converter",
    "name": "Area Converter",
    "shortDescription": "Convert between common area units.",
    "metaDescription": "Convert between common area units. Results update instantly and processing stays in your browser.",
    "keywords": [
      "area converter",
      "area converter"
    ],
    "featured": true,
    "relatedTools": [
      "volume-converter",
      "speed-converter",
      "temperature-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "volume-converter",
    "category": "converter",
    "name": "Volume Converter",
    "shortDescription": "Convert between metric and imperial volume units.",
    "metaDescription": "Convert between metric and imperial volume units. Results update instantly and processing stays in your browser.",
    "keywords": [
      "volume converter",
      "volume converter"
    ],
    "featured": true,
    "relatedTools": [
      "speed-converter",
      "time-converter",
      "area-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "speed-converter",
    "category": "converter",
    "name": "Speed Converter",
    "shortDescription": "Convert between common speed units.",
    "metaDescription": "Convert between common speed units. Results update instantly and processing stays in your browser.",
    "keywords": [
      "speed converter",
      "speed converter"
    ],
    "featured": false,
    "relatedTools": [
      "time-converter",
      "data-storage-converter",
      "volume-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "time-converter",
    "category": "converter",
    "name": "Time Converter",
    "shortDescription": "Convert seconds, minutes, hours and days.",
    "metaDescription": "Convert seconds, minutes, hours and days. Results update instantly and processing stays in your browser.",
    "keywords": [
      "time converter",
      "time converter"
    ],
    "featured": false,
    "relatedTools": [
      "data-storage-converter",
      "pressure-converter",
      "speed-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "data-storage-converter",
    "category": "converter",
    "name": "Data Storage Converter",
    "shortDescription": "Convert bytes, kilobytes, megabytes and larger units.",
    "metaDescription": "Convert bytes, kilobytes, megabytes and larger units. Results update instantly and processing stays in your browser.",
    "keywords": [
      "data storage converter",
      "data storage converter"
    ],
    "featured": false,
    "relatedTools": [
      "pressure-converter",
      "energy-converter",
      "time-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "pressure-converter",
    "category": "converter",
    "name": "Pressure Converter",
    "shortDescription": "Convert pascals, bars, PSI and atmospheres.",
    "metaDescription": "Convert pascals, bars, PSI and atmospheres. Results update instantly and processing stays in your browser.",
    "keywords": [
      "pressure converter",
      "pressure converter"
    ],
    "featured": false,
    "relatedTools": [
      "energy-converter",
      "power-converter",
      "data-storage-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "energy-converter",
    "category": "converter",
    "name": "Energy Converter",
    "shortDescription": "Convert joules, calories and watt-hours.",
    "metaDescription": "Convert joules, calories and watt-hours. Results update instantly and processing stays in your browser.",
    "keywords": [
      "energy converter",
      "energy converter"
    ],
    "featured": false,
    "relatedTools": [
      "power-converter",
      "angle-converter",
      "pressure-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "power-converter",
    "category": "converter",
    "name": "Power Converter",
    "shortDescription": "Convert watts, kilowatts and horsepower.",
    "metaDescription": "Convert watts, kilowatts and horsepower. Results update instantly and processing stays in your browser.",
    "keywords": [
      "power converter",
      "power converter"
    ],
    "featured": false,
    "relatedTools": [
      "angle-converter",
      "frequency-converter",
      "energy-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "angle-converter",
    "category": "converter",
    "name": "Angle Converter",
    "shortDescription": "Convert degrees, radians and turns.",
    "metaDescription": "Convert degrees, radians and turns. Results update instantly and processing stays in your browser.",
    "keywords": [
      "angle converter",
      "angle converter"
    ],
    "featured": false,
    "relatedTools": [
      "frequency-converter",
      "force-converter",
      "power-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "frequency-converter",
    "category": "converter",
    "name": "Frequency Converter",
    "shortDescription": "Convert hertz, kilohertz, megahertz and gigahertz.",
    "metaDescription": "Convert hertz, kilohertz, megahertz and gigahertz. Results update instantly and processing stays in your browser.",
    "keywords": [
      "frequency converter",
      "frequency converter"
    ],
    "featured": false,
    "relatedTools": [
      "force-converter",
      "torque-converter",
      "angle-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "force-converter",
    "category": "converter",
    "name": "Force Converter",
    "shortDescription": "Convert newtons, pound-force and kilogram-force.",
    "metaDescription": "Convert newtons, pound-force and kilogram-force. Results update instantly and processing stays in your browser.",
    "keywords": [
      "force converter",
      "force converter"
    ],
    "featured": false,
    "relatedTools": [
      "torque-converter",
      "density-converter",
      "frequency-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "torque-converter",
    "category": "converter",
    "name": "Torque Converter",
    "shortDescription": "Convert newton-metres, pound-feet and pound-inches.",
    "metaDescription": "Convert newton-metres, pound-feet and pound-inches. Results update instantly and processing stays in your browser.",
    "keywords": [
      "torque converter",
      "torque converter"
    ],
    "featured": false,
    "relatedTools": [
      "density-converter",
      "acceleration-converter",
      "force-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "density-converter",
    "category": "converter",
    "name": "Density Converter",
    "shortDescription": "Convert common density units.",
    "metaDescription": "Convert common density units. Results update instantly and processing stays in your browser.",
    "keywords": [
      "density converter",
      "density converter"
    ],
    "featured": false,
    "relatedTools": [
      "acceleration-converter",
      "fuel-economy-converter",
      "torque-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "acceleration-converter",
    "category": "converter",
    "name": "Acceleration Converter",
    "shortDescription": "Convert metres per second squared, g-force and feet per second squared.",
    "metaDescription": "Convert metres per second squared, g-force and feet per second squared. Results update instantly and processing stays in your browser.",
    "keywords": [
      "acceleration converter",
      "acceleration converter"
    ],
    "featured": false,
    "relatedTools": [
      "fuel-economy-converter",
      "data-transfer-rate-converter",
      "density-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "fuel-economy-converter",
    "category": "converter",
    "name": "Fuel Economy Converter",
    "shortDescription": "Convert MPG and litres per 100 kilometres.",
    "metaDescription": "Convert MPG and litres per 100 kilometres. Results update instantly and processing stays in your browser.",
    "keywords": [
      "fuel economy converter",
      "fuel economy converter"
    ],
    "featured": false,
    "relatedTools": [
      "data-transfer-rate-converter",
      "cooking-volume-converter",
      "acceleration-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "data-transfer-rate-converter",
    "category": "converter",
    "name": "Data Transfer Rate Converter",
    "shortDescription": "Convert bits and bytes per second.",
    "metaDescription": "Convert bits and bytes per second. Results update instantly and processing stays in your browser.",
    "keywords": [
      "data transfer rate converter",
      "data transfer rate converter"
    ],
    "featured": false,
    "relatedTools": [
      "cooking-volume-converter",
      "length-converter",
      "fuel-economy-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "cooking-volume-converter",
    "category": "converter",
    "name": "Cooking Volume Converter",
    "shortDescription": "Convert teaspoons, tablespoons, cups and millilitres.",
    "metaDescription": "Convert teaspoons, tablespoons, cups and millilitres. Results update instantly and processing stays in your browser.",
    "keywords": [
      "cooking volume converter",
      "cooking volume converter"
    ],
    "featured": false,
    "relatedTools": [
      "length-converter",
      "weight-converter",
      "data-transfer-rate-converter"
    ],
    "faq": [
      {
        "question": "Does Toolsiva store my input?",
        "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
      },
      {
        "question": "Does this tool work on mobile devices?",
        "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
      }
    ]
  }
];

let toolsSource = fs.readFileSync(toolsPath, "utf8");
const existingSlugs = new Set(
  [...toolsSource.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]),
);
const missing = newTools.filter((tool) => !existingSlugs.has(tool.slug));

if (missing.length > 0) {
  const marker = "\n];";
  const index = toolsSource.lastIndexOf(marker);
  if (index < 0) {
    throw new Error("Could not find the tools array closing marker.");
  }

  const serialized = missing
    .map((tool) => JSON.stringify(tool, null, 2))
    .join(",\n");

  toolsSource =
    toolsSource.slice(0, index) +
    ",\n" +
    serialized +
    toolsSource.slice(index);

  fs.writeFileSync(toolsPath, toolsSource);
  console.log(`Added ${missing.length} tools.`);
} else {
  console.log("All empty-category tools already exist.");
}

let page = fs.readFileSync(pagePath, "utf8");

if (!page.includes("QrToolWorkspace")) {
  page = page.replace(
    'import SecurityToolWorkspace from "@/components/tools/SecurityToolWorkspace.astro";',
    `import SecurityToolWorkspace from "@/components/tools/SecurityToolWorkspace.astro";
import QrToolWorkspace from "@/components/tools/QrToolWorkspace.astro";
import CalculatorToolWorkspace from "@/components/tools/CalculatorToolWorkspace.astro";
import ConverterToolWorkspace from "@/components/tools/ConverterToolWorkspace.astro";`,
  );

  page = page.replace(
    '    {tool.category === "security" && <SecurityToolWorkspace mode={tool.slug} />}',
    `    {tool.category === "security" && <SecurityToolWorkspace mode={tool.slug} />}
    {tool.category === "qr" && <QrToolWorkspace mode={tool.slug} />}
    {tool.category === "calculator" && <CalculatorToolWorkspace mode={tool.slug} />}
    {tool.category === "converter" && <ConverterToolWorkspace mode={tool.slug} />}`,
  );

  fs.writeFileSync(pagePath, page);
  console.log("Updated dynamic tool route.");
}

let instructions = fs.readFileSync(instructionsPath, "utf8");

if (!instructions.includes('tool.category === "qr"')) {
  instructions = instructions.replace(
    "  return defaults;",
    `  if (tool.category === "qr") return [
    { title: "Enter the QR content", description: "Complete the fields for the text, link, contact or action." },
    { title: "Review the preview", description: "The QR code updates locally in your browser." },
    { title: "Download the QR code", description: "Save the generated PNG when it is ready." },
  ];
  if (tool.category === "calculator") return [
    { title: "Enter the values", description: "Complete the calculator fields with your numbers or dates." },
    { title: "Review the calculation", description: "Results update automatically when inputs change." },
    { title: "Adjust and compare", description: "Change any value to compare another scenario." },
  ];
  if (tool.category === "converter") return [
    { title: "Enter a value", description: "Add the number you want to convert." },
    { title: "Choose both units", description: "Select the source unit and destination unit." },
    { title: "Copy the converted value", description: "Use the live result in your work." },
  ];
  return defaults;`,
  );

  fs.writeFileSync(instructionsPath, instructions);
  console.log("Updated tool instructions.");
}
