"use server";

import { getDbConnection } from "@/lib/db";
import generateSummaryFromGemini from "@/lib/giminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface pdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File upload failed.",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File URL not found after upload.",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    let summary;

    try {
      // First attempt: Gemini
      summary = await generateSummaryFromGemini(pdfText);
      console.log("Summary generated with Gemini.");
    } catch (geminiError) {
      console.error(
        "Gemini API failed, attempting fallback to OpenAI:",
        geminiError
      );

      // Fallback attempt: OpenAI (triggered by any Gemini failure)
      try {
        summary = await generateSummaryFromOpenAI(pdfText);
        console.log("Summary generated with OpenAI fallback.");
      } catch (openAiError) {
        // If the fallback also fails, log it, but don't throw.
        // The `!summary` check below will handle the final failure.
        console.error("OpenAI API fallback also failed:", openAiError);
      }
    }

    // This central check correctly handles all failure scenarios
    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary from all available AI providers.",
        data: null,
      };
    }

    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Summary generated successfully.",
      data: {
        title: formattedFileName,
        summary,
      },
    };
  } catch (err) {
    console.error(
      "An unexpected error occurred during summary generation:",
      err
    );
    return {
      success: false,
      // Provide a more accurate error message
      message: "An unexpected error occurred. Please try again.",
      data: null,
    };
  }
}

export async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: pdfSummaryType) {
  //sql inserting pdf summary
  try {
    const sql = await getDbConnection();
    const [savedSummary] = await sql`INSERT INTO pdf_summaries(user_id, 
      original_file_url, 
      summary_text, 
      title, 
      file_name
    ) VALUES (
      ${userId},
      ${fileUrl},
      ${summary},
      ${title},
      ${fileName}
    )RETURNING id, summary_text;`;
    return savedSummary;
  } catch (error) {
    console.error("Error saving the PDF summary");
    throw error;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: pdfSummaryType) {
  //user is logged in adn has a userId
  //savePdfSummary
  //savePdfSummary()

  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }
    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, Please try again...",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summaries",
    };
  }
  //Revalidate our cache
  revalidatePath(`/summaries/${savedSummary.id}`);
  return {
    success: true,
    message: "PDF summary saved successfully.",
    data: {
      id: savedSummary.id,
    },
  };
}
