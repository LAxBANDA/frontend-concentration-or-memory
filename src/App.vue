<template>
  <h1>Aciertos: {{ successesCount }} - Errores: {{ errorsCount }}</h1>
  <div class="container">
    <CardList />
  </div>
</template>

<script lang="ts" setup>
import CardList from "@/components/Card/CardList.vue";
import { useCardStore } from "@/store/card";
import { storeToRefs } from "pinia";
import sessionHook from "@/session/session";
import { CardStatus } from "./session/session.dto";

const store = useCardStore();
const { errorsCount, successesCount } = storeToRefs(store);

store.$onAction(
  ({
    name, // name of the action
    args,
    after, // hook after the action returns or resolves
  }) => {
    after((result) => {
      console.log(name, args, result);
      if (name == "revealCard" && result != undefined) {
        if (result === CardStatus.DEFAULT) {
          sessionHook.addError();
        } else {
          sessionHook.changeStatusByIndex(args[1], result);
        }
      }
    });
  }
);
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
