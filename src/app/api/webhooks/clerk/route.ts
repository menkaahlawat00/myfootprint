import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const eventType = payload.type;

  switch (eventType) {
    case 'user.created': {
      const { id, email_addresses } = payload.data;
      const email = email_addresses?.[0]?.email_address;
      console.log(`[Clerk Webhook] User created: ${id} (${email})`);
      // TODO: Insert into users table after DB is wired up
      break;
    }
    case 'user.deleted': {
      const { id } = payload.data;
      console.log(`[Clerk Webhook] User deleted: ${id}`);
      // TODO: Delete from users table after DB is wired up
      break;
    }
  }

  return NextResponse.json({ received: true });
}
