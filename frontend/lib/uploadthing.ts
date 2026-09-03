// cspell:disable-next-line
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "http://localhost:5000/api/uploadthing",
});
