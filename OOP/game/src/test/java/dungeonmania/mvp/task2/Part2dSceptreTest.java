package dungeonmania.mvp.task2;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import dungeonmania.DungeonManiaController;
import dungeonmania.mvp.TestUtils;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;
import dungeonmania.util.Position;

public class Part2dSceptreTest {
    private Position getPlayerPos(DungeonResponse res) {
        return TestUtils.getEntities(res, "player").get(0).getPosition();
    }

    private Position getMercPos(DungeonResponse res) {
        return TestUtils.getEntities(res, "mercenary").get(0).getPosition();
    }

    @Test
    @Tag("12-10")
    @DisplayName("Testing an mind_coontrolled mercenary does not battle the player")
    public void mindControl() {
        DungeonManiaController dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_mercenaryTest_mindcontrol", "c_mercenaryTest_allyBattle");
        String mercId = TestUtils.getEntitiesStream(res, "mercenary").findFirst().get().getId();

        // Pick up Wood
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "wood").size());

        // Pick up sun_stone
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "sun_stone").size());

        // Pick up treasure
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "treasure").size());

        // Build sceptre
        assertEquals(0, TestUtils.getInventory(res, "sceptre").size());
        res = assertDoesNotThrow(() -> dmc.build("sceptre"));
        assertEquals(1, TestUtils.getInventory(res, "sceptre").size());

        // pick up treasure
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "treasure").size());
        assertEquals(new Position(6, 1), getMercPos(res));
        assertEquals(new Position(5, 1), getPlayerPos(res));

        // achieve mind control using sceptre, without using treasure
        res = assertDoesNotThrow(() -> dmc.interact(mercId));
        assertEquals(1, TestUtils.getInventory(res, "treasure").size());
        assertEquals(new Position(4, 1), getMercPos(res));
        assertEquals(new Position(5, 1), getPlayerPos(res));

        // walk pass merc without fighting
        res = dmc.tick(Direction.LEFT);
        assertEquals(0, res.getBattles().size());

        // Mind control ends. Test mercenary becomes enemy after mind control duration
        // ends
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, res.getBattles().size());
        assertEquals(0, TestUtils.countType(res, "mercenary"));
    }

    @Test
    @Tag("12-11")
    @DisplayName("Testing an mind_coontrolled mercenary does not battle the player")
    public void mindControlfromDistance() {
        DungeonManiaController dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_mincontrolLongDist", "c_mercenaryTest_allyBattle");
        String mercId = TestUtils.getEntitiesStream(res, "mercenary").findFirst().get().getId();

        // Pick up Wood
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "wood").size());

        // Pick up sun_stone
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "sun_stone").size());

        // Pick up treasure
        res = dmc.tick(Direction.RIGHT);
        assertEquals(1, TestUtils.getInventory(res, "treasure").size());

        // Build sceptre
        assertEquals(0, TestUtils.getInventory(res, "sceptre").size());
        res = assertDoesNotThrow(() -> dmc.build("sceptre"));
        assertEquals(1, TestUtils.getInventory(res, "sceptre").size());
        assertEquals(new Position(12, 1), getMercPos(res));

        // achieve mind control using sceptre at no distance constraint
        res = assertDoesNotThrow(() -> dmc.interact(mercId));
        assertEquals(new Position(11, 1), getMercPos(res));
        assertEquals(new Position(4, 1), getPlayerPos(res));
    }
}
