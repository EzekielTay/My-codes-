package dungeonmania.goals;

import dungeonmania.Game;

public class GoalEnemy implements GoalType {
    public GoalEnemy() {

    }

    @Override
    public boolean achieved(Game game, Goal goal) {
        return game.getPlayerEnemyKillCount() >= goal.getTarget() && game.checkAllSpawnerDestroyed();
    }

    @Override
    public String toString(Game game, Goal goal) {
        return ":enemies";
    }

}
