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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Link } from "lucide-react"
import { XMLParser } from 'fast-xml-parser';
import { useState } from "react"
import { LineChart, Line } from 'recharts';

const formSchema = z.object({
  season: z.union( [
    z.literal( 'All' ),
    z.literal( '1' ),
    z.literal( '2' ),
    z.literal( '3' ),
] ),
  cardName: z.string().min(2).max(50),
})

export const parser = new XMLParser({ ignoreAttributes: false });

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseXML(url: string, userAgent: string, password?: string): Promise<{[key: string]: any}> {
	const headers: Record<string, string> = {
		'User-Agent': userAgent
	};

	if (password) {
		headers['X-Password'] = password;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers
	});

	if (response.status === 404) {
		throw new Error("Error 404")
	}

	if (response.status === 409) {
		return {"status": `failed with error code 409`}
	}

	if (response.status === 429) {
		await sleep(Number(response.headers.get('retry-after')) * 1000 + 2000)
		return await parseXML(url, userAgent, password ? password : "")
	}

	const xml = await response.text();
	const xmlObj = parser.parse(xml);
	return xmlObj;
}

export function CardForm() {
  const [data, setData] = useState<any>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      season: "All",
      cardName: "Testlandia",
    },
  })

  function calculateMarketValue(trades) {
    const sumPrices = trades.reduce((sum, trade) => sum + parseFloat(trade.PRICE), 0);
    console.log(sumPrices)
    return sumPrices / trades.length;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let nation = values.cardName
    if (isNaN(Number(nation))) {
      try {
        let xmla = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=dbid`, "Kractero")
        nation = xmla.NATION.DBID
      } catch (err) {
        console.log(err)
      }
    }
    const xml = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?q=card+trades;cardid=${nation};season=1;limit=1000`, "Kractero")
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
    console.log(marketValueAtEachTrade)
    setData(marketValueAtEachTrade.reverse())
  }

  return (
    <>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-4">
      <FormField
          control={form.control}
          name="season"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Season" defaultValue={"All".toString()} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"All"}>All</SelectItem>
                  <SelectItem value={"1"}>1</SelectItem>
                  <SelectItem value={"2"}>2</SelectItem>
                  <SelectItem value={"3"}>3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
    <LineChart id="Values" width={400} height={400} data={data}>
    <Line type="monotone" dataKey={"mv"} stroke="#8884d8" />
  </LineChart>
    </>
  )

}