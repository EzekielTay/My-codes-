package dungeonmania.goals;

import dungeonmania.Game;

public interface GoalType {
    boolean achieved(Game game, Goal goal);

    String toString(Game game, Goal goal);
}
