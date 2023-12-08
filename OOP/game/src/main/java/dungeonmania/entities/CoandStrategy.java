package dungeonmania.entities;

import java.util.List;

public class CoandStrategy implements LogicalStrategy {

    public boolean isLogicSatisfied(List<Activator> subs) {

        if (subs.size() < 2) {
            return false;
        }

        int tickActivated = subs.get(0).getTickActivated();

        for (Activator a : subs) {
            if (!a.isActivated()) {
                return false;
            }
            if (a.getTickActivated() != tickActivated) {
                return false;
            }
        }

        return true;
    }
}
