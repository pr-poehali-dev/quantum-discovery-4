import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"

export default function AuditPage() {
  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Журнал аудита</h1>
          <p className="text-muted-foreground text-sm mt-0.5">История всех изменений в системе</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Поиск по таблице, пользователю..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bird/30"
            />
          </div>
          <select className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none">
            <option>Все действия</option>
            <option>INSERT</option>
            <option>UPDATE</option>
          </select>
        </div>

        <div className="bg-muted rounded-2xl ring-1 ring-border p-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted-foreground/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="ScrollText" size={24} className="text-muted-foreground" />
          </div>
          <div className="font-medium mb-1">Журнал пока пуст</div>
          <div className="text-sm text-muted-foreground">Записи появятся после первых изменений в системе</div>
        </div>
      </div>
    </OrnithologyLayout>
  )
}
