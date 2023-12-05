
// This program was written by Ezekiel Tay(z5378748)
// on 11/3/2022

// Version 1.0.0 (2022-03-08): Assignment Released.
//
// TODO: Description of your program.
// CS_Explorer_Game
// Slay all Monsters & stay alive to win! Watch out for those falling boulders!

#include <stdio.h>

// Additional libraries here
#include <stdlib.h>

// Provided constants 
#define SIZE 8
#define PLAYER_STARTING_ROW (SIZE - 1)
#define PLAYER_STARTING_COL 0
#define EMPTY_POINTS 0
#define EMPTY_TYPE 'E'
#define PLAYER_TYPE 'P'
#define MONSTER_TYPE 'M'
#define HEALING_TYPE 'H'
#define BOULDER_TYPE 'B'

// Your constants here
#define TRUE 1
#define FALSE 0

// Provided struct
struct location {
    char occupier;
    int points;
};

// Your structs here
struct monster {
    int points;
    int row;
    int column;
    int boulder_blocked_flag;
};


// Provided functions use for game setup
// You do not need to use these functions yourself.
void init_map(struct location map[SIZE][SIZE]);
void place_player_on_starting_location(struct location map[SIZE][SIZE]);

// You will need to use these functions for stage 1.
void print_cheat_map(struct location map[SIZE][SIZE]);
void print_game_play_map(struct location map[SIZE][SIZE]);

// Your functions prototypes here
int valid_move(int char_movement, int row, int column);
int move_upwards(int char_movement, int row, int column, 
                                                            struct location map[SIZE][SIZE]);
int move_downwards(int char_movement, int row, int column,    
                                                            struct location map[SIZE][SIZE]);
int move_left(int char_movement, int row, int column, 
                                                            struct location map[SIZE][SIZE]);
int move_right(int char_movement, int row, int column, 
                                                            struct location map[SIZE][SIZE]);
int revert_original_row (char type, int char_movement, 
                                                            int row, int column, struct location map[SIZE][SIZE]);
int revert_original_column (char type, int char_movement, 
                                                            int row, int column, struct location map[SIZE][SIZE]);
int fight_monster (int player_health, int player_row, 
                                                            int player_column, struct location map[SIZE][SIZE]);
int player_heal (int player_health, int player_row, 
                                                            int player_column, struct location map[SIZE][SIZE]);
void square_points (struct location map[SIZE][SIZE]);
int count_square_points (char type, int square_size, int row, 
                                                            int start_column, struct location map[SIZE][SIZE]);

int check_win_game (struct location map[SIZE][SIZE]);
int check_player_still_alive(struct location map[SIZE][SIZE], 
                                                                    int player_health);
int check_boxed_in(struct location map[SIZE][SIZE], int player_row, 
                                                                    int player_column);
int falling_boulder(int player_health, struct location map[SIZE][SIZE]);
void rectangle_points (struct location map[SIZE][SIZE]);
int count_rectangle_points (char type, int row, int start_column, 
                                                                int end_row, int end_column, struct location map[SIZE][SIZE]);
int clamp_value (int row_or_column);
int calculate_area_points(char type, int row, int row_diff, 
                                                                int start_column, int column_diff, struct location map[SIZE][SIZE]);
int column_counter_points (char type, int row, int start_column, 
                                                                int column_diff, int element_points, struct location map[SIZE][SIZE]);

void next_step_hint(int player_row, int player_column, 
                                                        struct location map[SIZE][SIZE]);
int calculate_boulders(int start_row, int row_diff, 
                                                        int start_column, int column_diff, struct location map[SIZE][SIZE]);
int column_boulder_counter (int row, int start_column, 
                                                        int column_diff, int boulder_counter, struct location map[SIZE][SIZE]);
int calculate_grid_boxes (int start_row, int row_diff, 
                                                        int start_column, int column_diff, struct location map[SIZE][SIZE]);
int column_grid_box_counter (int start_column, 
                                                        int column_diff, int num_of_grid_boxes, struct location map[SIZE][SIZE]);

int monsters_attack (int player_health, int player_movement, 
                                                            int player_row, int player_column, 
                                                            struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE]);
int monster_counter (struct location map[SIZE][SIZE], 
                                                    struct monster monster_list[SIZE * SIZE]);
int monster_move_up (int i, int player_row, 
                                                    struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE]);
int monster_move_down (int i, int player_row, 
                                                    struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE]);
int monster_move_left (int i, int player_column, 
                                                    struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE]);
int monster_move_right (int i, int player_column, 
                                                    struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE]);
int monster_moved_a_box_flag (int i, int initial_row, 
                                                                int initial_column, struct monster monster_list[SIZE * SIZE]);
