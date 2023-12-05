########################################################################
# COMP1521 22T2 -- Assignment 1 -- Connect Four!
#
#
# !!! IMPORTANT !!!
# Before starting work on the assignment, make sure you set your tab-width to 8!
# It is also suggested to indent with tabs only.
# Instructions to configure your text editor can be found here:
#   https://cgi.cse.unsw.edu.au/~cs1521/22T2/resources/mips-editors.html
# !!! IMPORTANT !!!
#
#
# This program was written by Ezekiel Tay (z5378748)
# on 22/6/2022
#
# Version 1.0 (05-06-2022): Team COMP1521 <cs1521@cse.unsw.edu.au>
#
########################################################################

#![tabsize(8)]

# Constant definitions.
# DO NOT CHANGE THESE DEFINITIONS

# MIPS doesn't have true/false by default
true  = 1
false = 0

# How many pieces we're trying to connect
CONNECT = 4

# The minimum and maximum board dimensions
MIN_BOARD_DIMENSION = 4
MAX_BOARD_WIDTH     = 9
MAX_BOARD_HEIGHT    = 16

# The three cell types
CELL_EMPTY  = '.'
CELL_RED    = 'R'
CELL_YELLOW = 'Y'

# The winner conditions
WINNER_NONE   = 0
WINNER_RED    = 1
WINNER_YELLOW = 2

# Whose turn is it?
TURN_RED    = 0
TURN_YELLOW = 1

########################################################################
# .DATA
# YOU DO NOT NEED TO CHANGE THE DATA SECTION
	.data

# char board[MAX_BOARD_HEIGHT][MAX_BOARD_WIDTH];
board:		.space  MAX_BOARD_HEIGHT * MAX_BOARD_WIDTH

# int board_width;
board_width:	.word 0

# int board_height;
board_height:	.word 0


enter_board_width_str:	.asciiz "Enter board width: "
enter_board_height_str: .asciiz "Enter board height: "
game_over_draw_str:	.asciiz "The game is a draw!\n"
game_over_red_str:	.asciiz "Game over, Red wins!\n"
game_over_yellow_str:	.asciiz "Game over, Yellow wins!\n"
board_too_small_str_1:	.asciiz "Board dimension too small (min "
board_too_small_str_2:	.asciiz ")\n"
board_too_large_str_1:	.asciiz "Board dimension too large (max "
board_too_large_str_2:	.asciiz ")\n"
red_str:		.asciiz "[RED] "
yellow_str:		.asciiz "[YELLOW] "
choose_column_str:	.asciiz "Choose a column: "
invalid_column_str:	.asciiz "Invalid column\n"
no_space_column_str:	.asciiz "No space in that column!\n"


############################################################
####                                                    ####
####   Your journey begins here, intrepid adventurer!   ####
####                                                    ####
############################################################


########################################################################
#
# Implement the following 7 functions,
# and check these boxes as you finish implementing each function
#
#  - [X] main
#  - [X] assert_board_dimension
#  - [X] initialise_board
#  - [X] play_game
#  - [X] play_turn
#  - [X] check_winner
#  - [X] check_line
#  - [X] is_board_full	(provided for you)
#  - [X] print_board	(provided for you)
#
########################################################################


########################################################################
# .TEXT <main>
	.text
main:
	# Args:     void
	# Returns:
	#   - $v0: int
	#
	# Frame:    [$s0, $s1]
	# Uses:     [$a0, $a1, $a2, $s0, $s1, $s2]
	# Clobbers: [$a0, $a1, $a2, $s2]
	#
	# Locals:
	#   - [$s0 = board_width
	#	$s1 = board_height
	#	#s2 = BOARD]
	#
	# Structure:
	#   main
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

main__prologue:
	begin			# begin a new stack frame
	push	$ra		# | $ra
	push	$s0
	push 	$s1

