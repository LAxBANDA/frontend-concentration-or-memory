const KEY = "session";
import { ISession, CardStatus } from "./session.dto";
import { ICardItem } from '@/components/Card/card-item.interface';

export default {
    init: (): void => {
        const sessionName = localStorage.getItem(KEY);

        if (!sessionName) {
            const sign = prompt("Ingresa tu nombre") || "Player";
            const newSession: ISession = {
                items: [],
                errorsCount: 0,
                name: sign
            };

            localStorage.setItem(KEY, JSON.stringify(newSession));
        } else {

        }
    },
    get getSession(): ISession {
        return JSON.parse(localStorage.getItem(KEY) || "");
    },
    set(session: ISession): void {
        localStorage.setItem(KEY, JSON.stringify(session));
    },
    changeStatusByIndex(index: number, status: CardStatus) {
        const session = this.getSession;
        const sessionItem = session.items[index];

        sessionItem.status = status;

        this.set(session);
    },
    addError() {
        const session = this.getSession;
        session.errorsCount++;
        this.set(session);
    },
    fillItems(items: Array<ICardItem>): void {
        const session = this.getSession;
        const newItems = items.map(item => ({
            uuid: item.uuid,
            status: item.status,
        }));

        session.items = newItems;
        this.set(session);
    },
    restart() {
        const session = this.getSession;
        session.items = [];
        session.errorsCount = 0;
        this.set(session);
    },
    get isInitialized() {
        return Object.keys(this.getSession.items).length > 0;
    }
}