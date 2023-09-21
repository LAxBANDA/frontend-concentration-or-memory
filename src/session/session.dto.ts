import { CardStatus } from "@/card-item.interface";

export interface ISessionCardObject {
    status: CardStatus;
    order: number;
};

export interface ISession {
    name: string;
    items: Record<string, ISessionCardObject>;
    errorsCount: number;
}