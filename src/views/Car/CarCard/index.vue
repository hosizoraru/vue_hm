<template>
  <div class="card-container">
    <!--<p v-for="item1 in list" :key="item1.id">{{ item1.carNumber }}</p>-->
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input class="search-main" clearable placeholder="请输入内容"/>
      <span class="search-label">车主姓名：</span>
      <el-input class="search-main" clearable placeholder="请输入内容"/>
      <span class="search-label">状态：</span>
      <el-select>
        <el-option v-for="item in []" :key="item.id"/>
      </el-select>
      <el-button class="search-btn" type="primary">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary">添加月卡</el-button>
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
    <div class="page-container">
      <el-pagination
        :total="0"
        layout="total, prev, pager, next"
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
      list: []
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
    getMonthCardListAPI(
      {
        page: 1,
        pageSize: 10
      }
    ).then(
      // => 箭头函数 没有 this 的指向问题
      res => {
        // console.log(res.data.rows, 999)
        this.list = res.data.rows
        console.log(this.list)
      }
    )
  },
  methods() {

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
