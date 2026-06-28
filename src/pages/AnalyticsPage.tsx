import { useState } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts"
import { useTheme } from "@/hooks/useTheme"

const BY_SPECIES = [
  { name: "Серый гусь",       count: 312, latin: "Anser anser" },
  { name: "Серый журавль",    count: 47,  latin: "Grus grus" },
  { name: "Серая цапля",      count: 12,  latin: "Ardea cinerea" },
  { name: "Чёрный дрозд",    count: 8,   latin: "Turdus merula" },
  { name: "Белый аист",       count: 3,   latin: "Ciconia ciconia" },
  { name: "Скопа",            count: 2,   latin: "Pandion haliaetus" },
  { name: "Беркут",           count: 2,   latin: "Aquila chrysaetos" },
  { name: "Орлан-белохвост", count: 1,   latin: "Haliaeetus albicilla" },
  { name: "Сапсан",           count: 1,   latin: "Falco peregrinus" },
]

const BY_BIOTOPE = [
  { name: "Водно-болотные угодья", value: 373 },
  { name: "Лес",                   value: 14  },
  { name: "Побережье",             value: 2   },
]

const BY_STATUS = [
  { name: "Подтверждено",      value: 7, color: "#22c55e" },
  { name: "На проверке",       value: 1, color: "#3b82f6" },
  { name: "Треб. уточнения",   value: 1, color: "#f59e0b" },
  { name: "Черновик",          value: 1, color: "#94a3b8" },
]

const TOTAL = BY_SPECIES.reduce((s, x) => s + x.count, 0)
const S = BY_SPECIES.length

function shannonIndex(data: { count: number }[]): number {
  const total = data.reduce((s, d) => s + d.count, 0)
  return -data.reduce((h, d) => {
    const p = d.count / total
    return p > 0 ? h + p * Math.log(p) : h
  }, 0)
}

function pielouIndex(H: number, S: number): number {
  return S > 1 ? H / Math.log(S) : 0
}

const H = shannonIndex(BY_SPECIES)
const E = pielouIndex(H, S)

const SPECIES_CONTRIBUTIONS = BY_SPECIES.map(d => {
  const p = d.count / TOTAL
  return { ...d, p: +(p * 100).toFixed(1), hi: p > 0 ? +(-(p * Math.log(p))).toFixed(4) : 0 }
})

const TABS = ["Общая статистика", "Индексы разнообразия", "По биотопам", "Статусы"]

const BIOTOPE_COLORS = ["#4A90D9", "#22c55e", "#f59e0b", "#e879f9", "#fb923c", "#94a3b8"]

