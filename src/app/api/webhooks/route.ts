import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Aquí se procesaría el webhook (Ej: Stripe)
        console.log('Webhook recibido:', body)

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (error) {
        console.error('Error en webhook:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 })
    }
}
