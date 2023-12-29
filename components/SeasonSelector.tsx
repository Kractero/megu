import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<{
    season: "1" | "2" | "3" | "All";
    cardName: string;
}, any, undefined>
}

export function SeasonSelector({form}: Props) {
  return (
    <FormField
      control={form.control}
      name="season"
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Season" defaultValue={"3"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={"1"}>1</SelectItem>
              <SelectItem value={"2"}>2</SelectItem>
              <SelectItem value={"3"}>3</SelectItem>
              <SelectItem value={"All"}>All</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
