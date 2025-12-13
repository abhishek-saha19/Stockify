import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const exchange = searchParams.get('exchange');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    // Try server-side key first, fall back to public key if user hasn't renamed it yet
    const apiKey = process.env.TWELVE_DATA_API_KEY || process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    try {
        const url = `https://api.twelvedata.com/quote?symbol=${symbol}&exchange=${exchange || 'NSE'}&apikey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
