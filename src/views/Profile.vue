<template>
    <div class="page-container">
      <app-header />
      
      <div class="main-content">
        <app-sidebar />
        
        <div class="content-area">
          <div class="profile-header card-container">
            <h1>个人资料</h1>
            <p>管理您的个人信息和账户设置</p>
          </div>
          
          <div class="profile-content">
            <!-- 基本信息 - 根据角色显示不同内容 -->
            <div class="profile-info card-container">
              <h2>基本信息</h2>
              
              <!-- 学生基本信息 -->
              <el-form
                v-if="userInfo && userInfo.role === 0"
                ref="profileFormRef"
                :model="studentForm"
                :rules="studentRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="头像" prop="avatar">
                  <div class="avatar-upload">
                    <img v-if="studentForm.avatar" :src="getAvatarUrl(studentForm.avatar)" class="avatar-preview" />                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :http-request="() => {}"
                      accept="image/*"
                    >
                      <template #trigger>
                        <el-button size="small" type="primary">选择头像</el-button>
                      </template>
                    </el-upload>
                  </div>
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
                

                
                <el-form-item>
                  <el-button type="primary" @click="updateStudentProfile" :loading="updating">
                    保存更改
                  </el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
              
              <!-- 学生预约信息 -->
              <div v-if="userInfo && userInfo.role === 0" class="student-appointment-container" style="margin-top: 30px;">
                <div class="student-appointment card-container">
                  <h2>我的预约</h2>
                  
                  <div class="appointment-list" v-loading="loadingStudentAppointments">
                    <div v-if="studentAppointments.length === 0" class="empty-state">
                      <el-empty description="暂无预约信息" />
                    </div>
                    
                    <div v-else class="appointment-table">
                      <table class="appointment-table-content">
                        <thead>
                          <tr>
                            <th style="width: 20%; text-align: center;">咨询师姓名</th>
                            <th style="width: 20%; text-align: center;">预约日期</th>
                            <th style="width: 20%; text-align: center;">预约时间</th>
                            <th style="width: 15%; text-align: center;">状态</th>
                            <th style="width: 25%; text-align: center;">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="appointment in studentAppointments" :key="appointment.id">
                            <td style="text-align: center;">{{ appointment.counselorName }}</td>
                            <td style="text-align: center;">{{ appointment.appointmentDate }}</td>
                            <td style="text-align: center;">{{ appointment.startTime }} - {{ appointment.endTime }}</td>
                            <td style="text-align: center;">
                              <el-tag :type="getAppointmentStatusType(appointment.status).type">
                                {{ appointment.statusText }}
                              </el-tag>
                            </td>
                            <td style="text-align: center;">
                              <el-button 
                                v-if="appointment.status === 1 && isTodayOrAfter(appointment.appointmentDate)" 
                                type="primary" 
                                size="small" 
                                @click="startConsultation(appointment.id)"
                              >
                                咨询
                              </el-button>
                              <el-button 
                                v-if="isTodayOrAfter(appointment.appointmentDate)" 
                                type="danger" 
                                size="small" 
                                @click="cancelAppointment(appointment.id)"
                              >
                                取消
                              </el-button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="pagination-container">
                    <el-pagination
                    :current-page="appointmentPagination.page"
                    :page-size="appointmentPagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="appointmentPagination.total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleAppointmentSizeChange"
                    @current-change="handleAppointmentCurrentChange"
                    />
                  </div>
                </div>
              </div>
              
              <!-- 学生问卷结果 -->
              <div v-if="userInfo && userInfo.role === 0" class="student-questionnaire-container" style="margin-top: 30px;">
                <div class="student-questionnaire card-container">
                  <h2>我的问卷结果</h2>
                  
                  <div class="questionnaire-list" v-loading="loadingQuestionnaireResults">
                    <div v-if="questionnaireResults.length === 0" class="empty-state">
                      <el-empty description="暂无问卷结果" />
                    </div>
                    
                    <div v-else class="questionnaire-table">
                      <table class="questionnaire-table-content">
                        <thead>
                          <tr>
                            <th style="width: 25%; text-align: center;">问卷名称</th>
                            <th style="width: 15%; text-align: center;">总分</th>
                            <th style="width: 15%; text-align: center;">风险等级</th>
                            <th style="width: 25%; text-align: center;">测试时间</th>
                            <th style="width: 20%; text-align: center;">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="result in questionnaireResults" :key="result.id">
                            <td style="text-align: center;">{{ result.templateTitle }}</td>
                            <td style="text-align: center;">{{ result.totalScore }}</td>
                            <td style="text-align: center;">
                              <el-tag :type="getRiskLevelType(result.riskLevel)" size="small">
                                {{ getRiskLevelText(result.riskLevel) }}
                              </el-tag>
                            </td>
                            <td style="text-align: center;">{{ formatDate(result.createdAt) }}</td>
                            <td style="text-align: center;">
                              <el-button 
                                type="primary" 
                                size="small" 
                                @click="viewQuestionnaireDetail(result.id)"
                              >
                                查看详情
                              </el-button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="pagination-container">
                    <el-pagination
                    :current-page="questionnairePagination.page"
                    :page-size="questionnairePagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="questionnairePagination.total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleQuestionnaireSizeChange"
                    @current-change="handleQuestionnaireCurrentChange"
                    />
                  </div>
                </div>
              </div>
              
              <!-- 咨询师基本信息 -->
              <el-form
                v-else-if="userInfo && userInfo.role === 1"
                ref="profileFormRef"
                :model="counselorForm"
                :rules="counselorRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="头像" prop="avatar">
                  <div class="avatar-upload">
                    <img v-if="counselorForm.avatar" :src="getAvatarUrl(counselorForm.avatar)" class="avatar-preview" />
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :http-request="uploadAvatar"
                      accept="image/*"
                    >
                      <template #trigger>
                        <el-button size="small" type="primary">选择头像</el-button>
                      </template>
                    </el-upload>
                  </div>
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
                    <el-radio :value="1">可用</el-radio>
                    <el-radio :value="0">不可用</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="updateCounselorProfile" :loading="updating">
                    保存更改
                  </el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
              
              <!-- 管理员基本信息 -->
              <el-form
                v-else-if="userInfo && userInfo.role === 2"
                ref="profileFormRef"
                :model="adminForm"
                :rules="adminRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="adminForm.username" disabled />
                </el-form-item>
                
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="adminForm.email" />
                </el-form-item>
                
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="adminForm.phone" />
                </el-form-item>
                
                <el-form-item label="真实姓名" prop="real_name">
                  <el-input v-model="adminForm.real_name" />
                </el-form-item>
                
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="studentForm.gender">
                    <el-radio value="male">男</el-radio>
                    <el-radio value="female">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="年龄" prop="age">
                  <el-input-number v-model="adminForm.age" :min="18" :max="100" />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="updateAdminProfile" :loading="updating">
                    保存更改
                  </el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
              
              <!-- 如果没有用户信息，显示加载状态 -->
              <div v-if="!userInfo" style="text-align: center; padding: 20px;">
                <el-icon class="is-loading"><loading /></el-icon>
                <p style="margin-top: 10px;">正在加载用户信息...</p>
              </div>
            </div>
            
            <div class="password-section card-container">
              <h2>修改密码</h2>
              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-width="100px"
                class="password-form"
              >
                <el-form-item label="当前密码" prop="currentPassword">
                  <el-input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="updatePassword" :loading="updatingPassword">
                    修改密码
                  </el-button>
                  <el-button @click="resetPasswordForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
          </div>
          
          <!-- 独立容器：咨询师预约时间设置 -->
          <div v-if="userInfo && userInfo.role === 1" class="appointment-settings-container">
            <div class="appointment-settings card-container">
              <h2>预约时间设置</h2>
              
              <!-- 预约时间设置布局 -->
              <div class="appointment-layout" style="display: flex !important; flex-direction: row !important; align-items: flex-start !important; gap: 40px !important;">
                <!-- 一周时间段展示 -->
                <div class="week-schedule" style="width: 1260px; flex-shrink: 0;">
                  <h3>预约时间段表</h3>
                  <div class="schedule-table" style="width: 1100px !important; height: 720px !important; border-collapse: separate; border: 2px solid var(--border-color); border-radius: 8px; overflow: visible; display: block !important;">
                    <table style="width: 1100px !important; height: 720px !important; border-collapse: separate; display: table !important; table-layout: fixed !important; border-spacing: 0;">
                      <thead style="display: table-header-group !important;">
                        <tr style="display: table-row !important;">
                          <th style="width: 120px !important; height: 45px !important; background-color: #f5f5f5; color: #333; font-size: 14px; font-weight: 600; text-align: center; vertical-align: middle; border: 1px solid #ddd; display: table-cell !important;"></th>
                          <th v-for="(day, index) in weekDays" :key="index" style="width: 120px !important; height: 45px !important; background-color: #f5f5f5 !important; color: #333 !important; font-weight: bold !important; font-size: 16px !important; text-align: center !important; vertical-align: middle !important; border: 1px solid #ddd; display: table-cell !important; padding: 5px !important;">{{ day.name }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(time, timeIndex) in timeSlots" :key="timeIndex">
                          <td :style="`width: 120px !important; height: 45px !important; background-color: #f5f5f5; color: #333; font-size: 14px; font-weight: 600; text-align: center; position: relative; vertical-align: middle;`">
                            <span v-if="timeIndex % 2 === 0" style="font-size: 20px; font-weight: bold;">
                              {{ Math.floor(timeIndex / 2) + 1 }}
                            </span>
                            <div v-else style="position: absolute; top: 5px; left: 0; right: 0; font-size: 14px; display: flex; flex-direction: column; align-items: center; padding: 0;">
                              <span>{{ timeAxisLabels[Math.floor(timeIndex / 2)].split('-')[0] }}</span>
                              <span>{{ timeAxisLabels[Math.floor(timeIndex / 2)].split('-')[1] }}</span>
                            </div>
                          </td>
                          <td 
                            v-for="(day, dayIndex) in weekDays" 
                            :key="`${timeIndex}-${dayIndex}`" 
                            class="slot-cell"
                            @click="toggleTimeSlot(day.dayOfWeek, time, getNextTime(timeIndex))"
                            @dblclick="handleDoubleClick(day.dayOfWeek, time, getNextTime(timeIndex))"
                            :class="{ 'selected': isTimeSlotSelected(day.dayOfWeek, time, getNextTime(timeIndex)) }"
                            :style="getSlotStyle(day, time, getNextTime(timeIndex), timeIndex)"
                          >
                            <div v-if="hasSlot(day, time, getNextTime(timeIndex))" class="slot-indicator" style="font-size: 20px !important; font-weight: bold !important; color: white !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important;">
                              {{ getSlotInfo(day, time, getNextTime(timeIndex), timeIndex) }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <!-- 预约时间选择 -->
                <div class="appointment-selection" style="flex-shrink: 0 !important; width: 350px !important; margin-top: 40px;">
                  <div class="selection-header">
                    <h3>选择预约时间</h3>
                  </div>
                  <div class="selection-content" style="display: flex !important; flex-direction: column !important; gap: 25px !important;">
                    <div class="form-item">
                      <label>选择星期：</label>
                      <el-select v-model="selectedDay" placeholder="请选择星期" @change="onDayChange" style="width: 100% !important;">
                        <el-option 
                          v-for="day in weekDays" 
                          :key="day.dayOfWeek" 
                          :label="day.name" 
                          :value="day.dayOfWeek"
                        />
                      </el-select>
                    </div>
                    <div class="form-item">
                      <label>开始时间：</label>
                      <el-select v-model="selectedStartTime" placeholder="请选择开始时间" style="width: 100% !important;">
                        <el-option 
                          v-for="time in timeOptions" 
                          :key="time.value" 
                          :label="time.label" 
                          :value="time.value"
                        />
                      </el-select>
                    </div>
                    <div class="form-item">
                      <label>结束时间：</label>
                      <el-select v-model="selectedEndTime" placeholder="请选择结束时间" style="width: 100% !important;">
                        <el-option 
                          v-for="time in timeOptions" 
                          :key="time.value" 
                          :label="time.label" 
                          :value="time.value"
                        />
                      </el-select>
                    </div>
                    <div class="form-item">
                      <label>最大预约数：</label>
                      <el-input-number v-model="maxAppointments" :min="1" :max="20" style="width: 100% !important;" />
                    </div>
                    <div class="form-actions" style="display: flex !important; gap: 15px !important; margin-top: 20px !important;">
                      <el-button type="primary" @click="addAppointmentTime" :loading="saving" style="flex: 1;">
                        添加预约时间
                      </el-button>
                      <el-button type="success" @click="saveAppointmentSettings" :loading="saving" style="flex: 1;">
                        保存设置
                      </el-button>
                      <el-button @click="resetAppointmentSettings" style="flex: 1;">重置</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 独立容器：咨询师预约管理 -->
          <div v-if="userInfo && userInfo.role === 1" class="appointment-management-container" style="margin-top: 120px;">
            <div class="appointment-management card-container">
              <h2>预约管理</h2>
              
              <div class="appointment-filters" style="margin-bottom: 10px; margin-left: 60px;">
                <el-form :inline="true" :model="appointmentFilter">
                  <el-form-item label="状态">
                    <el-select v-model="appointmentFilter.status" placeholder="请选择状态" clearable @change="loadAppointments">
                      <el-option label="全部" value="-1" />
                      <el-option label="待确认" value="0" />
                      <el-option label="已确认" value="1" />
                      <el-option label="已完成" value="2" />
                      <el-option label="已取消" value="3" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="日期范围">
                    <el-date-picker
                      v-model="appointmentFilter.dateRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      @change="loadAppointments"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="loadAppointments">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              
              <div class="appointment-list" v-loading="loadingAppointments">
                <div v-if="appointments.length === 0" class="empty-state">
                  <el-empty description="暂无预约信息" />
                </div>
                
                <div v-else class="appointment-table">
                  <table class="appointment-table-content">
                    <thead>
                      <tr>
                        <th style="width: 15%; text-align: center;">学生姓名</th>
                        <th style="width: 15%; text-align: center;">预约日期</th>
                        <th style="width: 15%; text-align: center;">预约时间</th>
                        <th style="width: 15%; text-align: center;">创建时间</th>
                        <th style="width: 10%; text-align: center;">状态</th>
                        <th style="width: 30%; text-align: center;">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="appointment in appointments" :key="appointment.id">
                        <td style="text-align: center;">{{ appointment.userName }}</td>
                        <td style="text-align: center;">{{ appointment.appointmentDate }}</td>
                        <td style="text-align: center;">{{ appointment.startTime }} - {{ appointment.endTime }}</td>
                        <td style="text-align: center;">{{ formatDate(appointment.createdAt) }}</td>
                        <td style="text-align: center;">
                          <el-tag :type="getAppointmentStatusType(appointment.status).type" size="small">
                            {{ getAppointmentStatusType(appointment.status).text }}
                          </el-tag>
                        </td>
                        <td style="text-align: center;">
                          <el-button 
                            v-if="appointment.status === 0" 
                            type="success" 
                            size="small" 
                            @click="updateAppointmentStatus(appointment.id, 1)"
                            :loading="updatingStatus === appointment.id"
                          >
                            接受
                          </el-button>
                          
                          <el-button 
                            v-if="appointment.status === 1" 
                            type="primary" 
                            size="small" 
                            @click="startConsultationDialog(appointment)"
                          >
                            前往
                          </el-button>
                          
                          <el-button 
                            v-if="appointment.status === 0 || appointment.status === 1" 
                            type="danger" 
                            size="small" 
                            @click="showCancelDialog(appointment)"
                          >
                            取消
                          </el-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="pagination-container" v-if="appointments.length > 0">
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
          </div>
          
          <!-- 独立容器：心理健康统计 -->
          <!-- <div class="mental-health-container">
            <div class="mental-health-stats card-container">
              <h2>心理健康统计</h2>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ mentalHealthStats.totalSessions }}</div>
                  <div class="stat-label">总对话次数</div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-value">{{ mentalHealthStats.avgRiskScore }}</div>
                  <div class="stat-label">平均风险分数</div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-value">{{ mentalHealthStats.currentStreak }}</div>
                  <div class="stat-label">连续咨询天数</div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-value">{{ mentalHealthStats.improvementRate }}%</div>
                  <div class="stat-label">改善率</div>
                </div>
              </div>
              
              <div class="chart-container">
                <h3>风险趋势图</h3>
                <div class="chart-placeholder">
                  <el-empty description="图表功能正在开发中" />
                </div>
              </div>
            </div>
          </div> -->
            
          </div>
          
          <!-- 弹窗式聊天/视频通话容器 -->
          <el-dialog 
      v-model="consultationDialog.visible" 
      :title="consultationDialog.title" 
      width="1200px" 
      :before-close="handleCloseConsultationDialog"
      :close-on-click-modal="false"
      class="consultation-dialog"
    >
      <!-- 切换按钮 -->
      <div class="consultation-tabs">
        <el-button 
          :type="consultationDialog.activeTab === 'chat' ? 'primary' : 'default'"
          @click="consultationDialog.activeTab = 'chat'"
          class="tab-button"
        >
          文字聊天
        </el-button>
        <el-button 
          :type="consultationDialog.activeTab === 'video' ? 'primary' : 'default'"
          @click="consultationDialog.activeTab = 'video'"
          class="tab-button"
        >
          视频聊天
        </el-button>
      </div>
      
      <!-- 文字聊天内容 -->
      <div v-if="consultationDialog.activeTab === 'chat'" class="chat-content">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="appointment-info" v-if="consultationDialog.appointment">
            <!-- 使用img标签替代el-avatar，确保图片正确显示 -->
            <div class="avatar-container">
              <img 
                :src="getUserAvatar()" 
                :alt="consultationDialog.appointment.userName"
                class="counselor-avatar-img"
                @error="handleAvatarError"
                ref="counselorAvatarImg"
              />
            </div>
            <div class="appointment-details">
              <div class="appointment-name">{{ consultationDialog.appointment.userName }}</div>
            </div>
          </div>
        </div>
        
        <!-- 聊天消息区域 -->
        <div class="chat-messages" ref="dialogMessagesContainer">
          <div
            v-for="message in consultationDialog.messages"
            :key="message.id"
            :class="['message-item', message.sender_id === userInfo?.id ? 'user' : 'student']"
          >
            <!-- 学生消息：左边头像，右边消息 -->
            <div v-if="message.sender_id !== userInfo?.id" class="message-row student-message">
              <div class="message-avatar">
                <!-- 使用img标签替代el-avatar，确保图片正确显示 -->
                <img 
                  :src="getUserAvatar()" 
                  :alt="consultationDialog.appointment?.userName || '学生'"
                  class="message-avatar-img"
                  @error="handleMessageAvatarError"
                  ref="messageAvatarImg"
                />
              </div>
              <div class="message-bubble">
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.sent_at) }}
                </div>
              </div>
            </div>
            
            <!-- 咨询师消息：右边消息，左边头像 -->
            <div v-else class="message-row counselor-message">
              <div class="message-bubble">
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.sent_at) }}
                </div>
              </div>
              <div class="message-avatar">
                <el-avatar :size="40" :src="userInfo?.avatar">
                  {{ userInfo?.username?.charAt(0) || 'C' }}
                </el-avatar>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 聊天输入框 -->
        <div class="chat-input" v-if="consultationDialog.sessionId">
          <div class="input-container">
            <el-input
              v-model="consultationDialog.inputMessage"
              type="textarea"
              :rows="3"
              placeholder="请输入消息..."
              @keydown.enter.prevent="sendDialogMessage"
              resize="none"
            />
            <el-button 
              type="primary" 
              @click="sendDialogMessage"
              :disabled="!consultationDialog.inputMessage.trim()"
              class="send-button"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 视频聊天内容 -->
      <div v-if="consultationDialog.activeTab === 'video'" class="video-content">
        <div class="video-container">
          <div class="video-local">
            <video ref="dialogLocalVideo" autoplay muted></video>
            <div class="video-info">我</div>
          </div>
          <div class="video-remote">
            <video ref="dialogRemoteVideo" autoplay></video>
            <div class="video-info">对方</div>
          </div>
          <div class="video-controls">
            <el-button 
              type="primary" 
              @click="toggleDialogVideoCall"
              :disabled="consultationDialog.videoCall.active"
            >
              {{ consultationDialog.videoCall.active ? '挂断' : '发起视频' }}
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import { useAuth } from '@/composables/useAuth'
import request from '@/utils/request'
import AppHeader from '@/components/common/Header.vue'
import AppSidebar from '@/components/common/Sidebar.vue'
import { getCounselorAppointments, getUserAppointments, updateAppointmentStatus, cancelAppointment } from '@/api/appointment'
import { getUserResults } from '@/api/questionnaire'
import { 
  startConsultation as startConsultationApi, 
  sendMessage as sendConsultationMessage, 
  getMessageHistory, 
  endConsultation as endConsultationApi,
  getActiveConsultation
} from '@/api/consultation'
  
  const authStore = useAuthStore()
