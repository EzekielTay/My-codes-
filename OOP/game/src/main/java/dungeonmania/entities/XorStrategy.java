package dungeonmania.entities;

import java.util.List;

public class XorStrategy implements LogicalStrategy {
    public boolean isLogicSatisfied(List<Activator> subs) {
        int count = 0;
        for (Activator a : subs) {
            if (a.isActivated()) {
                count++;
            }
        }
        return (count == 1);
    }
}
