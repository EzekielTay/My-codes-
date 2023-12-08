package dungeonmania.entities;

import dungeonmania.util.Position;

public class Wire extends Activator {

    public Wire(Position position) {
        super(position.asLayer(Entity.ITEM_LAYER));
    }

}