int monster_advance_adjacent_square (int i, int player_health, 
                                                                struct location map[SIZE][SIZE], 
                                                                struct monster monster_list[SIZE * SIZE]);

int main(void) {

    int game_pieces_on_board;
    int element_row;
    int element_column;
    int element_points;
    char command;
    char player_movement = 'u';
    int player_row = PLAYER_STARTING_ROW;
    int player_column = PLAYER_STARTING_COL;
    int player_health = 10;

    struct location map[SIZE][SIZE];
    struct monster monster_list[SIZE * SIZE];

    init_map(map);

    printf("Welcome Explorer!!\n");
    printf("How many game pieces are on the map?\n");

    // TODO: Add code to scan in the number of game pieces here.
    scanf("%d", &game_pieces_on_board);
    
    // TODO: Add code to scan in the details of each game piece and place them
    //       on the map
    printf("Enter the details of game pieces:\n");
    for (int i = 0; i < game_pieces_on_board; i++)
    {
        int valid_game_piece = TRUE;
        scanf("%d %d %d", &element_points, &element_row, &element_column);
        
        if (element_points < -9 || element_points > 9 )
        {
            valid_game_piece = FALSE;
        }

        if (element_row < 0 || element_row > 7)
        {
            valid_game_piece = FALSE;
        }

        if (element_column < 0 || element_column > 7)
        {
            valid_game_piece = FALSE;
        }

        //Piece will not overlap player position.
        if (valid_game_piece == TRUE)
        {
            if (map[element_row][element_column].occupier == PLAYER_TYPE)
            {
                valid_game_piece = FALSE;
            }
        }
        
        //If element is valid, then initialise it in map.
        if (valid_game_piece == TRUE)
        {
            map[element_row][element_column].points = element_points;
            
            if (element_points < 0)
            {
                map[element_row][element_column].occupier = MONSTER_TYPE;
            }

            else if (element_points > 0)
            {
                map[element_row][element_column].occupier = HEALING_TYPE;
            }

            else 
            {
                map[element_row][element_column].occupier = BOULDER_TYPE;
            }
        }
    }
    
    // After the game pieces have been added to the map print out the map.
    print_game_play_map(map);
    printf("\nEXPLORE!\n");
    // TODO: keep scanning in commands from the user 
    // until the user presses Ctrl + d
    printf("Enter command: ");
    
    while (scanf(" %c", &command) != EOF )
    {
        if (command == 'b')
        {
            player_health = falling_boulder(player_health, map);
        }
    
        else if (command == 'c')
        {
            print_cheat_map(map);
        }

        else if (command == 'h')
        {
            printf("Your player is at (%d, %d)", player_row, player_column);
            printf(" with a health of %d.\n", player_health);
        }
        
        else if (command == 'm')
        {
            scanf(" %c", &player_movement);
       
            player_row = move_upwards(player_movement, player_row, player_column, map);
            player_row = move_downwards(player_movement, player_row, player_column, map);
            player_column = move_left(player_movement, player_row, player_column, map);
            player_column = move_right(player_movement, player_row, player_column, map);

            if (map[player_row][player_column].occupier == MONSTER_TYPE)
            {
                player_health = fight_monster(player_health, player_row, player_column, map);
            }

            else if (map[player_row][player_column].occupier == HEALING_TYPE)
            {
                player_health = player_heal(player_health, player_row, player_column, map);
            }
        
            else
            {
                player_row = revert_original_row(PLAYER_TYPE, 
                                                               player_movement, player_row, player_column, map);
                player_column = revert_original_column(PLAYER_TYPE, 
                                                                player_movement, player_row, player_column, map); 
                map[player_row][player_column].occupier = PLAYER_TYPE;
            }
               
        }

        else if (command == 'a')
        {
            player_health = monsters_attack(player_health, 
                                                            player_movement, player_row, player_column, map, monster_list);
        }
        
        else if (command == 'n')
        {
            next_step_hint(player_row, player_column, map);
        }
        
        else if (command == 'r')
        {
            rectangle_points(map);
        }
        
        else if (command == 's')
        {
            square_points(map);
        }

        else if (command == 'q')
        {
            printf("Exiting Program!\n");
            return 0;
        }

        print_game_play_map(map);
        int player_still_alive = check_player_still_alive (map, player_health);
        int player_boxed_in = check_boxed_in (map, player_row, player_column);
        if (player_still_alive == FALSE || player_boxed_in == TRUE)
        {
            printf("GAME LOST!\n");
            return 1;
        }

        int game_won_flag = check_win_game(map);
        if (game_won_flag == TRUE)
        {
            printf("GAME WON!\n");
            return 1;
        }
        
        printf("Enter command: ");
    }
    
    return 0;
}


