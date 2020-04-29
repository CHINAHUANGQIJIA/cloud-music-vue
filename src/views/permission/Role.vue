<template>
  <v-container>
    <h3>角色管理</h3>
    <span v-for="(item, index) in permissions" :key="index" class="gutter">
      <mu-button color="teal" v-if="item === 'role:add'">添加角色</mu-button>
      <mu-button color="success" v-if="item === 'role:edit'">编辑角色</mu-button>
      <mu-button color="error" v-if="item === 'role:delete'">删除角色</mu-button>
    </span>
  </v-container>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      permissions: this.$store.state.menuList1[2].subMenus[0].permissions
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
