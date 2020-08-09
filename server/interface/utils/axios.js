import axios from 'axios'
//创建一个axios实例
const instance = axios.create({
  baseURL:`http://${process.env.HOST||'localhost'}:${process.env.PORT||3000}`,
  timeout:3000,
  headers:{
                      //  可以设置公共的头部


  }
})

export default instance
