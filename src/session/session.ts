const KEY = "session";

import { ISession } from "./session.dto";
export default {
    init: (): void => {
        const sessionName = localStorage.getItem(KEY);

        if (!sessionName) {
            const sign = prompt("Ingresa tu nombre") || "Player";
            const newSession: ISession = {
                cardsStatuses: {},
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
        delete session.cardsStatuses[uuid];
        this.set(session)
    },
    addSuccess(uuid: string): void {
        const session = this.get();
        session.cardsStatuses[uuid] = "success";
        this.set(session)
    },
    addRevealed(uuid: string): void {
        const session = this.get();
        session.cardsStatuses[uuid] = "revealed";
        this.set(session)
    }
}