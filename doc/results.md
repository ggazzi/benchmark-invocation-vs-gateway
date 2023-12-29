After running the experiment as described in the [setup document](./setup.md), the following results were obtained:

```json
[
  {
    name: 'Invocation',
    stats: {
      mean_ms: 230.8497617666667,
      stdDev_ms: 17.928270519699076,
      min_ms: 214.35999550000003,
      max_ms: 270.6565495
    },
    numSamples: 15,
    samples_ms: [
      214.35999550000003, 214.39781299999999,
      215.58337999999998,         216.123819,
              216.537735,        216.9222765,
             218.8066005,        225.6317575,
             230.2161515,         239.121534,
             239.4474825, 241.27597500000002,
      241.35043249999998,        262.3149245,
270.6565495
    ]
  },
  {
    name: 'API Gateway',
    stats: {
      mean_ms: 242.5889870333333,
      stdDev_ms: 50.60869040448179,
      min_ms: 215.581399,
      max_ms: 399.356922
    },
    numSamples: 15,
    samples_ms: [
              215.581399, 215.90470549999998,
      216.68234650000002,         216.854974,
              217.014457, 217.44019649999998,
      218.28259699999998,         223.804332,
             225.1483565,        227.9610255,
              232.743257,        238.4591465,
              257.350067, 316.25102350000003,
399.356922
    ]
  }
]
```

There was no significant difference in performance between the two alternatives.
In fact, the difference is within the standard deviation of the samples.
