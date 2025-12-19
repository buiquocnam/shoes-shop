'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { DateRange as DateRangeType } from '../types';

interface DateRangePickerProps {
  onChange: (range: DateRangeType) => void;
  defaultFrom?: Date;
  defaultTo?: Date;
}

export function DateRangePicker({ onChange, defaultFrom, defaultTo }: DateRangePickerProps) {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const [selected, setSelected] = React.useState<DateRange | undefined>({
    from: defaultFrom || startOfYear,
    to: defaultTo || today,
  });

  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    setSelected(range);
    if (range) {
      onChange(range);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-[280px] justify-start text-left font-normal', !selected && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected?.from && selected?.to ? (
            <>
              {format(selected.from, 'dd/MM/yyyy')} - {format(selected.to, 'dd/MM/yyyy')}
            </>
          ) : (
            <span>Chọn khoảng thời gian</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          defaultMonth={selected?.from}
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>

  );
}

