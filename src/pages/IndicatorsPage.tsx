import AppLayout from "@/components/AppLayout"
import Icon from "@/components/ui/icon"
import { ALL_POINTS, STATUS_COLORS } from "@/components/EcoMap"

const TYPE_ICONS: Record<string, string> = {
  air: "Wind",
  water: "Droplets",
  radiation: "RadioTower",
  noise: "Volume2",
}

const TYPE_LABELS: Record<string, string> = {
  air: "Воздух",
  water: "Вода",
  radiation: "Радиация",
  noise: "Шум",
}

const STATUS_LABELS: Record<string, string> = {
  good: "Норма",
  moderate: "Умеренно",
  bad: "Превышение",
}

const SUMMARY = [
  { type: "air", label: "Воздух (PM2.5)", norm: 50, unit: "мкг/м³", icon: "Wind" },
  { type: "water", label: "Вода (pH)", norm: 6.5, unit: "pH", icon: "Droplets" },
  { type: "radiation", label: "Радиация", norm: 0.3, unit: "мкЗв/ч", icon: "RadioTower" },
  { type: "noise", label: "Шум", norm: 65, unit: "дБ", icon: "Volume2" },
]

export default function IndicatorsPage() {
  const regions = Array.from(new Set(ALL_POINTS.map(p => p.region)))

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Показатели</h1>
          <p className="text-white/50">Сводные значения по всем типам наблюдений</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {SUMMARY.map(s => {
            const pts = ALL_POINTS.filter(p => p.type === s.type)
            const avg = +(pts.reduce((a, p) => a + p.value, 0) / pts.length).toFixed(2)
            const bad = pts.filter(p => p.status === "bad").length
            const statusColor = avg > s.norm * 1.5 ? STATUS_COLORS.bad : avg > s.norm ? STATUS_COLORS.moderate : STATUS_COLORS.good
            return (
              <div key={s.type} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-eco/15 ring-1 ring-eco/30 flex items-center justify-center">
                    <Icon name={s.icon} size={16} className="text-eco" />
                  </div>
                  <span className="text-sm text-white/70">{s.label}</span>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: statusColor }}>{avg}</div>
                <div className="text-xs text-white/40 mb-3">{s.unit} · среднее</div>
                <div className="text-xs text-red-400">{bad} постов с превышением</div>
              </div>
            )
          })}
        </div>

        {/* Table by region */}
        {regions.map(region => (
          <div key={region} className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="MapPin" size={16} className="text-eco" />
              {region}
            </h2>
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-white/40">
                    <th className="text-left px-4 py-3 font-medium">Пост</th>
                    <th className="text-left px-4 py-3 font-medium">Тип</th>
                    <th className="text-right px-4 py-3 font-medium">Значение</th>
                    <th className="text-right px-4 py-3 font-medium">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_POINTS.filter(p => p.region === region).map((p, i) => (
                    <tr key={p.id} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                      <td className="px-4 py-3 text-white/80">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-white/60">
                          <Icon name={TYPE_ICONS[p.type]} size={13} />
                          {TYPE_LABELS[p.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium" style={{ color: STATUS_COLORS[p.status] }}>
                        {p.value} <span className="text-white/30 font-sans text-xs">{p.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: STATUS_COLORS[p.status] + "22", color: STATUS_COLORS[p.status] }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[p.status] }} />
                          {STATUS_LABELS[p.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
