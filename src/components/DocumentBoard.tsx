"use client";

import React, { useState, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { DocumentCard } from "./DocumentCard";
import { Category, DocumentItem } from "@/types";
import { Upload, Sparkles, Loader2, FileUp } from "lucide-react";
import { categorizeDocument } from "@/app/actions";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_CATEGORIES: string[] = [];

export function DocumentBoard() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [boardCategories, setBoardCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeDoc = documents.find((doc) => doc.id === activeId);
    if (!activeDoc) return;

    // Check if dropping on a column
    if (boardCategories.includes(overId as string)) {
      if (activeDoc.category !== overId) {
        setDocuments((docs) =>
          docs.map((doc) =>
            doc.id === activeId ? { ...doc, category: overId as Category } : doc
          )
        );
      }
      return;
    }

    // Check if dropping on another item
    const overDoc = documents.find((doc) => doc.id === overId);
    if (overDoc && activeDoc.category !== overDoc.category) {
      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === activeId ? { ...doc, category: overDoc.category } : doc
        )
      );
      return;
    }

    // Reordering within the same column
    if (activeId !== overId) {
      setDocuments((items) => {
        const oldIndex = items.findIndex((i) => i.id === activeId);
        const newIndex = items.findIndex((i) => i.id === overId);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs: DocumentItem[] = Array.from(e.target.files).map((file) => ({
        id: uuidv4(),
        title: file.name,
        category: "Messy",
        createdAt: new Date().toISOString(),
        file: file,
      }));

      setDocuments((prev) => [...prev, ...newDocs]);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDraggingOver(true);
    }
  };

  const handleFileDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newDocs: DocumentItem[] = Array.from(e.dataTransfer.files).map((file) => ({
        id: uuidv4(),
        title: file.name,
        category: "Messy",
        createdAt: new Date().toISOString(),
        file: file,
      }));

      setDocuments((prev) => [...prev, ...newDocs]);
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const autoCategorize = async () => {
    const messyDocs = documents.filter((doc) => doc.category === "Messy");
    if (messyDocs.length === 0) return;

    setIsCategorizing(true);
    try {
      const currentCategories = new Set(boardCategories);

      for (const doc of messyDocs) {
        const formData = new FormData();
        if (doc.file) {
          formData.append("file", doc.file);
        } else {
          formData.append("filename", doc.title);
        }
        
        formData.append("existingCategories", JSON.stringify(Array.from(currentCategories)));
        
        try {
          const result = await categorizeDocument(formData);
          
          if (result.error) {
            throw new Error(result.error);
          }
          
          if (result.category) {
            const newCategory = result.category;
            
            if (newCategory !== "Messy") {
              currentCategories.add(newCategory);
            }
            
            setBoardCategories(Array.from(currentCategories));

            setDocuments((prevDocs) => 
              prevDocs.map(d => d.id === doc.id ? { ...d, category: newCategory } : d)
            );
          }
        } catch (err: any) {
          console.error("Failed to categorize document:", doc.title, err);
          // If we explicitly threw the error from result.error, bubble it up to stop the loop
          throw err;
        }
        
        // Add a delay between requests to safely stay under the 15 RPM free tier limit
        await new Promise(resolve => setTimeout(resolve, 4500));
      }
    } catch (error: any) {
      console.error("Failed to categorize documents:", error);
      alert(error?.message || "Failed to categorize. Please make sure the Gemini API key is configured.");
    } finally {
      setIsCategorizing(false);
    }
  };

  const messyDocuments = documents.filter((doc) => doc.category === "Messy");
  const activeDocument = documents.find((doc) => doc.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col lg:flex-row h-full gap-6 p-6">
        
        {/* Left Column: Messy Documents */}
        <div 
          className={`w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-4 transition-all rounded-2xl ${isDraggingOver ? 'ring-2 ring-primary ring-offset-4 ring-offset-slate-50 bg-primary/5' : ''}`}
          onDragOver={handleFileDragOver}
          onDragLeave={handleFileDragLeave}
          onDrop={handleFileDrop}
        >
          <div className="glass-panel p-6 flex flex-col gap-4 shadow-sm">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Uncategorized Files
            </h2>
            <p className="text-sm text-slate-600">
              Upload your messy documents here. Drag them to a category or let AI organize them for you.
            </p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              multiple 
            />
            
            <div className="flex gap-2 mt-2">
              <button
                onClick={triggerFileUpload}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-medium transition-all shadow-sm"
              >
                <Upload size={16} />
                Upload Files
              </button>
              
              <button
                onClick={autoCategorize}
                disabled={messyDocuments.length === 0 || isCategorizing}
                className="flex-1 flex items-center justify-center gap-2 bg-primary/90 hover:bg-primary text-white shadow-lg shadow-primary/20 rounded-lg py-2.5 px-4 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCategorizing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                AI Sort
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            <Column
              id="Messy"
              title="Messy Documents"
              documents={messyDocuments}
              colorClass="text-slate-800"
              onDelete={handleDeleteDocument}
            />
          </div>
        </div>

        {/* Right Columns: Categorized Boards */}
        <div className="flex-1 flex flex-col min-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {boardCategories.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500 p-8 text-center shadow-sm">
              <div>
                <Sparkles size={48} className="mx-auto mb-4 opacity-40 text-primary" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Your AI Canvas</h3>
                <p className="max-w-md mx-auto text-slate-600">Upload some files on the left and hit "AI Sort". Gemini will automatically generate perfect folders for you right here!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[minmax(300px,_1fr)] pb-6">
              {boardCategories.map((category, index) => {
                const columnDocs = documents.filter((doc) => doc.category === category);
                
                // Assign specific colors to columns dynamically
                const colors = [
                  "border-t-2 border-t-pink-500/50",
                  "border-t-2 border-t-yellow-500/50",
                  "border-t-2 border-t-emerald-500/50",
                  "border-t-2 border-t-purple-500/50",
                  "border-t-2 border-t-blue-500/50",
                  "border-t-2 border-t-orange-500/50",
                  "border-t-2 border-t-cyan-500/50",
                  "border-t-2 border-t-rose-500/50"
                ];
                const colorClass = colors[index % colors.length];

                return (
                  <Column
                    key={category}
                    id={category}
                    title={category}
                    documents={columnDocs}
                    colorClass={colorClass}
                    onDelete={handleDeleteDocument}
                  />
                );
              })}
            </div>
          )}
        </div>

        <DragOverlay>
          {activeDocument ? <DocumentCard document={activeDocument} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
