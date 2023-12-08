package dungeonmania.entities;

import java.util.ArrayList;
import java.util.List;

import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public abstract class LogicalEntity extends Entity {
    private LogicalStrategy logic;
    private List<Activator> subs = new ArrayList<>();

    public LogicalEntity(Position position, String logic) {
        super(position);
        if (logic.equals("and")) {
            this.logic = new AndStrategy();
        } else if (logic.equals("or")) {
            this.logic = new OrStrategy();
        } else if (logic.equals("xor")) {
            this.logic = new XorStrategy();
        } else {
            this.logic = new CoandStrategy();
        }
    }

    public void subscribe(Activator a) {
        subs.add(a);
    }

    public void notify(GameMap map) {
        execute(map, logic.isLogicSatisfied(subs));
    }

    public List<Activator> getSubs() {
        return subs;
    }

    public abstract void execute(GameMap map, boolean logicSatisfied);

    public LogicalStrategy getLogic() {
        return logic;
    }

    @Override
    public boolean canMoveOnto(GameMap map, Entity entity) {
        return false;
    }

}
