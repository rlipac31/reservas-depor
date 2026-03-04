import Button from '@/components/landing/Button'

interface FieldProps {
    name: string;
    type: string;
    price: number;
    image: string;
    rating: number;
}

export default function FieldCard({ name, type, price, image, rating }: FieldProps) {
    return (
        <div className="group bg-brand-white rounded-3xl overflow-hidden border border-brand-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            {/* Contenedor Imagen con Overlay */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-brand-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-primary">
                    {type}
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-brand-primary">{name}</h3>
                    <div className="flex items-center text-brand-accent font-bold">
                        ★ <span className="ml-1 text-brand-primary/70 text-sm">{rating}</span>
                    </div>
                </div>

                <p className="text-sm text-brand-primary/60 mb-6">Disponible hoy • Iluminación LED</p>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase font-bold text-brand-primary/40 block">Desde</span>
                        <span className="text-2xl font-black text-brand-primary">S/ {price}</span>
                    </div>
                    <Button variant="outline" className="py-2 px-4 text-sm">Ver horarios</Button>
                </div>
            </div>
        </div>
    );
}