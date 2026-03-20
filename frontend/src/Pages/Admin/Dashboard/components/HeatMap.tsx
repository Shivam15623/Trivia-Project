import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import { useState, memo, useRef,  useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Feature, Geometry } from "geojson";

// ─── Types ────────────────────────────────────────────────────────────────────

type CountryProperties = {
  ISO_A2?: string;
  ISO_A3?: string;
  ADM0_A3?: string; // fallback field used in Natural Earth
  name?: string;
  NAME?: string;
};

type GeoFeature = Feature<Geometry, CountryProperties> & {
  rsmKey: string;
  id?: string;
};

type UsersByCountry = {
  country: string; // ISO2 e.g. "IN", "US"
  users: number;
}[];

type Props = {
  usersByCountry: UsersByCountry;
};

type TooltipData = {
  name: string;
  users: number;
  x: number;
  y: number;
};

// ─── Use Natural Earth GeoJSON — has proper ISO_A2 and ISO_A3 fields ─────────
// The holtzy GeoJSON only has `name` — no ISO codes — which broke the lookup
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO2 → country name map for display (since world-atlas uses numeric codes)
// We build this from your usersByCountry prop directly
const iso2ToName: Record<string, string> = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AD: "Andorra",
  AO: "Angola",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BR: "Brazil",
  BN: "Brunei",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  CV: "Cabo Verde",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Congo",
  CR: "Costa Rica",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  SZ: "Eswatini",
  ET: "Ethiopia",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  GD: "Grenada",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HN: "Honduras",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Laos",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MR: "Mauritania",
  MU: "Mauritius",
  MX: "Mexico",
  FM: "Micronesia",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  QA: "Qatar",
  RO: "Romania",
  RU: "Russia",
  RW: "Rwanda",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  VC: "Saint Vincent",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome and Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  SS: "South Sudan",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syria",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "UAE",
  GB: "United Kingdom",
  US: "United States",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
};

// ISO2 → numeric code map (used by world-atlas topojson)
const iso2ToNumeric: Record<string, string> = {
  AF: "004",
  AL: "008",
  DZ: "012",
  AD: "020",
  AO: "024",
  AG: "028",
  AR: "032",
  AM: "051",
  AU: "036",
  AT: "040",
  AZ: "031",
  BS: "044",
  BH: "048",
  BD: "050",
  BB: "052",
  BY: "112",
  BE: "056",
  BZ: "084",
  BJ: "204",
  BT: "064",
  BO: "068",
  BA: "070",
  BW: "072",
  BR: "076",
  BN: "096",
  BG: "100",
  BF: "854",
  BI: "108",
  KH: "116",
  CM: "120",
  CA: "124",
  CF: "140",
  TD: "148",
  CL: "152",
  CN: "156",
  CO: "170",
  KM: "174",
  CG: "178",
  CR: "188",
  HR: "191",
  CU: "192",
  CY: "196",
  CZ: "203",
  DK: "208",
  DJ: "262",
  DO: "214",
  EC: "218",
  EG: "818",
  SV: "222",
  GQ: "226",
  ER: "232",
  EE: "233",
  SZ: "748",
  ET: "231",
  FJ: "242",
  FI: "246",
  FR: "250",
  GA: "266",
  GM: "270",
  GE: "268",
  DE: "276",
  GH: "288",
  GR: "300",
  GT: "320",
  GN: "324",
  GW: "624",
  GY: "328",
  HT: "332",
  HN: "340",
  HU: "348",
  IS: "352",
  IN: "356",
  ID: "360",
  IR: "364",
  IQ: "368",
  IE: "372",
  IL: "376",
  IT: "380",
  JM: "388",
  JP: "392",
  JO: "400",
  KZ: "398",
  KE: "404",
  KW: "414",
  KG: "417",
  LA: "418",
  LV: "428",
  LB: "422",
  LS: "426",
  LR: "430",
  LY: "434",
  LT: "440",
  LU: "442",
  MG: "450",
  MW: "454",
  MY: "458",
  ML: "466",
  MT: "470",
  MR: "478",
  MU: "480",
  MX: "484",
  MD: "498",
  MN: "496",
  ME: "499",
  MA: "504",
  MZ: "508",
  MM: "104",
  NA: "516",
  NP: "524",
  NL: "528",
  NZ: "554",
  NI: "558",
  NE: "562",
  NG: "566",
  NO: "578",
  OM: "512",
  PK: "586",
  PA: "591",
  PG: "598",
  PY: "600",
  PE: "604",
  PH: "608",
  PL: "616",
  PT: "620",
  QA: "634",
  RO: "642",
  RU: "643",
  RW: "646",
  SA: "682",
  SN: "686",
  RS: "688",
  SC: "690",
  SL: "694",
  SG: "702",
  SK: "703",
  SI: "705",
  SO: "706",
  ZA: "710",
  SS: "728",
  ES: "724",
  LK: "144",
  SD: "729",
  SR: "740",
  SE: "752",
  CH: "756",
  SY: "760",
  TJ: "762",
  TZ: "834",
  TH: "764",
  TG: "768",
  TT: "780",
  TN: "788",
  TR: "792",
  TM: "795",
  UG: "800",
  UA: "804",
  AE: "784",
  GB: "826",
  US: "840",
  UY: "858",
  UZ: "860",
  VE: "862",
  VN: "704",
  YE: "887",
  ZM: "894",
  ZW: "716",
};

