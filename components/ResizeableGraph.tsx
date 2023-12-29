import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { MarketData } from "@/lib/types/market_data";

interface Props {
  data: Array<MarketData>
  highlighted: Array<[string, string]>
}

export function ResizeableGraph({ data, highlighted }: Props) {

  const CustomTooltip = ({ payload }: { payload: Array<{[key: string]: any}>}) => {
    if (payload && payload.length > 0) {
      return `${payload[0].payload.mv} on ${new Date(payload[0].payload.ts * 1000).toLocaleString()}`
    }
    return `${highlighted[0]} on ${highlighted[1]}`;
  };

  return (
    <ResponsiveContainer
      minWidth={320}
      minHeight={320}
      width="100%"
      height={500}
    >
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Line type="monotone" dataKey="mv" stroke="#8884d8" />
        <Tooltip
          wrapperStyle={{
            visibility: "visible",
            width: "100%",
          }}
          position={{ x: 0, y: 0 }}
          content={CustomTooltip as any}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
