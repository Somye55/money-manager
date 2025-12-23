const os = require("os");

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (interface.family === "IPv4" && !interface.internal) {
        console.log(`\n🌐 Your local IP address: ${interface.address}`);
        console.log(`📱 Access from phone: http://${interface.address}:5173`);
        console.log(`\n⚠️  Make sure your phone is on the same WiFi network!`);
        return interface.address;
      }
    }
  }

  console.log("❌ Could not find local IP address");
  return null;
}

getLocalIP();
