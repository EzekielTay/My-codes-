## Week 6
18th Oct 2023 - Group meeting 
    -	Went through the specification for Task 1 together.
    -	Discussed and contributed to answering questions 1a)i), c)i), c)ii), e)i) with team members. Answers written on shared word document on Teams chat created by Ezekiel!
        -   
    -   Was delegated part c)ii) and to try help out with part b) 

## Week 7

Started work on 1c)ii)
-   Attempted to implement strategy pattern briefly discussed during previous meeting. Perhaps due to personal misunderstanding of the concept I found it difficult to do so I implemented our intial solution of a simple inheritance design: 
    -   "Superclass has the methods implemented to just execute ‘return’. Only overwrite in the respective sub-classes which require a special execution for that method, otherwise delete the methods in the subclasses which do nothing."
-   27th October 2023 - Group meeting 
    -   Here I consulted team members regarding the feasibility of the strategy pattern for this subtask 1c)ii). They agreed we should go with the inheritance structure for feasibility, and revisit this later should we find that a different inheritance structure be better.
    -   discussed Task 2 with team and approach to it 
    -   was delegated 1f) Law of Demeter and Law of Liskov, and 2f)
- finished task c)ii)
    

## Week 8

- Worked on task 2f) - mainly design structure 
- design structure involving strategy pattern for the different logics (XOR, OR, AND, COAND)
- created a subclass of the abstract class Entity called LogicalEntity. This is also an abstract class from which LightBulbs and SwitchDoors extends. 
- Bombs were moved to extend from LogicalEntity instead of Entity so that their logic could be handled 
- Note that regular bombs still function with this design structure, they are constructed with their logic as "or" 
- implemented switches and modified given implementation of bombs such that mvp bomb tests still passed 

## Week 9

- wrote tests for logical bombs 
- write tests for switch doors
- wrote tests for light bulbs 
- implemented wires
- implemented light bulbs
- implemented switch doors
