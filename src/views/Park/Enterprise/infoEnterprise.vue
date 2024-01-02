<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header
        title="查看企业"
        @back="$router.back()"
      />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="des-container">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="企业名称" label-class-name="my-label" content-class-name="my-content">
              <el-input v-model="form.name" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="法人">
              <el-input v-model="form.legalPerson" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="注册地址">
              <el-input v-model="form.registeredAddress" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="所在行业">
              <el-input v-model="form.industryName" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="营业执照">
              <el-image
                style="width: 100px; height: 100px"
                :src="`${form.businessLicenseUrl}`"
                :preview-src-list="srcList"
                fit="contain"
                lazy
              />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="spacer" />
      <div class="form2-container">
        <div class="title">联系人信息</div>
        <div class="des-container">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="企业联系人" label-class-name="my-label" content-class-name="my-content">
              <el-input v-model="form.contact" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              <el-input v-model="form.contactNumber" disabled />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="spacer" />
      <div class="table-container">
        <div class="title">租贷记录</div>
        <div class="table-container">
          <el-button type="success" :loading="loadingFlag" icon="el-icon-refresh" size="medium" @click="refreshLoading">刷新页面</el-button>
          <el-table
            v-loading="loadingFlag"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.3)"
            :data="form.rent"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
            />
            <el-table-column
              prop="name"
              label="租赁楼宇"
              width="100"
            />
            <el-table-column
              label="租赁起止时间"
              width="200"
            >
              <template #default="{row}">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="租赁合同(点击预览)"
              width="150"
            >
              <template #default="{row}">
                <el-button type="text">
                  <a :href="`${previewURL}${row.contractUrl}`" target="_blank">
                    {{ row.contractName }}
                  </a>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="录入时间"
              width="180"
            />
            <el-table-column label="合同状态">
              <template #default="scope">
                <el-tag :type="formatInfoType(scope.row.status)">
                  {{ formatStatus(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
            >
              <template #default="scope">
                <el-button size="mini" type="text"><a :href="scope.row.contractUrl">合同下载</a></el-button>
                <el-button size="mini" type="text" @click="renewRent(scope.row)">续租</el-button>
                <el-button size="mini" type="text" @click="outRent(scope.row.id)">退租</el-button>
                <el-button size="mini" type="text" @click="deleteRent(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog
          title="添加合同"
          width="60%"
          height="80%"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          :after-leave="clearForm"
          center
        >
          <!-- 表单接口 -->
          <div>
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
                  <div slot="tip" class="el-upload__tip">支持扩展名：.rar、.zip、.doc、.docx、.pdf, 文件大小不超过5M</div>
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
    </main>
  </div>
</template>

<script>

import {
  createRentAPI,
  deleteRentAPI,
  getEnterpriseDetail,
  getEnterpriseListAPI,
  getRentBuildListAPI,
  outRentAPI,
  uploadAPI
} from '@/api/enterprise'

export default {
  data() {
    return {
      total: 0,
      loadingFlag: true,
      dialogVisible: false,
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: '', // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: '', // 企业名称
        type: 1, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件', trigger: 'change' }
        ],
        enterpriseId: [
          { required: true, message: '请确认企业名称', trigger: 'change' }
        ]
      },
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
      },
      rentList: [],
      enterpriseList: [],
      buildingList: [],
      srcList: [],
      form: {
      },
      previewURL: 'https://view.officeapps.live.com/op/view.aspx?src='
    }
  },
  mounted() {
    // const id = this.$route.query.id
    this.getDetail()
    this.getEnterpriseList()
  },
  methods: {
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
      const TypeMap = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TypeMap[type]
    },
    async getDetail() {
      const res = await getEnterpriseDetail(this.$route.query.id)
      this.form = res.data
      this.srcList = [
        this.form.businessLicenseUrl
      ]
      // console.dir(this.form)
      this.loadingFlag = false
      // console.dir(this.form.rent)
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getDetail()
      await this.getEnterpriseList()
    },
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      this.enterpriseList = res.data.rows.map((item) => {
        return {
          ...item,
          rentList: [] // 每一行补充存放合同的列表
        }
      })
      // console.dir(this.enterpriseList)
      this.total = res.data.total
      this.loadingFlag = false
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
      const isAllowedType = /\.(rar|zip|doc|docx|pdf)$/i.test(file.name)
      const isSizeOK = file.size / 1024 / 1024 < 5
      if (!isAllowedType) {
        this.$message.error('仅支持上传 .doc、.docx 和 .pdf 文件!')
      } else if (!isSizeOK) {
        this.$message.error('上传文件大小不能超过 5 MB!')
      }
      return isAllowedType && isSizeOK
    },
    async renewRent(row) {
      this.dialogVisible = true
      const res = await getRentBuildListAPI()
      this.buildingList = res.data
      console.dir(this.$route.query.id)
      console.dir(row)
      console.log('buildingName', row.name)
      console.dir(this.buildingList)
      this.rentForm = {
        type: 1,
        rentTime: [row.startTime, row.endTime], // 合同时间
        enterpriseId: this.$route.query.id // 企业名称
      }
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
            console.dir(newForm)
            await createRentAPI(newForm).then(
              () => {
                this.$message({
                  type: 'success',
                  message: '续租成功'
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
    outRent(id) {
      this.$confirm(
        '确认退租吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).then(
        async() => {
          await outRentAPI(id).then(
            async() => {
              await this.getDetail()
              await this.getEnterpriseList()
              this.$message({
                type: 'success',
                message: '退租成功!'
              })
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
            message: '已取消退租'
          })
        }
      )
    },
    deleteRent(id) {
      this.$confirm(
        '确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).then(
        async() => {
          await deleteRentAPI(id).then(
            async() => {
              await this.getDetail()
              await this.getEnterpriseList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
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
.add-card {
  background-color: #f4f6f8;
  height: 200vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 30px 120px 30px 120px;

    .spacer {
      height: 30px; /* 设置间距的高度，可以根据需要调整 */
      background-color: #fff; /* 设置白色背景 */
    }

    .form-container {
      background-color: #fff;
      height: 250px;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 10px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }

    .form2-container {
      background-color: #fff;
      height: 100px;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 10px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }

    .carInfo-container {
      background-color: #fff;
      display: flex;
      justify-content: center;
    }

    .des-container {
      background-color: #fff;
      display: flex;
      justify-content: center;
      height: 150px;
      .my-label {
        background: #E1F3D8;
      }

      .my-content {
        background: #FDE2E2;
      }
    }

    .table-container {
      background-color: #fff;
      padding: 25px 25px 25px 25px;

      .el-table .warning-row {
        background: oldlace;
      }

      .el-table .success-row {
        background: #f0f9eb;
      }
    }

    .preview {
      img {
        width: 100px;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
.form-container{
  padding:0 80px;
}
</style>
