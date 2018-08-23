var util = {
	site: "https://www.xywqq.com", //https://www.xywqq.com http://192.168.2.233:8080
	project: "/XYW/",
	back(delta) {
		delta = !delta ? 1 : delta;
		uni.navigateBack({
			delta: delta,
		})
	},
	share(shares,title,url,img){
		// #ifdef MP-WEIXIN
		uni.showToast({
			title:"分享开通中~",
		})
		return;
		// #endif
		// #ifdef APP-PLUS
		plus.nativeUI.actionSheet({
			title: "分享文章",
			cancel: "取消",
			buttons: [{
				title: "发送给微信好友"
			}, {
				title: "分享到微信朋友圈"
			}, {
				title: "分享到QQ"
			}]
		}, function(e) {
			var index = e.index;
			var share = null;
			var scene = "";
			var thumbs = []; //分享URL的缩略图
			var iconUrl = "https://www.xywqq.com/XYW/m/newFate/img/head.png";
			if(!!img){
				iconUrl = img;
			}
			thumbs.push(iconUrl);
			var msg = {
				title: title,
				href: url,
				thumbs: thumbs,
				content:title,
			}
			if(index == 1) {
				scene = "WXSceneSession";
				msg["extra"] = {
					"scene": scene
				}
				share = shares['weixin'];
			}
			if(index == 2) {
				scene = "WXSceneTimeline";
				msg["extra"] = {
					"scene": scene
				}
				share = shares['weixin'];
			}
			if(index == 3) {
				share = shares['qq'];
			}
			if(index == 4) {
				share = shares['qq'];
			}
			share.send(msg, function() {
				uni.showToast({
					title:"分享成功",
				})
			}, function(e) {
				console.log(JSON.stringify(e))
			});
		});
		// #endif
	},
	confirm(msg, callBackFun) {
		uni.showModal({
			content: msg,
			success: function (res) {
				if (res.confirm) {
					callBackFun(true)
				} else if (res.cancel) {
					callBackFun(false)
				}
			}
		})
	},
	Alert: function (msg, callBackFun) {
		uni.showModal({
			title: '乡缘网提示',
			content: msg,
			showCancel: false,
			success: function () {
				if (!!callBackFun) {
					callBackFun()
				}
			}
		});
	},
	getData: function (key) {
		var data = "";
		uni.getStorage({
			key: key,
			success:function(res){
				data = res.data;
				return res.data;
			}
		})	
		return data;
	},
	setData: function (key, value) {
		uni.setStorage({
			key: key,
			data: value,
		})
	},
	tip: function (msg) {
		uni.showToast({
			title: msg,
			duration: 2000,
			mask: true,
			icon: "none",
		})
	},
	openWindow: function (url) {
		uni.navigateTo({
			url: url
		});
	},
	httpSend: function (url, params, callBackFun, showLoading) {
		if (!!showLoading) {
			uni.showNavigationBarLoading();
		}
		var jsessionid = uni.getStorageSync("sessionId") || "";
		// console.log("请求参数:" + JSON.stringify(params))
		uni.request({
			url: util.site + util.project + url + ".php", //仅为示例，并非真实接口地址。
			data: params,
			method: "POST",
			header: {
				"content-type": "application/x-www-form-urlencoded",
				cookie: jsessionid
			},
			success: function (res) {
				// console.log("返回数据:" + JSON.stringify(res))
				if (!!showLoading) {
					uni.hideNavigationBarLoading();
					// console.log("返回数据:"+JSON.stringify(res.data))
				}
				if (!!res.data.token) {
					uni.setStorage({
						key: 'sessionId',
						data: 'JSESSIONID=' + res.data.token
					})
				}
				if (res.statusCode == 200) {
					callBackFun(res.data)
				} else {
					console.log(JSON.stringify(res))
				}
			}
		});
	},
	alipay(opt, money, articleId) {
		if (opt == "publishArticleReward") {
			var params = util.getData("rewardParams");
			params["payType"] = "app";
			util.httpSend("ArticleAction!getAlipayParamsByEditReward", params, function (data) {
				plus.payment.request(pays["alipay"], data, paySuccess, payError);
			}, null, "text");
		}
		if (opt == "publishArticle") {
			var params = {
				"totalMoney": money,
				"articleId": articleId,
				"payType": "app"
			}
			util.httpSend("ArticleAction!getAliPayParameters", params, function (data) {
				plus.payment.request(pays["alipay"], data, paySuccess, payError);
			}, null, "text");
		}
		if (opt == "reward") {
			var params = {
				"totalMoney": money * 100,
				"articleId": articleId,
				"payType": "app"
			}
			util.httpSend("ArticleAction!gatAlipayParamsReward", params, data => {
				uni.getProvider({
					service: 'payment',
					success: function (res) {
						console.log(JSON.stringify(res))
						// 确保有支付宝，再进行支付。
						if (~res.provider.indexOf('alipay')) {
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: data, //订单数据
								success: function (res) {
									uni.showToast({
										title:"打赏完成!",
									})
								},
								fail: function (err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
						}
					}
				});
			}, true);
		}
		if (opt == "recharge") {
			var params = {
				totalMoney:money * 100,
				"payType": "app"
			}
			var url = "https://www.xywqq.com" + "/XYW/PayAction!gatAlipayParamsRecharge.php?totalMoney=" + money * 100;
			util.httpSend("PayAction!gatAlipayParamsRecharge", params, data=> {
				uni.getProvider({
					service: 'payment',
					success: function (res) {
						console.log(JSON.stringify(res))
						// 确保有支付宝，再进行支付。
						if (~res.provider.indexOf('alipay')) {
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: data, //订单数据
								success: function (res) {
									uni.showToast({
										title:"充值完成!",
									})
								},
								fail: function (err) {
									console.log('fail:' + JSON.stringify(err));
								}
							});
						}
					}
				});
			}, null, "text");
		}
	},
	showPaySheet(opt, money, articleId) { //opt 支付选项 money 支付金额
		// #ifdef MP-WEIXIN
		util.tip("小程序支付即将开通!")
		// #endif
		// #ifdef APP-PLUS
		uni.showActionSheet({
			itemList: ["支付宝"],
			success: function (res) {
				if (res.tapIndex == 0) //0为支付宝
				{
					util.alipay(opt, money, articleId);
				}
			}
		})
		// #endif
	},
	dateFormat: function(fmt, date) {
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
}

module.exports = {
	util: util
}
