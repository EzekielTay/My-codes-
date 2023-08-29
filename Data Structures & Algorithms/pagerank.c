/*
Code written by Ezekiel Tay Z5378748 on 12/1/2023
This program is reads data from a given collection of pages in the files collection.txt, 
builds a graph structure using either an adjacency list or adjacency matrix from this data, 
and calculates the PageRank for every URL in the collection

Code reference:
PageQueue.c & Queue.h functions used in code but modified from ArrayQueue.c and queue.h given in the lab.
*/

#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <assert.h>
#include <string.h>
#include "page.h"
// #include "pageQueue.c"

#define MAX_URL 101
#define DEFAUL_SIZE 20

// data structures representing IntList

struct page {
	char *curr_url;
	Item *items;
	int size;
	int capacity;
	double rank;
	struct page *next;  
};

struct masternode {
	int num_urls;  // Total count of the number of urls
	struct page *head;  // pointer to head node
	struct page *tail;  // pointer to head node
};

typedef struct masternode *Masternode;

// Function declaration
Masternode NewCollection(void);
void CollectionFree(Masternode collection);
void CollectionAppend(Masternode collection, char curr_url[MAX_URL]);
bool checkValidUrl (char new_url[MAX_URL], Page curr_page);
double formulaRank (double d, int N, double new_rank);
double BaseNewRank (Masternode collection, Page curr_page, double *old_rank_array);
void storeRank (Masternode collection, int curr_iter, double *old_rank_array);
Masternode sortList (Masternode collection);
void printCollection(Masternode collection);


//Main Code
int main(int argc, char **argv) {
    assert(argc == 4);
	
    //Initialise and assign arguments
    double damp_factor = atof(argv[1]);
    assert(damp_factor > 0.00);
    assert(damp_factor < 1.00);
    double diffPR = atof(argv[2]);
    assert(diffPR > 0.00);
    int max_iter = atoi(argv[3]);
    assert(max_iter > 0);

	//Search through all url text files and store data in a Adjacency list.
	FILE *collection_begin = fopen("collection.txt", "r");
	

	//Return error if file is empty.
	if (collection_begin == NULL) {
        perror("collection.txt");
        return -1;
    }

	Masternode collection = NewCollection();
	char curr_url[MAX_URL];

	//Read to end of file and append urls to a linked list.
	while (fscanf(collection_begin, "%s", curr_url) != EOF) {
		CollectionAppend(collection, curr_url);
	}
	
	//initialise iteration & difference PageRank flags & array to store value of prev iter ranks.
	int curr_iter = 0;
	double diff = diffPR;
	double *old_rank_array = malloc(collection->num_urls * sizeof(double));

	Page curr_page = collection->head;
	int count = 0;

	//Store initial rank values to array and the array of old ranks.
	while (curr_page != NULL)
	{
		double rank = 1.00 / collection->num_urls;
		curr_page->rank = rank;
		old_rank_array[count] = curr_page->rank;
		curr_page = curr_page->next;	
		count += 1;
	}
	
	count = 0;
	// Initialising pageRank for iteration 0.
	while (curr_iter < max_iter && diff >= diffPR)
	{
		
		curr_page = collection->head;
		diff = 0.00;
		
		while (curr_page != NULL)
		{
			double old_rank = curr_page->rank;
			double new_rank = 0.00;

			//If url has not outgoing links, keep its previous iteration rank.
			if (curr_page->size == 0) {
				new_rank = curr_page->rank;
			}
			new_rank += BaseNewRank(collection, curr_page, old_rank_array);
			new_rank = formulaRank(damp_factor, collection->num_urls, new_rank);
			curr_page->rank = new_rank;
			diff += fabs(old_rank - new_rank);
			curr_page = curr_page->next;
		}
		
		storeRank(collection, curr_iter, old_rank_array);
		curr_iter += 1;
	}
	//Sort the list in order of rank
	Masternode sorted_list = sortList(collection);
	if (sorted_list->num_urls > 0)
	{
		printCollection(sorted_list);
	}
	fclose(collection_begin);
	free (old_rank_array);
	CollectionFree(sorted_list);
	free(collection);
    return 0;
}

/**
 * Creates a new empty list
 */
Masternode NewCollection(void) {
	Masternode collection = malloc(sizeof(*collection));
	if (collection == NULL) {
		fprintf(stderr, "couldn't allocate Page\n");
		exit(EXIT_FAILURE);
	}
	collection->head = NULL;
	collection->tail = NULL;
	collection->num_urls = 0;
	return collection;
}

/**
 * Frees all resources associated with the given list
 */
void CollectionFree(Masternode collection) {
	Page curr = collection->head;
	while (curr != NULL) {
		Page temp = curr;
		curr = curr->next;
		PageFree(temp);
	}
	free(collection);
}

/**
 * Creates and adds a page to the end of the list
 */
