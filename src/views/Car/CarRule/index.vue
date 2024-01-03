<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button-group>
        <el-button type="primary" @click="openDialog">增加停车计费规则</el-button>
        <el-button plain @click="exportToExcel">导出Excel</el-button>
        <el-button type="success" icon="el-icon-refresh" :loading="loadingFlag" size="medium" @click="refreshLoading">刷新页面</el-button>
      </el-button-group>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :data="ruleList"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式" width="100px">
          <template #default="scope">
            {{ formatChargeType(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" width="120px" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button size="mini" type="text" @click="showRule(scope.row.id)">查看</el-button>
              <el-button size="mini" type="text" @close="clearForm" @click="updateRule(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="deleteRule(scope.row.id)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
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
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
          <el-form-item label="计费规则编号" prop="ruleNumber">
            <el-input v-model="addForm.ruleNumber" :disabled="dialogUpdate" />
          </el-form-item>
          <el-form-item label="计费规则名称" prop="ruleName">
            <el-input v-model="addForm.ruleName" :disabled="dialogUpdate" />
          </el-form-item>
          <el-form-item label="计费方式" prop="chargeType">
            <el-radio-group v-model="addForm.chargeType" size="small" :disabled="dialogUpdate">
              <el-radio label="duration" border>时长收费</el-radio>
              <el-radio label="turn" border>按次收费</el-radio>
              <el-radio label="partition" border>分段收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex-container">
            <el-form-item label="免费时长" prop="freeDuration">
              <el-input v-model="addForm.freeDuration" :disabled="dialogUpdate" />
            </el-form-item>
            <el-form-item label="收费上限" prop="chargeCeiling">
              <el-input v-model="addForm.chargeCeiling" :disabled="dialogUpdate" />
            </el-form-item>
          </div>
          <el-form-item label="计费规则">
            <!-- 按时长收费区域 -->
            <el-form-item v-if="addForm.chargeType === 'duration'" class="duration" prop="chargeType">
              每
              <el-input v-model="addForm.durationTime" class="input-box" :disabled="dialogUpdate" />
              <el-select v-model="addForm.durationType" placeholder="单位" style="width: 100px" :disabled="dialogUpdate">
                <el-option label="小时" value="hour" />
                <el-option label="分钟" value="minute" />
              </el-select>
              <el-input v-model="addForm.durationPrice" class="input-box" :disabled="dialogUpdate" />
              元
            </el-form-item>
            <!-- 按次收费区域 -->
            <el-form-item v-if="addForm.chargeType === 'turn'" class="turn" prop="chargeType">
              每次 <el-input v-model="addForm.turnPrice" class="input-box" :disabled="dialogUpdate" /> 元
            </el-form-item>
            <!-- 按分段收费区域 -->
            <el-form-item v-if="addForm.chargeType==='partition'" class="partition" prop="chargeType">
              <div class="item"><el-input v-model="addForm.partitionFrameTime" class="input-box" :disabled="dialogUpdate" />小时内,每小时收费<el-input v-model="addForm.partitionFramePrice" class="input-box" :disabled="dialogUpdate" /> 元</div>
              <div class="item">每增加<el-input v-model="addForm.partitionIncreaseTime" class="input-box" :disabled="dialogUpdate" />小时,增加<el-input v-model="addForm.partitionIncreasePrice" class="input-box" :disabled="dialogUpdate" /> 元</div>
            </el-form-item>
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
import { createRuleAPI, deleteRuleAPI, getRuleDetailAPI, getRuleListAPI, updateRuleAPI } from '@/api/carRule'
import { utils, writeFileXLSX } from 'xlsx'

export default {
  name: 'Building',
  data() {
    return {
      ruleList: [],
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false,
      loadingFlag: true,
      dialogUpdate: false,
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: null, // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: null, // hour minute
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      }, // 计费规则表单对象
      addFormRules: {
        ruleNumber: [
          {
            required: true,
            message: '请输入规则编号',
            trigger: 'blur'
          }
        ],
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        chargeType: [
          {
            required: true,
            message: '请选择收费类型',
            trigger: 'blur'
          }
        ],
        freeDuration: [
          {
            required: true,
            message: '请输入免费时长',
            trigger: 'blur'
          }
        ],
        chargeCeiling: [
          {
            required: true,
            message: '请输入收费上限',
            trigger: 'blur'
          }
        ]
      } // 计费规则校验规则对象
    }
  },
  computed: {
    titleString() {
      if (this.dialogUpdate) {
        return '查看停车计费规则'
      } else if (this.addForm.id) {
        return '编辑停车计费规则'
      } else {
        return '添加停车计费规则'
      }
    }
  },
  async mounted() {
    await this.getList()
    // const dropList = await getRuleDropListAPI()
    // console.dir(dropList)
  },
  methods: {
    async getList() {
      const res = await getRuleListAPI(this.params)
      this.loadingFlag = false
      this.ruleList = res.data.rows
      this.total = res.data.total
    },
    // 导出excel
    async exportToExcel() {
      // 获取要导出的业务数据
      const res = await getRuleListAPI(this.params)
      // 表头英文字段key
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      // 表头中文字段value
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']
      // 以excel表格的顺序调整后端数据
      // 适配excel表格
      const sheetData = res.data.rows.map(item => {
        const _obj = {}
        tableHeaderKeys.forEach(key => {
          // 赋值
          // 针对计费规则做处理
          if (key === 'chargeType') {
            _obj[key] = this.formatChargeType(item[key])
          } else {
            _obj[key] = item[key]
          }
        })
        return _obj
      })
      // 创建一个工作表
      const worksheet = utils.json_to_sheet(sheetData)
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 把工作表添加到工作簿
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      writeFileXLSX(workbook, '计费规则.xlsx')
    },
    formatChargeType(type) {
      const TypeMAP = {
        'duration': '按时长收费',
        'turn': '按次收费',
        'partition': '分段收费'
      }
      return TypeMAP[type]
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    clearForm() {
      this.$refs.addForm.resetFields()
      // reset 无法完全清理，只能强制覆盖
      this.addForm = {
        id: null,
        ruleNumber: '',
        ruleName: '',
        chargeType: null,
        chargeCeiling: null,
        freeDuration: null,
        durationTime: null,
        durationPrice: null,
        durationType: null,
        turnPrice: null,
        partitionFrameTime: null,
        partitionFramePrice: null,
        partitionIncreaseTime: null,
        partitionIncreasePrice: null
      }
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getList()
    },
    handleClose() {
      this.$confirm('确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        () => {
          this.closeDialog()
          this.clearForm()
          this.dialogUpdate = false
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
    confirmAdd() {
      if (this.addForm.id) {
        console.log('编辑')
      } else {
        console.log('添加')
      }
      this.$refs.addForm.validate(
        async valid => {
          if (valid) {
            if (this.addForm.id) {
              await updateRuleAPI(this.addForm).then(
                async() => {
                  await this.getList()
                  this.$message({
                    type: 'success',
                    message: '编辑成功'
                  })
                  this.closeDialog()
                  this.clearForm()
                }
              ).catch(
                error => {
                  this.$message({
                    type: 'error',
                    message: error.response.data.msg
                  })
                }
              )
            } else {
              await createRuleAPI(this.addForm).then(
                async() => {
                  await this.getList()
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                  this.closeDialog()
                  this.clearForm()
                }
              ).catch(
                error => {
                  this.$message({
                    type: 'error',
                    message: error.response.data.msg
                  })
                }
              )
            }
          } else {
            this.$message({
              type: 'error',
              message: '请检查表单内容'
            })
          }
        }
      )
    },
    deleteRule(id) {
      this.$confirm('确认删除？')
        .then(
          async() => {
            await deleteRuleAPI(id).then(
              async() => {
                await this.getList()
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
              }
            ).catch(
              error => {
                this.$message({
                  type: 'error',
                  message: error.response.data.msg
                })
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
    async updateRule(row) {
      this.openDialog()
      // console.log('row:', row)
      const res = await getRuleDetailAPI(row.id)
      // console.log('detail', res.data)
      this.addForm = {
        ...res.data
      }
      // console.log('addForm', this.addForm)
    },
    async showRule(id) {
      this.openDialog()
      this.dialogUpdate = true
      const res = await getRuleDetailAPI(id)
      // console.log('res.data', res.data)
      this.addForm = {
        ...res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}

.create-container {
  margin: 10px 0;
}

.page-container {
  padding: 4px 0;
  text-align: right;
}

.form-container {
  padding: 20px 80px;
}

.dialog-container {
  max-height: 100vh; /* 设置最大高度，以免对话框过长 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.flex-container {
  display: flex;
  justify-content: space-between;
}

.input-box {
  width: 100px; /* 调整输入框的宽度，可以根据需要进行更改 */
}

/* 重置、取消和确定按钮的样式 */
.el-button-group .el-button {
  margin: 0 5px; /* 调整按钮之间的间距 */
}
</style>
