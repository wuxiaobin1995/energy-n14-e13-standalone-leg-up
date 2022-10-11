<!--
 * @Author      : Mr.bin
 * @Date        : 2022-06-30 15:03:28
 * @LastEditTime: 2022-10-11 14:39:13
 * @Description : 测试报告打印
-->
<template>
  <div class="test-print" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="wrapper one">
      <el-image class="logo" :src="logoSrc" fit="scale-down"></el-image>

      <div class="title">下肢蹬伸等长肌力测试报告图</div>
      <div class="hospital">{{ this.testData.hospital }}</div>

      <div class="divider"></div>

      <div class="info">
        <div class="item">姓名：{{ this.testData.userName }}</div>
        <div class="item">出生日期：{{ this.testData.birthday }}</div>
        <div class="item">性别：{{ this.testData.sex }}</div>
        <div class="item">测试日期：{{ this.testData.pdfTime }}</div>
      </div>

      <div class="main">
        <div class="top">
          <!-- 左腿 -->
          <div class="item">
            <div class="left">
              <div class="chart">
                <div
                  id="chartLeft"
                  :style="{ width: '100%', height: '100%' }"
                ></div>
              </div>
            </div>
            <div class="right">
              <el-image
                class="muscle muscle-print"
                :src="leftLegSrc"
                fit="scale-down"
              ></el-image>
              <div class="value value-print">
                <div>测量值：{{ leftValue }} kg</div>
                <div>推荐值：{{ singleRecommendedValue }} kg</div>
              </div>
            </div>
          </div>
          <!-- 右腿 -->
          <div class="item">
            <div class="left">
              <div class="chart">
                <div
                  id="chartRight"
                  :style="{ width: '100%', height: '100%' }"
                ></div>
              </div>
            </div>
            <div class="right">
              <el-image
                class="muscle muscle-print"
                :src="rightLegSrc"
                fit="scale-down"
              ></el-image>
              <div class="value value-print">
                <div>测量值：{{ rightValue }} kg</div>
                <div>推荐值：{{ singleRecommendedValue }} kg</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mini-divider"></div>
        <div class="bottom">
          <!-- 双腿 -->
          <div class="item">
            <div class="left">
              <div class="chart">
                <div
                  id="chartBoth"
                  :style="{ width: '100%', height: '100%' }"
                ></div>
              </div>
            </div>
            <div class="right">
              <el-image
                class="muscle muscle-print"
                :src="bothLegSrc"
                fit="scale-down"
              ></el-image>
              <div class="value value-print">
                <div>测量值：{{ bothValue }} kg</div>
                <div>推荐值：{{ bothRecommendedValue }} kg</div>
              </div>
            </div>
          </div>
          <!-- 肌力比 -->
          <div class="item">
            <div class="left">
              <div class="chart">
                <div
                  id="chartMuscleRatio"
                  :style="{ width: '100%', height: '100%' }"
                ></div>
              </div>
            </div>
            <div class="right">
              <!-- 此图是占位用的，并不显示 -->
              <el-image
                :style="{ opacity: 0 }"
                class="muscle muscle-print"
                :src="bothLegSrc"
                fit="scale-down"
              ></el-image>
              <div class="value value-print">
                <div>肌力比：{{ newLeftValue }}:{{ newRightValue }}</div>
                <div>推荐比：100:100</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper two">
      <el-image class="logo" :src="logoSrc" fit="scale-down"></el-image>

      <div class="title">下肢蹬伸等长肌力测试报告表</div>
      <div class="hospital">{{ this.testData.hospital }}</div>

      <div class="divider"></div>

      <div class="info">
        <div class="item">姓名：{{ this.testData.userName }}</div>
        <div class="item">出生日期：{{ this.testData.birthday }}</div>
        <div class="item">性别：{{ this.testData.sex }}</div>
        <div class="item">测试日期：{{ this.testData.pdfTime }}</div>
      </div>

      <div class="main">
        <!-- 表格 -->
        <div class="table">
          <table class="item" border="2">
            <tr :style="{ height: '60px' }" bgcolor="#E7E6E6" align="center">
              <td rowspan="2">测量名称</td>
              <td colspan="3">绝对肌力值</td>
              <td colspan="3">肌力比</td>
              <td colspan="2">总测量成绩</td>
            </tr>
            <tr :style="{ height: '60px' }" bgcolor="#E7E6E6" align="center">
              <td>测量值(kg)</td>
              <td>推荐值(kg)</td>
              <td>得分</td>
              <td>测量值</td>
              <td>推荐值</td>
              <td>得分</td>
              <td>得分</td>
              <td>训练推荐</td>
            </tr>
            <tr align="center">
              <td bgcolor="#E7E6E6">左腿蹬伸</td>
              <td>{{ leftValue }}</td>
              <td>{{ singleRecommendedValue }}</td>
              <td>{{ leftScore }}({{ leftEvaluateText }})</td>
              <td rowspan="2">{{ newLeftValue }} : {{ newRightValue }}</td>
              <td rowspan="2">100 : 100</td>
              <td rowspan="2">
                {{ muscleRatioScore }}({{ muscleRatioEvaluateText }})
              </td>
              <td rowspan="2">
                {{
                  parseFloat(
                    ((leftScore + rightScore + muscleRatioScore) / 3).toFixed(1)
                  )
                }}
              </td>
              <td>+{{ leftTrainRecommend }}%</td>
            </tr>
            <tr align="center">
              <td bgcolor="#E7E6E6">右腿蹬伸</td>
              <td>{{ rightValue }}</td>
              <td>{{ singleRecommendedValue }}</td>
              <td>{{ rightScore }}({{ rightEvaluateText }})</td>
              <td>+{{ rightTrainRecommend }}%</td>
            </tr>
            <tr align="center">
              <td bgcolor="#E7E6E6">双腿蹬伸</td>
              <td>{{ bothValue }}</td>
              <td>{{ bothRecommendedValue }}</td>
              <td>{{ bothScore }}({{ bothEvaluateText }})</td>
              <td colspan="3">/</td>
              <td colspan="3">/</td>
            </tr>
          </table>
        </div>
        <!-- 建议 -->
        <div class="advice">
          <div class="advice__title">训练建议：</div>
          <div
            class="advice__item"
            v-show="leftEvaluateText === '差' || leftEvaluateText === '较差'"
          >
            左腿蹬伸力量{{ leftEvaluateText }}，需要加强锻炼，推荐增加{{
              leftTrainRecommend
            }}%的肌力。
          </div>
          <div
            class="advice__item"
            v-show="rightEvaluateText === '差' || rightEvaluateText === '较差'"
          >
            右腿蹬伸力量{{ rightEvaluateText }}，需要加强锻炼，推荐增加{{
              rightTrainRecommend
            }}%的肌力。
          </div>
        </div>
      </div>

      <div class="btn-print btn">
        <el-button class="item" type="primary" @click="handlePrint"
          >打 印</el-button
        >
        <el-button class="item" type="danger" @click="handleGoBack"
          >返 回</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'test-print',

  data() {
    return {
      /* 路由传参 */
      userId: JSON.parse(this.$route.query.userId),
      pdfTime: JSON.parse(this.$route.query.pdfTime),
      routerName: JSON.parse(this.$route.query.routerName),

      /* 其他 */
      fullscreenLoading: false, // 全屏加载
      logoSrc: require('@/assets/img/Company_Logo/logo_1.png'), // 公司logo
      leftLegSrc: '', // 左腿肌肉图
      rightLegSrc: '', // 右腿肌肉图
      bothLegSrc: '', // 双腿肌肉图

      /* 图形相关变量 */
      myChartLeft: null,
      optionLeft: {},
      myChartRight: null,
      optionRight: {},
      myChartBoth: null,
      optionBoth: {},
      myChartMuscleRatio: null,
      optionMuscleRatio: {},

      /* 数据相关 */
      testData: {}, // 测试报告源数据

      singleRecommendedValue: null, // 单腿推荐值(kg)，精确到0.1kg
      bothRecommendedValue: null, // 双腿推荐值(kg)，精确到0.1kg
      leftValue: null, // 左腿测量值(kg)，精确到0.1kg
      rightValue: null, // 右腿测量值(kg)，精确到0.1kg
      bothValue: null, // 双腿测量值(kg)，精确到0.1kg
      leftScore: null, // 左腿得分【0~10】
      rightScore: null, // 右腿得分【0~10】
      bothScore: null, // 双腿得分【0~10】
      muscleRatioScore: null, // 肌力比得分【0~10】
      leftEvaluateText: '', // 左腿评价【优、良、中、较差、差】
      rightEvaluateText: '', // 右腿评价【优、良、中、较差、差】
      bothEvaluateText: '', // 双腿评价【优、良、中、较差、差】
      muscleRatioEvaluateText: '', // 肌力比评价【优、良、中、较差、差】
      newLeftValue: null, // 经过转换的值，用于肌力比求差值，取整数
      newRightValue: null, // 经过转换的值，用于肌力比求差值，取整数
      leftTrainRecommend: null, // 左腿训练推荐增加百分比
      rightTrainRecommend: null // 右腿训练推荐增加百分比
    }
  },

  mounted() {
    this.getTestData()
  },

  methods: {
    /**
     * @description: 获取对应 [ID、测试时间] 的测试报告源数据，并做相关计算
     */
    getTestData() {
      this.fullscreenLoading = true
      const db = initDB()
      db.test_data
        .where({
          userId: this.userId,
          pdfTime: this.pdfTime
        })
        .toArray()
        .then(res => {
          this.testData = res[0]
        })
        .then(() => {
          /* 计算单腿、双腿推荐值 */
          const sex = this.testData.sex // 性别
          const height = parseFloat((this.testData.height / 100).toFixed(2)) // 身高(m)
          const weight = this.testData.weight // 体重(kg)
          const currentAge = this.testData.currentAge // 当时的岁数
          const BMI = parseInt((weight / height ** 2).toFixed(0))
          const sqrtWeight = Math.sqrt(weight / 23) // 开根号
          if (sex === '男') {
            if (currentAge >= 41) {
              if (BMI > 23) {
                // 公式1
                this.singleRecommendedValue =
                  (1.1 * weight - ((height - sqrtWeight) / sqrtWeight) * 140) *
                  (1 - (currentAge - 40) * 0.01)
              } else if (BMI === 23) {
                // 公式2
                this.singleRecommendedValue =
                  1.1 * weight * (1 - (currentAge - 40) * 0.01)
              } else if (BMI < 23) {
                // 公式3
                this.singleRecommendedValue =
                  (1.1 * weight + ((height - sqrtWeight) / sqrtWeight) * 140) *
                  (1 - (currentAge - 40) * 0.01)
              }
            } else {
              if (BMI > 23) {
                // 公式4
                this.singleRecommendedValue =
                  1.1 * weight - ((height - sqrtWeight) / sqrtWeight) * 140
              } else if (BMI === 23) {
                // 公式5
                this.singleRecommendedValue = 1.1 * weight
              } else if (BMI < 23) {
                // 公式6
                this.singleRecommendedValue =
                  1.1 * weight + ((height - sqrtWeight) / sqrtWeight) * 140
              }
            }
          } else if (sex === '女') {
            if (currentAge >= 41) {
              if (BMI > 23) {
                // 公式7
                this.singleRecommendedValue =
                  (1.1 * weight - ((height - sqrtWeight) / sqrtWeight) * 140) *
                  0.8 *
                  (1 - (currentAge - 40) * 0.01)
              } else if (BMI === 23) {
                // 公式8
                this.singleRecommendedValue =
                  1.1 * weight * 0.8 * (1 - (currentAge - 40) * 0.01)
              } else if (BMI < 23) {
                // 公式9
                this.singleRecommendedValue =
                  (1.1 * weight + ((height - sqrtWeight) / sqrtWeight) * 140) *
                  0.8 *
                  (1 - (currentAge - 40) * 0.01)
              }
            } else {
              if (BMI > 23) {
                // 公式10
                this.singleRecommendedValue =
                  (1.1 * weight - ((height - sqrtWeight) / sqrtWeight) * 140) *
                  0.8
              } else if (BMI === 23) {
                // 公式11
                this.singleRecommendedValue = 1.1 * weight * 0.8
              } else if (BMI < 23) {
                // 公式12
                this.singleRecommendedValue =
                  (1.1 * weight + ((height - sqrtWeight) / sqrtWeight) * 140) *
                  0.8
              }
            }
          }
          this.singleRecommendedValue = parseFloat(
            this.singleRecommendedValue.toFixed(1)
          )
          this.bothRecommendedValue = parseFloat(
            (this.singleRecommendedValue * 1.5).toFixed(1)
          )

          /* 测量数值处理一下 */
          if (this.$store.state.currentUserInfo.affectedSide === '左') {
            this.leftValue = this.testData.data.badLegResult
            this.rightValue = this.testData.data.goodLegResult
          } else {
            this.leftValue = this.testData.data.goodLegResult
            this.rightValue = this.testData.data.badLegResult
          }
          this.bothValue = this.testData.data.bothLegResult
          // 保留一位小数
          this.leftValue = parseFloat(this.leftValue.toFixed(1))
          this.rightValue = parseFloat(this.rightValue.toFixed(1))
          this.bothValue = parseFloat(this.bothValue.toFixed(1))

          /* 计算左腿、右腿、双腿、肌力比的得分 */
          /* 左腿得分 */
          if (this.leftValue <= this.singleRecommendedValue) {
            this.leftScore = (this.leftValue / this.singleRecommendedValue) * 5
          } else if (
            this.leftValue > this.singleRecommendedValue &&
            this.leftValue < 1.8 * weight
          ) {
            this.leftScore =
              ((this.leftValue - this.singleRecommendedValue) /
                (1.8 * weight - this.singleRecommendedValue)) *
                5 +
              5
          } else if (this.leftValue >= 1.8 * weight) {
            this.leftScore = 10
          }
          /* 右腿得分 */
          if (this.rightValue <= this.singleRecommendedValue) {
            this.rightScore =
              (this.rightValue / this.singleRecommendedValue) * 5
          } else if (
            this.rightValue > this.singleRecommendedValue &&
            this.rightValue < 1.8 * weight
          ) {
            this.rightScore =
              ((this.rightValue - this.singleRecommendedValue) /
                (1.8 * weight - this.singleRecommendedValue)) *
                5 +
              5
          } else if (this.rightValue >= 1.8 * weight) {
            this.rightScore = 10
          }
          /* 双腿得分 */
          if (this.bothValue <= this.bothRecommendedValue) {
            this.bothScore = (this.bothValue / this.bothRecommendedValue) * 5
          } else if (
            this.bothValue > this.bothRecommendedValue &&
            this.bothValue < 3 * weight
          ) {
            this.bothScore =
              ((this.bothValue - this.bothRecommendedValue) /
                (3 * weight - this.bothRecommendedValue)) *
                5 +
              5
          } else if (this.bothValue >= 3 * weight) {
            this.bothScore = 10
          }
          /* 肌力比得分 */
          let rate = null
          if (this.leftValue > this.rightValue) {
            this.newLeftValue = 100
            rate = 100 / this.leftValue
            this.newRightValue = parseInt((this.rightValue * rate).toFixed(0))
          } else if (this.leftValue < this.rightValue) {
            this.newRightValue = 100
            rate = 100 / this.rightValue
            this.newLeftValue = parseInt((this.leftValue * rate).toFixed(0))
          } else {
            this.newLeftValue = 100
            this.newRightValue = 100
          }
          const diff = Math.abs(this.newLeftValue - this.newRightValue) // 计算差值
          if (diff <= 5) {
            this.muscleRatioScore = 10
          } else if (diff >= 5.1 && diff <= 15) {
            this.muscleRatioScore = parseFloat(
              (10 - (diff / 15) * 5).toFixed(1)
            )
          } else if (diff >= 15.1 && diff <= 56) {
            this.muscleRatioScore = parseFloat((5 - (diff / 56) * 5).toFixed(1))
          } else if (diff > 56) {
            this.muscleRatioScore = 0
          }
          // 保留一位小数
          this.leftScore = parseFloat(this.leftScore.toFixed(1))
          this.rightScore = parseFloat(this.rightScore.toFixed(1))
          this.bothScore = parseFloat(this.bothScore.toFixed(1))
          this.muscleRatioScore = parseFloat(this.muscleRatioScore.toFixed(1))

          /* 根据得分进行评价：优、良、中、较差、差 */
          /* 左腿评价 */
          if (this.leftScore <= 3.9) {
            this.leftEvaluateText = '差'
          } else if (this.leftScore >= 4.0 && this.leftScore <= 4.9) {
            this.leftEvaluateText = '较差'
          } else if (this.leftScore >= 5.0 && this.leftScore <= 6.9) {
            this.leftEvaluateText = '中'
          } else if (this.leftScore >= 7.0 && this.leftScore <= 7.9) {
            this.leftEvaluateText = '良'
          } else if (this.leftScore >= 8.0) {
            this.leftEvaluateText = '优'
          }
          /* 右腿评价 */
          if (this.rightScore <= 3.9) {
            this.rightEvaluateText = '差'
          } else if (this.rightScore >= 4.0 && this.rightScore <= 4.9) {
            this.rightEvaluateText = '较差'
          } else if (this.rightScore >= 5.0 && this.rightScore <= 6.9) {
            this.rightEvaluateText = '中'
          } else if (this.rightScore >= 7.0 && this.rightScore <= 7.9) {
            this.rightEvaluateText = '良'
          } else if (this.rightScore >= 8.0) {
            this.rightEvaluateText = '优'
          }
          /* 双腿评价 */
          if (this.bothScore <= 3.9) {
            this.bothEvaluateText = '差'
          } else if (this.bothScore >= 4.0 && this.bothScore <= 4.9) {
            this.bothEvaluateText = '较差'
          } else if (this.bothScore >= 5.0 && this.bothScore <= 6.9) {
            this.bothEvaluateText = '中'
          } else if (this.bothScore >= 7.0 && this.bothScore <= 7.9) {
            this.bothEvaluateText = '良'
          } else if (this.bothScore >= 8.0) {
            this.bothEvaluateText = '优'
          }
          /* 肌力比评价 */
          if (this.muscleRatioScore <= 3.9) {
            this.muscleRatioEvaluateText = '差'
          } else if (
            this.muscleRatioScore >= 4.0 &&
            this.muscleRatioScore <= 4.9
          ) {
            this.muscleRatioEvaluateText = '较差'
          } else if (
            this.muscleRatioScore >= 5.0 &&
            this.muscleRatioScore <= 6.9
          ) {
            this.muscleRatioEvaluateText = '中'
          } else if (
            this.muscleRatioScore >= 7.0 &&
            this.muscleRatioScore <= 7.9
          ) {
            this.muscleRatioEvaluateText = '良'
          } else if (this.muscleRatioScore >= 8.0) {
            this.muscleRatioEvaluateText = '优'
          }

          /* 人体肌肉颜色图 */
          /* 左腿 */
          if (this.leftScore <= 3.9) {
            this.leftLegSrc = require('@/assets/img/Test/Pdf/肌肉图/红左腿.jpg')
          } else if (this.leftScore >= 4.0 && this.leftScore <= 4.9) {
            this.leftLegSrc = require('@/assets/img/Test/Pdf/肌肉图/橙左腿.jpg')
          } else if (this.leftScore >= 5.0 && this.leftScore <= 6.9) {
            this.leftLegSrc = require('@/assets/img/Test/Pdf/肌肉图/黄左腿.jpg')
          } else if (this.leftScore >= 7.0 && this.leftScore <= 7.9) {
            this.leftLegSrc = require('@/assets/img/Test/Pdf/肌肉图/黄绿左腿.jpg')
          } else if (this.leftScore >= 8.0) {
            this.leftLegSrc = require('@/assets/img/Test/Pdf/肌肉图/绿左腿.jpg')
          }
          /* 右腿 */
          if (this.rightScore <= 3.9) {
            this.rightLegSrc = require('@/assets/img/Test/Pdf/肌肉图/红右腿.jpg')
          } else if (this.rightScore >= 4.0 && this.rightScore <= 4.9) {
            this.rightLegSrc = require('@/assets/img/Test/Pdf/肌肉图/橙右腿.jpg')
          } else if (this.rightScore >= 5.0 && this.rightScore <= 6.9) {
            this.rightLegSrc = require('@/assets/img/Test/Pdf/肌肉图/黄右腿.jpg')
          } else if (this.rightScore >= 7.0 && this.rightScore <= 7.9) {
            this.rightLegSrc = require('@/assets/img/Test/Pdf/肌肉图/黄绿右腿.jpg')
          } else if (this.rightScore >= 8.0) {
            this.rightLegSrc = require('@/assets/img/Test/Pdf/肌肉图/绿右腿.jpg')
          }
          /* 双腿 */
          if (this.bothScore <= 3.9) {
            this.bothLegSrc = require('@/assets/img/Test/Pdf/肌肉图/红双腿.jpg')
          } else if (this.bothScore >= 4.0 && this.bothScore <= 4.9) {
            this.bothLegSrc = require('@/assets/img/Test/Pdf/肌肉图/橙双腿.jpg')
          } else if (this.bothScore >= 5.0 && this.bothScore <= 6.9) {
            this.bothLegSrc = require('@/assets/img/Test/Pdf/肌肉图/黄双腿.jpg')
          } else if (this.bothScore >= 7.0 && this.bothScore <= 7.9) {
            this.bothLegSrc = require('@/assets/img/Test/Pdf/肌肉图/黄绿双腿.jpg')
          } else if (this.bothScore >= 8.0) {
            this.bothLegSrc = require('@/assets/img/Test/Pdf/肌肉图/绿双腿.jpg')
          }

          /* 计算左腿、右腿的训练推荐增加百分比 */
          if (
            this.leftValue < this.singleRecommendedValue &&
            this.rightValue >= this.singleRecommendedValue
          ) {
            this.leftTrainRecommend = parseFloat(
              (
                ((this.rightValue - this.leftValue) / this.leftValue) *
                100
              ).toFixed(0)
            )
            this.rightTrainRecommend = '/'
          } else if (
            this.rightValue < this.singleRecommendedValue &&
            this.leftValue >= this.singleRecommendedValue
          ) {
            this.rightTrainRecommend = parseFloat(
              (
                ((this.leftValue - this.rightValue) / this.rightValue) *
                100
              ).toFixed(0)
            )
            this.leftTrainRecommend = '/'
          } else if (
            this.leftValue >= this.singleRecommendedValue &&
            this.rightValue >= this.singleRecommendedValue
          ) {
            this.leftTrainRecommend = '/'
            this.rightTrainRecommend = '/'
          } else {
            this.leftTrainRecommend = parseFloat(
              ((this.singleRecommendedValue - this.leftValue) /
                this.leftValue) *
                100
            ).toFixed(0)
            this.rightTrainRecommend = parseFloat(
              ((this.singleRecommendedValue - this.rightValue) /
                this.rightValue) *
                100
            ).toFixed(0)
          }
        })
        .then(() => {
          this.initChart()
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
              this.getTestData()
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
     * @description: 图形
     */
    initChart() {
      this.myChartLeft = this.$echarts.init(
        document.getElementById('chartLeft')
      )
      this.myChartRight = this.$echarts.init(
        document.getElementById('chartRight')
      )
      this.myChartBoth = this.$echarts.init(
        document.getElementById('chartBoth')
      )
      this.myChartMuscleRatio = this.$echarts.init(
        document.getElementById('chartMuscleRatio')
      )

      this.optionLeft = {
        title: {
          left: 'center',
          top: '24%',
          text: `${
            this.$store.state.currentUserInfo.affectedSide === '左'
              ? '劣势'
              : '优势'
          }(左)腿得分`,
          textStyle: {
            fontSize: 18
          }
        },
        series: [
          {
            type: 'gauge', // 仪表盘
            radius: '100%',
            startAngle: 240,
            endAngle: -60,
            min: 0,
            max: 10,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [0.39, '#FA6565'],
                  [0.499, '#FFAA64'],
                  [0.699, '#FFD664'],
                  [0.799, '#D9F74F'],
                  [1, '#59E266']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-78%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              fontSize: 50,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              color: '#000000'
            },
            data: [
              {
                value: this.leftScore,
                name: this.leftEvaluateText,
                title: {
                  offsetCenter: [0, '50%'],
                  fontSize: 40,
                  color: 'auto'
                }
              }
            ]
          }
        ]
      }
      this.optionRight = {
        title: {
          left: 'center',
          top: '24%',
          text: `${
            this.$store.state.currentUserInfo.affectedSide === '右'
              ? '劣势'
              : '优势'
          }(右)腿得分`,
          textStyle: {
            fontSize: 18
          }
        },
        series: [
          {
            type: 'gauge', // 仪表盘
            radius: '100%',
            startAngle: 240,
            endAngle: -60,
            min: 0,
            max: 10,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [0.39, '#FA6565'],
                  [0.499, '#FFAA64'],
                  [0.699, '#FFD664'],
                  [0.799, '#D9F74F'],
                  [1, '#59E266']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-78%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              fontSize: 50,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              color: '#000000'
            },
            data: [
              {
                value: this.rightScore,
                name: this.rightEvaluateText,
                title: {
                  offsetCenter: [0, '50%'],
                  fontSize: 40,
                  color: 'auto'
                }
              }
            ]
          }
        ]
      }
      this.optionBoth = {
        title: {
          left: 'center',
          top: '24%',
          text: `双腿得分`,
          textStyle: {
            fontSize: 18
          }
        },
        series: [
          {
            type: 'gauge', // 仪表盘
            radius: '100%',
            startAngle: 240,
            endAngle: -60,
            min: 0,
            max: 10,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [0.39, '#FA6565'],
                  [0.499, '#FFAA64'],
                  [0.699, '#FFD664'],
                  [0.799, '#D9F74F'],
                  [1, '#59E266']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-78%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              fontSize: 50,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              color: '#000000'
            },
            data: [
              {
                value: this.bothScore,
                name: this.bothEvaluateText,
                title: {
                  offsetCenter: [0, '50%'],
                  fontSize: 40,
                  color: 'auto'
                }
              }
            ]
          }
        ]
      }
      this.optionMuscleRatio = {
        title: {
          left: 'center',
          top: '24%',
          text: `肌力比得分`,
          textStyle: {
            fontSize: 18
          }
        },
        series: [
          {
            type: 'gauge', // 仪表盘
            radius: '100%',
            startAngle: 240,
            endAngle: -60,
            min: 0,
            max: 10,
            axisLine: {
              lineStyle: {
                width: 10,
                color: [
                  [0.39, '#FA6565'],
                  [0.499, '#FFAA64'],
                  [0.699, '#FFD664'],
                  [0.799, '#D9F74F'],
                  [1, '#59E266']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-78%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              fontSize: 50,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              color: '#000000'
            },
            data: [
              {
                value: this.muscleRatioScore,
                name: this.muscleRatioEvaluateText,
                title: {
                  offsetCenter: [0, '50%'],
                  fontSize: 40,
                  color: 'auto'
                }
              }
            ]
          }
        ]
      }

      this.myChartLeft.setOption(this.optionLeft)
      this.myChartRight.setOption(this.optionRight)
      this.myChartBoth.setOption(this.optionBoth)
      this.myChartMuscleRatio.setOption(this.optionMuscleRatio)
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
  .muscle-print {
    margin-left: 80px !important;
  }
  .value-print {
    margin-left: 80px !important;
  }
}

.test-print {
  width: 100%;

  .wrapper {
    width: 100%;
    height: 100vh;
  }

  .one {
    position: relative;
    @include flex(column, stretch, center);
    .logo {
      position: absolute;
      top: 3px;
      right: 0;
      width: 160px;
    }
    .title {
      font-size: 40px;
    }
    .hospital {
      font-size: 22px;
      margin-top: 5px;
    }
    .divider {
      margin-top: 8px;
      border: 1px solid rgb(204, 204, 204);
      width: 100%;
    }
    .info {
      width: 100%;
      margin-top: 8px;
      @include flex(row, space-around, center);
      .item {
        font-size: 16px;
      }
    }

    .main {
      flex: 1;
      width: 100%;
      @include flex(column, center, center);
      .mini-divider {
        width: 80%;
        border: 1px solid rgb(204, 204, 204);
      }
      .top,
      .bottom {
        flex: 1;
        width: 100%;
        @include flex(row, space-around, center);
        .item {
          @include flex(row, center, center);
          .left {
            .chart {
              width: 20vw;
              height: 28vh;
            }
          }
          .right {
            margin-right: 50px;
            @include flex(column, center, center);
            .muscle {
              width: 100px;
            }
            .value {
              @include flex(column, center, space-between);
              font-size: 18px;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }

  .two {
    position: relative;
    @include flex(column, stretch, center);
    .logo {
      position: absolute;
      top: 3px;
      right: 0;
      width: 160px;
    }
    .title {
      font-size: 40px;
    }
    .hospital {
      font-size: 22px;
      margin-top: 5px;
    }
    .divider {
      margin-top: 8px;
      border: 1px solid rgb(204, 204, 204);
      width: 100%;
    }
    .info {
      width: 100%;
      margin-top: 8px;
      @include flex(row, space-around, center);
      .item {
        font-size: 16px;
      }
    }

    .main {
      flex: 1;
      width: 90%;
      @include flex(column, stretch, stretch);
      .table {
        flex: 1;
        margin: 30px 0 10px 0;
        .item {
          width: 100%;
          height: 100%;
          .title {
            height: 50px;
          }
        }
      }
      .advice {
        border: 2px solid #808080;
        border-radius: 10px;
        height: 100px;
        padding: 5px;
        .advice__title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .advice__item {
          text-indent: 2em;
          font-size: 16px;
        }
      }
    }

    .btn {
      @include flex(row, center, center);
      margin: 10px 0;
      .item {
        width: 160px;
        font-size: 24px;
        margin: 0 40px;
      }
    }
  }
}
</style>
