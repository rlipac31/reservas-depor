import Link from 'next/link';
import Button from '@/components/landing/Button';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-brand-white/80 backdrop-blur-md border-b border-brand-primary/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-tighter text-brand-primary">
                            PUKLLAY<span className="text-brand-accent"> ARENA.</span>
                        </span>
                    </Link>

                    {/* Menú Desktop */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="/dasboard/reservas" className="hover:text-brand-accent transition-colors">Reservar</Link>
                        {/* <Link href="#nosotros" className="hover:text-brand-accent transition-colors">Nosotros</Link> */}
                        <Link href="/login">
                            {/* <Button variant="accent">Iniciar Sesión</Button> */}
                            <button className='bg-brand-accent text-brand-primary px-4 py-2 hover:bg-brand-primary hover:text-brand-accent transition-all duration-300 font-semibold capitalize rounded-xl'>Iniciar session</button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}