const HeatMap = ({ usersByCountry }: Props) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Build numeric-code keyed map from ISO2 input ──────────────────────────
  const countryUsers = useMemo<
    Record<string, { name: string; users: number }>
  >(() => {
    if (!usersByCountry?.length) return {};
    const result: Record<string, { name: string; users: number }> = {};
    for (const { country, users } of usersByCountry) {
      const iso2 = country.toUpperCase();
      const numeric = iso2ToNumeric[iso2];
      if (numeric) {
        result[numeric] = {
          name: iso2ToName[iso2] ?? country,
          users,
        };
      }
    }
    return result;
  }, [usersByCountry]);

  const maxUsers = useMemo(
    () => Math.max(...Object.values(countryUsers).map((c) => c.users), 1),
    [countryUsers],
  );

  const colorScale = (value: number): string => {
    const ratio = value / maxUsers;
    if (ratio > 0.7) return "hsl(var(--map-high))";
    if (ratio > 0.3) return "hsl(var(--map-mid))";
    return "hsl(var(--map-low))";
  };

  const getCoords = (e: React.MouseEvent) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  };

  return (
    <GradientCard
      className="w-full  max-w-none lg:max-w-[58.69%]" // ← was max-w-[878px] fixed width
      gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
      padding={2.46}
      radius={9.84}
    >
      <div
        ref={containerRef}
        className="relative flex w-full flex-1 flex-col gap-3 p-4 sm:gap-5 sm:p-5"
      >
        <p className="text-sm font-semibold leading-tight text-white">
          Heat Map
        </p>

        {/* 
          aspect-[2/1] keeps the map proportional at any width.
          Without a fixed height or aspect ratio, ComposableMap collapses to 0.
        */}
        <div className="aspect-[2/1] flex-1 w-full">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 100, center: [10, 45] }}
            width={800}
            height={400}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: GeoFeature[] }) =>
                geographies.map((geo) => {
                  // world-atlas stores numeric code in geo.id
                  const numericId = String(geo.id ?? "");
                  const data = countryUsers[numericId];
                  const fill = data
                    ? colorScale(data.users)
                    : "hsl(var(--map-default))";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="hsl(var(--background))"
                      strokeWidth={0.4}
                      onMouseEnter={(e) => {
                        if (!data) return;
                        const coords = getCoords(e);
                        if (coords)
                          setTooltip({
                            name: data.name,
                            users: data.users,
                            ...coords,
                          });
                      }}
                      onMouseMove={(e) => {
                        if (!data) return;
                        const coords = getCoords(e);
                        if (coords)
                          setTooltip({
                            name: data.name,
                            users: data.users,
                            ...coords,
                          });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          outline: "none",
                          fill: data
                            ? "hsl(var(--map-hover))"
                            : "hsl(var(--map-default))",

                          cursor: data ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-50 rounded-lg px-3 py-2.5 shadow-xl"
            style={{
              left: tooltip.x + 12,
              top: tooltip.y + 12,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <p className="text-xs text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-gray-900">
              {tooltip.users >= 1000
                ? `${(tooltip.users / 1000).toFixed(1)}K`
                : tooltip.users}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {tooltip.name}
            </p>
          </div>
        )}
      </div>
    </GradientCard>
  );
};

export default memo(HeatMap);
