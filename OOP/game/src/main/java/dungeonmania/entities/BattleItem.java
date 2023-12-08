package dungeonmania.entities;

import dungeonmania.Game;
import dungeonmania.battles.BattleStatistics;

/**
 * Item has buff in battles
 */
public interface BattleItem {
    public BattleStatistics applyBuff(Game game, BattleStatistics origin);

    public boolean use(Game game);

    public int getDurability();
}
