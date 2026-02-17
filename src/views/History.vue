<template>
    <div class="page-container">
      <app-header />
      
      <div class="main-content">
        <app-sidebar />
        
        <div class="content-area">
          <div class="page-header card-container">
            <h1>历史记录</h1>
            <p>查看您之前的对话记录和心理健康状态</p>
          </div>
          
          <div class="filter-section card-container">
            <el-form :inline="true" :model="filterForm" class="filter-form">
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="filterForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="fetchSessions">查询</el-button>
                <el-button @click="resetFilter">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <div class="sessions-section card-container">
            <div class="section-header">
              <h2>对话会话</h2>
              <div class="session-count">共 {{ total }} 个会话</div>
            </div>
            
            <div v-if="loading" class="loading-container">
              <el-skeleton :rows="5" animated />
            </div>
            
            <div v-else-if="sessions.length === 0" class="empty-state">
              <el-empty description="暂无对话记录" />
            </div>
            
            <div v-else class="session-list">
              <div
                v-for="session in sessions"
                :key="session.id"
                class="session-item"
                @click="viewSession(session)"
              >
                <div class="session-info">
                  <h3>{{ session.title }}</h3>
                  <p class="session-date">{{ formatDate(session.createdAt) }}</p>
                  <p class="session-preview">{{ session.lastMessage || '暂无消息预览' }}</p>
                </div>
                
                <div class="session-stats">
                  <div class="stat-item">
                    <span class="label">消息数:</span>
                    <span class="value">{{ session.messageCount || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">风险等级:</span>
                    <span :class="['value', getRiskClass(session.riskLevel)]">
                      {{ getRiskLevelText(session.riskLevel) }}
                    </span>
                  </div>
                </div>
                
                <div class="session-actions">
                  <el-button size="small" @click.stop="continueSession(session)">
                    继续对话
                  </el-button>
                  <el-button size="small" type="danger" @click.stop="deleteSession(session)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
            
            <div v-if="total > 0" class="pagination-container">
                <el-pagination
                    :current-page="pagination.page"
                    :page-size="pagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getSessionList } from '@/api/chat'
  import { formatDate } from '@/utils/date'
  import { useAuth } from '@/composables/useAuth'
  import AppHeader from '@/components/common/Header.vue'
  import AppSidebar from '@/components/common/Sidebar.vue'
  
  const router = useRouter()
  const { requireAuth } = useAuth()
  
  // 检查认证状态
  if (!requireAuth()) {
    // 如果未认证，将会重定向到登录页面
  }
  
  const loading = ref(false)
  const sessions = ref([])
  const total = ref(0)
  
  const filterForm = reactive({
    dateRange: []
  })
  
  const pagination = reactive({
    page: 1,
    pageSize: 20
  })
  
  // 获取风险等级文本
  const getRiskLevelText = (level) => {
    const levelMap = {
      'LOW': '低风险',
      'MEDIUM': '中风险',
      'HIGH': '高风险',
      'CRITICAL': '极高风险'
    }
    return levelMap[level] || '未知'
  }
  
  // 获取风险等级样式类
  const getRiskClass = (level) => {
    const classMap = {
      'LOW': 'risk-low',
      'MEDIUM': 'risk-medium',
      'HIGH': 'risk-high',
      'CRITICAL': 'risk-critical'
    }
    return classMap[level] || ''
  }
  
  // 获取会话列表
  const fetchSessions = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize
      }
      
      if (filterForm.dateRange && filterForm.dateRange.length === 2) {
        params.startDate = filterForm.dateRange[0]
        params.endDate = filterForm.dateRange[1]
      }
      
      const response = await getSessionList(params)
      
      if (response.code === 200) {
        sessions.value = response.data.list || []
        total.value = response.data.total || 0
      } else {
        ElMessage.error(response.message || '获取会话列表失败')
      }
    } catch (error) {
      ElMessage.error(error.message || '获取会话列表失败')
    } finally {
      loading.value = false
    }
  }
  
  // 重置筛选条件
  const resetFilter = () => {
    filterForm.dateRange = []
    pagination.page = 1
    fetchSessions()
  }
  
  // 查看会话详情
  const viewSession = (session) => {
    router.push({ path: '/chat', query: { sessionId: session.id } })
  }
  
  // 继续会话
  const continueSession = (session) => {
    router.push({ path: '/chat', query: { sessionId: session.id } })
  }
  
  // 删除会话
  const deleteSession = (session) => {
    ElMessageBox.confirm(
      `确定要删除会话 "${session.title}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 这里应该调用删除会话的API
      ElMessage.success('会话删除成功')
      fetchSessions()
    }).catch(() => {
      // 用户取消操作
    })
  }
  
  // 分页大小变化
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    pagination.page = 1
    fetchSessions()
  }
  
  // 当前页变化
  const handleCurrentChange = (page) => {
    pagination.page = page
    fetchSessions()
  }
  
  onMounted(() => {
    fetchSessions()
  })
  </script>
  
  <style scoped lang="scss">
  .content-area {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .page-header {
    margin-bottom: 20px;
    
    h1 {
      font-size: 24px;
      color: var(--text-color);
      margin-bottom: 10px;
    }
    
    p {
      font-size: 16px;
      color: var(--text-regular);
    }
  }
  
  .filter-section {
    margin-bottom: 20px;
    
    .filter-form {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
  }
  
  .sessions-section {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h2 {
        font-size: 20px;
        color: var(--text-color);
      }
      
      .session-count {
        font-size: 14px;
        color: var(--text-secondary);
      }
    }
    
    .session-list {
      .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        margin-bottom: 12px;
        background-color: var(--secondary-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          filter: brightness(0.95);
        }
        
        .session-info {
          flex: 1;
          
          h3 {
            font-size: 16px;
            color: var(--text-color);
            margin-bottom: 5px;
          }
          
          .session-date {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 5px;
          }
          
          .session-preview {
            font-size: 14px;
            color: var(--text-regular);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 300px;
          }
        }
        
        .session-stats {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-right: 20px;
          
          .stat-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            
            .label {
              color: var(--text-secondary);
              margin-right: 5px;
            }
            
            .value {
              font-weight: 500;
              
              &.risk-low {
                color: var(--success);
              }
              
              &.risk-medium {
                color: var(--warning);
              }
              
              &.risk-high, &.risk-critical {
                color: var(--danger);
              }
            }
          }
        }
        
        .session-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
    
    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
  </style>