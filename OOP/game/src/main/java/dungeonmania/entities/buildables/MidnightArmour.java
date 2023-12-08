package dungeonmania.entities.buildables;

import dungeonmania.Game;
import dungeonmania.battles.BattleStatistics;

public class MidnightArmour extends Buildable {
    private int armourAttack;
    private int armourDefense;

    public MidnightArmour(int armourAttack, int armourDefense) {
        super(null);
        this.armourAttack = armourAttack;
        this.armourDefense = armourDefense;
    }

    @Override
    public BattleStatistics applyBuff(Game game, BattleStatistics origin) {
        if (game.checkZombieOnMap()) {
            return BattleStatistics.applyBuff(origin, new BattleStatistics(0, 0, 0, 0, 0));
        }
        return BattleStatistics.applyBuff(origin, new BattleStatistics(0, armourAttack, armourDefense, 0, 0));
    }

}
