<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../../assets/logo.png" alt="" />
        <span>JJ 后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asideWidth">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseClick">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="String(item.id)"
            v-for="item in meunList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      meunList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath: '',
    };
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },

    // 获取左侧菜单权限
    getMeunList() {
      this.$http
        .get('/menus')
        .then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: res.data.meta.msg,
            });
          }
          this.meunList = res.data.data;
          console.log(this.meunList);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 侧边菜单点击事件
    collapseClick() {
      this.isCollapse = !this.isCollapse;
    },

    // 存储激活菜单
    saveNavState(path) {
      this.activePath = path;
      window.sessionStorage.setItem('activePath', path);
    },
  },
  computed: {
    asideWidth() {
      return this.isCollapse ? '56px' : '200px';
    },
  },
  created() {
    this.getMeunList();
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    color: #fff;
    height: 100%;
    display: flex;
    align-items: center;

    img {
      height: 100%;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
    // transform: all 2s;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.collapse-btn {
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.2em;
}
</style>