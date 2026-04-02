import AppLayout from "@/components/AppLayout"
import Icon from "@/components/ui/icon"
import { ALL_POINTS } from "@/components/EcoMap"

const TECH_STACK = [
  { name: "React + TypeScript", desc: "Фронтенд SPA", icon: "Code2" },
  { name: "Leaflet.js", desc: "Интерактивные карты", icon: "Map" },
  { name: "Recharts", desc: "Графики и визуализация", icon: "BarChart2" },
  { name: "Python 3.11", desc: "Бэкенд функции", icon: "Terminal" },
  { name: "PostgreSQL", desc: "База данных", icon: "Database" },
  { name: "Cloud Functions", desc: "Серверная логика", icon: "Cloud" },
]

const GOALS = [
  { icon: "Eye", title: "Наглядность", desc: "Комплексное отображение экологических данных на интерактивной карте" },
  { icon: "Layers", title: "Интеграция", desc: "Единая система для воздуха, воды, радиации, шума и климата" },
  { icon: "TrendingUp", title: "Динамика", desc: "Анализ временных рядов и выявление тенденций" },
  { icon: "Users", title: "Доступность", desc: "Открытый доступ для граждан, учёных и госорганов" },
]

export default function AboutPage() {
  const regions = Array.from(new Set(ALL_POINTS.map(p => p.region)))

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">

        {/* Hero */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-10 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-eco/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-eco/15 ring-1 ring-eco/30 flex items-center justify-center">
                <Icon name="Leaf" size={24} className="text-eco" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ЭкоМонитор</h1>
                <p className="text-white/50 text-sm">Система визуализации экологических показателей региона</p>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed max-w-3xl">
              Информационная система предназначена для сбора, хранения, обработки и визуализации
              экологических показателей. Обеспечивает доступ к данным через веб-браузер с любого
              устройства без установки дополнительного программного обеспечения.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Точек мониторинга", val: ALL_POINTS.length, icon: "MapPin" },
            { label: "Регионов охвата", val: regions.length, icon: "Globe" },
            { label: "Типов показателей", val: 4, icon: "BarChart2" },
            { label: "Лет накопленных данных", val: 12, icon: "Clock" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
              <Icon name={s.icon} size={22} className="text-eco mx-auto mb-3" />
              <div className="text-3xl font-bold text-eco mb-1">{s.val}</div>
              <div className="text-xs text-white/50">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Goals */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Цели системы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GOALS.map(g => (
              <div key={g.title} className="rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-5">
                <div className="w-10 h-10 rounded-xl bg-eco/15 ring-1 ring-eco/30 flex items-center justify-center mb-4">
                  <Icon name={g.icon} size={18} className="text-eco" />
                </div>
                <h3 className="font-semibold mb-2">{g.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Охваченные регионы</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {regions.map(region => {
              const pts = ALL_POINTS.filter(p => p.region === region)
              const bad = pts.filter(p => p.status === "bad").length
              return (
                <div key={region} className="rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm mb-1">{region}</div>
                    <div className="text-xs text-white/40">{pts.length} постов наблюдения</div>
                  </div>
                  {bad > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-400/15 text-red-400">{bad} превыш.</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Tech stack */}
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8">
          <h2 className="text-xl font-bold mb-6">Технологический стек</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TECH_STACK.map(t => (
              <div key={t.name} className="rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-4 text-center">
                <Icon name={t.icon} size={24} className="text-eco mx-auto mb-3" />
                <div className="font-semibold text-xs mb-1">{t.name}</div>
                <div className="text-xs text-white/40">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
