package dungeonmania.goals;

import dungeonmania.Game;

public class GoalOr implements GoalType {
    public GoalOr() {
    }

    @Override
    public boolean achieved(Game game, Goal goal) {
        return goal.achieveGoalOne(game) || goal.achieveGoalTwo(game);
    }

    @Override
    public String toString(Game game, Goal goal) {
        if (goal.achieved(game)) {
            return "";
        }
        return "(" + goal.goalOneString(game) + " OR " + goal.goalTwoString(game) + ")";
    }
}
