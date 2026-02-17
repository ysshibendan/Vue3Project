<template>
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>心理健康咨询平台致力于提供专业、便捷的心理健康服务，帮助用户解决心理困扰，提升生活质量。</p>
        </div>
        
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul class="footer-links">
            <li><a href="#">隐私政策</a></li>
            <li><a href="#">使用条款</a></li>
            <li><a href="#">常见问题</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>联系方式</h4>
          <p>邮箱：support@mentalhealth.com</p>
          <p>电话：400-123-4567</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} 心理健康咨询平台. 保留所有权利.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const currentYear = computed(() => new Date().getFullYear())
  </script>
  
  <style scoped lang="scss">
  .app-footer {
    background-color: var(--background-color);
    border-top: 1px solid var(--border-light);
    padding: 30px 0 0;
    margin-top: auto;
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      
      .footer-section {
        flex: 1;
        min-width: 200px;
        margin-bottom: 30px;
        padding-right: 20px;
        
        h4 {
          font-size: 16px;
          color: var(--text-color);
          margin-bottom: 15px;
          position: relative;
          padding-bottom: 8px;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2px;
            background-color: var(--primary-color);
          }
        }
        
        p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 10px;
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          
          li {
            margin-bottom: 10px;
            
            a {
              font-size: 14px;
              color: var(--text-secondary);
              text-decoration: none;
              transition: color 0.3s;
              
              &:hover {
                color: var(--primary-color);
              }
            }
          }
        }
      }
    }
    
    .footer-bottom {
      text-align: center;
      padding: 20px;
      border-top: 1px solid var(--border-lighter);
      
      p {
        font-size: 14px;
        color: var(--text-secondary);
        margin: 0;
      }
    }
  }
  
  @media (max-width: 768px) {
    .app-footer {
      .footer-content {
        flex-direction: column;
        
        .footer-section {
          margin-bottom: 20px;
          padding-right: 0;
        }
      }
    }
  }
  </style>