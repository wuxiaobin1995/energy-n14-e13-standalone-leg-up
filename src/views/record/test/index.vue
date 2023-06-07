<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-25 10:39:59
 * @LastEditTime: 2023-05-26 17:42:59
 * @Description : 测试数据记录页
-->
<template>
  <div class="test-record">
    <div class="wrapper">
      <!-- 顶部 -->
      <div class="top-wrapper">
        <!-- 返回首页 -->
        <el-page-header
          title="返回首页"
          content="测试数据记录"
          @back="handleToHome"
        ></el-page-header>
        <!-- 日期筛选 -->
        <el-date-picker
          class="data-select"
          v-model="selectDateValue"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :clearable="false"
          :unlink-panels="true"
          align="right"
          @change="changeData"
        >
        </el-date-picker>
        <!-- 导出Excel按钮 -->
        <el-button
          :loading="exportExcelLoading"
          icon="el-icon-download"
          type="warning"
          @click="handleExportExcel"
          >导出 Excel</el-button
        >
      </div>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        class="table-wrapper"
        style="width: 100%"
        height="auto"
        :default-sort="{ prop: 'pdfTime', order: 'descending' }"
        :stripe="true"
        :border="true"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column type="index" width="50" align="center" />
        <!-- 测试时间 -->
        <el-table-column
          align="center"
          prop="pdfTime"
          label="测试时间"
          width="220"
          sortable
        />
        <!-- 左右合计负重 -->
        <el-table-column
          align="center"
          prop="data.bothLegResult"
          label="双腿(kg)"
          width="130"
        />
        <!-- 左腿 -->
        <el-table-column
          align="center"
          prop="data.goodLegResult"
          label="左腿(kg)"
          width="130"
        />
        <!-- 右腿 -->
        <el-table-column
          align="center"
          prop="data.badLegResult"
          label="右腿(kg)"
          width="130"
        />
        <!-- 删除按钮 -->
        <el-table-column label="删除操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              >删 除</el-button
            >
          </template>
        </el-table-column>
        <!-- 查看报告按钮 -->
        <el-table-column label="测试报告" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              @click="handleCheckPdf(scope.$index, scope.row)"
              >查看报告</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 按钮组 -->
      <div class="btn-wrapper">
        <el-button class="item" type="success" @click="handleTendencyPdf"
          >长期趋势报告</el-button
        >
        <el-button class="item" type="info" @click="handleRefresh"
          >刷 新</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'test-record',

  data() {
    return {
      tableData: [],
      allData: [],
      loading: false, // 加载动画
      exportExcelLoading: false, // 导出Excel加载动画
      // 日期选择器的筛选值
      selectDateValue: [
        this.$moment().format('YYYY-MM-DD 00:00:00'),
        this.$moment().format('YYYY-MM-DD 23:59:59')
      ],
      /* 日期选择器快捷选项 */
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '该用户所有数据',
            onClick(picker) {
              const start = new Date(new Date().setHours(0, 0, 0))
              const end = new Date(new Date().setHours(23, 59, 59))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 36000)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },

  created() {
    this.initTestData()
  },

  methods: {
    /**
     * @description: 表格数据初始化
     */
    initTestData() {
      const db = initDB()
      this.loading = true
      db.test_data
        .where({
          userId: this.$store.state.currentUserInfo.userId
        })
        .toArray()
        .then(res => {
          this.tableData = res
          this.allData = res
        })
        .then(() => {
          for (let i = 0; i < this.allData.length; i++) {
            this.allData[i].goodLegResult = this.allData[i].data.goodLegResult
            this.allData[i].badLegResult = this.allData[i].data.badLegResult
            this.allData[i].bothLegResult = this.allData[i].data.bothLegResult
          }
        })
        .catch(err => {
          this.$confirm(`${err}。获取数据失败，请点击刷新按钮重试！`, '提示', {
            type: 'warning',
            center: true,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            confirmButtonText: '刷 新',
            cancelButtonText: '返回首页'
          })
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.$router.push({ path: '/home' })
            })
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * @description: 根据日期选择获取表格数据
     */
    getTestData() {
      const db = initDB()
      this.loading = true
      db.test_data
        .where(['userId', 'pdfTime'])
        .between(
          [this.$store.state.currentUserInfo.userId, this.selectDateValue[0]],
          [this.$store.state.currentUserInfo.userId, this.selectDateValue[1]],
          true,
          true
        )
        .toArray()
        .then(res => {
          this.tableData = res
        })
        .catch(err => {
          this.$confirm(`${err}。获取数据失败，请点击刷新按钮重试！`, '提示', {
            type: 'warning',
            center: true,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            confirmButtonText: '刷 新',
            cancelButtonText: '返回首页'
          })
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.$router.push({ path: '/home' })
            })
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * @description: 用户确认选定的值时触发
     * @param {*} value 选择的日期数组
     */
    changeData(value) {
      this.selectDateValue = value
      this.getTestData()
    },

    /**
     * @description: 查看报告
     * @param {*} index
     * @param {*} row
     */
    handleCheckPdf(index, row) {
      this.$router.push({
        path: '/test-print',
        query: {
          userId: JSON.stringify(this.$store.state.currentUserInfo.userId),
          pdfTime: JSON.stringify(row.pdfTime),
          routerName: JSON.stringify('/test-record')
        }
      })
    },

    /**
     * @description: 删除按钮
     * @param {*} index
     * @param {*} row
     */
    handleDelete(index, row) {
      this.$confirm('此操作将"永久删除"该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          const db = initDB()
          db.test_data
            .where({
              userId: row.userId,
              pdfTime: row.pdfTime
            })
            .delete()
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            })
            .then(() => {
              this.getTestData()
            })
            .catch(() => {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            })
        })
        .catch(() => {})
    },

    /**
     * @description: 长期趋势报告
     */
    handleTendencyPdf() {
      this.$router.push({
        path: '/test-secular-trend-print'
      })
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/test-record'),
          duration: JSON.stringify(300)
        }
      })
    },

    /**
     * @description: 返回首页
     */
    handleToHome() {
      this.$router.push({
        path: '/home'
      })
    },

    /**
     * @description: 导出Excel按钮
     */
    handleExportExcel() {
      if (this.allData.length) {
        this.exportExcelLoading = true
        // 此处使用懒加载的方式
        import('@/utils/Export2Excel.js')
          .then(excel => {
            const excelTitle = {
              userId: 'ID',
              userName: '姓名',
              sex: '性别',
              affectedSide: '患侧',
              height: '身高(cm)',
              weight: '体重(kg)',
              birthday: '出生日期',
              hospital: '医院',
              pdfTime: '测量时间',
              goodLegResult: '优势腿(kg)',
              badLegResult: '劣势腿(kg)',
              bothLegResult: '双腿(kg)'
            }
            const tHeader = Object.values(excelTitle)
            // 会根据key键的顺序、属性值等动态变化
            const filterVal = Object.keys(excelTitle)
            const exportData = this.formatJson(filterVal, this.allData)
            excel.export_json_to_excel({
              header: tHeader, // 表头 必填
              data: exportData, // 具体数据 必填
              filename:
                `下肢蹬伸肌力检测软件-单机版-${this.$store.state.currentUserInfo.userName}-所有测试数据 ` +
                this.$moment().format('YYYY-MM-DD HH_mm_ss'), // 导出文件名，非必填
              autoWidth: true, // 自适应列宽，非必填
              bookType: 'xlsx' // 导出格式，非必填
            })
          })
          .then(() => {
            this.$message({
              message: '导出Excel成功',
              type: 'success',
              duration: 3000
            })
          })
          .catch(err => {
            this.$message({
              message: `导出Excel失败：${err}`,
              type: 'error',
              duration: 5000
            })
          })
          .finally(() => {
            this.exportExcelLoading = false
          })
      } else {
        this.$message({
          message: '表格数据不能为空！',
          type: 'error',
          duration: 3000
        })
      }
    },
    /**
     * @description: 数据格式化，将 [{},{},...] => [[],[],...]
     * @param {Array} filterVal key键
     * @param {Array} jsonData [{},{},...]
     * @return {Array} 二维数组 [[],[],...]
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.test-record {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 90%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 26px;
    @include flex(column, stretch, stretch);

    /* 顶部 */
    .top-wrapper {
      margin-bottom: 20px;
      @include flex(row, space-between, center);
    }

    /* 表格 */
    .table-wrapper {
      flex: 1;
    }

    /* 长期趋势 */
    .btn-wrapper {
      margin-top: 20px;
      @include flex(row, center, center);
      .item {
        font-size: 22px;
        margin: 0 50px;
      }
    }
  }
}
</style>
