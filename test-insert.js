const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  require('dotenv').config({ path: '.env' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing insert...");
  const { data, error } = await supabase
    .from('registration_tickets')
    .insert({
      ticket_id: "CFX-TEST",
      vehicle_id: "00000000-0000-0000-0000-000000000000", // Will fail FK if FK is active, but let's see
      reg_number: "KAA123A",
      event_id: "00000000-0000-0000-0000-000000000000"
    });
  
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
