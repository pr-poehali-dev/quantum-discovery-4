import { useState } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"

const SPECIES = [
  { id: 1,  latin: "Ciconia ciconia",      russian: "Белый аист",          order: "Аистообразные",    family: "Аистовые",       rare: false, protected: false },
  { id: 2,  latin: "Ciconia nigra",        russian: "Чёрный аист",         order: "Аистообразные",    family: "Аистовые",       rare: true,  protected: true  },
  { id: 3,  latin: "Aquila chrysaetos",    russian: "Беркут",              order: "Ястребообразные",  family: "Ястребиные",     rare: true,  protected: true  },
  { id: 4,  latin: "Falco peregrinus",     russian: "Сапсан",              order: "Соколообразные",   family: "Соколиные",      rare: true,  protected: true  },
  { id: 5,  latin: "Grus grus",            russian: "Серый журавль",       order: "Журавлеобразные",  family: "Журавлиные",     rare: false, protected: false },
  { id: 6,  latin: "Anser anser",          russian: "Серый гусь",          order: "Гусеобразные",     family: "Утиные",         rare: false, protected: false },
  { id: 7,  latin: "Cygnus cygnus",        russian: "Лебедь-кликун",       order: "Гусеобразные",     family: "Утиные",         rare: false, protected: true  },
  { id: 8,  latin: "Ardea cinerea",        russian: "Серая цапля",         order: "Аистообразные",    family: "Цаплевые",       rare: false, protected: false },
  { id: 9,  latin: "Pandion haliaetus",    russian: "Скопа",               order: "Ястребообразные",  family: "Скопиные",       rare: true,  protected: true  },
  { id: 10, latin: "Haliaeetus albicilla", russian: "Орлан-белохвост",     order: "Ястребообразные",  family: "Ястребиные",     rare: true,  protected: true  },
  { id: 11, latin: "Columba palumbus",     russian: "Вяхирь",              order: "Голубеобразные",   family: "Голубиные",      rare: false, protected: false },
  { id: 12, latin: "Turdus merula",        russian: "Чёрный дрозд",        order: "Воробьинообразные",family: "Дроздовые",      rare: false, protected: false },
  { id: 13, latin: "Parus major",          russian: "Большая синица",      order: "Воробьинообразные",family: "Синицевые",      rare: false, protected: false },
  { id: 14, latin: "Hirundo rustica",      russian: "Деревенская ласточка",order: "Воробьинообразные",family: "Ласточковые",    rare: false, protected: false },
  { id: 15, latin: "Luscinia luscinia",    russian: "Обыкновенный соловей",order: "Воробьинообразные",family: "Мухоловковые",   rare: false, protected: false },
]

const BIOTOPES = [
  { code: "forest",   name: "Лес" },
  { code: "steppe",   name: "Степь" },
  { code: "wetland",  name: "Водно-болотные угодья" },
  { code: "river",    name: "Речные поймы" },
  { code: "coastal",  name: "Побережье" },
  { code: "agro",     name: "Агроландшафт" },
  { code: "urban",    name: "Урбанизированные территории" },
  { code: "mountain", name: "Горные территории" },
  { code: "tundra",   name: "Тундра" },
  { code: "desert",   name: "Пустыни и полупустыни" },
]

const MIGRATION_TYPES = [
  { code: "spring",    name: "Весенняя миграция" },
  { code: "autumn",    name: "Осенняя миграция" },
  { code: "nomadic",   name: "Кочёвки" },
  { code: "resident",  name: "Оседлые" },
  { code: "wintering", name: "Зимовка" },
]

const FLOCK_FORMS = [
  { code: "single",  name: "Одиночная особь" },
  { code: "pair",    name: "Пара" },
  { code: "small",   name: "Мелкая группа (3–10)" },
  { code: "medium",  name: "Средняя стая (11–100)" },
  { code: "large",   name: "Крупная стая (101–1000)" },
  { code: "massive", name: "Массовое скопление (>1000)" },
]

const TABS = [
  { key: "species",    label: "Виды птиц",       icon: "Bird",       count: SPECIES.length },
  { key: "biotopes",   label: "Биотопы",          icon: "TreePine",   count: BIOTOPES.length },
  { key: "migration",  label: "Типы миграции",    icon: "ArrowRight", count: MIGRATION_TYPES.length },
  { key: "flocks",     label: "Формы скоплений",  icon: "Users",      count: FLOCK_FORMS.length },
]

