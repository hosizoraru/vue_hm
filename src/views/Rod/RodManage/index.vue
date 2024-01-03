<template>
  <div class="card-container">
    <div class="search-container">
      <span class="search-label">一体杆：</span>
      <el-input v-model="params.poleName" class="search-main" clearable placeholder="请输入内容" @clear="getList" />
      <span class="search-label">一体杆编号：</span>
      <el-input v-model="params.poleNumber" class="search-main" clearable placeholder="请输入内容" @clear="getList" />
      <span class="search-label">运行状态：</span>
      <el-select v-model="params.poleStatus">
        <el-option
          v-for="status in poleStatusList"
          :key="status.id"
          :label="status.name"
          :value="status.id"
        />
      </el-select>
      <el-button :plain="true" class="search-btn" icon="el-icon-search" type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button-group>
        <el-button type="primary" :round="true" @click="openDialog">添加一体杆<i class="el-icon-upload el-icon--right" /></el-button>
        <el-button type="danger" :round="true" icon="el-icon-delete" @click="deletePoles">批量删除</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="warning" :circle="true" icon="el-icon-refresh" :loading="loadingFlag" @click="refreshLoading" />
        <el-button type="success" icon="el-icon-refresh" :loading="loadingFlag" @click="refreshLoading">刷新页面</el-button>
      </el-button-group>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column label="序号" type="index" />
        <el-table-column label="一体杆名称" prop="poleName" sortable />
        <el-table-column label="一体杆编号" prop="poleNumber" sortable />
        <el-table-column label="一体杆IP" prop="poleIp" sortable />
        <el-table-column label="安装区域" prop="areaName" sortable />
        <el-table-column label="一体杆类型" prop="poleType" sortable :formatter="formatPoleType" />
        <el-table-column label="运行状态" prop="poleStatus" sortable :formatter="formatPoleStatus" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button size="mini" @close="clearForm" type="text" @click="showPole(scope.row)">查看</el-button>
            <el-button size="mini" @close="clearForm" type="text" @click="updatePole(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="deletePole(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <el-dialog
      :title="titleString"
      :visible.sync="dialogVisible"
      width="50%"
      class="dialog-container"
      :before-close="handleClose"
      center
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="form" :model="form" :rules="formRules" label-position="top">
          <el-form-item label="一体杆名称" prop="poleName">
            <el-input v-model="form.poleName" :disabled="dialogUpdate" />
          </el-form-item>
          <el-form-item label="一体杆编号" prop="poleNumber">
            <el-input v-model="form.poleNumber" :disabled="dialogUpdate" />
          </el-form-item>
          <el-form-item label="一体杆IP" prop="poleIp">
            <el-radio-group v-model="form.poleIp" size="small" :disabled="dialogUpdate">
              <el-radio label="duration" border>时长收费</el-radio>
              <el-radio label="turn" border>按次收费</el-radio>
              <el-radio label="partition" border>分段收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联区域" prop="areaId">
            <el-input v-model="form.areaId" :disabled="dialogUpdate" />
          </el-form-item>
          <el-form-item label="一体杆类型" prop="poleType">
            <el-input v-model="form.poleType" :disabled="dialogUpdate" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button-group>
          <el-button size="medium" type="warning" :disabled="dialogUpdate" @click="clearForm">重 置</el-button>
          <el-button size="medium" type="danger" @click="handleClose">取 消</el-button>
          <el-button size="medium" type="primary" :disabled="dialogUpdate" @click="confirmAdd">确 定</el-button>
        </el-button-group>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import item from '@/layout/components/Sidebar/Item.vue'
import { deletePoleInfoAPI, getPoleInfoListAPI } from '@/api/poleinfo'
import { getAreaDropListAPI } from '@/api/area'

export default {
  data() {
    return {
      list: [],
      total: 0,
      value: false,
      loadingFlag: true,
      dialogVisible: false,
      dialogUpdate: false,
      type: '',
      pageSizes: [2, 3, 5, 10, 15, 20, 30],
      params: {
        page: 1,
        pageSize: 10,
        poleName: null,
        poleNumber: null,
        poleStatus: null
      },
      form: {
        id: null,
        poleName: null,
        poleNumber: null,
        poleIp: null,
        areaName: null,
        areaId: null,
        poleType: null,
        poleStatus: null
      },
      formRules: {
        poleName: [
          { required: true, message: '请输入一体杆名称', trigger: 'blur' }
        ],
        poleNumber: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请输入关联区域 ID', trigger: 'blur' }
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'change' }
        ]
      },
      poleStatusList: [
        { id: null, name: '全部' },
        { id: 0, name: '正常' },
        { id: 1, name: '异常' }
      ],
      poleTypeList: [
        { id: 'entrance', name: '入口' },
        { id: 'export', name: '出口' },
        { id: 'center', name: '中心' }
      ],
      selectList: [],
      areaDropList: []
    }
  },
  computed: {
    item() {
      return item
    },
    titleString() {
      if (this.dialogUpdate) {
        return '查看一体杆'
      } else if (this.form.id) {
        return '编辑一体杆'
      } else {
        return '添加一体杆'
      }
    }
  },
  async mounted() {
    await this.getList()
    await this.getAreaDropList()
  },
  methods: {
    async getList() {
      const res = await getPoleInfoListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
      this.loadingFlag = false
    },
    async getAreaDropList() {
      const res = await getAreaDropListAPI()
      this.areaDropList = res.data
      // console.log('areaDropList', this.areaDropList)
    },
    handleSelectionChange(val) {
      this.selectCardList = val
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
    deletePole(id) {
      this.$confirm('此操作将永久删除该月卡信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          deletePoleInfoAPI(id).then(
            async() => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              await this.getList()
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
    deletePoles() {
      this.$confirm('', {
        message: `已选择 ${this.selectCardList.length} 个月卡`,
        title: '此操作将永久删除选择的月卡, 是否继续?',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          await deletePoleInfoAPI(
            this.selectCardList.map(item => item.id).join(',')
          )
          this.$message({
            type: 'success',
            message: '删除成功!'
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
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getList()
      await this.getAreaDropList()
    },
    formatPoleStatus(row, column, cellValue) {
      const status = this.poleStatusList.find(item => item.id === cellValue)
      return status ? status.name : '---'
    },
    formatPoleType(row, column, cellValue) {
      const type = this.poleTypeList.find(item => item.id === cellValue)
      return type ? type.name : '---'
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    confirmAdd() {
    },
    clearForm() {
      this.$refs.form.resetFields()
    },
    async updatePole(row) {
      this.openDialog()
    },
    async showPole(row) {
      this.openDialog()
    },
    handleClose() {
      this.$confirm('确认关闭？')
        .then(
          () => {
            this.closeDialog()
            this.clearForm()
          }
        ).catch(
        () => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
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
