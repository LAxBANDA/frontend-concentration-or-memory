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
import { ref } from "vue";

import CardItem from "./CardItem.vue";
import { useCardStore } from "@/store/card";
import { ICardItem } from "./card-item.interface";

const store = useCardStore();
const items = ref(<ICardItem[]>[]);
const { loading, items: cardItems } = storeToRefs(store);

store.getCards().then((response) => {
  cardItems.value.forEach(async (item, index, array) => {
    const promiseFunction = (resolve: any, reject: any) => setTimeout(() => resolve(true), (index * (1 / array.length) * 100) * 10);

    await new Promise(promiseFunction);

    items.value.push(item);
  });
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
@/components/card-item.interface