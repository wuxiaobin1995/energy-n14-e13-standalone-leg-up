<!--
 * @Author      : Mr.bin
 * @Date        : 2022-06-28 17:45:14
 * @LastEditTime: 2022-07-26 16:03:41
 * @Description : 测试-项目选择
-->
<template>
  <div class="test-select">
    <!-- 语音播放 -->
    <audio ref="audio" controls="controls" hidden :src="audioSrc" />

    <div class="wrapper">
      <el-page-header
        class="page"
        title="返回首页"
        content="请确认设备调整为等长模式，将依次开始三项测试"
        @back="handleToHome"
      ></el-page-header>

      <!-- 测试项目 -->
      <div class="select">
        <div class="select-item">
          <el-image :src="bgSrc" fit="scale-down"></el-image>
          <el-image
            v-if="this.$store.state.currentUserInfo.affectedSide === '右'"
            class="center-img"
            :src="leftLegSrc"
            fit="scale-down"
          ></el-image>
          <el-image
            v-else
            class="center-img"
            :src="rightLegSrc"
            fit="scale-down"
          ></el-image>
          <div class="text">
            ① 优势腿({{
              this.$store.state.currentUserInfo.affectedSide === '左'
                ? '右'
                : '左'
            }})蹬伸
          </div>
        </div>
        <div class="select-item">
          <el-image :src="bgSrc" fit="scale-down"></el-image>
          <el-image
            v-if="this.$store.state.currentUserInfo.affectedSide === '左'"
            class="center-img"
            :src="leftLegSrc"
            fit="scale-down"
          ></el-image>
          <el-image
            v-else
            class="center-img"
            :src="rightLegSrc"
            fit="scale-down"
          ></el-image>
          <div class="text">
            ② 劣势腿({{ this.$store.state.currentUserInfo.affectedSide }})蹬伸
          </div>
        </div>
        <div class="select-item">
          <el-image :src="bgSrc" fit="scale-down"></el-image>
          <el-image
            class="center-img"
            :src="bothLegSrc"
            fit="scale-down"
          ></el-image>
          <div class="text">③ 双腿蹬伸</div>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="btn">
        <el-button
          type="success"
          icon="el-icon-video-play"
          class="item"
          @click="handleStart"
          >开始测试</el-button
        >
      </div>

      <!-- 身高、体重确认弹窗 -->
      <el-dialog
        title="请确认身高、体重"
        :visible.sync="centerDialogVisible"
        width="30%"
        top="30vh"
        center
      >
        <div class="dialog-content">
          <div class="item">
            身高：<span :style="{ color: 'red' }">{{
              this.$store.state.currentUserInfo.height
            }}</span>
            cm
          </div>
          <div class="item">
            体重：<span :style="{ color: 'red' }">{{
              this.$store.state.currentUserInfo.weight
            }}</span>
            kg
          </div>
        </div>
        <span slot="footer">
          <el-button
            class="btn-item"
            type="danger"
            plain
            round
            icon="el-icon-circle-close"
            @click="handleToUser"
            >有误，前往修改</el-button
          >
          <el-button
            class="btn-item"
            type="primary"
            plain
            round
            icon="el-icon-circle-check"
            @click="handleToTest"
            >无误，开始测试</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* 路径模块 */
import path from 'path'

export default {
  name: 'test-select',

  data() {
    return {
      bgSrc: require('@/assets/img/Test/Select/测试项目背景.png'), // 背景
      leftLegSrc: require('@/assets/img/Test/Select/左腿蹬伸示意图.png'),
      rightLegSrc: require('@/assets/img/Test/Select/右腿蹬伸示意图.png'),
      bothLegSrc: require('@/assets/img/Test/Select/双腿蹬伸示意图.png'),

      /* 语音相关 */
      audioOpen: this.$store.state.voiceSwitch,
      audioSrc: path.join(__static, `narrate/mandarin/1-测试项目.mp3`),

      centerDialogVisible: false // 弹窗显隐
    }
  },

  created() {
    /* 初始化测试项目数组 */
    this.$store.dispatch('changeTestSelection', ['优势', '劣势', '双'])
    /* 初始化测试最终结果 */
    this.$store.dispatch('changeResultValue', {
      goodLegResult: null, // 优势腿
      badLegResult: null, // 劣势腿
      bothLegResult: null // 双腿
    })
  },
  mounted() {
    if (this.audioOpen === true) {
      setTimeout(() => {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      }, 500)
    }
  },

  methods: {
    /**
     * @description: 回到首页
     */
    handleToHome() {
      this.$router.push({
        path: '/home'
      })
    },

    /**
     * @description: 弹窗确认
     */
    handleStart() {
      this.centerDialogVisible = true
    },

    /**
     * @description: 有误，前往修改
     */
    handleToUser() {
      this.centerDialogVisible = false
      this.$router.push({
        path: '/user'
      })
    },

    /**
     * @description: 无误，开始测试
     */
    handleToTest() {
      this.centerDialogVisible = false
      this.$router.push({
        path: '/test-measure'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.test-select {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 90%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 26px 40px;
    position: relative;
    @include flex(column, stretch, stretch);

    .page {
      position: absolute;
      top: 20px;
      left: 30px;
    }

    /* 测试项目 */
    .select {
      flex: 1;
      margin: 40px 0 20px 0;
      @include flex(row, space-around, stretch);
      .select-item {
        @include flex(row, center, center);
        transform: scale(0.9);
        position: relative;
        .center-img {
          position: absolute;
          transform: scale(0.76);
          margin-top: 50px;
        }
        .text {
          position: absolute;
          margin-top: -111%;
          font-size: 24px;
          letter-spacing: 1.5px;
          color: #ffffff;
        }
      }
    }
    /* 按钮组 */
    .btn {
      margin-bottom: 10px;
      @include flex(row, center, center);
      .item {
        font-size: 22px;
      }
    }

    /* 确认弹窗相关 */
    .dialog-content {
      @include flex(column, center, center);
      .item {
        margin: 5px 0;
      }
    }
    .btn-item {
      margin: 0 10px;
    }
  }
}
</style>
