package tributary;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.text.ParseException;

import org.junit.jupiter.api.Test;

import tributary.api.API;

public class TributaryTest {
    @Test
    public void createTopicAndPartitionAndProducerAndGroupAndConsumer() {
        API tri = new API();
        tri.resetTributary();
        assertEquals(0, tri.gettopicList().size());
        tri.createTopic("movie", "string");
        tri.createTopic("math", "Integer");
        assertEquals(2, tri.gettopicList().size());

        assertEquals(0, tri.getPartitionList("movie").size());
        tri.createPartition("movie", "starwars");
        tri.createPartition("movie", "httyd");
        assertEquals(2, tri.getPartitionList("movie").size());

        assertEquals(0, tri.getPartitionList("math").size());
        tri.createPartition("math", "vectors");
        tri.createPartition("math", "algebra");
        assertEquals(2, tri.getPartitionList("math").size());

        assertEquals(0, tri.getConsumerGroupList().size());
        tri.createConsumerGroup("family", "movie");
        tri.createConsumerGroup("genius", "math");
        assertEquals(2, tri.getConsumerGroupList().size());

        assertEquals(0, tri.getConsumerList("family").size());
        assertEquals(0, tri.getConsumerList().size());
        tri.createConsumer("family", "Ada");
        tri.createConsumer("family", "Ben");
        tri.createConsumer("family", "Cat");
        assertEquals(3, tri.getConsumerList("family").size());
        assertEquals(3, tri.getConsumerList().size());

        tri.deleteConsumer("Ada");
        assertEquals(2, tri.getConsumerList("family").size());
        assertEquals(2, tri.getConsumerList().size());

        assertEquals(0, tri.getProducerList().size());
        tri.createProducer("LucasFilm", "String", "manual");
        assertEquals(1, tri.getProducerList().size());

        assertEquals(1, tri.getProducerList().size());
        tri.createProducer("Calculus", "Integer", "random");
        assertEquals(2, tri.getProducerList().size());
    }

    @Test
    public void produceManualIntegerEvent() throws ParseException, InterruptedException {
        API tri = new API();
        tri.resetTributary();
        assertEquals(0, tri.gettopicList().size());
        tri.createTopic("math", "Integer");
        assertEquals(1, tri.gettopicList().size());

        assertEquals(0, tri.getPartitionList("math").size());
        tri.createPartition("math", "differentiation");
        tri.createPartition("math", "integration");
        assertEquals(2, tri.getPartitionList("math").size());

        assertEquals(0, tri.getProducerList().size());
        tri.createProducer("Calculus", "Integer", "manual");
        assertEquals(1, tri.getProducerList().size());

        Thread eventOne = tri.produceEvent("Calculus", "math", "mathOne.json", "integration");
        eventOne.join();
        assertEquals(1, tri.getPartitionMessages("integration").size());
        tri.showTopic("math");
    }

    @Test
    public void produceManualStringEvent() throws ParseException, InterruptedException {
        API tri = new API();
        tri.resetTributary();
        assertEquals(0, tri.gettopicList().size());
        tri.createTopic("movie", "string");
        assertEquals(1, tri.gettopicList().size());

        assertEquals(0, tri.getPartitionList("movie").size());
        tri.createPartition("movie", "starwars");
        assertEquals(1, tri.getPartitionList("movie").size());

        assertEquals(0, tri.getProducerList().size());
        tri.createProducer("LucasFilm", "String", "manual");
        assertEquals(1, tri.getProducerList().size());

        Thread eventOne = tri.produceEvent("LucasFilm", "movie", "starWarsAdmiral.json", "starwars");
        Thread eventTwo = tri.produceEvent("LucasFilm", "movie", "starWarsIntro.json", "starwars");
        Thread eventThree = tri.produceEvent("LucasFilm", "movie", "starWarsYoda.json", "starwars");
        eventOne.join();
        eventTwo.join();
        eventThree.join();
        assertEquals(3, tri.getPartitionMessages("starwars").size());
    }

    @Test
    public void produceRandomStringEvent() throws ParseException, InterruptedException {
        API tri = new API();
        tri.resetTributary();
        assertEquals(0, tri.gettopicList().size());
        tri.createTopic("movie", "string");
        assertEquals(1, tri.gettopicList().size());

        assertEquals(0, tri.getPartitionList("movie").size());
        tri.createPartition("movie", "starwars");
        tri.createPartition("movie", "httyd");
        assertEquals(2, tri.getPartitionList("movie").size());

        assertEquals(0, tri.getProducerList().size());
        tri.createProducer("LucasFilm", "String", "random");
        assertEquals(1, tri.getProducerList().size());

        Thread eventOne = tri.produceEvent("LucasFilm", "movie", "starWarsAdmiral.json");
        Thread eventTwo = tri.produceEvent("LucasFilm", "movie", "starWarsIntro.json");
        Thread eventThree = tri.produceEvent("LucasFilm", "movie", "starWarsYoda.json");
        eventOne.join();
        eventTwo.join();
        eventThree.join();
        tri.showTopic("movie");
    }

