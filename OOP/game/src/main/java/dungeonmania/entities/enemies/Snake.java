package dungeonmania.entities.enemies;

import dungeonmania.Game;
import dungeonmania.battles.BattleStatistics;
import dungeonmania.entities.Entity;
import dungeonmania.entities.Player;
import dungeonmania.entities.collectables.Arrow;
import dungeonmania.entities.collectables.Key;
import dungeonmania.entities.collectables.Treasure;
import dungeonmania.entities.collectables.potions.InvincibilityPotion;
import dungeonmania.entities.collectables.potions.InvisibilityPotion;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;
import java.util.ArrayList;
import java.util.List;

public class Snake extends Enemy {
    private List<SnakeBody> body;
    private SnakeHead head;
    private int length;
    private int health;
    private int attack;
    private Treasure treasure;
    private Key key;
    private Arrow arrow;
    private InvisibilityPotion invis;
    private InvincibilityPotion invinc;
    private BattleStatistics battleStatistics;
    private Position previousHeadPos = head.getPreviousDistinctPosition();
    public static final int KEY_BUFF = 2;
    public static final int TREASURE_BUFF = 1;
    public static final int ARROW_BUFF = 1;
    public static final double DEFAULT_ATTACK = 5.0;
    public static final double DEFAULT_HEALTH = 10.0;

    public Snake(Position position, double health, double attack, boolean isInvincible, boolean isInvisible) {
        super(position, health, attack);
        this.head = new SnakeHead(position, health, attack, isInvincible, isInvisible);
        this.body = new ArrayList<>();
        this.length = 1;
        battleStatistics = new BattleStatistics(health, attack, health, attack, attack, isInvincible, isInvisible);
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public void addBodyPart() {
        SnakeBody endBodyPart = body.isEmpty() ? null : body.get(body.size() - 1);
        if (endBodyPart != null) {
            SnakeBody newBody = new SnakeBody(endBodyPart.getPosition(), endBodyPart.getBattleStatistics().getHealth(),
                    endBodyPart.getBattleStatistics().getAttack(), false, false);
            body.add(newBody);
        } else {
            SnakeBody newBody = new SnakeBody(head.getPosition(), head.getBattleStatistics().getHealth(),
                    head.getBattleStatistics().getAttack(), false, false);
            body.add(newBody);
        }
        this.setLength(length + 1);
    }

    // public void consumeFood(Treasure food) {
    //     battleStatistics.setHealth(health + TREASURE_BUFF);
    //     this.addBodyPart();
    // }

    public void consumeFood(Entity food) {
        if (food instanceof Treasure) {
            battleStatistics.setHealth(health + TREASURE_BUFF);
            this.addBodyPart();
        } else if (food instanceof Key) {
            battleStatistics.setHealth(health * KEY_BUFF);
            this.addBodyPart();
        } else if (food instanceof Arrow) {
            battleStatistics.setAttack(attack + ARROW_BUFF);
            this.addBodyPart();
        } else if (food instanceof InvincibilityPotion) {
            head.getBattleStatistics().setInvincible(true);
            this.addBodyPart();
        } else if (food instanceof InvisibilityPotion) {
            battleStatistics.setEnabled(true);
            this.addBodyPart();
        } else {
            return;
        }
    }

    // public void consumeFood(Key food) {
    //     battleStatistics.setHealth(health * KEY_BUFF);
    //     this.addBodyPart();
    // }

    // public void consumeFood(Arrow food) {
    //     battleStatistics.setAttack(attack + ARROW_BUFF);
    //     this.addBodyPart();
    // }

    // public void consumeFood(InvisibilityPotion food) {
    //     battleStatistics.setEnabled(true);
    //     this.addBodyPart();
    // }

    // public void consumeFood(InvincibilityPotion food) {
    //     head.getBattleStatistics().setInvincible(true);
    //     this.addBodyPart();
    // }

    @Override
    public void move(Game game) {
        Position nextPos = getPosition();
        GameMap map = game.getMap();
        double shortestPath = 1000;
        Position itemPosition;
        for (Entity item : map.getEntities()) {
            if (item.equals(treasure) || item.equals(key) || item.equals(arrow) || item.equals(invinc)
                    || item.equals(invis)) {
                itemPosition = item.getPosition();
                if (map.canMoveTo(head, itemPosition)) {
                    int currentdistance = Math.abs(head.getPositionX() - item.getPositionX())
                            + Math.abs(head.getPositionY() - item.getPositionY());
                    if (currentdistance < shortestPath) {
                        shortestPath = currentdistance;
                        nextPos = map.dijkstraPathFind(getPosition(), itemPosition, item);
                    }
                }

            } else {
                continue;
            }
        }
        map.moveTo(head, nextPos);
        for (SnakeBody section : body) {
            map.moveTo(section, previousHeadPos);
            previousHeadPos = section.getPreviousDistinctPosition();
        }
    }

    @Override
    public void onDestroy(GameMap map) {
        Game g = map.getGame();
        g.unsubscribe(head.getId());
        for (SnakeBody section : body) {
            g.unsubscribe(section.getId());
            map.removeNode(section);
        }
        updateEnemyGoal(g);
        map.removeNode(head);
    }

    @Override
    public void onOverlap(GameMap map, Entity entity) {
        if (entity instanceof Player) {
            Player player = (Player) entity;
            map.getGame().battle(player, this);
        } else {
            consumeFood(entity);
        }
    }

}
