# RPH-WebUI: Minecraft Resource Pack Hosting Platform

RPH-WebUI is a full-stack platform for hosting, sharing, and managing Minecraft resource packs. It provides a secure backend API (Java Spring Boot) and a modern, responsive frontend (Next.js/React/TypeScript) for users to upload, browse, and download resource packs.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Project Structure

- **apps/backend/**: Java Spring Boot REST API for resource pack management, file uploads, and conversion jobs.
- **apps/frontend/**: Next.js/React/TypeScript web UI for authentication, dashboard, uploads, and browsing packs.

## Installation

### Backend (Spring Boot)

Note that the backend instead of using jitpack (I may am too stupid to get that to work) you need to use the local jar file of ResourcePackConverter. For this, you need to download the [ResourcePackConverter **Console Version**](https://github.com/agentdid127/ResourcePackConverter/releases) and install it into your local Maven repository or use the JAR file directly.

*Install the jar file into your local Maven repository, you can use the `apps/backend/src/main/resources/ResourcePackConverter.jar` if it is still up to date:*

```bash
cd apps/backend
mvn install:install-file \
  -Dfile=src/main/resources/ResourcePackConverter.jar \
  -DgroupId=com.agentdid127 \
  -DartifactId=resourcepack-converter \
  -Dversion=2.2.5 \
  -Dpackaging=jar \
  -DgeneratePom=true
```

*or if you are using a POSIX Shell, you can use the following command to install it:*

```bash
cd apps\backend
.\mvnw install:install-file `
  -Dfile="src/main/resources/ResourcePackConverter.jar" `
  -DgroupId="com.agentdid127" `
  -DartifactId="ResourcePackConverter" `
  -Dversion="2.2.5" `
  -Dpackaging="jar" `
  -DgeneratePom=true
```

*Or if you are using an DOS Shell like cmd.exe, you can use the following command to install it:*

```bash
cd apps\backend
.\mvnw install:install-file ^
  -Dfile="src/main/resources/ResourcePackConverter.jar" ^
  -DgroupId=com.agentdid127 ^
  -DartifactId=ResourcePackConverter ^
  -Dversion=2.2.5 ^
  -Dpackaging=jar ^
  -DgeneratePom=true
```

*Then, you can build the backend using Maven:*

```bash
cd apps/backend
./mvnw clean install
```

*or if you have Maven installed globally:*

```bash
cd apps/backend
mvn clean install
```

### Frontend (Next.js)

*All following pnpm commands also work with yarn or npm, but pnpm is recommended for better performance.*

```bash
cd apps/frontend
pnpm install
```

## Usage

### Start Backend

```bash
cd apps/backend
./mvnw spring-boot:run
```

*or if you have Maven installed globally:*

```bash
cd apps/backend
mvn spring-boot:run
```

### Start Frontend

```bash
cd apps/frontend
pnpm dev
```

The frontend will connect to the backend API using the `NEXT_PUBLIC_API_URL` environment variable.

## Features

- User authentication (demo credentials configurable via environment)
- Upload, manage, and download Minecraft resource packs
- Dashboard for pack management and statistics (currently WIP)
- Asynchronous conversion jobs (via backend, currently WIP)
- Responsive, modern UI with Tailwind CSS
- Error handling and toast notifications
- Secure file handling and validation

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting issues and pull requests.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Support

- Create an [issue](.github/ISSUE_TEMPLATE/bug_report.md) for bug reports or feature requests
- See [SECURITY.md](SECURITY.md) for reporting vulnerabilities

## Acknowledgments

- Inspired by the Minecraft
- Thanks to all contributors and open-source libraries used especially [ResourcePackConverter](https://github.com/agentdid127/ResourcePackConverter)
