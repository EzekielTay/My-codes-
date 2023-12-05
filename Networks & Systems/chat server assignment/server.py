import json
import os
from sys import *
from socket import *
from datetime import *
from threading import Thread
from typing import List
from user import User
from group import Group
import logger
import logging

# main program starts
HOST = "127.0.0.1"
LOGIN = "login"
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "credentials.txt")
USER_LOG_FILE = os.path.join(os.path.dirname(__file__), "user.txt")
user_list = []
active_user_list = []
group_list = []
message_log_num = 1

def receive_msg_func(client_socket):
    data = client_socket.recv(1024)
    return data.decode()

def send_msg_func(message, client_socket):
    print('[send] ' + message)
    client_socket.send(message.encode())

def get_message_log_num():
    return message_log_num    
    
def inc_message_log_num():
    global message_log_num
    message_log_num += 1

def get_active_user_list():
    return active_user_list

def get_user_list():
    return user_list

def get_group_list():
    return group_list

def get_max_attempt():
    return attempt_count

# def get_seq_num():
#     return user_sequence_num
    
"""
    Define multi-thread class for client
    This class would be used to define the instance for each connection from each client
    For example, client-1 makes a connection request to the server, the server will call
    class (ClientThread) to define a thread for client-1, and when client-2 make a connection
    request to the server, the server will call class (ClientThread) again and create a thread
    for client-2. Each client will be runing in a separate therad, which is the multi-threading
"""

class ClientThread(Thread):
    def __init__(self, client_address, client_socket):
        Thread.__init__(self)
        self.client_address = client_address
        self.client_socket = client_socket
        self.clientAlive = True
        self.user = User("","", 0)
        print("===== New connection created for: ", client_address)
        
    def run(self):
        while self.clientAlive:
            data = self.client_socket.recv(1024)
            receive_message: str = data.decode()
            # use recv() to receive message from the client
            # if the message from client is empty, the client would be off-line then set the client as offline (alive=Flase)
            if self.user.get_username() != "" and not receive_message.startswith("/p2pvideo"):
                print(f"[Recv] {self.user.get_username()} issued: {receive_message}")
            if receive_message == "login" and self.user.get_username() == "":
                print("[recv] New login request")
                send_message = 'Please login'
                print('[send] ' + send_message)
                self.client_socket.send(send_message.encode())
                self.process_login(get_user_list(), get_active_user_list())
            # handle message from the client
            elif receive_message == "/activeuser":
                send_message = active_user_cmd(self.user.get_username(), get_user_list())
                self.client_socket.send(send_message.encode())
            elif receive_message == "/logout":
                process_logout(self.user.get_username(), get_user_list(), get_active_user_list())
                send_message = f"Bye, {self.user.get_username()}!"
                self.client_socket.send(send_message.encode())
                self.clientAlive = False
                print("===== the user disconnected - ")
                break
            elif receive_message.startswith("/msgto"):
                private_text(self.client_socket, receive_message, get_user_list(), self.user.get_username(), get_message_log_num())
            elif receive_message.startswith("/creategroup"):
                create_group(self.client_socket, receive_message, get_group_list(), get_active_user_list(), self.user.get_username())
            elif receive_message.startswith("/joingroup"):
                join_group(self.client_socket, receive_message, get_group_list(), self.user.get_username())
            elif receive_message.startswith("/groupmsg"):
                msg_group(self.client_socket, receive_message, get_group_list(), self.user.get_username())
            elif receive_message.startswith("/p2pvideo"):
                initialise_p2p_video(self.client_socket, self.user, receive_message, get_user_list())
            else:
                print("[recv] " + receive_message)
                print("[send] Cannot understand this message")
                message = 'Cannot understand this message'
                self.client_socket.send(message.encode())
                    
    # Login process
    def process_login(self, user_list: List[User], active_user_list: List[User]):
        user = User(None, None, attempt_count)
        # check for valid useranme
        while user.get_username() == None:
            receive_message = receive_msg_func(self.client_socket)
            user = find_user(user, receive_message, user_list)
            if (user.get_username() != None):
                send_message = "valid username"
                print('[send] ' + send_message)
                self.client_socket.send(send_message.encode())
            else:
                send_message = 'Invalid username, Please try again'
                print('[send] ' + send_message)
                self.client_socket.send(send_message.encode()) 
        password_flag = False
        # valid username has been entered. Check password
        while not password_flag:
            password = receive_msg_func(self.client_socket)
            password_flag = check_valid_password(user.get_username(), password, user_list)
            # Account is still on timeout
            if user.check_is_locked(get_max_attempt()) == True:
                send_message = "account still locked"
                print('[send] ' + send_message)
                self.client_socket.send(send_message.encode())
                return
            # successful login
            if (password_flag):
                send_message = "valid password"
                print('[send] ' + send_message)
                self.client_socket.send(send_message.encode())
                user.successful_login(get_max_attempt(), self.client_address, self.client_socket)
                self.user = user
                active_user_list.append(user)
                # log a successful login
                print(f"#{len(active_user_list)}: {user.get_username()} has just logged in at {user.get_login_time()}")
                user_logger = logger.find_log("user_logger", "user.txt")
                user_logger.info("%d; %s; %s; %s; %s", len(active_user_list), user.get_login_time(), 
                                        user.get_username(), user.get_ip(), user.get_port())
            # FAILED LOGIN
            else:
                user.failed_attempt()
                if (user.get_is_locked() == True):
                    send_message = "account locked"
                    print('[send] ' + send_message)
                    self.client_socket.send(send_message.encode())
                    return
                else:
                    send_message = "invalid password"
                    print('[send] ' + send_message)
                    self.client_socket.send(send_message.encode())

