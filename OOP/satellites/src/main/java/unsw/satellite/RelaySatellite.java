package unsw.satellite;

import unsw.utils.Angle;

public class RelaySatellite extends Satellite {
    public RelaySatellite(String satelliteId, String type, double height, Angle position) {
        super(satelliteId, type, height, position);
        this.setMovementSpeed(1500.00);
        this.setRange(300000.00);
        if (position.compareTo(Angle.fromDegrees(345)) >= 0 && position.compareTo(Angle.fromDegrees(140)) <= 0) {
            this.setDirection("anti-clockwise");
        }
    }

    @Override
    // Triggered to ensure that satellite stays roughly between 140 - 190 degrees range
    public Angle specialEffect(Angle before, Angle after) {
        if (this.getDirection().equals("anti-clockwise") 
            && before.compareTo(Angle.fromDegrees(190)) < 0 && after.compareTo(Angle.fromDegrees(190)) >= 0) {
                this.setDirection("clockwise");
        } else if (this.getDirection().equals("clockwise")
            && before.compareTo(Angle.fromDegrees(140)) > 0 && after.compareTo(Angle.fromDegrees(140)) <= 0) {
                this.setDirection("anti-clockwise");
        }
        return after;
    }
}

