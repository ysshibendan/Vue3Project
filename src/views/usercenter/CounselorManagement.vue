<!-- 咨询师管理 -->
<template>
    <div class="counselor-management">
      <div class="page-header">
        <h2>咨询师管理</h2>
        <el-button type="primary" @click="handleAddCounselor">
          <el-icon><Plus /></el-icon>
          添加咨询师
        </el-button>
      </div>
      
      <div class="filter-container">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="专业领域">
            <el-input v-model="filterForm.specialty" placeholder="请输入专业领域" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="可用" :value="1" />
              <el-option label="不可用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否可预约">
            <el-select v-model="filterForm.is_available" placeholder="请选择" clearable>
              <el-option label="全部" value="" />
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="table-container">
        <el-table :data="counselorList" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="user_info.real_name" label="姓名" />
          <el-table-column prop="specialty" label="专业领域" />
          <el-table-column prop="work_experience" label="工作经验(年)" width="120" />
          <el-table-column prop="introduction" label="简介" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '可用' : '不可用' }}
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
      
      <!-- 添加/编辑咨询师对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        @close="handleDialogClose"
      >
        <el-form :model="counselorForm" :rules="rules" ref="counselorFormRef" label-width="100px">
          <el-form-item label="用户ID" prop="user_id">
            <el-input v-model="counselorForm.user_id" />
          </el-form-item>
          <el-form-item label="专业领域" prop="specialty">
            <el-input v-model="counselorForm.specialty" />
          </el-form-item>
          <el-form-item label="工作经验" prop="work_experience">
            <el-input-number v-model="counselorForm.work_experience" :min="0" />
          </el-form-item>
          <el-form-item label="简介" prop="introduction">
            <el-input v-model="counselorForm.introduction" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="counselorForm.status">
              <el-radio :label="1">可用</el-radio>
              <el-radio :label="0">不可用</el-radio>
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
  import { getCounselorList, addCounselor, updateCounselor, deleteCounselor } from '@/api/counselor'
  
  const counselorList = ref([])
  const dialogVisible = ref(false)
  const dialogTitle = ref('添加咨询师')
  const isEdit = ref(false)
  const counselorFormRef = ref(null)
  
  const filterForm = reactive({
    specialty: '',
    status: '',
    is_available: ''
  })
  
  const counselorForm = reactive({
    id: null,
    user_id: null,
    specialty: '',
    work_experience: 0,
    introduction: '',
    status: 1
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
    specialty: [
      { required: true, message: '请输入专业领域', trigger: 'blur' }
    ],
    work_experience: [
      { required: true, message: '请输入工作经验', trigger: 'blur' }
    ],
    introduction: [
      { required: true, message: '请输入简介', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ]
  }
  
  // 获取咨询师列表
  const fetchCounselorList = async () => {
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...filterForm
      }
      const response = await getCounselorList(params)
      if (response.code === 200) {
        counselorList.value = response.data.data
        pagination.total = response.data.total
      }
    } catch (error) {
      console.error('获取咨询师列表失败:', error)
      ElMessage.error('获取咨询师列表失败')
    }
  }
  
  // 添加咨询师
  const handleAddCounselor = () => {
    dialogTitle.value = '添加咨询师'
    isEdit.value = false
    resetForm()
    dialogVisible.value = true
  }
  
  // 编辑咨询师
  const handleEdit = (row) => {
    dialogTitle.value = '编辑咨询师'
    isEdit.value = true
    Object.assign(counselorForm, row)
    dialogVisible.value = true
  }
  
  // 删除咨询师
  const handleDelete = (row) => {
    ElMessageBox.confirm(
      `确定要删除咨询师 "${row.user_info.real_name}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      try {
        const response = await deleteCounselor(row.id)
        if (response.code === 200) {
          ElMessage.success('删除成功')
          fetchCounselorList()
        }
      } catch (error) {
        console.error('删除咨询师失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }
  
  // 提交表单
  const handleSubmit = async () => {
    if (!counselorFormRef.value) return
    
    try {
      await counselorFormRef.value.validate()
      
      if (isEdit.value) {
        // 咨询师角色为1
        const counselorData = { ...counselorForm, role: 1 }
        const response = await updateCounselor(counselorData)
        if (response.code === 200) {
          ElMessage.success('更新成功')
          dialogVisible.value = false
          fetchCounselorList()
        }
      } else {
        // 咨询师角色为1
        const counselorData = { ...counselorForm, role: 1 }
        const response = await addCounselor(counselorData)
        if (response.code === 200) {
          ElMessage.success('添加成功')
          dialogVisible.value = false
          fetchCounselorList()
        }
      }
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('操作失败')
    }
  }
  
  // 重置表单
  const resetForm = () => {
    Object.assign(counselorForm, {
      id: null,
      user_id: null,
      specialty: '',
      work_experience: 0,
      introduction: '',
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
    fetchCounselorList()
  }
  
  // 重置筛选
  const handleReset = () => {
    Object.assign(filterForm, {
      specialty: '',
      status: '',
      is_available: ''
    })
    pagination.page = 1
    fetchCounselorList()
  }
  
  // 分页大小改变
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    fetchCounselorList()
  }
  
  // 当前页改变
  const handleCurrentChange = (page) => {
    pagination.page = page
    fetchCounselorList()
  }
  
  onMounted(() => {
    fetchCounselorList()
  })
  </script>
  
  <style lang="scss" scoped>
  .counselor-management {
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