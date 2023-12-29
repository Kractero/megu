"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Link } from "lucide-react"
import { useState } from "react"
import { sleep } from "@/lib/sleep"
import { parseXML } from "@/lib/parseXML"
import { SeasonSelector } from "./SeasonSelector"
import { MarketData } from "@/lib/types/market_data"
import { ChartCarousel } from "./ChartCarousel"
import { ResizeableGraph } from "./ResizeableGraph"
import { Trade, TradeData } from "@/lib/types/trades_data"

const formSchema = z.object({
  season: z.union( [
    z.literal( 'All' ),
    z.literal( '1' ),
    z.literal( '2' ),
    z.literal( '3' ),
] ),
  cardName: z.string().min(2).max(50),
})

export function CardForm() {
  const [data, setData] = useState<Array<Array<MarketData>>>()
  const [highlighted, setHighlighted] = useState<any>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      season: "3",
      cardName: "Testlandia",
    },
  })

  function calculateMarketValue(trades: Array<Trade>) {
    const sumPrices = trades.reduce((sum, trade) => sum + parseFloat(trade.PRICE), 0);
    return sumPrices / trades.length;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let nation = values.cardName
    let season = values.season
    if (isNaN(Number(nation))) {
      try {
        let xmla = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=dbid`, "Kractero")
        nation = xmla.NATION.DBID
        await sleep(700)
      } catch (err) {
        console.log(err)
      }
    }
    let valuees: Array<Array<MarketData>> = []
    if (season === "All") {
      for (let v = 1; v <= 3; v++) {
        const xml: TradeData = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=card+trades;cardid=${nation};season=${v};limit=1000`, "Kractero")
        if (xml.CARD) {
          const trades = xml.CARD.TRADES.TRADE.filter(trade => trade.PRICE)
          const marketValueAtEachTrade: Array<MarketData> = trades.map((trade, i, trades) => {
            const startIndex = Math.max(0, i - 14); // Ensure the start index is not negative
            const last15Trades = trades.slice(startIndex, i + 1);

            const marketValue = last15Trades.reduce((sum, trade) => sum + parseFloat(trade.PRICE), 0)/last15Trades.length;

            return {
              "mv": marketValue,
              "ts": last15Trades[0].TIMESTAMP
            };
          });
          marketValueAtEachTrade.push()
          valuees.push(marketValueAtEachTrade.reverse())
        }
        await sleep(700)
      }
    } else {
      const xml: TradeData = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=card+trades;cardid=${nation};season=${season};limit=1000`, "Kractero")
      if (xml.CARD) {
        const trades = xml.CARD.TRADES.TRADE.filter(trade => trade.PRICE)
        const marketValueAtEachTrade = trades.map((trade, i, trades) => {
          const startIndex = Math.max(0, i - 14); // Ensure the start index is not negative
          const last15Trades = trades.slice(startIndex, i + 1);

          const marketValue = calculateMarketValue(last15Trades);

          return {
            "mv": marketValue,
            "ts": last15Trades[0].TIMESTAMP
          };
        });
        valuees = [marketValueAtEachTrade.reverse()]
        setHighlighted([xml.CARD.MARKET_VALUE, new Date(trades[0].TIMESTAMP * 1000).toLocaleString()])
      }
    }
    setData(valuees)
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-4">
        <SeasonSelector form={form} />
        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Testlandia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      {data && <div className={"min-w-xs min-h-80 w-full max-w-7xl h-80"}>
        <p>Current MV: {highlighted[0]}</p>
        <p>Last Trade: {highlighted[1]}</p>
      {data.length > 1 ?
        <ChartCarousel data={data} highlighted={highlighted} />
      : <ResizeableGraph data={data[0]} highlighted={highlighted} />}
      </div>}
    </>
  )

}