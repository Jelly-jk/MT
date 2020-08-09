<template>
  <el-row :gutter="0" class="m-header">
    <el-col :span="5">
        <geo/>   <!-- 视频中这里写成了goe，因为html不识别大小写，所以没报错 -->
    </el-col>
    <el-col :span="5">
        <user/>
    </el-col>
    <el-col :span="14">
        <navbar/>
    </el-col>
  </el-row>
</template>

<script>
import Geo from './geo.vue'
import User from './user.vue'
import Navbar from './nav.vue'
export default {
    components: {
        Geo,
        User,
        Navbar
    }
};
</script>

<style lang="scss">

</style>
