package unsw.satellite;

import unsw.device.Device;
import unsw.file.File;
import unsw.response.models.EntityInfoResponse;
import unsw.response.models.FileInfoResponse;
import unsw.utils.Angle;
import unsw.utils.MathsHelper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


public abstract class Satellite {
    private List<String> deviceCompatible = new ArrayList<String>();
    private List<File> files = new ArrayList<File>();
    private String satelliteId;
    private String type;
    private Double movementSpeed;
    private Double range;
    private Double height;
    private Angle position;
    private String direction;
    private int currNumFiles ;
    private int numFileLimit ;
    private int currDataSize  ;
    private int dataSizeLimit  ;
    private int sendByteLimit ;
    private int receiveByteLimit;
    private int transferNumLimit;
    private List<String> transferFilesTo = new ArrayList<String>();

    public Satellite (String satelliteId, String type, double height, Angle position) {
        this.satelliteId = satelliteId;
        this.type = type;
        this.height = height;
        this.position = position;
        this.direction = "clockwise";
        this.currDataSize = 0;
        this.currNumFiles = 0;
        this.numFileLimit = 0;
        this.dataSizeLimit = 0;
    }

    /**
     * Return a target satellite given a list and id.
     * @param satelliteList
     * @param id
     * @return
     */
    public static Satellite returnTarget(List<Satellite> satelliteList, String id) {
        Satellite targetSatellite = null;
        for (Satellite satellite: satelliteList) {
            if (satellite.getSatelliteId().equals(id)) {
                targetSatellite = satellite;
            }
        }
        return targetSatellite;
    }

    /**
     * Add a file to the satellite's list of files
     * @param file
     */
    public void addFile(File file) {
        //Set file as complete
        this.files.add(file);
    }

    /**
     * Add a file to the satellite's list of files
     * @param id
     */
    public void addTransferToId(String id) {
        //Set file as complete
        this.transferFilesTo.add(id);
    }

    /**
     * Return the desired EntityInfoResponse of an object
     * @return 
     */
    public EntityInfoResponse createEntityInfoResponse() {
        return new EntityInfoResponse(this.satelliteId, this.position, this.height, this.type, createFileHash());
    }

    /**
     * Create a hashmap for the files of a Satellite
     * @return
     */
    public Map<String, FileInfoResponse> createFileHash() {
        HashMap<String, FileInfoResponse> fileHash = new HashMap<String, FileInfoResponse>();
        for (File file: files) {
            FileInfoResponse fileInfoResponse = new FileInfoResponse(file.getFilename(), file.getData(), file.getFileSize(), file.isFileComplete());
            fileHash.put(file.getFilename(), fileInfoResponse);
        }
        return fileHash;
    }

    
    /**
     * Used in simulation() part2a
     * calculate the cahnge in angle per minute of simulation
     */
    public void changePosition() {
        // omega = v / r
        Double angularVelocity = this.movementSpeed / this.height ;
        Double arcDistanceTravelled = angularVelocity;
        // s = r * theta ; theta = s / r
        Double newAngleRadian; 
        if (this.getDirection().equals("anti-clockwise")) {
            newAngleRadian = this.position.toRadians() + arcDistanceTravelled;
        } else {
            newAngleRadian = this.position.toRadians() - arcDistanceTravelled;
        }
        Angle newAngleDegrees = Angle.fromRadians(newAngleRadian);

        newAngleDegrees = intepretAngle(newAngleDegrees);
        newAngleDegrees = specialEffect(this.getPosition(), newAngleDegrees);
        this.setPosition(newAngleDegrees);
    }

    public abstract Angle specialEffect(Angle before, Angle after);

    /**
     * Make adjustments to angle to ensure its within the range 0 to 360 degrees
     * @param angle
     * @return
     */
    public Angle intepretAngle(Angle angle) {
         if (angle.compareTo(Angle.fromDegrees(0)) < 0) {
            angle = angle.add(Angle.fromDegrees(360));
        } else if (angle.compareTo(Angle.fromDegrees(360)) >= 0) {
            angle = angle.subtract(Angle.fromDegrees(360));
        }
        return angle;
    }

