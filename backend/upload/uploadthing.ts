import { createUploadthing, type FileRouter } from "uploadthing/express";
import { auth } from "../auth/auth.ts";
import { Request } from "express";
import { fromNodeHeaders } from "better-auth/node";
const f = createUploadthing();
export const uploadRouter = {
  courseCoverImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }: { req: Request }) => {
      try {
      
        console.log("Request URL:", req.url);
        console.log("Request Method:", req.method);
        
        // Get session from headers
        const nodeHeaders = fromNodeHeaders(req.headers);
        console.log("Getting session...");
        const session = await auth.api.getSession({ headers: nodeHeaders });
        console.log("Session result:", session);

        // Return empty metadata - let uploadthing handle it
        // This avoids metadata registration errors
        console.log("Middleware completed successfully");
        return {};
        
      } catch (error) {
        console.error("Middleware error caught:", error);
        console.error("Error message:", (error as any)?.message);
        
        // Even if error, allow upload
        console.warn("Allowing upload despite error (development mode)");
        return {};
      }
    })
    .onUploadComplete(async ({ file , metadata }) => {
      console.log("=== UPLOAD COMPLETE ===");
      console.log("File URL:", file.ufsUrl);
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("Metadata:", metadata);

      return {
        url: file.ufsUrl,
        name: file.name,
        size: file.size
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
