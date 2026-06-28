import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"

const REPORTS = [
  { id: 1, name: "Отчёт по весенней миграции 2024",   session: "SS-2024-001", date: "31.05.2024", status: "ready",   format: "PDF" },
  { id: 2, name: "Видовой состав — Лесостепь 2024",   session: "SS-2024-002", date: "15.07.2024", status: "draft",   format: "DOCX" },
  { id: 3, name: "Сводный отчёт осенний Кавказ 2024", session: "SS-2024-003", date: "31.10.2024", status: "ready",   format: "PDF" },
]

const STATUS_CFG: Record<string, string> = {
  ready: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-muted text-muted-foreground",
}
const STATUS_LABEL: Record<string, string> = { ready: "Готов", draft: "Черновик" }

export default function ReportsPage() {
  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Отчёты</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Сформированные и черновые отчёты</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-bird text-white rounded-lg text-sm font-medium hover:bg-bird-dark transition-colors">
            <Icon name="FilePlus" size={15} />
            Создать отчёт
          </button>
        </div>

        <div className="bg-muted rounded-2xl ring-1 ring-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Отчёт</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Сессия</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Дата</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Статус</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {REPORTS.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Icon name="FileText" size={15} className="text-bird flex-shrink-0" />
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.format}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell font-mono text-xs text-muted-foreground">{r.session}</td>
                  <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground text-xs">{r.date}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CFG[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="p-1 text-muted-foreground hover:text-foreground" title="Скачать">
                        <Icon name="Download" size={14} />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-foreground" title="Редактировать">
                        <Icon name="Pencil" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </OrnithologyLayout>
  )
}
