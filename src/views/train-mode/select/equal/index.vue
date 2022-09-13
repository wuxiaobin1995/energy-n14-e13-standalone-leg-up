<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-06 10:59:30
 * @LastEditTime: 2022-07-08 17:35:52
 * @Description : 等长训练
-->
<template>
  <div class="equal">
    <!-- 语音播放 -->
    <audio ref="audio" controls="controls" hidden :src="audioSrc" />

    <div class="left">
      <!-- 介绍说明 -->
      <div class="introduce">
        <div class="item">
          训练要求：请将设备调整为等长模式，在进行蹬伸动作时，将圆点缓慢上升到绿线之上，进行重复训练
        </div>
        <div class="item">
          动作特点：康复早期可增强患侧下肢稳定性，每次收缩保持的时间按治疗师要求而定
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
          <span>负重块(2.5kg/块)：</span>
          <el-input-number
            v-model="bearWeightNum"
            :min="1"
            :max="20"
            :precision="0"
            :step="1"
          ></el-input-number>
        </div>
        <div class="set-item item3">
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

export default {
  name: 'equal',

  data() {
    return {
      imgSrc: require('@/assets/img/Train/Select/等长训练.png'),
      setBgSrc: require('@/assets/img/Train/Select/参数设置背景1.png'),

      /* 语音相关 */
      audioOpen: this.$store.state.voiceSwitch,
      audioSrc: path.join(__static, `narrate/mandarin/8-等长训练.mp3`),

      standardDistance: null, // 位移基准值，精确到1mm，有正负，用于调零
      num: 5, // 单组重复次数
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
     * @description: 开始训练
     */
    handleStart() {
      this.$router.push({
        path: '/train-measure-equal',
        query: {
          num: JSON.stringify(this.num),
          bearWeight: JSON.stringify(
            parseFloat((this.bearWeightNum * 2.5).toFixed(2))
          ),
          trainPart: JSON.stringify(this.trainPart),
          trainType: JSON.stringify('等长训练'),
          routerName: JSON.stringify('/train-select/equal')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.equal {
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
        top: 30%;
      }
      .item2 {
        top: 50%;
      }
      .item3 {
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