////////////////////////////////////////////////////////////////////////////////
///////////////////////////// ADDITIONAL FUNCTIONS /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// TODO: you may need to add additional functions here

//Check for valid moves. Check for out of bounds.
int valid_move(int char_movement, int row, int column)
{   
    int valid_movement = FALSE;

    if (char_movement == 'u' && row > 0)
    {
        valid_movement = TRUE;
    }
    
    if (char_movement == 'd' && row < SIZE -1)
    {
        valid_movement = TRUE;
    }

    if (char_movement == 'l' && column > 0)
    {
        valid_movement = TRUE;
    }

    if (char_movement == 'r' && column < SIZE -1)
    {
        valid_movement = TRUE;
    }

    return valid_movement;
}

//Move up function
int move_upwards(int char_movement, 
                                        int row, int column, struct location map[SIZE][SIZE])
{
    int valid_movement = valid_move(char_movement, row, column);
    if (char_movement == 'u' && valid_movement == TRUE)
    {
        map[row][column].occupier = EMPTY_TYPE;
        row -= 1;
    }
    return row;
}

//Move downwards function
int move_downwards(int char_movement, 
                                        int row, int column, struct location map[SIZE][SIZE])
{
    int valid_movement = valid_move(char_movement, row, column);
    if (char_movement == 'd' && valid_movement == TRUE)
    {
        map[row][column].occupier = EMPTY_TYPE;
        row += 1;
    }
    return row;
}

//Move left function
int move_left(int char_movement, 
                                    int row, int column, struct location map[SIZE][SIZE])
{
    int valid_movement = valid_move(char_movement, row, column);
    if (char_movement == 'l' && valid_movement == TRUE)
    {
        map[row][column].occupier = EMPTY_TYPE;
        column -= 1;
    }
    return column;
}

//Move right function
int move_right(int char_movement, 
                                    int row, int column, struct location map[SIZE][SIZE])
{
    int valid_movement = valid_move(char_movement, row, column);
    if (char_movement == 'r' && valid_movement == TRUE)
    {
        map[row][column].occupier = EMPTY_TYPE;
        column += 1;
    }
    return column;
}

//Revert back position row
int revert_original_row (char type, int char_movement, 
                                                        int row, int column, struct location map[SIZE][SIZE])
{
    if (map[row][column].occupier == BOULDER_TYPE)
    {
        if (char_movement == 'u')
        {
            row += 1;
            map[row][column].occupier = type;
        }

        if (char_movement == 'd')
        {
            row -= 1;
            map[row][column].occupier = type;
            
        }
    }
    return row;
}

//Revert back position column
int revert_original_column (char type, int char_movement, 
                                                            int row, int column, struct location map[SIZE][SIZE])
{
    if (map[row][column].occupier == BOULDER_TYPE)
    {
        if (char_movement == 'l')
        {
            column += 1;
            map[row][column].occupier = type;
        }

        if (char_movement == 'r')
        {
            column -= 1;
            map[row][column].occupier = type;
        }
    }
    return column;
}

//Player fights monster
int fight_monster (int player_health, 
                                        int player_row, int player_column, struct location map[SIZE][SIZE])
{
    map[player_row][player_column].occupier = PLAYER_TYPE;
    player_health += map[player_row][player_column].points;
    return player_health;
}

//Player drinks healing potion
int player_heal (int player_health, 
                                        int player_row, int player_column, struct location map[SIZE][SIZE])
{
    map[player_row][player_column].occupier = PLAYER_TYPE;
    player_health += map[player_row][player_column].points;
    return player_health;
}

//Stage 2.5 Points in a sqaure.
void square_points (struct location map[SIZE][SIZE])
{
    int start_row;
    int start_column;
    int square_size;
    char element_type;
    scanf(" %d %d %d %c", &start_row, &start_column, &square_size, &element_type);

    start_row = clamp_value(start_row);
    start_column = clamp_value(start_column);
    int row = start_row;
    if (element_type == MONSTER_TYPE)
    {
        int element_points = count_square_points(element_type, 
                                                                square_size, row, start_column, map);
        printf("Monsters in this section could apply ");
        printf("%d health points.\n", element_points);
    }

    else
    {
        int element_points = count_square_points(element_type, 
                                                                square_size, row, start_column, map);
        printf("Healing Potions in this section could apply ");
        printf("%d health points.\n", element_points);
    }
}

//Count points in a square area.
int count_square_points (char type, int square_size, 
                                                    int row, int start_column, struct location map[SIZE][SIZE])
{
    int row_count = 0;
    int element_points = 0;
    while (row_count < square_size && row < SIZE)
    {
        int column_count = 0;
        int column = start_column;
        while (column_count < square_size && column < SIZE)
        {
            if (map[row][column].occupier == type)
            {
                element_points += map[row][column].points;
            }
            column_count += 1;
            column += 1;
        }
        row_count += 1; 
        row += 1;
    }
    return element_points;
}

