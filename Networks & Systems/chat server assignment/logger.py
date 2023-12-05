import logging

# Find target logger
def find_log(logger_name, file_name):
    logger = logging.getLogger(logger_name)
    if logger.hasHandlers() == False:
        handler = logging.FileHandler(file_name)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger