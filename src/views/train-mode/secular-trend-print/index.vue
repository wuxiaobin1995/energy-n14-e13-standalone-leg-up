<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-25 15:34:12
 * @LastEditTime: 2022-07-25 16:27:46
 * @Description : 训练-长期趋势报告
-->
<template>
  <div class="train-secular-trend-print">
    <!-- 顶部 -->
    <div class="text-print top">
      <div class="info">
        <div class="text">
          ID：{{ this.$store.state.currentUserInfo.userId }}
        </div>
        <div class="text">
          用户名：{{ this.$store.state.currentUserInfo.userName }}
        </div>
        <div class="text">
          性别：{{ this.$store.state.currentUserInfo.sex }}
        </div>
      </div>

      <el-image class="logo" :src="logoSrc" fit="scale-down"></el-image>
    </div>

    <!-- 图形 -->
    <div class="chart-print chart-wrapper">
      <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
    </div>

    <!-- 按钮组 -->
    <div class="btn-print btn-wrapper">
      <el-button type="primary" class="yes" @click="handlePrint"
        >保存pdf</el-button
      >
      <el-button type="danger" class="cancel" @click="handleCancel"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'train-secular-trend-print',

  data() {
    return {
      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // X轴数组

      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司logo

      /* 数值相关变量 */
      leftAverageResultArray: [], // 左平均负重数组
      rightAverageResultArray: [] // 右平均负重数组
    }
  },

  mounted() {
    this.initData()
  },

  methods: {
    /**
     * @description: 用户数据获取
     */
    initData() {
      const db = initDB()
      db.train_data
        .where({
          userId: this.$store.state.currentUserInfo.userId
        })
        .toArray()
        .then(res => {
          // 仅取双腿的
          for (let i = 0; i < res.length; i++) {
            const item = res[i]
            if (item.trainPart === '双腿') {
              this.xData.push(item.pdfTime)
              this.leftAverageResultArray.push(item.leftWeightAverage)
              this.rightAverageResultArray.push(item.rightWeightAverage)
            }
          }
        })
        .then(() => {
          this.initChart() // 图形绘制
        })
        .catch(err => {
          this.$confirm(
            `${err}。获取ID为 [${this.$store.state.currentUserInfo.userId}] 的用户数据失败，请重试！`,
            '提示',
            {
              type: 'warning',
              center: true,
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              confirmButtonText: '重 试',
              cancelButtonText: '返 回'
            }
          )
            .then(() => {
              this.initData()
            })
            .catch(() => {
              this.handleCancel()
            })
        })
    },

    /**
     * @description: 图形绘制
     */
    initChart() {
      this.myChart = this.$echarts.init(document.getElementById('chart'))
      this.option = {
        title: {
          text: '训练长期趋势报告',
          left: 'center',
          textStyle: {
            fontSize: 38
          }
        },
        grid: {
          left: '4%',
          right: '16%'
        },
        xAxis: {
          type: 'category',
          name: '测试日期',
          data: this.xData
        },
        yAxis: {
          type: 'value',
          name: '单位：kg',
          nameGap: 26
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'roundRect',
          orient: 'vertical',
          right: '0%',
          top: 'middle',
          itemGap: 30,
          itemWidth: 70,
          itemHeight: 30
        },
        series: [
          {
            name: '左',
            data: this.leftAverageResultArray,
            type: 'line',
            smooth: false,
            showSymbol: false
          },
          {
            name: '右',
            data: this.rightAverageResultArray,
            type: 'line',
            smooth: false,
            showSymbol: false
          }
        ],
        animation: false
      }
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 打印pdf
     */
    handlePrint() {
      window.print()
    },

    /**
     * @description: 返回数据记录页
     */
    handleCancel() {
      this.$router.push({
        path: '/train-record'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 打印时触发的CSS */
@media print {
  @page {
    // size: portrait; // 纵向打印
    size: landscape; // 横向打印
  }
  .btn-print {
    display: none !important;
  }
  .chart-print {
    margin-top: 140px !important;
  }
  .text-print {
    font-size: 36px !important;
  }
}

.train-secular-trend-print {
  width: 100%;
  height: 100%;
  padding: 40px 20px;
  @include flex(column, stretch, center);

  /* 顶部 */
  .top {
    width: 100%;
    font-size: 24px;
    @include flex(row, space-between, center);
    .info {
      @include flex(row, stretch, stretch);
      .text {
        margin-right: 60px;
      }
    }
    .logo {
      width: 200px;
    }
  }

  /* 图形 */
  .chart-wrapper {
    margin-top: 40px;
    flex: 1;
    width: 90%;
  }

  /* 按钮组 */
  .btn-wrapper {
    @include flex(row, center, stretch);
    .yes {
      font-size: 30px;
      margin-right: 40px;
    }
    .cancel {
      font-size: 30px;
      margin-left: 40px;
    }
  }
}
</style>