main__body:
	# TODO ... complete this function
	la	$s2, 	board_width
	la	$s3,	board_height

	la	$a0,	enter_board_width_str
	li	$v0, 	4
	syscall

	li	$v0,	5
	syscall
	move 	$s0, 	$v0			#s0 = board_width
	sw	$s0,	board_width		#Put the value into address of board_width

	move	$a0,	$s0
	la	$a1,	MIN_BOARD_DIMENSION
	la	$a2,	MAX_BOARD_WIDTH

	jal	assert_board_dimension		#assert dimension function

	la	$a0,	enter_board_height_str
	li	$v0, 	4
	syscall

	li	$v0,	5
	syscall
	move	$s1,	$v0		#s1 = board_height
	sw	$s1,	board_height		#Put the value into address of board_height

	move	$a0,	$s1
	la	$a1,	MIN_BOARD_DIMENSION
	la	$a2,	MAX_BOARD_HEIGHT
	          
	jal	assert_board_dimension	#assert dimension function

	jal	initialise_board

	jal 	print_board

	jal	play_game

main__epilogue:
	pop 	$s1
	pop 	$s0
	pop	$ra		# | $ra
	end			# ends the current stack frame

	li	$v0, 0
	jr	$ra		# return 0;


########################################################################
# .TEXT <assert_board_dimension>
	.text
assert_board_dimension:
	# Args:
	#   - $a0: int dimension
	#   - $a1: int min
	#   - $a2: int max
	# Returns:  void
	#
	# Frame:    [...]
	# Uses:     [$a0, $a1, $a2]
	# Clobbers: [$a0, $a1, $a2]
	#
	# Locals:
	#   -  [$a0 = board width
	#	$a1 = MIN_BOARD_DIMENSION
	#	$a2 = MAX_BOARD_WIDTH/MAX_BOARD_HEIGHT
	#	]
	#
	# Structure:
	#   assert_board_dimension
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

assert_board_dimension__prologue:
assert_board_dimension__body:
	# TODO ... complete this function
	blt	$a0, 	$a1,	too_small
        bgt	$a0,	$a2,	too_big
	j	assert_board_dimension__epilogue

	too_small:
		la	$a0,	board_too_small_str_1
		li	$v0,	4
		syscall

		move	$a0,	$a1
		li	$v0,	1
		syscall

		la	$a0,	board_too_small_str_2
		li	$v0,	4
		syscall

		j	main__epilogue

	too_big:
		la	$a0,	board_too_large_str_1
		li	$v0,	4
		syscall

		move	$a0,	$a2
		li	$v0,	1
		syscall

		la	$a0,	board_too_large_str_2
		li	$v0,	4
		syscall

		j	main__epilogue
	

assert_board_dimension__epilogue:
	jr	$ra		# return;


########################################################################
# .TEXT <initialise_board>
	.text
initialise_board:
	# Args:     void
	# Returns:  void
	#
	# Frame:    [...]
	# Uses:     [$t2, $t3, $t4, $t5, $t6, $s0, $s1, $s2]
	# Clobbers: [$t2, $t3, $t4, $t5, $t6, $s0, $s1, $s2]
	#
	# Locals:
	#   - [$t2 = row
	#	$t3 = col
	#	$t4 = '.'
	#	$t5 = offset rows
	#	$t6 = offset amount
	#	$s0 = board_width
	#	$s1 = board_height 
	#	$s2 = board 2d array.]
	#
	# Structure:
	#   initialise_board
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

initialise_board__prologue:
initialise_board__body:
	# TODO ... complete this function
	li	$t2,	0	#set $t2 = row = 0


	row_count:	
		bge	$t2,	$s1,	initialise_board__epilogue	#row >= board_height, exit

		mul	$t5,	$t2, 	MAX_BOARD_WIDTH			#offset row.
		li	$t3, 	0					#set $t3 = col = 0
		
	col_count:
		bge	$t3,	$s0,	add_row		#col >= board_width, exit
		
		li	$t6,	0
		add	$t6,	$t5,	$t3		#determine offset amount

		la	$s2,	board
		add	$s2,	$s2,	$t6		#Offset address

		li	$t4,	CELL_EMPTY		
		sb	$t4,	0($s2)			

		addi	$t3,	$t3,	1		#increase column by one.
		j	col_count

	add_row:

		addi	$t2,	$t2,	1
		j	row_count

initialise_board__epilogue:
	jr	$ra		# return;


########################################################################
# .TEXT <play_game>
	.text