void CollectionAppend(Masternode collection, char intput_url[MAX_URL]) {
	// +4 to accomodate ".txt"
	char *filename = malloc(MAX_URL + 4);
	strcpy(filename, intput_url);
	strcat(filename, ".txt");
	char temp_str[MAX_URL];

	FILE *file = fopen(filename, "r");
	//Read Url from a File until EOF or #end
	if (file == NULL) {
        perror(filename);
        return;
    }

	//Create a new page
	Page new_page = PageNew();
	char *curr_url = malloc(MAX_URL);
	new_page->curr_url = strcpy(curr_url, intput_url);

	while (fscanf(file, "%s", temp_str) != EOF) {
		if (strcmp(temp_str, "#end") == 0) {
			break;
		}
		if (checkValidUrl(temp_str, new_page) == true) {
			char *outgoing_url = malloc(MAX_URL);
			strcpy(outgoing_url, temp_str); 
			PageEnqueue(new_page, outgoing_url);
		}
	}
	// if the list is empty, the first node is linked to the head and tail node.
	if (collection->num_urls == 0) {
		collection->head = new_page;
	}
	// The node is added to the tail only.
	else {
		Page tail = collection->tail;
		tail->next = new_page;
	}
	collection->tail = new_page;
	collection->num_urls += 1;

	fclose(file);
	free(filename);
}


/**
 * Check for duplicate link or itself.
 */
bool checkValidUrl (char new_url[MAX_URL], Page curr_page) {
	//Ignore the initialisation 
	if (strcmp(new_url, "#start") == 0 || strcmp(new_url, "Section-1") == 0 )
	{
		return false;
	}
	// check if the url is itself
	if (strcmp(new_url, curr_page->curr_url) == 0)
	{
		return false;
	}
	// Check for duplicate url already appended to array previously
	for (int i = 0; i < curr_page->size; i++)
	{	
		if (strcmp(new_url, curr_page->items[i]) == 0)
		{
			return false;
		}
	}
	return true;
} 

/**
 * calculate new pagerank
 */
double formulaRank (double d, int N, double new_rank) {
	double value = (1.00 - d) / N + (d * new_rank);
	return value;
}

/**
 * calculate the base page rank of a page. 
 * Sum of the each pageRank url directed to the target divided by the number of outgoing urls
 */
double BaseNewRank (Masternode collection, Page curr_page, double *old_rank_array) {
	double new_rank = 0.00;
	Page search_page = collection->head;
	int count = 0;
	while (search_page != NULL)
	{
		// skip searching itself.
		if (search_page != curr_page)
		{
			for (int i = 0; i < search_page->size; i++)
			{
				if (strcmp(search_page->items[i], curr_page->curr_url) == 0)
				{
					new_rank += old_rank_array[count] / search_page->size;
					break;
				}
			}
		}
		count += 1;
		search_page = search_page->next;
	}
	return new_rank;
}

/**
 * Store current rank values to an array to be used for rank calculation in the next iter.
 */
void storeRank (Masternode collection, int curr_iter, double *old_rank_array) {
	Page curr_page = collection->head;
	int count = 0;
	while (curr_page != NULL)
	{
		old_rank_array[count] = curr_page->rank;
		curr_page = curr_page->next;	
		count += 1;
	}
}

/**
 * Create a new Sorted linked list
 */
Masternode sortList (Masternode collection) {
	Masternode sorted_list = NewCollection();
	Page curr_page = collection->head;
	while (curr_page != NULL)
	{
		Page next_page = curr_page->next;
		//collection empty. Add Page to head and tail.
		if (sorted_list->num_urls == 0)
		{
			curr_page->next = NULL;
			sorted_list->head = curr_page;
			sorted_list->tail = curr_page;
		}

		// insert page to head.
		else if (curr_page->rank >= sorted_list->head->rank)
		{
			curr_page->next = sorted_list->head;
			sorted_list->head = curr_page;
		}

		//insert Page to tail
		else if (curr_page->rank < sorted_list->tail->rank)
		{
			sorted_list->tail->next = curr_page;
			sorted_list->tail = curr_page;
			sorted_list->tail->next = NULL;
		}

		// insert in between
		else {
			Page target_page = sorted_list->head;
			while (target_page->next->rank > curr_page->rank)
			{
				target_page = target_page->next;
			}
			curr_page->next = target_page->next;
			target_page->next = curr_page;			
		}
		
		sorted_list->num_urls += 1;
		curr_page = next_page;
	}
	return sorted_list;
}

/**
 * Print out information about pages in a collection
 */
void printCollection(Masternode collection) {
	Page curr_page = collection->head;
	FILE *output_file = fopen("pagerankList.txt", "w");
	while (curr_page != collection->tail->next)
	{
		fprintf(output_file, "%s, ", curr_page->curr_url);
		fprintf(output_file, "%d, ", curr_page->size);
		fprintf(output_file, "%.7lf\n", curr_page->rank);
		curr_page = curr_page->next;
	}
	fclose(output_file);
}

