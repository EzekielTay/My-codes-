package unsw.file;

public class File {
    private String filename;
    private String data;
    private int fileSize;
    private boolean isFileComplete;
    
    /**
     * Creates a file
     * @param filename
     * @param data
     * @param fileSize
     */
    public File(String filename, String data) {
        this.filename = filename;
        this.data = data;
        this.fileSize = data.length();
        this.isFileComplete = false;
    }

    public File(String filename, String data, Boolean isComplete) {
        this.filename = filename;
        this.data = data;
        this.fileSize = data.length();
        this.isFileComplete = isComplete;
    }

    public String getFilename() {
        return filename;
    }
    public String getData() {
        return data;
    }
    public int getFileSize() {
        return fileSize;
    }
    public boolean isFileComplete() {
        return isFileComplete;
    }
    
    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }

    public void setData(String data) {
        this.data = data;
    }

    public void setFileComplete(boolean isFileComplete) {
        this.isFileComplete = isFileComplete;
    }

    /**
     * Ordinary Copy bytes from source file to destination file
     * @param source
     * @param dest
     * @param byteLimit
     * @return Returns true if data transfer is complete. False otherwise
     */
    public boolean isCopyFileComplete(File source, File dest, int byteLimit) {
        int copyIndex = dest.getData().length();
        int count = 0;
        String addString = "";
        while (count < byteLimit && copyIndex < source.getFileSize()) {
            addString += source.getData().charAt(copyIndex);
            count += 1;
            copyIndex += 1;
        }
        dest.setData(dest.getData() + addString);
        
        // Set file as completed if transfer is complete and return true
        if (copyIndex == source.getFileSize()) {
            dest.setFileComplete(true);
            return true;
        }
        return false;
    }
}
