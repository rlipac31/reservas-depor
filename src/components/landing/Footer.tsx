export default function Footer() {
    return (
        <footer className="bg-brand-primary text-brand-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-brand-white/10 pb-12">
                <div>
                    <h3 className="text-2xl font-black mb-4">PUKLLAY</h3>
                    <p className="text-brand-secondary/60 text-sm leading-relaxed">
                        La plataforma líder en gestión deportiva. Reserva tu pasión en menos de 1 minuto.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-brand-accent">Enlaces</h4>
                    <ul className="space-y-2 text-sm text-brand-secondary/80">
                        <li><a href="#" className="hover:text-brand-white transition-colors">Términos y condiciones</a></li>
                        <li><a href="#" className="hover:text-brand-white transition-colors">Política de privacidad</a></li>
                        <li><a href="#" className="hover:text-brand-white transition-colors">Trabaja con nosotros</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-brand-accent">Contacto</h4>
                    <p className="text-sm text-brand-secondary/80">soporte@pukllay.com</p>
                    <div className="flex gap-4 mt-4">
                        {/* Íconos sociales ficticios */}
                        <div className="w-8 h-8 bg-brand-white/10 rounded-full hover:bg-brand-accent cursor-pointer transition-colors" />
                        <div className="w-8 h-8 bg-brand-white/10 rounded-full hover:bg-brand-accent cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>
            <p className="text-center mt-8 text-xs text-brand-secondary/40">
                © 2026 Pukllay App. Todos los derechos reservados.
            </p>
        </footer>
    );
}