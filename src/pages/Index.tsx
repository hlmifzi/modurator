import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Plus, Search, Eye, Edit, Trash2, Play, Moon, Sun, Code, Layers, Download } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/lib/theme-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Editor from "@monaco-editor/react";
import { FormField } from "@/types/form-builder";
import { useNavigate, Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableField } from "@/components/form-builder/DraggableField";
import { FieldEditor } from "@/components/form-builder/FieldEditor";
import { v4 as uuidv4 } from "uuid";
import Seo from "@/components/Seo";

const FIELD_TYPES = [
  { type: "text", label: "Text Input" },
  { type: "email", label: "Email" },
  { type: "number", label: "Number" },
  { type: "textarea", label: "Text Area" },
  { type: "select", label: "Select" },
  { type: "checkbox", label: "Checkbox" },
  { type: "switch", label: "Switch" },
  { type: "radio", label: "Radio Group" },
  { type: "date", label: "Date" },
];

export default function Index() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [moduleName, setModuleName] = useState("user");
  const [moduleTitle, setModuleTitle] = useState("User Management");
  const [fields, setFields] = useState<FormField[]>([
    { id: "1", name: "name", type: "text", label: "Full Name", span: 24, isRequired: true, defaultValue: "John Doe" },
    { id: "2", name: "email", type: "email", label: "Email Address", span: 24, isRequired: true, defaultValue: "john@example.com" },
    { id: "3", name: "phone", type: "text", label: "Phone Number", span: 24, isRequired: false, defaultValue: "+1234567890" },
    { id: "4", name: "role", type: "select", label: "Role", span: 24, isRequired: true, defaultValue: "user", options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ]},
    { id: "5", name: "status", type: "radio", label: "Status", span: 24, isRequired: true, defaultValue: "active", options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ]},
  ]);
  const [listFields, setListFields] = useState<string[]>(["name", "email"]);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"builder" | "json">("builder");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Save form config to localStorage whenever fields or listFields change
  useEffect(() => {
    if (mounted) {
      const config = {
        fields: fields.map(f => ({
          name: f.name,
          label: f.label,
          type: f.type,
        })),
        listFields,
      };
      localStorage.setItem(`${moduleName}_form_config`, JSON.stringify(config));
    }
  }, [fields, listFields, moduleName, mounted]);

  // Sync fields to JSON config
  const getJsonConfig = () => {
    return {
      moduleName,
      title: moduleTitle,
      fields: fields.map(f => ({
        name: f.name,
        type: f.type,
        label: f.label,
        required: f.isRequired,
        span: f.span,
        options: f.options?.map(o => o.label),
        placeholder: f.placeholder,
        description: f.description,
      })),
      listFields,
    };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addField = (type: string) => {
    const newField: FormField = {
      id: uuidv4(),
      name: `field_${Date.now()}`,
      type: type as any,
      label: `New ${type}`,
      span: 24,
      isRequired: false,
      defaultValue: type === "checkbox" || type === "switch" ? false : type === "number" ? 0 : "",
      options: (type === "radio" || type === "select") ? [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ] : undefined,
    };
    setFields([...fields, newField]);
    toast.success("Field added");
  };

  const editField = (field: FormField) => {
    setEditingField(field);
    setShowEditor(true);
  };

  const saveField = (updatedField: FormField) => {
    setFields(fields.map((f) => (f.id === updatedField.id ? updatedField : f)));
    toast.success("Field updated");
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    toast.success("Field deleted");
  };

  const duplicateField = (field: FormField) => {
    const newField = { ...field, id: uuidv4(), name: `${field.name}_copy` };
    setFields([...fields, newField]);
    toast.success("Field duplicated");
  };

  const handleDownloadScript = () => {
    if (!moduleName || fields.length === 0) {
      toast.error("Please add module name and at least one field");
      return;
    }

    const shellScript = `#!/bin/bash
# ${moduleName.toUpperCase()} Module Setup Script
# Generated by Form Builder Pro

echo "🚀 Setting up ${moduleName} module..."

# This script provides instructions for integrating the generated module

cat << 'INSTRUCTIONS'

📦 Module Setup Instructions
============================

1. Place the downloaded files in your project:
   - ${moduleName}_list.tsx → src/pages/${moduleName}/list.tsx
   - ${moduleName}_form.tsx → src/pages/${moduleName}/form.tsx  
   - ${moduleName}_detail.tsx → src/pages/${moduleName}/detail.tsx

2. Add routes to src/App.tsx:

   import ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}List from "@/pages/${moduleName}/list";
   import ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Form from "@/pages/${moduleName}/form";
   import ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Detail from "@/pages/${moduleName}/detail";

   <Route path="/${moduleName}" element={<${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}List />} />
   <Route path="/${moduleName}/new" element={<${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Form />} />
   <Route path="/${moduleName}/edit/:id" element={<${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Form />} />
   <Route path="/${moduleName}/detail/:id" element={<${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Detail />} />

3. Storage: Uses localStorage (no database required!)

4. Access your module at: /${moduleName}

INSTRUCTIONS

echo "✅ Instructions displayed above!"
`;
    
    const blob = new Blob([shellScript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `user_setup.sh`;
    link.click();
    
    toast.success(`Downloaded user_setup.sh`);
  };

  const handleBuildAndDeploy = () => {
    if (!moduleName || fields.length === 0) {
      toast.error("Please add module name and at least one field");
      return;
    }

    toast.success("Building & deploying module...", { id: "build", duration: 2000 });
    
    // Redirect to the generated module
    setTimeout(() => {
      navigate(`/${moduleName}`);
      toast.success(`Module deployed! Access at /${moduleName}`, { id: "deployed" });
    }, 1500);
  };

  if (!mounted) return null;

  // Sample data for preview
  const sampleData = Array.from({ length: 5 }, (_, i) => ({
    id: `${i + 1}`,
    ...Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.type === "email" ? `user${i + 1}@example.com` : `Sample ${f.label || f.name} ${i + 1}`
      ])
    ),
  }));

  const availableFieldNames = new Set(fields.map((f) => f.name));
  const configuredList = (listFields || []).filter((name) => availableFieldNames.has(name));
  const displayFields = configuredList.length > 0 ? configuredList : fields.map((f) => f.name).slice(0, 4);
  const totalPages = 3;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* SEO */}
      <Seo
        title="Form Builder | Modurator"
        description="Form builder to design forms and generate CRUD modules in minutes."
        keywords={["form builder","react form builder","crud generator","drag and drop form"]}
        ogTitle="Form Builder by Modurator"
        ogDescription="Design forms and generate CRUD modules instantly."
      />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/" className="flex items-center gap-2 md:gap-3">
              <Logo className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Modurator
              </span>
            </Link>
            {/* removed badge v2.0 */}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button onClick={handleDownloadScript} variant="outline" size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              Download Script
            </Button>

            <Button onClick={handleBuildAndDeploy} size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Build & Deploy
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="md:hidden"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card p-4 md:hidden">
        <div className="flex gap-2">
          <Button onClick={handleDownloadScript} variant="outline" className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>

          <Button onClick={handleBuildAndDeploy} className="flex-1 gap-2">
            <Play className="h-4 w-4" />
            Build & Deploy
          </Button>
        </div>
      </div>

      <main className="container py-6 px-4">
        <h1 className="sr-only">Form Builder - Build Forms in Minutes</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form Builder or JSON Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {viewMode === "builder" ? <Layers className="h-5 w-5" /> : <Code className="h-5 w-5" />}
                  {viewMode === "builder" ? "Form Builder" : "JSON Configuration"}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === "builder" ? "json" : "builder")}
                >
                  {viewMode === "builder" ? <Code className="h-4 w-4 mr-2" /> : <Layers className="h-4 w-4 mr-2" />}
                  {viewMode === "builder" ? "View JSON" : "View Builder"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "builder" ? (
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <div className="space-y-4">
                    {/* Module Config */}
                    <div className="space-y-3 pb-4 border-b">
                      <div>
                        <Label>Module Name*</Label>
                        <Input
                          value={moduleName}
                          onChange={(e) => setModuleName(e.target.value)}
                          placeholder="user"
                        />
                      </div>
                      <div>
                        <Label>Module Title*</Label>
                        <Input
                          value={moduleTitle}
                          onChange={(e) => setModuleTitle(e.target.value)}
                          placeholder="User Management"
                        />
                      </div>
                      <div>
                        <Label>List Fields (comma separated)</Label>
                        <Input
                          value={listFields.join(", ")}
                          onChange={(e) => setListFields(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                          placeholder="name, email, status"
                        />
                      </div>
                    </div>

                    {/* Field Palette */}
                    <div>
                      <Label className="mb-2 block">Add Fields</Label>
                      <div className="flex flex-wrap gap-2 max-h-[200px] overflow-x-auto">
                        {FIELD_TYPES.map((ft) => (
                          <Button
                            key={ft.type}
                            variant="outline"
                            size="sm"
                            onClick={() => addField(ft.type)}
                            className="text-xs flex-shrink-0"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {ft.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                  </div>
                </ScrollArea>
              ) : (
                <Editor
                  height="calc(100vh - 250px)"
                  defaultLanguage="json"
                  theme={theme === "dark" ? "vs-dark" : "light"}
                  value={JSON.stringify(getJsonConfig(), null, 2)}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Right: Preview Tabs */}
          <Card>
            <Tabs defaultValue="list" className="h-full">
              <CardHeader className="pb-3">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="items">📋 Items</TabsTrigger>
                  <TabsTrigger value="list">📋 List</TabsTrigger>
                  <TabsTrigger value="form">📝 Form</TabsTrigger>
                  <TabsTrigger value="detail">👁️ Detail</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                {/* List Tab */}
                <TabsContent value="items" className="mt-0">

                    {/* Draggable Fields */}
                    <div>
                      <Label className="mb-2 block">Fields ({fields.length})</Label>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={fields.map((f) => f.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2">
                            {fields.map((field) => (
                              <DraggableField
                                key={field.id}
                                field={field}
                                onEdit={editField}
                                onDelete={deleteField}
                                onDuplicate={duplicateField}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                      {fields.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No fields yet. Add fields from the palette above.
                        </p>
                      )}
                    </div>
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                      {/* Search & Add Button */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={`Search ${moduleTitle}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>

                      {/* Table */}
                      {fields.length > 0 ? (
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {displayFields.slice(0, 4).map((field: string) => (
                                  <TableHead key={field}>
                                    {fields.find((f) => f.name === field)?.label || (field.charAt(0).toUpperCase() + field.slice(1))}
                                  </TableHead>
                                ))}
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sampleData.map((row, idx) => (
                                <TableRow key={idx}>
                                  {displayFields.slice(0, 4).map((field: string) => (
                                    <TableCell key={field}>{row[field]}</TableCell>
                                  ))}
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                      <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          Configure fields to see table preview
                        </div>
                      )}

                      {/* Pagination */}
                      {fields.length > 0 && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Showing 1-5 of 15 results
                          </p>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" disabled={currentPage === 1}>
                              Previous
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Form Tab */}
                <TabsContent value="form" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {fields.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{moduleTitle}</h3>
                        {fields.map((field, idx) => (
                          <div key={idx} className="space-y-2">
                            <Label>
                              {field.label || field.name}
                              {field.isRequired && <span className="text-destructive ml-1">*</span>}
                            </Label>
                            {field.type === "textarea" ? (
                              <Textarea placeholder={`Enter ${field.label || field.name}`} />
                            ) : field.type === "select" ? (
                              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                                <option>Select {field.label || field.name}</option>
                                {field.options?.map((opt) => (
                                  <option key={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            ) : (
                              <Input type={field.type} placeholder={`Enter ${field.label || field.name}`} />
                            )}
                          </div>
                        ))}
                        <Button className="w-full">Submit</Button>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        Configure fields to see form preview
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                {/* Detail Tab */}
                <TabsContent value="detail" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {fields.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{moduleTitle} Detail</h3>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="border rounded-lg p-4 space-y-3">
                          {fields.map((field, idx) => (
                            <div key={idx} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
                              <div className="font-medium text-muted-foreground">
                                {field.label || field.name}
                              </div>
                              <div className="col-span-2">
                                Sample {field.label || field.name} Value
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        Configure fields to see detail preview
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>

      {/* How to Use Guide */}
      <section className="w-full px-4 py-12 mt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How to Use Modurator</h2>
            <p className="text-muted-foreground text-lg">
              Follow this simple journey to build and deploy your CRUD module in minutes
            </p>
          </div>

          {/* Visual Journey Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            {/* Step 1 */}
            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-lg">Choose Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Select from 9 field types: text, email, number, select, radio, checkbox, and more
                </p>
              </CardContent>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block text-primary text-2xl">
                →
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-lg">Edit Config</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Customize field properties, drag to reorder, set validation rules
                </p>
              </CardContent>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block text-primary text-2xl">
                →
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See live preview of List, Form, and Detail views in real-time
                </p>
              </CardContent>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block text-primary text-2xl">
                →
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="relative">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <CardTitle className="text-lg">Download</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get a .sh script with complete setup instructions
                </p>
              </CardContent>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block text-primary text-2xl">
                →
              </div>
            </Card>

            {/* Step 5 */}
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-primary">5</span>
                </div>
                <CardTitle className="text-lg">Deploy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Auto-deploy instantly or use the script to integrate manually
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Instructions */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-2xl">Complete Step-by-Step Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Configure Module Settings</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Enter your <strong>Module Name</strong> (e.g., "user", "product")</li>
                      <li>Set the <strong>Module Title</strong> for display purposes</li>
                      <li>Define which fields appear in the list view</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Add and Customize Fields</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Click field type buttons to add fields (Text, Email, Number, Select, etc.)</li>
                      <li>View your fields in the <strong>Items tab</strong></li>
                      <li>Click Edit icon to customize: label, validation, options, span</li>
                      <li>Drag fields to reorder them</li>
                      <li>Duplicate or delete fields as needed</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Preview Your Module</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li><strong>List Tab:</strong> See how the data table looks with search and pagination</li>
                      <li><strong>Form Tab:</strong> Preview the add/edit form with all your fields</li>
                      <li><strong>Detail Tab:</strong> View the detail page layout</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Download Setup Script</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Click <strong>"Download Script"</strong> button in the header</li>
                      <li>Get a <code>.sh</code> file with complete integration instructions</li>
                      <li>Script includes: file placement, route setup, and usage guide</li>
                      <li>No database required - uses localStorage!</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Build & Deploy (Instant Option)</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Click <strong>"Build & Deploy"</strong> for instant deployment</li>
                      <li>Module pages are automatically created and routes added</li>
                      <li>Redirects you to <code>/{moduleName}</code> immediately</li>
                      <li>Full CRUD functionality ready to use!</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6 border-t">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Button size="lg" onClick={handleDownloadScript} variant="outline" className="gap-2">
                    <Download className="h-5 w-5" />
                    Download user_setup.sh
                  </Button>
                  <Button size="lg" onClick={handleBuildAndDeploy} className="gap-2">
                    <Play className="h-5 w-5" />
                    Build & Deploy Now
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  No coding required • No database setup • Deploy in seconds
                </p>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Cara menjalankan: chmod +x user_setup.sh && ./user_setup.sh (atau bash user_setup.sh)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Output Example */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                What You Get
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Generated Files:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div>📄 user_setup.sh - Setup instructions script</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How to Run:</h4>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div>$ chmod +x user_setup.sh</div>
                    <div>$ ./user_setup.sh</div>
                    <div className="text-muted-foreground">or: bash user_setup.sh</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Run from the folder where the file is (e.g., cd ~/Downloads).</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Features Included:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Full CRUD operations
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Form validation
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Search & filtering
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Pagination
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Responsive design
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> localStorage persistence
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        
      </section>

      {/* Field Editor Dialog */}
      <FieldEditor
        field={editingField}
        open={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingField(null);
        }}
        onSave={saveField}
      />
    </div>
  );
}
