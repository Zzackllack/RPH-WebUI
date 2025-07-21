# AGENTS.BACKEND.md

## Backend Overview

This is the Java Spring Boot REST API for Minecraft Resource Pack management, file uploads, and conversion jobs.

### Location

- Directory: `apps/backend/`

### Technologies

- Java 17+
- Spring Boot
- Maven
- ResourcePackConverter (external JAR)

## Project Structure

- `src/main/java/com/zacklack/` — Main Java source code
- `src/main/resources/` — Resources (properties, static files, templates)
- `src/test/java/com/` — Test sources
- `pom.xml` — Maven build file
- `mvnw`, `mvnw.cmd` — Maven wrapper scripts
- `ResourcePackConverter.jar` — External dependency for resource pack conversion

## Code Quality Scripts

All contributors and AI agents should use the following scripts before submitting changes to the backend:

### Format

Formats all supported files (Java, JavaScript, TypeScript, CSS) using Prettier:

```bash
pnpm run format
```

### Lint

Lints frontend source files using ESLint:

```bash
pnpm run lint
```

## Build & Run

- **Install ResourcePackConverter JAR:**
  See README for instructions. Required for conversion features.
- **Build:**

  ```pwsh
  ./mvnw clean install
  ```

- **Run:**

  ```pwsh
  ./mvnw spring-boot:run
  ```

## Environment & Configuration

- Main config: `src/main/resources/application.properties` or `.yml`
- API endpoints: `/api/resourcepacks`, `/api/resourcepacks/{id}/convert`, etc.

## Coding Standards

- Follow Java and Spring Boot best practices (see `.github/instructions/Java-Development.instructions.md` and `.github/instructions/Spring-Boot-Development.instructions.md`).
- Use RESTful conventions for API endpoints.
- Write unit and integration tests in `src/test/java`.
- Document public methods and classes with Javadoc.

## For AI Agents

- All main logic is in `src/main/java/com/zacklack/`
- Conversion jobs use ResourcePackConverter.jar (see README for setup)
- Use Maven for dependency management and builds
- API endpoints are documented in README and code comments
- See `.github/instructions/Performance-Optimization-Best-Practices.instructions.md` for optimization tips

---

For more details, see the README and CONTRIBUTING files.
