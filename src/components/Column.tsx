"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DocumentCard } from "./DocumentCard";
import { Category, DocumentItem } from "@/types";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { Download, CloudUpload } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

interface ColumnProps {
  id: Category;
  title: string;
  documents: DocumentItem[];
  colorClass?: string;
  onDelete?: (id: string) => void;
}

export function Column({ id, title, documents, colorClass, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const handleDownloadZip = async () => {
    if (documents.length === 0) return;

    const zip = new JSZip();
    let hasFiles = false;

    documents.forEach((doc) => {
      if (doc.file) {
        zip.file(doc.file.name, doc.file);
        hasFiles = true;
      }
    });

    if (!hasFiles) {
      alert("No downloadable files in this category.");
      return;
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}_documents.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await uploadToDrive(tokenResponse.access_token);
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  const uploadToDrive = async (accessToken: string) => {
    if (documents.length === 0) return;

    const zip = new JSZip();
    let hasFiles = false;

    documents.forEach((doc) => {
      if (doc.file) {
        zip.file(doc.file.name, doc.file);
        hasFiles = true;
      }
    });

    if (!hasFiles) {
      alert("No files to save in this category.");
      return;
    }

    const content = await zip.generateAsync({ type: "blob" });
    const filename = `${title.replace(/\s+/g, "_")}_documents.zip`;

    const metadata = {
      name: filename,
      mimeType: "application/zip",
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", content);

    try {
      const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      if (res.ok) {
        alert("Successfully saved to Google Drive!");
      } else {
        const errorData = await res.json();
        console.error("Drive upload error", errorData);
        alert("Failed to save to Google Drive.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while uploading to Google Drive.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
      <div className={cn("p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between group", colorClass)}>
        <div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{documents.length} item(s)</p>
        </div>
        {documents.length > 0 && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={() => login()}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition-colors"
              title={`Save ${title} to Google Drive`}
            >
              <CloudUpload size={16} />
            </button>
            <button
              onClick={handleDownloadZip}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
              title={`Download ${title} as ZIP`}
            >
              <Download size={16} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-4 overflow-y-auto transition-colors",
          isOver ? "bg-slate-50" : "bg-transparent"
        )}
      >
        <SortableContext items={documents.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />
          ))}
        </SortableContext>
        {documents.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}
