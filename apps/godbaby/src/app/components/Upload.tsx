"use client";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { OurFileRouter } from "../api/uploadthing/core";
import { newPictures } from "../actions";

export default function Upload() {
  return (
    <>
      <UploadButton<OurFileRouter>
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          if (!res) return;
          newPictures(res.map((r) => ({ url: r.fileUrl })));
        }}
        onUploadError={(error: Error) => {
          console.error(error);
        }}
      />
    </>
  );
}
