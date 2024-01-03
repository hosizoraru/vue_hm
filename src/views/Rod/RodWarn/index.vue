<template>
  <div class="card-container">
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input v-model="params.poleName" class="search-main" clearable placeholder="请输入一体杆名称" @clear="getList" />
      <span class="search-label">一体杆编号：</span>
      <el-input v-model="params.poleNumber" class="search-main" clearable placeholder="请输入一体杆编号" @clear="getList" />
      <span class="search-label">处置状态：</span>
      <el-select v-model="params.handleStatus" placeholder="请选择处置状态">
        <el-option
          v-for="status in handleStatusList"
          :key="status.id"
          :label="status.name"
          :value="status.id"
        />
      </el-select>
      <el-button :plain="true" class="search-btn" icon="el-icon-search" type="primary" @click="doSearch">查询</el-button>
      <el-button type="success" icon="el-icon-refresh" :loading="loadingFlag" @click="refreshLoading">刷新</el-button>
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
        <el-table-column label="一体杆名称" prop="poleName" sortable />
        <el-table-column label="一体杆编号" prop="poleNumber" sortable />
        <el-table-column label="故障类型" prop="errorType" sortable />
        <el-table-column label="处置状态" prop="handleStatus" :formatter="formatHandleStatusStatus" sortable />
        <el-table-column label="告警时间" prop="warningTime" sortable />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button size="mini" :disabled="scope.row.status !== 0" type="text">派单</el-button>
            <el-button size="mini" type="text">详情</el-button>
            <el-button size="mini" :disabled="scope.row.status === 3" type="text" @click="deleteWarning(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
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
import { deletePoleWarningAPI, getPoleWarningListAPI } from '@/api/polewarning'

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
        poleName: null,
        poleNumber: null,
        handleStatus: null
      },
      handleStatusList: [
        { id: null, name: '全部' },
        { id: 0, name: '未派单' },
        { id: 1, name: '已派单' },
        { id: 2, name: '已接单' },
        { id: 3, name: '已完成' }
      ],
      errorTypeList: [
        '电路短路',
        '网络中断',
        '矢制盒插件接触不良',
        '传感器失灵',
        '车牌识别失效',
        '开关失灵',
        'LED显示故障',
        '闸门起落运行异常'
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
      const res = await getPoleWarningListAPI(this.params)
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
    formatHandleStatusStatus(row, column, cellValue) {
      const status = this.handleStatusList.find(item => item.id === cellValue)
      return status ? status.name : '---'
    },
    deleteWarning(id) {
      this.$confirm('确认删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          await deletePoleWarningAPI(id)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          await this.getList()
        }
      ).catch(
        () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      )
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
