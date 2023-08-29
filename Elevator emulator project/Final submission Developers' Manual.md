# Emulator Developer's Guide

<!--- Group info -->
<p align="center">
UNSW DESN2000 23T2 (COMP)
</p>
<p align="center">
Group: "Group B"
</p>
<p align="center">
Members: Ashleigh Grabow (z5328503), Ezekiel Tay (z5378748), Louie Gu (z5419487), Mridhini Koyalkar (z5421105) 
</p>
<!--- Group info -->

---

## Table of Contents

[1. Introduction](\#introduction)

[2. Code Structure](\#code-structure)

[3. Component Mapping](\#component-mapping)

[4. Main](\#main-code)

[5. Interrupt Handlers](\#interrupt-Handlers)

[6. Key Functions](\#key-functions)

[7. Extending the Code](\#Extending-the-Code)

[8. Optimizing Performance](\#optimizing-performance)

[9. Bug Fixes](\#bug-fixes)

[10. Additional Resources](\#additional-resources)

# Introduction

The purpose of the code is to ensure the lift control enables the control lift to be in an efficient manner. We have included aspects of lift designs that were seen as essential from user data we have received and made solutions to issues that were faced by them. As everyone in our data would use elevators, we can see they are an integral part of an individual's daily life movement, and this also means being able to make it as user-friendly as possible. The prominent issues that were faced by users are response time after buttons are pressed, speed of doors, speed of lift movement and being unable to see lift movement information.

In our code solution, we have implemented several key features to ensure the smooth operation of the lift system. Firstly, we have set the lift's movement speed between levels to be precisely 2 seconds, providing a consistent and efficient user experience. To facilitate effective movement, we have carefully calibrated the door's opening and closing times, achieved through different motor speeds, with each door remaining open for 3 seconds.

In terms of accessibility, we have enabled all floors to be easily reachable using the keyboard, enhancing user convenience. Additionally, we have ensured that the open and close buttons on the control panel have fast response times, allowing users to operate the lift swiftly. To maintain safety and prevent mishaps, we have disabled the open and close buttons during lift movement, ensuring that the doors cannot be operated while the lift is in motion.

Furthermore, floor requests are intelligently ordered based on the direction of the lift to optimize its movement and minimize waiting times. To provide users with essential information, we have integrated an LCD screen that displays real-time updates about the lift's current position and direction of movement. In emergency situations, users can utilize the "\*" button, which triggers a visible alert on the LCD screen with a blinking strobe light, specially designed to inform deaf individuals about fire alarms or critical situations. To resume normal operation after an emergency, users simply need to press the '\*' button again.

Lastly, to offer visual cues for users, we have incorporated an LED displaying a filling bar that corresponds to the current floor number, providing a clear and intuitive indication of the lift's position. Overall, our code solution ensures a user-friendly, safe, and efficient lift experience.

# Code Structure

**PSUEDO CODE**

![Main pseudo code](./images/main_pseudo.png)

**Reset**

-   Initialise stack pointer
-   Reset all values to the initial value
-   Set all relevant ports to Input / Output
-   Reset the LCD Display
-   Initiate all relevant interrupts to be used

**Main**

-   Main Code runs in this segment

**Interrupt Handlers**

-   Timer_interrupt
-   Open_door_interrupt
-   Close_door_interrupt

**Functions**

-   Display Level Function
-   Determine Level Function
-   Change Lift Level Function
-   Next Service Level Function
-   Blink Function
-   Insert_case_function
-   Insert_request_function
-   Pop Array Function
-   Keypad Function
-   Convert Function
-   Clear_service_queue_function
-   Activate_emergency_function
-   Blink_strobe_function
-   Display LCD function

**Alternate Emergency Functions**

-   Activate_emergency_function (commented out)
-   Convert Function (commented out)
-   Insert_request_function (commented out)

# Component Mapping

**Set up**

| **.equ Symbol** | **Corresponding Value** |
|-----------------|-------------------------|
| LCD_RS          | 7                       |
| LCD_E           | 6                       |
| LCD_RW          | 5                       |
| LCD_BE          | 4                       |
| F_CPU           | 16000000                |
| DELAY_1MS       | 3996                    |
| PORTLDIR        | 0xF0                    |
| INITCOLMASK     | 0xEF                    |
| INITROWMASK     | 0x01                    |
| ROWMASK         | 0x0F                    |
| Floor_number    | 1                       |

| Register | Name          | Use of Register                                                                                                                                                                                                |
|----------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| r0       | -             | -                                                                                                                                                                                                              |
| r1       | -             | -                                                                                                                                                                                                              |
| r2       | -             | -                                                                                                                                                                                                              |
| r3       | -             | -                                                                                                                                                                                                              |
| r4       | -             | -                                                                                                                                                                                                              |
| r5       | mask          | Keypad                                                                                                                                                                                                         |
| r6       | row           | Keypad                                                                                                                                                                                                         |
| r7       | col           | Keypad                                                                                                                                                                                                         |
| r8       | arg_0         | Function parameter                                                                                                                                                                                             |
| r9       | arg_1         | Function parameter                                                                                                                                                                                             |
| r10      | result_one    | Function result                                                                                                                                                                                                |
| r11      | -             | -                                                                                                                                                                                                              |
| r12      | low_level     | Determine level function                                                                                                                                                                                       |
| r13      | high_level    | Determine level function                                                                                                                                                                                       |
| r14      | low_count     | Determine level function                                                                                                                                                                                       |
| r15      | high_count    | Determine level function                                                                                                                                                                                       |
| r16      | temp          | general                                                                                                                                                                                                        |
| r17      | temp_two      | general                                                                                                                                                                                                        |
| r18      | curr_level    | Current lift level Range: 1 to 10 inclusive                                                                                                                                                                    |
| r19      | service_level | Next service level Range: 1 to 10 inclusive                                                                                                                                                                    |
| r20      | direction     | lift direction (1 or 0) 1 – going up 0 – going Down                                                                                                                                                            |
| r21      | state         | lift state 0 – On stand-by. Stationary with no levels to service  1 – Travelling between levels  2 – Lift doors are opening  3 – Lift doors are fully open and servicing the level  4 – Lift doors are closing |
| r22      | timer_flag    | timer flag 0 – Not triggered  1 - Triggered                                                                                                                                                                    |
| r23      | debounce_flag | open/close button debounce flag  0 – Not triggered  1 – Triggered                                                                                                                                              |
| r24      | nil           | Timer Interrupt                                                                                                                                                                                                |
| r25      | nil           | Timer Interrupt                                                                                                                                                                                                |

**Macros**

| Macro Name     | Use of Macro                                                                          |
|----------------|---------------------------------------------------------------------------------------|
| clear          | Clears a word (2 bytes) in a memory                                                   |
| descending     | Descending a counter value store as a word in data memory                             |
| compare        | Used to specify the time interval before the timer interrupt flag (r22) is triggered. |
| do_lcd_command | Sends a command to the LCD microcontroller                                            |
| do_lcd_data    | Outputs a character onto the LCD display                                              |

**Data Segment**

| Name                 | Bytes occupied | Use                                                                                                                                                                                                                |
|----------------------|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| emergency_state      | 1              | Determine if lift is in state of emergency. 0 – Emergency state deactivated 1 – Emergency state activated                                                                                                          |
| Reservice_level_flag | 1              | Flag to reservice the current floor 0 – No reservice needed 1 – Reservice the current floor                                                                                                                        |
| TempCounter          | 2              | Used as counter to determine time interval in the timer interrupt handler                                                                                                                                          |
| quartersecondcounter | 2              | Keeps track of the number of quarter seconds remaining to service the level. Lift states are dependent on this counter.                                                                                            |
| dest_array           | 11             | Stores the service level queue of the lift. (1 extra byte is reserved on purpose as the **pop-array function** checks one additional byte from the original max of 10. The 11th byte **always has a value of 0**.) |

**Interrupt Vectors set up**

| Vector Name | Use of vector                                                                                                                                                                                                                         |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Int0        | Sets the memory address for the interrupt vector associated with the Int0 external hardware interrupt. When the interrupt is triggered (right button pushed), the program will jump to the address specified by close_door_interrupt. |
| Int1        | Sets the memory address for the interrupt vector associated with the Int1 external hardware interrupt. When the interrupt is triggered (left button pushed), the program will jump to the address specified by open_door_interrupt.   |
| Timer0      | Sets the memory address for the interrupt vector associated with the Timer0 overflow interrupt. When the interrupt is triggered (Timer0 overflows), the program will jump to the address specified by timer_interrupt.                |

# Main code

### RESET

RESET initializes the microcontroller and sets up the necessary I/O configurations for the lift emulator. It initializes the stack pointer to the top of the RAM space (RAMEND). It also configures the I/O registers for the ports that control the LCD, including enabling the backlight. It initializes various variables and flags used in the program.

It initialises the LCD by sending specific commands to the LCD controller:

-   The display is set to an 8-bit data mode, 2 lines, and a 5x7 dot font.
-   The display is turned off.
-   The screen is cleared, and the cursor is set to increment the position without a display shift.

It also sets up the following interrupts:

-   Sets up the external interrupt INT0 and INT1 (left and right buttons) to trigger on falling edges.
-   Sets up Timer/Counter0 to generate interrupts at a rate of 128 microseconds using a prescaler of 8.

### Main_interrupt_loop

Main_interrupt_loop is the main loop of the program, which handles specific tasks depending on the elevator's state and user inputs. It calls the following subroutines:

-   blink_strobe_function which controls the blinking of the strobe light.
-   display_lcd which displays the relevant information about the current floor, next service floor and direction the lift is moving in, on the LCD.
-   keypad_function which handles the inputs from the elevator keypad.
-   motor_function which controls the elevator motor when doors are opening and closing.
-   change_lift_level_function which moves the elevator to a new level.
-   display_level_function which displays the current elevator level on the LCD.
-   next_service_level_function which determines the next service level the elevator should reach.
-   Service Level Branch which is responsible for handling the elevator's operations when it reaches a service level, such as opening and closing doors, servicing the floor, and waiting for user inputs.
-   Activate Blink which manages the blinking of the LCD display when the elevator is in certain states, like doors fully open or doors closing.

# Interrupt Handlers

### Timer_interrupt

The timer_interrupt is used to implement the timing of changing the level and servicing the level. It starts by checking if the timer_flag is set to 1.

-   If not set, the interrupt has not been cleared yet, and the code immediately ends the interrupt. This ensures that the interrupt routine is not executed again before the previous execution is completed.
-   If the timer_flag is set, tempcounter is incremented by one which keeps track of the time intervals.

It then checks the state value to determine the current state of the system and depending on the value of the state, it jumps to different sections of the code:

Case 0: State equals 1 and the code jumps to change_level_timer where it checks if the timer is equal to 1 second.

-   If equal, it jumps to time_reach where it sets the timer_flag to 1, the debounce_flag to 0 and exits the interrupt.
-   If not equal, it jumps to not_time_yet where it increments temp_counter and stores the new value and exits the interrupt.

Case 1: State equals 3 and the code jumps to service_level_timer where it checks if the timer is equal to 0.25 seconds.

-   If equal, it jumps to time_reach where it sets the timer_flag to 1, the debounce_flag to 0 and exits the interrupt.
-   If not equal, it jumps to not_time_yet where it increments temp_counter and stores the new value and exits the interrupt.

Case 2: State equals none of the above and ends the interrupt.

### 

### Open_door_interrupt

The open_door_interrupt is triggered when the left push button (open door) is pressed. The interrupt performs a series of checks before commencing the opening of the doors:

-   Checks whether the button press should be processed or not by checking the debounce_flag to ensure the button press is not a bounce.
-   Checks the state of the system to ensure the doors can only be opened while the doors are either fully open or closing.
-   Checks if the button has already been pressed, and if so, it ends the interrupt to avoid multiple unnecessary requests.
-   Checks if the state variable is within a certain range (state == 0 or state \>= 5), and if so, it ends the interrupt to ignore the button press during inappropriate states of the system (emergency or while the lift is moving).

If the above conditions are met, it sets quartersecondcounter to 24 and sets the state variable to 2, to indicate that the doors are now in the process of opening.

Lastly, it sets the debounce_flag to 1 and the interrupt returns.

### Close_door_interrupt

The close_door_interrupt is triggered when the right push button (close door) is pressed. The interrupt performs a series of checks before commencing the closing of the doors:

-   Checks if the state variable is exactly 3, which indicates that the doors are fully open and ready to be closed. If the state is not 3, it exits the interrupt.
-   Checks the debounce_flag to ensure that the button press is not a bounce.

If the above conditions are met, it sets quartersecondcounter to 8 (2 seconds) to allow the doors to be closed.

Then the state is set to 4 to indicate that the doors are closing and sets the debounce_flag to 1 before returning.

# Key Functions

### Display level function

Displays the current level on the LED array.

-   Move curr_level into low_count
-   Move low_count into temp
-   If temp \> 8:
    -   Subtract 8 from temp
    -   Move the result into high_count
    -   Load 8 into temp
    -   Move temp into low_count
-   Move low_count into arg_0
-   Call determine_level_function to determine bits to write to lower LED array
-   Move result_one into low_level
-   Move high_count into arg_0
-   Call determine_level_function to determine bits to write to higher LED array
-   Move result_one into high_level
-   Output low_level to Port C
-   Output high_level to Port G

### 

### Determine level function

Given a level count, determines the necessary bits to set to display on LED.

-   Push temp, temp_two and r18 (curr_level)
-   Clear r18 to use as a third temp register
-   Load 1 into temp
-   Move arg_0 (level count) into temp_two
-   While temp_two is not 0:
    -   Shift r18 1 to the left by 1 bit
    -   Add temp to r18
    -   Decrement arg_0
-   Move r18 into result_one
-   Pop r18, temp_two, temp

### Next_service_level_function

Function is responsible for determining the next service level in the lift emulator and is called when initialising the first service level in RESET as well as when changing to the next service level in the initialise_change_floor subroutine, insert_request_function and the emergency_function.

-   The function loads the address of the dest_array (containing a list of service levels stored in program memory) into the Z register.
-   The current service level is loaded from the program memory into the service_level variable (stored in r19).

Case 0: The current service_level is zero which means that there is no next service level, and the lift should not move. Therefore, state is set to 0.

Case 1: The current service_level is not zero which means there is a next service level, and the state is set to 1 to indicate the lift is going to move between floors.

After determining the appropriate state and next service level, the function returns.

### Blink_function

Function is called when the floor in queue is reached. The function changes the current floor being displayed using the display_level_function.

Case 0: Level is reached, the current level being displayed on the LCD is changed.

Case 1: No floors remaining in the queue, change the LCD display to nothing without the need for display_level_function.

### Change_lift_level_function

Function that takes in 2 arguments to determine which floor to travel as the depending on the lift’s current direction. The new level found is moved into the variable result_one.

Argument 0: Lift’s current level

Argument 1: Lift’s current direction

Case 0: direction is up (argument 0 = 1), increase argument 0 by one

Case 1: direction is down (argument 0 = 0), decrease argument 0 by one

### insert_case_function

Function that takes in 1 argument to determine the case prior to inserting the new request level and sets the arg_1 parameter for **insert_request_function.** This is called just before the **insert_request_function**.

Argument 0: The new level to insert into the service queue.

Case 0: insert at first position in the service queue  
Case 1: insert at position where insert value \> current element in service queue

Case 2: insert at position where insert value \< current element in service queue

### insert_request_function

Function that takes in 2 arguments and inserts a new service level to the existing service queue stored in the data memory as **dest_array** (Data memory section in **Set-up**)

Repeated service levels are **not** stored in the service queue again.

Upon successful insertion, the subsequent array elements are pushed down by 1 byte in data memory.

Argument 0: The new level to insert into the service queue.

Argument 1: The case to determine the position to insert the new level   
(refer to **insert_case_function** documentation for cases breakdown)

Functionality is disabled in an emergency to stop new insert level requests.

### Pop Array Function

Takes in an array and pops the first element and shifts the remaining elements forward.

-   Load the memory address of the array into X and Y
-   Add 1 to Y
-   Load Y into temp and increase the index of Y
-   Store temp into X and increase the index of X
-   Loop until end of array (temp == 0)

### Keypad Function

Keypad algorithm:

![Example of keypad algorithm](./images/keypad_algorithm.png)

-   The keypad works with a grid 4 wires in parallel (columns) perpendicular on a different plane to another 4 wires in parallel (rows).
-   When a button is pressed, the row wire and column wire will come into contact.

Hence, if the column wire is grounded (0 bit input), the row wire is grounded as well. (0 bit returned)

-   Each time a column is scanned, a new column is grounded (0 bit input), and all the rows are scanned to determine if any rows are grounded (0 bit returned).
-   If a row is grounded, it means that the button corresponding to the intersection of the grounded column and row has been pressed. The next step is to call the **convert function** register the number or symbol pressed on the keypad and execute the corresponding commands associated with it.

![Example of keypad usage](./images/keypad.png)

-   In the example above, the second column and third row is grounded, which corresponds to the button ‘8’ being pressed.

### Convert Function

-   Letters A, B, C, D & ‘\#’ symbol of the keypad are ignored.
-   ‘\*’ symbol toggles between the lift’s emergency state.   
    (See **activate_emergency_function** for more details.)
-   Numbers 1 – 9 will corresponds to the levels 1 – 9.
-   Number 0 corresponds to the level 10.
-   If numbers 0 – 9 are pressed, the **insert_to_service_queue** subroutine will be accessed, and the corresponding level will be inserted into the existing lift service queue. (With the exception of the level to be inserted being equal to the floor the lift is currently servicing)
-   If the number pressed corresponds to the current level, it will be inserted into the service queue if the lift is moving (state 1) or the button will function as the ‘open door’ button when currently servicing the level   
    (state 2, 3, 4).
-   In the event of the lift’s emergency state being triggered, only the ‘\*’ button will function normally to deactivate the emergency state. All other buttons are ignored.

### Clear_service_queue_function

The clear_service_queue_function is used to clear (initialize to zero) 11 bytes of space in the destination array (dest_array). The function is used when the lift is in the emergency state and is called in RESET to set the service queue to empty and in the emergency_function to prevent the lift from servicing levels during an emergency.

-   The function loads the address of the dest_array into the X register by combining the low and high bytes of the address.
-   Then it initializes temp_two with the value 11 (indicating the number of bytes to be cleared in the dest_array)
-   It enters the store_loop that iterates 11 times to clear 11 bytes in the dest_array, by storing a zero into the memory location.

After completing the loop and clearing the 11 bytes, the function returns.

### Emergency_Function

-   Service queue is first cleared.
-   The **emergency_state** byte saved in data memory is referenced.
-   If lift is not in emergency state,
-   Insert level 1 to be the next service level with **insert_request_function**
-   Activate the emergency only after level 1 is inserted because **insert_request_function** is disabled in an emergency.
-   All other keys except ‘\*’ are disabled in an emergency.
-   If the lift is currently servicing a level, close the door and prepare to go to level 1
-   If the lift was already in an emergency state, deactivate it and resume normal operations.

### 

### display_lcd function

-   Executed when the display is to be updated/refreshed
    -   Please refer to the LCD manual for specific details on commands to be executed.
-   Emergency state is checked. If emergency, the following is executed in display_emergency:
    -   Set cursor position to first row, first col
    -   Output “Emergency” character by character using do_lcd_data macro
    -   Set cursor position to second row, first col
    -   Output “Call 000” character by character using do_lcd_data macro
-   If not emergency:
    -   Set cursor position to first row, first col
    -   Output “Current floor “ character by character using do_lcd_data
        -   If current floor is 10, output “10” using do_lcd_data
        -   Else, add current_floor to 0b00110000 to convert number to ASCII and output using do_lcd_data
    -   Set cursor position to second row, first col
    -   Output “Next stop “ character by character using do_lcd_data
        -   If current floor is 10, output “10” using do_lcd_data
        -   Else, add current_floor to 0b00110000 to convert number to ASCII and output using do_lcd_data
    -   Check direction of travel, and output “\^” or “v” depending on if the lift is traveling up or down
        -   Direction arrow does not display if no levels are queued.

### Blink_strobe_function

-   This function is only executed in the lift emergency state   
    (**emergency_state is set to 1**) and is called in the **main interrupt** & **service level interrupt** loop.
-   Strobe light is controlled by bit 1 of PORTA.  
    0 – Strobe light off  
    1 – Strobe light on
-   If the Strobe light was off, turn it on  
    Else, turn it off.

### Motor_function

The motor_function controls the motor by adjusting the PWM (Pulse Width Modulation) output based on the state variable. It controls the motor using Timer3 (16-bit timer). The function is called in service_level_interrupt_loop to initiate the motor when applicable.

The function first checks the state variable to determine whether the motor should be in the opening state or the closing state.

Case 0: The state is 2 (opening state), and the motor is set to run at 60% PWM. The function sets up Timer3 to generate a PWM signal with a 60% duty cycle. It configures Timer/Counter 3 to operate in phase-correct PWM mode with an 8-bit resolution. The OC3B output is used to control the motor. The motor's control signal is connected to the I/O pin PE2, and the function sets this pin as an output by writing 1 to the corresponding bit in the DDRE register.

Case 1: The state is 4 (closing state), and the motor is set to run at 30% PWM. The function sets up Timer3 to generate a PWM signal with a 30% duty cycle, similarly to the opening state. It also sets PE2 as an output.

Case 2: The state is neither 2 nor 4, and the function turns the motor off by setting the PWM duty cycle to 0% and configures Timer/Counter 3 to stop generating the PWM signal. This is done by setting temp to 0 and storing it in the OCR3BL and OCR3BH registers.

### Alternate emergency scenario

In this alternate emergency scenario, the main change is that the lift remains fully operational during the emergency and continues servicing its current service queue and allows the inserting of new levels into the service queue. This is to simulate the operation of a passenger lift doubling up as a service lift in an emergency to aid customers with mobility impairment to evacuate the building and support emergency services to serve each floor.

The strobe light in the lift will remain blinking several times a second and an “emergency call 000” message will also be displayed in the lift.

### Activate_emergency_function (alternate emergency scenario)

The only difference when compared to the normal **emergency_function** is that the service queue is **not** cleared when this subroutine is accessed.

### Convert_function (alternate emergency scenario)

The only difference when compared to the normal **convert_function** is that the keypad input conversion to the corresponding service level is enabled for the alternate emergency.

### Insert_request_function (alternate emergency scenario)

The only difference when compared to the normal **Insert_request_function** is that new levels can be inserted into the service queue even during the emergency state.

# Extending the Code

-   **NEVER** use code copied from elsewhere without first testing & understanding what each line of code achieves.
-   When coding new functions, it is advisable to only make changes to the values of ‘temp’ and ‘temp_two’ (r16 & r17) in the functions since other registers may be used as flags in the interrupts. Failure to comply may lead to errors in code execution and a tough time debugging!
-   The Letters on the keypad currently do not have any function. A potential way to further the functionality of the lift is to use the letters to display the following:  
    A – Time  
    B – Temperature  
    C – Weather  
    D – Date

    In order to implement the above, take a look at how **display_lcd_function** and **display_emergency function** are used in the code.

-   One may choose to implement a double array system to streamline the lift servicing all levels in one direction before switching directions and servicing all levels in the opposite direction rather than depending on a priority system.   
    This means that the service queue in data memory will now take twice the storage with one queue to service the lift travelling up while the other queue to service the lift travelling down. This will be more complicated to implement as the current direction of the lift will need to be considered to determine which service queue the service level should be inserted into.

# Optimizing Performance

-   General rule of thumb, a function can be written to reduce repeated code.
-   **ALWAYS PLAN BEFORE CODING!** Not only does planning help you organise how your code is written, but it also helps to identify potential code which may be repeated and hence, indicating that a function can be used. Eg. When displaying the current lift level to the LED bar, one will realise that two separate ports (PORTC and PORTG) output the display of the current level. Instead of repeating code twice to display the LED to both PORTC & PORTG separately, a function can be written to achieve just that. *For more information, refer to the functions* **Display Level Function** *and* **Determine Level Function** *above*
-   Interrupt handlers should execute minimal code. Interrupt handlers should primarily be used to set a flag. **Main** code checks the flags and executes code accordingly.  
    *Note: Delays, function calls etc should not be used in an interrupt!*
-   When removing serviced levels from the Lift service queue, it is recommended to use an algorithm to remove the first element from the array and shift all other elements forward by one index, rather than implementing a circular array queue.  
    *(Refer to* **pop_array_function** *for more information)*

# Bug Fixes

-   Before writing code directly into the main file, a good practice would be to test it first on a separate file (If possible) to ensure it is working before implementing it into the main code.   
    This helps narrow the error to the interaction between the existing main code and the new function to be implemented. *Eg.* *Overlapping registers being used leading to errors, but on its own, both the main code and the new function work perfectly.*
-   Use the Debugger tool in Microchip Studio with breakpoints to slowly run through your code. Always have an idea of what values you expect for each register or address in data memory should be. This helps to improve the efficiency of debugging. **However, please be aware that it is impossible to test the interaction of interrupts with the main code in this manner.**
-   One method which is highly effective is to break down the problem by commenting out different portions of code and testing the remaining code to check if the code executes without errors. By doing this in a systematic way, you can quickly narrow down your errors to specific functions…then specific lines of code efficiently.

# Additional Resources

-   [Microchip studio debugger guide](https://onlinedocs.microchip.com/pr/GUID-ECD8A826-B1DA-44FC-BE0B-5A53418A47BD-en-US-12/index.html?GUID-C73F1111-250E-4106-B5E5-85A512B75E8B)
-   [AVR instruction manual](https://ww1.microchip.com/downloads/en/devicedoc/atmel-0856-avr-instruction-set-manual.pdf)
-   [AVR Datasheet](https://ww1.microchip.com/downloads/en/devicedoc/atmel-2549-8-bit-avr-microcontroller-atmega640-1280-1281-2560-2561_datasheet.pdf)
-   [LCD Manual](http://users.ece.utexas.edu/\~valvano/Datasheets/LCDOptrex.pdf)
