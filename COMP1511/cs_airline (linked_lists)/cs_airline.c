// CS Airline
// cs_airline.c
//
// This program was written by Ezekiel Tay (z5378748)
// on 2/4/2022
//
// Version 1.0.0 2022-04-02: Initial Release.
//
// Description of program:
// Develop an airline booking system 
// to determine the flight route of the plane
// and also populate the flight manifest!

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "manifest.h"

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////  CONSTANTS  /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// The buffer length is used for reading a single line
#define MAX_STRING_LEN 100

#define COMMAND_PRINT_HELP "help"
#define COMMAND_PRINT_ROUTE "print"
#define COMMAND_SUBROUTE "subroute"
#define COMMAND_CHANGE_ORIGIN "change_origin"
#define COMMAND_BYPASS "bypass"
#define COMMAND_EMERGENCY "emergency"
#define COMMAND_CANCEL "cancel"
#define COMMAND_REVERSE "reverse"
#define COMMAND_ADD_PERSON "add_person"
#define COMMAND_PRINT_MANIFEST "print_manifest"
#define COMMAND_FLIGHT_STATS "stats"

// TODO: you may choose to add additional #defines here.
#define TRUE 1
#define FALSE 0
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  STRUCTS  //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Airports represent 'stops' along the flight path
// These are the 'nodes' of the linked list
struct airport {
    char code[MAX_STRING_LEN];
    int arrival_time;
    int departure_time;
    struct airport *next_airport;
    struct manifest *airport_manifest;
};

// Root flight structure
// This stores the state of the current flight
// (i.e. the head and tail of the linked list)
struct flight {
    struct airport *origin_airport;
    struct airport *dest_airport;
};

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////  FUNCTION PROTOTYPES  ////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Helper Functions
void remove_newline(char input[MAX_STRING_LEN]);
void do_print_help(void);

void interpret_line(
    char buffer[MAX_STRING_LEN],
    int *val0,
    int *val1,
    char word[MAX_STRING_LEN]
);

// Stage 1 Functions
struct flight *setup_flight(void);
void do_print_airports(struct flight *flight);
void print_one_airport(struct airport *ap);
struct airport *create_airport(
    char code[MAX_STRING_LEN],
    int arrival_time,
    int departure
);

// Stage 2 Functions
void do_subroute(struct flight *flight, char airport_subroute_dest[MAX_STRING_LEN]);
void do_change_origin(struct flight *flight);

// TODO: Your functions prototypes here
struct airport *allocate_dest_airport(struct flight *flight);
int check_new_arrival(struct flight *flight, int arrival_time);
int airport_exist (struct flight *flight, 
    char airport_code[MAX_STRING_LEN]);
int subroute_arrival_time (struct flight *flight, 
    char airport_subroute_dest[MAX_STRING_LEN]);
struct airport *create_tail_airport (struct flight *flight, 
    char airport_code[MAX_STRING_LEN], 
    int arrival_time, int departure_time);
struct airport *create_head_airport (struct flight *flight, 
    char airport_code[MAX_STRING_LEN], 
    int arrival_time, int departure_time);
struct airport *remove_bypass_airport (struct flight *flight, 
    char input_airport_code[MAX_STRING_LEN]);
void bypass_airport(struct flight *flight);
struct airport *emergency_landing(struct flight *flight);
void cancel_flights(struct flight *flight);
void remove_missed_airports(struct airport *current_airport);
struct airport *reverse_airports(struct flight *flight);
struct manifest *populate_manifest(struct flight *flight);
void print_flight_manifest(struct flight *flight);
void print_flight_stats(struct flight *flight);
////////////////////////////////////////////////////////////////////////////////
//////////////////////////  FUNCTION IMPLEMENTATIONS  //////////////////////////
////////////////////////////////////////////////////////////////////////////////

