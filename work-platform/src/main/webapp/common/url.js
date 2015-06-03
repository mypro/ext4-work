/**
 * 获取URL中的参数
 * @param name
 * @returns
 */
function getUrlParam(url, name)
{
	var reg = new RegExp("(^|[&?])"+ name +"=([^&]*)(&|$)");
	var r = url.substr(1).match(reg); 
	if (r!=null) 
		return unescape(r[2]); 
	return null; 
}
 