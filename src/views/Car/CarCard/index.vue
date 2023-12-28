<template>
  <div class="card-container">
    <!--<p v-for="item1 in list" :key="item1.id">{{ item1.carNumber }}</p>-->
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" class="search-main" clearable placeholder="请输入内容"/>
      <span class="search-label">车主姓名：</span>
      <el-input v-model="params.personName" class="search-main" clearable placeholder="请输入内容"/>
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option
          v-for="status in cardStatusList"
          :key="status.id"
          :label="status.name"
          :value="status.id"
        />
      </el-select>
      <el-button class="search-btn" type="primary" @click="doSearch">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="addCard">添加月卡</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!--
        表格区域
        elementUI 里的表格组件
    -->
    <div class="table">
      <!--需要把数据 data 传输给他-->
      <el-table :data="list" style="width: 100%">
        <el-table-column label="序号" type="index"/>
        <el-table-column label="车主名称" prop="personName"/>
        <el-table-column label="联系方式" prop="phoneNumber"/>
        <el-table-column label="车牌号码" prop="carNumber"/>
        <el-table-column label="车辆品牌" prop="carBrand"/>
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate"/>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
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
      <el-switch v-model="value"/>
      <el-pagination
        :hide-on-single-page="value"
        :current-page="params.page"
        :page-size="params.pageSize"
        :page-sizes="[2, 3, 5, 10, 15, 20, 30]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog
      title="添加楼宇"
      width="580px"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
/*
  请求接口 正常 绝大多数情况下 都是正常响应数据 响应状态码 200 (成功)
  极少数情况下 不会响应数据 响应状态码 401 未授权(不认识)
  除了登陆接口 后端可以不认识你
  后端接口需要知道你是谁 需要 token
*/
import { getMonthCardListAPI } from '@/api/car'
import item from '@/layout/components/Sidebar/Item.vue'

export default {
  data() {
    return {
      // 提供列表数据
      // 发送请求获取后端端口中的数据存进来
      list: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 10,
        carNumber: '',
        personName: '',
        cardStatus: null
        // pageSizes: [2, 3, 5, 10, 15, 20, 30]
      },
      value: false,
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
      ]
    }
  },
  computed: {
    item() {
      return item
    }
  },
  // created() {}
  mounted() {
    // console.log('页面加载好了，可以发送请求宣传页面结构了')
    // getMonthCardListAPI(
    //   this.params
    // ).then(
    //   // => 箭头函数 没有 this 的指向问题
    //   res => {
    //     // console.log(res.data, 999)
    //     // console.log(this.list)
    //     this.list = res.data.rows
    //     this.total = res.data.total
    //   }
    // )
    this.getList()
  },
  methods: {
    getList() {
      getMonthCardListAPI(this.params).then(
        res => {
          this.list = res.data.rows
          this.total = res.data.total
        }
      )
    },
    handleSizeChange(pageSize) {
      // console.log('每页显示条数:', pageSize)
      this.params.pageSize = pageSize
      // this.params.page = 1 // 现在已经没必要
      this.getList()
    },
    handleCurrentChange(page) {
      // console.log('当前页:', page)
      this.params.page = page
      this.getList()
    },
    addCard() {
      this.$router.push('/addCard')
    },
    doSearch() {
      this.params.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
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
