import mongoose from 'mongoose'


// 定义数据库中的集合规则
const Schema = mongoose.Schema
const UserSchema=new Schema({
  username:{
    type:String,
    unique:true,   // 表示唯一的意思
    require:true
  },
  password:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  }
})

// 根据第二个参数也就是上述定义的集合规则UserSchema，用model方法建立一个叫User（在表/集合中叫user）集合
// 并向外暴露
export default mongoose.model('User',UserSchema)  

