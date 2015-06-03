var Qu ={};	
	
//构造函数

Qu.Queue = function (len) {
	this.capacity = 10
   
	if(len != undefined){
	
		this.capacity = len; //队列最大容量
	}
    this.current = 0;

    this.list = new Array();    //队列数据

};


//入队

Qu.Queue.prototype.enqueue = function (data) {

    if (data == null) return;

	if(this.list.length == 0){
			this.current = 0;
    		this.list.push(data);
	}else if(this.list.length ==this.capacity){
		 if(this.current == this.capacity-1) {
			this.list.remove(0);
			this.current = this.capacity-1;
			this.list.push(data);
		 }else{
		    this.current += 1;
			this.list.splice(this.current, this.list.length-this.current, data)
		 }
    }else{
		
			if(this.current == this.list.length-1){
			    this.current = this.list.length;
				this.list.push(data);
			}else {
				this.current += 1;
				this.list.splice(this.current, this.list.length-this.current, data)
				
			}
		
    	
    }
	

};





 

//队列是否空

Qu.Queue.prototype.isEmpty = function () {

    if (this == null|this.list==null) return false;

    return this.list.length>0;

};

//对象数组扩展remove

Array.prototype.remove = function(dx) {

    if (isNaN(dx) || dx > this.length) {

        return false;

    }

    for (var i = 0, n = 0; i < this.length; i++) {

        if (this[i] != this[dx]) {

            this[n++] = this[i]

        }

    }

    this.length -= 1

} 




//前进一个　　
Qu.Queue.prototype.front = function () {
    if (this.list == null || this.current == this.list.length-1) return false;
    this.current +=1;
    return  this.list[this.current];

};

//后退一个
Qu.Queue.prototype.back = function () {

    if (this.list == null || this.current == 0) return false;
    this.current -=1;
    return  this.list[this.current];

};