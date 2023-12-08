package dungeonmania.entities.enemies;

import dungeonmania.battles.BattleStatistics;
import dungeonmania.util.Position;

public class SnakeHead extends Snake {
    private Position position;
    private BattleStatistics battleStatistics;

    public SnakeHead(Position position, double health, double attack, boolean isInvincible, boolean isInvisible) {
        super(position, health, attack, isInvincible, isInvisible);
        battleStatistics = new BattleStatistics(health, attack, 0, BattleStatistics.DEFAULT_DAMAGE_MAGNIFIER,
                BattleStatistics.DEFAULT_ENEMY_DAMAGE_REDUCER);
    }

    @Override
    public BattleStatistics getBattleStatistics() {
        return battleStatistics;
    }

    public Position getPosition() {
        return position;
    }

}