play_game:
	# Args:     void
	# Returns:  void
	#
	# Frame:    [$s0, $s1]
	# Uses:     [$s0, $s1, $t0, $a0]
	# Clobbers: [$t0, $a0]
	#
	# Locals:
	#   - [$s0 = whose_turn
	#	$s1 = winner 
	#	$t0 = board_full_checker]
	#	
	# Structure:
	#   play_game
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

play_game__prologue:
	begin	
	push 	$ra
	push	$s0
	push	$s1
	li	$s0,	TURN_RED
play_game__body:
	# TODO ... complete this function
	move	$a0,	$s0
	jal	play_turn
	move	$s0,	$v0	#store whose_turn in $s0
	
	jal	print_board

	jal	check_winner
	move	$s1,	$v0	#store winner in $s1

	jal	is_board_full
	move	$t0,	$v0	#store TRUE or FALSE in $t0

	beq	$t0,	true,	play_game__end0		#board_full true, end_game
	beq	$s1, 	WINNER_NONE,	play_game__body #Winner true, end_game

play_game__end0:
	beq	$s1,	WINNER_RED,	red_winner
	beq	$s1,	WINNER_YELLOW,	yellow_winner

no_winner:
	la	$a0,	game_over_draw_str
	li	$v0,	4
	syscall
	j	play_game__epilogue

red_winner:
	la	$a0,	game_over_red_str
	li	$v0,	4
	syscall
	j	play_game__epilogue

yellow_winner:
	la	$a0,	game_over_yellow_str
	li	$v0,	4
	syscall

play_game__epilogue:
	pop	$s1
	pop	$s0
	pop	$ra
	end
	jr	$ra		# return;


########################################################################
# .TEXT <play_turn>
	.text
play_turn:
	# Args:
	#   - $a0: int whose_turn
	# Returns:  void
	#
	# Frame:    [...]
	# Uses:     [$a0, $t0, $t1, $t2, $t3, $t4, $t5, $t6, $s2]
	# Clobbers: [$a0, $t0, $t1, $t2, $t3, $t4, $t5, $t6, $s2]
	#
	# Locals:
	#   - [$a0: int whose_turn
	#	$t0 = whose_turn
	#	$t1 = target_col	
	#	$t2 = target_row
	#	$t3 = offset
	#	$t4 = target cell
	#	$t5 = target_cell to fill Red/Yellow
	#	$t6 = board_width
	#	$s2 = BOARD address]
	# Structure:
	#   play_turn
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

play_turn__prologue:
play_turn__body:
	# TODO ... complete this function
	move	$t0,	$a0
	beq 	$t0,	TURN_RED,	play_turn_print_red

	la	$a0,	yellow_str	#printf("[YELLOW] ")
	li	$v0,	4
	syscall
	j 	play_turn_section0

play_turn_print_red:
	la	$a0,	red_str		#printf("[RED] ")
	li	$v0,	4
	syscall

play_turn_section0:
	la	$a0,	choose_column_str	#printf("Choose a column: ");
	li	$v0,	4
	syscall

	li	$v0,	5
	syscall
	move	$t1,	$v0		#scanf("%d", &target_col);
	sub	$t1,	$t1,	1	#target_col--; // user input is 1-indexed

	blt	$t1,	0,	play_turn_section1

	lw	$t6,	board_width

	bge	$t1,	$t6,	play_turn_section1	#line 130

	lw	$t3,	board_height
	sub	$t2,	$t3, 	1	#int target_row = board_height - 1;

play_turn_loop0:	
	blt	$t2,	0,	play_turn_curr_yellow  #target_row < 0, end_loop
	
	mul	$t3,	$t2,	MAX_BOARD_WIDTH
	add	$t3,	$t3,	$t1		#offset. Row*col + col
	la	$s2,	board
	add	$s2,	$s2,	$t3
	lb	$t4,	($s2)		#line134

	beq	$t4,	CELL_EMPTY,	play_turn_curr_yellow #board[target_row][target_col] == CELL_EMPTY, end_loop

	sub	$t2, 	$t2,	1	#target_row--; line 135
	blt 	$t2,	0,	play_turn_section3 #if (target_row < 0) {
	j	play_turn_loop0

play_turn_section1:
	la	$a0,	invalid_column_str
	li	$v0,	4
	syscall
	move	$v0,	$t0		#return whose_turn; line 130
	j 	play_turn__epilogue

