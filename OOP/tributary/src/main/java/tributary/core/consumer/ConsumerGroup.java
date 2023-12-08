package tributary.core.consumer;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import tributary.core.tributary.Partition;
import tributary.core.tributary.Topic;

public class ConsumerGroup {
    private List<Consumer> consumerList = new ArrayList<Consumer>();
    private String id;
    private Topic topicAssigned;

    public ConsumerGroup(String id, Topic topicAssigned) {
        this.id = id;
        this.topicAssigned = topicAssigned;
    }

    public void showConsumers() {
        System.out.println(id + ":");
        for (Consumer consumer : consumerList) {
            System.out.println("\t" + consumer.getconsumerId() + ":");
            consumer.showEvent();
        }
    }

    /**
     * add a consumer to group
     * @param id
     */
    public void addConsumer(Consumer consumer) {
        consumerList.add(consumer);
        clearAssignment();
        rebalance();
        System.out.printf("created consumer: %s\n", consumer.getconsumerId());
    }

    /**
     * Assign a partition to all consumer in group
     * @param partitionId
     */
    public void assignPartition(String partitionId) {
        Partition targetPartition = topicAssigned.findPartition(partitionId);
        for (Consumer consumer : consumerList) {
            consumer.assignPartition(targetPartition);
        }
    }

    /**
     * Delete a consumer
     * @param consumerId
     */
    public void deleteConsumer(String consumerId) {
        Iterator<Consumer> consumerIterator = consumerList.iterator();
        while (consumerIterator.hasNext()) {
            Consumer consumer = consumerIterator.next();
            if (consumer.getconsumerId().equals(consumerId)) {
                consumerIterator.remove();
            }
        }
        clearAssignment();
        rebalance();
    }

    public void clearAssignment() {
        for (Consumer consumer : consumerList) {
            consumer.clearAssignment();
        }
    }

    /**
     * Rebalance using round robin method
     */
    public void rebalance() {
        Iterator<Partition> partitionIterator = topicAssigned.getPartitionList().iterator();
        Integer index = 0;
        Integer max = consumerList.size();
        while (partitionIterator.hasNext() && max > 0) {
            if (index == max) {
                index = 0;
            }
            Partition partition = partitionIterator.next();
            Consumer consumer = consumerList.get(index);
            consumer.assignPartition(partition);
            index += 1;
        }
    }

    public List<Consumer> getConsumerList() {
        return consumerList;
    }

    public String getId() {
        return id;
    }
}
