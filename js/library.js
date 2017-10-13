
/*
*个人一些工具和插件
*/

// 工具============================================================================

//1.拖拽
function fnObjDrag(obj,title){	//obj：拖拽对象 | title:拖拽的标题（可不传）
	title=title || obj;	
	title.onmousedown=function(e){
		//计算鼠标距离元素边框的距离
		var disX=e.clientX-obj.offsetLeft;	
		var disY=e.clientY-obj.offsetTop;	
		document.onmousemove=function(event){
			//计算元素的移动距离
			var objX=event.clientX-disX;
			var objY=event.clientY-disY;
			//可以移动最大距离
			var maxWid=document.documentElement.clientWidth-obj.offsetWidth;	//最宽距离
			var maxHei=document.documentElement.clientHeight-obj.offsetHeight;	//最高距离
			//判断是否超出边界
			if(objX<0){
				objX=0;
			}else if(objX>maxWid){
				objX=maxWid;
			}
			if(objY<0){
				objY=0;
			}else if(objY>maxHei){
				objY=maxHei;
			}
			obj.style.left=objX+"px";
			obj.style.top=objY+"px";
		}
			
		//---------------取消onmousemove事件
		document.onmouseup=function(){
			document.onmousemove=null;
		}
		//--------------取消onmousedown默认的事件
		return false;
	}
} ;//拖拽结束

//2.居中显示
function showCenter(obj){	//obj：居中的对象
	function center(){
		var clientW=document.documentElement.clientWidth;
		var clientH=document.documentElement.clientHeight;
		obj.style.display="block";
		var l=(clientW-obj.offsetWidth)/2;
		var h=(clientH-obj.offsetHeight)/2;	
		obj.style.left=l+"px";
		obj.style.top=h+"px";
	}
	center();
	window.addEventListener('resize',center,false);	//调整窗口时
}//居中显示结束

//3.键盘移动
function toolKeyMove(obj,dis){	//obj：移动的对象 | 一次移动的距离
	document.onkeydown=function(event){
		var k=event.keyCode;
		var top,left;
		dis= dis || 10;
		switch(k){
			case 37: left=obj.offsetLeft-dis;break;
			case 38: top=obj.offsetTop-dis;break;
			case 39: left=obj.offsetLeft+dis;break;
			case 40: top=obj.offsetTop+dis;break;
			default: break;
		}
		//判断边界
		disW=obj.offsetParent.offsetWidth-obj.offsetWidth;	//可以移动的宽度
		disH=obj.offsetParent.offsetHeight-obj.offsetHeight;	//可以移动的高度
		if(left<0){
			left=0;
		}else if(left>disW){
			left=disW;
		}
		if(top<0){
			top=0;
		}else if(top>disH){
			top=disH;
		}
		obj.style.left=left+"px";
		obj.style.top=top+"px";
	}
}//键盘移动结束


// 部件（带css）========================================================================

//1创建膜态层 返回膜态层本身
function model(){
	var oM=document.createElement('div');
	oM.className="modal";
	document.body.appendChild(oM);	
	return function (){	//返回一个删除函数
		document.body.removeChild(oM);	
	}
}

//2错误弹窗
function alertBox(text){	//弹出的内容
	var deleteModel= model();	//创建膜态层，返回膜态层的删除函数（闭包）
	//创建对象
	var oBox=document.createElement('div');
	oBox.className="errorAlertBox"
	oBox.innerHTML="<p>"+text+"</p><button>确定</button>";	
	document.body.appendChild(oBox);
	//调用居中
	showCenter(oBox);
	oBox.style.top="100px";
	//调用拖拽
	fnObjDrag(oBox);
	
	//点击关闭	
	var closeBtn=oBox.getElementsByTagName('button')[0];
	closeBtn.onclick=function(){
		document.body.removeChild(oBox);	
		deleteModel();
	};
	//防止在按钮上拖拽
	closeBtn.onmousedown=function(ev){
		ev.cancelBubble=true;
	};	
}

