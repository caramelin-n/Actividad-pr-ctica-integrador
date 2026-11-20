# Patrones de diseño y principios SOLID — BibliotecaTS

Los cuatro patrones participan del mismo flujo: el cambio de estado de un libro.

```
LibroService.cambiarEstado()
   └─> EventPublisher.notify(evento)                     ← Observer (Subject)
         └─> NotificationService.update(evento)          ← Observer (Observer)
               ├─ consulta suscriptores al repositorio   ← usa DBConnection (Singleton)
               └─ NotifierFactory.create('inapp')        ← Factory
                  NotifierFactory.create('console')
                        └─ ConsoleNotifierAdapter        ← Adapter
                              └─ console.log
```

---

## Patrones de diseño

### Singleton — `DBConnection`

**Archivos:** `backend/src/database/DatabaseConnection.ts`

**Problema que resuelve:** toda la aplicación tiene que compartir una única conexión a PostgreSQL. Cada modelo de Sequelize se inicializa con `DBConnection.getInstance()`, y como el constructor es privado nadie puede crear una segunda instancia de `Sequelize`. Así se evita abrir varios pools de conexiones y se garantiza que modelos, relaciones y `sync()` usan la misma conexión.

```ts
export class DBConnection {

    private static instance: Sequelize

    private constructor() {}

    static getInstance(): Sequelize {
        if (!DBConnection.instance) {
            DBConnection.instance = new Sequelize({
                dialect: "postgres",
                host: DB_HOST,
                ...
            })
        }
        return DBConnection.instance
    }
}
```

Uso en un modelo (`backend/src/models/Libro.ts`):

```ts
Libro.init({ ... }, {
    sequelize: DBConnection.getInstance(),
    tableName: "libros",
    timestamps: true
})
```

### Observer — `ISubject`, `IObserver`, `EventPublisher`, `NotificationService`

**Archivos:**
- `backend/src/observer/ISubject.ts`
- `backend/src/observer/IObserver.ts`
- `backend/src/observer/EventPublisher.ts` (Subject)
- `backend/src/services/NotificationService.ts` (Observer)
- `backend/src/services/LibroService.ts` (dispara el evento)
- `backend/src/main.ts` (registra el observer)

**Problema que resuelve:** `LibroService` necesita avisar que un libro cambió de estado, pero no debería saber quién reacciona ni cómo se notifica. Por eso solo publica un evento en el `EventPublisher`, y los observers registrados (hoy, `NotificationService`) deciden qué hacer. El patrón está implementado a mano, sin `EventEmitter` de Node.

```ts
export interface ISubject<T> {
    attach(observer: IObserver<T>): void
    detach(observer: IObserver<T>): void
    notify(event: T): Promise<void>
}

export interface IObserver<T> {
    update(event: T): Promise<void>
}
```

```ts
export class EventPublisher implements ISubject<LibroStateChangedEvent> {

    private observers: IObserver<LibroStateChangedEvent>[] = []

    attach(observer: IObserver<LibroStateChangedEvent>): void {
        if (this.observers.includes(observer)) return
        this.observers.push(observer)
    }

    detach(observer: IObserver<LibroStateChangedEvent>): void {
        this.observers = this.observers.filter(o => o !== observer)
    }

    async notify(event: LibroStateChangedEvent): Promise<void> {
        await Promise.all(this.observers.map(observer => observer.update(event)))
    }
}
```

El servicio del recurso dispara el evento (`LibroService.cambiarEstado`):

```ts
await this.eventPublisher.notify({
    libroId: updatedLibro.id,
    libroTitle: updatedLibro.title,
    previousState: libro.state,
    newState: updatedLibro.state,
})
```

Y en `main.ts` se registra el observer:

```ts
eventPublisher.attach(notificationService)
```

Hay dos niveles distintos: los **observers** (como `NotificationService`) son objetos del backend que reaccionan al evento. Las **suscripciones** (tabla `subscriptions`) son datos que indican qué usuario sigue qué libro. `NotificationService.update()` consulta las suscripciones para saber a quién notificar.

### Factory — `NotifierFactory`

**Archivos:**
- `backend/src/notifications/NotifierFactory.ts`
- `backend/src/notifications/INotifier.ts`
- `backend/src/notifications/InAppNotifier.ts`

**Problema que resuelve:** `NotificationService` tiene que mandar notificaciones por varios canales sin hacer `new` de cada uno ni conocer sus dependencias (por ejemplo, `InAppNotifier` necesita el repositorio de notificaciones). La factory centraliza la creación: recibe el tipo de canal y devuelve un `INotifier` listo para usar.

```ts
export type NotifierType = 'inapp' | 'console'

export class NotifierFactory {

    constructor(private notificationRepository: INotificationRepository) {}

    create(type: NotifierType): INotifier {
        switch (type) {
            case 'inapp':
                return new InAppNotifier(this.notificationRepository)
            case 'console':
                return new ConsoleNotifierAdapter()
            default:
                throw new Error(`Canal de notificación no soportado: ${type}`)
        }
    }
}
```

Uso en `NotificationService.update()`:

```ts
const notifiers = this.channels.map(channel => this.notifierFactory.create(channel))
```

### Adapter — `ConsoleNotifierAdapter`

**Archivos:** `backend/src/notifications/ConsoleNotifierAdapter.ts`

**Problema que resuelve:** la aplicación espera que todo canal cumpla `INotifier`, es decir, que reciba un objeto de notificación y devuelva una `Promise`. `console.log`, en cambio, recibe texto y no devuelve nada. El adapter traduce el objeto a una línea legible y se la pasa a `console.log`, así `NotificationService` nunca llama a `console.log` directamente.

