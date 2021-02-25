// ES6面向对象封装登录
// post请求
import {publicing} from '../api/api.js'
// 请求地址
import {wxloginurl} from '../api/request.js'
const {log} = console
class login {
	constructor(wxuser){
		this.wxuser = wxuser;
		log(wxuser);
	}
	
	// 获取发起请求的必须条件
	async lising() {
		let userdata = await this.wxlogin();
		// log(userdata);
		// 请求登录
		let userlogin = await this.gologin(userdata);
		// log(userlogin);
		return userlogin;
	}
	
	// 拿到code
	wxlogin(){
		let wxuser = this.wxuser;
		return new Promise((resolve,reject)=>{
			if(wxuser!=undefined){
				// wx.login获取code
				// success 返回参数 code	小程序专有，用户登录凭证。
				// 开发者需要在开发者服务器后台，使用 code 换取 openid 和 session_key 等信息
				wx.login({
					// success 返回参数 code	小程序专有，用户登录凭证
					success:res=>{
						log(res);
						const secret='264591357889e1eab6491485c0527c80';
						const appid = 'wx55b890d6114ad014';
						const code = res.code;
						const nickName = wxuser.nickName;
						const avatarUrl = wxuser.avatarUrl;
						const data = {
							appid,
							secret,
							code,
							nickName,
							avatarUrl
						}
						resolve(data);
					},
					fail: (err) => {
						log(err);
						reject('拒绝获取code');
					}
				})
			}else{
				// 当用户点击取消的时候，wxuser为undefined
				log('拒绝登录');
				reject('FAIL');
			}
		})
	}
	// 请求接口登录
	gologin(userdata){
		return new Promise((resolve,reject)=>{
			publicing(wxloginurl,userdata)
			.then(res=>{
				log(res)
				// 请求的用户信息，存储到本地，避免每次都要请求
				if(res.data.msg == "SUCCESS") {
					resolve('SUCCESS')
					uni.setStorageSync('userInfo',res.data.data);
				}else {
					// log('no')
					reject('FAIL')
				}
						
			})
			.catch(err=>{
				log(err)
			})
		})
	}
}

module.exports = login;