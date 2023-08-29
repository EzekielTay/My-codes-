#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define MAX_URL 101
#define MAX_WORD 1001
#define MAX_PAGERANK 10
#define MAX_DISPLAY 30
#define UNIT 1

typedef struct page *Page;
typedef struct masternode *Masternode;

struct page {
    char *curr_url;
    int match_words;
    double rank;
    struct page *next;  
};

struct masternode {
    int count;
    Page head;
    Page tail;
};

Page newPage();
Masternode newCollection ();
void populateCollection(Masternode collection);
void freeCollection (Masternode collection);
bool searchForWord(FILE *filestream, char search_word[MAX_WORD]);
void storeUrltoFile (char search_word[MAX_WORD], int array_size);
void insertPage(Masternode collection, char temp_url[MAX_URL]);
void insertPagerank (Masternode collection);
Masternode sortList (Masternode collection);
void printCollection(Masternode collection);
double comparePages (Page one, Page two);

int main(int argc, char **argv) {
    int array_size = argc - 1;
    char *word_array[array_size];
    Masternode collection = newCollection();

    // Store search terms in an array.
    for (int i = 0; i < array_size; i++)
    {
        word_array[i] = argv[i + 1];
    
    }

    // Search for the urls in invertedindex.txt
    for (int i = 0; i < array_size; i++)
    {
        char search_word[MAX_WORD];
        strcpy(search_word, word_array[i]);
        storeUrltoFile(search_word, array_size);
        populateCollection(collection);        
    }

    insertPagerank(collection);
    Masternode sorted_collection = sortList(collection);
    printCollection(sorted_collection);
    freeCollection(sorted_collection);
    free(collection);
    return 0;
}

/**
 * Creates a new empty Page
 */
Page newPage() {
    Page q = malloc(sizeof(*q));
    if (q == NULL) {
        fprintf(stderr, "couldn't allocate Page\n");
        exit(EXIT_FAILURE);
    }
    q->rank = 0.00;
    q->match_words = 0;
    q->next = NULL;
    return q;
}

/**
 * Creates a new empty collection
 */
Masternode newCollection () {
    Masternode collection = malloc(sizeof(*collection));
    if (collection == NULL) {
        fprintf(stderr, "couldn't allocate collection\n");
        exit(EXIT_FAILURE);
    }
    collection->count = 0;
    collection->head = NULL;
    collection->tail = NULL;
    return collection;
}

/**
 * populate the linked list collection with pages of urls
 */
void populateCollection(Masternode collection) {
    char temp_url[MAX_WORD];
    FILE *filestream = fopen("tempfile.txt", "r");
    while (fscanf(filestream, "%s", temp_url) != EOF) {
        insertPage(collection, temp_url);
    }
    fclose(filestream);
}

/**
 * free collection
 */
void freeCollection (Masternode collection) {
    if (collection->head != NULL)
    {
        Page curr_page = collection->head;
        while (curr_page != NULL)
        {
            Page temp = curr_page;
            curr_page = curr_page->next;
            free(temp->curr_url);
            free(temp);
        }
    }
    free(collection);    
}

/**
 * write urls that contain a search term to a temporary file
 */
void storeUrltoFile (char search_word[MAX_WORD], int array_size) {
    FILE *filestream = fopen("invertedIndex.txt", "r");
    //return error if file is empty.
    if (filestream == NULL) {
        perror("invertedIndex.txt");
        return;
    }
    
    bool word_exist_flag = searchForWord(filestream, search_word);
    char url_list[array_size * MAX_URL];

    //reads the desired line and store it as a string
    fgets(url_list, array_size * MAX_URL, filestream);
    fclose(filestream);

    FILE *outstream = fopen("tempfile.txt", "w");
    // if the search word exists, append the list of urls to a temp file.
    if (word_exist_flag == true)
    {
        fwrite(url_list, UNIT, strlen(url_list), outstream);
    }
    // else overwrite the file with a newline
    else 
    {
        fwrite("\n", UNIT, UNIT, outstream);
    }
    fclose(outstream);
}

