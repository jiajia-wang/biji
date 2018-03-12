//	   常规                 输入框获取焦点            错误                                  正确                   
//box    box  		    box          box error             box right         box
//tip    tip hide      tip.default     tip error           tip hide
function $(id){
	return document.getElementById(id);
}

var regs={
		//用户名，中文、字母、数字、-、_ ,长度{4,15};
		userNameReg:/^(([\u4e00-\u9fa5])|[a-zA-Z0-9-_]){4,15}$/,
		pwdReg:/^.{6,16}$/,
		pwd2Reg:/^.{6,16}$/,
		emailReg:/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@([a-zA-Z0-9]+[-.])+[a-zA-Z]{2,4}$/,
		mobileReg:/1[3|5|8|4][0-9]\d{8}$/,
		strReg:/[a-zA-Z]/,
		numReg:/\d/,
		tsReg:/[^a-zA-Z0-9]/
		}
var userName = $('userName');
var pwd = $('pwd');
var pwd2 = $('pwd2');
var email = $('email');
var mobile = $('mobile');
var ck = $('ck');
var btn = $('btn');

//用户名
addEventHaddler(userName,'keyup',user);
addEventHaddler(userName,'blur',user);
addEventHaddler(userName,'focus',user);
function user(Event){
	var Event = Event||window.event;
	var userNameReg = regs.userNameReg;
	var Sp1 = '支持中文、字母、数字、-、_的组合,长度4-16个字符';
	var Sp2 = '用户名不能为空';
	var Sp3 = '格式错误，仅支持中文、字母、数字、-、_的组合';
	var res = Check(Event,userName,userNameReg,Sp1,Sp2,Sp3);
	if(res){
		return true;
	}else{
		return false;
	}
}
//密码
addEventHaddler(pwd,'keyup',Pwd);
addEventHaddler(pwd,'blur',Pwd);
addEventHaddler(pwd,'focus',Pwd);
function Pwd(Event){
	var Event = Event||window.event;
	var pwdReg = regs.pwdReg;
	var Sp1 = '支持6-16位的任意字符';
	var Sp2 = '密码不能为空';
	var Sp3 = '密码格式错误，';
	var res = Check(Event,pwd,pwdReg,Sp1,Sp2,Sp3);
	if(res){
		return true;
	}else{
		return false;
	}
}

//确认密码
addEventHaddler(pwd2,'keyup',Pwd2);
addEventHaddler(pwd2,'blur',Pwd2);
addEventHaddler(pwd2,'focus',Pwd2);
function Pwd2(Event){
	var Event = Event||window.event;
	var pwd2Reg = regs.pwd2Reg;
	var Sp1 = '请再次输入密码';
	var Sp2 = '确认密码不能为空';
	var Sp3 = '两次密码输入不一致';
	var res = Check(Event,pwd2,pwd2Reg,Sp1,Sp2,Sp3);
	if(res){
		return true;
	}else{
		return false;
	}
}

//邮箱
addEventHaddler(email,'keyup',Email);
addEventHaddler(email,'blur',Email);
addEventHaddler(email,'focus',Email);
function Email(Event){
	var Event = Event||window.event;
	var emailReg = regs.emailReg;
	var Sp1 = '支持大部分邮箱格式';
	var Sp2 = '邮箱不能为空';
	var Sp3 = '邮箱格式错误，';
	var res = Check(Event,email,emailReg,Sp1,Sp2,Sp3);
	if(res){
		return true;
	}else{
		return false;
	}
}

//手机
addEventHaddler(mobile,'keyup',Mobile);
addEventHaddler(mobile,'blur',Mobile);
addEventHaddler(mobile,'focus',Mobile);
function Mobile(Event){
	var Event = Event||window.event;
	var mobileReg = regs.mobileReg;
	var Sp1 = '请输入正确邮箱，格式如：18533089878';
	var Sp2 = '手机号不能为空';
	var Sp3 = '手机号码格式错误，格式如：18533089878';
	var res = Check(Event,mobile,mobileReg,Sp1,Sp2,Sp3);
	if(res){
		return true;
	}else{
		return false;
	}
}

function Check(Event,Ele,Reg,Sp1,Sp2,Sp3){
	var type;
	if(Event){
		type = Event.type;
	}
	var Value = Ele.value;
	var box = Ele.parentNode;
	var tip = box.parentNode.children[1];
	var span = tip.children[1];
	if(type=='focus'){
		if(Value==''){
			box.className = 'box';
			tip.className ='tip default';
			span.innerHTML = Sp1;
			return false;
		}
	}	
	if(type=='blur'){
		if(Value==''){
			box.className = 'box';
			tip.className ='tip hide';
			return false;
		}
	}
	//---onkeyup--有内容输入
	if(Value==''){
		box.className = 'box error';
		tip.className ='tip error';
		span.innerHTML = Sp2;
		return false;
	}else if(Reg.test(Value)){
		box.className = 'box right';
		if(Event.target.id=='pwd'){
			//密码等级
			var le = getPwdLevel(Value);
			switch(le){
				case 1 :
					tip.className = 'tip ruo';
					span.innerHTML = '建议修改';
					break;
				case 2 :
					tip.className = 'tip zhong';
					span.innerHTML = '可以使用';
					break;
				case 3 :
					tip.className = 'tip qiang';
					span.innerHTML = '非常完美';
					break;
			}
			return true;	
		}else if(Event.target.id=='pwd2'){
			if($('pwd').value==Value){
				box.className='box right';
				tip.className = 'tip hide';
				return true;
			}else{
				box.className = 'box error';
				tip.className ='tip error';
				return false;
			}
		}else{
			tip.className ='tip hide';
			return true;
		}
	}else{//内容错误
		box.className = 'box error';
		tip.className ='tip error';
		span.innerHTML = Sp3;
		return false;
	}
}

function getPwdLevel(pwd){
	var level = 0;
	if(regs.strReg.test(pwd)){
		level++;
	};
	if(regs.numReg.test(pwd)){
		level++;
	};
	if(regs.tsReg.test(pwd)){
		level++;
	}
	if(level>3){
		level=3;
	};
	return level;
}
function checkData(){
	var box = ck.parentNode;
	var tip = box.parentNode.children[1];
	var span = tip.children[1];
	if(ck.checked){
		if(user()&&Pwd()&&Pwd2()&&Email()&&Mobile()){
			alert('信息填写正确，正则为您跳转。。。。');
			return true;
		}else{
			alert('信息输入有误，请重新输入。。');
			return false;
		}
	}else{
		tip.className = 'tip error';
		span.innerHTML = '请阅读协议,并同意';
		return false;
	}
	return false;
}
ck.onclick = function(){
	var tip = this.parentNode.parentNode.children[1];
	if(this.checked){
		tip.className='tip hide';
	}
}
