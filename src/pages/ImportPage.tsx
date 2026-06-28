import OrnithologyLayout from "@/components/OrnithologyLayout"
import Icon from "@/components/ui/icon"

export default function ImportPage() {
  return (
    <OrnithologyLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Импорт данных</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Загрузка наблюдений из внешних источников</p>
        </div>

        <div className="bg-muted rounded-2xl ring-1 ring-border p-8 flex flex-col items-center text-center gap-4 border-2 border-dashed border-border hover:border-bird/40 transition-colors cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-bird/10 flex items-center justify-center">
            <Icon name="Upload" size={28} className="text-bird" />
          </div>
          <div>
            <div className="font-semibold mb-1">Перетащите файл сюда</div>
            <div className="text-sm text-muted-foreground">или нажмите для выбора файла</div>
            <div className="text-xs text-muted-foreground mt-2">Поддерживаются: CSV, XLSX, GeoJSON · Макс. 50 МБ</div>
          </div>
          <button className="px-6 py-2 bg-bird text-white rounded-lg text-sm font-medium hover:bg-bird-dark transition-colors">
            Выбрать файл
          </button>
        </div>

        <div className="bg-muted rounded-2xl ring-1 ring-border p-5">
          <h2 className="font-semibold text-sm mb-3">Последние импорты</h2>
          <div className="text-sm text-muted-foreground text-center py-6">
            Импортов ещё не было
          </div>
        </div>
      </div>
    </OrnithologyLayout>
  )
}
