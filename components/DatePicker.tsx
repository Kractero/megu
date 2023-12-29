"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MarketData } from "@/lib/types/market_data"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  upDate: (d: Array<Date>) => void
  data: Array<MarketData>
}

export function DatePickerWithRange({
  className, upDate, data
}: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(data[0].ts * 1000),
    to: addDays(new Date(), 0),
  })


  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    if (selectedDate) {
      if (selectedDate.from && selectedDate.to) {
        upDate([selectedDate.from, selectedDate.to]);
        setDate(selectedDate);
      }
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
