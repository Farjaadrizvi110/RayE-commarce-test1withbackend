import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/db/api";
import { toast } from "sonner";
import { Loader2, Upload, X, FileText } from "lucide-react";

const MAX_FILE_SIZE = 1024 * 1024;

const quoteSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company: z.string().optional(),
  project_description: z.string().min(20, "Please provide more details about your project"),
  quantity: z.string().optional(),
  deadline: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string>("");

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      company: "",
      project_description: "",
      quantity: "",
      deadline: "",
    },
  });

  const validateFileName = (fileName: string): boolean => {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    return !chineseRegex.test(fileName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setUploadError("");

    for (const file of selectedFiles) {
      if (!validateFileName(file.name)) {
        setUploadError("File names must not contain Chinese characters");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File "${file.name}" exceeds 1 MB limit`);
        return;
      }
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setUploadError("");

    try {
      let fileUrls: string[] = [];

      if (files.length > 0) {
        const uploadPromises = files.map((file) => api.uploadFile(file));
        fileUrls = await Promise.all(uploadPromises);
      }

      await api.createQuote({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        company: data.company,
        project_description: data.project_description,
        quantity: data.quantity ? Number(data.quantity) : undefined,
        deadline: data.deadline || undefined,
        file_urls: fileUrls.length > 0 ? fileUrls : undefined,
      });

      toast.success("Quote request submitted!", {
        description: "We'll get back to you within 24 hours.",
      });

      form.reset();
      setFiles([]);
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote request", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Request a Quote</h1>
          <p className="text-muted-foreground text-lg">
            Tell us about your project and we'll provide a customized quote
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Fill in the form below and we'll get back to you within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customer_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="07123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Ltd" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="project_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your printing requirements in detail..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include details about size, quantity, materials, and any special requirements
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel>Upload Artwork Files (Optional)</FormLabel>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload files (Max 1 MB each)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          File names must not contain Chinese characters
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,.ai,.eps"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {uploadError && (
                    <p className="text-sm text-destructive mt-2">{uploadError}</p>
                  )}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Submit Quote Request
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
