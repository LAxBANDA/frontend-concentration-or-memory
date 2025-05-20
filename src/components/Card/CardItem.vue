<template>
  <div
    class="card"
    :style="{ backgroundImage }"
    @click="toggleCard"
    :class="{ 'card--revealed': cardRevealed, 'card--disabled': cardDisabled }"
  ></div>
</template>

<script setup lang="ts">
import { CardStatus } from "@/session/session.dto";
import { ref, computed } from "vue";

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits(['reveal'])

const props = defineProps<{
  url: string;
  status: CardStatus;
  loading: boolean;
}>();

const cardRevealed = computed(() => props.status !== CardStatus.DEFAULT);

const basePath = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');

const backgroundImage = computed(() =>
  `url(${!cardRevealed.value ? `${basePath}question.png` : props.url})`
);

const cardDisabled = computed(() => (cardRevealed.value || props.loading));
const toggleCard = () => !cardDisabled.value && emit('reveal');

</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.card {
  width: 200px;
  height: 300px;
  border: 1px solid black;
  background-size: cover;
  background-repeat: round;
  cursor: pointer;
  transition: all 1s ease;

  &.card--disabled {
    cursor: not-allowed;
  }

  &:hover {
    box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14),
      0px 5px 22px 4px rgba(0, 0, 0, 0.12) !important;
  }

  &.card--revealed {
    transform: rotateY(180deg);
    background-image: inherit;
  }
}
</style>
