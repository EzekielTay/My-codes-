package tributary.core.consumer;

import java.util.ArrayList;
import java.util.List;

import tributary.core.tributary.Message;
import tributary.core.tributary.Partition;

public class Consumer extends Thread {
    private List<Message<?>> messageList = new ArrayList<Message<?>>();
    private List<Partition> partionList = new ArrayList<Partition>();
    private String consumerId;
    private ConsumerGroup group;
    private Partition targetPartition;

    public Consumer(ConsumerGroup group, String consumerId) {
        this.consumerId = consumerId;
        this.group = group;
    }

    public void consumerEvent() {
        Message<?> consumeMessage = targetPartition.consumeEarliestEvent();
        messageList.add(consumeMessage);
        System.out.printf("%s consume eventId: %s from partition: %s of value: %s\n",
                consumerId, consumeMessage.getId(), targetPartition.getId(), consumeMessage.getValue());
    }

    public void showEvent() {
        for (Message<?> message : messageList) {
            System.out.println("\t\tEventId:" + message.getId() + ": " + message.getValue());
        }
    }

    public void assignPartition(Partition partition) {
        partionList.add(partition);
    }

    public void clearAssignment() {
        partionList = new ArrayList<Partition>();
    }

    public List<Message<?>> getMessageList() {
        return messageList;
    }

    public String getconsumerId() {
        return consumerId;
    }

    public List<Partition> getPartionList() {
        return partionList;
    }

    public ConsumerGroup getGroup() {
        return group;
    }

    public Partition getTargetPartition() {
        return targetPartition;
    }

    public void setTargetPartition(Partition targetPartition) {
        this.targetPartition = targetPartition;
    }

    public void run() {
        consumerEvent();
    }
}
