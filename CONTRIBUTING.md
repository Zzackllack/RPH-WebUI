# Contributing Guidelines

Thank you for your interest in contributing to this project! Your help is appreciated.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists.
2. Use the bug report template.
3. Provide detailed reproduction steps.
4. Include system information.

### Suggesting Features

1. Check if the feature request already exists.
2. Use the feature request template.
3. Explain the use case and benefits.
4. Consider implementation complexity.

### Pull Requests

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Make your changes in the appropriate directory:
   - **Backend:** `apps/backend` (Java Spring Boot)
   - **Frontend:** `apps/frontend` (Next.js/React/TypeScript)
4. Write or update tests as needed.
5. Update documentation if your changes affect usage or setup.
6. Commit your changes (`git commit -m 'Add amazing feature'`).
7. Push to your branch (`git push origin feature/amazing-feature`).
8. Open a Pull Request.

### Development Setup

#### Backend (Spring Boot)

- Download the [ResourcePackConverter Console Version](https://github.com/agentdid127/ResourcePackConverter/releases) and install it into your local Maven repository as described in the README.
- Build the backend:

```bash
cd apps/backend
./mvnw clean install
# or, if Maven is installed globally:
mvn clean install
```

#### Frontend (Next.js)

- Install dependencies:

```bash
cd apps/frontend
pnpm install
```

- Start the development server:

```bash
pnpm dev
```

- The frontend connects to the backend API using the `NEXT_PUBLIC_API_URL` environment variable.

### Code Style

- Follow the existing code style for Java and TypeScript/React.
- Run linters before committing.
- Write meaningful commit messages.
- Add or update tests for new features.

### Review Process

1. All submissions require review.
2. Automated tests must pass.
3. Code coverage should not decrease.
4. Documentation must be updated if needed.

## Questions?

Feel free to open an issue for any questions about contributing!
