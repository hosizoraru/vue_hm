<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header
        :title="titleString"
        @back="$router.back()"
      />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="carInfoForm" :model="carInfoForm" :rules="carInfoRules" label-width="100px">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" :disabled="inputDisable" clearable />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" :disabled="inputDisable" clearable />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" :disabled="inputDisable" clearable />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" :disabled="inputDisable" clearable />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeForm" :model="feeForm" :rules="feeFormRules" label-width="100px">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeForm.payTime"
                :picker-options="pickerOptions"
                align="right"
                type="daterange"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                unlink-panels
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
                <!--<el-option label="微信" value="Wechat" />-->
                <!--<el-option label="支付宝" value="Alipay" />-->
                <!--<el-option label="线下" value="Cash" />-->
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="clearAdd">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>

import { createCardAPI, getCardDetailAPI, rechargeCardAPI, updateCardAPI } from '@/api/car'

export default {
  data() {
    return {
      // 车辆信息表单
      carInfoForm: {
        personName: '', // 车主姓名
        phoneNumber: '', // 联系方式
        carNumber: '', // 车牌号码
        carBrand: '' // 车辆品牌
      },
      // 服务器会检测手机号和车辆号码的合法性, 必须输入合法值
      // 车辆号码 类似 京A88812
      carInfoRules: {
        personName: [
          { required: true, message: '请输入车主姓名', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入合法手机号', trigger: 'blur' }
        ],
        carNumber: [
          { required: true, message: '请输入车辆号码', trigger: 'blur' }
        ],
        carBrand: [
          { required: true, message: '请输入车辆品牌', trigger: 'blur' }
        ]
      },
      // 缴费信息表单
      feeForm: {
        payTime: '', // 支付时间
        paymentAmount: '', // 支付金额
        paymentMethod: '' // 支付方式
      },
      // 缴费规则
      feeFormRules: {
        payTime: [
          { required: true, message: '请选择支付时间', trigger: 'blur' }
        ],
        paymentAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      },
      // 支付方式列表
      payMethodList: [
        { id: 'Alipay', name: '支付宝' },
        { id: 'WeChat', name: '微信' },
        // { id: 'UnionPay', name: '银联' },
        // { id: 'ApplePay', name: 'Apple Pay' },
        { id: 'Cash', name: '线下' }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近半个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '后三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
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
        ]
      },
      inputDisable: false
      // titleString: ''
    }
  },
  computed: {
    // return this.$store.state.user.inputStatus ? '查看月卡' : '编辑月卡'
    // return this.$route.query.id ? '编辑月卡' : this.$store.state.user.inputStatus ? '查看月卡' : '添加月卡'
    titleString() {
      if (this.$store.state.user.inputStatus) {
        return '续费月卡'
      } else if (this.$route.query.id) {
        return '编辑月卡'
      } else {
        return '添加月卡'
      }
    }
  },
  mounted() {
    /*
        如何获取地址栏路径中的 id 参数
        vue router 中的一个属性 $route
        $route.query.id
     */
    const id = this.$route.query.id
    // this.titleWhat()
    // const type = this.$route.query.type
    // console.log(this.$route.query)
    // console.log(id)
    if (id) {
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
          // console.dir(this.carInfoForm)
          // console.dir(this.feeForm)
          // console.log(this.$store.state.user.inputStatus)
          this.inputDisable = this.$store.state.user.inputStatus === true
        }
      )
    }
  },
  methods: {
    confirmAdd() {
      this.$refs.carInfoForm.validate(
        valid => {
          if (valid) {
            this.$refs.feeForm.validate(
              valid => {
                if (valid) {
                  // this.$message.success('添加成功')
                  const payload = {
                    ...this.carInfoForm,
                    ...this.feeForm,
                    cardStartDate: this.feeForm.payTime[0],
                    cardEndDate: this.feeForm.payTime[1]
                  }
                  delete payload.payTime
                  delete payload.cardStatus
                  if (this.$route.query.id && !this.$store.state.user.inputStatus) {
                    updateCardAPI({
                      ...payload
                    }).then(
                      () => {
                        this.$message({
                          type: 'success',
                          message: '修改成功'
                        })
                        this.$router.back()
                      }
                    ).catch(
                      error => {
                        this.$message.error(error.response.data.msg)
                      }
                    )
                  } else if (this.$route.query.id && this.$store.state.user.inputStatus) {
                    const newFrom = {
                      cardStartDate: this.feeForm.payTime[0],
                      cardEndDate: this.feeForm.payTime[1],
                      paymentAmount: this.feeForm.paymentAmount,
                      paymentMethod: this.feeForm.paymentMethod,
                      carInfoId: this.feeForm.carInfoId
                    }
                    rechargeCardAPI(newFrom).then(
                      () => {
                        this.$message({
                          type: 'success',
                          message: '续费成功'
                        })
                        this.$router.back()
                      }
                    ).catch(
                      error => {
                        this.$message.error(error.response.data.msg)
                      }
                    )
                  } else {
                    createCardAPI(payload).then(
                      () => {
                        this.$message({
                          type: 'success',
                          message: '添加成功'
                        })
                        this.$router.back()
                      }
                    ).catch(
                      error => {
                        this.$message.error(error.response.data.msg)
                      }
                    )
                  }
                  // console.log(payload)
                  // await createCardAPI(payload)
                  // createCardAPI(
                  //   {
                  //     personName: this.carInfoForm.personName,
                  //     phoneNumber: this.carInfoForm.phoneNumber,
                  //     carNumber: this.carInfoForm.carNumber,
                  //     carBrand: this.carInfoForm.carBrand,
                  //     cardStartDate: this.feeForm.payTime[0],
                  //     cardEndDate: this.feeForm.payTime[1],
                  //     paymentAmount: this.feeForm.paymentAmount,
                  //     paymentMethod: this.feeForm.paymentMethod
                  //   }
                  // ).then(
                  //   () => {
                  //     this.$message({
                  //       type: 'success',
                  //       message: '添加成功'
                  //     })
                  //     this.$router.back()
                  //   }
                  // )
                } else {
                  this.$message.error('请填写完整的缴费信息')
                }
              }
            )
          } else {
            this.$message.error('请填写完整的车辆信息')
          }
        }
      )
    },
    clearAdd() {
      if (this.$store.state.user.inputStatus) {
        this.$refs.feeForm.resetFields()
      } else {
        this.$refs.carInfoForm.resetFields()
        this.$refs.feeForm.resetFields()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

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
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
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
