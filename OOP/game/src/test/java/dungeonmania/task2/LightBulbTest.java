package dungeonmania.task2;

import dungeonmania.DungeonManiaController;
import dungeonmania.exceptions.InvalidActionException;
import dungeonmania.mvp.TestUtils;
import dungeonmania.response.models.DungeonResponse;
import dungeonmania.util.Direction;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class LightBulbTest {

    @Test
    @Tag("19-0-1")
    @DisplayName("Test light bulb is created off")
    public void lightBulbCreatedOff() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_CreatedOff", "c_lightBulbTest");

        // check state of light bulbs upon creating new game
        System.out.println("Number of light_bulb_off: " + TestUtils.getEntities(res, "light_bulb").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    // ##########################################################################
    // ######################## Activate one adj switch #########################
    // ##########################################################################

    @Test
    @Tag("19-1-1-1")
    @DisplayName("Test activating one switch adj to an XOR lightbulb, "
            + "successfully lights up")
    public void oneAdjSwitchActivatedXOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjSwitch_XOR", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb has turned on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    // @Test
    // @Tag("19-1-1-2")
    // @DisplayName("Test activating one switch adj to two XOR lightbulbs, "
    // + "successfully lights up")
    // public void OneAdjSwitchActivatedTwoXOR() throws IllegalArgumentException,
    // InvalidActionException {
    // DungeonManiaController dmc;
    // dmc = new DungeonManiaController();
    // DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjSwitch_Two_XOR",
    // "c_lightBulbTest");

    // // Activate Switch
    // res = dmc.tick(Direction.RIGHT);

    // // check light bulb has turned on
    // assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
    // assertEquals(2, TestUtils.getEntities(res, "light_bulb_on").size());

    // // Deactivate Switch
    // res = dmc.tick(Direction.DOWN);
    // res = dmc.tick(Direction.RIGHT);
    // res = dmc.tick(Direction.UP);

    // // check light bulb is off
    // assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
    // assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    // }

    @Test
    @Tag("18-1-2")
    @DisplayName("Test activating one switch adj to an OR light bulb, "
            + "successfully lights up")
    public void oneAdjSwitchActivatedOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjSwitch_OR", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb has turned on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-1-3")
    @DisplayName("Test activating one switch adj to an AND light bulb, "
            + "does not light up")
    public void oneAdjSwitchActivatedAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjSwitch_AND", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-1-4")
    @DisplayName("Test activating one switch adj to a COAND light bulb, "
            + "does not open")
    public void oneAdjSwitchActivatedCOAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjSwitch_COAND", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    // #############################################################################################################
    // ################################################ Activate one adj wire
    // ##############################################
    // #############################################################################################################

    @Test
    @Tag("18-2-1")
    @DisplayName("Test activating one wire adj to an XOR light bulb, "
            + "successfully lights up")
    public void oneAdjWireActivatedXOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjWire_XOR", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-2-2")
    @DisplayName("Test activating one wire adj to an OR light bulb, "
            + "successfully lights up")
    public void oneAdjWireActivatedOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjWire_OR", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-2-3")
    @DisplayName("Test activating one wire adj to an AND light bulb, "
            + "does not light up")
    public void oneAdjWireActivatedAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjWire_AND", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-2-4")
    @DisplayName("Test activating one wire adj to a COAND light bulb, "
            + "does not light up")
    public void oneAdjWireActivatedCOAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_OneAdjWire_COAND", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    // #######################################################################################################
    // ###################################### Activate two adj activators msynchronously #####################
    // ####################################################################################

    @Test
    @Tag("18-3-1")
    @DisplayName("Test activating two activators adj to an XOR light bulb in one tick, "
            + "does not light up")
    public void twoAdjActivatorsActivatedSynchronouslyXOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_TwoAdjActivators_Synchronous_XOR", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-3-2")
    @DisplayName("Test activating two activators adj to an OR light bulb in one tick, "
            + "successfully lights up")
    public void twoAdjActivatorsActivatedSynchronouslyOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_TwoAdjActivators_Synchronous_OR", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    @Test
    @Tag("18-3-3")
    @DisplayName("Test activating two activators adj to an AND light bulb in one tick, "
            + "successfully lights up")
    public void twoAdjActivatorsActivatedSynchronouslyAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_TwoAdjActivators_Synchronous_AND", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());
    }

    @Test
    @Tag("18-3-4")
    @DisplayName("Test activating two activators adj to a COAND light bulb in one tick, "
            + "successdully lights up")
    public void twoAdjActivatorsActivatedSynchronouslyCOAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_TwoAdjActivators_Synchronous_COAND", "c_lightBulbTest");

        // Activate Switch
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    // #####################################################################################################
    // ###################################### Activate two adj activators asynchronously ###################
    // ####################################################################################################

    @Test
    @Tag("18-4-1")
    @DisplayName("Test asynchronously activating two activators adj to an XOR light bulb, "
            + "lights up when only one activator is activated at a time")
    public void twoAdjActivatorsActivatedAsynchronouslyXOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_TwoAdjActivators_Asynchronous_XOR", "c_lightBulbTest");

        // Activate Switch 1
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Activate Switch 2
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch 1
        res = dmc.tick(Direction.UP);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-4-2")
    @DisplayName("Test asynchronously activating two activators adj to an OR light bulb, "
            + "lights up when one or both activators are activated")
    public void twoAdjActivatorsActivatedAsynchronouslyOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_TwoAdjActivators_Asynchronous_OR", "c_lightBulbTest");

        // Activate Switch 1
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Activate Switch 2
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is still on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch 1
        res = dmc.tick(Direction.UP);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-4-3")
    @DisplayName("Test asynchronously activating two activators adj to an AND light bulb, "
            + "lights up when both activators are activated")
    public void twoAdjActivatorsActivatedAsynchronouslyAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_TwoAdjActivators_Asynchronous_AND", "c_lightBulbTest");

        // Activate Switch 1
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

        // Activate Switch 2
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is still on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch 1
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-4-4")
    @DisplayName("Test asynchronously activating two activators adj to a COAND light bulb, "
            + "door does not open")
    public void twoAdjActivatorsActivatedAsynchronouslyCOAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_TwoAdjActivators_Asynchronous_COAND", "c_lightBulbTest");

        // Activate Switch 1
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

        // Activate Switch 2
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is still off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch 1
        res = dmc.tick(Direction.UP);

        // check light bulb is still off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    // #############################################################################################################
    // ##################################### Activate three adj activators asynchronously #########################
    // ############################################################################################################

    @Test
    @Tag("18-5-1")
    @DisplayName("Test activating three activators adj to an XOR light bulb asynchronously, "
            + "lights up when one switch is activated at a time")
    public void threeAdjActivatorsActivatedAsynchronouslyXOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_ThreeAdjActivators_Asynchronous_XOR", "c_lightBulbTest");

        // Activate Switch 1
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Activate Switch 2
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch 1
        res = dmc.tick(Direction.UP);

        // check light bulb is still off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-5-2")
    @DisplayName("Test activating three activators adj to an OR light bulb asynchronously, "
            + "lights up when one or more switches are activated")
    public void threeAdjActivatorsActivatedAsynchronouslyOR() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_ThreeAdjActivators_Asynchronous_OR", "c_lightBulbTest");

        // Activate Switch 1
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Activate Switch 2
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is still on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch 1
        res = dmc.tick(Direction.UP);

        // check light bulb is still on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-4-3")
    @DisplayName("Test activating three activators adj to an AND light bulb asynchronously, "
            + "lights up when both switches are activated")
    public void threeAdjActivatorsActivatedAsynchronouslyAND() throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_ThreeAdjActivators_Asynchronous_AND", "c_lightBulbTest");

        // Activate Switch 1
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

        // Activate Switch 2
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is on
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch 1
        res = dmc.tick(Direction.UP);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

    @Test
    @Tag("18-4-4")
    @DisplayName("Test activating three activators adj to an COAND light bulb asynchronously, "
            + "does not light up")
    public void threeAdjActivatorsActivatedAsynchronouslyCOAND()
            throws IllegalArgumentException, InvalidActionException {
        DungeonManiaController dmc;
        dmc = new DungeonManiaController();
        DungeonResponse res = dmc.newGame("d_lightBulbTest_ThreeAdjActivators_Asynchronous_COAND", "c_lightBulbTest");

        // Activate Switch 1
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

        // Activate Switch 2
        res = dmc.tick(Direction.DOWN);
        res = dmc.tick(Direction.RIGHT);

        // check light bulb is still off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

        // Deactivate Switch 1
        res = dmc.tick(Direction.UP);

        // check light bulb is still off
        assertEquals(1, TestUtils.getEntities(res, "light_bulb_off").size());
        assertEquals(0, TestUtils.getEntities(res, "light_bulb_on").size());

    }

}
