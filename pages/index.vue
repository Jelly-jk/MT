<template>
  <div class="page-index">
    <el-row>
      <el-col :span="5">
        <emenu/>
      </el-col>
      <el-col :span="19">
        <Life/>
      </el-col>
    </el-row>
    <el-row :span="24">
      <Artistic/>
    </el-row>
  </div>
</template>

<script>
import Emenu from '@/components/index/menu.vue'
import Artistic from '@/components/index/artistic.vue'
import Life from '@/components/index/life.vue'
import Slider from '@/components/index/slider.vue'

export default {
  components: {
    Emenu,
    Artistic,
    Life,
    Slider
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/index/index.scss"
</style>