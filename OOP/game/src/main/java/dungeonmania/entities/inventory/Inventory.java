package dungeonmania.entities.inventory;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import dungeonmania.Game;
import dungeonmania.entities.BattleItem;
import dungeonmania.entities.Entity;
import dungeonmania.entities.EntityFactory;
import dungeonmania.entities.Player;
import dungeonmania.entities.collectables.Arrow;
import dungeonmania.entities.collectables.Key;
import dungeonmania.entities.collectables.SunStone;
import dungeonmania.entities.collectables.Sword;
import dungeonmania.entities.collectables.Treasure;
import dungeonmania.entities.collectables.Wood;

public class Inventory {
    private List<InventoryItem> items = new ArrayList<>();

    public boolean add(InventoryItem item) {
        items.add(item);
        return true;
    }

    public void remove(InventoryItem item) {
        items.remove(item);
    }

    public List<String> getBuildables(Game game) {
        int sword = count(Sword.class);
        int wood = count(Wood.class);
        int arrows = count(Arrow.class);
        int treasure = count(Treasure.class);
        int keys = count(Key.class);
        int sunStone = count(SunStone.class);
        List<String> result = new ArrayList<>();

        if (wood >= 1 && arrows >= 3) {
            result.add("bow");
        }
        if (wood >= 2 && (treasure >= 1 || keys >= 1 || sunStone >= 1)) {
            result.add("shield");
        }
        if ((wood >= 1 || arrows >= 2) && (treasure >= 1 || keys >= 1) && sunStone >= 1) {
            result.add("sceptre");
        }
        if ((wood >= 1 || arrows >= 2) && sunStone >= 2) {
            result.add("sceptre");
        }
        if (sword >= 1 && sunStone >= 1 && !game.checkZombieOnMap()) {
            result.add("midnight_armour");
        }
        return result;
    }

    public InventoryItem checkBuildCriteria(Player p, String buildable, EntityFactory factory) {
        List<Wood> wood = getEntities(Wood.class);
        List<Arrow> arrows = getEntities(Arrow.class);
        List<Treasure> treasure = getEntities(Treasure.class);
        List<Key> keys = getEntities(Key.class);
        List<SunStone> sunStone = getEntities(SunStone.class);
        List<Sword> sword = getEntities(Sword.class);
        if (buildable.equals("bow")) {
            items.remove(wood.get(0));
            items.remove(arrows.get(0));
            items.remove(arrows.get(1));
            items.remove(arrows.get(2));
            return factory.buildBow();

        } else if (buildable.equals("shield")) {
            items.remove(wood.get(0));
            items.remove(wood.get(1));
            if (treasure.size() >= 1) {
                items.remove(treasure.get(0));
            } else if (keys.size() >= 1) {
                items.remove(keys.get(0));
            }
            return factory.buildShield();

        } else if (buildable.equals("sceptre")) {
            // first set of items
            if (wood.size() >= 1) {
                items.remove(wood.get(0));
            } else if (arrows.size() >= 2) {
                items.remove(arrows.get(0));
                items.remove(arrows.get(1));
            }
            // second set of items
            if (treasure.size() >= 1) {
                items.remove(treasure.get(0));
            } else if (keys.size() >= 1) {
                items.remove(keys.get(0));
            }
            // Third set of items
            items.remove(sunStone.get(0));
            return factory.buildSceptre();

        } else if (buildable.equals("midnight_armour")) {
            items.remove(sword.get(0));
            items.remove(sunStone.get(0));
            return factory.buildMidnightArmour();
        }
        return null;
    }

    public <T extends InventoryItem> T getFirst(Class<T> itemType) {
        for (InventoryItem item : items)
            if (itemType.isInstance(item))
                return itemType.cast(item);
        return null;
    }

    public <T extends InventoryItem> int count(Class<T> itemType) {
        int count = 0;
        for (InventoryItem item : items)
            if (itemType.isInstance(item))
                count++;
        return count;
    }

    public Entity getEntity(String itemUsedId) {
        for (InventoryItem item : items)
            if (((Entity) item).getId().equals(itemUsedId))
                return (Entity) item;
        return null;
    }

    public List<Entity> getEntities() {
        return items.stream().map(Entity.class::cast).collect(Collectors.toList());
    }

    public <T> List<T> getEntities(Class<T> clz) {
        return items.stream().filter(clz::isInstance).map(clz::cast).collect(Collectors.toList());
    }

    public boolean hasWeapon() {
        for (InventoryItem item : items) {
            if (item instanceof BattleItem) {
                return true;
            }
        }
        return false;
    }

    public BattleItem getWeapon() {
        for (InventoryItem item : items) {
            if (item instanceof BattleItem) {
                return (BattleItem) item;
            }
        }
        return null;
    }
}
