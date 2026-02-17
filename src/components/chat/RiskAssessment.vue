<template>
    <div class="risk-assessment">
      <div class="risk-header">
        <h3>风险评估</h3>
        <el-tooltip content="刷新评估" placement="top">
          <el-button type="text" :icon="Refresh" @click="refreshAssessment" :loading="loading" />
        </el-tooltip>
      </div>
      
      <div v-if="!assessment || !assessment.level" class="no-assessment">
        <el-empty description="暂无风险评估" />
      </div>
      
      <div v-else>
        <div :class="['risk-card', assessment.level?.toLowerCase()]">
          <div class="risk-level">
            <span class="label">风险等级:</span>
            <span class="value">{{ getRiskLevelText(assessment.level) }}</span>
          </div>
          
          <div class="risk-score">
            <span class="label">风险分数:</span>
            <span class="value">{{ assessment.score?.toFixed(2) }}</span>
          </div>
          
          <div class="risk-description">
            <span class="label">评估描述:</span>
            <p>{{ assessment.description }}</p>
          </div>
          
          <div v-if="assessment.recommendation" class="risk-recommendation">
            <span class="label">建议:</span>
            <p>{{ assessment.recommendation }}</p>
          </div>
          
          <div v-if="assessment.factors && assessment.factors.length > 0" class="risk-factors">
            <span class="label">风险因素:</span>
            <div class="factors-list">
              <el-tag
                v-for="factor in assessment.factors"
                :key="factor.name"
                :type="getFactorTagType(factor.level)"
                size="small"
                class="factor-tag"
              >
                {{ factor.name }}: {{ factor.score?.toFixed(2) }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="risk-chart">
          <h4>风险趋势</h4>
          <div class="chart-placeholder">
            <el-empty description="图表功能正在开发中" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { Refresh } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  
  const props = defineProps({
    assessment: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['refresh'])
  
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
  
  // 获取风险因素标签类型
  const getFactorTagType = (level) => {
    const typeMap = {
      'LOW': 'success',
      'MEDIUM': 'warning',
      'HIGH': 'danger',
      'CRITICAL': 'danger'
    }
    return typeMap[level] || 'info'
  }
  
  // 刷新评估
  const refreshAssessment = () => {
    emit('refresh')
  }
  </script>
  
  <style scoped lang="scss">
  .risk-assessment {
    width: 300px;
    background-color: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: fit-content;
    
    .risk-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      h3 {
        font-size: 18px;
        color: var(--text-color);
        margin: 0;
      }
    }
    
    .no-assessment {
      padding: 20px 0;
    }
    
    .risk-card {
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      
      &.low {
        background-color: rgba(103, 194, 58, 0.1);
        border: 1px solid rgba(103, 194, 58, 0.3);
      }
      
      &.medium {
        background-color: rgba(230, 162, 60, 0.1);
        border: 1px solid rgba(230, 162, 60, 0.3);
      }
      
      &.high {
        background-color: rgba(245, 108, 108, 0.1);
        border: 1px solid rgba(245, 108, 108, 0.3);
      }
      
      &.critical {
        background-color: rgba(245, 108, 108, 0.2);
        border: 1px solid rgba(245, 108, 108, 0.5);
      }
      
      .risk-level, .risk-score {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        
        .label {
          font-weight: 500;
          color: var(--text-color);
        }
        
        .value {
          font-weight: bold;
        }
      }
      
      .risk-description, .risk-recommendation, .risk-factors {
        margin-bottom: 10px;
        
        .label {
          display: block;
          font-weight: 500;
          color: var(--text-color);
          margin-bottom: 5px;
        }
        
        p {
          margin: 0;
          line-height: 1.5;
          color: var(--text-regular);
        }
      }
      
      .factors-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .factor-tag {
          margin: 0;
        }
      }
    }
    
    .risk-chart {
      h4 {
        font-size: 16px;
        color: var(--text-color);
        margin: 0 0 15px;
      }
      
      .chart-placeholder {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--secondary-color);
        border-radius: 8px;
      }
    }
  }
  </style>