<template>
  <v-container>
    <h3>菜单管理</h3>
  </v-container>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      menus: this.$store.state.menuList[1].subMenus[1].subMenus
    }
  },
  components: {},
  created() {},
  mounted() {},
  methods: {},
  computed: {}
}
</script>

<style scoped lang="scss"></style>
