import { DocumentBoard } from "@/components/DocumentBoard";

import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen max-h-screen overflow-hidden flex flex-col pt-4">
      <header className="px-8 pb-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Image src="/logo-v3.png" alt="GoriDoc Logo" width={40} height={40} className="rounded-lg object-cover shadow-sm border border-slate-200" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Gori<span className="text-blue-500 font-medium">Doc</span>
          </h1>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <DocumentBoard />
      </div>
    </main>
  );
}
