<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span> | </span>
        <span>{{ $route.query.id ? '编辑企业' : '添加企业' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="addForm" label-width="100px" :model="addForm" :rules="addFormRules">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="营业执照" prop="name">
              <!--
                  上传组件
                  action 上传的地址
                  :http-request 上传的方法 会覆盖默认的上传方法
              -->
              <el-upload
                action="#"
                :http-request="uploadRequest"
                :on-preview="handlePreview"
                :before-upload="beforeUpload"
                list-type="picture"
                multiple
              >
                <el-button icon="el-icon-upload" size="medium" type="primary" plain>点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传 jpg/png 文件，且不超过 5 MB</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">联系人信息</div>
        <div class="form">
          <el-form ref="feeForm" label-width="100px" :model="feeForm" :rules="feeFormRules">
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="feeForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="feeForm.contactNumber" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button type="danger" @click="clearAdd">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  createEnterpriseAPI,
  getEnterpriseDetailAPI,
  getIndustryListAPI,
  updateEnterpriseAPI,
  uploadAPI
} from '@/api/enterprise'

export default {
  data() {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, message: '请输入注册地址', trigger: 'blur' }
        ],
        industryCode: [
          { required: true, message: '请选择所在行业', trigger: 'change' }
        ],
        businessLicenseUrl: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ]
      },
      feeForm: {
        contact: '', // 企业联系人
        contactNumber: '' // 联系人电话
      },
      feeFormRules: {
        contact: [
          { required: true, message: '请输入企业联系人', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ]
      },
      industryList: []
    }
  },
  mounted() {
    this.getIndustryList()
    const id = this.$route.query.id
    if (id) {
      getEnterpriseDetailAPI(id).then(
        res => {
          const data = res.data
          this.addForm = {
            name: data.name, // 企业名称
            legalPerson: data.legalPerson, // 法人
            registeredAddress: data.registeredAddress, // 注册地址
            industryCode: data.industryCode, // 所在行业
            businessLicenseUrl: data.businessLicenseUrl, // 营业执照url
            businessLicenseId: data.businessLicenseId // 营业执照id
          }
          this.feeForm = {
            contact: data.contact, // 企业联系人
            contactNumber: data.contactNumber // 联系人电话
          }
        }
      ).catch(
        error => {
          this.$message.error(error.response.data.msg)
        }
      )
    }
  },
  methods: {
    clearAdd() {
      this.$refs.addForm.resetFields()
    },
    async getIndustryList() {
      const res = await getIndustryListAPI()
      this.industryList = res.data
    },
    async uploadRequest(data) {
      const file = data.file

      // 处理formData类型参数
      const formData = new FormData()
      // formData.get('file')
      // 企业营业执照 businessLicense 租赁合同附件 contract
      formData.append('file', file)
      formData.append('type', 'businessLicense')
      const res = await uploadAPI(formData)

      // 赋值表单数据
      this.addForm.businessLicenseId = res.data.id
      this.addForm.businessLicenseUrl = res.data.url
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeUpload(file) {
      // console.log(file)
      const sizeOK = file.size / 1024 / 1024 < 5
      if (!sizeOK) {
        this.$message.error('上传图片大小不能超过 5 MB! ')
      }
      return sizeOK
    },
    confirmAdd() {
      const newForm = {
        ...this.addForm,
        ...this.feeForm
      }
      if (this.$route.query.id) {
        newForm.id = this.$route.query.id
        updateEnterpriseAPI(newForm).then(
          () => {
            this.$message.success('编辑成功')
            this.clearAdd()
            this.$router.back()
          }
        ).catch(
          error => {
            this.$message.error(error.response.data.msg)
          }
        )
      } else {
        createEnterpriseAPI(newForm).then(
          () => {
            this.$message.success('添加成功')
            this.clearAdd()
            this.$router.back()
          }
        ).catch(
          error => {
            this.$message.error(error.response.data.msg)
          }
        )
      }
    }
  }
}
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
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
        padding-left:20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
          }
        }
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
