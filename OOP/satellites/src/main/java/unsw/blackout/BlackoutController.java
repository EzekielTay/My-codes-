package unsw.blackout;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import unsw.device.HandheldDevice;
import unsw.device.LaptopDevice;
import unsw.blackout.FileTransferException.VirtualFileAlreadyExistsException;
import unsw.blackout.FileTransferException.VirtualFileNoBandwidthException;
import unsw.blackout.FileTransferException.VirtualFileNoStorageSpaceException;
import unsw.blackout.FileTransferException.VirtualFileNotFoundException;
import unsw.device.DesktopDevice;
import unsw.file.File;
import unsw.device.Device;
import unsw.response.models.EntityInfoResponse;
import unsw.response.models.FileInfoResponse;
import unsw.satellite.RelaySatellite;
import unsw.satellite.Satellite;
import unsw.satellite.StandardSatellite;
import unsw.satellite.TeleportingSatellite;
import unsw.utils.Angle;
import static unsw.utils.MathsHelper.RADIUS_OF_JUPITER;

/**
 * The controller for the Blackout system.
 *
 * WARNING: Do not move this file or modify any of the existing method
 * signatures
 */
public class BlackoutController {
    private List<Device> deviceList = new ArrayList<Device>();
    private List<Satellite> satelliteList = new ArrayList<Satellite>();
    private List<String[]> transferFilesList = new ArrayList<String[]>();

    public void createDevice(String deviceId, String type, Angle position) {
        Device newDevice;
        if (type == "HandheldDevice") {
            newDevice = new HandheldDevice(deviceId, type, position);
        } else if (type == "LaptopDevice") {
            newDevice = new LaptopDevice(deviceId, type, position);
        } else {
            // assume last option is desktop device
            newDevice = new DesktopDevice(deviceId, type, position);
        }
        deviceList.add(newDevice);
    }

    public void removeDevice(String deviceId) {
        for (Device device: deviceList) {
            if (device.getDeviceID().equals(deviceId)) {
                deviceList.remove(device);
                return;
            }
        }
    }

    public void createSatellite(String satelliteId, String type, double height, Angle position) {
        if (type == "StandardSatellite") {
            satelliteList.add(0, new StandardSatellite(satelliteId, type, height, position));
        } else if (type == "TeleportingSatellite") {
            satelliteList.add(0, new TeleportingSatellite(satelliteId, type, height, position));
        } else {
            // assume last option is Relay Satellite and append to end of list
            satelliteList.add(new RelaySatellite(satelliteId, type, height, position));
        }
    }

    public void removeSatellite(String satelliteId) {
        for (Satellite satellite: satelliteList) {
            if (satellite.getSatelliteId().equals(satelliteId)) {
                satelliteList.remove(satellite);
                return;
            }
        }
    }

    public List<String> listDeviceIds() {
        List<String> idList = new ArrayList<String>();
        for (Device device: deviceList) {
            idList.add(device.getDeviceID());
        }
        return idList;
    }

    public List<String> listSatelliteIds() {
        List<String> idList = new ArrayList<String>();
        for (Satellite satellite: satelliteList) {
            idList.add(satellite.getSatelliteId());
        }
        return idList;
    }

    public void addFileToDevice(String deviceId, String filename, String content) {
        File newfile = new File(filename, content, true);
        for (Device device: deviceList) {
            // append file to device's list of files if deviceID match
            if (device.getDeviceID().equals(deviceId)) {
                device.addFile(newfile);
            }
        }
    }

    public EntityInfoResponse getInfo(String id) {
        EntityInfoResponse newEntity = null;
        for (Device device: deviceList) {
            // create EntityInfoResponse for the Device
            if (device.getDeviceID().equals(id)) {
                return newEntity = device.createEntityInfoResponse();
            }
        }
        for (Satellite satellite: satelliteList) {
            // create EntityInfoResponse for the Device
            if (satellite.getSatelliteId().equals(id)) {
                return newEntity = satellite.createEntityInfoResponse();
            }
        }
        return newEntity;
    }

