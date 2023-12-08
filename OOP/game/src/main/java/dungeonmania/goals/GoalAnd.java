package dungeonmania.goals;

import dungeonmania.Game;

public class GoalAnd implements GoalType {
    public GoalAnd() {
    }

    @Override
    public boolean achieved(Game game, Goal goal) {
        return goal.achieveGoalOne(game) && goal.achieveGoalTwo(game);
    }

    @Override
    public String toString(Game game, Goal goal) {
        return "(" + goal.goalOneString(game) + " AND " + goal.goalTwoString(game) + ")";
    }

}