//Win game checker.
int check_win_game (struct location map[SIZE][SIZE])
{
    int game_won_flag = TRUE;
    int row = 0;
    while (row < SIZE)
    {
        int column = 0;
        while (column < SIZE)
        {
            if (map[row][column].occupier == MONSTER_TYPE)
            {
                game_won_flag = FALSE;
                return game_won_flag;
            }
            column += 1;
        }

        row += 1;
    }

    return game_won_flag;    
}

//Check if player is still alive.
int check_player_still_alive(struct location map[SIZE][SIZE], int player_health)
{
    int player_alive = TRUE;
    if (player_health <= 0)
    {
        player_alive = FALSE;
    }
    return player_alive;    
}

//Check if player is boxed in by boulders.
int check_boxed_in(struct location map[SIZE][SIZE], int player_row, int player_column)
{
    int player_boxed_in = TRUE;
    char array_movement[4] = {'u', 'd', 'l', 'r'};
    for (int i = 0; i < 4; i++)
    {
        int move = array_movement[i];
        int valid_movement = valid_move(move, player_row, player_column);

        if (move == 'u' && valid_movement == TRUE)
        {
            if (map[player_row - 1][player_column].occupier != BOULDER_TYPE )
            {
                return player_boxed_in = FALSE;
            }
        }

        if (move == 'd' && valid_movement == TRUE)
        {
            if (map[player_row + 1][player_column].occupier != BOULDER_TYPE )
            {
                return player_boxed_in = FALSE;
            }
        }

        if (move == 'l' && valid_movement == TRUE)
        {
            if (map[player_row][player_column - 1].occupier != BOULDER_TYPE )
            {
                return player_boxed_in = FALSE;
            }
        }

        if (move == 'r' && valid_movement == TRUE)
        {
            if (map[player_row][player_column + 1].occupier != BOULDER_TYPE )
            {
                return player_boxed_in = FALSE;
            }
        }
    }
    return player_boxed_in;
}

//Falling boulder function.
int falling_boulder(int player_health, struct location map[SIZE][SIZE])
{
    int row;
    int column;
    scanf(" %d %d", &row, &column);
    row = clamp_value(row);
    column = clamp_value(column);

    if (map[row][column].occupier != PLAYER_TYPE)
    {
        map[row][column].occupier = BOULDER_TYPE;
        map[row][column].points = 0;
    }

    else
    {
        player_health = 0;
    }
    
    return player_health;
}

//Value clamping
int clamp_value (int row_or_column)
{
    if (row_or_column < 0)
    {
        row_or_column = 0;
    }

    if (row_or_column > SIZE - 1)
    {
        row_or_column = SIZE - 1;
    }
    return row_or_column;
}

//Stage 3.4 Count rectangle points
void rectangle_points (struct location map[SIZE][SIZE])
{
    int start_row;
    int start_column;
    int end_row;
    int end_column;
    char element_type;
    scanf(" %d %d", &start_row, &start_column);
    scanf(" %d %d %c", &end_row, &end_column, &element_type);
    start_row = clamp_value(start_row);
    start_column = clamp_value(start_column);
    end_row = clamp_value(end_row);
    end_column = clamp_value(end_column);

    int row = start_row;
    int row_diff = end_row - row;
    int column_diff = end_column - start_column;

    if (element_type == MONSTER_TYPE)
    {
        int element_points = calculate_area_points(element_type, 
                                                                row, row_diff, start_column, column_diff, map);
        printf("Monsters in this section could apply ");
        printf("%d health points.\n", element_points);
    }

    else
    {
        int element_points = calculate_area_points(element_type, 
                                                                row, row_diff, start_column, column_diff, map);
        printf("Healing Potions in this section could apply ");
        printf("%d health points.\n", element_points);
    }
}

//Calculate points in an area
int calculate_area_points(char type, int start_row, int row_diff, 
                                                                    int start_column, int column_diff, struct location map[SIZE][SIZE])
{
    int row = start_row;
    int element_points = 0;
    if (row < start_row + row_diff)
    {
        while (row <= start_row + row_diff && row <= SIZE - 1)
        {
            element_points = column_counter_points(type, 
                                                            row, start_column, column_diff, element_points, map);
            row += 1;
        }     
    }

    else if (row >= start_row + row_diff)
    {
        while (row >= start_row + row_diff && row >= 0)
        {
            element_points = column_counter_points(type, 
                                                            row, start_column, column_diff, element_points, map);
            row -= 1;
        }
    }
    
    return element_points;
}

