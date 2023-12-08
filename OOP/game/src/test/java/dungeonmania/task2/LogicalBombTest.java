package dungeonmania.task2;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import dungeonmania.DungeonManiaController;
import dungeonmania.exceptions.InvalidActionException;
import dungeonmania.mvp.TestUtils;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;

public class LogicalBombTest {

        // ##########################################################################
        // ################### Activate one adj switch ###################
        // ##########################################################################

        @Test
        @Tag("8-1-1")
        @DisplayName("Test activating one switch adj to an XOR bomb, "
                        + "successful explosion")
        public void oneAdjSwitchActivatedXOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_OneAdjSwitch_XOR", "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-1-2")
        @DisplayName("Test activating one switch adj to an OR bomb, "
                        + "successful explosion")
        public void oneAdjSwitchActivatedOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_OneAdjSwitch_OR", "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-1-3")
        @DisplayName("Test activating one switch adj to an AND bomb, "
                        + "unsuccessful explosion")
        public void oneAdjSwitchActivatedAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_OneAdjSwitch_AND", "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-1-4")
        @DisplayName("Test activating one switch adj to a COAND bomb, "
                        + "unsuccessful explosion")
        public void oneAdjSwitchActivatedCOAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_OneAdjSwitch_COAND", "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        // ##########################################################################
        // ################### Activate one adj wire ###################
        // ##########################################################################

