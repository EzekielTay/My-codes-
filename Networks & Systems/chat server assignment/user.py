from datetime import *

# create a class for Users
class User:
    def __init__(self, username, password, attempt_count):
        self.client_socket = None
        self.username = username
        self.password = password
        self.ip = None
        self.port = None
        self.is_active = False
        self.is_locked = False
        self.attempt_left = attempt_count
        self.lock_countdown = None 
        self.login_time = None

    # For each failed attempt, reduce the number of login attempts left by 1
    def failed_attempt(self):
        self.attempt_left -= 1
        if (self.attempt_left == 0) and not self.is_locked:
            self.lock_account(10)
    
    # lock user account for 10s
    def lock_account(self, countdown_seconds):
        self.is_locked = True
        self.lock_countdown = datetime.now() + timedelta(seconds=countdown_seconds)

    # unlock user account and reset number of login attempts
    def unlock_account(self, attempt_count):
        self.is_locked = False
        self.lock_countdown = None
        self.attempt_left = attempt_count
        
    # Check if account is still locked. Contains unlock account
    def check_is_locked(self, attempt_count):
        if (self.lock_countdown != None):
            if (datetime.now() > self.lock_countdown):
                self.unlock_account(attempt_count)
        return self.is_locked
    
    # User successfully login
    def successful_login(self, attempt_count, client_address, client_socket):
        self.is_active = True
        self.ip = client_address[0]
        self.port = client_address[1]
        self.client_socket = client_socket
        self.attempt_left = attempt_count
        self.login_time = datetime.now().strftime("%d %b %Y %H:%M:%S")
        
    # User logout
    def logout(self):
        self.is_active = False
        self.ip = None
        self.port = None
        
    # print out user details
    def to_string(self):
        print(self.username, end=" | ")
        print(self.password, end=" | ")
        print(self.is_active, end=" | ")
        print(self.login_time, end=" | ")
        print(self.ip, end=" | ")
        print(self.port, end=" | ")
        
    # Getter methods for attributes
    def get_client_socket(self):
        return self.client_socket
    
    def get_username(self):
        return self.username

    def get_password(self):
        return self.password

    def get_is_active(self):
        return self.is_active

    def get_is_locked(self):
        return self.is_locked

    def get_attempt_left(self):
        return self.attempt_left

    def get_lock_countdown(self):
        return self.lock_countdown
    
    def get_login_time(self):
        return self.login_time
    
    def get_ip(self):
        return self.ip
    
    def get_port(self):
        return self.port
    
    def set_is_active(self, new_is_active):
        self.is_active = new_is_active

    def set_is_locked(self, new_is_locked):
        self.is_locked = new_is_locked

    def set_attempt_left(self, new_attempt_left):
        self.attempt_left = new_attempt_left

    def set_lock_countdown(self, new_lock_countdown):
        self.lock_countdown = new_lock_countdown

    
    