import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = () => {
    try {
      const stored = localStorage.getItem("user_data");
      if (stored) {
        const data = JSON.parse(stored);
        const item = data.find((d: any) => d.id === id);
        if (item) {
          form.reset(item);
        }
      }
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("user_data");
      const data = stored ? JSON.parse(stored) : [];

      if (id) {
        // Update existing
        const index = data.findIndex((d: any) => d.id === id);
        if (index !== -1) {
          data[index] = { ...data[index], ...values };
        }
        toast.success("Updated successfully");
      } else {
        // Create new
        const newItem = {
          id: Date.now().toString(),
          ...values,
          created_at: new Date().toISOString(),
        };
        data.push(newItem);
        toast.success("Created successfully");
      }

      localStorage.setItem("user_data", JSON.stringify(data));
      navigate("/user");
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">{id ? "Edit" : "Add"} User</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/user")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
