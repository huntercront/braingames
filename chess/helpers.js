function fixEvent(e) {
	// получить объект событие для IE
	e = e || window.event

	// добавить pageX/pageY для IE
	if ( e.pageX == null && e.clientX != null ) {
		var html = document.documentElement
		var body = document.body
		e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
		e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
	}

	// добавить which для IE
	if (!e.which && e.button) {
		e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) )
	}

	return e
}

function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        return getOffsetRect(elem)
    } else {
        return getOffsetSum(elem)
    }
}

function getOffsetRect(elem) {
    var box = elem.getBoundingClientRect()
 
    var body = document.body
    var docElem = document.documentElement
 
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0
    var top  = box.top +  scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft
 
    return { top: Math.round(top), left: Math.round(left) }
}

function getOffsetSum(elem) {
    var top=0, left=0
    while(elem) {
        top = top + parseInt(elem.offsetTop)
        left = left + parseInt(elem.offsetLeft)
        elem = elem.offsetParent        
    }
 
    return {top: top, left: left}
}

function generate_link(type, event) {
	if (type != 'img' && (event.shiftKey || event.ctrlKey))
	{
		var moves = board.get_moves(event.shiftKey);
		if (moves)
		{
			prompt("", moves);
			return;
		}
	}
	var data = board.get_link_data();
	if (!data)
		return;

    var pathArray = location.pathname.split( '/' );
	var newPathname = "";
	for (var i = 0; i<pathArray.length-1; i++) 
	{
		newPathname += pathArray[i] + "/";
	}
	var link = "http://" + location.host + newPathname + "index.php?figures=" + data;
	if (type == 'img')
		link += "&image_only=1";
	prompt("",  link);
}

function save_mindgame_data() {
	var data = board.get_link_data();
	if (!data)
		return;

	var button = document.getElementById('positionData');
	button.value = data;
}