// Debug script to test Supabase connection and RLS policies
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gksvdkluflewnqwnstey.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrc3Zka2x1Zmxld25xd25zdGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMjU4MjAsImV4cCI6MjA4MDcwMTgyMH0.TSUwoFIS98ePgGwBoX0PC-UaA4JxqQDw9RHT1LLZP5M";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugSupabase() {
  console.log("🔍 Starting Supabase Debug...");

  // Check current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.log("👤 Current User:", user);
  console.log("❌ User Error:", userError);

  if (user) {
    console.log("🆔 User ID:", user.id);
    console.log("📧 User Email:", user.email);

    // Try to fetch user from database
    console.log("\n🔍 Checking User table...");
    const { data: dbUsers, error: dbUserError } = await supabase
      .from("User")
      .select("*")
      .eq("email", user.email);

    console.log("👥 DB Users:", dbUsers);
    console.log("❌ DB User Error:", dbUserError);

    if (dbUsers && dbUsers.length > 0) {
      const dbUser = dbUsers[0];
      console.log("✅ Found DB User:", dbUser);

      // Try to fetch categories
      console.log("\n🔍 Checking Categories...");
      const { data: categories, error: catError } = await supabase
        .from("Category")
        .select("*")
        .eq("userId", dbUser.id);

      console.log("📂 Categories:", categories);
      console.log("❌ Category Error:", catError);

      // Try to create a test category
      console.log("\n🔍 Testing Category Creation...");
      const { data: newCat, error: createError } = await supabase
        .from("Category")
        .insert([
          {
            name: "Test Category",
            icon: "Tag",
            color: "#6366f1",
            userId: dbUser.id,
            order: 0,
          },
        ])
        .select()
        .single();

      console.log("➕ New Category:", newCat);
      console.log("❌ Create Error:", createError);
    }
  }
}

// Run the debug
debugSupabase().catch(console.error);
