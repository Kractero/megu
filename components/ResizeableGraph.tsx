import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { MarketData } from "@/lib/types/market_data";

interface Props {
  data: Array<MarketData>;
  highlighted: Array<[string, string]>;
  min: Array<Date>;
}

export function ResizeableGraph({ data, highlighted, min }: Props) {
  console.log(min);

  const CustomTooltip = ({
    payload,
  }: {
    payload: Array<{ [key: string]: any }>;
  }) => {
    if (payload && payload.length > 0) {
      return (
        <div>
          <p className="text-2xl">
            {payload[0].payload.mv < 100
              ? payload[0].payload.mv.toFixed(2)
              : payload[0].payload.mv.toFixed()}
          </p>
          <p>{new Date(payload[0].payload.ts * 1000).toLocaleString()}</p>
        </div>
      );
    }
    return (
      <div>
        <p className="text-2xl">{highlighted[0]}</p>
        <p>{highlighted[1]}</p>
      </div>
    );
  };

  return (
    <ResponsiveContainer
      minWidth={320}
      minHeight={320}
      width="100%"
      className="mb-16"
    >
      <LineChart
        width={500}
        height={500}
        data={
          min.length > 0
            ? data.filter(
                (date) =>
                  date.ts > min[0].getTime() / 1000 &&
                  date.ts < min[1].getTime() / 1000
              )
            : data
        }
        margin={{
          top: 65,
          right: 20,
          left: 20,
        }}
      >
        <Line type="monotone" dataKey="mv" stroke="#8884d8" />
        <Tooltip
          wrapperStyle={{
            visibility: "visible",
            width: "100%",
            textAlign: "center",
          }}
          position={{ x: 0, y: 0 }}
          content={<CustomTooltip payload={[]} />}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
