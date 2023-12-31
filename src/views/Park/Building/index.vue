<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="params.name" placeholder="请输入内容" class="search-main" clearable @clear="getList" />
      <el-button type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
      <el-button type="success" :circle="true" icon="el-icon-refresh" :loading="loadingFlag" @click="refreshLoading" />
    </div>
    <div class="add-container">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" size="medium" :round="true" @click="openDialog">添加楼宇</el-button>
        <el-button type="danger" icon="el-icon-delete" size="medium" :round="true" @click="deleteBuildings">批量删除</el-button>
      </el-button-group>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <!--
        type:
        index 序号
        selection 多选
        prop: 对应列内容的字段名
      -->
      <el-table
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        style="width: 100%"
        :data="tableData"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
        />
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column
          prop="name"
          label="楼宇名称"
          width="180"
          sortable
        />
        <el-table-column
          prop="floors"
          label="层数"
          sortable
        />
        <el-table-column
          prop="area"
          label="在管面积(m²)"
          width="120"
          sortable
        />
        <el-table-column
          prop="propertyFeePrice"
          label="物业费(元/m²)"
          width="120"
          sortable
        />
        <el-table-column
          prop="status"
          label="状态"
          :formatter="statusFormatter"
          sortable
        />
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="updateBuilding(scope.row)"
              @close="clearForm"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="deleteBuilding(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--
          close 点击 x 或者蒙区会触发的函数
          visible 控制弹窗的显示和隐藏
          visible.sync 双向绑定
      -->
      <el-dialog
        :title="addForm.id ? '编辑楼宇' : '添加楼宇'"
        width="60%"
        height="60%"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        center
      >
        <div class="radio-group-container">
          <el-radio-group v-model="labelPosition" size="small">
            <el-radio-button label="left">左对齐</el-radio-button>
            <el-radio-button label="right">右对齐</el-radio-button>
            <el-radio-button label="top">顶部对齐</el-radio-button>
          </el-radio-group>
          <el-radio-group>
            <el-radio>hi</el-radio>
            <el-radio :border="true">hello</el-radio>
          </el-radio-group>
        </div>
        <div class="form-container">
          <el-form ref="addForm" :model="addForm" :rules="addFormRules" :label-position="labelPosition" label-width="80px">
            <el-form-item label="楼宇名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入楼宇名称" autosize />
            </el-form-item>
            <el-form-item label="楼宇层数" prop="floors">
              <el-input v-model="addForm.floors" placeholder="请输入楼宇层数" autosize />
            </el-form-item>
            <el-form-item label="在管面积" prop="area">
              <el-input v-model="addForm.area" placeholder="请输入在管面积" autosize />
            </el-form-item>
            <el-form-item label="物业费" prop="propertyFeePrice">
              <el-input v-model="addForm.propertyFeePrice" placeholder="请输入物业费" autosize />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="medium" type="warning" @click="clearForm">重 置</el-button>
          <el-button size="medium" type="danger" @click="handleClose">取 消</el-button>
          <el-button size="medium" type="primary" @click="confirmAdd">确 定</el-button>
        </template>
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
        <!--</span>-->
      </el-dialog>
    </div>
    <div class="page-container">
      <el-pagination
        :current-page="params.page"
        :page-size="params.pageSize"
        :page-sizes="pageSizes"
        :total="total"
        layout="total, prev, pager, next, sizes, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { createBuildingAPI, deleteBuildingAPI, getBuildingListAPI, updateBuildingAPI } from '@/api/building'
import { right } from 'core-js/internals/array-reduce'

export default {
  name: 'Building',
  data() {
    return {
      tableData: [],
      loadingFlag: true,
      total: 0,
      dialogVisible: false,
      labelPosition: 'right',
      pageSizes: [2, 3, 5, 10, 15, 20, 30],
      params: {
        page: 1,
        pageSize: 10,
        name: ''
      },
      addForm: {
        name: null,
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入楼宇名称', trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入在管面积', trigger: 'blur' }
        ],
        propertyFeePrice: [
          { required: true, message: '请输入物业费', trigger: 'blur' }
        ]
      },
      statusList: [
        { label: '租贷中', value: 1 },
        { label: '空置中', value: 0 }
      ],
      selectBuildingList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    right,
    async getList() {
      const res = await getBuildingListAPI(this.params)
      this.tableData = res.data.rows
      this.total = res.data.total
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
    statusFormatter(row) {
      return row.status === 1 ? '租贷中' : '空置中'
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
    closeDialog() {
      this.dialogVisible = false
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
    confirmAdd() {
      this.$refs.addForm.validate(
        valid => {
          if (valid) {
            if (this.addForm.id) {
              updateBuildingAPI(this.addForm).then(
                () => {
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  })
                  this.clearForm()
                  this.closeDialog()
                  this.getList()
                }
              ).catch(
                error => {
                  this.$message.error(error.response.data.msg)
                }
              )
            } else {
              createBuildingAPI(this.addForm).then(
                () => {
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  })
                  this.clearForm()
                  this.closeDialog()
                  this.getList()
                }
              ).catch(
                error => {
                  this.$message.error(error.response.data.msg)
                }
              )
            }
          } else {
            this.$message.error('请填写完整的楼宇信息')
          }
        }
      )
    },
    deleteBuilding(id) {
      this.$confirm('此操作将永久删除该楼宇信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          deleteBuildingAPI(id).then(
            async() => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // 需要删本页最后一条数据后 回到上一页
              if (this.tableData.length === 1) {
                this.params.page--
              }
              await this.getList()
            }
          ).catch(
            error => {
              this.$message.error(error.response.data.msg)
            }
          )
        }
      )
    },
    deleteBuildings() {
      this.$confirm('', {
        message: `已选择 ${this.selectBuildingList.length} 个楼宇`,
        title: '此操作将永久删除选择的楼宇, 是否继续?',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(
        async() => {
          const ids = this.selectBuildingList.map(item => item.id)
          for (const id of ids) {
            await deleteBuildingAPI(id)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
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
    handleSelectionChange(val) {
      this.selectBuildingList = val
      // console.log(val.map(item => item.id).join(','))
    },
    updateBuilding(row) {
      // console.dir(row)
      // const id = row.id
      // delete row.id
      // delete row.status
      // console.dir(row)
      // this.addForm = {
      //   ...row
      // }
      this.dialogVisible = true
      this.addForm = {
        name: row.name,
        floors: row.floors,
        area: row.area,
        propertyFeePrice: row.propertyFeePrice,
        id: row.id
      }
    },
    clearForm() {
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
.add-container {
  margin-top: 20px;
  margin-bottom: 10px;
}
.page-container {
  // flex 弹性容器布局 快速实现自元素横向布局
  // float: right;
  display: flex;
  justify-content: flex-end;
  margin: 5px;
  padding: 10px;
  //text-align: right;
}
.radio-group-container {
  display: flex;
  justify-content: space-between;
}
.form-container {
  display: flex;
  justify-content: center;
}
</style>
