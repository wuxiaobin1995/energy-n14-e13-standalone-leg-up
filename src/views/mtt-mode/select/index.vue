<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-20 13:51:44
 * @LastEditTime: 2022-07-21 10:35:27
 * @Description : mtt-项目选择
-->
<template>
  <div class="train-select">
    <div class="btn">
      <el-button
        class="item"
        :class="[isActiveStaticFeedback]"
        :icon="
          isActiveStaticFeedback === 'btn__active' ? 'el-icon-circle-check' : ''
        "
        type="danger"
        round
        @click="handleStaticFeedback"
        >静态反馈训练</el-button
      >
      <el-button
        class="item"
        :class="[isActiveDynamicFeedback]"
        :icon="
          isActiveDynamicFeedback === 'btn__active'
            ? 'el-icon-circle-check'
            : ''
        "
        type="warning"
        round
        @click="handleDynamicFeedback"
        >动态反馈训练</el-button
      >
      <el-button
        class="item"
        :class="[isActiveMuscularEndurance]"
        :icon="
          isActiveMuscularEndurance === 'btn__active'
            ? 'el-icon-circle-check'
            : ''
        "
        type="success"
        round
        @click="handleMuscularEndurance"
        >肌耐力训练</el-button
      >
      <el-button
        class="item"
        :class="[isActiveHypermyotrophy]"
        :icon="
          isActiveHypermyotrophy === 'btn__active' ? 'el-icon-circle-check' : ''
        "
        type="primary"
        round
        @click="handleHypermyotrophy"
        >肌肥大训练</el-button
      >
    </div>

    <div class="wrapper">
      <transition mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mtt-select',

  data() {
    return {
      /* 动态css */
      isActiveStaticFeedback: '',
      isActiveDynamicFeedback: '',
      isActiveMuscularEndurance: '',
      isActiveHypermyotrophy: ''
    }
  },

  watch: {
    '$route.path': {
      handler(newVal, oldval) {
        if (newVal === '/mtt-select/static-feedback') {
          this.isActiveStaticFeedback = 'btn__active'
        } else {
          this.isActiveStaticFeedback = ''
        }
        if (newVal === '/mtt-select/dynamic-feedback') {
          this.isActiveDynamicFeedback = 'btn__active'
        } else {
          this.isActiveDynamicFeedback = ''
        }
        if (newVal === '/mtt-select/muscular-endurance') {
          this.isActiveMuscularEndurance = 'btn__active'
        } else {
          this.isActiveMuscularEndurance = ''
        }
        if (newVal === '/mtt-select/hypermyotrophy') {
          this.isActiveHypermyotrophy = 'btn__active'
        } else {
          this.isActiveHypermyotrophy = ''
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * @description: 静态反馈训练
     */
    handleStaticFeedback() {
      this.$router.push({ path: '/mtt-select/static-feedback' })
    },

    /**
     * @description: 动态反馈训练
     */
    handleDynamicFeedback() {
      this.$router.push({ path: '/mtt-select/dynamic-feedback' })
    },

    /**
     * @description: 肌耐力训练
     */
    handleMuscularEndurance() {
      this.$router.push({ path: '/mtt-select/muscular-endurance' })
    },

    /**
     * @description: 肌肥大训练
     */
    handleHypermyotrophy() {
      this.$router.push({ path: '/mtt-select/hypermyotrophy' })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 路由过渡动效 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}

.train-select {
  width: 100%;
  height: 100%;
  position: relative;
  @include flex(row, center, center);

  .btn {
    position: absolute;
    left: -16px;
    top: 0;
    margin-top: 13px;
    @include flex(column, stretch, stretch);
    .item {
      margin: 6px 0;
      width: 170px;
      font-size: 22px;
    }
    .btn__active {
      width: 220px;
    }
  }

  .wrapper {
    width: 96%;
    height: 96%;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 20px 20px 20px 188px;
  }
}
</style>