/**
 * Search file and stop when word is found.
 * Return true if word is present in the file
 * else return false
 */
bool searchForWord(FILE *filestream, char search_word[MAX_WORD]) {
    char temp_str[MAX_WORD];
    //read file till word is found
    while (fscanf(filestream, "%s", temp_str) != EOF) {
        if (strcmp(temp_str, search_word) == 0)
        {
            return true;
        }
    }
    return false;
}

/**
 * insert page to collection or increase number of match term for existing page
 */
void insertPage(Masternode collection, char temp_url[MAX_URL]) {
    Page new_page = newPage();
    char *curr_url = malloc(MAX_URL);
    strcpy(curr_url, temp_url);
    new_page->curr_url = curr_url;
    new_page->match_words = 1;

    //collection is empty
    if (collection->head == NULL) {
        collection->head = new_page;
    }
    else
    {
        Page curr_page = collection->head;
        while (curr_page != NULL)
        {
            // url is already in collection. Increase the count of matching search terms
            if (strcmp(curr_page->curr_url, temp_url) == 0)
            {
                curr_page->match_words += 1;
                free(curr_url);
                free(new_page);
                return;
            }
            curr_page = curr_page->next;
        }
        // append the page to tail of collection
        collection->tail->next = new_page;
    }
    collection->tail = new_page;
    collection->count += 1;
}

/**
 * Insert the pagerank value to the different pages of a collection
 */
void insertPagerank (Masternode collection) {
    Page curr_page = collection->head;
    while (curr_page != NULL)
    {
        char search_url[MAX_URL + 1];
        strcpy(search_url, curr_page->curr_url);
        strcat(search_url, ",");

        FILE *filestream = fopen("pagerankList.txt", "r");
        if (searchForWord(filestream, search_url) == true) {
            char pagerank_str[MAX_URL];
            //skip to the url's pagerank
            fgets(pagerank_str, 4, filestream);
            //Read the page rank and store to pagerank_str
            fgets(pagerank_str, MAX_PAGERANK, filestream);
            curr_page->rank = atof(pagerank_str);
        }
        fclose(filestream);
        curr_page = curr_page->next;
    }
}

/**
 * Sort collection in order.
 */
Masternode sortList (Masternode collection) {
    Masternode sorted_list = newCollection();
    Page curr_page = collection->head;
    while (curr_page != NULL)
    {
        Page next_page = curr_page->next;
        //collection empty. Add Page to head and tail.
        if (sorted_list->count == 0)
        {
            curr_page->next = NULL;
            sorted_list->head = curr_page;
            sorted_list->tail = curr_page;
        }

        // insert page to head.
        else if (comparePages(curr_page, sorted_list->head) > 0.00)
        {
            curr_page->next = sorted_list->head;
            sorted_list->head = curr_page;
        }

        //insert Page to tail
        else if (comparePages(curr_page, sorted_list->tail) < 0.00)
        {
            sorted_list->tail->next = curr_page;
            sorted_list->tail = curr_page;
            sorted_list->tail->next = NULL;
        }

        // insert in between
        else {
            Page target_page = sorted_list->head;
            while (comparePages(curr_page, target_page->next) < 0.00)
            {
                target_page = target_page->next;
            }
            curr_page->next = target_page->next;
            target_page->next = curr_page;          
        }
        
        sorted_list->count += 1;
        curr_page = next_page;
    }
    return sorted_list;
}

/**
 * compare two pages for sorting
 * return positive if Page one has a higher ranking than page two
 * return negative if otherwise
 */
double comparePages (Page one, Page two) {
    if (one->match_words == two->match_words)
    {
        return one->rank - two->rank;
    }
    return one->match_words - two->match_words;
}

/**
 * Print collection
 */
void printCollection(Masternode collection) {
    Page curr_page = collection->head;
    int count = 0;
    while (curr_page != NULL && count < MAX_DISPLAY)
    {
        printf("%s\n", curr_page->curr_url);
        curr_page = curr_page->next;
        count += 1;
    }
}