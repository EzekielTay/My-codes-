package dungeonmania.entities.collectables.potions;

import dungeonmania.Game;
import dungeonmania.battles.BattleStatistics;
import dungeonmania.entities.BattleItem;
import dungeonmania.entities.CollectableEntity;
import dungeonmania.util.Position;

public abstract class Potion extends CollectableEntity implements BattleItem {
    private int duration;

    public Potion(Position position, int duration) {
        super(position);
        this.duration = duration;
    }

    @Override
    public boolean use(Game game) {
        return true;
    }

    public int getDuration() {
        return duration;
    }

    @Override
    public abstract BattleStatistics applyBuff(Game game, BattleStatistics origin);

    @Override
    public int getDurability() {
        return 1;
    }

}
