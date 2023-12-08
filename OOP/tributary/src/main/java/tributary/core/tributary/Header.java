package tributary.core.tributary;

import java.util.Date;

public class Header {
    private Date createdDate;
    private Integer id;
    private String type;

    public Header(Date createdDate, Integer id, String type) {
        this.createdDate = createdDate;
        this.id = id;
        this.type = type;
    }

    public Integer getId() {
        return id;
    }
}
