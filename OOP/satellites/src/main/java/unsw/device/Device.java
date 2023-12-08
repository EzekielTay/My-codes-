package unsw.device;

import unsw.file.File;
import unsw.response.models.EntityInfoResponse;
import unsw.response.models.FileInfoResponse;
import unsw.satellite.Satellite;
import unsw.utils.Angle;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import unsw.utils.MathsHelper;

import static unsw.utils.MathsHelper.RADIUS_OF_JUPITER;

public abstract class Device {
    private List<File> files = new ArrayList<File>();
    private String deviceID;
    private String type;
    private Angle position;
    private double range;
    private Double height;
    private List<String> transferFilesTo = new ArrayList<String>();

    /**
     * Constructor to create a device
     * @param deviceID
     * @param position
     * @param range
     */
    public Device(String deviceID, String type, Angle position, double range) {
        this.deviceID = deviceID;
        this.type = type;
        this.position = position;
        this.range = range;
        this.height = RADIUS_OF_JUPITER;
    }

     /**
     * Return a target device given a list and id.
     * @param deviceList
     * @param id
     * @return
     */
    public static Device returnTarget(List<Device> deviceList, String id) {
        Device targetDevice = null;
        for (Device device: deviceList) {
            if (device.getDeviceID().equals(id)) {
                targetDevice = device;
            }
        }
        return targetDevice;
    }

    /**
     * Return the desired EntityInfoResponse of an object
     * @return 
     */
    public EntityInfoResponse createEntityInfoResponse() {
        return new EntityInfoResponse(this.deviceID, this.position, this.height, this.type, createFileHash());
    }

    /**
     * Create a hashmap for the files of a device
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
     * Return a deepCopy of the existing device list
     * @param deviceList
     * @return
     */
    public static List<Device> duplicateList(List<Device> deviceList) {
        List<Device> newList = new ArrayList<>();
        for (Device device: deviceList) {
            newList.add(device);
        }
        return newList;
    }

    /**
     * Returns all Satellites in range of the device, inclusive of the effects of Relay satellite
     * @param device
     * @param dupeDeviceList
     * @param dupeSatelliteList
     * @return entitiesInRangeList
     */
    public List<String> listEntitiesOfDevice(Device device, List<Device> dupeDeviceList, List<Satellite> dupeSatelliteList) {
        List<String> entitiesInRangeList = new ArrayList<>();
        Iterator<Satellite> iterator = dupeSatelliteList.iterator();
        while (iterator.hasNext()) {
            Satellite satellite = iterator.next();
            // Safely remove the current satellite from the list
            if (appendSatelliteInRange(entitiesInRangeList, satellite)) {
                iterator.remove(); 
            }
            // Check all satellites in range of Relay satellite as well.
            if (satellite.getType().equals("RelaySatellite")) {
                entitiesInRangeList.addAll(satellite.listEntitiesOfSatellite(satellite, 
                    duplicateList(dupeDeviceList), Satellite.duplicateList(dupeSatelliteList), true));
            }
        }
        return entitiesInRangeList;
    }

    /**
     * Append satellite to list of entities in range in applicable and returns the new list of entities in range.
     * @param entitiesInRangeList
     * @param satellite
     * @return entitiesInRangeList
     */
    public boolean appendSatelliteInRange(List<String> entitiesInRangeList, Satellite satellite) {
        Double distance = MathsHelper.getDistance(satellite.getheight(), satellite.getPosition(), this.getPosition());
        if (distance <= this.getRange() && MathsHelper.isVisible(satellite.getheight(), 
            satellite.getPosition(), this.getPosition())) {
                if (!satellite.getType().equals("StandardSatellite") || !this.getType().equals("DesktopDevice")) {
                    entitiesInRangeList.add(satellite.getSatelliteId());
                    return true;
                }
        }
        return false;
    }

    /**
     * Check if transfer target still in range. If not, remove target from device transfer target list
     * @param fromId
     * @param toID
     * @param deviceList
     * @param satelliteList
     * @return boolean
     */
    public Boolean checkInRange(String fromId, String toID, List<Device> deviceList, List<Satellite> satelliteList) {
        Device device = returnTarget(deviceList, fromId);
        List<String> inRangeList = listEntitiesOfDevice(device, duplicateList(deviceList), Satellite.duplicateList(satelliteList));
        if (inRangeList.contains(toID)) {
            return true;
        }
        List<String> newList = device.getTransferFilesTo();
        newList.remove(toID);
        device.setTransferFilesTo(newList);
        return false;
    }

    /**
     * Add a file to the device's list of files
     * @param file
     */
    public void addFile(File file) {
        //Set file as complete
        this.files.add(file);
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
     * remove a file from the device's list of files
     * @param file
     */
    public void removeFile(File file) {
        this.files.remove(file);
    }

    /**
     * Add a file to the device's list of files
     * @param id
     */
    public void addTransferToId(String id) {
        this.transferFilesTo.add(id);
    }

    public String getDeviceID() {
        return deviceID;
    }

    public Angle getPosition() {
        return position;
    }

    public double getRange() {
        return range;
    }

    public List<File> getFiles() {
        return files;
    }

    public Double getHeight() {
        return height;
    }

    public String getType() {
        return type;
    }
    public List<String> getTransferFilesTo() {
        return transferFilesTo;
    }
    
    public void setTransferFilesTo(List<String> transferFilesTo) {
        this.transferFilesTo = transferFilesTo;
    }

    @Override
    public String toString() {
        return "Device [files=" + files + ", deviceID=" + deviceID + ", position=" + position + ", range=" + range
                + "]";
    }

    
}
