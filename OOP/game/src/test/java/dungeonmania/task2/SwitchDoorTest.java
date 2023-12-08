package dungeonmania.task2;

import dungeonmania.DungeonManiaController;
import dungeonmania.exceptions.InvalidActionException;
import dungeonmania.mvp.TestUtils;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;
import dungeonmania.util.Position;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;

public class SwitchDoorTest {
        // ##########################################################################
        // ######################## Activate one adj switch #########################
        // ##########################################################################

        @Test
        @Tag("18-1-1")
        @DisplayName("Test activating one switch adj to an XOR switch door, "
                        + "successfully opens")
        public void oneAdjSwitchActivatedXOR() throws IllegalArgumentException,
                        InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_OneAdjSwitch_XOR",
                                "c_switchDoorTest");

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate Switch to open door
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door now
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                Position pos3 = TestUtils.getEntities(res, "player").get(0).getPosition();

                assertNotEquals(pos2, pos3);
                assertNotEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Deactivate Switch to close door
                res = dmc.tick(Direction.LEFT);

                // check player cannot walk through door
                Position pos4 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.RIGHT);
                assertEquals(pos4, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-1-2")
        @DisplayName("Test activating one switch adj to an OR switch door, "
                        + "successfully opens")
        public void oneAdjSwitchActivatedOR() throws IllegalArgumentException,
                        InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_OneAdjSwitch_OR",
                                "c_switchDoorTest");

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate Switch to open door
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door now
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertNotEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Deactivate Switch to close door
                res = dmc.tick(Direction.LEFT);

                // check player cannot walk through door
                Position pos3 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.RIGHT);
                assertEquals(pos3, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-1-3")
        @DisplayName("Test activating one switch adj to an AND switch door, "
                        + "does not open")
        public void oneAdjSwitchActivatedAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_OneAdjSwitch_AND", "c_switchDoorTest");

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate Switch to open door - unsuccessful
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-1-4")
        @DisplayName("Test activating one switch adj to an COAND switch door, "
                        + "does not open")
        public void oneAdjSwitchActivatedCOAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_OneAdjSwitch_COAND", "c_switchDoorTest");

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate Switch to open door - unsuccessful
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        // ##########################################################################
        // ################### Activate one adj wire ###################
        // ##########################################################################

        @Test
        @Tag("18-2-1")
        @DisplayName("Test activating one wire adj to an XOR switch door, "
                        + "successfully opens")
        public void oneAdjWireActivatedXOR() throws IllegalArgumentException,
                        InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_OneAdjWire_XOR",
                                "c_switchDoorTest");

                // Activate Switch to open door
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition(); //

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

                // Deactivate Switch to close door
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);

                // check door is closed
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition(); //

                res = dmc.tick(Direction.RIGHT);
                assertEquals(pos2, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

        }

        @Test
        @Tag("18-2-2")
        @DisplayName("Test activating one wire adj to an OR switch door, "
                        + "successfully opens")
        public void oneAdjWireActivatedOR() throws IllegalArgumentException,
                        InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_OneAdjWire_OR",
                                "c_switchDoorTest");

                // Activate Switch to open door
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Deactivate Switch to close door
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);

                // check door is closed
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.RIGHT);
                assertEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-2-3")
        @DisplayName("Test activating one wire adj to an AND switch door, "
                        + "does not open")
        public void oneAdjWireActivatedAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_OneAdjWire_AND", "c_switchDoorTest");

                // Activate Switch to open door
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-2-3")
        @DisplayName("Test activating one wire adj to a COAND switch door, "
                        + "does not open")
        public void oneAdjWireActivatedCOAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_OneAdjWire_COAND", "c_switchDoorTest");

                // Activate Switch to open door
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        // #########################################################################################
        // ####################### Activate two adj activators synchronously
        // #######################
        // #########################################################################################

        @Test
        @Tag("18-3-1")
        @DisplayName("Test activating two activators adj to an XOR switch door in one tick, "
                        + "door does not open")
        public void twoAdjActivatorsActivatedSynchronouslyXOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_TwoAdjActivators_Synchronous_XOR",
                                "c_switchDoorTest");

                // Activate Switch to open door
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-3-2")
        @DisplayName("Test activating two activators adj to an OR switch door in one tick, "
                        + "door sucessfully opens")
        public void twoAdjActivatorsActivatedSynchronouslyOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_TwoAdjActivators_Synchronous_OR",
                                "c_switchDoorTest");

                // Activate Switch to open door
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

                // Deactivate switch to close door
                res = dmc.tick(Direction.LEFT);

                // check player cannot walk through door
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.RIGHT);
                assertEquals(pos2, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

        }

        @Test
        @Tag("18-3-3")
        @DisplayName("Test activating two activators adj to an AND switch door in one tick, "
                        + "door successfully opens")
        public void twoAdjActivatorsActivatedSynchronouslyAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_TwoAdjActivators_Synchronous_AND",
                                "c_switchDoorTest");

                // Activate Switch to open door
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

        }

        @Test
        @Tag("18-3-4")
        @DisplayName("Test activating two activators adj to a COAND switch door in one tick, "
                        + "door successdully opens")
        public void twoAdjActivatorsActivatedSynchronouslyCOAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_TwoAdjActivators_Synchronous_COAND",
                                "c_switchDoorTest");

                // Activate Switch to open door
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        // //
        // ###########################################################################################
        // // ########################### Activate two adj activators asynchronously
        // ##############
        // ############################################################################################

        @Test
        @Tag("18-4-1")
        @DisplayName("Test asynchronously activating two activators adj to an XOR switch door, "
                        + "Door opens when only one activator is activated at a time")
        public void twoAdjActivatorsActivatedAsynchronouslyXOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_TwoAdjActivators_Asynchronous_XOR",
                                "c_switchDoorTest");

                // Activate Switch 1 to open door - successful
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate Switch 2 - door closes
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-4-2")
        @DisplayName("Test asynchronously activating two activators adj to an OR switch door, "
                        + "door opens when one or both activators are activated")
        public void twoAdjActivatorsActivatedAsynchronouslyOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_TwoAdjActivators_Asynchronous_OR",
                                "c_switchDoorTest");

                // Activate Switch 1 to open door - successful
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate second switch - door remains open
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Deactivate switch 1 - door remains open
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);

                // check player can walk through door
                res = dmc.tick(Direction.RIGHT);
                Position pos3 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.RIGHT);
                assertNotEquals(pos3, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-4-3")
        @DisplayName("Test asynchronously activating two activators adj to an AND switch door, "
                        + "door opens when both activators are activated")
        public void twoAdjActivatorsActivatedAsynchronouslyAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_TwoAdjActivators_Asynchronous_AND",
                                "c_switchDoorTest");

                // Activate Switch to open door - unsuccessful
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate second switch - door now opens
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Deactivate switch 1 - door closes
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);

                // check player cannot walk through door
                res = dmc.tick(Direction.RIGHT);
                Position pos3 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.RIGHT);
                assertEquals(pos3, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        @Test
        @Tag("18-4-4")
        @DisplayName("Test asynchronously activating two activators adj to a COAND switch door, "
                        + "door does not open")
        public void twoAdjActivatorsActivatedAsynchronouslyCOAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_TwoAdjActivators_Asynchronous_COAND",
                                "c_switchDoorTest");

                // Activate Switch 1 to open door - unsuccessful
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate second switch - door remains closed
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

        // #######################################################################
        // ################# Activate three adj activators asynchronously
        // ########################################################################

        @Test
        @Tag("18-5-1")
        @DisplayName("Test activating three activators adj to an XOR switch door asynchronously, "
                        + "door only opens when one switch is activated at a time")
        public void threeAdjActivatorsActivatedAsynchronouslyXOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_ThreeAdjActivators_Asynchronous_XOR",
                                "c_switchDoorTest");

                // Activate Switch 1 to open door - successful
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

                // Activate Switch 2 - door closes
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertEquals(pos2, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

        }

        @Test
        @Tag("18-5-2")
        @DisplayName("Test activating three activators adj to an OR switch door asynchronously, "
                        + "door opens when one or more switches are activated")
        public void threeAdjActivatorsActivatedAsynchronouslyOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_ThreeAdjActivators_Asynchronous_OR",
                                "c_switchDoorTest");

                // Activate Switch 1 to open door - successful
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos1, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

                // Activate switch 2 - door remains open
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos2, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

                // Deactivate switch 1 - door remains open
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);

                // check player can walk through door
                res = dmc.tick(Direction.RIGHT);
                Position pos3 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.RIGHT);
                assertNotEquals(pos3, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

        }

        @Test
        @Tag("18-4-3")
        @DisplayName("Test activating three activators adj to an AND switch door asynchronously, "
                        + "door opens when both switches are activated")
        public void threeAdjActivatorsActivatedAsynchronouslyAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_ThreeAdjActivators_Asynchronous_AND",
                                "c_switchDoorTest");

                // Activate Switch 1 to open door - unsuccessful
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

                // Activate second switch - door opens
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // check player can walk through door
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.UP);
                assertNotEquals(pos2, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

                // Deactivate switch 1 to close door
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);

                // check player cannot walk through door
                res = dmc.tick(Direction.RIGHT);
                Position pos3 = TestUtils.getEntities(res, "player").get(0).getPosition();

                res = dmc.tick(Direction.RIGHT);
                assertEquals(pos3, TestUtils.getEntities(res,
                                "player").get(0).getPosition());

        }

        @Test
        @Tag("18-4-4")
        @DisplayName("Test activating three activators adj to an COAND switch door asynchronously")
        public void threeAdjActivatorsActivatedAsynchronouslyCOAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_switchDoorTest_ThreeAdjActivators_Asynchronous_COAND",
                                "c_switchDoorTest");

                // Activate Switch to open door - unsuccessful
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos1 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos1, TestUtils.getEntities(res, "player").get(0).getPosition());

                // Activate second switch - door remains closed
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // check player cannot walk through door
                res = dmc.tick(Direction.UP);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(Direction.RIGHT);
                Position pos2 = TestUtils.getEntities(res, "player").get(0).getPosition();
                res = dmc.tick(Direction.UP);
                assertEquals(pos2, TestUtils.getEntities(res, "player").get(0).getPosition());

        }

}
