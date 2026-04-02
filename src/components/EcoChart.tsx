import { useMemo, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { MonitoringPoint, STATUS_COLORS, ALL_POINTS } from "@/components/EcoMap"
import Icon from "@/components/ui/icon"

const PERIOD_OPTIONS = [
  { label: "7 дней", days: 7 },
  { label: "30 дней", days: 30 },
  { label: "90 дней", days: 90 },
]

const NORM_VALUES: Record<string, number> = {
  air: 50,
  water: 6.5,
  radiation: 0.3,
  noise: 65,
}

const TYPE_ICONS: Record<string, string> = {
  air: "Wind",
  water: "Droplets",
  radiation: "RadioTower",
  noise: "Volume2",
}

const COMPARE_COLORS = ["#3DBA6F", "#60A5FA", "#F59E0B", "#E879F9", "#FB923C"]

function generateHistory(point: MonitoringPoint, days: number) {
  const seed = point.id * 1000
  const data = []
  const base = point.value
  const spread = base * 0.3
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const r1 = Math.sin(seed + i * 7.3) * 0.5 + 0.5
    const r2 = Math.cos(seed + i * 3.7) * 0.5 + 0.5
    const noise = (r1 - 0.5) * spread
    const trend = Math.sin((i / days) * Math.PI * 2) * spread * 0.3 * (r2 - 0.5)
    const val = Math.max(0, +(base + noise + trend).toFixed(2))
    data.push({
      date: date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
      [`p${point.id}`]: val,
    })
  }
  return data
}

function mergeHistories(points: MonitoringPoint[], days: number) {
  if (!points.length) return []
  const histories = points.map(p => generateHistory(p, days))
  return histories[0].map((row, i) => {
    const merged: Record<string, string | number> = { date: row.date }
    histories.forEach((h, pi) => {
      const key = `p${points[pi].id}`
      merged[key] = (h[i] as Record<string, number>)[key]
    })
    return merged
  })
}

interface MultiTooltipProps {
  active?: boolean
  payload?: Array<{ color: string; value: number; dataKey: string }>
  label?: string
  points: MonitoringPoint[]
}

function MultiTooltip({ active, payload, label, points }: MultiTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-black/90 border border-white/15 rounded-xl px-3 py-2 text-xs shadow-xl min-w-[150px]">
      <div className="text-white/50 mb-2">{label}</div>
      {payload.map((entry) => {
        const point = points.find(p => `p${p.id}` === entry.dataKey)
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
            <span className="text-white/70 truncate max-w-[110px]">{point?.name ?? entry.dataKey}</span>
            <span className="font-bold ml-auto" style={{ color: entry.color }}>{entry.value}</span>
          </div>
        )
      })}
    </div>
  )
}

interface EcoChartProps {
  selectedPoint?: MonitoringPoint | null
}

const MAX_COMPARE = 4

