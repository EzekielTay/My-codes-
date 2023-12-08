package tributary.api;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.json.JSONObject;

import tributary.cli.TributaryCLI;
import tributary.core.consumer.Consumer;
import tributary.core.consumer.ConsumerGroup;
import tributary.core.producer.ManualProducer;
import tributary.core.producer.Producer;
import tributary.core.producer.RandomProducer;
import tributary.core.tributary.Header;
import tributary.core.tributary.Message;
import tributary.core.tributary.Partition;
import tributary.core.tributary.Topic;
import tributary.core.tributary.Tributary;

public class API {
    private Tributary tributary;
    private List<Producer> producerList = new ArrayList<Producer>();
    private List<ConsumerGroup> consumerGroupList = new ArrayList<ConsumerGroup>();
    private List<Consumer> consumerList = new ArrayList<Consumer>();

    public API() {
        tributary = Tributary.getInstance();
    }

    /**
     * reset the singleton tributary
     */
    public void resetTributary() {
        tributary.resetTributary();
    }

    /**
     * create a topic
     * @param id
     * @param type
     */
    public void createTopic(String id, String type) {
        tributary.createTopic(id, type);
    }

    /**
     * Create a partition
     * @param topic
     * @param id
     */
    public void createPartition(String topic, String id) {
        tributary.createPartition(topic, id);
    }

    /**
     * Create a consumer group
     * @param id
     * @param topic
     */
    public void createConsumerGroup(String id, String topic) {
        Topic targetTopic = tributary.findTopic(topic);
        ConsumerGroup consumerGroupNew = new ConsumerGroup(id, targetTopic);
        consumerGroupList.add(consumerGroupNew);
        System.out.printf("created consumer group: %s\n", id);
    }

    /**
     * create a consumer
     */
    public void createConsumer(String groupId, String id) {
        ConsumerGroup group = findGroup(groupId);
        Consumer consumerNew = new Consumer(group, id);
        consumerList.add(consumerNew);
        group.addConsumer(consumerNew);
    }

    /**
     * Assign a partition to all consumers in a group
     * @param groupId
     * @param partitionId
     */
    public void assignPartition(String groupId, String partitionId) {
        ConsumerGroup group = findGroup(groupId);
        group.assignPartition(partitionId);
        System.out.printf("All consumers in %s consumer group are assigned partition: %s\n", groupId, partitionId);
    }

    /**
     * Delete a consumer
     * @param consumerId
     */
    public void deleteConsumer(String consumerId) {
        Iterator<Consumer> consumerIterator = consumerList.iterator();
        ConsumerGroup targetGroup = null;
        while (consumerIterator.hasNext()) {
            Consumer consumer = consumerIterator.next();
            if (consumer.getconsumerId().equals(consumerId)) {
                targetGroup = consumer.getGroup();
                targetGroup.deleteConsumer(consumerId);
                consumerIterator.remove();
            }
        }
        System.out.printf("deleted consumer: %s, from consumer group: %s\n", consumerId, targetGroup.getId());
    }

    /**
     * create a producer
     * @param id
     * @param type
     * @param allocation
     */
    public void createProducer(String id, String type, String allocation) {
        Producer<?> producerNew = null;
        if (allocation.equals("manual")) {
            producerNew = new ManualProducer(id, type, allocation);
        } else if (allocation.equals("random")) {
            producerNew = new RandomProducer(id, type, allocation);
        }
        producerList.add(producerNew);
        System.out.printf("created %s producer: %s, of event type: %s\n", allocation, id, type);
    }

    /**
     * Produce event for manual producers
     * @param <T>
     * @param producerId
     * @param topicIdString
     * @param partitionId
     * @throws ParseException
     * @throws InterruptedException
     */
    public <T> Thread produceEvent(String producerId, String topicIdString,
                            String filename, String partitionId) throws ParseException, InterruptedException {
        Message<T> event = loadEvent(filename);
        // set key of message
        event.setKey(partitionId);
        ManualProducer targetProducer = (ManualProducer) findProducer(producerId);
        targetProducer.setEvent(event);
        Topic targetTopic = tributary.findTopic(topicIdString);
        // Set partition for manual producers
        Partition targePartition = targetTopic.findPartition(partitionId);
        targetProducer.setPartitionAssigned(targePartition);
        // Create a thread for each event
        // System.out.println(targetProducer.toString());
        Thread producer = new Thread(targetProducer);
        producer.start();
        return producer;
    }

    /**
     * Produce event for random producers
     * @param <T>
     * @param producerId
     * @param topicIdString
     * @throws InterruptedException
     */
    public <T> Thread produceEvent(String producerId, String topicIdString, String filename)
                            throws ParseException, InterruptedException {
        Message<T> event = loadEvent(filename);
        RandomProducer targetProducer = (RandomProducer) findProducer(producerId);
        targetProducer.setEvent(event);
        Topic targetTopic = tributary.findTopic(topicIdString);

        // Set partition for manual producers
        targetProducer.allocateRandomPartition(targetTopic);
        // Create a thread for each event
        // System.out.println(targetProducer.toString());

        Thread producer = new Thread(targetProducer);
        producer.start();
        return producer;
    }

