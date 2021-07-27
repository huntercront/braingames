var piece = {
	type: null,
	color: null,
	ismovable: null,

	get_image: function() {
		return "../chess/" + this.type + this.color + ".gif";
	},

	create: function(type_color, ismovable = true) {
		var obj = Object.create(piece);
		obj.type = type_color.substr(0, 1);
		obj.color = type_color.substr(1, 1);
		obj.ismovable = ismovable;
		return obj;
	},

	toString: function() {
		return this.type + this.color;
	}
};

var board = {
	size: 8,
	vertical_names: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
	cells: [],
	element: null,
	movement: null,
	undo_history: [],
	redo_history: [],

	clear: function() {
		for (var index in this.cells)
			if (this.cells.hasOwnProperty(index))
				this.clear_piece(index);
		this.cells.length = 0;
		this.undo_history.length = 0;
		this.redo_history.length = 0;
	},

	set_initial: function(figures, immoveableFigures = false) {
		this.clear();

		if (immoveableFigures && immoveableFigures != 'void')
		{
			for (var i = 0; i < immoveableFigures.length; i += 4)
			{
				var p = immoveableFigures.substr(i, 2);
				var h = parseInt(immoveableFigures.substr(i + 2, 1));
				var v = this.vertical_names[parseInt(immoveableFigures.substr(i + 3, 1)) - 1];
				this.set_piece(v + h, piece.create(p, false));
			}
		}

		if (figures == 'void')
			return true;
		if (figures)
		{
			for (var i = 0; i < figures.length; i += 4)
			{
				var p = figures.substr(i, 2);
				var h = parseInt(figures.substr(i + 2, 1));
				var v = this.vertical_names[parseInt(figures.substr(i + 3, 1)) - 1];
				this.set_piece(v + h, piece.create(p));
			}
		}
		else
		{
			this.set_piece('a1', piece.create('rw'));
			this.set_piece('b1', piece.create('nw'));
			this.set_piece('c1', piece.create('bw'));
			this.set_piece('d1', piece.create('qw'));
			this.set_piece('e1', piece.create('kw'));
			this.set_piece('f1', piece.create('bw'));
			this.set_piece('g1', piece.create('nw'));
			this.set_piece('h1', piece.create('rw'));

			this.set_piece('a8', piece.create('rb'));
			this.set_piece('b8', piece.create('nb'));
			this.set_piece('c8', piece.create('bb'));
			this.set_piece('d8', piece.create('qb'));
			this.set_piece('e8', piece.create('kb'));
			this.set_piece('f8', piece.create('bb'));
			this.set_piece('g8', piece.create('nb'));
			this.set_piece('h8', piece.create('rb'));

			for (var i = 1; i <= 8; ++i)
			{
				var char = String.fromCharCode(96 + i);
				this.set_piece(char + '2', piece.create('pw'));
				this.set_piece(char + '7', piece.create('pb'));
			}
		}
	},

	get_cell: function(cell) {
		return document.getElementById('cell_' + cell);
	},

	set_piece: function(cell, piece) {
		this.cells[cell] = piece;
		var cell_obj = this.get_cell(cell);
		cell_obj.innerHTML = '<img src="' + piece.get_image() + '" class="fig"/>';
		cell_obj.dragObject = new DragObject(cell_obj.firstChild);
	},

	clear_piece: function(cell) {
		this.cells[cell] = null;
		var cell_obj = this.get_cell(cell);
		cell_obj.innerHTML = '';
		cell_obj.dragObject = null;
	},

	is_same_color: function(piece1, piece2) {
		return piece1 && piece2 && piece1.color == piece2.color;
	},

	move_piece: function(in_redo) {
		if (this.movement.old_cell)
		{
			var new_cell_piece = this.cells[this.movement.new_cell];
			if (!this.movement.piece.ismovable
					|| new_cell_piece && (this.is_same_color(new_cell_piece, this.movement.piece)
						|| new_cell_piece.type == 'k'
						|| new_cell_piece.type == 'm'
						|| !new_cell_piece.ismovable))
				return false;
			this.undo_history.push({ move: this.movement, old: new_cell_piece });
			if (!in_redo)
				this.redo_history.length = 0;
			this.clear_piece(this.movement.old_cell);
		}
		else
		{
			if (this.cells[this.movement.new_cell])
				return false;
		}
		this.set_piece(this.movement.new_cell, this.movement.piece);
		return true;
	},

	_undo_internal: function() {
		var old_move = this.undo_history.pop();
		this.redo_history.push(old_move);

		var movement = old_move.move;
		var old_piece = old_move.old;
		this.clear_piece(movement.old_cell);
		this.clear_piece(movement.new_cell);
		if (old_piece)
			this.set_piece(movement.new_cell, old_piece);
		this.set_piece(movement.old_cell, movement.piece);
	},

	undo: function() {
		if (this.undo_history.length)
			this._undo_internal();
	},

	undo_all: function() {
		while (this.undo_history.length)
			this._undo_internal();
	},

	_redo_internal: function() {
		var old_move = this.redo_history.pop();
		this.movement = old_move.move;
		this.move_piece(true);
	},

	redo: function() {
		if (this.redo_history.length)
			this._redo_internal();
	},

	redo_all: function() {
		while (this.redo_history.length)
			this._redo_internal();
	},

	get_link_data: function() {
		var data = '';
		for (var index in this.cells)
			if (this.cells.hasOwnProperty(index) && this.cells[index])
				data += this.cells[index].toString() + index.substr(1, 1) + (1 + this.vertical_names.indexOf(index.substr(0, 1)));
		return data;
	},

	get_moves: function(short_mode) {
		var data = '';
		var move_index = 1;
		for (var index in this.undo_history)
			if (this.undo_history.hasOwnProperty(index))
			{
				var history_item = this.undo_history[index];
				var movement = history_item.move;
				var is_white = movement.piece.color == 'w';
				var move_head;
				if (short_mode)
				{
					var piece_type = movement.piece.type.toUpperCase();
					if (piece_type == 'P')
						move_head = history_item.old ? movement.old_cell.toString() + ':' : '';
					else
						move_head = piece_type + (history_item.old ? ':' : '');
				}
				else
				{
					move_head = movement.old_cell.toString() + (history_item.old ? ':' : '-');
				}
				data += (is_white ? (move_index++) + ". " : "")
					+ move_head
					+ movement.new_cell.toString()
					+ (!is_white ? ',\n' : ' ');
			}
		return data;
	},

	do_load: function(figures, imFigures = false) {
		board.element = document.getElementById('board');
		board.set_initial(figures, imFigures);
	
		var dragObjects = document.getElementsByTagName('img');
		for (var i = 0; i < dragObjects.length; ++i) {
			if (dragObjects[i].className == 'fig' || dragObjects[i].id.indexOf('supply') != -1)
				new DragObject(dragObjects[i]);
		}
		var dropTargets = document.getElementById('board').getElementsByTagName('td');
		for (var i = 0; i < dropTargets.length; ++i) {
			if (dropTargets[i].id.indexOf('cell') != -1)
				new DropTarget(dropTargets[i]);
		}
		if (imFigures == false) new DropTarget(document.getElementById('trash'));
	}
};
