<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header
        title="告警详情"
        @back="$router.back()"
      />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="spacer" />
        <el-button type="success" icon="el-icon-refresh" :loading="loadingFlag" @click="refreshLoading">刷新页面</el-button>
        <div class="title">告警信息</div>
        <div class="des-container">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="告警时间" label-class-name="my-label" content-class-name="my-content">
              <el-input v-model="addForm.warningTime" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="一体杆名称">
              <el-input v-model="addForm.poleName" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="告警区域">
              <el-input v-model="addForm.areaName" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="一体杆编号">
              <el-input v-model="addForm.poleNumber" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="故障类型">
              <el-input v-model="addForm.errorType" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="处置状态">
              <el-select v-model="addForm.handleStatus" disabled>
                <el-option
                  v-for="status in handleStatusList"
                  :key="status.id"
                  :label="status.name"
                  :value="status.id"
                />
              </el-select>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="spacer" />
      <div class="form-container">
        <div class="title">告警处理</div>
        <div class="des-container">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="处理人" label-class-name="my-label" content-class-name="my-content">
              <el-input v-model="addForm.handleUser" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="联系方式">
              <el-input v-model="addForm.phonenumber" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="处理结果">
              <el-input v-model="addForm.handleResult" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="完成时间">
              <el-input v-model="addForm.handleTime" disabled />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

import { getPoleWarningDetailAPI } from '@/api/polewarning'

export default {
  data() {
    return {
      loadingFlag: true,
      dialogVisible: false,
      addForm: {
        id: null,
        warningTime: null,
        errorType: null,
        poleName: null,
        poleNumber: null,
        areaName: null,
        handleStatus: null,
        handleUser: null,
        phonenumber: null,
        handleResult: null,
        handleTime: null
      },
      handleStatusList: [
        { id: null, name: '全部' },
        { id: 0, name: '未派单' },
        { id: 1, name: '已派单' },
        { id: 2, name: '已接单' },
        { id: 3, name: '已完成' }
      ]
    }
  },
  mounted() {
    // const id = this.$route.query.id
    this.getForm()
  },
  methods: {
    async getForm() {
      const res = await getPoleWarningDetailAPI(this.$route.query.id)
      this.addForm = res.data
      this.loadingFlag = false
      // console.log('res', res)
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getForm()
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