    /**
     * create a consume event
     * @param consumerId
     * @param partitionId
     * @throws InterruptedException
     */
    public Thread consumerEvent(String consumerId, String partitionId) throws InterruptedException {
        Thread consumer = null;
        Partition targetPartition = findPartition(partitionId);
        Consumer targetConsumer = findConsumer(consumerId);
        if (targetConsumer.getPartionList().contains(targetPartition)) {
            // Create thread for each consumer event
            targetConsumer.setTargetPartition(targetPartition);
            consumer = new Thread(targetConsumer);
            consumer.start();
        }
        return consumer;
    }

    /**
     * Consume multiple events
     * @param consumerId
     * @param partitionId
     * @param num
     * @throws InterruptedException
     */
    public List<Thread> consumeMultipleEvents(String consumerId, String partitionId, Integer num)
        throws InterruptedException {
        List<Thread> threadList = new ArrayList<Thread>();
        for (Integer i = 0; i < num; i++) {
            Thread consumer = consumerEvent(consumerId, partitionId);
            threadList.add(consumer);
        }
        for (Thread thread : threadList) {
            thread.join();
        }
        return threadList;
    }

    /**
     * Display all info of Topic
     * @param topicId
     */
    public void showTopic(String topicId) {
        Topic targetTopic = tributary.findTopic(topicId);
        targetTopic.showTopic();
    }

    /**
     * Display all info of the consumer group
     * @param groupId
     */
    public void showConsumerGroup(String groupId) {
        ConsumerGroup group = findGroup(groupId);
        group.showConsumers();
    }

    public ConsumerGroup findGroup(String groupId) {
        ConsumerGroup targetGroup = null;
        for (ConsumerGroup group : consumerGroupList) {
            if (group.getId().equals(groupId)) {
                targetGroup = group;
            }
        }
        return targetGroup;
    }

    public Producer findProducer(String producerId) {
        Producer targetProducer = null;
        for (Producer producer : producerList) {
            if (producer.getProducerId().equals(producerId)) {
                targetProducer = producer;
            }
        }
        return targetProducer;
    }

    public Consumer findConsumer(String consumerId) {
        Consumer targetConsumer = null;
        for (Consumer consumer : consumerList) {
            if (consumer.getconsumerId().equals(consumerId)) {
                targetConsumer = consumer;
            }
        }
        return targetConsumer;
    }

    public Partition findPartition(String partitionId) {
        Partition returnPartition = null;
        for (Topic topic : tributary.getTopicList()) {
            Partition targetPartition = topic.findPartition(partitionId);
            if (targetPartition != null) {
                returnPartition = targetPartition;
            }
        }
        return returnPartition;
    }

    public List<Producer> getProducerList() {
        return producerList;
    }

    public List<ConsumerGroup> getConsumerGroupList() {
        return consumerGroupList;
    }

    public List<Consumer> getConsumerList() {
        return consumerList;
    }

    public List<Topic> gettopicList() {
        return tributary.getTopicList();
    }

    public List<Partition> getPartitionList(String topicId) {
        return tributary.getPartitionList(topicId);
    }

    public List<Consumer> getConsumerList(String groupId) {
        ConsumerGroup group = findGroup(groupId);
        return group.getConsumerList();
    }

    public List<Message<?>> getPartitionMessages(String partitionId) {
        Partition targePartition = findPartition(partitionId);
        return targePartition.getMessageList();
    }

    public List<Message<?>> getConsumerMessages(String consumerId) {
        Consumer targetConsumer = findConsumer(consumerId);
        return targetConsumer.getMessageList();
    }

    /**
     * Process a event in the form of a json file
     * @param <T>
     * @param filename
     * @return
     * @throws ParseException
     */
    public <T> Message<T> loadEvent(String filename) throws ParseException {
        try {
            String newFileName = "/" + filename;
            String fileContent = new String(TributaryCLI.class.getResourceAsStream(newFileName).readAllBytes());
            // Convert the file content to a JSON string
            JSONObject jsonObject = new JSONObject(fileContent);
            String dateString = jsonObject.getString("date");
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = inputFormat.parse(dateString);
            Integer id = jsonObject.getInt("id");
            String type = jsonObject.getString("type");
            T value = (T) jsonObject.get("value");
            Header messageHeader = new Header(date, id, type);
            Message<T> message = new Message<T>(messageHeader, value);
            return message;
        } catch (IOException e) {
            // Handle exceptions, e.g., file not found or unable to read
            e.printStackTrace();
        }
        return null;
    }
}
