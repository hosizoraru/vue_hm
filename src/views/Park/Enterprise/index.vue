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
        @expand-change="expandHandle"
      >
        <el-table-column type="expand">
          <template>
            <el-table :data="rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column label="合同状态">
                <template #default="scope">
                  <el-tag :type="formatInfoType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="mini" type="text">续租</el-button>
                  <el-button size="mini" type="text">退租</el-button>
                  <el-button size="mini" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
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
            <el-button-group class="button-container">
              <el-button size="mini" type="text" @click="openDialog(scope.row.id)">添加合同</el-button>
              <el-button size="mini" type="text" @click="jumpToDetailEnterprise(scope.row.id)">查看</el-button>
              <el-button size="mini" type="text" @click="updateEnterprise(scope.row.id)">编辑</el-button>
              <el-popconfirm
                title="此操作将永久删除该企业, 是否继续?"
                confirm-button-text="确定"
                cancel-button-text="取消"
                type="warning"
                @confirm="deleteEnterprise(scope.row.id)"
              >
                <el-button slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </el-button-group>
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
    <el-dialog
      title="添加合同"
      width="480ox"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      center
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form
          ref="rentForm"
          :model="rentForm"
          :rules="rentRules"
          label-position="top"
        >
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in buildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              :picker-options="pickerOptions"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              unlink-panels
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              action="#"
              :http-request="uploadRequest"
              :before-upload="beforeUpload"
              multiple
            >
              <el-button icon="el-icon-upload" size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="medium" type="warning" @click="clearForm">重 置</el-button>
        <el-button size="medium" type="danger" @click="handleClose">取 消</el-button>
        <el-button size="medium" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  createRentAPI,
  deleteEnterpriseAPI,
  getEnterpriseListAPI,
  getRentBuildListAPI,
  getRentListAPI,
  uploadAPI
} from '@/api/enterprise'

export default {
  data() {
    return {
      tableList: [],
      loadingFlag: true,
      dialogVisible: false,
      params: {
        page: 1,
        pageSize: 10,
        name: null
      },
      pageSizes: [2, 3, 5, 10, 15, 20, 30],
      total: 0,
      rentList: [],
      formList: {
        name: null,
        contact: null,
        contactNumber: null
      },
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      },
      buildingList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '下一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setDate(end.getDate() + 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '下半个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setDate(start.getDate() + 15)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '下一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setMonth(start.getMonth() + 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '下两个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setMonth(start.getMonth() + 2)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate(time) {
          // Disable dates earlier than today
          return time.getTime() < new Date(new Date().toDateString()).getTime()
        }
      }
    }
  },
  async mounted() {
    await this.getList()
  },
  methods: {
    async getList() {
      const res = await getEnterpriseListAPI(this.params)
      this.tableList = res.data.rows
      this.total = res.data.total
      this.enterpriseList = res.data.rows.map(
        item => {
          return {
            ...item,
            rentList: []
          }
        }
      )
      this.loadingFlag = false
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
    async openDialog(id) {
      this.dialogVisible = true
      const res = await getRentBuildListAPI()
      this.buildingList = res.data
      this.rentForm.enterpriseId = id
    },
    closeDialog() {
      this.dialogVisible = false
    },
    clearForm() {
      this.$refs.rentForm.resetFields()
    },
    handleClose() {
      this.$confirm('确认关闭？').then(
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
    },
    async uploadRequest(data) {
      const file = data.file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract')
      const res = await uploadAPI(formData)
      this.rentForm.contractId = res.data.id
      this.rentForm.contractUrl = res.data.url
      // this.$refs.rentForm.validateField('contractId')
    },
    beforeUpload(file) {
      const isAllowedType = /\.(doc|docx|pdf)$/i.test(file.name)
      const isSizeOK = file.size / 1024 / 1024 < 5

      if (!isAllowedType) {
        this.$message.error('仅支持上传 .doc、.docx 和 .pdf 文件!')
      } else if (!isSizeOK) {
        this.$message.error('上传文件大小不能超过 5 MB!')
      }

      return isAllowedType && isSizeOK
    },
    confirmAdd() {
      this.$refs.rentForm.validate(
        async valid => {
          if (valid) {
            const newForm = {
              ...this.rentForm
            }
            newForm.startTime = newForm.rentTime[0]
            newForm.endTime = newForm.rentTime[1]
            delete newForm.rentTime
            // console.dir(newForm)
            await createRentAPI(newForm).then(
              () => {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.closeDialog()
                this.clearForm()
                this.getList()
              }
            ).catch(
              error => {
                this.$message.error(error.response.data.msg)
              }
            )
          } else {
            this.$message.error('请完善信息')
          }
        }
      )
    },
    jumpToDetailEnterprise(id) {
      this.$router.push('/infoEnterprise?id=' + id)
    },
    // 格式化tag类型
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },
    // 格式化status
    formatStatus(type) {
      const TypeMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TypeMAP[type]
    },
    async expandHandle(row, rows) {
      // console.log('展开或关闭', JSON.stringify(row))
      const isExpend = rows.find(item => item.id === row.id)
      if (isExpend) {
        const res = await getRentListAPI(row.id)
        // .then(
        //   row.rentList = res.data
        // )
        // eslint-disable-next-line require-atomic-updates
        // this.$nextTick(
        // () => {
        // row.rentList = res.data
        // this.$set(row, 'rentList', res.data)
        this.rentList = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  .el-button {
    padding: 5px 5px;
  }
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
