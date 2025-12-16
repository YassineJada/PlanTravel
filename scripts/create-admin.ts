import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../src/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;

async function createAdmin() {
  const client = postgres(connectionString, { ssl: 'require' });
  const db = drizzle(client);

  const email = 'ayoub2@test.com';
  const password = 'admin123'; // Change this to a secure password
  const name = 'Admin User';

  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
      // Update existing user to be admin
      await db
        .update(users)
        .set({ isAdmin: true })
        .where(eq(users.email, email));
      
      console.log(`✅ User ${email} updated to admin successfully!`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.insert(users).values({
        email,
        password: hashedPassword,
        name,
        isAdmin: true,
      });

      console.log(`✅ Admin user created successfully!`);
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      console.log(`⚠️  Please change this password after first login!`);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await client.end();
  }
}

createAdmin();
