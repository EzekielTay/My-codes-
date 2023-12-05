class Group:
    def __init__(self, group_name, creator):
        self.name = group_name
        self.members = []
        self.message_count = 0
        self.add_members(creator)

    # Getter for 'name' attribute
    def get_name(self):
        return self.name

    # Setter for 'name' attribute
    def set_name(self, name):
        self.name = name

    # Getter for 'members' attribute
    def get_members(self):
        return self.members

    # Getter for message count
    def get_message_count(self):
        return self.message_count
    
    # increase message count by one
    def inc_message_count(self):
        self.message_count += 1
        
    # Setter for 'members' attribute
    def add_members(self, member):
        self.members.append(member)
        
    # create string
    # def create_string(self):
    #     print(f"Group chat room has been created, room name: {self.name}, users in this room:")
    #     for username in self.members:
    #         print(username)
    
    # join group string
    def join_group_string(self):
        print(f"Join group chat room successfully, room name: {self.name}, users in this room:")
        for username in self.members:
            print(username)