int main(void) {

    // Stage 1.1
    // TODO: Complete the setup_flight function below
    struct flight *flight = setup_flight();

    // TODO: Fill out the while loop with relevant commands & functions
    // Move into and stay in operational mode until CTRL+D
    printf("Enter Command: ");
    char command_line[MAX_STRING_LEN];
    while (fgets(command_line, MAX_STRING_LEN, stdin) != NULL) 
    {
        remove_newline(command_line);
        
        if (strcmp(COMMAND_PRINT_HELP, command_line) == 0) 
        {
            // A help command we have implemented for you.
            do_print_help();
        } 

        else if (strcmp(COMMAND_PRINT_ROUTE, command_line) == 0) 
        {
            // Stage 1.2 - TODO: Complete this function below
            printf("ROUTE:\n");
            do_print_airports(flight);
        } 

        else if (strcmp(COMMAND_SUBROUTE, command_line) == 0) 
        {
            // Stage 2.1 - TODO: Complete this function below
            char airport_subroute_dest[MAX_STRING_LEN];
            printf("Enter airport code: ");
            fgets(airport_subroute_dest, MAX_STRING_LEN, stdin);
            remove_newline(airport_subroute_dest);
            do_subroute(flight, airport_subroute_dest);
        } 

        else if (strcmp(COMMAND_CHANGE_ORIGIN, command_line) == 0) 
        {
            // Stage 2.2 - TODO: Complete this function below
            do_change_origin(flight);
        } 
        // TODO: Add more conditions here for the remaining commands
        
        else if (strcmp(COMMAND_BYPASS, command_line) == 0)
        {
            bypass_airport(flight);
        }

        else if (strcmp(COMMAND_EMERGENCY, command_line) == 0)
        {
            flight->origin_airport = emergency_landing(flight);
            flight->dest_airport = allocate_dest_airport(flight);
        }
        
        else if (strcmp(COMMAND_CANCEL, command_line) == 0)
        {
            cancel_flights(flight);
            printf("Flight cancelled. Now accepting a new flight:\n");
            flight = setup_flight();
        }

        else if (strcmp(COMMAND_REVERSE, command_line) == 0)
        {
            flight->origin_airport = reverse_airports(flight);
            flight->dest_airport = allocate_dest_airport(flight);
        }

        else if (strcmp(COMMAND_ADD_PERSON, command_line) == 0)
        {
            flight->origin_airport->airport_manifest = populate_manifest(flight);
        }
        
        else if (strcmp(COMMAND_PRINT_MANIFEST, command_line) == 0)
        {
            print_flight_manifest(flight);
        }
        
        else if (strcmp(COMMAND_FLIGHT_STATS, command_line) == 0)
        {
            print_flight_stats(flight);
        }

        printf("Enter Command: ");
    }
    cancel_flights(flight);
    printf("Goodbye!\n");

    return 0;
}

// Stage 1.1
// Creates and initialises a flight by asking the user for input.
// Parameters:
//     None
// Returns:
//     Pointer to the malloc'd flight
struct flight *setup_flight(void) {

    // Create a new, empty flight
    struct flight *new_flight = malloc(sizeof(struct flight));
    new_flight->origin_airport = NULL;
    new_flight->dest_airport = NULL;

    // Read number of stops using fgets
    printf("How many stops will be enroute? ");
    char input_line[MAX_STRING_LEN] = {0};
    fgets(input_line, MAX_STRING_LEN, stdin);

    // Convert the string to a number
    int num_stops = 0;
    num_stops = atoi(input_line);

    // TODO: For each airport Use fgets to read a line and then use the
    //       provided interpret_line() function to extract information
    //how to point flight->origin_-airport to the address of the head airport pointer????;

    for (int i = 0; i < num_stops; i++)
    {
        int departure_time;
        int arrival_time;
        char airport_code[MAX_STRING_LEN];
        char flight_details[MAX_STRING_LEN] = {};
        fgets(flight_details, MAX_STRING_LEN, stdin);
        interpret_line(flight_details, &arrival_time, &departure_time, airport_code);
        // TODO: For each airport, check conditions and 
        //       add it to the end of the flight route
        // printf("\n");
        if (departure_time < arrival_time)
        {
            printf("Departure time cannot be before the arrival time!\n");
        }
        
        else if (new_flight->origin_airport != NULL)
        {
            int valid_new_arrival = check_new_arrival(new_flight, arrival_time);
            if (valid_new_arrival == FALSE)
            {
                printf("New arrival time cannot be before the previous departure time\n");
            }

            else
            {
                new_flight->origin_airport = create_tail_airport(new_flight, 
                    airport_code, arrival_time, departure_time);
            }
        }  
        
        else if (new_flight->origin_airport == NULL && departure_time > arrival_time)
        {
            new_flight->origin_airport = create_airport(airport_code, 
                arrival_time, departure_time);
        }
    }   
    // TODO: Change the next line
    new_flight->dest_airport = allocate_dest_airport(new_flight);
    return new_flight;
}

