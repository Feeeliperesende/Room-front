import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  selectStatus: string;
  setSelectStatus: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectStatus({ selectStatus, setSelectStatus }: Props) {
  return (
    <Select value={selectStatus} onValueChange={setSelectStatus}>
      <SelectTrigger className="w-[180px] h-[45px] ml-2 rounded-md">
        <SelectValue placeholder="Selecione um status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="AWAITING">Aguardando</SelectItem>
          <SelectItem value="FINISHED">Finalizado</SelectItem>
          <SelectItem value="CANCELED">Cancelado</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
