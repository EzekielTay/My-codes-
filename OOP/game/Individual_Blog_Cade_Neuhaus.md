Week 6:
Had a meeting with group members about how we were going to approach the project.
We answered questions 1ai, ci and ei together.

Week 7:
Team met on friday to discuss part 2 of project and how we were going.
Assigned parts to each member up until end of project.

Week 9:
Working to remove the repition in the Entity and ZombieToastSpawner class.
Currently the repeated part is an empty return. I am going to create an interface which will handle onMovedAway, onDestroy and onOverlap.
This is done in the EntityInterface file. My thoughts are to create an abstract method in the interface and then change the contents in each individual file in order to ensure that there is minimal repitition.

The implementation of potions is null as it never changes the playerstate and they implement many of the same methods.
To fix this I am going to create an interface to instantiate the changeState methods and then create a seperate class to create the use of these methods. I will then be able to simply override the methods in the base state and therefore reduce the amount of repition. I ran into a stack overflow error as I was infinitely calling on a class so I instead created the player within the playerstate class and deleted the intermediary class.

The creation annd implementatiton of snake was extremely confusing at first however I plan to break it down into simpler parts. I am going to create 3 seperate classes for the Snake, SnakeHead and SnakeBody class in which I plan to implement seperate methods for each of the parts. The main Snake class will handle what happens when stuff is eaten and what happens if the snake head is killed. The SnakeHead class will deal with finding the nearest food and moving towards that food. The SnakeBody class will follow the head as well handling the split if the snake is invincible.
I cant figure out how to get the sake to move to the nearest item. I know that I can use the already predetermined djokstras algorithm method however I cannot figure out how to change it so that it takes other snake parts into the calculation as well. I also can't figure out how to get the location of the nearest item.
I decided that I will have a method with the same name but different inputs for each of the consumable items so that the effects are correct for the consumed item and that there aren't multiple class names.
For move I have that it will set the next position of the head to the next position along the path of the closest item.
It will then iterate through the body list and set the co-ordinates of that body section to the previous position of the last body.
It will still run the move method even if there is no movable objects but the way that it is set up means that it will move to the last distinctive position so therefore it will not move at all.
I overrode the onDestroy so that when the head is destroyed the entire snake gets destroyed as well.
I went back and instead changed the individual methods into one method with instance of's so that it only takes one entity and checks inside instead.
I keep running into a nullPointerException for the snake which does not make sense as I have created snake within entity factory.
I have decided to comment out the tests as no solutions have made it work.