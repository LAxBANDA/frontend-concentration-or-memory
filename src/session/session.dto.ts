export enum CardStatus {
    DEFAULT = 'default',
    REVEALED = 'revealed',
    SUCCESS = 'success'
}

export interface ISessionCardObject {
    status: CardStatus;
    uuid: string;
};

export interface ISession {
    name: string;
    items: ISessionCardObject[];
    errorsCount: number;
}