/*
 * @Author      : Mr.bin
 * @Date        : 2022-06-23 08:37:45
 * @LastEditTime: 2022-07-26 09:02:43
 * @Description : vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [
  //   createPersistedState({
  //     key: 'vuex-persistedstate', // 自定义Storage中的Key名，默认是vuex
  //     storage: window.sessionStorage, // 使用sessionStorage来固化数据
  //     reducer(val) {
  //       return {
  //         aaa: val.aaa,
  //         bbb: val.bbb,
  //         ccc: val.ccc
  //       }
  //     }
  //   })
  // ],

  state: {
    // 左K、右K调零基准值
    zeroStandard: {
      leftStandard: null,
      rightStandard: null
    },

    // 当前选择的用户及其信息
    currentUserInfo: {
      userId: '', // 唯一id
      userName: '', // 姓名
      sex: '', // 性别
      affectedSide: '', // 患侧
      height: '', // 身高
      weight: '', // 体重
      birthday: '', // 出生日期
      remarks: '', // 备注
      lastLoginTime: '', // 最后登录时间
      maxDistance: '' // 蹬伸的最大位移量(mm)，用于设定训练模式的最大位移值
    },

    // 测试项目数组
    testSelection: [],
    // 测试最终结果，kg
    resultValue: {
      goodLegResult: null, // 优势腿
      badLegResult: null, // 劣势腿
      bothLegResult: null // 双腿
    },

    /* 语音开关 */
    voiceSwitch: true
  },

  mutations: {
    // 左K、右K调零基准值
    SET_ZEROSTANDARD(state, zeroStandard) {
      state.zeroStandard = zeroStandard
    },
    // 当前选择的用户及其信息
    CHANGE_CURRENTUSERINFO(state, currentUserInfo) {
      state.currentUserInfo = currentUserInfo
    },
    // 测试项目数组
    CHANGE_TESTSELECTION(state, testSelection) {
      state.testSelection = testSelection
    },
    // 测试最终结果，kg
    CHANGE_RESULTVALUE(state, valueObj) {
      state.resultValue = valueObj
    },
    /* 语音开关 */
    SET_VOICESWITCH(state, voiceSwitch) {
      state.voiceSwitch = voiceSwitch
    }
  },

  actions: {
    // 左K、右K调零基准值
    setZeroStandard({ commit }, zeroStandard) {
      return new Promise((resolve, reject) => {
        commit('SET_ZEROSTANDARD', zeroStandard)
        resolve()
      })
    },
    // 当前选择的用户及其信息
    changeCurrentUserInfo({ commit }, currentUserInfo) {
      return new Promise((resolve, reject) => {
        commit('CHANGE_CURRENTUSERINFO', currentUserInfo)
        resolve()
      })
    },
    // 测试项目数组
    changeTestSelection({ commit }, testSelection) {
      return new Promise((resolve, reject) => {
        commit('CHANGE_TESTSELECTION', testSelection)
        resolve()
      })
    },
    // 测试最终结果，kg
    changeResultValue({ commit }, valueObj) {
      return new Promise((resolve, reject) => {
        commit('CHANGE_RESULTVALUE', valueObj)
        resolve()
      })
    },
    /* 语音开关 */
    setVoiceSwitch({ commit }, voiceSwitch) {
      return new Promise((resolve, reject) => {
        commit('SET_VOICESWITCH', voiceSwitch)
        resolve()
      })
    }
  }
})
