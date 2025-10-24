"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField as FormFieldType } from "@/types/form-builder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const fieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  section: z.string().optional(),
  groupBorder: z.string().optional(),
  span: z.number().min(1).max(24),
  isRequired: z.boolean(),
  defaultValue: z.any().optional(),
  addonAfter: z.string().optional(),
  addonBefore: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  rows: z.number().optional(),
  detailDescSpan: z.number().optional(),
  detailValueSpan: z.number().optional(),
  detailLabel: z.string().optional(),
});

interface FieldEditorProps {
  field: FormFieldType | null;
  open: boolean;
  onClose: () => void;
  onSave: (field: FormFieldType) => void;
}

export function FieldEditor({ field, open, onClose, onSave }: FieldEditorProps) {
  const [options, setOptions] = useState<any[]>(field?.options || []);

  const form = useForm<z.infer<typeof fieldSchema>>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: field?.name || "",
      label: field?.label || "",
      placeholder: field?.placeholder || "",
      description: field?.description || "",
      section: field?.section || "",
      groupBorder: field?.groupBorder || "",
      span: field?.span || 24,
      isRequired: field?.isRequired ?? true,
      addonAfter: field?.addonAfter || "",
      addonBefore: field?.addonBefore || "",
      min: field?.min,
      max: field?.max,
      step: field?.step,
      rows: field?.rows,
      detailDescSpan: field?.detailDescSpan || 9,
      detailValueSpan: field?.detailValueSpan || 13,
      detailLabel: field?.detailLabel || "",
    },
  });

  const onSubmit = (data: z.infer<typeof fieldSchema>) => {
    if (!field) return;

    const updatedField: FormFieldType = {
      ...field,
      ...data,
      options:
        ["select", "multiple-select", "radio", "checkbox-group"].includes(
          field.type
        )
          ? options
          : undefined,
    };

    onSave(updatedField);
    onClose();
  };

  const addOption = () => {
    setOptions([
      ...options,
      { label: `Option ${options.length + 1}`, value: `option${options.length + 1}` },
    ]);
  };

  const updateOption = (index: number, key: string, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const showOptions = field && ["select", "multiple-select", "radio", "checkbox-group"].includes(field.type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Field: {field?.type}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  {showOptions && <TabsTrigger value="options">Options</TabsTrigger>}
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Name*</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="field_name" />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this field
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Field Label" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placeholder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placeholder</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter value..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="span"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Column Span: {field.value}/24</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={24}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Grid column span (1-24)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isRequired"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Required</FormLabel>
                          <FormDescription>
                            Make this field mandatory
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="General Information" />
                        </FormControl>
                        <FormDescription>
                          Group this field under a section
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="groupBorder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Border</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Patient Info" />
                        </FormControl>
                        <FormDescription>
                          Visual grouping with border
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="addonBefore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Addon Before</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="$" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addonAfter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Addon After</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="kg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="detailDescSpan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detail Desc Span</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="detailValueSpan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detail Value Span</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="detailLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detail Label (Override)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Custom detail label" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {showOptions && (
                  <TabsContent value="options" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Options</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className="flex gap-2 p-3 border rounded-lg"
                        >
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Label"
                              value={option.label}
                              onChange={(e) =>
                                updateOption(index, "label", e.target.value)
                              }
                            />
                            <Input
                              placeholder="Value"
                              value={option.value}
                              onChange={(e) =>
                                updateOption(index, "value", e.target.value)
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