//Calculate points per column
int column_counter_points (char type, int row, int start_column, 
                                                                    int column_diff, int element_points, struct location map[SIZE][SIZE])
{
    
    int column = start_column;
    if (column < start_column + column_diff)
    {
        while (column <= start_column + column_diff && column <= SIZE - 1)
        {
            if (map[row][column].occupier == type)
            {
                element_points += map[row][column].points;
            }
            column += 1;
        }
    }

    else if (column >= start_column + column_diff)
    {
        while (column >= start_column + column_diff && column >= 0)
        {
            if (map[row][column].occupier == type)
            {
                element_points += map[row][column].points;
            }
            column -= 1;
        }
    }

    return element_points;
}

//Stage 4.1 Next step hint
void next_step_hint(int player_row, int player_column, struct location map[SIZE][SIZE])
{
    int hint_size;
    int monster_damage;
    int potion_healing;
    int num_of_grid_boxes;
    int num_of_boulders;
    int start_row = player_row;
    int start_column = player_column;
    int row_diff = 0;
    int column_diff = 0;
    double min_danger_quotient = 1000;
    double danger_quotient[4] = {0};
    int array_index = 0;
    scanf(" %d", &hint_size);
    
    for (int i = 0; i <= 3; i++)
    {
        //Left-up
        if (i == 0)
        {
            row_diff -= hint_size;
            column_diff -= hint_size;
            start_row = player_row - 1;
            start_column = player_column - 1;            
        }
        
        //Left-down
        if (i == 1)
        {
            row_diff += hint_size;
            column_diff -= hint_size;
            start_row = player_row + 1;
            start_column = player_column - 1;            
        }

        //Right-up
        if (i == 2)
        {
            row_diff -= hint_size;
            column_diff += hint_size;
            start_row = player_row - 1;
            start_column = player_column + 1;            
        }

        //Right-down
        if (i == 3)
        {
            row_diff += hint_size;
            column_diff += hint_size;
            start_row = player_row + 1;
            start_column = player_column + 1;
        }

        monster_damage = calculate_area_points(MONSTER_TYPE, 
                                                            start_row, row_diff, start_column, column_diff, map);
        potion_healing = calculate_area_points(HEALING_TYPE, 
                                                            start_row, row_diff, start_column, column_diff, map);
        num_of_boulders = calculate_boulders(start_row, 
                                                            row_diff, start_column, column_diff, map);
        num_of_grid_boxes = calculate_grid_boxes(start_row, 
                                                            row_diff, start_column, column_diff, map);

        double denominator = num_of_grid_boxes - num_of_boulders;
        if (denominator == 0)
        {
            denominator = 1;
        }
        double numerator = - monster_damage - potion_healing;
        danger_quotient[i] = (numerator / denominator);

        if (danger_quotient[i] < min_danger_quotient && num_of_grid_boxes != 0 )
        {
            min_danger_quotient = danger_quotient[i];
            array_index = i;
        }

        row_diff = 0;
        column_diff = 0;
    }

    if (array_index == 0)
    {
        printf("The recommended move is: Left Up\n");
    }
    
    else if (array_index == 1)
    {
        printf("The recommended move is: Left Down\n");
    }

    else if (array_index == 2)
    {
        printf("The recommended move is: Right Up\n");
    }

    else if (array_index == 3)
    {
        printf("The recommended move is: Right Down\n");
    }
}

//calculate boulders in an area
int calculate_boulders(int start_row, int row_diff, 
                                                    int start_column, int column_diff, struct location map[SIZE][SIZE])
{
    int row = start_row;
    int boulder_counter = 0;
    if (row < start_row + row_diff)
    {
        while (row <= start_row + row_diff && row <= SIZE - 1)
        {
            boulder_counter = column_boulder_counter(row, 
                                                            start_column, column_diff, boulder_counter, map);
            row += 1;
        }     
    }

    else if (row >= start_row + row_diff)
    {
        while (row >= start_row + row_diff && row >= 0)
        {
            boulder_counter = column_boulder_counter(row, 
                                                            start_column, column_diff, boulder_counter, map);
            row -= 1;
        }
    }
    
    return boulder_counter;
}

//calculate boulders per column
int column_boulder_counter (int row, int start_column, 
                                                        int column_diff, int boulder_counter, struct location map[SIZE][SIZE])
{
    int column = start_column;
    if (column < start_column + column_diff)
    {
        while (column <= start_column + column_diff && column <= SIZE - 1)
        {
            if (map[row][column].occupier == BOULDER_TYPE)
            {
                boulder_counter += 1;
            }
            column += 1;
        }
    }

    else if (column >= start_column + column_diff)
    {
        while (column >= start_column + column_diff && column >= 0)
        {
            if (map[row][column].occupier == BOULDER_TYPE)
            {
                boulder_counter += 1;
            }
            column -= 1;
        }
    }

    return boulder_counter;
}

