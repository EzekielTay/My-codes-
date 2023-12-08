package dungeonmania.entities;

import java.util.ArrayList;
import java.util.List;

import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public abstract class Activator extends Entity {
    private boolean activated;
    private List<LogicalEntity> entities;
    private List<Activator> activators;
    private int tickActivated = 0;

    public Activator(Position position) {
        super(position.asLayer(Entity.ITEM_LAYER));
        this.activated = false;
        this.entities = new ArrayList<LogicalEntity>();
        this.activators = new ArrayList<Activator>();
    }

    @Override
    public boolean canMoveOnto(GameMap map, Entity entity) {
        return true;
    }

    public void subscribe(LogicalEntity entity) {
        entities.add(entity);
    }

    public void subscribe(Activator activator) {
        if (activator instanceof Wire) {
            activators.add(activator);
        }
    }

    public void subscribe(LogicalEntity entity, GameMap map) {
        entities.add(entity);
        if (activated && entity.getLogic() == new CoandStrategy()) {
            notify(map);
        }
    }

    public void unsubscribe(LogicalEntity entity) {
        entities.remove(entity);
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;

    }

    public void setTickActivated(int tick) {
        this.tickActivated = tick;
    }

    public int getTickActivated() {
        return tickActivated;
    }

    public void notify(GameMap map) {

        // notify activators in circuit
        activators.stream().forEach(a -> {
            if (a.isActivated() != activated) {
                a.setActivated(activated);
                a.setTickActivated(tickActivated);
                a.notify(map);
            }
        });

        // activate adjacent entities
        entities.stream().forEach(e -> e.notify(map));

    }

}
