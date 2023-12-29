import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MarketData } from "@/lib/types/market_data";
import { ResizeableGraph } from "./ResizeableGraph";
import { DatePickerWithRange } from "./DatePicker";

interface Props {
  data: Array<Array<MarketData>>;
  highlighted: Array<Array<[string, string]>>;
  min: Array<Date>;
  upDate: (d: Array<Date>) => void;
}

export function ChartCarousel({ data, highlighted, min, upDate }: Props) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {Array.from({ length: data.length }).map((_, index) => (
          <CarouselItem
            className="flex flex-col items-center gap-2 md:gap-4"
            key={index}
          >
            <h2 className="text-xl md:text-3xl">
              Season {highlighted[index][2]}
            </h2>
            <DatePickerWithRange data={data[index]} upDate={upDate} />
            <ResizeableGraph
              min={min}
              data={data[index]}
              highlighted={highlighted[index]}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