```ts
export class ConsoleNotifierAdapter implements INotifier {

    constructor(private readonly log: (message: string) => void = console.log) {}

    async send(notification: NotificationDTO): Promise<void> {
        const text = `[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro #${notification.libroId} | Estado: ${notification.previousState} → ${notification.newState}`
        this.log(text)
    }
}
```

Salida en la consola del backend:

```
[NOTIFICACIÓN] Para: usuario@tp.com | Libro #1 | Estado: DISPONIBLE → PRESTADO
```

---

## Principios SOLID

### S — Responsabilidad única

**Archivos:**
- `backend/src/controllers/LibroController.ts`
- `backend/src/services/LibroService.ts`
- `backend/src/repositories/LibroRepository.ts`

(Lo mismo para usuarios, suscripciones y notificaciones.)

**Problema que resuelve:** cada capa tiene un solo motivo para cambiar. El controller solo traduce HTTP (lee `req` y responde con `res`), el service tiene las reglas de negocio y no conoce Express, y el repositorio es el único que accede a los modelos de Sequelize. Si cambia el ORM, solo se tocan los repositorios. Si cambia una regla de negocio, solo el service.

```ts
changeState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const libro = await this.libroService.cambiarEstado(parseId(req.params.id), req.body)
        res.status(200).json(libro)
    } catch (error) {
        next(error)
    }
}
```

```ts
async cambiarEstado(id: number, nuevoEstado: estadosDisponibles): Promise<LibroResponseDTO | null> {
    const libro = await Libro.findByPk(id)
    if (!libro) return null
    await libro.update({ state: nuevoEstado })
    return libro.toJSON()
}
```

### O — Abierto/cerrado

**Archivos:**
- `backend/src/services/NotificationService.ts`
- `backend/src/main.ts`

**Problema que resuelve:** se puede agregar un canal de notificación nuevo (por ejemplo, email) sin modificar `NotificationService`. El servicio recibe por constructor la lista de canales y los recorre de forma genérica a través de `INotifier`. Alcanza con crear la clase del canal, sumarla a la factory y agregarla a la lista en `main.ts`.

```ts
async update(event: LibroStateChangedEvent): Promise<void> {
    const subscribers = await this.subscriptionRepository.listarSuscriptoresPorLibro(event.libroId)
    if (subscribers.length === 0) return
    const notifiers = this.channels.map(channel => this.notifierFactory.create(channel))
    ...
    return notifiers.map(notifier => notifier.send(notification))
}
```

```ts
const notificationService = new NotificationService(subscriptionRepository, notificationRepository, notifierFactory, ['inapp', 'console'])
```

### L — Sustitución de Liskov

**Archivos:**
- `backend/src/notifications/INotifier.ts`
- `backend/src/notifications/InAppNotifier.ts`
- `backend/src/notifications/ConsoleNotifierAdapter.ts`

**Problema que resuelve:** cualquier implementación de `INotifier` puede reemplazar a otra sin que `NotificationService` se entere ni se rompa. Las dos reciben el mismo `NotificationDTO` y devuelven `Promise<void>`. Una guarda en la base y la otra imprime en consola, pero ambas respetan el contrato.

```ts
export interface INotifier {
    send(notification: NotificationDTO): Promise<void>
}
```

```ts
export class InAppNotifier implements INotifier {

    constructor(private notificationRepository: INotificationRepository) {}

    async send(notification: NotificationDTO): Promise<void> {
        await this.notificationRepository.crearNotificacion({
            userId: notification.userId,
            message: notification.message,
        })
    }
}
```

### I — Segregación de interfaces

**Archivos:**
- `backend/src/repositories/interfaces/IRoleRepository.ts`
- `backend/src/repositories/interfaces/ISubscriptionRepository.ts`
- `backend/src/repositories/interfaces/INotificationRepository.ts`
- `backend/src/repositories/interfaces/ILibroRepository.ts`
- `backend/src/repositories/interfaces/IUserRepository.ts`
- `backend/src/observer/IObserver.ts`

**Problema que resuelve:** en lugar de un repositorio genérico enorme, cada entidad tiene una interfaz chica con solo las operaciones que se usan. Por ejemplo, `IRoleRepository` no expone edición ni borrado, porque los roles se cargan por seed. Así ningún servicio depende de métodos que no necesita.

```ts
export interface IRoleRepository {
    crearRol(name: rolesDisponibles): Promise<RoleResponseDTO>
    buscarRolPorNombre(name: string): Promise<RoleResponseDTO | null>
    buscarRolPorId(id: number): Promise<RoleResponseDTO | null>
    obtenerPermisos(roleId: number): Promise<string[]>
}
```

### D — Inversión de dependencias

**Archivos:**
- `backend/src/services/LibroService.ts`
- `backend/src/services/AuthService.ts`
- `backend/src/services/SubscriptionService.ts`
- `backend/src/main.ts` (composition root)

**Problema que resuelve:** los servicios dependen de abstracciones (interfaces de repositorio, `ISubject`) y no de las clases concretas. Las implementaciones se crean y se inyectan por constructor en un único lugar, `main.ts`. Esto permite cambiar una implementación (por ejemplo, un repositorio en memoria para pruebas) sin tocar el servicio.

```ts
export class LibroService {
    constructor(private libroRepository: ILibroRepository,
        private eventPublisher: ISubject<LibroStateChangedEvent>,
    ) {}
}
```

```ts
const libroRepository = new LibroRepository()
const eventPublisher = new EventPublisher()
const libroService = new LibroService(libroRepository, eventPublisher)
```
