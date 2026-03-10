import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'accent' | 'outline';
    className?: string;
}

export default function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
    // Mapeo de estilos basados en tus variables @theme
    const variants = {
        primary: 'bg-brand-primary text-brand-accent-hover hover:opacity-90',
        accent: 'bg-[image:var(--background-image-gradient-accent)] text-brand-white hover:shadow-lg hover:shadow-brand-accent/30',
        outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white'
    };

    return (
        <button
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}