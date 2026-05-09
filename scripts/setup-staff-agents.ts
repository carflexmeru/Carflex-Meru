#!/usr/bin/env node

/**
 * Setup Script for Staff Agents
 * 
 * This script creates auth users and populates the staff_agents table
 * 
 * Usage:
 *   npx ts-node scripts/setup-staff-agents.ts
 * 
 * Prerequisites:
 *   - SUPABASE_URL environment variable set
 *   - SUPABASE_SERVICE_ROLE_KEY environment variable set
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Error: Missing environment variables");
  console.error("   SUPABASE_URL:", SUPABASE_URL ? "✓" : "✗");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const STAFF_AGENTS = [
  {
    email: "registration@carflex.com",
    password: "Registration@Carflex123",
    name: "Registration Agent",
    type: "REGISTRATION_AGENT",
  },
  {
    email: "gate@carflex.com",
    password: "Gate@Carflex123",
    name: "Gate Verification Agent",
    type: "GATE_VERIFICATION_AGENT",
  },
  {
    email: "ground@carflex.com",
    password: "Ground@Carflex123",
    name: "Ground Verification Agent",
    type: "GROUND_VERIFICATION_AGENT",
  },
  {
    email: "exit@carflex.com",
    password: "Exit@Carflex123",
    name: "Exit Command Agent",
    type: "EXIT_COMMAND_AGENT",
  },
];

async function setupStaffAgents() {
  console.log("🚀 Starting staff agents setup...\n");

  const createdUsers = [];

  // Step 1: Create auth users
  console.log("📝 Step 1: Creating auth users...");
  for (const agent of STAFF_AGENTS) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: agent.email,
        password: agent.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`   ❌ Failed to create user ${agent.email}:`, error.message);
        continue;
      }

      if (data.user) {
        console.log(`   ✓ Created user: ${agent.email} (ID: ${data.user.id})`);
        createdUsers.push({
          ...agent,
          id: data.user.id,
        });
      }
    } catch (err: any) {
      console.error(`   ❌ Error creating user ${agent.email}:`, err.message);
    }
  }

  if (createdUsers.length === 0) {
    console.error("\n❌ No users were created. Aborting.");
    process.exit(1);
  }

  console.log(`\n✓ Created ${createdUsers.length} auth users\n`);

  // Step 2: Populate staff_agents table
  console.log("📝 Step 2: Populating staff_agents table...");

  const staffAgentsData = createdUsers.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    type: user.type,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  try {
    const { error } = await supabase
      .from("staff_agents")
      .insert(staffAgentsData)
      .select();

    if (error) {
      console.error("   ❌ Failed to insert staff agents:", error.message);
      process.exit(1);
    }

    console.log(`   ✓ Inserted ${staffAgentsData.length} staff agents`);
  } catch (err: any) {
    console.error("   ❌ Error inserting staff agents:", err.message);
    process.exit(1);
  }

  // Step 3: Verify setup
  console.log("\n📝 Step 3: Verifying setup...");

  try {
    const { data, error } = await supabase
      .from("staff_agents")
      .select("*")
      .order("created_at");

    if (error) {
      console.error("   ❌ Failed to verify:", error.message);
      process.exit(1);
    }

    console.log(`   ✓ Found ${data?.length || 0} staff agents in database`);

    if (data && data.length > 0) {
      console.log("\n📋 Staff Agents Summary:");
      data.forEach((agent: any) => {
        console.log(`   • ${agent.name} (${agent.type})`);
        console.log(`     Email: ${agent.email}`);
        console.log(`     ID: ${agent.id}\n`);
      });
    }
  } catch (err: any) {
    console.error("   ❌ Error verifying setup:", err.message);
    process.exit(1);
  }

  console.log("✅ Setup complete!\n");
  console.log("🔐 Test Credentials:");
  console.log("─".repeat(60));

  createdUsers.forEach((user) => {
    console.log(`\n${user.name}`);
    console.log(`  Email:    ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log(`  Type:     ${user.type}`);
  });

  console.log("\n" + "─".repeat(60));
  console.log("\n🌐 Login URL: http://localhost:3000/staff/login");
  console.log("\n📚 For more information, see STAFF_SETUP_GUIDE.md");
}

setupStaffAgents().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