//calculate number of grid boxes in an area
int calculate_grid_boxes (int start_row, int row_diff, 
                                                        int start_column, int column_diff, struct location map[SIZE][SIZE])
{
    int num_of_grid_boxes = 0;
    int row = start_row;
    if (row < start_row + row_diff)
    {
        while (row <= start_row + row_diff && row <= SIZE - 1)
        {
            num_of_grid_boxes = column_grid_box_counter(start_column, 
                                                                        column_diff, num_of_grid_boxes, map);
            row += 1;
        }     
    }

    else if (row >= start_row + row_diff)
    {
        while (row >= start_row + row_diff && row >= 0)
        {
            num_of_grid_boxes = column_grid_box_counter(start_column, 
                                                                        column_diff, num_of_grid_boxes, map);
            row -= 1;
        }
    }

    return num_of_grid_boxes;
}

//calculate number of grid boxes per column.
int column_grid_box_counter (int start_column, int column_diff, 
                                                                int num_of_grid_boxes, struct location map[SIZE][SIZE])
{
    int column = start_column;
    if (column < start_column + column_diff)
    {
        while (column <= start_column + column_diff && column <= SIZE - 1)
        {
            num_of_grid_boxes += 1;
            column += 1;
        }
    }

    else if (column >= start_column + column_diff && column >= 0)
    {
        while (column >= start_column + column_diff)
        {
            num_of_grid_boxes += 1;
            column -= 1;
        }
    }

    return num_of_grid_boxes;
}

//stage 4.2 Monster attacks; move closer to player
int monsters_attack (int player_health, int player_movement, 
                                                                int player_row, int player_column, 
                                                                struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE])
{
    //Monster count on the map.
    int count = monster_counter(map, monster_list);
    for (int i = 0; i < count; i++)
    {
        int row_diff = player_row - monster_list[i].row;
        int column_diff = player_column - monster_list[i].column;
        int initial_row = monster_list[i].row;
        int initial_column = monster_list[i].column;
        int absolute_row_diff = abs(row_diff);
        int absolute_column_diff = abs(column_diff);
        monster_list[i].points = map[monster_list[i].row][monster_list[i].column].points;
        monster_list[i].boulder_blocked_flag = FALSE;

        //Monster Favours moving vertical 
        if (absolute_row_diff > absolute_column_diff)
        {
            monster_list[i].row = monster_move_up(i, 
                                                        player_row, map, monster_list);
            monster_list[i].row = monster_move_down(i, 
                                                        player_row, map, monster_list);
        }

        //Monster Favours moving horizontal
        else if (absolute_row_diff < absolute_column_diff)
        {
            monster_list[i].column = monster_move_left(i, 
                                                            player_column, map, monster_list);
            monster_list[i].column = monster_move_right(i, 
                                                            player_column, map, monster_list);
        }
        
        //scanf player last move to determine where monster moves.
        else
        {
            if (player_movement == 'u' || player_movement == 'd')
            {
                monster_list[i].row = monster_move_up(i, 
                                                            player_row, map, monster_list);
                monster_list[i].row = monster_move_down(i,
                                                            player_row, map, monster_list);
            }

            else
            {
                monster_list[i].column = monster_move_left(i, 
                                                                player_column, map, monster_list);
                monster_list[i].column = monster_move_right(i, 
                                                                player_column, map, monster_list);
            }
        }        

        int monster_moved_flag = monster_moved_a_box_flag(i, 
                                                                initial_row, initial_column, monster_list);
        
        //Boulder was blocking favoured path. Use alternate path.
        if (monster_moved_flag == FALSE)
        {
            monster_list[i].row = monster_move_up(i, 
                                                        player_row, map, monster_list);
            monster_list[i].row = monster_move_down(i, 
                                                        player_row, map, monster_list);
        }

        monster_moved_flag = monster_moved_a_box_flag(i, 
                                                            initial_row, initial_column, monster_list);

        if (monster_moved_flag == FALSE)
        {
            monster_list[i].column = monster_move_left(i, 
                                                            player_column, map, monster_list);
            monster_list[i].column = monster_move_right(i, 
                                                            player_column, map, monster_list);
        }

        monster_moved_flag = monster_moved_a_box_flag(i, 
                                                            initial_row, initial_column, monster_list);

        //Monster's moves are blocked by boulders.                                                    
        if (monster_moved_flag == FALSE)
        {
            monster_list[i].boulder_blocked_flag = TRUE;
        }                                                    
    }
    
    player_health = monster_advance_adjacent_square(count, 
                                                            player_health, map, monster_list);
    return player_health;
}

