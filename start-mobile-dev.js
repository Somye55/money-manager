const os = require("os");
const { exec } = require("child_process");

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === "IPv4" && !interface.internal) {
        return interface.address;
      }
    }
  }
  return null;
}

const localIP = getLocalIP();

if (localIP) {
  console.log("\n🚀 Starting development server for mobile testing...\n");
  console.log(`💻 Desktop access: http://localhost:5173`);
  console.log(`📱 Mobile access: http://${localIP}:5173`);
  console.log("\n📋 Make sure you have added these URLs to Supabase:");
  console.log(`   - http://localhost:5173`);
  console.log(`   - http://${localIP}:5173`);
  console.log("\n⚠️  Ensure your phone is on the same WiFi network!\n");

  // Start the dev server
  exec("npm run dev", { cwd: "./client" }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
  });
} else {
  console.log("❌ Could not find local IP address");
}
