<template>
  <div>
    <span v-for="(item, index) in menus" :key="index" class="gutter">
      <mu-button :color="item.icon">{{ item.title }}</mu-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'MusicType',
  data() {
    return {
      menus: []
    }
  },
  created() {
    let index = this.$route.query.index
    let index1 = this.$route.query.index1
    this.menus = JSON.parse(localStorage.getItem('menuList'))[index].subMenus[index1].subMenus
  },
  methods: {}
}
</script>

<style scoped lang="scss"></style>
