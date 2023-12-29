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
    <Carousel className="w-3/5 md:w-4/5">
      <CarouselContent>
        {Array.from({ length: data.length }).map((_, index) => (
          <CarouselItem
            className="flex flex-col items-center gap-2 md:gap-4"
            key={index}
          >
            <h2 className="text-xl md:text-3xl text-center">
              Season {highlighted[index][2]} - {highlighted[index][3]}
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
