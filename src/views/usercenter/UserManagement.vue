<!-- 用户管理 -->
<template>
    <div class="user-management">
      <div class="page-header">
        <h2>用户管理</h2>
        <el-button type="primary" @click="handleAddUser">
          <el-icon><Plus /></el-icon>
          添加用户
        </el-button>
      </div>
      
      <div class="filter-container">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="用户名">
            <el-input v-model="filterForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="正常" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="table-container">
        <el-table :data="userList" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="real_name" label="真实姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="role" label="用户类型" width="120">
            <template #default="scope">
              <el-tag :type="getUserRoleType(scope.row.role).type">
                {{ getUserRoleType(scope.row.role).text }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        </div>
      </div>
      
      <!-- 添加/编辑用户对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="500px"
        @close="handleDialogClose"
      >
        <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="!isEdit">
            <el-input v-model="userForm.password" type="password" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="real_name">
            <el-input v-model="userForm.real_name" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userForm.phone" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="userForm.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户类型" prop="role">
          <el-select :model-value="userForm.role" @change="userForm.role = $event">
            <el-option label="普通用户" :value="3" />
            <el-option label="咨询师" :value="1" />
            <el-option label="管理员" :value="2" />
          </el-select>
        </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="userForm.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import { getUserList, addUser, updateUser, deleteUser } from '@/api/user'
  
  const userList = ref([])
  const dialogVisible = ref(false)
  const dialogTitle = ref('添加用户')
  const isEdit = ref(false)
  const userFormRef = ref(null)
  
  const filterForm = reactive({
    username: '',
    status: ''
  })
  
  const userForm = reactive({
    id: null,
    username: '',
    password: '',
    real_name: '',
    email: '',
    phone: '',
    gender: 'male',
    role: 3,
    status: 1
  })
  
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })
  
  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
    ],
    real_name: [
      { required: true, message: '请输入真实姓名', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ]
  }
  
  // 获取用户类型文本
const getUserRoleType = (role) => {
  const roleMap = {
    0: { text: '学生', type: 'primary' },
    1: { text: '咨询师', type: 'success' },
    2: { text: '管理员', type: 'danger' },
    3: { text: '普通用户', type: 'info' }
  }
  return roleMap[role] || { text: '未知', type: 'info' }
}
  
  
  // 获取用户列表
  const fetchUserList = async () => {
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...filterForm
      }
      const response = await getUserList(params)
      if (response.code === 200) {
        userList.value = response.data.data
        pagination.total = response.data.total
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      ElMessage.error('获取用户列表失败')
    }
  }
  
  // 添加用户
  const handleAddUser = () => {
    dialogTitle.value = '添加用户'
    isEdit.value = false
    resetForm()
    dialogVisible.value = true
  }
  
  // 编辑用户
  const handleEdit = (row) => {
    dialogTitle.value = '编辑用户'
    isEdit.value = true
    Object.assign(userForm, row)
    dialogVisible.value = true
  }
  
  // 删除用户
  const handleDelete = (row) => {
    ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      try {
        const response = await deleteUser(row.id)
        if (response.code === 200) {
          ElMessage.success('删除成功')
          fetchUserList()
        }
      } catch (error) {
        console.error('删除用户失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }
  
  // 提交表单
  const handleSubmit = async () => {
    if (!userFormRef.value) return
    
    try {
      await userFormRef.value.validate()
      
      if (isEdit.value) {
        const response = await updateUser(userForm)
        if (response.code === 200) {
          ElMessage.success('更新成功')
          dialogVisible.value = false
          fetchUserList()
        }
      } else {
        const response = await addUser(userForm)
        if (response.code === 200) {
          ElMessage.success('添加成功')
          dialogVisible.value = false
          fetchUserList()
        }
      }
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('操作失败')
    }
  }
  
  // 重置表单
  const resetForm = () => {
    Object.assign(userForm, {
      id: null,
      username: '',
      password: '',
      real_name: '',
      email: '',
      phone: '',
      gender: 'male',
      role: 3,
      status: 1
    })
  }
  
  // 关闭对话框
  const handleDialogClose = () => {
    dialogVisible.value = false
  }
  
  // 筛选
  const handleFilter = () => {
    pagination.page = 1
    fetchUserList()
  }
  
  // 重置筛选
  const handleReset = () => {
    Object.assign(filterForm, {
      username: '',
      status: ''
    })
    pagination.page = 1
    fetchUserList()
  }
  
  // 分页大小改变
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    fetchUserList()
  }
  
  // 当前页改变
  const handleCurrentChange = (page) => {
    pagination.page = page
    fetchUserList()
  }
  
  onMounted(() => {
    fetchUserList()
  })
  </script>
  
  <style lang="scss" scoped>
  .user-management {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: calc(100vh - 60px);
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h2 {
        margin: 0;
        color: #303133;
      }
    }
    
    .filter-container {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    
    .table-container {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      
      .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  </style>