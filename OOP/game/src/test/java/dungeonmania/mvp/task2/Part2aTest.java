package dungeonmania.mvp.task2;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import dungeonmania.DungeonManiaController;
import dungeonmania.mvp.TestUtils;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;

public class Part2aTest {
    @Test
    @Tag("13-5")
    @DisplayName("Test achieving kill 2 enemies")
    public void enemies() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_basicGoalsTest_enemies", "c_basicGoalsTest_enemies");

        // move player to right
        res = dmc.tick(Direction.RIGHT);

        // assert goal not met
        assertTrue(TestUtils.getGoals(res).contains(":enemies"));

        // move player to right
        res = dmc.tick(Direction.RIGHT);

        // player fight & win 1st mercenary

        // assert goal not met
        assertTrue(TestUtils.getGoals(res).contains(":enemies"));

        // move player to right
        res = dmc.tick(Direction.RIGHT);

        // player fight & win 2nd mercenary

        // assert goal met
        assertEquals("", TestUtils.getGoals(res));
    }

    @Test
    @Tag("13-6")
    @DisplayName("Test achieving kill all spawners")
    public void spawners() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_basicGoalsTest_spawner", "c_basicGoalsTest_spawner");
        String spawnerId = TestUtils.getEntities(res, "zombie_toast_spawner").get(0).getId();

        // move player to right
        res = dmc.tick(Direction.RIGHT);

        // player picks up sword
        // assert goal not met
        assertTrue(TestUtils.getGoals(res).contains(":enemies"));

        // move player to right
        res = dmc.tick(Direction.RIGHT);

        // player destroy spawner
        res = assertDoesNotThrow(() -> dmc.interact(spawnerId));
        // assert goal met
        assertEquals("", TestUtils.getGoals(res));
    }

    @Test
    @Tag("14-7")
    @DisplayName("killing 2 enemies, all spawners and exit")
    public void exitAndEnemeyAndSpawner() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_complexGoalsTestEnemySpawnnerExit", "c_basicGoalsTest_enemies");
        String spawnerId = TestUtils.getEntities(res, "zombie_toast_spawner").get(0).getId();

        assertEquals(1, TestUtils.getEntities(res, "sword").size());
        assertEquals(0, TestUtils.getInventory(res, "sword").size());

        // move player to right (2,1) and pick up sword
        res = dmc.tick(Direction.RIGHT);

        assertEquals(0, TestUtils.getEntities(res, "sword").size());
        assertEquals(1, TestUtils.getInventory(res, "sword").size());

        // assert goal not met
        assertTrue(TestUtils.getGoals(res).contains(":enemies"));
        assertTrue(TestUtils.getGoals(res).contains(":exit"));

        // move player to right (3,1)
        res = dmc.tick(Direction.RIGHT);

        // player fight & win 1st mercenary

        // move player to right (4,1)
        res = dmc.tick(Direction.RIGHT);

        // player fight & win 2nd mercenary
        assertTrue(TestUtils.getGoals(res).contains(":exit"));
        assertTrue(TestUtils.getGoals(res).contains(":enemies"));

        // move player to right (5,1), player on exit
        res = dmc.tick(Direction.RIGHT);
        // move player up (5,2)
        res = dmc.tick(Direction.DOWN);

        // player destroy spawner
        res = assertDoesNotThrow(() -> dmc.interact(spawnerId));
        assertTrue(TestUtils.getGoals(res).contains(":exit"));

        // move player up (5,1)
        res = dmc.tick(Direction.UP);

        // assert goal met
        assertEquals("", TestUtils.getGoals(res));
    }

    @Test
    @Tag("14-8")
    @DisplayName("killing 2 enemies and all spawners or exit")
    public void testExitOrenemies() {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_complextGoaltestexitOrEnemies", "c_basicGoalsTest_enemies");
        assertEquals(1, TestUtils.getEntities(res, "sword").size());
        assertEquals(0, TestUtils.getInventory(res, "sword").size());

        // move player to right (2,1) and pick up sword
        res = dmc.tick(Direction.RIGHT);

        assertEquals(0, TestUtils.getEntities(res, "sword").size());
        assertEquals(1, TestUtils.getInventory(res, "sword").size());

        // assert goal not met
        assertTrue(TestUtils.getGoals(res).contains(":enemies"));
        assertTrue(TestUtils.getGoals(res).contains(":exit"));

        // move player to right (3,1)
        res = dmc.tick(Direction.RIGHT);

        // player fight & win 1st mercenary
        // move player to right (4,1)
        res = dmc.tick(Direction.RIGHT);
        assertTrue(TestUtils.getGoals(res).contains(":enemies"));
        assertTrue(TestUtils.getGoals(res).contains(":exit"));

        // move player to right (5,1), player on exit
        res = dmc.tick(Direction.RIGHT);
        // assert goal met
        assertEquals("", TestUtils.getGoals(res));
    }
}
