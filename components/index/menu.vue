<template>
  <div class="m-menu">
      <dl class="nav" @mouseleave="mouseleave">
          <dt>全部分类</dt>
          <dd v-for="(item,idx) in $store.state.home.menu" :key="idx" @mouseenter="mouseenter">
              <i :class="item.type"/>{{item.name}}<span class="arrow"/>
          </dd>
      </dl>
      <div class="detail" v-if="kind" @mouseenter="sover" @mouseleave="sout">
          <template v-for="(item,idx) in curdetail.child">  <!-- 这里遍历的是过滤后的数据 -->
              <h4 :key="idx">{{item.title}}</h4>
              <span v-for="v in item.child" :key="v">{{v}}</span>
          </template>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            kind:'',
            // menu:[{
            //     type:'food',
            //     name:'美食',
            //     child:[{
            //         title:'美食',
            //         child:['代金券','甜点','火锅','自助餐','小吃快餐']
            //     }]
            // },{
            //     type:'takeout',
            //     name: '外卖',
            //     child:[{
            //         title:'外卖',
            //         child:['美团外卖']
            //     }]
            // },{
            //     type:'hotel',
            //     name: '酒店',
            //     child:[{
            //         title:'酒店星级',
            //         child:['经济型','舒适/三星','高档/四星','豪华/五星']
            //     }]
                
            // }]
        }
    },
    computed: {
        curdetail:function() {
            return this.$store.state.home.menu.filter((item)=>item.type===this.kind)[0]  // 拿到的是个符合type要求的对象
        }
    },
    methods: {
        mouseleave: function() {
            this.timer = setTimeout(() =>{  // 这里并没有在data中定义这个timer，暂时理解成实例属性
                this.kind = ''
            },150)
        },
        mouseenter:function(e) {
            this.kind = e.target.querySelector('i').className // 选择这个触发事件DOM节点下的i标签的类名
        },
        sover:function () {
            clearTimeout(this.timer)
        },
        sout:function() {
            this.kind = ''
        }
    },
}
</script>

<style lang="">
</style>