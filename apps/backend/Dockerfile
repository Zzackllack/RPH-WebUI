# syntax=docker/dockerfile:1

# --- Build Stage ---
FROM maven:3.9.7-eclipse-temurin-21 AS build

WORKDIR /build

# Copy backend source code
COPY . /build

# Copy the ResourcePackConverter.jar into the build context (assumes it's in src/main/resources)
# If the path changes, update accordingly.
COPY src/main/resources/ResourcePackConverter.jar /build/src/main/resources/ResourcePackConverter.jar

# Install the ResourcePackConverter.jar into the local Maven repository
RUN mvn install:install-file \
    -Dfile=src/main/resources/ResourcePackConverter.jar \
    -DgroupId=com.agentdid127 \
    -DartifactId=resourcepack-converter \
    -Dversion=2.2.5 \
    -Dpackaging=jar \
    -DgeneratePom=true

# Build the backend
RUN mvn clean package -DskipTests

# --- Run Stage ---
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built Spring Boot jar from the build stage
COPY --from=build /build/target/rph-backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Environment variable for configuration (can be overridden at runtime)
# Add all additional from application.properties or application.yml here
ENV SPRING_PROFILES_ACTIVE=prod

# Run the Spring Boot application
ENTRYPOINT ["java","-jar","/app/app.jar"]