#Initialise details for p2p connection between client and target user
def initialise_p2p_video(client_socket: socket, curr_user: User, receive_message: str, user_list: List[User]):
    split_receive_message = receive_message.split(" ")
    if len(split_receive_message) < 3:
        send_message = "Too few arguments! usage: </p2pvideo> <target user> <filename to send>"
        client_socket.send(send_message.encode())
        return
    target_username = str(split_receive_message[1])
    filename = str(split_receive_message[2])
    if (target_username == curr_user.get_username()):
        send_message = "You can't send the video to yourself! You already have the file."
        client_socket.send(send_message.encode())
        return
    if (check_valid_user(target_username, user_list)):
        target_user: User = find_user(None, target_username, user_list)
        if target_user.get_is_active():
            # Notify target user of incoming file transfer
            target_socket = target_user.get_client_socket()
            send_message = f"/p2pvideo server {curr_user.get_username()} {curr_user.get_ip()} {curr_user.get_port()} {filename}"
            target_socket.send(send_message.encode())
            # Give ip address and port num of target user to client
            send_message = f"/p2pvideo client {target_user.get_ip()} {target_user.get_port()} {filename}"
            client_socket.send(send_message.encode())
        else:
            send_message = "Target user is not currently active! P2p file transfer unsuccessful"
            client_socket.send(send_message.encode())
    else:
        send_message = "Target user is not in the database!"
        client_socket.send(send_message.encode())
        
# private msg between two parties
def private_text(client_socket, receive_message, user_list, curr_username, message_log_num):
    split_receive_message = receive_message.split(" ")
    if len(split_receive_message) < 3:
        send_message = "Too few arguments! usage: </msgto> <target user> <message>"
        client_socket.send(send_message.encode())
        return
    target_username = str(split_receive_message[1])
    if (check_valid_user(target_username, user_list)):
        target_user: User = find_user(None, target_username, user_list)
        if target_user.get_username() == curr_username:
            send_message = "Error! Can't send message to yourself"
            client_socket.send(send_message.encode())
            return
        if target_user.get_is_active():
            target_socket: socket = target_user.get_client_socket()
            trim_string = "/msgto " + target_username + " "
            private_message = receive_message[len(trim_string):]
            curr_time = datetime.now().strftime("%d %b %Y %H:%M:%S")
            # Send private message to target user
            send_message = f"/msgto{curr_time}; {curr_username}; {private_message}"
            target_socket.send(send_message.encode())
            # log the message
            send_message = f"#{message_log_num}; {curr_time}; {curr_username}; {private_message}"
            message_log = logger.find_log("messagelog", "messagelog.txt")
            message_log.info(send_message)
            # Send successfully received to client sending the msg
            send_message = "Private message has been sent"
            client_socket.send(send_message.encode())
            inc_message_log_num()
            print(f"{curr_username} message to {target_user.get_username()} '{private_message}' at {curr_time}")
        else:
            send_message = "Target user is not currently active!"
            client_socket.send(send_message.encode())
    else:
        send_message = "Target user is not in the database!"
        client_socket.send(send_message.encode())
    
