# Emulator User Guide

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

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Selecting Input/Output Components](#selecting-inputoutput-components)
5. [Testing Functionality](#testing-functionality)
6. [Troubleshooting](#troubleshooting)
7. [Additional Resources](#additional-resources)

## Introduction

The lift emulator serves as a testing platform to simulate real-world inputs and interactions with the lift. It will ensure that the new lift firmware is functional and reliable before it is deployed in actual lifts designed by the lift manufacturing company. 

The lift emulator is written in assembly language and its purpose is to simulate the behavior of real-life lifts accurately, by implementing the different components of the ATmega2560 microcontroller development board to correspond with the components in the actual lift. 

The emulated lift is a 10-floor lift with one button outside the lift for calling the lift, and two buttons inside the lift for selecting floors. The emulator fulfills the requirements specified by the development team which includes safe and efficient travel between floors, door opening, and closing sequences, and servicing multiple floor requests. The emulator also displays relevant information on LEDs and the LCD, as well as implements the desired emergency scenario.


## Installation

To install the emulator, there are a few steps you have to complete. You will also need a Windows operating system or a Windows virtual machine to install the emulator as the necessary software only supports Windows. 

### Steps for installing the emulator:
1. Download the Atmel Studio 7 installer from the following link: [Atmel Studio 7](https://ww1.microchip.com/downloads/aemDocuments/documents/DEV/ProductDocuments/SoftwareTools/as-installer-7.0.2594-full.exe)
2. Select the AVR 8-bit MCU option for the installation.
3. Once the installation process is complete, open Microchip Studio.
4. Download the lift emulator code provided by Team B and open the file in Microchip Studio.
5. Plug the USB cable into the Type-B port on the Arduino board and the other end of the cable into the USB port on your laptop.
6. To ensure the board has power, look for a green light on the Arduino board (on the back of the development board).

If the green light on the Arduino board is lit up, the installation process was successful and you can continue to the configuration process.


## Configuration

To configure the emulator to your computer and Atmel Studio, there are a few steps you have to complete.

### Steps for configuring the emulator on your computer:
1. On your desktop, right-click on "This PC" and then select "Manage".
2. In the left-hand panel of the window that opens, select "Device Manager".
3. In the main panel, look for the option "ports" and expand it.
4. You should see an option that looks similar to the following: Arduino Mega 2560 (COM3). Your COM port may vary to the example's port.
5. Go to the menu item Tools->external tools in Atmel Studio.
6. Fill in the dialogue box as follows:
   - Make the title DESN2000
   - Fill in the Command section with  the location of the avrdude program: "C:\Program Files (x86)\Arduino\hardware\tools\avr\bin\avrdude.exe"
   - Fill in the Arguments section with the following: "-C "C:\Program Files (x86)\Arduino\hardware\tools\avr\etc\avrdude.conf" -c wiring -p m2560 -P COMX -b 115200 -U flash:w:"$(ProjectDir)Debug\$(TargetName).hex":i -D" 
   - Replace COMX with your COM port number.

Once your computer is configured as above, continue to Selecting Input/Output Components below.


## Selecting Input/Output Components

For the design to perform correctly, the following connections should be made. 
1. Disconnect the board from your computer (power supply).
2. Make the following connections shown in the image below using wires to connect the corresponding pins on the board.

![Wiring Configuration](./images/Wiring.jpg)

### Input Component Ports
The following table summarises the important ports used for inputting data to the input components of the emulator.

| Input Component | Ports |
| ----------- | ----------- |
| Push Buttons | Port D |
| Potentiometer | Port K |
| Keypad | Port L |

### Output Component Ports
The following table summarises the important ports used for outputting data to the output components of the emulator.

| Output Component | Ports |
| ----------- | ----------- |
| LCD Data | Port F |
| LCD Control | Port E and Port A|
| Motor | Port E and Port D|
| Strobe LED | Port A |
| LED Bar | Port C and Port G |

Once all the connections have been made according to the image above, reconnect the board to your computer and proceed to the testing functionality below.

## Testing Functionality

In order to run the program on the board, complete the following steps:

### Steps for flashing the emulator program on the board:
1. Reconnect your board to your computer using the USB to Type-B cable. 
2. In Atmel Studio, make sure the file containing the program is open.
3. Build your program so that the hex file will be generated. Do this by going to the menu item build->Build(File name)
4. Go to the menu item Tools->DESN2000 to flash the program onto the board.

Once the following steps are completed correctly, the lift emulator program will show on the board and testing can begin. 

### Testing Floor Selection
The keypad buttons labeled 0-9 represent the floor select (inside the lift) and call buttons (outside the lift). Keys 1-9 represent floors 1-9 and key 0 represents the 10th floor. The keys can be pressed to select floors at any time except in the case of an emergency (discussed later). 

Press the key which matches your desired floor level to get on or off the lift. Doing so adds the desired floor to an array (ROM) that stores all the floors that the lift must visit.

![Keypad buttons](./images/Buttons.jpg)

### Testing Floor Display on LCD
The LCD updates as the lift moves up and down. The current floor and the next floor where the lift will stop are displayed on the LCD as per the following example:

![LCD display](./images/LCDdisplay.jpg)

### Testing floor and direction display on LEDs
The current floor and the direction the lift is traveling are displayed on the LEDs. While the lift is in motion a filling bar corresponding to the current floor number is displayed. When the lift has stopped the LED bar blinks several times per second (indicating doors opening and closing) while still displaying the current floor number.

![LED display](./images/LED.jpg)

### Testing Door and Motor Functionality
-	Opening the door takes 1 second. Both the motor will run (at 60% of its full PWM) and the LEDs will blink for one second.
-	The door remains open for three seconds on a level. The LEDs will blink for three seconds and the motor will remain off.
-	Closing the door takes 2 seconds. Both the motor will run (at 30% of its full PWM) and the LEDs will blink for one second.

![Motor](./images/Motor.jpg)

### Testing Door Control
The left push button is used to open the door and the right push button is used to close the door. The Open and Close buttons will not function while the lift is moving.

![push buttons](./images/pushButton.jpg)

#### Stopping the door from closing
If the lift is closing, pushing the Open button will stop the door from closing. The door then re-opens and remains open for 3 seconds before closing again. The motor will function accordingly.

#### Keeping the door open
If the door is open, hold down the Open button to keep the door open until the button is released.

#### Closing the door
If the door is open, push the close button to start closing the door immediately.

### Testing the Emergency Scenario 

#### Keypad functionality
In the event of an emergency, push the ‘*’ button on the keypad for the emergency.

#### Lift Movement
Pushing the emergency button should stop the servicing of the lift. If the door is opening, it will close and the lift should go to the 1st floor. The door will open for everyone to evacuate the lift and then the doors will close. The lift will then halt. The lift will only resume normal operation when the ‘*’ button is pressed again.

#### LCD Display
The LCD will display the following message in the case of an emergency:

![LCD emergency display](./images/LCDemergency.jpg)

#### Strobe LED
The strobe LED will blink several times per second to denote the alarm for an emergency and inform the users that the lift is now operating in an emergency state. 

![Emergency Strobe light](./images/emergencyStrobe.jpg)

## Troubleshooting

The following are troubleshooting tips for if you encounter any issues while using the emulator:

### Resetting the board
If the board freezes or if you just want to restart the emulator, click the red button on the bottom left corner of the board. This will reset the entire emulator and you can begin testing from the start.

### Motor causing the board to freeze
The board may have an issue where supplying a PWM signal to the motor causes the board to reset, or freeze. To fix this: 1. Connect the MOT pin to the POT pin.
2. Then remove the right-most isolation jumper above the potentiometer and connect your PWM pin (PE2) to the rightmost jumper pin. 
3. Turning the potentiometer will then introduce resistance in series with the motor, and it should be possible to find a position where the motor spins but does not crash the board.

### COM Port not found
A common error when attempting to flash the program on the board is the "can't open device "\\.\COM3": The system cannot find the file specified" error. 

If you encounter this issue, it is possible that your computer is not connecting to the board correctly. To fix this, you can try the following:

1. Check if the green light on the board is still lit.
   - If it is not, you might have a faulty USB cable. Replace the cable and try again.
   - If it is, try the next few recommendations.
2. In Atmel Studio, go to the menu item Tools->external tools. Check that the Arguments section contains the same COM Port number as shown in This PC->Device Manager under ports.
3. Reload the program in Atmel Studio, and rebuild the program by going to the menu item build->Build(File name).
4. Retry the flashing by going to the menu item Tools->DESN2000 to flash the program onto the board.

### Emulator not functioning according to specifications
If the board is not functioning correctly, it may be because the connections to the input/output pins are faulty. This could be due to loose wires or external interference. To fix this, try the following tips:

1. Check that the wires are connected to the correct pins of the board.
2. Check that all the wires are plugged in properly, and not loose.
3. Check that no external items are interfering with the board.


## Additional Resources
The following resources may help you when testing the lift emulator. 

### Atmel Studio 7 Installation Guide
[Atmel Studio 7 Guide](https://moodle.telt.unsw.edu.au/mod/resource/view.php?id=5763763) 

### Board flashing documentation and videos
[Board flashing](https://moodle.telt.unsw.edu.au/mod/resource/view.php?id=5807209)

[Board flashing video](https://moodle.telt.unsw.edu.au/mod/url/view.php?id=5807215) 

### Board Wiring
[Board Wiring](https://moodle.telt.unsw.edu.au/mod/resource/view.php?id=5807199)

### Board Setup 

![Board Setup](./images/BoardSetup.jpg)


