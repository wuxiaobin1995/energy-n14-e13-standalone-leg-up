<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-06 10:59:30
 * @LastEditTime: 2022-09-09 17:39:10
 * @Description : 基础训练
-->
<template>
  <div class="basics">
    <!-- 语音播放 -->
    <audio ref="audio" controls="controls" hidden :src="audioSrc" />

    <div class="left">
      <!-- 介绍说明 -->
      <div class="introduce">
        <div class="item">训练要求：在进行蹬伸动作时，尽量贴合绿色曲线</div>
        <div class="item">
          动作特点：在动作的向心、离心阶段保持缓慢、匀速，加强下肢的协调能力、促进肌肉力量的增强
        </div>
        <div class="item">推荐组数：2~4组</div>
      </div>
      <!-- 示意图 -->
      <el-image class="img" :src="imgSrc" fit="scale-down"></el-image>
    </div>

    <div class="right">
      <!-- 参数设置 -->
      <div class="set">
        <el-image class="set-img" :src="setBgSrc" fit="scale-down"></el-image>
        <div class="set-item item1">
          <span>单组重复次数：</span>
          <el-input-number
            v-model="num"
            :min="1"
            :max="20"
            :precision="0"
          ></el-input-number>
        </div>
        <div class="set-item item2">
          <span>间隔时间：</span>
          <el-input-number
            v-model="time"
            :min="0"
            :max="5"
            :precision="1"
          ></el-input-number>
        </div>
        <div class="set-item item3">
          <span>负重块(2.5kg/块)：</span>
          <el-input-number
            v-model="bearWeightNum"
            :min="1"
            :max="20"
            :precision="0"
            :step="1"
          ></el-input-number>
        </div>
        <div class="set-item item4">
          <span>训练部位：</span>
          <el-select v-model="trainPart">
            <el-option
              v-for="item in options"
              :key="item.trainPart"
              :value="item.trainPart"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 按钮组 -->
      <div class="btn">
        <el-button
          class="item"
          type="success"
          plain
          icon="el-icon-video-play"
          @click="handleStart"
          >开始训练</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
/* 路径模块 */
import path from 'path'

/* 串口通信库 */
import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'

export default {
  name: 'basics',

  data() {
    return {
      /* 串口相关变量 */
      usbPort: null,
      parser: null,
      scmBaudRate: 115200, // 默认波特率115200

      imgSrc: require('@/assets/img/Train/Select/基础训练.png'),
      setBgSrc: require('@/assets/img/Train/Select/参数设置背景1.png'),

      /* 语音相关 */
      audioOpen: this.$store.state.voiceSwitch,
      audioSrc: path.join(__static, `narrate/mandarin/5-基础训练.mp3`),

      standardDistance: null, // 位移基准值，精确到1mm，有正负，用于调零
      num: 5, // 单组重复次数
      time: 1, // 间隔时间
      bearWeightNum: 1, // 负重块（2.5kg/块）
      trainPart: '左腿', // 训练部位
      options: [
        {
          trainPart: '左腿'
        },
        {
          trainPart: '右腿'
        },
        {
          trainPart: '双腿'
        }
      ]
    }
  },

  created() {
    this.initSerialPort()
  },
  mounted() {
    if (this.audioOpen === true) {
      setTimeout(() => {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      }, 500)
    }
  },
  beforeDestroy() {
    // 关闭串口
    if (this.usbPort) {
      if (this.usbPort.isOpen) {
        this.usbPort.close()
      }
    }
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
              autoOpen: true // 是否自动开启串口
            })
            /* 调用 this.usbPort.open() 成功时触发（开启串口成功） */
            this.usbPort.on('open', () => {})
            /* 调用 this.usbPort.open() 失败时触发（开启串口失败） */
            this.usbPort.on('error', () => {
              this.$confirm(
                `请重新连接USB线，然后点击"刷新页面"按钮！`,
                '串口开启失败',
                {
                  type: 'error',
                  showClose: false,
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                  center: true,
                  confirmButtonText: '刷新页面',
                  cancelButtonText: '返回首页'
                }
              )
                .then(() => {
                  this.handleRefresh()
                })
                .catch(() => {
                  this.$router.push({
                    path: '/home'
                  })
                })
            })

            this.parser = this.usbPort.pipe(new Readline({ delimiter: '\n' }))
            this.parser.on('data', data => {
              // console.log(data) // {String} 00326740032826,125

              const dataArray = data.split(',') // 将原始数据以逗号作为分割符，组成一个数组
              const distancePulse = dataArray[1] // 位移脉冲量

              /* 计算拉绳位移值，精确到1mm，有正负 */
              const distanceData = parseFloat(
                (parseInt(distancePulse) * 1).toFixed(0)
              )
              /* 数据校验 */
              if (!isNaN(distanceData)) {
                if (this.usbPort) {
                  if (this.usbPort.isOpen) {
                    this.usbPort.close()
                  }
                }
                this.standardDistance = distanceData // 位移基准值，用于调零
              }
            })
          } else {
            this.$getLogger('没有检测到USB连接')
            this.$confirm(
              `请重新连接USB线，然后点击"刷新页面"按钮！`,
              '没有检测到USB连接',
              {
                type: 'error',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                center: true,
                confirmButtonText: '刷新页面',
                cancelButtonText: '返回首页'
              }
            )
              .then(() => {
                this.handleRefresh()
              })
              .catch(() => {
                this.$router.push({
                  path: '/home'
                })
              })
          }
        })
        .catch(err => {
          this.$getLogger(err)
          this.$confirm(
            `${err}。请重新连接USB线，然后点击"刷新页面"按钮！`,
            `初始化SerialPort.list失败`,
            {
              type: 'error',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              center: true,
              confirmButtonText: '刷新页面',
              cancelButtonText: '返回首页'
            }
          )
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.$router.push({
                path: '/home'
              })
            })
        })
    },

    /**
     * @description: 开始训练
     */
    handleStart() {
      this.$router.push({
        path: '/train-measure',
        query: {
          standardDistance: JSON.stringify(this.standardDistance),
          num: JSON.stringify(this.num),
          time: JSON.stringify(this.time),
          bearWeight: JSON.stringify(
            parseFloat((this.bearWeightNum * 2.5).toFixed(2))
          ),
          trainPart: JSON.stringify(this.trainPart),
          trainType: JSON.stringify('基础训练'),
          routerName: JSON.stringify('/train-select/basics')
        }
      })
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/train-select/basics'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basics {
  width: 100%;
  height: 100%;
  @include flex(row, space-between, stretch);

  .left {
    flex: 1;
    .introduce {
      .item {
        font-size: 20px;
        margin-bottom: 10px;
      }
    }
    .img {
      margin-top: 50px;
    }
  }

  .right {
    width: 33%;
    @include flex(column, center, center);
    .set {
      position: relative;
      @include flex(row, center, center);
      .set-img {
        width: 100%;
      }
      .set-item {
        width: 78%;
        position: absolute;
        @include flex(row, space-between, center);
      }
      .item1 {
        top: 25%;
      }
      .item2 {
        top: 40%;
      }
      .item3 {
        top: 55%;
      }
      .item4 {
        top: 70%;
      }
    }
    .btn {
      @include flex(column, center, stretch);
      width: 66%;
      margin-top: 30px;
      .item {
        font-size: 34px;
      }
    }
  }
}
</style>
