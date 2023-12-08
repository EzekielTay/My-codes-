package dungeonmania.mvp.task2;

import dungeonmania.DungeonManiaController;
import dungeonmania.mvp.TestUtils;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class Part2dMidnightArmourTest {
    @Test
    @Tag("14-1")
    @DisplayName("Midnight Armour No effect with zombie around")
    public void midnightArmourNoEffect() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_midnightArmourZombie", "c_battleTest_midnightArmour");

        // move player to right pick up sword
        res = dmc.tick(Direction.RIGHT);
        // move player to right pick up sun stone
        res = dmc.tick(Direction.RIGHT);
        // Build midnight armour
        assertEquals(0, TestUtils.getInventory(res, "midnight_armour").size());
        res = assertDoesNotThrow(() -> dmc.build("midnight_armour"));
        assertEquals(1, TestUtils.getInventory(res, "midnight_armour").size());

        // move player to right to fight merc & zombie spawns
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.countType(res, "zombie_toast"));
        // Player loses
        assertEquals(0, TestUtils.countType(res, "player"));
        assertEquals(1, TestUtils.countType(res, "mercenary"));
    }

    @Test
    @Tag("14-2")
    @DisplayName("Midnight Armour effective with no zombie around")
    public void midnightArmourhaveEffect() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_midnightArmourNoZombie", "c_battleTest_midnightArmour");

        // move player to right pick up sword
        res = dmc.tick(Direction.RIGHT);
        // move player to right pick up sun stone
        res = dmc.tick(Direction.RIGHT);
        // Build midnight armour
        assertEquals(0, TestUtils.getInventory(res, "midnight_armour").size());
        res = assertDoesNotThrow(() -> dmc.build("midnight_armour"));
        assertEquals(1, TestUtils.getInventory(res, "midnight_armour").size());

        // move player to right to fight merc
        res = dmc.tick(Direction.RIGHT);
        // Merc loses
        assertEquals(1, TestUtils.countType(res, "player"));
        assertEquals(0, TestUtils.countType(res, "mercenary"));
    }

    @Test
    @Tag("14-3")
    @DisplayName("Midnight Armour destroy zombieSpawner")
    public void midnightArmourDestroySpawnert() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_midnightArmourDestroySpawner", "c_zombieTest_toastDestruction");

        assertEquals(1, TestUtils.getEntities(res, "zombie_toast_spawner").size());
        String spawnerId = TestUtils.getEntities(res, "zombie_toast_spawner").get(0).getId();
        // move player to right pick up sword
        res = dmc.tick(Direction.RIGHT);
        // move player to right pick up sun stone
        res = dmc.tick(Direction.RIGHT);
        // Build midnight armour
        assertEquals(0, TestUtils.getInventory(res, "midnight_armour").size());
        res = assertDoesNotThrow(() -> dmc.build("midnight_armour"));
        assertEquals(1, TestUtils.getInventory(res, "midnight_armour").size());

        // Destroy spawner
        res = assertDoesNotThrow(() -> dmc.interact(spawnerId));
        assertEquals(0, TestUtils.countType(res, "zombie_toast_spawner"));
    }
}
