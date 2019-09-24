<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getNavList } from "../../api/nav";
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"])
  },
  created() {
    let navs = getNavList();
    console.log(navs);
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
