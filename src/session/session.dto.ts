import { CardStatus } from "@/item.interface";

export interface ISession {
    name: string;
    cardsStatuses: Record<string, CardStatus>;
    errorsCount: number;
}