<template>
  <div class="card--list">
    <CardItem
      v-for="(item, index) of items"
      :key="`card-${item.uuid}-${index}`"
      v-bind="item"
      :loading="loading"
      @reveal="store.revealCard(item, index)"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCardStore } from "@/store/card";

import CardItem from "./CardItem.vue";

import sessionHook from "@/session/session";

import { CardStatus } from "@/session/session.dto";
import { ICardItem } from "./card-item.interface";
import { onMounted } from "vue";

const store = useCardStore();
const { loading, items, gameEnded } = storeToRefs(store);

store.$onAction(
  ({
    name, // name of the action
    args,
    after, // hook after the action returns or resolves
  }) => {
    after((result) => {
      if (result == undefined) {
        return;
      }

      if (name === "revealCard") {
        if (result === CardStatus.DEFAULT) {
          sessionHook.addError();
        } else {
          sessionHook.changeStatusByIndex(args[1], result as CardStatus);
        }
      } else if (name === "getCards") {
        result.length > 0 && sessionHook.fillItems(result as ICardItem[]);
      }
    });
  }
);

onMounted(async () => {
  await store.getCards();
  console.log(gameEnded.value)
  gameEnded.value && store.resetGame();
});

</script>

<style lang="scss">
.card--list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