export default function EcoChart({ selectedPoint }: EcoChartProps) {
  const [period, setPeriod] = useState(7)
  const [mode, setMode] = useState<"single" | "compare">("single")
  const [activePointId, setActivePointId] = useState<number | null>(null)
  const [compareIds, setCompareIds] = useState<number[]>([])

  const singlePoint = selectedPoint ?? (activePointId ? ALL_POINTS.find(p => p.id === activePointId) : ALL_POINTS[0])

  const toggleCompare = (id: number) => {
    setCompareIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < MAX_COMPARE ? [...prev, id] : prev
    )
  }

  const comparePoints = useMemo(
    () => compareIds.map(id => ALL_POINTS.find(p => p.id === id)).filter(Boolean) as MonitoringPoint[],
    [compareIds]
  )

  const singleData = useMemo(() => {
    if (!singlePoint) return []
    return generateHistory(singlePoint, period)
  }, [singlePoint, period])

  const compareData = useMemo(() => {
    if (!comparePoints.length) return []
    return mergeHistories(comparePoints, period)
  }, [comparePoints, period])

  const color = singlePoint ? STATUS_COLORS[singlePoint.status] : "#3DBA6F"
  const norm = mode === "single" && singlePoint ? NORM_VALUES[singlePoint.type] : undefined

  const avg = singleData.length
    ? +(singleData.reduce((s, d) => s + (d[`p${singlePoint?.id}`] as number ?? 0), 0) / singleData.length).toFixed(2)
    : 0
  const vals = singleData.map(d => d[`p${singlePoint?.id}`] as number)
  const max = vals.length ? Math.max(...vals) : 0
  const min = vals.length ? Math.min(...vals) : 0

  const regions = Array.from(new Set(ALL_POINTS.map(p => p.region)))

  return (
    <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-1">График динамики</h3>
          <p className="text-white/50 text-sm">
            {mode === "single"
              ? singlePoint ? `${singlePoint.name} · ${singlePoint.region}` : "Выберите точку ниже"
              : comparePoints.length
                ? `Сравнение: ${comparePoints.length} точек`
                : "Выберите до 4 точек для сравнения"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Mode toggle */}
          <div className="flex rounded-full border border-white/15 overflow-hidden">
            <button
              onClick={() => setMode("single")}
              className={`px-4 py-1.5 text-sm font-semibold transition-all ${mode === "single" ? "bg-eco text-black" : "text-white/60 hover:text-white"}`}
            >
              Одна точка
            </button>
            <button
              onClick={() => setMode("compare")}
              className={`px-4 py-1.5 text-sm font-semibold transition-all ${mode === "compare" ? "bg-eco text-black" : "text-white/60 hover:text-white"}`}
            >
              Сравнение
            </button>
          </div>
          {/* Period */}
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.days}
              onClick={() => setPeriod(opt.days)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border
                ${period === opt.days
                  ? "bg-eco text-black border-eco"
                  : "bg-white/5 text-white/70 border-white/15 hover:border-eco/40"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats — single mode only */}
      {mode === "single" && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Среднее", val: avg },
            { label: "Максимум", val: max },
            { label: "Минимум", val: min },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-center">
              <div className="text-xs text-white/40 mb-1">{s.label}</div>
              <div className="text-xl font-bold" style={{ color }}>{s.val}</div>
              <div className="text-xs text-white/30">{singlePoint?.unit ?? ""}</div>
            </div>
          ))}
        </div>
      )}

      {/* Compare legend */}
      {mode === "compare" && comparePoints.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {comparePoints.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 text-xs">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COMPARE_COLORS[i] }} />
              <span className="text-white/80 max-w-[140px] truncate">{p.name}</span>
              <button onClick={() => toggleCompare(p.id)} className="text-white/30 hover:text-white ml-1">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="h-64 mb-8">
        {mode === "single" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={singleData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={period === 7 ? 0 : period === 30 ? 4 : 13}
              />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="bg-black/90 border border-white/15 rounded-xl px-3 py-2 text-xs shadow-xl">
                      <div className="text-white/50 mb-1">{label}</div>
                      <div className="font-bold text-sm" style={{ color }}>
                        {payload[0].value} <span className="text-white/50 font-normal">{singlePoint?.unit}</span>
                      </div>
                    </div>
                  )
                }}
              />
              {norm !== undefined && (
                <ReferenceLine
                  y={norm}
                  stroke="rgba(255,255,255,0.25)"
                  strokeDasharray="6 3"
                  label={{ value: "норма", fill: "rgba(255,255,255,0.3)", fontSize: 10, position: "insideTopRight" }}
                />
              )}
              <Line
                type="monotone"
                dataKey={`p${singlePoint?.id}`}
                stroke={color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: color, stroke: "#000", strokeWidth: 1.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={compareData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={period === 7 ? 0 : period === 30 ? 4 : 13}
              />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<MultiTooltip points={comparePoints} />} />
              {comparePoints.map((p, i) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={`p${p.id}`}
                  stroke={COMPARE_COLORS[i]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "#000", strokeWidth: 1 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Point Selector */}
      <div>
        <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">
          {mode === "single" ? "Выбор точки мониторинга" : `Выбор точек для сравнения (до ${MAX_COMPARE})`}
        </div>
        <div className="space-y-4">
          {regions.map(region => (
            <div key={region}>
              <div className="text-xs font-semibold text-eco/70 mb-2">{region}</div>
              <div className="flex flex-wrap gap-2">
                {ALL_POINTS.filter(p => p.region === region).map(p => {
                  const compareIdx = compareIds.indexOf(p.id)
                  const isCompareSelected = compareIdx !== -1
                  const isSingleSelected = mode === "single" && (selectedPoint?.id === p.id || (!selectedPoint && activePointId === p.id))
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (mode === "single") setActivePointId(p.id)
                        else toggleCompare(p.id)
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all
                        ${isSingleSelected ? "border-eco bg-eco/10 text-white" : ""}
                        ${isCompareSelected ? "text-white" : ""}
                        ${!isSingleSelected && !isCompareSelected ? "border-white/10 bg-white/5 text-white/60 hover:border-white/25" : ""}
                      `}
                      style={isCompareSelected ? {
                        borderColor: COMPARE_COLORS[compareIdx],
                        background: `${COMPARE_COLORS[compareIdx]}18`,
                      } : {}}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[p.status] }} />
                      <Icon name={TYPE_ICONS[p.type]} size={11} />
                      <span className="max-w-[120px] truncate">{p.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