//3确认弹窗
function confirmBox(text,fn){	//弹出的内容 | 点击确认后执行的函数(可选)
	var deleteModel= model();	//创建膜态层，返回膜态层的删除函数（闭包）
	//创建对象
	var oBox=document.createElement('div');
	oBox.className="confirmBox"
	oBox.innerHTML="<p>"+text+"</p><button>确定</button>　　　<button>取消</button>";	//点击按钮
	document.body.appendChild(oBox);
	//调用居中
	showCenter(oBox);
	oBox.style.top="10%";	//改变位置
	//调用拖拽
	fnObjDrag(oBox);
	//点击关闭
	var closeBtn=oBox.getElementsByTagName('button');
	closeBtn[0].onclick=function(){
		document.body.removeChild(oBox);//删除盒子
		deleteModel();//删除膜态层
		fn && fn();
	};
	closeBtn[1].onclick=function(){
		document.body.removeChild(oBox);
		deleteModel();
	};
	//防止在按钮上拖拽
	closeBtn[0].onmousedown=closeBtn[1].onmousedown=function(ev){
		ev.cancelBubble=true;
	};	
}

//4警告弹窗（自动消失）
function warnBox(text){	//弹出的内容
	var deleteModel= model();	//创建膜态层，返回膜态层的删除函数（闭包）
	//创建对象
	var oBox=document.createElement('div');
	oBox.className="warnBox"
	oBox.innerHTML=text;	
	document.body.appendChild(oBox);
	//调用居中
	showCenter(oBox);
	oBox.style.top="10%";
	//调用拖拽
	fnObjDrag(oBox);
	//自动关闭	
	
	var timer=setInterval(function(){
		document.body.removeChild(oBox);
		deleteModel();
	},2000)
	oBox.onmouseenter=function(){
			clearInterval(timer);
	};
	oBox.onmouseleave=function(){
		timer=setInterval(function(){
			document.body.removeChild(oBox);
			deleteModel();
		},2000)
	};

}//警告弹窗结束

// JQ工具==============================================================

