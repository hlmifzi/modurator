import { FormField, FieldType } from "@/types/form-builder";
import { v4 as uuidv4 } from "uuid";

export const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "section", label: "Section Header", icon: "📑" },
  { type: "text", label: "Text Input", icon: "📝" },
  { type: "number", label: "Number Input", icon: "🔢" },
  { type: "email", label: "Email Input", icon: "📧" },
  { type: "textarea", label: "Text Area", icon: "📄" },
  { type: "select", label: "Select", icon: "📋" },
  { type: "multiple-select", label: "Multiple Select", icon: "☑️" },
  { type: "radio", label: "Radio Group", icon: "🔘" },
  { type: "checkbox", label: "Checkbox", icon: "✅" },
  { type: "checkbox-group", label: "Checkbox Group", icon: "☑️" },
  { type: "date", label: "Date Picker", icon: "📅" },
  { type: "datetime", label: "Date Time Picker", icon: "🕐" },
  { type: "time", label: "Time Picker", icon: "⏰" },
  { type: "file", label: "File Upload", icon: "📁" },
  { type: "switch", label: "Switch", icon: "🔀" },
  { type: "slider", label: "Slider", icon: "🎚️" },
  { type: "label", label: "Label", icon: "🏷️" },
  { type: "label-show", label: "Label Display", icon: "👁️" },
  { type: "sign", label: "Digital Signature", icon: "✍️" },
  { type: "hidden", label: "Hidden Field", icon: "🔒" },
];

export const createDefaultField = (type: FieldType): FormField => {
  const id = uuidv4();
  const baseField: FormField = {
    id,
    type,
    name: `${type}_${id.substring(0, 8)}`,
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    span: 24,
    isRequired: true,
  };

  // Add type-specific defaults
  if (
    ["select", "multiple-select", "radio", "checkbox-group"].includes(type)
  ) {
    baseField.options = [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
    ];
  }

  if (type === "textarea") {
    baseField.rows = 4;
  }

  if (type === "number" || type === "slider") {
    baseField.min = 0;
    baseField.max = 100;
    baseField.step = 1;
  }

  if (type === "file") {
    baseField.accept = "*";
    baseField.multiple = false;
  }

  if (type === "section") {
    baseField.label = "Section Title";
    baseField.isRequired = false;
  }

  if (type === "label-show") {
    baseField.value = "Label text";
  }

  if (type === "radio") {
    baseField.direction = "column";
  }

  return baseField;
};

export const generateFormCode = (fields: FormField[]): string => {
  return `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormFieldRenderer } from "@/components/form-builder/FormFieldRenderer";

const formSchema = z.object({
${fields
  .filter((f) => f.isRequired && f.type !== "section")
  .map(
    (f) =>
      `  ${f.name}: z.${getZodType(f.type)}${f.isRequired ? "" : ".optional()"},`,
  )
  .join("\n")}
});

export function GeneratedForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormFieldRenderer key={field.id} field={field} form={form} />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}`;
};

const getZodType = (type: FieldType): string => {
  switch (type) {
    case "number":
      return "number()";
    case "email":
      return "string().email()";
    case "checkbox":
    case "switch":
      return "boolean()";
    case "date":
    case "datetime":
    case "time":
      return "date()";
    case "multiple-select":
    case "checkbox-group":
      return "array(z.string())";
    default:
      return "string()";
  }
};

export const saveDraft = (moduleData: any) => {
  const drafts = getDrafts();
  const existingIndex = drafts.findIndex((d) => d.id === moduleData.id);

  const draft = {
    id: moduleData.id,
    moduleData,
    timestamp: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    drafts[existingIndex] = draft;
  } else {
    drafts.push(draft);
  }

  localStorage.setItem("formBuilderDrafts", JSON.stringify(drafts));
};

export const getDrafts = (): any[] => {
  if (typeof window === "undefined") return [];
  const drafts = localStorage.getItem("formBuilderDrafts");
  return drafts ? JSON.parse(drafts) : [];
};

export const deleteDraft = (id: string) => {
  const drafts = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem("formBuilderDrafts", JSON.stringify(drafts));
};

