    // Size 4x4 means 15 boxes 
    const BOARD_SIZE = 4
    const BOX_SIZE = 80
    const BOX_MARGIN = 1
    const N_ITER_SCRAMBLE = 200

    let board = document.getElementById('Board');

    // List of boxes around the empty one
    let boxes_around_empty = []

    // Avoid winning splash screen when scrambling and at startup
    let skip_splash_screen_win = true;

	CreateSolvedPuzzle();
	
    // Listen to user actions
    document.getElementById('BtnScramble').addEventListener('click', ScramblePuzzle);
	board.addEventListener('click', function(e) {
		MoveBox(e.target);
	});

	function CreateSolvedPuzzle()
    {	
		board.innerHTML = '';
		let number = 1;
		for (let c = 0; c < BOARD_SIZE; c++)
        {
			for (let r = 0; r < BOARD_SIZE; r++)
            {
				let box = document.createElement('span');
				box.id = 'box-' + r + '-' + c;
				box.style.left = (r * BOX_SIZE+BOX_MARGIN * r + 1) + 'px';
				box.style.top = (c * BOX_SIZE+BOX_MARGIN * c + 1) + 'px';
				
				if(number <= 15){
					box.classList.add('number');
					box.innerHTML = (number++).toString();
				} else {
					box.className = 'empty';
				}				
				board.appendChild(box);
			}
		}
        FindBoxesAroundEmpty();	
	}

    function FindBoxesAroundEmpty()
    {
        let empty_box = GetEmptyBox();
        let id = empty_box.id.split('-');
		let empty_row = parseInt(id[1]);
        let empty_col = parseInt(id[2]);
        
        boxes_around_empty = [];

        AddBoxAroundEmpty(empty_row, empty_col - 1);
        AddBoxAroundEmpty(empty_row, empty_col + 1);
        AddBoxAroundEmpty(empty_row - 1, empty_col);
        AddBoxAroundEmpty(empty_row + 1, empty_col);
    }

	function MoveBox(box_clicked)
    {
		if (box_clicked.className != 'empty')
        {
            // Look if close to the empty box and swap them
			if (IsAdjacentEmptyBox(box_clicked) == true)
            {
                let empty_box = GetEmptyBox();
				let tmp = {style: box_clicked.style.cssText, id: box_clicked.id};
				
				box_clicked.style.cssText = empty_box.style.cssText;
				box_clicked.id = empty_box.id;
				empty_box.style.cssText = tmp.style;
				empty_box.id = tmp.id;

                // Update list 
                FindBoxesAroundEmpty();
				
                if ((skip_splash_screen_win == false) && (CheckWin() == true))
                {
                    board.innerHTML = '<p>You WIN, congrats!</p>';
                    document.getElementById('BtnScramble').style.visibility = 'hidden';
                }
			}
		}
	}

    function IsAdjacentEmptyBox(box_clicked)
    {
        for (const elem of boxes_around_empty)
        {
            if (box_clicked == elem)
            {
                return true;
            }
        }
        return false;
    }
	
	function ScramblePuzzle()
    {
        skip_splash_screen_win = true;
        do
        {
            // To generate a playable scenario mimic random moves
            for (let k = 0; k < N_ITER_SCRAMBLE; k++)
            {
                let row = Math.floor(Math.random() * BOARD_SIZE);
                let col = Math.floor(Math.random() * BOARD_SIZE);
                let box = GetBox(row, col);
                MoveBox(box);
            }
        } while (CheckWin() == true);
        skip_splash_screen_win = false;
    }
	
	function GetBox(row, col)
    {
		return document.getElementById('box-'+row+'-'+col);	
	}

	function GetEmptyBox()
    {
		return board.querySelector('.empty');
	}

    function AddBoxAroundEmpty(row, col)
    {
        let tmp = GetBox(row, col);
        // Discard undefined (=out of board) Boxes
        if (tmp)
        {
            boxes_around_empty.push(tmp);
        }
    }

    function CheckWin()
    {
        let counter = 1;
        let win = true;
        for (let c = 0; c < BOARD_SIZE; c++)
        {
            for (let r = 0; r < BOARD_SIZE; r++)
            {
                let box = GetBox(r, c,);
                if ((counter <=15) && (counter.toString() != box.innerHTML.toString()))
                {
                    win = false;
                }
                counter++;
            }
        }
        return win;
    }