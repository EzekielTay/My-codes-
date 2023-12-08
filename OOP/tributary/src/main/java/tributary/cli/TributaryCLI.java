package tributary.cli;

import java.text.ParseException;
import java.util.Scanner;

import tributary.api.API;

public class TributaryCLI {

    private static String trimTuple(String tuple) {
        tuple = tuple.substring(1, tuple.length() - 1);
        // check for ending ")"
        if (tuple.endsWith(")")) {
            tuple = tuple.substring(0, tuple.length() - 1);
        }
        return tuple;
    }
    public static void main(String[] args) throws ParseException, InterruptedException {
        API api = new API();

        // Create a Scanner object to read input
        Scanner scanner = new Scanner(System.in);
        // Variable to store user input
        String userInput;

        while (true) {
            // Prompt the user for input
            System.out.print("Enter: ");

            // Read user input
            userInput = scanner.nextLine();
            String[] userInputList = userInput.split(" ");

            // create topic
            if (userInput.contains("create topic")) {
                String id = userInputList[2];
                String type = userInputList[3];
                api.createTopic(id, type);
            } else if (userInput.contains("create partition")) {
                String topic = userInputList[2];
                String id = userInputList[3];
                api.createPartition(topic, id);
            } else if (userInput.contains("create consumer group")) {
                String id = userInputList[3];
                String topic = userInputList[4];
                api.createConsumerGroup(id, topic);
            } else if (userInput.contains("create consumer")) {
                String group = userInputList[2];
                String id = userInputList[3];
                api.createConsumer(group, id);
            } else if (userInput.contains("delete consumer")) {
                String id = userInputList[2];
                api.deleteConsumer(id);
            } else if (userInput.contains("create producer")) {
                String id = userInputList[2];
                String type = userInputList[3];
                String allocation = userInputList[4];
                api.createProducer(id, type, allocation);
            } else if (userInput.contains("produce event")) {
                String producer = userInputList[2];
                String topic = userInputList[3];
                String event = userInputList[4];
                if (userInputList.length == 6) {
                    String partition = userInputList[5];
                    api.produceEvent(producer, topic, event, partition);
                } else {
                    api.produceEvent(producer, topic, event);
                }
            } else if (userInput.contains("consume events")) {
                String consumer = userInputList[2];
                String partition = userInputList[3];
                Integer numOfEvents = Integer.parseInt(userInputList[4]);
                api.consumeMultipleEvents(consumer, partition, numOfEvents);
            } else if (userInput.contains("consume event")) {
                String consumer = userInputList[2];
                String partition = userInputList[3];
                api.consumerEvent(consumer, partition);
            } else if (userInput.contains("show topic")) {
                String topic = userInputList[2];
                api.showTopic(topic);
            } else if (userInput.contains("show consumer group")) {
                String group = userInputList[3];
                api.showConsumerGroup(group);
            } else if (userInput.contains("assign partition")) {
                String group = userInputList[2];
                String partition = userInputList[3];
                api.assignPartition(group, partition);
            } else if (userInput.contains("parallel produce ")) {
                String toRemove = "parallel produce ";
                String targetString = userInput.substring(toRemove.length(), userInput.length());
                String[] tuples = targetString.split("\\s+(?![^()]*\\))");
                for (String string : tuples) {
                    string = trimTuple(string);
                    String[] produceEvent = string.split(", ");
                    String producer = produceEvent[0];
                    String topic = produceEvent[1];
                    String event = produceEvent[2];
                    if (produceEvent.length == 4) {
                        String partition = produceEvent[3];
                        api.produceEvent(producer, topic, event, partition);
                    } else {
                        api.produceEvent(producer, topic, event);
                    }
                }
            } else if (userInput.contains("parallel consume ")) {
                String toRemove = "parallel consume ";
                String targetString = userInput.substring(toRemove.length(), userInput.length());
                String[] tuples = targetString.split("\\s+(?![^()]*\\))");
                for (String string : tuples) {
                    string = trimTuple(string);
                    String[] produceEvent = string.split(", ");
                    String consumer = produceEvent[0];
                    String partition = produceEvent[1];
                    api.consumerEvent(consumer, partition);
                }
            } else if (userInput.equalsIgnoreCase("exit")) {
                System.out.println("Exiting the program.");
                // Close the scanner to avoid resource leaks
                scanner.close();
                // Exit the loop and end the program
                break;
            } else {
                System.out.println("Not a valid command");
            }
        }
    }
}