export default function DictionariesPage() {
  const [tab, setTab] = useState("species")
  const [search, setSearch] = useState("")
  const [onlyRare, setOnlyRare] = useState(false)

  const filteredSpecies = SPECIES.filter(s =>
    (s.russian.toLowerCase().includes(search.toLowerCase()) ||
     s.latin.toLowerCase().includes(search.toLowerCase()) ||
     s.family.toLowerCase().includes(search.toLowerCase())) &&
    (!onlyRare || s.rare)
  )

  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Справочники</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Нормативно-справочная информация системы</p>
          </div>
        </div>

        {/* Tab cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-3 p-4 rounded-xl ring-1 text-left transition-all
                ${tab === t.key
                  ? "ring-bird bg-bird/10"
                  : "ring-border bg-muted hover:bg-accent"
                }`}
            >
              <Icon name={t.icon} size={18} className={tab === t.key ? "text-bird" : "text-muted-foreground"} />
              <div>
                <div className={`text-sm font-medium ${tab === t.key ? "text-bird" : ""}`}>{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.count} записей</div>
              </div>
            </button>
          ))}
        </div>

        {/* Species */}
        {tab === "species" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск по названию, семейству..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bird/30"
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={onlyRare} onChange={e => setOnlyRare(e.target.checked)} className="w-4 h-4 rounded accent-bird" />
                <Icon name="Star" size={14} className="text-amber-500" />
                Только редкие
              </label>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-bird text-white rounded-lg text-sm hover:bg-bird-dark transition-colors">
                <Icon name="Plus" size={14} />
                Добавить вид
              </button>
            </div>

            <div className="bg-muted rounded-2xl ring-1 ring-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Вид</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Отряд</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Семейство</th>
                    <th className="py-3 px-4 text-xs text-muted-foreground font-medium">Статус</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpecies.map(s => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-background transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {s.rare && <Icon name="Star" size={12} className="text-amber-500 flex-shrink-0" />}
                          <div>
                            <div className="font-medium">{s.russian}</div>
                            <div className="text-xs italic text-muted-foreground">{s.latin}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground text-xs hidden md:table-cell">{s.order}</td>
                      <td className="py-2.5 px-4 text-muted-foreground text-xs hidden lg:table-cell">{s.family}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {s.rare && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                              Редкий
                            </span>
                          )}
                          {s.protected && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium">
                              Охраняемый
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                          <Icon name="Pencil" size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSpecies.length === 0 && (
                <div className="text-center py-10 text-muted-foreground text-sm">Виды не найдены</div>
              )}
            </div>
          </div>
        )}

        {/* Biotopes */}
        {tab === "biotopes" && (
          <div className="bg-muted rounded-2xl ring-1 ring-border overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-sm font-medium">Биотопы</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-bird text-white rounded-lg text-xs hover:bg-bird-dark transition-colors">
                <Icon name="Plus" size={13} /> Добавить
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Код</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Название</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {BIOTOPES.map(b => (
                  <tr key={b.code} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-2.5 px-4 font-mono text-xs text-muted-foreground">{b.code}</td>
                    <td className="py-2.5 px-4 font-medium">{b.name}</td>
                    <td className="py-2.5 px-4">
                      <button className="p-1 text-muted-foreground hover:text-foreground"><Icon name="Pencil" size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Migration types */}
        {tab === "migration" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MIGRATION_TYPES.map(m => (
              <div key={m.code} className="flex items-center gap-3 p-4 bg-muted ring-1 ring-border rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-bird/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="ArrowRight" size={16} className="text-bird" />
                </div>
                <div>
                  <div className="font-medium text-sm">{m.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{m.code}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Flock forms */}
        {tab === "flocks" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FLOCK_FORMS.map(f => (
              <div key={f.code} className="flex items-center gap-3 p-4 bg-muted ring-1 ring-border rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-bird/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Users" size={16} className="text-bird" />
                </div>
                <div>
                  <div className="font-medium text-sm">{f.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{f.code}</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </OrnithologyLayout>
  )
}