//Flag to check if new arrival time is earlier than departure time
int check_new_arrival(struct flight *flight, int arrival_time)
{
    int valid_new_arrival_flag = TRUE;
    struct airport *current_airport = flight->origin_airport;
    while (current_airport != NULL)
    {
        if (arrival_time < current_airport->departure_time )
        {
            valid_new_arrival_flag = FALSE;
        }
        current_airport = current_airport->next_airport;
    }
    return valid_new_arrival_flag;
}

// Stage 1.1
// Given the information about a new airport,
// Uses `malloc` to create memory for it and returns a pointer to
// that memory.
// Parameters:
//     code            = the airport ICAO code
//     arrival_time    = the arrival time of the new airport
//     departure_time  = the departure time of the new airport
// Returns:
//     A pointer to the malloc'd struct airport
struct airport *create_airport(
    char code[MAX_STRING_LEN],
    int arrival_time,
    int departure_time)
{
    // Malloc new struct
    struct airport *new_airport = malloc(sizeof(struct airport));

    // initialise airport fields
    strcpy(new_airport->code, code);
    new_airport->arrival_time = arrival_time;
    new_airport->departure_time = departure_time;
    new_airport->next_airport = NULL;
    new_airport->airport_manifest = NULL;

    return new_airport;
}

// Stage 1.2
// Given a pointer to a flight struct, prints all the info about the route
// Parameters:
//     flight = the flight which contains the flight route to print
// Returns:
//     None
void do_print_airports(struct flight *flight) {
    // TODO: Loop through the flight route and call 
    //       the provided print_one_airport function
    struct airport *current_airport = flight->origin_airport;
    while (current_airport != NULL)
    {
        print_one_airport(current_airport);
        current_airport = current_airport->next_airport;
    }
}

// Stage 1.2
// PROVIDED FUNCTION - DO NOT CHANGE
// Given a pointer to an airport struct,
// prints all the info about the airport
// Parameters:
//     ap = the airport to print
// Returns:
//     None
void print_one_airport(struct airport *ap) {
    printf(
        "%8s:    %04d -> %04d\n",
       ap->code,
       ap->arrival_time,
       ap->departure_time
    );
}


//Find out time taken for the subroute if it exists.
void do_subroute(struct flight *flight, char airport_subroute_dest[MAX_STRING_LEN]) 
{
    int airport_exist_flag = airport_exist(flight, airport_subroute_dest);
    if (airport_exist_flag == TRUE)
    {
        int start_time = flight->origin_airport->departure_time;
        int end_time = subroute_arrival_time(flight, airport_subroute_dest);
        int hours = (end_time / 100) - (start_time / 100);
        int mins = (end_time % 100) - (start_time % 100);
        int minute_diff = hours * 60 + mins;
        if (minute_diff < 0) 
        {
            minute_diff *= -1;
        }
        hours = minute_diff / 60;
        mins = minute_diff % 60;
        printf("Time for subroute: %d hrs & %d mins\n", hours, mins);
    }

    else
    {
        printf("Desired subroute destination does not exist!\n");
    }
}

// Check if input airport exist.
int airport_exist (struct flight *flight, 
    char airport_code[MAX_STRING_LEN])
{
    int airport_code_match = FALSE;
    struct airport *current_airport = flight->origin_airport;
    while (current_airport != NULL)
    {
        if (strcmp(current_airport->code, airport_code) == 0)
        {
            airport_code_match = TRUE;
        }
        current_airport = current_airport->next_airport;
    }
    return airport_code_match;
}

//Subroute destination airport arrival time.
int subroute_arrival_time (struct flight *flight, 
    char airport_subroute_dest[MAX_STRING_LEN])
{
    int flight_arrival_time = 0;
    struct airport *current_airport = flight->origin_airport;
    while (current_airport != NULL)
    {
        if (strcmp(current_airport->code, airport_subroute_dest) == 0)
        {
            flight_arrival_time = current_airport->arrival_time;
        }
        current_airport = current_airport->next_airport;
    }
    return flight_arrival_time;
}

