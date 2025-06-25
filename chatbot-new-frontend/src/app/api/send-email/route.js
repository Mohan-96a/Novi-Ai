import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/emailService';

export async function POST(request) {
  try {
    const { to, templateName, data } = await request.json();

    if (!to || !templateName || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendEmail(to, templateName, data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', messageId: result.messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in email API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 