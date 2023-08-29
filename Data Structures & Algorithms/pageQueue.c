// Implementation of the Page ADT using an array

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include "page.h"

#define DEFAULT_SIZE 16 

struct page {
	char *curr_url;
	Item *items;
	int size;
	int capacity;
	double rank;
	struct page *next;  
};

static void increaseCapacity(Page q);

/**
 * Creates a new empty Page
 */
Page PageNew(void) {
	Page q = malloc(sizeof(*q));
	if (q == NULL) {
		fprintf(stderr, "couldn't allocate Page\n");
		exit(EXIT_FAILURE);
	}

	q->items = malloc(DEFAULT_SIZE * sizeof(Item));
	if (q->items == NULL) {
		fprintf(stderr, "couldn't allocate Page\n");
		exit(EXIT_FAILURE);
	}

	q->size = 0;
	q->rank = 0.00;
	q->capacity = DEFAULT_SIZE;
	q->next = NULL;
	return q;
}

/**
 * Frees all resources associated with the given Page
 */
void PageFree(Page q) {
	free(q->curr_url);
	for (int i = 0; i < q->size; i++)
	{
		free(q->items[i]);
	}	
	free(q->items);
	free(q);
}

/**
 * Adds an item to the end of the Page
 */
void PageEnqueue(Page q, Item it) {
	if (q->size == q->capacity) {
		increaseCapacity(q);
	}
	q->items[q->size++] = it;
}

/**
 * Doubles the capacity of the Page
 */
static void increaseCapacity(Page q) {
	q->capacity *= 2;
	q->items = realloc(q->items, q->capacity * sizeof(Item));
	if (q->items == NULL) {
		fprintf(stderr, "couldn't resize Page\n");
		exit(EXIT_FAILURE);
	}
}

/**
 * Gets the size of the given Page
 */
int PageSize(Page q) {
	return q->size;
}

// /**
//  * Removes an item from the front of the Page and returns it
//  * Assumes that the Page is not empty
//  */
// Item PageDequeue(Page q) {
// 	assert(q->size > 0);

// 	Item it = q->items[0];
// 	for (int i = 1; i < q->size; i++) {
// 		q->items[i - 1] = q->items[i];
// 	}
// 	q->size--;
// 	return it;
// }

// /**
//  * Gets the item at the front of the Page without removing it
//  * Assumes that the Page is not empty
//  */
// Item PageFront(Page q) {
// 	assert(q->size > 0);

// 	return q->items[0];
// }



// /**
//  * Returns true if the Page is empty, and false otherwise
//  */
// bool PageIsEmpty(Page q) {
// 	return q->size == 0;
// }

// /**
//  * Prints the items in the Page to the given file with items space-separated
//  */
// void PageDump(Page q, FILE *fp) {
// 	for (int i = 0; i < q->size; i++) {
// 		fprintf(fp, "%s ", q->items[i]);
// 	}
// 	fprintf(fp, "\n");
// }

// /**
//  * Prints out information for debugging
//  */
// void PagePrint(Page q) {
// 	for (int i = 0; i < q->size; i++) {
// 		printf("%s\t", q->items[i]);
// 	}
// 	printf("\n");
// }

