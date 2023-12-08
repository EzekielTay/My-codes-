21/9/2023
- Read assignment specs.
- Developed a rough design for lists and Devices
- Device superclass with subclasses: Handheld, laptop & desktop
- Satellite superclass with subclasses: standard, teleport, relay
- files superclass

Moreover, since both satellite & device supervlass will not be instantiazed on their own, use an abstract class.

22/9/2023 (Attributes planning)
- Device use normal class (same behaviour) attributes:
    String deviceID
    String type (Handheld, laptop or Desktop)
    Double range
    Double height
    Angle position
    List<FILE> files
    moving speed (potentially for part 3)

- Satellite use abstract class (slightly different behaviour in that of uploading file speed etc.)
    String satelliteId
    String type (Standard, teleporting or relay)
    Double movementSpeed
    Double range
    Double height
    Angle position
    String direction
    list of string of supported devices- need methods to check compatible devices
    list of <Files>
    int numOfFile - need methods to check limit
    int content  - need methods to check limit
    int sendByteLimit 
    int receiveByteLimit
    int transferNumLimit (limit to number of file transfer concurrently)

- Files use a normal class (same behaviour)
    String filename;
    String data;
    int filesize;
    boolean isFileComplete;


Tasks design logic:
1a: Depending on type of device, call the specific device constructor. Append the new device to list of devices
1b: Traverse through list of devices and remove the device with a matching deviceID.
1c: Depending on type of satellite, call the specific satellite constructor. Append the new satellite to list of satellites
1d: Traverse through list of satellites and remove the satellite with a matching satelliteID.
1e: Traverse through list of devices and return the deviceID of all current devices.
1f: Traverse through list of satellites and return the satelliteID of all current satellites.

1g: Create a file using the constructor. 
    Traverse the list of devices to find a matching deviceID
    Call a method to append the new file to the device's list of files.

1h: Given a device/satellite Id,
    find all files the device/satellite contains and create the FileinfoResponse for each of them.
    Map the FileInfoResponse to the filename.
    Create an entity response with the newly mapped fileinforesponse

2a: Code the program for a simulation per minute
    Need to calculate the new position of satellites & (Handheld device part 3) per minute. Consider:
    - angle
    - height
    - angular velocity (calculate from linear speed)
    
    Calculations design:
    changePosition():
    - convert linear speed to angular velocity. 
    - calculate the arc distance (s) travelled during the span of time.
    - Find the change in angle using theta = s / height of satellite

    setAngle();
    - Set the new angle the satellite is at.

    adjustSatellite() - Check if the new angle of the satellite falls within the limitations of the teleporting and Relay satellite.
        - for teleporting satellite, When the position of the satellite reaches θ = 180, the satellite teleports to θ = 0 and changes       direction. Need an additional method checkAdjustment() to determine if special behaviour i triggered
        
2b: List all devices & Satellites in range of an entity given its id. (Version one)
    - Create a set of Strings
    - Create duplicate list of devices and Satellites.
    - methods: appendDeviceInRange(id, DupeListSatellite, DupeListDevice) which returns a set of stringID in range of entity.
    - Loop through all devices, then satellites to search for target entity. Remove target from duplicated list when found.
    - Once acquired target, Loop through remaining devices & then satellites and add the deviceId/satelliteId to set if in range of entity.
      also remove the object from the respective duplicated list when id is added to the list of devices/satellites in range.
        - if the added object is a relay satellite, recursively call appendDeviceInRange(id, DupeListSatellite, DupeListDevice)
          where the list parameters contain the remaining satellites.
        - append the return string set to the existing string set.
    - return the desired string set.

    improved algorithm (Version two) improve efficiency:
    - Devices are checked before satellites
    - List of satellites always append relay satellites to the end. Ensures that relay satellites are last to be checked
    - Eliminates double checking of the same device/satellite when method is recursively called.

2b revised (Final version):
    Start by creating duplicated lists for DeviceList and SatelliteList & finding target entity simultaneously.
    if target is device:
        Only search for satellites in range (include effects of relay satellite)
        Loop through dupe list of Satellites and append the SatellitedId of the ones in range. Remove Satellite from dupe Satellite list once appended to the desired list of strings.
        if the satellite added is a relay satellite:
            feed it a deepcopy of the remaining lists to check for Satellites in range of the relay

    else (target is Satellite):
        Search for both Devices and Satellites in range. 
        Loop through dupe list of Satellites & devices and append the Id of the ones in range. Remove the entity from the respective dupe list once appended to the desired list of strings.
        if the satellite added is a relay satellite:
            feed it a deepcopy of the remaining lists to check for Satellites in range of the relay.

    Reflection: Planning is really important and is very helpful to pen down all the requirements during the planning stage. Initially, I forgot some parts of the specifications which rendered my initial designs useless, since my code logic was being planned for an incorrect behaviour. It was very satisfying to think of ways to make my code more efficient, eg checking for relay satellites lasts, and also using a constantly updated lists for Satellites and devices. This way, I can avoid double-checking and lower my code run-time.
    