//Change origin airport.
void do_change_origin(struct flight *flight) 
{    
    int departure_time;
    int arrival_time;
    char airport_code[MAX_STRING_LEN];
    char flight_details[MAX_STRING_LEN] = {};
    printf("Enter new origin info: ");
    fgets(flight_details, MAX_STRING_LEN, stdin);
    interpret_line(flight_details, &arrival_time, &departure_time, airport_code);

    if (departure_time < arrival_time)
    {
        printf("Departure time cannot be before the arrival time!\n");
    }

    else if (departure_time > flight->origin_airport->arrival_time)
    {
        printf("Departure of new origin cannot ");
        printf("be after the arrival time of the next airport!\n");
    }
    
    else
    {
        int duplicate_code_flag = airport_exist(flight, airport_code);
        if (duplicate_code_flag == TRUE)
        {
            printf("New airport code is not unique!\n");
        }
        else
        {
            create_head_airport(flight, airport_code, arrival_time, departure_time);
            printf("Added: %s\n", flight->origin_airport->code);
        }
    }
    
    return;
}

//Insert an airport at the end of the list.
struct airport *create_tail_airport (struct flight *flight, 
    char airport_code[MAX_STRING_LEN], 
    int arrival_time, int departure_time)
{   
    struct airport *current_airport = flight->origin_airport;
    while (current_airport->next_airport != NULL)
    {
        current_airport = current_airport->next_airport;
    }
    struct airport *tail_airport = create_airport(airport_code, 
        arrival_time, departure_time);
    current_airport->next_airport = tail_airport;
    return flight->origin_airport;
}

//Create head airport
struct airport *create_head_airport (struct flight *flight, 
    char airport_code[MAX_STRING_LEN], 
    int arrival_time, int departure_time)
{
    struct airport *new_airport = create_airport(airport_code, 
        arrival_time, departure_time);
    //assign the next airport address to the old origin.
    new_airport->next_airport = flight->origin_airport;
    //assign new_origin to be the new head.
    flight->origin_airport = new_airport;
    return flight->origin_airport;
}

//Bypass airport
void bypass_airport(struct flight *flight)
{
    char input_airport_code[MAX_STRING_LEN];
    printf("Enter airport code: ");
    fgets(input_airport_code, MAX_STRING_LEN, stdin);
    remove_newline(input_airport_code);
    int matching_code_flag = airport_exist(flight, input_airport_code);
    
    if (matching_code_flag == TRUE)
    {
        flight->origin_airport = remove_bypass_airport(flight, input_airport_code);
        allocate_dest_airport(flight);
    }
    else
    {
        printf("No airport of that code exists!\n");
    }
    
}

//Remove one airport from list
struct airport *remove_bypass_airport (struct flight *flight, 
    char input_airport_code[MAX_STRING_LEN])
{
    struct airport *current_airport = flight->origin_airport;
    
    while (current_airport->next_airport != NULL)
    {
        if (strcmp(current_airport->next_airport->code, input_airport_code) == 0)
        {
            struct airport *airport_to_remove = current_airport->next_airport;
            current_airport->next_airport = current_airport->next_airport->next_airport;
            delete_manifest(airport_to_remove->airport_manifest);
            free(airport_to_remove);
        }
        else
        {
            current_airport = current_airport->next_airport;
        }
    }
    return flight->origin_airport;
}

//Emergency landing stage 3.1
struct airport *emergency_landing(struct flight *flight)
{
    char user_input[MAX_STRING_LEN];
    printf("How long until emergency: ");
    fgets(user_input, MAX_STRING_LEN, stdin);
    int input_hours = atoi(user_input);
    if (input_hours == 0)
    {
        flight->origin_airport->departure_time = 0;
        remove_missed_airports(flight->origin_airport);
        flight->origin_airport->next_airport = NULL;
    }
    
    else
    {
        int emergency_arrival_time = 
            flight->origin_airport->departure_time + input_hours * 100;
        int safe_flight_flag = TRUE;
        struct airport *emergency_airport = create_airport("ALT0", 
            emergency_arrival_time, 0);
        struct airport *airport_visited = flight->origin_airport;

        while (airport_visited->next_airport != NULL)
        {
            if (emergency_arrival_time < airport_visited->next_airport->arrival_time )
            {
                remove_missed_airports(airport_visited);
                airport_visited->next_airport = emergency_airport;
                safe_flight_flag = FALSE;
            }
            else
            {
                airport_visited = airport_visited->next_airport;
            }
        }
        
        if (safe_flight_flag == TRUE)
        {
            printf("Flight was safe!\n");
        }
    }
    return flight->origin_airport;
}

