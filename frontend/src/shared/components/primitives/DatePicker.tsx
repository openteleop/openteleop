"use client";

import * as React from "react";
import { format } from "date-fns";

import Button from "./Button";
import Calendar from "./Calendar";
import { cn } from "@shared/helpers/tailwind";
import Popover from "./Popover";
import Icon from "./Icon";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={cn("font-normal w-[280px] justify-start text-left", !date && "text-muted-foreground")}
        >
          <Icon icon="calendar" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </Popover.Content>
    </Popover.Root>
  );
}