        @Test
        @Tag("8-2-1")
        @DisplayName("Test activating one wire adj to an XOR bomb, "
                        + "successful explosion")
        public void oneAdjWireActivatedXOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_OneAdjWire_XOR", "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-2-2")
        @DisplayName("Test activating one switch adj to an OR bomb, "
                        + "successful explosion")
        public void oneAdjWireActivatedOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_OneAdjWire_OR", "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-2-3")
        @DisplayName("Test activating one switch adj to an AND bomb, "
                        + "unsuccessful explosion")
        public void oneAdjWireActivatedAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_OneAdjWire_AND", "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(1, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-2-4")
        @DisplayName("Test activating one switch adj to a COAND bomb, "
                        + "unsuccessful explosion")
        public void oneAdjWireActivatedCOAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_OneAdjWire_COAND", "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(1, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        // ##########################################################################
        // ################ Activate two adj activators synchronously ###############
        // ##########################################################################

        @Test
        @Tag("8-3-1")
        @DisplayName("Test activating two activators adj to an XOR bomb in one tick, "
                        + "unsuccessful explosion")
        public void twoAdjActivatorsActivatedSynchronouslyXOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_TwoAdjActivators_Synchronous_XOR",
                                "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(2, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-3-2")
        @DisplayName("Test activating two activators adj to an OR bomb in one tick, "
                        + "successful explosion")
        public void twoAdjActivatorsActivatedSynchronouslyOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_TwoAdjActivators_Synchronous_OR",
                                "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-3-3")
        @DisplayName("Test activating two activators adj to an AND bomb in one tick, "
                        + "successful explosion")
        public void twoAdjActivatorsActivatedSynchronouslyAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_TwoAdjActivators_Synchronous_AND",
                                "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-3-4")
        @DisplayName("Test activating two activators adj to a COAND bomb in one tick, "
                        + "successful explosion")
        public void twoAdjActivatorsActivatedSynchronouslyCOAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_TwoAdjActivators_Synchronous_COAND",
                                "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        // ##########################################################################
        // ############### Activate two adj activators asynchronously ###############
        // ##########################################################################

        @Test
        @Tag("8-4-1")
        @DisplayName("Test activating two activators adj to an XOR bomb asynchronously, "
                        + "successful explosion")
        public void twoAdjActivatorsActivatedAsynchronouslyXOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_TwoAdjActivators_Asynchronous_XOR",
                                "c_bombTest_OneAdjSwitch");

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-4-2")
        @DisplayName("Test activating two activators adj to an OR bomb asynchronously, "
                        + "successful explosion")
        public void twoAdjActivatorsActivatedAsynchronouslyOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_TwoAdjActivators_Asynchronous_OR",
                                "c_bombTest_OneAdjSwitch");

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-4-3")
        @DisplayName("Test activating two activators adj to an AND bomb asynchronously, "
                        + "unsuccessful explosion then successful explosion")
        public void twoAdjActivatorsActivatedAsynchronouslyAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_TwoAdjActivators_Asynchronous_AND",
                                "c_bombTest_OneAdjSwitch");

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(2, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(2, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());

                // Activate Switch 2
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-4-4")
        @DisplayName("Test activating two activators adj to a COAND bomb asynchronously, "
                        + "unsuccessful explosion after both switches are activated")
        public void twoAdjActivatorsActivatedAsynchronouslyCOAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_TwoAdjActivators_Asynchronous_COAND",
                                "c_bombTest_OneAdjSwitch");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(2, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(2, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());

                // Activate Switch 2
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(2, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(2, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        // ##########################################################################
        // ################ Place bomb next to one activated switch #################
        // ##########################################################################
        @Test
        @Tag("8-5-1")
        @DisplayName("Test placing XOR bomb cardinally adjacent to one active switch, "
                        + "successful explosion")
        public void placeCardinallyActivateXOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeCardinallyActive_XOR",
                                "c_bombTest_placeCardinallyActive");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Pick up Bomb
                res = dmc.tick(Direction.DOWN);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Place Cardinally Adjacent to Active Switch
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-5-2")
        @DisplayName("Test placing OR bomb cardinally adjacent to one active switch, "
                        + "successful explosion")
        public void placeCardinallyActivateOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeCardinallyActive_OR",
                                "c_bombTest_placeCardinallyActive");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Pick up Bomb
                res = dmc.tick(Direction.DOWN);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Place Cardinally Adjacent to Active Switch
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-5-3")
        @DisplayName("Test placing AND bomb cardinally adjacent to one active switch, "
                        + "unsuccessful explosion")
        public void placeCardinallyActivateAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeCardinallyActive_AND",
                                "c_bombTest_placeCardinallyActive");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Pick up Bomb
                res = dmc.tick(Direction.DOWN);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-5-4")
        @DisplayName("Test placing COAND bomb cardinally adjacent to one active switch, "
                        + "unsuccessful explosion")
        public void placeCardinallyActivateCOAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeCardinallyActive_COAND",
                                "c_bombTest_placeCardinallyActive");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Pick up Bomb
                res = dmc.tick(Direction.DOWN);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check Bomb did NOT explode
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        // // ##########################################################################
        // // ####### Place bomb next to two synchronoulsy activated switches ##########
        // // ##########################################################################

        @Test
        @Tag("8-6-1")
        @DisplayName("Test placing XOR bomb cardinally adjacent to two synchronously actived switches, "
                        + "unsuccessful explosion")
        public void placeTwoSynchronousCardinallyActivateXOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoSynchronousCardinallyActive_XOR",
                                "c_bombTest_placeCardinallyActive");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Pick up Bomb
                res = dmc.tick(Direction.DOWN);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Place Cardinally Adjacent to Active Switch
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(2, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-6-2")
        @DisplayName("Test placing OR bomb cardinally adjacent to two synchronously actived switches, "
                        + "successful explosion")
        public void placeTwoSynchronousCardinallyActivateOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoSynchronousCardinallyActive_OR",
                                "c_bombTest_placeCardinallyActive");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Pick up Bomb
                res = dmc.tick(Direction.DOWN);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Place Cardinally Adjacent to Active Switch
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-6-3")
        @DisplayName("Test placing AND bomb cardinally adjacent to two synchronously actived switches, "
                        + "successful explosion")
        public void placeTwoSynchronousCardinallyActivateAND() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoSynchronousCardinallyActive_AND",
                                "c_bombTest_placeCardinallyActive");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Pick up Bomb
                res = dmc.tick(Direction.DOWN);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-6-4")
        @DisplayName("Test placing COAND bomb cardinally adjacent to two synchronously actived switches, "
                        + "successful explosion")
        public void placeTwoSynchronousCardinallyActivateCOAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoSynchronousCardinallyActive_COAND",
                                "c_bombTest_placeCardinallyActive");

                // Activate Switch
                res = dmc.tick(Direction.RIGHT);

                // Pick up Bomb
                res = dmc.tick(Direction.DOWN);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        // ##########################################################################
        // ####### Place bomb next to two asynchronoulsy activated switches ##########
        // ##########################################################################

        @Test
        @Tag("8-7-1")
        @DisplayName("Test placing XOR bomb cardinally adjacent to two asynchronously active switches, "
                        + "unsuccessful explosion")
        public void placeTwoAsynchronousCardinallyActivateXOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoAsynchronousCardinallyActive_XOR",
                                "c_bombTest_placeCardinallyActive");

                // Pick up bomb
                res = dmc.tick(Direction.RIGHT);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Activate Switch 2
                res = dmc.tick(Direction.DOWN);

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(2, TestUtils.getEntities(res, "boulder").size());
                assertEquals(2, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-7-2")
        @DisplayName("Test placing OR bomb cardinally adjacent to two asynchronously active switches, "
                        + "successful explosion")
        public void placeTwoAsynchronousCardinallyActivateOR() throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoAsynchronousCardinallyActive_OR",
                                "c_bombTest_placeCardinallyActive");

                // Pick up bomb
                res = dmc.tick(Direction.RIGHT);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Activate Switch 2
                res = dmc.tick(Direction.DOWN);

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-7-3")
        @DisplayName("Test placing AND bomb cardinally adjacent to two asynchronously active switches, "
                        + "successful explosion")
        public void placeTwoAsynchronousCardinallyActivateAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoAsynchronousCardinallyActive_AND",
                                "c_bombTest_placeCardinallyActive");

                // Pick up bomb
                res = dmc.tick(Direction.RIGHT);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Activate Switch 2
                res = dmc.tick(Direction.DOWN);

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(0, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(0, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-7-4")
        @DisplayName("Test placing COAND bomb cardinally adjacent to two asynchronously active switches, "
                        + "unsuccessful explosion")
        public void placeTwoAsynchronousCardinallyActivateCOAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoAsynchronousCardinallyActive_COAND",
                                "c_bombTest_placeCardinallyActive");

                // Pick up bomb
                res = dmc.tick(Direction.RIGHT);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Activate Switch 2
                res = dmc.tick(Direction.DOWN);

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(2, TestUtils.getEntities(res, "boulder").size());
                assertEquals(2, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        // ##########################################################################
        // ####### Place bomb next to two non-consecutively asynchronous activated
        // switches ##########
        // ##########################################################################

        @Test
        @Tag("8-8-1")
        @DisplayName("Test activating one switch, placing XOR bomb, then activating second switch, "
                        + "successful explosion")
        public void placeTwoNonConsecutivelyAsynchronousCardinallyActivateXOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoNonConsecutivelyAsynchronousCardinallyActive_XOR",
                                "c_bombTest_placeCardinallyActive");

                // Pick up bomb
                res = dmc.tick(Direction.RIGHT);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-8-2")
        @DisplayName("Test activating one switch, placing OR bomb, then activating second switch, "
                        + "successful explosion")
        public void placeTwoNonConsecutivelyAsynchronousCardinallyActivateOR()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoNonConsecutivelyAsynchronousCardinallyActive_OR",
                                "c_bombTest_placeCardinallyActive");

                // Pick up bomb
                res = dmc.tick(Direction.RIGHT);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(0, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-8-3")
        @DisplayName("Test activating one switch, placing AND bomb, then activating second switch, "
                        + "unsuccessful explosion then successful explosion")
        public void placeTwoNonConsecutivelyAsynchronousCardinallyActivateAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame("d_bombTest_placeTwoNonConsecutivelyAsynchronousCardinallyActive_AND",
                                "c_bombTest_placeCardinallyActive");

                // Pick up bomb
                res = dmc.tick(Direction.RIGHT);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Activate Switch 1
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);

                // Check successful explosion
                assertEquals(0, TestUtils.getEntities(res, "bomb").size());
                assertEquals(1, TestUtils.getEntities(res, "boulder").size());
                assertEquals(1, TestUtils.getEntities(res, "switch").size());
                assertEquals(0, TestUtils.getEntities(res, "wall").size());
                assertEquals(0, TestUtils.getEntities(res, "treasure").size());
                assertEquals(1, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

        @Test
        @Tag("8-8-4")
        @DisplayName("Test activating one switch, placing COAND bomb, then activating second switch, "
                        + "unsuccessful explosion")
        public void placeTwoNonConsecutivelyAsynchronousCardinallyActivateCOAND()
                        throws IllegalArgumentException, InvalidActionException {
                DungeonManiaController dmc;
                dmc = new DungeonManiaController();
                DungeonResponse res = dmc.newGame(
                                "d_bombTest_placeTwoNonConsecutivelyAsynchronousCardinallyActive_COAND",
                                "c_bombTest_placeCardinallyActive");

                // Pick up bomb
                res = dmc.tick(Direction.RIGHT);
                assertEquals(1, TestUtils.getInventory(res, "bomb").size());

                // Activate Switch 1
                res = dmc.tick(Direction.RIGHT);

                // Place Cardinally Adjacent
                res = dmc.tick(Direction.DOWN);
                res = dmc.tick(Direction.RIGHT);
                res = dmc.tick(TestUtils.getInventory(res, "bomb").get(0).getId());

                // Activate Switch 1
                res = dmc.tick(Direction.LEFT);
                res = dmc.tick(Direction.DOWN);

                // Check unsuccessful explosion
                assertEquals(1, TestUtils.getEntities(res, "bomb").size());
                assertEquals(2, TestUtils.getEntities(res, "boulder").size());
                assertEquals(2, TestUtils.getEntities(res, "switch").size());
                assertEquals(1, TestUtils.getEntities(res, "wall").size());
                assertEquals(1, TestUtils.getEntities(res, "treasure").size());
                assertEquals(2, TestUtils.getEntities(res, "wire").size());
                assertEquals(1, TestUtils.getEntities(res, "player").size());
        }

}
