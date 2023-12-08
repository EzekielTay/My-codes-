package dungeonmania.goals;

import dungeonmania.Game;
import dungeonmania.entities.Switch;

public class GoalBoulder implements GoalType {
    public GoalBoulder() {
    }

    @Override
    public boolean achieved(Game game, Goal goal) {
        return game.getMap().getEntities(Switch.class).stream().allMatch(s -> s.isActivated());
    }

    @Override
    public String toString(Game game, Goal goal) {
        return ":boulders";
    }

}
