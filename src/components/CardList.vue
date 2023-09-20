<template>
  <div class="card--list">
    <Card
      v-for="(item, index) of items"
      :key="`card-${item.uuid}-${index}`"
      v-bind="item"
      @reveal="store.revealCard(item)"
    />
  </div>
</template>

<script lang="ts" setup>
import Card from "./Card.vue";
import { storeToRefs } from "pinia";

import { useCardStore } from "@/store/card";
const store = useCardStore();
const { items } = storeToRefs(store);

store.getCards();

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
