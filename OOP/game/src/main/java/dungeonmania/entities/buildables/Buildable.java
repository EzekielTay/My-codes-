package dungeonmania.entities.buildables;

import dungeonmania.Game;
import dungeonmania.entities.BattleItem;
import dungeonmania.entities.Entity;
import dungeonmania.entities.inventory.InventoryItem;
import dungeonmania.util.Position;

public abstract class Buildable extends Entity implements InventoryItem, BattleItem {
    private BuildableType type;
    private int durability = 0;

    public Buildable(Position position, int durability) {
        super(position);
        this.type = new Consumable();
        this.durability = durability;
    }

    public Buildable(Position position) {
        super(position);
        this.type = new Indestructible();
    }

    @Override
    public boolean use(Game game) {
        return type.use(game, this);
    }

    public int getDurability() {
        return durability;
    }

    public void setDurability(int durability) {
        this.durability = durability;
    }
}
