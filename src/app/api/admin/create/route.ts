import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// This route should be protected or removed in production
export async function POST(request: Request) {
  try {
    const { email, password, name, secretKey } = await request.json();

    // Add a secret key check for security
    if (secretKey !== 'create-admin-secret-2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      // Update existing user to be admin
      await db
        .update(users)
        .set({ isAdmin: true })
        .where(eq(users.email, email));

      return NextResponse.json({
        message: 'User updated to admin successfully',
        user: { email, name: existingUser.name },
      });
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        isAdmin: true,
      })
      .returning();

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: { email, name },
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
