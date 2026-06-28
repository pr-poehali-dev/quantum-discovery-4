import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"

const USERS = [
  { id: 1, name: "Иванов Александр",   email: "ivanov@eco.ru",      role: "admin",       status: "active" },
  { id: 2, name: "Петрова Мария",      email: "petrova@eco.ru",     role: "coordinator", status: "active" },
  { id: 3, name: "Сидоров Николай",    email: "sidorov@eco.ru",     role: "observer",    status: "active" },
  { id: 4, name: "Козлова Елена",      email: "kozlova@eco.ru",     role: "expert",      status: "active" },
  { id: 5, name: "Миронов Дмитрий",   email: "mironov@eco.ru",     role: "analyst",     status: "inactive" },
]

const ROLES_LABEL: Record<string, string> = {
  admin: "Администратор",
  coordinator: "Координатор",
  observer: "Наблюдатель",
  expert: "Эксперт",
  analyst: "Аналитик",
  viewer: "Просмотр",
}

const ROLES_COLOR: Record<string, string> = {
  admin:       "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  coordinator: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  observer:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  expert:      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  analyst:     "bg-bird/10 text-bird",
  viewer:      "bg-muted text-muted-foreground",
}

export default function AdminPage() {
  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Администрирование</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Управление пользователями и параметрами системы</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Пользователей",  value: "5",  icon: "Users",       color: "text-bird" },
            { label: "Ролей",          value: "6",  icon: "ShieldCheck", color: "text-purple-500" },
            { label: "Таблиц в БД",    value: "15", icon: "Database",    color: "text-emerald-500" },
            { label: "Записей аудита", value: "0",  icon: "ScrollText",  color: "text-amber-500" },
          ].map(k => (
            <div key={k.label} className="bg-muted rounded-2xl p-4 ring-1 ring-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{k.label}</span>
                <Icon name={k.icon} size={14} className={k.color} />
              </div>
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-muted rounded-2xl ring-1 ring-border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-bird" />
              <span className="font-semibold text-sm">Пользователи</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-bird text-white rounded-lg text-xs hover:bg-bird-dark transition-colors">
              <Icon name="Plus" size={13} />
              Добавить
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Пользователь</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Роль</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Статус</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-bird/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-bird">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-muted-foreground text-xs hidden md:table-cell">{u.email}</td>
                  <td className="py-2.5 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLES_COLOR[u.role]}`}>
                      {ROLES_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${u.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                      }`}>
                      {u.status === "active" ? "Активен" : "Неактивен"}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <Icon name="Pencil" size={13} />
                    </button>
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
