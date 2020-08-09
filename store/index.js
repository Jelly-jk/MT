export const actions = {
    async nuxtServerInit({commit},{req,app}) {
      // 这里拿不到vue的实例，但是可以用app这个对象，axios是挂载在这个下面的

      // 这下面是请求后端接口，然后拿到值后将对应state中的数据修改成请求到的数据。
      const {status,data: {province,city}} = await app.$axios.get('/geo/getPosition')
      // 后面第二个参数是个三元表达式，本质上还是第二个参数对象，将调用mutation传参
      commit('geo/setPosition',status===200?{city,province}:{city:'',province:''})      
      const {status:status2, data: {menu}} = await app.$axios.get('/geo/menu')
      commit('home/setMenu',status2===200?menu:[])

      const {status:status3,data:{result}}=await app.$axios.get('/search/hotPlace',{
        params:{
          city:app.store.state.geo.position.city.replace('市','')
        }
      })
      commit('home/setHotPlace',status3===200?result:[])
    }
  }
