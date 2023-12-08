package dungeonmania.entities;

import java.util.List;

public interface LogicalStrategy {

    public boolean isLogicSatisfied(List<Activator> subs);
}
