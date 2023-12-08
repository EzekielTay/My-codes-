package dungeonmania.entities;

import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class Switch extends Activator {
    public Switch(Position position) {
        super(position.asLayer(Entity.ITEM_LAYER));
    }

    @Override
    public void onOverlap(GameMap map, Entity entity) {
        if (entity instanceof Boulder) {
            setActivated(true);
            setTickActivated(map.getTick());
            notify(map);
        }
    }

    @Override
    public void onMovedAway(GameMap map, Entity entity) {
        if (entity instanceof Boulder) {
            setActivated(false);
            setTickActivated(map.getTick());
            notify(map);
        }
    }

    // @Override
    // public boolean isActivated() {
    // return isActivated();
    // }

}
