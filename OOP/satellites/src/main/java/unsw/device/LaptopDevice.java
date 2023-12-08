package unsw.device;

import unsw.utils.Angle;

public class LaptopDevice extends Device {
    /**
     * Laptop device constructor
     * @param deviceID
     * @param position
     */
    public LaptopDevice(String deviceID, String type, Angle position) {
        super(deviceID, type, position, 100000);
    }
}
