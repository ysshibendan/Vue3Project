<!-- 学生管理 -->
<template>
    <div class="student-management">
      <div class="page-header">
        <h2>学生管理</h2>
        <el-button type="primary" @click="handleAddStudent">
          <el-icon><Plus /></el-icon>
          添加学生
        </el-button>
      </div>
      
      <div class="filter-container">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="学校">
            <el-input v-model="filterForm.school" placeholder="请输入学校" clearable />
          </el-form-item>
          <el-form-item label="专业">
            <el-input v-model="filterForm.major" placeholder="请输入专业" clearable />
          </el-form-item>
          <el-form-item label="心理状态">
            <el-select v-model="filterForm.psychological_status" placeholder="请选择状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="正常" value="正常" />
              <el-option label="需要关注" value="需要关注" />
              <el-option label="严重" value="严重" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="table-container">
        <el-table :data="studentList" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="school" label="学校" />
          <el-table-column prop="major" label="专业" />
          <el-table-column prop="grade" label="年级" />
          <el-table-column prop="emergency_contact" label="紧急联系人" />
          <el-table-column prop="emergency_phone" label="紧急联系电话" />
          <el-table-column prop="psychological_status" label="心理状态" width="120">
            <template #default="scope">
              <el-tag :type="getPsychologicalStatusType(scope.row.psychological_status).type">
                {{ scope.row.psychological_status }}
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
      
      <!-- 添加/编辑学生对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        @close="handleDialogClose"
      >
        <el-form :model="studentForm" :rules="rules" ref="studentFormRef" label-width="100px">
          <el-form-item label="用户ID" prop="user_id">
            <el-input v-model="studentForm.user_id" />
          </el-form-item>
          <el-form-item label="学号" prop="student_id">
            <el-input v-model="studentForm.student_id" />
          </el-form-item>
          <el-form-item label="学校" prop="school">
            <el-input v-model="studentForm.school" />
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-input v-model="studentForm.major" />
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input v-model="studentForm.grade" />
          </el-form-item>
          <el-form-item label="紧急联系人" prop="emergency_contact">
            <el-input v-model="studentForm.emergency_contact" />
          </el-form-item>
          <el-form-item label="紧急联系电话" prop="emergency_phone">
            <el-input v-model="studentForm.emergency_phone" />
          </el-form-item>
          <el-form-item label="心理状态" prop="psychological_status">
            <el-select v-model="studentForm.psychological_status">
              <el-option label="正常" value="正常" />
              <el-option label="需要关注" value="需要关注" />
              <el-option label="严重" value="严重" />
            </el-select>
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
  import { getStudentList, addStudent, updateStudent, deleteStudent } from '@/api/student'
  
  const studentList = ref([])
  const dialogVisible = ref(false)
  const dialogTitle = ref('添加学生')
  const isEdit = ref(false)
  const studentFormRef = ref(null)
  
  const filterForm = reactive({
    school: '',
    major: '',
    psychological_status: ''
  })
  
  const studentForm = reactive({
    id: null,
    user_id: null,
    student_id: '',
    school: '',
    major: '',
    grade: '',
    emergency_contact: '',
    emergency_phone: '',
    psychological_status: '正常'
  })
  
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })
  
  const rules = {
    user_id: [
      { required: true, message: '请输入用户ID', trigger: 'blur' }
    ],
    student_id: [
      { required: true, message: '请输入学号', trigger: 'blur' }
    ],
    school: [
      { required: true, message: '请输入学校', trigger: 'blur' }
    ],
    major: [
      { required: true, message: '请输入专业', trigger: 'blur' }
    ],
    grade: [
      { required: true, message: '请输入年级', trigger: 'blur' }
    ],
    emergency_contact: [
      { required: true, message: '请输入紧急联系人', trigger: 'blur' }
    ],
    emergency_phone: [
      { required: true, message: '请输入紧急联系电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    psychological_status: [
      { required: true, message: '请选择心理状态', trigger: 'change' }
    ]
  }
  
  // 获取心理状态类型
  const getPsychologicalStatusType = (status) => {
    const statusMap = {
      '正常': { type: 'success' },
      '需要关注': { type: 'warning' },
      '严重': { type: 'danger' }
    }
    return statusMap[status] || { type: 'info' }
  }
  
  // 获取学生列表
  const fetchStudentList = async () => {
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...filterForm
      }
      const response = await getStudentList(params)
      if (response.code === 200) {
        studentList.value = response.data.data
        pagination.total = response.data.total
      }
    } catch (error) {
      console.error('获取学生列表失败:', error)
      ElMessage.error('获取学生列表失败')
    }
  }
  
  // 添加学生
  const handleAddStudent = () => {
    dialogTitle.value = '添加学生'
    isEdit.value = false
    resetForm()
    dialogVisible.value = true
  }
  
  // 编辑学生
  const handleEdit = (row) => {
    dialogTitle.value = '编辑学生'
    isEdit.value = true
    Object.assign(studentForm, row)
    dialogVisible.value = true
  }
  
  // 删除学生
  const handleDelete = (row) => {
    ElMessageBox.confirm(
      `确定要删除学生 "${row.student_id}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      try {
        const response = await deleteStudent(row.id)
        if (response.code === 200) {
          ElMessage.success('删除成功')
          fetchStudentList()
        }
      } catch (error) {
        console.error('删除学生失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }
  
  // 提交表单
  const handleSubmit = async () => {
    if (!studentFormRef.value) return
    
    try {
      await studentFormRef.value.validate()
      
      if (isEdit.value) {
        const studentData = { ...studentForm, role: 0 }
        const response = await updateStudent(studentData)
        if (response.code === 200) {
          ElMessage.success('更新成功')
          dialogVisible.value = false
          fetchStudentList()
        }
      } else {
        const studentData = { ...studentForm, role: 0 }
        const response = await addStudent(studentData)
        if (response.code === 200) {
          ElMessage.success('添加成功')
          dialogVisible.value = false
          fetchStudentList()
        }
      }
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('操作失败')
    }
  }
  
  // 重置表单
  const resetForm = () => {
    Object.assign(studentForm, {
      id: null,
      user_id: null,
      student_id: '',
      school: '',
      major: '',
      grade: '',
      emergency_contact: '',
      emergency_phone: '',
      psychological_status: '正常'
    })
  }
  
  // 关闭对话框
  const handleDialogClose = () => {
    dialogVisible.value = false
  }
  
  // 筛选
  const handleFilter = () => {
    pagination.page = 1
    fetchStudentList()
  }
  
  // 重置筛选
  const handleReset = () => {
    Object.assign(filterForm, {
      school: '',
      major: '',
      psychological_status: ''
    })
    pagination.page = 1
    fetchStudentList()
  }
  
  // 分页大小改变
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    fetchStudentList()
  }
  
  // 当前页改变
  const handleCurrentChange = (page) => {
    pagination.page = page
    fetchStudentList()
  }
  
  onMounted(() => {
    fetchStudentList()
  })
  </script>
  
  <style lang="scss" scoped>
  .student-management {
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