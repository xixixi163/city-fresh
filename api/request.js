// 公用的地址
// let url='';

// 为你优选
// let getpreferurl=`${url}forshop/getprefer`
let getpreferurl="http://localhost:3000/api/forshop/getprefer"

// 附近商家
// let wxShop = `${url}forshop/wxshop`
let wxShop = `http://localhost:3000/api/forshop/wxshop`

// 综合排序
// let startingurl = `${url}forshop/starting`
let startingurl = `http://localhost:3000/api/forshop/starting`

// 多选筛选
// let multipleurl = `${url}forshop/multiple`
let multipleurl = `http://localhost:3000/api/forshop/multiple`

// 搜索
// let searchurl = `${url}forshop/search`
let searchurl = `http://localhost:3000/api/forshop/search`

// 评论
// let discussurl = `${url}message/discuss`
let discussurl = `http://localhost:3000/api/message/discuss`

// 商家介绍
// let shopurl = `${url}forshop/shop`
let shopurl = `http://localhost:3000/api/forshop/getwxshop`

// 商品数据
// let getdishesurl = `${url}forshop/getdishes`
let getdishesurl = `http://localhost:3000/api/forshop/getwxdishes`

// 登录
// let wxloginurl = `${url}wxuser/wxlogin`
let wxloginurl = `http://localhost:3000/api/wxuser/wxlogin`

// 微信支付
// let wxpayingurl = `${url}wxpay/wxpaying`
let wxpayingurl = `http://localhost:3000/api/wxpay/wxpaying`

// 提交评论
// let commenturl = `${url}message/comment`
let commenturl = `http://localhost:3000/api/message/comment`

// 我的评价
let getusermesurl = `http://localhost:3000/api/forshop/getusermes`

// 删除我的评价
let delusermesurl = `http://localhost:3000/api/forshop/delusermes`

// 收藏
let setcollectedurl = `http://localhost:3000/api/forshop/setcollection`

// 显示我的收藏
let getcollectionurl = `http://localhost:3000/api/forshop/getcollection`

// 销量高
let heightsaleurl = `http://localhost:3000/api/forshop/getheightsale`

export {getpreferurl,wxShop,startingurl,multipleurl,searchurl,
discussurl,shopurl,getdishesurl,wxloginurl,wxpayingurl,commenturl,
getusermesurl,delusermesurl,setcollectedurl,getcollectionurl,heightsaleurl}