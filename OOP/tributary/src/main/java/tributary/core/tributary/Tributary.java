package tributary.core.tributary;

import java.util.ArrayList;
import java.util.List;

public class Tributary {
    private static Tributary instance;
    private List<Topic> topicList = new ArrayList<Topic>();

    private Tributary() {
    }

    public static Tributary getInstance() {
        if (instance == null) {
            instance = new Tributary();
        }
        return instance;
    }

    public void resetTributary() {
        topicList = new ArrayList<Topic>();
    }

    /**
     * Create a Topic
     * @param id
     * @param type
     */
    public void createTopic(String id, String type) {
        Topic topicNew = new Topic(id, type);
        topicList.add(topicNew);
        System.out.printf("created Topic: %s, of type: %s\n", id, type);
    }

    /**
     * Create a partition
     * @param topic
     * @param id
     */
    public void createPartition(String topic, String id) {
        Topic targetTopic = findTopic(topic);
        targetTopic.createPartition(id);
    }

    /**
     * Find a target Topic
     * @param topic
     * @return
     */
    public Topic findTopic(String topic) {
        Topic targetTopic = null;
        for (Topic target : topicList) {
            if (target.getId().equals(topic)) {
                targetTopic = target;
            }
        }
        return targetTopic;
    }

    public List<Topic> getTopicList() {
        return topicList;
    }

    public List<Partition> getPartitionList(String topicId) {
        Topic targetTopic = findTopic(topicId);
        return targetTopic.getPartitionList();
    }
}
