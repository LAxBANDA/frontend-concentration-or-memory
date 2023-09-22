<template>
  <h1>Aciertos: {{ successesCount }} - Errores: {{ errorsCount }}</h1>
  <div class="container">
    <CardList />
  </div>
</template>

<script lang="ts" setup>
import CardList from "@/components/Card/CardList.vue";
import { useCardStore } from "@/store/card";
import { storeToRefs } from 'pinia';

const store = useCardStore();
const { errorsCount, successesCount } = storeToRefs(store);
</script>

<style lang="scss">
html {
  height: 100vh;
}

body {
  margin: 0;
  height: 100%;
  font-family: "PT Sans", Calibri, Tahoma, sans-serif;
}

$blue: #384170;

.color {
  color: $blue;
}

#app {
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  border: 3px solid black;
  box-sizing: border-box;
  padding: 8px;
}

.container {
  height: 100%;
  width: 100%;
}
</style>
