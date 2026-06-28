import OrnithologyLayout from "@/components/OrnithologyLayout"
import { STATUS_BADGE } from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"
import { Link } from "react-router-dom"

const KPI = [
  { label: "Наблюдений",      value: "10",  sub: "за все время",        icon: "Eye",         color: "text-bird" },
  { label: "Видов птиц",      value: "9",   sub: "зафиксировано",       icon: "Bird",        color: "text-emerald-500" },
  { label: "Редких видов",    value: "5",   sub: "из Красной книги",    icon: "AlertTriangle",color: "text-amber-500" },
  { label: "Активных сессий", value: "3",   sub: "в процессе учёта",    icon: "ClipboardList",color: "text-purple-500" },
]

const RECENT_OBSERVATIONS = [
  { id: 1,  species: "Серый журавль",       latin: "Grus grus",            count: 47,  status: "confirmed",           session: "SS-2024-001", date: "15.04.2024", rare: false },
  { id: 2,  species: "Серый гусь",          latin: "Anser anser",          count: 312, status: "confirmed",           session: "SS-2024-001", date: "16.04.2024", rare: false },
  { id: 3,  species: "Беркут",              latin: "Aquila chrysaetos",     count: 2,   status: "confirmed",           session: "SS-2024-001", date: "17.04.2024", rare: true  },
  { id: 5,  species: "Чёрный дрозд",       latin: "Turdus merula",        count: 8,   status: "submitted",           session: "SS-2024-002", date: "21.05.2024", rare: false },
  { id: 9,  species: "Скопа",              latin: "Pandion haliaetus",    count: 2,   status: "needs_clarification", session: "SS-2024-001", date: "20.04.2024", rare: true  },
  { id: 10, species: "Чёрный аист",        latin: "Ciconia nigra",        count: 1,   status: "draft",               session: "SS-2024-002", date: "01.06.2024", rare: true  },
]

const ACTIVE_SESSIONS = [
  { code: "SS-2024-001", name: "Весенняя миграция 2024 — Поволжье", type: "Маршрутный",    status: "active",    obs: 3, date: "01.04 – 31.05" },
  { code: "SS-2024-002", name: "Гнездовой период 2024 — Лесостепь", type: "Стационарный",  status: "active",    obs: 3, date: "15.05 – 15.07" },
  { code: "SS-2024-005", name: "Водно-болотный учёт ВБУ-1",          type: "Стационарный",  status: "active",    obs: 1, date: "01.06 – 30.06" },
]

const QUICK_ACTIONS = [
  { label: "Новое наблюдение",  href: "/observations/new", icon: "Plus",          color: "bg-bird text-white hover:bg-bird-dark" },
  { label: "Новая сессия",      href: "/sessions/new",     icon: "ClipboardPlus", color: "bg-muted hover:bg-accent border border-border" },
  { label: "Открыть карту",     href: "/map",              icon: "Map",           color: "bg-muted hover:bg-accent border border-border" },
  { label: "Аналитика",         href: "/analytics",        icon: "BarChart2",     color: "bg-muted hover:bg-accent border border-border" },
]

const SESSION_STATUS: Record<string, string> = {
  active:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  planned:   "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}
const SESSION_STATUS_LABEL: Record<string, string> = {
  active: "Активна", planned: "Запланирована", completed: "Завершена", cancelled: "Отменена",
}

export default function DashboardPage() {
  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Главная панель</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Web-портал орнитологических исследований</p>
          </div>
          <div className="flex gap-2">
            {QUICK_ACTIONS.map(a => (
              <Link
                key={a.href}
                to={a.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${a.color}`}
              >
                <Icon name={a.icon} size={15} />
                <span className="hidden sm:inline">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI.map(k => (
            <div key={k.label} className="bg-muted rounded-2xl p-5 ring-1 ring-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{k.label}</span>
                <Icon name={k.icon} size={16} className={k.color} />
              </div>
              <div className={`text-3xl font-bold mb-0.5 ${k.color}`}>{k.value}</div>
              <div className="text-xs text-muted-foreground">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Задачи пользователя */}
          <div className="bg-muted rounded-2xl ring-1 ring-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="ListTodo" size={16} className="text-bird" />
              <h2 className="font-semibold text-sm">Актуальные задачи</h2>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-200 dark:ring-amber-800 rounded-xl">
                <Icon name="AlertCircle" size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">1 наблюдение требует уточнения</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Скопа · SS-2024-001</div>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-800 rounded-xl">
                <Icon name="Clock" size={15} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">1 наблюдение на проверке</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Чёрный дрозд · SS-2024-002</div>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-muted ring-1 ring-border rounded-xl">
                <Icon name="FileEdit" size={15} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">1 черновик не отправлен</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Чёрный аист · SS-2024-002</div>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-muted ring-1 ring-border rounded-xl">
                <Icon name="CalendarClock" size={15} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">Сессия SS-2024-004 запланирована</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Начало: 01.12.2024</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Активные сессии */}
          <div className="lg:col-span-2 bg-muted rounded-2xl ring-1 ring-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name="ClipboardList" size={16} className="text-bird" />
                <h2 className="font-semibold text-sm">Активные сессии учёта</h2>
              </div>
              <Link to="/sessions" className="text-xs text-bird hover:underline">Все сессии →</Link>
            </div>
            <div className="space-y-3">
              {ACTIVE_SESSIONS.map(s => (
                <Link
                  key={s.code}
                  to="/sessions"
                  className="flex items-center gap-4 p-3 bg-background rounded-xl ring-1 ring-border hover:ring-bird/40 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-muted-foreground">{s.code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SESSION_STATUS[s.status]}`}>
                        {SESSION_STATUS_LABEL[s.status]}
                      </span>
                    </div>
                    <div className="text-sm font-medium truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.type} · {s.date}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-bird">{s.obs}</div>
                    <div className="text-xs text-muted-foreground">записей</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Последние наблюдения */}
        <div className="bg-muted rounded-2xl ring-1 ring-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon name="Eye" size={16} className="text-bird" />
              <h2 className="font-semibold text-sm">Последние наблюдения</h2>
            </div>
            <Link to="/observations" className="text-xs text-bird hover:underline">Все наблюдения →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Вид</th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium hidden md:table-cell">Сессия</th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium hidden sm:table-cell">Дата</th>
                  <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">Числ.</th>
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_OBSERVATIONS.map(obs => (
                  <tr key={obs.id} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        {obs.rare && (
                          <Icon name="Star" size={12} className="text-amber-500 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">{obs.species}</div>
                          <div className="text-xs text-muted-foreground italic">{obs.latin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 hidden md:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">{obs.session}</span>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground hidden sm:table-cell">{obs.date}</td>
                    <td className="py-2.5 px-3 text-right font-bold">{obs.count}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[obs.status].color}`}>
                        {STATUS_BADGE[obs.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </OrnithologyLayout>
  )
}