    /**
     * Return a deepCopy of the existing Satellite list
     * @param satelliteList
     * @return
     */
    public static List<Satellite> duplicateList(List<Satellite> satelliteList) {
        List<Satellite> newList = new ArrayList<>();
        for (Satellite satellite: satelliteList) {
            newList.add(satellite);
        }
        return newList;
    }

    /**
     * Create a list of String of entities in range of Satellite
     * @param targetSatellite
     * @param dupeDeviceList
     * @param dupeSatelliteList
     * @param isDevice
     * @return
     */
    public List<String> listEntitiesOfSatellite(Satellite targetSatellite, 
        List<Device> dupeDeviceList, List<Satellite>dupeSatelliteList, boolean isDevice) {
            List<String> entitiesInRangeList = new ArrayList<>();
            // Check list of devices if original target entity is not a Device.
            if (!isDevice) {
                Iterator<Device> iteratorDevice = dupeDeviceList.iterator();
                while(iteratorDevice.hasNext()) {
                    Device device = iteratorDevice.next();
                    if (appendDeviceInRange(entitiesInRangeList, device)) {
                        iteratorDevice.remove();
                    }
                }
            }

            Iterator<Satellite> iteratorSatellite = dupeSatelliteList.iterator();
            while (iteratorSatellite.hasNext()) {
                Satellite satellite = iteratorSatellite.next();
                // Safely remove the current satellite from the list
                if (appendSatelliteInRange(entitiesInRangeList, satellite)) {
                    iteratorSatellite.remove(); 
                }
                // Check all satellites in range of Relay satellite as well.
                if (satellite.getType().equals("RelaySatellite")) {
                    entitiesInRangeList.addAll(satellite.listEntitiesOfSatellite(satellite, 
                        Device.duplicateList(dupeDeviceList), duplicateList(dupeSatelliteList), isDevice));
                }
            }
            return entitiesInRangeList;
    }

    /**
     * append deviceId to list of entities in range when valid
     * @param entitiesInRangeList
     * @param satellite
     * @return
     */
    public boolean appendDeviceInRange(List<String> entitiesInRangeList, Device device) {
        Double distance = MathsHelper.getDistance(this.getheight(), this.getPosition(), device.getPosition());
        if (distance <= this.getRange() && MathsHelper.isVisible(this.getheight(), 
            this.getPosition(), device.getPosition())) {
                if (!this.getType().equals("StandardSatellite") || !device.getType().equals("DesktopDevice")) {
                    entitiesInRangeList.add(device.getDeviceID());
                    return true;
                }
        }
        return false;
    }

    /**
     * append satelliteId to list of entities in range when valid
     * @param entitiesInRangeList
     * @param satellite
     * @return
     */
    public boolean appendSatelliteInRange(List<String> entitiesInRangeList, Satellite satellite) {
        Double distance = MathsHelper.getDistance(satellite.getheight(), satellite.getPosition(), 
            this.getheight(), this.getPosition());
        if (distance <= this.getRange() && MathsHelper.isVisible(satellite.getheight(), satellite.getPosition(), 
            this.getheight(), this.getPosition())) {
                entitiesInRangeList.add(satellite.getSatelliteId());    
                return true;
        }
        return false;
    }

    /**
     * Check if transfer target still in range. If not, remove target from satellite transfer target list
     * @param fromId
     * @param toID
     * @param deviceList
     * @param satelliteList
     * @return boolean
     */
    public Boolean checkInRange(String fromId, String toID, List<Device> deviceList, List<Satellite> satelliteList) {
        Satellite satellite = returnTarget(satelliteList, fromId);
        List<String> inRangeList = listEntitiesOfSatellite(satellite, Device.duplicateList(deviceList), duplicateList(satelliteList), false);
        if (inRangeList.contains(toID)) {
            return true;
        }
        // out of range files removed from transferfiles list
        List<String> newList = satellite.getTransferFilesTo();
        newList.remove(toID);
        satellite.setTransferFilesTo(newList);
        return false;
    }

