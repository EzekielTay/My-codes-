package tributary.core.tributary;

public class Message<T> {
    private Header header;
    private String key;
    private T value;

    public Message(Header header, T value) {
        this.header = header;
        this.value = value;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    public T getValue() {
        return value;
    }

    public Integer getId() {
        return header.getId();
    }
}
