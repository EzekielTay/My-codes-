package unsw.device;

import unsw.utils.Angle;

public class DesktopDevice extends Device{
    /**
     * Desktop device constructor
     * @param deviceID
     * @param position
     */
    public DesktopDevice(String deviceID, String type, Angle position) {
        super(deviceID, type, position, 200000);
    }
}
