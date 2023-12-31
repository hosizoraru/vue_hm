<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="getList" />
      <el-button icon="el-icon-search" type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" size="medium" @click="addEnterprise">添加企业<i class="el-icon-upload el-icon--right" /></el-button>
      <el-button type="success" :loading="loadingFlag" icon="el-icon-refresh" size="medium" @click="refreshLoading">刷新页面</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        ref="tableList"
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        style="width: 100%"
        :data="tableList"
      >
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" sortable />
        <el-table-column label="联系人" prop="contact" sortable />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
          sortable
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="updateEnterprise(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteEnterprise(scope.row.id)">删除</el-button>
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
import { deleteEnterpriseAPI, getEnterpriseListAPI } from '@/api/enterprise'

export default {
  data() {
    return {
      tableList: [],
      loadingFlag: false,
      params: {
        page: 1,
        pageSize: 10,
        name: null
      },
      pageSizes: [2, 3, 5, 10, 15, 20, 30],
      total: 0,
      formList: {
        name: null,
        contact: null,
        contactNumber: null
      }
    }
  },
  async mounted() {
    await this.getList()
  },
  methods: {
    getList() {
      getEnterpriseListAPI(this.params).then(
        res => {
          this.tableList = res.data.rows
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
    doSearch() {
      this.params.page = 1
      this.getList()
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getList()
    },
    addEnterprise() {
      this.$router.push('/addEnterprise')
    },
    updateEnterprise(id) {
      this.$router.push('/addEnterprise?id=' + id)
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getList()
    },
    deleteEnterprise(id) {
      this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          deleteEnterpriseAPI(id).then(
            async() => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0;
}
.page-container{
  padding:4px 0;
  text-align: right;
}
.form-container{
  padding:0 80px;
}
</style>