export const generateShellScript = (moduleData: any): string => {
  const { moduleName, endpoint, title, fields, listFields = [] } = moduleData;
  
  const moduleCamel = moduleName
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const displayFields = listFields.length > 0 
    ? listFields 
    : fields.filter((f: FormField) => !['section', 'label', 'hidden'].includes(f.type)).slice(0, 5).map((f: FormField) => f.name);

  return `#!/bin/bash

# Exit on any error and print each command before executing
set -ex

# Form Builder Pro - Generated Script v2.0.0
# Module: ${moduleName}
# Generated: ${new Date().toISOString()}

module="${moduleName}"
module_camel="${moduleCamel}"
title="${title}"

routePath="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Generating Full-Stack Module: \${module_camel}"
echo "📁 Base Path: \${routePath}"

# ==============================================================================
# STEP 1: Create List Page (/${moduleName})
# ==============================================================================
output_dir="\${routePath}/src/pages/${moduleName}"
mkdir -p "$output_dir"

cat <<'EOL' > "$output_dir/index.tsx"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Eye } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ${moduleCamel}List() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("${moduleName}")
        .select("*", { count: "exact" })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      ${displayFields.map((field: string) => `
      if (search) {
        query = query.ilike("${field}", \`%\${search}%\`);
      }`).join('')}

      const { data: result, error, count } = await query;

      if (error) throw error;
      setData(result || []);
      setTotal(count || 0);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase.from("${moduleName}").delete().eq("id", id);
      if (error) throw error;
      toast.success("Deleted successfully");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">${title}</h1>
        <Button onClick={() => navigate("/${moduleName}/new")}>Add New</Button>
      </div>

      <Input
        placeholder="Search ${title}..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Card className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              ${displayFields.map((field: string) => `<th className="text-left p-4 font-medium">${field.charAt(0).toUpperCase() + field.slice(1)}</th>`).join('\n              ')}
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={${displayFields.length + 1}} className="text-center p-8">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={${displayFields.length + 1}} className="text-center p-8 text-muted-foreground">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  ${displayFields.map((field: string) => `<td className="p-4">{item.${field}}</td>`).join('\n                  ')}
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(\`/${moduleName}/detail/\${item.id}\`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(\`/${moduleName}/edit/\${item.id}\`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => setPage(p)}
                  isActive={page === p}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
EOL

# ==============================================================================
# STEP 2: Create Form Page (Add/Edit)
# ==============================================================================
cat <<'EOL' > "$output_dir/form.tsx"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormPreview } from "@/components/form-builder/FormPreview";

const fields = ${JSON.stringify(fields)};

const formSchema = z.object({
${fields
  .filter((f: FormField) => f.isRequired && f.type !== 'section')
  .map((f: FormField) => `  ${f.name}: z.${getZodType(f.type)}${f.isRequired ? '' : '.optional()'},`)
  .join('\n')}
});

export default function ${moduleCamel}Form() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("${moduleName}")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      form.reset(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      if (id) {
        const { error } = await supabase
          .from("${moduleName}")
          .update(data)
          .eq("id", id);
        if (error) throw error;
        toast.success("Updated successfully");
      } else {
        const { error } = await supabase.from("${moduleName}").insert(data);
        if (error) throw error;
        toast.success("Created successfully");
      }

      navigate("/${moduleName}");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">{id ? "Edit" : "Add"} ${title}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormPreview fields={fields} form={form} />
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/${moduleName}")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
EOL

# ==============================================================================
# STEP 3: Create Detail Page
# ==============================================================================
cat <<'EOL' > "$output_dir/detail.tsx"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fields = ${JSON.stringify(fields)};

export default function ${moduleCamel}Detail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: result, error } = await supabase
        .from("${moduleName}")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setData(result);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase.from("${moduleName}").delete().eq("id", id);
      if (error) throw error;
      toast.success("Deleted successfully");
      navigate("/${moduleName}");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="container py-8">Loading...</div>;
  if (!data) return <div className="container py-8">Data not found</div>;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">${title} Detail</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(\`/${moduleName}/edit/\${id}\`)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <Card className="p-6">
        {fields
          .filter((f: any) => f.type !== 'section')
          .map((field: any) => (
            <div key={field.id} className="grid grid-cols-3 gap-4 py-3 border-b last:border-0">
              <div className="font-medium text-muted-foreground">
                {field.label || field.name}
              </div>
              <div className="col-span-2">
                {data[field.name] !== undefined && data[field.name] !== null
                  ? String(data[field.name])
                  : '-'}
              </div>
            </div>
          ))}
      </Card>

      <Button variant="outline" onClick={() => navigate("/${moduleName}")} className="mt-6">
        Back to List
      </Button>
    </div>
  );
}
EOL

# ==============================================================================
# STEP 4: Update App Routes
# ==============================================================================
echo ""
echo "✅ Module files generated successfully!"
echo ""
echo "📝 Next Steps:"
echo "1. Add these routes to your src/App.tsx:"
echo ""
echo "   import ${moduleCamel}List from '@/pages/${moduleName}';"
echo "   import ${moduleCamel}Form from '@/pages/${moduleName}/form';"
echo "   import ${moduleCamel}Detail from '@/pages/${moduleName}/detail';"
echo ""
echo "   <Route path=\"/${moduleName}\" element={<${moduleCamel}List />} />"
echo "   <Route path=\"/${moduleName}/new\" element={<${moduleCamel}Form />} />"
echo "   <Route path=\"/${moduleName}/edit/:id\" element={<${moduleCamel}Form />} />"
echo "   <Route path=\"/${moduleName}/detail/:id\" element={<${moduleCamel}Detail />} />"
echo ""
echo "2. Create the database table in Lovable Cloud:"
echo "   Table name: ${moduleName}"
echo "   Columns: ${fields.filter((f: FormField) => f.type !== 'section').map((f: FormField) => f.name).join(', ')}"
echo ""
echo "3. Test your module at: http://localhost:5173/${moduleName}"
echo ""
echo "🎉 Done! Your full-stack module is ready to use!"
`;
};
