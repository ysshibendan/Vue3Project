<!-- 预约管理 -->
<template>
    <div class="appointment-management">
      <div class="page-header">
        <h2>预约管理</h2>
        <el-button type="primary" @click="handleAddAppointment">
          <el-icon><Plus /></el-icon>
          添加预约
        </el-button>
      </div>
      
      <div class="filter-container">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="咨询师">
            <el-select v-model="filterForm.counselor_id" placeholder="请选择咨询师" clearable filterable>
              <el-option 
                v-for="counselor in counselorList" 
                :key="counselor.id" 
                :label="counselor.user_info.real_name" 
                :value="counselor.id" 
              />
            </el-select>
          </el-form-item>
          <el-form-item label="预约日期">
            <el-date-picker
              v-model="filterForm.date"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="待确认" value="待确认" />
              <el-option label="已确认" value="已确认" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已取消" value="已取消" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="table-container">
        <el-table :data="appointmentList" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="student_info.real_name" label="学生姓名" />
          <el-table-column prop="counselor_info.user_info.real_name" label="咨询师姓名" />
          <el-table-column prop="appointment_date" label="预约日期" width="120" />
          <el-table-column prop="appointment_time" label="预约时间" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getAppointmentStatusType(scope.row.status).type">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleView(scope.row)">查看</el-button>
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
      
      <!-- 预约详情对话框 -->
      <el-dialog
        v-model="detailDialogVisible"
        title="预约详情"
        width="600px"
      >
        <div class="appointment-detail" v-if="currentAppointment">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="学生姓名">{{ currentAppointment.student_info.real_name }}</el-descriptions-item>
            <el-descriptions-item label="咨询师姓名">{{ currentAppointment.counselor_info.user_info.real_name }}</el-descriptions-item>
            <el-descriptions-item label="预约日期">{{ currentAppointment.appointment_date }}</el-descriptions-item>
            <el-descriptions-item label="预约时间">{{ currentAppointment.appointment_time }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getAppointmentStatusType(currentAppointment.status).type">
                {{ currentAppointment.status }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ currentAppointment.created_at }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import { getAppointmentList, deleteAppointment } from '@/api/appointment'
  import { getCounselorList } from '@/api/counselor'
  
  const appointmentList = ref([])
  const counselorList = ref([])
  const detailDialogVisible = ref(false)
  const currentAppointment = ref(null)
  
  const filterForm = reactive({
    counselor_id: '',
    date: '',
    status: ''
  })
  
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })
  
  // 获取预约状态类型
  const getAppointmentStatusType = (status) => {
    const statusMap = {
      '待确认': { type: 'warning' },
      '已确认': { type: 'primary' },
      '已完成': { type: 'success' },
      '已取消': { type: 'danger' }
    }
    return statusMap[status] || { type: 'info' }
  }
  
  // 获取咨询师列表
  const fetchCounselorList = async () => {
    try {
      const response = await getCounselorList({ status: 1 }) // 只获取可用的咨询师
      if (response.code === 200) {
        counselorList.value = response.data.data
      }
    } catch (error) {
      console.error('获取咨询师列表失败:', error)
      ElMessage.error('获取咨询师列表失败')
    }
  }
  
  // 获取预约列表
  const fetchAppointmentList = async () => {
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        ...filterForm
      }
      const response = await getAppointmentList(params)
      if (response.code === 200) {
        appointmentList.value = response.data.data
        pagination.total = response.data.total
      }
    } catch (error) {
      console.error('获取预约列表失败:', error)
      ElMessage.error('获取预约列表失败')
    }
  }
  
  // 添加预约
  const handleAddAppointment = () => {
    // 这里应该跳转到预约页面
    ElMessage.info('请跳转到预约页面进行预约')
  }
  
  // 查看预约详情
  const handleView = (row) => {
    currentAppointment.value = row
    detailDialogVisible.value = true
  }
  
  // 删除预约
  const handleDelete = (row) => {
    ElMessageBox.confirm(
      `确定要删除预约吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      try {
        const response = await deleteAppointment(row.id)
        if (response.code === 200) {
          ElMessage.success('删除成功')
          fetchAppointmentList()
        }
      } catch (error) {
        console.error('删除预约失败:', error)
        ElMessage.error('删除失败')
      }
    })
  }
  
  // 筛选
  const handleFilter = () => {
    pagination.page = 1
    fetchAppointmentList()
  }
  
  // 重置筛选
  const handleReset = () => {
    Object.assign(filterForm, {
      counselor_id: '',
      date: '',
      status: ''
    })
    pagination.page = 1
    fetchAppointmentList()
  }
  
  // 分页大小改变
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    fetchAppointmentList()
  }
  
  // 当前页改变
  const handleCurrentChange = (page) => {
    pagination.page = page
    fetchAppointmentList()
  }
  
  onMounted(() => {
    fetchCounselorList()
    fetchAppointmentList()
  })
  </script>
  
  <style lang="scss" scoped>
  .appointment-management {
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
    
    .appointment-detail {
      .el-descriptions {
        margin: 0;
      }
    }
  }
  </style>