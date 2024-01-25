export type DateType = Date | number | string | null;
export type PickerModeType = "date" | "time";

export interface TodoListType {
  id?: number;
  text?: string;
  dateTime?: DateType;
}

export interface ModalPropType {
  open: boolean | false;
  title: string | "";
  type: string | "";
  onAction: (status: boolean) => void;
}
