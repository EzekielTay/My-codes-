package dungeonmania.map;

import org.json.JSONObject;

import dungeonmania.entities.EntityFactory;

public class GraphNodeFactory {
    public static GraphNode createEntity(JSONObject jsonEntity, EntityFactory factory) {
        return constructEntity(jsonEntity, factory);
    }

    private static GraphNode constructEntity(JSONObject jsonEntity, EntityFactory factory) {

        switch (jsonEntity.getString("type")) {
            case "player":
            case "zombie_toast":
            case "zombie_toast_spawner":
            case "mercenary":
            case "wall":
            case "boulder":
            case "switch":
            case "wire":
            case "exit":
            case "treasure":
            case "sun_stone":
            case "wood":
            case "arrow":
            case "bomb":
            case "light_bulb_off":
            case "switch_door":
            case "invisibility_potion":
            case "invincibility_potion":
            case "portal":
            case "sword":
            case "spider":
            case "door":
            case "key":
                return new GraphNode(factory.createEntity(jsonEntity));
            default:
                return null;
        }
    }
}
