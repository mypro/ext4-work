var Schedule = {};


Schedule.createTask = function(trigger, fn, time, scope, args){
				scope = scope || this;
				new Ext.util.DelayedTask(function(){
					if(!trigger.call(scope, args)){
						Schedule.createTask(trigger, fn, time, scope);
						return;
					}
					fn.call(scope, args);
				}).delay(time);
};