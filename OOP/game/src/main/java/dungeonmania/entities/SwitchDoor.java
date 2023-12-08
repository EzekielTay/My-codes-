package dungeonmania.entities;

import dungeonmania.entities.enemies.Spider;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class SwitchDoor extends LogicalEntity {
    private boolean open = false;

    public SwitchDoor(Position position, String string) {
        super(position.asLayer(Entity.DOOR_LAYER), string);
    }

    @Override
    public boolean canMoveOnto(GameMap map, Entity entity) {
        if (open || entity instanceof Spider) {
            return true;
        }

        return false;
    }

    @Override
    public void execute(GameMap map, boolean logicSatisfied) {
        if (!logicSatisfied) {
            setOpen(false);
            return;
        }
        setOpen(true);
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public boolean isOpen() {
        return open;
    }

}
