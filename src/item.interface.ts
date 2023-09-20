import { ImageDto } from "./image.dto";
export type CardStatus = '' | 'revealed' | 'success';
export type ICardItem = ImageDto & { status: CardStatus };