export default function AnalyticsPage() {
  const [tab, setTab] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const tickColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)"
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"

  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Расчёт по подтверждённым наблюдениям</p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Наблюдений",     value: "10",            icon: "Eye",         color: "text-bird" },
            { label: "Суммарно особей",value: TOTAL.toString(), icon: "Bird",        color: "text-emerald-500" },
            { label: "Видов",          value: S.toString(),     icon: "List",        color: "text-purple-500" },
            { label: "Редких видов",   value: "5",              icon: "Star",        color: "text-amber-500" },
          ].map(k => (
            <div key={k.label} className="bg-muted rounded-2xl p-5 ring-1 ring-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</span>
                <Icon name={k.icon} size={15} className={k.color} />
              </div>
              <div className={`text-3xl font-bold ${k.color}`}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${tab === i ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab 0: Численность по видам */}
        {tab === 0 && (
          <div className="bg-muted rounded-2xl ring-1 ring-border p-6">
            <h2 className="font-semibold mb-5">Численность по видам</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BY_SPECIES} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fill: tickColor, fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: tickColor, fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={140}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="bg-background border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
                          <div className="font-bold">{d.name}</div>
                          <div className="text-muted-foreground italic">{d.latin}</div>
                          <div className="mt-1 text-bird font-bold text-sm">{d.count} особей</div>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="count" fill="#4A90D9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 1: Индексы */}
        {tab === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-2xl ring-1 ring-border p-6 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Индекс Шеннона (H)</div>
                <div className="text-4xl font-bold text-bird mb-1">{H.toFixed(3)}</div>
                <div className="text-xs text-muted-foreground">H = −Σ pᵢ × ln(pᵢ)</div>
              </div>
              <div className="bg-muted rounded-2xl ring-1 ring-border p-6 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Индекс Пиелоу (E)</div>
                <div className="text-4xl font-bold text-emerald-500 mb-1">{E.toFixed(3)}</div>
                <div className="text-xs text-muted-foreground">E = H / ln(S), S = {S}</div>
              </div>
              <div className="bg-muted rounded-2xl ring-1 ring-border p-6 text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Число видов (S)</div>
                <div className="text-4xl font-bold text-purple-500 mb-1">{S}</div>
                <div className="text-xs text-muted-foreground">Всего зафиксировано</div>
              </div>
            </div>

            <div className="bg-muted rounded-2xl ring-1 ring-border p-6">
              <h2 className="font-semibold mb-4">Вклады видов в индекс Шеннона</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Вид</th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">n</th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">pᵢ (%)</th>
                      <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">−pᵢ ln(pᵢ)</th>
                      <th className="py-2 px-3 text-xs text-muted-foreground font-medium">Доля</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPECIES_CONTRIBUTIONS.sort((a, b) => b.count - a.count).map(s => (
                      <tr key={s.name} className="border-b border-border/50">
                        <td className="py-2 px-3">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs italic text-muted-foreground">{s.latin}</div>
                        </td>
                        <td className="py-2 px-3 text-right">{s.count}</td>
                        <td className="py-2 px-3 text-right">{s.p}%</td>
                        <td className="py-2 px-3 text-right text-bird font-mono">{s.hi}</td>
                        <td className="py-2 px-3">
                          <div className="h-2 bg-border rounded-full overflow-hidden w-full min-w-[60px]">
                            <div className="h-full bg-bird rounded-full" style={{ width: `${s.p}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border">
                      <td className="py-2 px-3 font-bold" colSpan={3}>Итого H</td>
                      <td className="py-2 px-3 text-right font-bold text-bird">{H.toFixed(4)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: По биотопам */}
        {tab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-muted rounded-2xl ring-1 ring-border p-6">
              <h2 className="font-semibold mb-5">Численность по биотопам</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={BY_BIOTOPE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {BY_BIOTOPE.map((_, i) => (
                        <Cell key={i} fill={BIOTOPE_COLORS[i % BIOTOPE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v} особей`, "Численность"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-muted rounded-2xl ring-1 ring-border p-6">
              <h2 className="font-semibold mb-4">Таблица по биотопам</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Биотоп</th>
                    <th className="text-right py-2 text-xs text-muted-foreground font-medium">Особей</th>
                    <th className="text-right py-2 text-xs text-muted-foreground font-medium">Доля</th>
                  </tr>
                </thead>
                <tbody>
                  {BY_BIOTOPE.map((b, i) => (
                    <tr key={b.name} className="border-b border-border/50">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: BIOTOPE_COLORS[i] }} />
                          {b.name}
                        </div>
                      </td>
                      <td className="py-2 text-right font-bold text-bird">{b.value}</td>
                      <td className="py-2 text-right text-muted-foreground">{(b.value / TOTAL * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Статусы */}
        {tab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-muted rounded-2xl ring-1 ring-border p-6">
              <h2 className="font-semibold mb-5">Распределение по статусам</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={BY_STATUS} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                      {BY_STATUS.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(v: number) => [`${v} записей`, "Количество"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-muted rounded-2xl ring-1 ring-border p-6 space-y-4">
              <h2 className="font-semibold">Сводка по статусам</h2>
              {BY_STATUS.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.name}</span>
                    <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.value / 10 * 100}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </OrnithologyLayout>
  )
}
