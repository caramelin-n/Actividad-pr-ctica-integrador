import { LibroStateChangedEvent } from "../dtos/libro/LibroDto.js";
import { IObserver } from "./IObserver.js";
import { ISubject } from "./ISubject.js";

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
