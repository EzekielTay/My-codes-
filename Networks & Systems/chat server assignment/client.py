import json
import os
from socket import *
from sys import *
import threading
import time

# function for thread receive message
# special cases for /msgto and /groupmsg. There may be responses from server even without userinput
def receive_messages(client_socket, user_login):
    while user_login:
        rec_message: str = receive_msg_func(client_socket)
        # handle respose by /msgto
        if rec_message.startswith("/msgto"):
            trim_string = "/msgto"
            rec_message = rec_message[len(trim_string):]
            print(f"\n[recv] {rec_message}\nEnter one of the following commands (/msgto, /activeuser, /creategroup, /joingroup, /groupmsg, /p2pvideo, /logout):", end = "")
        # handle respose by /p2pvideo as the client
        elif rec_message.startswith("/p2pvideo client"):
            trim_string = "/p2pvideo client "
            rec_message = rec_message[len(trim_string):]
            print("Beginning file upload to target user")
            target_ip, target_port, file_to_send = rec_message.split(" ")
            target_port = int(target_port)
            p2p_send(target_ip, target_port, file_to_send)
        # handle respose by /p2pvideo as the target user
        elif rec_message.startswith("/p2pvideo server"):
            trim_string = "/p2pvideo server "
            rec_message = rec_message[len(trim_string):]
            sender_name, sender_ip, sender_port, file_to_receive = rec_message.split(" ")
            sender_port = int(sender_port)
            print(f"\nBeginning file download: {file_to_receive} from {sender_name}")
            p2p_receive(sender_name, sender_ip, sender_port, file_to_receive)
        # handle respose by /groupmsg as a target member
        elif rec_message.startswith("/groupmsg"):
            trim_string = "/groupmsg"
            rec_message = rec_message[len(trim_string):]
            print(f"\n[recv] {rec_message}\nEnter one of the following commands (/msgto, /activeuser, /creategroup, /joingroup, /groupmsg, /p2pvideo, /logout):", end = "")
        else:
            print(f"[recv] {rec_message}")

# receive message function
def receive_msg_func(client_socket):
    data = client_socket.recv(1024)
    return data.decode()
           
# initiate a login 
def initiate_login(client_socket):
    send_message = "login"
    client_socket.sendall(send_message.encode())
    message = receive_msg_func(client_socket)
    print(message)
    while (message != "valid username"):
        user_input = input("Username: ")
        if user_input != "":
            client_socket.sendall(user_input.encode())
            message = receive_msg_func(client_socket)
    while (message != "valid password"):
        user_input = input("Password: ")
        if user_input != "":
            client_socket.sendall(user_input.encode())
            message = receive_msg_func(client_socket)
            # print(f"[Recv]: {message}")
            if (message == "account locked"):
                print("Invalid Password. Your account has been blocked. Please try again later")
                return False
            elif (message == "account still locked"):
                print("Your account is blocked due to multiple login failures. Please try again later")
                return False
            elif (message == "valid password"): 
                print("Welcome to Tessenger!")
                return True
            elif (message == "invalid password"):
                print("Invalid Password. Please try again")
        else:
            print("You didn't enter anything!")

# code for p2p send file
def p2p_send(target_ip, target_port, file_to_send):
    peer_server_socket = socket(AF_INET, SOCK_DGRAM)
    peer_server_address = (target_ip, target_port)
    file_to_send = os.path.join(os.path.dirname(__file__), file_to_send)
    with open(file_to_send, "rb") as file:
        while True:
            try:
                data = file.read(1024)  
                # Reached end of file, send custom message
                if not data:
                    break
                peer_server_socket.sendto(data, peer_server_address)
            except Exception as e:
                print("Connection with server peer not established", str(e))
    peer_server_socket.close()
    print("File upload completed! Connection with peer terminated.")
    
# code fpr p2p receive
def p2p_receive(sender_name, sender_ip, sender_port, file_to_receive):
    peer_client_socket = socket(AF_INET, SOCK_DGRAM)
    sender_address = (sender_ip, sender_port)
    peer_client_socket.bind(sender_address)
    file_to_receive = f"{sender_name}_{file_to_receive}"
    file_to_receive = os.path.join(os.path.dirname(__file__), file_to_receive)
    end_flag = False
    with open(file_to_receive, "w") as file:
        while end_flag == False:
            peer_client_socket.settimeout(10)
            try:
                data, client_address = peer_client_socket.recvfrom(1024)
                print("receiving data")
                file.write(data)
            except Exception:
                print("File download completed! Connection with peer terminated.\nEnter one of the following commands (/msgto, /activeuser, /creategroup, /joingroup, /groupmsg, /p2pvideo, /logout):", end = "")
                end_flag = True
    peer_client_socket.close()
    
# Main starts here
if len(argv) != 4:
    print("Usage: python server.py <ip_address> <server_port> <client port>")
    exit()
    
ip_address = argv[1]
server_port = int(argv[2])
client_port = int(argv[3])

# Create a socket object
client_socket = socket(AF_INET, SOCK_STREAM)
client_socket.bind((ip_address, client_port))
server_address = ((ip_address, server_port))

try:
    client_socket.connect(server_address)
except Exception as e:
    print("Error:", str(e))
    
user_login = True
if(initiate_login(client_socket) == False):
    user_login = False
else:
    # Start a thread to receive messages
    receive_thread = threading.Thread(target = receive_messages, args = (client_socket, user_login, ), daemon=True)
    receive_thread.start()

# Loop here to gather User input
while user_login:
    user_input = input("Enter one of the following commands (/msgto, /activeuser, /creategroup, /joingroup, /groupmsg, /p2pvideo, /logout):")
    # check if file exists before sending p2pvideo request to server
    if user_input.startswith("/p2pvideo"):
        split_user_input = user_input.split(" ")
        if len(split_user_input) < 3:
            print ("Too few arguments! usage: </p2pvideo> <target user> <filename to send>")
            continue
        file_to_send = split_user_input[2]
        if os.path.exists(file_to_send) == False:
            print("Command not executed. Filename does not exist in current directory!")
            continue
    client_socket.sendall(user_input.encode())
    if user_input == "/logout":
        user_login = False
    time.sleep(0.01)
client_socket.close()