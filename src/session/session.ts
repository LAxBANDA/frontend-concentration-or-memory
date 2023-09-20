const KEY = "session";
import { ISession, ISessionCardObject } from "./session.dto";
import { ICardItem } from '@/card-item.interface';

export default {
    init: (): void => {
        const sessionName = localStorage.getItem(KEY);

        if (!sessionName) {
            const sign = prompt("Ingresa tu nombre") || "Player";
            const newSession: ISession = {
                items: {},
                errorsCount: 0,
                name: sign
            }
            localStorage.setItem(KEY, JSON.stringify(newSession));
        } else {

        }
    },
    get(): ISession {
        return JSON.parse(localStorage.getItem(KEY) || "");
    },
    set(session: ISession): void {
        localStorage.setItem(KEY, JSON.stringify(session));
    },
    addError(uuid: string): void {
        const session = this.get();
        session.errorsCount++
        console.log(uuid)
        session.items[uuid].status = "";
        this.set(session)
    },
    addSuccess(uuid: string): void {
        const session = this.get();
        session.items[uuid].status = "success";
        this.set(session)
    },
    addRevealed(uuid: string): void {
        const session = this.get();
        session.items[uuid].status = "revealed";
        this.set(session)
    },
    fillItems(items: Array<ICardItem>): void {
        const session = this.get();
        const newItems: Record<string, ISessionCardObject> = {};
        console.log(items)
        items.forEach((item, index) => {
            console.log(item)
            newItems[item.uuid] = {
                order: index,
                status: item.status
            };
        });

        console.log({newItems})

        session.items = newItems;
        this.set(session)

    }
}