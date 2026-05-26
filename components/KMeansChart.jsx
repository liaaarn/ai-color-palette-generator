"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function KMeansChart({ dataset, centroids }) {
  // sampling biar ringan
  const sampled = dataset
    .filter((_, i) => i % 20 === 0)
    .map((pixel) => ({
      x: pixel[0], // RED
      y: pixel[1], // GREEN
      z: pixel[2], // BLUE
      fill: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`,
    }));

  const centroidData = centroids.map((c) => ({
    x: c[0],
    y: c[1],
    z: c[2],
    fill: `rgb(${c[0]}, ${c[1]}, ${c[2]})`,
  }));

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          {/* RED */}
          <XAxis
            type="number"
            dataKey="x"
            name="Red"
            domain={[0, 255]}
            tick={{ fill: "#d1d5db" }}
            axisLine={{ stroke: "#666" }}
            tickLine={{ stroke: "#666" }}
            label={{
              value: "Red Channel",
              position: "insideBottom",
              offset: -10,
              fill: "#d1d5db",
            }}
          />

          {/* GREEN */}
          <YAxis
            type="number"
            dataKey="y"
            name="Green"
            domain={[0, 255]}
            tick={{ fill: "#d1d5db" }}
            axisLine={{ stroke: "#666" }}
            tickLine={{ stroke: "#666" }}
            label={{
              value: "Green Channel",
              angle: -90,
              position: "insideLeft",
              fill: "#d1d5db",
            }}
          />

          {/* BLUE */}
          <ZAxis type="number" dataKey="z" range={[30]} />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              background: "#1e1b4b",
              border: "1px solid #7c3aed",
              borderRadius: "12px",
              color: "white",
            }}
            formatter={(value, name, props) => {
              const p = props.payload;

              return [`RGB(${p.x}, ${p.y}, ${p.z})`, "Pixel Color"];
            }}
          />

          {/* PIXELS */}
          <Scatter
            name="Pixels"
            data={sampled}
            shape={(props) => {
              const { cx, cy, payload } = props;

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={payload.fill}
                  opacity={0.6}
                />
              );
            }}
          />

          {/* CENTROIDS */}
          <Scatter
            name="Centroids"
            data={centroidData}
            shape={(props) => {
              const { cx, cy, payload } = props;

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={10}
                  fill={payload.fill}
                  stroke="white"
                  strokeWidth={3}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
