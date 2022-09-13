<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-07 11:03:06
 * @LastEditTime: 2022-07-20 11:41:37
 * @Description : 训练-具体测量-等长训练专用
-->
<template>
  <div class="train-measure-equal">
    <div class="wrapper">
      <div class="left">
        <!-- 标题 -->
        <div class="title">
          <el-button
            class="item"
            icon="el-icon-location-information"
            type="info"
            round
            >{{ trainType }}</el-button
          >
        </div>
        <!-- 按钮组 -->
        <div class="btn">
          <el-button
            class="item"
            type="success"
            :disabled="!pdfAllow"
            @click="handlePdf"
            >查看报告</el-button
          >
          <el-button class="item" type="danger" @click="handleCancel"
            >返回上一页</el-button
          >
          <el-button
            class="item"
            type="warning"
            :disabled="startAllow"
            v-show="scShow"
            @click="handleStop"
            >暂停</el-button
          >
          <el-button
            class="item"
            type="warning"
            :disabled="startAllow"
            v-show="!scShow"
            @click="handleContinue"
            >继续</el-button
          >
          <el-button
            class="item"
            type="primary"
            :disabled="!startAllow"
            @click="handleStart"
            >开始训练</el-button
          >
        </div>
      </div>

      <div class="right">
        <div class="top">
          <div class="both-press" v-if="trainPart === '双腿' ? true : false">
            <div class="text">双侧实时压力变化</div>
            <div class="press">
              <div :style="activeLeft" class="left-press">{{ leftWeight }}</div>
              <div :style="activeRight" class="right-press">
                {{ rightWeight }}
              </div>
            </div>
          </div>

          <div class="num-wrapper">
            <div class="title">剩余次数</div>
            <div class="num">
              <span class="now-num">{{ nowNum }}</span> / {{ num }}
            </div>
          </div>
        </div>
        <div class="chart">
          <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* 串口通信库 */
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

/* 数据库 */
import { initDB } from '@/db/index.js'

