package dungeonmania.entities.collectables;

import dungeonmania.util.Position;

import java.util.List;
import java.util.stream.Collectors;

import dungeonmania.entities.Activator;
import dungeonmania.entities.CoandStrategy;
import dungeonmania.entities.Entity;
import dungeonmania.entities.LogicalEntity;
import dungeonmania.entities.Player;
import dungeonmania.entities.inventory.InventoryItem;
import dungeonmania.map.GameMap;

public class Bomb extends LogicalEntity implements InventoryItem {
    public enum State {
        SPAWNED, INVENTORY, PLACED
    }

    public static final int DEFAULT_RADIUS = 1;
    public static final String DEFAULT_LOGIC = "or";
    private State state;
    private int radius;

    public Bomb(Position position, int radius) {
        this(position, radius, "or");
    }

    public Bomb(Position position, int radius, String logic) {
        super(position, logic);
        state = State.SPAWNED;
        this.radius = radius;

    }

    @Override
    public boolean canMoveOnto(GameMap map, Entity entity) {
        return true;
    }

    @Override
    public void onOverlap(GameMap map, Entity entity) {
        if (state != State.SPAWNED)
            return;
        if (entity instanceof Player) {
            if (!((Player) entity).pickUp(this))
                return;
            getSubs().stream().forEach(s -> s.unsubscribe(this));
            map.destroyEntity(this);
        }
        this.state = State.INVENTORY;
    }

    public void onPutDown(GameMap map, Position p) {
        translate(Position.calculatePositionBetween(getPosition(), p));
        map.addEntity(this);
        this.state = State.PLACED;
        // get all the tiles that are cardinally adj to the bomb
        List<Position> adjPosList = getPosition().getCardinallyAdjacentPositions();
        // for each tile, create a list called entities which
        adjPosList.stream().forEach(node -> {
            List<Entity> entities = map.getEntities(node).stream().filter(e -> (e instanceof Activator))
                    .collect(Collectors.toList());
            entities.stream().map(Activator.class::cast).forEach(s -> this.subscribe(s));
            entities.stream().map(Activator.class::cast).forEach(s -> s.subscribe(this, map));
        });
        if (getLogic() != new CoandStrategy()) {
            super.notify(map);
        }
    }

    public void execute(GameMap map, boolean logicSatisfied) {
        int x = getPosition().getX();
        int y = getPosition().getY();
        if (!logicSatisfied) {
            return;
        }
        for (int i = x - radius; i <= x + radius; i++) {
            for (int j = y - radius; j <= y + radius; j++) {
                List<Entity> entities = map.getEntities(new Position(i, j));
                entities = entities.stream().filter(e -> !(e instanceof Player)).collect(Collectors.toList());
                for (Entity e : entities)
                    map.destroyEntity(e);

            }
        }
    }

    public State getState() {
        return state;
    }

}
