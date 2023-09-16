<template>
  <div class="card--item" :style="{ backgroundImage }"></div>
</template>

<script lang="ts">
export default {
  props: ["url", "uuid", "title", "status"],
  computed: {
    backgroundImage() {
      return `url(${!this.status ? "/question.png" : this.url})`;
    },
  },
};
</script>

<style lang="scss">
.card--item {
  width: 200px;
  height: 300px;
  border: 1px solid black;
  background-size: cover;
  background-repeat: round;
  cursor: pointer;
}

.card--item:hover {
    box-shadow: 0px 7px 8px -4px rgba(0,0,0,.2), 0px 12px 17px 2px rgba(0,0,0,.14), 0px 5px 22px 4px rgba(0,0,0,.12) !important
}
</style>
