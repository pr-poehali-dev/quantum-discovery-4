import { useState } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"

const FORMATS = [
  { id: "csv",     label: "CSV",     desc: "Таблица с разделителями",          icon: "Table" },
  { id: "xlsx",    label: "Excel",   desc: "Книга Microsoft Excel",             icon: "FileSpreadsheet" },
  { id: "geojson", label: "GeoJSON", desc: "Геоданные для QGIS / ГИС-систем",  icon: "Globe" },
  { id: "pdf",     label: "PDF",     desc: "Отчёт для печати",                 icon: "FileText" },
]

export default function ExportPage() {
  const [format, setFormat] = useState("csv")
  const [onlyConfirmed, setOnlyConfirmed] = useState(true)
  const [dateFrom, setDateFrom] = useState("2024-04-01")
  const [dateTo, setDateTo] = useState("2024-12-31")

  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Экспорт данных</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Выгрузка наблюдений для внешних систем и анализа</p>
        </div>

        {/* Format */}
        <div className="bg-muted rounded-2xl ring-1 ring-border p-5">
          <h2 className="font-semibold text-sm mb-4">Формат выгрузки</h2>
          <div className="grid grid-cols-2 gap-3">
            {FORMATS.map(f => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`flex items-center gap-3 p-3 rounded-xl ring-1 text-left transition-all
                  ${format === f.id ? "ring-bird bg-bird/10" : "ring-border bg-background hover:bg-accent"}`}
              >
                <Icon name={f.icon} size={18} className={format === f.id ? "text-bird" : "text-muted-foreground"} />
                <div>
                  <div className={`font-medium text-sm ${format === f.id ? "text-bird" : ""}`}>{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-muted rounded-2xl ring-1 ring-border p-5 space-y-4">
          <h2 className="font-semibold text-sm">Фильтры выборки</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Дата с</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bird/30" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Дата по</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bird/30" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={onlyConfirmed} onChange={e => setOnlyConfirmed(e.target.checked)} className="w-4 h-4 rounded accent-bird" />
            Только подтверждённые наблюдения
          </label>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 bg-bird text-white rounded-xl font-semibold hover:bg-bird-dark transition-colors">
          <Icon name="Download" size={18} />
          Экспортировать данные
        </button>
      </div>
    </OrnithologyLayout>
  )
}