export default {
  name: 'train-measure-equal',

  data() {
    return {
      /* 路由传参 */
      num: JSON.parse(this.$route.query.num), // 单组重复次数
      bearWeight: JSON.parse(this.$route.query.bearWeight), // 负重（kg）
      trainPart: JSON.parse(this.$route.query.trainPart), // 训练部位（左腿、右腿、双腿）
      trainType: JSON.parse(this.$route.query.trainType), // 训练类型
      routerName: JSON.parse(this.$route.query.routerName), // 上一个的路由地址

      /* 串口相关变量 */
      usbPort: null,
      parser: null,
      scmBaudRate: 115200, // 默认波特率115200

      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // 横坐标数组

      /* 控制相关 */
      startAllow: true, // 开始按钮的禁用与否
      scShow: true, // 暂停、继续按钮的显隐
      pdfAllow: false, // 查看PDF按钮的禁用与否
      isUp: false, // 是否在直线上

      /* 其他 */
      leftK: 0, // 左K
      rightK: 0, // 右K
      leftStandard: 0, // 左调零值
      rightStandard: 0, // 右调零值
      leftWeight: 0, // 左负重（kg），精确到0.1kg
      rightWeight: 0, // 右负重（kg），精确到0.1kg
      addWeight: 0, // 左右合计负重（kg），精确到0.1kg
      leftWeightArray: [], // 左负重数组
      rightWeightArray: [], // 右负重数组
      addWeightArray: [], // 左右合计负重数组
      leftWeightAverage: 0, // 左负重平均值（kg），精确到0.1kg
      rightWeightAverage: 0, // 右负重平均值（kg），精确到0.1kg
      nowNum: 0, // 目前的次数
      pdfTime: null, // 该次训练完成时间

      activeLeft: {}, // 左侧实时压力边框红色高亮
      activeRight: {}, // 右侧实时压力边框红色高亮

      showWeight: 0, // 展示的负重（kg）
      showWeightArray: [] // 展示的负重数组
    }
  },

  created() {
    this.leftK = parseFloat(window.localStorage.getItem('leftK'))
    this.rightK = parseFloat(window.localStorage.getItem('rightK'))
    this.leftStandard = this.$store.state.zeroStandard.leftStandard
    this.rightStandard = this.$store.state.zeroStandard.rightStandard

    this.initSerialPort()
  },
  mounted() {
    this.initChart() // 图形初始化
    // 监听父容器的宽高变化，目的是实现echarts图形自适应父容器的宽高变化
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy() {
    // 关闭串口
    if (this.usbPort) {
      if (this.usbPort.isOpen) {
        this.usbPort.close()
      }
    }
    // 注销echarts图形自适应监听事件
    window.removeEventListener('resize', this.resizeCharts)
  },

  methods: {
    /**
     * @description: 初始化串口对象
     */
    initSerialPort() {
      SerialPort.list()
        .then(ports => {
          /* 遍历设备的USB串口，目标设备需安装驱动 */
          let comPath = ''
          for (const port of ports) {
            if (/^USB/.test(port.pnpId)) {
              comPath = port.path
              break
            }
          }

          /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
          if (comPath) {
            /**
             * @description: 创建串口实例
             * @param {String} comPath 串行端口的系统路径。例如：在Mac、Linux上的/dev/tty.XXX或Windows上的COM1
             * @param {Object} 配置项
             */
            this.usbPort = new SerialPort(comPath, {
              baudRate: this.scmBaudRate, // 默认波特率115200
              autoOpen: false // 是否自动开启串口
            })
            /* 调用 this.usbPort.open() 成功时触发（开启串口成功） */
            this.usbPort.on('open', () => {})
            /* 调用 this.usbPort.open() 失败时触发（开启串口失败） */
            this.usbPort.on('error', () => {
              this.$alert(
                `请重新连接USB线，然后点击"返回上一页"按钮！`,
                '串口开启失败',
                {
                  type: 'error',
                  showClose: false,
                  center: true,
                  confirmButtonText: '返回上一页',
                  callback: () => {
                    this.handleCancel()
                  }
                }
              )
            })

            this.parser = this.usbPort.pipe(new Readline({ delimiter: '\n' }))
            this.parser.on('data', data => {
              // console.log(data) // {String} 00326740032826,125

              const dataArray = data.split(',') // 将原始数据以逗号作为分割符，组成一个数组
              const weightDigital = dataArray[0] // 负重数字量，比如00327640032720
              // const distancePulse = dataArray[1] // 位移脉冲量

              /* 暂停或继续按钮 */
              if (this.scShow) {
                /* 计算左负重、右负重、合负重，精确到0.1kg */
                this.leftWeight = parseFloat(
                  (
                    (parseInt(weightDigital.slice(2, 7)) - this.leftStandard) /
                    -this.leftK
                  ).toFixed(1)
                )
                this.rightWeight = parseFloat(
                  (
                    (parseInt(weightDigital.slice(9, 14)) -
                      this.rightStandard) /
                    -this.rightK
                  ).toFixed(1)
                )
                this.addWeight = parseFloat(
                  (this.leftWeight + this.rightWeight).toFixed(1)
                )
                if (this.leftWeight < 0) {
                  this.leftWeight = 0
                }
                if (this.rightWeight < 0) {
                  this.rightWeight = 0
                }
                if (this.addWeight < 0) {
                  this.addWeight = 0
                }
                /* 验证数据是否为数字类型 */
                if (
                  !isNaN(this.leftWeight) &&
                  !isNaN(this.rightWeight) &&
                  !isNaN(this.addWeight)
                ) {
                  /* 过滤掉突变值 */
                  if (
                    this.leftWeight <= 500 &&
                    this.rightWeight <= 500 &&
                    this.addWeight <= 1000
                  ) {
                    /* 数据插入数组中 */
                    this.leftWeightArray.push(this.leftWeight)
                    this.rightWeightArray.push(this.rightWeight)
                    this.addWeightArray.push(this.addWeight)

                    /* 左右负重提示部分 */
                    // 左右负重，任意一个大于设定的值时有提示
                    let maxVal = parseFloat(
                      (this.leftWeight + this.rightWeight) * 0.55
                    )
                    // 偏大的显示红色边框
                    if (this.leftWeight > maxVal) {
                      this.activeLeft = {
                        border: '2px solid red'
                      }
                      this.activeRight = {}
                    } else if (this.rightWeight > maxVal) {
                      this.activeRight = {
                        border: '2px solid red'
                      }
                      this.activeLeft = {}
                    } else {
                      this.activeLeft = {}
                      this.activeRight = {}
                    }

                    /* 实时渲染图形 */
                    if (this.trainPart === '左腿') {
                      this.showWeight = this.leftWeight
                      this.showWeightArray.push(this.showWeight)
                      this.option.series[0].data = this.showWeightArray
                    } else if (this.trainPart === '右腿') {
                      this.showWeight = this.rightWeight
                      this.showWeightArray.push(this.showWeight)
                      this.option.series[0].data = this.showWeightArray
                    } else if (this.trainPart === '双腿') {
                      this.showWeight = this.addWeight
                      this.showWeightArray.push(this.showWeight)
                      this.option.series[0].data = this.showWeightArray
                    }
                    if (this.showWeightArray.length > 100) {
                      this.showWeightArray = []
                      this.option.series[0].data = this.showWeightArray
                    }
                    this.myChart.setOption(this.option)

                    /* 判断完成次数逻辑 */
                    // 此时向上穿过参考曲线
                    if (this.showWeight > this.bearWeight) {
                      this.isUp = true
                    }
                    if (this.isUp) {
                      // 此时向下穿过参考曲线
                      if (this.showWeight < this.bearWeight) {
                        this.isUp = false
                        this.nowNum += 1
                      }
                    }

                    /* 该次训练完成 */
                    if (this.nowNum === this.num) {
                      if (this.usbPort) {
                        if (this.usbPort.isOpen) {
                          this.usbPort.close()

                          this.startAllow = true

                          /* 计算左、右负重平均值 */
                          if (this.leftWeightArray.length) {
                            let leftSum = 0
                            for (
                              let i = 0;
                              i < this.leftWeightArray.length;
                              i++
                            ) {
                              leftSum += this.leftWeightArray[i]
                            }
                            this.leftWeightAverage = parseFloat(
                              (leftSum / this.leftWeightArray.length).toFixed(1)
                            )
                          } else {
                            this.leftWeightAverage = 0
                          }
                          if (this.rightWeightArray.length) {
                            let rightSum = 0
                            for (
                              let i = 0;
                              i < this.rightWeightArray.length;
                              i++
                            ) {
                              rightSum += this.rightWeightArray[i]
                            }
                            this.rightWeightAverage = parseFloat(
                              (rightSum / this.rightWeightArray.length).toFixed(
                                1
                              )
                            )
                          } else {
                            this.rightWeightAverage = 0
                          }

                          /* 保存到数据库 */
                          this.pdfTime = this.$moment().format(
                            'YYYY-MM-DD HH:mm:ss'
                          )
                          const db = initDB()
                          db.train_data
                            .add({
                              userId: this.$store.state.currentUserInfo.userId,
                              userName:
                                this.$store.state.currentUserInfo.userName,
                              sex: this.$store.state.currentUserInfo.sex,
                              affectedSide:
                                this.$store.state.currentUserInfo.affectedSide,
                              height: this.$store.state.currentUserInfo.height,
                              weight: this.$store.state.currentUserInfo.weight,
                              birthday:
                                this.$store.state.currentUserInfo.birthday,
                              maxDistance:
                                this.$store.state.currentUserInfo.maxDistance,
                              trainPart: this.trainPart,
                              trainType: this.trainType,
                              bearWeight: this.bearWeight,
                              num: this.num,
                              leftWeightArray: this.leftWeightArray,
                              rightWeightArray: this.rightWeightArray,
                              addWeightArray: this.addWeightArray,
                              leftWeightAverage: this.leftWeightAverage,
                              rightWeightAverage: this.rightWeightAverage,
                              pdfTime: this.pdfTime
                            })
                            .then(() => {
                              this.$message({
                                message: '数据保存成功',
                                type: 'success',
                                duration: 2000
                              })
                            })
                            .catch(() => {
                              this.$alert(
                                `请重新连接USB线，然后点击"返回上一页"按钮，重新训练！`,
                                '数据保存失败',
                                {
                                  type: 'error',
                                  showClose: false,
                                  center: true,
                                  confirmButtonText: '返回上一页',
                                  callback: () => {
                                    this.handleCancel()
                                  }
                                }
                              )
                            })
                            .finally(() => {
                              if (
                                this.trainPart === '左腿' ||
                                this.trainPart === '右腿'
                              ) {
                                this.pdfAllow = false
                              } else {
                                this.pdfAllow = true
                              }
                            })
                        }
                      }
                    }
                  }
                }
              }
            })
          } else {
            this.$getLogger('没有检测到USB连接')
            this.$alert(
              `请重新连接USB线，然后点击"返回上一页"按钮！`,
              '没有检测到USB连接',
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '返回上一页',
                callback: () => {
                  this.handleCancel()
                }
              }
            )
          }
        })
        .catch(err => {
          this.$getLogger(err)
          this.$alert(
            `${err}。请重新连接USB线，然后点击"返回上一页"按钮！`,
            '初始化SerialPort.list失败',
            {
              type: 'error',
              showClose: false,
              center: true,
              confirmButtonText: '返回上一页',
              callback: () => {
                this.handleCancel()
              }
            }
          )
        })
    },

    /**
     * @description: 图形初始化
     */
    initChart() {
      // 计算横坐标数组、参考曲线
      const referenceLine = []
      this.xData = []
      for (let i = 0; i < 101; i++) {
        this.xData.push(parseFloat((i * 0.1).toFixed(1)))
        referenceLine.push(this.bearWeight)
      }

      this.myChart = this.$echarts.init(document.getElementById('chart'))
      this.option = {
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
          name: '单位：kg',
          max: this.bearWeight * 1.5
        },
        // tooltip: {},
        series: [
          {
            data: [],
            type: 'line',
            name: '轨迹曲线',
            lineStyle: {
              color: 'rgba(255, 0, 0, 1)'
            },
            smooth: true,
            showSymbol: false
          },
          {
            data: referenceLine,
            type: 'line',
            name: '参考曲线',
            smooth: false,
            showSymbol: false,
            lineStyle: {
              opacity: 0.8
            }
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
     * @description: 开始按钮
     */
    handleStart() {
      this.startAllow = false
      this.pdfAllow = false
      this.isUp = false

      this.leftWeightArray = []
      this.rightWeightArray = []
      this.addWeightArray = []
      this.leftWeightAverage = 0
      this.rightWeightAverage = 0
      this.showWeight = 0
      this.showWeightArray = []
      this.nowNum = 0
      this.pdfTime = null

      if (this.usbPort) {
        if (!this.usbPort.isOpen) {
          this.usbPort.open()
        }
      }
    },

    /**
     * @description: 暂停按钮
     */
    handleStop() {
      this.scShow = false
    },

    /**
     * @description: 继续按钮
     */
    handleContinue() {
      this.scShow = true
    },

    /**
     * @description: 查看PDF按钮，单腿没有报告，只有双腿有报告
     */
    handlePdf() {
      this.$router.push({
        path: '/train-print',
        query: {
          userId: JSON.stringify(this.$store.state.currentUserInfo.userId),
          pdfTime: JSON.stringify(this.pdfTime),
          routerName: JSON.stringify(this.routerName)
        }
      })
    },

    /**
     * @description: 返回上一页
     */
    handleCancel() {
      this.$router.push({
        path: this.routerName
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.train-measure-equal {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 96%;
    height: 96%;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 20px;
    @include flex(row, space-between, stretch);

    .left {
      position: relative;
      width: 15%;
      .title {
        position: absolute;
        left: -70px;
        top: -15px;
        @include flex(row, center, center);
        .item {
          width: 200px;
          font-size: 26px;
        }
      }
      .btn {
        height: 100%;
        width: 100%;
        @include flex(column, flex-end, center);
        .item {
          margin: 20px 0 0 0;
          width: 190px;
        }
      }
    }

    .right {
      flex: 1;
      @include flex(column, stretch, center);
      .top {
        width: 100%;
        height: 80px;
        border: 1px solid rgb(140, 180, 134);
        box-shadow: 0 0 6px #929292;
        border-radius: 16px;
        @include flex(row, space-around, center);
        padding-bottom: 5px;
        .both-press {
          @include flex(column, center, center);
          .text {
            font-size: 22px;
            margin-bottom: 5px;
          }
          .press {
            @include flex(row, center, center);
            .left-press,
            .right-press {
              @include flex(row, center, center);
              border: 2px solid rgba(0, 0, 0, 0.5);
              border-radius: 10px;
              padding: 4px 10px;
              width: 70px;
              margin: 0 10px;
            }
          }
        }
        .num-wrapper {
          @include flex(column, center, center);
          .title {
            font-size: 22px;
            margin-bottom: 5px;
          }
          .num {
            font-size: 18px;
            .now-num {
              background-color: rgba(155, 155, 155, 0.6);
              border-radius: 4px;
              padding: 2px 10px;
            }
          }
        }
      }
      .chart {
        flex: 1;
        width: 100%;
      }
    }
  }
}
</style>
