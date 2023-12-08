package tributary.core.producer;

import java.util.Random;

import tributary.core.tributary.Topic;

public class RandomProducer extends Producer {
    private Random random = new Random(System.currentTimeMillis());

    public RandomProducer(String id, String messageType, String allocation) {
        super(id, messageType, allocation);
    }

    /**
     * Allocate partition randomly
     */
    public void allocateRandomPartition(Topic topic) {
        Integer size = topic.getPartitionList().size();
        int index = random.nextInt(size);
        setPartitionAssigned(topic.getPartitionList().get(index));
    }
}
