import { FiUsers, FiCalendar, FiActivity, FiDollarSign } from "react-icons/fi";

export default function DashboardPage() {
  // Datos Ficticios para Visualización
  const stats = [
    { label: "Reservas Activas", value: "24", icon: FiCalendar, color: "text-brand-accent" },
    { label: "Usuarios Totales", value: "1,204", icon: FiUsers, color: "text-blue-500" },
    { label: "Ocupación hoy", value: "85%", icon: FiActivity, color: "text-green-500" },
    { label: "Ingresos Mes", value: "S/ 4,500", icon: FiDollarSign, color: "text-brand-accent" },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-black text-brand-primary uppercase tracking-tight">Panel de Control</h1>
        <p className="text-brand-primary/60 font-medium">Bienvenido de vuelta, Administrador.</p>
      </header>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-brand-white p-6 rounded-[2rem] shadow-sm border border-brand-primary/5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-brand-secondary/10 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
            </div>
            <h3 className="text-brand-primary/40 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-black text-brand-primary mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Visualización de Datos (Gráfico Simulado con CSS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-brand-white p-8 rounded-[2.5rem] border border-brand-primary/5 shadow-sm">
          <h3 className="text-lg font-bold text-brand-primary mb-6">Uso de Canchas (Últimos 7 días)</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-brand-accent rounded-t-xl transition-all hover:bg-brand-primary cursor-pointer" 
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-[10px] font-bold text-brand-primary/30 uppercase">Día {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Reservas Recientes */}
        <div className="bg-brand-white p-8 rounded-[2.5rem] border border-brand-primary/5 shadow-sm">
          <h3 className="text-lg font-bold text-brand-primary mb-6">Últimas Reservas</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-brand-secondary/5 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold">JP</div>
                <div>
                  <p className="text-sm font-bold text-brand-primary leading-none">Juan Pérez</p>
                  <p className="text-xs text-brand-primary/40 mt-1">Cancha Estándar • 18:00</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}