"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { sleep } from "@/lib/sleep";
import { parseXML } from "@/lib/parseXML";
import { SeasonSelector } from "./SeasonSelector";
import { MarketData } from "@/lib/types/market_data";
import { ChartCarousel } from "./ChartCarousel";
import { ResizeableGraph } from "./ResizeableGraph";
import { Trade, TradeData } from "@/lib/types/trades_data";
import { DatePickerWithRange } from "./DatePicker";
import { pushHistory } from "@/lib/pushHistory";

const formSchema = z.object({
  season: z.union([
    z.literal("All"),
    z.literal("1"),
    z.literal("2"),
    z.literal("3"),
  ]),
  cardName: z.string().min(2).max(50),
});

export function CardForm() {
  const [data, setData] = useState<Array<Array<MarketData>>>();
  const [highlighted, setHighlighted] = useState<any>([]);
  const [min, setMin] = useState<Array<Date>>([]);
  const [error, setError] = useState("");
  const params = useSearchParams();

  const updateMin = (d: Array<Date>) => setMin(d);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      season:
        (params.get("season") as "All" | "1" | "2" | "3" | undefined) || "3",
      cardName: params.get("nation") || "Testlandia",
    },
  });

  function calculateMarketValue(trades: Array<Trade>) {
    const sumPrices = trades.reduce(
      (sum, trade) => sum + parseFloat(trade.PRICE),
      0
    );
    return sumPrices / trades.length;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let nation = values.cardName;
    let season = values.season;
    pushHistory(`?nation=${nation}&season=${season}`);
    if (isNaN(Number(nation))) {
      try {
        let xmla = await parseXML(
          `https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=dbid`,
          "Kractero"
        );
        nation = xmla.NATION.DBID;
        await sleep(700);
      } catch (err) {
        setError("Nation does not exist.");
      }
    }
    let valuees: Array<Array<MarketData>> = [];
    let bases: Array<any> = [];
    if (season === "All") {
      for (let v = 1; v <= 3; v++) {
        const xml: TradeData = await parseXML(
          `https://www.nationstates.net/cgi-bin/api.cgi?q=card+trades;cardid=${nation};season=${v};limit=1000`,
          "Kractero"
        );
        if (xml.CARD) {
          const trades = xml.CARD.TRADES.TRADE.filter((trade) => trade.PRICE);
          const marketValueAtEachTrade: Array<MarketData> = trades.map(
            (trade, i, trades) => {
              const startIndex = Math.max(0, i - 14); // Ensure the start index is not negative
              const last15Trades = trades.slice(startIndex, i + 1);

              const marketValue = calculateMarketValue(last15Trades);

              return {
                mv: marketValue,
                ts: last15Trades[0].TIMESTAMP,
              };
            }
          );
          bases.push([
            xml.CARD.MARKET_VALUE,
            new Date(trades[0].TIMESTAMP * 1000).toLocaleString(),
            v,
          ]);
          valuees.push(marketValueAtEachTrade.reverse());
        } else {
          setError(`Nation does have a card for season ${season}.`);
        }
        await sleep(700);
      }
    } else {
      const xml: TradeData = await parseXML(
        `https://www.nationstates.net/cgi-bin/api.cgi?q=card+trades;cardid=${nation};season=${season};limit=1000`,
        "Kractero"
      );
      if (xml.CARD) {
        const trades = xml.CARD.TRADES.TRADE.filter((trade) => trade.PRICE);
        const marketValueAtEachTrade = trades.map((trade, i, trades) => {
          const startIndex = Math.max(0, i - 14);
          const last15Trades = trades.slice(startIndex, i + 1);

          const marketValue = calculateMarketValue(last15Trades);

          return {
            mv: marketValue,
            ts: last15Trades[last15Trades.length - 1].TIMESTAMP,
          };
        });
        valuees = [marketValueAtEachTrade.reverse()];
        bases.push([
          xml.CARD.MARKET_VALUE,
          new Date(trades[0].TIMESTAMP * 1000).toLocaleString(),
          season,
        ]);
      } else {
        setError(`Nation does have a card for season ${season}.`);
      }
    }
    setHighlighted(bases);
    setData(valuees);
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row items-center gap-1 md:gap-4 mt-12 md:mt-24"
        >
          <div className="flex items-center gap-1">
            <SeasonSelector form={form} />
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem className="my-4 w-48">
                  <FormControl>
                    <Input
                      placeholder={params.get("nation") || "Testlandia"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            data-umami-event={`${form.getValues().cardName} for ${
              form.getValues().season
            } added`}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
      {data && data.length > 0 ? (
        <div className={"min-w-xs min-h-80 w-full max-w-7xl h-80 mt-8"}>
          {data.length > 1 ? (
            <ChartCarousel
              min={min}
              data={data}
              upDate={updateMin}
              highlighted={highlighted}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <h2 className="text-xl md:text-3xl">
                Season {highlighted[0][2]}
              </h2>
              <DatePickerWithRange data={data[0]} upDate={updateMin} />
              <ResizeableGraph
                min={min}
                data={data[0]}
                highlighted={highlighted[0]}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-red-400">{error}</p>
      )}
    </>
  );
}
