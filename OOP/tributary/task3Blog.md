Task 3) Final Design (15 marks) 🏢

[Link to video of user testing](https://youtu.be/km3f29XaoIg)

Final testing plan:
Junit tests covers:
- createTopicAndPartitionAndProducerAndGroupAndConsumer()
    - creation of multiple topics of different types
    - creation of multiple partitions in each topic
    - creation of multiple consumer groups
    - creation of multiple consumers
    - deletion of consumer
    - creation of multiple producer (one random, one manual)

- produceManualIntegerEvent()
    - Test producing event of type Integer by a manual producer

- produceManualStringEvent()
    - Test producing event of type String by a manual producer

- produceRandomStringEvent()
    - Test producing event of type String by a random producer

- showConsumersAndTopics()
    - Test displaying the contents in topic and consumer group
    - Test multiple consume events by same consumer

- parallelProduceAndConsume()
    - Test the parallel produce & consume events

List of usability tests. The tests are intended to be created in succession in the same progam instance:

Stage 1 (test for single topic, multiple partitions):
create topic movie string
create partition movie starwars
create partition movie httyd
create partition movie lotr


Stage 2 (test for multiple producers of same type, test produce events from multiple manual producers):
create producer LucasFilm String manual
create producer DreamWorks String manual
create producer NewLineCinema String manual
produce event LucasFilm movie starWarsAdmiral.json starwars
produce event LucasFilm movie starWarsYoda.json starwars
produce event DreamWorks movie httydOne.json httyd
show topic movie

stage 3: (Introduce another topic of different type to first, multiple partitions)
create topic math integer
create partition math integration
create partition math differentiation
create partition math vectors

stage 4: (create consumer group and consumer)
create consumer group genius math
create consumer genius Dan

stage 5 (create random producer to handle events of type Integer):
create producer Calculus Integer random
produce event Calculus math mathOne.json
produce event Calculus math mathTwo.json
produce event Calculus math mathThree.json
show topic math

stage 6 (consume event from partition. Bear in mind that you need to determine which partition since events are randomly assigned):
consume event Dan <partition>
show consumer group genius
show topic math


stage 7 (create another consumer group and multiple consumers. Test deleting consumer)
create consumer group family movie
create consumer family Ada
create consumer family Ben
create consumer family Cat
create consumer family Emy
delete consumer Emy 

stage 8: (Test parallel produce events)
parallel produce (NewLineCinema, movie, lotrFrodo.json, lotr), (NewLineCinema, movie, lotrSam.json, lotr), (NewLineCinema, movie, lotrGandalf.json, lotr), (NewLineCinema, movie, lotrLegolas.json, lotr), (NewLineCinema, movie, lotrAragorn.json, lotr), (NewLineCinema, movie, lotrGimli.json, lotr)
show topic movie

stage 9: (assign all consumers to consume from partition & test parallel consume events):
assign partition family lotr
parallel consume (Ada, lotr), (Ben, lotr), (Cat, lotr)
show consumer group family
show topic movie

stage 10: (test multiple consume event by one consumer)
consume events Ada lotr 3
show consumer group family

- END Testing-

An overview of the Design Patterns used in your solution;
- Use of singleton pattern for Tributary. To accomodate for multi-threading.
- Observer pattern was used for produce & consume events.
- For produce events, a partition will append the event to its list of events when a produce event is created
- For consume event, a consumer will append an event and the target partition will pop an event when consume event command is initiated.


Explanation of how you accommodated for the design considerations in your solution;
- To accomodate for multiple topics, partitions, producers etc, an array of lists were used for each component.
- To accomodate for events of different types, a generic class was used for the class Message.
- To accomodate for thread safety, synchronized methods were used in Partition class to ensure that only one thread could append a message or consume a message from the partition's list of events at one time.
- To accomodate for different types of produces, an abstract class was used for producers with Manual and random producers being a sub-class.


A brief reflection on the assignment, including on the challenges you faced and whether you changed your development approach.
- Stuck to the Feature-driven testing plan throughout the assignment.
- Daunting task as the system had to be created from scratch.However, this also meanth that I was able to practice the entire design approach as well.
- Managed to practice multi-threading in Java, only did it in python and C before. First time trying it for java.
- The initial UML diagram was extremely helpful in helping me generate most of the basic components of the system, eg. the Topics, partitions etc and helped me maintain a constant overview of the whole system which enabled me to keep track of which class is related to which.
- I found the labs a good resource when working on this assignment as it gave me an idea of how to implement crucial behaviours such as multi-threading, singleton pattern along with generating a random seed.

challenges faced:
- My design of the system evolved over time, hence, my initial UML diagram had to be adjusted to accomodate the change. However, this was all part of the process of designing.
- Tests were failing in the Junit tests because assertion lines were being checked before my thread had completed its function. In order to fix this, some self-research was done and eventually, I found a solution which was to use thread.join() to ensure the thread has completed its function before the next line of code is executed.
- One big mistake I made was also to specify the filepath where my json file resources were to be read from. Consequently, this lead to the issue where my gradle tests were passing perfectly on my local system but kept failing on the online pipeline. This took me quite a fair amount of time to determine the fault since the online pipeline revealed very little information on where the error came from.
This eventually led me to reasearch on my own what was the best way to set up resource files in java and to use the 
getResourceAsStream() method to achieve an adaptable file path system to work locally and on github.
- Another mistake I made was to use the synchronise label on my produce event and consume events in my producer and consumer class respectively. However, since the producers and consumers could be different instances for the command line arguments, it will not achieve thread safety. I fixed this error by implementing the synchronise label directly on the partition class where events are appended or consumed from its list of partitions. This would in turn satisfy the thread safety as the partition of produce and consume events will be the same instance.
- Testing the random producers was not possible by junit testing, do to its unpredictable behaviour. Hence, I had to accomplish this in the user testing instead.

