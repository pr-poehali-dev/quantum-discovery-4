import { useState } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import EcoMap, { MonitoringPoint } from "@/components/EcoMap"
import EcoChart from "@/components/EcoChart"

interface FAQ {
  question: string
  answer: string
}

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedMapPoint, setSelectedMapPoint] = useState<MonitoringPoint | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs: FAQ[] = [
    {
      question: "Какие экологические показатели отображает система?",
      answer:
        "Система визуализирует комплекс показателей: качество воздуха (PM2.5, PM10, CO₂, NO₂, SO₂), качество воды (pH, мутность, содержание кислорода), радиационный фон, уровень шума, температурные аномалии и индекс зелёных насаждений. Все показатели интегрированы в единый интерфейс.",
    },
    {
      question: "Как часто обновляются данные на карте?",
      answer:
        "Данные от стационарных датчиков обновляются в режиме реального времени с интервалом от 1 до 15 минут. Спутниковые и лабораторные данные обновляются по расписанию — раз в сутки или при поступлении новых измерений.",
    },
    {
      question: "Можно ли получить доступ к историческим данным?",
      answer:
        "Да, система хранит данные за весь период наблюдений. Пользователь может выбрать произвольный временной интервал для построения графиков и анализа динамики любого показателя, сравнивать периоды и выявлять тенденции.",
    },
    {
      question: "Как устроен административный интерфейс?",
      answer:
        "Административный раздел позволяет управлять точками мониторинга, добавлять и редактировать данные, настраивать пороговые значения для оповещений, управлять пользователями и формировать аналитические отчёты.",
    },
  ]

  const metrics = [
    { label: "Точек мониторинга", value: "240+", icon: "MapPin" },
    { label: "Показателей на карте", value: "18", icon: "BarChart2" },
    { label: "Лет накопленных данных", value: "12", icon: "Clock" },
    { label: "Регионов охвата", value: "7", icon: "Globe" },
  ]

  return (
    <div className="min-h-screen bg-[#060E0A] text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#060E0A]" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-eco/30 backdrop-blur rounded-full">
            <Icon name="Leaf" size={18} className="text-eco" />
            <span className="font-medium">ЭкоМонитор</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {["Карта", "Показатели", "Аналитика", "Данные", "О системе"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-sm"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-sm"
            >
              Войти
            </a>
            <Button className="bg-eco text-black hover:bg-eco/90 rounded-full px-6 font-semibold">
              Открыть карту
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
          <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-eco/40 backdrop-blur rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-eco animate-pulse" />
            <span className="text-sm font-medium text-eco">Данные обновляются в реальном времени</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-6 text-balance leading-tight">
            Экология региона<br />
            <span className="text-eco">под контролем</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mb-12 leading-relaxed text-pretty">
            Интерактивная система визуализации экологических показателей — воздух, вода, почва, шум — на единой карте с аналитикой и историей изменений.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button size="lg" className="bg-eco text-black hover:bg-eco/90 rounded-full px-8 py-4 text-lg font-semibold">
              <Icon name="Map" size={20} className="mr-2" />
              Открыть карту мониторинга
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8 py-4 text-lg"
            >
              <Icon name="BarChart2" size={20} className="mr-2" />
              Посмотреть аналитику
            </Button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <Icon name="Shield" size={16} className="text-eco" />
            <span className="text-sm font-medium">Официальные данные государственных постов наблюдения</span>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-6 text-center">
                <Icon name={m.icon} size={24} className="text-eco mx-auto mb-3" />
                <div className="text-3xl font-bold text-eco mb-1">{m.value}</div>
                <div className="text-sm text-white/60">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Возможности системы</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">Полный набор инструментов для работы с экологическими данными</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              {
                icon: "MapPin",
                title: "Интерактивная карта",
                desc: "Показатели на карте региона в виде точек и слоёв с цветовой шкалой уровней.",
              },
              {
                icon: "SlidersHorizontal",
                title: "Фильтрация данных",
                desc: "Выбор показателей по типам: воздух, вода, почва, шум, радиация. Фильтр по времени.",
              },
              {
                icon: "TrendingUp",
                title: "Графики динамики",
                desc: "Временные ряды любого показателя с возможностью сравнения периодов.",
              },
              {
                icon: "LayoutDashboard",
                title: "Аналитическая панель",
                desc: "Интегральные индексы, сводные показатели и результаты автоматического анализа.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-black/20 ring-1 ring-white/10 backdrop-blur p-8 text-center hover:ring-eco/40 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-eco/15 ring-1 ring-eco/30 mb-6">
                  <Icon name={f.icon} size={22} className="text-eco" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{f.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Карта мониторинга</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Нажмите на точку, чтобы увидеть показатели. Фильтруйте по типу данных.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden ring-1 ring-white/10" style={{ height: 560 }}>
            <EcoMap onSelectPoint={setSelectedMapPoint} />
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "Wind", label: "Воздух", desc: "PM2.5, NO₂, CO₂" },
              { icon: "Droplets", label: "Вода", desc: "pH, кислород" },
              { icon: "RadioTower", label: "Радиация", desc: "мкЗв/ч" },
              { icon: "Volume2", label: "Шум", desc: "дБ, сутки/ночь" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex items-center gap-3">
                <Icon name={item.icon} size={18} className="text-eco flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-white/50">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart under map */}
          <div className="mt-6">
            <EcoChart selectedPoint={selectedMapPoint} />
          </div>
        </div>
      </section>

      {/* Indicators Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-black/30 ring-1 ring-white/10 backdrop-blur p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Комплексный мониторинг среды
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  Система интегрирует данные из разных источников: государственные посты, мобильные датчики, лабораторные измерения и спутниковые данные — в единую актуальную картину.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Качество воздуха", color: "bg-green-400", pct: "92%" },
                    { label: "Качество воды", color: "bg-blue-400", pct: "87%" },
                    { label: "Радиационный фон", color: "bg-yellow-400", pct: "99%" },
                    { label: "Уровень шума", color: "bg-orange-400", pct: "78%" },
                  ].map((ind) => (
                    <div key={ind.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{ind.label}</span>
                        <span className="text-white/50">покрытие {ind.pct}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${ind.color} rounded-full`} style={{ width: ind.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Wind", label: "Воздух", desc: "PM2.5, PM10, CO₂, NO₂, O₃" },
                  { icon: "Droplets", label: "Вода", desc: "pH, кислород, мутность, нитраты" },
                  { icon: "RadioTower", label: "Радиация", desc: "Гамма-фон, доза, мощность" },
                  { icon: "Volume2", label: "Шум", desc: "dB, ночной / дневной уровень" },
                  { icon: "Thermometer", label: "Климат", desc: "Температура, осадки, ветер" },
                  { icon: "FlaskConical", label: "Почва", desc: "Тяжёлые металлы, pH, влага" },
                ].map((ind) => (
                  <div key={ind.label} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 hover:ring-eco/30 transition-all">
                    <Icon name={ind.icon} size={20} className="text-eco mb-3" />
                    <div className="font-semibold mb-1">{ind.label}</div>
                    <div className="text-xs text-white/50">{ind.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
                  Частые вопросы
                </h2>
                <p className="text-lg text-white/70 leading-relaxed text-pretty">
                  Всё, что нужно знать о работе с системой экологического мониторинга региона.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-base font-semibold pr-4">{faq.question}</h3>
                      <Icon name={openFaq === index ? "Minus" : "Plus"} size={18} className="flex-shrink-0 text-eco" />
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-white/70 leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Запросить доступ</h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Для организаций, исследователей и государственных структур — напишите нам для подключения к системе.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="rounded-2xl bg-white/95 text-black p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Отправить запрос</h3>
                <form className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Имя и организация</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Иван Петров, Росприроднадзор"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="example@organization.ru"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Цель использования</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none outline-none"
                      placeholder="Опишите, для каких задач вам нужен доступ..."
                    />
                  </div>
                  <Button className="w-full bg-[#2D9B5A] text-white hover:bg-[#238C4E] rounded-lg py-3 font-semibold text-base">
                    Отправить заявку
                  </Button>
                </form>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-white/80 leading-relaxed">
                  Система открыта для государственных органов, научных организаций, экологических НКО и коммерческих структур, чья деятельность связана с охраной окружающей среды.
                </p>
                {[
                  { icon: "Building2", title: "Госорганы и надзор", desc: "Полный доступ к данным и административному интерфейсу" },
                  { icon: "GraduationCap", title: "Исследователи", desc: "Экспорт данных, API, исторические архивы" },
                  { icon: "Users", title: "НКО и общество", desc: "Публичный доступ к основным показателям" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
                    <div className="w-10 h-10 rounded-lg bg-eco/15 ring-1 ring-eco/30 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} size={18} className="text-eco" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{item.title}</div>
                      <div className="text-sm text-white/60">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Icon name="Leaf" size={18} className="text-eco" />
              <span className="font-semibold">ЭкоМонитор</span>
              <span className="text-white/40 text-sm ml-2">Система визуализации экологических показателей</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Документация</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
              <a href="#" className="hover:text-white transition-colors">Политика данных</a>
              <a href="#" className="hover:text-white transition-colors">Контакты</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-white/30">
            © 2024 ЭкоМонитор. Данные предоставляются в информационных целях.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index