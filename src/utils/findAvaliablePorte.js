import net from "net";

export function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      server.once("close", () => resolve(startPort));
      server.close();
    });
    server.on("error", () => resolve(findAvailablePort(startPort + 1)));
  });
}