# Token Bucket Rate Limiter

[![npm version](https://img.shields.io/npm/v/@debasish-debnath/ratelimiter)](https://www.npmjs.com/package/@debasish-debnath/ratelimiter)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/Dev-Git8/TokenBucket-RateLimiter-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/Dev-Git8/TokenBucket-RateLimiter-ts/actions)

A TypeScript implementation of the **Token Bucket** rate limiting algorithm for Node.js applications.

The library is designed with clean architecture principles and separates the rate limiting algorithm from storage, locking, cleanup, and time management through interfaces, making it easy to test, extend, and maintain.

---

## Features

- Token Bucket rate limiting algorithm
- Fractional token refill
- Per-key rate limiting
- Asynchronous per-key locking
- Automatic cleanup of idle buckets
- Clock abstraction for deterministic testing
- Fake clock for unit testing
- Express middleware
- Dependency injection support
- TypeScript-first API
- ESM and CommonJS support
- High unit test coverage

---

## Installation

```bash
npm install @debasish-debnath/ratelimiter
```

or

```bash
pnpm add @debasish-debnath/ratelimiter
```

---

# Quick Start

```ts
import { TokenBucket } from "@debasish-debnath/ratelimiter";

const limiter = new TokenBucket({
    capacity: 10,
    refillRate: 5,

    cleanup: {
        cleanupInterval: 60_000,
        maxIdleTime: 300_000,
    },
});

const result = await limiter.consume("user-123");

console.log(result);
```

Example output:

```ts
{
    allowed: true,
    remainingTokens: 9,
    retryAfter: null,
    limit: 10,
    resetAfter: 0
}
```

---

# Express Middleware

```ts
import express from "express";
import {
    TokenBucket,
    rateLimit,
} from "@debasish-debnath/ratelimiter";

const app = express();

const limiter = new TokenBucket({
    capacity: 20,
    refillRate: 5,

    cleanup: {
        cleanupInterval: 60_000,
        maxIdleTime: 300_000,
    },
});

app.use(rateLimit(limiter));

app.get("/", (_, res) => {
    res.send("Hello World");
});

app.listen(3000);
```

---

# Configuration

```ts
new TokenBucket({
    capacity: 10,
    refillRate: 5,

    cleanup: {
        cleanupInterval: 60_000,
        maxIdleTime: 300_000,
    },
});
```

| Option | Description |
|---------|-------------|
| capacity | Maximum number of tokens in a bucket |
| refillRate | Tokens added per second |
| cleanup.cleanupInterval | Interval between cleanup cycles (ms) |
| cleanup.maxIdleTime | Idle time before a bucket is removed (ms) |

---

# API

## consume(key)

Consumes one token from the bucket associated with the supplied key.

```ts
const result = await limiter.consume("user-123");
```

Returns

```ts
interface ConsumeResult {
    allowed: boolean;
    remainingTokens: number;
    retryAfter: number | null;
    limit: number;
    resetAfter: number;
}
```

---

## destroy()

Stops the background cleanup service.

```ts
limiter.destroy();
```

This should be called before shutting down the application.

---

# Architecture

```
                 Express Middleware
                         │
                         ▼
                  RateLimiter Interface
                         ▲
                         │
                  TokenBucket
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
 BucketStorage      LockManager        Clock
        │                                │
        ▼                                ▼
 BucketCleanup                   FakeClock/SystemClock
```

---

# Project Structure

```
src
├── bucket
│   ├── interfaces
│   ├── BucketCleanup.ts
│   ├── BucketStorage.ts
│   ├── LockManager.ts
│   ├── TokenBucket.ts
│   └── index.ts
│
├── clock
│   ├── Clock.ts
│   ├── FakeClock.ts
│   ├── SystemClock.ts
│   └── index.ts
│
├── middleware
│
├── common
│
└── index.ts
```

---

# Design Principles

The project follows a modular architecture where each component has a single responsibility.

### TokenBucket

Owns the rate limiting algorithm.

### BucketStorage

Responsible only for bucket persistence.

### LockManager

Provides asynchronous per-key mutual exclusion to prevent race conditions.

### BucketCleanup

Removes idle buckets periodically to prevent unbounded memory growth.

### Clock

Provides a time abstraction for deterministic testing.

---

# Why a Clock Abstraction?

Using `Date.now()` directly makes testing difficult.

The library introduces a `Clock` interface.

Production:

```ts
SystemClock
```

Testing:

```ts
FakeClock
```

This allows unit tests to simulate time instantly without waiting.

---

# Concurrency

Concurrent requests targeting the same key are protected using a per-key asynchronous mutex.

This guarantees that bucket state remains consistent even under heavy concurrent load.

---

# Testing

Run all tests

```bash
pnpm test
```

Generate coverage

```bash
pnpm test:coverage
```

The project includes deterministic tests using `FakeClock`.

---

# Build

```bash
pnpm build
```

The package is built using **tsup** and generates:

- ESM bundle
- CommonJS bundle
- TypeScript declaration files

---

# Roadmap

## Version 1.x

- In-memory Token Bucket
- Express middleware
- Fake clock
- Automatic cleanup
- Dependency injection
- TypeScript support

## Version 2.x

- Redis-backed implementation
- Lua scripts for distributed atomicity
- Sliding Window algorithm
- Leaky Bucket algorithm
- Fastify middleware
- NestJS integration
- Benchmark suite

---

# Contributing

Contributions are welcome.

To get started:

```bash
git clone https://github.com/Dev-Git8/TokenBucket-RateLimiter-ts.git

pnpm install

pnpm test
```

Please open an issue before submitting large feature changes.

---

# License

MIT License.

---

# Author

**Debasish Debnath**

GitHub: https://github.com/Dev-Git8

npm: https://www.npmjs.com/~debasish-debnath