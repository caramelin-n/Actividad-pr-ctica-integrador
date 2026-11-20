import { API_PORT } from "./config/env.js";
import { DBConnection } from "./database/DatabaseConnection.js";
import { runSeed } from "./database/seed.js";
import "./models/Relations.js";
import { createApp } from "./app.js";
import { UserParser } from "./dtos/user/UserDto.js";
import { JWTHandler } from "./helpers/JWTHelper.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { RoleRepository } from "./repositories/RoleRepository.js";
import { LibroRepository } from "./repositories/LibroRepository.js";
import { SubscriptionRepository } from "./repositories/SubscriptionRepository.js";
import { NotificationRepository } from "./repositories/NotificationRepository.js";
import { EventPublisher } from "./observer/EventPublisher.js";
import { NotifierFactory } from "./notifications/NotifierFactory.js";
import { AuthService } from "./services/AuthService.js";
import { UserService } from "./services/UserService.js";
import { LibroService } from "./services/LibroService.js";
import { SubscriptionService } from "./services/SubscriptionService.js";
import { NotificationService } from "./services/NotificationService.js";
import { AuthController } from "./controllers/AuthController.js";
import { UserController } from "./controllers/UserController.js";
import { LibroController } from "./controllers/LibroController.js";
import { SubscriptionController } from "./controllers/SubscriptionController.js";
import { NotificationController } from "./controllers/NotificationController.js";
import { AuthMiddleware } from "./middlewares/authenticate.js";
import { AuthorizeMiddleware } from "./middlewares/authorize.js";
import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { libroRoutes } from "./routes/libro.routes.js";
import { subscriptionRoutes } from "./routes/subscription.routes.js";
import { notificationRoutes } from "./routes/notification.routes.js";

const bootstrap = async (): Promise<void> => {
    await DBConnection.connect()
    await DBConnection.sync()
    await runSeed()

    const jwtHandler = new JWTHandler()
    const userParser = new UserParser()

    const userRepository = new UserRepository()
    const roleRepository = new RoleRepository()
    const libroRepository = new LibroRepository()
    const subscriptionRepository = new SubscriptionRepository()
    const notificationRepository = new NotificationRepository()

    const eventPublisher = new EventPublisher()
    const notifierFactory = new NotifierFactory(notificationRepository)

    const authService = new AuthService(userRepository, roleRepository, jwtHandler, userParser)
    const userService = new UserService(userRepository, roleRepository, userParser)
    const libroService = new LibroService(libroRepository, eventPublisher)
    const subscriptionService = new SubscriptionService(subscriptionRepository, libroRepository)
    const notificationService = new NotificationService(subscriptionRepository, notificationRepository, notifierFactory, ['inapp', 'console'])

    eventPublisher.attach(notificationService)

    const authMiddleware = new AuthMiddleware(jwtHandler)
    const authorizeMiddleware = new AuthorizeMiddleware(authService)

    const app = createApp({
        auth: authRoutes(new AuthController(authService), authMiddleware),
        users: userRoutes(new UserController(userService), authMiddleware, authorizeMiddleware),
        libros: libroRoutes(new LibroController(libroService), authMiddleware, authorizeMiddleware),
        subscriptions: subscriptionRoutes(new SubscriptionController(subscriptionService), authMiddleware, authorizeMiddleware),
        notifications: notificationRoutes(new NotificationController(notificationService), authMiddleware, authorizeMiddleware),
    })

    app.listen(Number(API_PORT), () => {
        console.log(`Servidor escuchando en el puerto ${API_PORT}`)
    })
}

bootstrap().catch(error => {
    console.error("No se pudo iniciar el servidor", error)
    process.exit(1)
})
