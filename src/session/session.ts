const KEY = "session";
import { ISession, ISessionCardObject, CardStatus } from "./session.dto";
import { ICardItem } from '@/components/Card/card-item.interface';
// import { useCardStore } from '../store/card'
// const cardStore = useCardStore();

// cardStore.$subscribe((mutation, state) => {
//     console.log({ mutation, state })
// });

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
    get(): ISession {
        return JSON.parse(localStorage.getItem(KEY) || "");
    },
    set(session: ISession): void {
        localStorage.setItem(KEY, JSON.stringify(session));
    },
    changeStatus(uuid: string, status: CardStatus) {
        const session = this.get();
        const sessionItem = session.items.find(item => item.uuid == uuid)

        if (sessionItem === undefined) {
            return;
        }

        status == "" && session.errorsCount++;

        sessionItem.status = status;

        this.set(session);
    },
    changeStatusByIndex(index: number, status: CardStatus) {
        const session = this.get();
        const sessionItem = session.items.at(index);

        if (sessionItem === undefined) {
            return;
        }

        sessionItem.status = status;

        this.set(session);
    },
    addError() {
        const session = this.get();
        session.errorsCount++;
        this.set(session);
    },
    fillItems(items: Array<ICardItem>): void {
        const session = this.get();
        const newItems = items.map((item, index) => ({
            uuid: item.uuid,
            status: item.status,
        }));

        session.items = newItems;
        this.set(session)
    },
    get isInitialized() {
        return Object.keys(this.get().items).length > 0;
    }
}