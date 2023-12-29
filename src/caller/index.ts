import benny from 'benny';

const API_GATEWAY_URL = Bun.env.API_GATEWAY_URL as string;

async function invokeCallee(): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, 200));
}

async function requestCallee(): Promise<void> {
  const response = await fetch(API_GATEWAY_URL);
  if (response.status !== 200) {
    throw new Error(`Unexpected status code ${response.status}`);
  }
}

async function warmUp(): Promise<void> {
  for (const _ of Array(3)) {
    await requestCallee();
  }
}

async function runSuite(): Promise<object> {
  await warmUp();

  return new Promise((resolve) => {
    benny.suite(
      'Invocation vs. API Gateway',

      benny.add('Invocation', invokeCallee),
      benny.add('API Gateway', requestCallee),

      benny.complete((summary) => {
        const result = summary.results.map((item) => {
          return {
            name: item.name,
            stats: {
              mean_ms: item.details.mean * 1000,
              stdDev_ms: item.details.standardDeviation * 1000,
              min_ms: item.details.min * 1000,
              max_ms: item.details.max * 1000,
            },
            numSamples: item.details.sampleResults.length,
            samples_ms: item.details.sampleResults.map((x) => x * 1000),
          }
        });

        resolve(result);
      })
    )
  })
}

export default {
  async run(_request: Request): Promise<Response> {
    const result = { variations: await runSuite() };
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
