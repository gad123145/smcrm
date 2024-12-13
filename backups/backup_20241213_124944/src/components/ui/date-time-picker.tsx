"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { arSA } from "date-fns/locale/ar-SA";
import { enUS } from "date-fns/locale/en-US";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  className?: string;
  locale?: string;
  showTimezone?: boolean;
}

export function DateTimePicker({ 
  date, 
  setDate, 
  className,
  locale: localeOverride,
  showTimezone = true 
}: DateTimePickerProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const locale = isRTL ? arSA : enUS;
  
  return (
    <div className={cn("relative", className)}>
      <DatePicker
        selected={date}
        onChange={(date: Date) => setDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="PPP HH:mm"
        locale={localeOverride ? (isRTL ? arSA : enUS) : locale}
        placeholderText={isRTL ? "اختر التاريخ والوقت" : "Select date and time"}
        customInput={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              isRTL && "text-right flex-row-reverse"
            )}
          >
            <CalendarIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            <span>{date ? date.toLocaleDateString(isRTL ? 'ar' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : (isRTL ? "اختر التاريخ والوقت" : "Select date and time")}</span>
          </Button>
        }
        className={cn(
          "react-datepicker",
          isRTL && "rtl"
        )}
        calendarClassName={cn(
          "!bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700",
          "!rounded-lg !shadow-lg !p-4",
          "!font-sans",
          isRTL && "!font-cairo"
        )}
        dayClassName={date => cn(
          "!rounded !transition-colors",
          "hover:!bg-gray-100 dark:hover:!bg-gray-700"
        )}
        timeClassName={() => "!text-primary cursor-pointer hover:!bg-gray-100 dark:hover:!bg-gray-700 !rounded !px-2 !py-1"}
        wrapperClassName="!w-full"
        popperClassName="!z-50"
        popperPlacement={isRTL ? "bottom-end" : "bottom-start"}
        popperProps={{
          strategy: "fixed"
        }}
      />
    </div>
  );
}