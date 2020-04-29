<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title" id="title">云音乐后台管理</span>
        <span class="md-title" id="togo" @click="logout">退出</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <mu-container>
          <mu-card style="width: 100%; max-width: 375px; margin: 0 auto;">
            <mu-card-header title="Cloud Music" :sub-title="admin.name">
              <mu-avatar slot="avatar">
                <img :src="admin.avatar" />
              </mu-avatar>
            </mu-card-header>
          </mu-card>
        </mu-container>

        <v-divider></v-divider>
        <v-list class="list" id="list">
          <v-list-group v-for="(item, index) in items" :key="index">
            <template v-slot:activator v-if="item.type == 1">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content v-if="item.subMenus.length > 0">
                <v-list-item-title class="link">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content v-else>
                <router-link :to="item.path">
                  <v-list-item-title class="link">{{ item.title }}</v-list-item-title>
                </router-link>
              </v-list-item-content>
            </template>

            <v-list-item v-for="(subItem, index1) in item.subMenus" :key="index1">
              <v-list-item-icon style="margin-left:20px;">
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="link" @click="gotoSubPage(subItem.path, index, index1)">
                  {{ subItem.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </md-app-drawer>

      <md-app-content class="card-3">
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="scss" scoped>
.md-app {
  max-height: 1000px;
  border: 1px solid rgba(#000, 0.12);
}

// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
#togo {
  margin-left: 1190px;
}
.md-primary {
  font-size: 32px;
}
.card-3 {
  width: 100%;
  height: 650px;
}
.container {
  height: 100px;
}

#title {
  margin-top: 41px;
}
.md-primary {
  background: url('https://niit-soft.oss-cn-hangzhou.aliyuncs.com/wallpaper/15.jpg');
}
#list {
  background: url('https://niit-soft.oss-cn-hangzhou.aliyuncs.com/wallpaper/15.jpg');
  margin: 8px;
  height: 610px;
}

#header {
  background-color: coral;
}
</style>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      admin: JSON.parse(localStorage.getItem('admin')),
      items: [],
      drawer: true,
      color: 'primary',
      colors: ['primary', 'blue', 'success', 'red', 'teal'],
      right: false,
      miniVariant: false,
      expandOnHover: false,
      background: true,
      bg: 'https://niit-soft.oss-cn-hangzhou.aliyuncs.com/wallpaper/15.jpg'
    }
  },
  created() {
    //取得前一个页面传过来的roleId
    let roleId = this.$route.query.roleId
    console.log(roleId)
    //携带roleId和token（全局拦截器已经设置）向后端请求菜单
    this.axios.get('http://localhost:8080/sysRole?roleId=' + roleId).then((res) => {
      this.$store.commit('setMenuList', JSON.stringify(res.data.data.menus))
      localStorage.setItem('menuList', JSON.stringify(res.data.data.menus))
      this.items = res.data.data.menus
    })
  },
  methods: {
    logout() {
      alert('logout')
      // this.$store.commit('setToken', '')
      // this.$store.commit('setAdmin', '')
      // this.$store.commit('setMenuList', '')
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      localStorage.removeItem('menuList')
      this.$router.push('/login')
    },
    gotoSubPage(path, index, index1) {
      console.log(path, index, index1)
      this.$router.push({
        path: path,
        query: {
          index: index,
          index1: index1
        }
      })
    }
  },
  computed: {
    // bg() {
    //   // return this.background ? 'https://picsum.photos/1920/1080?random' : undefined
    //   return '../assets/images/login-bg.jpg'
    // }
  }
}
</script>
