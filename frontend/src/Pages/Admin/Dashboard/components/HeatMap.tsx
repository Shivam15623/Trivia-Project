import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import { useState, memo, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Feature, Geometry } from "geojson";
type CountryProperties = {
  ISO_A3?: string;
  name?: string;
};
type GeoFeature = Feature<Geometry, CountryProperties> & {
  rsmKey: string;
};
const GEO_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const countryUsers: Record<string, { name: string; users: number }> = {
  USA: { name: "United States", users: 52300 },
  IND: { name: "India", users: 45600 },
  BRA: { name: "Brazil", users: 32100 },
  AUS: { name: "Australia", users: 28700 },
  CHN: { name: "China", users: 24500 },
  DEU: { name: "Germany", users: 21800 },
  GBR: { name: "United Kingdom", users: 19200 },
  FRA: { name: "France", users: 17600 },
  ARG: { name: "Argentina", users: 15400 },
  NGA: { name: "Nigeria", users: 14200 },
  ZAF: { name: "South Africa", users: 12800 },
  KAZ: { name: "Kazakhstan", users: 11500 },
  UKR: { name: "Ukraine", users: 10900 },
  POL: { name: "Poland", users: 9800 },
  KEN: { name: "Kenya", users: 8700 },
  CHL: { name: "Chile", users: 7600 },
  COL: { name: "Colombia", users: 6900 },
  PAK: { name: "Pakistan", users: 6200 },
  EGY: { name: "Egypt", users: 5800 },
  TZA: { name: "Tanzania", users: 5100 },
  IRN: { name: "Iran", users: 4800 },
  TUR: { name: "Turkey", users: 4500 },
  IDN: { name: "Indonesia", users: 4200 },
  MEX: { name: "Mexico", users: 3800 },
  SAU: { name: "Saudi Arabia", users: 3500 },
  ISL: { name: "Iceland", users: 2100 },
  ROU: { name: "Romania", users: 3200 },
  SOM: { name: "Somalia", users: 2800 },
  AGO: { name: "Angola", users: 2400 },
  MOZ: { name: "Mozambique", users: 1900 },
  PRY: { name: "Paraguay", users: 1500 },
  BOL: { name: "Bolivia", users: 1200 },
  PER: { name: "Peru", users: 3100 },
  VEN: { name: "Venezuela", users: 2700 },
  ECU: { name: "Ecuador", users: 1800 },
  CUB: { name: "Cuba", users: 900 },
  ESP: { name: "Spain", users: 8200 },
  ITA: { name: "Italy", users: 7400 },
  SWE: { name: "Sweden", users: 4100 },
  NOR: { name: "Norway", users: 3600 },
  CZE: { name: "Czech Republic", users: 2900 },
  HUN: { name: "Hungary", users: 2200 },
  SRB: { name: "Serbia", users: 1700 },
  BGR: { name: "Bulgaria", users: 1400 },
};

const maxUsers = Math.max(...Object.values(countryUsers).map((c) => c.users));

const colorScale = (value: number): string => {
  const ratio = value / maxUsers;
  if (ratio > 0.7) return "hsl(var(--map-high))";
  if (ratio > 0.3) return "hsl(var(--map-mid))";
  return "hsl(var(--map-low))";
};

interface TooltipData {
  name: string;
  users: number;
  x: number;
  y: number;
}

const HeatMap = () => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); // ← add this

  const getCoords = (e: React.MouseEvent) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
  };

  return (
    <GradientCard
      className="h-full max-h-[564px] w-full max-w-[878px]"
      gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
      padding={2.46}
      radius={9.84}
    >
      {" "}
      <div
        ref={containerRef}
        className="relative flex h-full w-full flex-col gap-5 p-5"
      >
        <p className="text-sm font-semibold leading-[100%] text-white">
          Heat Map
        </p>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 130,

            center: [10, 45], // ← was [30, 55]
          }}
          className="h-full w-full"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo: GeoFeature) => {
                const countryData =
                  countryUsers[geo.properties?.ISO_A3 ?? ""] ??
                  countryUsers[geo.id as string];
                const fillColor = countryData
                  ? colorScale(countryData.users)
                  : "hsl(var(--map-default))";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="hsl(var(--background))"
                    strokeWidth={0.5}
                    onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                      if (countryData) {
                        const coords = getCoords(e);
                        if (coords)
                          setTooltip({
                            name: countryData.name,
                            users: countryData.users,
                            ...coords,
                          });
                      }
                    }}
                    onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                      if (countryData) {
                        const coords = getCoords(e);
                        if (coords)
                          setTooltip({
                            name: countryData.name,
                            users: countryData.users,
                            ...coords,
                          });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        fill: countryData
                          ? "hsl(var(--map-hover))"
                          : "hsl(var(--map-default))",
                        cursor: countryData ? "pointer" : "default",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltip && (
          <div
            className="pointer-events-none absolute z-50 rounded-lg px-4 py-3 shadow-xl"
            style={{
              left: tooltip.x + 12,
              top: tooltip.y + 12,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-xs text-gray-500">Total User</p>
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