    @Test
    public void showConsumersAndTopics() throws ParseException, InterruptedException {
        API tri = new API();
        tri.resetTributary();

        assertEquals(0, tri.gettopicList().size());
        tri.createTopic("movie", "string");
        assertEquals(1, tri.gettopicList().size());

        assertEquals(0, tri.getPartitionList("movie").size());
        tri.createPartition("movie", "starwars");
        assertEquals(1, tri.getPartitionList("movie").size());

        assertEquals(0, tri.getConsumerGroupList().size());
        tri.createConsumerGroup("family", "movie");
        assertEquals(1, tri.getConsumerGroupList().size());

        assertEquals(0, tri.getConsumerList("family").size());
        assertEquals(0, tri.getConsumerList().size());
        tri.createConsumer("family", "Ada");
        tri.createConsumer("family", "Ben");
        assertEquals(2, tri.getConsumerList("family").size());
        assertEquals(2, tri.getConsumerList().size());

        assertEquals(0, tri.getProducerList().size());
        tri.createProducer("LucasFilm", "String", "manual");
        assertEquals(1, tri.getProducerList().size());

        Thread eventOne = tri.produceEvent("LucasFilm", "movie", "starWarsAdmiral.json", "starwars");
        Thread eventTwo = tri.produceEvent("LucasFilm", "movie", "starWarsYoda.json", "starwars");
        eventOne.join();
        eventTwo.join();
        // Threads already joined in consumeMultipleEvents
        tri.consumeMultipleEvents("Ada", "starwars", 2);
        assertEquals(2, tri.getConsumerMessages("Ada").size());
        assertEquals(0, tri.getPartitionMessages("starwars").size());
        tri.showTopic("movie");
        tri.showConsumerGroup("family");
    }

    @Test
    public void parallelProduceAndConsume() throws ParseException, InterruptedException {
        API tri = new API();
        tri.resetTributary();

        assertEquals(0, tri.gettopicList().size());
        tri.createTopic("movie", "string");
        assertEquals(1, tri.gettopicList().size());

        assertEquals(0, tri.getPartitionList("movie").size());
        tri.createPartition("movie", "lotr");
        assertEquals(1, tri.getPartitionList("movie").size());

        assertEquals(0, tri.getConsumerGroupList().size());
        tri.createConsumerGroup("family", "movie");
        assertEquals(1, tri.getConsumerGroupList().size());

        assertEquals(0, tri.getConsumerList("family").size());
        assertEquals(0, tri.getConsumerList().size());
        tri.createConsumer("family", "Ada");
        tri.createConsumer("family", "Ben");
        tri.createConsumer("family", "Cat");
        assertEquals(3, tri.getConsumerList("family").size());
        assertEquals(3, tri.getConsumerList().size());

        assertEquals(0, tri.getProducerList().size());
        tri.createProducer("NewLineCinema", "String", "manual");
        assertEquals(1, tri.getProducerList().size());

        // parallet produce
        Thread eventOne = tri.produceEvent("NewLineCinema", "movie", "lotrFrodo.json", "lotr");
        Thread eventTwo = tri.produceEvent("NewLineCinema", "movie", "lotrSam.json", "lotr");
        Thread eventThree = tri.produceEvent("NewLineCinema", "movie", "lotrGandalf.json", "lotr");
        Thread eventFour = tri.produceEvent("NewLineCinema", "movie", "lotrLegolas.json", "lotr");
        Thread eventFive = tri.produceEvent("NewLineCinema", "movie", "lotrAragorn.json", "lotr");
        Thread eventSix = tri.produceEvent("NewLineCinema", "movie", "lotrGimli.json", "lotr");
        eventOne.join();
        eventTwo.join();
        eventThree.join();
        eventFour.join();
        eventFive.join();
        eventSix.join();
        assertEquals(6, tri.getPartitionMessages("lotr").size());
        // assign all consumers in group to consume from that partition.
        tri.assignPartition("family", "lotr");
        Thread consumeOne = tri.consumerEvent("Ada", "lotr");
        Thread consumeTwo = tri.consumerEvent("Ben", "lotr");
        Thread consumeThree = tri.consumerEvent("Cat", "lotr");
        Thread consumeFour = tri.consumerEvent("Ada", "lotr");
        Thread consumeFive = tri.consumerEvent("Ben", "lotr");
        Thread consumeSix = tri.consumerEvent("Cat", "lotr");
        consumeOne.join();
        consumeTwo.join();
        consumeThree.join();
        consumeFour.join();
        consumeFive.join();
        consumeSix.join();
        tri.showConsumerGroup("family");
    }
}
