package dungeonmania.entities.enemies;

import dungeonmania.battles.BattleStatistics;
import dungeonmania.util.Position;

public class SnakeBody extends Snake {
    private BattleStatistics battleStatistics;
    private Position position;

    public SnakeBody(Position position, double health, double attack, boolean isInvincible, boolean isInvisible) {
        super(position, health, attack, isInvincible, isInvisible);
        battleStatistics = new BattleStatistics(health, attack, 0, BattleStatistics.DEFAULT_DAMAGE_MAGNIFIER,
                BattleStatistics.DEFAULT_ENEMY_DAMAGE_REDUCER);
    }

    public Position gePosition() {
        return this.position;
    }

    @Override
    public BattleStatistics getBattleStatistics() {
        return battleStatistics;
    }
}
