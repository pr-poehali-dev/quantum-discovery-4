import { useState } from "react"
import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"

const SPECIES = [
  { id: 1,  latin: "Ciconia ciconia",        russian: "Белый аист",               order: "Аистообразные",     family: "Аистовые",       rare: false, protected: false },
  { id: 2,  latin: "Ciconia nigra",          russian: "Чёрный аист",              order: "Аистообразные",     family: "Аистовые",       rare: true,  protected: true  },
  { id: 3,  latin: "Aquila chrysaetos",      russian: "Беркут",                   order: "Ястребообразные",   family: "Ястребиные",     rare: true,  protected: true  },
  { id: 4,  latin: "Falco peregrinus",       russian: "Сапсан",                   order: "Соколообразные",    family: "Соколиные",      rare: true,  protected: true  },
  { id: 5,  latin: "Grus grus",              russian: "Серый журавль",            order: "Журавлеобразные",   family: "Журавлиные",     rare: false, protected: false },
  { id: 6,  latin: "Anser anser",            russian: "Серый гусь",               order: "Гусеобразные",      family: "Утиные",         rare: false, protected: false },
  { id: 7,  latin: "Cygnus cygnus",          russian: "Лебедь-кликун",            order: "Гусеобразные",      family: "Утиные",         rare: false, protected: true  },
  { id: 8,  latin: "Ardea cinerea",          russian: "Серая цапля",              order: "Аистообразные",     family: "Цаплевые",       rare: false, protected: false },
  { id: 9,  latin: "Pandion haliaetus",      russian: "Скопа",                    order: "Ястребообразные",   family: "Скопиные",       rare: true,  protected: true  },
  { id: 10, latin: "Haliaeetus albicilla",   russian: "Орлан-белохвост",          order: "Ястребообразные",   family: "Ястребиные",     rare: true,  protected: true  },
  { id: 11, latin: "Columba palumbus",       russian: "Вяхирь",                   order: "Голубеобразные",    family: "Голубиные",      rare: false, protected: false },
  { id: 12, latin: "Turdus merula",          russian: "Чёрный дрозд",             order: "Воробьинообразные", family: "Дроздовые",      rare: false, protected: false },
  { id: 13, latin: "Parus major",            russian: "Большая синица",           order: "Воробьинообразные", family: "Синицевые",      rare: false, protected: false },
  { id: 14, latin: "Hirundo rustica",        russian: "Деревенская ласточка",     order: "Воробьинообразные", family: "Ласточковые",    rare: false, protected: false },
  { id: 15, latin: "Luscinia luscinia",      russian: "Обыкновенный соловей",     order: "Воробьинообразные", family: "Мухоловковые",   rare: false, protected: false },
  { id: 16, latin: "Passer domesticus",      russian: "Домовый воробей",          order: "Воробьинообразные", family: "Воробьиные",     rare: false, protected: false },
  { id: 17, latin: "Corvus cornix",          russian: "Серая ворона",             order: "Воробьинообразные", family: "Врановые",       rare: false, protected: false },
  { id: 18, latin: "Corvus corax",           russian: "Ворон",                    order: "Воробьинообразные", family: "Врановые",       rare: false, protected: false },
  { id: 19, latin: "Pica pica",              russian: "Сорока",                   order: "Воробьинообразные", family: "Врановые",       rare: false, protected: false },
  { id: 20, latin: "Garrulus glandarius",    russian: "Сойка",                    order: "Воробьинообразные", family: "Врановые",       rare: false, protected: false },
  { id: 21, latin: "Sturnus vulgaris",       russian: "Обыкновенный скворец",     order: "Воробьинообразные", family: "Скворцовые",     rare: false, protected: false },
  { id: 22, latin: "Fringilla coelebs",      russian: "Зяблик",                   order: "Воробьинообразные", family: "Вьюрковые",      rare: false, protected: false },
  { id: 23, latin: "Erithacus rubecula",     russian: "Зарянка",                  order: "Воробьинообразные", family: "Мухоловковые",   rare: false, protected: false },
  { id: 24, latin: "Sylvia communis",        russian: "Серая славка",             order: "Воробьинообразные", family: "Камышевковые",   rare: false, protected: false },
  { id: 25, latin: "Phylloscopus trochilus", russian: "Весничка",                 order: "Воробьинообразные", family: "Пеночковые",     rare: false, protected: false },
  { id: 26, latin: "Motacilla alba",         russian: "Белая трясогузка",         order: "Воробьинообразные", family: "Трясогузковые",  rare: false, protected: false },
  { id: 27, latin: "Motacilla flava",        russian: "Жёлтая трясогузка",       order: "Воробьинообразные", family: "Трясогузковые",  rare: false, protected: false },
  { id: 28, latin: "Anthus pratensis",       russian: "Луговой конёк",            order: "Воробьинообразные", family: "Трясогузковые",  rare: false, protected: false },
  { id: 29, latin: "Upupa epops",            russian: "Удод",                     order: "Удодообразные",     family: "Удодовые",       rare: false, protected: false },
  { id: 30, latin: "Cuculus canorus",        russian: "Обыкновенная кукушка",     order: "Кукушкообразные",   family: "Кукушковые",     rare: false, protected: false },
  { id: 31, latin: "Streptopelia decaocto",  russian: "Кольчатая горлица",        order: "Голубеобразные",    family: "Голубиные",      rare: false, protected: false },
  { id: 32, latin: "Columba livia",          russian: "Сизый голубь",             order: "Голубеобразные",    family: "Голубиные",      rare: false, protected: false },
  { id: 33, latin: "Apus apus",              russian: "Чёрный стриж",             order: "Стрижеобразные",    family: "Стрижиные",      rare: false, protected: false },
  { id: 34, latin: "Alcedo atthis",          russian: "Обыкновенный зимородок",   order: "Ракшеобразные",     family: "Зимородковые",   rare: false, protected: true  },
  { id: 35, latin: "Picus viridis",          russian: "Зелёный дятел",            order: "Дятлообразные",     family: "Дятловые",       rare: false, protected: false },
  { id: 36, latin: "Dendrocopos major",      russian: "Большой пёстрый дятел",   order: "Дятлообразные",     family: "Дятловые",       rare: false, protected: false },
  { id: 37, latin: "Dryocopus martius",      russian: "Чёрный дятел",             order: "Дятлообразные",     family: "Дятловые",       rare: false, protected: false },
  { id: 38, latin: "Accipiter nisus",        russian: "Перепелятник",             order: "Ястребообразные",   family: "Ястребиные",     rare: false, protected: false },
  { id: 39, latin: "Accipiter gentilis",     russian: "Тетеревятник",             order: "Ястребообразные",   family: "Ястребиные",     rare: false, protected: false },
  { id: 40, latin: "Buteo buteo",            russian: "Обыкновенный канюк",       order: "Ястребообразные",   family: "Ястребиные",     rare: false, protected: false },
  { id: 41, latin: "Milvus migrans",         russian: "Чёрный коршун",            order: "Ястребообразные",   family: "Ястребиные",     rare: false, protected: false },
  { id: 42, latin: "Circus aeruginosus",     russian: "Болотный лунь",            order: "Ястребообразные",   family: "Ястребиные",     rare: false, protected: false },
  { id: 43, latin: "Circus cyaneus",         russian: "Полевой лунь",             order: "Ястребообразные",   family: "Ястребиные",     rare: false, protected: false },
  { id: 44, latin: "Falco tinnunculus",      russian: "Обыкновенная пустельга",   order: "Соколообразные",    family: "Соколиные",      rare: false, protected: false },
  { id: 45, latin: "Falco subbuteo",         russian: "Чеглок",                   order: "Соколообразные",    family: "Соколиные",      rare: false, protected: false },
  { id: 46, latin: "Falco columbarius",      russian: "Дербник",                  order: "Соколообразные",    family: "Соколиные",      rare: false, protected: false },
  { id: 47, latin: "Falco cherrug",          russian: "Балобан",                  order: "Соколообразные",    family: "Соколиные",      rare: true,  protected: true  },
  { id: 48, latin: "Bubo bubo",              russian: "Филин",                    order: "Совообразные",      family: "Совиные",        rare: false, protected: true  },
  { id: 49, latin: "Strix aluco",            russian: "Неясыть серая",            order: "Совообразные",      family: "Совиные",        rare: false, protected: false },
  { id: 50, latin: "Asio otus",              russian: "Ушастая сова",             order: "Совообразные",      family: "Совиные",        rare: false, protected: false },
  { id: 51, latin: "Asio flammeus",          russian: "Болотная сова",            order: "Совообразные",      family: "Совиные",        rare: false, protected: false },
  { id: 52, latin: "Tetrao urogallus",       russian: "Глухарь",                  order: "Курообразные",      family: "Тетеревиные",    rare: false, protected: false },
  { id: 53, latin: "Lyrurus tetrix",         russian: "Тетерев",                  order: "Курообразные",      family: "Тетеревиные",    rare: false, protected: false },
  { id: 54, latin: "Lagopus lagopus",        russian: "Белая куропатка",          order: "Курообразные",      family: "Тетеревиные",    rare: false, protected: false },
  { id: 55, latin: "Perdix perdix",          russian: "Серая куропатка",          order: "Курообразные",      family: "Фазановые",      rare: false, protected: false },
  { id: 56, latin: "Coturnix coturnix",      russian: "Перепел",                  order: "Курообразные",      family: "Фазановые",      rare: false, protected: false },
  { id: 57, latin: "Vanellus vanellus",      russian: "Чибис",                    order: "Ржанкообразные",    family: "Ржанковые",      rare: false, protected: false },
  { id: 58, latin: "Pluvialis apricaria",    russian: "Золотистая ржанка",        order: "Ржанкообразные",    family: "Ржанковые",      rare: false, protected: false },
  { id: 59, latin: "Calidris alpina",        russian: "Чернозобик",               order: "Ржанкообразные",    family: "Бекасовые",      rare: false, protected: false },
  { id: 60, latin: "Gallinago gallinago",    russian: "Бекас",                    order: "Ржанкообразные",    family: "Бекасовые",      rare: false, protected: false },
  { id: 61, latin: "Numenius arquata",       russian: "Большой кроншнеп",         order: "Ржанкообразные",    family: "Бекасовые",      rare: true,  protected: true  },
  { id: 62, latin: "Larus argentatus",       russian: "Серебристая чайка",        order: "Ржанкообразные",    family: "Чайковые",       rare: false, protected: false },
  { id: 63, latin: "Larus ridibundus",       russian: "Озёрная чайка",           order: "Ржанкообразные",    family: "Чайковые",       rare: false, protected: false },
  { id: 64, latin: "Sterna hirundo",         russian: "Речная крачка",            order: "Ржанкообразные",    family: "Чайковые",       rare: false, protected: false },
  { id: 65, latin: "Phalacrocorax carbo",    russian: "Большой баклан",           order: "Пеликанообразные",  family: "Баклановые",     rare: false, protected: false },
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
  { key: "species",    label: "Виды птиц",       icon: "Bird",       count: SPECIES.length  },
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