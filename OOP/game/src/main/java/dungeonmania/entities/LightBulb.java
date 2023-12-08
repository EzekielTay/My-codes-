package dungeonmania.entities;

import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class LightBulb extends LogicalEntity {
    private boolean on = false;

    public LightBulb(Position position, String logic) {
        super(position, logic);
    }

    @Override
    public void execute(GameMap map, boolean logicSatisfied) {
        if (!logicSatisfied) {
            setOn(false);
            return;
        }
        setOn(true);
    }

    public void setOn(boolean on) {
        this.on = on;
    }

    public boolean isOn() {
        return on;
    }

}
