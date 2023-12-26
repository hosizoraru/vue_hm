<template>
  <div class="has-logo">
    <!-- 插值语法: 将数据展示在页面中  {{ 数据名 }}} -->
    <!--    {{ count }} {{ msg }}-->
    <!--    {{ doubleCount }}-->
    <!--    <button @click="fn">+1</button>-->
    <!--    <button @dblclick="fn3">改msg</button>-->
    <!--    &lt;!&ndash; 数据的双向绑定语法 只适用于表单元素,可以输入的 v-model  &ndash;&gt;-->
    <!--    <input v-model="username" type="text">-->
    <!--    <button @click="fn4">获取用户的输入</button>-->
    <!--    &lt;!&ndash;-->
    <!--        数据的遍历显示-->
    <!--        v-for="item in 数组" item => 数组中的每一项-->
    <!--        vue 希望你在遍历数据时 能够给每一项设置一个唯一的标识-->
    <!--    &ndash;&gt;-->
    <!--    &lt;!&ndash; <p>张顶宗 - 18</p>  &ndash;&gt;-->
    <!--    &lt;!&ndash; <p>陈敏雄 - 29</p>  &ndash;&gt;-->
    <!--    &lt;!&ndash; <p>刘钊源 - 30</p>  &ndash;&gt;-->
    <!--    <p v-for="stu in stuList" :key="stu.id">{{ stu.name }} - {{ stu.age }}</p>-->
    <!--    <p v-for="todo in todoList" :key="todo.id">{{ todo.todoName }} - {{ todo.flag }}</p>-->
    <logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 左侧菜单组件 -->
      <el-menu
        :default-active="activeMenu"
        mode="vertical"
        :collapse-transition="false"
        :unique-opened="true"
      >
        <!-- 菜单中的每一项 -->
        <!--
          sidebar-item 菜单项结构
          v-for 循环展示结构
        -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem, Logo },
  // data() {
  //   return {
  //     count: 99,
  //     msg: 'hello, world',
  //     username: 'hello',
  //     stuList: [
  //       { id: 1, name: '张顶宗', age: 18 },
  //       { id: 2, name: '陈敏雄', age: 29 },
  //       { id: 3, name: '刘钊源', age: 30 }
  //     ],
  //     todoList: [
  //       { id: 1, todoName: '吃早饭', flag: false },
  //       { id: 2, todoName: '吃午饭', flag: false },
  //       { id: 3, todoName: '吃晚饭', flag: false },
  //       { id: 4, todoName: '吃夜宵', flag: false }
  //     ]
  //   }
  // },
  computed: {
    // 计算属性 针对于已经存在的数据进行二次处理
    // => 写起来是一个函数,但是用起来是一个数据
    // doubleCount() {
    //   return this.count * 2
    // },
    routes() {
      // this.$router => 之前创建好的路由实例
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  // },
  // methods: {
  //   fn() {
  //     this.count++
  //   },
  //   fn2() {
  //     this.count--
  //   },
  //   fn3() {
  //     this.msg = 'hello, vue'
  //   },
  //   fn4() {
  //     console.log(this.username) // 获取到最新的用户输入
  //   }
  }
}
</script>

