import { CardStatus } from "@/card-item.interface";

export type ISessionCardObject = {
    status: CardStatus;
    order: number;
};

export interface ISession {
    name: string;
    items: Record<string, ISessionCardObject>;
    errorsCount: number;
}