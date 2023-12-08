package dungeonmania.goals;

import dungeonmania.Game;

public class GoalTreasure implements GoalType {
    public GoalTreasure() {
    }

    @Override
    public boolean achieved(Game game, Goal goal) {
        return game.getCollectedTreasureCount() >= goal.getTarget();
    }

    @Override
    public String toString(Game game, Goal goal) {
        return ":treasure";
    }
}
