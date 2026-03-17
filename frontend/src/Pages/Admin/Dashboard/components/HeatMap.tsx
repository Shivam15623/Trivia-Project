import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import { useState, memo, useRef, useEffect, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Feature, Geometry } from "geojson";

type CountryProperties = {
  ISO_A2?: string;
  ISO_A3?: string;
  name?: string;
};

type GeoFeature = Feature<Geometry, CountryProperties> & {
  rsmKey: string;
};

type UsersByCountry = {
  country: string; // ISO2 e.g. "IN", "US"
  users: number;
}[];

type Props = {
  usersByCountry: UsersByCountry;
};

const GEO_URL =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

interface TooltipData {
  name: string;
  users: number;
  x: number;
  y: number;
}

const HeatMap = ({ usersByCountry }: Props) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [iso2To3, setIso2To3] = useState<Record<string, string>>({});
  console.log(usersByCountry, iso2To3);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Build ISO2 → ISO3 map from the same GeoJSON (browser cache hits) ───────
  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((geoData) => {
        const map: Record<string, string> = {};
        geoData.features.forEach((f: GeoFeature) => {
          const a2 = f.properties?.ISO_A2;
          const a3 = f.properties?.ISO_A3;
          if (a2 && a3 && a2 !== "-99") map[a2.toUpperCase()] = a3;
        });
        setIso2To3(map);
      });
  }, []);

  // ── Convert API array → ISO_A3 keyed map ─────────────────────────────────
  const countryUsers = useMemo<
    Record<string, { name: string; users: number }>
  >(() => {
    if (!usersByCountry?.length || !Object.keys(iso2To3).length) return {};
    return Object.fromEntries(
      usersByCountry
        .map(({ country, users }) => {
          const iso3 = iso2To3[country.toUpperCase()];
          if (!iso3) return null;
          return [iso3, { name: country, users }];
        })
        .filter(Boolean) as [string, { name: string; users: number }][],
    );
  }, [usersByCountry, iso2To3]);

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
      <div
        ref={containerRef}
        className="relative flex h-full w-full flex-col gap-5 p-5"
      >
        <p className="text-sm font-semibold leading-[100%] text-white">
          Heat Map
        </p>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [10, 45] }}
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
