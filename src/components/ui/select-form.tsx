import { Controller, Control } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface serviceProps {
  id: string;
  name: string;
}

interface SelectProps {
  placeholder: string;
  name: string;
  control: Control;
  disabled?: boolean;
  priority?: boolean;
  data: serviceProps[];
}

export function SelectForm({
  data,
  placeholder,
  control,
  name,
  disabled = false,
}: SelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: {} }) => (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={disabled}
        >
          <SelectTrigger className="text-zinc-500 h-[45px] w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="w-[250px]">
            {data.map((item) => {
              return (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}
    />
  );
}
