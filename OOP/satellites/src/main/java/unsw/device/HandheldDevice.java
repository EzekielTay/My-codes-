package unsw.device;

import unsw.utils.Angle;

public class HandheldDevice extends Device {
    /**
     * Handheld device constructor
     * @param deviceID
     * @param position
     */
    public HandheldDevice(String deviceID, String type, Angle position) {
        super(deviceID, type, position, 50000);
    }
}