//Remove_missed_airports (free the memory)
void remove_missed_airports(struct airport *current_airport)
{
    struct airport *missed_airport = current_airport->next_airport;
    while (missed_airport != NULL)
    {
        struct airport *temp = missed_airport;
        missed_airport = missed_airport->next_airport;
        delete_manifest(temp->airport_manifest);    
        free(temp);
    }
}

//Cancel Flights
void cancel_flights(struct flight *flight)
{
    while (flight->origin_airport != NULL)
    {
        struct airport *temp = flight->origin_airport;
        flight->origin_airport = flight->origin_airport->next_airport;
        delete_manifest(temp->airport_manifest);
        free(temp);
    }
    free(flight);
}

//Reverse the flights
struct airport *reverse_airports(struct flight *flight)
{
    struct airport *previous_airport = NULL;
    struct airport *current_airport = flight->origin_airport;
    struct airport *following_airport = flight->origin_airport;
    while (current_airport != NULL)
    {
        following_airport = following_airport->next_airport;
        current_airport->next_airport = previous_airport;
        previous_airport = current_airport;
        current_airport = following_airport;
    }
    return previous_airport;
}

//Add person to manifest (stage 4.1)
struct manifest *populate_manifest(struct flight *flight)
{
    char airport_code[MAX_STRING_LEN];
    char name[MAX_NAME_LEN];

    struct airport *current_airport = flight->origin_airport;
    //Enter airport code
    printf("Enter the airport code: ");
    fgets(airport_code, MAX_STRING_LEN, stdin);
    //Enter person's name
    printf("Enter the passenger name: ");
    fgets(name, MAX_NAME_LEN, stdin);
    // Enter passanger weight
    char weight_string[MAX_STRING_LEN];
    printf("Enter the passenger weight: ");
    fgets(weight_string, MAX_STRING_LEN, stdin);
    remove_newline(airport_code);
    remove_newline(name);
    remove_newline(weight_string);
    double weight = atof(weight_string);

    while (current_airport != NULL)
    {
        if (strcmp(current_airport->code, airport_code) == 0)
        {
            if (current_airport->airport_manifest == NULL)
            {
                current_airport->airport_manifest = create_manifest();
            }
            add_person(current_airport->airport_manifest, name, weight);
        }
        current_airport = current_airport->next_airport;
    }
    return flight->origin_airport->airport_manifest;
}

//Print flight manifest (stage 4.2)
void print_flight_manifest(struct flight *flight)
{
    char airport_code[MAX_STRING_LEN];
    printf("Enter the airport code: ");
    fgets(airport_code, MAX_STRING_LEN, stdin);
    remove_newline(airport_code);
    struct airport *current_airport = flight->origin_airport;
    while (current_airport != NULL)
    {
        if (strcmp(current_airport->code, airport_code) == 0)
        {
            print_manifest(current_airport->airport_manifest);
        }
        current_airport = current_airport->next_airport;
    }
}

//Print flight stats
void print_flight_stats(struct flight *flight)
{
    double total_weight = 0.00;
    struct airport *current_airport = flight->origin_airport;
    struct airport *following_airport = flight->origin_airport;    
    while (current_airport != NULL)
    {
        following_airport = following_airport->next_airport;
        if (following_airport != NULL)
        {
            following_airport->airport_manifest = 
                join_manifest(current_airport->airport_manifest, 
                following_airport->airport_manifest);

            current_airport->airport_manifest = NULL;
        }
        current_airport = current_airport->next_airport;
    }
    total_weight = manifest_weight(flight->dest_airport->airport_manifest);
    printf("Final manifest:\n");
    print_manifest(flight->dest_airport->airport_manifest);
    printf("Total weight: %lf\n", total_weight);
}

