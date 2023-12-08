package tributary.core.tributary;

import java.util.ArrayList;
import java.util.List;

public class Partition {
    private List<Message<?>> messageList = new ArrayList<Message<?>>();
    private String id;

    public Partition(String id) {
        this.id = id;
    }

    public synchronized Message<?> consumeEarliestEvent() {
        Message<?> msgToRemove = messageList.get(0);
        messageList.remove(0);
        return msgToRemove;
    }

    public synchronized void addMessage(Message<?> message) {
        messageList.add(message);
    }

    public void showEvent() {
        for (Message<?> message : messageList) {
            System.out.println("\t\tEventId:" + message.getId() + ": " + message.getValue());
        }
    }

    public List<Message<?>> getMessageList() {
        return messageList;
    }

    public String getId() {
        return id;
    }

}
