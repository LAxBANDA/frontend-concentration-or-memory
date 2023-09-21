import { ImageDto } from '@/image.dto';
import { ICardItem } from '@/card-item.interface';
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
        doubleCount: (state) => 1 * 2,
    },
    actions: {
        revealCard(itemObj: ICardItem) {
            const itemRevealed = this.items.find(item => item.status === "revealed");
            itemObj.status = "revealed";

            if (itemRevealed === undefined) {
                sessionHook.addRevealed(itemObj.uuid);
                return;
            }

            const countType = itemRevealed.uuid === itemObj.uuid ? "success" : "error";

            switch (countType) {
                case "error": {
                    this.errorsCount++
                    this.loading = true;
                    sessionHook.addError(itemRevealed.uuid);

                    setTimeout(() => {
                        this.loading = false;
                        itemRevealed.status = "";
                        itemObj.status = "";
                    }, 3000);
                    break;
                }
                case "success": {
                    this.successesCount++
                    sessionHook.addSuccess(itemObj.uuid);
                    itemRevealed.status = "success";
                    itemObj.status = "success";
                    break;
                }
            }
        },
        async getCards() {
            this.errorsCount = session.errorsCount;

            const isInitialized = Object.keys(session.items).length > 0;

            const initializeNew = (entries: EntrieDto[]): void => {
                entries.forEach((entrie: EntrieDto, index: number, array: EntrieDto[]) => {

                    const sessionItem: ISessionCardObject = { status: "", order: index };

                    const newItem: ICardItem = {
                        ...entrie.fields.image,
                        ...sessionItem,
                    };

                    this.items.push({ ...newItem });

                    // esta será la copia
                    this.items.push({ ...newItem });
                });

                this.items = this.items.sort((a, b) => 0.5 - Math.random());
                sessionHook.fillItems(this.items);
            }

            const initializeExisting = (entries: EntrieDto[]): void => {

                entries.forEach((entrie: EntrieDto, index: number, array: EntrieDto[]) => {
                    const sessionItem: ISessionCardObject = session.items[entrie.fields.image.uuid];
                    const newItem: ICardItem = {
                        ...entrie.fields.image,
                        ...sessionItem,
                    };

                    this.items.push({ ...newItem });

                    const copyItem = structuredClone(newItem);

                    if (newItem.status == "success") {
                        this.successesCount++;
                    } else if (newItem.status == "revealed") {
                        copyItem.status = "";
                    }
                    // esta será la copia
                    this.items.push({ ...copyItem });
                });

                this.items = this.items.sort((a, b) => session.items[a.uuid].order - session.items[b.uuid].order);
            }

            try {
                const res = await fetch(
                    "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20"
                );
                const { entries } = await res.json();
                isInitialized ? initializeExisting(entries) : initializeNew(entries);

            } catch (error) {
                console.log(error);
            } finally {
            }
        },
    },
})