//Possibilities of occupier sqaure that monster advances to.
int monster_advance_adjacent_square (int count, int player_health, 
                                                                struct location map[SIZE][SIZE], 
                                                                struct monster monster_list[SIZE * SIZE])
{
    for (int i = 0; i < count; i++)
    {      
        if (map[monster_list[i].row][monster_list[i].column].occupier != PLAYER_TYPE)
        {
            if (monster_list[i].boulder_blocked_flag != TRUE)       
            {
                map[monster_list[i].row][monster_list[i].column].points += 
                                                                            monster_list[i].points;
            }
            
            if (map[monster_list[i].row][monster_list[i].column].points > 0)
            {
                map[monster_list[i].row][monster_list[i].column].occupier = HEALING_TYPE;
            }

            else if (map[monster_list[i].row][monster_list[i].column].points < 0)
            {
                map[monster_list[i].row][monster_list[i].column].occupier = MONSTER_TYPE;
            }

            else if (map[monster_list[i].row][monster_list[i].column].points == 0)
            {
                map[monster_list[i].row][monster_list[i].column].occupier = BOULDER_TYPE;
            }
        }

        else
        {
            player_health += monster_list[i].points;
        }
        monster_list[i].boulder_blocked_flag = FALSE;
    }
    return player_health;
}

//Monster move up
int monster_move_up (int i, int player_row, 
                                            struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE])
{
    if (monster_list[i].row > player_row)
    {
        int monster_move_direction = 'u';
        map[monster_list[i].row][monster_list[i].column].points -= monster_list[i].points; 
        monster_list[i].row = move_upwards(monster_move_direction, 
                                                                    monster_list[i].row, monster_list[i].column, map);                                                           
        if (map[monster_list[i].row][monster_list[i].column].occupier == BOULDER_TYPE)
        {
            monster_list[i].row = revert_original_row(MONSTER_TYPE, 
                                                                    monster_move_direction, monster_list[i].row, monster_list[i].column, map);
            map[monster_list[i].row][monster_list[i].column].points += 
                                                                    monster_list[i].points;
        }
    }
    return monster_list[i].row;
}

//Monster move down
int monster_move_down (int i, int player_row, 
                                                struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE])
{
    if (monster_list[i].row < player_row)
    {
        int monster_move_direction = 'd';
        map[monster_list[i].row][monster_list[i].column].points -= monster_list[i].points; 
        monster_list[i].row = move_downwards(monster_move_direction, 
                                                                        monster_list[i].row, monster_list[i].column, map);                            
        if (map[monster_list[i].row][monster_list[i].column].occupier == BOULDER_TYPE)
        {
            monster_list[i].row = revert_original_row(MONSTER_TYPE, 
                                                                        monster_move_direction, monster_list[i].row, monster_list[i].column, map);
            map[monster_list[i].row][monster_list[i].column].points += 
                                                                        monster_list[i].points;
        }
    }
    return monster_list[i].row;
}
//Monster move left
int monster_move_left (int i, int player_column, 
                                                    struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE])
{
    if (monster_list[i].column > player_column)
    {
        int monster_move_direction = 'l';
        map[monster_list[i].row][monster_list[i].column].points -= monster_list[i].points; 
        monster_list[i].column = move_left(monster_move_direction, 
                                                                    monster_list[i].row, monster_list[i].column, map);                                                           
        if (map[monster_list[i].row][monster_list[i].column].occupier == BOULDER_TYPE)
        {
            monster_list[i].column = revert_original_column(MONSTER_TYPE, 
                                                                            monster_move_direction, monster_list[i].row, monster_list[i].column, map);
            map[monster_list[i].row][monster_list[i].column].points += 
                                                                    monster_list[i].points;                                                            
        }
    }
    return monster_list[i].column;
}
//Monster move right
int monster_move_right (int i, int player_column, 
                                                    struct location map[SIZE][SIZE], struct monster monster_list[SIZE * SIZE])
{
    if (monster_list[i].column < player_column)
    {
        int monster_move_direction = 'r';
        map[monster_list[i].row][monster_list[i].column].points -= monster_list[i].points; 
        monster_list[i].column = move_right(monster_move_direction, 
                                                                        monster_list[i].row, monster_list[i].column, map);                                                        
        if (map[monster_list[i].row][monster_list[i].column].occupier == BOULDER_TYPE)
        {
            monster_list[i].column = revert_original_column(MONSTER_TYPE, 
                                                                        monster_move_direction, monster_list[i].row, monster_list[i].column, map);
            map[monster_list[i].row][monster_list[i].column].points += 
                                                                        monster_list[i].points;
        }
    }
    return monster_list[i].column;
}

