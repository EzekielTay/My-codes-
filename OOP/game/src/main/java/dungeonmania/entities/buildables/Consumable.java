package dungeonmania.entities.buildables;

import dungeonmania.Game;

public class Consumable implements BuildableType {

    @Override
    public boolean use(Game game, Buildable entity) {
        int durability = entity.getDurability();
        // Weapon is broken
        if (durability == 0) {
            return false;
        }
        durability--;
        entity.setDurability(durability);
        if (durability <= 0) {
            game.getPlayer().remove(entity);
        }
        return true;
    }
}