//Determine destination airport
struct airport *allocate_dest_airport(struct flight *flight)
{
    struct airport *current_airport = flight->origin_airport;
    if (current_airport == NULL)
    {
        return NULL;
    }
    else
    {
        while (current_airport->next_airport != NULL)
        {
            current_airport = current_airport->next_airport;
        }
        flight->dest_airport = current_airport;
        return flight->dest_airport;
    }    
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////  HELPER FUNCTIONS  //////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Helper Function
// You likely do not need to change this function.
//
// Given a raw string will remove and first newline it sees.
// The newline character wil be replaced with a null terminator ('\0')
// Parameters:
//     flight  = the flight to move people along of
// Returns:
//     None
void remove_newline(char input[MAX_STRING_LEN]) {

    // Find the newline or end of string
    int index = 0;
    while (input[index] != '\n' && input[index] != '\0') {
        index++;
    }
    // Goto the last position in the array and replace with '\0'
    // Note: will have no effect if already at null terminator
    input[index] = '\0';
}


// Helper Function
// You DO NOT NEED TO UNDERSTAND THIS FUNCTION, and will not need to change it.
//
// Given a raw string in the following foramt: [integer0] [integer1] [string]
// This function will extract the relevant values into the given pointer variables.
// The function will also remove any newline characters.
//
// For example, if given: "0135 0545 YSSY"
// The function will put the integer values
//     135 into the val1 pointer
//     545 into the val2 pointer
// And will copy a null terminated string
//     "YSSY" into the 'word' array
//
// If you are interested, `strtok` is a function which takes a string,
// and splits it up into before and after a "token" (the second argument)
//
// Parameters:
//     buffer  = A null terminated string in the following format
//               [integer0] [integer1] [string]
//     val0    = A pointer to where [integer0] should be stored
//     val1    = A pointer to where [integer1] should be stored
//     word    = An array for the [string] to be copied into
// Returns:
//     None
void interpret_line(
    char buffer[MAX_STRING_LEN],
    int *val0,
    int *val1,
    char word[MAX_STRING_LEN]
) {

    // Remove extra newline
    remove_newline(buffer);

    // Extract value 1 as int
    char *val0_str = strtok(buffer, " ");
    if (val0_str != NULL) {
        *val0 = atoi(val0_str);
    } else {
        *val0 = -1;
    }

    // Extract value 2 as int
    char *val1_str = strtok(NULL, " ");
    if (val1_str != NULL) {
        *val1 = atoi(val1_str);
    } else {
        *val1 = -1;
    }

    char *word_str = strtok(NULL, " ");
    if (word_str != NULL) {
        // Extract word
        strcpy(word, word_str);
    }

    if (val0_str == NULL || val1_str == NULL || word_str == NULL) {
        // If any of these are null, there were not enough words.
        printf("Could not properly interpret line: %s.\n", buffer);
    }

}

void do_print_help(void) {
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| Command Name      | How to Use                                                             |\n");
    printf("+===================+========================================================================+\n");
    printf("| PRINT ROUTE       | Enter command: print                                                   |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| SUBROUTE          | Enter command: subroute                                                |\n");
    printf("|                   | Enter airport code: [AIRPORT CODE]                                     |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| CHANGE ORIGIN     | Enter command: change_origin                                           |\n");
    printf("|                   | Enter new origin info: [ARRIVAL TIME] [DEPARTURE TIME] [AIRPORT CODE]  |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| BYPASS            | Enter command: bypass                                                  |\n");
    printf("|                   | Enter airport code: [AIRPORT CODE]                                     |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| EMERGENCY         | Enter command: emergency                                               |\n");
    printf("|                   | How long until emergency: [TIME IN HOURS]                              |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| CANCEL            | Enter command: cancel                                                  |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| REVERSE           | Enter command: reverse                                                 |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("|                   | Enter command: add_person                                              |\n");
    printf("| ADD PERSON        | Enter the airport code: [AIRPORT CODE]                                 |\n");
    printf("|                   | Enter the passenger name: [NAME]                                       |\n");
    printf("|                   | Enter the passenger weight: [WEIGHT]                                   |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| PRINT MANIFEST    | Enter command: print_manifest                                          |\n");
    printf("|                   | Enter the airport code: [AIRPORT CODE]                                 |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
    printf("| FLIGHT STATISTICS | Enter command: stats                                                   |\n");
    printf("+-------------------+------------------------------------------------------------------------+\n");
}