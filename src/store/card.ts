import { ImageDto } from '@/image.dto';
import { ICardItem } from '@/components/Card/card-item.interface';
import sessionHook from '@/session/session';
import { defineStore } from 'pinia';
import { ISessionCardObject } from '@/session/session.dto';

const session = sessionHook.get();

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
        revealCard(itemObj: ICardItem, index: number) {
            const itemRevealedIndex = this.items.findIndex(item => item.status === "revealed");

            itemObj.status = "revealed";

            // Si no existe otra carta revelada
            if (itemRevealedIndex === -1) {
                // Agregaremos al storage
                sessionHook.changeStatusByIndex(index, "revealed");
                return;
            }

            const itemRevealed = this.items.at(itemRevealedIndex);

            if (itemRevealed === undefined) {
                return;
            }

            // Existe otra carta revelada
            // Si son iguales o diferentes
            const countType = itemRevealed.uuid === itemObj.uuid ? "success" : "error";

            switch (countType) {
                case "error": { // Si son diferentes
                    this.errorsCount++ // Sumamos un error
                    this.loading = true;
                    sessionHook.changeStatusByIndex(itemRevealedIndex, "");
                    sessionHook.changeStatusByIndex(index, "");
                    sessionHook.addError();

                    setTimeout(() => {
                        this.loading = false;
                        itemRevealed.status = "";
                        itemObj.status = "";
                    }, 3000);
                    break;
                }
                case "success": { // Si son iguales
                    this.successesCount++ // Sumamos un acierto
                    sessionHook.changeStatusByIndex(itemRevealedIndex, "success");
                    sessionHook.changeStatusByIndex(index, "success");
                    itemRevealed.status = "success";
                    itemObj.status = "success";
                    break;
                }
            }
        },
        async getCards() {
            this.errorsCount = session.errorsCount;

            const initializeNew = (entries: EntrieDto[]): void => {
                const cardItems: ICardItem[] = [];
                entries.forEach((entrie, index) => {
                    const cardItem = {
                        ...entrie.fields.image,
                        status: "",
                    } as ICardItem;

                    cardItems.push(cardItem);
                    cardItems.push({ ...cardItem });
                });

                const items = cardItems.sort((a, b) => 0.5 - Math.random());
                sessionHook.fillItems(items);
                this.items = items;
            }

            const initializeExisting = (entries: EntrieDto[]): void => {
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

                    if (newItem.status == "success") {
                        this.successesCount++;
                    }
                });

                this.successesCount /= 2;
            }

            try {
                const res = await fetch(
                    "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20"
                );
                const { entries } = await res.json();
                sessionHook.isInitialized ? initializeExisting(entries) : initializeNew(entries);

            } catch (error) {
            } finally {
            }
        },
    },
})