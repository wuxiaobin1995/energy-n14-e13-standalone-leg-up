<!--
 * @Author      : Mr.bin
 * @Date        : 2022-07-06 10:55:41
 * @LastEditTime: 2022-07-07 15:38:31
 * @Description : 训练-项目选择
-->
<template>
  <div class="train-select">
    <div class="btn">
      <el-button
        class="item"
        :class="[isActiveBasics]"
        :icon="isActiveBasics === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="danger"
        round
        @click="handleBasics"
        >基础训练</el-button
      >
      <el-button
        class="item"
        :class="[isActiveAdvance]"
        :icon="isActiveAdvance === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="warning"
        round
        @click="handleAdvance"
        >进阶训练</el-button
      >
      <el-button
        class="item"
        :class="[isActiveOffcenter]"
        :icon="
          isActiveOffcenter === 'btn__active' ? 'el-icon-circle-check' : ''
        "
        type="success"
        round
        @click="handleOffcenter"
        >离心训练</el-button
      >
      <el-button
        class="item"
        :class="[isActiveEqual]"
        :icon="isActiveEqual === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="primary"
        round
        @click="handleEqual"
        >等长训练</el-button
      >
      <el-button
        class="item"
        :class="[isActiveCustom]"
        :icon="isActiveCustom === 'btn__active' ? 'el-icon-circle-check' : ''"
        type="info"
        round
        @click="handleCustom"
        >自定义训练</el-button
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
  name: 'train-select',

  data() {
    return {
      /* 动态css */
      isActiveBasics: '',
      isActiveAdvance: '',
      isActiveOffcenter: '',
      isActiveEqual: '',
      isActiveCustom: ''
    }
  },

  watch: {
    '$route.path': {
      handler(newVal, oldval) {
        if (newVal === '/train-select/basics') {
          this.isActiveBasics = 'btn__active'
        } else {
          this.isActiveBasics = ''
        }
        if (newVal === '/train-select/advance') {
          this.isActiveAdvance = 'btn__active'
        } else {
          this.isActiveAdvance = ''
        }
        if (newVal === '/train-select/offcenter') {
          this.isActiveOffcenter = 'btn__active'
        } else {
          this.isActiveOffcenter = ''
        }
        if (newVal === '/train-select/equal') {
          this.isActiveEqual = 'btn__active'
        } else {
          this.isActiveEqual = ''
        }
        if (newVal === '/train-select/custom') {
          this.isActiveCustom = 'btn__active'
        } else {
          this.isActiveCustom = ''
        }
      },
      immediate: true
    }
  },

  methods: {
    /**
     * @description: 基础训练
     */
    handleBasics() {
      this.$router.push({ path: '/train-select/basics' })
    },

    /**
     * @description: 进阶训练
     */
    handleAdvance() {
      this.$router.push({ path: '/train-select/advance' })
    },

    /**
     * @description: 离心训练
     */
    handleOffcenter() {
      this.$router.push({ path: '/train-select/offcenter' })
    },

    /**
     * @description: 等长训练
     */
    handleEqual() {
      this.$router.push({ path: '/train-select/equal' })
    },

    /**
     * @description: 自定义训练
     */
    handleCustom() {
      this.$router.push({ path: '/train-select/custom' })
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
      width: 150px;
      font-size: 22px;
    }
    .btn__active {
      width: 200px;
    }
  }

  .wrapper {
    width: 96%;
    height: 96%;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 20px 20px 20px 168px;
  }
}
</style>
