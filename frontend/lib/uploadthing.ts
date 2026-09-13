// cspell:disable-next-line
import { generateUploadButton } from "@uploadthing/react";
export const UploadButton = generateUploadButton({
  url: `${process.env.NEXT_PUBLIC_API_URL}/api/uploadthing`,
});
