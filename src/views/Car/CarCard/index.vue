<template>
  <div class="card-container">
    <!--<p v-for="item1 in list" :key="item1.id">{{ item1.carNumber }}</p>-->
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" class="search-main" clearable placeholder="请输入内容" @clear="getList" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="params.personName" class="search-main" clearable placeholder="请输入内容" @clear="getList" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option
          v-for="status in cardStatusList"
          :key="status.id"
          :label="status.name"
          :value="status.id"
        />
      <!--<el-option label="全部" :value="null" />-->
      <!--<el-option label="已过期" :value="0" />-->
      <!-- 01 这些即使不加 : 也会被自动转换为 string -->
      <!-- 但是一些需要 array/boolean/... 的地方不主动加 : 传字符串 会因为自动转为 string 而报错 -->
      </el-select>
      <el-button :plain="true" class="search-btn" icon="el-icon-search" type="primary" @click="doSearch">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button-group>
        <el-button type="primary" :round="true" @click="addCard">添加月卡<i class="el-icon-upload el-icon--right" /></el-button>
        <el-button type="danger" :round="true" icon="el-icon-delete" @click="deleteCards">批量删除</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="warning" :circle="true" icon="el-icon-refresh" :loading="loadingFlag" @click="refreshLoading" />
        <el-button type="success" icon="el-icon-refresh" :loading="loadingFlag" @click="refreshLoading">刷新页面</el-button>
      </el-button-group>
    </div>
    <div class="proportion-container">
      <el-alert
        :title="'本园区共计 ' + proportionList.spaceNumber +
          ' 个车位，月卡用户 ' + proportionList.cardCount +
          ' 人，车位占有率 ' + proportionList.proportion"
        :description="'月卡用户 ' + proportionList.cardCount + ' 人，'
          + '车位占有率 ' + proportionList.proportion"
        type="success"
        :closable="false"
        show-icon
      />
    </div>
    <!--
        表格区域
        elementUI 里的表格组件
    -->
    <div class="table">
      <!--
          需要把数据 data 传输给他
          需要当前数据的 id scope 是一个对象
          scope.row 当前行的数据
          scope.row.id 当前行的 id
          stripe 斑马纹
          border 边框
          max-height 最大高度
          @row-class-name
          sortable
          :default-sort="{ prop: 'xx', order: 'descending' }" 默认排序
      -->
      <el-table
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :data="list"
        style="width: 100%"
        stripe
        :default-sort="{ prop: 'totalEffectiveDate', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column label="序号" type="index" />
        <el-table-column label="车主名称" prop="personName" sortable />
        <el-table-column label="联系方式" prop="phoneNumber" sortable />
        <el-table-column label="车牌号码" prop="carNumber" sortable />
        <el-table-column label="车辆品牌" prop="carBrand" sortable />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" sortable :formatter="formatter" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="jumpToRenewCard(scope.row.id)">续费</el-button>
            <el-button size="mini" type="text" @click="jumpToDetailCard(scope.row.id)">查看</el-button>
            <el-button size="mini" type="text" @click="jumpToUpdateCard(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteCard(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页结构 -->
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <!--
        layout 布局控件
        :total 总条数
        :current-page 默认第几页
        :page-size 每页显示条数 // 默认为 10
        :page-sizes 每页显示条数的选择器 // 默认为 10 20 30 40 50 100
        @size-change 每页显示条数改变时触发
        @current-change 当前页改变时触发
        @prev-click 上一页按钮点击时触发
        @next-click 下一页按钮点击时触发
        当只有一页时，通过设置 hide-on-single-page 属性来隐藏分页
    -->
    <div class="page-container">
      <el-switch v-model="value" />
      <el-pagination
        :hide-on-single-page="value"
        :current-page="params.page"
        :page-size="params.pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
/*
  请求接口 正常 绝大多数情况下 都是正常响应数据 响应状态码 200 (成功)
  极少数情况下 不会响应数据 响应状态码 401 未授权(不认识)
  除了登陆接口 后端可以不认识你
  后端接口需要知道你是谁 需要 token
*/
import { deleteCardAPI, getMonthCardListAPI, proportionCardAPI } from '@/api/car'
import item from '@/layout/components/Sidebar/Item.vue'