play_turn_curr_yellow:			#line 143
	beq	$t0,	TURN_RED, 	play_turn_curr_red

	mul	$t3,	$t2,	MAX_BOARD_WIDTH
	add	$t3,	$t3,	$t1
	li	$t5,	CELL_YELLOW
	sb	$t5,	board($t3)

	li	$t0,	TURN_RED
	move	$v0,	$t0		#return TURN_RED; line 145

	j 	play_turn__epilogue

play_turn_curr_red:	
	mul	$t3,	$t2,	MAX_BOARD_WIDTH
	add	$t3,	$t3,	$t1
	li	$t5,	CELL_RED
	sb	$t5,	board($t3)

	li	$t0,	TURN_YELLOW
	move	$v0,	$t0		#return TURN_yellow; line 147
	j 	play_turn__epilogue

play_turn_section3:
	la	$a0,	no_space_column_str
	li	$v0,	4
	syscall

	move	$v0,	$t0		#return whose_turn; line 139
	j 	play_turn__epilogue

play_turn__epilogue:
	jr	$ra		# return;


########################################################################
# .TEXT <check_winner>
	.text
check_winner:
	# Args:	    void
	# Returns:
	#   - $v0: int
	#
	# Frame:    [$s0, $s1, $s2, $s3]
	# Uses:     [$s0, $s1, $s2, $s3, $a0, $a1, $a2, $a3]
	# Clobbers: [$a0, $a1, $a2, $a3]
	#
	# Locals:
	#   - [$s0 = row
	#	$s1 = col
	#	$s2 = board height
	#	$s3 = board_width]
	#
	# Structure:
	#   check_winner
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

check_winner__prologue:
	begin
	push	$ra
	push	$s0
	push	$s1
	push	$s2
	push	$s3

	li	$s0,	0	#set $s0 = row = 0
	lw	$s2,	board_height	#load size of board height into $s2
	lw	$s3,	board_width	#load size of board_width into $s3
check_winner__body:
	# TODO ... complete this function
	bge 	$s0,	$s2,	check_winner_none
	li	$s1,	0

check_winner_loop0:

	bge	$s1,	$s3,	check_winner_addition

	move	$a0,	$s0	#move row to 1st arg
	move	$a1,	$s1	#move row to 2nd arg
	la	$a2,	1	#3rd arg = 1
	la	$a3,	0	#4th arg = 0
	jal	check_line
	bne  	$v0,	WINNER_NONE,	check_winner__epilogue	#line 163

	move	$a0,	$s0	#move row to 1st arg
	move	$a1,	$s1	#move row to 2nd arg
	la	$a2,	0	#3rd arg = 0
	la	$a3,	1	#4th arg = 1
	jal	check_line
	bne  	$v0,	WINNER_NONE,	check_winner__epilogue	#line 166

	move	$a0,	$s0	#move row to 1st arg
	move	$a1,	$s1	#move row to 2nd arg
	la	$a2,	1	#3rd arg = 1
	la	$a3,	1	#4th arg = 1
	jal	check_line
	bne  	$v0,	WINNER_NONE,	check_winner__epilogue	#line 169

	move	$a0,	$s0	#move row to 1st arg
	move	$a1,	$s1	#move row to 2nd arg
	la	$a2,	1	#3rd arg = 1
	la	$a3,	-1	#4th arg = -1
	jal	check_line
	bne  	$v0,	WINNER_NONE,	check_winner__epilogue	#line 172

	add	$s1, 	$s1,	1
	j	check_winner_loop0

check_winner_addition:
	add	$s0, 	$s0,	1
	j	check_winner__body

check_winner_none:
	li	$v0,	WINNER_NONE

check_winner__epilogue:
	pop	$s3
	pop	$s2
	pop	$s1
	pop	$s0
	pop	$ra
	end
	jr	$ra		# return;

########################################################################
# .TEXT <check_line>
	.text
