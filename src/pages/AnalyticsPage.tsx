import { useMemo } from "react"
import AppLayout from "@/components/AppLayout"
import Icon from "@/components/ui/icon"
import { ALL_POINTS, STATUS_COLORS } from "@/components/EcoMap"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const STATUS_LABELS: Record<string, string> = { good: "Норма", moderate: "Умеренно", bad: "Превышение" }

export default function AnalyticsPage() {
  const regions = Array.from(new Set(ALL_POINTS.map(p => p.region)))

  const regionStats = useMemo(() => regions.map(region => {
    const pts = ALL_POINTS.filter(p => p.region === region)
    const bad = pts.filter(p => p.status === "bad").length
    const moderate = pts.filter(p => p.status === "moderate").length
    const good = pts.filter(p => p.status === "good").length
    const index = Math.round(100 - (bad * 3 + moderate * 1) / pts.length * 20)
    return { region, bad, moderate, good, total: pts.length, index }
  }), [regions])

  const typeStats = useMemo(() => {
    return ["air", "water", "radiation", "noise"].map(type => {
      const pts = ALL_POINTS.filter(p => p.type === type)
      return {
        type,
        good: pts.filter(p => p.status === "good").length,
        moderate: pts.filter(p => p.status === "moderate").length,
        bad: pts.filter(p => p.status === "bad").length,
      }
    })
  }, [])

  const typeLabels: Record<string, string> = { air: "Воздух", water: "Вода", radiation: "Радиация", noise: "Шум" }
  const typeIcons: Record<string, string> = { air: "Wind", water: "Droplets", radiation: "RadioTower", noise: "Volume2" }

  const totalBad = ALL_POINTS.filter(p => p.status === "bad").length
  const totalMod = ALL_POINTS.filter(p => p.status === "moderate").length
  const totalGood = ALL_POINTS.filter(p => p.status === "good").length

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Аналитика</h1>
          <p className="text-white/50">Интегральные индексы и сводный анализ экологической обстановки</p>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Норма", val: totalGood, color: STATUS_COLORS.good, icon: "CheckCircle" },
            { label: "Умеренно", val: totalMod, color: STATUS_COLORS.moderate, icon: "AlertTriangle" },
            { label: "Превышение", val: totalBad, color: STATUS_COLORS.bad, icon: "XCircle" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
              <Icon name={s.icon} size={28} className="mx-auto mb-3" style={{ color: s.color }} />
              <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.val}</div>
              <div className="text-sm text-white/50">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Region index chart */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Экологический индекс по регионам</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionStats} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="region" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    const val = payload[0].value as number
                    const color = val >= 70 ? STATUS_COLORS.good : val >= 40 ? STATUS_COLORS.moderate : STATUS_COLORS.bad
                    return (
                      <div className="bg-black/90 border border-white/15 rounded-xl px-3 py-2 text-xs">
                        <div className="text-white/50 mb-1">{label}</div>
                        <div className="font-bold text-sm" style={{ color }}>Индекс: {val}</div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="index" radius={[6, 6, 0, 0]}>
                  {regionStats.map((s) => (
                    <Cell
                      key={s.region}
                      fill={s.index >= 70 ? STATUS_COLORS.good : s.index >= 40 ? STATUS_COLORS.moderate : STATUS_COLORS.bad}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {typeStats.map(ts => (
            <div key={ts.type} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon name={typeIcons[ts.type]} size={18} className="text-eco" />
                <span className="font-semibold">{typeLabels[ts.type]}</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Норма", val: ts.good, color: STATUS_COLORS.good },
                  { label: "Умеренно", val: ts.moderate, color: STATUS_COLORS.moderate },
                  { label: "Превышение", val: ts.bad, color: STATUS_COLORS.bad },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Region detail table */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8">
          <h2 className="text-xl font-bold mb-6">Детализация по регионам</h2>
          <div className="space-y-4">
            {regionStats.map(s => {
              const indexColor = s.index >= 70 ? STATUS_COLORS.good : s.index >= 40 ? STATUS_COLORS.moderate : STATUS_COLORS.bad
              return (
                <div key={s.region} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl bg-white/[0.03] ring-1 ring-white/8">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <Icon name="MapPin" size={16} className="text-eco flex-shrink-0" />
                    <span className="font-semibold text-sm">{s.region}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-6 text-sm">
                    <span className="text-white/50">{s.total} постов</span>
                    <span style={{ color: STATUS_COLORS.good }}>{s.good} норма</span>
                    <span style={{ color: STATUS_COLORS.moderate }}>{s.moderate} умеренно</span>
                    <span style={{ color: STATUS_COLORS.bad }}>{s.bad} превышение</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-white/40">Индекс:</div>
                    <div className="text-2xl font-bold" style={{ color: indexColor }}>{s.index}</div>
                    <div className="text-xs text-white/30">/100</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
