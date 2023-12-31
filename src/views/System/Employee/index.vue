<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input v-model="params.name" clearable @clear="getList" placeholder="请输入内容" class="search-main"/>
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" icon="el-icon-plus" size="medium" @click="openDialog">添加员工</el-button>
      <el-button type="success" icon="el-icon-refresh" :loading="loadingFlag" size="medium" @click="refreshLoading">
        刷新页面
      </el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号"/>
        <el-table-column label="员工姓名" width="120" prop="name" sortable/>
        <el-table-column label="登录账号" width="120" prop="userName" sortable/>
        <el-table-column label="联系方式" width="120" prop="phonenumber" sortable/>
        <el-table-column label="角色" width="120" prop="roleName" sortable/>
        <el-table-column label="状态" width="80" prop="status" sortable :formatter="formatStatus">
          <!--<template #default="scope">-->
          <!--<span v-if="scope.row.status === 0">未启用</span>-->
          <!--<span v-else-if="scope.row.status === 1">启用</span>-->
          <!--</template>-->
          <!--<template #default="scope">-->
          <!--{{ formatStatus(scope.row.status) }}-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" width="170" sortable/>
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button size="mini" type="text" @click="updateEmployee(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteEmployee(scope.row.id)">删除</el-button>
            <el-button size="mini" type="text" @click="resetEmployeePwd(scope.row.id)">重置密码</el-button>
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
    <!-- 添加员工 -->
    <el-dialog
      :title="addForm.id ? '编辑用户' : '添加用户'"
      width="480ox"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      center
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name"/>
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName"/>
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber"/>
          </el-form-item>
          <el-descriptions>
            <el-descriptions-item label="默认密码">
              <el-tag size="medium">123456</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
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
  createEmployeeAPI,
  deleteEmployeeAPI,
  getEmployeeListAPI,
  resetEmployeePasswordAPI,
  updateEmployeeAPI
} from '@/api/employee'

export default {
  name: 'Employee',
  data() {
    return {
      employeeList: [],
      total: 0,
      loadingFlag: true,
      dialogVisible: false,
      pageSizes: [2, 3, 5, 10, 15, 20, 30],
      params: {
        page: 1,
        pageSize: 10,
        name: '' // 员工姓名
      },
      addForm: {
        name: '',
        userName: '',
        phonenumber: '',
        roleId: null,
        roleName: '',
        password: '123456',
        status: 1
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请分配角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ]
      },
      roleList: [
        {
          id: 1,
          name: '超级管理员'
        },
        {
          id: 2,
          name: '基础数据管理'
        },
        {
          id: 3,
          name: '行车管理'
        },
        {
          id: 4,
          name: '员工及系统管理'
        },
        {
          id: 5,
          name: '黑马测试'
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getEmployeeListAPI(this.params)
      this.loadingFlag = false
      this.employeeList = res.data.rows
      this.total = res.data.total
      // console.dir(this.employeeList)
    },
    async refreshLoading() {
      this.loadingFlag = true
      await this.getList()
    },
    doSearch() {
      this.params.page = 1
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getList()
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
    },
    formatStatus(row) {
      return row.status === 1 ? '启用' : '禁用'
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    clearForm() {
      this.$refs.addForm.resetFields()
    },
    async confirmAdd() {
      this.$refs.addForm.validate(
        async valid => {
          if (valid) {
            const newForm = {
              ...this.addForm
            }
            delete newForm.roleName
            delete newForm.password
            if (this.addForm.id) {
              // console.dir(newForm)
              await updateEmployeeAPI(newForm).then(
                async() => {
                  this.$message({
                    type: 'success',
                    message: '编辑成功'
                  })
                  this.closeDialog()
                  this.clearForm()
                  await this.getList()
                }
              ).catch(
                error => {
                  this.$message.error(error.response.data.msg)
                }
              )
            } else {
              await createEmployeeAPI(newForm).then(
                async() => {
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                  this.closeDialog()
                  this.clearForm()
                  await this.getList()
                }
              ).catch(
                error => {
                  this.$message.error(error.response.data.msg)
                }
              )
            }
          }
        }
      )
    },
    updateEmployee(row) {
      console.dir(row)
      this.openDialog()
      this.addForm = {
        id: row.id,
        name: row.name,
        userName: row.userName,
        phonenumber: row.phonenumber,
        roleId: row.roleId,
        status: row.status
      }
    },
    deleteEmployee(id) {
      this.$confirm('确认删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          await deleteEmployeeAPI(id)
          this.$message({
            type: 'success',
            message: '删除成功'
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
    resetEmployeePwd(id) {
      this.$confirm('确认重置密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          await resetEmployeePasswordAPI(id)
          this.$message({
            type: 'success',
            message: '重置成功'
          })
          await this.getList()
        }
      ).catch(
        () => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);;
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
  padding: 0 80px;
}
</style>
