import { createUploadthing, type FileRouter } from "uploadthing/express";
import { auth } from "../auth/auth.ts";
import { Request, Response } from "express";
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
      const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
      if (!session?.user) {
        throw new Error("Unauthorized");
      }
      if(session.user.role !== "Instructor")
      {
        throw new Error("Forbidden");
      }
      return {
        userId: session.user.id
      };
    })
    .onUploadComplete(async ({ file , metadata }) => {
      console.log("Course cover Image uploaded:", file.ufsUrl);
      console.log("Upload complete by:" , metadata.userId);

      return {
        url: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