# message the group
def msg_group(client_socket, receive_message, group_list, curr_username):
    split_receive_message = receive_message.split(" ")
    if len(split_receive_message) < 3:
        send_message = "Too few arguments! usage: </groupmsg> <group name> <message>"
        print(send_message)
        client_socket.send(send_message.encode())
        return
    group_name = str(split_receive_message[1])
    if check_valid_group(group_name, group_list):
        target_group = find_group(group_name, group_list)
        if (check_existing_user(curr_username, target_group.get_members())):
            trim_string = "/groupmsg " + group_name + " "
            group_message = receive_message[len(trim_string):]
            target_group.inc_message_count()
            curr_date = datetime.now().strftime("%d %b %Y %H:%M:%S")
            # print out sent chat message in server terminal
            print(f"{curr_username} issued a message in group chat {target_group.get_name()}:")
            print(f"#{target_group.get_message_count()}; {curr_date}; {group_message}")
            send_message = "Group chat message sent"
            client_socket.send(send_message.encode())
            # need to log
            group_log = logging.getLogger(group_name)
            group_log.info(f"#{target_group.get_message_count()};{curr_username};{curr_date}: {group_message}")
            # need to send to other users!
            curr_members = target_group.get_members()
            for member in curr_members:
                if (member != curr_username):
                    user: User = find_user(None, member, user_list)
                    target_client_socket = user.get_client_socket()
                    send_message = f"/groupmsg{curr_date}, {group_name}, {curr_username}: {group_message}"
                    target_client_socket.send(send_message.encode())
        else:
            print(f"{curr_username} sent a message to a group chat, but {curr_username} hasn't joined to the group.")
            send_message = f"You are not a member of group chat: {target_group.get_name()}"
            client_socket.send(send_message.encode())
    else:
        print(f"{curr_username} tried to msg a group chat that doesn't exist!")
        send_message = "Group chat does not exist!"
        client_socket.send(send_message.encode())

# join group
def join_group(client_socket, receive_message, group_list, curr_username):
    split_receive_message = receive_message.split(" ")
    if len(split_receive_message) == 1:
        send_message = "Group chat name was not provided! usage: </joingroup> <group name>"
        print(send_message)
        client_socket.send(send_message.encode())
        return
    elif len(split_receive_message) > 2:
        send_message = "Too many arguments provided! usage: </joingroup> <group name>"
        print(send_message)
        client_socket.send(send_message.encode())
        return
    
    group_name = str(split_receive_message[1])
    if (not check_valid_group(group_name, group_list)):
        print(f"{curr_username} tried to join a group chat that doesn't exist!")
        send_message = "Group chat does not exist!"
        client_socket.send(send_message.encode())
    else:
        target_group = find_group(group_name, group_list)
        if check_existing_user(curr_username, target_group.get_members()):
            print(f"{curr_username} tried to rejoin to group chat: {group_name}")
            send_message = f"You are already part of the Group!"
            client_socket.send(send_message.encode())
        else:
            target_group.add_members(curr_username)
            target_group.join_group_string()
            send_message = f"Joined the group chat: {target_group.get_name()} successfully!"
            client_socket.send(send_message.encode())
        
# create group 
def create_group(client_socket, receive_message, group_list, active_user_list, curr_username):
    split_receive_message = receive_message.split(" ")
    if len(split_receive_message) == 1:
        send_message = "New Group Chat name was not provided! usage: </creategroup> <group name> <member1> <member2>..."
        print(send_message)
        client_socket.send(send_message.encode())
        return
    elif len(split_receive_message) == 2:
        send_message = "No other group members were specified! usage: </creategroup> <group name> <member1> <member2>..."
        print(send_message)
        client_socket.send(send_message.encode())
        return
    
    # handle 2 arg cases
    group_name = str(split_receive_message[1])
    if group_name.isalnum():
        group_logger = logging.getLogger(group_name)
        if (group_logger.hasHandlers()):
            send_message = f"Command not executed! a group chat of name {group_name} already exist"
            print(send_message)
            client_socket.send(send_message.encode())
        else:
            group_member_list = []
            for i in range(2, len(split_receive_message)):
                member_name = str(split_receive_message[i])
                if (check_valid_user(member_name, active_user_list) == False):
                    send_message = f"Group chat not created. User: {member_name} is either inactive or does not exist."
                    print(send_message)
                    client_socket.send(send_message.encode())
                    return
                elif (member_name == curr_username):
                    send_message = f"Group chat not created. You should not include yourself as part of the members arguments"
                    print(send_message)
                    client_socket.send(send_message.encode())
                    return
                else:
                    group_member_list.append(member_name)
            group_logger = logger.find_log(group_name, f"{group_name}_messagelog.txt")
            new_group = Group(group_name, curr_username)
            # for member_name in group_member_list:
            #     new_group.add_members(member_name)
            # new_group.create_string()
            print(f"Join group chat room successfully, room name: {group_name}, users in this room:\n{curr_username}")
            for username in group_member_list:
                print(username)
            #notify client of new group creation
            send_message = f"Group chat created: {group_name}"
            client_socket.send(send_message.encode())
            group_list.append(new_group)
    else:
        send_message = "Group chat not created. Group name contains non-alphanumberic characters"
        print(send_message)
        client_socket.send(send_message.encode())
            
