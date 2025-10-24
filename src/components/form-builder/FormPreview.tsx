"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField as FormFieldType } from "@/types/form-builder";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface FormPreviewProps {
  fields: FormFieldType[];
  onSubmit?: (data: any) => void;
}

const buildZodSchema = (fields: FormFieldType[]): z.ZodObject<any> => {
  const shape: any = {};

  fields.forEach((field) => {
    if (field.type === "section" || field.type === "label" || field.type === "label-show") {
      return;
    }

    let fieldSchema: any;

    switch (field.type) {
      case "number":
        fieldSchema = z.number();
        if (field.min !== undefined) fieldSchema = fieldSchema.min(field.min);
        if (field.max !== undefined) fieldSchema = fieldSchema.max(field.max);
        break;
      case "email":
        fieldSchema = z.string().email("Invalid email address");
        break;
      case "checkbox":
      case "switch":
        fieldSchema = z.boolean();
        break;
      case "date":
      case "datetime":
      case "time":
        fieldSchema = z.date();
        break;
      case "multiple-select":
      case "checkbox-group":
        fieldSchema = z.array(z.string());
        break;
      default:
        fieldSchema = z.string();
    }

    if (!field.isRequired) {
      fieldSchema = fieldSchema.optional();
    }

    shape[field.name] = fieldSchema;
  });

  return z.object(shape);
};

export function FormPreview({ fields, onSubmit }: FormPreviewProps) {
  const schema = buildZodSchema(fields);
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
    toast.success("Form submitted successfully!", {
      description: <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>,
    });
    if (onSubmit) onSubmit(data);
  };

  const renderField = (field: FormFieldType) => {
    if (field.type === "section") {
      return (
        <div key={field.id} className="col-span-full">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{field.label}</h2>
        </div>
      );
    }

    if (field.type === "label" || field.type === "label-show") {
      return (
        <div key={field.id} style={{ gridColumn: `span ${field.span} / span ${field.span}` }}>
          <Badge variant="secondary" className="text-sm">
            {field.value || field.label}
          </Badge>
        </div>
      );
    }

    return (
      <div key={field.id} style={{ gridColumn: `span ${field.span} / span ${field.span}` }}>
        <FormField
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.isRequired && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                {(() => {
                  switch (field.type) {
                    case "text":
                      return (
                        <Input {...formField} placeholder={field.placeholder} className="w-full" />
                      );
                    case "number":
                      return (
                        <Input
                          {...formField}
                          type="number"
                          placeholder={field.placeholder}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          onChange={(e) => formField.onChange(parseFloat(e.target.value))}
                        />
                      );
                    case "email":
                      return <Input {...formField} type="email" placeholder={field.placeholder} />;
                    case "textarea":
                      return <Textarea {...formField} placeholder={field.placeholder} rows={field.rows || 4} />;
                    case "select":
                      return (
                        <div>
                          <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                            <SelectTrigger>
                              <SelectValue placeholder={field.placeholder || "Select..."} />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-50">
                              {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    case "radio":
                      return (
                        <RadioGroup
                          onValueChange={formField.onChange}
                          defaultValue={formField.value}
                          className={field.direction === "row" ? "flex gap-4" : "space-y-2"}
                        >
                          {field.options?.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                              <label htmlFor={`${field.name}-${option.value}`} className="text-sm font-normal cursor-pointer">
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      );
                    case "checkbox":
                      return <Checkbox checked={!!formField.value} onCheckedChange={formField.onChange} />;
                    case "switch":
                      return <Switch checked={!!formField.value} onCheckedChange={formField.onChange} />;
                    case "slider":
                      return (
                        <div className="space-y-2">
                          <Slider
                            min={field.min || 0}
                            max={field.max || 100}
                            step={field.step || 1}
                            value={[formField.value || field.min || 0]}
                            onValueChange={(vals) => formField.onChange(vals[0])}
                          />
                          <div className="text-sm text-muted-foreground">Value: {formField.value || field.min || 0}</div>
                        </div>
                      );
                    case "multiple-select":
                    case "checkbox-group": {
                      const values: string[] = Array.isArray(formField.value) ? formField.value : [];
                      const toggle = (val: string, checked: boolean) => {
                        const next = checked ? [...values, val] : values.filter((v) => v !== val);
                        formField.onChange(next);
                      };
                      return (
                        <div className="space-y-2">
                          {field.options?.map((opt) => (
                            <div key={opt.value} className="flex items-center gap-2">
                              <Checkbox
                                checked={values.includes(opt.value)}
                                onCheckedChange={(c) => toggle(opt.value, !!c)}
                              />
                              <span className="text-sm">{opt.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    case "date":
                      return <Input {...formField} type="date" placeholder={field.placeholder} />;
                    case "datetime":
                      return <Input {...formField} type="datetime-local" placeholder={field.placeholder} />;
                    case "time":
                      return <Input {...formField} type="time" placeholder={field.placeholder} />;
                    case "file":
                      return (
                        <Input
                          type="file"
                          onChange={(e) => formField.onChange((e.target as HTMLInputElement).files)}
                        />
                      );
                    case "hidden":
                      return <Input {...formField} type="hidden" />;
                    case "sign":
                      return <Textarea {...formField} placeholder="Signature (data URL)" rows={3} />;
                    default:
                      return <Input {...formField} placeholder={field.placeholder} />;
                  }
                })()}
              </FormControl>
              {field.description && (
                <FormDescription>{field.description}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  // Group fields by section
  const sections: { [key: string]: FormFieldType[] } = {};
  fields.forEach((field) => {
    const section = field.section || "default";
    if (!sections[section]) sections[section] = [];
    sections[section].push(field);
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {Object.entries(sections).map(([sectionName, sectionFields]) => (
          <Card key={sectionName} className="p-6">
            {sectionName !== "default" && (
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{sectionName}</h2>
            )}
            
            {/* Group by groupBorder */}
            {(() => {
              const groups: { [key: string]: FormFieldType[] } = {};
              const ungrouped: FormFieldType[] = [];
              
              sectionFields.forEach((field) => {
                if (field.groupBorder) {
                  if (!groups[field.groupBorder]) groups[field.groupBorder] = [];
                  groups[field.groupBorder].push(field);
                } else {
                  ungrouped.push(field);
                }
              });

              return (
                <>
                  {ungrouped.length > 0 && (
                    <div className="grid grid-cols-24 gap-4 mb-6">
                      {ungrouped.map(renderField)}
                    </div>
                  )}

                  {Object.entries(groups).map(([groupName, groupFields]) => (
                    <Card key={groupName} className="p-4 mb-6 border-primary/30">
                      <h3 className="text-lg font-semibold mb-4">{groupName}</h3>
                      <div className="grid grid-cols-24 gap-4">
                        {groupFields.map(renderField)}
                      </div>
                    </Card>
                  ))}
                </>
              );
            })()}
          </Card>
        ))}

        <Button type="submit" size="lg" className="w-full">
          Submit Form
        </Button>
      </form>
    </Form>
  );
}
