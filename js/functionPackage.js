 //---前一个兄弟节点
function previousNode(obj){
	if(obj.previousElementSibling){
		return obj.previousElementSibling;//---返回火狐
	}else{
		return obj.previousSibling;//---返回IE678
	}
}
//后一个兄弟节点
function nextNode(obj){
	if(obj.nextElementSibling){
		return obj.nextElementSibling;//---返回火狐
	}else{
		return obj.nextSibling;//---返回IE678
	}
}
//获取所有的兄弟节点，不包括自己
function Siblings(elm){
	var arr = [];
	var nodes = elm.parentNode.children;
	for(var i =0;i<nodes.length;i++) {
		if(nodes[i] !== elm) {
			arr.push(nodes[i]);
	    }
	}
	return arr;
	}

//---第一个子节点
function firstNode(obj){
	if(obj.firstElementChild){
		return obj.firstElementChild;//---返回火狐
	}else{
		return obj.firstChild;//---返回IE678
	}
}
//---最后一个子节点
function lastNode(obj){
	if(obj.lastElementChild){
		return obj.lastElementChild;//---返回火狐
	}else{
		return obj.lastChild;//---返回IE678
	}
}
//---缓冲水平运动函数
function animateLeft(ele,target){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		var step = (target - ele.offsetLeft )/10
		step = step>0?Math.ceil(step):Math.floor(step);
		ele.style.left = ele.offsetLeft + step + 'px';
		//---到目标值时清除定时器
		if(Math.abs(target-ele.offsetLeft)<Math.abs(step)){
			ele.style.left = target + 'px';
			clearInterval(ele.timer);
		}	
	},30);
}
//---缓冲垂直运动函数
function animateTop(ele,target){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		var step = (target - ele.offsetTop )/10
		step = step>0?Math.ceil(step):Math.floor(step);
		ele.style.top = ele.offsetTop + step + 'px';
		//---到目标值时清除定时器
		if(Math.abs(target-ele.offsetTop)<Math.abs(step)){
			ele.style.top = target + 'px';
			clearInterval(ele.timer);
		}	
	},30);
}
//---缓冲水平垂直运动函数
function animateLeftTop(ele,targetx,targety){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		//水平
		var stepx = (targetx - ele.offsetLeft )/10
		stepx = stepx>0?Math.ceil(stepx):Math.floor(stepx);
		ele.style.left = ele.offsetLeft+ stepx + 'px';
		//---到目标值时清除定时器
		if(Math.abs(targetx-ele.offsetLeft)<Math.abs(stepx)){
			ele.style.left = targetx + 'px';
			clearInterval(ele.timer);
		}	
		//垂直
		var stepy = (targety - ele.offsetTop )/10
		stepy = stepy>0?Math.ceil(stepy):Math.floor(stepy);
		ele.style.top = ele.offsetTop+ stepy + 'px';
		//---到目标值时清除定时器
		if(Math.abs(targety-ele.offsetTop)<Math.abs(stepy)){
			ele.style.top = targety + 'px';
			clearInterval(ele.timer);
		}	
	},10);
}
//---scroll()封装
function scroll(obj){
	if(window.pageYOffset != undefined){
		//---火狐/谷歌/ie9+以上支持的
		return {
			"top": window.pageYOffset,
			"left": window.pageXOffset
		};
	}else if(document.compatMode === 'CSS1Compat'){
		//---已经声明DTD,（IE678只认识他）,compatMode渲染模式
		return {
			"top" : document.documentElement.scrollTop,
			"left" : document.documentElement.scrollLeft
		};
	}else{
		//---未声明 DTD（谷歌只认识他）
		return {
			"top" : document.body.scrollTop,
			"left" : document.body.scrollLeft
		};
	}
}
//DOM的三大家族之一clientHeight/width
function client(){
	if(window.innerHeight !== undefined){
		//---火狐/谷歌/ie9+以上支持的
		return {
            "width": window.innerWidth,
            "height": window.innerHeight
        }
	}else if(document.compatMode === "CSS1Compat"){
		//---已经声明DTD,（IE678只认识他）,compatMode渲染模式
        return {
            "width": document.documentElement.clientWidth,
            "height": document.documentElement.clientHeight
        }
	}else{
		//---未声明 DTD（谷歌只认识他）
        return {
            "width": document.body.clientWidth,
            "height": document.body.clientHeight
        }
	}
}
//---拖拽封装
function drag(obj){
	obj.onmousedown = function(ev){
		var ev = ev||window.event;
		//---鼠标相对盒子的位置
		var disX = ev.clientX - this.offsetLeft;
		var disY = ev.clientY - this.offsetTop;
		//setCapture可以将鼠标事件锁定在指定的元素上，
		//当元素捕获了鼠标事件后，该事件只能作用在当前元素上。
		if(obj.setCapture){
			obj.setCapture();
		}
		
		document.onmousemove = function(ev){
			var ev = ev||window.event;
			//水平
			var moveLeft = ev.clientX - disX;
			if(moveLeft<0){
				moveLeft = 0;
			}else if(moveLeft>client().width-obj.offsetWidth){
				moveLeft = client().width-obj.offsetWidth;
			}
			
			//垂直
			var moveTop = ev.clientY - disY;
			if(moveTop<0){
				moveTop = 0;
			}else if(moveTop>client().height-obj.offsetHeight){
				moveTop = client().height-obj.offsetHeight;
			}

			obj.style.left = moveLeft + 'px';
			obj.style.top = moveTop + 'px';
		}
		document.onmouseup = function(){
			document.onmousemove  = document.onmouseup = null;
			//releaseCapture()可以为指定的元素解除事件锁定。
			//它们俩必须成对使用
			if(obj.releaseCapture){
				obj.releaseCapture();
			}
			return false;
		}
	}
}
//放大镜
function showBig(minbox,minImg,mask,maxbox,maxImg){
	minbox.onmousemove = function(event){
		var event = event||window.event;
		mask.style.display = 'block';
		maxbox.style.display = 'block';
		
//				鼠标在页面中位置 - 鼠标在元素中的位置
//				蒙版限制在minbox中
		//---蒙版移动（鼠标就在蒙版的中间）
		var maskL = event.clientX - minbox.offsetLeft - mask.offsetWidth/2;
		var maskT = event.clientY - minbox.offsetTop - mask.offsetHeight/2;
		
		//---判断蒙版的移动范围
		var maxmoveX = minbox.offsetWidth-mask.offsetWidth;
		var maxmoveY = minbox.offsetHeight-mask.offsetHeight;
		
		if(maskL>=maxmoveX){
			maskL = maxmoveX;
		}else if(maskL<0){
			maskL = 0;
		}
		if(maskT>=maxmoveY){
			maskT = maxmoveY;
		}else if(maskT<0){
			maskT = 0;
		}
		mask.style.left = maskL + 'px';
		mask.style.top = maskT + 'px';
		
		//控制移动比例
		var scale = maxImg.offsetWidth/minImg.offsetWidth;
		maxImg.style.left = -maskL*scale + 'px';
		maxImg.style.top = -maskT*scale + 'px';
	
		minbox.onmouseout = function(){
			mask.style.display = 'none';
			maxbox.style.display = 'none';
		}
	}
}
//---获取css样式
function getCssStyle(ele,attr){
	if(window.getComputedStyle(ele,null)){
		return window.getComputedStyle(ele,null)[attr];
	}else{
		return ele.currentStyle[attr];
	}
}
//---动画封装
function animate(ele,json,fn){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		var flag = true;
		for(Key in json){
			
			if(Key==='opacity'){
				var leader = getCssStyle(ele,Key)*100||1;
			}else{
				leader = parseInt(getCssStyle(ele,Key))||0;
			}
			
			var step = (json[Key] - leader)/10;
			step = step>0?Math.ceil(step):Math.floor(step);
			leader = leader + step;
			
			if(Key==='opacity'){
				ele.style[Key] = leader/100;
				ele.style.filter = 'alpha(opacity='+leader+')';
			}else if(Key==='zIndex'){
				ele.style.zIndex = json[Key];
			}else{
				ele.style[Key] = leader + 'px';
			}
			
			//---判断所有的属性是否到达目标值
			if(json[Key]!==leader){
				flag = false;
			}
		}
		//---所有的已经走完才清除定时器
		if(flag){
			clearInterval(ele.timer);
			//---只要有回调函数，就直接调用
			if(fn){
				fn();
			}
		}
	},20);
}
//---添加事件监听
// addEventHaddler(inner,'click',inner1);
function addEventHaddler(obj,type,fn){
	if(obj.addEventListener){
		obj.addEventListener(type,fn,false);//---默认冒泡
	}else{
		obj.attachEvent('on'+type,fn);
	}
}
//---移除事件监听
// removeEventHaddler(inner,'click',inner1);
function removeEventHaddler(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn,false);
	}else{
		obj.detachEvent('on'+type,fn);
	}
};
			
