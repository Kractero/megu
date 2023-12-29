import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { MarketData } from "@/lib/types/market_data";
import { ResizeableGraph } from "./ResizeableGraph";

interface Props {
  data: Array<Array<MarketData>>
  highlighted: Array<[string, string]>
}

export function ChartCarousel({ data, highlighted }: Props) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {Array.from({ length: data.length }).map((_, index) => (
          <CarouselItem key={index}>
            <ResizeableGraph data={data[index]} highlighted={highlighted} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
