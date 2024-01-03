<template>
  <div class="card-container">
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" class="search-main" clearable placeholder="请输入内容" @clear="getList" />
      <span class="search-label">缴纳状态：</span>
      <el-select v-model="params.paymentStatus">
        <el-option
          v-for="status in paymentStatusList"
          :key="status.id"
          :label="status.name"
          :value="status.id"
        />
      </el-select>
      <el-button :plain="true" class="search-btn" icon="el-icon-search" type="primary" @click="doSearch">查询</el-button>
      <el-button type="success" icon="el-icon-refresh" :loading="loadingFlag" @click="refreshLoading">刷新页面</el-button>
    </div>
    <div class="table">
      <el-table
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :data="list"
        style="width: 100%"
        stripe
      >
        <el-table-column label="序号" type="index" />
        <el-table-column label="车牌号码" prop="carNumber" sortable />
        <el-table-column label="收费类型" prop="chargeType" :formatter="formatChargeType" sortable />
        <el-table-column label="停车总时长" prop="parkingTime" sortable />
        <el-table-column label="缴纳费用（元）" prop="actualCharge" sortable />
        <el-table-column label="缴纳状态" prop="paymentStatus" :formatter="formatPaymentStatus" sortable />
        <el-table-column label="缴纳方式" prop="paymentMethod" :formatter="formatPaymentMethod" sortable />
        <el-table-column label="缴纳时间" prop="paymentTime" sortable />
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
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

import item from '@/layout/components/Sidebar/Item.vue'
import { getPaymentListAPI } from '@/api/payment'

export default {
  data() {
    return {
      list: [],
      total: 0,
      loadingFlag: true,
      pageSizes: [2, 3, 5, 10, 15, 20, 30],
      params: {
        page: 1,
        pageSize: 10,
        carNumber: null,
        paymentStatus: null
      },
      paymentStatusList: [
        { id: null, name: '全部' },
        { id: 0, name: '未缴纳' },
        { id: 1, name: '已缴纳' }
      ],
      chargeTypeList: [
        { id: 'card', name: '月卡' },
        { id: 'temp', name: '临时停车' }
      ],
      paymentMethodList: [
        { id: 'Cash', name: '线下' },
        { id: 'WeChat', name: '微信' },
        { id: 'Alipay', name: '支付宝' },
      ]
    }
  },
  computed: {
    item() {
      return item
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getPaymentListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
      this.loadingFlag = false
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getList()
    },
    doSearch() {
      this.params.page = 1
      this.getList()
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getList()
    },
    formatPaymentStatus(row, column, cellValue) {
      const status = this.paymentStatusList.find(item => item.id === cellValue)
      return status ? status.name : '---'
    },
    formatChargeType(row, column, cellValue) {
      const type = this.chargeTypeList.find(item => item.id === cellValue)
      return type ? type.name : '---'
    },
    formatPaymentMethod(row, column, cellValue) {
      const method = this.paymentMethodList.find(item => item.id === cellValue)
      return method ? method.name : '---'
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
