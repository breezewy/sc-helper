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
  data() {
    return {
      navs: []
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  created() {
    getNavList().then(res => {
      this.navs = res.data;
      console.log(this.navs);
    });
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
