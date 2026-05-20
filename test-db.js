// test-db.js
import { supabase } from "./lib/supabase.js";

async function testDatabase() {
  try {
    console.log("Testing Supabase connection...");

    // Test connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("rooms")
      .select("*")
      .limit(1);

    if (connectionError) {
      console.error("Connection error:", connectionError);
      return;
    }

    console.log("Connection successful. Existing rooms:", connectionTest);

    // Try to create a test room
    const testCode =
      "TEST" + Math.random().toString(36).substring(2, 6).toUpperCase();
    console.log("Creating test room with code:", testCode);

    const { data: insertData, error: insertError } = await supabase
      .from("rooms")
      .insert({ room_code: testCode, status: "waiting", max_players: 4 })
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
    } else {
      console.log("Insert successful:", insertData);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testDatabase();
