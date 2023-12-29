export default {
  async fetch(_request: Request): Promise<Response> {
    // Wait 200ms before responding
    await new Promise((resolve) => setTimeout(resolve, 200));

    return new Response("Hello from Lambda!", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