const { requireAuth } = useAuth()
const router = useRouter()

// 获取用户信息
const userInfo = computed(() => authStore.userInfo)

// 检查认证状态
if (!requireAuth()) {
  // 如果未认证，将会重定向到登录页面
}
  
  const profileFormRef = ref()
  const passwordFormRef = ref()
  const updating = ref(false)
  const updatingPassword = ref(false)
  
  // 咨询弹窗相关引用
  const dialogMessagesContainer = ref(null)
  const dialogLocalVideo = ref(null)
  const dialogRemoteVideo = ref(null)
  const counselorAvatarImg = ref(null)
  const messageAvatarImg = ref(null)
  
  const profileForm = reactive({
    username: '',
    nickname: '',
    email: '',
    phone: '',
    gender: '',
    birthday: ''
  })
  
  const studentForm = reactive({
    id: '',
    user_id: '',
    student_id: '', // 确保是字符串类型
    school: '',
    major: '',
    grade: '',
    emergency_contact: '',
    emergency_phone: '',
    psychological_status: '正常',
    // user_info部分
    real_name: '',
    gender: '',
    age: 18,
    avatar: '',
    avatarBase64: '',
    avatarBytes: null,
    status: 1
  })
  
  // 咨询弹窗数据
  const consultationDialog = reactive({
    visible: false,
    title: '咨询对话',
    activeTab: 'chat', // 'chat' 或 'video'
    appointment: null,
    userInfo: null, // 学生详细信息
    sessionId: null,
    messages: [],
    inputMessage: '',
    websocket: null,
    videoCall: {
      active: false,
      localStream: null,
      remoteStream: null,
      peerConnection: null
    }
  })
  
  // 确保表单数据正确初始化
  onMounted(() => {
    fetchStudentProfile()
  })
  
  const counselorForm = reactive({
    id: '',
    user_id: '',
    specialty: '',
    work_experience: 0,
    introduction: '',
    status: 1,
    avatarBase64: '',
    avatarBytes: null
  })
  
  const adminForm = reactive({
    id: '',
    username: '',
    email: '',
    phone: '',
    real_name: '',
    gender: '',
    age: 18
  })
  
  // 预约时间设置相关数据
  const weekDays = ref([
    { name: '周一', dayOfWeek: 1, slots: [] },
    { name: '周二', dayOfWeek: 2, slots: [] },
    { name: '周三', dayOfWeek: 3, slots: [] },
    { name: '周四', dayOfWeek: 4, slots: [] },
    { name: '周五', dayOfWeek: 5, slots: [] },
    { name: '周六', dayOfWeek: 6, slots: [] },
    { name: '周日', dayOfWeek: 0, slots: [] }
  ])
  
  const selectedDay = ref('')
  const selectedStartTime = ref('')
  const selectedEndTime = ref('')
  const maxAppointments = ref(5)
  const saving = ref(false)
  
  const timeOptions = [
    { label: '07:00', value: '07:00' },
    { label: '08:00', value: '08:00' },
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '12:00', value: '12:00' },
    { label: '13:00', value: '13:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
    { label: '16:00', value: '16:00' },
    { label: '17:00', value: '17:00' },
    { label: '18:00', value: '18:00' },
    { label: '19:00', value: '19:00' },
    { label: '20:00', value: '20:00' },
    { label: '21:00', value: '21:00' },
    { label: '22:00', value: '22:00' },
    { label: '23:00', value: '23:00' }
  ]
  
  // 时间轴标签 - 保持原来的两小时格式用于显示
  const timeAxisLabels = ref([
    '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00', 
    '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
  ])
  
  // 实际时间格子 - 每小时一个格子
  const timeSlots = ref([
    '07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', 
    '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00',
    '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00',
    '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00'
  ])
  
  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const mentalHealthStats = ref({
    totalSessions: 0,
    avgRiskScore: 0,
    currentStreak: 0,
    improvementRate: 0
  })
  
  const studentRules = {
    student_id: [
      { required: true, message: '学号不能为空', trigger: 'blur' }
    ],
    school: [
      { max: 50, message: '学校名称长度不能超过50个字符', trigger: 'blur' }
    ],
    major: [
      { max: 50, message: '专业名称长度不能超过50个字符', trigger: 'blur' }
    ],
    grade: [
      { max: 20, message: '年级长度不能超过20个字符', trigger: 'blur' }
    ],
    emergency_contact: [
      { max: 20, message: '紧急联系人长度不能超过20个字符', trigger: 'blur' }
    ],
    emergency_phone: [
      { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
  }
  
  const counselorRules = {
    specialty: [
      { required: true, message: '专业领域不能为空', trigger: 'blur' },
      { max: 100, message: '专业领域长度不能超过100个字符', trigger: 'blur' }
    ],
    work_experience: [
      { required: true, message: '工作经验不能为空', trigger: 'blur' },
      { type: 'number', min: 0, message: '工作经验必须大于等于0', trigger: 'blur' }
    ],
    introduction: [
      { max: 500, message: '简介长度不能超过500个字符', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '状态不能为空', trigger: 'blur' }
    ]
  }
  
  const adminRules = {
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '手机号不能为空', trigger: 'blur' },
      { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    real_name: [
      { required: true, message: '真实姓名不能为空', trigger: 'blur' },
      { max: 20, message: '真实姓名长度不能超过20个字符', trigger: 'blur' }
    ],
    gender: [
      { required: true, message: '性别不能为空', trigger: 'blur' }
    ],
    age: [
      { required: true, message: '年龄不能为空', trigger: 'blur' },
      { type: 'number', min: 18, max: 100, message: '年龄必须在18到100之间', trigger: 'blur' }
    ]
  }
  
  const validateConfirmPassword = (rule, value, callback) => {
    if (value !== passwordForm.newPassword) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
  
  const passwordRules = {
    currentPassword: [
      { required: true, message: '请输入当前密码', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'blur' }
    ]
  }
  
  // 获取学生资料
  const fetchStudentProfile = async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      
      // 调用获取学生资料的API
      const data = await request({
        url: '/api/userinfo',
        method: 'GET',
        params: {
          token: token
        }
      })
      

      
      if (data && data.code === 200 && data.data) {
        // 设置用户信息
        if (data.data.userInfo) {
          studentForm.real_name = data.data.userInfo.realName || ''
          studentForm.gender = data.data.userInfo.gender || ''
          studentForm.age = data.data.userInfo.age || 18
          studentForm.avatar = data.data.userInfo.avatar || ''
          studentForm.status = data.data.userInfo.status || 1
        }
        
        // 设置学生信息
        if (data.data.studentInfo) {
          studentForm.id = data.data.studentInfo.id
          studentForm.user_id = data.data.studentInfo.userId
          studentForm.student_id = data.data.studentInfo.studentId ? data.data.studentInfo.studentId.toString() : ''
          studentForm.school = data.data.studentInfo.school || ''
          studentForm.major = data.data.studentInfo.major || ''
          studentForm.grade = data.data.studentInfo.grade || ''
          studentForm.emergency_contact = data.data.studentInfo.emergencyContact || ''
          studentForm.emergency_phone = data.data.studentInfo.emergencyPhone || ''
          studentForm.psychological_status = data.data.studentInfo.psychologicalStatus || '良好'
        }
        
        // 更新store中的用户信息
        if (data.data.userInfo) {
          authStore.setUserInfo(data.data.userInfo)
        }
      }
    } catch (error) {
      ElMessage.error(error.message || '获取学生资料失败')
    }
  }
  
  // 强制刷新方法
  const forceRefresh = async () => {
    // 强制更新视图
    await new Promise(resolve => setTimeout(resolve, 0))
    
    // 强制触发响应式更新
    await new Promise(resolve => {
      if (userInfo.value && userInfo.value.role === 0) {
        studentForm.id = studentForm.id
        studentForm.user_id = studentForm.user_id
        studentForm.student_id = studentForm.student_id
        studentForm.school = studentForm.school
        studentForm.major = studentForm.major
        studentForm.grade = studentForm.grade
        studentForm.emergency_contact = studentForm.emergency_contact
        studentForm.emergency_phone = studentForm.emergency_phone
        studentForm.psychological_status = studentForm.psychological_status
      } else if (userInfo.value && userInfo.value.role === 1) {
        counselorForm.id = counselorForm.id
        counselorForm.user_id = counselorForm.user_id
        counselorForm.specialty = counselorForm.specialty
        counselorForm.work_experience = counselorForm.work_experience
        counselorForm.introduction = counselorForm.introduction
        counselorForm.status = counselorForm.status
      } else if (userInfo.value && userInfo.value.role === 2) {
        adminForm.id = adminForm.id
        adminForm.username = adminForm.username
        adminForm.email = adminForm.email
        adminForm.phone = adminForm.phone
        adminForm.real_name = adminForm.real_name
        adminForm.gender = adminForm.gender
        adminForm.age = adminForm.age
      }
      resolve()
    })
  }
  // 翻页相关数据
const appointmentPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const questionnairePagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})
  // 获取咨询师资料
  const fetchCounselorProfile = async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      console.log('获取咨询师资料时使用的token:', token)
      
      // 调用获取咨询师资料的API
      const data = await request({
        url: '/api/counselor',
        method: 'GET',
        params: {
          token: token
        }
      })
      
      console.log('咨询师资料响应:', data)
      
      if (data && data.code === 200 && data.data) {
        // 设置咨询师信息
        if (data.data.counselorInfo) {
          counselorForm.id = data.data.counselorInfo.id
          counselorForm.user_id = data.data.counselorInfo.userId
          counselorForm.specialty = data.data.counselorInfo.specialty || ''
          counselorForm.work_experience = data.data.counselorInfo.workExperience || 0
          counselorForm.introduction = data.data.counselorInfo.introduction || ''
          counselorForm.status = data.data.counselorInfo.status !== undefined ? data.data.counselorInfo.status : 1
        }
        
        // 设置用户信息（包括头像）
        if (data.data.userInfo) {
          counselorForm.avatar = data.data.userInfo.avatar || ''
          counselorForm.real_name = data.data.userInfo.realName || ''
          counselorForm.gender = data.data.userInfo.gender || ''
          counselorForm.age = data.data.userInfo.age || 18
        }
        
        // 更新store中的用户信息
        if (data.data.userInfo) {
          authStore.setUserInfo(data.data.userInfo)
        }
      }
    } catch (error) {
      ElMessage.error(error.message || '获取咨询师资料失败')
    }
  }
  
  // 获取心理健康统计
  const fetchMentalHealthStats = async () => {
    try {
      // 这里应该调用获取心理健康统计的API
      // 模拟数据
      mentalHealthStats.value = {
        totalSessions: 12,
        avgRiskScore: 0.25,
        currentStreak: 5,
        improvementRate: 15
      }
    } catch (error) {
      ElMessage.error(error.message || '获取心理健康统计失败')
    }
  }
  
  // 获取个人资料
  const fetchProfile = async () => {
    try {
      // 根据用户角色获取不同的资料
      if (userInfo.value && userInfo.value.role === 0) {
        await fetchStudentProfile()
      } else if (userInfo.value && userInfo.value.role === 1) {
        await fetchCounselorProfile()
      }
      
      // 获取基本信息
      if (userInfo.value) {
        profileForm.username = userInfo.value.username || ''
        profileForm.nickname = userInfo.value.nickname || ''
        profileForm.email = userInfo.value.email || ''
        profileForm.phone = userInfo.value.phone || ''
        profileForm.gender = userInfo.value.gender || ''
        profileForm.birthday = userInfo.value.birthday || ''
      }
    } catch (error) {
      ElMessage.error(error.message || '获取个人资料失败')
    }
  }
  
  // 更新个人资料
  const updateProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 根据用户角色更新不同的资料
          if (userInfo.value && userInfo.value.role === 0) {
            await updateStudentProfile()
          } else if (userInfo.value && userInfo.value.role === 1) {
            await updateCounselorProfile()
          }
        } catch (error) {
          ElMessage.error(error.message || '更新个人资料失败')
        } finally {
          updating.value = false
        }
      }
    })
  }
  
  // 更新学生资料
  const updateStudentProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 如果有选择的头像文件，先上传
    
          
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          
          const data = await request({
        url: '/api/userinfo',
        method: 'PUT',
        params: {
          token: token
        },
        data: {
          token: token,
          user_info: {
            real_name: studentForm.real_name,
            gender: studentForm.gender,
            age: studentForm.age,
            avatar: studentForm.avatarFileName || studentForm.avatar,
            avatarImage: avatarBase64String || undefined,
           
            status: studentForm.status
          },
          student_info: {
            student_id: parseInt(studentForm.student_id),
            school: studentForm.school,
            major: studentForm.major,
            grade: studentForm.grade,
            emergency_contact: studentForm.emergency_contact,
            emergency_phone: studentForm.emergency_phone,
            psychological_status: studentForm.psychological_status
          }
        }
      })
          
          if (data && data.code === 200) {
            ElMessage.success('学生资料更新成功')
            fetchStudentProfile()
          } else {
            throw new Error(data.message || '更新失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新学生资料失败')
        } finally {
          updating.value = false
        }
      }
    })
  }
  
  // 更新咨询师资料
  const updateCounselorProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 如果有选择的头像文件，先上传
      
          
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          
          const data = await request({
            url: '/api/counselor',
            method: 'PUT',
            data: {
              token: token,
              user_info: {
                real_name: counselorForm.real_name,
                gender: counselorForm.gender,
                age: counselorForm.age,
                avatar: counselorForm.avatarFileName || counselorForm.avatar,
                avatarImage: avatarBase64String || undefined,
              },
              counselor_info: {
                specialty: counselorForm.specialty,
                work_experience: counselorForm.work_experience,
                introduction: counselorForm.introduction
              }
            }
          })
          
          if (data && data.code === 200) {
            ElMessage.success('咨询师资料更新成功')
            fetchCounselorProfile()
          } else {
            throw new Error(data.message || '更新失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新咨询师资料失败')
        } finally {
          updating.value = false
        }
      }
    })
  }
  
  // 获取咨询师预约时间设置
  const fetchCounselorSchedule = async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      
      // 调试信息
      console.log('获取咨询师预约时间，token:', token)
      console.log('获取咨询师预约时间，counselorForm:', counselorForm)
      console.log('获取咨询师预约时间，counselorForm.userId:', counselorForm.userId)
      
      // 调用获取咨询师预约时间设置的API
      const data = await request({
        url: '/api/appointment/available',
        method: 'GET',
        params: {
          token: token,
          counselor_id: counselorForm.user_id
        }
      })
      
      console.log('获取咨询师预约时间响应:', data)
      
      if (data && data.code === 200 && data.data) {
        // 重置weekDays数据
        weekDays.value = weekDays.value.map(day => ({
          ...day,
          slots: []
        }))
        
        // 更新weekDays数据
        data.data.forEach(item => {
          const dayIndex = weekDays.value.findIndex(day => day.dayOfWeek === item.dayOfWeek)
          if (dayIndex !== -1) {
            weekDays.value[dayIndex].slots.push({
              start_time: item.startTime,
              end_time: item.endTime,
              max_appointments: item.maxAppointments,
              booked_count: item.bookedCount,
              is_available: item.isAvailable
            })
          }
        })
        
        console.log('更新后的weekDays:', weekDays.value)
      }
    } catch (error) {
      ElMessage.error(error.message || '获取预约时间设置失败')
    }
  }
  
  // 获取管理员资料
  const fetchAdminProfile = async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      console.log('获取管理员资料时使用的token:', token)
      
      // 调用获取管理员资料的API
      const data = await request({
        url: '/api/userinfo',
        method: 'GET',
        params: {
          token: token
        }
      })
      
      console.log('管理员资料响应:', data)
      
      if (data && data.code === 200 && data.data && data.data.userInfo) {
        adminForm.id = data.data.userInfo.id
        adminForm.username = data.data.userInfo.username || ''
        adminForm.email = data.data.userInfo.email || ''
        adminForm.phone = data.data.userInfo.phone || ''
        adminForm.real_name = data.data.userInfo.realName || ''
        adminForm.gender = data.data.userInfo.gender || ''
        adminForm.age = data.data.userInfo.age || 18
      }
    } catch (error) {
      ElMessage.error(error.message || '获取管理员资料失败')
    }
  }
  
  // 更新管理员资料
  const updateAdminProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          
          const data = await request({
            url: '/api/userinfo',
            method: 'PUT',
            params: {
              token: token
            },
            data: {
              email: adminForm.email,
              phone: adminForm.phone,
              realName: adminForm.real_name,
              gender: adminForm.gender,
              age: adminForm.age
            }
          })
          
          if (data && data.code === 200) {
            ElMessage.success('管理员资料更新成功')
            fetchAdminProfile() // 重新获取数据
          } else {
            throw new Error(data.message || '更新失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新管理员资料失败')
        } finally {
          updating.value = false
        }
      }
    })
  }
  
  // 更新密码
  const updatePassword = async () => {
    if (!passwordFormRef.value) return
    
    await passwordFormRef.value.validate(async (valid) => {
      if (valid) {
        updatingPassword.value = true
        try {
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          console.log('更新密码时使用的token:', token)
          
          // 调用更新密码的API
          const data = await request({
            url: '/api/user/password',
            method: 'PUT',
            params: {
              token: token
            },
            data: {
              currentPassword: passwordForm.currentPassword,
              newPassword: passwordForm.newPassword
            }
          })
          
          if (data && data.code === 200) {
            ElMessage.success('密码修改成功')
            resetPasswordForm()
          } else {
            throw new Error(data.message || '密码修改失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新密码失败')
        } finally {
          updatingPassword.value = false
        }
      }
    })
  }
  // 预约分页处理
const handleAppointmentSizeChange = (val) => {
  appointmentPagination.pageSize = val
  appointmentPagination.page = 1
  loadStudentAppointments()
}

const handleAppointmentCurrentChange = (val) => {
  appointmentPagination.page = val
  loadStudentAppointments()
}

// 问卷结果分页处理
const handleQuestionnaireSizeChange = (val) => {
  questionnairePagination.pageSize = val
  questionnairePagination.page = 1
  loadQuestionnaireResults()
}

const handleQuestionnaireCurrentChange = (val) => {
  questionnairePagination.page = val
  loadQuestionnaireResults()
}
  // 判断时间段是否被选中
  const isSelected = (dayOfWeek, startTime, endTime) => {
    return selectedDay.value === dayOfWeek && 
           selectedStartTime.value === startTime && 
           selectedEndTime.value === endTime
  }
  
  // 获取下一个时间点（用于确定时间段）
  const getNextTime = (index) => {
    if (index < timeSlots.value.length - 1) {
      return timeSlots.value[index + 1].split('-')[0]
    }
    return '23:00' // 最后一个时间段的结束时间
  }
  
  // 判断表格单元格是否被选中
  const isTimeSlotSelected = (dayOfWeek, startTime, endTime) => {
    // 检查是否有已保存的时间段包含这个时间段
    const day = weekDays.value.find(d => d.dayOfWeek === dayOfWeek)
    if (day && day.slots) {
      return day.slots.some(slot => 
        slot.start_time === startTime && slot.end_time === endTime
      )
    }
    return false
  }
  
  // 处理双击事件 - 用于取消预约时间
  const handleDoubleClick = (dayOfWeek, time, nextTime) => {
    const dayData = weekDays.value.find(d => d.dayOfWeek === dayOfWeek)
    if (!dayData || !dayData.slots || dayData.slots.length === 0) return
    
    // 从时间格子中提取开始时间
    const timeStart = time.split('-')[0]
    
    // 查找当前格子所属的预约时间段
    const slot = dayData.slots.find(s => {
      return timeStart >= s.start_time && timeStart < s.end_time
    })
    
    if (!slot) return
    
    // 弹窗确认是否取消
    ElMessageBox.confirm(
      `确定要取消 ${slot.start_time}-${slot.end_time} 的预约时间设置吗？`,
      '取消预约时间',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 从weekDays中移除该时间段
      const slotIndex = dayData.slots.findIndex(s => 
        s.start_time === slot.start_time && s.end_time === slot.end_time
      )
      
      if (slotIndex !== -1) {
        // 使用数组替换来触发响应式更新
        dayData.slots = dayData.slots.filter((_, index) => index !== slotIndex)
        ElMessage.success('已取消预约时间设置')
      }
    }).catch(() => {
      // 用户取消操作
    })
  }
  
  // 判断时间段是否有预约
