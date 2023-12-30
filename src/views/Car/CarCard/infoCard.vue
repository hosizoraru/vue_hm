<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header
        title="查看月卡详情"
        @back="$router.back()"
      />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
      </div>
      <div class="carInfo-container">
        <el-radio-group v-model="desSize" size="small">
          <el-radio border label="">默认</el-radio>
          <el-radio border label="medium">中等</el-radio>
          <el-radio border label="small">小型</el-radio>
          <el-radio border label="mini">超小</el-radio>
          <el-tag size="medium">当前尺寸：{{ desSize }}</el-tag>
        </el-radio-group>
      </div>
      <div class="spacer" />
      <div class="des-container">
        <el-descriptions :column="2" border :size="desSize">
          <el-descriptions-item label="车主姓名" label-class-name="my-label" content-class-name="my-content">
            <el-input v-model="carInfoForm.personName" disabled />
          </el-descriptions-item>
          <el-descriptions-item label="联系方式">
            <el-input v-model="carInfoForm.phoneNumber" disabled />
          </el-descriptions-item>
          <el-descriptions-item label="车牌号码">
            <el-input v-model="carInfoForm.carNumber" disabled />
          </el-descriptions-item>
          <!--<el-descriptions-item label="备注">-->
          <!--<el-tag size="small">学校</el-tag>-->
          <!--</el-descriptions-item>-->
          <el-descriptions-item label="车辆品牌" :content-style="{'text-align': 'right'}">
            <el-input v-model="carInfoForm.carBrand" disabled />
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="form-container">
        <div class="title">月卡缴费记录</div>
      </div>
      <div class="table-container">
        <el-table
          :data="rechargeList"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            type="index"
            label="序号"
          />
          <el-table-column prop="effectTime" label="有效时间" width="250px">
            <template slot-scope="scope">
              <span>{{ scope.row.cardStartDate }} - {{ scope.row.cardEndDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="paymentAmount"
            label="支付金额"
            width="100px"
          />
          <el-table-column
            prop="paymentMethod"
            label="支付方式"
          />
          <el-table-column
            prop="createTime"
            label="办理时间"
            width="200px"
          />
          <el-table-column
            prop="createUser"
            label="办理人"
          />
        </el-table>
      </div>
    </main>
  </div>
</template>

<script>

import { getCardDetailAPI, getCardRechargeAPI } from '@/api/car'

export default {
  data() {
    return {
      desSize: '',
      // 车辆信息表单
      carInfoForm: {
        personName: '', // 车主姓名
        phoneNumber: '', // 联系方式
        carNumber: '', // 车牌号码
        carBrand: '' // 车辆品牌
      },
      // 缴费信息表单
      feeForm: {
        payTime: '', // 支付时间
        paymentAmount: '', // 支付金额
        paymentMethod: '' // 支付方式
      },
      // 支付方式列表
      payMethodList: [
        { id: 'Alipay', name: '支付宝' },
        { id: 'WeChat', name: '微信' },
        { id: 'Cash', name: '线下' }
      ],
      rechargeList: []
    }
  },
  mounted() {
    /*
        如何获取地址栏路径中的 id 参数
        vue router 中的一个属性 $route
        $route.query.id
     */
    // const type = this.$route.query.type
    // console.log(this.$route.query)
    // console.log(id)
    const id = this.$route.query.id
    getCardDetailAPI(id).then(
      res => {
        const data = res.data
        // console.log(data)
        // ... 展开运算符
        this.carInfoForm = {
          // ...data
          personName: data.personName,
          phoneNumber: data.phoneNumber,
          carNumber: data.carNumber,
          carBrand: data.carBrand
        }
        this.feeForm = {
          // ...data,
          payTime: [data.cardStartDate, data.cardEndDate],
          carInfoId: data.carInfoId,
          rechargeId: data.rechargeId,
          paymentAmount: data.paymentAmount,
          paymentMethod: data.paymentMethod
        }
      }
    ).catch(
      error => {
        this.$message.error(error)
      }
    )
    getCardRechargeAPI(id).then(
      res => {
        this.rechargeList = res.data.rechargeList
        // console.log(res.data)
        // console.log(this.rechargeList)
        // console.log(this.rechargeList[0].cardStartDate)
        // console.log(this.rechargeList[0].cardEndDate)
      }
    ).catch(
      error => {
        this.$message.error(error)
      }
    )
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
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
