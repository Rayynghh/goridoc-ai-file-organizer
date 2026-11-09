"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DocumentItem } from "@/types";
import { FileText, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  document: DocumentItem;
  onDelete?: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: document.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center gap-3 p-3 mb-3 bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md",
        isDragging && "opacity-50 border-primary shadow-primary/20",
        "animate-fade-in"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
      >
        <GripVertical size={16} />
      </div>
      
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <FileText size={18} />
        </div>
        <div className="truncate flex-1">
          <p className="text-sm font-medium text-slate-800 truncate" title={document.title}>
            {document.title}
          </p>
        </div>
      </div>
      
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document.id);
          }}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus-within:opacity-100"
          title="Remove document"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