const hasSlot = (day, time, nextTime) => {
  const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
  if (!dayData || !dayData.slots) return false
  
  return dayData.slots.some(slot => {
    // 从时间格子中提取开始时间
    const timeStart = time.split('-')[0]
    const timeEnd = time.split('-')[1] || nextTime
    
    // 检查是否有重叠
    return (timeStart >= slot.start_time && timeStart < slot.end_time) || 
           (timeEnd > slot.start_time && timeEnd <= slot.end_time) ||
           (timeStart <= slot.start_time && timeEnd >= slot.end_time)
  })
}
  
  // 获取时间段样式
  const getSlotStyle = (day, time, nextTime, timeIndex) => {
    const baseStyle = {
      width: '150px !important',
      height: '45px !important',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '12px',
      textAlign: 'center',
      verticalAlign: 'middle',
      position: 'relative',
      padding: '0'
    }
    
    const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
    if (!dayData || !dayData.slots || dayData.slots.length === 0) {
      return {
        ...baseStyle,
        backgroundColor: '#fff !important'
      }
    }
    
    // 检查当前时间段是否在预约时间段内
    // 调试信息
    console.log('检查时间段 - day:', day.dayOfWeek, 'time:', time)
    console.log('dayData.slots:', dayData.slots)
    
    const hasAppointment = dayData.slots.some(slot => {
      // 从时间格子中提取开始时间
      const timeStart = time.split('-')[0]
      
      // 简化逻辑：检查格子的开始时间是否在预约时间段内
      const result = timeStart >= slot.start_time && timeStart < slot.end_time
      
      // 调试信息
      if (day.dayOfWeek === 1 && (timeStart === '09:00' || timeStart === '07:00')) {
        console.log('比较 - timeStart:', timeStart)
        console.log('比较 - slot.start_time:', slot.start_time)
        console.log('比较 - slot.end_time:', slot.end_time)
        console.log('比较 - result:', result)
      }
      
      return result
    })
    
    // 调试信息
    if (day.dayOfWeek === 1) {
      console.log('最终结果 - hasAppointment:', hasAppointment)
    }
    
    if (hasAppointment) {
      // 查找当前格子所属的预约时间段
      const slot = dayData.slots.find(s => {
        const timeStart = time.split('-')[0]
        return timeStart >= s.start_time && timeStart < s.end_time
      })
      
      if (!slot) {
        return {
          ...baseStyle,
          backgroundColor: '#70ba96 !important', // 主题绿色
          color: 'white !important'
        }
      }
      
      // 获取当前格子的开始时间
      const timeStart = time.split('-')[0]
      
      // 检查是否是时间段的第一个格子
      const isFirstSlot = timeStart === slot.start_time
      
      // 检查是否是时间段的最后一个格子
      // 计算slot.end_time前一小时的时间
      const endHour = parseInt(slot.end_time.split(':')[0])
      const endMinute = slot.end_time.split(':')[1]
      const lastSlotTime = `${endHour - 1}:${endMinute}`
      const isLastSlot = timeStart === lastSlotTime
      
      // 特殊处理：如果时间段只有一小时，则既是第一个也是最后一个
      const isOneHourSlot = slot.start_time === slot.end_time
      if (isOneHourSlot) {
        isFirstSlot = timeStart === slot.start_time
        isLastSlot = timeStart === slot.start_time
      }
      
      // 根据位置设置不同的圆角
      let borderRadius = '0 !important'
      if (isFirstSlot && isLastSlot) {
        // 只有一个格子的情况，四个角都有圆角
        borderRadius = '10px !important'
      } else if (isFirstSlot) {
        // 第一个格子，只有上面两个角有圆角
        borderRadius = '10px 10px 0 0 !important'
      } else if (isLastSlot) {
        // 最后一个格子，只有下面两个角有圆角
        borderRadius = '0 0 10px 10px !important'
      }
      
      // 根据位置设置不同的边框
      let border = '1px solid #4a8c6f !important' // 默认四边都有边框
      if (isFirstSlot && isLastSlot) {
        // 只有一个格子的情况，四边都有边框
        border = '1px solid #4a8c6f !important'
      } else if (isFirstSlot) {
        // 第一个格子，上、左、右边有边框，下边无边框
        border = '1px solid #4a8c6f !important'
        // 使用borderWidth来精确控制
        return {
          ...baseStyle,
          backgroundColor: '#70ba96 !important',
          color: 'white !important',
          border: '2px solid white !important',
          borderWidth: '2px 2px 0 2px !important',
          borderColor: 'white !important',
          borderStyle: 'solid !important',
          borderRadius: borderRadius,
          margin: '0 !important',
          padding: '2px !important',
          boxSizing: 'border-box !important'
        }
      } else if (isLastSlot) {
        // 最后一个格子，下、左、右边有边框，上边无边框
        return {
          ...baseStyle,
          backgroundColor: '#70ba96 !important',
          color: 'white !important',
          border: '2px solid white !important',
          borderWidth: '0 2px 2px 2px !important',
          borderColor: 'white !important',
          borderStyle: 'solid !important',
          borderRadius: borderRadius,
          margin: '0 !important',
          padding: '2px !important',
          boxSizing: 'border-box !important'
        }
      } else {
        // 中间格子，只有左、右边有边框
        return {
          ...baseStyle,
          backgroundColor: '#70ba96 !important',
          color: 'white !important',
          border: '2px solid white !important',
          borderWidth: '0 2px 0 2px !important',
          borderColor: 'white !important',
          borderStyle: 'solid !important',
          borderRadius: borderRadius,
          margin: '0 !important',
          padding: '2px !important',
          boxSizing: 'border-box !important'
        }
      }
      
      return {
        ...baseStyle,
        backgroundColor: '#70ba96 !important', // 主题绿色
        color: 'white !important',
        border: '2px solid white !important', // 白色边框
        borderRadius: borderRadius, // 根据位置设置的圆角
        margin: '0 !important', // 移除外边距，使格子紧密相连
        padding: '2px !important', // 内边距
        boxSizing: 'border-box !important' // 确保边框向内
      }
    }
    
    return {
      ...baseStyle,
      backgroundColor: '#fff !important'
    }
  }
  
  // 将时间字符串转换为分钟数
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }
  
  // 获取时间段信息
  const getSlotInfo = (day, time, nextTime, timeIndex) => {
    const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
    if (!dayData || !dayData.slots || dayData.slots.length === 0) return ''
    
    // 从时间格子中提取开始时间
    const timeStart = time.split('-')[0]
    
    const slot = dayData.slots.find(s => {
      // 检查当前格子是否在预约时间段内
      // 格子代表一个小时，所以检查这个小时是否在预约时间段内
      return timeStart >= s.start_time && timeStart < s.end_time
    })
    
    if (!slot) return ''
    
    // 如果是时间段的开始，显示开始时间和结束时间
    if (timeStart === slot.start_time) {
      return `${slot.start_time}-${slot.end_time}`
    }
    
    // 如果不是时间段的开始，不显示任何内容
    return ''
  }
  
  // 切换时间段选择