    public void simulate() {
        for (Satellite satellite: satelliteList) {
            satellite.changePosition();
        }

        Iterator<String[]> iterator = transferFilesList.iterator();
        while (iterator.hasNext()) {
            String[] element = iterator.next();
            String filename = element[0];
            String fromId = element[1];
            String toId = element[2];
            EntityInfoResponse sourceEntity = getInfo(fromId);
            EntityInfoResponse targetEntity = getInfo(toId);
            Object source = null;
            Object dest = null;
            // case 1: Device to Satellite
            // case 2: Satellite to Device
            // Case 3: Satellite to Satellite
            if (sourceEntity.getType().contains("Device")) {
                source = Device.returnTarget(deviceList, fromId);
                dest = Satellite.returnTarget(satelliteList, toId);
            } else if (sourceEntity.getType().contains("Satellite") && targetEntity.getType().contains("Device")) {
                source = Satellite.returnTarget(satelliteList, fromId);
                dest = Device.returnTarget(deviceList, toId);
            } else {
                source = Satellite.returnTarget(satelliteList, fromId);
                dest = Satellite.returnTarget(satelliteList, toId);
            }

            File sourceFile = null;
            File destFile = null;
            int sendByteSpeed = 0;
            int receiveByteSpeed = 0;
            // Find sourcefile
            if (source instanceof Device) {
                Device deviceSource = (Device) source;
                sourceFile = deviceSource.searchFile(filename);
            } else {
                Satellite satelliteSource = (Satellite) source;
                sourceFile = satelliteSource.
                searchFile(filename);
                sendByteSpeed = satelliteSource.calculateSendByteSpeed(deviceList, satelliteList);
            }
            // Find destfile
            if (dest instanceof Device) {
                Device deviceDest = (Device) dest;
                destFile = deviceDest.searchFile(filename);
            } else {
                Satellite satelliteDest = (Satellite) dest;
                destFile = satelliteDest.searchFile(filename);
                receiveByteSpeed = satelliteDest.calculateReceiveByteSpeed(satelliteList);
            }
            // Find the lower byte limit
            int lowerByteLimit = 0;
            if (sendByteSpeed == 0) {
                lowerByteLimit = receiveByteSpeed;
            } else if (receiveByteSpeed == 0) {
                lowerByteLimit = sendByteSpeed;
            } else {
                lowerByteLimit = Math.min(sendByteSpeed, receiveByteSpeed);
            }
            
            // Check in range
            Boolean inRangeFlag = false;
            if (source instanceof Device) {
                Device deviceSource = (Device) source;
                inRangeFlag = deviceSource.checkInRange(fromId, toId, deviceList, satelliteList);
            } else {
                Satellite satelliteSource = (Satellite) source;
                inRangeFlag = satelliteSource.checkInRange(fromId, toId, deviceList, satelliteList);
            }

            // Transfer still in range if true
            // else determine if moved out of range or teleported.
            if (inRangeFlag) {
                //If file is completed, remove from list of transferFilelist
                if (sourceFile.isCopyFileComplete(sourceFile, destFile, lowerByteLimit)) {
                    iterator.remove();
                }
            } else {
                // CONTINUE from here handle cases 3 - 5
            }

        }
    }

    /**
     * Simulate for the specified number of minutes. You shouldn't need to modify
     * this function.
     */
    public void simulate(int numberOfMinutes) {
        for (int i = 0; i < numberOfMinutes; i++) {
            simulate();
        }
    }

    public List<String> communicableEntitiesInRange(String id) throws Exception {
        List<String> entitiesInRangeList = new ArrayList<>();
        List<Device> dupeDeviceList = new ArrayList<>();
        List<Satellite> dupeSatelliteList = new ArrayList<>();
        Object targetEntity = null;
        // Clone list and search for target simultaneously
        for (Device device: deviceList) {
            if (device.getDeviceID().equals(id)) {
                targetEntity = device;
            } else {
                dupeDeviceList.add(device);
            }
        }
        for (Satellite satellite: satelliteList) {
            if (satellite.getSatelliteId().equals(id)) {
                targetEntity = satellite;
            } else {
                dupeSatelliteList.add(satellite);
            }
        }
        // Check devices in range with target entity
        if (targetEntity instanceof Device) {
            Device targetDevice = (Device) targetEntity;
            entitiesInRangeList.addAll(targetDevice.listEntitiesOfDevice(targetDevice, dupeDeviceList, dupeSatelliteList));
        } else if (targetEntity instanceof Satellite) {
            Satellite targetSatellite = (Satellite) targetEntity;
            entitiesInRangeList.addAll(targetSatellite.listEntitiesOfSatellite(targetSatellite, dupeDeviceList, dupeSatelliteList, targetEntity instanceof Device));
        } else {
            throw new Exception("Entity does not match any of the existing devices and satellites");
        }
        return entitiesInRangeList;
    }

