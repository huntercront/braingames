function DropTarget(element) {
	
	element.dropTarget = this;
	
	this.canAccept = function(dragObject) {
		return true;
	}
	
	this.accept = function(dragObject) {
		this.onLeave();
		var coords = getOffset(element);
		dragObject.settle(coords.left, coords.top);

		if (element.id == 'trash')
		{
			if (board.movement.old_cell)
				board.clear_piece(board.movement.old_cell);
			dragObject.hide();
			dragObject = null;
			element.dragObject = null;
		}
		else
		{
			//console.log(board.movement);
			board.movement.new_cell = element.id.substr(5);
			if (!board.movement.old_cell)
			{
				dragObject.hide();
				dragObject = null;
				element.dragObject = null;
			}
			if (!board.move_piece())
				return false;
		}
		return true;
	}
	
	this.onLeave = function() {
		element.className = '';
	}
	
	this.onEnter = function() {
		element.className = element.id == "trash" ? 'trash_highlight' : 'highlight';
	}
	
	this.toString = function() {
		return element.id;
	}
}
