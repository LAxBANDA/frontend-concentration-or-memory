import { ImageDto } from '@/image.dto';
import { ICardItem } from '@/card-item.interface';
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
        revealCard(itemObj: ICardItem) {
            const itemRevealed = this.items.find((item) => item.status === "revealed");
            itemObj.status = "revealed";

            if (itemRevealed === undefined) {
                sessionHook.addRevealed(itemObj.uuid);
                return;
            }

            const countType = itemRevealed.uuid === itemObj.uuid ? "success" : "error";

            switch (countType) {
                case "error": {
                    this.errorsCount++
                    sessionHook.addError(itemRevealed.uuid);

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

                    const sessionItem = session.items[entrie.fields.image.uuid] || { status: "" };

                    if (sessionItem) {
                        sessionItem.status == "success" && this.successesCount++;
                    }

                    const newItem: ICardItem = {
                        ...entrie.fields.image,
                        status: sessionItem.status,
                    };

                    setTimeout(() => {
                        this.items.unshift({ ...newItem });
                        this.items.push({ ...entrie.fields.image, status: sessionItem.status == "success" ? sessionItem.status : "" });
                    }, index * 50);
                });

                if (Object.keys(session.items).length === 0) {
                    setTimeout(() => {
                        this.items = this.items.sort((a, b) => 0.5 - Math.random());
                        sessionHook.fillItems(this.items);
                    }, 4000)
                } else {
                    this.items = this.items.sort((a, b) => session.items[a.uuid].order - session.items[b.uuid].order)
                }

            } catch (error) {
                console.log(error);
            }
        },
    },
})