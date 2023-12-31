<script>
import { getAreaListAPI } from '@/api/area'

export default {
  data() {
    return {
    }
  },
  async mounted() {
    const res = await getAreaListAPI()
    console.log('请求结束了', res)
  },
  methods: {
  }
}
</script>

<template>
  <!--
    异步逻辑如何获取结果？

    同步 => 直接执行 无耗时 顺序执行
    异步 => 无法直接获取结果 有耗时 并发执行
    async await 配合使用
  -->
  <div class="databoard-container">
    工作台
  </div>
</template>

<style scoped lang="scss">

</style>
