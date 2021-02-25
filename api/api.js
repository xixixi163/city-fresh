// 封装请求： get post

// 引进提示
import {errdata} from "./prompts.js"

// GET
let listing = function(urling) {
	return new Promise((resolve,reject)=>{
		uni.request({
				url: urling,
				method: 'GET',
			})
			.then((res) => {
				// res为对象，请求出来的第一项为null
				resolve(res[1])
			})
			.catch((err) => {
				let errs = '服务器错误，请稍后再试';
				errdata.errlist(errs);
				reject(err)
			})
	})
	
}

// POST
let publicing = function(urling,shopdata) {
	return new Promise((resolve,reject)=>{
		uni.request({
				url: urling,
				method: 'POST',
				data:shopdata
			})
			.then((res) => {
				// res为对象，请求出来的第一项为null
				resolve(res[1])
			})
			.catch((err) => {
				let errs = '服务器错误，请稍后再试';
				errdata.errlist(errs);
				reject(err)
			})
	})
	
}

export {listing,publicing} 
