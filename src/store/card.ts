import { ImageDto } from '@/image.dto';
import { ICardItem, CardStatus } from '@/item.interface';
import sessionHook from '@/session/session';
import { defineStore } from 'pinia';

const session = sessionHook.get();

interface EntrieDto {
    fields: { image: ImageDto };
}

export const useCardStore = defineStore('card', {
    state: () => ({
        items: <Array<ICardItem>>[],
        errorsCount: 0,
        successesCount: 0,
    }),
    getters: {
        doubleCount: (state) => 1 * 2,
    },
    actions: {
        changeStatus(itemObj: ICardItem, status: CardStatus) {
            const itemRevealed = this.items.find((item) => item.status === "revealed");
            itemObj.status = status;

            if (itemRevealed === undefined) {
                sessionHook.addRevealed(itemObj.uuid);
                return;
            }

            const countType = itemRevealed.uuid === itemObj.uuid ? "success" : "error";

            switch (countType) {
                case "error": {
                    this.errorsCount++
                    sessionHook.addError(itemObj.uuid);

                    setTimeout(() => {
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
            
            try {
                const res = await fetch(
                    "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20"
                );
                const jsonRes = await res.json();

                jsonRes.entries.forEach((entrie: EntrieDto, index: number) => {

                    const status = session.cardsStatuses[entrie.fields.image.uuid] || "";

                    status == "success" && this.successesCount++;

                    const newItem: ICardItem = {
                        ...entrie.fields.image,
                        status,
                    };

                    setTimeout(() => {
                        this.items.unshift({ ...newItem });
                        this.items.push({ ...entrie.fields.image, status: "" });
                    }, index * 100);
                });

                this.items = this.items.sort((a, b) => 0.5 - Math.random());
            } catch (error) {
                console.log(error);
            }
        },
    },
})