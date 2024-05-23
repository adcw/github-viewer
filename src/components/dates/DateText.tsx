import { Text, TextProps } from "@mantine/core";
import { useCallback } from "react";
import { format, parseISO } from "date-fns";

export interface DateTextProps extends TextProps {
  date_string: string;
}

const DateText = ({ date_string, ...rest }: DateTextProps) => {
  const f = useCallback(() => {
    const d = parseISO(date_string);
    return format(d, "dd MMMM yyyy");
  }, [date_string]);

  return <Text {...rest}>{f()}</Text>;
};

export default DateText;
