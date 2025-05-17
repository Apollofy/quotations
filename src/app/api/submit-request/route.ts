import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        
        if (!formData.name || !formData.email || !formData.phone || !formData.treatment) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }
        
        const { error } = await supabase
            .from('treatment_requests')
            .insert([
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    treatment: formData.treatment,
                    planned_date: formData.plannedDate,
                    message: formData.message || null
                }
            ]);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error submitting treatment request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