const toggleTimeSlot = (dayOfWeek, startTime, endTime) => {
  if (isSelected(dayOfWeek, startTime, endTime)) {
    // 取消选择
    selectedDay.value = ''
    selectedStartTime.value = ''
    selectedEndTime.value = ''
  } else {
    // 选择时间段
    selectedDay.value = dayOfWeek
    selectedStartTime.value = startTime
    selectedEndTime.value = endTime
    
    // 自动填充到表单中
    maxAppointments.value = 5
  }
}
  
  // 生成网格单元格
  const generateGridCells = () => {
    const cells = []
    
    // 左上角空白单元格
    cells.push({
      class: 'corner-cell',
      content: '',
      style: 'grid-column: 1; grid-row: 1;',
      clickHandler: null
    })
    
    // 第一行：周几标题
    weekDays.value.forEach((day, index) => {
      cells.push({
        class: 'day-header-cell',
        content: day.name,
        style: `grid-column: ${index + 2}; grid-row: 1;`,
        clickHandler: null
      })
    })
    
    // 其他行：时间段和单元格
    timeAxisLabels.value.forEach((time, timeIndex) => {
      // 时间标签
      cells.push({
        class: 'time-label-cell',
        content: time,
        style: `grid-column: 1; grid-row: ${timeIndex + 2};`,
        clickHandler: null
      })
      
      // 每天的单元格
      weekDays.value.forEach((day, dayIndex) => {
        const endTime = getNextTime(timeIndex)
        cells.push({
          class: `time-slot-cell ${isTimeSlotSelected(day.dayOfWeek, time, endTime) ? 'selected' : ''}`,
          content: '',
          style: `grid-column: ${dayIndex + 2}; grid-row: ${timeIndex + 2};`,
          clickHandler: () => toggleTimeSlot(day.dayOfWeek, time, endTime)
        })
      })
    })
    
    return cells
  }
  
  // 日期改变时的处理
  const onDayChange = () => {
    // 重置时间选择
    selectedStartTime.value = ''
    selectedEndTime.value = ''
  }
  
  // 添加预约时间