# user logout method
def process_logout(curr_username: str, user_list: List[User], active_user_list: List[User]):
    for user in user_list:
        if curr_username == user.get_username():
            user.set_is_active(False)
    # Create a copy of the active_user_list
    copy_active_user_list = active_user_list.copy()
    # Iterate over the copy and remove elements from the original list
    for user in copy_active_user_list:
        if user.get_username() == curr_username:
            active_user_list.remove(user)
            
    # Update the file log. Remove inactive user
    with open(USER_LOG_FILE, "w") as updated_file:
        for user in active_user_list:
            updated_file.write(f"{active_user_list.index(user) + 1}, {user.get_login_time()}, {user.get_username()}, {user.get_ip()}, {user.get_port()}\n")
    print(f"{curr_username} logout")

# active users
def active_user_cmd(curr_username: str, user_list: List[User]):
    send_message = ""
    for user in user_list:
        if (user.get_username() != curr_username and user.get_is_active() == True):
            user_tuple = (user.get_username(), user.get_ip(), user.get_port(), user.get_login_time())
            message = f"{user_tuple[0]}, {user_tuple[1]}, {user_tuple[2]}, active since {user_tuple[3]}\n"
            print(message, end = "")
            send_message += message
    # account for no other active users
    if send_message == "":
        send_message = "No other active users"
        print(send_message)
    return send_message
                
# return target user 
def find_user(old_user, username, user_list):
    for user in user_list:
        # print(f"{username} | {user.get_username()}")
        if user.get_username() == username:
            return user
    return old_user

# return target group
def find_group(group_name: str, group_list: List[Group]):
    for group in group_list:
        if group.get_name() == group_name:
            return group
    return None

# check for valid user. return boolean
def check_valid_user(username, user_list):
    for user in user_list:
        # print(f"{username} | {user.get_username()}")
        if user.get_username() == username:
            return True
    return False

# check for valid password for given user. return boolean
def check_valid_password(username, password, user_list):
    for user in user_list:
        # print(f"{username} | {user.get_username()} | {password} | {user.get_password()}")
        if user.get_username() == username and user.get_password() == password:
            return True
    return False

# check if Group is valid
def check_valid_group(group_name: str, group_list: List[Group]):
    for group in group_list:
        if group.get_name() == group_name:
            return True
    return False

# Check for existing user in group
def check_existing_user(username: str, group_members):
    for name in group_members:
        if name == username:
            return True
    False

# Main here 
if len(argv) != 3:
    print("Usage: python server.py <server_port> <number of attempts>")
    exit()
server_port = int(argv[1])
attempt_count = int(argv[2])

if (attempt_count < 1 or attempt_count > 5) :
    print(f"Invalid number of allowed failed consecutive attempt: {attempt_count}")
    print("Attempts allowed: 1 to 5 inclusive")
    exit()
    
# Set up socket
server_socket = socket(AF_INET, SOCK_STREAM)
server_socket.bind((HOST, server_port))

# Set up User class
try:
    with open(CREDENTIALS_FILE, 'r') as file:
        for line in file:
            username = line.split()[0]
            password = line.split()[1]
            # Instantiate a user for each username & password
            user_list.append(User(username, password, attempt_count))
except Exception as e:
    print(f"error in opening file: {str(e)}")
    
print("\n===== Server is running =====")
print("===== Waiting for connection request from clients...=====")
# Set up to handle persistent connections
while True:
    try:
        server_socket.listen()
        client_socket, client_address = server_socket.accept()
        clientThread = ClientThread(client_address, client_socket)
        clientThread.start()
    except KeyboardInterrupt:
        print(f"keyboard interrupt!")
        server_socket.close()
        break









