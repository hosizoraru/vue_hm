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
      </div>
      <div class="spacer" />
      <div class="form-container">
        <div class="title">联系人信息</div>
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
                <el-button size="mini" type="text" @click="outRent(scope.row.id)">退租</el-button>
                <el-button size="mini" type="text" @click="deleteRent(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import { deleteRentAPI, getEnterpriseDetail, getEnterpriseListAPI, outRentAPI } from '@/api/enterprise'

export default {
  data() {
    return {
      total: 0,
      loadingFlag: true,
      rentList: [],
      enterpriseList: [],
      form: {
      },
      previewURL: 'https://view.officeapps.live.com/op/view.aspx?src='
    }
  },
  mounted() {
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
      this.loadingFlag = false
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
      this.total = res.data.total
      this.loadingFlag = false
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
</style>