//calculate number of monsters
int monster_counter (struct location map[SIZE][SIZE], 
                                                        struct monster monster_list[SIZE * SIZE])
{
    int start_row = 0;
    int start_column = 0;
    int monster_counter = 0;
    int row = start_row;
    while (row <= SIZE - 1)
    {
        int column = start_column;
        while (column <= SIZE - 1)
        {
            if (map[row][column].occupier == MONSTER_TYPE)
            {
                monster_list[monster_counter].points = map[row][column].points;
                monster_list[monster_counter].row = row;
                monster_list[monster_counter].column = column;
                monster_counter += 1;
            }
            column += 1;
        }
        row += 1;
    }
    return monster_counter;
}

//monster moved flag.
int monster_moved_a_box_flag (int i, int initial_row, 
                                                        int initial_column, struct monster monster_list[SIZE * SIZE])

{
    int monster_moved_a_box_flag = TRUE;
    if (monster_list[i].row == initial_row && monster_list[i].column == initial_column)
    {
        monster_moved_a_box_flag = FALSE;
    }
    return monster_moved_a_box_flag;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// PROVIDED FUNCTIONS //////////////////////////////
/////////////////////////// (DO NOT EDIT BELOW HERE) ///////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Provided Function
// Initalises all elements on the map to be empty to prevent access errors.
void init_map(struct location map[SIZE][SIZE]) {
    int row = 0;
    while (row < SIZE) {
        int col = 0;
        while (col < SIZE) {
            struct location curr_loc;
            curr_loc.occupier = EMPTY_TYPE;
            curr_loc.points = EMPTY_POINTS;
            map[row][col] = curr_loc;
            col++;
        }
        row++;
    }

    place_player_on_starting_location(map);
}

// Provided Function
// Places the player in the bottom left most location.
void place_player_on_starting_location(struct location map[SIZE][SIZE]) {
    map[PLAYER_STARTING_ROW][PLAYER_STARTING_COL].occupier = PLAYER_TYPE;
}

// Provided Function
// Prints out map with alphabetic values. Monsters are represented with 'M',
// healing potions in 'H', boulders with 'B' and the player with 'P'.
void print_game_play_map(struct location map[SIZE][SIZE]) {
    printf(" -----------------\n");
    int row = 0;
    while (row < SIZE) {
        printf("| ");
        int col = 0;
        while (col < SIZE) {
            if (map[row][col].occupier == EMPTY_TYPE) {
                printf("- ");
            } else {
                printf("%c ", map[row][col].occupier);
            }
            col++;
        }
        printf("|\n");
        row++;
    }
    printf(" -----------------\n");
}

// Provided Function
// Prints out map with numerical values. Monsters are represented in red,
// healing potions in blue, boulder in green and the player in yellow.
//
// We use some functionality you have not been taught to make sure that
// colours do not appear during testing.
void print_cheat_map(struct location map[SIZE][SIZE]) {

    printf(" -----------------\n");
    int row = 0;
    while (row < SIZE) {
        printf("| ");
        int col = 0;
        while (col < SIZE) {
            if (map[row][col].occupier == PLAYER_TYPE) {
                // print the player in purple
                // ----------------------------------------
                // YOU DO NOT NEED TO UNDERSTAND THIS CODE.
                #ifndef NO_COLORS
                printf("\033[1;35m");
                #endif
                // ----------------------------------------
                printf("%c ", PLAYER_TYPE);
            } else if (map[row][col].occupier == HEALING_TYPE) {
                // print healing potion in green
                // ----------------------------------------
                // YOU DO NOT NEED TO UNDERSTAND THIS CODE.
                #ifndef NO_COLORS
                printf("\033[1;32m");
                #endif
                // ----------------------------------------
                printf("%d ", map[row][col].points);
            } else if (map[row][col].occupier == MONSTER_TYPE) {
                // print monsters in red
                // ----------------------------------------
                // YOU DO NOT NEED TO UNDERSTAND THIS CODE.
                #ifndef NO_COLORS
                printf("\033[1;31m");
                #endif
                // ----------------------------------------
                printf("%d ", -map[row][col].points);
            } else if (map[row][col].occupier == BOULDER_TYPE) {
                // print boulder in blue
                // ----------------------------------------
                // YOU DO NOT NEED TO UNDERSTAND THIS CODE.
                #ifndef NO_COLORS
                printf("\033[1;34m");
                #endif
                // ----------------------------------------
                printf("%d ", map[row][col].points);
            } else {
                // print empty squares in the default colour
                printf("- ");
            }
            // ----------------------------------------
            // YOU DO NOT NEED TO UNDERSTAND THIS CODE.
            // reset the colour back to default
            #ifndef NO_COLORS
            printf("\033[0m");
            #endif
            // ----------------------------------------
            col++;
        }
        printf("|\n");
        row++;
    }
    printf(" -----------------\n");
}


