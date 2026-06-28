# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies first
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Build the application
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Non-root user
RUN groupadd -r marau && useradd -r -g marau marau

COPY --from=build /app/target/hospedagens-1.0.0.jar app.jar
RUN chown -R marau:marau /app
USER marau

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
