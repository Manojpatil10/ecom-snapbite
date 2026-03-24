FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

# 🔥 ADD THIS LINE (important)
RUN chmod +x mvnw

# Build project
RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/*.jar"]