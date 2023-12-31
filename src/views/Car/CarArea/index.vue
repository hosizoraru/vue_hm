<template>
  <div class="building-container">
    <div class="create-container">
      <el-button type="primary" size="medium" @click="openDialog">添加区域<i class="el-icon-upload el-icon--right" /></el-button>
      <el-button type="success" icon="el-icon-refresh" :loading="loadingFlag" size="medium" @click="refreshLoading">刷新页面</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table-container">
      <el-table
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        style="width: 100%"
        :data="tableList"
      >
        <el-table-column type="index" label="序号" />
        <el-table-column label="区域名称" prop="areaName" sortable />
        <el-table-column label="车位数（个）" prop="spaceNumber" sortable />
        <el-table-column label="面积（㎡）" prop="areaProportion" sortable />
        <el-table-column label="计费规则" prop="ruleName" sortable />
        <el-table-column label="备注" prop="remark" sortable />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="updateArea(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteArea(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="addForm.id ? '编辑区域' : '添加区域'"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="60%"
        height="60%"
        center
      >
        <div class="form-container">
          <el-form ref="addForm" :model="addForm" :rules="addFormRules">
            <el-form-item label="区域名称" prop="areaName">
              <el-input v-model="addForm.areaName" placeholder="请输入区域名称" clearable />
            </el-form-item>
            <el-form-item label="车位数（个）" prop="spaceNumber">
              <el-input-number v-model="addForm.spaceNumber" placeholder="请输入车位数" />
            </el-form-item>
            <el-form-item label="面积（㎡）" prop="areaProportion">
              <el-input v-model="addForm.areaProportion" placeholder="请输入面积">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
            <el-form-item label="关联计费规则" prop="ruleId">
              <el-select v-model="addForm.ruleId" placeholder="请选择计费规则">
                <el-option
                  v-for="item in ruleDropList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="addForm.remark"
                placeholder="请输入备注"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5 }"
                clearable
              />
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

import { createAreaAPI, deleteAreaAPI, getAreaListAPI, updateAreaAPI } from '@/api/area'

export default {
  data() {
    return {
      tableList: [],
      loadingFlag: true,
      dialogVisible: false,
      params: {
        page: 1,
        pageSize: 10
      },
      pageSizes: [2, 3, 5, 10, 15, 20, 30],
      total: 0,
      addForm: {
        id: null,
        areaName: null,
        spaceNumber: 0,
        areaProportion: 0,
        remark: null,
        ruleId: null,
        ruleName: null,
        hoverRuleName: null
      },
      addFormRules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        spaceNumber: [
          { required: true, message: '请输入车位数', trigger: 'blur' },
          { type: 'number', min: 0, message: '车位数不能小于0', trigger: 'blur' }
        ],
        areaProportion: [
          { required: true, message: '请输入面积', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const numericValue = parseFloat(value)
              if (isNaN(numericValue) || numericValue < 0) {
                callback(new Error('面积不能小于0'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        ruleId: [
          { required: true, message: '请选择计费规则', trigger: 'change' }
        ]
      },
      ruleDropList: [
        // {
        //   id: 10,
        //   name: null
        // },
        {
          id: 4,
          name: '分段计费'
        },
        {
          id: 3,
          name: '按次收费'
        },
        {
          id: 2,
          name: '按小时计费'
        },
        {
          id: 1,
          name: '按分钟计费'
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getAreaListAPI(this.params).then(
        res => {
          this.tableList = res.data.rows
          this.total = res.data.total
          this.loadingFlag = false
          // console.log(this.tableList)
        }
      ).catch(
        error => {
          this.$message.error(error.response.data.msg)
          this.loadingFlag = true
        }
      )
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getList()
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getList()
    },
    openDialog() {
      this.dialogVisible = true
    },
    handleClose() {
      this.$confirm('确认关闭？').then(
        () => {
          this.dialogVisible = false
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
    clearForm() {
      this.$refs.addForm.resetFields()
    },
    confirmAdd() {
      this.$refs.addForm.validate(
        valid => {
          if (valid) {
            const newForm = {
              areaName: this.addForm.areaName,
              spaceNumber: this.addForm.spaceNumber,
              areaProportion: this.addForm.areaProportion,
              remark: this.addForm.remark,
              ruleId: this.addForm.ruleId
            }
            if (this.addForm.id) {
              newForm.id = this.addForm.id
              updateAreaAPI(newForm).then(
                () => {
                  this.$message({
                    type: 'success',
                    message: '编辑成功'
                  })
                  this.dialogVisible = false
                  this.clearForm()
                  this.getList()
                }
              ).catch(
                error => {
                  this.$message.error(error.response.data.msg)
                }
              )
            } else {
              createAreaAPI(newForm).then(
                () => {
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                  this.dialogVisible = false
                  this.clearForm()
                  this.getList()
                }
              ).catch(
                error => {
                  this.$message.error(error.response.data.msg)
                }
              )
            }
          } else {
            this.$message.info('请填写完整信息')
          }
        }
      )
    },
    updateArea(row) {
      this.dialogVisible = true
      this.addForm = {
        id: row.id,
        areaName: row.areaName,
        spaceNumber: row.spaceNumber,
        areaProportion: row.areaProportion,
        remark: row.remark,
        ruleId: row.ruleId
      }
    },
    deleteArea(id) {
      this.$confirm('此操作将永久删除该区域, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          deleteAreaAPI(id).then(
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

.table-container {
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
