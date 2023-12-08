package dungeonmania.entities;

import java.util.List;

public class AndStrategy implements LogicalStrategy {
    public boolean isLogicSatisfied(List<Activator> subs) {
        if (subs.size() < 2) {
            return false;
        }

        for (Activator a : subs) {
            if (!a.isActivated()) {
                return false;
            }
        }

        return true;
    }
}
