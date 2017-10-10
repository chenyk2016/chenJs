// JavaScript Document
/*
导航

$1 1、获取节点 | 2.获取改变样式
*/

// 创建构造函数
var $1=function(){
	return new base();	
}

//基础库
function base(){
	this.elements=[];	//存储元素
	//1、获取节点
	this.getId=function (id){
		this.elements.push(document.getElementById(id));
		return this; 
	};

	this.getTagName=function (tagName){
		var ele=document.getElementsByTagName(tagName);
		for (var i = 0; i < ele.length; i++) {
			this.elements.push(ele[i]);
		}
		return this; 
	};

	this.getClassName=function (className,id){	//
		var node;
		if(arguments.length==2){
			node=document.getElementById(id);
		}else{
			node=document;
		}
		var ele=node.getElementsByClassName(className);
		for (var i = 0; i < ele.length; i++) {
			this.elements.push(ele[i]);
		}
		return this; 
	};

	this.getName=function (name){
		var ele=document.getElementsByClassName(name);
		for (var i = 0; i < ele.length; i++) {
			this.elements.push(ele[i]);
		}
		return this; 
	};
};//basecss结束

//获取某一个元素
base.prototype.getElement=function(num){
	var ele=this.elements[num];
	elements=[];
	elements.push(ele);
	return this;
};

// 2、获取、改变样式
base.prototype.css=function(attr,value){	//属性，值 | 一个为读取
	for (var i = 0; i < this.elements.length; i++) {
		if(arguments.length==1){
		    return this.elements[i].style[attr];
		}
		this.elements[i].style[attr]=value;
	}
	this.elements[0].style[attr]=value;//style[attr]是为了避免传入的引号
	return this;
};

//3、添加/移除类名
base.prototype.addClass=function(className){
	for (var i = 0; i < this.elements.length; i++) {
		var reg=new RegExp("(\\s|^)"+className+"(\\s|$)");
		var flag=this.elements[i].className.match(reg);
		
		if (!flag) {
			this.elements[i].className+=" "+className;
		}
	}
	return this;
};
base.prototype.removeClass=function(className){
	for (var i = 0; i < this.elements.length; i++) {
		var reg=new RegExp("(\\s|^)"+className+"(\\s|$)");
		var flag=this.elements[i].className.match(reg);
		if (flag) {
			this.elements[i].className=this.elements[i].className.replace(reg,"");
		}
	}
	return this;
};

// 4、添加移除link或style的css规则
base.prototype.addRule=function(num,selector,cssText,position){//第几个样式表| 选择器| CSS样式| 位置
	var sheet=document.styleSheets[num];
	if(typeof sheet.insertRule!="undefined"){//w3c
		sheet.insertRule(selector+'{'+cssText+'}',position)
	}else if(typeof sheet.addRule!="undefined"){
		sheet.addRule(selector,cssText,position);
	}
}
base.prototype.removeRule=function(num,index){//第几个样式表| 第几条样式
	var sheet=document.styleSheets[num];
	if(typeof sheet.deleteRule!="undefined"){//w3c
		sheet.deleteRule(index);
	}else if(typeof sheet.removeRule!="undefined"){
		sheet.removeRule(index);
	}
}