// 1 左滑删除（兼容移动）
function bindSlideLeft( $obj , maxX ){
	
	if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
	 	$obj.on('touchstart', function(ev) {
	 		console.log(0)
	 		var _self = $(ev.delegateTarget);
	 		ev = ev.originalEvent.targetTouches[0];

	 		var x = ev.pageX;
	 		var disX = 0;
	 		var endX;

	 		translateX = _self.css("transform");
	 		translateX = +translateX.split(",")[4] || 0;
	 		
	 		//console.log(translateX)
	 		function move( distent ){
	 			if (distent !== 0) {
	 				$(document).attr( "data-slide", true )
	 			}else{
	 				$(document).attr( "data-slide", false )
	 			}
	 			_self.css("transform", "translateX("+distent+"px)" );
	 		}

	 		if (!$(document).attr("data-slide")) {
	 			$(window).off("touchstart.slide");
	 			$(window).on('touchstart.slide', function(ev) {
	 				console.log(1);
	 				var tar = ev.target;
 					try{
 						ev = ev.originalEvent.targetTouches[0];
 					}catch(e){}
	 				
	 				if ( $(document).attr("data-slide") && !(_self.is(ev.target) || _self.has(ev.target).length!==0  ) ) {
	 					move( 0 );
	 					$(window).off( ".slide" );
	 				}
	 			})
	 		}
	 		
	 		$(window).on('touchmove.slide', function(ev) {
	 			console.log(2)
	 			ev = ev.originalEvent.targetTouches[0];

	 			endX = ev.pageX;
	 			disX =  endX - x ;
	 			//console.log(disX)
	 			if ( translateX === 0 ) {
	 				
	 				if (disX> 0) {
	 					disX = 0;
	 				}
	 				if (disX< -maxX) {
	 					disX = -maxX;
	 				}
	 				
	 				move( disX );

	 			} else{

	 				if (disX< 0) {
	 					disX = 0;
	 				}
	 				if (disX> maxX) {
	 					disX = maxX;
	 				}
	 				move(translateX+disX);
	 			}
	 			
	 		}).on('touchend.slide', function(ev) {
	 			console.log(3)
	 			ev.preventDefault();
	 			if (mobile) {
	 				ev = ev.originalEvent.targetTouches[0];
	 			}
	 			
	 			//console.log(translateX+disX)
	 			if (disX <= -maxX/2 ) {
	 				disX = -maxX;
	 			} else if(  disX < maxX/2){
	 				disX = 0;
	 			} else if( maxX/2 <= disX  ){
	 				disX = maxX;
	 			}
	 			
	 			move( translateX+disX );
	 			//移除事件
	 			$(window).off("touchmove.slide touchend.slide");
	 			
	 		});

	 	});
	}else{
		$obj.on('mousedown', function(ev) {
			console.log(0)
			ev.preventDefault();
			var _self = $(ev.target);
			var x = ev.pageX;
			var disX = 0;

			translateX = _self.css("transform");
			translateX = +translateX.split(",")[4] || 0;
			
			//console.log(translateX)
			function move( distent ){
				if (distent !== 0) {
					$(document).attr( "data-slide", true )
				}else{
					$(document).attr( "data-slide", false )
				}
				_self.css("transform", "translateX("+distent+"px)" );
			}

			if (!$(document).attr("data-slide")) {
	 			$(window).off("mousedown.slide");
	 			$(window).on('mousedown.slide', function(ev) {
	 				console.log(1)
	 				var tar = ev.target;
	 				
	 				if ( $(document).attr("data-slide") && !(_self.is(ev.target) || _self.has(ev.target).length!==0  ) ) {
	 					move( 0 );
	 					$(window).off( ".slide" );
	 				}
	 			});
	 		}

			$(window).on('mousemove.slide', function(ev) {
				console.log(2)
				ev.preventDefault();
				endX = ev.pageX;
				disX =  endX - x ;
				//console.log(disX)
				if ( translateX === 0 ) {
					
					if (disX> 0) {
						disX = 0;
					}
					if (disX< -maxX) {
						disX = -maxX
					}
					
					move( disX )

				} else{

					if (disX< 0) {
						disX = 0;
					}
					if (disX> maxX) {
						disX = maxX
					}
					move(translateX+disX);
				}
				
			}).on('mouseup.slide', function(ev) {
				console.log(3)
				ev.preventDefault();
				//console.log(translateX+disX)
				if (disX <= -maxX/2 ) {
					disX = -maxX;
				} else if(  disX < maxX/2){
					disX = 0;
				} else if( maxX/2 <= disX  ){
					disX = maxX;
				}
				
				move( translateX+disX );
				//移除事件
				$(window).off("mousemove.slide mouseup.slide");
				
			});

		});
	}
}

// 2 兼容android关闭软键盘事件
$("#search_text").focus(function (d) {
	var wHeight;
	wHeight = window.innerHeight;
	$(window).resize(function (ev) {
		var hh = window.innerHeight;
		var viewTop = $(window).scrollTop();
		//console.log( hh, viewTop );
		if( Math.abs(wHeight - hh) < 10 ) {
			$("#search_text").blur();
			$(window).off("resize");
		}
	});
});


/**
 * 3 多选 
 * @param  {$obj} $switch 全选按钮
 * @param  {$obj} $opt    选项
 * 注意：动态切换selected类名      
 * @return {none}         
 */
function multiSelect( $switch, $opt ){
	var max = $opt.length;
	var num = 0;

	$switch.click(function(event) {
		if ($switch.hasClass('selected')) {
			$switch.removeClass('selected');
			$opt.removeClass('selected');
			num = 0;
		}else{
			$switch.addClass('selected');
			$opt.addClass('selected');
			num = max;
		}
	});

	$opt.click(function(event) {
		var $tar = $( event.delegateTarget );

		if ( $tar.hasClass('selected') ) {
			$tar.removeClass('selected')
			num--;
		}else{
			$tar.addClass('selected')
			num++;
		}
		//是否全选
		if (num === max) {
			$switch.addClass('selected');
		}else{
			$switch.removeClass('selected');
		}
	});
}




