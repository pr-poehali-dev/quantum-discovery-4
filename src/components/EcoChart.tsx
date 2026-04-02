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

function generateHistory(point: MonitoringPoint, days: number) {
  const data = []
  const base = point.value
  const spread = base * 0.3
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const noise = (Math.random() - 0.5) * spread
    const trend = Math.sin((i / days) * Math.PI * 2) * spread * 0.3
    const val = Math.max(0, +(base + noise + trend).toFixed(2))
    data.push({
      date: date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
      value: val,
    })
  }
  return data
}

const TYPE_LABELS: Record<string, string> = {
  air: "Воздух (PM2.5)",
  water: "Вода (pH)",
  radiation: "Радиация",
  noise: "Шум",
}

const TYPE_ICONS: Record<string, string> = {
  air: "Wind",
  water: "Droplets",
  radiation: "RadioTower",
  noise: "Volume2",
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  unit: string
  color: string
}

function CustomTooltip({ active, payload, label, unit, color }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-black/90 border border-white/15 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-white/50 mb-1">{label}</div>
      <div className="font-bold text-sm" style={{ color }}>
        {payload[0].value} <span className="text-white/50 font-normal">{unit}</span>
      </div>
    </div>
  )
}

interface EcoChartProps {
  selectedPoint?: MonitoringPoint | null
}

export default function EcoChart({ selectedPoint }: EcoChartProps) {
  const [period, setPeriod] = useState(7)
  const [activePointId, setActivePointId] = useState<number | null>(null)

  const displayPoint = selectedPoint ?? (activePointId ? ALL_POINTS.find(p => p.id === activePointId) : ALL_POINTS[0])

  const chartData = useMemo(() => {
    if (!displayPoint) return []
    return generateHistory(displayPoint, period)
  }, [displayPoint, period])

  const color = displayPoint ? STATUS_COLORS[displayPoint.status] : "#3DBA6F"
  const norm = displayPoint ? NORM_VALUES[displayPoint.type] : undefined

  const avg = chartData.length
    ? +(chartData.reduce((s, d) => s + d.value, 0) / chartData.length).toFixed(2)
    : 0
  const max = chartData.length ? Math.max(...chartData.map(d => d.value)) : 0
  const min = chartData.length ? Math.min(...chartData.map(d => d.value)) : 0

  const regions = Array.from(new Set(ALL_POINTS.map(p => p.region)))

  return (
    <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-1">График динамики</h3>
          <p className="text-white/50 text-sm">
            {displayPoint
              ? `${displayPoint.name} · ${displayPoint.region}`
              : "Выберите точку на карте или ниже"}
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Среднее", val: avg },
          { label: "Максимум", val: max },
          { label: "Минимум", val: min },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-center">
            <div className="text-xs text-white/40 mb-1">{s.label}</div>
            <div className="text-xl font-bold" style={{ color }}>
              {s.val}
            </div>
            <div className="text-xs text-white/30">{displayPoint?.unit ?? ""}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={period === 7 ? 0 : period === 30 ? 4 : 13}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip unit={displayPoint?.unit ?? ""} color={color} />} />
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
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: color, stroke: "#000", strokeWidth: 1.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Point Selector */}
      <div>
        <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Выбор точки мониторинга</div>
        <div className="space-y-4">
          {regions.map(region => (
            <div key={region}>
              <div className="text-xs font-semibold text-eco/70 mb-2">{region}</div>
              <div className="flex flex-wrap gap-2">
                {ALL_POINTS.filter(p => p.region === region).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePointId(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all
                      ${(selectedPoint?.id === p.id || (!selectedPoint && activePointId === p.id))
                        ? "border-eco bg-eco/10 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/25"
                      }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: STATUS_COLORS[p.status] }}
                    />
                    <Icon name={TYPE_ICONS[p.type]} size={11} />
                    <span className="max-w-[120px] truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
