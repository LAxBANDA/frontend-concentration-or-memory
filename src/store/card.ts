import { ImageDto } from '@/image.dto';
import { ICardItem } from '@/components/Card/card-item.interface';
import sessionHook from '@/session/session';
import { defineStore } from 'pinia';
import { CardStatus } from '@/session/session.dto';

const API_URL = "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20";
const session = sessionHook.getSession;

interface EntrieDto {
    fields: { image: ImageDto };
}

export const useCardStore = defineStore('card', {
    state: () => ({
        loading: false,
        items: <Array<ICardItem>>[],
        errorsCount: 0,
        successesCount: 0,
    }),
    getters: {
    },
    actions: {
        revealCard(itemObj: ICardItem, index: number): CardStatus {
            // 1. Buscamos si hay otra carta revelada (aparte de la que ya revelamos)
            const itemRevealedIndex = this.items.findIndex(item => item.status === CardStatus.REVEALED);

            // 2. Cambiamos el estado de la carta
            itemObj.status = CardStatus.REVEALED;

            // 3. Si no existe otra carta revelada
            if (itemRevealedIndex === -1) {
                return itemObj.status;
            }

            // 4. Accedemos al objeto de carta mediante el index que obtuvimos anteriormente
            const itemRevealed = this.items.at(itemRevealedIndex);

            if (itemRevealed === undefined) {
                return itemObj.status;
            }

            // 5. Comparamos si las dos cartas reveladas son iguales o diferentes y guardamos su resultado
            const nextCardStatus: CardStatus = itemRevealed.uuid === itemObj.uuid ? CardStatus.SUCCESS : CardStatus.DEFAULT;

            switch (nextCardStatus) {
                case CardStatus.DEFAULT: { // Si son diferentes
                    this.errorsCount++ // Sumamos un error
                    this.loading = true;
                    sessionHook.changeStatusByIndex(itemRevealedIndex, CardStatus.DEFAULT);
                    sessionHook.changeStatusByIndex(index, CardStatus.DEFAULT);

                    setTimeout(() => {
                        this.loading = false;
                        itemRevealed.status = CardStatus.DEFAULT;
                        itemObj.status = CardStatus.DEFAULT;
                    }, 3000);
                    break;
                }
                case CardStatus.SUCCESS: { // Si son iguales
                    this.successesCount++ // Sumamos un acierto
                    itemRevealed.status = CardStatus.SUCCESS;
                    sessionHook.changeStatusByIndex(itemRevealedIndex, CardStatus.SUCCESS);
                    itemObj.status = CardStatus.SUCCESS;
                    break;
                }
            };

            setTimeout(() => {
                const gameEnded = this.items.every(item => item.status == CardStatus.SUCCESS);
                gameEnded && this.resetGame();
            }, 1000);

            return nextCardStatus;
        },
        resetGame() {
            window.alert("Felicidades, has terminado el juego")

            this.items = [];
            this.successesCount = 0;
            this.errorsCount = 0;
            this.getCards();
        },
        async getCards() {
            this.errorsCount = session.errorsCount;
            this.loading = true;

            const initializeNew = async (entries: EntrieDto[]): Promise<ICardItem[]> => {

                const items = entries.map(entrie => <ICardItem>({ ...entrie.fields.image, status: CardStatus.DEFAULT }));

                const copiedItems = structuredClone(items);
                const cardItems = items.concat(copiedItems).sort((a, b) => 0.5 - Math.random());

                const promises = cardItems.map(async (item, index, array) => {

                    return new Promise<ICardItem>(
                        (resolve) => {
                            setTimeout(() => {
                                this.items.push(item);
                                resolve(item);
                            }, (index * (1 / array.length) * 100) * 10)
                        });
                });

                await Promise.all(promises);
                return cardItems;
            }

            const initializeExisting = (entries: EntrieDto[]) => {
                session.items.forEach(sessionItem => {
                    const entrie = entries.find(entrie => entrie.fields.image.uuid == sessionItem.uuid);

                    if (entrie === undefined) {
                        return;
                    }

                    const newItem: ICardItem = {
                        ...entrie.fields.image,
                        ...sessionItem,
                    };

                    this.items.push({ ...newItem });

                    newItem.status === CardStatus.SUCCESS && this.successesCount++;
                });

                this.successesCount /= 2;
                return [];
            }

            try {
                const res = await fetch(API_URL);
                const { entries } = await res.json();
                return sessionHook.isInitialized ? initializeExisting(entries) : initializeNew(entries);

            } catch (error) {
            } finally {
                this.loading = false;
            }
        },
    },
})