package unsw.satellite;

import unsw.utils.Angle;

public class StandardSatellite extends Satellite {
    public StandardSatellite(String satelliteId, String type, double height, Angle position) {
        super(satelliteId, type, height, position);
        this.setMovementSpeed(2500.00);
        this.setRange(150000.00);
        this.setDataSizeLimit(80);
        this.setNumFileLimit(3);
    }

    @Override
    public Angle specialEffect(Angle before, Angle after) {
        return after;
    }
}
