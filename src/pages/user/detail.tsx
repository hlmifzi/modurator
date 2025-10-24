import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, Trash2, ArrowLeft } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export default function UserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = () => {
    try {
      const stored = localStorage.getItem("user_data");
      if (stored) {
        const allData = JSON.parse(stored);
        const item = allData.find((d: any) => d.id === id);
        if (item) {
          setData(item);
        } else {
          toast.error("Data not found");
          navigate("/user");
        }
      }
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const handleDelete = () => {
    try {
      const stored = localStorage.getItem("user_data");
      if (stored) {
        const allData = JSON.parse(stored);
        const newData = allData.filter((d: any) => d.id !== id);
        localStorage.setItem("user_data", JSON.stringify(newData));
        toast.success("Deleted successfully");
        navigate("/user");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (!data) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/user")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">User Detail</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/user/edit/${id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="font-medium text-muted-foreground">Full Name</div>
            <div className="col-span-2">{data.name}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="font-medium text-muted-foreground">Email Address</div>
            <div className="col-span-2">{data.email}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="font-medium text-muted-foreground">Phone Number</div>
            <div className="col-span-2">{data.phone || "-"}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-3">
            <div className="font-medium text-muted-foreground">Created At</div>
            <div className="col-span-2">
              {new Date(data.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
