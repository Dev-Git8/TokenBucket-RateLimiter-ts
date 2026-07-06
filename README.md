# 🚀 TokenBucket Rate Limiter

A production-grade **Token Bucket Rate Limiter** built with **TypeScript** for Node.js applications.

Designed with clean architecture, dependency injection, deterministic testing, and extensibility in mind. Suitable for learning backend architecture or integrating into production services.

---

## ✨ Features

- ✅ Token Bucket algorithm
- ✅ Fractional token refill
- ✅ Per-key rate limiting
- ✅ Async mutex to prevent race conditions
- ✅ Dependency Injection
- ✅ Interface-driven architecture
- ✅ Automatic idle bucket cleanup
- ✅ FakeClock for deterministic testing
- ✅ Express middleware
- ✅ High unit test coverage
- 🚧 Redis distributed rate limiter (Coming Soon)

---

## 📦 Installation

```bash
npm install tb-ratelimit
```

or

```bash
pnpm add tb-ratelimit
```

---

# 🚀 Quick Start

```ts
import { TokenBucket } from "tb-ratelimit";

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

Example output

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
} from "tb-ratelimit";

const app = express();

const limiter = new TokenBucket({
    capacity: 10,
    refillRate: 2,

    cleanup: {
        cleanupInterval: 60_000,
        maxIdleTime: 300_000,
    },
});

app.use(rateLimit(limiter));
```

---

# 🏗 Architecture

```
                    +----------------------+
                    |   Express Middleware |
                    +----------+-----------+
                               |
                               ▼
                     RateLimiter Interface
                               ▲
                               │
                     TokenBucket (Memory)
                               │
        ┌──────────────┬──────────────┬──────────────┐
        │              │              │
        ▼              ▼              ▼
 BucketStorage    LockManager      Fake/System Clock
        │
        ▼
 BucketCleanup
```

---

# 📂 Project Structure

```
src/
│
├── bucket/
│   ├── interfaces/
│   ├── BucketCleanup.ts
│   ├── BucketStorage.ts
│   ├── LockManager.ts
│   ├── TokenBucket.ts
│
├── clock/
│
├── middleware/
│
├── common/
│
└── index.ts
```

---

# 🧪 Testing

Run the test suite

```bash
pnpm test
```

Generate coverage

```bash
pnpm test:coverage
```

---

# 🔧 API

## TokenBucket

### Constructor

```ts
new TokenBucket(options)
```

### Options

| Property | Description |
|----------|-------------|
| capacity | Maximum number of tokens |
| refillRate | Tokens added per second |
| cleanup.cleanupInterval | Cleanup interval in milliseconds |
| cleanup.maxIdleTime | Time before idle buckets are removed |

---

### consume()

```ts
const result = await limiter.consume("user-id");
```

Returns

```ts
{
    allowed: boolean;
    remainingTokens: number;
    retryAfter: number | null;
    limit: number;
    resetAfter: number;
}
```

---

# 📖 Design Decisions

This project was built with production-oriented backend design principles:

- Dependency Injection
- SOLID Principles
- Interface-driven architecture
- Repository Pattern
- Async Mutex for concurrency control
- Deterministic testing with FakeClock
- Separation of concerns

---

# 🛣 Roadmap

## v1.0

- ✅ In-memory Token Bucket
- ✅ Express Middleware
- ✅ Cleanup Service
- ✅ Unit Tests
- ✅ High Test Coverage

## v2.0

- 🚧 Redis-backed distributed rate limiter
- 🚧 Lua scripts for atomic operations
- 🚧 Benchmarks
- 🚧 Fastify middleware
- 🚧 NestJS integration

---

# 🤝 Contributing

Contributions, bug reports, and feature requests are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# 📄 License

MIT License

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

It helps others discover the project and motivates future development.