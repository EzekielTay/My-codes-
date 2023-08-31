# COMP3311 23T1 Assignment 2 ... Python helper functions
# add any functions to share between Python scripts
# Note: you must submit this file even if you add nothing to it

import re

def clean(s: str) -> str:
    """
    Clean user input
    remove leading and trailing whitespace
    convert to title case (first letter of each word is uppercase, the rest are lowercase)
    squish multiple whitespace characters into a single space
    """
    return re.sub(r'\s+', ' ', s.strip().title())

# Return alls tuple of a given query.
def run_query_fetchall(db, query):
    cur = db.cursor()
    cur.execute(query)
    tuple = cur.fetchall()
    return tuple

# Return one tuple of a given query.
def run_query_fetchone(db, query):
    cur = db.cursor()
    cur.execute(query)
    tuple = cur.fetchone()
    return tuple

# Format a string to be suitable as a search condition in a query.
def format_string_query_search(string):
    new_string = ""
    for letter in string:
        new_string += letter
        if letter == "'":
            new_string += "'"
    return new_string

# check if string exists in list of names
def check_valid_flag(list, string):
    for name, in list:
        if clean(name) == string:
            return True
    return False
