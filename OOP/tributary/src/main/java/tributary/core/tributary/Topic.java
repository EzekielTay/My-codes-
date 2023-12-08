package tributary.core.tributary;

import java.util.ArrayList;
import java.util.List;

public class Topic {
    private List<Partition> partitionList = new ArrayList<Partition>();
    private String id;
    private String type;

    public Topic(String id, String type) {
        this.id = id;
        this.type = type;
    }

    /**
     * Create a Partition
     * @param id
     */
    public void createPartition(String id) {
        Partition partitionNew = new Partition(id);
        partitionList.add(partitionNew);
        System.out.printf("created Partition: %s\n", id);
    }

    /**
     * Find a target partition
     * @param partitionId
     * @return
     */
    public Partition findPartition(String partitionId) {
        for (Partition partition : partitionList) {
            if (partition.getId().equals(partitionId)) {
                return partition;
            }
        }
        return null;
    }

    public void showTopic() {
        System.out.println(id + ":");
        for (Partition partition : partitionList) {
            System.out.println("\t" + partition.getId() + ":");
            partition.showEvent();
        }
    }

    public List<Partition> getPartitionList() {
        return partitionList;
    }

    public String getId() {
        return id;
    }
}
