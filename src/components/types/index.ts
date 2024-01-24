export type DateType = Date | number | string | null;
export type PickerMode = "date" | "time";

export interface todoListType {
  id?: number;
  text?: string;
  dateTime?: DateType;
}

export interface modalProps {
  open: boolean | false;
  title: string | "";
  type: string | "";
  onAction: (status: boolean) => void;
}