check_line:
	# Args:
	#   - $a0: int start_row
	#   - $a1: int start_col
	#   - $a2: int offset_row
	#   - $a3: int offset_col
	# Returns:
	#   - $v0: int
	#
	# Frame:    [...]
	# Uses:     [$a0, $a1, $a2, $a3, $t0, $t1, $t2, $t3, $t4, $t5, $t7, $t8]
	# Clobbers: [$a0, $a1, $a2, $a3, $t0, $t1, $t2, $t3, $t4, $t5, $t7, $t8]
	#
	# Locals:
	#   - [$t0 = offset
	#	$t1 = char first_cell
	#	$t2 = int i
	#	$t3 = board_height
	#	$t4 = board_width
	#	$t5 = char_cell
	#	$t7 = int row
	#	$t8 = int col]
	#
	# Structure:
	#   check_line
	#   -> [prologue]
	#   -> body
	#   -> [epilogue]

check_line__prologue:
	begin
	lw	$t3,	board_height
	lw	$t4,	board_width
	
check_line__body:
	# TODO ... complete this function
	mul	$t0,	$a0,	MAX_BOARD_WIDTH
	add	$t0,	$t0,	$a1		#calculate offset
	lb	$t1,	board($t0)		#char first_cell = board[start_row][start_col];
	beq	$t1,	CELL_EMPTY, 	check_line_end0

	add	$t7,	$a0,	$a2	#int row = start_row + offset_row;
	add	$t8,	$a1,	$a3	#int col = start_col + offset_col;

	li	$t2,	1	#initiate int i

check_line_loop0:
	bge	$t2,	CONNECT,	check_line_end1

	blt	$t7,	0,	check_line_end0
	blt	$t8,	0,	check_line_end0		#if (row < 0 || col < 0) return WINNER_NONE;
	bge	$t7,	$t3,	check_line_end0
	bge	$t8,	$t4,	check_line_end0		#if (row >= board_height || col >= board_width) return WINNER_NONE;

	mul	$t0,	$t7,	MAX_BOARD_WIDTH
	add	$t0,	$t0,	$t8
	lb	$t5,	board($t0)			#$t5 = char cell = board[row][col];
	bne	$t5,	$t1,	check_line_end0		#if (cell != first_cell) return WINNER_NONE;

	add	$t7,	$t7,	$a2	#row += offset_row;
	add	$t8,	$t8,	$a3	#col += offset_col;

	add	$t2,	$t2,	1
	j 	check_line_loop0

check_line_end0:
	li	$v0,	WINNER_NONE
	j	check_line__epilogue

check_line_end1:
check_line_yellow_win:
	beq	$t1,	CELL_RED,	check_line_red_win
	li	$v0,	WINNER_YELLOW
	j 	check_line__epilogue

check_line_red_win:
	li	$v0,	WINNER_RED
	j	check_line__epilogue

check_line__epilogue:
	end
	jr	$ra		# return;


########################################################################
# .TEXT <is_board_full>
# YOU DO NOT NEED TO CHANGE THE IS_BOARD_FULL FUNCTION
	.text
is_board_full:
	# Args:     void
	# Returns:
	#   - $v0: bool
	#
	# Frame:    []
	# Uses:     [$v0, $t0, $t1, $t2, $t3]
	# Clobbers: [$v0, $t0, $t1, $t2, $t3]
	#
	# Locals:
	#   - $t0: int row
	#   - $t1: int col
	#
	# Structure:
	#   is_board_full
	#   -> [prologue]
	#   -> body
	#   -> loop_row_init
	#   -> loop_row_cond
	#   -> loop_row_body
	#     -> loop_col_init
	#     -> loop_col_cond
	#     -> loop_col_body
	#     -> loop_col_step
	#     -> loop_col_end
	#   -> loop_row_step
	#   -> loop_row_end
	#   -> [epilogue]

is_board_full__prologue:
is_board_full__body:
	li	$v0, true

is_board_full__loop_row_init:
	li	$t0, 0						# int row = 0;

is_board_full__loop_row_cond:
	lw	$t2, board_height
	bge	$t0, $t2, is_board_full__epilogue		# if (row >= board_height) goto is_board_full__loop_row_end;

is_board_full__loop_row_body:
is_board_full__loop_col_init:
	li	$t1, 0						# int col = 0;

is_board_full__loop_col_cond:
	lw	$t2, board_width
	bge	$t1, $t2, is_board_full__loop_col_end		# if (col >= board_width) goto is_board_full__loop_col_end;