    /**
     * Calculate the current send/upload byte limit of the satellite
     * update the upload speed of the satellite
     * @param fromId
     * @param toID
     * @param deviceList
     * @param satelliteList
     * @return sendByteSpeed
     */
    public int calculateSendByteSpeed (List<Device> deviceList, List<Satellite> satelliteList) {
        int fileCount = 0;
        List<String> inRangeList = listEntitiesOfSatellite(this, Device.duplicateList(deviceList), duplicateList(satelliteList), false);
        for (String dest: this.transferFilesTo) {
            if (inRangeList.contains(dest)) {
                fileCount += 1;
            }
        }
        // divide the max limit by number of files
        int sendByteSpeed = this.getSendByteLimit() / fileCount;
        return sendByteSpeed;
    }

    /**
     * calculate the receive/download byte speed of the satellite
     * update the download speed of the satellite
     * @param Id
     * @param satelliteList
     * @return receiveByteSpeed
     */
    public int calculateReceiveByteSpeed(List<Satellite> satelliteList) {
        int fileCount = 0;
        List<File> fileList = this.getFileList();
        for (File file: fileList) {
            if (!file.isFileComplete()) {
                fileCount += 1;
            }
        }
        // divide the max limit by number of files
        int receiveByteSpeed = this.getReceiveByteLimit() / fileCount;
        return receiveByteSpeed;
    }

    /**
     * Find the target file given the filename
     * @param filename
     * @return
     */
    public File searchFile(String filename) {
        //Set file as complete
        for (File file: this.files) {
            if (file.getFilename().equals(filename)) {
                return file;
            }
        }
        return null;
    }

    /**
     * remove a file from the Satellite's list of files
     * @param file
     */
    public void removeFile(File file) {
        this.files.remove(file);
    }

    @Override
    public String toString() {
        return "Satellite [satelliteId=" + satelliteId + ", movementSpeed=" + movementSpeed + ", range=" + range
                + ", height=" + height + ", position=" + position + ", direction=" + direction + "]";
    }
 
    //Getter methods below
    public String getSatelliteId() {
        return satelliteId;
    }
    public Double getMovementSpeed() {
        return movementSpeed;
    }
    public Double getRange() {
        return range;
    }
    public Double getheight() {
        return height;
    }
    public String getType() {
        return type;
    }
    public Angle getPosition() {
        return position;
    }
    public String getDirection() {
        return direction;
    }
    public List<String> getDeviceCompatible() {
        return deviceCompatible;
    }
    public List<File> getFileList() {
        return files;
    }
    public int getcurrNumFiles() {
        return currNumFiles;
    }
    public int getdataSizeLimit() {
        return dataSizeLimit;
    }
    public List<String> getTransferFilesTo() {
        return transferFilesTo;
    }
    public int getSendByteLimit() {
        return sendByteLimit;
    }
    public int getReceiveByteLimit() {
        return receiveByteLimit;
    }
    public int getTransferNumLimit() {
        return transferNumLimit;
    }

    public int getnumFileLimit() {
        return numFileLimit;
    }

    public void setCurrNumFiles(int currNumFiles) {
        this.currNumFiles = currNumFiles;
    }

    public int getCurrDataSize() {
        return currDataSize;
    }

    public void setCurrDataSize(int currDataSize) {
        this.currDataSize = currDataSize;
    }

    public void setPosition(Angle position) {
        this.position = position;
    }

    public void setMovementSpeed(Double movementSpeed) {
        this.movementSpeed = movementSpeed;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public void setRange(Double range) {
        this.range = range;
    }

    public void setNumFileLimit(int numFileLimit) {
        this.numFileLimit = numFileLimit;
    }

    public void setDataSizeLimit(int dataSizeLimit) {
        this.dataSizeLimit = dataSizeLimit;
    }
    public void setTransferFilesTo(List<String> transferFilesTo) {
        this.transferFilesTo = transferFilesTo;
    }


    
}
