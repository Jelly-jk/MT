<template>
    <div class="m-detail-list">
        <ul>
            <li>{{list.filter(item=>item.photos.length).length}}款套餐</li>
            <item v-for="(item,idx) in list" :key="idx" :meta="item"/>
        </ul>
    </div>
</template>

<script>
import Item from './item'
export default {
    props:{
        list:{
            type:Array,
            default:()=>{  // 这里表示默认值是个空数组，return后面有个空格
                return 
            }
        }
    },
    components:{
        Item
    }
}

</script>
<style lang='scss'>
    
</style>