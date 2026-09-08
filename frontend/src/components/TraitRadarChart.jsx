import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const TRAIT_LABELS = {
  extraversion: "الانبساطية",
  neuroticism: "العصابية",
  agreeableness: "الطيبة",
  conscientiousness: "الضمير الحي",
  openness: "الانفتاح",
};

const TRAIT_ORDER = Object.keys(TRAIT_LABELS);

/**
 * series: [{ name, color, scores: { extraversion, neuroticism, ... } }]
 */
export default function TraitRadarChart({ series }) {
  const data = TRAIT_ORDER.map((trait) => {
    const row = { trait: TRAIT_LABELS[trait] };
    series.forEach((s) => {
      row[s.name] = Math.round(s.scores[trait] * 100);
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#3a332a" />
        <PolarAngleAxis
          dataKey="trait"
          tick={{ fill: "#ece3d3", fontSize: 13, fontFamily: "Tajawal" }}
        />
        {series.map((s) => (
          <Radar
            key={s.name}
            name={s.name}
            dataKey={s.name}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.35}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