export default {
  data() {
    return {
      // 提供列表数据
      // 发送请求获取后端端口中的数据存进来
      list: [],
      total: 0,
      value: false,
      loadingFlag: true,
      type: '',
      proportionList: {
        cardCount: 0,
        spaceNumber: 0,
        proportion: ''
      },
      pageSizes: [2, 3, 5, 10, 15, 20, 30],
      params: {
        page: 1,
        pageSize: 10,
        carNumber: null,
        personName: null,
        cardStatus: null
      },
      cardStatusList: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '正常可用'
        },
        {
          id: 1,
          name: '已经过期'
        }
      ],
      selectCardList: []
    }
  },
  computed: {
    item() {
      return item
    }
  },
  // created() {}
  mounted() {
    /*
      console.log('页面加载好了，可以发送请求宣传页面结构了')
      getMonthCardListAPI(
        this.params
      ).then(
        // => 箭头函数 没有 this 的指向问题
        res => {
          // console.log(res.data, 999)
          // console.log(this.list)
          this.list = res.data.rows
          this.total = res.data.total
        }
      )
    */
    this.getList()
    proportionCardAPI().then(
      res => {
        this.proportionList = res.data
        // console.log(this.proportionList)
      }
    )
  },
  methods: {
    getList() {
      getMonthCardListAPI(this.params).then(
        res => {
          this.list = res.data.rows
          this.total = res.data.total
          this.loadingFlag = false
        }
      ).catch(
        error => {
          this.$message.error(error.response.data.msg)
          this.loadingFlag = true
        }
      )
    },
    handleSelectionChange(val) {
      /*
        选中项变化时触发
        val 是当前选中的项的数组
        let 定义的是变量 const 定义的是常量
        console.log(val.map(item => item.id))
        console.log(val)
        console.log(val.length)
        val.map(item => item.id).join(',')
        let str = ''
        val.forEach(item => {
          str += item.id + ','
        })
        str = str.slice(0, -1)
        this.selectCardList = str
        console.dir(str)
       */
      this.selectCardList = val
    },
    handleSizeChange(pageSize) {
      // console.log('每页显示条数:', pageSize)
      this.params.pageSize = pageSize
      // this.params.page = 1 // 现在已经没必要 但也不是完全没必要
      this.getList()
    },
    handleCurrentChange(page) {
      // console.log('当前页:', page)
      this.params.page = page
      this.getList()
    },
    addCard() {
      this.$router.push('/addCard')
      // this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: '保存',
      //   cancelButtonText: '放弃修改'
      // })
      //   .then(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '保存修改'
      //     })
      //   })
      //   .catch(action => {
      //     this.$message({
      //       type: 'info',
      //       message: action === 'cancel'
      //         ? '放弃保存并离开页面'
      //         : '停留在当前页面'
      //     })
      //   })
    },
    doSearch() {
      this.params.page = 1
      this.getList()
    },
    deleteCard(id) {
      this.$confirm('此操作将永久删除该月卡信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          deleteCardAPI(id).then(
            () => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getList()
            }
          ).catch(
            error => {
              this.$message.error(error.response.data.msg)
            }
          )
        }
      ).catch(
        () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      )
    },
    deleteCards() {
      this.$confirm('', {
        message: `已选择 ${this.selectCardList.length} 个月卡`,
        title: '此操作将永久删除选择的月卡, 是否继续?',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          // 处理id
          // await deleteCardAPI(this.selectCardList)
          await deleteCardAPI(
            this.selectCardList.map(item => item.id).join(',')
          )
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        }
      ).catch(
        () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      )
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getList()
    },
    jumpToUpdateCard(id) {
      this.$router.push('/addCard?id=' + id)
      this.$store.commit('user/setInputStatus', false)
    },
    jumpToDetailCard(id) {
      this.$router.push('/infoCard?id=' + id)
    },
    jumpToRenewCard(id) {
      this.$router.push('/addCard?id=' + id)
      this.$store.commit('user/setInputStatus', true)
    },
    formatter(row, column) {
      return row.totalEffectiveDate
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.proportion-container {
  width: 430px;
  margin: 30px 0 0 0;
  color: blue;

  .like {
    cursor: pointer;
    font-size: 25px;
    display: inline-block;
  }
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
  }
}

.create-container {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.page-container {
  padding: 4px 0;
  text-align: right;
}

.form-container {
  padding: 0 80px;
}
</style>
