Task 1) Preliminary Design (5 marks) 🏛

Engineering requirements:

- Singleton Tributary
    - can contain multiple topics
        - each topic can contains multiple partitions
- multiple Producers of different types (random or manual)
- multiple Consumer groups 
    - can contain multiple consumers
Need to produce and consume events in parallel.

Java api:
contain a Singleton Tributary
contain a list of all producers
contain a list of all consumer groups
contain a list of all consumers
The api will work primarily with all files in arc/main/java/core directory.
This directory is split into 3 sub folders, tributary, producers and consumers
The api will contain Java documented methods that invoke the respective methods of the other classes in the core directory.
Understanding of how the functions work in the core directory is not needed. Each method in api will provide the user with 
    adequate information on how to use each method to achieve a certain function. A string output will be displayed to the user upon successful execution. 

Checklist of design:
- Creating multiple topics (of different event types)
- Creating multiple partitions 
- creating multiple producers (of different event types)
- producers can be either random or manual
- creating multiple consumer groups
- creating multiple consumers (capable of consuming events of different types)
- Capable of handling parallel produced events
- Capable of handling parallel consumed events

usability tests:
- create topic <id> <type>
- create partition <topic> <id>
- create consumer group <id> <topic> <rebalancing>
- create consumer <group> <id>
- delete consumer <consumer>
- create producer <id> <type> <allocation>
- produce event <producer> <topic> <event> <partition> (manual producers)
- produce event <producer> <topic> <event> (random producers)
- consume event <consumer> <partition>
- consume events <consumer> <partition> <number of events>
- show topic <topic>
- show consumer group <group>
- parallel produce (<producer>, <topic>, <event>), ...
- parallel consume (<consumer>, <partition>), ...

Testing plan:
Feature-driven testing. Slowly build the system from the "ground up". 
I will use this method to start from the macro perspective and builds the overall components of the program before going into the function of each component. eg build topics, before partitions etc...
It helps to breakdown the requirements of the project into sizeable tasks and creates a list of goals to work towards. Moreover, it makes testing a lot easier as well, since the Junit tests written will be less complex and helps to ensure that your existing program works before more complicated tests and functionalities are introduced.

Testing plan:
stage 1:
- The system functions with a single producer, a single topic, a single partition, a single consumer group and a single consumer such that a message lifecycle can be completed.

stage 2:
- Test creation of multiple topics, partitions, consumer groups & consumers.
- Test random & manual assigning of producers

stage 3:
- Test produce events in parallel
- Test consume evenets in parallel

