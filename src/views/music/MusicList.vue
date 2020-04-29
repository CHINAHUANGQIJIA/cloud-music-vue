<template>
  <div style="width: 100%">
    <div>
      <!-- 按钮 -->
      <mu-button
        color="primary"
        class="btn"
        v-for="(item, index) in buttonMenu"
        :key="index"
        @click="Operation(item)"
      >
        {{
        item.title
        }}
      </mu-button>
      <mu-text-field v-model="keywords" placeholder="search"></mu-text-field>
      <mu-button color="success" @click="search()">点击搜索</mu-button>
    </div>
    <!-- 左边歌单表 -->
    <div style="display:flex;padding: 20px 20px;width:2000px">
      <div class="s-l-table">
        <mu-data-table :columns="columns" :data="songList" class="s-l-table-content">
          <template slot-scope="scope">
            <td class="is-left">{{ scope.row.songListId }}</td>
            <td class="is-left">{{ scope.row.songListName }}</td>
            <td class="is-right">{{ scope.row.songCount }}</td>
            <td class="is-right">{{ scope.row.createTime.slice(0, 10) }}</td>
          </template>
        </mu-data-table>
        <mu-flex justify-content="center">
          <!-- 每页显示的数量 -->
          <span style="margin-top: 10px">每页显示：</span>
          <mu-select style="width:70px" v-model="size" full-widt>
            <mu-option
              v-for="(option, index) in options"
              :key="index"
              :label="option"
              :value="option"
            ></mu-option>
          </mu-select>
          <!-- 分页 -->
          <mu-pagination raised circle :total="totalPage" :current.sync="currentPage"></mu-pagination>
        </mu-flex>
      </div>
      <!-- 右边类型表格 -->
      <div class="s-l-tab">
        <div></div>
        <div>
          <div
            class="demo-text"
            v-for="(type, index2) in types"
            :key="index2"
            style=" overflow: hidden"
          >
            <!-- 定义表头信息 -->
            <mu-data-table
              :columns="columns"
              :data="type.child"
              class="childTable"
              v-if="active == index2"
            >
              <!-- 定义表格内的数据 -->
              <template slot-scope="scope">
                <td class="is-left">{{ scope.row.song_list_id }}</td>
                <td class="is-left">{{ scope.row.song_list_name }}</td>
                <td class="is-right">{{ scope.row.song_count }}</td>
                <td class="is-right">{{ scope.row.create_time.slice(0, 10) }}</td>
              </template>
            </mu-data-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusicList',
  data() {
    return {
      sort: {
        name: '',
        order: 'asc'
      },
      options: ['5', '10', '15'],
      columns: [
        { title: 'id', width: 120, name: 'name', align: 'center' },
        { title: '名称', name: 'calories', width: 240, align: 'left', sortable: true },
        { title: '歌曲数', name: 'protein', width: 100, align: 'right', sortable: true },
        { title: '创建时间', name: 'create_time', width: 160, align: 'right', sortable: true }
      ],
      songList: [],
      buttonMenu: [],
      currentPage: 1,
      totalPage: 1000,
      size: 10,
      active: 0,
      types: [],
      typeChildSongList: [],
      keywords: ''
    }
  },
  components: {},
  created() {
    this.getSongList()
    console.log('token的值' + this.token)
  },
  mounted() {},
  watch: {
    size: function() {
      this.getSongList()
    },
    currentPage: function() {
      this.getSongList()
    }
  },
  methods: {
    //获取歌单
    getSongList() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/songList/page',
        params: {
          currentPage: this.currentPage,
          size: this.size
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.songList = res.data.data
        this.getButtonMenu()
        this.getSongListType()
      })
    },
    //模糊查询歌单
    search() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/songList/blur',
        // 问号带参，表单提交
        params: {
          field: this.keywords
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.songList = res.data.data
      })
    },

    getSongListType() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/songList/type',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        //获取各种类型及属于该类型的歌单数据
        this.types = res.data.data
        console.log(this.types)
        //取出第一种类型的所有歌单，作为默认tab页上显示的数据
        this.typeChildSongList = this.types[0].child
        console.log(this.typeChildSongList)
      })
    },
    //获取歌单中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus

        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌单管理') {
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
</style>
