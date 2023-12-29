import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { MarketData } from "@/lib/types/market_data";

interface Props {
  data: Array<MarketData>
  highlighted: Array<[string, string]>
  min: Array<Date>
}

export function ResizeableGraph({ data, highlighted, min }: Props) {

  const CustomTooltip = ({ payload }: { payload: Array<{[key: string]: any}>}) => {
    if (payload && payload.length > 0) {
      return (
        <div>
          <p className="text-2xl">{payload[0].payload.mv.toFixed(0)}</p>
          <p>{new Date(payload[0].payload.ts * 1000).toLocaleString()}</p>
        </div>
      )
    }
    return (
      <div>
        <p className="text-2xl">{highlighted[0]}</p>
        <p>{highlighted[1]}</p>
      </div>
    )
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
        data={min.length > 0 ? data.filter(date => (date.ts > (min[0].getTime()/1000)) && (date.ts < (min[1].getTime()/1000))) : data}
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
            textAlign: "center",
            position: "absolute"
          }}
          position={{ x: 0, y: 0 }}
          content={<CustomTooltip payload={[]} />}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
