<template>
  <div
    class="card"
    :style="{ backgroundImage }"
    @click="toggleCard"
    :class="{ 'card--discovered': status, 'card--disabled': status }"
    ref="card-ref"
  ></div>
</template>

<script lang="ts">
export default {
  props: ["url", "uuid", "title", "status"],
  computed: {
    backgroundImage() {
      return `url(${!this.status ? "/question.png" : this.url})`;
    },
  },
  mounted() {
    const onLoad = () => {
      console.log("onload");
    };

    this.$nextTick(() => {
      // const a = this.$refs as HTMLElement<HTMLDivElement>;
      (this.$refs["card-ref"] as HTMLDivElement).addEventListener("onload", onLoad);
    });
  },
  methods: {
    toggleCard() {
      if (!this.status) {
        this.$emit("reveal");
      }
    },
  },
};
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
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
  transition: transform 1s ease;

  &.card--disabled {
    cursor: not-allowed;
  }

  &:hover {
    box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14),
      0px 5px 22px 4px rgba(0, 0, 0, 0.12) !important;
  }

  &.card--discovered {
    transform: rotateY(180deg);
    opacity: 1;
  }
}
</style>
