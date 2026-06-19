import { TaskStatusFilter } from "@/components/TaskStatusFilter"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Plus } from "lucide-react"

export default function TaskListPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-[#111111] font-sans antialiased">
      <aside className="w-[220px] shrink-0 bg-[#f9fafb] border-r border-[#e5e7eb] flex flex-col h-full">
        <div className="px-4 py-5 border-b border-[#e5e7eb]">
          <div className="text-[17px] font-bold text-[#111111] tracking-tight">Taskflow</div>
        </div>
        
        <nav className="flex-1 p-2 space-y-0.5">
          <a
            className="flex items-center gap-[9px] px-2.5 py-2 rounded-lg text-xm font-medium transition-all text-[#6366f1] border-l-2 border-[#6366f1] bg-[#6366f1]/0.06"
            href="#"
          >
            <LayoutGrid className="size-4" />
            Задачи
          </a>
        </nav>
        
        <div className="p-4 border-t border-[#e5e7eb] flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#22c55e] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-[pulse_2.5s_ease-in-out_infinite]" />
            Подключено
          </div>
          
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-full bg-[#6366f1] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              АИ
            </div>
            <span className="text-xs text-[#6b7280] truncate flex-1 font-medium">
              alex@taskflow.ru
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-medium text-[#6b7280] bg-transparent border-[#e5e7eb] hover:text-[#111111] hover:border-[#9ca3af] hover:bg-[#f9fafb] cursor-pointer"
          >
            Выйти
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="px-8 pt-5 pb-5 border-b border-[#e5e7eb] shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#111111] tracking-tight leading-none">
              Мои задачи
            </h1>
            <Button
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-sm font-semibold cursor-pointer h-9"
            >
              <Plus className="size-4" />
              Новая задача
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-8 py-6">
          <TaskStatusFilter />
        </div>
      </main>
    </div>
  )
}