const addAppointmentTime = () => {
  
  // 找到对应的天
  const dayData = weekDays.value.find(d => d.dayOfWeek === selectedDay.value)
  if (!dayData) return
  
  // 检查是否已存在相同的时间段
  const exists = dayData.slots.some(slot => 
    slot.start_time === selectedStartTime.value && slot.end_time === selectedEndTime.value
  )
  
  if (exists) {
    ElMessage.warning('该时间段已存在')
    return
  }
  
  // 添加新的时间段
  const newSlot = {
    start_time: selectedStartTime.value,
    end_time: selectedEndTime.value,
    max_appointments: maxAppointments.value,
    booked_count: 0,
    is_available: true
  }
  
  // 使用Vue.set或直接替换数组来触发响应式更新
  dayData.slots = [...dayData.slots, newSlot]
  
  ElMessage.success('预约时间添加成功')
  resetAppointmentSettings()
}

  // 保存预约时间设置
const saveAppointmentSettings = async () => {
  
  saving.value = true
  try {
    // 直接从localStorage获取token
    const token = localStorage.getItem('vue3project_token')
    
    // 构建请求数据
    const requestData = {
      token: token,
      counselor_id: counselorForm.user_id,
      available_info: []
    }
    
    // 将选中的时间段添加到请求数据
    weekDays.value.forEach(day => {
      if (day.slots && day.slots.length > 0) {
        day.slots.forEach(slot => {
          requestData.available_info.push({
            day_of_week: day.dayOfWeek,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_appointments: slot.max_appointments
          })
        })
      }
    })
    
    // 所有时间段都已经在weekDays中，无需额外处理
    
    console.log('发送预约设置请求:', requestData)
    
    // 调用保存预约时间设置的API
    const data = await request({
      url: '/api/counselor/available',
      method: 'POST',
      data: requestData
    })
    
    console.log('保存预约设置响应:', data)
    
    if (data && data.code === 200) {
      ElMessage.success('预约时间设置保存成功')
      await fetchCounselorSchedule() // 重新获取数据
      resetAppointmentSettings() // 重置表单
    } else {
      throw new Error(data.message || '保存失败')
    }
  } catch (error) {
    console.error('保存预约设置错误:', error)
    ElMessage.error(error.message || '保存预约时间设置失败')
  } finally {
    saving.value = false
  }
}
  
  // 重置预约时间设置表单
  const resetAppointmentSettings = () => {
    selectedDay.value = ''
    selectedStartTime.value = ''
    selectedEndTime.value = ''
    maxAppointments.value = 5
  }
  
  // 获取头像URL
  const getAvatarUrl = (avatar) => {
  if (!avatar) return ''
  
  // 如果是blob URL，直接返回
  if (avatar.startsWith('blob:')) {
    return avatar
  }
  
  // 如果是相对路径，则从assets/images获取
  if (avatar.startsWith('/') || !avatar.startsWith('http')) {
    // 去掉开头的/，然后从assets/images获取
    const fileName = avatar.replace(/^\//, '')
    return `/src/assets/images/${fileName}`
  }
  
  return avatar
}

// 头像上传前检查
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }
  
  // 存储文件但不上传
    selectedAvatarFile = file
    
    // 生成预览URL
    const previewUrl = URL.createObjectURL(file)
    
    // 更新表单中的头像预览
    const userId = userInfo.value?.id || ''
    const userRole = userInfo.value?.role === 0 ? 'student' : 'counselor'
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`
    const avatarPath = `/images/${fileName}`
    
    // 在上传前处理文件
    handleFileUpload(file).then(base64 => {
      if (base64) {
        console.log('base64转换成功，前50个字符:', base64.substring(0, 50))
        // 存储base64编码到全局变量
        avatarBase64String = base64
        
        if (userRole === 'student') {
          studentForm.avatarFileName = fileName // 存储文件名
        } else {
          counselorForm.avatarFileName = fileName // 存储文件名
        }
      } else {
        console.error('base64为空')
        ElMessage.error('图片转换失败')
      }
    }).catch(error => {
      console.error('转换图片为base64失败:', error)
      ElMessage.error('处理图片失败')
    })
    
    if (userRole === 'student') {
      studentForm.avatar = previewUrl // 使用预览URL显示图片
    } else {
      counselorForm.avatar = previewUrl // 使用预览URL显示图片
    }
  
  ElMessage.success('头像选择成功，请点击保存更改以完成上传')
  return false // 阻止自动上传
}

// 存储选择的头像文件
  let selectedAvatarFile = null
  
  // 存储base64编码字符串
  let avatarBase64String = ''
  
  // 使用FileReader将文件转换为base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  
  // 在上传前处理文件
  const handleFileUpload = async (file) => {
    try {
      console.log('开始处理文件:', file.name, file.size)
      const base64 = await fileToBase64(file)
      console.log('文件转换为base64成功，长度:', base64.length)
      // 去掉data:image/jpeg;base64,前缀，只保留纯base64编码
      const pureBase64 = base64.split(',')[1]
      console.log('去掉前缀后的base64长度:', pureBase64.length)
      return pureBase64
    } catch (error) {
      console.error('Error converting file to base64:', error)
      return null
    }
  }
  

  
  // 真正上传头像并保存到本地
  // const uploadAvatarToServer = async () => {
  //   if (!selectedAvatarFile) {
  //     ElMessage.warning('请先选择头像')
  //     return
  //   }
    
  //   try {
  //     const formData = new FormData()
      
  //     // 获取用户ID和角色
  //     const userId = userInfo.value?.id || ''
  //     const userRole = userInfo.value?.role === 0 ? 'student' : 'counselor'
      
  //     // 生成文件名：用户ID.扩展名
  //     const fileExt = selectedAvatarFile.name.split('.').pop()
  //     const fileName = `${userId}.${fileExt}`
      
  //     formData.append('file', selectedAvatarFile)
  //     formData.append('fileName', fileName)
      
  //     // 根据角色选择不同的API
  //     const apiUrl = userRole === 'student' ? '/api/userinfo' : '/api/counselor'
      
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       },
  //       body: formData
  //     })
      
  //     // 检查响应状态
  //     if (!response.ok) {
  //       throw new Error(`上传失败: ${response.status} ${response.statusText}`)
  //     }
      
  //     let data
  //     try {
  //       data = await response.json()
  //     } catch (error) {
  //       console.error('JSON解析错误:', error)
  //       // 尝试获取响应文本
  //       const responseText = await response.text()
  //       console.error('响应文本:', responseText)
  //       throw new Error('服务器响应格式错误')
  //     }
      
  //     if (data.code === 200) {
  //       // 保存图片到本地assets/images目录
  //       saveImageToLocal(selectedAvatarFile, fileName)
        
  //       ElMessage.success('头像上传并保存成功')
  //     } else {
  //       ElMessage.error(data.message || '上传失败')
  //     }
  //   } catch (error) {
  //     console.error('上传头像错误:', error)
  //     ElMessage.error('上传失败，请重试')
  //   }
  // }
  
  // 保存图片到本地
  // const saveImageToLocal = async (file, fileName) => {
  //   try {
  //     // 创建一个临时URL来读取文件
  //     const reader = new FileReader()
  //     // 现代浏览器使用文件系统API
  //     const dirHandle = await window.showDirectoryPicker({
  //       mode: 'readwrite'
  //     })

  //     // 指定保存到特定目录
  //     const targetPath = 'C:\\Users\\ym\\Desktop\\GraduationProject\\vue3project\\src\\assets\\images'
  //     // 使用Node.js fs模块保存（如果可用）
  //     if (typeof require !== 'undefined') {
  //       const fs = require('fs')
  //       const path = require('path')
        
  //       const fullPath = path.join(targetPath, fileName)
  //       fs.writeFileSync(fullPath, Buffer.from(await file.arrayBuffer()))
        
  //       ElMessage.success(`图片已保存到 ${fileName}`)
  //       return
  //     }

  //     // 否则使用浏览器下载
  //     const url = URL.createObjectURL(file)
  //     const a = document.createElement('a')
  //     a.href = url
  //     a.download = fileName
  //     document.body.appendChild(a)
  //     a.click()
  //     document.body.removeChild(a)
  //     URL.revokeObjectURL(url)

  //     ElMessage.success(`图片已下载为 ${fileName}，请手动保存到 ${targetPath}`)
  //     const fileHandle = await dirHandle.getFileHandle(fileName)
  //     const writable = await fileHandle.createWritable()
  //     await writable.write(file) // 直接写入原始文件
  //     await writable.close()
  //     reader.onload = (e) => {
  //       try {
  //         // 创建图片元素
  //         const img = new Image()
  //         img.onload = () => {
  //           // 创建canvas来转换图片
  //           const canvas = document.createElement('canvas')
  //           const ctx = canvas.getContext('2d')
            
  //           // 设置canvas尺寸
  //           canvas.width = img.width
  //           canvas.height = img.height
            
  //           // 绘制图片到canvas
  //           ctx.drawImage(img, 0, 0)
            
  //           // 转换为blob并保存到指定路径
  //           canvas.toBlob(async (blob) => {
  //             try {
  //               // 使用File System Access API保存到本地
  //               if ('showDirectoryPicker' in window) {
  //                 // 现代浏览器使用文件系统API
  //                 const dirHandle = await window.showDirectoryPicker({
  //                   mode: 'readwrite'
  //                 })
                  
  //                 const fileHandle = await dirHandle.getFileHandle(fileName)
  //                 const writable = await fileHandle.createWritable()
  //                 await writable.write(file)
  //                 await writable.close()
                  
  //                 ElMessage.success(`图片已保存到 ${fileName}`)
  //               } else {
  //                 // 传统浏览器使用下载方式
  //                 const url = URL.createObjectURL(blob)
  //                 const a = document.createElement('a')
  //                 a.href = url
  //                 a.download = fileName
  //                 document.body.appendChild(a)
  //                 a.click()
  //                 document.body.removeChild(a)
  //                 URL.revokeObjectURL(url)
                  
  //                 ElMessage.success(`图片已下载为 ${fileName}，请手动保存到 C:\\Users\\ym\\Desktop\\GraduationProject\\vue3project\\src\\assets\\images`)
  //               }
  //             } catch (error) {
  //               console.error('保存文件失败:', error)
  //               ElMessage.error('保存文件失败')
  //             }
  //           }, 'image/jpeg', 0.9)
  //         }
          
  //         img.src = e.target.result
  //       } catch (error) {
  //         console.error('保存图片失败:', error)
  //         ElMessage.error('保存图片失败')
  //       }
  //     }
      
  //     reader.readAsDataURL(file)
  //   } catch (error) {
  //     console.error('保存图片错误:', error)
  //     ElMessage.error('保存图片失败')
  //   }
  // }

// 重置表单
const resetForm = () => {
  if (userInfo.value && userInfo.value.role === 0) {
    fetchStudentProfile()
  } else if (userInfo.value && userInfo.value.role === 1) {
    fetchCounselorProfile()
  } else if (userInfo.value && userInfo.value.role === 2) {
    fetchAdminProfile()
  }
}
  
  // 重置密码表单
  const resetPasswordForm = () => {
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    if (passwordFormRef.value) {
      passwordFormRef.value.clearValidate()
    }
  }
  
  // 预约管理相关数据
  const appointments = ref([])
  const loadingAppointments = ref(false)
  const updatingStatus = ref(null)
  const appointmentFilter = reactive({
    status: '-1',
    dateRange: null
  })
  
  // 学生预约相关数据
  const studentAppointments = ref([])
  const loadingStudentAppointments = ref(false)
  
  // 学生问卷结果相关数据
  const questionnaireResults = ref([])
  const loadingQuestionnaireResults = ref(false)
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
  })
  
  // 获取预约列表
  const loadAppointments = async () => {
    loadingAppointments.value = true
    try {
      const startDate = appointmentFilter.dateRange ? appointmentFilter.dateRange[0] : ''
      const endDate = appointmentFilter.dateRange ? appointmentFilter.dateRange[1] : ''
      
      const response = await getCounselorAppointments(
        pagination.page,
        pagination.pageSize,
        parseInt(appointmentFilter.status),
        startDate,
        endDate
      )
      
      if (response.code === 200) {
        appointments.value = response.data || []
        pagination.total = response.total || 0
      } else {
        ElMessage.error(response.message || '获取预约列表失败')
      }
    } catch (error) {
      console.error('获取预约列表失败:', error)
      ElMessage.error('获取预约列表失败')
    } finally {
      loadingAppointments.value = false
    }
  }
  
  // 获取学生预约列表
const loadStudentAppointments = async () => {
  loadingStudentAppointments.value = true
  try {
    const response = await getUserAppointments(
      appointmentPagination.page,
      appointmentPagination.pageSize,
      -1 // 获取所有状态的预约
    )
    
    if (response.code === 200) {
      studentAppointments.value = response.data || []
      appointmentPagination.total = response.total || 0
    } else {
      ElMessage.error(response.message || '获取预约列表失败')
    }
  } catch (error) {
    console.error('获取学生预约列表失败:', error)
    ElMessage.error('获取预约列表失败')
  } finally {
    loadingStudentAppointments.value = false
  }
}
  
  // 获取学生问卷结果列表
const loadQuestionnaireResults = async () => {
  loadingQuestionnaireResults.value = true
  try {
    const token = localStorage.getItem('vue3project_token')
    const response = await getUserResults({
      token,
      page: questionnairePagination.page,
      page_size: questionnairePagination.pageSize,
      template_id: -1 // 获取所有问卷结果
    })
    
    if (response.code === 200) {
      questionnaireResults.value = response.data || []
      questionnairePagination.total = response.total || 0
    } else {
      ElMessage.error(response.message || '获取问卷结果失败')
    }
  } catch (error) {
    console.error('获取问卷结果失败:', error)
    ElMessage.error('获取问卷结果失败')
  } finally {
    loadingQuestionnaireResults.value = false
  }
}
  
  // 获取风险等级文本
  const getRiskLevelText = (level) => {
    const levelMap = {
      1: '低风险',
      2: '中风险',
      3: '高风险'
    }
    return levelMap[level] || '未知'
  }
  
  // 获取风险等级类型
  const getRiskLevelType = (level) => {
    const typeMap = {
      1: 'success',
      2: 'warning',
      3: 'danger'
    }
    return typeMap[level] || 'info'
  }
  
  // 查看问卷详情
  const viewQuestionnaireDetail = (resultId) => {
    router.push(`/questionnaire-result/${resultId}`)
  }
  
  // 判断日期是否是今天或今天之后
  const isTodayOrAfter = (dateStr) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const appointmentDate = new Date(dateStr)
    return appointmentDate >= today
  }
  
  // 开始咨询
  const startConsultation = (appointmentId) => {
    // 这里可以跳转到咨询页面
    router.push(`/consultation/${appointmentId}`)
  }
  
  // 取消预约
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await cancelAppointment(appointmentId, '学生取消预约')
      if (response.code === 200) {
        ElMessage.success('预约取消成功')
        await loadStudentAppointments() // 重新加载预约列表
      } else {
        ElMessage.error(response.message || '取消预约失败')
      }
    } catch (error) {
      console.error('取消预约失败:', error)
      ElMessage.error('取消预约失败')
    }
  }
  
  // 更新预约状态
  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    updatingStatus.value = appointmentId
    try {
      const response = await updateAppointmentStatus(appointmentId, status)
      if (response.code === 200) {
        ElMessage.success(status === 1 ? '已接受预约' : '预约状态已更新')
        await loadAppointments() // 重新加载预约列表
      } else {
        ElMessage.error(response.message || '更新预约状态失败')
      }
    } catch (error) {
      console.error('更新预约状态失败:', error)
      ElMessage.error('更新预约状态失败')
    } finally {
      updatingStatus.value = null
    }
  }
  
  // 显示取消预约对话框
  const showCancelDialog = (appointment) => {
    ElMessageBox.prompt('请输入取消原因', '取消预约', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{1,200}$/,
      inputErrorMessage: '取消原因不能为空且不超过200个字符'
    }).then(async ({ value }) => {
      try {
        const response = await cancelAppointment(appointment.id, value)
        if (response.code === 200) {
          ElMessage.success('预约已取消')
          await loadAppointments() // 重新加载预约列表
        } else {
          ElMessage.error(response.message || '取消预约失败')
        }
      } catch (error) {
        console.error('取消预约失败:', error)
        ElMessage.error('取消预约失败')
      }
    }).catch(() => {
      // 用户取消操作
    })
  }
  
  // 获取预约状态类型
  const getAppointmentStatusType = (status) => {
    const statusMap = {
      0: { type: 'warning', text: '待确认' },
      1: { type: 'success', text: '已确认' },
      2: { type: 'info', text: '已完成' },
      3: { type: 'danger', text: '已取消' }
    }
    return statusMap[status] || { type: 'info', text: '未知状态' }
  }
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 分页相关方法
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    pagination.page = 1
    loadAppointments()
  }
  
  const handleCurrentChange = (page) => {
    pagination.page = page
    loadAppointments()
  }
  
  onMounted(async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      
      // 如果localStorage中有token但store中没有，更新store
      if (token && !authStore.token) {
        authStore.token = token
      }
      
      // 先获取用户信息以确定角色
      await authStore.fetchUserInfo()
      
      // 根据用户角色获取不同的资料
      if (userInfo.value && userInfo.value.role === 0) {
        await fetchStudentProfile()
        await loadStudentAppointments() // 加载学生预约列表
        await loadQuestionnaireResults() // 加载学生问卷结果
      } else if (userInfo.value && userInfo.value.role === 1) {
        await fetchCounselorProfile()
        await fetchCounselorSchedule()
        await loadAppointments() // 加载预约列表
      } else if (userInfo.value && userInfo.value.role === 2) {
        await fetchAdminProfile()
      }
      
      fetchMentalHealthStats()
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    }
  })
  
  // 咨询相关方法
  
  // 格式化时间
  const formatTime = (time) => {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleString('zh-CN', { 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }
  
  // 获取学生头像
  const getUserAvatar = () => {
    if (!consultationDialog.userInfo) {
      return '/src/assets/images/head.webp'
    }
    
    const avatar = consultationDialog.userInfo.avatar
    
    if (!avatar || avatar.trim() === '') {
      return '/src/assets/images/head.webp'
    }
    
    // 如果是相对路径，则从assets/images获取
    if (avatar.startsWith('/') || !avatar.startsWith('http')) {
      const fileName = avatar.replace(/^\//, '')
      return `/src/assets/images/${fileName}`
    }
    
    return avatar
  }
  
  // 处理头像加载错误
  const handleAvatarError = (e) => {
    e.target.src = '/src/assets/images/head.webp'
  }
  
  // 处理消息中头像加载错误
  const handleMessageAvatarError = (e) => {
    e.target.src = '/src/assets/images/head.webp'
  }
  
  // 开始咨询弹窗
  const startConsultationDialog = async (appointment) => {
    try {
      const response = await startConsultationApi({
        token: authStore.token,
        appointment_id: appointment.id
      })
      
      if (response.code === 200) {
        // 初始化弹窗数据
        consultationDialog.appointment = appointment
        // 使用appointment.id作为sessionId
        consultationDialog.sessionId = appointment.id
        consultationDialog.title = `与 ${appointment.userName} 的咨询`
        consultationDialog.activeTab = 'chat' // 默认显示聊天
        consultationDialog.messages = []
        consultationDialog.inputMessage = ''
        consultationDialog.visible = true
        
        // 获取学生信息
        await fetchUserInfo(appointment.userId)
        
        ElMessage.success('咨询已开始')
        
        // 获取历史消息
        await fetchDialogMessageHistory()
        
        // 建立WebSocket连接
        await connectWebSocket()
      } else {
        // 尝试获取活跃咨询会话
        try {
          const activeResponse = await getActiveConsultation({
            token: authStore.token,
            appointment_id: appointment.id
          })
          
          if (activeResponse.code === 200) {
            // 初始化弹窗数据
            consultationDialog.appointment = appointment
            consultationDialog.sessionId = appointment.id
            consultationDialog.title = `与 ${appointment.userName} 的咨询`
            consultationDialog.activeTab = 'chat'
            consultationDialog.messages = []
            consultationDialog.inputMessage = ''
            consultationDialog.visible = true
            
            // 获取学生信息
            await fetchUserInfo(appointment.userId)
            
            ElMessage.success('已连接到现有咨询会话')
            
            // 获取历史消息
            await fetchDialogMessageHistory()
            
            // 建立WebSocket连接
            await connectWebSocket()
          } else {
            ElMessage.error(activeResponse.message || '获取活跃会话失败')
          }
        } catch (activeError) {
          ElMessage.error(response.message || '开始咨询失败')
        }
      }
    } catch (error) {
      ElMessage.error('开始咨询失败')
    }
  }
  
  // 获取学生信息
  const fetchUserInfo = async (userId) => {
    try {
      // 这里应该调用获取用户信息的API
      // 暂时使用模拟数据
      consultationDialog.userInfo = {
        id: userId,
        username: '学生用户',
        avatar: '1.jpg'
      }
    } catch (error) {
      console.error('获取学生信息失败:', error)
      // 使用默认信息
      consultationDialog.userInfo = {
        id: userId,
        username: '学生用户',
        avatar: ''
      }
    }
  }
  
  // 获取消息历史
  const fetchDialogMessageHistory = async () => {
    try {
      console.log('获取消息历史，会话ID:', consultationDialog.sessionId)
      const response = await getMessageHistory(consultationDialog.sessionId, {
        token: authStore.token,
        page: 1,
        page_size: 50
      })
      
      console.log('消息历史响应:', response)
      
      if (response.code === 200) {
        // 处理历史消息，根据senderId判断消息归属
        const messages = (response.messages || []).map(msg => {
          console.log('处理历史消息:', msg)
          console.log('消息发送者ID:', msg.senderId, '当前用户ID:', userInfo.value.id)
          return {
            ...msg,
            sender_id: msg.senderId, // 确保字段名一致
            message_type: msg.messageType === 'TEXT' ? 0 : 1, // 转换消息类型
            content: msg.content,
            sent_at: new Date(msg.sentAt)
          }
        })
        
        console.log('处理后的咨询师端消息列表:', messages)
        consultationDialog.messages = messages
        scrollToDialogBottom()
      }
    } catch (error) {
      console.error('获取消息历史失败:', error)
      ElMessage.error('获取消息历史失败')
    }
  }
  
  // 建立WebSocket连接
  const connectWebSocket = async () => {
    try {
      // 获取WebSocket连接参数
      const response = await fetch('/v1/consultation/ws/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
          token: authStore.token,
          appointment_id: consultationDialog.sessionId
        })
      })
      
      if (!response.ok) {
        throw new Error('WebSocket连接失败')
      }
      
      
      
      // 建立WebSocket连接
      // 直接连接到WebSocket端点，使用token和appointment_id作为参数
      const wsUrl = `ws://localhost:8003/v1/consultation/ws?token=${authStore.token}&appointment_id=${consultationDialog.sessionId}`
      consultationDialog.websocket = new WebSocket(wsUrl)
      
      consultationDialog.websocket.onopen = () => {
        // WebSocket连接已建立
      }
      
      consultationDialog.websocket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log('咨询师端收到WebSocket消息:', message)
        console.log('当前用户ID:', userInfo.value.id)
        console.log('消息发送者ID:', message.sender_id)
        
          if (message.type === 1) { // WS_MESSAGE
          console.log('处理消息:', message)
          console.log('当前用户ID:', userInfo.value.id)
          console.log('消息发送者ID:', message.sender_id)
          
          // 确保sender_id正确设置
          const senderId = message.sender_id || message.senderId
          
          // 检查是否为当前用户发送的消息
          const isCurrentUser = String(senderId) === String(userInfo.value.id)
          console.log('是否为当前用户发送的消息:', isCurrentUser)
          
          // 只添加对方发送的消息，不添加自己发送的消息
          // 因为自己发送的消息已经在sendDialogMessage中添加了
          if (!isCurrentUser) {
            consultationDialog.messages.push({
              id: message.id || Date.now(),
              sender_id: senderId,
              message_type: 0,
              content: message.content,
              sent_at: new Date(message.timestamp)
            })
            
            scrollToDialogBottom()
          }
        } else if (message.type === 4) { // WS_VIDEO_OFFER
          // 处理视频通话请求
          handleVideoOffer(message)
        }
      }
      
      consultationDialog.websocket.onclose = () => {
        // WebSocket连接已关闭
      }
      
      consultationDialog.websocket.onerror = (error) => {
        // WebSocket错误
      }
    } catch (error) {
      ElMessage.error('WebSocket连接失败')
    }
  }
  
  // 发送弹窗消息
  const sendDialogMessage = async () => {
    if (!consultationDialog.inputMessage.trim() || !consultationDialog.sessionId) return
    
    console.log('咨询师发送消息:', consultationDialog.inputMessage)
    console.log('当前用户ID:', userInfo.value.id)
    
    try {
      const response = await sendConsultationMessage({
        token: authStore.token,
        appointment_id: consultationDialog.sessionId,
        message_type: 0, // 文本消息
        content: consultationDialog.inputMessage
      })
      
      console.log('发送消息响应:', response)
      
      if (response.code === 200) {
        console.log('消息发送成功')
        // 添加自己发送的消息到聊天框
        consultationDialog.messages.push({
          id: response.messageId || Date.now(),
          sender_id: userInfo.value.id,
          message_type: 0,
          content: consultationDialog.inputMessage,
          sent_at: new Date()
        })
        
        consultationDialog.inputMessage = ''
        scrollToDialogBottom()
      } else {
        console.error('发送消息失败:', response.message)
        ElMessage.error(response.message || '发送消息失败')
      }
    } catch (error) {
      console.error('发送消息异常:', error)
      ElMessage.error('发送消息失败')
    }
  }
  
  // 滚动到底部
  const scrollToDialogBottom = () => {
    nextTick(() => {
      if (dialogMessagesContainer.value) {
        dialogMessagesContainer.value.scrollTop = dialogMessagesContainer.value.scrollHeight
      }
    })
  }
  
  // 关闭弹窗
  const handleCloseConsultationDialog = () => {
    // 关闭WebSocket连接
    if (consultationDialog.websocket) {
      consultationDialog.websocket.close()
      consultationDialog.websocket = null
    }
    
    // 结束视频通话
    if (consultationDialog.videoCall.active) {
      stopDialogVideoCall()
    }
    
    // 重置弹窗数据
    consultationDialog.visible = false
    consultationDialog.appointment = null
    consultationDialog.userInfo = null
    consultationDialog.sessionId = null
    consultationDialog.messages = []
    consultationDialog.inputMessage = ''
  }
  
  // 切换弹窗视频通话
  const toggleDialogVideoCall = async () => {
    if (consultationDialog.videoCall.active) {
      // 结束视频通话
      stopDialogVideoCall()
    } else {
      // 开始视频通话
      await startDialogVideoCall()
    }
  }
  
  // 开始弹窗视频通话
  const startDialogVideoCall = async () => {
    try {
      // 获取本地媒体流
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      // 显示本地视频
      if (dialogLocalVideo.value) {
        dialogLocalVideo.value.srcObject = localStream
      }
      
      // 创建WebRTC连接
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })
      
      // 添加本地流
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream)
      })
      
      // 处理远程流
      peerConnection.ontrack = (event) => {
        if (dialogRemoteVideo.value) {
          dialogRemoteVideo.value.srcObject = event.streams[0]
        }
        consultationDialog.videoCall.remoteStream = event.streams[0]
      }
      
      // 处理ICE候选
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && consultationDialog.websocket) {
          consultationDialog.websocket.send(JSON.stringify({
            type: 5, // WS_ICE_CANDIDATE
            session_id: consultationDialog.sessionId,
            sender_id: userInfo.value.id,
            content: JSON.stringify(event.candidate),
            timestamp: new Date().toISOString()
          }))
        }
      }
      
      // 创建offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      
      // 发送offer
      if (consultationDialog.websocket) {
        consultationDialog.websocket.send(JSON.stringify({
          type: 4, // WS_VIDEO_OFFER
          session_id: consultationDialog.sessionId,
          sender_id: userInfo.value.id,
          content: JSON.stringify(offer),
          timestamp: new Date().toISOString()
        }))
      }
      
      // 更新状态
      consultationDialog.videoCall.active = true
      consultationDialog.videoCall.localStream = localStream
      consultationDialog.videoCall.peerConnection = peerConnection
      
      ElMessage.success('视频通话已发起')
    } catch (error) {
      ElMessage.error('发起视频通话失败')
    }
  }
  
  // 停止弹窗视频通话
  const stopDialogVideoCall = () => {
    if (consultationDialog.videoCall.localStream) {
      consultationDialog.videoCall.localStream.getTracks().forEach(track => track.stop())
      consultationDialog.videoCall.localStream = null
    }
    
    if (consultationDialog.videoCall.peerConnection) {
      consultationDialog.videoCall.peerConnection.close()
      consultationDialog.videoCall.peerConnection = null
    }
    
    if (dialogLocalVideo.value) {
      dialogLocalVideo.value.srcObject = null
    }
    
    if (dialogRemoteVideo.value) {
      dialogRemoteVideo.value.srcObject = null
    }
    
    consultationDialog.videoCall.active = false
    consultationDialog.videoCall.remoteStream = null
    
    // 通知对方结束通话
    if (consultationDialog.websocket) {
      consultationDialog.websocket.send(JSON.stringify({
        type: 6, // WS_LEAVE
        session_id: consultationDialog.sessionId,
        sender_id: userInfo.value.id,
        content: '视频通话已结束',
        timestamp: new Date().toISOString()
      }))
    }
    
    ElMessage.info('视频通话已结束')
  }
  
  // 处理视频通话请求
  const handleVideoOffer = async (message) => {
    try {
      // 切换到视频标签
      consultationDialog.activeTab = 'video'
      
      // 获取本地媒体流
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      // 显示本地视频
      if (dialogLocalVideo.value) {
        dialogLocalVideo.value.srcObject = localStream
      }
      
      // 创建WebRTC连接
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })
      
      // 添加本地流
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream)
      })
      
      // 处理远程流
      peerConnection.ontrack = (event) => {
        if (dialogRemoteVideo.value) {
          dialogRemoteVideo.value.srcObject = event.streams[0]
        }
        consultationDialog.videoCall.remoteStream = event.streams[0]
      }
      
      // 处理ICE候选
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && consultationDialog.websocket) {
          consultationDialog.websocket.send(JSON.stringify({
            type: 5, // WS_ICE_CANDIDATE
            session_id: consultationDialog.sessionId,
            sender_id: userInfo.value.id,
            content: JSON.stringify(event.candidate),
            timestamp: new Date().toISOString()
          }))
        }
      }
      
      // 设置远程描述
      const offer = JSON.parse(message.content)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      
      // 创建answer
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      
      // 发送answer
      if (consultationDialog.websocket) {
        consultationDialog.websocket.send(JSON.stringify({
          type: 5, // WS_VIDEO_ANSWER
          session_id: consultationDialog.sessionId,
          sender_id: userInfo.value.id,
          content: JSON.stringify(answer),
          timestamp: new Date().toISOString()
        }))
      }
      
      // 更新状态
      consultationDialog.videoCall.active = true
      consultationDialog.videoCall.localStream = localStream
      consultationDialog.videoCall.peerConnection = peerConnection
      
      ElMessage.info('视频通话已接通')
    } catch (error) {
      ElMessage.error('接听视频通话失败')
    }
  }
  </script>
  
  <style scoped lang="scss">
  .page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden; // 防止整个页面滚动
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden; // 防止主内容区域滚动
  }
  .content-area {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    height: calc(100vh - 60px); // 确保内容区域有固定高度
  }
  
  .profile-header {
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
  
  .profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    .card-container {
      h2 {
        font-size: 20px;
        color: var(--text-color);
        margin-bottom: 20px;
      }
    }
    
    .profile-form {
    .el-form-item {
      margin-bottom: 20px;
    }
  }

  /* 头像上传样式 */
  .avatar-upload {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ddd;
  }

  .avatar-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
  }
    
    .mental-health-stats {
      grid-column: span 2;
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 30px;
        
        .stat-item {
          text-align: center;
          padding: 20px;
          background-color: var(--secondary-color);
          border-radius: 8px;
          
          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 5px;
          }
          
          .stat-label {
            font-size: 14px;
            color: var(--text-secondary);
          }
        }
      }
      
      .chart-container {
        h3 {
          font-size: 18px;
          color: var(--text-color);
          margin-bottom: 20px;
        }
        
        .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--secondary-color);
        border-radius: 8px;
      }
    }
  }
  .pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
  // 独立容器样式
    .appointment-settings-container {
      margin-top: 20px;
      
      .appointment-settings {
        h2 {
          margin-bottom: 20px;
        }
      }
    }
    
    // 预约管理容器样式
    .appointment-management-container {
      margin-top: 120px;
      
      .appointment-management {
        h2 {
          margin-bottom: 20px;
        }
        
        .appointment-filters {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .appointment-list {
          .empty-state {
            text-align: center;
            padding: 40px 0;
          }
          
          .appointment-table {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            
            .appointment-table-content {
              width: 100%;
              border-collapse: collapse;
              
              thead {
                tr {
                  background-color: #f8f9fa;
                  
                  th {
                    padding: 24px 40px;
                    font-weight: 600;
                    color: #495057;
                    font-size: 14px;
                    text-align: center;
                    border-bottom: 1px solid #e9ecef;
                  }
                }
              }
              
              tbody {
                tr {
                  transition: all 0.3s ease;
                  
                  &:hover {
                    background-color: #f8f9fa;
                  }
                  
                  td {
                    padding: 24px 40px ;
                    font-size: 15px;
                    color: #495057;
                    text-align: center;
                    border-bottom: 1px solid #e9ecef;
                    
                    &:first-child {
                      font-weight: 600;
                      color: #212529;
                    }
                    
                    &:last-child {
                      display: flex;
                      gap: 8px;
                      justify-content: center;
                    }
                  }
                }
              }
            }
          }
        }
        
        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
      }
    }
    
    // 预约时间布局样式
    .appointment-layout {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 40px;
      
      .week-schedule {
        flex-shrink: 0;
        
        h3 {
          font-size: 20px;
          color: var(--text-color);
          margin-bottom: 20px;
        }
        
        .schedule-table {
          width: 800px;
          height: 640px;
          border-collapse: collapse;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          
          table {
            width: 100%;
            height: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          
          th, td {
            border: 1px solid var(--border-color);
            padding: 0;
            text-align: center;
            width: 120px;
            height: 80px;
          }
          
          th {
                background-color: var(--secondary-color);
                color: var(--text-secondary);
                font-weight: 600;
                font-size: 16px;
              }
          
          th:first-child,
          td:first-child {
            background-color: var(--secondary-color);
            color: var(--text-secondary);
            font-size: 14px;
            width: 150px;
            font-weight: 600;
          }
          
          .slot-cell {
          background-color: var(--background-color);
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
          width: 150px;
          height: 45px;
        }
          
          .slot-cell:hover {
            background-color: rgba(var(--primary-color), 0.1);
          }
          
          .slot-cell.selected {
          background-color: var(--primary-color);
          color: white;
          box-shadow: 0 2px 8px rgba(var(--primary-color), 0.3);
        }
        
        .slot-indicator {
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                height: 100% !important;
                font-size: 20px !important;
                font-weight: bold !important;
                white-space: pre-line !important;
                line-height: 1.2 !important;
                padding: 2px !important;
                margin: 2px !important;
                border-radius: 30px !important;
              }
        }
      }
      
      .appointment-selection {
        flex-shrink: 0;
        width: 350px;
        margin-top: 40px;
        
        .selection-header {
          margin-bottom: 30px;
          
          h3 {
            font-size: 20px;
            color: var(--text-color);
          }
        }
        
        .selection-content {
          display: flex;
          flex-direction: column;
          gap: 25px;
          
          .form-item {
            
            label {
              display: block;
              margin-bottom: 10px;
              font-weight: 500;
              color: var(--text-color);
              font-size: 16px;
            }
            
            .el-select,
            .el-input-number {
              width: 100%;
            }
          }
          
          .form-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            
            .el-button {
              flex: 1;
            }
          }
        }
      }
    }
    
    // 心理健康统计容器样式
    .mental-health-container {
      margin-top: 20px;
      
      .mental-health-stats {
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
          
          .stat-item {
            text-align: center;
            padding: 20px;
            background-color: var(--secondary-color);
            border-radius: 8px;
            
            .stat-value {
              font-size: 24px;
              font-weight: 600;
              color: var(--primary-color);
              margin-bottom: 8px;
            }
            
            .stat-label {
              font-size: 14px;
              color: var(--text-secondary);
            }
          }
        }
        
        .chart-container {
          h3 {
            font-size: 18px;
            color: var(--text-color);
            margin-bottom: 15px;
          }
          
          .chart-placeholder {
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--secondary-color);
            border-radius: 8px;
          }
        }
      }
    }
  }
  
  // 学生预约容器样式
  .student-appointment-container {
    margin-top: 30px;
    
    .student-appointment {
      h2 {
        margin-bottom: 20px;
      }
      
      .appointment-list {
        .empty-state {
          text-align: center;
          padding: 40px 0;
        }
        
        .appointment-table {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          
          .appointment-table-content {
            width: 100%;
            border-collapse: collapse;
            
            thead {
              tr {
                background-color: #f8f9fa;
                
                th {
                  padding: 24px 40px;
                  font-weight: 600;
                  color: #495057;
                  font-size: 14px;
                  text-align: center;
                  border-bottom: 1px solid #e9ecef;
                }
              }
            }
            
            tbody {
              tr {
                transition: all 0.3s ease;
                
                &:hover {
                  background-color: #f8f9fa;
                }
                
                td {
                  padding: 24px 40px ;
                  font-size: 15px;
                  color: #495057;
                  text-align: center;
                  border-bottom: 1px solid #e9ecef;
                  
                  &:first-child {
                    font-weight: 600;
                    color: #212529;
                  }
                  
                  &:last-child {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  // 学生问卷结果容器样式
  .student-questionnaire-container {
    margin-top: 30px;
    
    .student-questionnaire {
      h2 {
        margin-bottom: 20px;
      }
      
      .questionnaire-list {
        .empty-state {
          text-align: center;
          padding: 40px 0;
        }
        
        .questionnaire-table {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          
          .questionnaire-table-content {
            width: 100%;
            border-collapse: collapse;
            
            thead {
              tr {
                background-color: #f8f9fa;
                
                th {
                  padding: 24px 40px;
                  font-weight: 600;
                  color: #495057;
                  font-size: 14px;
                  text-align: center;
                  border-bottom: 1px solid #e9ecef;
                }
              }
            }
            
            tbody {
              tr {
                transition: all 0.3s ease;
                
                &:hover {
                  background-color: #f8f9fa;
                }
                
                td {
                  padding: 24px 40px;
                  font-size: 15px;
                  color: #495057;
                  text-align: center;
                  border-bottom: 1px solid #e9ecef;
                  
                  &:first-child {
                    font-weight: 600;
                    color: #212529;
                  }
                  
                  &:last-child {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  @media (max-width: 1200px) {
    .profile-content {
      grid-template-columns: 1fr;
      
      .mental-health-stats {
        grid-column: span 1;
        
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
  }
  
  /* 弹窗样式 */
  .consultation-dialog {
    .el-dialog__body {
      padding: 0;
    }
    
    .consultation-tabs {
      padding: 22.5px 30px 0;
      border-bottom: 1px solid #eee;
      
      .tab-button {
        margin-right: 15px;
      }
    }
    
    .chat-content {
      height: 900px;
      display: flex;
      flex-direction: column;
      
      .chat-header {
        padding: 22.5px 30px;
        border-bottom: 1px solid #eee;
        background-color: #f8f9fa;
        
        .appointment-info {
          display: flex;
          align-items: center;
          
          .avatar-container {
            .counselor-avatar-img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              object-fit: cover;
            }
          }
          
          .appointment-details {
            margin-left: 22.5px;
            
            .appointment-name {
              font-size: 27px;
              font-weight: 600;
              color: #333;
            }
          }
        }
      }
      
      .chat-messages {
        flex: 1;
        padding: 30px;
        overflow-y: auto;
        background-color: #f5f7fa;
        
        .message-item {
          margin-bottom: 30px;
          
          .student-message {
            display: flex;
            align-items: flex-start;
            
            .message-avatar {
              margin-right: 18px;
              flex-shrink: 0;
              
              .message-avatar-img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
              }
            }
            
            .message-bubble {
              max-width: 70%;
              
              .message-content {
                background-color: white;
                color: #333;
                border-radius: 27px 27px 27px 6px;
                padding: 18px 24px;
                box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.1);
                margin-bottom: 7.5px;
                word-wrap: break-word;
                line-height: 1.5;
                font-size: 18px;
              }
              
              .message-time {
                font-size: 18px;
                color: #999;
                padding-left: 7.5px;
              }
            }
          }
          
          .counselor-message {
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;
            
            .message-bubble {
              max-width: 70%;
              order: 1;
              
              .message-content {
                background-color: #70ba96;
                color: white;
                border-radius: 27px 27px 6px 27px;
                padding: 18px 24px;
                box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.1);
                margin-bottom: 7.5px;
                word-wrap: break-word;
                line-height: 1.5;
                font-size: 18px;
              }
              
              .message-time {
                font-size: 18px;
                color: #999;
                text-align: right;
                padding-right: 7.5px;
              }
            }
            
            .message-avatar {
              margin-left: 18px;
              flex-shrink: 0;
              order: 2;
            }
          }
        }
      }
      
      .chat-input {
        padding: 22.5px 30px;
        border-top: 1px solid #eee;
        background-color: white;
        
        .input-container {
          display: flex;
          align-items: flex-end;
          gap: 15px;
          
          .el-textarea {
            flex: 1;
            
            :deep(.el-textarea__inner) {
              border-radius: 27px;
              padding: 15px 22.5px;
              resize: none;
              font-size: 21px;
              line-height: 1.5;
            }
          }
          
          .send-button {
            height: 60px;
            border-radius: 30px;
            padding: 0 30px;
            font-weight: 500;
            font-size: 18px;
          }
        }
      }
    }
    
    .video-content {
      height: 750px;
      
      .video-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        
        .video-local, .video-remote {
          flex: 1;
          position: relative;
          background-color: #000;
          
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .video-info {
            position: absolute;
            bottom: 15px;
            left: 15px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 7.5px 15px;
            border-radius: 6px;
            font-size: 21px;
          }
        }
        
        .video-local {
          height: 300px;
        }
        
        .video-remote {
          flex: 1;
          min-height: 300px;
        }
        
        .video-controls {
          padding: 22.5px;
          text-align: center;
        }
      }
    }
  }
  </style>