is_board_full__loop_col_body:
	mul	$t2, $t0, MAX_BOARD_WIDTH			# row * MAX_BOARD_WIDTH
	add	$t2, $t2, $t1					# row * MAX_BOARD_WIDTH + col
	lb	$t3, board($t2)					# board[row][col];
	bne	$t3, CELL_EMPTY, is_board_full__loop_col_step	# if (cell != CELL_EMPTY) goto is_board_full__loop_col_step;

	li	$v0, false
	b	is_board_full__epilogue				# return false;

is_board_full__loop_col_step:
	addi	$t1, $t1, 1					# col++;
	b	is_board_full__loop_col_cond			# goto is_board_full__loop_col_cond;

is_board_full__loop_col_end:
is_board_full__loop_row_step:
	addi	$t0, $t0, 1					# row++;
	b	is_board_full__loop_row_cond			# goto is_board_full__loop_row_cond;

is_board_full__loop_row_end:
is_board_full__epilogue:
	jr	$ra						# return;


########################################################################
# .TEXT <print_board>
# YOU DO NOT NEED TO CHANGE THE PRINT_BOARD FUNCTION
	.text
print_board:
	# Args:     void
	# Returns:  void
	#
	# Frame:    []
	# Uses:     [$v0, $a0, $t0, $t1, $t2]
	# Clobbers: [$v0, $a0, $t0, $t1, $t2]
	#
	# Locals:
	#   - `int col` in $t0
	#   - `int row` in $t0
	#   - `int col` in $t1
	#
	# Structure:
	#   print_board
	#   -> [prologue]
	#   -> body
	#   -> for_header_init
	#   -> for_header_cond
	#   -> for_header_body
	#   -> for_header_step
	#   -> for_header_post
	#   -> for_row_init
	#   -> for_row_cond
	#   -> for_row_body
	#     -> for_col_init
	#     -> for_col_cond
	#     -> for_col_body
	#     -> for_col_step
	#     -> for_col_post
	#   -> for_row_step
	#   -> for_row_post
	#   -> [epilogue]

print_board__prologue:
print_board__body:
	li	$v0, 11			# syscall 11: print_int
	la	$a0, '\n'
	syscall				# printf("\n");

print_board__for_header_init:
	li	$t0, 0			# int col = 0;

print_board__for_header_cond:
	lw	$t1, board_width
	blt	$t0, $t1, print_board__for_header_body	# col < board_width;
	b	print_board__for_header_post

print_board__for_header_body:
	li	$v0, 1			# syscall 1: print_int
	addiu	$a0, $t0, 1		#              col + 1
	syscall				# printf("%d", col + 1);

	li	$v0, 11			# syscall 11: print_character
	li	$a0, ' '
	syscall				# printf(" ");

print_board__for_header_step:
	addiu	$t0, 1			# col++
	b	print_board__for_header_cond

print_board__for_header_post:
	li	$v0, 11
	la	$a0, '\n'
	syscall				# printf("\n");

print_board__for_row_init:
	li	$t0, 0			# int row = 0;

print_board__for_row_cond:
	lw	$t1, board_height
	blt	$t0, $t1, print_board__for_row_body	# row < board_height
	b	print_board__for_row_post

print_board__for_row_body:
print_board__for_col_init:
	li	$t1, 0			# int col = 0;

print_board__for_col_cond:
	lw	$t2, board_width
	blt	$t1, $t2, print_board__for_col_body	# col < board_width
	b	print_board__for_col_post

print_board__for_col_body:
	mul	$t2, $t0, MAX_BOARD_WIDTH
	add	$t2, $t1
	lb	$a0, board($t2)		# board[row][col]

	li	$v0, 11			# syscall 11: print_character
	syscall				# printf("%c", board[row][col]);
	
	li	$v0, 11			# syscall 11: print_character
	li	$a0, ' '
	syscall				# printf(" ");

print_board__for_col_step:
	addiu	$t1, 1			# col++;
	b	print_board__for_col_cond

print_board__for_col_post:
	li	$v0, 11			# syscall 11: print_character
	li	$a0, '\n'
	syscall				# printf("\n");

print_board__for_row_step:
	addiu	$t0, 1
	b	print_board__for_row_cond

print_board__for_row_post:
print_board__epilogue:
	jr	$ra			# return;

