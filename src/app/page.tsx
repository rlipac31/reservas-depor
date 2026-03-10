import { getServerUser } from "@/actions/useServer";
import Button from "@/components/landing/Button";
import FieldCard from "@/components/landing/Fieldcard";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Nabvar";

// Datos ficticios que luego podrás reemplazar con tu API de Supabase
const CAMPOS_DESTACADOS = [
  {
    id: 1,
    name: "Estadio La Bombonera",
    type: "Fútbol 7",
    price: 120,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Complejo Pukllay Norte",
    type: "Fútbol 11",
    price: 180,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Arena Tenis Pro",
    type: "Tenis / Padel",
    price: 90,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
  }
];

export default async function HomePage() {

    const user = await getServerUser()
console.log("user desde page root")
console.table(user);
  return (
   <>
    <Navbar />
  
    <div className="flex flex-col gap-20">

      {/* SECTION: HERO - Impacto Visual con Gradientes */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-brand-primary">
        {/* Background con gradiente y efecto de malla (moderno 2026) */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,var(--color-brand-accent)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-8xl  font-black text-brand-white mb-6 tracking-tight leading-none">
            RESERVA TU <span className="text-transparent bg-clip-text bg-[image:var(--background-image-gradient-accent)]">PASIÓN</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-secondary/80 mb-10 max-w-2xl mx-auto font-light">
            La plataforma más rápida y moderna para reservar campos deportivos en todo el país. Juega hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" className="text-lg px-10 py-4 shadow-2xl">
              Explorar Campos
            </Button>
            <Button variant="outline" className="border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-primary text-lg px-10 py-4">
              ¿Cómo funciona?
            </Button>
          </div>
        </div>

        {/* Decoración flotante */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-brand-white/30 text-3xl">
          ↓
        </div>
      </section>

      {/* SECTION: BÚSQUEDA RÁPIDA (Opcional pero útil) */}
      {/* <section className="max-w-7xl mx-auto w-full px-4 -mt-32 relative z-20">
        <div className="bg-brand-white p-8 rounded-[2.5rem] shadow-2xl border border-brand-primary/5 flex flex-wrap gap-6 items-end justify-between">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-brand-primary/40 uppercase mb-2 ml-1">¿Qué deporte buscas?</label>
            <select className="w-full bg-brand-secondary p-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-accent outline-none font-medium">
              <option>Fútbol</option>
              <option>Básquet</option>
              <option>Tenis</option>
              <option>Vóley</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-brand-primary/40 uppercase mb-2 ml-1">Fecha</label>
            <input type="date" className="w-full bg-brand-secondary p-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-accent outline-none font-medium" />
          </div>
          <Button variant="primary" className="h-[58px] px-12 rounded-2xl w-full md:w-auto">
            Buscar Ahora
          </Button>
        </div>
      </section> */}

      {/* SECTION: LISTADO DE CAMPOS - Grid con Componente Reutilizable */}
      <section className="max-w-7xl mx-auto w-full px-4 pb-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-brand-primary">Campos Destacados</h2>
            <p className="text-brand-primary/50 mt-2 font-medium">Los favoritos de la comunidad esta semana</p>
          </div>
          <button className="text-brand-accent font-bold hover:underline underline-offset-4 hidden md:block">
            Ver todos los campos →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAMPOS_DESTACADOS.map((campo) => (
            <FieldCard
              key={campo.id}
              name={campo.name}
              type={campo.type}
              price={campo.price}
              rating={campo.rating}
              image={campo.image}
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
   </>   
  );
}