package tributary.core.producer;

import tributary.core.tributary.Message;
import tributary.core.tributary.Partition;

public abstract class Producer<T> extends Thread {
    private String producerId;
    private String type;
    private String allocation;
    private Partition partitionAssigned;
    private Message<T> message;

    public Producer(String producerId, String messageType, String allocation) {
        this.producerId = producerId;
        this.type = messageType;
        this.allocation = allocation;
    }

    /**
     * Produce a synchronised event.
     */
    public void produceEvent() {
        Partition targetPartition = getPartitionAssigned();
        targetPartition.addMessage(message);
        System.out.printf("pushed eventId: %s into partition: %s\n", message.getId(), partitionAssigned.getId());
    }

    public void setEvent(Message<T> event) {
        this.message = event;
    }

    public Partition getPartitionAssigned() {
        return partitionAssigned;
    }

    public void setPartitionAssigned(Partition partitionAssigned) {
        this.partitionAssigned = partitionAssigned;
    }

    public String getProducerId() {
        return producerId;
    }

    public void run() {
        produceEvent();
    }

}