    public void sendFile(String fileName, String fromId, String toId) throws FileTransferException {
        EntityInfoResponse source = getInfo(fromId);
        EntityInfoResponse target = getInfo(toId);
        Map<String, FileInfoResponse> sourceFiles = source.getFiles();
        Map<String, FileInfoResponse> targetFiles = target.getFiles();
        FileInfoResponse filetoTransfer = sourceFiles.get(fileName);
        // Check if file exists and is completed in the source Entity
        if (filetoTransfer == null) {
            throw new VirtualFileNotFoundException(fileName);
        }
        if (filetoTransfer.isFileComplete() == false) {
            throw new VirtualFileNotFoundException(fileName);
        }
        
        int sourceFileCount = 0;
        int destFileCount = 0;
        int sendByteLimit = 0;
        int receiveByteLimit = 0;
        File newFile = new File(fileName, "");
        newFile.setFileSize(filetoTransfer.getFileSize());
        // Determine number of instances of files sending from source and files sending to destination.
        for (String[] stringArray: transferFilesList) {
            if (stringArray[1].equals(fromId)) {
                sourceFileCount += 1;
            }
            if (stringArray[2].equals(toId)) {
                destFileCount += 1;
            }
        }

        // Get the send & receive byte limit respectively if applicable. If 0, means its a device & can ignore
        for (Satellite satellite: satelliteList) {
            if (satellite.getSatelliteId().equals(fromId)) {
                sendByteLimit = satellite.getSendByteLimit();
            }
            if (satellite.getSatelliteId().equals(toId)) {
                receiveByteLimit = satellite.getReceiveByteLimit();
            }
        }
    
        // Check if the source has enough bandwidth
        if (sendByteLimit != 0 ) {
            int sourceBandwidth = sendByteLimit / (sourceFileCount + 1);
            if (sourceBandwidth == 0) {
                throw new VirtualFileNoBandwidthException(fromId);
            }
        }
        
        // check if the destination has enough bandwidth
        if (receiveByteLimit != 0) {
            int destBandwidth = receiveByteLimit / (destFileCount + 1);
            if (destBandwidth == 0) {
                throw new VirtualFileNoBandwidthException(toId);
            }
        }

        // check if filename already exist in the source
        FileInfoResponse checkFile = targetFiles.get(fileName);
        if (checkFile != null) {
            throw new VirtualFileAlreadyExistsException(fileName);
        }

        // check if destination capacity is exceeded (files / Bytes)
        if (target.getType().contains("Satellite")) {
            Satellite destSatellite = Satellite.returnTarget(satelliteList, toId);
            if (destSatellite.getcurrNumFiles() == destSatellite.getnumFileLimit()) {
                throw new VirtualFileNoStorageSpaceException("Max Files Reached");
            }
            int newByteSize = destSatellite.getCurrDataSize() + filetoTransfer.getFileSize();
            if (newByteSize > destSatellite.getdataSizeLimit()) {
                throw new VirtualFileNoStorageSpaceException("Max Storage Reached");
            }
            destSatellite.addFile(newFile);
        } else {
            Device destDevice = Device.returnTarget(deviceList, toId);
            destDevice.addFile(newFile);
        }

        // append the transfer target Id to list of transfertoId of the source
        if (source.getType().contains("Device")) {
            Device sourceDevice = Device.returnTarget(deviceList, fromId);
            sourceDevice.addTransferToId(toId);
        } else {
            Satellite sourceSatellite = Satellite.returnTarget(satelliteList, fromId);
            sourceSatellite.addTransferToId(toId);
        }

        String[] fileInfo = {fileName, fromId, toId};
        transferFilesList.add(fileInfo);
    }

    public void createDevice(String deviceId, String type, Angle position, boolean isMoving) {
        createDevice(deviceId, type, position);
        // TODO: Task 3
    }

    public void createSlope(int startAngle, int endAngle, int gradient) {
        // TODO: Task 3
        // If you are not completing Task 3 you can leave this method blank :)
    }

    //To delete after testing
    public static void main(String[] args) throws Exception {
        // part a,b,c,d,e,f working
        BlackoutController controller = new BlackoutController();
        controller.createDevice("DeviceA", "HandheldDevice", Angle.fromDegrees(35));
        controller.createDevice("DeviceB", "LaptopDevice", Angle.fromDegrees(40));
        controller.createDevice("DeviceC", "DesktopDevice", Angle.fromDegrees(38));
        // System.out.println(controller.listDeviceIds());
        // controller.removeDevice("DeviceA");
        // controller.removeDevice("DeviceB");
        // System.out.println(controller.listDeviceIds());
        // controller.createSatellite("Satellite3", "RelaySatellite", 300 + RADIUS_OF_JUPITER, Angle.fromDegrees(30));
        controller.createSatellite("Satellite1", "StandardSatellite", 10000 + RADIUS_OF_JUPITER, Angle.fromDegrees(40));
        controller.createSatellite("Satellite2", "TeleportingSatellite", 10000 + RADIUS_OF_JUPITER, Angle.fromDegrees(110));
        // controller.createSatellite("Satellite4", "TeleportingSatellite", 100 + RADIUS_OF_JUPITER, Angle.fromDegrees(178));
        controller.createSatellite("RelaySatellite3", "RelaySatellite", 30000 + RADIUS_OF_JUPITER, Angle.fromDegrees(40));
        // System.out.println(controller.listSatelliteIds());
        // controller.simulate(5);
        // System.out.println(controller.communicableEntitiesInRange("DeviceA")); 
        // System.out.println(controller.communicableEntitiesInRange("DeviceB")); 
        // System.out.println(controller.communicableEntitiesInRange("DeviceC")); 
        // System.out.println(controller.communicableEntitiesInRange("Satellite1")); 
        System.out.println(controller.communicableEntitiesInRange("Satellite2")); 
    }
}
