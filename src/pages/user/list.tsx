import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserData {
  id: string;
  [key: string]: any;
}

interface FormConfig {
  fields: Array<{
    name: string;
    label: string;
    type: string;
  }>;
  listFields?: string[];
}

export default function UserList() {
  const navigate = useNavigate();
  const [data, setData] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
    loadFormConfig();
  }, []);

  const loadFormConfig = () => {
    try {
      const stored = localStorage.getItem("user_form_config");
      if (stored) {
        setFormConfig(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load form config", error);
    }
  };

  const fetchData = () => {
    try {
      const stored = localStorage.getItem("user_data");
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleDelete = (id: string) => {
    try {
      const newData = data.filter(item => item.id !== id);
      localStorage.setItem("user_data", JSON.stringify(newData));
      setData(newData);
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const filteredData = data.filter(item => {
    const searchLower = search.toLowerCase();
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get display columns from form config
  const displayFields = formConfig?.listFields && formConfig.listFields.length > 0 
    ? formConfig.listFields 
    : formConfig?.fields.map(f => f.name).slice(0, 3) || [];

  const getFieldLabel = (fieldName: string) => {
    const field = formConfig?.fields.find(f => f.name === fieldName);
    return field?.label || fieldName;
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => navigate("/user/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {displayFields.map((fieldName) => (
                <TableHead key={fieldName}>{getFieldLabel(fieldName)}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayFields.length + 1} className="text-center p-8 text-muted-foreground">
                  No data found. Click "Add New" to create your first entry.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {displayFields.map((fieldName) => (
                    <TableCell key={fieldName}>
                      {item[fieldName] !== undefined && item[fieldName] !== null 
                        ? String(item[fieldName]) 
                        : "-"}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/user/detail/${item.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/user/edit/${item.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
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
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
