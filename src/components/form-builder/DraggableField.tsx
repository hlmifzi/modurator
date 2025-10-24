"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Edit, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/types/form-builder";
import { cn } from "@/lib/utils";

interface DraggableFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (id: string) => void;
  onDuplicate: (field: FormField) => void;
}

export function DraggableField({
  field,
  onEdit,
  onDelete,
  onDuplicate,
}: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "opacity-50")}>
      <Card className="p-4 hover:border-primary/50 transition-colors">
        <div className="flex items-start gap-3">
          <button
            className="cursor-grab active:cursor-grabbing mt-1 text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{field.type}</Badge>
              {field.section && (
                <Badge variant="secondary">{field.section}</Badge>
              )}
              {field.groupBorder && (
                <Badge variant="default">{field.groupBorder}</Badge>
              )}
            </div>

            <div>
              <p className="font-medium">{field.label || field.name}</p>
              <p className="text-sm text-muted-foreground">
                Name: {field.name} | Span: {field.span}/24
                {field.isRequired && " | Required"}
              </p>
              {field.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {field.description}
                </p>
              )}
            </div>

            {field.options && (
              <div className="text-sm text-muted-foreground">
                Options: {field.options.map((o) => o.label).join(", ")}
              </div>
            )}
          </div>

          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(field)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDuplicate(field)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(field.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
