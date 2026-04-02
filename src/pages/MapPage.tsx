import { useState } from "react"
import AppLayout from "@/components/AppLayout"
import EcoMap, { MonitoringPoint } from "@/components/EcoMap"
import EcoChart from "@/components/EcoChart"
import Icon from "@/components/ui/icon"

export default function MapPage() {
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPoint | null>(null)

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Карта мониторинга</h1>
          <p className="text-white/50">Интерактивная карта экологических постов наблюдения</p>
        </div>
        <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 mb-6" style={{ height: 600 }}>
          <EcoMap onSelectPoint={setSelectedPoint} />
        </div>
        <EcoChart selectedPoint={selectedPoint} />
      </div>
    </AppLayout>
  )
}
