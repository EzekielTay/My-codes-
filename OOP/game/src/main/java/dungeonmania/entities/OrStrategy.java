package dungeonmania.entities;

import java.util.List;

public class OrStrategy implements LogicalStrategy {
    public boolean isLogicSatisfied(List<Activator> subs) {
        for (Activator a : subs) {

            if (a.isActivated()) {
                return true;
            }
        }
        return false;
    }
}
