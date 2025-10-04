"use client";
import UploadFormInput from "@/components/upload/upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import React, { useRef, useState } from "react";
import { z } from "zod";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRouter } from "next/navigation";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("Uploaded Successfully");
      // You can add a success toast here if you like
      // toast.success("Upload successful!");
    },
    onUploadError: (err) => {
      console.log("error occured while uploading", err);
      toast.error("Error occured while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begun for : ", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validatedFields = schema.safeParse({ file });
      if (!validatedFields.success) {
        toast.error("❌ Something went wrong", {
          description:
            validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid file",
        });
        setIsLoading(false);

        return;
      }

      toast("📄 Uploading your PDF...", {
        description: "We are uploading your PDF! ✨",
      });

      const resp = await startUpload([file]);
      if (!resp || resp.length === 0) {
        toast.error("Something went wrong", {
          description: "Please use a different file.",
        });
        setIsLoading(false);
        return;
      }

      toast("⚙️ Processing your PDF...", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });

      // parse the pdf using lang chain
      // summarize using openai

      const result = await generatePdfSummary(resp);

      const { data = null, message = null } = result || {};

      if (data) {
        let storeResult: any;
        toast("📄 Saving PDF", {
          description: "Hang tight! We are saving your sumamry! ✨",
        });
        if (data.summary) {
          storeResult = await storePdfSummaryAction({
            summary: data.summary,
            fileUrl: resp[0].serverData.file.url,
            title: data.title,
            fileName: file.name,
          });
          // save the summary to the database
          toast("✨ Summary Generated!", {
            description: "Your PDF has been successfully summarized and saved",
          });
          formRef.current?.reset();
          router.push(`/summaries/${storeResult.data.id}`);
          //todo :  redirect to the [id] summary page
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error occured", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
