<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-21 16:55:54
 * @LastEditTime: 2022-09-09 16:51:49
 * @Description : MTT报告打印
-->
<template>
  <div class="mtt-print" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 顶部 -->
    <div class="top-wrapper">
      <div class="info">
        <span class="name">姓名：{{ mttData.userName }}</span>
        <span class="sex">性别：{{ mttData.sex }}</span>
        <span class="type">类型：{{ mttData.trainType }}</span>
        <span class="date">日期：{{ mttData.pdfTime }}</span>
      </div>
      <el-image class="logo" :src="logoSrc" fit="scale-down"></el-image>
    </div>

    <!-- 数值显示 -->
    <div class="value-show">
      <div class="left">
        <div class="num-wrapper">
          单组重复次数：<span class="num">{{ mttData.num }}</span>
        </div>
        <div class="weight-wrapper">
          训练负荷：<span class="weight">{{ mttData.bearWeight }}</span> kg
        </div>
      </div>
      <div class="center">
        <div class="weight-wrapper">
          左负重平均值：<span class="weight">
            {{ mttData.leftWeightAverage }}</span
          >
          kg
        </div>
        <div class="weight-wrapper">
          右负重平均值：<span class="weight">
            {{ mttData.rightWeightAverage }}</span
          >
          kg
        </div>
      </div>
      <div class="right" :style="isShow">
        <div class="text">MTT完成度</div>
        <div>
          <span class="value">{{ mttData.resultRate }}</span> %
        </div>
        <div class="advice">推荐单次MTT完成度达到85%以上</div>
      </div>
    </div>

    <!-- 图形 -->
    <div class="chart">
      <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
    </div>

    <!-- 按钮组 -->
    <div class="btn-print btn">
      <el-button class="item" type="success" @click="handlePrint"
        >保存PDF</el-button
      >
      <el-button class="item" type="danger" @click="handleGoBack"
        >返 回</el-button
      >
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'mtt-print',

  data() {
    return {
      /* 路由传参 */
      userId: JSON.parse(this.$route.query.userId),
      pdfTime: JSON.parse(this.$route.query.pdfTime),
      routerName: JSON.parse(this.$route.query.routerName),

      /* 其他 */
      fullscreenLoading: false, // 全屏加载
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司logo
      isShow: {}, // 是否显示完成率

      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // 横坐标数组

      /* 数据相关 */
      mttData: {} // 训练报告源数据
    }
  },

  mounted() {
    this.getMttData()
  },
  beforeDestroy() {
    // 注销echarts图形自适应监听事件
    window.removeEventListener('resize', this.resizeCharts)
  },

  methods: {
    /**
     * @description: 获取对应 [ID、测试时间] 的MTT报告源数据，并做相关计算
     */
    getMttData() {
      this.fullscreenLoading = true
      const db = initDB()
      db.mtt_data
        .where({
          userId: this.userId,
          pdfTime: this.pdfTime
        })
        .toArray()
        .then(res => {
          this.mttData = res[0]
        })
        .then(() => {
          if (this.mttData.resultRate) {
            this.isShow = {}
          } else {
            this.isShow = {
              display: 'none'
            }
          }
        })
        .then(() => {
          this.initChart()
          // 监听父容器的宽高变化，目的是实现echarts图形自适应父容器的宽高变化
          window.addEventListener('resize', this.resizeCharts)
        })
        .catch(err => {
          this.$confirm(
            `${err}。获取ID为 [${this.userId}] 的用户数据失败，请重试！`,
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
              this.getMttData()
            })
            .catch(() => {
              this.handleGoBack()
            })
        })
        .finally(() => {
          this.fullscreenLoading = false
        })
    },

    /**
     * @description: 图形初始化
     */
    initChart() {
      // 计算横坐标数组
      this.xData = []
      for (let i = 0; i < this.mttData.leftWeightArray.length; i++) {
        this.xData.push(parseFloat((i * 0.1).toFixed(1)))
      }

      this.myChart = this.$echarts.init(document.getElementById('chart'))
      this.option = {
        title: {
          text: '双腿压力曲线',
          textStyle: {
            fontSize: 22
          }
        },
        xAxis: {
          type: 'category',
          name: '单位：秒',
          data: this.xData,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: '单位：kg'
        },
        legend: {
          orient: 'vertical',
          icon: 'roundRect',
          top: '40%',
          right: '0px',
          textStyle: {
            fontSize: 20
          },
          itemWidth: 32,
          itemHeight: 16
        },
        series: [
          {
            name: '左',
            data: this.mttData.leftWeightArray,
            type: 'line',
            // lineStyle: {
            //   color: 'rgba(255, 0, 0, 1)'
            // },
            smooth: true,
            showSymbol: false
          },
          {
            name: '右',
            data: this.mttData.rightWeightArray,
            type: 'line',
            // lineStyle: {
            //   color: 'rgba(0, 255, 0, 1)'
            // },
            smooth: true,
            showSymbol: false
          }
        ],
        animation: false
      }
      this.myChart.setOption(this.option)
    },

    /**
     * @description: 重新刷新画布（即重新获取父容器宽高），目的是实现echarts图形自适应父容器的宽高变化
     */
    resizeCharts() {
      if (this.myChart) {
        this.myChart.resize()
      }
    },

    /**
     * @description: 打印报告
     */
    handlePrint() {
      window.print()
    },

    /**
     * @description: 返回
     */
    handleGoBack() {
      this.$router.push({
        path: this.routerName
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
}

.mtt-print {
  width: 100vw;
  height: 100vh;
  padding: 10px;
  @include flex(column, stretch, stretch);

  /* 顶部 */
  .top-wrapper {
    @include flex(row, space-between, center);
    .logo {
      width: 180px;
    }
    .info {
      font-size: 22px;
      .name {
        margin-right: 30px;
      }
      .sex {
        margin-right: 30px;
      }
      .type {
        margin-right: 30px;
      }
    }
  }

  /* 数值显示 */
  .value-show {
    margin-top: 40px;
    font-size: 28px;
    @include flex(row, space-between, stretch);
    .left {
      .num-wrapper {
        .num {
          border: 2px solid rgba(155, 155, 155, 0.8);
          border-radius: 4px;
          padding: 4px 20px;
        }
      }
      .weight-wrapper {
        margin-top: 40px;
        .weight {
          border: 2px solid rgba(155, 155, 155, 0.8);
          border-radius: 4px;
          padding: 4px 20px;
        }
      }
    }
    .center {
      .weight-wrapper {
        margin-bottom: 26px;
        .weight {
          border: 2px solid rgba(155, 155, 155, 0.8);
          border-radius: 4px;
          padding: 4px 6px;
        }
      }
    }
    .right {
      font-size: 28px;
      @include flex(column, stretch, center);
      .text {
        margin-bottom: 20px;
      }
      .value {
        border: 2px solid rgba(155, 155, 155, 0.8);
        border-radius: 4px;
        padding: 4px 20px;
      }
      .advice {
        margin-top: 20px;
        font-size: 20px;
      }
    }
  }

  /* 图形 */
  .chart {
    margin-top: 60px;
    flex: 1;
    width: 70%;
  }

  /* 按钮组 */
  .btn {
    @include flex(row, center, center);
    .item {
      font-size: 20px;
      margin: 0 50px;
    }
  }
}
</style>
