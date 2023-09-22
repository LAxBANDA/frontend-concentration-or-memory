<template>
  <div
    class="card"
    :style="{ backgroundImage }"
    @click="toggleCard"
    :class="{ 'card--discovered': status, 'card--disabled': !enabledClick }"
    ref="card-ref"
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

const toggleCard = () => enabledClick.value && emit('reveal');

const backgroundImage = computed(() => `url(${!props.status ? "/question.png" : props.url})`);

const enabledClick = computed(() => props.status == "" && !props.loading)

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

  &.card--discovered {
    transform: rotateY(180deg);
    background-image: inherit;
  }
}
</style>
