package unsw.satellite;

import unsw.utils.Angle;

public class TeleportingSatellite extends Satellite{
    public TeleportingSatellite(String satelliteId, String type, double height, Angle position) {
        super(satelliteId, type, height, position);
        this.setMovementSpeed(1000.00);
        this.setRange(200000.00);
        this.setDirection("anti-clockwise");
        this.setDataSizeLimit(200);
    }

    @Override
    // implement teleportation effect Triggered only if the change crosses 180 degrees mark
    public Angle specialEffect(Angle before, Angle after) {
        Angle newAngle = after;
        if (this.getDirection().equals("anti-clockwise")
            && before.compareTo(Angle.fromDegrees(180)) < 0 && after.compareTo(Angle.fromDegrees(180)) >= 0) {
            this.setDirection("clockwise");
            newAngle = Angle.fromDegrees(0);
        } else if (this.getDirection().equals("clockwise") 
            && before.compareTo(Angle.fromDegrees(180)) > 0 && after.compareTo(Angle.fromDegrees(180)) <= 0) {
            this.setDirection("anti-clockwise");
            newAngle = Angle.fromDegrees(0);
        }
        return newAngle;
    }
}
