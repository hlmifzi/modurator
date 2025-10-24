export type FieldType =
  | "text"
  | "number"
  | "email"
  | "textarea"
  | "select"
  | "multiple-select"
  | "radio"
  | "checkbox"
  | "checkbox-group"
  | "date"
  | "datetime"
  | "time"
  | "file"
  | "switch"
  | "slider"
  | "label"
  | "label-show"
  | "section"
  | "sign"
  | "hidden";

export interface FieldOption {
  label: string;
  value: string;
  inputs?: FormField[];
}

export interface FormField {
  id: string;
  type: FieldType;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  section?: string;
  groupBorder?: string;
  span: number;
  isRequired?: boolean;
  defaultValue?: any;
  options?: FieldOption[];
  inputs?: FormField[];
  addonAfter?: string;
  addonBefore?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  direction?: "row" | "column";
  detailDescSpan?: number;
  detailValueSpan?: number;
  detailLabel?: string;
  widthoutOutlineDetail?: boolean;
  value?: any;
  sign_name?: string;
  sign_role?: string;
}

export interface FormModule {
  id: string;
  name: string;
  moduleName: string;
  endpoint: string;
  title: string;
  description?: string;
  fields: FormField[];
  listFields?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DraftForm {
  id: string;
  moduleData: FormModule;
  timestamp: string;
}
