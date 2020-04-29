<template>
  <div style="width: 1950px;">
    <div></div>
    <div style="display:flex;padding: 20px 20px">
      <div class="s-l-table">
        <v-card>
          <v-card-title>
            歌曲
            <v-spacer></v-spacer>
            <mu-text-field v-model="keywords" placeholder="search"></mu-text-field>
            <mu-button color="success" @click="search()">搜索</mu-button>
          </v-card-title>

          <mu-data-table :columns="columns" :data="song.slice(start, end)" class="s-l-table-content" :search="search" id="card">
            <template slot-scope="scope">
              <td class="is-left">{{ scope.row.songId }}</td>
              <td class="is-left">{{ scope.row.songName }}</td>
              <td class="is-left">{{ scope.row.singer }}</td>
              <td class="is-left">{{ scope.row.duration }}</td>
              <td class="is-right">{{ scope.row.commentCount }}</td>
              <td class="is-right">{{ scope.row.createTime.slice(0, 10) }}</td>
              <td class="is-right">
                <button @click="handleDelete()">删除</button>
              </td>
            </template>
          </mu-data-table>
          <mu-flex justify-content="center" width="1500px">
            <!-- 每页显示的数量 -->
            <span style="margin-top: 10px">每页显示：</span>
            <mu-select style="width:70px" v-model="size" full-widt>
              <mu-option v-for="(option, index) in options" :key="index" :label="option" :value="option"></mu-option>
            </mu-select>
            <!-- 分页 -->
            <mu-pagination raised circle :total="totalPage" :current.sync="currentPage"></mu-pagination>
          </mu-flex>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Music',
  data() {
    return {
      sort: {
        name: '',
        order: 'asc'
      },
      options: ['5', '10', '15'],
      columns: [
        { title: 'id', width: 120, name: 'id', align: 'center' },
        { title: '歌名', name: 'songName', width: 240, align: 'left', sortable: true },
        { title: '歌手', name: 'singer', width: 100, align: 'right', sortable: true },
        { title: '时长', name: 'duration', width: 100, align: 'right', sortable: true },
        { title: '评论数', name: 'comment_count', width: 160, align: 'right', sortable: true },
        { title: '创建时间', name: 'create_time', width: 160, align: 'right', sortable: true },
        { title: '删除', name: 'delete_flag', width: 160, align: 'right', sortable: true }
      ],
      menus: [],
      song: [],
      songs: [],
      buttonMenu: [],
      currentPage: 1,
      totalPage: 1000,
      size: 10,
      page: 1,
      active: 0,
      types: [],
      typeChildSongList: [],
      keywords: '',
      start: 0,
      end: 10
    }
  },
  components: {},
  created() {
    let index = this.$route.query.index
    let index1 = this.$route.query.index1
    console.log(index, index1)
    this.menus = JSON.parse(localStorage.getItem('menuList'))[index].subMenus[index1].subMenus
    console.log(this.menus)

    this.axios.get('http://localhost:8080/song/list').then((res) => {
      console.log(res)
      this.songs = res.data.data
    })

    this.getSongList()
  },
  mounted() {},
  watch: {
    // 侦听器，监听当前页的数量与当前页值的变化
    size: function(newSize, oldSize) {
      this.totalPage = (1000 / this.size) * 10
      //新值与旧值进行对比
      if (newSize > oldSize) {
        this.end = this.end + (newSize - oldSize)
      } else {
        this.end = this.end - (oldSize - newSize)
      }
    },
    currentPage: function(newCurrent, oldCurrent) {
      if (newCurrent == 1000 / this.size) {
        this.page += 1
      }
      if (newCurrent < oldCurrent && newCurrent >= 0) {
        this.start -= 10
        this.end -= 10
      } else {
        this.start += 10
        this.end += 10
      }
    }
  },
  methods: {
    //获取歌曲
    getSongList() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/song/page',
        params: {
          currentPage: this.page,
          size: 1000
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.song = res.data.data
        this.getButtonMenu()
        this.getSong()
        console.log(this.song)
      })
    },
    // //模糊查询歌单
    search() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/song/vague',
        // 问号带参，表单提交
        params: {
          context: this.keywords
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.song = res.data.data
      })
    },

    //获取歌曲中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus
        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌曲管理') {
              this.buttonMenu = menu[j].subMenus
            }
          }
        }
      }
    },
    //排序
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) => (order === 'asc' ? a[name] - b[name] : b[name] - a[name]))
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.table {
  background-color: white;
  color: black;
}
.content {
  flex: 0 0 33%;
}
.btn {
  margin: 20px 20px;
}
.s-l-table {
  width: 50%;
  background-color: white;
  margin-right: 60px;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  &-content {
    height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 10px;
  }
}
.tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 120px;
  overflow-y: auto;
}
.s-l-tab {
  background-color: white;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  display: flex;
}
.childTable {
  overflow: auto;
  max-width: 400px;
  height: 500px;
}
.card {
  width: 1000px;
}
</style>
