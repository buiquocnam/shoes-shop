"use client";

import * as React from "react";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker"; // type chuẩn từ thư viện

export default function DateRangePicker({
  onChange,
}: {
  onChange: (range: { from?: Date; to?: Date }) => void;
}) {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [selected, setSelected] = React.useState<DateRange | undefined>({
    from: startOfYear,
    to: today,
  });

  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) return;
    setSelected(range);
    onChange(range);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {selected?.from && selected?.to
            ? `${format(selected.from, "dd/MM/yyyy")} - ${format(selected.to, "dd/MM/yyyy")}`
            : "Select date range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={1}
             className="space-x-4 [&_td]:w-8 [&_td]:h-8 [&_td]:text-sm"
        />
      </PopoverContent>
    </Popover>
  );
}
